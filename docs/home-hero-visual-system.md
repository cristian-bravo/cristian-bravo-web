# Sistema visual del hero del home

Este documento explica cómo funciona el hero principal del home y qué debes tocar para modificarlo sin romper su coherencia visual.

## Archivos fuente

- `src/components/home/sections/HomeHeroSection.astro`
- `src/styles/home.css`

## Asignación de videos por tema

El hero actual utiliza dos videos de fondo:

- modo claro: `/wallpapers/videos/avatar_pets.mp4`
- modo oscuro: `/wallpapers/videos/avatar_clean.mp4`

Ambos videos viven dentro de la misma capa visual y se activan por tema mediante clases CSS:

- `.home-hero__video--light`
- `.home-hero__video--dark`

## Capas visuales

El hero está construido con cuatro niveles de profundidad:

1. video de fondo
2. stack de overlays
3. halo posterior del layout
4. glass card del contenido

### Stack de overlays

El oscurecimiento y la profundidad del fondo se controlan con estas variables:

- `--home-hero-overlay-accent`
- `--home-hero-overlay-main`
- `--home-hero-overlay-secondary`

Estas capas resuelven:

- legibilidad general
- separación entre texto y fondo
- profundidad sutil sin ensuciar la imagen

### Separación de la glass card

La tarjeta principal usa estas variables:

- `--home-hero-panel-bg`
- `--home-hero-panel-border`
- `--home-hero-panel-shadow`
- `--home-hero-panel-sheen`
- `--home-hero-card-halo`

Cada una tiene una versión ajustada para modo claro y modo oscuro.

## Zonas de contenido

La glass card contiene:

- kicker superior
- título principal
- subtítulo
- acciones principales
- bloque de metadata

Clases relevantes:

- `.home-hero__eyebrow`
- `.home-hero__title`
- `.home-hero__subtitle`
- `.home-hero__actions`
- `.home-hero__meta`

## Comportamiento responsive

### Mobile

- el hero conserva suficiente altura para que el video siga teniendo impacto
- la tarjeta ocupa el ancho completo disponible
- los botones se apilan verticalmente
- el video se reposiciona con `object-position: 56% center`

### Tablet

- la tarjeta reduce un poco su ancho máximo
- el video se ajusta con `object-position: 54% center`

## Reglas seguras de edición

- Mantén los videos del hero dentro de `public/wallpapers/videos/`.
- Si cambias el nombre de un video, actualiza tanto el componente Astro como el asset de producción.
- Antes de subir más opacidad al texto, ajusta primero overlays y contraste del fondo.
- Para reforzar profundidad, prioriza halo, borde, sombra y blur antes que efectos agresivos.
- Revisa siempre modo claro, modo oscuro, desktop y mobile después de cualquier ajuste.

## Flujo recomendado de trabajo

1. Actualiza los assets si hace falta.
2. Modifica `HomeHeroSection.astro` solo si cambia la estructura o el mapeo de videos.
3. Ajusta `src/styles/home.css` para el refinamiento visual.
4. Ejecuta `npm run build`.
5. Verifica el hero en ambos temas y en distintos tamaños de pantalla.
