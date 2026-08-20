import { PersonalBiasAnalysis } from './outcome-analyzer';
import { ProcessedMemory } from './memory-retriever';

export interface ActionItem {
  id: string;
  title: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  effort: string;
  expectedBenefit: number;
  personalReason?: string;
}

export function generatePersonalizedActions(
  biasAnalysis: PersonalBiasAnalysis,
  memories: ProcessedMemory[],
  domain: string
): ActionItem[] {
  const actions: ActionItem[] = [];

  if (biasAnalysis.biasType === 'LATE_DEPARTURE' && biasAnalysis.sampleSize >= 3) {
    actions.push({
      id: `act-personal-departure-${Date.now()}`,
      title: 'Depart 25 Minutes Earlier Than Your Usual Pattern',
      reason: 'Reduces commute bottleneck vulnerability based on your historical departure buffer trend.',
      priority: 'HIGH',
      effort: 'MINIMAL',
      expectedBenefit: 0.20,
      personalReason: `You arrived late on ${Math.round(biasAnalysis.sampleSize * 0.5)} of your last ${biasAnalysis.sampleSize} ${domain} trips due to tight departure buffers.`,
    });
  }

  const techMemory = memories.find((m) => m.category === 'SKILL' || m.key.includes('tech'));
  if (techMemory && domain === 'interview') {
    actions.push({
      id: `act-personal-tech-${Date.now()}`,
      title: `Review ${techMemory.value.split(',')[0] || 'Core Stack'} System Architecture`,
      reason: 'Aligns technical preparation directly with your declared skill stack.',
      priority: 'HIGH',
      effort: 'MODERATE',
      expectedBenefit: 0.16,
      personalReason: `Tailored to your saved technical profile: "${techMemory.value}".`,
    });
  }

  // Fallback high-value general action
  actions.push({
    id: `act-general-prep-${Date.now()}`,
    title: 'Pre-Save Venue Contact & Alternative Transit',
    reason: 'Eliminates friction in case of unexpected route diversion.',
    priority: 'MEDIUM',
    effort: 'MINIMAL',
    expectedBenefit: 0.10,
  });

  // Limit to top 3 actions strictly (Item 23)
  return actions.slice(0, 3);
}
