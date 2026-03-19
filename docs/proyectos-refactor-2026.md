# Refactor y Guía de Arquitectura: /proyectos (Marzo 2026)

Este documento centraliza todos los detalles técnicos, de contenido y de funcionamiento de la vista interactiva de proyectos. Cubre tanto las actualizaciones de diseño (layout alternado, grid equitativo, nuevos enlaces, fix de scroll) como un **manual paso a paso** para modificar textos, imágenes o agregar nuevos proyectos para aumentar la visualización del portafolio.

---

## 1. Diseño y Layout

### 1.1 Layout Alternado y Simétrico
- **Distribución:** La cuadrícula CSS separa el contenido en dos columnas exactamente iguales, usando `grid-template-columns: 1fr 1fr`. Esto garantiza que las imágenes se vean del mismo tamaño sin importar en qué lado de la pantalla estén.
- **Alternancia (Zig-Zag):**
  - Los **proyectos pares** (0, 2, 4...) muestran el texto a la izquierda y las imágenes a la derecha. (CSS order por defecto).
  - Los **proyectos impares** (1, 3, 5...) inyectan la clase `.ps-project--reverse`. Mediante CSS (`order: 2` y `order: 1`), invierten las columnas.
- **Móvil:** En pantallas pequeñas (`<860px`), la regla `order: unset` agrupa todo en una sola columna legible: siempre el título/texto arriba y las imágenes abajo.

### 1.2 Enlaces Extendidos de Proyecto
La interfaz `ProjectReferenceContent` (en `src/data/es/projects.ts`) ahora maneja tres estados para links:
1. `productionUrl`: Genera un link violeta "PRODUCCIÓN ↗" por **encima de la galería**.
2. `repoUrl`: Genera un link neutral "GITHUB →" por **debajo de la galería**.
3. `isPrivateRepo: true`: (Si no hay `repoUrl`) genera una etiqueta pasiva (sin clic) "🔒 GITHUB PRIVADO" debajo de la galería.

### 1.3 Resoluciones de Errores (Fixes Críticos aplicados)
- **Error del Scroll (La última vista no se veía):** El espaciador físico (`ps-spacer`) requería un margen extra. Se aumentó la fórmula a `window.innerHeight * 2` y se ajustó el observador `raw >= totalScenes - 1.25` para forzar que el usuario siempre aterrice en el "Call to Action" sin necesidad de arrastrar el scroll más allá de los límites del navegador.
- **Error de Opacidad del CTA:** La escena final (`.ps-cta__panel`) estaba siendo omitida por las animaciones porque le faltaba el atributo `data-reveal`. Al añadirlo en el HTML, el panel ahora vuelve a aparecer con fundido cuando el usuario llega abajo del todo.

---

## 2. Manual de Modificación de Contenido (Textos, Imágenes y Vistas)

### ¿Dónde vive el contenido?
Todo archivo de componentes y lógica lee sus datos de **`src/data/es/projects.ts`**. No edites HTML si solo necesitas cambiar textos o imágenes.

### 2.1 Cómo modificar Textos y Enlaces de un Proyecto existente
1. Abre `src/data/es/projects.ts`.
2. Busca la constante `projectsPortfolioContent = { ... groups: [ ... ] }`.
3. Dentro de `references`, localiza tu proyecto y edita sus propiedades:

```ts
{
  title: "Nuevo Título Deslumbrante",
  client: "Mi Cliente",
  overview: "Una descripción breve pero potente para captar el interés.",
  tags: ["Astro", "Tailwind", "React"],
  confidential: false,
  // Para enlaces:
  productionUrl: "https://midominio.com",
  repoUrl: "https://github.com/usuario/repo", // Si es público
  isPrivateRepo: true // Ponlo en true e ignora repoUrl si es código cerrado
}
```

### 2.2 Cómo cambiar las Imágenes de las Galerías
Cada proyecto necesita objetos bajo la clave `gallery`. El atributo `image` llama directamente a la ruta donde la subiste (usualmente en `/public/images/...`).

**Para cambiar una imagen:**
```ts
gallery: [
  {
    image: "/images/proyectos/mi_nueva_imagen.webp", // Ruta de tu archivo
    alt: "Captura de la plataforma",
    wide: false // true si quieres que ocupe todo el ancho de la caja (16/7 vs 16/10)
  },
  { image: undefined, placeholder: "Próximamente", wide: false } // Caja gris si no hay imagen
]
```

### 2.3 Cómo agregar un Proyecto (Aumentar una "Vista")
Para que tu portafolio muestre más proyectos (aumentando la duración del scroll), simplemente **añade un bloque nuevo** al arreglo de `references` en `projects.ts`:

1. Ve a `projects.ts` -> `projectsPortfolioContent.groups[0].references`.
2. Copia y pega un proyecto existente al final de la lista.
3. Modifica su título, descripción y galería.
4. **¡Y ya está!** El motor interactivo de `projectsScrollAnimation.ts` calculará automáticamente que hay una nueva vista (`totalScenes` += 1), extenderá el alto del documento de scroll y añadirá un nuevo "Punto" (dot) flotante de navegación a la derecha (e.g. 7 / 8).
5. El sistema aplicará automáticamente el diseño de alternancia visual para que encaje perfecto con los colores (`data-tone`).

---

## 3. Resumen de Archivos Editados

| Archivo | Nivel / Capa | Rol |
| :--- | :--- | :--- |
| `src/data/es/projects.ts` | **Datos / Contenido** | Interfaz extendida para enlaces. Añadir o editar proyectos afecta aquí. |
| `src/pages/proyectos.astro` | **HTML / Render** | Inyecta las clases `data-reveal` para visibilidad, renderiza condicionales paramétricos para botones/enlaces, y alterna la clase contenedora `ps-project--reverse`. |
| `src/styles/proyectos-scene.css` | **UI / CSS** | Sistema grid reforzado a partición `1fr 1fr`. Estilización independiente para enlaces y control responsivo de Mobile `<859px`. |
| `src/scripts/projectsScrollAnimation.ts` | **Motor de Eventos** | Lógica física del enrutamiento vertical. Altura de scroll y detección temprana límite de "Última Escena" ajustada al factor 1.25. |
