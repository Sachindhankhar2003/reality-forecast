import { DomainPlugin } from '@/types/domain';

export const genericDomain: DomainPlugin = {
  id: 'generic',
  name: 'General Event / Plan',
  description: 'Versatile forecasting framework for general personal, business, or event plans.',
  iconName: 'Sparkles',
  badgeColor: 'var(--domain-business)',
  requiredContext: [
    { key: 'event_title', label: 'Plan Description', type: 'text', required: true },
    { key: 'planned_time', label: 'Planned Date / Time', type: 'datetime', required: true },
  ],
  optionalContext: [
    { key: 'location', label: 'Location / Platform', type: 'text', required: false },
  ],
  factors: [
    { name: 'preparation_level', label: 'Preparation Completeness', category: 'personal', defaultWeight: 0.35, description: 'Extent of overall readiness and action steps completed' },
    { name: 'environmental_factors', label: 'External Conditions', category: 'environmental', defaultWeight: 0.25, description: 'Weather, location, and third-party dependencies' },
    { name: 'time_buffer', label: 'Schedule Buffer', category: 'temporal', defaultWeight: 0.20, description: 'Margin built in for unexpected delays' },
    { name: 'contingency_readiness', label: 'Plan B Preparedness', category: 'logistical', defaultWeight: 0.20, description: 'Availability of fallback options if primary plan fails' },
  ],
  riskCategories: ['unforeseen_delay', 'dependency_failure', 'communication_misalignment', 'resource_shortage'],
  adviceRules: [
    {
      id: 'prepare_fallback',
      condition: 'contingency_readiness < 0.5',
      title: 'Establish Plan B Contingency',
      recommendation: 'Identify at least one alternative schedule or backup resource in case of friction.',
      expectedBenefit: 0.20,
      effort: 'moderate',
      urgency: 'medium',
    },
  ],
  contextPromptAdditions: 'Focus on overall goal clarity, dependency management, timeline flexibility, and risk mitigation.',
};
