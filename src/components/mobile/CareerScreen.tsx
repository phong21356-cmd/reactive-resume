import React, { useState } from 'react';
import { CareerStory, JobOffer } from '../../types/resume';
import { calculateOfferTotalComp } from '../../utils/applicationTracker';
import { Plus, BookOpen, Scale } from 'lucide-react';

interface CareerScreenProps {
  stories: CareerStory[];
  offers: JobOffer[];
  onAddStory: (story: Omit<CareerStory, 'id'>) => void;
  onAddOffer: (offer: Omit<JobOffer, 'id'>) => void;
}

export const CareerScreen: React.FC<CareerScreenProps> = ({
  stories,
  offers,
  onAddStory,
  onAddOffer,
}) => {
  const [subTab, setSubTab] = useState<'offers' | 'stories'>('offers');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [baseSalary, setBaseSalary] = useState('240000');
  const [annualBonusPct, setAnnualBonusPct] = useState('15');
  const [equityAnnual, setEquityAnnual] = useState('80000');
  const [signingBonus, setSigningBonus] = useState('25000');

  const [showStoryForm, setShowStoryForm] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [competency, setCompetency] = useState('');
  const [situation, setSituation] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    onAddOffer({
      company: company.trim(),
      role: role.trim() || 'Senior Engineer',
      location: 'Remote / Hybrid',
      baseSalary: Number(baseSalary) || 200000,
      annualBonusPct: Number(annualBonusPct) || 10,
      equityAnnual: Number(equityAnnual) || 50000,
      signingBonus: Number(signingBonus) || 0,
      workPolicy: 'Remote',
    });
    setCompany('');
    setRole('');
    setShowOfferForm(false);
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !result.trim()) return;
    onAddStory({
      title: storyTitle.trim(),
      competency: competency.trim() || 'Technical Leadership',
      situation: situation.trim() || 'High-priority architectural bottleneck.',
      action: action.trim() || 'Led cross-team RFC and incremental migration.',
      result: result.trim(),
    });
    setStoryTitle('');
    setCompetency('');
    setSituation('');
    setAction('');
    setResult('');
    setShowStoryForm(false);
  };

  return (
    <div className="space-y-5">
      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Career &amp; Offers Hub</h2>
          <p className="text-xs text-slate-400">
            Compare total compensation packages and prepare STAR interview stories
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setSubTab('offers')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              subTab === 'offers' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            Offer Calculator ({offers.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('stories')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              subTab === 'stories' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            STAR Stories ({stories.length})
          </button>
        </div>
      </div>

      {subTab === 'offers' ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowOfferForm((prev) => !prev)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add Offer to Compare
            </button>
          </div>

          {showOfferForm && (
            <form
              onSubmit={handleCreateOffer}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3"
            >
              <h3 className="text-sm font-semibold text-slate-100">Add Compensation Offer</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company Name (e.g. Anthropic)"
                  className="min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100"
                />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role Title"
                  className="min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100"
                />
                <input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  placeholder="Base Salary ($)"
                  className="min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 tabular-nums"
                />
                <input
                  type="number"
                  value={equityAnnual}
                  onChange={(e) => setEquityAnnual(e.target.value)}
                  placeholder="Annual Equity / RSU ($)"
                  className="min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 tabular-nums"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOfferForm(false)}
                  className="min-h-[44px] px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Offer
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {offers.map((offer) => {
              const comp = calculateOfferTotalComp(offer);
              return (
                <div
                  key={offer.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3"
                >
                  <div>
                    <div className="text-base font-bold text-slate-100">{offer.company}</div>
                    <div className="text-xs text-slate-400">
                      {offer.role} <span aria-hidden="true">·</span> {offer.workPolicy}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Salary</span>
                      <span className="font-mono tabular-nums text-slate-200">
                        ${offer.baseSalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Bonus ({offer.annualBonusPct}%)</span>
                      <span className="font-mono tabular-nums text-slate-200">
                        ${comp.bonusAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Equity (RSU)</span>
                      <span className="font-mono tabular-nums text-slate-200">
                        ${offer.equityAnnual.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Year 1 Signing Bonus</span>
                      <span className="font-mono tabular-nums text-slate-200">
                        ${offer.signingBonus.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-800 flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-300">Year 1 Total Comp</span>
                    <span className="text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
                      ${comp.year1Total.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowStoryForm((prev) => !prev)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add STAR Story
            </button>
          </div>

          {showStoryForm && (
            <form
              onSubmit={handleCreateStory}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3"
            >
              <h3 className="text-sm font-semibold text-slate-100">New STAR Behavioral Story</h3>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Story Title (e.g. Scaling Android Offline Sync)"
                className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100"
              />
              <textarea
                rows={2}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Measurable Result (e.g. Reduced crash rate by 65% across 2M devices)"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStoryForm(false)}
                  className="min-h-[44px] px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Story
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {stories.map((st) => (
              <div
                key={st.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2.5"
              >
                <div>
                  <div className="text-sm font-bold text-slate-100">{st.title}</div>
                  <div className="text-xs text-blue-400 mt-0.5">{st.competency}</div>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p>
                    <strong className="text-slate-100">Situation:</strong> {st.situation}
                  </p>
                  <p>
                    <strong className="text-slate-100">Action:</strong> {st.action}
                  </p>
                  <p>
                    <strong className="text-emerald-400">Result:</strong> {st.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
