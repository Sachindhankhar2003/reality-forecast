import { ForecastDomain } from '@/types/domain';

export interface ExtractedIntent {
  primaryActivity: string;
  domain: ForecastDomain;
  confidence: number;
  dateRaw?: string;
  timeRaw?: string;
  originRaw?: string;
  destinationRaw?: string;
  transportRaw?: string;
  roleRaw?: string;
  companyRaw?: string;
  unknowns: string[];
}

export interface ResolvedTemporal {
  targetDate?: string; // YYYY-MM-DD
  targetTime?: string; // HH:mm
  isoTimestamp?: string;
  isAmbiguous: boolean;
  explanation: string;
}

export interface MissingInfoItem {
  field: string;
  label: string;
  category: 'REQUIRED' | 'USEFUL' | 'OPTIONAL';
  informationValue: number; // 0.0 to 1.0
  question: string;
}

export interface EvidenceItem {
  id: string;
  source: 'USER_PROVIDED' | 'WEATHER' | 'TRAFFIC' | 'USER_MEMORY' | 'SEARCH' | 'SYSTEM';
  providerName: string;
  retrievedAt: string;
  relevance: number; // 0.0 to 1.0
  reliability: number; // 0.0 to 1.0
  freshnessScore: number; // 0.0 to 1.0
  data: Record<string, any>;
}

export interface NormalizedFactor {
  id: string;
  name: string;
  category: string;
  direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  strength: 'VERY_WEAK' | 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG';
  numericalValue: number; // 0.0 to 1.0
  weight: number;
  explanation: string;
  evidenceId?: string;
}

export interface PipelineScenario {
  id: string;
  type: 'BEST_CASE' | 'MOST_LIKELY' | 'NEGATIVE' | 'UNEXPECTED';
  title: string;
  description: string;
  probability: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  impactScore: number; // -1.0 to 1.0
  controllability: number; // 0.0 to 1.0
  evidenceSummary: string;
  dependencies: string[];
  recommendedActions: string[];
}

export interface PipelineRisk {
  id: string;
  title: string;
  description: string;
  category: string;
  likelihood: number; // 0.0 to 1.0
  impact: number; // 0.0 to 1.0
  controllability: number; // 0.0 to 1.0
  timeSensitivity: number; // 0.0 to 1.0
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  compositeScore: number; // 0 to 10
  mitigation: string;
}

export interface PipelineAdvice {
  id: string;
  title: string;
  description: string;
  expectedBenefit: number; // estimated score bump 0.0 to 1.0
  effort: 'MINIMAL' | 'MODERATE' | 'SIGNIFICANT';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
  controllability: number;
  priorityScore: number;
  relatedRiskId?: string;
}

export interface ForecastSnapshot {
  modelVersion: string;
  version: number;
  createdAt: string;
  originalInput: string;
  intent: ExtractedIntent;
  temporal: ResolvedTemporal;
  missingInfo: MissingInfoItem[];
  evidence: EvidenceItem[];
  factors: NormalizedFactor[];
  scenarios: PipelineScenario[];
  risks: PipelineRisk[];
  advice: PipelineAdvice[];
  overallScore: number;
  confidence: number;
  uncertaintyExplanation: string;
}
