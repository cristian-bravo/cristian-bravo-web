import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../../types/content';

export type ProjectGalleryItemVariant = 'wide' | 'square' | 'tall';

export interface ProjectGalleryItemContent {
  src?: string;
  alt: string;
  caption: string;
  variant?: ProjectGalleryItemVariant;
}

export interface ProjectActionContent {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

export interface ProjectReferenceContent {
  title: string;
  description: string;
  visibility: string;
  tags: string[];
  gallery: ProjectGalleryItemContent[];
  actions?: ProjectActionContent[];
  githubUrl?: string;
  isConfidential?: boolean;
  confidentialLabel?: string;
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
  title?: string;
  action?: LinkActionContent;
  cards?: Array<{
    title: string;
    description?: string;
    action: LinkActionContent;
  }>;
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
    title: 'Proyectos desarrollados',
    description:
      'Desarrollo plataformas web empresariales, educativas y de comercio electrónico, orientadas a resolver necesidades reales de operación y gestión.',
  },
  heroAvatar: {
    label: 'Cristian Bravo',
    caption: 'Digital Systems Portfolio',
    imageSrc: '/avatar/avatar_HD2.webp',
    imageAlt: 'Avatar principal para la portada del portafolio',
  },
  groups: [
    {
      title: 'Proyectos públicos',
      references: [
        {
          title: 'NY Campus Virtual',
          description:
            'Plataforma educativa completa con múltiples niveles de acceso (administrativo, docente y estudiante). Incluye aula virtual, gestión académica y automatización de procesos internos. Actualmente soporta más de 50.000 usuarios y está diseñada con proyección de crecimiento y escalabilidad.',
          visibility: 'Publico',
          tags: ['EdTech', 'Escalabilidad', 'Aula virtual', 'Automatización'],
          gallery: [
            SHARED_PUBLIC_GALLERY[2],
            SHARED_PUBLIC_GALLERY[0],
            SHARED_PUBLIC_GALLERY[1],
          ],
          actions: [
            {
              label: 'Ver proyecto',
              href: 'https://nycampusvirtual.net/',
              variant: 'primary',
            },
          ],
        },
        {
          title: 'Fualtec',
          description:
            'Desarrollo de un ecosistema corporativo compuesto por una landing institucional y un portal privado para clientes. En este portal, los usuarios pueden acceder de forma segura a su documentación técnica, permitiendo centralizar la información y mejorar la gestión documental dentro de la empresa.',
          visibility: 'Publico',
          tags: ['B2B', 'Portal clientes', 'Documentos', 'Seguridad'],
          gallery: SHARED_PUBLIC_GALLERY,
          actions: [
            {
              label: 'Ver sitio',
              href: 'http://fualtec.com.ec/',
              variant: 'primary',
            },
            {
              label: 'Acceso clientes',
              href: 'http://fualtec.com.ec/client-access/login',
              variant: 'secondary',
            },
          ],
          githubUrl: 'https://github.com/cristian-bravo/fualtec-project',
        },
        {
          title: 'Alkosto',
          description:
            'Implementación de dos sistemas complementarios: una plataforma administrativa para la gestión de productos e inventario, y una plataforma pública para la publicación de estos productos en un entorno e-commerce. Ambos sistemas se encuentran integrados para mantener coherencia en la información y facilitar la operación diaria.',
          visibility: 'Publico',
          tags: ['E-commerce', 'Inventario', 'Integración', 'APIs'],
          gallery: [
            SHARED_PUBLIC_GALLERY[1],
            SHARED_PUBLIC_GALLERY[0],
            SHARED_PUBLIC_GALLERY[2],
          ],
          actions: [
            {
              label: 'Ver sitio',
              href: 'http://alkostoec.com/',
              variant: 'primary',
            },
            {
              label: 'Panel administrativo',
              href: 'https://inventario.alkostoec.com/admin',
              variant: 'secondary',
            },
          ],
        },
        {
          title: 'Plataformas educativas',
          description:
            'Desarrollo de dos soluciones educativas: un sitio institucional para un colegio y una plataforma universitaria que incluye landing page, biblioteca digital y aula virtual administrada en Moodle, orientada a la gestión académica.',
          visibility: 'Publico',
          tags: ['EdTech', 'Moodle', 'Biblioteca', 'Landing'],
          gallery: SHARED_PUBLIC_GALLERY,
          actions: [
            {
              label: 'Ver colegio',
              href: 'https://unidadeducativacentebad.com',
              variant: 'primary',
            },
            {
              label: 'Ver instituto',
              href: 'https://institutotecnologiconuevaloja.com/',
              variant: 'secondary',
            },
            {
              label: 'Acceso biblioteca',
              href: 'https://bibliotecas.institutotecnologiconuevaloja.com/login',
              variant: 'secondary',
            },
          ],
        },
      ],
    },
    {
      title: 'Proyectos privados (menciones)',
      description:
        'Algunos proyectos no pueden mostrarse públicamente por acuerdos de confidencialidad, pero se mencionan de forma general para reflejar la experiencia adquirida.',
      references: [
        {
          title: '360IO',
          description:
            'Participación en un proyecto de integraciones empresariales dentro de un entorno seguro para una empresa estadounidense. Trabajo en equipo bajo metodologías ágiles, enfocado en la comunicación entre sistemas y la automatización de procesos.',
          visibility: 'Privado',
          tags: ['Integraciones', 'Ágil', 'Backend', 'Seguridad'],
          gallery: confidentialGallery('360 Integration'),
          isConfidential: true,
          confidentialLabel: 'Proyecto confidencial',
        },
        {
          title: 'Club Guias',
          description:
            'Primer proyecto profesional, orientado a una empresa de publicidad. Desarrollo de sitios web comerciales utilizando WordPress, con enfoque en posicionamiento SEO y presencia digital para distintos clientes.',
          visibility: 'Privado',
          tags: ['WordPress', 'SEO', 'Web comercial', 'Marketing'],
          gallery: confidentialGallery('Club Guias'),
          isConfidential: true,
          confidentialLabel: 'Proyecto confidencial',
        },
      ],
    },
  ],
  finalCta: {
    kicker: 'Siguiente paso',
    title: '¿Tienes una idea o proyecto en mente?',
    action: {
      label: 'Empezar proyecto',
      href: '/empezar-proyecto',
    },
    cards: [
      {
        title: 'Explora mi codigo y proyectos publicos',
        description: 'Revisa repositorios, codigo compartido y proyectos abiertos publicados en GitHub.',
        action: {
          label: 'Ir a GitHub',
          href: 'https://github.com/cristian-bravo',
        },
      },
      {
        title: 'Construyamos algo juntos',
        description: 'Si tienes una idea, una plataforma o una mejora pendiente, podemos convertirla en un producto real.',
        action: {
          label: 'Empezar proyecto',
          href: '/empezar-proyecto',
        },
      },
    ],
  },
};
