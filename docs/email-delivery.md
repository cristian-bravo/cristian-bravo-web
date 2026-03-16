# Email Delivery

El sitio ya no usa EmailJS.

## Runtime

- Astro corre en modo `server`
- Adapter: `@astrojs/node`
- Despliegue esperado: proceso Node en Contabo

## Variables privadas

```env
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_smtp_password_or_app_password
EMAIL_TO=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
```

## Flujo actual

- Formulario simple -> `POST /api/send-contact`
- Formulario de proyecto -> `POST /api/send-project`
- Ambos endpoints usan `src/server/email/sendEmail.ts`
- El envio sale por SMTP server-side con autodeteccion basica:
  - Gmail -> `smtp.gmail.com:587`
  - fallback actual -> `smtp.office365.com:587`
- Si quieres otro proveedor, usa `SMTP_HOST`, `SMTP_PORT` y `SMTP_SECURE`
- El destinatario usa `EMAIL_TO` si existe; si no, cae en `EMAIL_USER`

## Notas

- No uses variables `PUBLIC_` para correo.
- Las credenciales SMTP no deben exponerse al frontend.
- Para Gmail, usa App Password si la cuenta tiene verificacion en dos pasos.
