import {
  projectsPortfolioContent as esProjectsPortfolioContent,
  type ProjectReferenceContent,
  type ProjectsPortfolioContent,
} from '../es/projects';
import type { PageMetadata } from '../../types/content';

export * from '../es/projects';

const withProjectCopy = (
  project: ProjectReferenceContent,
  copy: Partial<ProjectReferenceContent>
): ProjectReferenceContent => ({
  ...project,
  ...copy,
  gallery: copy.gallery ?? project.gallery,
  actions: copy.actions ?? project.actions,
  featuredHero: project.featuredHero
    ? {
        ...project.featuredHero,
        ...(copy.featuredHero ?? {}),
      }
    : copy.featuredHero,
});

const publicProjects = esProjectsPortfolioContent.groups[0].references;
const privateProjects = esProjectsPortfolioContent.groups[1].references;

export const projectsPageMeta: PageMetadata = {
  title: 'Projects | CYSTEMS',
  description: 'Portfolio of public projects and private references focused on business platforms.',
};

export const projectsPortfolioContent: ProjectsPortfolioContent = {
  intro: {
    kicker: 'Portfolio',
    title: 'Selected work and systems',
    description:
      'Business, education and commerce platforms built to solve real operational needs with scalable web technology.',
  },
  heroAvatar: {
    ...esProjectsPortfolioContent.heroAvatar,
    caption: 'Digital Systems Portfolio',
    imageAlt: 'Main avatar for the portfolio cover',
  },
  groups: [
    {
      title: 'Public projects',
      references: [
        withProjectCopy(publicProjects[0], {
          description:
            'Virtual campus for academic management, online classrooms and institutional operations. Designed for multiple roles, high concurrency and sustained growth.',
          visibility: 'Public',
          tags: ['Virtual classroom', 'Scalability', 'Roles and permissions'],
          gallery: publicProjects[0].gallery.map((item, index) => ({
            ...item,
            alt:
              index === 0
                ? 'Institutional main view of NY Campus Virtual'
                : index === 1
                  ? 'Admin panel with roles and access levels'
                  : 'Virtual classroom with student content and progress',
            caption: index === 0 ? 'Institutional cover' : index === 1 ? 'Roles and access' : 'Academic experience',
          })),
          actions: [{ label: 'View platform', href: 'https://nycampusvirtual.net/', variant: 'primary' }],
          featuredHero: {
            badge: 'EdTech / Institute',
            shortDescription:
              'Virtual campus for academic management, online classrooms and institutional operations.\nDesigned for multiple roles, high concurrency and sustained growth.',
          },
        }),
        withProjectCopy(publicProjects[1], {
          description:
            'Institutional platform and secure client access with centralized technical documentation and reliable business operations.',
          visibility: 'Public',
          tags: ['NDT inspection', 'Business platform', 'Document management', 'Security'],
          gallery: publicProjects[1].gallery.map((item, index) => ({
            ...item,
            alt:
              index === 0
                ? 'Corporate landing page for Fualtec focused on industrial inspection'
                : index === 1
                  ? 'Fualtec business administration panel'
                  : 'Client access to Fualtec secure portal',
            caption: index === 0 ? 'Industrial landing' : index === 1 ? 'Business panel' : 'Secure portal',
          })),
          actions: [
            { label: 'View project', href: 'http://fualtec.com.ec/', variant: 'primary' },
            { label: 'Client access', href: 'http://fualtec.com.ec/client-access/login', variant: 'secondary' },
          ],
          featuredHero: {
            badge: 'Industry / NDT',
            subtitle: 'High technology applied to industrial inspection',
            shortDescription:
              'Institutional portal and secure client access with centralized technical documentation.\nDesigned for business operations, traceability and reliable control.',
          },
        }),
        withProjectCopy(publicProjects[2], {
          description:
            'E-commerce with promotional banners, digital catalog and product integration for continuous sales and scalable commercial operations.',
          visibility: 'Public',
          tags: ['E-commerce', 'Digital catalog', 'Product integration', 'Scalability'],
          gallery: publicProjects[2].gallery.map((item, index) => ({
            ...item,
            alt:
              index === 0
                ? 'Alkosto commercial home with banners and promotions'
                : index === 1
                  ? 'Alkosto digital product catalog'
                  : 'Alkosto administrative access system',
            caption: index === 0 ? 'Retail promotions' : index === 1 ? 'Digital catalog' : 'Commercial system',
          })),
          actions: [
            { label: 'View project', href: 'https://alkostoec.com/', variant: 'primary' },
            { label: 'View catalog', href: 'https://alkostoec.com/', variant: 'secondary' },
          ],
          featuredHero: {
            subtitle: 'Catalog and digital sales platform',
            shortDescription:
              'E-commerce with promotional banners, dynamic catalog and product integration.\nDesigned for conversion, scalable inventory and continuous commercial operation.',
          },
        }),
        withProjectCopy(publicProjects[3], {
          title: 'Education platforms',
          description:
            'Two education solutions: an institutional school website and a university platform with landing page, digital library and Moodle-managed virtual classroom.',
          visibility: 'Public',
          tags: ['Digital education', 'Virtual classroom', 'Academic management', 'Scalability'],
          gallery: publicProjects[3].gallery.map((item, index) => ({
            ...item,
            alt:
              index === 0
                ? 'Main institutional view of the education platform'
                : index === 1
                  ? 'Informational landing page for an academic platform'
                  : 'Access to the education platform academic system',
            caption: index === 0 ? 'Institutional campus' : index === 1 ? 'Academic information' : 'System access',
          })),
          featuredHero: {
            badge: 'Education platform / Virtual campus',
            subtitle: 'Academic management and virtual classroom',
            shortDescription:
              'Education management, virtual classroom and institutional access in one platform.\nPrepared for a digital campus, library and academic growth.',
          },
        }),
      ],
    },
    {
      title: 'Private projects (mentions)',
      description:
        'Some projects cannot be shown publicly due to confidentiality agreements, but they are mentioned generally to reflect acquired experience.',
      references: [
        withProjectCopy(privateProjects[0], {
          description:
            'Participation in an enterprise integrations project inside a secure environment for a US company. Teamwork under agile methodologies focused on system communication and process automation.',
          visibility: 'Private',
          tags: ['Integrations', 'Agile', 'Backend', 'Security'],
          confidentialLabel: 'Confidential project',
          featuredHero: {
            badge: 'Private project / Confidential',
            subtitle: 'Enterprise integrations system',
            shortDescription:
              'Participation in secure integration development inside a business environment.\nFocused on communication between systems, APIs and process automation.',
            tags: ['Integrations', 'Backend', 'Security', 'APIs', 'Automation'],
            statusPills: ['Confidential project', 'Restricted access'],
          },
        }),
        withProjectCopy(privateProjects[1], {
          description:
            'First professional project for an advertising company. Commercial WordPress sites focused on SEO positioning and digital presence for multiple clients.',
          visibility: 'Private',
          tags: ['WordPress', 'SEO', 'Commercial web', 'Marketing'],
          confidentialLabel: 'Confidential project',
          featuredHero: {
            badge: 'Private project / Confidential',
            subtitle: 'Commercial web platform and digital management',
            shortDescription:
              'Work on a private web environment focused on editorial operation, integrations and technical continuity.\nImplemented with evolutionary maintenance, automations and restricted access.',
            tags: ['WordPress', 'Integrations', 'Technical SEO', 'Automation', 'Maintenance'],
            statusPills: ['Confidential project', 'Restricted access'],
          },
        }),
      ],
    },
  ],
  finalCta: {
    kicker: 'Next step',
    title: 'Do you have an idea or project in mind?',
    action: {
      label: 'Start a project',
      href: '/en/empezar-proyecto',
    },
    cards: [
      {
        title: 'Explore my code and public projects',
        description: 'Review repositories, shared code and open projects published on GitHub.',
        action: {
          label: 'Go to GitHub',
          href: 'https://github.com/cristian-bravo',
        },
      },
      {
        title: 'Let’s build something together',
        description: 'If you have an idea, platform or pending improvement, we can turn it into a real product.',
        action: {
          label: 'Start a project',
          href: '/en/empezar-proyecto',
        },
      },
    ],
  },
};
