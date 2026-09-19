import type { PageMetadata } from '../../types/content';

export interface ServicesIntroContent {
  kicker: string;
  title: string;
  subtitle: string;
}

export interface ServiceCardContent {
  title: string;
  description: string;
  modalId: string;
}

export interface ServicesAccompanimentContent {
  kicker: string;
  title: string;
  description: string;
  badges: string[];
  insightTitle: string;
  insightPoints: string[];
  insightModalId: string;
}

export interface ServicesModalContent {
  id: string;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  actionLabel: string;
  actionHref: string;
  closeLabel?: string;
}

export const servicesPageMeta: PageMetadata = {
  title: 'Software a medida, automatización e IA | CYSTEMS Ecuador',
  description: 'Desarrollo de plataformas empresariales, MVPs, APIs, automatización e inteligencia artificial. Auditoría, rescate y mantenimiento de software en Ecuador.',
};

export const servicesIntro: ServicesIntroContent = {
  kicker: 'Servicios',
  title: 'Construir, conectar y hacer que funcione.',
  subtitle: 'Software a medida, inteligencia artificial y soporte técnico. El punto de partida es lo que tu empresa necesita resolver.',
};

export const serviceCards: ServiceCardContent[] = [
  {
    title: 'APIs y backend',
    description:
      'Conectamos tus herramientas, datos y procesos con APIs y una lógica de negocio bien definida.',
    modalId: 'modal-consultoria',
  },
  {
    title: 'Plataformas y sistemas',
    description:
      'Construimos aplicaciones web y sistemas internos que reúnen usuarios, información y procesos.',
    modalId: 'modal-plataformas',
  },
  {
    title: 'Evolución y mantenimiento',
    description:
      'Mantenemos y mejoramos sistemas existentes: despliegues, rendimiento, monitoreo y nuevas funciones.',
    modalId: 'modal-operacion',
  },
];

export const servicesAccompaniment: ServicesAccompanimentContent = {
  kicker: 'Acompañamiento',
  title: 'Tecnología que evoluciona contigo en cada etapa',
  description:
    'Nos integramos a tu proceso desde la idea inicial hasta la operación continua, convirtiendo la estrategia en resultados.',
  badges: ['Camino claro desde el día uno', 'Crecimiento paso a paso'],
  insightTitle: 'Resultados que impulsan tu crecimiento',
  insightPoints: [
  'Arquitectura preparada para escalar sin rehacer el sistema en el futuro.',
  'Integraciones seguras que conectan tus procesos, datos y herramientas en un solo flujo.',
  'Monitoreo, prioridades y soporte acordados según las necesidades de tu operación.',
],
  insightModalId: 'modal-acompanamiento',
};

export const serviceModals: ServicesModalContent[] = [
  {
    id: 'modal-consultoria',
    kicker: 'Consultoría digital',
    title: 'Bajamos tu idea a un plan que se pueda construir',
    description:
      'No hablamos en abstracto. Revisamos tu operación, tus procesos y tu tecnología actual para definir qué vale la pena hacer, en qué orden y con qué impacto real en tu negocio.',
    bullets: [
      'Revisión de sistemas actuales, base de datos, servidores y flujos de trabajo.',
      'Definición de una solución viable según tu presupuesto y etapa de crecimiento.',
      'Roadmap por fases para avanzar sin frenar la operación.',
    ],
    actionLabel: 'Hablar con un especialista',
    actionHref: '/empezar-proyecto',
  },

  {
    id: 'modal-plataformas',
    kicker: 'Plataformas empresariales',
    title: 'Sistemas que resuelven la operación del día a día',
    description:
      'Desarrollamos plataformas reales para empresas reales. Desde el panel administrativo hasta los procesos internos que hoy manejas en Excel, WhatsApp o papel.',
    bullets: [
      'Sistemas web a medida conectados con tus procesos actuales.',
      'Módulos escalables que crecen contigo sin tener que rehacer todo.',
      'Integración con APIs, servicios externos y herramientas existentes.',
    ],
    actionLabel: 'Ver casos relacionados',
    actionHref: '/proyectos',
  },

  {
    id: 'modal-operacion',
    kicker: 'Operación y soporte',
    title: 'No solo lo desarrollamos: lo hacemos funcionar',
    description:
      'Nos encargamos de que tu plataforma esté en línea, segura y rápida. Desde el despliegue en servidor hasta el monitoreo, las copias de seguridad y las mejoras continuas.',
    bullets: [
      'Deploy, configuración de VPS, dominios, SSL y entornos productivos.',
      'Optimización de rendimiento y resolución de errores en producción.',
      'Soporte evolutivo para agregar nuevas funcionalidades.',
    ],
    actionLabel: 'Solicitar acompañamiento',
    actionHref: '/empezar-proyecto',
  },

{
  id: 'modal-acompanamiento',
  kicker: 'Acompañamiento integral',
  title: 'Más que desarrollo: un aliado tecnológico estratégico',
  description:
    'No solo construimos software. Nos involucramos en tu visión desde la primera idea hasta que tu plataforma esté operando, creciendo y generando impacto real en tu negocio.',
  bullets: [
    'Un único responsable que conecta la estrategia de negocio con la tecnología.',
    'Comunicación directa, avances medibles y decisiones ágiles en cada etapa.',
    'Mejora continua para acompañar la evolución de tu empresa.',
  ],
  actionLabel: 'Iniciar proyecto',
  actionHref: '/empezar-proyecto',
}
];
