# Refactor 2026 de `/proyectos`

Este documento describe la arquitectura actual de `/proyectos` después del refactor del portafolio en 2026.

## Estructura general

La página principal del portafolio se renderiza desde:

- `src/pages/proyectos.astro`

Está construida como una experiencia por escenas:

1. escena hero
2. una escena por proyecto
3. una escena final de CTA

La página calcula de forma dinámica:

- `allProjects`
- `totalProjects`
- `totalScenes`

todo a partir del dataset estructurado en `src/data/es/projects.ts`.

## Bloques principales

### Datos

- `src/data/es/projects.ts`

Define el modelo completo de contenido para:

- intro del portafolio
- avatar del hero
- grupos de proyectos
- proyectos individuales
- CTA final

### Página

- `src/pages/proyectos.astro`

Se encarga de:

- aplanar los grupos en una secuencia lineal de escenas
- asignar índices de escena
- aplicar tonos cíclicos
- decidir entre escena estándar y escena destacada con `featuredHero`
- renderizar progreso, dots, contadores y CTA

### Renderizador de proyectos destacados

- `src/components/projects/sections/ProjectFeaturedHero.astro`

Se usa cuando un proyecto define `featuredHero`.

### Motor de scroll

- `src/scripts/projectsScrollAnimation.ts`

Controla:

- altura del spacer
- activación de escenas
- progreso visual
- navegación por dots
- fallback para `prefers-reduced-motion`
- resnap al redimensionar

### Estilos

- `src/styles/proyectos-scene.css`
- `src/styles/hero-animations.css` para el tratamiento visual del CTA

## Modelo actual de escenas

La página usa:

- escena `0`: hero del portafolio
- escenas `1..N`: proyectos
- última escena: CTA final

Cada escena se identifica con:

- `data-ps-scene`
- `data-scene-index`

El escenario fijo usa:

- `data-ps-stage`

El conductor invisible del scroll usa:

- `data-ps-spacer`

## Escena estándar de proyecto

Una escena estándar incluye:

- fila de metadata
- título y descripción
- lista de tags
- etiqueta de confidencialidad opcional
- slots de galería
- barra de acciones

El layout y las variantes se controlan desde `src/pages/proyectos.astro` y se estilizan en `src/styles/proyectos-scene.css`.

## Escena destacada de proyecto

Si un proyecto define `featuredHero`, la página renderiza la versión premium en lugar de la galería estándar.

Variantes soportadas actualmente:

- `edu-saas`
- `industrial-corporate`
- `retail-commerce`
- `academic-platform`
- `confidential-private`

Estas variantes influyen en tono, composición, media decorativa y presentación de acciones.

## Reglas actuales de contenido

- Los proyectos públicos pueden incluir capturas, links productivos y GitHub.
- Los proyectos confidenciales pueden omitir imágenes públicas y seguir renderizando correctamente.
- La media decorativa de proyectos destacados debe vivir en `public/projects/...`.

## Por qué importa este refactor

- Los proyectos se agregan desde datos, no desde HTML duplicado.
- El conteo de escenas, el progreso y la navegación escalan automáticamente.
- La página soporta trabajo público y referencias confidenciales en la misma arquitectura.
- Motion y estilos quedan centralizados en lugar de repartidos entre componentes ad hoc.
