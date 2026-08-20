import { PipelineAdvice, PipelineRisk } from './types';

export function generateAdviceList(risks: PipelineRisk[], domain: string): PipelineAdvice[] {
  const adviceList: PipelineAdvice[] = [];

  const urgencyWeights = { IMMEDIATE: 4.0, HIGH: 3.0, MEDIUM: 2.0, LOW: 1.0 };
  const effortWeights = { MINIMAL: 1.0, MODERATE: 1.8, SIGNIFICANT: 2.5 };

  if (domain === 'travel' || domain === 'interview') {
    const benefit = 0.18;
    const effort = 'MINIMAL';
    const urgency = 'HIGH';
    const controllability = 0.90;

    const priorityScore = parseFloat(
      ((benefit * controllability * urgencyWeights[urgency]) / effortWeights[effort]).toFixed(2)
    );

    adviceList.push({
      id: `adv-departure-${Date.now()}`,
      title: 'Depart 30 Minutes Earlier',
      description: 'Leaving 30 minutes before standard scheduled departure bypasses peak toll plaza bottlenecks.',
      expectedBenefit: benefit,
      effort,
      urgency,
      controllability,
      priorityScore,
      relatedRiskId: risks.find((r) => r.title.includes('Traffic'))?.id,
    });
  }

  if (domain === 'interview' || domain === 'exam') {
    const benefit = 0.14;
    const effort = 'MODERATE';
    const urgency = 'HIGH';
    const controllability = 0.85;

    const priorityScore = parseFloat(
      ((benefit * controllability * urgencyWeights[urgency]) / effortWeights[effort]).toFixed(2)
    );

    adviceList.push({
      id: `adv-prep-${Date.now()}`,
      title: 'Practice System Design Architecture Patterns',
      description: 'Review high-level micro-frontend and distributed caching patterns for technical assessment.',
      expectedBenefit: benefit,
      effort,
      urgency,
      controllability,
      priorityScore,
      relatedRiskId: risks.find((r) => r.title.includes('Technical'))?.id,
    });
  }

  // Sort strictly by priority score descending
  return adviceList.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function simulateImprovedOdds(
  currentScore: number,
  selectedAdviceIds: string[],
  allAdvice: PipelineAdvice[]
): number {
  if (selectedAdviceIds.length === 0) return currentScore;

  const totalBenefit = allAdvice
    .filter((a) => selectedAdviceIds.includes(a.id))
    .reduce((sum, a) => sum + a.expectedBenefit, 0);

  // Diminishing returns formula: Improved = Current + (1 - Current) * (1 - e^(-totalBenefit * 1.5))
  const gain = (1 - currentScore) * (1 - Math.exp(-totalBenefit * 1.5));
  const improved = currentScore + gain;

  return parseFloat(Math.min(improved, 0.96).toFixed(2));
}
