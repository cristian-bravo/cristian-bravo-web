import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../types/content';

export interface DevelopmentRequestCardContent {
  kicker: string;
  title: string;
  description: string;
  detail: string;
  bullets: string[];
  action: LinkActionContent;
  rotation: string;
}

export interface DevelopmentRequestLandingContent {
  header: SectionHeaderContent;
  cards: DevelopmentRequestCardContent[];
  supportTitle: string;
  supportDescription: string;
  supportChips: string[];
}

export interface DevelopmentSimpleContent {
  header: SectionHeaderContent;
  supportTitle: string;
  supportDescription: string;
  supportItems: string[];
  consultationOptions: string[];
  submitLabel: string;
  footerNote: string;
  emailLabel: string;
  emailValue: string;
  returnAction: LinkActionContent;
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
  budgetOptions: string[];
  timelineOptions: string[];
  uploadHints: string[];
  estimateNote: string;
  finalNote: string;
}

export const developmentRequestLandingPageMeta: PageMetadata = {
  title: 'Solicitar desarrollo | CYSTEMS',
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
        href: '/solicitar-desarrollo/simple',
      },
      rotation: '-1.5deg',
    },
    {
      kicker: 'Ruta 02',
      title: 'Solicitar proyecto completo',
      description: 'Para proyectos mas grandes o desarrollos personalizados.',
      detail:
        'Pensado para aterrizar alcance, experiencia visual, integraciones, hosting y tiempos. El wizard ayuda a convertir una idea ambigua en una base mucho mas util.',
      bullets: ['Wizard guiado paso a paso', 'Estimado automatico en tiempo real', 'Brief profesional y ordenado'],
      action: {
        label: 'Crear solicitud',
        href: '/solicitar-desarrollo/proyecto',
      },
      rotation: '1.5deg',
    },
  ],
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
  footerNote: 'Responderemos lo antes posible. Tambien puedes escribirnos a contacto@cystems.dev',
  emailLabel: 'Correo directo',
  emailValue: 'contacto@cystems.dev',
  returnAction: {
    label: 'Volver a las opciones',
    href: '/solicitar-desarrollo',
  },
};

export const developmentRequestProjectContent: DevelopmentProjectContent = {
  header: {
    kicker: 'Solicitud guiada',
    title: 'Solicitar proyecto completo',
    description:
      'Este wizard organiza la informacion clave para una propuesta mas precisa. Puedes avanzar por pasos, volver atras, guardar tu progreso y revisar un estimado automatico.',
  },
  sidebarTitle: 'Un brief mejor ahorra tiempo a ambos lados',
  sidebarDescription:
    'La idea no es hacerte llenar campos por llenar. Cada paso existe para ayudarnos a entender mejor alcance, complejidad, tiempos e integraciones desde el principio.',
  sidebarHighlights: [
    'Barra de progreso y pasos claros.',
    'Validacion por etapa para evitar vacios importantes.',
    'Guardado temporal automatico mientras avanzas.',
    'Estimado preliminar basado en alcance real.',
  ],
  responsePromise: 'Te responderemos en menos de 24 horas.',
  contactEmail: 'contacto@cystems.dev',
  returnAction: {
    label: 'Volver a las opciones',
    href: '/solicitar-desarrollo',
  },
  stepTitles: [
    'Informacion basica',
    'Tipo de proyecto',
    'Alcance del sitio',
    'Funcionalidades',
    'Integraciones',
    'Hosting',
    'Identidad visual',
    'Contenido',
    'Presupuesto estimado',
    'Tiempo de entrega',
    'Archivos',
    'Referencias',
    'Descripcion del proyecto',
    'Requerimientos especiales',
    'Precio estimado automatico',
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
  budgetOptions: ['$300 - $800', '$800 - $1500', '$1500 - $3000', '$3000 - $5000', '$5000+', 'No estoy seguro'],
  timelineOptions: ['Urgente (1-2 semanas)', '1 mes', '2-3 meses', 'Flexible'],
  uploadHints: ['Logo', 'Documentos', 'Brandbook', 'Referencias', 'Wireframes', 'Imagenes', 'PDF'],
  estimateNote:
    'Este es un estimado aproximado. Nuestro equipo revisara tu solicitud y se pondra en contacto contigo para una propuesta detallada.',
  finalNote: 'Te responderemos en menos de 24 horas.',
};
