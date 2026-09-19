# QA de CYSTEMS

Fecha: 19 de septiembre de 2026. Entorno: Windows, Node 22.23.1, build Astro de producción y servidor standalone local.

## Cobertura automatizada

- Chromium: 18 rutas ES/EN en 320, 390, 768, 1024, 1440 y 1920 px. Cada combinación comprueba respuesta HTTP, un único `main` y `h1`, idioma, ancho del documento, controles dentro de la pantalla y ausencia de errores de JavaScript/CSP.
- Yuki: panel abierto en móvil/tablet/escritorio, pantalla corta de 320 × 568 y paisaje de 844 × 390; envío, respuesta de error, recuperación, Escape, foco, señal de consentimiento, texto malicioso renderizado como texto y movimiento reducido. Las fixtures prueban la señal/cookie; no demuestran conservación real en el backend. El control de historial está deshabilitado por defecto mientras el gateway no conecte esa capacidad.
- Formularios: errores accesibles, teléfono internacional, conservación de valores ante un error temporal, reintento y confirmación; wizard completo ES/EN, persistencia limitada a la pestaña, almacenamiento bloqueado, selección de funciones, rechazo de adjunto HTML y confirmación antes de enviar.
- Recorrido comercial: crear, mejorar y rescatar software en ES/EN; elección conservada en el formulario, en el payload de correo y al cambiar de idioma. Parámetros desconocidos, claves de prototipo y HTML malicioso en `intent` se ignoran sin reflejarlos.
- Teclado: menú móvil cerrado inerte, apertura y cierre con foco restaurado, salto al contenido, modal de servicios, filtros de proyectos y galería desplegable.
- Accesibilidad: axe WCAG A/AA en 18 rutas a 390 y 1440 px; 7 superficies clave también en tema oscuro; widget Yuki abierto. Los resultados incluyen detalle por nodo.
- SEO: títulos, descripciones, canonical HTTPS, alternates ES/EN, Open Graph, JSON-LD válido, robots, sitemap con 16 URLs indexables y exclusión del blog provisional. Enlaces propios y recursos de imagen se comprueban con solicitudes HEAD.
- Firefox y WebKit: repetición de formularios, recorrido comercial e interacciones principales. Esta cobertura comprueba motores distintos; no sustituye pruebas físicas de dispositivos.
- Seguridad: suite independiente de origen, tipos de contenido, esquemas malformados, límites, headers, inyección en campos y archivos; fixture SMTP en memoria, sin entrega externa. El proxy Yuki también comprueba cookies HttpOnly/Secure/SameSite, envío de la señal de consentimiento y rotación a sesión al revocarlo; la persistencia real queda como gate pendiente del gateway.
- Analítica local: eventos permitidos ES/EN, un solo inicio por formulario, éxito sólo tras aceptación del servidor, apertura del chat sin contar el cierre, rechazo de atributos maliciosos y ausencia de campos personales o query strings en el evento. No hay proveedor de analítica ni solicitudes de seguimiento activas.
- Evidencia visual: capturas de home, servicios, proyectos, selección de proyecto y consulta de rescate, a 390 y 1440 px, del primer pliegue y página completa.

## Hallazgos corregidos durante QA

| Hallazgo | Riesgo/impacto | Corrección |
| --- | --- | --- |
| Astro incorporaba scripts pequeños inline y la CSP los bloqueaba | Menú, Yuki y formulario simple dejaban de funcionar en producción | `vite.build.assetsInlineLimit: 0`; scripts inline explícitos conservan nonce |
| Formulario simple desbordaba su tarjeta en móviles | Controles cortados y texto fuera del ancho disponible | `min-width: 0`, rejilla adaptable y texto de pie envolvente |
| Contenido del menú oculto continuaba siendo navegable | Foco invisible para usuarios de teclado | Estado `inert` sincronizado con apertura/cierre |
| Perfil y proyectos tenían problemas de landmarks/etiquetado | Navegación estructural incompleta | `h1`, `main`, destino de skip link enfocable y roles apropiados |
| Etiquetas auxiliares tenían contraste insuficiente | Texto pequeño difícil de leer | Colores más oscuros, verificados con axe |
| Almacenamiento bloqueado abortaba la inicialización del wizard | No se podía continuar el formulario en ciertos modos de privacidad | Lectura/escritura/eliminación protegidas; flujo funcional sin guardar |
| Borrador con datos personales persistía entre sesiones | Retención innecesaria de datos de contacto | `sessionStorage`; eliminación limitada a claves legacy del wizard |
| Frontend y API discrepaban en formatos de teléfono | Rechazo de números internacionales legítimos | Formato internacional permitido y longitudes consistentes |
| Checkbox visual no tenía indicador visible de foco | Selección por teclado difícil de seguir | Foco visible en la tarjeta asociada |
| El diálogo del wizard restauraba el foco al último campo en WebKit | Tras cancelar, el teclado regresaba a un control distinto al que abrió la confirmación | El modal conserva explícitamente el botón que lo abrió |
| WebKit omitía el skip link con su navegación por teclado predeterminada | No se podía saltar el encabezado con el primer Tab | `tabindex="0"` explícito en el enlace; Tab y Enter reales en los tres motores |
| CSP intentaba actualizar a HTTPS los recursos de la vista previa HTTP en WebKit | La vista previa local no cargaba correctamente CSS/JS | Excepción limitada a HTTP loopback exacto; producción conserva HTTPS y HSTS |
| Inicio figuraba activo en todas las rutas inglesas y el indicador elegía Inicio sin ruta coincidente | Orientación incorrecta en navegación | Coincidencia exacta para ambos inicios e indicador oculto cuando no hay destino activo |
| Cambiar de idioma descartaba la elección comercial | El visitante perdía el contexto al pasar de ES a EN | Se conserva sólo `intent` permitido, sin copiar parámetros arbitrarios |
| El comprobador de tipos incluía JavaScript minificado de las trazas Playwright | Ruido y procesamiento innecesario al investigar fallos | Se excluyen sólo artefactos generados (`dist`, reportes, resultados y caché), sin excluir código fuente ni pruebas |
| La primera imagen de Proyectos usaba carga diferida dentro de la pantalla inicial | Descubrimiento tardío del recurso LCP en móvil | Sólo la primera portada usa `loading="eager"` y `fetchpriority="high"`; las restantes conservan carga diferida y la suite verifica ambos comportamientos |

## Reproducción

Requiere Node >= 22.19.0 y dependencias instaladas:

```sh
npm ci
npx playwright install chromium firefox webkit
npm run test:e2e
```

`npm run test:qa` ejecuta la matriz Chromium. Playwright construye el sitio e inicia su servidor de producción en `127.0.0.1:4321`; falla si ese puerto ya está ocupado para no reutilizar por accidente credenciales de un servidor de desarrollo. No ejecutar otro build ni otro runner sobre el mismo `dist`/`test-results` mientras esté activo. Para un servidor ya construido y aislado, sin SMTP ni backend Yuki reales, se puede definir explícitamente `PLAYWRIGHT_BASE_URL`.

El navegador de las pruebas bloquea las APIs reales de correo y chat. Los casos de envío interceptan esas solicitudes con respuestas controladas. El servidor de prueba tiene credenciales SMTP vacías y Yuki desactivado. Las pruebas de seguridad envían únicamente solicitudes inválidas; el transporte de correo válido de su fixture se mantiene en memoria.

## Evidencias

- `test-results/results.json`: resultados legibles por máquina de la última ejecución.
- `playwright-report/index.html`: reporte navegable.
- `test-results/visual-review/`: capturas de revisión visual.
- Cada fallo conserva captura y traza; `npx playwright show-trace <ruta.zip>` permite reproducir los pasos.

Los artefactos se regeneran en cada ejecución y están excluidos de Git. Las comprobaciones automatizadas de accesibilidad no equivalen por sí solas a una certificación WCAG. Las pruebas simuladas de correo y chat no demuestran entrega a un buzón real ni disponibilidad del backend Yuki desplegado; esas verificaciones pertenecen a la integración/configuración del entorno de producción.

## Última ejecución

Última ejecución completa de `npm run test:e2e`, iniciada el **19 de septiembre de 2026 a las 17:54:00 (America/Guayaquil)**, sobre el diseño consolidado y build de producción actual:

| Motor | Casos aprobados |
| --- | ---: |
| Chromium | 246 |
| Firefox | 27 |
| WebKit | 27 |
| Total | **300 / 300** |

Duración: **98,4 segundos**. **0 fallos, 0 omitidos y 0 casos inestables (`flaky`)**. Incluye 108 combinaciones ruta/ancho, 50 auditorías axe de páginas más el widget abierto en los tres motores, 15 casos/grupos de seguridad, pruebas adversariales de intención comercial, cinco casos de señales locales sin PII y 20 capturas visuales. No se enviaron correos externos ni mensajes a un proveedor IA real. En una iteración previa, los nuevos tests tenían un selector ambiguo que coincidía con el textarea del formulario y el de Yuki; se delimitó al formulario antes de esta ejecución completa.

También se ejecutó `npm run typecheck`: **154 archivos, 0 errores, 0 advertencias y 0 sugerencias**. Las verificaciones SMTP válidas y de rate limiting independientes se documentan en el informe de seguridad; la medición de rendimiento se ejecuta por separado para no contaminarla con procesos de navegador concurrentes.

Las capturas finales están en `test-results/visual-review/`, con nombres `home`, `services`, `projects`, `start` y `rescue`, anchos `390` y `1440`, y sufijos `fold`/`full`. Los resultados estructurados y el HTML del reporte corresponden a esta misma ejecución. El servidor de pruebas se cerró al terminar.

## Rendimiento móvil de laboratorio

`npm run test:perf` audita el build standalone local con Lighthouse, pantalla 390 × 844 y ralentización móvil simulada. No representa Core Web Vitals de visitantes reales ni una medición del dominio desplegado.

| Ruta | Rendimiento | Accesibilidad | SEO | Buenas prácticas | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Inicio | 95 | 100 | 100 | 81 | 2,43 s | 0,00018 | 0 ms |
| Servicios | 94 | 100 | 100 | 81 | 2,63 s | 0,00010 | 0 ms |
| Proyectos | 92 | 100 | 100 | 81 | 3,01 s | 0,00040 | 0 ms |

Condición importante del entorno: el antivirus de la estación inyecta `gc.kis.v2.scr.kaspersky-labs.com/main.js` en respuestas HTTP locales. No pertenece al repositorio. El primer pase sin filtrar produjo rendimiento 83/84/77; se conserva en `.cache/performance-unfiltered-2026-09-19`. Para medir el sitio, los pases controlados bloquean únicamente ese host en el navegador de auditoría, sin desactivar ni modificar el antivirus. Lighthouse sigue penalizando la referencia HTTP inyectada en `is-on-https`, por eso buenas prácticas permanece en 81; los otros controles ponderados de esa categoría pasan. No se alteró el resultado del informe para ocultar esta limitación.

El pase final incluye la prioridad de carga de la primera portada de Proyectos, las señales locales de analítica y el estado público de historial no disponible. Antes de corregir la prioridad, el mismo protocolo midió 89 puntos y LCP 3,49 s en Proyectos; el pase actual mide 92 puntos y 3,01 s. Es una comparación de laboratorio sujeta a variación entre ejecuciones, no una garantía de latencia de usuarios reales.

Los reportes completos están en `test-results/performance/` (JSON, HTML y `summary.json`). Proyectos todavía tiene margen de mejora en LCP bajo ralentización; activar compresión y caché de recursos en el reverse proxy y medir el dominio HTTPS después del despliegue.

## Validaciones adicionales del servidor

- `npm run test:email`: 2/2 fixtures aprobados, sin entrega externa; incluye aceptación real del esquema de las seis opciones comerciales ES/EN con transporte SMTP en memoria.
- `npm run test:security`: fixture de proxy/IP aprobada; el header CF falsificado no elude el límite por defecto.
- `npm audit` y `npm audit --omit=dev`: 0 vulnerabilidades conocidas en las dependencias auditadas. No equivale a ausencia de cualquier vulnerabilidad.
- Prueba SMTP real separada de la suite: el proveedor aceptó un único correo sintético identificado como QA al destinatario configurado. Confirma aceptación SMTP, no recepción final en una carpeta concreta. Véase `email-delivery.md`.
- `git diff --check`: sin errores de whitespace, respetando la conversión CRLF habitual del repositorio.
- Backend Yuki: el pase previo de `npm test` aprobó 76/76 archivos y 540 casos, con 1 omitido por permisos POSIX/symlinks no aplicables en Windows; 0 fallos, 14,33 segundos. Fue una ejecución con fixtures, no con el proveedor real; los hashes permanecieron estables durante ese pase. Después hubo nuevos cambios concurrentes en `site-chat`: la revalidación dirigida de las 17:49 aprobó 7/7 casos y confirmó rechazo 503 para historial sin `coreRoute`. La suite completa anterior no certifica esos cambios nuevos; integración real, historial y aprendizaje siguen pendientes. Véase `yuki-integration.md`.
