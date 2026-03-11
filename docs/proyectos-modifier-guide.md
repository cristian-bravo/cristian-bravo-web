# Guía de Uso del Portafolio: Añadir, Modificar y Diseñar Escenas

Este documento funciona como el manual de usuario para el sistema narrativo "Scroll-driven Scenes" que corre en tu página de `/proyectos`. **Literalmente todo está automatizado**, lo que significa que agregar nuevas vistas o rediseñarlas requiere un esfuerzo mínimo si sigues estas reglas.

---

## 1. ¿Cómo se generan las escenas actuales?

Las escenas mostradas en `src/pages/proyectos.astro` no están fijas (quemadas) a mano en su totalidad, de hecho su centro iterativo carga dinámicamente un array basado de tu documento de estructura principal:

**Archivo Data:** `src/data/projects.ts`

Si necesitas agregar, re-ordenar o quitar los proyectos principales que se muestran durante el recorrido con Scroll:
1. Abre `src/data/projects.ts`.
2. Busca el objeto maestro estático exportado `projectsPortfolioContent`.
3. Verás la clave `groups`, la cual expone objetos `ProjectGroupContent` (por ejemplo: `PROYECTOS PUBLICOS`, `PROYECTOS PRIVADOS`).
4. Solo debes insertar un nuevo proyecto dentro del array `.references` de cualquiera de esos grupos. 

> [!NOTE] 
> Al agregar el objeto allí y guardar los cambios, de manera **automática** Astro generará la nueva escena a pantalla completa en la página, le asignará el índice numérico correcto (e.g. `04 / 08`), ajustará la distancia total del Scroll invisible de la página y sumará un "punto" más a la barra de navegación (dot navigation). Literalmente no requieres tocar JavaScript.

---

## 2. ¿Cómo agregar una Vista / Escena personalizada (No es un Proyecto)?

Si requieres insertar una pantalla promocional, una imagen publicitaria enorme, o algo ajeno a "un nuevo proyecto", puedes inyectar HTML manual libre dentro de `src/pages/proyectos.astro` bajo este estricto formato.

### Pasos para insertar una "Vista Base":
Debes ubicar la zona del contenedor principal etiquetado como `div class="ps-stage"`. Notarás bloques comentados como `<!-- ── SCENE 0: HERO ── -->` o `<!-- ── FINAL SCENE: CTA ── -->`.

Copia y pega la siguiente estructura donde desees que aparezca el nuevo slide durante el Scroll:

```html
<div
  class="ps-scene"               <!-- 1. Obligatorio -->
  data-ps-scene                  <!-- 2. Obligatorio para el JS -->
  data-scene-index="N"           <!-- 3. Dejar Astro dinámico (ej: stepIndex + 1) -->
  aria-label="Nueva Vista 5"
>
  <div class="ps-scene__inner">  <!-- Contenedor alineado max-1200px (Obligatorio) -->
    
    <!-- Aquí empieza TU DISEÑO PROPIO -->
    <div class="tu-clase-maestra-css">
      <h2 data-reveal>Título Increíble</h2>
      <p data-reveal>Esta es mi nueva escena manual, controlada por AnimeJS.</p>
    </div>
    
  </div>
</div>
```

### El Secreto Clave: `data-reveal`
En el motor de AnimeJS custom (`src/scripts/projectsScrollAnimation.ts`), implementé algo llamado "Cascada de Staggering". 
Si a cualquier nodo (un `<h1>`, `<p>`, `<img>` o `<div>` que contenga tarjetas) le colocas el atributo html **`data-reveal`**, el sistema lo detectará automáticamente.
Una vez la escena principal se detiene de frente en la cámara, todos los elementos que tengan el atributo `data-reveal` **entrarán volando suavemente hacia arriba**, uno a uno (delay de `70ms` entre ellos).

---

## 3. ¿Cómo modificar el diseño (CSS y Temas UI)?

Si los colores, paddings estructurales, el Dark Mode, o la tipografía de las escenas requieren modificaciones mayores o menores, todo se consolida en un único archivo maestro.

**Archivo Maestro CSS:** `src/styles/proyectos-scene.css`

Este es un entorno CSS Vainilla enfocado en clases modulares siguiendo convención BEM (`.ps-project`, `.ps-project__galley-item`).

### Modificar Fondos por "Temática de Proyecto" (Tones)
Notarás que cuando vas pasando de proyecto en proyecto, los fondos radiantes cambian fluidamente de púrpuras, a azulados, verdosos e índigos mágicos. Esto se logra leyendo la cantidad total de tus data sets a base del iterador de Astro y asignándoles una clase iterativa infinita llamada `.ps-scene--project[data-tone="N"]`.

1. **Abre `proyectos-scene.css`.** Ubica las variables cerca de la línea 50:
```css
/* Tone = 0 (Ejemplo de purpuras/azules) */
.ps-scene--project[data-tone="0"] {
  background: radial-gradient(ellipse 70% 55% at 15% 25%, rgba(124, 58, 237, 0.14) 0%, transparent 55%), ...
}

/* Y su equivalente Dark Mode: */
.dark .ps-scene--project[data-tone="0"] {
  background: radial-gradient(ellipse 70% 55% at 15% 25%, rgba(129, 140, 248, 0.2) 0%, ...
}
```
Existen actualmente `6` tonos cíclicos (`[data-tone="0"]` hasta el `5`). Puedes ir ahí y alterar los valores hexadecimales clásicos y colores RGBA para que calcen con tu propia escala hex corporativa si en un futuro cambias la marca "CYSTEMS", o incluso agregar texturas SVG.

### Modificando Layout de Proyectos (Grillas e imágenes)
Si no te gusta que la información (Title, Descripción y Tags) quede a la Izquierda y la Galería de imágenes cuadrada quede a la derecha, su maquetación se maneja vía `Grid layout`:

- Buscar `.ps-project` en `proyectos-scene.css`. Esta es la caja mágica que define el layout general del proyecto.
- Hay un media query (`@media (min-width: 860px)`) que dice `grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);`. Esto le dice al browser "divide la escena en dos columnas, da `1.1fr` de espacio izquierdo y `0.9fr` derecho" (haciendo que los screenshots pesen estéticamente menos que la lectura del Case Study). Puedes invertir estos valores libremente a `0.9fr 1.1fr` o cambiar toda la grilla a orientaciones verticales retirando el `@media`.

---

## 4. ¿Cómo modificar los "Dots" y Progreso infernal?

### La barra medidora
- En el layout CSS busca `.ps-progress__fill`. Modifica `background: linear-gradient(to right, #7c3aed, #3b82f6);` por el color de barra horizontal inferior que prefieras.

### Navegación (Puntos laterales derechos)
- Las bolitas en su estado natural están bajo la clase `.ps-dot` con un grosor de `0.44rem`.
- Puedes editar su crecimiento en el hover desde la subclase `.ps-dot:hover { transform: scale(1.4); }`.
- Si deseas cambiar el color o aro brillante que refleja con aura púrpura al seleccionar, ir a `.ps-dot.is-active`, su `box-shadow` maneja los valores rgba del borde mágico.

---

> [!TIP]
> **En resumen:** Todo el contenido es dirigido automáticamente por TS por el simple de hecho de pertenecer a los datasets globales `data-ps-scene`. El código HTML `src/pages/proyectos.astro` no requiere cambios lógicos fuertes salvo inyectar un nuevo Tag HTML con `class="ps-scene"`. 
> Jamás insertes comportamientos `position: absolute; overflow-y: auto;` globalmente si editas CSS, dado que mataría instanténeamente el entorno fixed de la escena en 100vh.
