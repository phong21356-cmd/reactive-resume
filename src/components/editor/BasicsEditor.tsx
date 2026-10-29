import React from 'react';
import { Basics } from '../../types/resume';
import { User, Briefcase, Mail, Phone, MapPin, Globe, Image, FileText } from 'lucide-react';

interface BasicsEditorProps {
  basics: Basics;
  onChange: (updated: Basics) => void;
}

export const BasicsEditor: React.FC<BasicsEditorProps> = ({ basics, onChange }) => {
  const handleChange = (field: keyof Basics, value: string) => {
    onChange({ ...basics, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-blue-500" />
            Full Name
          </label>
          <input
            type="text"
            value={basics.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Alexander Morgan"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-blue-500" />
            Headline / Job Title
          </label>
          <input
            type="text"
            value={basics.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-blue-500" />
            Email Address
          </label>
          <input
            type="email"
            value={basics.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g. alex@example.com"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-blue-500" />
            Phone Number
          </label>
          <input
            type="tel"
            value={basics.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="e.g. +1 (555) 234-5678"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-500" />
            Location
          </label>
          <input
            type="text"
            value={basics.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. San Francisco, CA (Remote)"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-blue-500" />
            Website / Portfolio / LinkedIn
          </label>
          <input
            type="url"
            value={basics.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="e.g. https://alexmorgan.dev"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
          <Image className="h-3.5 w-3.5 text-blue-500" />
          Photo URL (Optional)
        </label>
        <input
          type="url"
          value={basics.photoUrl}
          onChange={(e) => handleChange('photoUrl', e.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-500" />
          Professional Summary
        </label>
        <textarea
          rows={4}
          value={basics.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Write a compelling 2-4 sentence summary highlighting your top achievements, skills, and industry impact..."
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
};
