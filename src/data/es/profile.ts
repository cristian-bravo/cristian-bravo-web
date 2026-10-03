import type { LinkActionContent, PageMetadata, SectionHeaderContent } from '../../types/content';
import { projectsPortfolioContent } from './projects';
import { serviceCards } from './services';

const allStickers = Array.from({ length: 24 }, (_, index) => `/stickers/sticker_${index + 1}.webp`);

const companionPets = [
  '/pet/cystem-pet.webp',
  '/pet/cystem-pet2.webp',
  '/pet/cystem-pet3.webp',
  '/pet/cystem-pet4.webp',
];

// Keep this existing profile selection stable as the full portfolio grows.
const profileProjectTitles = ['NY Campus Virtual', 'Fualtec', 'Alkosto', 'Plataformas educativas'];
const profileProjects = projectsPortfolioContent.groups
  .flatMap((group) => group.references)
  .filter((reference) => profileProjectTitles.includes(reference.title));
const publicProjects = profileProjects.map((reference) => reference.title);
const privateProjects = ['360IO', 'Club Guias'];

const projectDomains = Array.from(
  new Set(profileProjects.flatMap((reference) => reference.tags))
).slice(0, 9);

const serviceLabels = serviceCards.map((card) => card.title);

export type ProfileHeroQuickLinkIcon = 'cv' | 'linkedin' | 'github' | 'email';
export type ProfileHeroQuickLinkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ProfileDetailCardContent {
  title: string;
  description?: string;
  bullets?: string[];
  action?: LinkActionContent;
}

export interface ProfileHeroStatContent {
  label: string;
  value: string;
  detail: string;
}

export interface ProfileHeroQuickLinkContent {
  label: string;
  href: string;
  icon: ProfileHeroQuickLinkIcon;
  position: ProfileHeroQuickLinkPosition;
  ariaLabel: string;
  download?: boolean;
}

export interface ProfileHeroContent {
  kicker: string;
  title: string;
  lead: string;
  description: string;
  primaryAction: LinkActionContent;
  secondaryAction: LinkActionContent;
  quickLinks: ProfileHeroQuickLinkContent[];
  badges: string[];
  stats: ProfileHeroStatContent[];
  noteTitle: string;
  noteBody: string;
  floatingNotes: string[];
  floatingStickers: string[];
  videoKicker: string;
  videoTitle: string;
  videoDescription: string;
  videoTags: string[];
  lightMediaSrc: string;
  lightMediaPoster: string;
  darkMediaSrc: string;
  darkMediaPoster: string;
}

export interface ProfileAvatarContent {
  kicker: string;
  title: string;
  description: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
  traits: string[];
  stickers: string[];
  videoSrc: string;
  videoPoster: string;
}

export interface ProfileStoryPointContent {
  label: string;
  title: string;
  description: string;
  sticker: string;
}

export interface ProfileCompanionContent {
  src: string;
  alt: string;
  title: string;
  description: string;
}

export interface ProfileStoryContent {
  header: SectionHeaderContent;
  introTitle: string;
  introParagraphs: string[];
  originTitle: string;
  originParagraphs: string[];
  quote: string;
  quoteAuthor: string;
  points: ProfileStoryPointContent[];
  companions: ProfileCompanionContent[];
}

export interface ProfileExpertiseCardContent {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  sticker: string;
}

export interface ProfileExpertiseContent {
  header: SectionHeaderContent;
  cards: ProfileExpertiseCardContent[];
  serviceLabels: string[];
  projectLabels: string[];
  domainLabels: string[];
}

export interface ProfileStickerClusterContent {
  accent: string;
  label: string;
  title: string;
  description: string;
  stickers: string[];
}

export interface ProfileInterestsContent {
  header: SectionHeaderContent;
  narrativeTitle: string;
  narrativeParagraphs: string[];
  tags: string[];
  clusters: ProfileStickerClusterContent[];
}

export interface ProfileVisionColumnContent {
  title: string;
  items: string[];
  sticker: string;
}

export interface ProfileVisionContent {
  header: SectionHeaderContent;
  motto: string;
  mottoDetail: string;
  phraseColumn: ProfileVisionColumnContent;
  dreamsColumn: ProfileVisionColumnContent;
  goalsColumn: ProfileVisionColumnContent;
  ctaTitle: string;
  ctaDescription: string;
  primaryAction: LinkActionContent;
  secondaryAction: LinkActionContent;
  pet: ProfileCompanionContent;
}

export const profilePageMeta: PageMetadata = {
  title: 'Sobre mi | Cristian',
  description: 'Perfil profesional, enfoque tecnico y mundo creativo de Cristian Bravo en CYSTEMS.',
};

export const profileHeroContent: ProfileHeroContent = {
  kicker: 'Perfil profesional',
  title: 'Cristian Bravo',
  lead: 'Trabajo desarrollando plataformas, APIs y sistemas en producción, combinando desarrollo, arquitectura y criterio técnico.',
  description:
    'Me gusta entender el problema completo y construir soluciones claras, útiles y bien estructuradas.',
  primaryAction: {
    label: 'Hablemos de tu proyecto',
    href: '/empezar-proyecto',
  },
  secondaryAction: {
    label: 'Ver proyectos',
    href: '/proyectos',
  },
  quickLinks: [
    {
      label: 'Ver todos mis proyectos',
      href: 'https://github.com/cristian-bravo',
      icon: 'github',
      position: 'top-left',
      ariaLabel: 'Abrir perfil de GitHub de Cristian Bravo',
    },
    {
      label: 'Enviar un correo',
      href: 'mailto:cristianhbravo@outlook.es',
      icon: 'email',
      position: 'bottom-left',
      ariaLabel: 'Enviar correo a Cristian Bravo',
    },
    {
      label: 'Descargar mi CV',
      href: '/cv/Cristian_Bravo_Full_Stack_Developer_CV.pdf',
      icon: 'cv',
      position: 'top-right',
      ariaLabel: 'Descargar CV de Cristian Bravo en PDF',
      download: true,
    },
    {
      label: 'Ver mi perfil',
      href: 'https://www.linkedin.com/in/cristian-bravodev/',
      icon: 'linkedin',
      position: 'bottom-right',
      ariaLabel: 'Abrir LinkedIn de Cristian Bravo',
    },
  ],
  badges: [...serviceLabels, 'Frontend con identidad'],
  stats: [
    {
      label: 'Enfoque',
      value: 'Producto + sistemas',
      detail:
        'Cada decisión técnica está orientada a construir soluciones claras, funcionales y escalables.',
    },
    {
      label: 'Modo de trabajo',
      value: 'De la idea al sistema',
      detail:
        'Analizo, desarrollo, itero y mejoro cada solución dentro de entornos reales de producción.',
    },
    {
      label: 'Motor personal',
      value: 'Construir soluciones reales',
      detail:
        'Disfruto resolver problemas, estructurar sistemas y convertir complejidad en algo claro.',
    },
  ],
  noteTitle: 'Mi enfoque',
  noteBody:
  'Un resumen de cómo trabajo, los sistemas que he construido y la forma en que desarrollo soluciones reales.',
  floatingNotes: ['Código con criterio', 'UI clara', 'Siempre iterando', 'Sistemas que crecen', 'Arquitectura sólida'],
  floatingStickers: [allStickers[0], allStickers[5], allStickers[10], allStickers[15], allStickers[20]],
  videoKicker: 'Loop creativo',
  videoTitle: 'Movimiento, atmosfera y una interfaz con personalidad.',
  videoDescription:
    'El wallpaper marca el tono de esta pagina: tecnologia que comunica, frontend que se siente vivo y una estetica que no depende de plantillas genericas.',
  videoTags: ['Loop visual', 'Motion', 'UI expresiva', 'Frontend craft'],
  lightMediaSrc: '/wallpapers/videos/avatar_pets.mp4',
  lightMediaPoster: '/hero/yuki-light.png',
  darkMediaSrc: '/wallpapers/videos/avatar_clean.mp4',
  darkMediaPoster: '/hero/yuki-dark.png',
};

export const profileAvatarContent: ProfileAvatarContent = {
  kicker: 'SOBRE MÍ',
  title: 'Desarrollo soluciones full stack con enfoque en producto y escalabilidad',
  description:
    'Construyo plataformas en producción combinando desarrollo, diseño y criterio técnico.',
  role: 'Full Stack + Arquitectura + Producto',
  imageSrc: '/avatar/avatar_1.webp',
  imageAlt: 'Avatar de Cristian Bravo para la seccion de perfil',
  traits: ['Full Stack', 'Producto', 'Arquitectura', 'Escalabilidad','Sistemas'],
  stickers: [
    allStickers[1],
    allStickers[3],
    allStickers[6],
    allStickers[8],
    allStickers[11],
  ],
  videoSrc: '/wallpapers/klee/KleeWP.mp4',
  videoPoster: '/wallpapers/klee/preview.gif',
};

export const profileStoryContent: ProfileStoryContent = {
  header: {
    kicker: 'Sobre mí',
    title: 'El origen de CYSTEMS',
    description: '',
  },
  introTitle: 'La curiosidad fue el inicio',
  introParagraphs: [
    'Empecé programando para entender cómo funcionaban las cosas. Hoy sigo disfrutando ese proceso de descubrir y dar forma a una idea.',
  ],
  originTitle: 'Un camino propio',
  originParagraphs: [
    'CYSTEMS reúne mi crecimiento como desarrollador y el acompañamiento técnico a startups que necesitan empezar a construir.',
  ],
  quote: 'Solo quiero vivir de lo que me gusta: programar y construir.',
  quoteAuthor: 'Cristian',
  points: [
    {
      label: 'Identidad',
      title: 'Construir con intención',
      description:
        'Me gusta que cada proyecto tenga sentido y no sea solo código sin propósito.',
      sticker: allStickers[4],
    },
    {
      label: 'Criterio',
      title: 'Aprender y mejorar',
      description:
        'Siempre estoy buscando escribir mejor código y entender mejor lo que hago.',
      sticker: allStickers[7],
    },
    {
      label: 'Camino',
      title: 'Crecer constantemente',
      description:
        'CYSTEMS también es parte de mi crecimiento como desarrollador.',
      sticker: allStickers[9],
    },
  ],
  companions: [
    {
      src: companionPets[0],
      alt: 'Curiosidad',
      title: 'Curiosidad',
      description:
        'Siempre quiero entender más y aprender algo nuevo.',
    },
    {
      src: companionPets[1],
      alt: 'Detalle',
      title: 'Detalle',
      description:
        'Me gusta hacer las cosas bien, incluso en lo pequeño.',
    },
    {
      src: companionPets[2],
      alt: 'Iteración',
      title: 'Iteración',
      description:
        'Voy mejorando poco a poco, proyecto tras proyecto.',
    },
    {
      src: companionPets[3],
      alt: 'Motivación',
      title: 'Motivación',
      description:
        'Mi objetivo es claro: vivir de esto y seguir construyendo.',
    },
  ],
};

export const profileExpertiseContent: ProfileExpertiseContent = {
  header: {
    kicker: 'Mi trabajo',
    title: 'De la idea a producción',
    description:
      'Arquitectura, interfaces e integraciones que funcionan juntas.',
  },
  cards: [
    {
      badge: 'Planificación',
      title: 'Dar forma a la idea',
      description:
        'Convierto necesidades y procesos en un plan técnico viable.',
      bullets: [
        'Análisis de riesgos y prioridades.',
        'Arquitectura y entregas por fases.',
      ],
      sticker: allStickers[12],
    },
    {
      badge: 'Desarrollo',
      title: 'Conectar todo el sistema',
      description:
        'Integro frontend y backend en plataformas preparadas para evolucionar.',
      bullets: [
        'Dashboards, portales y comercio electrónico.',
        'APIs y automatización de procesos.',
      ],
      sticker: allStickers[14],
    },
    {
      badge: 'Operación',
      title: 'Cuidar la producción',
      description:
        'Mantengo los sistemas estables y acompaño sus siguientes mejoras.',
      bullets: [
        'VPS, dominios y SSL.',
        'Monitoreo y ajustes de rendimiento.',
      ],
      sticker: allStickers[17],
    },
  ],
  serviceLabels,
  projectLabels: [...publicProjects, ...privateProjects],
  domainLabels: projectDomains,
};

export const profileInterestsContent: ProfileInterestsContent = {
  header: {
    kicker: 'Gustos e influencias',
    title: 'Fuera del trabajo',
    description: '',
  },
  narrativeTitle: 'No todo es código',
  narrativeParagraphs: [
    'Me gusta mucho el anime y los videojuegos. Más allá de entretener, muchas veces me han enseñado sobre constancia, esfuerzo y seguir avanzando.',
    'También me gusta programar incluso fuera del trabajo. Para mí no es solo una obligación, es algo que realmente disfruto.',
  ],
  tags: ['Anime', 'Videojuegos', 'Cultura japonesa', 'LoL', 'Programación', 'Aprendizaje constante'],
  clusters: [
    {
      accent: 'rgba(124, 60, 255, 0.24)',
      label: 'Anime',
      title: 'Historias que inspiran',
      description:
        'Me atraen los personajes que perseveran ante lo imposible.',
      stickers: allStickers.slice(0, 6),
    },
    {
      accent: 'rgba(59, 130, 246, 0.24)',
      label: 'Gaming',
      title: 'Aprender jugando',
      description:
        'Disfruto competir, probar estrategias y aprender de cada partida.',
      stickers: allStickers.slice(6, 12),
    },
    {
      accent: 'rgba(244, 114, 182, 0.2)',
      label: 'Cultura',
      title: 'Atención al detalle',
      description:
        'De la cultura japonesa admiro la disciplina y el cuidado en lo cotidiano.',
      stickers: allStickers.slice(12, 18),
    },
    {
      accent: 'rgba(45, 212, 191, 0.2)',
      label: 'Código',
      title: 'Crear por gusto',
      description:
        'También programo en mi tiempo libre, sin que sea una obligación.',
      stickers: allStickers.slice(18, 24),
    },
  ],
};

export const profileVisionContent: ProfileVisionContent = {
  header: {
    kicker: 'Lo que viene',
    title: 'Seguir construyendo con CYSTEMS',
    description:
      'Mi siguiente reto es trabajar en sistemas de mayor escala.',
  },
  motto:
    'Si un sistema no se entiende, todavía no está bien hecho.',
  mottoDetail:
    'Esa idea guía mis decisiones, desde la arquitectura hasta la interfaz.',
  phraseColumn: {
    title: 'Lo que pienso',
    items: [
      'Prefiero algo simple que funcione bien antes que algo complejo sin sentido.',
      'Si un sistema no se entiende, todavía no está bien hecho.',
      'Programar es resolver problemas, no solo escribir código.',
      'Siempre hay una mejor forma de hacer las cosas.',
    ],
    sticker: allStickers[19],
  },
  dreamsColumn: {
    title: 'Lo que quiero lograr',
    items: [
      'Vivir completamente de la programación.',
      'Trabajar en sistemas cada vez más grandes y complejos.',
      'Seguir aprendiendo y subiendo mi nivel como desarrollador.',
    ],
    sticker: allStickers[20],
  },
  goalsColumn: {
    title: 'En lo que estoy ahora',
    items: [
      'Construyendo proyectos reales que me hagan crecer.',
      'Mejorando mi código y mi forma de pensar sistemas.',
      'Desarrollando CYSTEMS como parte de mi camino.',
    ],
    sticker: allStickers[22],
  },
  ctaTitle: '¿Construimos tu próxima idea?',
  ctaDescription: 'Cuéntame qué necesitas resolver.',
  primaryAction: {
    label: 'Empezar proyecto',
    href: '/empezar-proyecto',
  },
  secondaryAction: {
    label: 'Ver proyectos',
    href: '/proyectos',
  },
  pet: {
    src: companionPets[3],
    alt: 'Mascota acompañando la visión',
    title: 'Siguiente nivel',
    description: 'Siempre buscando mejorar y dar un paso más.',
  },
};
