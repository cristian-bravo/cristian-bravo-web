import { projectsAfterCampus as campus, projectsAfterEducation as education } from '../es/project-additions';
import type { ProjectReferenceContent } from '../es/projects';

const copy: Record<string, { description: string; badge: string; tags: string[]; captions: string[] }> = {
  'Fundación Manos en Acción': {
    description: 'Public landing page for an English scholarship program and an administration platform for managing applicants, tests and enrollment.',
    badge: 'Foundation / Education management',
    tags: ['Public landing page', 'Administration platform', 'Internal management'],
    captions: ['English scholarship program', 'English levels', 'Administration platform sign-in'],
  },
  Berlina: {
    description: 'Mobility platform for women, with verified female drivers, real-time trip tracking and safety tools.',
    badge: 'Mobility / Application',
    tags: ['Mobility', 'Mobile app', 'Safety'],
    captions: ['Mobility for women', 'Safety tools', 'Application experience'],
  },
  Telollevamos: {
    description: 'E-commerce for shopping at international stores with delivery in Ecuador, a product catalog, final pricing and order tracking.',
    badge: 'E-commerce / Imports',
    tags: ['E-commerce', 'Catalog', 'Imports'],
    captions: ['International store', 'Product catalog', 'Product details'],
  },
  DePaso: {
    description: 'International shopping and shipping platform connecting verified travelers with deliveries in Ecuador, quotes and package management.',
    badge: 'Logistics / Platform',
    tags: ['Logistics', 'Mobile app', 'Package management'],
    captions: ['International shopping and shipping', 'Administration dashboard with demo data', 'Shipping calculator'],
  },
  'Riocargo Express': {
    description: 'Logistics platform with an international mailbox, shipping quotes and tracking for purchases from the United States, Spain and China.',
    badge: 'Logistics / Courier',
    tags: ['Logistics', 'International mailbox', 'Tracking'],
    captions: ['International mailbox', 'Shopping and shipping process', 'Shipping calculator'],
  },
  IDEC: {
    description: 'Corporate engineering and technology website presenting automation, infrastructure and connectivity services for business operations.',
    badge: 'Engineering / Technology',
    tags: ['Automation', 'Infrastructure', 'Connectivity'],
    captions: ['Engineering and technology solutions', 'Business operations platforms', 'Working methodology'],
  },
  Nexus: {
    description: 'Financial advisory platform for housing, vehicles and consumer needs, with service information and online quotes to guide each application.',
    badge: 'Advisory / Financial services',
    tags: ['Financial advisory', 'Services', 'Quotes'],
    captions: ['Financial advisory', 'Housing, vehicle and consumer solutions', 'Public quote calculator'],
  },
  'SH Fast Recover': {
    description: 'Corporate receivables recovery website presenting collection, automation and follow-up services for businesses.',
    badge: 'Business / Receivables recovery',
    tags: ['Collections', 'Automation', 'Follow-up'],
    captions: ['Receivables recovery', 'Collection solutions', 'Business services'],
  },
};

const translate = (project: ProjectReferenceContent): ProjectReferenceContent => {
  const text = copy[project.title];
  return {
    ...project,
    description: text.description,
    visibility: 'Public',
    tags: text.tags,
    gallery: project.gallery.map((item, index) => ({
      ...item,
      alt: `${project.title}: ${text.captions[index]}`,
      caption: text.captions[index],
      ...(item.note ? { note: 'Demo data' } : {}),
    })),
    actions: project.actions?.map((action) => ({
      ...action,
      label: project.title === 'Fundación Manos en Acción'
        ? action.variant === 'primary' ? 'Public website' : 'Administration'
        : 'View project',
    })),
    featuredHero: project.featuredHero && {
      ...project.featuredHero,
      badge: text.badge,
      shortDescription: text.description,
    },
  };
};

export const projectsAfterCampus = campus.map(translate);
export const projectsAfterEducation = education.map(translate);
