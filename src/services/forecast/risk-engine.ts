import { ForecastDomain } from '@/types/domain';
import { ForecastFactorItem, RiskItem } from '@/types/forecast';
import { TrafficData, WeatherData } from '@/providers/types';

export function calculateRisks(
  factors: ForecastFactorItem[],
  domain: ForecastDomain,
  trafficData?: TrafficData,
  weatherData?: WeatherData
): RiskItem[] {
  const risks: RiskItem[] = [];

  // Risk 1: Traffic Congestion & Delay Risk
  const delayMins = trafficData?.delayMins ?? 15;
  const trafficLikelihood = Math.min(0.90, Math.max(0.20, delayMins / 30));
  const trafficImpact = 0.80;
  const trafficControllability = 0.60; // High controllability if user leaves earlier
  const trafficTimeSens = 0.85;

  const trafficComposite = Number(
    (trafficLikelihood * trafficImpact * (1 - trafficControllability * 0.5) * trafficTimeSens).toFixed(2)
  );

  risks.push({
    id: 'risk-traffic-delay',
    title: 'Peak-Hour Traffic Congestion & Bottlenecks',
    description: `Corridor traffic currently shows a ${delayMins} min delay with ${trafficData?.congestionLevel || 'moderate'} congestion. Leaving as scheduled risks late arrival.`,
    category: 'timing',
    likelihood: trafficLikelihood,
    impact: trafficImpact,
    controllability: trafficControllability,
    timeSensitivity: trafficTimeSens,
    severity: trafficComposite > 0.4 ? 'high' : 'medium',
    compositeScore: trafficComposite,
    mitigation: 'Depart 25-30 minutes earlier or switch to rail transit.',
    evidence: `Real-time traffic telemetry indicates ${delayMins} minutes congestion delay along travel corridor.`,
  });

  // Risk 2: Weather & Environmental Disruption Risk
  const precipProb = weatherData?.precipitationProbability ?? 20;
  const weatherLikelihood = Number((precipProb / 100).toFixed(2));
  const weatherImpact = 0.60;
  const weatherControllability = 0.30; // Harder to control weather
  const weatherTimeSens = 0.50;

  const weatherComposite = Number(
    (weatherLikelihood * weatherImpact * (1 - weatherControllability * 0.5) * weatherTimeSens).toFixed(2)
  );

  risks.push({
    id: 'risk-weather-rain',
    title: 'Adverse Weather & Reduced Road Visibility',
    description: `Precipitation probability is ${precipProb}%. Wet roads reduce average driving speeds by 15-20%.`,
    category: 'environmental',
    likelihood: weatherLikelihood,
    impact: weatherImpact,
    controllability: weatherControllability,
    timeSensitivity: weatherTimeSens,
    severity: weatherComposite > 0.35 ? 'medium' : 'low',
    compositeScore: weatherComposite,
    mitigation: 'Check vehicle wipers, allow increased braking distance, monitor live radar.',
    evidence: `Open-Meteo forecast indicates ${precipProb}% rain probability during travel timeframe.`,
  });

  // Risk 3: Domain-specific risk (Interview / Event)
  if (domain === 'interview') {
    const techFactor = factors.find((f) => f.id === 'factor-tech-prep');
    const techLikelihood = techFactor ? 1 - techFactor.normalizedValue : 0.30;
    const techImpact = 0.85;
    const techControllability = 0.80; // Highly controllable by user studying
    const techTimeSens = 0.90;

    const techComposite = Number(
      (techLikelihood * techImpact * (1 - techControllability * 0.5) * techTimeSens).toFixed(2)
    );

    risks.push({
      id: 'risk-interview-tech-gap',
      title: 'Technical Deep-Dive Topic Friction',
      description: 'System design architecture or low-level framework questions may expose preparation gaps if unaddressed.',
      category: 'technical',
      likelihood: Number(techLikelihood.toFixed(2)),
      impact: techImpact,
      controllability: techControllability,
      timeSensitivity: techTimeSens,
      severity: techComposite > 0.3 ? 'high' : 'medium',
      compositeScore: techComposite,
      mitigation: 'Conduct 45-min rapid review of core data structures, trade-offs, and system design patterns.',
      evidence: 'Job description emphasizes core software developer architecture principles.',
    });
  } else {
    // Risk 3 Generic: Contingency & Buffer Risk
    risks.push({
      id: 'risk-contingency-gap',
      title: 'Insufficient Buffer Margin for Unexpected Delays',
      description: 'Tight scheduling window leaves minimal cushion if an unexpected bottleneck occurs.',
      category: 'logistical',
      likelihood: 0.35,
      impact: 0.65,
      controllability: 0.70,
      timeSensitivity: 0.60,
      severity: 'medium',
      compositeScore: 0.28,
      mitigation: 'Add 15 minutes of buffer time to your schedule.',
      evidence: 'Schedule window allocates limited slack for unforeseen interruptions.',
    });
  }

  // Sort risks by composite score descending
  return risks.sort((a, b) => b.compositeScore - a.compositeScore);
}
