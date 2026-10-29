import { ApplicationStage, JobApplication, JobOffer } from '../types/resume';

export interface ApplicationMetrics {
  total: number;
  activeCount: number;
  interviewCount: number;
  offerCount: number;
  responseRatePct: number;
  byStage: Record<ApplicationStage, number>;
}

const STAGE_ORDER: ApplicationStage[] = ['saved', 'applied', 'interviewing', 'offer', 'archived'];

export function computeApplicationMetrics(applications: JobApplication[]): ApplicationMetrics {
  const byStage: Record<ApplicationStage, number> = {
    saved: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
    archived: 0,
  };

  for (const app of applications) {
    byStage[app.stage] = (byStage[app.stage] || 0) + 1;
  }

  const total = applications.length;
  const activeCount = byStage.applied + byStage.interviewing + byStage.offer;
  const progressed = byStage.interviewing + byStage.offer;
  const submittedTotal = byStage.applied + byStage.interviewing + byStage.offer + byStage.archived;
  const responseRatePct = submittedTotal > 0 ? Math.round((progressed / submittedTotal) * 100) : 0;

  return {
    total,
    activeCount,
    interviewCount: byStage.interviewing,
    offerCount: byStage.offer,
    responseRatePct,
    byStage,
  };
}

export function advanceApplicationStage(current: ApplicationStage): ApplicationStage {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) {
    return 'saved';
  }
  return STAGE_ORDER[idx + 1];
}

export interface OfferCompBreakdown {
  bonusAmount: number;
  recurringAnnual: number;
  year1Total: number;
  monthlyGross: number;
}

export function calculateOfferTotalComp(offer: JobOffer): OfferCompBreakdown {
  const bonusAmount = Math.round(offer.baseSalary * (offer.annualBonusPct / 100));
  const recurringAnnual = Math.round(offer.baseSalary + bonusAmount + offer.equityAnnual);
  const year1Total = recurringAnnual + Math.round(offer.signingBonus);
  const monthlyGross = Math.round(recurringAnnual / 12);

  return {
    bonusAmount,
    recurringAnnual,
    year1Total,
    monthlyGross,
  };
}
