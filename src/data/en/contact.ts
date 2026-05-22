import type { ContactOverviewContent } from '../es/contact';
import type { PageMetadata } from '../../types/content';

export const contactPageMeta: PageMetadata = {
  title: 'Contact | CYSTEMS',
  description: 'Contact channels for strategic proposals, support and partnerships.',
};

export const contactOverviewContent: ContactOverviewContent = {
  header: {
    kicker: 'Contact',
    title: 'Let’s talk about your next project',
    description:
      'Write for strategic proposals, support or partnerships. We can coordinate discovery and consulting sessions.',
  },
  badges: ['Fast response', 'Confidentiality', 'Results-focused'],
  emailLabel: 'Email',
  emailValue: 'cristianhbravo@outlook.es',
  panelDescription: 'Schedule executive meetings and discovery sessions with CYSTEMS.',
  primaryAction: {
    label: 'Start a project',
    href: '/en/empezar-proyecto',
  },
  secondaryAction: {
    label: 'View profile',
    href: '/en/perfil/cristian-bravo',
  },
};
