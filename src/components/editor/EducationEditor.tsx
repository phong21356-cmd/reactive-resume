import React, { useState } from 'react';
import { Education } from '../../types/resume';
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationEditorProps {
  education: Education[];
  onChange: (updated: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ education, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

  const handleAdd = () => {
    const newItem: Education = {
      id: `e-${Date.now()}`,
      institution: '',
      studyType: '',
      area: '',
      startDate: '',
      endDate: '',
      score: '',
    };
    onChange([newItem, ...education]);
    setExpandedId(newItem.id);
  };

  const handleUpdate = (id: string, field: keyof Education, value: string) => {
    onChange(education.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDelete = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400">Add degrees, diplomas, or educational credentials.</p>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-700/80 p-8 text-center text-neutral-500">
          <GraduationCap className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
          <p className="text-sm font-medium">No education entries yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 text-xs text-blue-400 hover:underline font-semibold"
          >
            Add education background
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden transition-all"
              >
                <div
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-neutral-800/40"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-neutral-800 flex items-center justify-center text-blue-400">
                      <GraduationCap className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-100">
                        {item.institution || 'University or College'}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {item.studyType ? `${item.studyType} in ` : ''}
                        {item.area || 'Degree field'}
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

                {isExpanded && (
                  <div className="p-4 border-t border-neutral-800/80 space-y-3 bg-neutral-950/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Institution / School
                        </label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => handleUpdate(item.id, 'institution', e.target.value)}
                          placeholder="e.g. Stanford University"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Degree / Credential
                        </label>
                        <input
                          type="text"
                          value={item.studyType}
                          onChange={(e) => handleUpdate(item.id, 'studyType', e.target.value)}
                          placeholder="e.g. Bachelor of Science"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Field of Study / Major
                        </label>
                        <input
                          type="text"
                          value={item.area}
                          onChange={(e) => handleUpdate(item.id, 'area', e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          GPA / Honors (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.score}
                          onChange={(e) => handleUpdate(item.id, 'score', e.target.value)}
                          placeholder="e.g. 3.9 GPA, Magna Cum Laude"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={item.startDate}
                          onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                          placeholder="e.g. 2016-09"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Graduation / End Date
                        </label>
                        <input
                          type="text"
                          value={item.endDate}
                          onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                          placeholder="e.g. 2020-05"
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
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
