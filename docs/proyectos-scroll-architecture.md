# Scroll Architecture for `/proyectos`

This document focuses on the low-level scene engine used by the portfolio page.

## Core Idea

`/proyectos` is not a long document that naturally scrolls through normal blocks.
Instead, it behaves like a fixed stage controlled by native window scroll.

The browser still sees a vertical document because the page injects an invisible spacer, but the visible content stays inside a fixed stage and swaps active scenes.

## Relevant Files

- `src/pages/proyectos.astro`
- `src/scripts/projectsScrollAnimation.ts`
- `src/styles/proyectos-scene.css`

## Runtime Elements

The scroll system depends on these markers:

- `[data-ps-stage]`
- `[data-ps-spacer]`
- `[data-ps-scene]`
- `[data-ps-dot]`
- `[data-ps-progress-fill]`
- `[data-ps-counter-current]`
- `[data-ps-counter-total]`

If any of those disappear, the engine will partially or fully stop working.

## Scene Entry and Exit

The engine uses `animejs` to control scene transitions.

### Exit

- opacity fades out
- scene translates upward
- scene scales down slightly

### Enter

- opacity fades in
- scene translates upward into place
- scene scales from `0.97` to `1`
- child nodes with `[data-reveal]` are staggered

## Scroll Distance Model

Each scene does not require a full viewport of scroll.

Current rule:

```ts
const getScrollDistance = () => window.innerHeight * 0.45;
```

That makes the experience feel more responsive and prevents excessive wheel movement per scene.

## Spacer Height

The spacer is calculated with extra tail room so the last CTA scene remains reachable:

```ts
spacer.style.height = `${(totalScenes - 1) * getScrollDistance() + window.innerHeight * 2}px`;
```

## Scene Mapping

The current scene index is derived from `window.scrollY / getScrollDistance()`.

There is a late-stage lock for the last scene:

```ts
const index = raw >= totalScenes - 1.25 ? totalScenes - 1 : Math.round(raw);
```

That prevents the CTA from feeling unreachable near the end of the document.

## Reduced Motion

If `prefers-reduced-motion: reduce` is active:

- scene transitions become immediate
- staggered reveal animations are skipped
- active scene state is still preserved

## Resize Behavior

On resize, the engine:

1. recalculates spacer height
2. waits briefly with debounce
3. scrolls back to the current logical scene

That avoids losing the active scene after viewport height changes.

## Safe Editing Rules

- Do not remove `data-ps-*` attributes casually.
- Do not change spacer logic without testing the final CTA.
- Do not add `overflow-y: auto` or conflicting fixed-position containers inside the stage.
- If you add new animated elements to a scene, prefer `data-reveal` before writing custom timing logic.
