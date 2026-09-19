import type { Lang, ServiceCardContent, ServicesModalContent } from './index';

export const getAdditionalServices = (
  lang: Lang,
): { cards: ServiceCardContent[]; modals: ServicesModalContent[] } => {
  const en = lang === 'en';
  const entries = en
    ? [
        {
          id: 'mvp',
          title: 'MVPs for startups',
          description:
            'Turn an idea into a focused first product you can test with users.',
          bullets: [
            'Prioritize the core problem and user journey.',
            'Build a usable first release with a defined scope.',
            'Gather feedback and plan the next iteration.',
          ],
        },
        {
          id: 'ia',
          title: 'AI and automation',
          description:
            'Assistants, document search and workflows connected to your business systems.',
          bullets: [
            'Identify a use case and the data it actually needs.',
            'Integrate assistants, retrieval and document processing.',
            'Define access controls, evaluation and human review.',
          ],
        },
        {
          id: 'rescate',
          title: 'Software recovery',
          description:
            'Recover an unfinished project or resolve errors in a system already in use.',
          bullets: [
            'Review architecture, dependencies and production issues.',
            'Prioritize security, stability and critical workflows.',
            'Create a repair plan with verifiable deliveries.',
          ],
        },
      ]
    : [
        {
          id: 'mvp',
          title: 'MVP para startups',
          description:
            'Transforma una idea en un primer producto concreto para validar con usuarios.',
          bullets: [
            'Priorizamos el problema principal y el recorrido del usuario.',
            'Construimos una primera versión utilizable con alcance definido.',
            'Recogemos feedback y planificamos la siguiente iteración.',
          ],
        },
        {
          id: 'ia',
          title: 'IA y automatización',
          description:
            'Asistentes, búsqueda en documentos y flujos conectados con los sistemas de tu empresa.',
          bullets: [
            'Identificamos el caso de uso y los datos que realmente necesita.',
            'Integramos asistentes, búsqueda y procesamiento de documentos.',
            'Definimos permisos, evaluación y revisión humana.',
          ],
        },
        {
          id: 'rescate',
          title: 'Rescate de software',
          description:
            'Recupera un proyecto incompleto o resuelve errores de un sistema que ya utilizas.',
          bullets: [
            'Revisamos arquitectura, dependencias y problemas en producción.',
            'Priorizamos seguridad, estabilidad y procesos críticos.',
            'Definimos un plan de reparación con entregas verificables.',
          ],
        },
      ];
  return {
    cards: entries.map((entry) => ({
      title: entry.title,
      description: entry.description,
      modalId: `modal-${entry.id}`,
    })),
    modals: entries.map((entry) => ({
      id: `modal-${entry.id}`,
      kicker: 'CYSTEMS',
      title: entry.title,
      description: entry.description,
      bullets: entry.bullets,
      actionLabel: en ? 'Tell us what you need' : 'Cuéntanos qué necesitas',
      actionHref: en ? '/en/empezar-proyecto' : '/empezar-proyecto',
      closeLabel: en ? 'Close' : 'Cerrar',
    })),
  };
};
