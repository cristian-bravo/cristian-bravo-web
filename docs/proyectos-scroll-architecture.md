# Arquitectura de scroll para `/proyectos`

Este documento describe el motor de escenas que usa actualmente la página del portafolio.

## Idea central

`/proyectos` no funciona como un documento largo que se recorre con scroll tradicional.
Visualmente se comporta como un escenario fijo controlado por el scroll nativo de la ventana.

El navegador sigue viendo un documento vertical porque la página inyecta un spacer invisible, pero el contenido visible permanece dentro de un stage fijo y solo cambia la escena activa.

## Archivos relevantes

- `src/pages/proyectos.astro`
- `src/scripts/projectsScrollAnimation.ts`
- `src/styles/proyectos-scene.css`

## Elementos de runtime

El sistema depende de estos marcadores:

- `[data-ps-stage]`
- `[data-ps-spacer]`
- `[data-ps-scene]`
- `[data-ps-dot]`
- `[data-ps-progress-fill]`
- `[data-ps-counter-current]`
- `[data-ps-counter-total]`

Si alguno desaparece, el motor puede dejar de funcionar parcial o totalmente.

## Entrada y salida de escenas

El motor usa `animejs` para controlar las transiciones.

### Salida

- la opacidad baja
- la escena se desplaza hacia arriba
- la escena se reduce ligeramente

### Entrada

- la opacidad sube
- la escena entra desde abajo hacia su posición final
- la escala pasa de `0.97` a `1`
- los nodos hijos con `[data-reveal]` aparecen con stagger

## Modelo de distancia de scroll

Cada escena no exige un viewport completo de scroll.

Regla actual:

```ts
const getScrollDistance = () => window.innerHeight * 0.45;
```

Eso hace que la experiencia se sienta más ágil y evita exigir demasiado desplazamiento por escena.

## Altura del spacer

El spacer se calcula con cola extra para asegurar que la última escena sea alcanzable:

```ts
spacer.style.height = `${(totalScenes - 1) * getScrollDistance() + window.innerHeight * 2}px`;
```

## Mapeo entre scroll y escena

El índice actual se deriva de `window.scrollY / getScrollDistance()`.

Además existe un bloqueo tardío para la última escena:

```ts
const index = raw >= totalScenes - 1.25 ? totalScenes - 1 : Math.round(raw);
```

Eso evita que el CTA final se sienta inalcanzable en el tramo final.

## Reduced motion

Si `prefers-reduced-motion: reduce` está activo:

- las transiciones pasan a ser inmediatas
- se omite el stagger de elementos internos
- la escena activa sigue manteniendo su estado visual

## Comportamiento al redimensionar

Cuando cambia el tamaño de la ventana, el motor:

1. recalcula la altura del spacer
2. espera con un debounce breve
3. reposiciona el scroll sobre la escena lógica actual

Eso evita perder la escena activa después de un resize.

## Reglas seguras de edición

- No elimines atributos `data-ps-*` sin revisar el motor.
- No cambies la lógica del spacer sin probar la escena final.
- No añadas `overflow-y: auto` ni contenedores fijos en conflicto dentro del stage.
- Si agregas elementos animados en una escena, prioriza `data-reveal` antes de introducir tiempos custom.
