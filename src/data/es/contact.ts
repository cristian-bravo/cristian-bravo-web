import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../../types/content';

export interface ContactOverviewContent {
  header: SectionHeaderContent;
  badges: string[];
  emailLabel: string;
  emailValue: string;
  panelDescription: string;
  primaryAction: LinkActionContent;
  secondaryAction: LinkActionContent;
}

export const contactPageMeta: PageMetadata = {
  title: 'Contacto | CYSTEMS',
  description: 'Canales de contacto para propuestas estratégicas, soporte y alianzas.',
};

export const contactOverviewContent: ContactOverviewContent = {
  header: {
    kicker: 'Contacto',
    title: 'Hablemos sobre tu próximo proyecto',
    description:
      'Escríbenos para propuestas estratégicas, soporte o alianzas. Coordinamos sesiones de discovery y consultoría.',
  },
  badges: ['Respuestas rápidas', 'Confidencialidad', 'Enfoque en resultados'],
  emailLabel: 'Email',
  emailValue: 'cristianhbravo@outlook.es',
  panelDescription: 'Agenda reuniones ejecutivas y sesiones de discovery con el equipo CYSTEMS.',
  primaryAction: {
    label: 'Empezar proyecto',
    href: '/empezar-proyecto',
  },
  secondaryAction: {
    label: 'Ver perfil',
    href: '/perfil/cristian-bravo',
  },
};
