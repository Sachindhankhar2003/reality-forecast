import { EvidenceItem } from './types';

export type EvidenceQualityTier = 'STRONG' | 'MODERATE' | 'WEAK' | 'INSUFFICIENT';

export interface EvidenceQualityAssessment {
  overallQuality: EvidenceQualityTier;
  confidenceMultiplier: number;
  qualityBreakdown: {
    evidenceId: string;
    providerName: string;
    tier: EvidenceQualityTier;
    freshnessScore: number;
    reliabilityScore: number;
  }[];
  explanation: string;
}

export function evaluateEvidenceQuality(evidenceList: EvidenceItem[]): EvidenceQualityAssessment {
  if (!evidenceList || evidenceList.length === 0) {
    return {
      overallQuality: 'INSUFFICIENT',
      confidenceMultiplier: 0.60,
      qualityBreakdown: [],
      explanation: 'No evidence items retrieved. Forecast confidence reduced.',
    };
  }

  const breakdown = evidenceList.map((item) => {
    let tier: EvidenceQualityTier = 'MODERATE';
    const isLiveProvider = item.providerName.includes('TomTom') || item.providerName.includes('Open-Meteo') || item.source === 'USER_PROVIDED';

    if (isLiveProvider && item.freshnessScore >= 0.85 && item.reliability >= 0.85) {
      tier = 'STRONG';
    } else if (item.freshnessScore < 0.50 || item.reliability < 0.60) {
      tier = 'WEAK';
    } else if (item.source === 'SYSTEM' || !item.providerName) {
      tier = 'INSUFFICIENT';
    }

    return {
      evidenceId: item.id,
      providerName: item.providerName || 'Unknown Provider',
      tier,
      freshnessScore: item.freshnessScore,
      reliabilityScore: item.reliability,
    };
  });

  const strongCount = breakdown.filter((b) => b.tier === 'STRONG').length;
  const weakCount = breakdown.filter((b) => b.tier === 'WEAK' || b.tier === 'INSUFFICIENT').length;

  let overallQuality: EvidenceQualityTier = 'MODERATE';
  let multiplier = 0.90;

  if (strongCount >= 2 && weakCount === 0) {
    overallQuality = 'STRONG';
    multiplier = 1.0;
  } else if (weakCount >= 2 || breakdown.length === 0) {
    overallQuality = 'WEAK';
    multiplier = 0.75;
  }

  return {
    overallQuality,
    confidenceMultiplier: multiplier,
    qualityBreakdown: breakdown,
    explanation: `Evidence classified as ${overallQuality} based on ${evidenceList.length} retrieved telemetry sources (${strongCount} Strong, ${weakCount} Weak).`,
  };
}
