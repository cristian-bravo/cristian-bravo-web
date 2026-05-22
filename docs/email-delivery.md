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
EMAIL_TO=
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

Si `EMAIL_TO` está vacío, el destinatario cae en `EMAIL_USER`.

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
- resolver el proveedor SMTP
- generar HTML y texto plano
- adjuntar archivos del formulario de proyectos
- devolver mensajes de error más claros para fallos de autenticación o configuración

## Notas operativas

- No expongas credenciales de correo mediante variables `PUBLIC_`.
- Las contraseñas de Gmail se normalizan para eliminar espacios accidentales.
- Algunos tenants de Outlook bloquean SMTP si `Authenticated SMTP` está deshabilitado.
- Ambos endpoints están protegidos por rate limiting server-side.

## Checklist de despliegue

1. Confirma que `EMAIL_USER` y `EMAIL_PASS` sean válidos en producción.
2. Define `EMAIL_TO` si el correo debe llegar a una bandeja distinta.
3. Verifica límites de adjuntos si el formulario largo está aceptando archivos.
4. Prueba manualmente `/api/send-contact` y `/api/send-project` después del deploy.
