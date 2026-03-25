# Documentation Index

This folder contains the internal reference material for the main site systems.

## Available Guides

- `email-delivery.md`
  - SMTP configuration, API endpoints, and server-side email behavior.
- `home-hero-visual-system.md`
  - Theme-aware home hero rules, video asset mapping, overlays, glass card treatment, and responsive notes.
- `proyectos-modifier-guide.md`
  - Practical guide for adding or editing projects in `/proyectos`.
- `proyectos-refactor-2026.md`
  - Current architecture overview for the portfolio page after the 2026 refactor.
- `proyectos-scroll-architecture.md`
  - Low-level behavior of the scroll-driven scene engine.

## Recommended Reading Order

1. Read `proyectos-refactor-2026.md` if you need a high-level mental model of `/proyectos`.
2. Use `proyectos-modifier-guide.md` when you only need to change content or assets.
3. Use `proyectos-scroll-architecture.md` if you are touching scroll logic, spacer math, or scene transitions.
4. Use `home-hero-visual-system.md` before changing hero media, theme behavior, or the home glass card.
5. Use `email-delivery.md` before changing SMTP settings or form delivery.
