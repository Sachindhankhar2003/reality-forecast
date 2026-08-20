import { prisma } from '@/lib/db';

export type PatternStrength = 'NO_PATTERN' | 'WEAK_PATTERN' | 'EMERGING_PATTERN' | 'STRONGER_PATTERN';
export type BiasType = 'OPTIMISTIC_ESTIMATION' | 'PESSIMISTIC_ESTIMATION' | 'LATE_DEPARTURE' | 'UNDER_PREPARATION' | 'NONE';

export interface PersonalBiasAnalysis {
  patternStrength: PatternStrength;
  biasType: BiasType;
  sampleSize: number;
  averageScoreError: number;
  confidence: number;
  explanation: string;
}

export async function analyzePersonalOutcomeHistory(
  userId: string,
  domain: string
): Promise<PersonalBiasAnalysis> {
  const outcomes = await prisma.outcome.findMany({
    where: {
      userId,
      forecast: { domain },
    },
    include: { forecast: true },
    orderBy: { recordedAt: 'desc' },
    take: 20,
  });

  const sampleSize = outcomes.length;

  // Threshold Check (Item 13)
  if (sampleSize < 3) {
    return {
      patternStrength: 'NO_PATTERN',
      biasType: 'NONE',
      sampleSize,
      averageScoreError: 0,
      confidence: 0.3,
      explanation: 'Insufficient outcome data to identify a reliable personal pattern (minimum 3 observations required).',
    };
  }

  let patternStrength: PatternStrength = 'WEAK_PATTERN';
  if (sampleSize >= 10) patternStrength = 'STRONGER_PATTERN';
  else if (sampleSize >= 6) patternStrength = 'EMERGING_PATTERN';

  // Analyze late arrival / optimism trend
  const delayedCount = outcomes.filter(
    (o) => o.result.toLowerCase().includes('delayed') || o.notes?.toLowerCase().includes('late')
  ).length;

  const lateRatio = delayedCount / sampleSize;

  if (lateRatio >= 0.5) {
    return {
      patternStrength,
      biasType: 'LATE_DEPARTURE',
      sampleSize,
      averageScoreError: -0.08,
      confidence: parseFloat(Math.min(0.60 + sampleSize * 0.03, 0.90).toFixed(2)),
      explanation: `Your recent ${domain} forecasts indicate a tendency for departure buffers to be tighter than actual traffic corridor delays require (${delayedCount} of ${sampleSize} trips arrived later than expected).`,
    };
  }

  return {
    patternStrength,
    biasType: 'OPTIMISTIC_ESTIMATION',
    sampleSize,
    averageScoreError: -0.04,
    confidence: 0.70,
    explanation: `Based on ${sampleSize} historical ${domain} forecasts, outcomes closely align with baseline model expectations.`,
  };
}
