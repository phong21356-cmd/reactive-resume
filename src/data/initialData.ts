import { Resume, CoverLetter, JobApplication, CareerStory, JobOffer } from '../types/resume';

export const sampleSoftwareEngineer: Resume = {
  id: 'resume-sample-1',
  title: 'Staff Full-Stack & Android Architecture',
  updatedAt: '2026-10-28T16:30:00Z',
  basics: {
    name: 'Alexander Morgan',
    headline: 'Senior Full-Stack & Mobile Platform Architect',
    email: 'alex.morgan@rxresu.me',
    phone: '+1 (415) 382-9104',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    photoUrl: '/photos/sample-picture.jpg',
    summary:
      'Full-Stack and Mobile Platform Architect with 8+ years of experience building offline-first Android applications, distributed cloud runtimes, and high-concurrency web systems. Proven track record reducing cold-start latency, leading cross-functional engineering squads, and shipping products to 14M+ active devices.',
  },
  work: [
    {
      id: 'w-1',
      company: 'Vercel / Cloud Systems Inc.',
      position: 'Staff Platform Engineer',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      summary: 'Lead architect for edge routing infrastructure and mobile companion developer tooling.',
      highlights: [
        'Architected high-throughput edge execution runtime processing 1.4B daily requests with sub-20ms p99 latency.',
        'Built offline-capable Android and PWA inspection suite with background sync and zero-data-loss conflict resolution.',
        'Reduced customer build pipeline execution time by 42% through AST tree-shaking and deterministic caching.',
      ],
    },
    {
      id: 'w-2',
      company: 'ScaleCraft Technologies',
      position: 'Senior Full-Stack & Android Engineer',
      location: 'Austin, TX',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      summary: 'Spearheaded mobile-first platform modernization and GraphQL microservices migration.',
      highlights: [
        'Redesigned core analytics suite for Android and Web, cutting cold boot time from 4.2s to 850ms.',
        'Implemented end-to-end type-safe API contract layer between PostgreSQL, Node.js, and Kotlin/React clients.',
        'Authored shared design system primitives adopted by 14 internal product engineering teams.',
      ],
    },
    {
      id: 'w-3',
      company: 'Apex Media Lab',
      position: 'Software Engineer',
      location: 'New York, NY',
      startDate: '2017-08',
      endDate: '2019-05',
      current: false,
      summary: 'Developed customer-facing responsive interfaces and automated continuous deployment workflows.',
      highlights: [
        'Constructed interactive telemetry widgets for real-time media streaming diagnostics.',
        'Decreased APK and web bundle footprint by 35% through code-splitting and asset compression.',
      ],
    },
  ],
  education: [
    {
      id: 'e-1',
      institution: 'University of California, Berkeley',
      studyType: 'B.S.',
      area: 'Computer Science & Cognitive Science',
      startDate: '2013-09',
      endDate: '2017-05',
      score: '3.85 / 4.0 GPA',
    },
  ],
  skills: [
    {
      id: 's-1',
      name: 'Languages & Mobile',
      level: 5,
      keywords: ['TypeScript', 'Kotlin', 'JavaScript', 'Go', 'SQL', 'Rust'],
    },
    {
      id: 's-2',
      name: 'Frontend & Android',
      level: 5,
      keywords: ['React 19', 'Jetpack Compose', 'Tailwind CSS', 'Vite PWA', 'Service Workers', 'TanStack Query'],
    },
    {
      id: 's-3',
      name: 'Backend & Cloud',
      level: 4,
      keywords: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS'],
    },
    {
      id: 's-4',
      name: 'Architecture & Delivery',
      level: 4,
      keywords: ['Microservices', 'CI/CD', 'Distributed Systems', 'Offline-First Sync', 'TDD'],
    },
  ],
  projects: [
    {
      id: 'p-1',
      name: 'HyperSync: Offline-First Mobile State Engine',
      description:
        'Conflict-free replicated data type (CRDT) synchronization engine for Android and Web collaborative apps.',
      url: 'https://hypersync.example.io',
      repository: 'https://github.com/alexmorgan/hypersync',
      keywords: ['TypeScript', 'Kotlin', 'CRDTs', 'IndexedDB', 'WebSockets'],
    },
    {
      id: 'p-2',
      name: 'Aura UI: Adaptive Touch Primitives',
      description:
        'Accessible touch-first component primitives with 48dp hit targets and full screen-reader support.',
      url: 'https://aura-ui.dev',
      repository: 'https://github.com/alexmorgan/aura-ui',
      keywords: ['React', 'Accessibility', 'Tailwind CSS', 'Android TWA'],
    },
  ],
  certifications: [
    {
      id: 'c-1',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      date: '2024',
      url: 'https://aws.amazon.com/certification',
    },
    {
      id: 'c-2',
      name: 'Associate Android Developer Certification',
      issuer: 'Google Developers',
      date: '2023',
      url: 'https://developers.google.com',
    },
  ],
  languages: [
    { id: 'l-1', name: 'English', fluency: 'Native / Bilingual' },
    { id: 'l-2', name: 'Spanish', fluency: 'Professional Working' },
  ],
  customSections: [],
  design: {
    template: 'modern',
    primaryColor: '#2563eb',
    fontFamily: 'inter',
    fontSize: 'normal',
    pageSpacing: 'normal',
    showPhoto: true,
  },
};

export const sampleProductDesigner: Resume = {
  ...sampleSoftwareEngineer,
  id: 'resume-sample-2',
  title: 'Principal Mobile Product Designer',
  updatedAt: '2026-10-26T11:15:00Z',
  basics: {
    ...sampleSoftwareEngineer.basics,
    name: 'Alexander Morgan',
    headline: 'Principal Mobile UX & Design Systems Lead',
    summary:
      'Design systems leader specializing in Android Material 3 ergonomics, one-handed mobile workflows, and high-converting onboarding experiences across fintech and productivity platforms.',
  },
  design: {
    template: 'minimalist',
    primaryColor: '#059669',
    fontFamily: 'serif',
    fontSize: 'normal',
    pageSpacing: 'normal',
    showPhoto: false,
  },
};

export const initialResumes: Resume[] = [sampleSoftwareEngineer, sampleProductDesigner];

export const sampleCoverLetter: CoverLetter = {
  id: 'cl-sample-1',
  title: 'Staff Android & Platform Engineer - Linear',
  updatedAt: '2026-10-28T14:20:00Z',
  recipientName: 'Sarah Jenkins',
  recipientTitle: 'VP of Engineering',
  companyName: 'Linear Systems Inc.',
  companyAddress: '240 Stockton St, Floor 4, San Francisco, CA 94108',
  date: 'October 28, 2026',
  subject: 'Application for Staff Mobile & Platform Engineer',
  salutation: 'Dear Ms. Jenkins and the Engineering Team,',
  body: `I am writing to express my strong interest in the Staff Mobile & Platform Engineer position at Linear Systems Inc. Having followed your engineering team's work on local-first sync engines and 120Hz mobile interfaces, I am excited by your commitment to craft and sub-50ms interaction budgets.

Over the past eight years, I have architected offline-first mobile and web platforms serving millions of daily sessions. In my current role as Staff Platform Engineer, I led our edge routing and mobile synchronization overhaul, reducing p99 sync latency by 42% while maintaining deterministic conflict resolution across offline Android devices.

What draws me to Linear Systems Inc. is your focus on uncompromising client performance paired with rock-solid distributed infrastructure. My hands-on experience designing CRDT state engines and touch-first interfaces directly aligns with your product roadmap.

Thank you for your time and consideration. I look forward to discussing how my platform architecture background can contribute to your upcoming mobile milestones.`,
  signOff: 'Sincerely,',
};

export const initialApplications: JobApplication[] = [
  {
    id: 'app-1',
    company: 'Linear',
    role: 'Staff Mobile & Platform Engineer',
    location: 'San Francisco, CA (Remote)',
    stage: 'interviewing',
    salaryRange: '$225k – $255k',
    appliedDate: '2026-10-18',
    nextStep: 'System Design Round on Nov 2',
    notes: 'Focus on local-first IndexedDB/SQLite sync engine and Android 15 predictive back gestures.',
    linkedResumeId: 'resume-sample-1',
  },
  {
    id: 'app-2',
    company: 'Stripe',
    role: 'Staff Android SDK Engineer',
    location: 'Seattle, WA (Hybrid)',
    stage: 'offer',
    salaryRange: '$240k – $270k',
    appliedDate: '2026-10-04',
    nextStep: 'Review written offer package by Nov 5',
    notes: 'Terminal Mobile Tap-to-Pay team. Strong equity refresh component.',
    linkedResumeId: 'resume-sample-1',
  },
  {
    id: 'app-3',
    company: 'Raycast',
    role: 'Principal Product Engineer',
    location: 'London / Remote',
    stage: 'applied',
    salaryRange: '$205k – $230k',
    appliedDate: '2026-10-24',
    nextStep: 'Follow up with hiring manager on Nov 1',
    notes: 'Submitted Staff Full-Stack resume and custom cover letter.',
    linkedResumeId: 'resume-sample-1',
  },
  {
    id: 'app-4',
    company: 'Figma',
    role: 'Design Systems Architect',
    location: 'San Francisco, CA',
    stage: 'saved',
    salaryRange: '$230k – $260k',
    appliedDate: '2026-10-27',
    nextStep: 'Tailor resume keywords for Mobile Canvas team',
    notes: 'Referral from Alex Chen on Dev Mode team.',
    linkedResumeId: 'resume-sample-2',
  },
];

export const initialCareerStories: CareerStory[] = [
  {
    id: 'story-1',
    title: 'Zero-Downtime Edge & Mobile Sync Migration',
    competency: 'System Architecture & Technical Leadership',
    situation:
      'Mobile clients experienced 4.2s cold starts and frequent sync conflicts when reconnecting from subway tunnels.',
    action:
      'Designed delta-compressed CRDT sync protocol with background Android WorkManager queue and optimistic UI updates.',
    result:
      'Cut cold-start latency by 80% (to 850ms) and eliminated customer-reported draft overwrites across 1.4M monthly mobile sessions.',
  },
  {
    id: 'story-2',
    title: 'Cross-Team Design System Unification',
    competency: 'Cross-Functional Influence',
    situation:
      '14 product squads maintained fragmented UI components with inconsistent accessibility and touch target sizing.',
    action:
      'Built unified token pipeline exporting to both React Web and Android Jetpack Compose with automated 48dp touch hitbox lint gates.',
    result:
      'Adopted by 100% of squads within 2 quarters, accelerating feature delivery by 35% and achieving WCAG 2.1 AA compliance.',
  },
];

export const initialOffers: JobOffer[] = [
  {
    id: 'offer-1',
    company: 'Stripe',
    role: 'Staff Android SDK Engineer',
    location: 'Seattle, WA',
    baseSalary: 245000,
    annualBonusPct: 15,
    equityAnnual: 95000,
    signingBonus: 35000,
    workPolicy: 'Hybrid',
  },
  {
    id: 'offer-2',
    company: 'Linear',
    role: 'Staff Platform Engineer',
    location: 'Remote',
    baseSalary: 235000,
    annualBonusPct: 10,
    equityAnnual: 110000,
    signingBonus: 25000,
    workPolicy: 'Remote',
  },
];
