# Email Delivery

This project no longer uses EmailJS. All form delivery is handled server-side through Nodemailer.

## Runtime

- Astro output mode: `server`
- Adapter: `@astrojs/node`
- Expected deployment target: a persistent Node process

## Environment Variables

The current server mail layer reads the following private variables:

```env
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_smtp_password_or_app_password
EMAIL_TO=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
```

Reference source:

- `.env.example`
- `src/server/email/sendEmail.ts`

## Provider Resolution

SMTP settings are resolved as follows:

- If `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE` are provided, those values are used.
- If `EMAIL_USER` is a Gmail address, the fallback host is `smtp.gmail.com:587`.
- Otherwise the fallback host is `smtp.office365.com:587`.

If `EMAIL_TO` is empty, delivery falls back to `EMAIL_USER`.

## Active Endpoints

### Simple contact flow

- Route: `POST /api/send-contact`
- File: `src/pages/api/send-contact.ts`
- Payload: JSON
- Delivery function: `sendSimpleEmail()`

### Project request flow

- Route: `POST /api/send-project`
- File: `src/pages/api/send-project.ts`
- Payload: `FormData`
- Delivery function: `sendProjectEmail()`
- Supports one validated attachment through `src/lib/projectAttachment.ts`

## Shared Mail Layer

All outgoing email passes through:

- `src/server/email/sendEmail.ts`

That file is responsible for:

- transporter creation and caching
- SMTP provider resolution
- HTML and plain-text message generation
- attachment support for project submissions
- end-user friendly SMTP error messages

## Operational Notes

- Never expose mail credentials through `PUBLIC_` variables.
- Gmail passwords are normalized to remove accidental spaces.
- Outlook tenants may reject SMTP if authenticated SMTP is disabled for the account.
- Both endpoints are protected by server-side rate limiting.

## Deployment Checklist

1. Confirm `EMAIL_USER` and `EMAIL_PASS` are valid in production.
2. Set `EMAIL_TO` if delivery should go to a shared inbox.
3. Verify attachment limits if the project form is accepting files.
4. Test both `/api/send-contact` and `/api/send-project` after deploy.
