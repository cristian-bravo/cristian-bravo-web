# Projects Refactor 2026

This document describes the current architecture of `/proyectos` after the 2026 portfolio refactor.

## High-Level Structure

The portfolio page is rendered from:

- `src/pages/proyectos.astro`

It is built as a scene-based experience composed of:

1. a hero scene
2. one scene per project
3. a final CTA scene

The page calculates:

- `allProjects`
- `totalProjects`
- `totalScenes`

directly from the structured dataset in `src/data/es/projects.ts`.

## Main Building Blocks

### Data

- `src/data/es/projects.ts`

Provides the full content model for:

- hero copy
- hero avatar
- project groups
- project references
- final CTA

### Page

- `src/pages/proyectos.astro`

Responsible for:

- flattening project groups into a linear scene sequence
- assigning scene indexes
- mapping tone variations
- choosing between standard scenes and `featuredHero` scenes
- rendering progress, dots, counters, and CTA

### Featured project renderer

- `src/components/projects/sections/ProjectFeaturedHero.astro`

Used when a project defines `featuredHero`.

### Scroll engine

- `src/scripts/projectsScrollAnimation.ts`

Controls:

- spacer height
- scene activation
- progress fill
- dot navigation
- reduced-motion fallbacks
- resize resnapping

### Styling

- `src/styles/proyectos-scene.css`
- `src/styles/hero-animations.css` for the CTA motion background treatment

## Current Scene Model

The current page uses:

- scene `0`: portfolio hero
- scenes `1..N`: project scenes
- last scene: final CTA

Each scene is marked with:

- `data-ps-scene`
- `data-scene-index`

The fixed rendering stage uses:

- `data-ps-stage`

The invisible scroll driver uses:

- `data-ps-spacer`

## Standard Project Scene

A standard project scene includes:

- project metadata row
- title and description
- tag list
- optional confidentiality label
- gallery slots
- action bar

Scene layout and variants are controlled in `src/pages/proyectos.astro` and styled in `src/styles/proyectos-scene.css`.

## Featured Project Scene

If a project includes `featuredHero`, the page renders the premium version instead of the standard gallery shell.

Current supported featured variants:

- `edu-saas`
- `industrial-corporate`
- `retail-commerce`
- `academic-platform`
- `confidential-private`

These variants influence tone, panel composition, decorative media, and CTA presentation.

## Content Rules

- Public projects can include screenshots, live links, and GitHub links.
- Confidential projects can omit image sources and still render correctly.
- Decorative media for featured heroes should come from `public/projects/...`.

## Why This Refactor Matters

- Projects can be added by editing data, not page structure.
- Scene count, progress, and navigation scale automatically.
- The page supports both high-visibility public work and confidential mentions.
- Styling and motion remain centralized instead of duplicated per project.
