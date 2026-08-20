export type ForecastDomain =
  | 'travel'
  | 'interview'
  | 'hotel'
  | 'exam'
  | 'meeting'
  | 'event'
  | 'weather'
  | 'business'
  | 'sports'
  | 'finance'
  | 'personal'
  | 'generic';

export interface ContextField {
  key: string;
  label: string;
  type: 'text' | 'datetime' | 'location' | 'number' | 'enum';
  options?: string[];
  required: boolean;
  description?: string;
}

export interface FactorDefinition {
  name: string;
  label: string;
  category: 'environmental' | 'temporal' | 'personal' | 'logistical' | 'financial' | 'technical';
  defaultWeight: number; // 0.0 to 1.0
  description: string;
}

export interface AdviceRule {
  id: string;
  condition: string; // e.g. "traffic_density > 0.7"
  title: string;
  recommendation: string;
  expectedBenefit: number; // estimated score bump (0.0 to 1.0)
  effort: 'minimal' | 'moderate' | 'significant';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
}

export interface DomainPlugin {
  id: ForecastDomain;
  name: string;
  description: string;
  iconName: string;
  badgeColor: string;
  requiredContext: ContextField[];
  optionalContext: ContextField[];
  factors: FactorDefinition[];
  riskCategories: string[];
  adviceRules: AdviceRule[];
  contextPromptAdditions: string;
}
