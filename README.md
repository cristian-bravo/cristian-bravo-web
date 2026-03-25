# CYSTEMS Web

<p align="center">
  <a href="https://cystems.ec">
    <img
      src="https://raw.githubusercontent.com/cristian-bravo/cristian-bravo-web/main/docs/readme/cystems-hero.svg"
      alt="Vista general de CYSTEMS"
      width="100%"
    />
  </a>
</p>

<p align="center">
  Sitio principal de CYSTEMS: posicionamiento de marca, portafolio interactivo, perfil profesional y flujo de captación para nuevos proyectos.
</p>

<p align="center">
  <a href="https://cystems.ec"><img src="https://img.shields.io/badge/Sitio-cystems.ec-0F172A?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Sitio en producción" /></a>
  <a href="https://github.com/cristian-bravo/cristian-bravo-web"><img src="https://img.shields.io/badge/Repositorio-cristian--bravo--web-111827?style=for-the-badge&logo=github&logoColor=white" alt="Repositorio" /></a>
  <a href="https://www.linkedin.com/in/cristian-bravodev/"><img src="https://img.shields.io/badge/LinkedIn-Cristian%20Bravo-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-5.x-FF5D01?style=flat-square&logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=0B1120" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Anime.js-Motion-111827?style=flat-square&logo=javascript&logoColor=F7DF1E" alt="Anime.js" />
  <img src="https://img.shields.io/badge/Node-SSR-111827?style=flat-square&logo=node.js&logoColor=white" alt="Node SSR" />
  <img src="https://img.shields.io/badge/Nodemailer-SMTP-166534?style=flat-square&logo=maildotru&logoColor=white" alt="Nodemailer" />
</p>

## Descripción

**CYSTEMS Web** es la superficie pública principal de la marca CYSTEMS y de la presencia profesional de Cristian Bravo.

El proyecto reúne en un mismo producto:

- presentación corporativa
- narrativa de valor orientada a negocio
- portafolio visual con escenas full-screen
- página de perfil profesional extendida
- formularios reales para captar oportunidades comerciales
- entrega de correos desde servidor con SMTP

No está planteado como un landing genérico. La identidad visual, la claridad del mensaje, la conversión y la mantenibilidad forman parte del diseño desde la base.

## Experiencia actual

### Secciones públicas

- `/` presenta la narrativa principal de CYSTEMS con un hero visual tipo SaaS y video por tema.
- `/servicios` organiza la propuesta de valor en secciones y modales con foco comercial.
- `/proyectos` funciona como portafolio narrativo con scroll guiado y escenas destacadas.
- `/perfil/cristian-bravo` amplía el perfil profesional con secciones editoriales y contenido visual.
- `/blog` y `/blog/[slug]` dejan preparada la estructura para publicaciones técnicas.

### Captación y contacto

- `/empezar-proyecto` funciona como punto de entrada principal para nuevos leads.
- `/empezar-proyecto/simple` resuelve consultas rápidas.
- `/empezar-proyecto/proyecto` captura briefs estructurados mediante wizard.
- `/solicitar-desarrollo`, `/solicitar-desarrollo/simple` y `/solicitar-desarrollo/proyecto` ofrecen la misma lógica con una capa alternativa de copy.
- `/api/send-contact` y `/api/send-project` entregan formularios por SMTP desde servidor.

### Sistema visual implementado

- Hero principal con video distinto por tema:
  - modo claro: `/wallpapers/videos/avatar_pets.mp4`
  - modo oscuro: `/wallpapers/videos/avatar_clean.mp4`
- Glass card, blur y overlays calibrados para priorizar legibilidad sin perder profundidad.
- Header, portfolio y perfil con comportamiento coherente en light/dark.
- Motion guiado con `animejs` y capas CSS propias.

## Stack técnico

```txt
Astro        -> routing, composición de páginas y SSR
Tailwind CSS -> utilidades de layout y soporte visual
Anime.js     -> transiciones y narrativa por scroll
Node adapter -> runtime de servidor para Astro
Nodemailer   -> entrega de formularios por SMTP
PostCSS      -> pipeline de estilos
```

## Estructura del proyecto

```txt
src/
  components/
    blog/
    contact/
    development-request/
    home/
    profile/
    projects/
    services/
    shared/
  data/
    en/
    es/
  layouts/
  lib/
  pages/
  scripts/
  server/
  styles/
public/
  projects/
  wallpapers/
docs/
```

## Áreas importantes

| Área | Propósito |
| --- | --- |
| `src/pages` | Rutas públicas y endpoints API |
| `src/components` | Secciones, formularios, tarjetas, modales y piezas compartidas |
| `src/data` | Contenido estructurado en español e inglés |
| `src/styles` | Sistema visual, motion y estilos por página |
| `src/scripts` | Lógica de animación e interacción en cliente |
| `src/server` | Envío de correos y utilidades server-side |
| `public/projects` | Assets del portafolio público |
| `public/wallpapers/videos` | Videos usados en el hero principal |

## Puesta en marcha local

Instalación y desarrollo:

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

Ejecución en servidor Node:

```bash
node ./dist/server/entry.mjs
```

## Variables de entorno

El envío de formularios usa SMTP desde servidor:

```env
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_smtp_password_or_app_password
EMAIL_TO=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
```

Guía relacionada: [`docs/email-delivery.md`](./docs/email-delivery.md)

## Documentación interna

- [`docs/README.md`](./docs/README.md): índice general de documentación.
- [`docs/home-hero-visual-system.md`](./docs/home-hero-visual-system.md): reglas visuales del hero principal.
- [`docs/email-delivery.md`](./docs/email-delivery.md): configuración SMTP y flujo de entrega.
- [`docs/proyectos-modifier-guide.md`](./docs/proyectos-modifier-guide.md): cómo editar o añadir proyectos.
- [`docs/proyectos-refactor-2026.md`](./docs/proyectos-refactor-2026.md): arquitectura actual de `/proyectos`.
- [`docs/proyectos-scroll-architecture.md`](./docs/proyectos-scroll-architecture.md): motor de escenas y scroll.

## Notas de despliegue

- El sitio usa salida `server` con `@astrojs/node`.
- Los endpoints de formularios no son estáticos; necesitan un proceso Node activo.
- Los assets del hero y del portafolio viven en `public/`, por lo que cualquier omisión rompe experiencia visual en producción.
- El build actual mantiene una advertencia conocida en `src/pages/blog/[slug].astro` por `getStaticPaths()` sin `export const prerender = true;`. No bloquea el despliegue SSR actual.

## Valor de este repositorio

- Representa la presencia pública de CYSTEMS.
- Muestra criterio de producto, UI y estructura técnica en una sola experiencia.
- Funciona como portafolio y como embudo de captación real.
- Está preparado para seguir creciendo desde contenido centralizado y documentación mantenible.

## Contacto

- Web: [cystems.ec](https://cystems.ec)
- LinkedIn: [Cristian Bravo](https://www.linkedin.com/in/cristian-bravodev/)
- Email: `contacto@cystems.dev`

---

<p align="center">
  Diseñado para presentar producto, criterio visual y arquitectura mantenible en una sola experiencia.
</p>
