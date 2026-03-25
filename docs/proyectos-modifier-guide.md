# Portfolio Modifier Guide

This is the practical guide for editing the `/proyectos` experience without reverse-engineering the whole page.

## Main Content Source

Most portfolio content is defined in:

- `src/data/es/projects.ts`

The page reads from `projectsPortfolioContent`, which contains:

- `intro`
- `heroAvatar`
- `groups`
- `finalCta`

Each project lives inside `groups[].references[]`.

## Project Shape

The current project interface supports the following fields:

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

## Where Assets Live

Public portfolio media should be stored under:

- `public/projects/<ProjectName>/`

Example used today:

- `public/projects/NY-Campus-Virtual/`
- `public/projects/Fualtec/`
- `public/projects/Alkosto/`
- `public/projects/Education/`

Use those public paths directly in `src/data/es/projects.ts`.

## How To Update an Existing Project

1. Open `src/data/es/projects.ts`.
2. Locate the project inside `projectsPortfolioContent.groups`.
3. Update text fields like `title`, `description`, `visibility`, and `tags`.
4. Update `gallery` items if screenshots changed.
5. Update `actions` if public URLs changed.
6. Update `featuredHero` if the project uses the featured layout variant.

## How To Add a New Project

1. Create an asset folder under `public/projects/<ProjectName>/`.
2. Add the required images.
3. Append a new object inside the correct `groups[].references[]` array.
4. Provide at least one `gallery` item.
5. Add `featuredHero` only if the project should use the premium featured scene layout.

No additional JavaScript changes are required for the page to render a new scene.

## Gallery Rules

The page expects up to three visual slots:

- `wide`
- `square`
- `tall`

You do not need to provide every variant, but the layout looks best when all three exist.

## Public vs Confidential Projects

Use these fields for confidential references:

- `isConfidential: true`
- `confidentialLabel`
- gallery items without public `src` values if visual assets cannot be shown

The page will render confidentiality styling and restricted placeholders automatically.

## Featured Hero Projects

Projects with `featuredHero` use the richer visual scene rendered by:

- `src/components/projects/sections/ProjectFeaturedHero.astro`

These scenes support:

- decorative background media
- alternate visual themes by project type
- optional status pills
- optional custom tag sets

## Files You Will Usually Touch

- `src/data/es/projects.ts`
- `public/projects/<ProjectName>/...`
- `src/styles/proyectos-scene.css` only if layout or presentation needs to change

## Safe Workflow

1. Update assets.
2. Update `src/data/es/projects.ts`.
3. Run `npm run build`.
4. Verify `/proyectos` in both light and dark mode.
