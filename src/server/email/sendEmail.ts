import type { Transporter } from 'nodemailer';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SMTP_CONFIG_ERROR = 'SMTP_NOT_CONFIGURED';
const INVALID_MAIL_DATA_ERROR = 'INVALID_MAIL_DATA';
const TEST_TRANSPORT_ENV = 'EMAIL_TEST_TRANSPORT';
const EMAIL_ADDRESS_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNSAFE_HEADER_CHARACTERS = /[\r\n\u0000-\u001f\u007f]/;

interface SimpleEmailData {
  from_name: string;
  reply_to: string;
  message: string;
  consultationType: string;
  contact: string;
}

interface ProjectEmailData {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  projectType: string;
  projectLevel: string;
  pageRange: string;
  designLevel: string;
  scope: string;
  features: string;
  integrations: string;
  hosting: string;
  branding: string;
  contentPlan: string;
  timeline: string;
  references: string;
  uploadedFiles: string;
  brief: string;
  specialRequirements: string;
  attachment?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  };
}

let transporter: Transporter | null = null;
let runtimeEnvLoaded = false;

const isGmailUser = (user: string) => /@(gmail|googlemail)\.com$/i.test(user.trim());

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (typeof value !== 'string' || !value.trim()) return fallback;

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
};

const parseEnvValue = (value: string) => {
  const trimmed = value.trim();
  const quote = trimmed[0];

  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const loadRuntimeEnvFiles = () => {
  if (runtimeEnvLoaded) return;
  runtimeEnvLoaded = true;

  const externalEnvKeys = new Set(Object.keys(process.env));
  const envFiles = [join(process.cwd(), '.env'), join(process.cwd(), '.env.local')];

  envFiles.forEach((envFile) => {
    if (!existsSync(envFile)) return;

    readFileSync(envFile, 'utf8')
      .split(/\r?\n/)
      .forEach((line) => {
        const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (!match || externalEnvKeys.has(match[1])) return;

        process.env[match[1]] = parseEnvValue(match[2]);
      });
  });
};

const getRuntimeEnv = (key: string) => {
  loadRuntimeEnvFiles();
  const value = process.env[key];
  return typeof value === 'string' ? value : undefined;
};

const getTrimmedEnv = (key: string) => {
  const value = getRuntimeEnv(key);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
};

const isSafeEmailAddress = (value: string) =>
  !UNSAFE_HEADER_CHARACTERS.test(value) && value.length <= 254 && EMAIL_ADDRESS_PATTERN.test(value);

const isSafeSmtpHost = (value: string) =>
  value.length <= 253 && /^[a-z0-9.-]+$/i.test(value) && !value.startsWith('.') && !value.endsWith('.') && !value.includes('..');

const getSmtpSettings = (user: string) => {
  const host = getTrimmedEnv('SMTP_HOST') ?? (isGmailUser(user) ? 'smtp.gmail.com' : 'smtp.office365.com');
  const rawPort = getTrimmedEnv('SMTP_PORT');
  const parsedPort = rawPort ? Number(rawPort) : 587;
  const hasValidPort = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65_535;
  const port = hasValidPort ? parsedPort : 587;
  const secure = parseBoolean(getTrimmedEnv('SMTP_SECURE'), port === 465);

  if (!isSafeSmtpHost(host) || !hasValidPort || secure === null) {
    throw new Error(SMTP_CONFIG_ERROR);
  }

  return {
    host,
    port,
    secure,
  };
};

const getSmtpCredentials = () => {
  const user = getTrimmedEnv('EMAIL_USER') ?? '';
  const rawPass = getRuntimeEnv('EMAIL_PASS') ?? '';

  if (!user || !rawPass || !isSafeEmailAddress(user)) {
    throw new Error(SMTP_CONFIG_ERROR);
  }

  const pass = isGmailUser(user) ? rawPass.replace(/\s+/g, '') : rawPass;

  return { user, pass };
};

const getRecipientEmail = () => {
  const recipient = getTrimmedEnv('EMAIL_TO') || getTrimmedEnv('EMAIL_USER') || '';

  if (!isSafeEmailAddress(recipient)) {
    throw new Error(SMTP_CONFIG_ERROR);
  }

  return recipient;
};

/**
 * A memory-only transport is available exclusively to automated tests. It is
 * deliberately rejected outside NODE_ENV=test so a deploy cannot silently
 * discard client messages because of a stray environment variable.
 */
const shouldUseTestTransport = () => {
  const mode = getRuntimeEnv(TEST_TRANSPORT_ENV);
  if (!mode) return false;

  if (process.env.NODE_ENV !== 'test' || mode !== 'stream') {
    throw new Error(SMTP_CONFIG_ERROR);
  }

  return true;
};

const getTransporter = async () => {
  if (transporter) return transporter;

  const { default: nodemailer } = await import('nodemailer');

  if (shouldUseTestTransport()) {
    transporter = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
      newline: 'unix',
    });
    return transporter;
  }

  const { user, pass } = getSmtpCredentials();
  const { host, port, secure } = getSmtpSettings(user);

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    disableFileAccess: true,
    disableUrlAccess: true,
    maxRecipients: 1,
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 20000,
    auth: {
      user,
      pass,
    },
    tls: {
      servername: host,
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  });

  return transporter;
};

const getSafeReplyTo = (value: string) => {
  if (!isSafeEmailAddress(value)) {
    throw new Error(INVALID_MAIL_DATA_ERROR);
  }

  return value;
};

const getSafeAttachmentName = (value: string) => {
  const safeName = value.trim().replace(/[\r\n\u0000-\u001f\u007f\\/:*?"<>|]/g, '_').slice(0, 120);
  return safeName || 'adjunto';
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatHtmlText = (value: string) => escapeHtml(value || '').replace(/\r?\n/g, '<br>');

const buildSimpleEmailHtml = (data: SimpleEmailData, recipientEmail: string) => `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#0b1020;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0;padding:0;background:#0b1020;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:32px;background:#111827;background-image:linear-gradient(135deg,#111827 0%,#1f2937 45%,#7c3aed 100%);">
                <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#ddd6fe;margin-bottom:10px;">
                  CYSTEMS
                </div>
                <div style="font-family:Arial,sans-serif;font-size:28px;line-height:36px;font-weight:700;color:#ffffff;margin:0 0 8px 0;">
                  Nueva consulta simple
                </div>
                <div style="font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#ede9fe;margin:0;">
                  Se ha recibido un nuevo mensaje desde el formulario rápido.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 24px 8px 24px;">
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#7c3aed;margin-bottom:14px;">
                  Datos de contacto
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;width:160px;">Nombre</td>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:15px;color:#111827;font-weight:600;">${escapeHtml(data.from_name)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Email</td>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:15px;color:#111827;font-weight:600;">${escapeHtml(data.reply_to)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Contacto</td>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.contact)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Tipo de consulta</td>
                    <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.consultationType)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px 24px 24px;">
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#7c3aed;margin-bottom:14px;">
                  Mensaje
                </div>
                <div style="padding:18px 20px;background:#faf5ff;border:1px solid #e9d5ff;border-radius:16px;font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#4c1d95;white-space:pre-line;">
                  ${formatHtmlText(data.message)}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px;border-top:1px solid #e5e7eb;background:#f8fafc;">
                <div style="font-family:Arial,sans-serif;font-size:13px;line-height:22px;color:#64748b;">
                  Este correo fue enviado desde el formulario rápido de CYSTEMS.<br>
                  Se envió a <strong style="color:#111827;">${escapeHtml(recipientEmail)}</strong> y puedes responder directamente a <strong style="color:#111827;">${escapeHtml(data.reply_to)}</strong>.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const buildProjectEmailHtml = (data: ProjectEmailData, recipientEmail: string) => `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#0b1020;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0;padding:0;background:#0b1020;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:32px;background:#111827;background-image:linear-gradient(135deg,#111827 0%,#1f2937 45%,#3b82f6 100%);">
                <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#cbd5e1;margin-bottom:10px;">
                  CYSTEMS
                </div>
                <div style="font-family:Arial,sans-serif;font-size:28px;line-height:36px;font-weight:700;color:#ffffff;margin:0 0 8px 0;">
                  Nuevo proyecto solicitado
                </div>
                <div style="font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#dbeafe;margin:0;">
                  Se ha recibido una nueva solicitud desde el formulario web.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 24px 8px 24px;">
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6366f1;margin-bottom:14px;">
                  Datos de contacto
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;width:160px;">Nombre</td>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:15px;color:#111827;font-weight:600;">${escapeHtml(data.fullName)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Email</td>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:15px;color:#111827;font-weight:600;">${escapeHtml(data.email)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Empresa</td>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.company)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Teléfono</td>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.phone)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">País</td>
                    <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.country)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px 8px 24px;">
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6366f1;margin-bottom:14px;">
                  Alcance del proyecto
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding:14px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;width:160px;">Tipo</td>
                          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;font-weight:600;">${escapeHtml(data.projectType)}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Nivel</td>
                          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.projectLevel)}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Páginas</td>
                          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.pageRange)}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Diseño</td>
                          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.designLevel)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px 8px 24px;">
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6366f1;margin-bottom:14px;">
                  Descripción
                </div>
                <div style="padding:18px 20px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#1e3a8a;white-space:pre-line;">
                  ${formatHtmlText(data.brief)}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px 8px 24px;">
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6366f1;margin-bottom:14px;">
                  Stack y logística
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="padding:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
                      <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:6px;">Stack</div>
                      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#111827;">${escapeHtml(data.features)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
                      <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:6px;">Integraciones</div>
                      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#111827;">${escapeHtml(data.integrations)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;width:160px;">Hosting</td>
                          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.hosting)}</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Branding</td>
                          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.branding)}</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Contenido</td>
                          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.contentPlan)}</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;">Timeline</td>
                          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:15px;color:#111827;">${escapeHtml(data.timeline)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px 8px 24px;">
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6366f1;margin-bottom:14px;">
                  Referencias adicionales
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="padding:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
                      <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:6px;">Referencias</div>
                      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#111827;">${escapeHtml(data.references)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
                      <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:6px;">Archivos</div>
                      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#111827;">${escapeHtml(data.uploadedFiles)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;">
                      <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#c2410c;margin-bottom:6px;">Requerimientos especiales</div>
                      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#7c2d12;">${formatHtmlText(data.specialRequirements)}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px;border-top:1px solid #e5e7eb;background:#f8fafc;">
                <div style="font-family:Arial,sans-serif;font-size:13px;line-height:22px;color:#64748b;">
                  Este correo fue enviado desde el formulario web de CYSTEMS.<br>
                  Se envió a <strong style="color:#111827;">${escapeHtml(recipientEmail)}</strong> y puedes responder directamente a <strong style="color:#111827;">${escapeHtml(data.email)}</strong>.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const isSmtpConfigError = (error: unknown) => error instanceof Error && error.message === SMTP_CONFIG_ERROR;

export const getSmtpErrorMessage = (error: unknown, lang: 'es' | 'en' = 'es') => {
  const isEnglish = lang === 'en';

  if (isSmtpConfigError(error)) {
    return isEnglish ? 'The email service is not configured yet.' : 'El servicio de correo no esta configurado todavia.';
  }

  return isEnglish
    ? 'We could not send your message from the server. Please try again.'
    : 'No pudimos enviar el correo desde el servidor. Intenta nuevamente.';
};

/** Opens and authenticates an SMTP connection without delivering a message. */
export const verifySmtpTransport = async () => (await getTransporter()).verify();

export async function sendSimpleEmail(data: SimpleEmailData) {
  const { user } = getSmtpCredentials();
  const recipientEmail = getRecipientEmail();

  return (await getTransporter()).sendMail({
    from: `"CYSTEMS Formularios" <${user}>`,
    to: recipientEmail,
    replyTo: getSafeReplyTo(data.reply_to),
    subject: 'Nueva consulta desde CYSTEMS',
    html: buildSimpleEmailHtml(data, recipientEmail),
    text: [
      'Nuevo mensaje de contacto',
      '',
      `Razon social: ${data.from_name}`,
      `Email: ${data.reply_to}`,
      `Contacto: ${data.contact}`,
      `Tipo de consulta: ${data.consultationType}`,
      '',
      'Mensaje:',
      data.message,
    ].join('\n'),
  });
}

export async function sendProjectEmail(data: ProjectEmailData) {
  const { user } = getSmtpCredentials();
  const recipientEmail = getRecipientEmail();

  return (await getTransporter()).sendMail({
    from: `"CYSTEMS Formularios" <${user}>`,
    to: recipientEmail,
    replyTo: getSafeReplyTo(data.email),
    subject: 'Nueva solicitud de proyecto desde CYSTEMS',
    html: buildProjectEmailHtml(data, recipientEmail),
    attachments: data.attachment
      ? [
          {
            filename: getSafeAttachmentName(data.attachment.filename),
            content: data.attachment.content,
            contentType: data.attachment.contentType,
          },
        ]
      : undefined,
    text: [
      'Nueva solicitud de proyecto',
      '',
      `Nombre: ${data.fullName}`,
      `Email: ${data.email}`,
      `Empresa / proyecto: ${data.company}`,
      `WhatsApp / Telefono: ${data.phone}`,
      `Pais: ${data.country}`,
      '',
      'Tipo de proyecto:',
      data.projectType,
      '',
      'Nivel:',
      data.projectLevel,
      '',
      'Paginas:',
      data.pageRange,
      '',
      'Diseno:',
      data.designLevel,
      '',
      'Alcance:',
      data.scope,
      '',
      'Funcionalidades:',
      data.features,
      '',
      'Integraciones:',
      data.integrations,
      '',
      `Hosting: ${data.hosting}`,
      `Identidad visual: ${data.branding}`,
      `Contenido: ${data.contentPlan}`,
      `Tiempo de entrega: ${data.timeline}`,
      '',
      `Referencias: ${data.references}`,
      `Archivos listados: ${data.uploadedFiles}`,
      data.attachment ? `Archivo adjunto: ${data.attachment.filename}` : 'Archivo adjunto: Ninguno',
      '',
      'Descripcion:',
      data.brief,
      '',
      'Notas:',
      data.specialRequirements,
    ].join('\n'),
  });
}
