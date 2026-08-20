import { ForecastRecord, OutcomeItem, WhatIfRunItem } from '@/types/forecast';
import { generateFullForecast } from '@/services/forecast/forecast-engine';
import { runWhatIfSimulation } from '@/services/forecast/whatif-engine';
import { generateInterviewAnalysis, InterviewAnalysis } from '@/services/interview/interview-engine';

// Initial sample forecasts for instant demonstration
const sampleDelhiForecast: ForecastRecord = {
  id: 'fc-delhi-dev-101',
  userId: 'user-default',
  title: 'Software Developer Interview in Delhi (Travel by Car)',
  originalInput: 'Tomorrow I have a software developer interview in Delhi. I will travel by car.',
  domain: 'travel',
  status: 'ready',
  eventAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  location: 'Delhi NCR, India',
  summary: 'Live Open-Meteo & TomTom corridor analysis indicates 18 min traffic delay on peak highway stretches. High technical preparedness offset by commute timing risks.',
  overallScore: 0.68,
  confidence: 0.88,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  context: [
    { id: 'c1', key: 'domain', value: 'travel', source: 'inferred', confidence: 0.98 },
    { id: 'c2', key: 'destination', value: 'Delhi, India', source: 'extracted', confidence: 0.95 },
    { id: 'c3', key: 'travel_mode', value: 'car', source: 'user_input', confidence: 1.0 },
    { id: 'c4', key: 'role', value: 'Software Developer', source: 'extracted', confidence: 0.90 },
  ],
  sources: [
    {
      id: 's1',
      provider: 'open-meteo.com',
      dataType: 'weather',
      retrievedAt: new Date().toISOString(),
      confidence: 0.95,
      data: { condition: 'Partly Cloudy', temperatureC: 31, precipitationProbability: 15 },
    },
    {
      id: 's2',
      provider: 'tomtom-telemetry',
      dataType: 'traffic',
      retrievedAt: new Date().toISOString(),
      confidence: 0.90,
      data: { delayMins: 18, congestionLevel: 'moderate', incidentCount: 2 },
    },
  ],
  factors: [
    {
      id: 'f1',
      name: 'Traffic & Corridor Congestion',
      category: 'environmental',
      value: '18 min delay on Delhi NCR highway corridor',
      normalizedValue: 0.55,
      weight: 0.35,
      impact: 'negative',
      evidence: 'Live traffic telemetry indicates peak morning congestion bottlenecks.',
    },
    {
      id: 'f2',
      name: 'Weather & Visibility',
      category: 'environmental',
      value: '31°C, 15% rain probability, clear road visibility',
      normalizedValue: 0.85,
      weight: 0.20,
      impact: 'positive',
      evidence: 'Open-Meteo 16-day forecast confirms stable road conditions.',
    },
    {
      id: 'f3',
      name: 'Technical Preparation',
      category: 'technical',
      value: 'Data structures & system design notes reviewed',
      normalizedValue: 0.80,
      weight: 0.25,
      impact: 'positive',
      evidence: 'Candidate profile shows strong match for software developer role requirements.',
    },
    {
      id: 'f4',
      name: 'Time Buffer Margin',
      category: 'temporal',
      value: 'Estimated 15 min buffer before scheduled venue entry',
      normalizedValue: 0.50,
      weight: 0.20,
      impact: 'neutral',
      evidence: 'Tight buffer window leaves limited slack for unexpected roadblocks.',
    },
  ],
  scenarios: [
    {
      id: 'sc-best-1',
      type: 'best_case',
      title: 'Optimal Commute & Clear Focus',
      description: 'Traffic bottlenecks resolve quickly. You arrive 25 minutes prior to appointment, relaxed and fully focused for the technical assessment.',
      probability: 0.25,
      confidence: 0.85,
      impactScore: 0.90,
      controllability: 0.75,
      evidence: 'High technical readiness combined with off-peak traffic window.',
      recommendedActions: ['Depart 25 minutes earlier than scheduled', 'Review system design bullet points during buffer'],
    },
    {
      id: 'sc-likely-1',
      type: 'most_likely',
      title: 'On-Time Arrival with Highway Delay',
      description: 'Moderate highway congestion consumes most of your buffer. Arrival occurs 5 minutes before scheduled start time.',
      probability: 0.52,
      confidence: 0.90,
      impactScore: 0.60,
      controllability: 0.65,
      evidence: 'Historical corridor traffic telemetry for Delhi morning peak hours.',
      recommendedActions: ['Keep live GPS navigation active', 'Pre-save recruiter contact number'],
    },
    {
      id: 'sc-neg-1',
      type: 'negative',
      title: 'Severe Bottleneck & Arrival Rush',
      description: 'Major traffic incident adds 35+ minutes of delay, causing time pressure during opening interview questions.',
      probability: 0.18,
      confidence: 0.80,
      impactScore: -0.65,
      controllability: 0.50,
      evidence: 'Single-corridor vulnerability with limited alternate arterial roads.',
      recommendedActions: ['Depart early to build 45 min buffer', 'Identify nearby Metro station as backup'],
    },
    {
      id: 'sc-unex-1',
      type: 'unexpected',
      title: 'Sudden Route Diversion or Schedule Shift',
      description: 'Road blockade or interviewer schedule change requires immediate adaptation.',
      probability: 0.05,
      confidence: 0.60,
      impactScore: -0.40,
      controllability: 0.30,
      evidence: 'Urban transit volatility.',
      recommendedActions: ['Ensure smartphone battery is 100% charged', 'Have video call link pre-saved'],
    },
  ],
  risks: [
    {
      id: 'r1',
      title: 'Delhi Highway Traffic Congestion',
      description: 'Current telemetry indicates 18 min delay along Delhi access highway. Depart early to avoid time pressure.',
      category: 'timing',
      likelihood: 0.65,
      impact: 0.80,
      controllability: 0.60,
      timeSensitivity: 0.85,
      severity: 'high',
      compositeScore: 0.35,
      mitigation: 'Advance departure by 25-30 minutes or switch to Delhi Metro.',
      evidence: 'TomTom traffic telemetry.',
    },
    {
      id: 'r2',
      title: 'System Design Architecture Deep-Dive Gap',
      description: 'High-throughput caching questions may require additional preparation.',
      category: 'technical',
      likelihood: 0.30,
      impact: 0.75,
      controllability: 0.85,
      timeSensitivity: 0.90,
      severity: 'medium',
      compositeScore: 0.22,
      mitigation: 'Complete 30-min system design refresher on distributed caching.',
      evidence: 'Job description technical skills requirement.',
    },
  ],
  advice: [
    {
      id: 'adv-1',
      title: 'Advance Departure by 25 Mins',
      description: 'Departing 25 minutes earlier avoids peak congestion windows and increases on-time arrival probability significantly.',
      expectedBenefit: 0.18,
      effort: 'minimal',
      urgency: 'high',
      controllability: 0.90,
      relatedRiskId: 'r1',
    },
    {
      id: 'adv-2',
      title: 'Identify Direct Metro / Express Rail Alternative',
      description: 'Keep a pre-saved transit route on hand in case highway congestion worsens past tolerance thresholds.',
      expectedBenefit: 0.10,
      effort: 'minimal',
      urgency: 'medium',
      controllability: 0.95,
    },
  ],
  whatIfRuns: [],
};

// Global Store
class ForecastStore {
  private forecasts: Map<string, ForecastRecord> = new Map();
  private interviews: Map<string, InterviewAnalysis> = new Map();

  constructor() {
    this.forecasts.set(sampleDelhiForecast.id, sampleDelhiForecast);
    const sampleIntv = generateInterviewAnalysis('Google Delhi', 'Software Developer');
    this.interviews.set(sampleIntv.id, sampleIntv);
  }

  async createForecastFromNL(input: string): Promise<ForecastRecord> {
    const record = await generateFullForecast(input);
    this.forecasts.set(record.id, record);
    return record;
  }

  getForecast(id: string): ForecastRecord | undefined {
    return this.forecasts.get(id);
  }

  getAllForecasts(): ForecastRecord[] {
    return Array.from(this.forecasts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addWhatIfRun(forecastId: string, whatIfInput: string): WhatIfRunItem | undefined {
    const forecast = this.forecasts.get(forecastId);
    if (!forecast) return undefined;

    const run = runWhatIfSimulation(forecast, whatIfInput);
    if (!forecast.whatIfRuns) {
      forecast.whatIfRuns = [];
    }
    forecast.whatIfRuns.unshift(run);
    return run;
  }

  recordOutcome(forecastId: string, outcome: OutcomeItem): ForecastRecord | undefined {
    const forecast = this.forecasts.get(forecastId);
    if (!forecast) return undefined;

    forecast.outcome = outcome;
    forecast.status = 'resolved';
    return forecast;
  }

  getInterview(id: string): InterviewAnalysis | undefined {
    return this.interviews.get(id);
  }

  getAllInterviews(): InterviewAnalysis[] {
    return Array.from(this.interviews.values());
  }

  createInterview(company: string, role: string, jd?: string): InterviewAnalysis {
    const intv = generateInterviewAnalysis(company, role, jd);
    this.interviews.set(intv.id, intv);
    return intv;
  }
}

// Singleton global instance
export const forecastStore = new ForecastStore();
