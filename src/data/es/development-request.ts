import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../../types/content';

export interface DevelopmentRequestCardContent {
  kicker: string;
  title: string;
  description: string;
  detail: string;
  bullets: string[];
  action: LinkActionContent;
  rotation: string;
}

export interface DevelopmentRequestApiContent {
  invalidBody: string;
  methodNotAllowed: string;
  rateLimitError: string;
}

export interface DevelopmentRequestLandingContent {
  header: SectionHeaderContent;
  cards: DevelopmentRequestCardContent[];
  supportKicker: string;
  supportTitle: string;
  supportDescription: string;
  supportChips: string[];
}

export interface DevelopmentSimpleFormFieldsContent {
  name: string;
  email: string;
  company: string;
  consultationType: string;
  message: string;
}

export interface DevelopmentSimpleValidationContent {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  companyInvalid: string;
  consultationTypeRequired: string;
  messageRequired: string;
  submitError: string;
}

export interface DevelopmentSimpleFormContent {
  cardKicker: string;
  cardTitle: string;
  cardDescription: string;
  pendingStatus: string;
  sendingLabel: string;
  successKicker: string;
  successTitle: string;
  successDescription: string;
  resetLabel: string;
  directEmailLabel: string;
  fields: DevelopmentSimpleFormFieldsContent;
  validation: DevelopmentSimpleValidationContent;
}

export interface DevelopmentSimpleContent {
  header: SectionHeaderContent;
  supportKicker: string;
  supportTitle: string;
  supportDescription: string;
  supportItems: string[];
  consultationOptions: string[];
  submitLabel: string;
  footerNote: string;
  emailLabel: string;
  emailValue: string;
  returnAction: LinkActionContent;
  form: DevelopmentSimpleFormContent;
}

export interface DevelopmentProjectFieldContent {
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface DevelopmentProjectSelectFieldContent extends DevelopmentProjectFieldContent {
  placeholder: string;
}

export interface DevelopmentProjectContactStepContent {
  fields: {
    fullName: DevelopmentProjectFieldContent;
    email: DevelopmentProjectFieldContent;
    company: DevelopmentProjectFieldContent;
    phone: DevelopmentProjectFieldContent;
    country: DevelopmentProjectFieldContent;
    projectDescription: DevelopmentProjectFieldContent;
  };
}

export interface DevelopmentProjectScopeStepContent {
  fields: {
    projectType: DevelopmentProjectSelectFieldContent;
    projectLevel: DevelopmentProjectSelectFieldContent;
    pageRange: DevelopmentProjectSelectFieldContent;
    designLevel: DevelopmentProjectSelectFieldContent;
  };
}

export interface DevelopmentProjectReviewStepContent {
  featureTitle: string;
  featureDescription: string;
  integrationTitle: string;
  integrationDescription: string;
  logisticsTitle: string;
  logisticsDescription: string;
  fields: {
    hosting: DevelopmentProjectSelectFieldContent;
    branding: DevelopmentProjectSelectFieldContent;
    contentPlan: DevelopmentProjectSelectFieldContent;
    timeline: DevelopmentProjectSelectFieldContent;
    references: DevelopmentProjectFieldContent;
    specialRequirements: DevelopmentProjectFieldContent;
    attachment: DevelopmentProjectFieldContent;
  };
}

export interface DevelopmentProjectSummaryLabelsContent {
  contact: string;
  scope: string;
  stack: string;
  brief: string;
}

export interface DevelopmentProjectSummaryFallbacksContent {
  contactName: string;
  contactEmail: string;
  scopeTitle: string;
  scopeDescription: string;
  features: string;
  integrations: string;
  references: string;
  stackMeta: string;
  brief: string;
  notes: string;
  assets: string;
  noFiles: string;
  featureCountSingular: string;
  featureCountPlural: string;
}

export interface DevelopmentProjectValidationContent {
  fullNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  projectDescriptionRequired: string;
}

export interface DevelopmentProjectFileValidationContent {
  invalidType: string;
  tooLarge: string;
  clearLabel: string;
}

export interface DevelopmentProjectUiContent {
  sidebarKicker: string;
  stepNavigationLabel: string;
  stepCounterTemplate: string;
  restoredStatus: string;
  savePrefix: string;
  backLabel: string;
  nextLabel: string;
  successKicker: string;
  successResetLabel: string;
  successEmailLabel: string;
  confirmKicker: string;
  confirmDestinationLabel: string;
  confirmCloseLabel: string;
  sendingLabel: string;
  submitError: string;
  contactStep: DevelopmentProjectContactStepContent;
  scopeStep: DevelopmentProjectScopeStepContent;
  reviewStep: DevelopmentProjectReviewStepContent;
  summaryLabels: DevelopmentProjectSummaryLabelsContent;
  summaryFallbacks: DevelopmentProjectSummaryFallbacksContent;
  validation: DevelopmentProjectValidationContent;
  fileValidation: DevelopmentProjectFileValidationContent;
}

export interface DevelopmentProjectContent {
  header: SectionHeaderContent;
  sidebarTitle: string;
  sidebarDescription: string;
  sidebarHighlights: string[];
  responsePromise: string;
  contactEmail: string;
  returnAction: LinkActionContent;
  stepTitles: string[];
  projectTypeOptions: string[];
  projectLevelOptions: string[];
  pageOptions: string[];
  designOptions: string[];
  featureOptions: string[];
  integrationOptions: string[];
  hostingOptions: string[];
  brandingOptions: string[];
  contentOptions: string[];
  timelineOptions: string[];
  uploadHints: string[];
  stepDescriptions: string[];
  finalSubmitLabel: string;
  confirmModalTitle: string;
  confirmModalDescription: string;
  confirmModalCancelLabel: string;
  confirmModalConfirmLabel: string;
  successTitle: string;
  successDescription: string;
  ui: DevelopmentProjectUiContent;
}

export const developmentRequestLandingPageMeta: PageMetadata = {
  title: 'Empezar proyecto | CYSTEMS',
  description: 'Inicia una consulta o solicita una propuesta de desarrollo de software con CYSTEMS.',
};

export const developmentRequestSimplePageMeta: PageMetadata = {
  title: 'Desarrollo simple | CYSTEMS',
  description: 'Formulario rapido para consultas y desarrollos pequenos en CYSTEMS.',
};

export const developmentRequestProjectPageMeta: PageMetadata = {
  title: 'Proyecto completo | CYSTEMS',
  description: 'Wizard paso a paso para solicitar un desarrollo completo en CYSTEMS.',
};

export const developmentRequestApiContent: DevelopmentRequestApiContent = {
  invalidBody: 'No pudimos leer tu solicitud.',
  methodNotAllowed: 'Esta opción no está disponible.',
  rateLimitError: 'Has enviado muchas solicitudes. Intenta más tarde.',
};

export const developmentRequestLandingContent: DevelopmentRequestLandingContent = {
  header: {
    kicker: 'Empieza aquí',
    title: 'Solicita una solución digital',
    description:
      'Elige el flujo adecuado según tu etapa: una consulta rápida o un brief completo para estimar mejor alcance, prioridad y siguientes pasos.',
  },
  cards: [
    {
      kicker: 'Opción 1',
      title: 'Consulta rápida',
      description: 'Para validar una idea o resolver dudas iniciales.',
      detail:
        'Ideal si necesitas una primera orientación técnica o quieres saber si tu idea es viable.',
      bullets: ['Respuesta directa', 'Diagnóstico inicial', 'Sin fricción'],
      action: {
        label: 'Empezar',
        href: '/empezar-proyecto/simple',
      },
      rotation: '-1.5deg',
    },
    {
      kicker: 'Opción 2',
      title: 'Proyecto completo',
      description: 'Para una propuesta con más contexto técnico y comercial.',
      detail:
        'Recomendado cuando necesitas estimar alcance, funcionalidades, integraciones y tiempos.',
      bullets: ['Brief estructurado', 'Mejor estimación', 'Planificación clara'],
      action: {
        label: 'Crear solicitud',
        href: '/empezar-proyecto/proyecto',
      },
      rotation: '1.5deg',
    },
  ],
  supportKicker: 'Proceso comercial',
  supportTitle: 'Más claridad desde el primer contacto',
  supportDescription:
    'La información correcta permite responder con una ruta de trabajo más precisa y realista.',
  supportChips: ['Discovery', 'Alcance', 'Prioridades', 'Riesgos', 'Siguientes pasos'],
};

export const developmentRequestSimpleContent: DevelopmentSimpleContent = {
  header: {
    kicker: 'Consulta rápida',
    title: 'Hablemos',
    description:
      'Cuéntanos qué necesitas y te respondemos lo antes posible.',
  },
  supportKicker: 'Fácil',
  supportTitle: '¿Para qué sirve?',
  supportDescription:
    'Este formulario es para empezar rápido. Si hace falta más detalle, luego lo vemos contigo.',
  supportItems: [
    'Dudas o consultas generales',
    'Ideas de páginas, apps o sistemas',
    'Necesidades rápidas',
  ],
  consultationOptions: [
    'Consulta general',
    'Página web',
    'Tienda online',
    'Aplicación web',
    'Sistema',
    'Automatización',
    'Otro',
  ],
  submitLabel: 'Enviar',
  footerNote: 'Te responderemos pronto. También puedes escribir a contacto@cystems.ec',
  emailLabel: 'Correo',
  emailValue: 'contacto@cystems.ec',
  returnAction: {
    label: 'Volver',
    href: '/empezar-proyecto',
  },
  form: {
    cardKicker: 'Formulario',
    cardTitle: 'Rápido y sencillo',
    cardDescription: 'Completa lo básico y enviaremos tu mensaje a {email}.',
    pendingStatus: 'Enviando tu mensaje...',
    sendingLabel: 'Enviando...',
    successKicker: 'Listo',
    successTitle: 'Mensaje enviado',
    successDescription: 'Te responderemos en {email} lo antes posible.',
    resetLabel: 'Enviar otro',
    directEmailLabel: 'Escribir a {email}',
    fields: {
      name: 'Nombre',
      email: 'Correo',
      company: 'Teléfono',
      consultationType: 'Tipo',
      message: 'Mensaje',
    },
    validation: {
      nameRequired: 'Ingresa tu nombre.',
      emailRequired: 'Ingresa tu correo.',
      emailInvalid: 'Correo no válido.',
      companyInvalid: 'Solo números.',
      consultationTypeRequired: 'Elige una opción.',
      messageRequired: 'Escribe tu mensaje.',
      submitError: 'No se pudo enviar. Intenta de nuevo.',
    },
  },
};

export const developmentRequestProjectContent: DevelopmentProjectContent = {
  header: {
    kicker: 'Solicitud completa',
    title: 'Cuéntanos tu proyecto',
    description:
      'Te guiamos paso a paso para entender mejor tu idea y darte una propuesta clara.',
  },
  sidebarTitle: 'Mientras más claro, mejor',
  sidebarDescription:
    'Estas preguntas nos ayudan a entender tu proyecto y darte una mejor respuesta.',
  sidebarHighlights: [
    '3 pasos simples',
    'Solo lo necesario',
    'Se guarda automáticamente',
    'Confirmas antes de enviar',
  ],
  responsePromise: 'Te respondemos en menos de 24 horas.',
  contactEmail: 'contacto@cystems.ec',
  returnAction: {
    label: 'Volver',
    href: '/empezar-proyecto',
  },
  stepTitles: [
    'Datos básicos',
    'Tu proyecto',
    'Detalles finales',
  ],
  stepDescriptions: [
    'Información para poder contactarte.',
    'Cuéntanos qué quieres construir.',
    'Agrega detalles y revisa todo antes de enviar.',
  ],
  projectTypeOptions: [
    'Landing',
    'Página web',
    'Tienda online',
    'Aplicación web',
    'Sistema',
    'Plataforma SaaS',
    'Otro',
  ],
  projectLevelOptions: ['Startup', 'Empresa', 'Corporativo', 'Gobierno'],
  pageOptions: [
    '1 página',
    '3 - 5 páginas',
    '5 - 10 páginas',
    '10 - 20 páginas',
    'Más de 20',
    'No sé',
  ],
  designOptions: [
    'Básico',
    'Moderno',
    'Premium',
    'No sé',
  ],
  featureOptions: [
    'Formulario',
    'Blog',
    'Panel admin',
    'Login',
    'Pagos',
    'Reservas',
    'Clientes',
    'Dashboard',
    'API',
    'Chat',
    'Multilenguaje',
    'SEO',
    'Optimización',
  ],
  integrationOptions: [
    'WhatsApp',
    'Pagos (Stripe/PayPal)',
    'Analytics',
    'CRM',
    'Emails',
    'API externa',
    'ERP',
  ],
  hostingOptions: ['Ya tengo', 'Necesito', 'Hosting + dominio', 'No sé'],
  brandingOptions: [
    'Ya tengo branding',
    'Tengo logo',
    'Necesito todo',
  ],
  contentOptions: [
    'Yo pongo el contenido',
    'Necesito ayuda',
    'Redacción profesional',
    'Imágenes',
  ],
  timelineOptions: ['Urgente', '1 mes', '2-3 meses', 'Flexible'],
  uploadHints: ['PDF, Word, Excel (máx 10MB)'],
  finalSubmitLabel: 'Enviar solicitud',
  confirmModalTitle: '¿Enviar solicitud?',
  confirmModalDescription: 'Revisaremos tu información y te responderemos.',
  confirmModalCancelLabel: 'Cancelar',
  confirmModalConfirmLabel: 'Enviar',
  successTitle: 'Solicitud enviada',
  successDescription: 'Te responderemos pronto al correo indicado.',
  ui: {
    sidebarKicker: 'Formulario',
    stepNavigationLabel: 'Pasos',
    stepCounterTemplate: 'Paso {current} de {total}',
    restoredStatus: 'Recuperamos tu progreso.',
    savePrefix: 'Guardado:',
    backLabel: 'Atrás',
    nextLabel: 'Siguiente',
    successKicker: 'Listo',
    successResetLabel: 'Nueva solicitud',
    successEmailLabel: 'Escribir a {email}',
    confirmKicker: 'Confirmación',
    confirmDestinationLabel: 'Se enviará a {email}',
    confirmCloseLabel: 'Cerrar',
    sendingLabel: 'Enviando...',
    submitError: 'No se pudo enviar. Intenta de nuevo.',
    contactStep: {
      fields: {
        fullName: { label: 'Nombre', required: true },
        email: { label: 'Correo', required: true },
        company: { label: 'Empresa / proyecto' },
        phone: { label: 'Teléfono / WhatsApp', required: true },
        country: { label: 'País' },
        projectDescription: {
          label: 'Tu idea',
          placeholder: 'Explica brevemente qué quieres hacer.',
          required: true,
        },
      },
    },
    scopeStep: {
      fields: {
        projectType: { label: 'Tipo', placeholder: 'Elige una opción' },
        projectLevel: { label: 'Nivel', placeholder: 'Elige una opción' },
        pageRange: { label: 'Páginas', placeholder: 'Elige una opción' },
        designLevel: { label: 'Diseño', placeholder: 'Elige una opción' },
      },
    },
    reviewStep: {
      featureTitle: 'Funcionalidades',
      featureDescription: 'Marca solo lo que ya tengas claro.',
      integrationTitle: 'Integraciones',
      integrationDescription: 'Conexiones o herramientas necesarias.',
      logisticsTitle: 'Detalles',
      logisticsDescription: 'Tiempo, contenido y extras.',
      fields: {
        hosting: { label: 'Hosting', placeholder: 'Elige una opción' },
        branding: { label: 'Diseño / marca', placeholder: 'Elige una opción' },
        contentPlan: { label: 'Contenido', placeholder: 'Elige una opción' },
        timeline: { label: 'Tiempo', placeholder: 'Elige una opción' },
        references: {
          label: 'Referencias',
          placeholder: 'Ej: vercel.com, linear.app...',
        },
        specialRequirements: {
          label: 'Extras',
          placeholder: 'IA, automatización, seguridad, etc.',
        },
        attachment: {
          label: 'Archivo',
          placeholder: 'Sube un documento (máx 10MB).',
        },
      },
    },
    summaryLabels: {
      contact: 'Contacto',
      scope: 'Proyecto',
      stack: 'Detalles',
      brief: 'Resumen',
    },
    summaryFallbacks: {
      contactName: 'Sin nombre',
      contactEmail: 'Sin correo',
      scopeTitle: 'Sin definir',
      scopeDescription: 'Aún no definido',
      features: 'Sin extras',
      integrations: 'Sin integraciones',
      references: 'Sin referencias',
      stackMeta: 'Sin detalles',
      brief: 'Sin resumen',
      notes: 'Sin notas',
      assets: 'Sin archivos',
      noFiles: 'Ninguno',
      featureCountSingular: 'funcionalidad',
      featureCountPlural: 'funcionalidades',
    },
    validation: {
      fullNameRequired: 'Ingresa tu nombre.',
      emailRequired: 'Ingresa tu correo.',
      emailInvalid: 'Correo no válido.',
      phoneRequired: 'Ingresa tu teléfono.',
      projectDescriptionRequired: 'Describe tu idea.',
    },
    fileValidation: {
      invalidType: 'Archivo no válido.',
      tooLarge: 'Máximo 10MB.',
      clearLabel: 'Quitar',
    },
  },
};
