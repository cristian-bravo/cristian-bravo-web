/**
 * Local analytics contract. This module intentionally has no transport,
 * persistence, identifiers, URLs, or form values: a future analytics adapter
 * may subscribe to the public browser event instead.
 */
export const ANALYTICS_EVENT = 'cystems:analytics' as const;

export const analyticsEventNames = [
  'hero_cta',
  'contact_click',
  'whatsapp_click',
  'project_view',
  'form_start',
  'form_complete',
  'ai_open',
] as const;

export const analyticsLocations = [
  'hero',
  'header',
  'footer',
  'contact',
  'projects',
  'simple_form',
  'project_form',
  'yuki_widget',
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsLocation = (typeof analyticsLocations)[number];
export type AnalyticsLanguage = 'es' | 'en';

export interface AnalyticsEventDetail {
  readonly event: AnalyticsEventName;
  readonly location: AnalyticsLocation;
  readonly language: AnalyticsLanguage;
}

const eventNames = new Set<string>(analyticsEventNames);
const locations = new Set<string>(analyticsLocations);

export const isAnalyticsEventName = (value: unknown): value is AnalyticsEventName =>
  typeof value === 'string' && eventNames.has(value);

export const isAnalyticsLocation = (value: unknown): value is AnalyticsLocation =>
  typeof value === 'string' && locations.has(value);

export const documentAnalyticsLanguage = (): AnalyticsLanguage => {
  if (typeof document === 'undefined') return 'es';
  return document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'es';
};

export const createAnalyticsEventDetail = (
  event: unknown,
  location: unknown,
  language: AnalyticsLanguage = documentAnalyticsLanguage(),
): AnalyticsEventDetail | null => {
  if (!isAnalyticsEventName(event) || !isAnalyticsLocation(location)) return null;
  return { event, location, language };
};

/**
 * Emits a local, privacy-preserving signal only. It never sends a request,
 * reads or writes browser storage, or accepts free-form payload fields.
 */
export const emitAnalyticsEvent = (event: unknown, location: unknown): boolean => {
  if (typeof window === 'undefined') return false;

  const detail = createAnalyticsEventDetail(event, location);
  if (!detail) return false;

  window.dispatchEvent(new CustomEvent<AnalyticsEventDetail>(ANALYTICS_EVENT, { detail }));
  return true;
};
