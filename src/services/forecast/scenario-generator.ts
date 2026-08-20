import { ForecastDomain } from '@/types/domain';
import { ForecastFactorItem, ScenarioItem } from '@/types/forecast';

export function generateScenarios(
  overallScore: number,
  factors: ForecastFactorItem[],
  domain: ForecastDomain
): ScenarioItem[] {
  // Compute mathematical probability distribution
  // Probabilities sum to <= 1.0 (communicating uncertainty)
  const isInterview = domain === 'interview';
  const isTravel = domain === 'travel';

  // Base estimates
  const mostLikelyProb = Math.min(0.65, Math.max(0.40, overallScore * 0.70));
  const bestCaseProb = Math.min(0.35, Math.max(0.15, overallScore * 0.35));
  const negativeProb = Math.min(0.30, Math.max(0.10, (1 - overallScore) * 0.40));
  const unexpectedProb = Number((1 - (mostLikelyProb + bestCaseProb + negativeProb)).toFixed(2));
  const validUnexpectedProb = Math.max(0.05, Math.min(0.15, unexpectedProb));

  const scenarios: ScenarioItem[] = [
    {
      id: 'sc-best',
      type: 'best_case',
      title: isInterview ? 'Optimal Preparation & Flawless Timing' : isTravel ? 'Clear Roads & Early Arrival' : 'Smooth Execution',
      description: isInterview
        ? 'Traffic flows smoothly with zero delays. You arrive 20 minutes early, relaxed and focused. Technical questions align with your strongest projects, leading to a confident, high-impact interview session.'
        : isTravel
        ? 'Traffic delays remain minimal. Optimal green wave signals allow seamless transit, arriving 25 minutes prior to scheduled commitment.'
        : 'All external dependencies function seamlessly with early completion.',
      probability: isInterview ? null : Number(bestCaseProb.toFixed(2)), // Non-numerical for hiring!
      confidence: 0.85,
      impactScore: 0.90,
      controllability: 0.75,
      evidence: 'High technical preparedness and optimal weather conditions.',
      recommendedActions: [
        'Maintain current departure time schedule',
        'Review high-priority STAR story talking points',
      ],
    },
    {
      id: 'sc-most-likely',
      type: 'most_likely',
      title: isInterview ? 'On-Time Arrival with Minor Bottlenecks' : isTravel ? 'Standard Route Delay Managed' : 'Expected Plan Progression',
      description: isInterview
        ? 'Occasional traffic congestion on major corridors causes a 12-15 minute delay, but planned buffer ensures on-time arrival. Interview covers standard technical and situational questions with solid performance.'
        : isTravel
        ? 'Moderate congestion slows down key highway stretches, consuming most of your buffer time. Arrival occurs within 5 minutes of target schedule.'
        : 'Normal operational progress with manageable friction.',
      probability: isInterview ? null : Number(mostLikelyProb.toFixed(2)),
      confidence: 0.90,
      impactScore: 0.60,
      controllability: 0.65,
      evidence: 'Corridor traffic telemetry confirms peak-hour congestion patterns.',
      recommendedActions: [
        'Keep live GPS navigation active during drive',
        'Have recruiter contact phone number ready in speed dial',
      ],
    },
    {
      id: 'sc-negative',
      type: 'negative',
      title: isInterview ? 'Heavy Congestion & Time Pressure' : isTravel ? 'Severe Bottleneck & Prolonged Delay' : 'Friction & Delay Scenario',
      description: isInterview
        ? 'Unforeseen traffic congestion or route incident delays arrival by 30+ minutes, creating time pressure. Rush to venue impacts initial composure during opening questions.'
        : isTravel
        ? 'Heavy bottleneck leads to 35+ minute route delay, causing missed appointment window.'
        : 'Dependencies fail or experience significant timeline extension.',
      probability: isInterview ? null : Number(negativeProb.toFixed(2)),
      confidence: 0.80,
      impactScore: -0.70,
      controllability: 0.50,
      evidence: 'Traffic density spike during morning peak hours combined with limited route alternatives.',
      recommendedActions: [
        'Depart 25 minutes earlier than originally planned',
        'Identify metro or alternative bypass route',
      ],
    },
    {
      id: 'sc-unexpected',
      type: 'unexpected',
      title: 'Unexpected Event (Route Closure or Schedule Shift)',
      description: 'An unexpected road closure, sudden weather squall, or interviewer schedule shift forces immediate adaptation to alternative arrangements.',
      probability: isInterview ? null : Number(validUnexpectedProb.toFixed(2)),
      confidence: 0.60,
      impactScore: -0.50,
      controllability: 0.30,
      evidence: 'Historical variance in urban travel corridors and weather volatility.',
      recommendedActions: [
        'Ensure smartphone is fully charged with offline maps saved',
        'Keep virtual meeting link handy as remote fallback option',
      ],
    },
  ];

  return scenarios;
}
