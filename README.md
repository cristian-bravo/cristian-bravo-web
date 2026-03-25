# CYSTEMS Web

<p align="center">
  <img src="./docs/readme/cystems-hero.svg" alt="CYSTEMS visual overview" width="100%" />
</p>

<p align="center">
  <a href="https://cystems.ec"><img src="https://img.shields.io/badge/Production-cystems.ec-0F172A?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Production site" /></a>
  <a href="https://github.com/cristian-bravo/cristian-bravo-web"><img src="https://img.shields.io/badge/Repo-cristian--bravo--web-111827?style=for-the-badge&logo=github&logoColor=white" alt="Repository" /></a>
  <a href="https://www.linkedin.com/in/cristian-bravodev/"><img src="https://img.shields.io/badge/LinkedIn-Cristian%20Bravo-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-5.x-FF5D01?style=flat-square&logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=0B1120" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Anime.js-Scroll%20Motion-111827?style=flat-square&logo=javascript&logoColor=F7DF1E" alt="Anime.js" />
  <img src="https://img.shields.io/badge/Adapter-Node%20SSR-111827?style=flat-square&logo=node.js&logoColor=white" alt="Node adapter" />
  <img src="https://img.shields.io/badge/Nodemailer-SMTP-166534?style=flat-square&logo=maildotru&logoColor=white" alt="Nodemailer" />
</p>

## Overview

**CYSTEMS Web** is the production website for the CYSTEMS brand and Cristian Bravo's public digital presence.
It combines:

- corporate positioning
- a motion-first portfolio
- a professional profile page
- conversion-oriented project request flows
- server-side contact and project delivery

The project is built as a branded product surface, not as a generic marketing template. Visual identity, conversion flow, data-driven content, and maintainability are all treated as first-class concerns.

## Current Experience

### Public pages

- `/` presents the main brand narrative with a theme-aware SaaS-style hero.
- `/servicios` explains the service offering through cards, modal content, and guided messaging.
- `/proyectos` runs as a scroll-driven portfolio with full-screen scenes and featured project heroes.
- `/perfil/cristian-bravo` extends the professional story with richer profile media and long-form sections.
- `/blog` and `/blog/[slug]` provide the content structure for technical posts.

### Conversion flows

- `/empezar-proyecto` acts as the main commercial entry point.
- `/empezar-proyecto/simple` captures lightweight requests quickly.
- `/empezar-proyecto/proyecto` handles structured project intake with a multi-step wizard.
- `/solicitar-desarrollo`, `/solicitar-desarrollo/simple`, and `/solicitar-desarrollo/proyecto` mirror the same flow for alternate copy/navigation needs.

### Visual system highlights

- Home hero with **theme-specific background video**:
  - light mode: `/wallpapers/videos/avatar_pets.mp4`
  - dark mode: `/wallpapers/videos/avatar_clean.mp4`
- Glass card treatment, blur layering, and responsive motion tuned for a SaaS-like feel.
- Theme-aware UI across header, sections, portfolio scenes, and profile media.
- Scroll storytelling driven with `animejs` and scene-based animation primitives.

## Tech Stack

```txt
Astro        -> routing, SSR, page composition
Tailwind CSS -> layout utilities and shared tokens
Anime.js     -> scroll-driven transitions and staged reveals
Node adapter -> server runtime for Astro
Nodemailer   -> SMTP delivery for forms
PostCSS      -> CSS pipeline
```

## Project Structure

```txt
src/
  components/
    blog/
    contact/
    development-request/
    home/
    profile/
    projects/
    services/
    shared/
  data/
    en/
    es/
  layouts/
  lib/
  pages/
  scripts/
  server/
  styles/
public/
  projects/
  wallpapers/
docs/
```

## Important Areas

| Area | Purpose |
| --- | --- |
| `src/pages` | Public routes and API endpoints |
| `src/components` | Page sections, cards, modals, forms, and reusable UI |
| `src/data` | Structured content for ES and EN datasets |
| `src/styles` | Global styling, page-specific systems, motion, and scene CSS |
| `src/scripts` | Client-side animation and interaction logic |
| `src/server` | Email delivery and server-side helpers |
| `public/projects` | Portfolio project assets used in `/proyectos` |
| `public/wallpapers/videos` | Background video assets used by the home hero |

## Run Locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Node runtime deployment:

```bash
node ./dist/server/entry.mjs
```

## Environment Variables

Server-side email delivery uses SMTP and reads:

```env
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_smtp_password_or_app_password
EMAIL_TO=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
```

Reference: [`docs/email-delivery.md`](./docs/email-delivery.md)

## Documentation Map

- [`docs/README.md`](./docs/README.md): internal documentation index
- [`docs/home-hero-visual-system.md`](./docs/home-hero-visual-system.md): home hero visual rules, theme behavior, and asset references
- [`docs/email-delivery.md`](./docs/email-delivery.md): SMTP setup and API delivery flow
- [`docs/proyectos-modifier-guide.md`](./docs/proyectos-modifier-guide.md): how to add or update portfolio projects
- [`docs/proyectos-refactor-2026.md`](./docs/proyectos-refactor-2026.md): current `/proyectos` architecture and content model
- [`docs/proyectos-scroll-architecture.md`](./docs/proyectos-scroll-architecture.md): low-level scene and scroll engine details

## Deployment Notes

- The site is configured for Astro **server output** with `@astrojs/node`.
- Form endpoints are not prerendered and require a live Node process.
- Portfolio and hero media live under `public/`, so missing assets will break visual sections at runtime.
- The current build still emits one known warning for `src/pages/blog/[slug].astro` because `getStaticPaths()` is used without `export const prerender = true;`. This does not block the current Node SSR deployment.

## Why This Repo Matters

- It is the public product surface for CYSTEMS.
- It demonstrates UI direction, motion design, and technical structure in one place.
- It supports lead capture with real server-side delivery.
- It is designed to keep evolving through centralized content and maintainable page systems.

## Contact

- Web: [cystems.ec](https://cystems.ec)
- LinkedIn: [Cristian Bravo](https://www.linkedin.com/in/cristian-bravodev/)
- Email: `contacto@cystems.dev`

---

<p align="center">
  Built to present product thinking, visual craft, and maintainable frontend architecture in a single experience.
</p>
