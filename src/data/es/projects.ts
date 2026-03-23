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

export interface ProjectFeaturedHeroContent {
  variant:
    | 'edu-saas'
    | 'industrial-corporate'
    | 'retail-commerce'
    | 'academic-platform'
    | 'confidential-private';
  badge: string;
  subtitle?: string;
  shortDescription: string;
  tags?: string[];
  decorativeSrc?: string;
  decorativePlacement?: 'top-right' | 'center-right';
  statusPills?: string[];
  visualTone?: 'violet';
  forceDark: true;
}

export interface ProjectReferenceContent {
  title: string;
  description: string;
  visibility: string;
  tags: string[];
  gallery: ProjectGalleryItemContent[];
  actions?: ProjectActionContent[];
  featuredHero?: ProjectFeaturedHeroContent;
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
    caption: 'Sistema interno',
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
            'Campus virtual para gestion academica, aulas online y operacion institucional. Disenado para multiples roles, alta concurrencia y crecimiento sostenido.',
          visibility: 'Publico',
          tags: ['Aula virtual', 'Escalabilidad', 'Roles y permisos'],
          gallery: [
            {
              src: '/NY-Campus-Virtual/ny-campus-virtual-1.webp',
              alt: 'Vista principal institucional de NY Campus Virtual',
              caption: 'Portada institucional',
              variant: 'wide',
            },
            {
              src: '/NY-Campus-Virtual/ny-campus-virtual-2.webp',
              alt: 'Panel administrativo con roles y niveles de acceso',
              caption: 'Roles y accesos',
              variant: 'square',
            },
            {
              src: '/NY-Campus-Virtual/ny-campus-virtual-3.webp',
              alt: 'Aula virtual con contenido y progreso del estudiante',
              caption: 'Experiencia academica',
              variant: 'tall',
            },
          ],
          actions: [
            {
              label: 'Ver plataforma',
              href: 'https://nycampusvirtual.net/',
              variant: 'primary',
            },
          ],
          featuredHero: {
            variant: 'edu-saas',
            badge: 'EdTech / Instituto',
            shortDescription:
              'Campus virtual para gestion academica, aulas online y operacion institucional.\nDisenado para multiples roles, alta concurrencia y crecimiento sostenido.',
            decorativeSrc: '/NY-Campus-Virtual/ny-campus-virtual-fondo.webp',
            decorativePlacement: 'top-right',
            forceDark: true,
          },
        },
        {
          title: 'Fualtec',
          description:
            'Plataforma institucional y acceso seguro para clientes con documentacion tecnica centralizada y operacion empresarial confiable.',
          visibility: 'Publico',
          tags: ['Inspeccion NDT', 'Plataforma empresarial', 'Gestion documental', 'Seguridad'],
          gallery: [
            {
              src: '/projects/Fualtec/fualtec-1.webp',
              alt: 'Landing corporativa de Fualtec con enfoque en inspeccion industrial',
              caption: 'Landing industrial',
              variant: 'wide',
            },
            {
              src: '/projects/Fualtec/fualtec-2.webp',
              alt: 'Panel administrativo empresarial de Fualtec',
              caption: 'Panel empresarial',
              variant: 'square',
            },
            {
              src: '/projects/Fualtec/fualtec-3.webp',
              alt: 'Acceso de clientes al portal seguro de Fualtec',
              caption: 'Portal seguro',
              variant: 'tall',
            },
          ],
          actions: [
            {
              label: 'Ver proyecto',
              href: 'http://fualtec.com.ec/',
              variant: 'primary',
            },
            {
              label: 'Acceso clientes',
              href: 'http://fualtec.com.ec/client-access/login',
              variant: 'secondary',
            },
          ],
          featuredHero: {
            variant: 'industrial-corporate',
            badge: 'Industria / NDT',
            subtitle: 'Alta tecnologia aplicada a inspeccion industrial',
            shortDescription:
              'Portal institucional y acceso seguro para clientes con documentacion tecnica centralizada.\nDisenado para operaciones empresariales, trazabilidad y control confiable.',
            decorativeSrc: '/projects/Fualtec/fualtec-fondo.webp',
            decorativePlacement: 'center-right',
            forceDark: true,
          },
          githubUrl: 'https://github.com/cristian-bravo/fualtec-project',
        },
        {
          title: 'Alkosto',
          description:
            'E-commerce con banners promocionales, catalogo digital e integracion de productos para venta continua y operacion comercial escalable.',
          visibility: 'Publico',
          tags: ['E-commerce', 'Catalogo digital', 'Integracion productos', 'Escalabilidad'],
          gallery: [
            {
              src: '/projects/Alkosto/alkosto-1.webp',
              alt: 'Home comercial de Alkosto con banners y promociones',
              caption: 'Promociones retail',
              variant: 'wide',
            },
            {
              src: '/projects/Alkosto/alkosto-2.webp',
              alt: 'Catalogo digital de productos en Alkosto',
              caption: 'Catalogo digital',
              variant: 'square',
            },
            {
              src: '/projects/Alkosto/alkosto-3.webp',
              alt: 'Sistema de acceso administrativo de Alkosto',
              caption: 'Sistema comercial',
              variant: 'tall',
            },
          ],
          actions: [
            {
              label: 'Ver proyecto',
              href: 'https://alkostoec.com/',
              variant: 'primary',
            },
            {
              label: 'Ver catalogo',
              href: 'https://alkostoec.com/',
              variant: 'secondary',
            },
          ],
          featuredHero: {
            variant: 'retail-commerce',
            badge: 'E-commerce / Retail',
            subtitle: 'Plataforma de catalogo y ventas digitales',
            shortDescription:
              'E-commerce con banners promocionales, catalogo dinamico e integracion de productos.\nDisenado para conversion, surtido escalable y operacion comercial continua.',
            decorativeSrc: '/projects/Alkosto/alkosto-fondo.webp',
            decorativePlacement: 'center-right',
            forceDark: true,
          },
        },
        {
          title: 'Plataformas educativas',
          description:
            'Desarrollo de dos soluciones educativas: un sitio institucional para un colegio y una plataforma universitaria que incluye landing page, biblioteca digital y aula virtual administrada en Moodle, orientada a la gestión académica.',
          visibility: 'Publico',
          tags: [
            'Educacion digital',
            'Aula virtual',
            'Gestion academica',
            'Escalabilidad',
          ],
          gallery: [
            {
              src: '/projects/Education/edu-1.webp',
              alt: 'Vista institucional principal de la plataforma educativa',
              caption: 'Campus institucional',
              variant: 'wide',
            },
            {
              src: '/projects/Education/edu-2.webp',
              alt: 'Landing informativa de una plataforma academica',
              caption: 'Informacion academica',
              variant: 'square',
            },
            {
              src: '/projects/Education/edu-3.webp',
              alt: 'Acceso al sistema academico de la plataforma educativa',
              caption: 'Acceso al sistema',
              variant: 'tall',
            },
          ],
          actions: [
            {
              label: 'Colegio',
              href: 'https://unidadeducativacentebad.com',
              variant: 'primary',
            },
            {
              label: 'Instituto',
              href: 'https://institutotecnologiconuevaloja.com/',
              variant: 'secondary',
            },
            {
              label: 'Biblioteca',
              href: 'https://bibliotecas.institutotecnologiconuevaloja.com/login',
              variant: 'secondary',
            },
          ],
          featuredHero: {
            variant: 'academic-platform',
            badge: 'Plataforma educativa / Campus virtual',
            subtitle: 'Gestion academica y aula virtual',
            shortDescription:
              'Gestion educativa, aula virtual y acceso institucional en una sola plataforma.\nPreparada para campus digital, biblioteca y crecimiento academico.',
            decorativeSrc: '/projects/Education/edu-fondo.webp',
            decorativePlacement: 'center-right',
            forceDark: true,
          },
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
          featuredHero: {
            variant: 'confidential-private',
            badge: 'Proyecto privado / Confidencial',
            subtitle: 'Sistema de integraciones empresariales',
            shortDescription:
              'Participacion en desarrollo de integraciones seguras en entorno empresarial.\nEnfocado en comunicacion entre sistemas, APIs y automatizacion de procesos.',
            tags: ['Integraciones', 'Backend', 'Seguridad', 'APIs', 'Automatizacion'],
            statusPills: ['Proyecto confidencial', 'Acceso restringido'],
            forceDark: true,
          },
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
          featuredHero: {
            variant: 'confidential-private',
            badge: 'Proyecto privado / Confidencial',
            subtitle: 'Plataforma web comercial y gestion digital',
            shortDescription:
              'Trabajo sobre un entorno web privado con enfoque en operacion editorial, integraciones y continuidad tecnica.\nImplementado con mantenimiento evolutivo, automatizaciones y acceso restringido.',
            tags: ['WordPress', 'Integraciones', 'SEO tecnico', 'Automatizacion', 'Mantenimiento'],
            statusPills: ['Proyecto confidencial', 'Acceso restringido'],
            visualTone: 'violet',
            forceDark: true,
          },
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
