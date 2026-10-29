import React, { useState } from 'react';
import { Resume } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, ExternalLink, Calendar } from 'lucide-react';

interface ResumeRendererProps {
  resume: Resume;
  scale?: number;
}

const AvatarWithFallback: React.FC<{
  src: string;
  name: string;
  primaryColor: string;
  roundedClass?: string;
}> = ({ src, name, primaryColor, roundedClass = 'rounded-xl' }) => {
  const [failed, setFailed] = useState(false);
  const initials = (name || 'AM')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`ml-6 h-20 w-20 ${roundedClass} flex items-center justify-center text-white font-bold text-xl shrink-0`}
        style={{ backgroundColor: primaryColor }}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`ml-6 h-20 w-20 ${roundedClass} border object-cover shrink-0`}
      style={{ borderColor: `${primaryColor}40` }}
    />
  );
};

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ resume, scale = 1 }) => {
  const { basics, work, education, skills, projects, certifications, languages, design } = resume;

  const fontClass =
    design.fontFamily === 'serif'
      ? 'font-[Merriweather,serif]'
      : design.fontFamily === 'mono'
      ? 'font-[JetBrains_Mono,monospace]'
      : 'font-[DM_Sans,sans-serif]';

  const spacingClass =
    design.pageSpacing === 'compact' ? 'space-y-3' : design.pageSpacing === 'relaxed' ? 'space-y-6' : 'space-y-4';

  const textScaleClass =
    design.fontSize === 'compact' ? 'text-xs' : design.fontSize === 'relaxed' ? 'text-sm' : 'text-[13px]';

  return (
    <div
      id="resume-printable-area"
      className="printable-page bg-white text-neutral-800 shadow-2xl transition-transform duration-150"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
      }}
    >
      <div className={`p-8 md:p-10 ${fontClass} ${textScaleClass} leading-relaxed`}>
        {design.template === 'modern' && (
          <ModernLayout
            basics={basics}
            work={work}
            education={education}
            skills={skills}
            projects={projects}
            certifications={certifications}
            languages={languages}
            design={design}
            spacingClass={spacingClass}
          />
        )}

        {design.template === 'minimalist' && (
          <MinimalistLayout
            basics={basics}
            work={work}
            education={education}
            skills={skills}
            projects={projects}
            certifications={certifications}
            languages={languages}
            design={design}
            spacingClass={spacingClass}
          />
        )}

        {design.template === 'classic' && (
          <ClassicLayout
            basics={basics}
            work={work}
            education={education}
            skills={skills}
            projects={projects}
            certifications={certifications}
            languages={languages}
            design={design}
            spacingClass={spacingClass}
          />
        )}

        {design.template === 'compact' && (
          <CompactLayout
            basics={basics}
            work={work}
            education={education}
            skills={skills}
            projects={projects}
            certifications={certifications}
            languages={languages}
            design={design}
            spacingClass={spacingClass}
          />
        )}

        {design.template === 'creative' && (
          <CreativeLayout
            basics={basics}
            work={work}
            education={education}
            skills={skills}
            projects={projects}
            certifications={certifications}
            languages={languages}
            design={design}
            spacingClass={spacingClass}
          />
        )}
      </div>
    </div>
  );
};

const ModernLayout: React.FC<any> = ({
  basics,
  work,
  education,
  skills,
  projects,
  certifications,
  languages,
  design,
  spacingClass,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between border-b pb-5" style={{ borderColor: `${design.primaryColor}30` }}>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: design.primaryColor }}>
            {basics.name || 'Your Full Name'}
          </h1>
          <p className="mt-1 text-base font-medium text-neutral-600">{basics.headline || 'Professional Headline'}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-500">
            {basics.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-neutral-400" />
                {basics.email}
              </span>
            )}
            {basics.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-neutral-400" />
                {basics.phone}
              </span>
            )}
            {basics.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                {basics.location}
              </span>
            )}
            {basics.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-neutral-400" />
                {basics.website.replace(/^https?:\/\//, '')}
              </span>
            )}
          </div>
        </div>

        {design.showPhoto && (
          <AvatarWithFallback
            src={basics.photoUrl}
            name={basics.name}
            primaryColor={design.primaryColor}
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className={`col-span-8 ${spacingClass}`}>
          {basics.summary && (
            <div>
              <SectionHeading title="Summary" color={design.primaryColor} />
              <p className="mt-2 text-neutral-700 leading-relaxed">{basics.summary}</p>
            </div>
          )}

          {work.length > 0 && (
            <div>
              <SectionHeading title="Experience" color={design.primaryColor} />
              <div className="mt-3 space-y-4">
                {work.map((item: any) => (
                  <div key={item.id} className="pb-3 border-b border-neutral-100 last:border-b-0">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-neutral-900">{item.position}</span>
                      <span className="text-xs font-medium text-neutral-500 flex items-center gap-1 tabular-nums">
                        <Calendar className="h-3 w-3 inline" />
                        {item.startDate} — {item.current ? 'Present' : item.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-neutral-600">
                      {item.company} {item.location ? `· ${item.location}` : ''}
                    </div>
                    {item.summary && <p className="mt-1 text-neutral-700">{item.summary}</p>}
                    {item.highlights?.length > 0 && (
                      <ul className="mt-1.5 list-disc list-outside ml-4 space-y-1 text-neutral-700 text-xs">
                        {item.highlights.map((h: string, idx: number) => (
                          <li key={idx}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SectionHeading title="Selected Projects" color={design.primaryColor} />
              <div className="mt-3 space-y-3">
                {projects.map((proj: any) => (
                  <div key={proj.id} className="rounded-lg bg-neutral-50 p-3 border border-neutral-200/70">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">{proj.name}</span>
                      {proj.url && (
                        <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                          {proj.url.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-neutral-700 text-xs">{proj.description}</p>
                    {proj.keywords?.length > 0 && (
                      <div className="mt-1.5 text-[11px] text-neutral-500 font-medium">
                        {proj.keywords.join(' · ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`col-span-4 ${spacingClass} border-l border-neutral-100 pl-6`}>
          {skills.length > 0 && (
            <div>
              <SectionHeading title="Skills" color={design.primaryColor} />
              <div className="mt-3 space-y-3">
                {skills.map((skill: any) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs font-semibold text-neutral-800">
                      <span>{skill.name}</span>
                      <span className="text-[11px] text-neutral-400 tabular-nums">{skill.level}/5</span>
                    </div>
                    {skill.keywords?.length > 0 && (
                      <p className="mt-1 text-xs text-neutral-600 leading-snug">
                        {skill.keywords.join(' · ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <SectionHeading title="Education" color={design.primaryColor} />
              <div className="mt-3 space-y-3">
                {education.map((edu: any) => (
                  <div key={edu.id}>
                    <div className="font-bold text-neutral-900 text-xs">{edu.institution}</div>
                    <div className="text-neutral-700 text-xs">
                      {edu.studyType} in {edu.area}
                    </div>
                    <div className="text-[11px] text-neutral-500 tabular-nums">
                      {edu.startDate} — {edu.endDate} {edu.score ? `· ${edu.score}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <SectionHeading title="Certifications" color={design.primaryColor} />
              <div className="mt-3 space-y-2">
                {certifications.map((cert: any) => (
                  <div key={cert.id} className="text-xs">
                    <div className="font-semibold text-neutral-900">{cert.name}</div>
                    <div className="text-neutral-500 text-[11px]">
                      {cert.issuer} {cert.date ? `· ${cert.date}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <SectionHeading title="Languages" color={design.primaryColor} />
              <div className="mt-2 space-y-1.5">
                {languages.map((lang: any) => (
                  <div key={lang.id} className="flex justify-between text-xs">
                    <span className="font-medium text-neutral-800">{lang.name}</span>
                    <span className="text-neutral-500 text-[11px]">{lang.fluency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MinimalistLayout: React.FC<any> = ({
  basics,
  work,
  education,
  skills,
  projects,
  spacingClass,
}) => {
  return (
    <div className={`max-w-3xl mx-auto ${spacingClass}`}>
      <div className="text-center pb-4 border-b border-neutral-200">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{basics.name}</h1>
        <p className="mt-1 text-sm text-neutral-500 font-medium">{basics.headline}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-neutral-600">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>· {basics.phone}</span>}
          {basics.location && <span>· {basics.location}</span>}
          {basics.website && <span>· {basics.website}</span>}
        </div>
      </div>

      {basics.summary && (
        <div className="text-neutral-700 leading-relaxed text-sm text-center max-w-2xl mx-auto">
          {basics.summary}
        </div>
      )}

      {work.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Experience</h2>
          <div className="space-y-4">
            {work.map((item: any) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-neutral-900">{item.position}</span>
                    <span className="text-neutral-500 ml-2">· {item.company}</span>
                  </div>
                  <span className="text-xs text-neutral-500 tabular-nums">
                    {item.startDate} — {item.current ? 'Present' : item.endDate}
                  </span>
                </div>
                {item.summary && <p className="mt-1 text-xs text-neutral-700">{item.summary}</p>}
                {item.highlights?.length > 0 && (
                  <ul className="mt-1.5 list-disc list-outside ml-4 space-y-1 text-xs text-neutral-600">
                    {item.highlights.map((h: string, idx: number) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Projects</h2>
          <div className="grid grid-cols-2 gap-4">
            {projects.map((proj: any) => (
              <div key={proj.id} className="border border-neutral-200 rounded-lg p-3">
                <span className="font-medium text-neutral-900">{proj.name}</span>
                <p className="text-xs text-neutral-600 mt-0.5">{proj.description}</p>
                {proj.keywords?.length > 0 && (
                  <div className="text-[10px] text-neutral-400 mt-1">{proj.keywords.join(' · ')}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 pt-2">
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Education</h2>
            <div className="space-y-2">
              {education.map((edu: any) => (
                <div key={edu.id}>
                  <div className="font-medium text-neutral-900 text-xs">{edu.institution}</div>
                  <div className="text-xs text-neutral-600">
                    {edu.studyType}, {edu.area}
                  </div>
                  <div className="text-[11px] text-neutral-400 tabular-nums">
                    {edu.startDate} — {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Skills</h2>
            <div className="space-y-2">
              {skills.map((skill: any) => (
                <div key={skill.id} className="text-xs">
                  <span className="font-medium text-neutral-900">{skill.name}: </span>
                  <span className="text-neutral-600">{skill.keywords?.join(' · ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClassicLayout: React.FC<any> = ({
  basics,
  work,
  education,
  skills,
  design,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center border-b-2 pb-4" style={{ borderColor: design.primaryColor }}>
        <h1 className="text-2xl font-bold tracking-wide text-neutral-900">{basics.name}</h1>
        <p className="text-xs text-neutral-600 mt-1 font-semibold">{basics.headline}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-3 text-xs text-neutral-700">
          {basics.location && <span>{basics.location}</span>}
          {basics.email && <span>· {basics.email}</span>}
          {basics.phone && <span>· {basics.phone}</span>}
          {basics.website && <span>· {basics.website}</span>}
        </div>
      </div>

      {basics.summary && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 text-neutral-900">
            Executive Summary
          </h2>
          <p className="mt-1.5 text-xs text-neutral-800 leading-relaxed">{basics.summary}</p>
        </div>
      )}

      {work.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 text-neutral-900">
            Professional Experience
          </h2>
          <div className="mt-2 space-y-3">
            {work.map((item: any) => (
              <div key={item.id}>
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-neutral-900">{item.company}</span>
                  <span className="text-neutral-600">{item.location}</span>
                </div>
                <div className="flex justify-between text-xs italic text-neutral-700">
                  <span>{item.position}</span>
                  <span className="tabular-nums">
                    {item.startDate} – {item.current ? 'Present' : item.endDate}
                  </span>
                </div>
                {item.summary && <p className="mt-1 text-xs text-neutral-800">{item.summary}</p>}
                {item.highlights?.length > 0 && (
                  <ul className="mt-1 list-disc list-outside ml-4 space-y-0.5 text-xs text-neutral-800">
                    {item.highlights.map((h: string, idx: number) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 text-neutral-900">
            Education
          </h2>
          <div className="mt-2 space-y-2">
            {education.map((edu: any) => (
              <div key={edu.id} className="flex justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-900">{edu.institution}</span>, {edu.studyType} in {edu.area}
                </div>
                <span className="text-neutral-600 tabular-nums">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 text-neutral-900">
            Core Competencies
          </h2>
          <div className="mt-2 space-y-1 text-xs">
            {skills.map((skill: any) => (
              <div key={skill.id}>
                <span className="font-bold text-neutral-900">{skill.name}: </span>
                <span className="text-neutral-700">{skill.keywords?.join(' · ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CompactLayout: React.FC<any> = ({
  basics,
  work,
  education,
  skills,
}) => {
  return (
    <div className="space-y-3 text-xs leading-snug">
      <div className="border-b pb-2 flex justify-between items-baseline">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{basics.name}</h1>
          <p className="text-xs font-medium text-neutral-600">{basics.headline}</p>
        </div>
        <div className="text-right text-[11px] text-neutral-500">
          <div>{basics.email} · {basics.phone}</div>
          <div>{basics.location} · {basics.website}</div>
        </div>
      </div>

      {basics.summary && <p className="text-neutral-700">{basics.summary}</p>}

      {skills.length > 0 && (
        <div>
          <div className="font-bold uppercase tracking-wider text-[11px] text-neutral-500 border-b mb-1">Technical Skills</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {skills.map((s: any) => (
              <div key={s.id} className="text-[11px]">
                <span className="font-bold text-neutral-800">{s.name}: </span>
                <span className="text-neutral-600">{s.keywords?.join(' · ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {work.length > 0 && (
        <div>
          <div className="font-bold uppercase tracking-wider text-[11px] text-neutral-500 border-b mb-1">Work History</div>
          <div className="space-y-2">
            {work.map((w: any) => (
              <div key={w.id}>
                <div className="flex justify-between font-bold text-neutral-900 text-xs">
                  <span>{w.position} · {w.company}</span>
                  <span className="font-normal text-neutral-500 text-[11px] tabular-nums">{w.startDate} - {w.current ? 'Present' : w.endDate}</span>
                </div>
                <ul className="list-disc ml-4 space-y-0.5 text-neutral-700 text-[11px]">
                  {w.highlights?.map((h: string, idx: number) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <div className="font-bold uppercase tracking-wider text-[11px] text-neutral-500 border-b mb-1">Education</div>
          {education.map((edu: any) => (
            <div key={edu.id} className="flex justify-between text-[11px]">
              <span className="font-bold text-neutral-800">{edu.institution} — {edu.studyType} in {edu.area}</span>
              <span className="text-neutral-500 tabular-nums">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CreativeLayout: React.FC<any> = ({
  basics,
  work,
  education,
  skills,
  projects,
  design,
  spacingClass,
}) => {
  return (
    <div className={spacingClass}>
      <div
        className="rounded-xl p-6 text-white"
        style={{
          backgroundColor: design.primaryColor,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{basics.name}</h1>
            <p className="mt-1 text-sm font-medium text-white/90">{basics.headline}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/85">
              {basics.email && <span>{basics.email}</span>}
              {basics.phone && <span>· {basics.phone}</span>}
              {basics.location && <span>· {basics.location}</span>}
            </div>
          </div>
          {design.showPhoto && (
            <AvatarWithFallback
              src={basics.photoUrl}
              name={basics.name}
              primaryColor="#0f172a"
              roundedClass="rounded-full"
            />
          )}
        </div>
      </div>

      {basics.summary && (
        <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200/70 text-neutral-700 text-xs leading-relaxed">
          {basics.summary}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
          {work.length > 0 && (
            <div>
              <SectionHeading title="Work Experience" color={design.primaryColor} />
              <div className="mt-3 space-y-3">
                {work.map((w: any) => (
                  <div key={w.id} className="pb-2.5 border-b border-neutral-100 last:border-b-0">
                    <div className="flex justify-between font-bold text-neutral-900 text-xs">
                      <span>{w.position} · {w.company}</span>
                      <span className="text-[11px] text-neutral-500 tabular-nums">{w.startDate} – {w.current ? 'Present' : w.endDate}</span>
                    </div>
                    <ul className="mt-1.5 list-disc ml-4 space-y-1 text-xs text-neutral-700">
                      {w.highlights?.map((h: string, idx: number) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SectionHeading title="Key Projects" color={design.primaryColor} />
              <div className="mt-3 grid grid-cols-1 gap-2.5">
                {projects.map((p: any) => (
                  <div key={p.id} className="p-2.5 rounded-lg border border-neutral-200/70 bg-neutral-50">
                    <span className="font-bold text-neutral-900 text-xs">{p.name}</span>
                    <p className="text-xs text-neutral-600 mt-0.5">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4 space-y-4">
          {skills.length > 0 && (
            <div>
              <SectionHeading title="Expertise" color={design.primaryColor} />
              <div className="mt-3 space-y-2">
                {skills.map((s: any) => (
                  <div key={s.id}>
                    <span className="text-xs font-semibold text-neutral-800">{s.name}</span>
                    <p className="mt-0.5 text-xs text-neutral-600">
                      {s.keywords?.join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <SectionHeading title="Education" color={design.primaryColor} />
              <div className="mt-2 space-y-2">
                {education.map((e: any) => (
                  <div key={e.id} className="text-xs">
                    <div className="font-bold text-neutral-900">{e.institution}</div>
                    <div className="text-neutral-600">{e.studyType} · {e.area}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionHeading: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <h2
    className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
    style={{ color, borderColor: `${color}30` }}
  >
    {title}
  </h2>
);
