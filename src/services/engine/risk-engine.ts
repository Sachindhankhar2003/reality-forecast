import { PipelineRisk } from './types';

export function generateRiskMatrix(
  domain: string,
  factors: any[],
  location: string
): PipelineRisk[] {
  const risks: PipelineRisk[] = [];

  if (domain === 'travel' || domain === 'interview') {
    const likelihood = 0.65;
    const impact = 0.80;
    const controllability = 0.70;
    const timeSensitivity = 0.90;

    // Composite formula: Likelihood * Impact * (1 - Controllability) * Time Sensitivity * 10
    const compositeScore = parseFloat(
      (likelihood * impact * (1 - controllability * 0.5) * timeSensitivity * 10).toFixed(1)
    );

    risks.push({
      id: `risk-traffic-${Date.now()}`,
      title: 'Corridor Traffic & Toll Congestion',
      description: `Peak morning congestion on highway route to ${location} may consume time buffer.`,
      category: 'Travel & Logistics',
      likelihood,
      impact,
      controllability,
      timeSensitivity,
      severity: compositeScore >= 4.5 ? 'HIGH' : compositeScore >= 2.5 ? 'MEDIUM' : 'LOW',
      compositeScore,
      mitigation: 'Advance departure by 25-30 minutes and keep Delhi Metro fallback ready.',
    });
  }

  if (domain === 'interview' || domain === 'exam') {
    const likelihood = 0.40;
    const impact = 0.75;
    const controllability = 0.85;
    const timeSensitivity = 0.60;

    const compositeScore = parseFloat(
      (likelihood * impact * (1 - controllability * 0.5) * timeSensitivity * 10).toFixed(1)
    );

    risks.push({
      id: `risk-prep-${Date.now()}`,
      title: 'Technical Architecture Deep-Dive Gap',
      description: 'System design questions on caching or micro-services may present a preparation gap.',
      category: 'Technical Preparation',
      likelihood,
      impact,
      controllability,
      timeSensitivity,
      severity: compositeScore >= 4.5 ? 'HIGH' : compositeScore >= 2.5 ? 'MEDIUM' : 'LOW',
      compositeScore,
      mitigation: 'Complete a 30-minute targeted review of system design architecture patterns.',
    });
  }

  return risks;
}
