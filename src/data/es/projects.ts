import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../../types/content';

export type ProjectGalleryItemVariant = 'wide' | 'square' | 'tall';

export interface ProjectGalleryItemContent {
  src?: string;
  alt: string;
  caption: string;
  variant?: ProjectGalleryItemVariant;
}

export interface ProjectReferenceContent {
  title: string;
  description: string;
  visibility: string;
  tags: string[];
  gallery: ProjectGalleryItemContent[];
  isConfidential?: boolean;
  confidentialLabel?: string;
  /** URL del sitio en produccion (se muestra sobre la imagen) */
  productionUrl?: string;
  /** URL del repositorio en GitHub (se muestra bajo la imagen) */
  repoUrl?: string;
  /** Si es true, el repo es privado: muestra "GitHub privado" sin enlace */
  isPrivateRepo?: boolean;
}

export interface ProjectGroupContent {
  title: string;
  description?: string;
  references: ProjectReferenceContent[];
}

export interface ProjectsHeroAvatarContent {
  label: string;
  caption: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface ProjectsFinalCtaContent {
  kicker: string;
  title: string;
  action: LinkActionContent;
}

export interface ProjectsPortfolioContent {
  intro: SectionHeaderContent;
  heroAvatar: ProjectsHeroAvatarContent;
  groups: ProjectGroupContent[];
  finalCta: ProjectsFinalCtaContent;
}

const SHARED_PUBLIC_GALLERY: ProjectGalleryItemContent[] = [
  {
    src: '/hero/yuki-light.png',
    alt: 'Vista de dashboard en modo claro',
    caption: 'Dashboard operativo',
    variant: 'wide',
  },
  {
    src: '/hero/yuki-light2.png',
    alt: 'Vista secundaria de interfaz de plataforma',
    caption: 'Flujos de gestion',
    variant: 'square',
  },
  {
    src: '/hero/yuki-dark.png',
    alt: 'Vista de plataforma en modo oscuro',
    caption: 'Monitoreo y datos',
    variant: 'tall',
  },
];

const confidentialGallery = (domain: string): ProjectGalleryItemContent[] => [
  {
    alt: `Vista protegida de ${domain}`,
    caption: 'Arquitectura confidencial',
    variant: 'wide',
  },
  {
    alt: `Modulo privado de ${domain}`,
    caption: 'Integraciones seguras',
    variant: 'square',
  },
  {
    alt: `Panel privado de ${domain}`,
    caption: 'Operacion interna',
    variant: 'tall',
  },
];

export const projectsPageMeta: PageMetadata = {
  title: 'Proyectos | CYSTEMS',
  description: 'Portafolio de proyectos publicos y referencias privadas con foco empresarial.',
};

export const projectsPortfolioContent: ProjectsPortfolioContent = {
  intro: {
    kicker: 'Portafolio',
    title: 'Proyectos con impacto real',
    description:
      'Casos publicos y menciones confidenciales que reflejan experiencia en plataformas empresariales.',
  },
  heroAvatar: {
    label: 'Cristian Bravo',
    caption: 'Digital Systems Portfolio',
    imageSrc: '/avatar/avatar_HD2.webp',
    imageAlt: 'Avatar principal para la portada del portafolio',
  },
  groups: [
    {
      title: 'Proyectos publicos',
      references: [
        {
          title: 'Fualtec',
          description: 'Plataforma digital para procesos industriales y operaciones B2B.',
          visibility: 'Publico',
          tags: ['B2B', 'Operacion', 'Dashboard', 'Escalabilidad'],
          gallery: SHARED_PUBLIC_GALLERY,
          productionUrl: 'https://fualtec.com',
          repoUrl: 'https://github.com/cristian-bravo/fualtec',
        },
        {
          title: 'Alkosto',
          description: 'Integraciones de catalogo y experiencia de compra omnicanal.',
          visibility: 'Publico',
          tags: ['E-commerce', 'Catalogo', 'Integraciones', 'UX'],
          gallery: [
            SHARED_PUBLIC_GALLERY[1],
            SHARED_PUBLIC_GALLERY[0],
            SHARED_PUBLIC_GALLERY[2],
          ],
          productionUrl: 'https://alkosto.com',
          repoUrl: 'https://github.com/cristian-bravo/alkosto-integration',
        },
        {
          title: 'NYProject',
          description: 'Portal de proyectos con indicadores de avance en tiempo real.',
          visibility: 'Publico',
          tags: ['PMO', 'KPIs', 'Tiempo real', 'Colaboracion'],
          gallery: [
            SHARED_PUBLIC_GALLERY[2],
            SHARED_PUBLIC_GALLERY[0],
            SHARED_PUBLIC_GALLERY[1],
          ],
          productionUrl: 'https://nyproject.app',
          repoUrl: 'https://github.com/cristian-bravo/nyproject',
        },
      ],
    },
    {
      title: 'Proyectos privados (menciones)',
      description:
        'Por acuerdos de confidencialidad, compartimos solo una referencia general de estos trabajos.',
      references: [
        {
          title: '360 Integration',
          description: 'Integraciones empresariales de alto volumen para multiples unidades de negocio.',
          visibility: 'Privado',
          tags: ['ETL', 'APIs', 'Automatizacion', 'Alta disponibilidad'],
          gallery: confidentialGallery('360 Integration'),
          isConfidential: true,
          confidentialLabel: 'Proyecto confidencial',
          isPrivateRepo: true,
        },
        {
          title: 'Club Guias',
          description: 'Ecosistema privado para fidelizacion y contenido especializado.',
          visibility: 'Privado',
          tags: ['Contenido', 'Comunidad', 'Membresias', 'Backend'],
          gallery: confidentialGallery('Club Guias'),
          isConfidential: true,
          confidentialLabel: 'Proyecto confidencial',
          isPrivateRepo: true,
        },
        {
          title: 'Plataformas educativas',
          description: 'Suite privada para formacion, analitica y seguimiento academico.',
          visibility: 'Privado',
          tags: ['EdTech', 'Analitica', 'Roles', 'Escala'],
          gallery: confidentialGallery('Plataformas educativas'),
          isConfidential: true,
          confidentialLabel: 'Proyecto confidencial',
          isPrivateRepo: true,
        },
      ],
    },
  ],
  finalCta: {
    kicker: 'Siguiente paso',
    title: 'Listo para transformar tu idea en una plataforma real?',
    action: {
      label: 'Empezar proyecto',
      href: '/empezar-proyecto',
    },
  },
};
