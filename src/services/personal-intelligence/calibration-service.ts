import { forecastStore } from '@/lib/forecast-store';

export interface CalibrationBucket {
  bucketRange: string;
  minProb: number;
  maxProb: number;
  sampleCount: number;
  predictedAverage: number;
  actualFrequency: number;
  calibrationError: number;
  status: 'VALID' | 'INSUFFICIENT_SAMPLE';
}

export interface DomainPerformanceMetrics {
  domain: string;
  forecastCount: number;
  completedOutcomesCount: number;
  successRate: number | null;
  averageBrierScore: number | null;
  averageConfidence: number | null;
  calibrationError: number | null;
  hasEnoughData: boolean;
  statusMessage: string;
}

export interface PersonalCalibrationPattern {
  patternStrength: 'NO_PATTERN' | 'WEAK_PATTERN' | 'EMERGING_PATTERN' | 'STRONGER_PATTERN';
  sampleSize: number;
  biasType: 'OPTIMISTIC_ESTIMATION' | 'PESSIMISTIC_ESTIMATION' | 'LATE_DEPARTURE' | 'NONE';
  confidence: number;
  explanation: string;
}

// 1. Binary Brier Score: BS = (p - o)^2
export function calculateBinaryBrierScore(predictedProb: number, actualOutcome: number): number {
  const p = Math.min(Math.max(predictedProb, 0), 1);
  const o = actualOutcome === 1 ? 1 : 0;
  return parseFloat(Math.pow(p - o, 2).toFixed(4));
}

// 2. Multiclass Brier Score across mutually-exclusive scenarios: BS = 1/K * sum((p_k - o_k)^2)
export function calculateMulticlassBrierScore(
  scenarios: { probability: number; isActualOutcome: boolean }[]
): number {
  if (!scenarios || scenarios.length === 0) return 0;

  const totalProb = scenarios.reduce((sum, s) => sum + s.probability, 0);
  const normalizedScenarios = scenarios.map((s) => ({
    p: totalProb > 0 ? s.probability / totalProb : 1 / scenarios.length,
    o: s.isActualOutcome ? 1 : 0,
  }));

  const sumSquaredDiff = normalizedScenarios.reduce((sum, s) => sum + Math.pow(s.p - s.o, 2), 0);
  return parseFloat((sumSquaredDiff / scenarios.length).toFixed(4));
}

// 3. Calibration Buckets (10 ranges: 0-10%, ..., 90-100%)
export function calculateCalibrationBuckets(
  evaluations: { probability: number; outcome: number }[]
): CalibrationBucket[] {
  const buckets: CalibrationBucket[] = [];

  for (let i = 0; i < 10; i++) {
    const minProb = i / 10;
    const maxProb = (i + 1) / 10;
    const rangeLabel = `${i * 10}–${(i + 1) * 10}%`;

    const items = evaluations.filter((e) => e.probability >= minProb && (i === 9 ? e.probability <= maxProb : e.probability < maxProb));

    if (items.length < 5) {
      buckets.push({
        bucketRange: rangeLabel,
        minProb,
        maxProb,
        sampleCount: items.length,
        predictedAverage: 0,
        actualFrequency: 0,
        calibrationError: 0,
        status: 'INSUFFICIENT_SAMPLE',
      });
      continue;
    }

    const avgPred = items.reduce((s, it) => s + it.probability, 0) / items.length;
    const actualFreq = items.reduce((s, it) => s + it.outcome, 0) / items.length;
    const calibError = Math.abs(avgPred - actualFreq);

    buckets.push({
      bucketRange: rangeLabel,
      minProb,
      maxProb,
      sampleCount: items.length,
      predictedAverage: parseFloat(avgPred.toFixed(3)),
      actualFrequency: parseFloat(actualFreq.toFixed(3)),
      calibrationError: parseFloat(calibError.toFixed(3)),
      status: 'VALID',
    });
  }

  return buckets;
}

// 4. Domain Performance Evaluation
export async function getDomainPerformanceMetrics(
  userId: string,
  targetDomain?: string
): Promise<DomainPerformanceMetrics[]> {
  const validDomains = ['TRAVEL', 'INTERVIEW', 'HOTEL', 'EXAM', 'MEETING', 'EVENT', 'BUSINESS', 'PERSONAL', 'GENERIC'];

  const results: DomainPerformanceMetrics[] = [];

  for (const dom of validDomains) {
    if (targetDomain && targetDomain.toUpperCase() !== dom && targetDomain.toUpperCase() !== 'ALL') {
      continue;
    }

    const memoryForecasts = forecastStore.getAllForecasts().filter((f) => f.domain.toUpperCase() === dom);
    const completedOutcomes = memoryForecasts.filter((f) => Boolean(f.outcome));
    const sampleSize = completedOutcomes.length;

    if (sampleSize < 5) {
      results.push({
        domain: dom,
        forecastCount: memoryForecasts.length,
        completedOutcomesCount: sampleSize,
        successRate: null,
        averageBrierScore: null,
        averageConfidence: null,
        calibrationError: null,
        hasEnoughData: false,
        statusMessage: `Not enough history yet (${sampleSize}/5 observations).`,
      });
      continue;
    }

    const successes = completedOutcomes.filter((f) => f.outcome?.result === 'successful' || f.outcome?.result === 'partially_successful').length;
    const successRate = parseFloat((successes / sampleSize).toFixed(3));
    const avgConfidence = parseFloat((completedOutcomes.reduce((s, f) => s + f.confidence, 0) / sampleSize).toFixed(3));

    const brierSum = completedOutcomes.reduce((s, f) => {
      const isSuccess = f.outcome?.result === 'successful' || f.outcome?.result === 'partially_successful' ? 1 : 0;
      return s + calculateBinaryBrierScore(f.overallScore, isSuccess);
    }, 0);

    const avgBrier = parseFloat((brierSum / sampleSize).toFixed(4));
    const calibErr = parseFloat(Math.abs((completedOutcomes.reduce((s, f) => s + f.overallScore, 0) / sampleSize) - successRate).toFixed(3));

    results.push({
      domain: dom,
      forecastCount: memoryForecasts.length,
      completedOutcomesCount: sampleSize,
      successRate,
      averageBrierScore: avgBrier,
      averageConfidence: avgConfidence,
      calibrationError: calibErr,
      hasEnoughData: true,
      statusMessage: `Calculated from ${sampleSize} completed observations.`,
    });
  }

  return results;
}

// 5. Personal Calibration Pattern Threshold Evaluator
export function evaluatePersonalPatternThresholds(sampleSize: number, delayedCount: number, domain: string): PersonalCalibrationPattern {
  if (sampleSize < 3) {
    return {
      patternStrength: 'NO_PATTERN',
      sampleSize,
      biasType: 'NONE',
      confidence: 0.30,
      explanation: `Insufficient history yet (${sampleSize}/3 minimum observations required to establish a pattern).`,
    };
  }

  let patternStrength: 'WEAK_PATTERN' | 'EMERGING_PATTERN' | 'STRONGER_PATTERN' = 'WEAK_PATTERN';
  if (sampleSize >= 10) patternStrength = 'STRONGER_PATTERN';
  else if (sampleSize >= 6) patternStrength = 'EMERGING_PATTERN';

  const lateRatio = delayedCount / sampleSize;

  if (lateRatio >= 0.5) {
    return {
      patternStrength,
      sampleSize,
      biasType: 'LATE_DEPARTURE',
      confidence: parseFloat(Math.min(0.60 + sampleSize * 0.03, 0.90).toFixed(2)),
      explanation: `Your recent ${domain} outcomes indicate departure buffers have been tighter than actual traffic delays require (${delayedCount} of ${sampleSize} trips delayed).`,
    };
  }

  return {
    patternStrength,
    sampleSize,
    biasType: 'OPTIMISTIC_ESTIMATION',
    confidence: 0.75,
    explanation: `Based on ${sampleSize} completed ${domain} observations, historical outcomes closely match model baseline expectations.`,
  };
}
