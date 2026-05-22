import type { Lang } from '../data';

export const DEFAULT_LANG: Lang = 'es';
export const LANGUAGES: Lang[] = ['es', 'en'];

const EN_PREFIX = '/en';

export const isLang = (value: string | undefined): value is Lang =>
  value === 'es' || value === 'en';

const normalizePath = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
};

export const getLangFromPath = (pathname: string): Lang => {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment === 'en' ? 'en' : DEFAULT_LANG;
};

export const stripLangPrefix = (pathname: string) => {
  const normalized = normalizePath(pathname);
  if (normalized === EN_PREFIX) return '/';
  if (normalized.startsWith(`${EN_PREFIX}/`)) {
    return normalizePath(normalized.slice(EN_PREFIX.length));
  }
  return normalized;
};

export const localizePath = (href: string, lang: Lang) => {
  if (!href || href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href)) return href;

  const [pathPart, suffix = ''] = href.split(/(?=[?#])/);
  const basePath = stripLangPrefix(pathPart || '/');

  if (lang === DEFAULT_LANG) return `${basePath}${suffix}`;
  return `${basePath === '/' ? EN_PREFIX : `${EN_PREFIX}${basePath}`}${suffix}`;
};

export const getAlternateLangPath = (pathname: string, targetLang: Lang) =>
  localizePath(stripLangPrefix(pathname), targetLang);

export const uiCopy = {
  es: {
    locale: 'es_EC',
    languageName: 'Español',
    alternateLanguageName: 'English',
    skipLabel: 'Saltar al contenido',
    themeLightLabel: 'Activar modo claro',
    themeDarkLabel: 'Activar modo oscuro',
    themeTitleLight: 'Cambiar a modo claro',
    themeTitleDark: 'Cambiar a modo oscuro',
    themeToggleText: 'Tema',
    languageToggleLabel: 'Cambiar idioma a inglés',
    menuOpenLabel: 'Abrir menú principal',
    menuCloseLabel: 'Cerrar menú principal',
    navLabel: 'Principal',
    mobileNavLabel: 'Navegación móvil',
    headerCta: 'Empezar proyecto',
    headerCtaShort: 'Empezar',
    nav: [
      { href: '/', label: 'Inicio' },
      { href: '/servicios', label: 'Servicios' },
      { href: '/proyectos', label: 'Proyectos' },
      { href: '/perfil/cristian-bravo', label: 'Sobre mí' },
    ],
    footer: {
      tagline: 'Transforma ideas en tecnología',
      description: 'Arquitectura de software y plataformas digitales para empresas en crecimiento.',
      navigationTitle: 'Navegación',
      nextStepTitle: 'Siguiente paso',
      services: 'Servicios',
      projects: 'Proyectos',
      startProject: 'Empezar proyecto',
      profile: 'Perfil profesional',
      rights: 'Todos los derechos reservados.',
    },
    portfolio: {
      scrollHint: 'Scrollea para explorar',
      profileLabel: 'Perfil',
      chips: ['Aplicaciones web', 'UI/UX', 'Sistemas'],
      confidentialFallback: 'Proyecto confidencial',
      codeLabel: 'Código',
      portfolioLabel: 'Portada del portafolio',
      projectLabel: 'Proyecto',
      finalLabel: 'Cierre del portafolio',
      dotsLabel: 'Navegar por proyectos',
      goCover: 'Ir a portada',
      goProject: 'Ir al proyecto',
      goFinal: 'Ir al cierre del portafolio',
      openCode: 'Abrir código de',
    },
  },
  en: {
    locale: 'en_US',
    languageName: 'English',
    alternateLanguageName: 'Español',
    skipLabel: 'Skip to content',
    themeLightLabel: 'Use light mode',
    themeDarkLabel: 'Use dark mode',
    themeTitleLight: 'Switch to light mode',
    themeTitleDark: 'Switch to dark mode',
    themeToggleText: 'Theme',
    languageToggleLabel: 'Switch language to Spanish',
    menuOpenLabel: 'Open main menu',
    menuCloseLabel: 'Close main menu',
    navLabel: 'Main',
    mobileNavLabel: 'Mobile navigation',
    headerCta: 'Start a project',
    headerCtaShort: 'Start',
    nav: [
      { href: '/', label: 'Home' },
      { href: '/servicios', label: 'Services' },
      { href: '/proyectos', label: 'Projects' },
      { href: '/perfil/cristian-bravo', label: 'Profile' },
    ],
    footer: {
      tagline: 'Turn ideas into reliable software',
      description: 'Software architecture and digital platforms for companies ready to grow.',
      navigationTitle: 'Navigation',
      nextStepTitle: 'Next step',
      services: 'Services',
      projects: 'Projects',
      startProject: 'Start a project',
      profile: 'Professional profile',
      rights: 'All rights reserved.',
    },
    portfolio: {
      scrollHint: 'Scroll to explore',
      profileLabel: 'Profile',
      chips: ['Web apps', 'UI/UX', 'Systems'],
      confidentialFallback: 'Confidential project',
      codeLabel: 'Code',
      portfolioLabel: 'Portfolio cover',
      projectLabel: 'Project',
      finalLabel: 'Portfolio close',
      dotsLabel: 'Navigate projects',
      goCover: 'Go to cover',
      goProject: 'Go to project',
      goFinal: 'Go to portfolio close',
      openCode: 'Open code for',
    },
  },
} as const;

export const getUiCopy = (lang: Lang) => uiCopy[lang] ?? uiCopy[DEFAULT_LANG];
