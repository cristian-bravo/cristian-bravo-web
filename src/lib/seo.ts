import { localizePath } from './i18n';

export const SITE_ORIGIN = 'https://cystems.ec';
// Only substantive, canonical pages belong in the index. The disabled blog,
// redirects and API routes are intentionally excluded.
export const INDEXABLE_PATHS = [
  '/',
  '/servicios',
  '/proyectos',
  '/perfil/cristian-bravo',
  '/contacto',
  '/empezar-proyecto',
  '/empezar-proyecto/simple',
  '/empezar-proyecto/proyecto',
] as const;

export const localizedUrl = (path: string, lang: 'es' | 'en') =>
  new URL(localizePath(path, lang), SITE_ORIGIN).toString();
