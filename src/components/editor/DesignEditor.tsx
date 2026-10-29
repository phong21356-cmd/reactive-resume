import React from 'react';
import { ResumeDesign, TemplateType, FontFamily, Density } from '../../types/resume';
import { Palette, Type, LayoutGrid, Check } from 'lucide-react';

interface DesignEditorProps {
  design: ResumeDesign;
  onChange: (updated: ResumeDesign) => void;
}

const TEMPLATES: { id: TemplateType; name: string; desc: string }[] = [
  { id: 'modern', name: 'Modern Split', desc: 'Two-column layout with left sidebar for skills and contact info' },
  { id: 'minimalist', name: 'Minimalist', desc: 'Refined Scandinavian layout with clean lines and generous whitespace' },
  { id: 'classic', name: 'Executive Classic', desc: 'Formal centered serif header designed for corporate and legal roles' },
  { id: 'compact', name: 'Technical Compact', desc: 'High density, space-optimized for developers and ATS scanners' },
  { id: 'creative', name: 'Creative Wave', desc: 'Vibrant accent banner with modern badge styling for digital creatives' },
];

const PRESET_COLORS = [
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Ruby Crimson', hex: '#dc2626' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Charcoal Slate', hex: '#334155' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Jet Black', hex: '#171717' },
];

export const DesignEditor: React.FC<DesignEditorProps> = ({ design, onChange }) => {
  const handleUpdate = (field: keyof ResumeDesign, value: any) => {
    onChange({ ...design, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
          <LayoutGrid className="h-3.5 w-3.5 text-blue-500" />
          Resume Layout Template
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {TEMPLATES.map((tmpl) => {
            const isSelected = design.template === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleUpdate('template', tmpl.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                    : 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-neutral-100">{tmpl.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                </div>
                <p className="mt-1 text-[11px] text-neutral-400 leading-snug">{tmpl.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Accent Color */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5 text-blue-500" />
          Theme Color &amp; Accent
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => handleUpdate('primaryColor', c.hex)}
              className="h-7 w-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            >
              {design.primaryColor.toLowerCase() === c.hex.toLowerCase() && (
                <Check className="h-3.5 w-3.5 text-white drop-shadow" />
              )}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-2 border border-neutral-700 rounded-lg px-2 py-1 bg-neutral-900">
            <span className="text-xs text-neutral-400">Hex:</span>
            <input
              type="text"
              value={design.primaryColor}
              onChange={(e) => handleUpdate('primaryColor', e.target.value)}
              className="w-16 bg-transparent text-xs text-neutral-100 font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Typography & Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-blue-500" />
            Font Family
          </label>
          <select
            value={design.fontFamily}
            onChange={(e) => handleUpdate('fontFamily', e.target.value as FontFamily)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
          >
            <option value="inter">Inter (Modern Clean Sans)</option>
            <option value="serif">Merriweather (Classic Serif)</option>
            <option value="mono">Fira Code (Technical Monospace)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
            Text Size Scale
          </label>
          <select
            value={design.fontSize}
            onChange={(e) => handleUpdate('fontSize', e.target.value as Density)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
          >
            <option value="compact">Compact (Fit more content)</option>
            <option value="normal">Normal (Standard balanced)</option>
            <option value="relaxed">Relaxed (Spacious)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
            Section Spacing
          </label>
          <select
            value={design.pageSpacing}
            onChange={(e) => handleUpdate('pageSpacing', e.target.value as Density)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
          >
            <option value="compact">Compact (1-page fit)</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>
      </div>

      {/* Photo Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
        <div>
          <div className="text-xs font-semibold text-neutral-100">Display Profile Avatar / Photo</div>
          <div className="text-[11px] text-neutral-400">
            Show profile picture if supported by chosen layout (Modern &amp; Creative)
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={design.showPhoto}
            onChange={(e) => handleUpdate('showPhoto', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};
