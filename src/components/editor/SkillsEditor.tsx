import React, { useState } from 'react';
import { SkillItem } from '../../types/resume';
import { Plus, Trash2, X, Code2 } from 'lucide-react';

interface SkillsEditorProps {
  skills: SkillItem[];
  onChange: (updated: SkillItem[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onChange }) => {
  const [newKeywordInput, setNewKeywordInput] = useState<{ [skillId: string]: string }>({});

  const handleAddSkill = () => {
    const newSkill: SkillItem = {
      id: `s-${Date.now()}`,
      name: '',
      level: 4,
      keywords: [],
    };
    onChange([...skills, newSkill]);
  };

  const handleUpdate = (id: string, field: keyof SkillItem, value: any) => {
    onChange(skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleDelete = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const handleAddKeyword = (skillId: string) => {
    const input = (newKeywordInput[skillId] || '').trim();
    if (!input) return;

    // Support comma separated
    const splitKeywords = input.split(',').map((k) => k.trim()).filter(Boolean);
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return;

    handleUpdate(skillId, 'keywords', [...skill.keywords, ...splitKeywords]);
    setNewKeywordInput({ ...newKeywordInput, [skillId]: '' });
  };

  const handleRemoveKeyword = (skillId: string, kwIndex: number) => {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return;
    handleUpdate(
      skillId,
      'keywords',
      skill.keywords.filter((_, idx) => idx !== kwIndex)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          Group skills into categories (e.g. Frontend, Cloud, Languages) and add tags.
        </p>
        <button
          type="button"
          onClick={handleAddSkill}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-700/80 p-8 text-center text-neutral-500">
          <Code2 className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
          <p className="text-sm font-medium">No skill categories added.</p>
          <button
            type="button"
            onClick={handleAddSkill}
            className="mt-3 text-xs text-blue-400 hover:underline font-semibold"
          >
            Add your first skill group
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleUpdate(skill.id, 'name', e.target.value)}
                  placeholder="Category Name (e.g. Languages &amp; Frameworks)"
                  className="flex-1 rounded-lg bg-neutral-950 border border-neutral-700/80 px-3 py-1.5 text-xs font-semibold text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-medium">Rating:</span>
                  <select
                    value={skill.level}
                    onChange={(e) => handleUpdate(skill.id, 'level', Number(e.target.value))}
                    className="rounded bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 px-2 py-1"
                  >
                    <option value={1}>1 - Beginner</option>
                    <option value={2}>2 - Elementary</option>
                    <option value={3}>3 - Intermediate</option>
                    <option value={4}>4 - Advanced</option>
                    <option value={5}>5 - Expert</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Keywords tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {skill.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-200 border border-neutral-700"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(skill.id, idx)}
                      className="text-neutral-400 hover:text-neutral-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add tag input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeywordInput[skill.id] || ''}
                  onChange={(e) => setNewKeywordInput({ ...newKeywordInput, [skill.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword(skill.id);
                    }
                  }}
                  placeholder="Type skills separated by comma (e.g. React, Next.js, TypeScript) and press Enter"
                  className="flex-1 rounded-lg bg-neutral-950 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddKeyword(skill.id)}
                  className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1 text-xs font-medium border border-neutral-700"
                >
                  Add Tags
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
