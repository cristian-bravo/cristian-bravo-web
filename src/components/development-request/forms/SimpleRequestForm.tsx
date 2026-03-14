import type { JSX } from 'preact';
import { useState } from 'preact/hooks';

interface SimpleRequestFormProps {
  consultationOptions: string[];
  submitLabel: string;
  footerNote: string;
  contactEmail: string;
}

interface SimpleRequestFormData {
  name: string;
  email: string;
  company: string;
  consultationType: string;
  message: string;
}

type SimpleRequestErrors = Partial<Record<keyof SimpleRequestFormData, string>>;

const INITIAL_FORM_DATA: SimpleRequestFormData = {
  name: '',
  email: '',
  company: '',
  consultationType: 'Consulta general',
  message: '',
};

const buildSimpleRequestMailto = (email: string, data: SimpleRequestFormData) => {
  const subject = `Solicitud simple - ${data.consultationType}`;
  const body = [
    'Hola equipo CYSTEMS,',
    '',
    'Quiero iniciar una conversacion sobre el siguiente requerimiento:',
    '',
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
    `Empresa: ${data.company || 'No especificada'}`,
    `Tipo de consulta: ${data.consultationType}`,
    '',
    'Mensaje:',
    data.message,
  ].join('\n');

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export default function SimpleRequestForm({
  consultationOptions,
  submitLabel,
  footerNote,
  contactEmail,
}: SimpleRequestFormProps) {
  const [formData, setFormData] = useState<SimpleRequestFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<SimpleRequestErrors>({});
  const [draftOpened, setDraftOpened] = useState(false);

  const updateField = <Field extends keyof SimpleRequestFormData>(field: Field, value: SimpleRequestFormData[Field]) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    if (draftOpened) {
      setDraftOpened(false);
    }
  };

  const validate = () => {
    const nextErrors: SimpleRequestErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Necesitamos tu nombre.';
    if (!formData.email.trim()) nextErrors.email = 'Necesitamos un correo de contacto.';
    if (!formData.consultationType.trim()) nextErrors.consultationType = 'Selecciona un tipo de consulta.';
    if (!formData.message.trim()) nextErrors.message = 'Cuentanos brevemente que necesitas.';

    return nextErrors;
  };

  const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    window.location.href = buildSimpleRequestMailto(contactEmail, formData);
    setDraftOpened(true);
  };

  const fieldClass = (field: keyof SimpleRequestFormData) =>
    `development-input${errors[field] ? ' is-invalid' : ''}`;
  const textareaClass = (field: keyof SimpleRequestFormData) =>
    `development-textarea${errors[field] ? ' is-invalid' : ''}`;

  return (
    <form class="development-form-card development-form-card--simple" onSubmit={handleSubmit} noValidate>
      <div class="development-form-card-head">
        <div>
          <p class="development-paper-kicker">Formulario simple</p>
          <h2 class="development-form-title">Cuestiones rapidas, respuesta rapida</h2>
        </div>
        <p class="development-form-copy">Completa lo esencial y abriremos tu cliente de correo con el mensaje listo.</p>
      </div>

      <div class="development-form-grid">
        <label class="development-field">
          <span>Nombre</span>
          <input
            class={fieldClass('name')}
            type="text"
            name="name"
            value={formData.name}
            autoComplete="name"
            onInput={(event) => updateField('name', event.currentTarget.value)}
          />
          {errors.name && <span class="development-field-error">{errors.name}</span>}
        </label>

        <label class="development-field">
          <span>Email</span>
          <input
            class={fieldClass('email')}
            type="email"
            name="email"
            value={formData.email}
            autoComplete="email"
            onInput={(event) => updateField('email', event.currentTarget.value)}
          />
          {errors.email && <span class="development-field-error">{errors.email}</span>}
        </label>

        <label class="development-field">
          <span>Empresa (opcional)</span>
          <input
            class="development-input"
            type="text"
            name="company"
            value={formData.company}
            autoComplete="organization"
            onInput={(event) => updateField('company', event.currentTarget.value)}
          />
        </label>

        <label class="development-field">
          <span>Tipo de consulta</span>
          <select
            class={fieldClass('consultationType')}
            name="consultationType"
            value={formData.consultationType}
            onChange={(event) => updateField('consultationType', event.currentTarget.value)}
          >
            {consultationOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
          {errors.consultationType && <span class="development-field-error">{errors.consultationType}</span>}
        </label>

        <label class="development-field development-field--full">
          <span>Mensaje</span>
          <textarea
            class={textareaClass('message')}
            name="message"
            rows={6}
            value={formData.message}
            onInput={(event) => updateField('message', event.currentTarget.value)}
          />
          {errors.message && <span class="development-field-error">{errors.message}</span>}
        </label>
      </div>

      <div class="development-form-footer">
        <button class="development-primary-link development-primary-link--button" type="submit">
          <span>{submitLabel}</span>
          <span aria-hidden="true">→</span>
        </button>

        <p class="development-footer-note">{footerNote}</p>

        {draftOpened && (
          <p class="development-inline-status">
            Se preparo el mensaje en tu cliente de correo. Si no se abre, escribe a {contactEmail}.
          </p>
        )}
      </div>
    </form>
  );
}
