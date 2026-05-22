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
    title: 'Who I am and how CYSTEMS started',
    description:
      'CYSTEMS comes from my love for programming, learning, improving and building something of my own from that path.',
  },
  introTitle: 'Programming is more than code for me',
  introParagraphs: [
    'I started with curiosity about how things work, and over time it became a passion.',
    'Today programming is my way to build, learn constantly and turn ideas into something real.',
  ],
  originTitle: 'CYSTEMS is part of that journey',
  originParagraphs: [
    'It was not born as a traditional company, but as a way to grow as a developer and live from this craft.',
    'It is also a solution for startups: technical guidance from zero, helping build real systems step by step.',
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
    { ...esStory.companions[0], alt: 'Constant curiosity', title: 'Constant curiosity', description: 'I always want to understand more and learn something new.' },
    { ...esStory.companions[1], alt: 'Detail', title: 'Detail', description: 'I like doing things well, even the small ones.' },
    { ...esStory.companions[2], alt: 'Iteration', title: 'Iterate and improve', description: 'I improve step by step, project after project.' },
    { ...esStory.companions[3], alt: 'Real motivation', title: 'Real motivation', description: 'My goal is clear: live from this and keep building.' },
  ],
};

export const profileExpertiseContent: ProfileExpertiseContent = {
  ...esExpertise,
  header: {
    kicker: 'Professional profile',
    title: 'What I have built and where I create value',
    description:
      'I have worked from analysis and architecture to interface, integrations and the operation that keeps each production system alive.',
  },
  cards: [
    {
      ...esExpertise.cards[0],
      badge: 'Focus and structure',
      title: 'I organize ideas, processes and decisions',
      description:
        'When a project starts without clarity, I turn it into a coherent and viable technical/product roadmap.',
      bullets: [
        'Technical and product review to identify risks, friction and opportunities.',
        'Phased roadmaps that allow progress without improvisation.',
        'Architecture decisions aligned with goals, context and growth.',
      ],
    },
    {
      ...esExpertise.cards[1],
      badge: 'Platforms and systems',
      title: 'I build solutions designed to grow',
      description:
        'I develop production systems where frontend, backend and architecture work clearly, modularly and scalably.',
      bullets: [
        'Real projects supporting this approach: NY Campus Virtual, Fualtec, Alkosto, Education platforms.',
        'Experience in dashboards, management portals and digital platforms.',
        'API integrations, automation and structures prepared for evolution.',
      ],
    },
    {
      ...esExpertise.cards[2],
      badge: 'Evolution and support',
      title: 'I support systems in production',
      description:
        'I focus on stability, continuous improvement and evolution after the system is running.',
      bullets: [
        'VPS, domains, SSL and production environments configured with technical judgment.',
        'Monitoring, adjustments and improvements to maintain performance and stability.',
        'Participation in initiatives such as 360IO and Club Guias.',
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
    title: 'What is also part of who I am',
    description:
      'Anime, videogames and Japanese culture influence the way I think, learn and build.',
  },
  narrativeTitle: 'Not everything is code',
  narrativeParagraphs: [
    'I like anime and videogames a lot. Beyond entertainment, they often teach consistency, effort and moving forward.',
    'I also like programming outside work. For me it is not only an obligation, it is something I genuinely enjoy.',
  ],
  tags: ['Anime', 'Videogames', 'Japanese culture', 'LoL', 'Programming', 'Continuous learning'],
  clusters: [
    { ...esInterests.clusters[0], title: 'Stories that inspire', description: 'Anime resonates with me because it communicates growth, discipline and goals that seem impossible.' },
    { ...esInterests.clusters[1], title: 'Compete and improve', description: 'Videogames shape how I think: learn, make mistakes and keep improving.' },
    { ...esInterests.clusters[2], label: 'Culture', title: 'Discipline and consistency', description: 'Japanese culture inspires me through continuous improvement and attention to detail.' },
    { ...esInterests.clusters[3], label: 'Code', title: 'Programming as a hobby', description: 'Even outside work, I keep programming. I really enjoy it.' },
  ],
};

export const profileVisionContent: ProfileVisionContent = {
  ...esVision,
  header: {
    kicker: 'Vision',
    title: 'Where I want to go',
    description:
      'I want to keep growing as a developer, build better systems and live fully from this craft.',
  },
  motto:
    'My goal is not only to deliver software, but to build systems that help companies grow and prove that technology can also have soul.',
  mottoDetail:
    'CYSTEMS is part of that path: a project that grows with me while I learn, build and gain real experience.',
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
  ctaTitle: 'If you have an idea or project, we can build it.',
  ctaDescription:
    'I am interested in real work where I can contribute, learn and keep growing as a developer.',
  primaryAction: {
    label: 'Start',
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
