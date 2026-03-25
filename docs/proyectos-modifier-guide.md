# Guía para modificar el portafolio

Esta es la guía práctica para editar `/proyectos` sin tener que reconstruir mentalmente toda la página.

## Fuente principal de contenido

La mayor parte del contenido del portafolio vive en:

- `src/data/es/projects.ts`

La página consume `projectsPortfolioContent`, que contiene:

- `intro`
- `heroAvatar`
- `groups`
- `finalCta`

Cada proyecto se define dentro de `groups[].references[]`.

## Estructura actual de un proyecto

La interfaz soporta actualmente estos campos:

```ts
{
  title: string;
  description: string;
  visibility: string;
  tags: string[];
  gallery: Array<{
    src?: string;
    alt: string;
    caption: string;
    variant?: 'wide' | 'square' | 'tall';
  }>;
  actions?: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
  featuredHero?: {
    variant:
      | 'edu-saas'
      | 'industrial-corporate'
      | 'retail-commerce'
      | 'academic-platform'
      | 'confidential-private';
    badge: string;
    subtitle?: string;
    shortDescription: string;
    tags?: string[];
    decorativeSrc?: string;
    decorativePlacement?: 'top-right' | 'center-right';
    statusPills?: string[];
    visualTone?: 'violet';
    forceDark: true;
  };
  githubUrl?: string;
  isConfidential?: boolean;
  confidentialLabel?: string;
}
```

## Dónde viven los assets

Los assets públicos del portafolio deben guardarse en:

- `public/projects/<NombreDelProyecto>/`

Ejemplos actuales:

- `public/projects/NY-Campus-Virtual/`
- `public/projects/Fualtec/`
- `public/projects/Alkosto/`
- `public/projects/Education/`

Usa esas rutas públicas directamente dentro de `src/data/es/projects.ts`.

## Cómo actualizar un proyecto existente

1. Abre `src/data/es/projects.ts`.
2. Localiza el proyecto dentro de `projectsPortfolioContent.groups`.
3. Modifica campos como `title`, `description`, `visibility` y `tags`.
4. Actualiza `gallery` si cambiaron las capturas.
5. Ajusta `actions` si cambiaron las URLs públicas.
6. Ajusta `featuredHero` si el proyecto usa la variante destacada.

## Cómo añadir un proyecto nuevo

1. Crea una carpeta de assets en `public/projects/<NombreDelProyecto>/`.
2. Añade las imágenes necesarias.
3. Inserta un nuevo objeto dentro del array `groups[].references[]` correspondiente.
4. Añade al menos un item en `gallery`.
5. Usa `featuredHero` solo si el proyecto necesita la escena premium.

No hace falta tocar JavaScript adicional para que aparezca una escena nueva.

## Reglas de la galería

La página está pensada para hasta tres slots visuales:

- `wide`
- `square`
- `tall`

No es obligatorio usar las tres variantes, pero la composición se ve mejor cuando existen todas.

## Proyectos públicos y confidenciales

Para proyectos confidenciales usa:

- `isConfidential: true`
- `confidentialLabel`
- items de `gallery` sin `src` si no se pueden publicar capturas

La página ya renderiza placeholders y estilos de confidencialidad automáticamente.

## Featured hero de proyecto

Si un proyecto incluye `featuredHero`, la página usa:

- `src/components/projects/sections/ProjectFeaturedHero.astro`

Esa variante soporta:

- media decorativa
- tonos visuales distintos por tipo de proyecto
- status pills opcionales
- sets de tags personalizados

## Archivos que normalmente tocarás

- `src/data/es/projects.ts`
- `public/projects/<NombreDelProyecto>/...`
- `src/styles/proyectos-scene.css` solo si necesitas cambiar layout o presentación

## Flujo seguro de trabajo

1. Actualiza o añade assets.
2. Modifica `src/data/es/projects.ts`.
3. Ejecuta `npm run build`.
4. Verifica `/proyectos` en modo claro y modo oscuro.
