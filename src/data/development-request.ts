import type { PageMetadata, SectionHeaderContent } from '../types/content';
import type { ContactFormContent } from '../types/forms';

export interface DevelopmentRequestContent {
  header: SectionHeaderContent;
  recommendationsTitle: string;
  recommendations: string[];
  form: ContactFormContent;
}

export const developmentRequestPageMeta: PageMetadata = {
  title: 'Solicitar desarrollo | CYSTEMS',
  description: 'Formulario de inicio de proyecto para definir alcance, objetivos e implementación.',
};

export const developmentRequestContent: DevelopmentRequestContent = {
  header: {
    kicker: 'Inicio de proyecto',
    title: 'Solicitar desarrollo',
    description:
      'Comparte la necesidad de tu empresa. Diseñamos un plan de implementación y despliegue alineado con tus objetivos.',
  },
  recommendationsTitle: 'Información recomendada',
  recommendations: [
    'Objetivos de negocio y métricas clave.',
    'Plazos, alcance y equipos involucrados.',
    'Integraciones actuales o sistemas críticos.',
  ],
  form: {
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo',
    emailPlaceholder: 'correo@empresa.com',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Cuéntanos sobre tu proyecto',
    helperText: 'Te respondemos con una propuesta inicial en 24-48 horas hábiles.',
    submitLabel: 'Enviar solicitud',
  },
};
