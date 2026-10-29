import React from 'react';
import { CoverLetter, Basics, ResumeDesign } from '../../types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface CoverLetterRendererProps {
  coverLetter: CoverLetter;
  senderBasics: Basics;
  design: ResumeDesign;
  scale?: number;
}

export const CoverLetterRenderer: React.FC<CoverLetterRendererProps> = ({
  coverLetter,
  senderBasics,
  design,
  scale = 1,
}) => {
  const fontClass =
    design.fontFamily === 'serif'
      ? 'font-[Merriweather,serif]'
      : design.fontFamily === 'mono'
      ? 'font-[JetBrains_Mono,monospace]'
      : 'font-[DM_Sans,sans-serif]';

  return (
    <div
      id="coverletter-printable-area"
      className="printable-page bg-white text-neutral-800 shadow-2xl transition-transform duration-150"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
      }}
    >
      <div className={`p-12 md:p-16 ${fontClass} text-[13px] leading-relaxed flex flex-col justify-between min-h-[297mm]`}>
        <div>
          <div className="border-b-2 pb-6" style={{ borderColor: design.primaryColor }}>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{senderBasics.name || 'Your Name'}</h1>
            <p className="text-sm font-medium text-neutral-600 mt-0.5">{senderBasics.headline || 'Your Professional Title'}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-500">
              {senderBasics.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-neutral-400" />
                  {senderBasics.email}
                </span>
              )}
              {senderBasics.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-neutral-400" />
                  {senderBasics.phone}
                </span>
              )}
              {senderBasics.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                  {senderBasics.location}
                </span>
              )}
              {senderBasics.website && (
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-neutral-400" />
                  {senderBasics.website.replace(/^https?:\/\//, '')}
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="text-neutral-500 font-medium">{coverLetter.date}</div>

            <div className="space-y-0.5 text-neutral-800">
              {coverLetter.recipientName && (
                <div className="font-semibold text-neutral-900">{coverLetter.recipientName}</div>
              )}
              {coverLetter.recipientTitle && (
                <div className="text-neutral-600 text-xs">{coverLetter.recipientTitle}</div>
              )}
              {coverLetter.companyName && <div className="font-medium">{coverLetter.companyName}</div>}
              {coverLetter.companyAddress && (
                <div className="text-neutral-500 text-xs whitespace-pre-line">{coverLetter.companyAddress}</div>
              )}
            </div>

            {coverLetter.subject && (
              <div className="font-bold text-sm pt-2" style={{ color: design.primaryColor }}>
                RE: {coverLetter.subject}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4 text-neutral-700 leading-relaxed">
            <p className="font-medium text-neutral-900">{coverLetter.salutation}</p>
            {coverLetter.body.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-neutral-800">{coverLetter.signOff || 'Sincerely,'}</p>
            <div className="font-bold text-neutral-900 text-base">{senderBasics.name}</div>
          </div>
        </div>

        <div className="pt-10 text-center text-[10px] text-neutral-400 border-t mt-12">
          Reactive Resume · Open Source Resume &amp; Cover Letter Builder
        </div>
      </div>
    </div>
  );
};
