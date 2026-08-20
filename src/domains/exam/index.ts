import { DomainPlugin } from '@/types/domain';

export const examDomain: DomainPlugin = {
  id: 'exam',
  name: 'Exam & Academic Plan',
  description: 'Forecast preparation readiness, time management, topic mastery, and test-day logistics.',
  iconName: 'GraduationCap',
  badgeColor: 'var(--domain-exam)',
  requiredContext: [
    { key: 'exam_name', label: 'Exam Title', type: 'text', required: true },
    { key: 'exam_date', label: 'Exam Date', type: 'datetime', required: true },
    { key: 'prep_hours_done', label: 'Hours Prepared So Far', type: 'number', required: true },
  ],
  optionalContext: [
    { key: 'target_score', label: 'Target Score / Grade', type: 'text', required: false },
  ],
  factors: [
    { name: 'syllabus_coverage', label: 'Syllabus Coverage', category: 'personal', defaultWeight: 0.40, description: 'Percentage of core syllabus topics thoroughly revised' },
    { name: 'practice_test_scores', label: 'Mock Test Performance', category: 'personal', defaultWeight: 0.30, description: 'Consistency across realistic timed practice exams' },
    { name: 'test_day_stamina', label: 'Rest & Mental Stamina', category: 'personal', defaultWeight: 0.15, description: 'Sleep quality and fatigue management before exam' },
    { name: 'logistical_center_access', label: 'Center Travel & Admit Card', category: 'logistical', defaultWeight: 0.15, description: 'Punctuality buffer and test center verification' },
  ],
  riskCategories: ['topic_weakness', 'time_crunch', 'exam_anxiety', 'test_center_delay'],
  adviceRules: [
    {
      id: 'focus_high_weight_topics',
      condition: 'syllabus_coverage < 0.8',
      title: 'Prioritize High-Yield Topics',
      recommendation: 'Spend remaining prep hours strictly on high-weightage weak chapters rather than re-reading strong areas.',
      expectedBenefit: 0.25,
      effort: 'significant',
      urgency: 'high',
    },
  ],
  contextPromptAdditions: 'Focus on syllabus mastery, active recall strategies, and test-day cognitive readiness. Never claim to guarantee pass/fail outcomes.',
};
