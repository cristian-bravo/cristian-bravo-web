# Restauración del diseño original

Fecha: 19 de septiembre de 2026.

El propietario rechazó el rediseño editorial publicado en `ae7aa75` y pidió recuperar la página de antes del despliegue. La referencia visual y de contenido es `cb8c21d` (equivalente a `2ea0ed2` en los componentes visuales).

## Resultado

- Inicio original: logo, órbitas, flotación, fondos animados, servicios, método y llamada final.
- Tipografías Manrope/Sora, paleta original, header transparente, tarjetas, bordes y sombras originales.
- Portafolio por escenas en escritorio; lectura continua en móvil o con movimiento reducido. Se corrigió el estado accesible al cambiar de pantalla y se añadieron limpieza de listeners y escenas inactivas inertes.
- Servicios y contenidos ES/EN originales; entrada de proyecto con las dos tarjetas originales (consulta rápida y proyecto completo).
- Se retiraron los componentes y hojas de estilo del rediseño rechazado. Sus versiones anteriores siguen recuperables en Git.
- Se conservan CSP con nonce, cabeceras, validación de origen y payload, límites, transporte SMTP seguro, formularios accesibles y borradores sólo durante la sesión.
- El widget de Yuki permanece en la esquina inferior derecha. El estado de conexión y las limitaciones de historial se documentan separadamente en `yuki-integration.md`.

## Verificación de la restauración

- Revisión visual de inicio claro/oscuro a 1440 px, inicio móvil a 390 px y portafolio de escritorio. Evidencia local: `.cache/restoration/`.
- Animaciones reales con `prefers-reduced-motion: no-preference`: scanline, órbita, flotación, burbujas y escenas. Pruebas con CSP estricta, navegación por teclado, scroll y cambios escritorio/móvil/reduced-motion.
- Primera matriz completa: 309/311 aprobadas. Los dos fallos eran expectativas QA del rediseño (título de perfil) y una espera de foco insuficiente en WebKit. Tras corregirlas, los cuatro casos dirigidos pasaron (perfil y modal en tres motores). El workflow de GitHub vuelve a ejecutar la matriz completa sobre el commit publicado.
- `npm run typecheck`, las dos fixtures de correo y la fixture de límites/proxy aprobaron. Las pruebas no enviaron correos externos.

Las mejoras visuales futuras deben conservar esta composición, animaciones y personalidad. Cambios de tipografía, paleta, estructura o sustitución del portafolio requieren una nueva petición del propietario.
