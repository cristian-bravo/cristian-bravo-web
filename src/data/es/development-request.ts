import type {
  LinkActionContent,
  PageMetadata,
  SectionHeaderContent,
} from '../../types/content';

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
  supportAction: LinkActionContent;
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
  intents: Record<
    'new' | 'improve' | 'rescue',
    { title: string; prompt: string; consultationType: string }
  >;
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
  description:
    'Inicia una consulta o solicita una propuesta de desarrollo de software con CYSTEMS.',
};

export const developmentRequestSimplePageMeta: PageMetadata = {
  title: 'Desarrollo simple | CYSTEMS',
  description:
    'Formulario rapido para consultas y desarrollos pequenos en CYSTEMS.',
};

export const developmentRequestProjectPageMeta: PageMetadata = {
  title: 'Proyecto completo | CYSTEMS',
  description:
    'Wizard paso a paso para solicitar un desarrollo completo en CYSTEMS.',
};

export const developmentRequestApiContent: DevelopmentRequestApiContent = {
  invalidBody: 'No pudimos leer tu solicitud.',
  methodNotAllowed: 'Esta opción no está disponible.',
  rateLimitError: 'Has enviado muchas solicitudes. Intenta más tarde.',
};

export const developmentRequestLandingContent: DevelopmentRequestLandingContent =
  {
    header: {
      kicker: 'Empieza aquí',
      title: '¿En qué punto está tu proyecto?',
      description:
        'Crear desde cero, mejorar lo que ya funciona o recuperar un sistema con problemas. Empecemos por lo que necesitas resolver.',
    },
    cards: [
      {
        kicker: '01 / Crear',
        title: 'Tengo una idea nueva',
        description:
          'Convierte una necesidad de negocio en un producto concreto.',
        detail:
          'Cuéntanos quién lo usará y qué problema debe resolver. Definiremos juntos un primer alcance.',
        bullets: [
          'MVP y validación',
          'Software a medida',
          'Integraciones desde el inicio',
        ],
        action: {
          label: 'Explorar mi idea',
          href: '/empezar-proyecto/simple?intent=new',
        },
        rotation: '0deg',
      },
      {
        kicker: '02 / Mejorar',
        title: 'Quiero mejorar mi sistema',
        description:
          'Tu operación cambió. Tu software también puede evolucionar.',
        detail:
          'Identifiquemos tareas manuales, conexiones que faltan y funciones que tu equipo necesita.',
        bullets: [
          'Automatización',
          'Nuevas funcionalidades',
          'Rendimiento y experiencia',
        ],
        action: {
          label: 'Planear la mejora',
          href: '/empezar-proyecto/simple?intent=improve',
        },
        rotation: '0deg',
      },
      {
        kicker: '03 / Rescatar',
        title: 'Necesito recuperar un proyecto',
        description:
          'Errores, entregas incompletas o un sistema difícil de mantener.',
        detail:
          'Primero revisamos su estado. Después priorizamos reparaciones, riesgos y una ruta de continuidad.',
        bullets: [
          'Diagnóstico técnico',
          'Estabilidad y seguridad',
          'Continuidad del proyecto',
        ],
        action: {
          label: 'Revisar mi caso',
          href: '/empezar-proyecto/simple?intent=rescue',
        },
        rotation: '0deg',
      },
    ],
    supportKicker: '¿Ya tienes un alcance?',
    supportTitle: 'Comparte un brief más completo',
    supportDescription:
      'Si ya conoces las funciones e integraciones que necesitas, puedes detallarlas en una solicitud guiada. Revisas todo antes de enviar.',
    supportChips: [
      'Discovery',
      'Alcance',
      'Prioridades',
      'Riesgos',
      'Siguientes pasos',
    ],
    supportAction: {
      label: 'Completar el brief',
      href: '/empezar-proyecto/proyecto',
    },
  };

export const developmentRequestSimpleContent: DevelopmentSimpleContent = {
  header: {
    kicker: 'Consulta rápida',
    title: 'Hablemos',
    description: 'Cuéntanos qué necesitas y te respondemos lo antes posible.',
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
    'Crear software',
    'Mejorar software',
    'Rescatar software',
    'Otro',
  ],
  intents: {
    new: {
      title: 'Crear algo nuevo',
      prompt:
        '¿Qué problema quieres resolver, quién usará el producto y qué debería poder hacer en su primera versión?',
      consultationType: 'Crear software',
    },
    improve: {
      title: 'Mejorar un sistema existente',
      prompt:
        '¿Qué sistema usas hoy y qué tarea, integración o experiencia necesitas mejorar?',
      consultationType: 'Mejorar software',
    },
    rescue: {
      title: 'Recuperar un proyecto',
      prompt:
        '¿Qué está fallando y cómo afecta a tu operación? Describe el estado del proyecto; no envíes contraseñas ni datos de clientes.',
      consultationType: 'Rescatar software',
    },
  },
  submitLabel: 'Enviar',
  footerNote:
    'Te responderemos pronto. También puedes escribir a contacto@cystems.ec',
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
      companyInvalid: 'Ingresa un teléfono válido (7 a 15 dígitos).',
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
    'Borrador solo en esta pestaña',
    'Confirmas antes de enviar',
  ],
  responsePromise:
    'Revisaremos tu solicitud para acordar los siguientes pasos.',
  contactEmail: 'contacto@cystems.ec',
  returnAction: {
    label: 'Volver',
    href: '/empezar-proyecto',
  },
  stepTitles: ['Datos básicos', 'Tu proyecto', 'Detalles finales'],
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
  designOptions: ['Básico', 'Moderno', 'Premium', 'No sé'],
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
  brandingOptions: ['Ya tengo branding', 'Tengo logo', 'Necesito todo'],
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
    restoredStatus:
      'Recuperamos el borrador de esta pestaña. Se elimina al cerrarla.',
    savePrefix: 'Guardado en esta pestaña:',
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
