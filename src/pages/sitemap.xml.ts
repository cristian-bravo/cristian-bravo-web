import type { APIRoute } from 'astro';
import { INDEXABLE_PATHS, localizedUrl } from '../lib/seo';

export const prerender = true;
export const GET: APIRoute = () => {
  const entries = INDEXABLE_PATHS.flatMap((path) => (['es', 'en'] as const).map((lang) => {
    const alternatives = (['es', 'en'] as const).map((alternate) =>
      `<xhtml:link rel="alternate" hreflang="${alternate}" href="${localizedUrl(path, alternate)}" />`
    ).join('');
    return `<url><loc>${localizedUrl(path, lang)}</loc>${alternatives}<xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(path, 'es')}" /></url>`;
  })).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
