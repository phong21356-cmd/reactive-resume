import { Resume } from '../types/resume';

export interface AtsCheckItem {
  label: string;
  pass: boolean;
  detail: string;
}

export interface AtsAnalysisResult {
  score: number;
  matched: string[];
  missing: string[];
  checks: AtsCheckItem[];
}

const STOP_WORDS = new Set([
  'the', 'and', 'with', 'for', 'that', 'this', 'from', 'have', 'been', 'will',
  'your', 'are', 'you', 'our', 'what', 'their', 'about', 'lead', 'team',
  'work', 'must', 'able', 'more', 'they', 'them', 'these', 'those', 'such',
  'into', 'than', 'over', 'also', 'most', 'some', 'other', 'well', 'years',
  'seeking', 'strong', 'experience', 'key', 'responsibilities', 'build', 'modern',
]);

export function extractResumeCorpus(resume: Resume): string {
  const parts: string[] = [
    resume.basics.name,
    resume.basics.headline,
    resume.basics.summary,
    ...resume.work.flatMap((w) => [w.position, w.company, w.summary, ...w.highlights]),
    ...resume.education.map((e) => `${e.institution} ${e.studyType} ${e.area}`),
    ...resume.skills.flatMap((s) => [s.name, ...s.keywords]),
    ...resume.projects.flatMap((p) => [p.name, p.description, ...p.keywords]),
    ...resume.certifications.map((c) => `${c.name} ${c.issuer}`),
  ];
  return parts.join(' ').toLowerCase();
}

export function analyzeJobMatch(resume: Resume, jobDescription: string): AtsAnalysisResult {
  if (!jobDescription.trim()) {
    return { score: 0, matched: [], missing: [], checks: [] };
  }

  const resumeText = extractResumeCorpus(resume);

  const rawTokens = jobDescription
    .toLowerCase()
    .replace(/[^a-zA-Z0-9+#.-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const freqMap: Record<string, number> = {};
  for (const token of rawTokens) {
    freqMap[token] = (freqMap[token] || 0) + 1;
  }

  const candidates = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 28);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const word of candidates) {
    if (resumeText.includes(word)) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  }

  const keywordScore = candidates.length > 0 ? (matched.length / candidates.length) * 100 : 75;

  const checks: AtsCheckItem[] = [
    {
      label: 'Direct Contact Metadata',
      pass: Boolean(resume.basics.email && resume.basics.phone && resume.basics.location),
      detail: 'Email, phone, and city/region are present for automated parser indexing.',
    },
    {
      label: 'Role-Aligned Headline',
      pass: Boolean(resume.basics.headline && resume.basics.headline.trim().length > 5),
      detail: 'Target title appears immediately below candidate name.',
    },
    {
      label: 'Quantified Experience Bullets',
      pass: resume.work.some((w) => w.highlights && w.highlights.length >= 2),
      detail: 'Work history includes structured bullet points with measurable outcomes.',
    },
    {
      label: 'Categorized Technical Taxonomy',
      pass: resume.skills.length >= 2,
      detail: 'Skills are grouped into scannable domain categories.',
    },
    {
      label: 'Academic & Credential Dates',
      pass: resume.education.length > 0,
      detail: 'Education entries include institution, degree type, and timeframe.',
    },
  ];

  const passedChecks = checks.filter((c) => c.pass).length;
  const structureScore = (passedChecks / checks.length) * 100;
  const overallScore = Math.min(100, Math.round(keywordScore * 0.65 + structureScore * 0.35));

  return {
    score: overallScore,
    matched,
    missing,
    checks,
  };
}

export function injectSkillKeyword(resume: Resume, keyword: string): Resume {
  const clean = keyword.trim();
  if (!clean) return resume;

  const existingCorpus = extractResumeCorpus(resume);
  if (existingCorpus.includes(clean.toLowerCase())) {
    return resume;
  }

  const formattedKeyword = clean.length <= 4 ? clean.toUpperCase() : clean.charAt(0).toUpperCase() + clean.slice(1);

  if (resume.skills.length === 0) {
    return {
      ...resume,
      updatedAt: new Date().toISOString(),
      skills: [
        {
          id: `s-${Date.now()}`,
          name: 'Core Competencies',
          level: 4,
          keywords: [formattedKeyword],
        },
      ],
    };
  }

  const updatedSkills = resume.skills.map((skill, idx) =>
    idx === 0
      ? {
          ...skill,
          keywords: [...skill.keywords, formattedKeyword],
        }
      : skill
  );

  return {
    ...resume,
    updatedAt: new Date().toISOString(),
    skills: updatedSkills,
  };
}
