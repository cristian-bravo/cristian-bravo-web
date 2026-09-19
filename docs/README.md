# Documentación CYSTEMS

## Guías vigentes

- [Handoff técnico](ai-handoff-cystems.md): arquitectura y decisiones actuales; consultar primero la sección de septiembre de 2026.
- [QA](qa-report.md): cobertura, resultados reproducibles y limitaciones de las pruebas.
- [Correo](email-delivery.md): configuración SMTP, seguridad y pruebas de entrega.
- [Yuki](yuki-integration.md): arquitectura, arranque conectado, configuración y estado real de la integración.
- La integración pública de Yuki se documenta en `../yuki-bot/docs/integrations/SITE_CHAT.md` (repositorio hermano). No colocar sus credenciales en variables públicas ni en JavaScript del navegador.

Home usa `StudioHome.astro`; proyectos usa `ProjectsGallery.astro`. El contenido sigue separado del renderizado y mantiene ES/EN. La skill de diseño está en `.agents/skills/product-frontend-design`.

## Referencias históricas

`home-hero-visual-system.md`, `proyectos-modifier-guide.md`, `proyectos-refactor-2026.md` y `proyectos-scroll-architecture.md` describen implementaciones anteriores. El motor de escenas y el hero de vídeo ya no se cargan en las rutas actuales. No aplicar sus instrucciones como si fueran el sistema vigente.

`NEWPLAN.md` conserva el plan editorial original como referencia de intención.
