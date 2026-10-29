import React, { useState, useMemo } from 'react';
import { Resume } from '../../types/resume';
import { analyzeJobMatch } from '../../utils/atsEngine';
import { CheckCircle2, AlertCircle, FileSearch, ShieldCheck, Plus } from 'lucide-react';

interface AtsCheckerProps {
  resume: Resume;
  onApplyKeyword?: (keyword: string) => void;
}

export const AtsChecker: React.FC<AtsCheckerProps> = ({ resume, onApplyKeyword }) => {
  const [jobDescription, setJobDescription] = useState<string>(
    `We are seeking a Staff Android & Full-Stack Platform Engineer with strong experience in TypeScript, Kotlin, React, Jetpack Compose, GraphQL, Terraform, and cloud systems (AWS, Docker, Kubernetes).
Key Responsibilities:
- Design and scale distributed offline-first mobile synchronization and microservices with low latency.
- Collaborate with cross-functional product teams to ship accessible Android and web experiences.
- Optimize CI/CD pipelines, automated testing, and system reliability.`
  );

  const analysis = useMemo(
    () => analyzeJobMatch(resume, jobDescription),
    [resume, jobDescription]
  );

  return (
    <div className="space-y-5">
      {/* Top ATS Score Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-medium text-blue-400">
            ATS Parser &amp; Keyword Match
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            Resume Match &amp; Parser Readiness
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Compare your active resume against a target job description. Tap any missing keyword below to add it directly to your resume skills.
          </p>
        </div>

        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 transform -rotate-90" aria-hidden="true">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-800"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * analysis.score) / 100}
              className={
                analysis.score >= 80
                  ? 'text-emerald-500'
                  : analysis.score >= 60
                  ? 'text-blue-500'
                  : 'text-amber-500'
              }
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {analysis.score}%
            </span>
            <div className="text-[10px] text-slate-400 font-medium">Match</div>
          </div>
        </div>
      </div>

      {/* Job Description Input */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
        <label
          htmlFor="ats-jd-input"
          className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5"
        >
          <FileSearch className="h-4 w-4 text-blue-400" />
          Target Job Description
        </label>
        <textarea
          id="ats-jd-input"
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste requirements and responsibilities from the job posting..."
          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
        />
      </div>

      {/* Two Column Keyword Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Matched Keywords (Unboxed clean list or subtle tokens) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2.5">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Matched Keywords in Resume ({analysis.matched.length})</span>
          </div>
          {analysis.matched.length === 0 ? (
            <p className="text-xs text-slate-500">No direct keyword matches found yet.</p>
          ) : (
            <p className="text-xs text-emerald-300 leading-relaxed">
              {analysis.matched.join(' · ')}
            </p>
          )}
        </div>

        {/* Missing Keywords with Interactive One-Tap Add */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2.5">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Missing Keywords — Tap to Add ({analysis.missing.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missing.length === 0 ? (
              <span className="text-xs text-emerald-400 font-medium">
                All high-frequency keywords are covered in your resume!
              </span>
            ) : (
              analysis.missing.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => onApplyKeyword?.(kw)}
                  aria-label={`Add keyword ${kw} to resume skills`}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {kw}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Structural Checklist */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          ATS Parser &amp; Structural Audit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {analysis.checks.map((chk, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5"
            >
              {chk.pass ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-xs font-semibold text-slate-100">{chk.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{chk.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
