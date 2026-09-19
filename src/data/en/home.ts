import type {
  HomeHeroContent,
  HomeMethodContent,
  HomeNextStepContent,
  HomeServicesPreviewContent,
} from '../es/home';
import type { PageMetadata } from '../../types/content';

export const homePageMeta: PageMetadata = {
  title: 'CYSTEMS | Software development and business platforms',
  description:
    'Web development, software architecture and custom systems for companies that need reliable technology to grow.',
};

export const homeHeroContent: HomeHeroContent = {
  kicker: 'CYSTEMS - Cristian Bravo',
  title: 'Professional software to operate and sell better',
  subtitle:
    'I design and build web platforms, APIs and internal systems with business focus, performance and scalability.',
  primaryAction: {
    label: 'Start a project',
    href: '/en/empezar-proyecto',
  },
  secondaryAction: {
    label: 'See case studies',
    href: '/en/proyectos',
  },
  focusLabel: 'Focus',
  focusValue: 'Architecture, product and automation connected to your goals',
  deliveryLabel: 'Delivery',
  deliveryValue: 'Clear implementation, support and continuous improvement',
  backgroundMediaSrc: '/logos/logo-header-ligth.webp',
  backgroundMediaPoster: '/wallpapers/sakura/preview.jpg',
  lightImageSrc: '/hero/yuki-light.png',
  lightImageAlt: 'Main digital platform view in light mode',
  darkImageSrc: '/hero/yuki-dark.png',
  visualKicker: 'Brand + engineering',
  visualTitle: 'CYSTEMS as the technical partner for your company',
  visualTags: ['Custom software', 'Integrations', 'Stable operations'],
};

export const homeServicesPreviewContent: HomeServicesPreviewContent = {
  header: {
    kicker: 'Services',
    title: 'Services that turn processes into reliable platforms',
    description:
      'From a commercial website to an internal system, the goal is to deliver clear, measurable technology ready to sell.',
  },
  cards: [
    {
      title: 'Cloud architecture & DevOps',
      description: 'Infrastructure prepared to operate, scale and deploy with less risk.',
    },
    {
      title: 'Product development',
      description: 'Platforms focused on experience, performance and business growth.',
    },
    {
      title: 'Automation and integrations',
      description: 'Systems, data and tools connected into workflows that support better decisions.',
    },
  ],
  cta: {
    label: 'Explore all services',
    href: '/en/servicios',
  },
  ctaIcon: '->',
};

export const homeMethodContent: HomeMethodContent = {
  header: {
    kicker: 'Method',
    title: 'A serious process for building without guesswork',
    description: 'Discovery, architecture, development and continuous operation to reduce risk and accelerate results.',
  },
  steps: [
    {
      title: 'Strategic diagnosis',
      description: 'We define architecture and roadmap according to your business goals.',
    },
    {
      title: 'Design and execution',
      description: 'The platform is built through iterative delivery and clear visibility.',
    },
    {
      title: 'Continuous operation',
      description: 'We operate, measure and improve so the system keeps evolving.',
    },
  ],
};

export const homeNextStepContent: HomeNextStepContent = {
  header: {
    kicker: 'Next step',
    title: 'Let’s talk about the solution your company needs',
    description: 'Share your context and I will respond with a clear path forward.',
  },
  primaryAction: {
    label: 'Start a project',
    href: '/en/empezar-proyecto',
  },
  secondaryAction: {
    label: 'Tell me about your project',
    href: '/en/empezar-proyecto',
  },
};
