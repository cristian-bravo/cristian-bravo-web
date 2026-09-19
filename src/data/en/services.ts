import type {
  ServiceCardContent,
  ServicesAccompanimentContent,
  ServicesIntroContent,
  ServicesModalContent,
} from '../es/services';
import type { PageMetadata } from '../../types/content';

export const servicesPageMeta: PageMetadata = {
  title: 'Custom software, automation and AI services | CYSTEMS',
  description: 'Business platforms, MVPs, APIs and applied AI from Ecuador. Software audits, project recovery, maintenance and technical support.',
};

export const servicesIntro: ServicesIntroContent = {
  kicker: 'Services',
  title: 'Build it, connect it, make it work.',
  subtitle: 'Custom software, artificial intelligence and technical support. We start with the problem your business needs to solve.',
};

export const serviceCards: ServiceCardContent[] = [
  {
    title: 'APIs and backend',
    description:
      'API design and backend logic with focus on performance, scalability and well-defined structures.',
    modalId: 'modal-consultoria',
  },
  {
    title: 'Platforms and systems',
    description:
      'Production-ready platforms that connect frontend, backend and architecture to solve real operational needs.',
    modalId: 'modal-plataformas',
  },
  {
    title: 'Evolution and maintenance',
    description:
      'Maintenance and improvement for production systems, keeping stability, performance and constant evolution.',
    modalId: 'modal-operacion',
  },
];

export const servicesAccompaniment: ServicesAccompanimentContent = {
  kicker: 'Partnership',
  title: 'Technology that evolves with your company at every stage',
  description:
    'We work with you from the first idea to ongoing operations, with clear scope and visible progress.',
  badges: ['Clear path from day one', 'Step-by-step growth'],
  insightTitle: 'Results that support growth',
  insightPoints: [
    'Architecture prepared to scale without rebuilding the system later.',
    'Secure integrations that connect processes, data and tools in one flow.',
    'Clear metrics, monitoring and active support so your operation keeps running.',
  ],
  insightModalId: 'modal-acompanamiento',
};

export const serviceModals: ServicesModalContent[] = [
  {
    id: 'modal-consultoria',
    kicker: 'Digital consulting',
    title: 'Turning your idea into a plan that can actually be built',
    description:
      'We review your operation, current systems and workflows to define what is worth building, in what order and with what business impact.',
    bullets: [
      'Review of current systems, databases, servers and workflows.',
      'Definition of a viable solution according to budget and growth stage.',
      'Phased roadmap to move forward without stopping the operation.',
    ],
    actionLabel: 'Talk to a specialist',
    actionHref: '/en/empezar-proyecto',
  },
  {
    id: 'modal-plataformas',
    kicker: 'Business platforms',
    title: 'Systems that solve day-to-day operations',
    description:
      'Real platforms for real companies: from admin panels to internal processes currently handled in spreadsheets, chat or paper.',
    bullets: [
      'Custom web systems connected to your current processes.',
      'Scalable modules that grow with you without rebuilding everything.',
      'Integration with APIs, external services and existing tools.',
    ],
    actionLabel: 'See related cases',
    actionHref: '/en/proyectos',
  },
  {
    id: 'modal-operacion',
    kicker: 'Operations and support',
    title: 'It is not only built: it is kept running',
    description:
      'We help with deployment, security and performance, including server setup, backups and ongoing improvements.',
    bullets: [
      'Deployments, VPS setup, domains, SSL and production environments.',
      'Performance optimization and production issue resolution.',
      'Evolutionary support for new features.',
    ],
    actionLabel: 'Request support',
    actionHref: '/en/empezar-proyecto',
  },
  {
    id: 'modal-acompanamiento',
    kicker: 'End-to-end partnership',
    title: 'More than development: a strategic technology partner',
    description:
      'We work on the product from the first idea through launch and ongoing improvements, with direct communication along the way.',
    bullets: [
      'One technical owner connecting business strategy with technology.',
      'Direct communication, measurable progress and agile decisions at every stage.',
      'Continuous improvement aligned with company evolution.',
    ],
    actionLabel: 'Start a project',
    actionHref: '/en/empezar-proyecto',
  },
];
