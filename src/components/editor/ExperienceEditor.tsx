import React, { useState } from 'react';
import { WorkExperience } from '../../types/resume';
import { Plus, Trash2, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';

interface ExperienceEditorProps {
  work: WorkExperience[];
  onChange: (updated: WorkExperience[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ work, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(work[0]?.id || null);

  const handleAdd = () => {
    const newItem: WorkExperience = {
      id: `w-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      summary: '',
      highlights: [''],
    };
    onChange([newItem, ...work]);
    setExpandedId(newItem.id);
  };

  const handleUpdate = (id: string, field: keyof WorkExperience, value: any) => {
    onChange(work.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDelete = (id: string) => {
    onChange(work.filter((item) => item.id !== id));
  };

  const handleHighlightChange = (id: string, index: number, value: string) => {
    const item = work.find((w) => w.id === id);
    if (!item) return;
    const newHighlights = [...item.highlights];
    newHighlights[index] = value;
    handleUpdate(id, 'highlights', newHighlights);
  };

  const handleAddHighlight = (id: string) => {
    const item = work.find((w) => w.id === id);
    if (!item) return;
    handleUpdate(id, 'highlights', [...item.highlights, '']);
  };

  const handleRemoveHighlight = (id: string, index: number) => {
    const item = work.find((w) => w.id === id);
    if (!item) return;
    const newHighlights = item.highlights.filter((_, idx) => idx !== index);
    handleUpdate(id, 'highlights', newHighlights);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          List your relevant employment history starting with your most recent role.
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Role
        </button>
      </div>

      {work.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-700/80 p-8 text-center text-neutral-500">
          <Briefcase className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
          <p className="text-sm font-medium">No work experience entries yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 text-xs text-blue-400 hover:underline font-semibold"
          >
            Click here to add your first position
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {work.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden transition-all"
              >
                {/* Header item bar */}
                <div
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-neutral-800/40"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-neutral-800 flex items-center justify-center text-blue-400">
                      <Briefcase className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-100">
                        {item.position || 'Untitled Position'}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {item.company || 'Company name'} {item.startDate ? `• ${item.startDate}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Delete experience"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-neutral-400" />
                    )}
                  </div>
                </div>

                {/* Form fields when expanded */}
                {isExpanded && (
                  <div className="p-4 border-t border-neutral-800/80 space-y-3.5 bg-neutral-950/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Job Title / Position
                        </label>
                        <input
                          type="text"
                          value={item.position}
                          onChange={(e) => handleUpdate(item.id, 'position', e.target.value)}
                          placeholder="e.g. Senior Frontend Engineer"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => handleUpdate(item.id, 'company', e.target.value)}
                          placeholder="e.g. Acme Corp"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                          placeholder="e.g. New York, NY (Remote)"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                            Timeframe
                          </label>
                          <label className="text-[11px] text-neutral-300 flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.current}
                              onChange={(e) => handleUpdate(item.id, 'current', e.target.checked)}
                              className="rounded text-blue-600"
                            />
                            Current role
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item.startDate}
                            onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                            placeholder="Start (e.g. 2021-06)"
                            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-2.5 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                          />
                          {!item.current ? (
                            <input
                              type="text"
                              value={item.endDate}
                              onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                              placeholder="End (e.g. 2023-10)"
                              className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-2.5 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                            />
                          ) : (
                            <div className="rounded-lg bg-neutral-800 border border-neutral-700/40 px-2.5 py-1.5 text-xs text-neutral-400 flex items-center">
                              Present
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        High-Level Role Overview
                      </label>
                      <input
                        type="text"
                        value={item.summary}
                        onChange={(e) => handleUpdate(item.id, 'summary', e.target.value)}
                        placeholder="Brief 1-sentence synopsis of team scope or mandate..."
                        className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Bullet Highlights */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                          Key Achievements &amp; Impact (Bullet Points)
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddHighlight(item.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                        >
                          <Plus className="h-3 w-3" /> Add bullet
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {item.highlights.map((bullet, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-neutral-500 text-xs">•</span>
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handleHighlightChange(item.id, idx, e.target.value)}
                              placeholder="Action verb + quantified impact (e.g. Accelerated checkout by 40%...)"
                              className="flex-1 rounded-lg bg-neutral-900 border border-neutral-700/80 px-2.5 py-1 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                            />
                            {item.highlights.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveHighlight(item.id, idx)}
                                className="text-neutral-500 hover:text-red-400 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
