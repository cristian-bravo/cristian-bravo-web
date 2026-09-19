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
  title: 'Conversemos sobre tu proyecto | CYSTEMS Ecuador',
  description: 'Cuéntanos qué necesita tu empresa. Contacta a CYSTEMS para desarrollar software, automatizar procesos, integrar IA o recuperar un sistema existente.',
};

export const contactOverviewContent: ContactOverviewContent = {
  header: {
    kicker: 'Contacto',
    title: 'Hablemos sobre tu próximo proyecto',
    description:
      'Cuéntanos qué quieres construir o qué debería funcionar mejor. Revisamos tu contexto y definimos contigo el siguiente paso.',
  },
  badges: ['Respuestas rápidas', 'Confidencialidad', 'Enfoque en resultados'],
  emailLabel: 'Email',
  emailValue: 'cristianhbravo@outlook.es',
  panelDescription: 'Una conversación directa sobre tu negocio, tus usuarios y el problema que necesitas resolver.',
  primaryAction: {
    label: 'Empezar proyecto',
    href: '/empezar-proyecto',
  },
  secondaryAction: {
    label: 'Ver perfil',
    href: '/perfil/cristian-bravo',
  },
};
