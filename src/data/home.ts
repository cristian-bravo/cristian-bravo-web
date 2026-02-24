import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../types/content';

export interface HomeHeroContent {
  kicker: string;
  title: string;
  subtitle: string;
  primaryAction: LinkActionContent;
  secondaryAction: LinkActionContent;
  focusLabel: string;
  focusValue: string;
  deliveryLabel: string;
  deliveryValue: string;
  lightImageSrc: string;
  lightImageAlt: string;
  darkImageSrc: string;
  visualKicker: string;
  visualTitle: string;
  visualTags: string[];
}

export interface HomeServicePreviewCardContent {
  title: string;
  description: string;
}

export interface HomeServicesPreviewContent {
  header: SectionHeaderContent;
  cards: HomeServicePreviewCardContent[];
  cta: LinkActionContent;
  ctaIcon: string;
}

export interface HomeMethodStepContent {
  title: string;
  description: string;
}

export interface HomeMethodContent {
  header: SectionHeaderContent;
  steps: HomeMethodStepContent[];
}

export interface HomeNextStepContent {
  header: SectionHeaderContent;
  primaryAction: LinkActionContent;
  secondaryAction: LinkActionContent;
}

export const homePageMeta: PageMetadata = {
  title: 'CYSTEMS | Transforma ideas en tecnología',
  description: 'Estrategia, arquitectura y operación para construir plataformas digitales escalables.',
};

export const homeHeroContent: HomeHeroContent = {
  kicker: 'CYSTEMS - Ingeniería digital',
  title: 'Arquitectura de software para empresas',
  subtitle:
    'Diseñamos y desarrollamos plataformas que optimizan procesos, centralizan información y escalan con tu empresa.',
  primaryAction: {
    label: 'Solicitar desarrollo',
    href: '/solicitar-desarrollo',
  },
  secondaryAction: {
    label: 'Ver casos de éxito',
    href: '/proyectos',
  },
  focusLabel: 'Enfoque',
  focusValue: 'Soluciones pensadas para tu modelo de negocio',
  deliveryLabel: 'Entrega',
  deliveryValue: 'Sistemas listos para crecer contigo',
  lightImageSrc: '/hero/yuki-light.png',
  lightImageAlt: 'Vista principal de plataforma digital en modo claro',
  darkImageSrc: '/hero/yuki-dark.png',
  visualKicker: 'Capacidades clave',
  visualTitle: 'Arquitectura + Producto + Operación',
  visualTags: ['Arquitectura', 'Integraciones', 'Escalabilidad'],
};

export const homeServicesPreviewContent: HomeServicesPreviewContent = {
  header: {
    kicker: 'Servicios',
    title: 'Soluciones digitales para empresas en crecimiento',
    description:
      'Diseñamos, construimos y operamos plataformas digitales alineadas a objetivos de negocio.',
  },
  cards: [
    {
      title: 'Arquitectura cloud & DevOps',
      description: 'Infraestructura preparada para operar, crecer y desplegar sin riesgos.',
    },
    {
      title: 'Desarrollo de producto',
      description: 'Plataformas centradas en experiencia, rendimiento y crecimiento.',
    },
    {
      title: 'Automatización e integraciones',
      description: 'Integramos sistemas y automatizamos procesos para decisiones en tiempo real.',
    },
  ],
  cta: {
    label: 'Conoce todos nuestros servicios',
    href: '/servicios',
  },
  ctaIcon: '→',
};

export const homeMethodContent: HomeMethodContent = {
  header: {
    kicker: 'Método',
    title: 'El método CYSTEMS',
    description: 'Estrategia, arquitectura y operación alineadas para entregar resultados reales.',
  },
  steps: [
    {
      title: 'Diagnóstico estratégico',
      description: 'Definimos la arquitectura y el roadmap según tus objetivos de negocio.',
    },
    {
      title: 'Diseño y ejecución',
      description: 'Construimos la plataforma con entregas iterativas y visibilidad total.',
    },
    {
      title: 'Operación continua',
      description: 'Operamos, medimos y optimizamos para asegurar evolución continua.',
    },
  ],
};

export const homeNextStepContent: HomeNextStepContent = {
  header: {
    kicker: 'Siguiente paso',
    title: 'Hablemos de la arquitectura que tu empresa necesita',
    description: 'Agenda una cita y construyamos tu roadmap tecnológico.',
  },
  primaryAction: {
    label: 'Solicitar desarrollo',
    href: '/solicitar-desarrollo',
  },
  secondaryAction: {
    label: 'Contacto',
    href: '/contacto',
  },
};
