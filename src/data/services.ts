import type { PageMetadata } from '../types/content';

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
  title: 'Servicios | CYSTEMS',
  description: 'Servicios tecnológicos para estrategia, desarrollo de plataformas y operación continua.',
};

export const servicesIntro: ServicesIntroContent = {
  kicker: 'Servicios',
  title: 'Desde el primer paso hasta una plataforma lista para crecer.',
  subtitle: 'No solo desarrollamos software: caminamos contigo en todo el proceso.',
};

export const serviceCards: ServiceCardContent[] = [
  {
    title: 'Consultoría digital',
    description:
      'Entendemos tu negocio, ordenamos el camino y definimos un plan claro para crecer sin improvisar.',
    modalId: 'modal-consultoria',
  },
  {
    title: 'Plataformas empresariales',
    description:
      'Creamos sistemas a tu medida que automatizan procesos, conectan tu operación y acompañan tu crecimiento.',
    modalId: 'modal-plataformas',
  },
  {
    title: 'Operación y soporte',
    description:
      'Seguimos contigo después del lanzamiento mejorando y cuidando tu plataforma para que nada se detenga.',
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
  'Métricas claras, monitoreo constante y soporte activo para que tu operación nunca se detenga.',
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
    actionHref: '/solicitar-desarrollo',
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
    actionHref: '/solicitar-desarrollo',
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
  actionHref: '/solicitar-desarrollo',
}
];
