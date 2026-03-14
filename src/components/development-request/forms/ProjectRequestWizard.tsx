import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { DevelopmentProjectContent } from '../../../data/development-request';

interface ProjectRequestWizardProps {
  content: DevelopmentProjectContent;
}

interface WizardFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  projectType: string;
  projectLevel: string;
  pageRange: string;
  designLevel: string;
  features: string[];
  integrations: string[];
  hosting: string;
  branding: string;
  contentPlan: string;
  budget: string;
  timeline: string;
  uploadedFiles: string[];
  references: string;
  projectDescription: string;
  specialRequirements: string;
}

type WizardErrors = Partial<Record<keyof WizardFormData, string>>;
type StepDirection = 'forward' | 'backward';

const STORAGE_KEY = 'cystems-project-request-v1';
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const DEFAULT_FORM_DATA: WizardFormData = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  projectType: '',
  projectLevel: '',
  pageRange: '',
  designLevel: '',
  features: [],
  integrations: [],
  hosting: '',
  branding: '',
  contentPlan: '',
  budget: '',
  timeline: '',
  uploadedFiles: [],
  references: '',
  projectDescription: '',
  specialRequirements: '',
};

const PROJECT_BASE_COSTS: Record<string, number> = {
  'Landing Page': 600,
  'Pagina Web Corporativa': 950,
  'Tienda Online (E-commerce)': 1650,
  'Aplicacion Web': 2200,
  'Sistema Empresarial': 2800,
  'Plataforma SaaS': 3600,
  Otro: 1200,
};

const PROJECT_LEVEL_COSTS: Record<string, number> = {
  Startup: 0,
  Empresa: 240,
  Corporativo: 680,
  Gobierno: 940,
};

const PAGE_RANGE_COSTS: Record<string, number> = {
  '1 pagina (Landing)': 0,
  '3 - 5 paginas': 180,
  '5 - 10 paginas': 420,
  '10 - 20 paginas': 920,
  'Mas de 20 paginas': 1650,
  'No estoy seguro': 250,
};

const DESIGN_LEVEL_COSTS: Record<string, number> = {
  'Diseno basico': 0,
  'Diseno moderno personalizado': 360,
  'Diseno premium con animaciones': 860,
  'No estoy seguro': 240,
};

const FEATURE_COSTS: Record<string, number> = {
  'Formulario de contacto': 60,
  Blog: 180,
  'Panel de administracion': 420,
  'Login de usuarios': 240,
  'Pagos en linea': 360,
  'Sistema de reservas': 420,
  'Sistema de clientes': 380,
  'Dashboard de datos': 520,
  'Integracion API': 260,
  'Chat en vivo': 120,
  Multilenguaje: 210,
  'SEO avanzado': 180,
  'Optimizacion de velocidad': 160,
};

const INTEGRATION_COSTS: Record<string, number> = {
  'WhatsApp Business': 90,
  'Stripe / PayPal': 180,
  'Google Analytics': 80,
  CRM: 210,
  'Automatizacion de correos': 160,
  'API externa': 240,
  'ERP / sistema empresarial': 420,
};

const HOSTING_COSTS: Record<string, number> = {
  'Ya tengo hosting': 0,
  'Necesito hosting': 140,
  'Necesito hosting + dominio': 220,
  'No estoy seguro': 120,
};

const BRANDING_COSTS: Record<string, number> = {
  'Ya tengo logo y branding': 0,
  'Tengo logo pero necesito mejorar diseno': 280,
  'Necesito branding completo': 780,
};

const CONTENT_COSTS: Record<string, number> = {
  'Yo proporcionare todo el contenido': 0,
  'Necesito ayuda con textos': 160,
  'Necesito redaccion profesional': 340,
  'Necesito imagenes o ilustraciones': 420,
};

const TIMELINE_COSTS: Record<string, number> = {
  'Urgente (1-2 semanas)': 460,
  '1 mes': 220,
  '2-3 meses': 80,
  Flexible: 0,
};

const normalizeSelectionList = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const formatMoney = (value: number) => CURRENCY_FORMATTER.format(Math.round(value / 10) * 10);

const formatSavedTime = (date: Date) =>
  new Intl.DateTimeFormat('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

const getCost = (map: Record<string, number>, value: string) => map[value] ?? 0;

const calculateEstimate = (formData: WizardFormData) => {
  const breakdown = [
    { label: 'Base del proyecto', amount: getCost(PROJECT_BASE_COSTS, formData.projectType) },
    { label: 'Nivel y contexto del proyecto', amount: getCost(PROJECT_LEVEL_COSTS, formData.projectLevel) },
    { label: 'Alcance de paginas', amount: getCost(PAGE_RANGE_COSTS, formData.pageRange) },
    { label: 'Direccion visual', amount: getCost(DESIGN_LEVEL_COSTS, formData.designLevel) },
    {
      label: 'Funcionalidades',
      amount: formData.features.reduce((total, feature) => total + getCost(FEATURE_COSTS, feature), 0),
    },
    {
      label: 'Integraciones',
      amount: formData.integrations.reduce((total, integration) => total + getCost(INTEGRATION_COSTS, integration), 0),
    },
    { label: 'Infraestructura', amount: getCost(HOSTING_COSTS, formData.hosting) },
    { label: 'Identidad visual', amount: getCost(BRANDING_COSTS, formData.branding) },
    { label: 'Contenido y soporte editorial', amount: getCost(CONTENT_COSTS, formData.contentPlan) },
    { label: 'Urgencia de entrega', amount: getCost(TIMELINE_COSTS, formData.timeline) },
  ].filter((item) => item.amount > 0);

  return {
    total: breakdown.reduce((sum, item) => sum + item.amount, 0),
    breakdown,
  };
};

const validateStep = (step: number, formData: WizardFormData) => {
  const errors: WizardErrors = {};

  if (step === 1) {
    if (!formData.fullName.trim()) errors.fullName = 'Completa tu nombre.';
    if (!formData.email.trim()) errors.email = 'Necesitamos un correo para responder.';
    if (!formData.phone.trim()) errors.phone = 'Dejanos un telefono o WhatsApp.';
    if (!formData.country.trim()) errors.country = 'Indica tu pais.';
  }

  if (step === 2) {
    if (!formData.projectType) errors.projectType = 'Selecciona el tipo de proyecto.';
    if (!formData.projectLevel) errors.projectLevel = 'Selecciona el nivel del proyecto.';
  }

  if (step === 3) {
    if (!formData.pageRange) errors.pageRange = 'Selecciona el alcance del sitio.';
    if (!formData.designLevel) errors.designLevel = 'Selecciona una direccion visual.';
  }

  if (step === 6 && !formData.hosting) errors.hosting = 'Selecciona el escenario de hosting.';
  if (step === 7 && !formData.branding) errors.branding = 'Selecciona el estado de tu identidad visual.';
  if (step === 8 && !formData.contentPlan) errors.contentPlan = 'Selecciona como manejaremos el contenido.';
  if (step === 9 && !formData.budget) errors.budget = 'Selecciona un presupuesto aproximado.';
  if (step === 10 && !formData.timeline) errors.timeline = 'Selecciona el tiempo esperado.';
  if (step === 13 && !formData.projectDescription.trim()) {
    errors.projectDescription = 'Describe el objetivo, la idea general y lo que necesita el proyecto.';
  }

  return errors;
};

const findFirstInvalidStep = (formData: WizardFormData) => {
  for (let step = 1; step <= 14; step += 1) {
    if (Object.keys(validateStep(step, formData)).length > 0) return step;
  }

  return null;
};

const buildProjectMailto = (email: string, formData: WizardFormData, estimate: ReturnType<typeof calculateEstimate>) => {
  const subject = `Solicitud de proyecto - ${formData.projectType || 'Nuevo proyecto'}`;
  const body = [
    'Hola equipo CYSTEMS,',
    '',
    'Comparto una solicitud completa de proyecto:',
    '',
    `Nombre completo: ${formData.fullName}`,
    `Empresa / proyecto: ${formData.company || 'No especificado'}`,
    `Correo electronico: ${formData.email}`,
    `WhatsApp / Telefono: ${formData.phone}`,
    `Pais: ${formData.country}`,
    '',
    `Tipo de proyecto: ${formData.projectType || 'No especificado'}`,
    `Nivel del proyecto: ${formData.projectLevel || 'No especificado'}`,
    `Numero de paginas: ${formData.pageRange || 'No especificado'}`,
    `Diseno: ${formData.designLevel || 'No especificado'}`,
    '',
    `Funcionalidades: ${formData.features.length ? formData.features.join(', ') : 'Sin funcionalidades extra seleccionadas'}`,
    `Integraciones: ${formData.integrations.length ? formData.integrations.join(', ') : 'Sin integraciones extra seleccionadas'}`,
    `Hosting: ${formData.hosting || 'No especificado'}`,
    `Identidad visual: ${formData.branding || 'No especificado'}`,
    `Contenido: ${formData.contentPlan || 'No especificado'}`,
    `Presupuesto: ${formData.budget || 'No especificado'}`,
    `Tiempo de entrega: ${formData.timeline || 'No especificado'}`,
    `Archivos listados: ${formData.uploadedFiles.length ? formData.uploadedFiles.join(', ') : 'Sin archivos listados'}`,
    '',
    `Referencias: ${formData.references || 'Sin referencias'}`,
    '',
    'Descripcion del proyecto:',
    formData.projectDescription,
    '',
    'Requerimientos especiales:',
    formData.specialRequirements || 'Sin requerimientos especiales',
    '',
    `Estimado automatico: ${formatMoney(estimate.total)}`,
  ].join('\n');

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export default function ProjectRequestWizard({ content }: ProjectRequestWizardProps) {
  const totalSteps = content.stepTitles.length;
  const [formData, setFormData] = useState<WizardFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<WizardErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [direction, setDirection] = useState<StepDirection>('forward');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const estimate = calculateEstimate(formData);
  const progress = Math.round((currentStep / totalSteps) * 100);

  const updateField = <Field extends keyof WizardFormData>(field: Field, value: WizardFormData[Field]) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toggleSelection = (field: 'features' | 'integrations', value: string) => {
    setFormData((current) => {
      const collection = current[field];
      const nextCollection = collection.includes(value)
        ? collection.filter((item) => item !== value)
        : [...collection, value];

      return {
        ...current,
        [field]: nextCollection,
      };
    });
  };

  const fieldClass = (field: keyof WizardFormData) => `development-input${errors[field] ? ' is-invalid' : ''}`;
  const textareaClass = (field: keyof WizardFormData) => `development-textarea${errors[field] ? ' is-invalid' : ''}`;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          currentStep?: number;
          furthestStep?: number;
          formData?: Partial<WizardFormData>;
        };

        const restoredFormData = parsed.formData ?? {};
        setFormData({
          ...DEFAULT_FORM_DATA,
          ...restoredFormData,
          features: normalizeSelectionList(restoredFormData.features),
          integrations: normalizeSelectionList(restoredFormData.integrations),
          uploadedFiles: normalizeSelectionList(restoredFormData.uploadedFiles),
        });

        const restoredStep = Math.min(Math.max(parsed.currentStep ?? 1, 1), totalSteps);
        const restoredFurthestStep = Math.min(Math.max(parsed.furthestStep ?? restoredStep, 1), totalSteps);
        setCurrentStep(restoredStep);
        setFurthestStep(restoredFurthestStep);
        setRestoredFromStorage(true);
        setSavedAt(formatSavedTime(new Date()));
      }
    } catch (error) {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, [totalSteps]);

  useEffect(() => {
    if (!hydrated || submitted) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep,
        furthestStep,
        formData,
      })
    );
    setSavedAt(formatSavedTime(new Date()));
  }, [currentStep, furthestStep, formData, hydrated, submitted]);

  const goToStep = (step: number) => {
    if (step === currentStep || step > furthestStep) return;
    setDirection(step > currentStep ? 'forward' : 'backward');
    setCurrentStep(step);
  };

  const goToNextStep = () => {
    const nextErrors = validateStep(currentStep, formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const nextStep = Math.min(currentStep + 1, totalSteps);
    setDirection('forward');
    setCurrentStep(nextStep);
    setFurthestStep((current) => Math.max(current, nextStep));
  };

  const goToPreviousStep = () => {
    if (currentStep === 1) return;
    setDirection('backward');
    setCurrentStep((current) => Math.max(current - 1, 1));
  };

  const handleFileSelection = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    updateField(
      'uploadedFiles',
      Array.from(event.currentTarget.files ?? []).map((file) => file.name)
    );
  };

  const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();

    const firstInvalidStep = findFirstInvalidStep(formData);
    if (firstInvalidStep) {
      setErrors(validateStep(firstInvalidStep, formData));
      setDirection(firstInvalidStep > currentStep ? 'forward' : 'backward');
      setCurrentStep(firstInvalidStep);
      setFurthestStep((current) => Math.max(current, firstInvalidStep));
      return;
    }

    window.location.href = buildProjectMailto(content.contactEmail, formData, estimate);
    window.localStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
  };

  const resetWizard = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
    setCurrentStep(1);
    setFurthestStep(1);
    setDirection('forward');
    setSubmitted(false);
    setRestoredFromStorage(false);
    setSavedAt(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const renderFieldError = (field: keyof WizardFormData) =>
    errors[field] ? <span class="development-field-error">{errors[field]}</span> : null;

  const renderCheckboxOptions = (field: 'features' | 'integrations', options: string[]) => (
    <div class="development-checkbox-grid">
      {options.map((option) => {
        const isChecked = formData[field].includes(option);

        return (
          <label class={`development-checkbox-card${isChecked ? ' is-checked' : ''}`}>
            <input type="checkbox" checked={isChecked} onChange={() => toggleSelection(field, option)} />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div class="development-step-grid development-step-grid--two">
            <label class="development-field">
              <span>Nombre completo</span>
              <input
                class={fieldClass('fullName')}
                type="text"
                value={formData.fullName}
                autoComplete="name"
                onInput={(event) => updateField('fullName', event.currentTarget.value)}
              />
              {renderFieldError('fullName')}
            </label>
            <label class="development-field">
              <span>Empresa / proyecto (opcional)</span>
              <input
                class="development-input"
                type="text"
                value={formData.company}
                autoComplete="organization"
                onInput={(event) => updateField('company', event.currentTarget.value)}
              />
            </label>
            <label class="development-field">
              <span>Correo electronico</span>
              <input
                class={fieldClass('email')}
                type="email"
                value={formData.email}
                autoComplete="email"
                onInput={(event) => updateField('email', event.currentTarget.value)}
              />
              {renderFieldError('email')}
            </label>
            <label class="development-field">
              <span>WhatsApp / Telefono</span>
              <input
                class={fieldClass('phone')}
                type="text"
                value={formData.phone}
                autoComplete="tel"
                onInput={(event) => updateField('phone', event.currentTarget.value)}
              />
              {renderFieldError('phone')}
            </label>
            <label class="development-field development-field--full">
              <span>Pais</span>
              <input
                class={fieldClass('country')}
                type="text"
                value={formData.country}
                autoComplete="country-name"
                onInput={(event) => updateField('country', event.currentTarget.value)}
              />
              {renderFieldError('country')}
            </label>
          </div>
        );

      case 2:
        return (
          <div class="development-step-grid development-step-grid--two">
            <label class="development-field">
              <span>Tipo de proyecto</span>
              <select
                class={fieldClass('projectType')}
                value={formData.projectType}
                onChange={(event) => updateField('projectType', event.currentTarget.value)}
              >
                <option value="">Selecciona una opcion</option>
                {content.projectTypeOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('projectType')}
            </label>
            <label class="development-field">
              <span>Nivel del proyecto</span>
              <select
                class={fieldClass('projectLevel')}
                value={formData.projectLevel}
                onChange={(event) => updateField('projectLevel', event.currentTarget.value)}
              >
                <option value="">Selecciona una opcion</option>
                {content.projectLevelOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('projectLevel')}
            </label>
          </div>
        );

      case 3:
        return (
          <div class="development-step-grid development-step-grid--two">
            <label class="development-field">
              <span>Numero de paginas</span>
              <select
                class={fieldClass('pageRange')}
                value={formData.pageRange}
                onChange={(event) => updateField('pageRange', event.currentTarget.value)}
              >
                <option value="">Selecciona una opcion</option>
                {content.pageOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('pageRange')}
            </label>
            <label class="development-field">
              <span>Diseno</span>
              <select
                class={fieldClass('designLevel')}
                value={formData.designLevel}
                onChange={(event) => updateField('designLevel', event.currentTarget.value)}
              >
                <option value="">Selecciona una opcion</option>
                {content.designOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('designLevel')}
            </label>
          </div>
        );

      case 4:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Selecciona las funcionalidades que ya sabes que necesitas</span>
              {renderCheckboxOptions('features', content.featureOptions)}
            </label>
          </div>
        );

      case 5:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Selecciona las integraciones relevantes</span>
              {renderCheckboxOptions('integrations', content.integrationOptions)}
            </label>
          </div>
        );

      case 6:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Hosting</span>
              <select class={fieldClass('hosting')} value={formData.hosting} onChange={(event) => updateField('hosting', event.currentTarget.value)}>
                <option value="">Selecciona una opcion</option>
                {content.hostingOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('hosting')}
            </label>
          </div>
        );

      case 7:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Identidad visual</span>
              <select class={fieldClass('branding')} value={formData.branding} onChange={(event) => updateField('branding', event.currentTarget.value)}>
                <option value="">Selecciona una opcion</option>
                {content.brandingOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('branding')}
            </label>
          </div>
        );

      case 8:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Contenido</span>
              <select
                class={fieldClass('contentPlan')}
                value={formData.contentPlan}
                onChange={(event) => updateField('contentPlan', event.currentTarget.value)}
              >
                <option value="">Selecciona una opcion</option>
                {content.contentOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('contentPlan')}
            </label>
          </div>
        );

      case 9:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Presupuesto estimado</span>
              <select class={fieldClass('budget')} value={formData.budget} onChange={(event) => updateField('budget', event.currentTarget.value)}>
                <option value="">Selecciona una opcion</option>
                {content.budgetOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('budget')}
            </label>
          </div>
        );

      case 10:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Tiempo de entrega</span>
              <select class={fieldClass('timeline')} value={formData.timeline} onChange={(event) => updateField('timeline', event.currentTarget.value)}>
                <option value="">Selecciona una opcion</option>
                {content.timelineOptions.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
              {renderFieldError('timeline')}
            </label>
          </div>
        );

      case 11:
        return (
          <div class="development-step-grid">
            <div class="development-upload-hints">
              {content.uploadHints.map((item) => (
                <span class="development-support-chip">{item}</span>
              ))}
            </div>
            <label class="development-field">
              <span>Archivos</span>
              <input class="development-input development-input--file" type="file" multiple onChange={handleFileSelection} />
            </label>
            <div class="development-upload-list">
              {formData.uploadedFiles.length ? (
                formData.uploadedFiles.map((fileName) => <span class="development-upload-item">{fileName}</span>)
              ) : (
                <p class="development-footer-note">Puedes listar logo, PDFs, wireframes o referencias visuales.</p>
              )}
            </div>
          </div>
        );

      case 12:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Ejemplos de paginas que te gusten</span>
              <input
                class="development-input"
                type="text"
                value={formData.references}
                placeholder="Ejemplo: vercel.com, linear.app, una referencia de tu sector..."
                onInput={(event) => updateField('references', event.currentTarget.value)}
              />
            </label>
          </div>
        );

      case 13:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Descripcion del proyecto</span>
              <textarea
                class={textareaClass('projectDescription')}
                rows={8}
                value={formData.projectDescription}
                placeholder="Explica el objetivo del proyecto, la idea general y las funcionalidades necesarias."
                onInput={(event) => updateField('projectDescription', event.currentTarget.value)}
              />
              {renderFieldError('projectDescription')}
            </label>
          </div>
        );

      case 14:
        return (
          <div class="development-step-grid">
            <label class="development-field">
              <span>Requerimientos especiales</span>
              <textarea
                class="development-textarea"
                rows={6}
                value={formData.specialRequirements}
                placeholder="IA, automatizacion, integraciones, sistemas internos, escalabilidad, seguridad..."
                onInput={(event) => updateField('specialRequirements', event.currentTarget.value)}
              />
            </label>
          </div>
        );

      case 15:
        return (
          <div class="development-step-grid">
            <div class="development-estimate-card">
              <div class="development-estimate-header">
                <div>
                  <p class="development-paper-kicker">Estimado automatico</p>
                  <h3 class="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-brand-text">
                    TOTAL ESTIMADO: {formatMoney(estimate.total)}
                  </h3>
                </div>
                <span class="development-estimate-pill">Wizard listo para enviar</span>
              </div>
              <div class="development-estimate-breakdown">
                {estimate.breakdown.length ? (
                  estimate.breakdown.map((item) => (
                    <div class="development-estimate-row">
                      <span>{item.label}</span>
                      <strong>{formatMoney(item.amount)}</strong>
                    </div>
                  ))
                ) : (
                  <p class="development-footer-note">Selecciona mas datos del proyecto para obtener un estimado mas util.</p>
                )}
              </div>
              <p class="development-footer-note">{content.estimateNote}</p>
              <p class="development-inline-status">{content.finalNote}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div class="development-wizard-shell">
        <div class="development-success-card">
          <p class="development-paper-kicker">Solicitud lista</p>
          <h2 class="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-brand-text">
            Preparamos tu correo con el brief del proyecto
          </h2>
          <p class="text-sm leading-7 text-slate-600 dark:text-brand-muted">
            Si tu cliente de correo no se abrio automaticamente, escribe a {content.contactEmail} y te apoyamos por esa via.
          </p>
          <div class="development-success-actions">
            <button class="development-secondary-link development-secondary-link--button" type="button" onClick={resetWizard}>
              Crear otra solicitud
            </button>
            <a class="development-primary-link" href={`mailto:${content.contactEmail}`}>
              <span>Escribir a contacto</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form class="development-wizard-shell" onSubmit={handleSubmit} noValidate>
      <div class="development-wizard-topbar">
        <div>
          <p class="development-paper-kicker">
            Paso {currentStep} de {totalSteps}
          </p>
          <h2 class="development-form-title">{content.stepTitles[currentStep - 1]}</h2>
        </div>
        <div class="development-wizard-meta">
          <span class="development-estimate-pill">Estimado vivo {formatMoney(estimate.total)}</span>
          {savedAt && <span class="development-save-pill">Guardado automatico: {savedAt}</span>}
        </div>
      </div>

      <div class="development-progress-track" aria-hidden="true">
        <span class="development-progress-fill" style={{ width: `${progress}%` }}></span>
      </div>

      {restoredFromStorage && (
        <p class="development-inline-status">
          Recuperamos tu progreso guardado. Puedes seguir desde donde lo dejaste.
        </p>
      )}

      <div class="development-step-nav" role="tablist" aria-label="Pasos del formulario">
        {content.stepTitles.map((stepTitle, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUnlocked = stepNumber <= furthestStep;

          return (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`development-step-panel-${stepNumber}`}
              class={`development-step-chip${isActive ? ' is-active' : ''}${isCompleted ? ' is-completed' : ''}`}
              disabled={!isUnlocked}
              onClick={() => goToStep(stepNumber)}
            >
              <span>{stepNumber}</span>
              <small>{stepTitle}</small>
            </button>
          );
        })}
      </div>

      <section
        id={`development-step-panel-${currentStep}`}
        key={`${currentStep}-${direction}`}
        class={`development-step-panel is-${direction}`}
      >
        {renderStepContent()}
      </section>

      <div class="development-wizard-actions">
        <button
          class="development-secondary-link development-secondary-link--button"
          type="button"
          disabled={currentStep === 1}
          onClick={goToPreviousStep}
        >
          Volver
        </button>

        {currentStep < totalSteps ? (
          <button class="development-primary-link development-primary-link--button" type="button" onClick={goToNextStep}>
            <span>Continuar</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button class="development-primary-link development-primary-link--button" type="submit">
            <span>Enviar solicitud de proyecto</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </form>
  );
}
