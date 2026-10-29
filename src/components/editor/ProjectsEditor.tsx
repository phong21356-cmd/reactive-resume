import React, { useState } from 'react';
import { Project } from '../../types/resume';
import { Plus, Trash2, FolderGit2, ExternalLink } from 'lucide-react';

interface ProjectsEditorProps {
  projects: Project[];
  onChange: (updated: Project[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ projects, onChange }) => {
  const handleAdd = () => {
    const newItem: Project = {
      id: `p-${Date.now()}`,
      name: '',
      description: '',
      url: '',
      repository: '',
      keywords: [],
    };
    onChange([newItem, ...projects]);
  };

  const handleUpdate = (id: string, field: keyof Project, value: any) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400">Highlight portfolio projects, open-source work, or research.</p>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-700/80 p-8 text-center text-neutral-500">
          <FolderGit2 className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
          <p className="text-sm font-medium">No projects added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 text-xs text-blue-400 hover:underline font-semibold"
          >
            Add a project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => handleUpdate(proj.id, 'name', e.target.value)}
                  placeholder="Project Title (e.g. Real-Time Chat Engine)"
                  className="flex-1 rounded-lg bg-neutral-950 border border-neutral-700/80 px-3 py-1.5 text-xs font-semibold text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="url"
                  value={proj.url}
                  onChange={(e) => handleUpdate(proj.id, 'url', e.target.value)}
                  placeholder="Live URL (e.g. https://myproject.com)"
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="url"
                  value={proj.repository}
                  onChange={(e) => handleUpdate(proj.id, 'repository', e.target.value)}
                  placeholder="GitHub / Repo URL (e.g. github.com/user/repo)"
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <textarea
                rows={2}
                value={proj.description}
                onChange={(e) => handleUpdate(proj.id, 'description', e.target.value)}
                placeholder="Brief description of the problem solved, tech stack, and results achieved..."
                className="w-full rounded-lg bg-neutral-950 border border-neutral-700/80 p-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />

              <input
                type="text"
                value={proj.keywords?.join(', ') || ''}
                onChange={(e) =>
                  handleUpdate(
                    proj.id,
                    'keywords',
                    e.target.value.split(',').map((k) => k.trim()).filter(Boolean)
                  )
                }
                placeholder="Tech stack tags separated by commas (e.g. React, Node.js, WebSockets, Redis)"
                className="w-full rounded-lg bg-neutral-950 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
