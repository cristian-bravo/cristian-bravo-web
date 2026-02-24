import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../types/content';

export interface ProfileHeroContent {
  kicker: string;
  name: string;
  summary: string;
  primaryAction: LinkActionContent;
  secondaryAction: LinkActionContent;
  badgeLabel: string;
  signalLabel: string;
  executiveSummaryTitle: string;
  executiveSummaryDescription: string;
  expertTags: string[];
}

export interface ProfileDetailCardContent {
  title: string;
  description?: string;
  bullets?: string[];
  action?: LinkActionContent;
}

export interface ProfileInterestsContent {
  header: SectionHeaderContent;
  tags: string[];
}

export const profilePageMeta: PageMetadata = {
  title: 'Perfil | Cristian Bravo',
  description: 'Perfil profesional, experiencia y enfoque técnico en CYSTEMS.',
};

export const profileHeroContent: ProfileHeroContent = {
  kicker: 'Director técnico - CYSTEMS',
  name: 'Cristian Bravo',
  summary:
    'Líder técnico enfocado en arquitectura de plataformas, automatización y escalabilidad en la nube para empresas que buscan resultados sólidos.',
  primaryAction: {
    label: 'Contactar',
    href: '/contacto',
  },
  secondaryAction: {
    label: 'Ver proyectos',
    href: '/proyectos',
  },
  badgeLabel: 'CYSTEMS',
  signalLabel: 'Modo señal',
  executiveSummaryTitle: 'Resumen ejecutivo',
  executiveSummaryDescription:
    'Experiencia construyendo productos digitales, liderando equipos y optimizando operaciones críticas.',
  expertTags: ['Arquitectura cloud', 'Integraciones', 'Producto digital'],
};

export const profileDetailCards: ProfileDetailCardContent[] = [
  {
    title: 'Especialidades',
    bullets: [
      'Arquitectura cloud para empresas y escalabilidad.',
      'Productos digitales orientados a métricas y conversión.',
      'Integraciones con APIs críticas y automatización.',
    ],
  },
  {
    title: 'Disponibilidad',
    description:
      'Consultoría estratégica, mentoría técnica y acompañamiento de equipos de producto y tecnología.',
    action: {
      label: 'Agendar sesión',
      href: '/contacto',
    },
  },
];

export const profileInterestsContent: ProfileInterestsContent = {
  header: {
    kicker: 'Perfil personal',
    title: 'Intereses fuera del trabajo',
    description: 'Influencias creativas que inspiran el diseño y la narrativa de producto.',
  },
  tags: ['Anime', 'Videojuegos narrativos', 'Música instrumental'],
};
