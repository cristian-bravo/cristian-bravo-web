import type { Lang } from './index';

const es = {
  eyebrow: 'Ingeniería de software · Ecuador',
  title: 'Tu operación,',
  titleAccent: 'mejor conectada.',
  intro:
    'Software a medida, automatización e inteligencia artificial para empresas que necesitan dar el siguiente paso.',
  detail:
    'Convertimos procesos dispersos en plataformas claras. Desde la primera idea hasta el sistema que tu equipo usa todos los días.',
  cta: 'Cuéntanos qué necesitas',
  projectsCta: 'Explorar proyectos',
  note: 'Hablemos del problema. El alcance lo definimos juntos.',
  systemLabel: 'De la operación al producto',
  diagramLabel:
    'Ejemplo de arquitectura: documentos, datos y personas conectados con una plataforma y un asistente de IA.',
  inputs: ['Documentos', 'Tus sistemas', 'Tu equipo'],
  systemCaption: 'Software + IA aplicada',
  output: 'Una operación conectada',
  diagramNote: 'Arquitectura ilustrativa · Cada solución empieza en tu negocio',
  capabilities: [
    'Plataformas web',
    'MVPs',
    'Integraciones',
    'Automatización',
    'IA aplicada',
    'Cloud',
  ],
  problemsLabel: '01 / El punto de partida',
  problemsTitle: 'El problema no siempre es construir algo nuevo.',
  problemsIntro:
    'A veces necesitas conectar lo que ya existe, recuperar un proyecto o dejar de hacer la misma tarea cien veces.',
  problems: [
    [
      'Demasiado trabajo manual',
      'Pasamos de archivos dispersos, mensajes y tareas repetidas a flujos que tu equipo puede seguir.',
    ],
    [
      'Sistemas que no se hablan',
      'Conectamos APIs, pagos, CRM y herramientas internas para que la información llegue donde hace falta.',
    ],
    [
      'Una idea lista para probarse',
      'Definimos un MVP con las funciones esenciales para validar el producto con usuarios reales.',
    ],
    [
      'Software que necesita ayuda',
      'Revisamos errores, rendimiento, seguridad y código heredado. Priorizamos qué reparar y cómo continuar.',
    ],
  ],
  servicesLabel: '02 / Lo que construimos',
  servicesTitle: 'Una base técnica para tu siguiente etapa.',
  services: [
    [
      '01',
      'Software a medida',
      'Plataformas empresariales, aplicaciones web y sistemas internos con roles, procesos e integraciones.',
    ],
    [
      '02',
      'MVP y producto digital',
      'De una hipótesis a una primera versión utilizable. Alcance definido, entregas visibles y espacio para evolucionar.',
    ],
    [
      '03',
      'IA y automatización',
      'Asistentes, búsqueda en documentos y clasificación de información conectados con procesos reales.',
    ],
    [
      '04',
      'Rescate y evolución',
      'Auditoría, corrección de errores, modernización, mantenimiento y acompañamiento técnico.',
    ],
  ],
  serviceCta: 'Conocer el servicio',
  rescueLabel: 'Servicio destacado / Rescate de software',
  rescueTitle: 'Antes de empezar de cero, entendamos qué se puede recuperar.',
  rescueIntro:
    'Un proyecto detenido no siempre necesita una reconstrucción. Revisamos el código, los riesgos y la operación para decidir con evidencia.',
  rescueSignals: [
    'Errores que se repiten',
    'Entregas que quedaron a medias',
    'Código sin documentación',
    'Un sistema lento o difícil de mantener',
  ],
  rescueOutcome:
    'Un diagnóstico priorizado y una ruta de continuidad: qué conservar, qué corregir y qué conviene replantear.',
  rescueCta: 'Cuéntanos qué está fallando',
  workLabel: '03 / Trabajo real',
  workTitle: 'Sistemas con un contexto. No solo pantallas.',
  workIntro:
    'Una selección de proyectos que conecta experiencia de usuario, reglas de negocio y operación.',
  problem: 'El contexto',
  solution: 'La solución',
  result: 'Lo que permite',
  cases: [
    {
      name: 'NY Campus Virtual',
      category: 'Educación / Plataforma',
      image: '/projects/NY-Campus-Virtual/ny-campus-virtual-1.webp',
      problem:
        'Organizar la gestión académica y el acceso a aulas online desde una misma plataforma.',
      solution:
        'Un campus con distintos roles, panel administrativo y experiencia para estudiantes.',
      result: 'Centralizar contenido, accesos y gestión institucional.',
      href: 'https://nycampusvirtual.net/',
    },
    {
      name: 'Fualtec',
      category: 'Industria / Portal empresarial',
      image: '/projects/Fualtec/fualtec-1.webp',
      problem:
        'Presentar servicios industriales y facilitar el acceso de clientes a documentación técnica.',
      solution:
        'Sitio institucional, panel empresarial y portal de acceso para clientes.',
      result:
        'Reunir presencia comercial y documentación en una experiencia conectada.',
      href: '/proyectos',
    },
  ],
  caseCta: 'Ver proyecto',
  aiLabel: '04 / Yuki IA',
  aiTitle: 'Una conversación puede ordenar la próxima idea.',
  aiIntro:
    'Cuéntale a Yuki qué necesita tu negocio. Puede ayudarte a explorar un proyecto y preparar las preguntas para una conversación con nuestro equipo.',
  aiDetails: [
    'Conversación inicial sobre tu proyecto',
    'Preguntas para aclarar objetivos',
    'Siguiente paso con el equipo',
  ],
  aiCta: 'Hablar con Yuki',
  aiNote:
    'El historial es opcional. Tú eliges si Yuki puede conservar esta conversación para tu próxima visita.',
  aiNoteUnavailable:
    'El historial y el aprendizaje por visitante todavía no están disponibles.',
  methodLabel: '05 / Forma de trabajar',
  methodTitle: 'Claridad antes de código. Visibilidad durante el proceso.',
  steps: [
    ['Entendemos', 'Problema, usuarios y objetivos.'],
    ['Diseñamos', 'Alcance, experiencia y arquitectura.'],
    ['Construimos', 'Entregas iterativas que puedes revisar.'],
    ['Lanzamos', 'Pruebas, despliegue y validación.'],
    ['Evolucionamos', 'Soporte y mejoras con prioridades claras.'],
  ],
  founderLabel: 'Detrás de CYSTEMS',
  founderTitle: 'Cristian Bravo',
  founderRole: 'Full Stack Developer · Fundador',
  founderCopy:
    'CYSTEMS nace de construir plataformas web y resolver problemas de operación. La conversación es directa: entendemos lo que necesitas, explicamos las decisiones y trabajamos con un alcance claro.',
  founderCta: 'Conocer al fundador',
  finalTitle: '¿Qué debería funcionar mejor en tu empresa?',
  finalCopy:
    'Una idea, un proceso manual o un sistema que ya no responde. Ese es un buen lugar para empezar.',
};

const en: typeof es = {
  eyebrow: 'Software engineering · Ecuador',
  title: 'Your operations,',
  titleAccent: 'better connected.',
  intro:
    'Custom software, automation and artificial intelligence for businesses ready for their next step.',
  detail:
    'We turn scattered processes into clear platforms. From the first idea to the system your team uses every day.',
  cta: 'Tell us what you need',
  projectsCta: 'Explore projects',
  note: 'Start with the problem. We will define the scope together.',
  systemLabel: 'From operations to product',
  diagramLabel:
    'Illustrative architecture: documents, data and people connected to a platform and an AI assistant.',
  inputs: ['Documents', 'Your systems', 'Your team'],
  systemCaption: 'Software + applied AI',
  output: 'Connected operations',
  diagramNote:
    'Illustrative architecture · Every solution starts with your business',
  capabilities: [
    'Web platforms',
    'MVPs',
    'Integrations',
    'Automation',
    'Applied AI',
    'Cloud',
  ],
  problemsLabel: '01 / The starting point',
  problemsTitle: 'Building something new is not always the answer.',
  problemsIntro:
    'Sometimes you need to connect existing tools, recover a project or stop repeating the same task a hundred times.',
  problems: [
    [
      'Too much manual work',
      'We turn scattered files, messages and repetitive tasks into workflows your team can follow.',
    ],
    [
      'Systems that do not talk',
      'We connect APIs, payments, CRMs and internal tools so information reaches the people who need it.',
    ],
    [
      'An idea ready to test',
      'We scope an MVP with the essential features to validate a product with real users.',
    ],
    [
      'Software that needs help',
      'We review errors, performance, security and legacy code, then prioritize repairs and the way forward.',
    ],
  ],
  servicesLabel: '02 / What we build',
  servicesTitle: 'A technical foundation for your next stage.',
  services: [
    [
      '01',
      'Custom software',
      'Business platforms, web applications and internal systems with roles, workflows and integrations.',
    ],
    [
      '02',
      'MVPs and digital products',
      'From a hypothesis to a usable first version. Clear scope, visible deliveries and room to evolve.',
    ],
    [
      '03',
      'AI and automation',
      'Assistants, document search and information classification connected to real workflows.',
    ],
    [
      '04',
      'Recovery and evolution',
      'Audits, bug fixes, modernization, maintenance and technical support.',
    ],
  ],
  serviceCta: 'Explore the service',
  rescueLabel: 'Featured service / Software recovery',
  rescueTitle: 'Before starting over, let’s understand what can be recovered.',
  rescueIntro:
    'A stalled project does not always need a rebuild. We review the code, risks and operations to make an evidence-based decision.',
  rescueSignals: [
    'Recurring bugs',
    'Unfinished deliveries',
    'Undocumented code',
    'A slow or hard-to-maintain system',
  ],
  rescueOutcome:
    'A prioritized diagnosis and a path forward: what to keep, what to fix and what needs a different approach.',
  rescueCta: 'Tell us what is failing',
  workLabel: '03 / Real work',
  workTitle: 'Systems with context. More than screens.',
  workIntro:
    'Selected projects connecting user experience, business rules and operations.',
  problem: 'The context',
  solution: 'The solution',
  result: 'What it enables',
  cases: [
    {
      name: 'NY Campus Virtual',
      category: 'Education / Platform',
      image: '/projects/NY-Campus-Virtual/ny-campus-virtual-1.webp',
      problem:
        'Organize academic management and access to online classrooms in one platform.',
      solution:
        'A campus with distinct roles, an administration panel and a student experience.',
      result: 'Centralize content, access and institutional management.',
      href: 'https://nycampusvirtual.net/',
    },
    {
      name: 'Fualtec',
      category: 'Industry / Business portal',
      image: '/projects/Fualtec/fualtec-1.webp',
      problem:
        'Present industrial services and help customers access technical documentation.',
      solution:
        'An institutional website, business dashboard and customer access portal.',
      result:
        'Bring the commercial presence and documentation into one connected experience.',
      href: '/proyectos',
    },
  ],
  caseCta: 'View project',
  aiLabel: '04 / Yuki AI',
  aiTitle: 'A conversation can bring your next idea into focus.',
  aiIntro:
    'Tell Yuki what your business needs. It can help you explore a project and prepare questions for a conversation with our team.',
  aiDetails: [
    'An initial conversation about your project',
    'Questions to clarify your goals',
    'A next step with our team',
  ],
  aiCta: 'Talk to Yuki',
  aiNote:
    'Conversation history is optional. You decide whether Yuki may keep this conversation for your next visit.',
  aiNoteUnavailable:
    'Conversation history and visitor-specific learning are not available yet.',
  methodLabel: '05 / How we work',
  methodTitle: 'Clarity before code. Visibility throughout the process.',
  steps: [
    ['Understand', 'The problem, users and objectives.'],
    ['Design', 'Scope, experience and architecture.'],
    ['Build', 'Iterative deliveries you can review.'],
    ['Launch', 'Testing, deployment and validation.'],
    ['Evolve', 'Support and improvements with clear priorities.'],
  ],
  founderLabel: 'Behind CYSTEMS',
  founderTitle: 'Cristian Bravo',
  founderRole: 'Full Stack Developer · Founder',
  founderCopy:
    'CYSTEMS grew from building web platforms and solving operational problems. We keep the conversation direct: understand your needs, explain our decisions and work with a clear scope.',
  founderCta: 'Meet the founder',
  finalTitle: 'What should work better in your business?',
  finalCopy:
    'An idea, a manual process or a system that can no longer keep up. That is a good place to start.',
};

export const getStudioContent = (lang: Lang) => (lang === 'en' ? en : es);
