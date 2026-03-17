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

const publicProjects =
  projectsPortfolioContent.groups.find((group) => group.title.toLowerCase().includes('public'))?.references.map(
    (reference) => reference.title
  ) ?? [];

const privateProjects =
  projectsPortfolioContent.groups.find((group) => group.title.toLowerCase().includes('privad'))?.references.map(
    (reference) => reference.title
  ) ?? [];

const projectDomains = Array.from(
  new Set(projectsPortfolioContent.groups.flatMap((group) => group.references.flatMap((reference) => reference.tags)))
).slice(0, 9);

const serviceLabels = serviceCards.map((card) => card.title);

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

export interface ProfileHeroContent {
  kicker: string;
  title: string;
  lead: string;
  description: string;
  primaryAction: LinkActionContent;
  secondaryAction: LinkActionContent;
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
  videoSrc: string;
  videoPoster: string;
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
  videoSrc: '/wallpapers/sakura/saved_resource.html',
  videoPoster: '/wallpapers/sakura/preview.jpg',
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
    title: 'Quién soy y cómo nace CYSTEMS',
    description:
      'CYSTEMS nace de mi amor por la programación, de mis ganas de aprender, mejorar y construir algo propio a partir de eso.',
  },
  introTitle: 'Programar es más que código para mí',
  introParagraphs: [
    'Empecé con curiosidad por entender cómo funcionan las cosas, y con el tiempo se volvió una pasión.',
    'Hoy programar es mi forma de construir, de aprender constantemente y de convertir ideas en algo real.',
  ],
  originTitle: 'CYSTEMS es parte de ese camino',
  originParagraphs: [
    'No nace como una empresa tradicional, sino como una forma de crecer como desarrollador y vivir de esto.',
    'También es una solución para startups: acompañamiento técnico desde cero, ayudando a construir sistemas reales paso a paso.',
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
      alt: 'Curiosidad constante',
      title: 'Curiosidad constante',
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
      title: 'Iterar y mejorar',
      description:
        'Voy mejorando poco a poco, proyecto tras proyecto.',
    },
    {
      src: companionPets[3],
      alt: 'Motivación',
      title: 'Motivación real',
      description:
        'Mi objetivo es claro: vivir de esto y seguir construyendo.',
    },
  ],
};

export const profileExpertiseContent: ProfileExpertiseContent = {
  header: {
    kicker: 'Perfil profesional',
    title: 'Lo que he construido y donde genero valor',
    description:
      'He trabajado desde el análisis y la arquitectura hasta la interfaz, las integraciones y la operación que sostiene cada sistema en producción.',
  },
  cards: [
    {
      badge: 'Enfoque y estructura',
      title: 'Ordeno ideas, procesos y decisiones',
      description:
        'Cuando un proyecto inicia sin claridad, lo transformo en una hoja de ruta técnica y de producto coherente y viable.',
      bullets: [
        'Revisión técnica y de producto para identificar riesgos, fricciones y oportunidades.',
        'Definición de roadmaps por fases que permiten avanzar sin improvisar.',
        'Decisiones de arquitectura alineadas a objetivos, contexto y crecimiento.',
      ],
      sticker: allStickers[12],
    },
    {
      badge: 'Plataformas y sistemas',
      title: 'Construyo soluciones pensadas para crecer',
      description:
        'Desarrollo sistemas en producción donde frontend, backend y arquitectura trabajan de forma clara, modular y escalable.',
      bullets: [
        `Proyectos reales que respaldan este enfoque: ${publicProjects.join(', ')}.`,
        'Experiencia en dashboards, portales de gestión y plataformas digitales.',
        'Integraciones con APIs, automatización y estructuras preparadas para evolución.',
      ],
      sticker: allStickers[14],
    },
    {
      badge: 'Evolución y soporte',
      title: 'Acompaño el sistema en producción',
      description:
        'Me enfoco en la estabilidad, mejora continua y evolución del sistema una vez que está en funcionamiento.',
      bullets: [
        'Configuración de VPS, dominios, SSL y entornos productivos con criterio técnico.',
        'Monitoreo, ajustes y mejoras para mantener rendimiento y estabilidad.',
        `Participación en iniciativas como ${privateProjects.join(', ')}.`,
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
    title: 'Lo que también forma parte de mí',
    description:
      'El anime, los videojuegos y la cultura japonesa influyen en cómo pienso, aprendo y construyo.',
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
        'El anime me gusta porque transmite crecimiento, disciplina y metas que parecen imposibles.',
      stickers: allStickers.slice(0, 6),
    },
    {
      accent: 'rgba(59, 130, 246, 0.24)',
      label: 'Gaming',
      title: 'Competir y mejorar',
      description:
        'Los videojuegos forman parte de cómo pienso: aprender, equivocarme y seguir mejorando.',
      stickers: allStickers.slice(6, 12),
    },
    {
      accent: 'rgba(244, 114, 182, 0.2)',
      label: 'Cultura',
      title: 'Disciplina y constancia',
      description:
        'La cultura japonesa me inspira por su enfoque en la mejora continua y el detalle.',
      stickers: allStickers.slice(12, 18),
    },
    {
      accent: 'rgba(45, 212, 191, 0.2)',
      label: 'Código',
      title: 'Programar como hobby',
      description:
        'Incluso fuera del trabajo sigo programando. Es algo que me gusta de verdad.',
      stickers: allStickers.slice(18, 24),
    },
  ],
};

export const profileVisionContent: ProfileVisionContent = {
  header: {
    kicker: 'Visión',
    title: 'Hacia dónde quiero llegar',
    description:
      'Quiero seguir creciendo como desarrollador, construir mejores sistemas y poder vivir completamente de esto.',
  },
  motto:
    'Mi meta no es solo entregar software, sino construir sistemas que ayuden a crecer y demuestren que la tecnología también puede tener alma.',
  mottoDetail:
    'CYSTEMS también es parte de ese camino. Un proyecto que crece conmigo mientras aprendo, construyo y gano experiencia real.',
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
  ctaTitle: 'Si tienes una idea o proyecto, podemos construirlo.',
  ctaDescription:
    'Me interesa trabajar en cosas reales donde pueda aportar, aprender y seguir creciendo como desarrollador.',
  primaryAction: {
    label: 'Empezar',
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
