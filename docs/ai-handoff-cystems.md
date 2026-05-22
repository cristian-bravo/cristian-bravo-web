# Handoff tecnico para trabajar con IAs - CYSTEMS

Actualizado: 2026-05-22

Este documento sirve como contexto base para que otra IA, agente de codigo o desarrollador pueda continuar el proyecto sin perder decisiones importantes. No contiene secretos ni credenciales.

## Objetivo del trabajo realizado

La web paso de una presencia personal casual a una presencia profesional de marca personal + empresa. El foco quedo en CYSTEMS como marca, Cristian Bravo como perfil tecnico y la captacion comercial de clientes para servicios de software.

Prioridades aplicadas:

- mayor protagonismo visual de marca
- mejor UX/UI en desktop y mobile
- mejor rendimiento movil
- proyectos sin colapso en pantallas pequenas
- formulario de solicitud funcionando con correo real
- multidioma ES/EN mantenible
- SEO tecnico y contenido comercial
- codigo mas limpio y menos dependencias

## Cambios principales

### Home y Hero

Archivos principales:

- `src/components/home/sections/HomeHeroSection.astro`
- `src/styles/home.css`
- `src/data/es/home.ts`
- `src/data/en/home.ts`

Cambios:

- Se reemplazo el hero anterior por una composicion mas profesional.
- El logo CYSTEMS ahora tiene presencia visual fuerte.
- Se agrego animacion CSS ligera de orbita/flotacion del logo.
- Se elimino carga visual pesada del hero para mejorar FPS movil.
- El copy se reoriento a negocio: software profesional, operacion, ventas, escalabilidad.
- Se corrigieron anchos moviles para evitar overflow horizontal.

Reglas para futuras IAs:

- No volver a introducir iframes, WebGL o efectos pesados en el primer viewport sin medir rendimiento.
- Mantener el H1 orientado a oferta/valor comercial, no a descripcion casual.
- Si se cambia el hero, validar 390px, 768px y desktop.

### Header, navbar y UX movil

Archivos principales:

- `src/components/Header.astro`
- `src/layouts/BaseLayout.astro`
- `src/lib/i18n.ts`

Cambios:

- Se redisenio el comportamiento movil del header.
- En mobile queda visible logo + menu.
- Dentro del panel movil estan navegacion, CTA, selector de idioma y tema.
- El selector de tema ahora soporta multiples botones `data-theme-toggle`.
- El selector de idioma usa rutas localizadas.

Reglas para futuras IAs:

- No agregar mas botones visibles al header movil sin medir el ancho real.
- Mantener el CTA principal en el menu movil.
- Validar que `document.documentElement.scrollWidth` sea igual a `clientWidth` en mobile.

### Multidioma ES/EN

Archivos principales:

- `src/lib/i18n.ts`
- `src/data/en/*`
- `src/data/es/*`
- `src/pages/en/*`
- `src/layouts/BaseLayout.astro`
- `src/layouts/CystemsLayout.astro`
- `src/layouts/ProfileLayout.astro`

Cambios:

- Se agrego una capa central de i18n con:
  - `localizePath`
  - `getAlternateLangPath`
  - `stripLangPrefix`
  - `getUiCopy`
- Se crearon rutas reales bajo `/en`.
- Se tradujeron contenidos principales en `src/data/en`.
- Header, footer, layouts, proyectos, perfil y formularios reciben `lang`.
- Se agregaron alternates `hreflang` y canonical por idioma.

Reglas para futuras IAs:

- No hardcodear textos nuevos directamente en componentes si pertenecen a contenido editable; usar `src/data`.
- Si una pagina nueva existe en ES, crear wrapper equivalente en `/en`.
- Toda ruta publica debe tener canonical y alternates correctos via `BaseLayout`.

### Proyectos y scroll

Archivos principales:

- `src/pages/proyectos.astro`
- `src/scripts/projectsScrollAnimation.ts`
- `src/styles/proyectos-scene.css`
- `src/data/es/projects.ts`
- `src/data/en/projects.ts`

Cambios:

- Se elimino `animejs`.
- Se elimino `src/scripts/scrollPortfolioAnimations.ts`.
- El motor actual usa CSS transitions + controlador minimo con `requestAnimationFrame`.
- Desktop mantiene experiencia tipo escena.
- Mobile, tablet y `prefers-reduced-motion` usan scroll nativo.
- Se corrigio el titulo movil de ES a `Proyectos digitales` para evitar cortes.

Reglas para futuras IAs:

- No reintroducir `animejs` salvo justificacion fuerte y medicion.
- En mobile no debe haber stage fijo ni scroll artificial.
- No eliminar atributos `data-ps-*` sin revisar `projectsScrollAnimation.ts`.
- Probar que la ultima escena/CTA sea alcanzable en desktop.

### Formularios y correo

Archivos principales:

- `src/pages/api/send-contact.ts`
- `src/pages/api/send-project.ts`
- `src/server/email/sendEmail.ts`
- `src/server/security/rateLimit.ts`
- `src/components/development-request/forms/SimpleRequestForm.astro`
- `src/components/development-request/project-wizard/services/projectRequestService.ts`
- `docs/email-delivery.md`

Problema encontrado:

- Los endpoints estaban leyendo rutas incorrectas de copy/validacion, lo que podia romper validaciones y respuestas.
- La configuracion SMTP podia fallar si el servidor inyectaba variables vacias.

Cambios:

- `send-contact` usa `developmentRequest.developmentRequestSimpleContent.form.validation`.
- `send-project` usa `developmentRequest.developmentRequestProjectContent.ui`.
- Ambos endpoints reciben `lang`.
- El frontend envia `lang` en JSON/FormData.
- `rateLimit` devuelve `{ success: false, message }`.
- SMTP ignora variables vacias y usa fallback segun proveedor.
- `SMTP_SECURE` por defecto es `true` solo si el puerto es `465`.
- Se agregaron timeouts y mensajes de error mas claros.

QA realizado:

- SMTP verificado contra `smtp.gmail.com:587`.
- Envio real de prueba en `POST /api/send-contact`: `200 {"success":true}`.
- Envio real de prueba en `POST /api/send-project`: `200 {"success":true}`.
- Validaciones invalidas devuelven `400` con mensajes controlados.

Reglas para futuras IAs:

- Nunca imprimir ni documentar valores de `.env.local`.
- No mover envio de correo al cliente.
- Despues de cambios en formularios, probar endpoint invalido y envio real controlado.
- En Contabo, revisar firewall/salida SMTP si falla conexion aunque local funcione.

### Solicitar servicio / empezar proyecto

Archivos principales:

- `src/pages/empezar-proyecto.astro`
- `src/pages/empezar-proyecto/simple.astro`
- `src/pages/empezar-proyecto/proyecto.astro`
- `src/pages/solicitar-servicio.astro`
- `src/pages/solicitar-servicio/*`
- `src/data/es/development-request.ts`
- `src/data/en/development-request.ts`
- `src/styles/development-request.css`

Cambios:

- Se mejoro el copy comercial de la landing de solicitud.
- Se crearon redirects de compatibilidad:
  - `/solicitar-servicio`
  - `/solicitar-servicio/simple`
  - `/solicitar-servicio/proyecto`
  - equivalentes bajo `/en`
- Se validaron vistas moviles de landing y formulario simple.

Reglas para futuras IAs:

- Mantener `/solicitar-servicio*` como alias estable si hay enlaces externos.
- No cambiar nombres de campos del wizard sin actualizar API y servicio.

### SEO tecnico

Archivos principales:

- `astro.config.mjs`
- `src/layouts/BaseLayout.astro`
- `public/robots.txt`
- `public/sitemap.xml`
- `src/pages/blog/[slug].astro`

Cambios:

- Se definio `site: 'https://cystems.ec'`.
- Se agregaron canonical, alternates, Open Graph, Twitter cards y JSON-LD.
- Se agrego `robots.txt`.
- Se agrego `sitemap.xml` con rutas principales y alternates.
- Blog dinamico se marco con `prerender` para evitar warning de build.

Reglas para futuras IAs:

- Si se agregan rutas publicas, actualizar `sitemap.xml`.
- Mantener metadata comercial y no generica.
- Revisar headings: una pagina debe tener un H1 claro.

### Rendimiento

Cambios:

- Se elimino `animejs` de dependencias.
- Se reemplazaron animaciones JS de servicios por IntersectionObserver + CSS.
- Se redujo la carga del hero.
- El build final genera solo un chunk cliente relevante:
  - `ProjectRequestWizard...js`
  - aprox. `14.80 kB`, `4.99 kB gzip`

Reglas para futuras IAs:

- Antes de agregar una libreria de animacion, justificar peso y necesidad.
- Preferir CSS transitions, IntersectionObserver y `requestAnimationFrame` minimo.
- En mobile, evitar filtros pesados, blur excesivo, videos o canvases en primer viewport.

## Comandos de verificacion

Instalacion:

```bash
npm install
```

Servidor local:

```bash
npm run dev -- --host 127.0.0.1 --port 4321
```

Build:

```bash
npm run build
```

Rutas criticas a revisar:

```text
/
/en
/servicios
/en/servicios
/proyectos
/en/proyectos
/empezar-proyecto
/en/empezar-proyecto
/empezar-proyecto/simple
/en/empezar-proyecto/simple
/empezar-proyecto/proyecto
/en/empezar-proyecto/proyecto
/solicitar-servicio
/solicitar-servicio/simple
/solicitar-servicio/proyecto
/perfil/cristian-bravo
/en/perfil/cristian-bravo
/contacto
/en/contacto
/robots.txt
/sitemap.xml
```

Pruebas manuales recomendadas:

- Abrir menu movil y probar enlaces.
- Cambiar idioma ES/EN desde desktop y mobile.
- Cambiar tema claro/oscuro.
- Hacer scroll completo en `/proyectos` en desktop y mobile.
- Enviar formulario simple.
- Enviar formulario avanzado.
- Revisar que no haya overflow horizontal en 390px.

## Checklist para otra IA antes de modificar

1. Leer este archivo.
2. Leer los archivos de datos en `src/data/es` y `src/data/en` antes de cambiar textos.
3. Revisar si la pagina tiene wrapper en `/en`.
4. Revisar si la modificacion toca SEO, sitemap o rutas antiguas.
5. Ejecutar `npm run build` al final.
6. Validar mobile 390px si se toca UI.
7. No tocar `.env.local` ni revelar credenciales.
8. No revertir cambios existentes sin autorizacion.

## Prompt base para usar con otra IA

Usa este prompt cuando quieras que otra IA continue el trabajo:

```text
Estas trabajando en la web CYSTEMS de Cristian Bravo, un proyecto Astro 5 con Tailwind y Node adapter.

Lee primero docs/ai-handoff-cystems.md. Respeta las decisiones ya tomadas:
- i18n centralizado en src/lib/i18n.ts y contenidos en src/data/es + src/data/en.
- mobile debe priorizar rendimiento y scroll nativo.
- no reintroducir animejs ni animaciones pesadas sin justificar.
- formularios envian correo desde servidor via Nodemailer.
- no exponer .env.local ni credenciales.
- cada ruta publica debe cuidar SEO, canonical y hreflang.

Antes de editar, revisa la estructura existente. Al finalizar, ejecuta npm run build y documenta pruebas realizadas.
```

## Prompts especificos por tipo de tarea

### Para mejorar copy comercial

```text
Mejora el copy comercial sin cambiar estructura visual. Usa src/data/es y src/data/en, manteniendo equivalencia semantica entre idiomas. El tono debe ser profesional, claro y orientado a venta de servicios de software.
```

### Para agregar una nueva pagina

```text
Agrega una pagina publica siguiendo el sistema actual. Debe tener version ES y EN, metadata SEO, enlace localizado si corresponde, contenido en src/data, y actualizacion de sitemap.xml.
```

### Para tocar proyectos

```text
Modifica /proyectos respetando el motor actual: desktop tipo escena, mobile con scroll nativo. No elimines data-ps-* sin actualizar src/scripts/projectsScrollAnimation.ts. Valida mobile 390px y desktop.
```

### Para tocar formularios

```text
Modifica formularios manteniendo envio server-side con Nodemailer. Actualiza frontend, endpoint, validaciones ES/EN y mensajes de error. Prueba payload invalido y envio real controlado.
```

### Para optimizar rendimiento

```text
Audita rendimiento movil priorizando reducir JS, animaciones costosas, filtros y assets pesados. No agregues dependencias sin justificar peso. Ejecuta build y reporta cambios en bundles.
```

## Pendientes operativos

- Probar correo en el servidor Contabo despues del despliegue, aunque local ya funciona.
- Confirmar que `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `SMTP_HOST`, `SMTP_PORT` y `SMTP_SECURE` esten correctamente definidos en produccion.
- Actualizar `public/sitemap.xml` cuando se agreguen nuevas rutas reales.
- Revisar Lighthouse en produccion despues del deploy para medir Core Web Vitals reales.

## Estado de QA registrado

Ultima verificacion local:

- `npm run build`: correcto.
- Rutas principales ES/EN: `200`.
- Formularios simple y avanzado: envio real correcto.
- Mobile 390px: sin overflow horizontal en Home, Proyectos y Solicitud.
- Proyectos mobile: scroll nativo.
- Dev server local usado: `http://127.0.0.1:4321/`.

