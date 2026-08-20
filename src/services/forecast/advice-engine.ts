import { AdviceRule } from '@/types/domain';
import { AdviceItem, RiskItem } from '@/types/forecast';

export function generateAdvice(
  risks: RiskItem[],
  domainRules: AdviceRule[],
  currentScore: number
): AdviceItem[] {
  const adviceList: AdviceItem[] = [];

  // Advice 1: Derived from top risk (High Impact + Controllable)
  const topRisk = risks.find((r) => r.controllability > 0.4);
  if (topRisk) {
    if (topRisk.id.includes('traffic')) {
      adviceList.push({
        id: 'adv-leave-early',
        title: 'Advance Departure Time by 25 Mins',
        description: 'Departing 25 minutes earlier avoids peak congestion windows and increases on-time arrival probability significantly.',
        expectedBenefit: 0.18, // +18%
        effort: 'minimal',
        urgency: 'high',
        controllability: 0.90,
        relatedRiskId: topRisk.id,
      });
    } else if (topRisk.id.includes('tech')) {
      adviceList.push({
        id: 'adv-tech-review',
        title: 'Complete 30-Min Rapid Architecture Review',
        description: 'Review core system design principles, caching strategies, and API contracts for your candidate stack.',
        expectedBenefit: 0.15, // +15%
        effort: 'moderate',
        urgency: 'high',
        controllability: 0.85,
        relatedRiskId: topRisk.id,
      });
    }
  }

  // Advice 2: Transit / Route alternative
  adviceList.push({
    id: 'adv-metro-backup',
    title: 'Identify Direct Metro / Express Rail Alternative',
    description: 'Keep a pre-saved transit route on hand in case highway congestion worsens past tolerance thresholds.',
    expectedBenefit: 0.10, // +10%
    effort: 'minimal',
    urgency: 'medium',
    controllability: 0.95,
  });

  // Advice 3: Logistics / Communication
  adviceList.push({
    id: 'adv-contact-prep',
    title: 'Pre-Save Recruiter & Venue Contact Info',
    description: 'Store direct contact numbers on speed dial to immediately notify host if unexpected transit delays occur.',
    expectedBenefit: 0.08, // +8%
    effort: 'minimal',
    urgency: 'medium',
    controllability: 1.0,
  });

  return adviceList;
}

export function calculateImprovedOdds(currentScore: number, selectedAdviceIds: string[], allAdvice: AdviceItem[]): number {
  let benefitSum = 0;
  selectedAdviceIds.forEach((id) => {
    const item = allAdvice.find((a) => a.id === id);
    if (item) {
      benefitSum += item.expectedBenefit;
    }
  });

  // Diminishing returns formula
  const maxPossibleGain = 1 - currentScore;
  const realizedGain = maxPossibleGain * (1 - Math.exp(-1.5 * benefitSum));
  const newScore = Math.min(0.96, Number((currentScore + realizedGain).toFixed(2)));

  return newScore;
}
