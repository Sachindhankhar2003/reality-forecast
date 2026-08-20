import { PersonalBiasAnalysis } from './outcome-analyzer';

export interface PersonalAdjustmentResult {
  baselineScore: number;
  personalAdjustment: number;
  finalScore: number;
  adjustmentExplanation: string;
  isOverridePrevented: boolean;
}

export function calculatePersonalAdjustment(
  baselineScore: number,
  biasAnalysis: PersonalBiasAnalysis,
  liveEvidenceCongestion: boolean = false
): PersonalAdjustmentResult {
  // 1. If sample size is insufficient, adjustment is 0
  if (biasAnalysis.patternStrength === 'NO_PATTERN') {
    return {
      baselineScore,
      personalAdjustment: 0,
      finalScore: baselineScore,
      adjustmentExplanation: 'Baseline forecast unadjusted (insufficient historical data).',
      isOverridePrevented: false,
    };
  }

  // 2. Compute raw adjustment based on bias analysis
  let rawAdjustment = biasAnalysis.averageScoreError * biasAnalysis.confidence;

  // 3. Boundary Rule (Item 48): Live evidence MUST win over historical optimism/bias!
  let isOverridePrevented = false;
  if (liveEvidenceCongestion && rawAdjustment > 0) {
    rawAdjustment = 0; // Prevent positive historical bias from overriding severe live traffic
    isOverridePrevented = true;
  }

  // 4. Bounded Adjustment Limits [-0.15, +0.15] (Item 17)
  const boundedAdjustment = parseFloat(
    Math.min(Math.max(rawAdjustment, -0.15), 0.15).toFixed(2)
  );

  const finalScore = parseFloat(
    Math.min(Math.max(baselineScore + boundedAdjustment, 0.05), 0.95).toFixed(2)
  );

  let explanation = `Applied personal historical bias adjustment of ${boundedAdjustment > 0 ? '+' : ''}${boundedAdjustment} based on ${biasAnalysis.sampleSize} past outcomes.`;
  if (isOverridePrevented) {
    explanation = 'Personal historical optimism adjustment suppressed due to severe real-time corridor congestion.';
  }

  return {
    baselineScore,
    personalAdjustment: boundedAdjustment,
    finalScore,
    adjustmentExplanation: explanation,
    isOverridePrevented,
  };
}
