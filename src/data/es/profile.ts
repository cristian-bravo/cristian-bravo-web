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
  title: 'Perfil | Cristian Bravo',
  description: 'Perfil profesional, enfoque tecnico y mundo creativo de Cristian Bravo en CYSTEMS.',
};

export const profileHeroContent: ProfileHeroContent = {
  kicker: 'Perfil profesional',
  title: 'Cristian Bravo',
  lead: 'Desarrollador, estratega digital y frontend builder con gusto real por programar, pulir interfaces y convertir ideas en sistemas utiles.',
  description:
    'Trabajo uniendo producto, UI, arquitectura y acompanamiento continuo para que cada proyecto tenga claridad de negocio, buena experiencia y una identidad propia.',
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
      value: 'Producto + negocio',
      detail: 'Cada decision tecnica y visual debe ayudar a entender, vender y operar mejor.',
    },
    {
      label: 'Modo de trabajo',
      value: 'De la idea al deploy',
      detail: 'Consultoria, construccion, iteracion y soporte dentro del mismo acompanamiento.',
    },
    {
      label: 'Motor personal',
      value: 'Programar me gusta de verdad',
      detail: 'Disfruto resolver problemas, ordenar procesos y convertir complejidad en algo claro.',
    },
  ],
  noteTitle: 'Lo que vas a encontrar aqui',
  noteBody:
    'Una version mas completa de mi perfil: lo que he construido, lo que me inspira, como nace CYSTEMS y hacia donde quiero llevar esta vision.',
  floatingNotes: ['Codigo con criterio', 'UI con atmosfera', 'Siempre iterando', 'Sistemas que crecen'],
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
  kicker: 'Mi avatar',
  title: 'Una presencia visual que conecta lo tecnico con lo creativo',
  description:
    'Debajo del hero quise dejar una presentacion mas personal. No solo lo que hago, sino tambien la energia con la que construyo: frontend, direccion visual y criterio tecnico trabajando juntos.',
  role: 'Frontend + estrategia + identidad visual',
  imageSrc: '/avatar/avatar_1.webp',
  imageAlt: 'Avatar de Cristian Bravo para la seccion de perfil',
  traits: ['Builder', 'UI con identidad', 'Pensamiento de producto', 'Detalle visual'],
  stickers: [
    allStickers[1],
    allStickers[3],
    allStickers[6],
    allStickers[8],
    allStickers[11],
    allStickers[13],
    allStickers[16],
    allStickers[18],
    allStickers[21],
    allStickers[23],
  ],
  videoSrc: '/wallpapers/klee/KleeWP.mp4',
  videoPoster: '/wallpapers/klee/preview.gif',
};

export const profileStoryContent: ProfileStoryContent = {
  header: {
    kicker: 'Quien soy',
    title: 'Quien soy y como nace la idea detras de CYSTEMS',
    description:
      'No veo la tecnologia como una lista de entregables. La veo como una forma de ordenar negocios, dar claridad y construir experiencias utiles con identidad.',
  },
  introTitle: 'Programar para mi es construir claridad',
  introParagraphs: [
    'Me gusta programar porque me permite tomar algo complejo, desordenado o difuso y transformarlo en una experiencia clara, medible y funcional.',
    'Disfruto especialmente el frontend cuando mezcla criterio tecnico, narrativa visual, buena jerarquia, rendimiento y detalles que hacen memorable una interfaz.',
  ],
  originTitle: 'CYSTEMS surge para acompanar mejor',
  originParagraphs: [
    'La idea surge de ver un problema repetido: empresas con necesidades reales, procesos urgentes y mucha friccion entre la estrategia, el desarrollo y la operacion.',
    'CYSTEMS nace como una respuesta mas cercana y mas completa: consultoria digital, plataformas empresariales y operacion continua conectadas en una misma conversacion.',
  ],
  quote: 'La tecnologia bien hecha no complica mas el negocio; lo aclara.',
  quoteAuthor: 'Cristian Bravo',
  points: [
    {
      label: 'Identidad',
      title: 'Interfaces con caracter y direccion',
      description:
        'Me interesan los productos que no se sienten genericos, sino pensados para la marca, el contexto y la persona que los usa.',
      sticker: allStickers[4],
    },
    {
      label: 'Criterio',
      title: 'Cada modulo debe servir a la operacion',
      description:
        'No busco sumar pantallas por sumar. Prefiero construir piezas que realmente ayuden al negocio a moverse mejor.',
      sticker: allStickers[7],
    },
    {
      label: 'Escala',
      title: 'Arquitectura lista para crecer',
      description:
        'Pienso los proyectos para que evolucionen sin tener que romper todo cuando llegan nuevas etapas, equipos o procesos.',
      sticker: allStickers[9],
    },
  ],
  companions: [
    {
      src: companionPets[0],
      alt: 'Mascota de CYSTEMS representando curiosidad constante',
      title: 'Curiosidad constante',
      description: 'Aprender, probar referencias y buscar una mejor solucion forma parte de mi forma de trabajar.',
    },
    {
      src: companionPets[1],
      alt: 'Mascota de CYSTEMS enfocada en detalle visual',
      title: 'Detalle visual',
      description: 'Me atraen los recursos que vuelven una interfaz mas clara, mas humana y mas reconocible.',
    },
    {
      src: companionPets[2],
      alt: 'Mascota de CYSTEMS simbolizando iteracion',
      title: 'Iteracion real',
      description: 'Pulir, medir y ajustar me interesa tanto como lanzar una primera version.',
    },
    {
      src: companionPets[3],
      alt: 'Mascota de CYSTEMS simbolizando acompanamiento',
      title: 'Acompanamiento cercano',
      description: 'Prefiero trabajar pegado al problema para construir algo que se sienta util desde el dia uno.',
    },
  ],
};

export const profileExpertiseContent: ProfileExpertiseContent = {
  header: {
    kicker: 'Perfil profesional',
    title: 'Lo que he construido y donde ya genero valor',
    description:
      'He trabajado desde el diagnostico y la arquitectura hasta la interfaz, las integraciones y la operacion que sostiene el proyecto despues del lanzamiento.',
  },
  cards: [
    {
      badge: 'Consultoria digital',
      title: 'Ordeno ideas, procesos y prioridades',
      description:
        'Cuando un proyecto arranca con ruido, ayudo a convertirlo en una hoja de ruta clara, viable y conectada con el negocio.',
      bullets: [
        'Revision tecnica y de producto para detectar riesgos, fricciones y oportunidades reales.',
        'Roadmaps por fases que permiten avanzar sin improvisar ni frenar la operacion.',
        'Arquitectura y decisiones alineadas a objetivos, presupuesto y crecimiento.',
      ],
      sticker: allStickers[12],
    },
    {
      badge: 'Plataformas empresariales',
      title: 'Construyo sistemas pensados para crecer',
      description:
        'Desde dashboards internos hasta experiencias visibles para clientes, me enfoco en claridad, modularidad, UX y continuidad.',
      bullets: [
        `Casos visibles que respaldan este enfoque: ${publicProjects.join(', ')}.`,
        'Experiencia en dashboards, catalogos, portales de gestion y seguimiento operativo.',
        'Integraciones con APIs, automatizacion y estructuras listas para nuevas etapas.',
      ],
      sticker: allStickers[14],
    },
    {
      badge: 'Operacion y soporte',
      title: 'Acompano mas alla del lanzamiento',
      description:
        'Me importa tanto el resultado en produccion como la construccion inicial: deploy, estabilidad, mejoras y soporte continuo.',
      bullets: [
        'Configuracion de VPS, dominios, SSL y entornos productivos con criterio tecnico.',
        'Monitoreo, ajustes y evolucion constante para que el sistema siga respondiendo bien.',
        `Trabajo reservado en iniciativas como ${privateProjects.join(', ')}.`,
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
    title: 'Lo personal tambien empuja mi forma de disenar',
    description:
      'Anime, videojuegos narrativos, loops visuales y recursos con carisma alimentan mi criterio para construir interfaces con mas presencia.',
  },
  narrativeTitle: 'No separo del todo lo creativo de lo tecnico',
  narrativeParagraphs: [
    'Me interesan los universos visuales que cuentan algo antes del primer click. Por eso conecto mucho con el anime, los videojuegos narrativos, el pixel art y los stickers con personalidad.',
    'Todo eso termina apareciendo en como pienso una UI: atmosfera, pequenos gestos de motion, recursos memorables y una experiencia que se sienta intencional.',
  ],
  tags: ['Anime', 'Videojuegos narrativos', 'Pixel art', 'Stickers', 'UI expresiva', 'Motion con criterio'],
  clusters: [
    {
      accent: 'rgba(124, 60, 255, 0.24)',
      label: 'Moodboard 01',
      title: 'Narrativa visual',
      description:
        'Referencias que me recuerdan que una interfaz tambien puede contar una historia y sostener un tono propio.',
      stickers: allStickers.slice(0, 6),
    },
    {
      accent: 'rgba(59, 130, 246, 0.24)',
      label: 'Moodboard 02',
      title: 'Energia y carisma',
      description:
        'Me gustan las experiencias con ritmo, presencia y detalles que transmiten energia sin perder claridad.',
      stickers: allStickers.slice(6, 12),
    },
    {
      accent: 'rgba(244, 114, 182, 0.2)',
      label: 'Moodboard 03',
      title: 'Detalle y craft',
      description:
        'Los pequenos recursos visuales me ayudan a recordar que el acabado tambien comunica calidad y criterio.',
      stickers: allStickers.slice(12, 18),
    },
    {
      accent: 'rgba(45, 212, 191, 0.2)',
      label: 'Moodboard 04',
      title: 'Juego y exploracion',
      description:
        'Explorar mundos, sistemas y loops creativos alimenta mi forma de pensar producto, motion y continuidad visual.',
      stickers: allStickers.slice(18, 24),
    },
  ],
};

export const profileVisionContent: ProfileVisionContent = {
  header: {
    kicker: 'Vision a futuro',
    title: 'Frases, metas y la direccion que quiero seguir construyendo',
    description:
      'Quiero seguir creciendo como desarrollador y estratega para construir productos con peso tecnico, buena interfaz y una voz visual reconocible.',
  },
  motto: 'Mi meta no es solo entregar software; es construir sistemas que ayuden a crecer y que al mismo tiempo demuestren que la tecnologia puede tener alma.',
  mottoDetail:
    'Quiero que CYSTEMS siga evolucionando como una marca que combina criterio tecnico, buenas decisiones de producto y una experiencia visual cuidada de principio a fin.',
  phraseColumn: {
    title: 'Frases profesionales',
    items: [
      'La interfaz no debe decorar el sistema; debe explicar el negocio.',
      'Un buen frontend no solo se ve bien: reduce friccion y genera confianza.',
      'Si una solucion no puede mantenerse, todavia no esta bien resuelta.',
      'Programar es precision, pero tambien una forma de crear.',
    ],
    sticker: allStickers[19],
  },
  dreamsColumn: {
    title: 'Suenos',
    items: [
      'Crear productos digitales cada vez mas solidos para empresas de LATAM.',
      'Profundizar en arquitectura, automatizacion y experiencias frontend de alto nivel.',
      'Consolidar una identidad propia para CYSTEMS que se reconozca por su calidad y criterio.',
    ],
    sticker: allStickers[20],
  },
  goalsColumn: {
    title: 'Metas concretas',
    items: [
      'Llevar proyectos desde la idea hasta la operacion sin perder claridad ni calidad visual.',
      'Seguir aprendiendo todos los dias y subir el nivel tecnico en cada entrega.',
      'Construir un portafolio donde estrategia, codigo, UI y narrativa visual trabajen juntos.',
    ],
    sticker: allStickers[22],
  },
  ctaTitle: 'Si tu proyecto necesita criterio tecnico y una experiencia cuidada, conversemos.',
  ctaDescription:
    'Me interesa trabajar en productos donde frontend, operacion y estrategia tengan el mismo peso y donde cada decision empuje resultados reales.',
  primaryAction: {
    label: 'Empezar proyecto',
    href: '/empezar-proyecto',
  },
  secondaryAction: {
    label: 'Empezar proyecto',
    href: '/empezar-proyecto',
  },
  pet: {
    src: companionPets[3],
    alt: 'Mascota de CYSTEMS acompanando la seccion de vision',
    title: 'Siguiente nivel',
    description: 'Siempre buscando una forma mas clara, mas solida y mas expresiva de construir.',
  },
};
