import React from 'react';
import { CoverLetter, Basics } from '../../types/resume';
import { Mail, Calendar, Building, User, FileText } from 'lucide-react';

interface CoverLetterEditorProps {
  coverLetter: CoverLetter;
  senderBasics: Basics;
  onChange: (updated: CoverLetter) => void;
}

export const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({
  coverLetter,
  senderBasics,
  onChange,
}) => {
  const handleUpdate = (field: keyof CoverLetter, value: string) => {
    onChange({ ...coverLetter, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Sender Banner Info */}
      <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/50 flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-blue-300">Sender details</span> synced from resume basics:
          <span className="text-neutral-300 ml-1.5 font-medium">
            {senderBasics.name} ({senderBasics.email || 'No email'})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-blue-500" />
            Company / Organization
          </label>
          <input
            type="text"
            value={coverLetter.companyName}
            onChange={(e) => handleUpdate('companyName', e.target.value)}
            placeholder="e.g. Stripe, Inc."
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-blue-500" />
            Hiring Manager / Recruiter Name
          </label>
          <input
            type="text"
            value={coverLetter.recipientName}
            onChange={(e) => handleUpdate('recipientName', e.target.value)}
            placeholder="e.g. Sarah Jenkins"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
            Recipient Job Title
          </label>
          <input
            type="text"
            value={coverLetter.recipientTitle}
            onChange={(e) => handleUpdate('recipientTitle', e.target.value)}
            placeholder="e.g. VP of Engineering"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            Letter Date
          </label>
          <input
            type="text"
            value={coverLetter.date}
            onChange={(e) => handleUpdate('date', e.target.value)}
            placeholder="e.g. October 28, 2026"
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
          Company Address / Headquarters
        </label>
        <input
          type="text"
          value={coverLetter.companyAddress}
          onChange={(e) => handleUpdate('companyAddress', e.target.value)}
          placeholder="e.g. 510 Townsend St, San Francisco, CA 94103"
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
          Subject Line
        </label>
        <input
          type="text"
          value={coverLetter.subject}
          onChange={(e) => handleUpdate('subject', e.target.value)}
          placeholder="e.g. Application for Senior Staff Software Engineer"
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
          Salutation
        </label>
        <input
          type="text"
          value={coverLetter.salutation}
          onChange={(e) => handleUpdate('salutation', e.target.value)}
          placeholder="e.g. Dear Ms. Jenkins and the Hiring Team,"
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-500" />
          Letter Content (Separate paragraphs with blank lines)
        </label>
        <textarea
          rows={10}
          value={coverLetter.body}
          onChange={(e) => handleUpdate('body', e.target.value)}
          placeholder="Write your cover letter body paragraphs here..."
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
          Sign-Off
        </label>
        <input
          type="text"
          value={coverLetter.signOff}
          onChange={(e) => handleUpdate('signOff', e.target.value)}
          placeholder="e.g. Sincerely,"
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700/80 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};
