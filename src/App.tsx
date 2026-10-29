import React, { useState, useEffect, useRef } from 'react';
import {
  Resume,
  CoverLetter,
  JobApplication,
  ApplicationStage,
  CareerStory,
  JobOffer,
} from './types/resume';
import {
  initialResumes,
  sampleSoftwareEngineer,
  sampleCoverLetter,
  initialApplications,
  initialCareerStories,
  initialOffers,
} from './data/initialData';
import { injectSkillKeyword } from './utils/atsEngine';
import { useOnlineStatus } from './hooks/usePWAInstall';
import { ResumeRenderer } from './components/templates/ResumeRenderer';
import { CoverLetterRenderer } from './components/templates/CoverLetterRenderer';
import { BasicsEditor } from './components/editor/BasicsEditor';
import { ExperienceEditor } from './components/editor/ExperienceEditor';
import { EducationEditor } from './components/editor/EducationEditor';
import { SkillsEditor } from './components/editor/SkillsEditor';
import { ProjectsEditor } from './components/editor/ProjectsEditor';
import { DesignEditor } from './components/editor/DesignEditor';
import { CoverLetterEditor } from './components/editor/CoverLetterEditor';
import { AtsChecker } from './components/ats/AtsChecker';
import { DocumentsScreen } from './components/mobile/DocumentsScreen';
import { ApplicationsScreen } from './components/mobile/ApplicationsScreen';
import { CareerScreen } from './components/mobile/CareerScreen';
import { AndroidStudioPanel } from './components/mobile/AndroidStudioPanel';

import {
  FileText,
  Briefcase,
  Compass,
  Smartphone,
  Download,
  Upload,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Eye,
  Edit3,
  Palette,
  Mail,
  ShieldCheck,
  FolderOpen,
  WifiOff,
} from 'lucide-react';

type AppTab = 'documents' | 'editor' | 'applications' | 'career' | 'android';
type EditorSubTab = 'write' | 'design' | 'check' | 'letter';
type ResumeSectionTab = 'basics' | 'experience' | 'education' | 'skills' | 'projects';

export default function App() {
  const isOnline = useOnlineStatus();

  const [resumes, setResumes] = useState<Resume[]>(() => {
    try {
      const saved = localStorage.getItem('rxresume_android_resumes_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialResumes;
  });

  const [activeResumeId, setActiveResumeId] = useState<string>(() => {
    try {
      return localStorage.getItem('rxresume_android_active_id_v2') || initialResumes[0].id;
    } catch {
      return initialResumes[0].id;
    }
  });

  const [coverLetter, setCoverLetter] = useState<CoverLetter>(() => {
    try {
      const saved = localStorage.getItem('rxresume_android_letter_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return sampleCoverLetter;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem('rxresume_android_apps_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialApplications;
  });

  const [stories, setStories] = useState<CareerStory[]>(() => {
    try {
      const saved = localStorage.getItem('rxresume_android_stories_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialCareerStories;
  });

  const [offers, setOffers] = useState<JobOffer[]>(() => {
    try {
      const saved = localStorage.getItem('rxresume_android_offers_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialOffers;
  });

  // Navigation States
  const [activeTab, setActiveTab] = useState<AppTab>('editor');
  const [editorSubTab, setEditorSubTab] = useState<EditorSubTab>('write');
  const [resumeSection, setResumeSection] = useState<ResumeSectionTab>('basics');
  const [previewScale, setPreviewScale] = useState<number>(0.8);
  const [mobileView, setMobileView] = useState<'workspace' | 'preview'>('workspace');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeResume =
    resumes.find((r) => r.id === activeResumeId) || resumes[0] || sampleSoftwareEngineer;

  const updateActiveResume = (updater: (current: Resume) => Resume) => {
    setResumes((prev) =>
      prev.map((item) =>
        item.id === activeResume.id
          ? { ...updater(item), updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rxresume_android_resumes_v2', JSON.stringify(resumes));
      localStorage.setItem('rxresume_android_active_id_v2', activeResume.id);
      localStorage.setItem('rxresume_android_letter_v2', JSON.stringify(coverLetter));
      localStorage.setItem('rxresume_android_apps_v2', JSON.stringify(applications));
      localStorage.setItem('rxresume_android_stories_v2', JSON.stringify(stories));
      localStorage.setItem('rxresume_android_offers_v2', JSON.stringify(offers));
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  }, [resumes, activeResume.id, coverLetter, applications, stories, offers]);

  const handleCreateResume = (title: string, headline: string) => {
    const newId = `resume-${Date.now()}`;
    const created: Resume = {
      ...sampleSoftwareEngineer,
      id: newId,
      title,
      updatedAt: new Date().toISOString(),
      basics: {
        ...sampleSoftwareEngineer.basics,
        headline,
      },
    };
    setResumes((prev) => [created, ...prev]);
    setActiveResumeId(newId);
    setActiveTab('editor');
    setEditorSubTab('write');
  };

  const handleDuplicateResume = (id: string) => {
    const source = resumes.find((r) => r.id === id);
    if (!source) return;
    const copy: Resume = {
      ...JSON.parse(JSON.stringify(source)),
      id: `resume-${Date.now()}`,
      title: `${source.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setResumes((prev) => [copy, ...prev]);
    setActiveResumeId(copy.id);
  };

  const handleDeleteResume = (id: string) => {
    if (resumes.length <= 1) return;
    const remaining = resumes.filter((r) => r.id !== id);
    setResumes(remaining);
    if (activeResumeId === id && remaining[0]) {
      setActiveResumeId(remaining[0].id);
    }
  };

  const handleAddApplication = (app: Omit<JobApplication, 'id'>) => {
    setApplications((prev) => [{ ...app, id: `app-${Date.now()}` }, ...prev]);
  };

  const handleUpdateApplicationStage = (id: string, nextStage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, stage: nextStage } : app))
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const handleAddStory = (story: Omit<CareerStory, 'id'>) => {
    setStories((prev) => [{ ...story, id: `story-${Date.now()}` }, ...prev]);
  };

  const handleAddOffer = (offer: Omit<JobOffer, 'id'>) => {
    setOffers((prev) => [{ ...offer, id: `offer-${Date.now()}` }, ...prev]);
  };

  const handleApplyAtsKeyword = (keyword: string) => {
    updateActiveResume((curr) => injectSkillKeyword(curr, keyword));
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportJson = () => {
    const payload = {
      version: '6.0.0-android',
      exportedAt: new Date().toISOString(),
      resume: activeResume,
      coverLetter,
      applications,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${
      activeResume.basics.name.toLowerCase().replace(/\s+/g, '-') || 'resume'
    }-reactive-resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.resume && parsed.resume.basics) {
          const imported: Resume = {
            ...parsed.resume,
            id: parsed.resume.id || `resume-${Date.now()}`,
          };
          setResumes((prev) => [imported, ...prev.filter((r) => r.id !== imported.id)]);
          setActiveResumeId(imported.id);
          if (parsed.coverLetter) setCoverLetter(parsed.coverLetter);
        } else if (parsed.basics) {
          const imported: Resume = {
            ...parsed,
            id: parsed.id || `resume-${Date.now()}`,
          };
          setResumes((prev) => [imported, ...prev.filter((r) => r.id !== imported.id)]);
          setActiveResumeId(imported.id);
        }
      } catch (err) {
        console.error('Failed to import JSON', err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetDemo = () => {
    setResumes(initialResumes);
    setActiveResumeId(initialResumes[0].id);
    setCoverLetter(sampleCoverLetter);
    setApplications(initialApplications);
    setStories(initialCareerStories);
    setOffers(initialOffers);
  };

  const NAV_ITEMS: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'editor', label: 'Builder', icon: FileText },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'career', label: 'Career', icon: Compass },
    { id: 'android', label: 'Android APK', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJson}
        accept=".json"
        className="hidden"
      />

      {/* Desktop Top Bar (Strict 3-Zone Contract: Brand Wordmark — 5 Nav Links — 1 Primary Action) */}
      <header className="no-print hidden md:flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('documents');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
        >
          Reactive Resume
        </a>

        <nav
          aria-label="Primary Navigation"
          className="flex items-center gap-6 text-sm font-medium text-slate-400"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === item.id
                  ? 'text-white border-blue-500'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handlePrintPdf}
            className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
          >
            Download PDF
          </button>
        </div>
      </header>

      {/* Mobile Compact Top App Bar (48px height -> respects 15% sticky cap with 64px bottom bar) */}
      <div
        role="banner"
        className="no-print md:hidden h-12 px-4 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-2"
      >
        <span className="text-base font-bold tracking-tight text-white truncate font-display">
          Reactive Resume
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() =>
              setMobileView((v) => (v === 'workspace' ? 'preview' : 'workspace'))
            }
            className="min-h-[38px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 whitespace-nowrap"
          >
            {mobileView === 'workspace' ? (
              <>
                <Eye className="h-3.5 w-3.5 text-blue-400" />
                Page Preview
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5 text-blue-400" />
                Back to Editor
              </>
            )}
          </button>
        </div>
      </div>

      {/* Offline Banner (only shown if browser is offline) */}
      {!isOnline && (
        <div className="no-print bg-amber-950/80 border-b border-amber-800/60 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-center gap-2">
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline Mode · Changes are saved on this device and ready for export.</span>
        </div>
      )}

      {/* Main Responsive Split Container */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden pb-16 md:pb-0">
        {/* Left / Primary Column: Interactive Android & Web Workspace */}
        <section
          aria-label="Application Workspace"
          className={`no-print w-full lg:w-[50%] xl:w-[48%] border-r border-slate-800/80 flex flex-col bg-slate-950 overflow-y-auto ${
            mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Secondary Workspace Toolbar (Desktop Action Bar + Active Document Switcher) */}
          <div
            className={`border-b border-slate-800/80 bg-slate-900/40 px-4 py-2.5 flex-wrap items-center justify-between gap-2 ${
              activeTab === 'editor' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-slate-400 whitespace-nowrap">Active:</span>
              <select
                aria-label="Select active resume"
                value={activeResume.id}
                onChange={(e) => setActiveResumeId(e.target.value)}
                className="min-h-[36px] rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-100 truncate max-w-[220px] focus:outline-none focus:border-blue-500"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPhoneFrame((prev) => !prev)}
                className={`hidden lg:flex min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium items-center gap-1.5 border transition-colors whitespace-nowrap ${
                  isPhoneFrame
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Pixel 9 Frame
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <Upload className="h-3.5 w-3.5" />
                Import
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                JSON
              </button>

              <button
                type="button"
                onClick={handleResetDemo}
                title="Reset sample data"
                aria-label="Reset sample data"
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Optional Pixel 9 Pro Device Frame Wrapper on Desktop */}
          <div
            className={
              isPhoneFrame
                ? 'my-6 mx-auto w-[396px] max-w-full rounded-[42px] border-[6px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col'
                : 'flex-1 flex flex-col'
            }
          >
            {/* Simulated Android Status Bar when Phone Frame is active */}
            {isPhoneFrame && (
              <div className="bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-900">
                <span>9:41</span>
                <div className="h-3 w-3 rounded-full bg-slate-800" />
                <span>5G · 100%</span>
              </div>
            )}

            {/* Builder Mode Sub-Navigation when inside 'editor' tab */}
            {activeTab === 'editor' && (
              <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 flex flex-col gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
                  {(
                    [
                      { id: 'write', label: 'Write', icon: Edit3 },
                      { id: 'design', label: 'Design', icon: Palette },
                      { id: 'check', label: 'ATS Check', icon: ShieldCheck },
                      { id: 'letter', label: 'Cover Letter', icon: Mail },
                    ] as const
                  ).map((pane) => {
                    const Icon = pane.icon;
                    return (
                      <button
                        key={pane.id}
                        type="button"
                        onClick={() => setEditorSubTab(pane.id)}
                        className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                          editorSubTab === pane.id
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {pane.label}
                      </button>
                    );
                  })}
                </div>

                {editorSubTab === 'write' && (
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                    {(
                      [
                        { id: 'basics', label: 'Basics', icon: User },
                        { id: 'experience', label: `Experience (${activeResume.work.length})`, icon: Briefcase },
                        { id: 'education', label: 'Education', icon: GraduationCap },
                        { id: 'skills', label: 'Skills', icon: Code2 },
                        { id: 'projects', label: 'Projects', icon: FolderGit2 },
                      ] as const
                    ).map((sec) => {
                      const SecIcon = sec.icon;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setResumeSection(sec.id)}
                          className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                            resumeSection === sec.id
                              ? 'bg-slate-800 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <SecIcon className="h-3.5 w-3.5 text-blue-400" />
                          {sec.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Screen Body */}
            <div className="p-4 sm:p-5 flex-1">
              {activeTab === 'documents' && (
                <DocumentsScreen
                  resumes={resumes}
                  activeResumeId={activeResume.id}
                  coverLetter={coverLetter}
                  onSelectResume={setActiveResumeId}
                  onOpenEditor={(mode) => {
                    setActiveTab('editor');
                    setEditorSubTab(mode === 'coverLetter' ? 'letter' : 'write');
                  }}
                  onCreateResume={handleCreateResume}
                  onDuplicateResume={handleDuplicateResume}
                  onDeleteResume={handleDeleteResume}
                />
              )}

              {activeTab === 'editor' && (
                <>
                  {editorSubTab === 'write' && (
                    <>
                      {resumeSection === 'basics' && (
                        <BasicsEditor
                          basics={activeResume.basics}
                          onChange={(basics) =>
                            updateActiveResume((curr) => ({ ...curr, basics }))
                          }
                        />
                      )}
                      {resumeSection === 'experience' && (
                        <ExperienceEditor
                          work={activeResume.work}
                          onChange={(work) =>
                            updateActiveResume((curr) => ({ ...curr, work }))
                          }
                        />
                      )}
                      {resumeSection === 'education' && (
                        <EducationEditor
                          education={activeResume.education}
                          onChange={(education) =>
                            updateActiveResume((curr) => ({ ...curr, education }))
                          }
                        />
                      )}
                      {resumeSection === 'skills' && (
                        <SkillsEditor
                          skills={activeResume.skills}
                          onChange={(skills) =>
                            updateActiveResume((curr) => ({ ...curr, skills }))
                          }
                        />
                      )}
                      {resumeSection === 'projects' && (
                        <ProjectsEditor
                          projects={activeResume.projects}
                          onChange={(projects) =>
                            updateActiveResume((curr) => ({ ...curr, projects }))
                          }
                        />
                      )}
                    </>
                  )}

                  {editorSubTab === 'design' && (
                    <DesignEditor
                      design={activeResume.design}
                      onChange={(design) =>
                        updateActiveResume((curr) => ({ ...curr, design }))
                      }
                    />
                  )}

                  {editorSubTab === 'check' && (
                    <AtsChecker
                      resume={activeResume}
                      onApplyKeyword={handleApplyAtsKeyword}
                    />
                  )}

                  {editorSubTab === 'letter' && (
                    <CoverLetterEditor
                      coverLetter={coverLetter}
                      senderBasics={activeResume.basics}
                      onChange={setCoverLetter}
                    />
                  )}
                </>
              )}

              {activeTab === 'applications' && (
                <ApplicationsScreen
                  applications={applications}
                  resumes={resumes}
                  onAddApplication={handleAddApplication}
                  onUpdateStage={handleUpdateApplicationStage}
                  onDeleteApplication={handleDeleteApplication}
                />
              )}

              {activeTab === 'career' && (
                <CareerScreen
                  stories={stories}
                  offers={offers}
                  onAddStory={handleAddStory}
                  onAddOffer={handleAddOffer}
                />
              )}

              {activeTab === 'android' && (
                <AndroidStudioPanel
                  isPhonePreview={isPhoneFrame}
                  onTogglePhonePreview={() => setIsPhoneFrame((prev) => !prev)}
                />
              )}
            </div>

            {/* Simulated Android Bottom Bar inside Phone Frame on Desktop */}
            {isPhoneFrame && (
              <div className="border-t border-slate-800 bg-slate-900/95 grid grid-cols-5 h-16 items-center px-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors ${
                        active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium tracking-tight mt-1">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right / Secondary Column: Live Document Preview (A4 Sheet) */}
        <section
          aria-label="Live Document Preview"
          className={`flex-1 bg-slate-900/50 flex flex-col overflow-hidden ${
            mobileView === 'workspace' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="no-print border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-slate-200">
                {activeTab === 'editor' && editorSubTab === 'letter'
                  ? 'Cover Letter Preview (A4)'
                  : `${activeResume.title} (A4)`}
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize text-slate-300">
                {activeResume.design.template} template
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setPreviewScale((s) => Math.max(0.45, Number((s - 0.1).toFixed(2))))
                }
                aria-label="Zoom out preview"
                className="min-h-[36px] min-w-[36px] rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="font-mono tabular-nums text-slate-300 text-xs w-12 text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() =>
                  setPreviewScale((s) => Math.min(1.2, Number((s + 0.1).toFixed(2))))
                }
                aria-label="Zoom in preview"
                className="min-h-[36px] min-w-[36px] rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewScale(0.8)}
                aria-label="Reset preview zoom"
                className="min-h-[36px] min-w-[36px] rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
            {activeTab === 'editor' && editorSubTab === 'letter' ? (
              <CoverLetterRenderer
                coverLetter={coverLetter}
                senderBasics={activeResume.basics}
                design={activeResume.design}
                scale={previewScale}
              />
            ) : (
              <ResumeRenderer resume={activeResume} scale={previewScale} />
            )}
          </div>
        </section>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1: 5 evenly distributed destinations, 64px height) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center px-1"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileView('workspace');
              }}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors ${
                active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
