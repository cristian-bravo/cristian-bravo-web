# Documentación CYSTEMS

## Guías vigentes

- [Handoff técnico](ai-handoff-cystems.md): arquitectura y decisiones actuales; consultar primero la sección de septiembre de 2026.
- [QA](qa-report.md): cobertura, resultados reproducibles y limitaciones de las pruebas.
- [Correo](email-delivery.md): configuración SMTP, seguridad y pruebas de entrega.
- [Yuki](yuki-integration.md): arquitectura, arranque conectado, configuración y estado real de la integración.
- La integración pública de Yuki se documenta en `../yuki-bot/docs/integrations/SITE_CHAT.md` (repositorio hermano). No colocar sus credenciales en variables públicas ni en JavaScript del navegador.

El diseño vigente es el original de `cb8c21d`, restaurado por petición expresa del propietario. Home usa las cuatro secciones de `src/components/home/sections/` y `home.css`; proyectos vuelve al portafolio animado por escenas. Se conservan las protecciones de seguridad, las mejoras funcionales y el widget de Yuki. Véase [restauración del diseño](design-restoration.md). No volver a sustituir su identidad visual por una plantilla editorial.

## Referencias históricas

`home-hero-visual-system.md`, `proyectos-modifier-guide.md`, `proyectos-refactor-2026.md` y `proyectos-scroll-architecture.md` contienen antecedentes del diseño original. El motor de escenas vuelve a estar activo; el hero actual usa logo, órbitas y flotación CSS, sin vídeo de fondo.

`NEWPLAN.md` conserva el plan del rediseño rechazado como registro histórico, no como dirección vigente.
