import { EvidenceItem, NormalizedFactor, PipelineScenario } from './types';

export function calculateForecastScores(
  factors: NormalizedFactor[],
  evidenceList: EvidenceItem[],
  missingInfoCount: number
): {
  overallScore: number;
  confidence: number;
  uncertaintyExplanation: string;
  scenarios: PipelineScenario[];
} {
  // 1. Explicit Deterministic Formula Calculation
  const baseRate = 0.50; // Neutral prior
  let weightedSum = 0;
  let totalWeight = 0;

  for (const factor of factors) {
    const directionMult = factor.direction === 'POSITIVE' ? 1.0 : factor.direction === 'NEGATIVE' ? -0.8 : 0.0;
    weightedSum += factor.numericalValue * factor.weight * directionMult;
    totalWeight += factor.weight;
  }

  const factorContribution = totalWeight > 0 ? (weightedSum / totalWeight) * 0.35 : 0;
  const rawScore = baseRate + factorContribution;

  // Clamp overall situational index to [0.10, 0.95]
  const overallScore = Math.min(Math.max(rawScore, 0.10), 0.95);

  // 2. Confidence Engine Calculation (Distinct from probability!)
  const avgReliability = evidenceList.length > 0
    ? evidenceList.reduce((acc, ev) => acc + ev.reliability, 0) / evidenceList.length
    : 0.60;

  const missingInfoPenalty = missingInfoCount * 0.08;
  const rawConfidence = Math.min(Math.max(avgReliability - missingInfoPenalty, 0.40), 0.95);
  const confidence = parseFloat(rawConfidence.toFixed(2));

  let uncertaintyExplanation = 'High evidence freshness across Open-Meteo & TomTom corridor telemetry.';
  if (missingInfoCount > 0) {
    uncertaintyExplanation = `Confidence reduced due to ${missingInfoCount} missing context parameter(s).`;
  }

  // 3. Scenario Probability Distribution Generation
  // Mutually exclusive probabilities must sum to 1.00
  let pMostLikely = Math.min(Math.max(overallScore * 0.70, 0.40), 0.60);
  let pBestCase = Math.min(Math.max((1 - pMostLikely) * 0.60, 0.20), 0.35);
  let pNegative = Math.min(Math.max((1 - pMostLikely - pBestCase) * 0.75, 0.10), 0.25);
  let pUnexpected = 1.0 - (pMostLikely + pBestCase + pNegative);

  // Re-normalize probabilities so sum is exactly 1.00
  const totalP = pMostLikely + pBestCase + pNegative + pUnexpected;
  pMostLikely = parseFloat((pMostLikely / totalP).toFixed(2));
  pBestCase = parseFloat((pBestCase / totalP).toFixed(2));
  pNegative = parseFloat((pNegative / totalP).toFixed(2));
  pUnexpected = parseFloat((1.0 - (pMostLikely + pBestCase + pNegative)).toFixed(2));

  const scenarios: PipelineScenario[] = [
    {
      id: 'sc-most-likely',
      type: 'MOST_LIKELY',
      title: 'Standard Progression with Minor Corridor Delays',
      description: 'The plan executes as expected. Moderate commute congestion occurs but is managed within buffer limits.',
      probability: pMostLikely,
      confidence,
      impactScore: 0.70,
      controllability: 0.75,
      evidenceSummary: 'Supported by TomTom corridor telemetry and Open-Meteo stable weather forecast.',
      dependencies: ['Traffic corridor clearance', 'On-time departure'],
      recommendedActions: ['Keep GPS navigation active', 'Depart 20 mins early'],
    },
    {
      id: 'sc-best-case',
      type: 'BEST_CASE',
      title: 'Optimal Execution & Early Arrival',
      description: 'Traffic flow remains clear. You arrive 25+ minutes early, relaxed and fully prepared.',
      probability: pBestCase,
      confidence: parseFloat((confidence * 0.95).toFixed(2)),
      impactScore: 0.95,
      controllability: 0.85,
      evidenceSummary: 'Favorable alignment of transport and role match factors.',
      dependencies: ['Clear highway toll plaza', 'Zero traffic incidents'],
      recommendedActions: ['Use buffer time for key notes review'],
    },
    {
      id: 'sc-negative',
      type: 'NEGATIVE',
      title: 'Corridor Delay Causes Rushed Entry',
      description: 'Unexpected bottleneck on primary route consumes time buffer, causing arrival pressure.',
      probability: pNegative,
      confidence: parseFloat((confidence * 0.90).toFixed(2)),
      impactScore: -0.50,
      controllability: 0.60,
      evidenceSummary: 'Peak hour corridor delay vulnerability.',
      dependencies: ['DND Flyway congestion', 'Weather shift'],
      recommendedActions: ['Pre-save alternate Metro transit option'],
    },
    {
      id: 'sc-unexpected',
      type: 'UNEXPECTED',
      title: 'Format or Schedule Adjustment',
      description: 'Event schedule shift or venue entry requirement requires quick adaptation.',
      probability: pUnexpected,
      confidence: parseFloat((confidence * 0.75).toFixed(2)),
      impactScore: 0.10,
      controllability: 0.40,
      evidenceSummary: 'Baseline external environment volatility.',
      dependencies: ['Venue policy update'],
      recommendedActions: ['Keep contact info pre-saved on mobile'],
    },
  ];

  return {
    overallScore: parseFloat(overallScore.toFixed(2)),
    confidence,
    uncertaintyExplanation,
    scenarios,
  };
}
