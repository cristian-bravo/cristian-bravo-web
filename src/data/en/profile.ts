import {
  profileAvatarContent as esAvatar,
  profileExpertiseContent as esExpertise,
  profileHeroContent as esHero,
  profileInterestsContent as esInterests,
  profileStoryContent as esStory,
  profileVisionContent as esVision,
  type ProfileAvatarContent,
  type ProfileExpertiseContent,
  type ProfileHeroContent,
  type ProfileInterestsContent,
  type ProfileStoryContent,
  type ProfileVisionContent,
} from '../es/profile';
import type { PageMetadata } from '../../types/content';

export * from '../es/profile';

export const profilePageMeta: PageMetadata = {
  title: 'About Cristian Bravo | CYSTEMS',
  description: 'Professional profile, technical focus and creative world of Cristian Bravo at CYSTEMS.',
};

export const profileHeroContent: ProfileHeroContent = {
  ...esHero,
  kicker: 'Professional profile',
  lead:
    'I build production platforms, APIs and systems by combining development, architecture and technical judgment.',
  description:
    'I like understanding the full problem and building clear, useful and well-structured solutions.',
  primaryAction: {
    label: 'Talk about your project',
    href: '/en/empezar-proyecto',
  },
  secondaryAction: {
    label: 'View projects',
    href: '/en/proyectos',
  },
  quickLinks: [
    { ...esHero.quickLinks[0], label: 'View all my projects', ariaLabel: 'Open Cristian Bravo GitHub profile' },
    { ...esHero.quickLinks[1], label: 'Send an email', ariaLabel: 'Send email to Cristian Bravo' },
    { ...esHero.quickLinks[2], label: 'Download my CV', ariaLabel: 'Download Cristian Bravo CV in PDF' },
    { ...esHero.quickLinks[3], label: 'View my profile', ariaLabel: 'Open Cristian Bravo LinkedIn profile' },
  ],
  badges: ['APIs and backend', 'Platforms and systems', 'Maintenance', 'Frontend with identity'],
  stats: [
    {
      label: 'Focus',
      value: 'Product + systems',
      detail: 'Every technical decision is oriented to building clear, functional and scalable solutions.',
    },
    {
      label: 'Working mode',
      value: 'From idea to system',
      detail: 'I analyze, build, iterate and improve each solution inside real production environments.',
    },
    {
      label: 'Personal drive',
      value: 'Build real solutions',
      detail: 'I enjoy solving problems, structuring systems and turning complexity into clarity.',
    },
  ],
  noteTitle: 'My approach',
  noteBody: 'A summary of how I work, the systems I have built and the way I develop real solutions.',
  floatingNotes: ['Code with judgment', 'Clear UI', 'Always iterating', 'Systems that grow', 'Solid architecture'],
  videoKicker: 'Creative loop',
  videoTitle: 'Motion, atmosphere and an interface with personality.',
  videoDescription:
    'The visual style sets the tone: technology that communicates, frontend that feels alive and an aesthetic that does not depend on generic templates.',
  videoTags: ['Visual loop', 'Motion', 'Expressive UI', 'Frontend craft'],
};

export const profileAvatarContent: ProfileAvatarContent = {
  ...esAvatar,
  kicker: 'ABOUT ME',
  title: 'I build full-stack solutions with product and scalability focus',
  description: 'I build production platforms by combining development, design and technical judgment.',
  role: 'Full Stack + Architecture + Product',
  imageAlt: 'Cristian Bravo avatar for the profile section',
  traits: ['Full Stack', 'Product', 'Architecture', 'Scalability', 'Systems'],
};

export const profileStoryContent: ProfileStoryContent = {
  ...esStory,
  header: {
    kicker: 'About me',
    title: 'How CYSTEMS began',
    description: '',
  },
  introTitle: 'It started with curiosity',
  introParagraphs: [
    'I started programming to understand how things worked. I still enjoy that process of discovery and giving shape to an idea.',
  ],
  originTitle: 'A path of my own',
  originParagraphs: [
    'CYSTEMS brings together my growth as a developer and technical guidance for startups that need help getting started.',
  ],
  quote: 'I want to live from what I like: programming and building.',
  points: [
    {
      ...esStory.points[0],
      label: 'Identity',
      title: 'Build with intention',
      description: 'I like every project to make sense, not just be code without purpose.',
    },
    {
      ...esStory.points[1],
      label: 'Judgment',
      title: 'Learn and improve',
      description: 'I am always looking to write better code and understand better what I build.',
    },
    {
      ...esStory.points[2],
      label: 'Path',
      title: 'Keep growing',
      description: 'CYSTEMS is also part of my growth as a developer.',
    },
  ],
  companions: [
    { ...esStory.companions[0], alt: 'Curiosity', title: 'Curiosity', description: 'I always want to understand more and learn something new.' },
    { ...esStory.companions[1], alt: 'Detail', title: 'Detail', description: 'I like doing things well, even the small ones.' },
    { ...esStory.companions[2], alt: 'Iteration', title: 'Iteration', description: 'I improve step by step, project after project.' },
    { ...esStory.companions[3], alt: 'Motivation', title: 'Motivation', description: 'My goal is clear: live from this and keep building.' },
  ],
};

export const profileExpertiseContent: ProfileExpertiseContent = {
  ...esExpertise,
  header: {
    kicker: 'My work',
    title: 'From idea to production',
    description:
      'Architecture, interfaces and integrations that work together.',
  },
  cards: [
    {
      ...esExpertise.cards[0],
      badge: 'Planning',
      title: 'Shape the idea',
      description:
        'I turn needs and processes into a practical technical plan.',
      bullets: [
        'Risk and priority assessment.',
        'Architecture and phased delivery.',
      ],
    },
    {
      ...esExpertise.cards[1],
      badge: 'Development',
      title: 'Connect the whole system',
      description:
        'I integrate frontend and backend into platforms built to evolve.',
      bullets: [
        'Dashboards, portals and e-commerce.',
        'APIs and process automation.',
      ],
    },
    {
      ...esExpertise.cards[2],
      badge: 'Operations',
      title: 'Keep production running',
      description:
        'I keep systems stable and support their next improvements.',
      bullets: [
        'VPS, domains and SSL.',
        'Monitoring and performance tuning.',
      ],
    },
  ],
  serviceLabels: ['APIs and backend', 'Platforms and systems', 'Evolution and maintenance'],
  projectLabels: ['NY Campus Virtual', 'Fualtec', 'Alkosto', 'Education platforms', '360IO', 'Club Guias'],
  domainLabels: ['Virtual classroom', 'Scalability', 'E-commerce', 'Backend', 'Security', 'SEO', 'APIs'],
};

export const profileInterestsContent: ProfileInterestsContent = {
  ...esInterests,
  header: {
    kicker: 'Interests and influences',
    title: 'Outside work',
    description: '',
  },
  narrativeTitle: 'Not everything is code',
  narrativeParagraphs: [
    'I like anime and videogames a lot. Beyond entertainment, they often teach consistency, effort and moving forward.',
    'I also like programming outside work. For me it is not only an obligation, it is something I genuinely enjoy.',
  ],
  tags: ['Anime', 'Videogames', 'Japanese culture', 'LoL', 'Programming', 'Continuous learning'],
  clusters: [
    { ...esInterests.clusters[0], title: 'Stories that inspire', description: 'I am drawn to characters who persevere against impossible odds.' },
    { ...esInterests.clusters[1], title: 'Learning through play', description: 'I enjoy competing, trying strategies and learning from every game.' },
    { ...esInterests.clusters[2], label: 'Culture', title: 'Attention to detail', description: 'I admire the discipline and care in everyday life found in Japanese culture.' },
    { ...esInterests.clusters[3], label: 'Code', title: 'Creating for fun', description: 'I also program in my free time, simply because I enjoy it.' },
  ],
};

export const profileVisionContent: ProfileVisionContent = {
  ...esVision,
  header: {
    kicker: 'What comes next',
    title: 'Keep building with CYSTEMS',
    description:
      'My next challenge is to work on larger-scale systems.',
  },
  motto:
    'If a system is hard to understand, it is not finished yet.',
  mottoDetail:
    'That idea guides my decisions, from architecture to interface.',
  phraseColumn: {
    ...esVision.phraseColumn,
    title: 'What I believe',
    items: [
      'I prefer something simple that works well over something complex without purpose.',
      'If a system is hard to understand, it is not finished yet.',
      'Programming is solving problems, not only writing code.',
      'There is always a better way to do things.',
    ],
  },
  dreamsColumn: {
    ...esVision.dreamsColumn,
    title: 'What I want to achieve',
    items: [
      'Live fully from programming.',
      'Work on increasingly larger and more complex systems.',
      'Keep learning and raising my level as a developer.',
    ],
  },
  goalsColumn: {
    ...esVision.goalsColumn,
    title: 'What I am doing now',
    items: [
      'Building real projects that help me grow.',
      'Improving my code and the way I think about systems.',
      'Developing CYSTEMS as part of my path.',
    ],
  },
  ctaTitle: 'Ready to build your next idea?',
  ctaDescription: 'Tell me what you need to solve.',
  primaryAction: {
    label: 'Start a project',
    href: '/en/empezar-proyecto',
  },
  secondaryAction: {
    label: 'View projects',
    href: '/en/proyectos',
  },
  pet: {
    ...esVision.pet,
    alt: 'Companion character next to the vision',
    title: 'Next level',
    description: 'Always looking to improve and take one more step.',
  },
};
