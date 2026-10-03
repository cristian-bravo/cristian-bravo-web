# Ampliación del portafolio — 3 de octubre de 2026

## Alcance y diseño

Se amplía `/proyectos` y su versión inglesa con ocho proyectos públicos y una mención bancaria independiente. Se reutilizan `ProjectFeaturedHero`, sus ventanas de imágenes, enlaces, tipografías Sora/Manrope, transiciones, navegación por puntos y motor `projectsScrollAnimation`. El ajuste posterior prioriza la responsividad y vincula el fondo de cada proyecto con su identidad visual, en ambos temas.

Antes de la ampliación se capturó el sitio publicado en 1440 y 390 px, en claro y oscuro. Se conservan las imágenes y la composición base de NY Campus Virtual, Fualtec, Alkosto y Plataformas educativas; la revisión posterior adapta sus colores y espaciado al nuevo comportamiento responsive. El resultado incluye quince proyectos.

Responsividad y presentación:

- La cabecera pasa a navegación móvil por debajo de 1120 px, evitando la superposición del menú con la portada. Desde 1120 px conserva la navegación de escritorio.
- Los proyectos usan scroll natural por debajo de 1120 px o con menos de 700 px de altura. En escritorio con espacio suficiente se mantiene el scroll por escenas; `prefers-reduced-motion` activa el modo natural.
- En tablet, la portada usa una composición compacta de dos columnas y los proyectos se muestran en una columna. Las ventanas de escritorio con poca altura reciben un espaciado más compacto.
- Los botones se distribuyen en varias líneas en móvil, con altura mínima de 44 px, evitando el recorte del enlace de repositorio de Fualtec.
- Columnas con `minmax(0, 1fr)` para que los textos confidenciales quepan a 320 px.
- Las quince escenas tienen tokens de color propios para fondo, superficie, texto, bordes y acciones. Berlina usa morado; Telollevamos, azul; DePaso, negro; Nexus, verde; SH Fast Recover, celeste. IDEC mantiene blanco en claro y gris oscuro en oscuro. Los demás proyectos también reciben una paleta coherente con su identidad.
- Las diecisiete vistas, incluida la portada y el cierre, incorporan fondos SVG con órbitas, rutas, líneas arquitectónicas, contornos u ondas según el proyecto. Anime.js mueve suavemente los grupos en ciclos de 20–24 segundos y recorre sus trazos en 24–27 segundos. Funciona en ambos temas y también en scroll natural: solo se animan las escenas visibles. Se pausa al ocultar la pestaña y se restaura una composición estática con movimiento reducido.

Se conserva el footer, las fuentes y el mecanismo de tema. En Sobre mí se mantiene la selección pública existente para evitar que crezca automáticamente con los nuevos proyectos y se restauran las menciones a 360IO y Club Guias.

## Orden final

1. NY Campus Virtual
2. Fundación Manos en Acción
3. Berlina
4. Telollevamos
5. DePaso
6. Riocargo Express
7. Fualtec
8. Alkosto
9. Plataformas educativas
10. IDEC
11. Nexus
12. SH Fast Recover
13. 360IO
14. Club Guias
15. Entidad bancaria — Sector financiero

## Capturas y procedencia

Capturas reales mediante Playwright, revisadas visualmente, sin imágenes generadas ni mockups inventados. Se visitaron las páginas y sus secciones interiores. Las vistas móviles de los ocho sitios se revisaron a 390 × 844 y DPR 2; se conservaron como evidencia local. Las imágenes publicadas utilizan vistas de escritorio compatibles con las ventanas de la galería existente.

| Proyecto | Fuente | Tres vistas incorporadas | Carpeta en `public/projects/` |
| --- | --- | --- | --- |
| Fundación Manos en Acción | [Sitio público](https://fundacionma.com), [administración](https://administracion.fundacionma.com) | Programa de becas, niveles de inglés, acceso administrativo | `Fundacion-Manos-en-Accion` |
| Berlina | [berlina.app](https://berlina.app) | Portada, seguridad, presentación de la aplicación | `Berlina` |
| Telollevamos | [telollevamos.com](https://telollevamos.com) | Tienda, catálogo, detalle de producto | `Telollevamos` |
| DePaso | [depaso.app](https://depaso.app) | Portada, panel administrativo local con datos de demostración, cotizador | `DePaso` |
| Riocargo Express | [riocargoexpress.com](https://riocargoexpress.com/) | Portada, proceso de importación, cotizador | `Riocargo-Express` |
| IDEC | [idec.ec](https://www.idec.ec) | Portada, plataformas empresariales, metodología | `IDEC` |
| Nexus | [nexuscorpec.com](https://www.nexuscorpec.com) | Portada, servicios, cotizador público vacío | `Nexus` |
| SH Fast Recover | [shfastrecover.com](https://shfastrecover.com) | Portada, solución de cobranza, servicios | `SH-Fast-Recover` |

Fundación conserva dos botones: página pública y administración. Solo se capturó la pantalla pública de acceso administrativo, sin iniciar sesión. El panel DePaso proviene de la aplicación Vue existente en el repositorio hermano `RioCargo/depaso/Depaso-Admin`, ejecutada con sus fixtures E2E, sin `.env` y con tráfico externo bloqueado. La galería y el texto alternativo lo identifican como demostración. No se utilizaron datos de clientes, sesiones o importes financieros reales. Los precios visibles en Telollevamos pertenecen a su catálogo público.

Berlina anuncia la aplicación como próxima a publicarse; el portafolio no afirma disponibilidad en tiendas. Los textos describen únicamente funciones verificadas públicamente o indicadas por el propietario.

## Imágenes y rendimiento

- 24 capturas WebP y 24 versiones responsive de 800 px.
- Portadas de 1600 × 900; vistas secundarias de 1600 × 1000. Variantes de 800 × 450/500.
- Originales: 1.981.852 bytes. Variantes: 747.868 bytes. Total de los 48 archivos: 2.729.720 bytes; archivo más grande: 175.360 bytes.
- `srcset`, `sizes`, dimensiones intrínsecas, `loading="lazy"` y `decoding="async"`, con las proporciones reservadas por las ventanas existentes.
- Se incorpora `animejs@4.5.0`, solicitado para las nuevas animaciones de fondo, mediante su módulo `animejs/animation`. Las escenas fijas de escritorio comparten el viewport; el navegador puede anticipar sus imágenes aunque usen lazy loading. En móvil la carga sigue la proximidad al scroll.
- Verificación de igualdad de bytes entre `public` y `dist/client` para los 48 archivos.

## Confidencialidad y CV

**360IO** y **Club Guias** recuperan sus nombres, descripciones, etiquetas y estados originales en español e inglés. Sus paneles decorativos se restauran desde la versión anterior del componente. Se elimina la sustitución por el título literal «Proyecto oculto».

Se añade una tercera mención, **Entidad bancaria** / **Banking institution**, con la categoría **Sector financiero**. Su texto y panel simbólico son genéricos: no atribuyen tecnologías, resultados, auditorías ni un nombre de banco; tampoco contienen enlaces, logos o capturas de clientes. La distinción es condicional en el componente, de modo que esta mención no reemplaza el contenido de los dos proyectos privados anteriores.

Se reemplazó el PDF anterior por `public/cv/Cristian_Bravo_Full_Stack_Developer_CV.pdf` (107.401 bytes), con URL `/cv/Cristian_Bravo_Full_Stack_Developer_CV.pdf`. El botón mantiene el atributo `download`, sin ruta local ni cambio de componente. Español e inglés comparten el archivo. El PDF antiguo ya no existe ni está referenciado.

SHA-256 del origen, archivo público, build y descarga HTTP:

`e6640d541860880153a65136f0f438784e30d58f3bad5834c0b8b0ec382bb8d3`

## Archivos de implementación

- `src/data/es/project-additions.ts` y `src/data/en/project-additions.ts`: contenido, enlaces, identidad de marca, orden de inserción y metadatos de capturas.
- `src/data/es/projects.ts` y `src/data/en/projects.ts`: integración, marcas de los proyectos originales, restauración de privados y nueva referencia bancaria; las traducciones antiguas se asocian por título para evitar errores al insertar proyectos.
- `src/components/projects/sections/ProjectFeaturedHero.astro`: imágenes responsive, texto de demostración y panel bancario genérico condicional, conservando los paneles privados originales.
- `src/components/Header.astro`: navegación responsive con breakpoint de 1120 px.
- `src/pages/proyectos.astro`: asociación de cada escena con su marca e incorporación de los nuevos estilos.
- `src/styles/proyectos-scene.css`: correcciones acotadas de contraste y tamaño disponible.
- `src/styles/project-brands.css`: paletas para las quince escenas de proyectos.
- `src/components/projects/ProjectAmbient.astro` y `src/styles/projects-ambient.css`: composición decorativa SVG para las diecisiete vistas.
- `src/scripts/projectsAmbientAnimation.ts`: movimiento con anime.js, pausa fuera de pantalla y limpieza al navegar.
- `src/styles/projects-responsive.css`: portada compacta de tablet y ajustes de espaciado de escritorio.
- `src/scripts/projectsScrollAnimation.ts`: modo natural según ancho, altura y preferencia de movimiento.
- `src/data/es/profile.ts` y `src/data/en/profile.ts`: CV y selección estable, conservando las menciones privadas originales.
- `public/projects/`: ocho carpetas nuevas; `public/cv/`: PDF nuevo y retirada del anterior.
- `e2e/projects-refresh.spec.ts`: cobertura funcional y visual de la ampliación.
- `e2e/projects-responsive.spec.ts`: cobertura de cabecera, breakpoints, altura disponible y contención del contenido.
- `e2e/projects-ambient.spec.ts`: cobertura del movimiento real de los SVG, escenas activas, scroll nativo y preferencia de movimiento reducido.

## Verificación

La compilación de producción se prueba localmente en `http://127.0.0.1:4400`, con correo y chat externos deshabilitados. No se ha publicado ni alterado el servidor de cystems.ec.

Comandos reproducibles:

```powershell
npm run typecheck
npm run build
$env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:4400'
node node_modules/@playwright/test/cli.js test e2e/projects-refresh.spec.ts --project=chromium --workers=2
node node_modules/@playwright/test/cli.js test e2e/projects-responsive.spec.ts --project=chromium --workers=2
node node_modules/@playwright/test/cli.js test e2e/projects-ambient.spec.ts --project=chromium --workers=1
node node_modules/@playwright/test/cli.js test e2e/animations.spec.ts e2e/interactions.spec.ts e2e/accessibility-seo.spec.ts --project=chromium --workers=2 --grep 'portfolio|profile videos|proyectos|perfil/cristian-bravo|all first-party|theme persists|mobile navigation'
git diff --check
```

La matriz de ampliación cubre 320, 375, 390, 430, 768, 1024, 1366, 1440 y 1920 px, en claro y oscuro; además 1024 × 600 para scroll natural. Incluye orden, enlaces, imágenes cargadas, dimensiones, responsive sources, contención del texto, overflow, foco, hover, contador, navegación, consola/red y descarga real del CV. La suite responsive añade anchos intermedios y límites del nuevo breakpoint, incluida la captura de 860 px que motivó la corrección. Las pruebas existentes cubren scroll por rueda/teclado, transición entre modos, movimiento reducido, navegación móvil, persistencia del tema y WCAG/SEO de proyectos/perfil en ambos idiomas.

Verificación histórica de la ampliación inicial: **23 casos de ampliación y 25 casos de regresión verificados**, build correcto, typecheck sin errores/advertencias y `git diff --check` limpio. Dos comprobaciones agotaron inicialmente su tiempo durante ejecuciones simultáneas (ventana corta y recorrido de enlaces internos); ambas pasaron individualmente, en 3,2 y 5,2 segundos, sin modificar requisitos ni código de producto. La revisión visual inicial cubrió 84 vistas de la versión anterior, sin imágenes fallidas, errores JS ni overflow horizontal. La etiqueta «Datos de prueba» se comprobó separadamente en ambos idiomas y temas a 320 px. Estos resultados preceden al ajuste de responsividad, marcas y restauración de privados y no certifican por sí solos su estado final.

Verificación del ajuste posterior: **63 casos verificados** (23 de ampliación, 15 de responsividad y 25 de regresión), build correcto, typecheck con cero errores/advertencias y `git diff --check` limpio. La suite responsive recorre todas las escenas en 320, 375, 640, 768, 858, 860, 900, 1024, 1119, 1120, 1280, 1366, 1440 y 1920 px, incluyendo 1120 × 700 y 1280 × 720. Se confirmó también el caso de 858 px sobre el build final. La revisión visual adicional cubrió los quince proyectos en ambos temas a 1440 × 900; las mediciones de contraste de títulos, descripciones, etiquetas y botones pasaron en las treinta vistas. El movimiento ambiental se comprobó activo en escritorio y desactivado en móvil y con movimiento reducido.

Se corrigió una carrera en la prueba existente de navegación: la rueda se enviaba mientras continuaba el desplazamiento suave del punto seleccionado. Ahora la prueba espera alcanzar su destino antes de comprobar la rueda; ES/EN pasaron sin cambiar el motor del sitio. Dos casos de 1440 px sufrieron un conflicto entre carpetas temporales de ejecuciones simultáneas de Playwright; se repitieron en una carpeta aislada y pasaron. La confirmación final terminó con cinco casos aprobados: navegación ES/EN, recorrido de proyectos claro/oscuro a 1440 px y cabecera a 858 px.

Todos los dominios añadidos y los siete enlaces existentes de los proyectos públicos respondieron HTTP 200 durante la inspección. Las comprobaciones de enlaces internos y archivos servidos se hacen sobre el build.

Evidencia local: `.cache/projects-refresh/baseline`, `review-final`, `asset-audit.json`, `apps/manifest.json`, `institutions/final-assets.json` y `existing-links.json`. Las capturas de Playwright y su informe quedan en `test-results/projects-refresh-final` y `playwright-report/projects-refresh-final` (ignorados por Git).

Evidencia del ajuste posterior: `.cache/projects-refresh/brand-followup` (treinta capturas, seis hojas de comparación, `report.json` y `contrast.json`) y `.cache/projects-refresh/responsive-followup` (capturas de móvil/tablet/escritorio y mediciones). Informes de producción: `playwright-report/projects-followup` y `playwright-report/projects-followup-confirmation`; el JSON de la confirmación final queda en `test-results/results.json`.

## Fondos anime.js en todas las vistas

La revisión siguiente extiende los fondos decorativos a las diecisiete vistas y sustituye el movimiento CSS ambiental anterior por anime.js. Los fondos también se animan al quedar visibles durante el scroll natural de tablet y móvil. Se conservan composición, contenido, capturas y las paletas aprobadas; los trazos decorativos son SVG, no capturas ni imágenes generadas. Las capas tienen `aria-hidden`, no reciben eventos de puntero y permanecen detrás del contenido.

Validación de esta revisión: **4 pruebas de animación y 10 de regresión aprobadas**, build correcto y typecheck sin errores ni advertencias. Se comprobó movimiento SVG real, pausa de escenas inactivas, cambio entre modos, restauración estática con movimiento reducido, navegación ES/EN, WCAG en claro/oscuro y separación del header en 320, 858 y 1120 px. Revisión visual de las diecisiete vistas en ambos temas y cuatro capturas móviles, sin desbordamientos ni texto recortado. Las capturas se toman tras la decodificación de imágenes y el final de las transiciones para evitar imágenes temporalmente vacías en la evidencia.

El script de la página, incluido anime.js, pesa 34.783 bytes sin comprimir y 13.515 bytes con gzip. El controlador crea las animaciones al mostrarse cada escena, pausa las que salen de pantalla, respeta la visibilidad de la pestaña y elimina observadores y animaciones al navegar.

Evidencia: `.cache/projects-ambient/visual/` contiene `contact-light.png`, `contact-dark.png`, las 34 vistas de escritorio, las cuatro vistas móviles y `audit.json`. La vista previa abierta del usuario se recargó con el build final.

## Traslado de la tarjeta y fondo abierto de Perfil

La tarjeta de identidad de la captura se reutiliza en la portada de Proyectos mediante `ProfileIdentityCard.astro`, con el recurso original `/avatar/avatar_1.webp`. Sustituye la fotografía y el marco anteriores. Combina las cinco etiquetas de Perfil con las de Proyectos y elimina la repetición de Sistemas: quedan siete etiquetas traducidas en ES/EN. La imagen conserva su proporción; en escritorios de poca altura utiliza un encuadre cuadrado para mantener visibles el encabezado y todas las etiquetas.

En Perfil se retira la sección completa superpuesta de la segunda captura: tarjeta, título introductorio y fila de stickers. El vídeo queda visible con una capa de contraste más ligera. Se conservan los cuatro accesos rápidos y el resto del contenido profesional. La altura disponible descuenta el encabezado real y reserva espacio inferior para evitar cruces con Yuki. El encabezado principal del contenido profesional pasa a ser el único `h1` de la página.

Se volvió a copiar el CV desde `G:\Hoja de vida\Cristian_Bravo_Full_Stack_Developer_CV.pdf`. Ese archivo coincide con el incorporado en la primera revisión: **no se ha modificado su contenido ni generado otro CV**. Origen, archivo público, build y descarga conservan el SHA-256 documentado arriba. La descarga se comprobó desde Perfil en ambos idiomas.

Archivos principales de esta revisión: `src/components/profile/ProfileIdentityCard.astro`, `src/components/profile/sections/ProfileAvatarSection.astro`, `ProfileHeroSection.astro`, `ProfileProfessionalLeadSection.astro`, `src/layouts/ProfileLayout.astro`, `src/pages/perfil/cristian-bravo.astro`, `src/pages/proyectos.astro`, `src/styles/profile.css` y `src/styles/projects-responsive.css`.

Validación: **45 casos únicos verificados**: ocho del traslado y visibilidad del fondo, quince de responsividad, dieciséis de accesibilidad/SEO, cuatro de navegación/animaciones y dos de descarga del CV. El typecheck final sobre 165 archivos terminó sin errores, advertencias ni sugerencias; el build de producción terminó correctamente. Se corrigieron dos problemas detectados durante QA: accesos inferiores de Perfil fuera del primer viewport y altura excesiva de la tarjeta en 1120 × 700 y 1280 × 720. Las comprobaciones afectadas se repitieron y pasaron; también se confirmó 1366 × 768 tras el último ajuste.

Evidencia de esta revisión: `.cache/profile-transfer/visual/`, `.cache/profile-transfer/regressions/` y `.cache/profile-transfer/short-height/`. La vista previa sigue disponible localmente en el puerto 4400; no se ha publicado el cambio.

## Presentación tipográfica sobre el fondo de Perfil

La revisión posterior añade una presentación abierta sobre el vídeo: «Perfil profesional», el nombre Cristian Bravo como `h1`, el enfoque Full Stack + Arquitectura + Producto, la descripción existente y un enlace discreto a Proyectos. Se reutilizan los textos ES/EN de Perfil. El bloque profesional inferior recupera su `h2`, conservando un único encabezado principal.

El vídeo tiene menor luminosidad y una capa oscura direccional: más contraste detrás del texto y más visibilidad del personaje a la derecha. No se reincorpora la tarjeta retirada. En móvil, el texto ocupa el espacio central entre los cuatro accesos; en tablet se reserva también la columna del PDF. La entrada escalonada utiliza anime.js, dura menos de un segundo y se omite con movimiento reducido. El contenido permanece visible sin JavaScript.

Validación de esta revisión: **24 casos aprobados** (12 de composición/traslado, ocho de accesibilidad/SEO, dos de animaciones existentes y dos de descarga del PDF). Revisión visual en 320 × 760, 390 × 844, 858 × 900, 1280 × 720 y 1440 × 900, en ambos temas; además, 1920 × 1080 oscuro y móvil EN con movimiento activo. Los cinco elementos animados terminan visibles y en su posición final, sin errores de consola. Typecheck sin errores ni advertencias, build correcto y diff sin errores de espacios.

Evidencia adicional: `.cache/profile-intro/visual/profile-es-1920-dark.png`, `.cache/profile-intro/visual/profile-en-390-light.png` y `.cache/profile-intro/regressions/`.

## Accesos alineados debajo de Ver proyectos

GitHub, Email, CV y LinkedIn pasan de las cuatro esquinas a una fila compacta debajo de «Ver proyectos», con etiquetas visibles, foco de teclado y superficies de 52 px. Se elimina el controlador de parallax que desplazaba los accesos por el cursor. Los iconos conservan movimiento: anime.js aplica un balanceo leve con ritmos escalonados dentro de las superficies, manteniendo fija la fila y su zona de clic. El movimiento se pausa fuera de pantalla y con la pestaña oculta, respeta movimiento reducido y se limpia al navegar.

Se ajustó el espaciado vertical para mostrar la fila completa también en 1280 × 720. Validación final: 14 casos aprobados de composición, animación real, movimiento reducido y descarga del CV en ES/EN, además de seis comprobaciones WCAG de esta revisión. Build y typecheck correctos; diff sin errores de espacios. Evidencia: `.cache/profile-contacts/final/` y capturas actualizadas en `.cache/profile-transfer/visual/`.

## Perfil más breve y sin bloques redundantes

Se retira la segunda presentación profesional y se organiza el contenido restante en cuatro secciones: trabajo, origen de CYSTEMS, intereses y visión. Las tres áreas técnicas tienen una descripción y dos puntos concretos; se conserva una sola fila de proyectos de referencia. Historia reúne dos párrafos, la cita personal y cuatro compañeros con su título. Intereses conserva las ilustraciones y una frase por bloque. El cierre contiene una idea, un objetivo y una única acción principal, eliminando las listas y agradecimientos que repetían el mensaje.

Los textos se condensaron en español e inglés. El contenido visible de `main` pasa de **980 a 304 palabras en ES (−69 %)** y de **953 a 308 en EN (−68 %)**. La altura total en ES pasa de 6740 a 4053 px a 1440 × 900 y de 13930 a 6601 px a 390 × 844. Las tarjetas se ajustan al nuevo contenido, con compañeros en dos columnas en móvil e intereses en cuatro columnas en escritorio. El hero, los cuatro accesos animados con anime.js y el CV conservan su funcionamiento.

Validación: 24 pruebas aprobadas de composición, accesibilidad/SEO, animación y descarga del CV; typecheck sin errores ni advertencias y build correcto. QA visual adicional en siete variantes entre 320 y 1440 px, ES/EN y ambos temas, sin desbordamientos, imágenes rotas ni errores de JavaScript. Un último pulido de una frase se recompiló y se verificó en ambas traducciones y móvil, sin cambiar las alturas. Evidencia: `.cache/profile-concision/final.json`, `final-polish.json`, capturas `final-*.png` y `tests/`. Vista previa local en el puerto 4400; sin publicación.

## Recorrido continuo de Perfil y menos stickers

Intereses pasa de 24 stickers a cuatro, uno por categoría, junto al texto en una composición abierta de dos columnas en escritorio y una en móvil. Se retiran sus tarjetas anidadas. El contenido bajo el vídeo comparte un fondo continuo y una indicación «Sigue explorando» conecta la portada con el recorrido.

En escritorio desde 1120 × 760, sin preferencia de movimiento reducido, el scroll nativo mueve cuatro escenas sobre un escenario sticky. anime.js aplica entradas y salidas verticales suaves; los cuatro controles inferiores y una línea muestran el avance. No se intercepta la rueda ni el teclado. El contenido conserva flujo normal en móvil, ventanas bajas, sin JavaScript o con movimiento reducido; además, una comprobación de altura desactiva las escenas si cualquier bloque deja de caber. El encabezado real se mide para reservar su espacio. Las escenas inactivas usan inert/aria-hidden; el foco se preserva al cambiar de escena o volver al modo normal. Se puede llegar al footer y redimensionar desde allí sin perder su posición.

Archivos: `ProfileJourney.astro`, `ProfileInterestsSection.astro`, `profileScrollAnimation.ts`, `profile-journey.css`, `profile-interests.css`, página de Perfil y `e2e/profile-journey.spec.ts`. Se mantienen los textos ES/EN, hero, accesos animados y CV.

Validación: **39 casos únicos aprobados** (24 regresiones y 15 del recorrido), con los dos casos de resize/foco repetidos tras el último ajuste. Ocho auditorías WCAG adicionales sobre cada escena activa en claro y oscuro sin incidencias. Verificación de encaje en 1120 × 760, 1280 × 800, 1366 × 768 y 1920 × 1080; flujo normal revisado en 320, 390, 858 y 1280 × 720. Build correcto, typecheck de 168 archivos sin diagnósticos. Evidencia en `.cache/profile-journey/visual/`, `regressions/`, `test-results/` y `active-a11y-and-fit.json`. Disponible solo en la vista previa local 4400.

## Indicadores de Proyectos visibles y navegación directa

La navegación lateral incorpora una superficie con contraste en ambos temas, puntos de 10 px y un marcador activo alargado. Cada botón tiene una zona de clic de 44 × 26–32 px sin superponerse a los demás. Al pasar el cursor o usar foco de teclado aparece el nombre real del proyecto y su número; las etiquetas accesibles también identifican el destino. El clic salta directamente al proyecto elegido y conserva su transición de entrada, sin recorrer visualmente todos los proyectos intermedios.

Se reserva un margen lateral para la barra en modo de escenas y se ajusta el espaciado vertical de las tarjetas en ventanas bajas. La navegación lateral sigue oculta en móvil y modo de scroll normal. Validación: **16 casos únicos aprobados** de navegación ES/EN, accesibilidad/SEO y encaje de todas las escenas en seis tamaños de escritorio. Las tres resoluciones compactas se repitieron tras corregir el margen de Fualtec a 1280 × 720. QA manual de clics, tooltips, teclado y separación de las tarjetas en ambos idiomas/temas; 17 centros clicables, sin recursos fallidos. Build y typecheck correctos. Evidencia: `.cache/projects-navigation/`. Solo vista previa local 4400.
