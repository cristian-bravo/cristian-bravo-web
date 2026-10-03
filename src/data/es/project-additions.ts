import type { ProjectBrand, ProjectFeaturedHeroContent, ProjectGalleryItemContent, ProjectReferenceContent } from './projects';

interface ProjectInput {
  title: string;
  brand: ProjectBrand;
  description: string;
  badge: string;
  tags: string[];
  href: string;
  directory: string;
  stem?: string;
  captions: [string, string, string];
  variant: ProjectFeaturedHeroContent['variant'];
  actions?: ProjectReferenceContent['actions'];
}

// The existing three-frame gallery and scene themes are shared by every addition.
const project = (input: ProjectInput): ProjectReferenceContent => ({
  title: input.title,
  brand: input.brand,
  description: input.description,
  visibility: 'Público',
  tags: input.tags,
  gallery: input.captions.map((caption, index): ProjectGalleryItemContent => {
    const path = `/projects/${input.directory}/${input.stem ? `${input.stem}-` : ''}${index + 1}`;
    return {
      src: `${path}.webp`,
      srcSet: `${path}-800.webp 800w, ${path}.webp 1600w`,
      width: 1600,
      height: index === 0 ? 900 : 1000,
      alt: `${input.title}: ${caption}`,
      caption,
      variant: (['wide', 'square', 'tall'] as const)[index],
      ...(input.title === 'DePaso' && index === 1 ? { note: 'Datos de prueba' } : {}),
    };
  }),
  actions: input.actions ?? [{ label: 'Ver proyecto', href: input.href, variant: 'primary' }],
  featuredHero: {
    variant: input.variant,
    badge: input.badge,
    shortDescription: input.description,
    forceDark: true,
  },
});

export const projectsAfterCampus: ProjectReferenceContent[] = [
  project({
    title: 'Fundación Manos en Acción',
    brand: 'fundacion',
    description: 'Landing pública del programa de becas de inglés y plataforma administrativa para la gestión interna de inscritos, pruebas y matrícula.',
    badge: 'Fundación / Gestión educativa',
    tags: ['Landing pública', 'Plataforma administrativa', 'Gestión interna'],
    href: 'https://fundacionma.com',
    directory: 'Fundacion-Manos-en-Accion',
    stem: 'fundacion-manos-en-accion',
    captions: ['Programa de becas de inglés', 'Niveles de inglés', 'Acceso a la plataforma administrativa'],
    variant: 'academic-platform',
    actions: [
      { label: 'Página pública', href: 'https://fundacionma.com', variant: 'primary' },
      { label: 'Administración', href: 'https://administracion.fundacionma.com', variant: 'secondary' },
    ],
  }),
  project({
    title: 'Berlina',
    brand: 'berlina',
    description: 'Plataforma de movilidad para mujeres, con conductoras verificadas, seguimiento del viaje en tiempo real y herramientas de seguridad.',
    badge: 'Movilidad / Aplicación',
    tags: ['Movilidad', 'App móvil', 'Seguridad'],
    href: 'https://berlina.app',
    directory: 'Berlina',
    captions: ['Movilidad para mujeres', 'Herramientas de seguridad', 'Experiencia de la aplicación'],
    variant: 'retail-commerce',
  }),
  project({
    title: 'Telollevamos',
    brand: 'telollevamos',
    description: 'Comercio electrónico para comprar en tiendas internacionales y recibir en Ecuador, con catálogo, precio final y seguimiento del pedido.',
    badge: 'E-commerce / Importaciones',
    tags: ['E-commerce', 'Catálogo', 'Importaciones'],
    href: 'https://telollevamos.com',
    directory: 'Telollevamos',
    captions: ['Tienda internacional', 'Catálogo de productos', 'Detalle de producto'],
    variant: 'retail-commerce',
  }),
  project({
    title: 'DePaso',
    brand: 'depaso',
    description: 'Plataforma de compras y envíos internacionales que conecta viajeros verificados con entregas en Ecuador, cotización y gestión de paquetes.',
    badge: 'Logística / Plataforma',
    tags: ['Logística', 'App móvil', 'Gestión de paquetes'],
    href: 'https://depaso.app',
    directory: 'DePaso',
    captions: ['Compras y envíos internacionales', 'Panel administrativo con datos de demostración', 'Cotizador de envíos'],
    variant: 'industrial-corporate',
  }),
  project({
    title: 'Riocargo Express',
    brand: 'riocargo',
    description: 'Plataforma logística con casillero internacional, cotización y rastreo de envíos para compras desde Estados Unidos, España y China.',
    badge: 'Logística / Courier',
    tags: ['Logística', 'Casillero', 'Rastreo'],
    href: 'https://riocargoexpress.com/',
    directory: 'Riocargo-Express',
    captions: ['Casillero internacional', 'Proceso de compra y envío', 'Cotizador de envíos'],
    variant: 'industrial-corporate',
  }),
];

export const projectsAfterEducation: ProjectReferenceContent[] = [
  project({
    title: 'IDEC',
    brand: 'idec',
    description: 'Sitio corporativo de ingeniería y soluciones tecnológicas, con servicios de automatización, infraestructura y conectividad para operaciones empresariales.',
    badge: 'Ingeniería / Tecnología',
    tags: ['Automatización', 'Infraestructura', 'Conectividad'],
    href: 'https://www.idec.ec',
    directory: 'IDEC',
    stem: 'idec',
    captions: ['Ingeniería y soluciones tecnológicas', 'Plataformas para la operación empresarial', 'Metodología de trabajo'],
    variant: 'industrial-corporate',
  }),
  project({
    title: 'Nexus',
    brand: 'nexus',
    description: 'Plataforma de asesoría financiera para vivienda, vehículo y consumo, con información de servicios y cotización en línea para orientar cada solicitud.',
    badge: 'Asesoría / Servicios financieros',
    tags: ['Asesoría financiera', 'Servicios', 'Cotización'],
    href: 'https://www.nexuscorpec.com',
    directory: 'Nexus',
    stem: 'nexus',
    captions: ['Asesoría financiera', 'Soluciones para vivienda, vehículo y consumo', 'Cotizador público'],
    variant: 'edu-saas',
  }),
  project({
    title: 'SH Fast Recover',
    brand: 'sh-fast-recover',
    description: 'Sitio corporativo de recuperación de cartera que presenta servicios de cobranza, automatización y seguimiento para empresas.',
    badge: 'Empresas / Recuperación de cartera',
    tags: ['Cobranza', 'Automatización', 'Seguimiento'],
    href: 'https://shfastrecover.com',
    directory: 'SH-Fast-Recover',
    stem: 'sh-fast-recover',
    captions: ['Recuperación de cartera', 'Soluciones de cobranza', 'Servicios para empresas'],
    variant: 'industrial-corporate',
  }),
];
