export type TemplateType = 'modern' | 'minimalist' | 'classic' | 'compact' | 'creative';
export type FontFamily = 'inter' | 'serif' | 'mono';
export type Density = 'compact' | 'normal' | 'relaxed';

export interface Basics {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photoUrl: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  studyType: string;
  area: string;
  startDate: string;
  endDate: string;
  score: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1 to 5
  keywords: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  repository: string;
  keywords: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Language {
  id: string;
  name: string;
  fluency: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeDesign {
  template: TemplateType;
  primaryColor: string;
  fontFamily: FontFamily;
  fontSize: Density;
  pageSpacing: Density;
  showPhoto: boolean;
}

export interface Resume {
  id: string;
  title: string;
  updatedAt: string;
  basics: Basics;
  work: WorkExperience[];
  education: Education[];
  skills: SkillItem[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
  design: ResumeDesign;
}

export interface CoverLetter {
  id: string;
  title: string;
  updatedAt: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  subject: string;
  salutation: string;
  body: string;
  signOff: string;
}

export type ApplicationStage = 'saved' | 'applied' | 'interviewing' | 'offer' | 'archived';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  stage: ApplicationStage;
  salaryRange: string;
  appliedDate: string;
  nextStep: string;
  notes: string;
  linkedResumeId: string;
}

export interface CareerStory {
  id: string;
  title: string;
  competency: string;
  situation: string;
  action: string;
  result: string;
}

export interface JobOffer {
  id: string;
  company: string;
  role: string;
  location: string;
  baseSalary: number;
  annualBonusPct: number;
  equityAnnual: number;
  signingBonus: number;
  workPolicy: 'Remote' | 'Hybrid' | 'On-site';
}
