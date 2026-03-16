import type { PageMetadata } from '../../types/content';

export interface BlogPlaceholderContent {
  heading: string;
  description: string;
}

export const blogIndexPageMeta: PageMetadata = {
  title: 'Blog | CYSTEMS',
  description: 'Publicaciones técnicas, arquitectura y mejores prácticas de producto digital.',
};

export const blogSlugPageMeta: PageMetadata = {
  title: 'Blog | CYSTEMS',
  description: 'Detalle de publicación técnica de CYSTEMS.',
};

export const blogPlaceholderContent: BlogPlaceholderContent = {
  heading: 'Blog',
  description: 'Blog deshabilitado temporalmente.',
};
