import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../../types/content';

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
  backgroundMediaSrc: string;
  backgroundMediaPoster?: string;
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
  title: 'CYSTEMS | Desarrollo de software y plataformas empresariales',
  description: 'Desarrollo web, arquitectura de software y sistemas a medida para empresas que necesitan crecer con tecnología confiable.',
};

export const homeHeroContent: HomeHeroContent = {
  kicker: 'CYSTEMS - Cristian Bravo',
  title: 'Software profesional para operar y vender mejor',
  subtitle:
    'Diseño y desarrollo plataformas web, APIs y sistemas internos con foco en negocio, rendimiento y escalabilidad.',
  primaryAction: {
    label: 'Empezar proyecto',
    href: '/empezar-proyecto',
  },
  secondaryAction: {
    label: 'Ver casos de éxito',
    href: '/proyectos',
  },
  focusLabel: 'Enfoque',
  focusValue: 'Arquitectura, producto y automatización conectados a tus objetivos',
  deliveryLabel: 'Entrega',
  deliveryValue: 'Implementación clara, soporte y evolución continua',
  backgroundMediaSrc: '/logos/logo-header-ligth.webp',
  backgroundMediaPoster: '/wallpapers/sakura/preview.jpg',
  lightImageSrc: '/hero/yuki-light.png',
  lightImageAlt: 'Vista principal de plataforma digital en modo claro',
  darkImageSrc: '/hero/yuki-dark.png',
  visualKicker: 'Marca + ingeniería',
  visualTitle: 'CYSTEMS como aliado técnico para tu empresa',
  visualTags: ['Software a medida', 'Integraciones', 'Operación estable'],
};

export const homeServicesPreviewContent: HomeServicesPreviewContent = {
  header: {
    kicker: 'Servicios',
    title: 'Servicios para convertir procesos en plataformas confiables',
    description:
      'Desde una web comercial hasta un sistema interno, el objetivo es entregar tecnología clara, medible y preparada para vender.',
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
    title: 'Un proceso serio para construir sin improvisar',
    description: 'Discovery, arquitectura, desarrollo y operación continua para reducir riesgos y acelerar resultados.',
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
    title: 'Hablemos de la solución que tu empresa necesita',
    description: 'Cuéntame tu contexto y te responderé con una ruta clara para avanzar.',
  },
  primaryAction: {
    label: 'Empezar proyecto',
    href: '/empezar-proyecto',
  },
  secondaryAction: {
    label: 'Cuentanos tu proyecto',
    href: '/empezar-proyecto',
  },
};
