# Home Hero Visual System

This document explains how the current home hero works and where to change it safely.

## Source Files

- `src/components/home/sections/HomeHeroSection.astro`
- `src/styles/home.css`

## Theme-Aware Video Mapping

The hero currently uses two background videos:

- light mode: `/wallpapers/videos/avatar_pets.mp4`
- dark mode: `/wallpapers/videos/avatar_clean.mp4`

Both videos are mounted in the same media layer and toggled through theme-aware CSS classes:

- `.home-hero__video--light`
- `.home-hero__video--dark`

## Visual Layers

The hero is composed of four depth layers:

1. background video
2. overlay stack
3. layout halo behind the card
4. glass content card

### Overlay stack

The overlay uses three variables:

- `--home-hero-overlay-accent`
- `--home-hero-overlay-main`
- `--home-hero-overlay-secondary`

These control:

- global darkening
- edge-to-center legibility
- subtle depth accenting

### Card separation

The card uses:

- `--home-hero-panel-bg`
- `--home-hero-panel-border`
- `--home-hero-panel-shadow`
- `--home-hero-panel-sheen`
- `--home-hero-card-halo`

Those values are tuned separately for light and dark mode.

## Content Zones

The current card contains:

- eyebrow / kicker
- main title
- supporting subtitle
- primary and secondary actions
- two metadata blocks

Relevant classes:

- `.home-hero__eyebrow`
- `.home-hero__title`
- `.home-hero__subtitle`
- `.home-hero__actions`
- `.home-hero__meta`

## Responsive Behavior

### Mobile

- the hero stays tall enough to preserve the video impact
- the content card expands to full width
- CTA buttons stack vertically
- the background video shifts to `object-position: 56% center`

### Tablet

- the content card narrows slightly
- the video shifts to `object-position: 54% center`

## Safe Editing Rules

- Keep hero videos under `public/wallpapers/videos/`.
- If you change a hero video filename, update both the Astro component and deployment assets.
- Change overlay values before increasing text opacity aggressively.
- Change card separation through shadow, border, and halo first; avoid heavy blur or artificial glow.
- Re-test both theme modes after any visual adjustment.

## Recommended Workflow

1. Update media assets if needed.
2. Adjust `HomeHeroSection.astro` only if structure or asset mapping changes.
3. Adjust `src/styles/home.css` for visual tuning.
4. Run `npm run build`.
5. Verify the hero in light mode, dark mode, mobile, and desktop.
