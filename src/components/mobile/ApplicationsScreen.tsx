import React, { useState } from 'react';
import { ApplicationStage, JobApplication, Resume } from '../../types/resume';
import {
  computeApplicationMetrics,
  advanceApplicationStage,
} from '../../utils/applicationTracker';
import { Briefcase, Plus, ArrowRight, Trash2, Calendar } from 'lucide-react';

interface ApplicationsScreenProps {
  applications: JobApplication[];
  resumes: Resume[];
  onAddApplication: (app: Omit<JobApplication, 'id'>) => void;
  onUpdateStage: (id: string, nextStage: ApplicationStage) => void;
  onDeleteApplication: (id: string) => void;
}

const STAGE_LABELS: Record<ApplicationStage, string> = {
  saved: 'Saved',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  archived: 'Archived',
};

export const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({
  applications,
  resumes,
  onAddApplication,
  onUpdateStage,
  onDeleteApplication,
}) => {
  const [stageFilter, setStageFilter] = useState<'all' | ApplicationStage>('all');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [stage, setStage] = useState<ApplicationStage>('applied');
  const [nextStep, setNextStep] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const metrics = computeApplicationMetrics(applications);

  const visibleApps =
    stageFilter === 'all'
      ? applications
      : applications.filter((app) => app.stage === stageFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      setError('Company name and role title are required.');
      return;
    }

    onAddApplication({
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || 'Remote',
      stage,
      salaryRange: salaryRange.trim() || '$190k – $220k',
      appliedDate: new Date().toISOString().slice(0, 10),
      nextStep: nextStep.trim() || 'Follow up with recruiter',
      notes: notes.trim(),
      linkedResumeId: resumes[0]?.id || 'resume-sample-1',
    });

    setCompany('');
    setRole('');
    setLocation('');
    setSalaryRange('');
    setNextStep('');
    setNotes('');
    setError('');
    setShowAddSheet(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Job Applications</h2>
          <p className="text-xs text-slate-400">
            Track interviews, follow-ups, and linked resumes
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddSheet((prev) => !prev)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      {/* Summary Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
          <div className="text-xs text-slate-400">Total Tracked</div>
          <div className="text-2xl font-bold text-slate-100 tabular-nums mt-1">
            {metrics.total}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
          <div className="text-xs text-slate-400">Active Pipeline</div>
          <div className="text-2xl font-bold text-blue-400 tabular-nums mt-1">
            {metrics.activeCount}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
          <div className="text-xs text-slate-400">Interview Rate</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
            {metrics.responseRatePct}%
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
          <div className="text-xs text-slate-400">Offers Received</div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums mt-1">
            {metrics.offerCount}
          </div>
        </div>
      </div>

      {/* Add Application Sheet / Form */}
      {showAddSheet && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">Log Job Application</h3>
            <button
              type="button"
              onClick={() => {
                setShowAddSheet(false);
                setError('');
              }}
              className="min-h-[40px] px-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="app-company" className="block text-xs font-medium text-slate-300 mb-1">
                Company Name
              </label>
              <input
                id="app-company"
                type="text"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Google"
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="app-role" className="block text-xs font-medium text-slate-300 mb-1">
                Role Title
              </label>
              <input
                id="app-role"
                type="text"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Staff Android Engineer"
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="app-location" className="block text-xs font-medium text-slate-300 mb-1">
                Location / Policy
              </label>
              <input
                id="app-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mountain View, CA (Hybrid)"
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="app-stage" className="block text-xs font-medium text-slate-300 mb-1">
                Initial Stage
              </label>
              <select
                id="app-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value as ApplicationStage)}
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
              </select>
            </div>

            <div>
              <label htmlFor="app-salary" className="block text-xs font-medium text-slate-300 mb-1">
                Compensation Range
              </label>
              <input
                id="app-salary"
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $220k – $260k"
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="app-next" className="block text-xs font-medium text-slate-300 mb-1">
                Next Step / Reminder
              </label>
              <input
                id="app-next"
                type="text"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                placeholder="e.g. Technical screen on Friday"
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Save Application
            </button>
          </div>
        </form>
      )}

      {/* Stage Filter Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {(['all', 'saved', 'applied', 'interviewing', 'offer', 'archived'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStageFilter(item)}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              stageFilter === item
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item === 'all' ? `All (${applications.length})` : `${STAGE_LABELS[item]} (${metrics.byStage[item]})`}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {visibleApps.map((app) => {
          const nextStage = advanceApplicationStage(app.stage);
          return (
            <div
              key={app.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-100 truncate">
                      {app.role} <span className="font-normal text-slate-400">at</span> {app.company}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      <span>{STAGE_LABELS[app.stage]}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{app.location}</span>
                      <span aria-hidden="true"> · </span>
                      <span className="tabular-nums text-slate-300">{app.salaryRange}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteApplication(app.id)}
                  aria-label={`Delete application for ${app.company}`}
                  className="min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 flex items-center justify-center shrink-0 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="text-slate-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Next: {app.nextStep}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onUpdateStage(app.id, nextStage)}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  Move to {STAGE_LABELS[nextStage]}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
