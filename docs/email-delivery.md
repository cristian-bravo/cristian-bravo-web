# Entrega de correos

Este proyecto ya no usa EmailJS. Todo el envío de formularios se realiza desde servidor mediante Nodemailer.

## Runtime

- Modo de salida de Astro: `server`
- Adapter: `@astrojs/node`
- Despliegue esperado: proceso Node persistente

## Variables de entorno

La capa actual de correo usa estas variables privadas:

```env
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_smtp_password_or_app_password
EMAIL_TO=recipient@example.com
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
```

Fuentes de referencia:

- `.env.example`
- `src/server/email/sendEmail.ts`

## Resolución del proveedor SMTP

La configuración SMTP se resuelve así:

- Si existen `SMTP_HOST`, `SMTP_PORT` y `SMTP_SECURE`, se usan esos valores.
- Si `EMAIL_USER` pertenece a Gmail, el fallback es `smtp.gmail.com:587`.
- En cualquier otro caso, el fallback es `smtp.office365.com:587`.
- Las variables SMTP vacías se ignoran para evitar que paneles de servidor envíen `SMTP_HOST=""` o `SMTP_PORT=""` y rompan el transporte.

`EMAIL_TO` debe apuntar a la bandeja que recibe las solicitudes. Si se omite, el destinatario cae en `EMAIL_USER`; no hay destinatario hardcodeado como fallback.

## Endpoints activos

### Flujo simple de contacto

- Ruta: `POST /api/send-contact`
- Archivo: `src/pages/api/send-contact.ts`
- Payload: JSON
- Función de envío: `sendSimpleEmail()`

### Flujo de solicitud de proyecto

- Ruta: `POST /api/send-project`
- Archivo: `src/pages/api/send-project.ts`
- Payload: `FormData`
- Función de envío: `sendProjectEmail()`
- Soporta un adjunto validado mediante `src/lib/projectAttachment.ts`

## Capa compartida de correo

Todo el correo saliente pasa por:

- `src/server/email/sendEmail.ts`

Ese archivo se encarga de:

- crear y reutilizar el transporter
- leer variables privadas desde `process.env` en runtime para evitar incrustar secretos en `dist`
- cargar únicamente `.env` / `.env.local` en el directorio de trabajo como fallback runtime; las variables inyectadas por el proceso tienen prioridad
- resolver el proveedor SMTP
- generar HTML y texto plano
- adjuntar archivos del formulario de proyectos
- devolver errores genéricos al cliente, sin revelar host SMTP, proveedor, autenticación ni detalles de red

## Notas operativas

- No expongas credenciales de correo mediante variables `PUBLIC_`.
- Las contraseñas de Gmail se normalizan para eliminar espacios accidentales.
- Algunos tenants de Outlook bloquean SMTP si `Authenticated SMTP` está deshabilitado.
- El transporte valida host, puerto, destinatario y `replyTo`; usa TLS 1.2+, validación de certificado, `requireTLS` para SMTP no implícito, timeouts y bloquea acceso de Nodemailer a rutas/URLs locales.
- El remitente y el asunto son fijos. Los datos de formulario nunca se usan como encabezados SMTP.

## Controles de los endpoints

- Ambos endpoints exigen mismo origen. Define `ALLOWED_ORIGINS` en producción con una lista separada por comas de orígenes HTTPS autorizados; los valores por defecto son `https://cystems.ec` y `https://www.cystems.ec`.
- `POST /api/send-contact` exige exactamente `application/json`, un objeto con llaves conocidas y un cuerpo de hasta 24 KiB. Rechaza arrays, `null`, tipos inesperados, caracteres de control/CRLF, campos excesivos y opciones no reconocidas.
- El teléfono del formulario rápido admite formato internacional legible (`+`, espacios, paréntesis, punto o guión), hasta 32 caracteres y entre 7 y 15 dígitos.
- `POST /api/send-project` exige `multipart/form-data`, lista cerrada de campos, un máximo de 48 entradas y un cuerpo real de hasta 10 MiB más 256 KiB de metadatos. El límite se aplica aun si `Content-Length` falta o es falso.
- Los adjuntos aceptados son `.pdf`, `.docx`, `.xlsx`, `.odt` y `.ods`; se rechazan `.doc`/`.xls` heredados, nombres con rutas, controles o bidi, archivos sobre 10 MiB, bytes que no correspondan al formato y contenedores con marcadores de macros conocidos. El MIME enviado se determina en el servidor, no desde el navegador.
- El rate limit local permite 10 solicitudes por IP en una hora, expone `Retry-After`/`RateLimit-*` en 429 y mantiene el mapa acotado a 5.000 clientes. Al llenarse, rechaza IPs nuevas en vez de expulsar entradas activas.
- Por defecto se usa únicamente la IP del socket: se ignoran todos los headers de proxy, incluidos `CF-Connecting-IP`, `X-Forwarded-For` y `X-Real-IP`. Para Cloudflare configura `TRUST_PROXY=cloudflare` y acepta tráfico de origen sólo desde sus rangos oficiales. Para otro proxy, define `TRUSTED_PROXY_CIDRS` con CIDRs concretos y asegúrate de que ese proxy reemplace, no reenvíe, `CF-Connecting-IP` del cliente.

## Verificación segura

En modo SMTP real, `verifySmtpTransport()` abre y autentica la conexión sin llamar a `sendMail()`. Debe invocarse solamente desde una tarea interna autenticada o una sesión operativa del servidor; no se expone como endpoint HTTP.

Las pruebas automatizadas usan `EMAIL_TEST_TRANSPORT=stream` junto con `NODE_ENV=test`. Ese transporte conserva el MIME en memoria y nunca abre una conexión SMTP; la aplicación rechaza esa variable fuera de pruebas para evitar que un despliegue descarte mensajes silenciosamente.

Resultado de verificación real: se realizó una única solicitud técnica con contenido sintético, marcada `[QA CYSTEMS] Verificación técnica`, al destinatario ya configurado por el servidor. El proveedor SMTP la aceptó y generó un `messageId`; no se expusieron credenciales, destinatario ni identificador. La aceptación SMTP confirma la entrega al proveedor, no la llegada final a la bandeja de entrada.

Ejecuta tras los cambios:

```powershell
npm run build
node --test tests/email-fixture.test.mjs
node --test tests/email-endpoint-fixture.test.mjs
node --test tests/rate-limit-proxy.test.mjs
npx playwright test e2e/security.spec.ts --project=chromium --output=test-results-security
```

## Límites de infraestructura

El rate limit en memoria es una defensa local, no un contador distribuido. En producción se requiere un WAF/rate limit de Cloudflare o un almacén compartido (por ejemplo Redis) si hay más de una instancia. `CF-Connecting-IP` sólo se considera después de validar la IP del socket del proxy; no basta con que el cliente envíe el header. La comprobación de adjuntos es de plausibilidad, no antivirus: conserva un escáner antimalware en el proxy o flujo de correo antes de abrir archivos.

## Checklist de despliegue

1. Confirma que `EMAIL_USER` y `EMAIL_PASS` sean válidos en producción.
2. Define `EMAIL_TO` si el correo debe llegar a una bandeja distinta.
3. Verifica límites de adjuntos si el formulario largo está aceptando archivos.
4. Prueba manualmente `/api/send-contact` y `/api/send-project` después del deploy.
