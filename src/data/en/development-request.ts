import type {
  DevelopmentProjectContent,
  DevelopmentRequestApiContent,
  DevelopmentRequestLandingContent,
  DevelopmentSimpleContent,
} from '../es/development-request';
import type { PageMetadata } from '../../types/content';

export const developmentRequestLandingPageMeta: PageMetadata = {
  title: 'Start a project | CYSTEMS',
  description: 'Choose the right path to start your development request with CYSTEMS.',
};

export const developmentRequestSimplePageMeta: PageMetadata = {
  title: 'Quick request | CYSTEMS',
  description: 'Short form for questions and small development requests with CYSTEMS.',
};

export const developmentRequestProjectPageMeta: PageMetadata = {
  title: 'Complete project | CYSTEMS',
  description: 'Step-by-step wizard to request a complete development project with CYSTEMS.',
};

export const developmentRequestApiContent: DevelopmentRequestApiContent = {
  invalidBody: 'We could not read your request.',
  methodNotAllowed: 'This option is not available.',
  rateLimitError: 'You have sent too many requests. Try again later.',
};

export const developmentRequestLandingContent: DevelopmentRequestLandingContent = {
  header: {
    kicker: 'Start here',
    title: 'Tell me what you want to build',
    description:
      'Choose how you want to begin. You can send a quick message or complete a structured request.',
  },
  cards: [
    {
      kicker: 'Option 1',
      title: 'Quick consultation',
      description: 'For simple ideas or questions.',
      detail: 'If the idea is clear and you want to move fast, this is the most direct path.',
      bullets: ['Fast and simple', 'Ideal to start', 'Quick response'],
      action: {
        label: 'Start',
        href: '/en/empezar-proyecto/simple',
      },
      rotation: '-1.5deg',
    },
    {
      kicker: 'Option 2',
      title: 'Complete project',
      description: 'For larger or more detailed work.',
      detail: 'If you want to explain the idea better and receive a clearer proposal.',
      bullets: ['Step by step', 'More detail', 'Better planning'],
      action: {
        label: 'Create request',
        href: '/en/empezar-proyecto/proyecto',
      },
      rotation: '1.5deg',
    },
  ],
  supportKicker: 'Clear process',
  supportTitle: 'Everything starts simple',
  supportDescription: 'The goal is to understand your context and answer with a practical next step.',
  supportChips: ['Easy to use', 'Clear', 'Fast', 'No friction', 'Better response'],
};

export const developmentRequestSimpleContent: DevelopmentSimpleContent = {
  header: {
    kicker: 'Quick consultation',
    title: 'Let’s talk',
    description: 'Tell me what you need and I will reply as soon as possible.',
  },
  supportKicker: 'Simple',
  supportTitle: 'When to use this form',
  supportDescription:
    'Use this form to start quickly. If more detail is needed, we can refine the scope together later.',
  supportItems: ['General questions', 'Ideas for websites, apps or systems', 'Quick needs'],
  consultationOptions: [
    'General consultation',
    'Website',
    'Online store',
    'Web application',
    'System',
    'Automation',
    'Other',
  ],
  submitLabel: 'Send',
  footerNote: 'I will reply soon. You can also write to contacto@cystems.ec',
  emailLabel: 'Email',
  emailValue: 'contacto@cystems.ec',
  returnAction: {
    label: 'Back',
    href: '/en/empezar-proyecto',
  },
  form: {
    cardKicker: 'Form',
    cardTitle: 'Quick and simple',
    cardDescription: 'Complete the basics and your message will be sent to {email}.',
    pendingStatus: 'Sending your message...',
    sendingLabel: 'Sending...',
    successKicker: 'Done',
    successTitle: 'Message sent',
    successDescription: 'I will reply from {email} as soon as possible.',
    resetLabel: 'Send another',
    directEmailLabel: 'Write to {email}',
    fields: {
      name: 'Name',
      email: 'Email',
      company: 'Phone',
      consultationType: 'Type',
      message: 'Message',
    },
    validation: {
      nameRequired: 'Enter your name.',
      emailRequired: 'Enter your email.',
      emailInvalid: 'Invalid email.',
      companyInvalid: 'Only numbers are allowed.',
      consultationTypeRequired: 'Choose an option.',
      messageRequired: 'Write your message.',
      submitError: 'The message could not be sent. Try again.',
    },
  },
};

export const developmentRequestProjectContent: DevelopmentProjectContent = {
  header: {
    kicker: 'Complete request',
    title: 'Tell me about your project',
    description: 'A guided flow to understand your idea and prepare a clearer proposal.',
  },
  sidebarTitle: 'The clearer the brief, the better the plan',
  sidebarDescription: 'These questions help define scope, priorities and technical direction.',
  sidebarHighlights: ['3 simple steps', 'Only what is needed', 'Progress is saved automatically', 'Review before sending'],
  responsePromise: 'I usually reply in less than 24 hours.',
  contactEmail: 'contacto@cystems.ec',
  returnAction: {
    label: 'Back',
    href: '/en/empezar-proyecto',
  },
  stepTitles: ['Contact details', 'Your project', 'Final details'],
  stepDescriptions: ['Information to contact you.', 'Tell me what you want to build.', 'Add details and review before sending.'],
  projectTypeOptions: ['Landing page', 'Website', 'Online store', 'Web application', 'System', 'SaaS platform', 'Other'],
  projectLevelOptions: ['Startup', 'Company', 'Corporate', 'Government'],
  pageOptions: ['1 page', '3 - 5 pages', '5 - 10 pages', '10 - 20 pages', 'More than 20', 'Not sure'],
  designOptions: ['Basic', 'Modern', 'Premium', 'Not sure'],
  featureOptions: [
    'Form',
    'Blog',
    'Admin panel',
    'Login',
    'Payments',
    'Bookings',
    'Customers',
    'Dashboard',
    'API',
    'Chat',
    'Multilanguage',
    'SEO',
    'Optimization',
  ],
  integrationOptions: ['WhatsApp', 'Payments (Stripe/PayPal)', 'Analytics', 'CRM', 'Emails', 'External API', 'ERP'],
  hostingOptions: ['I already have it', 'I need it', 'Hosting + domain', 'Not sure'],
  brandingOptions: ['I already have branding', 'I have a logo', 'I need everything'],
  contentOptions: ['I will provide content', 'I need help', 'Professional copywriting', 'Images'],
  timelineOptions: ['Urgent', '1 month', '2-3 months', 'Flexible'],
  uploadHints: ['PDF, Word, Excel (max 10MB)'],
  finalSubmitLabel: 'Send request',
  confirmModalTitle: 'Send request?',
  confirmModalDescription: 'I will review your information and reply with the next step.',
  confirmModalCancelLabel: 'Cancel',
  confirmModalConfirmLabel: 'Send',
  successTitle: 'Request sent',
  successDescription: 'I will reply soon to the email you provided.',
  ui: {
    sidebarKicker: 'Form',
    stepNavigationLabel: 'Steps',
    stepCounterTemplate: 'Step {current} of {total}',
    restoredStatus: 'Your progress was restored.',
    savePrefix: 'Saved:',
    backLabel: 'Back',
    nextLabel: 'Next',
    successKicker: 'Done',
    successResetLabel: 'New request',
    successEmailLabel: 'Write to {email}',
    confirmKicker: 'Confirmation',
    confirmDestinationLabel: 'It will be sent to {email}',
    confirmCloseLabel: 'Close',
    sendingLabel: 'Sending...',
    submitError: 'The request could not be sent. Try again.',
    contactStep: {
      fields: {
        fullName: { label: 'Name', required: true },
        email: { label: 'Email', required: true },
        company: { label: 'Company / project' },
        phone: { label: 'Phone / WhatsApp', required: true },
        country: { label: 'Country' },
        projectDescription: {
          label: 'Your idea',
          placeholder: 'Briefly explain what you want to build.',
          required: true,
        },
      },
    },
    scopeStep: {
      fields: {
        projectType: { label: 'Type', placeholder: 'Choose an option' },
        projectLevel: { label: 'Level', placeholder: 'Choose an option' },
        pageRange: { label: 'Pages', placeholder: 'Choose an option' },
        designLevel: { label: 'Design', placeholder: 'Choose an option' },
      },
    },
    reviewStep: {
      featureTitle: 'Features',
      featureDescription: 'Select only what is already clear.',
      integrationTitle: 'Integrations',
      integrationDescription: 'Connections or tools needed.',
      logisticsTitle: 'Details',
      logisticsDescription: 'Timeline, content and extras.',
      fields: {
        hosting: { label: 'Hosting', placeholder: 'Choose an option' },
        branding: { label: 'Design / brand', placeholder: 'Choose an option' },
        contentPlan: { label: 'Content', placeholder: 'Choose an option' },
        timeline: { label: 'Timeline', placeholder: 'Choose an option' },
        references: {
          label: 'References',
          placeholder: 'Example: vercel.com, linear.app...',
        },
        specialRequirements: {
          label: 'Extras',
          placeholder: 'AI, automation, security, etc.',
        },
        attachment: {
          label: 'File',
          placeholder: 'Upload a document (max 10MB).',
        },
      },
    },
    summaryLabels: {
      contact: 'Contact',
      scope: 'Project',
      stack: 'Details',
      brief: 'Summary',
    },
    summaryFallbacks: {
      contactName: 'No name',
      contactEmail: 'No email',
      scopeTitle: 'Not defined',
      scopeDescription: 'Not defined yet',
      features: 'No extras',
      integrations: 'No integrations',
      references: 'No references',
      stackMeta: 'No details',
      brief: 'No summary',
      notes: 'No notes',
      assets: 'No files',
      noFiles: 'None',
      featureCountSingular: 'feature',
      featureCountPlural: 'features',
    },
    validation: {
      fullNameRequired: 'Enter your name.',
      emailRequired: 'Enter your email.',
      emailInvalid: 'Invalid email.',
      phoneRequired: 'Enter your phone number.',
      projectDescriptionRequired: 'Describe your idea.',
    },
    fileValidation: {
      invalidType: 'Invalid file.',
      tooLarge: 'Maximum 10MB.',
      clearLabel: 'Remove',
    },
  },
};
