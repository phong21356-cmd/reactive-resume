import React, { useState } from 'react';
import { Resume, CoverLetter } from '../../types/resume';
import {
  FileText,
  Mail,
  Plus,
  Copy,
  Trash2,
  Search,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';

interface DocumentsScreenProps {
  resumes: Resume[];
  activeResumeId: string;
  coverLetter: CoverLetter;
  onSelectResume: (id: string) => void;
  onOpenEditor: (mode: 'resume' | 'coverLetter') => void;
  onCreateResume: (title: string, headline: string) => void;
  onDuplicateResume: (id: string) => void;
  onDeleteResume: (id: string) => void;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  resumes,
  activeResumeId,
  coverLetter,
  onSelectResume,
  onOpenEditor,
  onCreateResume,
  onDuplicateResume,
  onDeleteResume,
}) => {
  const [filter, setFilter] = useState<'all' | 'resume' | 'letter'>('all');
  const [query, setQuery] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHeadline, setNewHeadline] = useState('');
  const [formError, setFormError] = useState('');

  const filteredResumes = resumes.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.basics.headline.toLowerCase().includes(query.toLowerCase()) ||
      r.basics.name.toLowerCase().includes(query.toLowerCase())
  );

  const showLetter =
    (filter === 'all' || filter === 'letter') &&
    (coverLetter.title.toLowerCase().includes(query.toLowerCase()) ||
      coverLetter.companyName.toLowerCase().includes(query.toLowerCase()));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Please enter a resume title.');
      return;
    }
    onCreateResume(newTitle.trim(), newHeadline.trim() || 'Software Engineer');
    setNewTitle('');
    setNewHeadline('');
    setFormError('');
    setShowNewForm(false);
  };

  return (
    <div className="space-y-5">
      {/* Header & Primary Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Documents Library</h2>
          <p className="text-xs text-slate-400">
            {resumes.length} resumes <span aria-hidden="true">·</span> 1 cover letter{' '}
            <span aria-hidden="true">·</span> Saved on device
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewForm((prev) => !prev)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Resume
        </button>
      </div>

      {/* New Resume Inline Sheet / Drawer */}
      {showNewForm && (
        <form
          onSubmit={handleCreateSubmit}
          className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">Create New Resume</h3>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setFormError('');
              }}
              className="min-h-[40px] px-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="new-resume-title" className="block text-xs font-medium text-slate-300 mb-1">
                Resume Title
              </label>
              <input
                id="new-resume-title"
                type="text"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="e.g. Android Lead 2026"
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="new-resume-headline" className="block text-xs font-medium text-slate-300 mb-1">
                Target Role Headline
              </label>
              <input
                id="new-resume-headline"
                type="text"
                value={newHeadline}
                onChange={(e) => setNewHeadline(e.target.value)}
                placeholder="e.g. Senior Android Engineer"
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {formError && <p className="text-xs text-rose-400">{formError}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Create &amp; Open Resume
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documents"
            placeholder="Search resumes or cover letters..."
            className="w-full min-h-[44px] rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
          {(['all', 'resume', 'letter'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filter === tab
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'resume' ? 'Resumes' : 'Letters'}
            </button>
          ))}
        </div>
      </div>

      {/* Document Tap List Rows */}
      <div className="space-y-2.5">
        {(filter === 'all' || filter === 'resume') &&
          filteredResumes.map((item) => {
            const isActive = item.id === activeResumeId;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  isActive
                    ? 'bg-slate-900 border-blue-500/60'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectResume(item.id);
                      onOpenEditor('resume');
                    }}
                    className="flex-1 min-h-[48px] flex items-center gap-3.5 text-left"
                  >
                    <div className="h-10 w-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-100 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {item.basics.headline} <span aria-hidden="true">·</span>{' '}
                        <span className="capitalize">{item.design.template}</span> layout{' '}
                        <span aria-hidden="true">·</span>{' '}
                        <span className="tabular-nums">{item.work.length}</span> roles
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                  </button>

                  <div className="flex items-center gap-1 shrink-0 border-l border-slate-800 pl-2">
                    <button
                      type="button"
                      onClick={() => onDuplicateResume(item.id)}
                      aria-label={`Duplicate ${item.title}`}
                      title="Duplicate resume"
                      className="min-h-[44px] min-w-[44px] rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 flex items-center justify-center transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {resumes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteResume(item.id)}
                        aria-label={`Delete ${item.title}`}
                        title="Delete resume"
                        className="min-h-[44px] min-w-[44px] rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {showLetter && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4 transition-colors">
            <button
              type="button"
              onClick={() => onOpenEditor('coverLetter')}
              className="w-full min-h-[48px] flex items-center gap-3.5 text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-600/15 text-emerald-400 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-100 truncate">
                  {coverLetter.title}
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  Cover Letter <span aria-hidden="true">·</span> {coverLetter.companyName}{' '}
                  <span aria-hidden="true">·</span> {coverLetter.recipientName}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
            </button>
          </div>
        )}

        {filteredResumes.length === 0 && !showLetter && (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center">
            <FolderOpen className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No matching documents found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search filter or create a new resume.</p>
          </div>
        )}
      </div>
    </div>
  );
};
