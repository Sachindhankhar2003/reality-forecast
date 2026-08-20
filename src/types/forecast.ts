import { ForecastDomain } from './domain';

export type ForecastStatus = 'draft' | 'analyzing' | 'ready' | 'outdated' | 'resolved' | 'archived';

export interface ForecastContextItem {
  id: string;
  key: string;
  value: string;
  source: 'user_input' | 'extracted' | 'inferred' | 'external';
  confidence: number;
}

export interface DataSourceItem {
  id: string;
  provider: string;
  dataType: string;
  retrievedAt: string;
  confidence: number;
  data: Record<string, unknown>;
}

export interface ForecastFactorItem {
  id: string;
  name: string;
  category: string;
  value: string;
  normalizedValue: number; // 0.0 to 1.0 (1.0 = best possible condition)
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  evidence: string;
}

export interface ScenarioItem {
  id: string;
  type: 'best_case' | 'most_likely' | 'negative' | 'unexpected';
  title: string;
  description: string;
  probability: number | null; // 0.0 to 1.0
  confidence: number;
  impactScore: number; // -1.0 to 1.0
  controllability: number; // 0.0 to 1.0
  evidence: string;
  recommendedActions?: string[];
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  likelihood: number; // 0.0 to 1.0
  impact: number; // 0.0 to 1.0
  controllability: number; // 0.0 to 1.0
  timeSensitivity: number; // 0.0 to 1.0
  severity: 'low' | 'medium' | 'high' | 'critical';
  compositeScore: number; // likelihood * impact * (1 - controllability)
  mitigation: string;
  evidence?: string;
}

export interface AdviceItem {
  id: string;
  title: string;
  description: string;
  expectedBenefit: number; // e.g. 0.15 (+15%)
  effort: 'minimal' | 'moderate' | 'significant';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  controllability: number;
  relatedRiskId?: string;
  accepted?: boolean;
}

export interface WhatIfRunItem {
  id: string;
  userInput: string;
  summary: string;
  deltaScore: number;
  createdAt: string;
  modifiedFactors: { factorName: string; originalValue: string; modifiedValue: string }[];
  scenarios: ScenarioItem[];
}

export interface OutcomeItem {
  id: string;
  result: 'successful' | 'partially_successful' | 'unsuccessful' | 'delayed' | 'cancelled' | 'unexpected' | 'custom';
  customResult?: string;
  notes?: string;
  recordedAt: string;
  accuracyScore?: number;
  scenarioMatchId?: string;
  lessons?: string;
}

export interface ForecastRecord {
  id: string;
  userId: string;
  title: string;
  originalInput: string;
  domain: ForecastDomain;
  status: ForecastStatus;
  eventAt?: string;
  location?: string;
  summary: string;
  overallScore: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  createdAt: string;
  updatedAt: string;
  context: ForecastContextItem[];
  sources: DataSourceItem[];
  factors: ForecastFactorItem[];
  scenarios: ScenarioItem[];
  risks: RiskItem[];
  advice: AdviceItem[];
  whatIfRuns?: WhatIfRunItem[];
  outcome?: OutcomeItem;
}
