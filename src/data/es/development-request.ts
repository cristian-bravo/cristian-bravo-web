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
  description: 'Elige el flujo adecuado para iniciar tu desarrollo con CYSTEMS.',
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
  invalidBody: 'No pudimos leer los datos del formulario.',
  methodNotAllowed: 'Metodo no permitido.',
  rateLimitError: 'Has alcanzado el limite de solicitudes por hora. Intentalo mas tarde.',
};

export const developmentRequestLandingContent: DevelopmentRequestLandingContent = {
  header: {
    kicker: 'Nuevo flujo de solicitudes',
    title: 'Solicita tu desarrollo',
    description:
      'Elige el formato que mejor se ajusta a tu momento. Desde una conversacion rapida hasta una solicitud completa con alcance, integraciones y estimado automatico.',
  },
  cards: [
    {
      kicker: 'Ruta 01',
      title: 'Desarrollo simple',
      description: 'Para consultas rapidas o proyectos pequenos.',
      detail:
        'Ideal si ya tienes claro lo esencial y quieres abrir conversacion sin friccion. En pocos campos podemos entender tu necesidad y responder con el siguiente paso.',
      bullets: ['Formulario corto y directo', 'Perfecto para dudas iniciales', 'Respuesta agil'],
      action: {
        label: 'Iniciar conversacion',
        href: '/empezar-proyecto/simple',
      },
      rotation: '-1.5deg',
    },
    {
      kicker: 'Ruta 02',
      title: 'Solicitar proyecto completo',
      description: 'Para proyectos mas grandes o desarrollos personalizados.',
      detail:
        'Pensado para aterrizar alcance, experiencia visual, integraciones, hosting y tiempos. El wizard ayuda a convertir una idea ambigua en una base mucho mas util.',
      bullets: ['Wizard guiado paso a paso', 'Brief profesional y ordenado', 'Solicitud mas clara desde el inicio'],
      action: {
        label: 'Crear solicitud',
        href: '/empezar-proyecto/proyecto',
      },
      rotation: '1.5deg',
    },
  ],
  supportKicker: 'Disenado para convertir mejor',
  supportTitle: 'Una experiencia clara desde el primer paso',
  supportDescription:
    'Cada flujo esta pensado para reducir ruido, guiar mejor al cliente y permitirnos responder con mas contexto desde el inicio.',
  supportChips: ['UX guiada', 'Responsive real', 'Brief mas claro', 'Menos friccion', 'Respuesta priorizada'],
};

export const developmentRequestSimpleContent: DevelopmentSimpleContent = {
  header: {
    kicker: 'Desarrollo simple',
    title: 'Iniciemos una conversacion',
    description:
      'En CYSTEMS ayudamos a transformar ideas en soluciones tecnologicas. Cuentanos brevemente que necesitas y te responderemos lo antes posible.',
  },
  supportKicker: 'Flujo rapido',
  supportTitle: 'Que puedes contarnos aqui',
  supportDescription:
    'Este flujo sirve para abrir una conversacion rapida sin pasar por un brief largo. Si hace falta mas profundidad, luego te guiamos al formato completo.',
  supportItems: [
    'Consultas generales sobre desarrollo o estrategia digital.',
    'Paginas web, tiendas online o aplicaciones con alcance inicial.',
    'Necesidades puntuales que requieren una respuesta rapida.',
  ],
  consultationOptions: [
    'Consulta general',
    'Crear pagina web',
    'Tienda online',
    'Aplicacion web',
    'Sistema empresarial',
    'Automatizacion',
    'Otro',
  ],
  submitLabel: 'Enviar mensaje',
  footerNote: 'Responderemos lo antes posible. Tambien puedes escribirnos a contacto@cystems.ec',
  emailLabel: 'Correo directo',
  emailValue: 'contacto@cystems.ec',
  returnAction: {
    label: 'Volver a las opciones',
    href: '/empezar-proyecto',
  },
  form: {
    cardKicker: 'Formulario simple',
    cardTitle: 'Cuestiones rapidas, respuesta rapida',
    cardDescription: 'Completa lo esencial y enviaremos tu solicitud directamente a {email}.',
    pendingStatus: 'Estamos enviando tu mensaje ahora mismo. Espera un momento.',
    sendingLabel: 'Enviando mensaje...',
    successKicker: 'Mensaje enviado',
    successTitle: 'Tu consulta fue enviada correctamente',
    successDescription: 'Revisaremos tu mensaje y te responderemos en {email} lo antes posible.',
    resetLabel: 'Enviar otro mensaje',
    directEmailLabel: 'Escribir directamente a {email}',
    fields: {
      name: 'Razon social',
      email: 'Email',
      company: 'Contacto',
      consultationType: 'Tipo de consulta',
      message: 'Mensaje',
    },
    validation: {
      nameRequired: 'Necesitamos tu nombre.',
      emailRequired: 'Necesitamos un correo de contacto.',
      emailInvalid: 'Escribe un correo valido.',
      companyInvalid: 'El campo Contacto solo acepta numeros.',
      consultationTypeRequired: 'Selecciona un tipo de consulta.',
      messageRequired: 'Cuentanos brevemente que necesitas.',
      submitError: 'No pudimos enviar tu mensaje desde el sitio. Intenta nuevamente.',
    },
  },
};

export const developmentRequestProjectContent: DevelopmentProjectContent = {
  header: {
    kicker: 'Solicitud guiada',
    title: 'Solicitar proyecto completo',
    description:
      'Este wizard organiza la informacion clave en 3 etapas para una propuesta mas precisa. Puedes avanzar con menos friccion, guardar tu progreso y cerrar un brief mucho mas claro.',
  },
  sidebarTitle: 'Un brief mejor ahorra tiempo a ambos lados',
  sidebarDescription:
    'La idea no es hacerte llenar campos por llenar. Cada paso existe para ayudarnos a entender mejor alcance, complejidad, tiempos e integraciones desde el principio.',
  sidebarHighlights: [
    '3 etapas claras y faciles de seguir.',
    'Solo pedimos como obligatorio lo esencial.',
    'Guardado temporal automatico mientras avanzas.',
    'Confirmacion final por modal antes de enviar la solicitud.',
  ],
  responsePromise: 'Te responderemos en menos de 24 horas.',
  contactEmail: 'contacto@cystems.ec',
  returnAction: {
    label: 'Volver a las opciones',
    href: '/empezar-proyecto',
  },
  stepTitles: [
    'Informacion basica',
    'Alcance del proyecto',
    'Funcionalidades y logistica',
  ],
  stepDescriptions: [
    'Completa el brief minimo para que podamos responderte con contexto real.',
    'Define el tipo de proyecto, el alcance de paginas y la direccion visual esperada.',
    'Anade funcionalidades, integraciones, tiempos, archivos y notas extra antes de abrir la confirmacion final.',
  ],
  projectTypeOptions: [
    'Landing Page',
    'Pagina Web Corporativa',
    'Tienda Online (E-commerce)',
    'Aplicacion Web',
    'Sistema Empresarial',
    'Plataforma SaaS',
    'Otro',
  ],
  projectLevelOptions: ['Startup', 'Empresa', 'Corporativo', 'Gobierno'],
  pageOptions: [
    '1 pagina (Landing)',
    '3 - 5 paginas',
    '5 - 10 paginas',
    '10 - 20 paginas',
    'Mas de 20 paginas',
    'No estoy seguro',
  ],
  designOptions: [
    'Diseno basico',
    'Diseno moderno personalizado',
    'Diseno premium con animaciones',
    'No estoy seguro',
  ],
  featureOptions: [
    'Formulario de contacto',
    'Blog',
    'Panel de administracion',
    'Login de usuarios',
    'Pagos en linea',
    'Sistema de reservas',
    'Sistema de clientes',
    'Dashboard de datos',
    'Integracion API',
    'Chat en vivo',
    'Multilenguaje',
    'SEO avanzado',
    'Optimizacion de velocidad',
  ],
  integrationOptions: [
    'WhatsApp Business',
    'Stripe / PayPal',
    'Google Analytics',
    'CRM',
    'Automatizacion de correos',
    'API externa',
    'ERP / sistema empresarial',
  ],
  hostingOptions: ['Ya tengo hosting', 'Necesito hosting', 'Necesito hosting + dominio', 'No estoy seguro'],
  brandingOptions: [
    'Ya tengo logo y branding',
    'Tengo logo pero necesito mejorar diseno',
    'Necesito branding completo',
  ],
  contentOptions: [
    'Yo proporcionare todo el contenido',
    'Necesito ayuda con textos',
    'Necesito redaccion profesional',
    'Necesito imagenes o ilustraciones',
  ],
  timelineOptions: ['Urgente (1-2 semanas)', '1 mes', '2-3 meses', 'Flexible'],
  uploadHints: ['PDF', 'Word', 'Excel', 'OpenDocument', 'Max 10MB'],
  finalSubmitLabel: 'Finalizar solicitud',
  confirmModalTitle: 'Deseas enviar esta solicitud de proyecto?',
  confirmModalDescription: 'Al confirmar, enviaremos el brief directamente a nuestro flujo de atencion para revisarlo y responderte.',
  confirmModalCancelLabel: 'Cancelar',
  confirmModalConfirmLabel: 'Enviar solicitud',
  successTitle: 'Solicitud enviada correctamente',
  successDescription: 'Tu brief ya fue enviado. Revisaremos la informacion y te responderemos lo antes posible en el correo indicado.',
  ui: {
    sidebarKicker: 'Brief guiado',
    stepNavigationLabel: 'Pasos del formulario',
    stepCounterTemplate: 'Paso {current} de {total}',
    restoredStatus: 'Recuperamos tu progreso guardado. Puedes seguir desde donde lo dejaste.',
    savePrefix: 'Guardado automatico:',
    backLabel: 'Volver',
    nextLabel: 'Continuar',
    successKicker: 'Solicitud enviada',
    successResetLabel: 'Crear otra solicitud',
    successEmailLabel: 'Escribir directamente a {email}',
    confirmKicker: 'Confirmacion final',
    confirmDestinationLabel: 'Se enviara a {email}',
    confirmCloseLabel: 'Cerrar confirmacion',
    sendingLabel: 'Enviando solicitud...',
    submitError: 'No pudimos enviar la solicitud desde el sitio. Intenta nuevamente.',
    contactStep: {
      fields: {
        fullName: { label: 'Nombre completo', required: true },
        email: { label: 'Correo electronico', required: true },
        company: { label: 'Empresa / proyecto' },
        phone: { label: 'WhatsApp / Telefono', required: true },
        country: { label: 'Pais' },
        projectDescription: {
          label: 'Descripcion del proyecto',
          placeholder: 'Explica el objetivo del proyecto, la idea general y las funcionalidades mas importantes.',
          required: true,
        },
      },
    },
    scopeStep: {
      fields: {
        projectType: { label: 'Tipo de proyecto', placeholder: 'Selecciona una opcion' },
        projectLevel: { label: 'Nivel del proyecto', placeholder: 'Selecciona una opcion' },
        pageRange: { label: 'Numero de paginas', placeholder: 'Selecciona una opcion' },
        designLevel: { label: 'Diseno', placeholder: 'Selecciona una opcion' },
      },
    },
    reviewStep: {
      featureTitle: 'Funcionalidades clave',
      featureDescription: 'Selecciona solo lo que ya tengas claro. Todo lo demas puede quedar abierto.',
      integrationTitle: 'Integraciones',
      integrationDescription: 'Marca las conexiones o servicios que ya sabes que seran necesarios.',
      logisticsTitle: 'Logistica y recursos',
      logisticsDescription: 'Tiempos, identidad visual, contenido y archivos de referencia para el proyecto.',
      fields: {
        hosting: { label: 'Hosting', placeholder: 'Selecciona una opcion' },
        branding: { label: 'Identidad visual', placeholder: 'Selecciona una opcion' },
        contentPlan: { label: 'Contenido', placeholder: 'Selecciona una opcion' },
        timeline: { label: 'Tiempo de entrega', placeholder: 'Selecciona una opcion' },
        references: {
          label: 'Referencias',
          placeholder: 'Ejemplo: vercel.com, linear.app, referencias de tu sector...',
        },
        specialRequirements: {
          label: 'Requerimientos especiales',
          placeholder: 'IA, automatizacion, integraciones, sistemas internos, escalabilidad, seguridad...',
        },
        attachment: {
          label: 'Documento de referencia',
          placeholder: 'Puedes adjuntar un documento PDF, Word, Excel u OpenDocument de hasta 10MB.',
        },
      },
    },
    summaryLabels: {
      contact: 'Contacto',
      scope: 'Alcance',
      stack: 'Stack',
      brief: 'Brief',
    },
    summaryFallbacks: {
      contactName: 'Nombre pendiente',
      contactEmail: 'Correo pendiente',
      scopeTitle: 'Proyecto por definir',
      scopeDescription: 'Aun no definiste el alcance principal del proyecto.',
      features: 'Sin funcionalidades extra',
      integrations: 'Sin integraciones extra',
      references: 'Sin referencias',
      stackMeta: 'Tiempo, hosting y direccion visual por definir.',
      brief: 'Brief pendiente',
      notes: 'Sin requerimientos especiales definidos.',
      assets: 'Sin referencias ni archivos adicionales.',
      noFiles: 'Sin archivos listados',
      featureCountSingular: 'funcionalidad',
      featureCountPlural: 'funcionalidades',
    },
    validation: {
      fullNameRequired: 'Completa tu nombre.',
      emailRequired: 'Necesitamos un correo para responder.',
      emailInvalid: 'Escribe un correo valido.',
      phoneRequired: 'Necesitamos un WhatsApp o telefono de contacto.',
      projectDescriptionRequired: 'Describe el objetivo, la idea general y lo que necesita el proyecto.',
    },
    fileValidation: {
      invalidType: 'Tipo de archivo no permitido. Solo se aceptan documentos como PDF, Word o Excel.',
      tooLarge: 'El archivo es demasiado grande. El tamano maximo permitido es 10MB.',
      clearLabel: 'Quitar archivo',
    },
  },
};
