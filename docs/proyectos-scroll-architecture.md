# Arquitectura de Animación por Scroll: Portafolio de Proyectos

Este documento detalla la refactorización profunda realizada en la página `/proyectos` para transformar la experiencia de usuario (UX) en un formato narrativo inmersivo (Storytelling estilo Anime.js), donde el scroll natural de la ventana se convierte en el control de una "línea de tiempo" de escenas, en lugar de un desplazamiento del documento.

---

## 1. El Concepto Funcional

En pantallas tradicionales, el usuario hace "*scroll*" para mover una página verticalmente desde su punto inicial al final, pasando por todos sus componentes visuales ordenados en un DOM tradicional (`position: relative`).

**El nuevo sistema (Scroll-driven Scenes)** hace lo siguiente:
- Fija la vista (pantalla completa o viewport) de todo el contenido. El nodo principal nunca se desplaza en Y (`overflow: hidden` o `position: fixed`).
- Se inserta una "barra espaciadora" o **Spacer** escondido que toma la altura de `N` veces el tamaño de la pantalla. Esto logra engañar al navegador, causando que renderice y active el scrollbar nativo de la ventana, permitiendo la misma usabilidad (scroll wheel de mouse, swipe en móviles, trackpad) sin mover la página visualmente.
- Se lee el evento `window.onscroll` o directamente el valor de `scrollY` en cada tick, mapeando esta elevación (distancia en píxeles) a un **Índice de Escena** actual del 0 al N.
- Al cambiar este índice, se le indica por Javascript a un módulo de motor de animación (`Anime.js` en nuestro caso) que expulse la escena anterior con fade-out e introduzca la nueva con `staggering`.

---

## 2. Archivos y Estructura Desarrollada

El desarrollo abarca tres componentes clave:

### A. La Página: `src/pages/proyectos.astro`
El archivo HTML principal. Se destruyeron todos los shells `.project-scroll-step` viejos e innecesarios orientados a *Intersection Observer* en documento abierto, para generar esto:

```html
<div class="ps-root">
  <!-- El separador invisible (Spacer), altura controlada por TS -->
  <div data-ps-spacer style="height: 100vh;"></div>

  <!-- El contenedor principal (Stage), FIJO en el fondo -->
  <div class="ps-stage" data-ps-stage>
      
      <!-- ESCENA 0: Hero -->
      <div class="ps-scene ps-scene--hero" data-ps-scene data-scene-index="0">...</div>
      
      <!-- ESCENA 1 a N: Proyectos Iterados (N-1) -->
      <div class="ps-scene ps-scene--project" data-ps-scene data-scene-index="1">...</div>
      <!-- ... -->
      
      <!-- ESCENA FINAL: Llamado a la acción -->
      <div class="ps-scene ps-scene--cta" data-ps-scene data-scene-index="N">...</div>
      
  </div>
</div>
```

Elementos como las "Dots" o navegación de bolitas iteran los mismos proyectos basándose en la longitud de `totalScenes`.

### B. El Estilo Global: `src/styles/proyectos-scene.css`
Controla absolutamente todos los detalles fijos y flex, además de pre-esconder todo.
- `.ps-stage`: Elemento con capa `z-index: 1`, `position: fixed`, `inset: 0` y `overflow: hidden`. Éste previene problemas como scroll rebotando en bordes y cortes de imagen.
- `.ps-scene`: Elemento con `position: absolute`, que abarca exacto el `inset: 0` del parent y recibe `opacity: 0` junto con `pointer-events: none` por defecto para no tapar los clicks de las escenas visibles, y cuando logran el scope JS reciben una clase `.is-active` para poder realizar hover/click sobre los items interiores.

### C. La Lógica Typescript: `src/scripts/projectsScrollAnimation.ts`

El motor lógico central de esta versión.

1. **Inferencia de Sensibilidad:** 
Originalmente una escena requería todo un `100vh` de *Scroll* para saltar al siguiente cuadro (es decir, el mismo largo exacto de tu ventana en navegador por página equivalente). Esto provocaba la mala experiencia de tener que girar la perilla/scroll demasiado ("doble scrolling").
**La solución** fue generar una sensibilidad del `45%` por vista. Esto se logra multiplicando una ventana `window.innerHeight * 0.45` en la constante perimetral del iterador en la lectura de `scrollY`:
```typescript
const getScrollDistance = () => window.innerHeight * 0.45;

const updateSpacerHeight = () => {
    // Spacer Height requiere el padding por transición más tu ventana real actual al final
    spacer.style.height = `${(totalScenes - 1) * getScrollDistance() + window.innerHeight}px`;
};

const onScroll = () => {
    // Calculo rápido, exacto e instantaneo al index de escena:
    const index = Math.round(window.scrollY / getScrollDistance());
    goToScene(index);
};
```

2. **Control Anime.js Exclusivo:** 
El JS detecta cambios (`index !== currentIndex`), y ejecuta en base a funciones:
   - *exitScene*: Aplica la ruta inversa u oculta escaladas o fades transicionadas:
     ```javascript
     animate(el, { opacity: [1, 0], translateY: [0, -48], duration: 440 })
     ```
   - *enterScene*: Introduce a la caja padre y además llama a la cascada de **Stagger** (Efecto donde elementos visuales bajan/crecen un milisegundo despues del anterior para sensación dinámica).
     ```javascript
     animate(el, { opacity: [0, 1], translateY: [48, 0], duration: 680 })
     // Elementos interiores hijos [data-reveal]:
     animate(reveals, { opacity: [0, 1], delay: stagger(70) })
     ```

## 3. Comportamientos Menores de Calidad (UX / Resistencia a Errores)

1. **Re-calculo de Ventana (Resize Re-Snap):**
El usuario a veces redimensiona el navegador mientras está en la escena N°5. Esto cambia radicalmente `window.innerHeight` y, peor aun, el estado de tu scroll es en base de Píxeles. El script contiene un `onResize(() => window.scrollTo(.. behavior: instant))` que reescala la "altura" escondida y centra nuevamente la cámara en la escena exacta donde había quedado el usuario tras presionar "refresh" u obtener la respuesta final del Timer debounced (`120ms`) de achicamiento de navegador.

2. **Disminuir el movimiento de OS (`prefers-reduced-motion`):**
Cualquier evento del sistema operativo enfocado en accesibilidad (por ejemplo en un iPhone: 'General > Accessibility > Reduce Motion = ON') anula toda la librería central `Anime.js` forzando las transiciones a 0px offset de translación de manera instantánea o opácidad instantánea previniendo problemas para visitantes con foto-sensibilidad. Ocurriendo directamente por lectura de un `window.matchMedia`.
