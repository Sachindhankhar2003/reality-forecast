import { DomainPlugin } from '@/types/domain';

export const interviewDomain: DomainPlugin = {
  id: 'interview',
  name: 'Interview & Role Readiness',
  description: 'Evaluate technical preparation, role match, behavioral readiness, and key topic alignment.',
  iconName: 'Briefcase',
  badgeColor: 'var(--domain-interview)',
  requiredContext: [
    { key: 'target_company', label: 'Company Name', type: 'text', required: true },
    { key: 'role_title', label: 'Role Title', type: 'text', required: true },
    { key: 'interview_type', label: 'Interview Type', type: 'enum', options: ['technical', 'system_design', 'behavioral', 'hr_screening', 'hiring_manager'], required: true },
    { key: 'location_or_mode', label: 'Mode', type: 'enum', options: ['in_person', 'video_call', 'phone'], required: true },
  ],
  optionalContext: [
    { key: 'job_description', label: 'Job Description Text', type: 'text', required: false },
    { key: 'user_experience_years', label: 'Years of Relevant Experience', type: 'number', required: false },
    { key: 'key_skills', label: 'Top Technical Skills', type: 'text', required: false },
  ],
  factors: [
    { name: 'technical_match', label: 'Technical Skill Alignment', category: 'technical', defaultWeight: 0.35, description: 'Overlap between user technical profile and core role requirements' },
    { name: 'behavioral_preparedness', label: 'Behavioral Readiness', category: 'personal', defaultWeight: 0.25, description: 'Structure and depth of STAR stories for key competency questions' },
    { name: 'company_knowledge', label: 'Company & Business Insight', category: 'personal', defaultWeight: 0.15, description: 'Understanding of company products, engineering culture, and domain' },
    { name: 'logistical_punctuality', label: 'Interview Logistics', category: 'logistical', defaultWeight: 0.15, description: 'Commute/setup buffer and environmental readiness' },
    { name: 'communication_clarity', label: 'Communication & Delivery', category: 'personal', defaultWeight: 0.10, description: 'Clarity, conciseness, and confidence in articulation' },
  ],
  riskCategories: ['technical_gaps', 'system_design_rust', 'time_mismanagement', 'commute_delay', 'audio_video_failure'],
  adviceRules: [
    {
      id: 'mock_system_design',
      condition: 'interview_type === "system_design"',
      title: 'Practice Architecture Diagramming',
      recommendation: 'Complete a timed 45-min system design mock focusing on scalability bottlenecks.',
      expectedBenefit: 0.28,
      effort: 'significant',
      urgency: 'high',
    },
    {
      id: 'star_stories',
      condition: 'behavioral_preparedness < 0.7',
      title: 'Refine 4 Core STAR Stories',
      recommendation: 'Prepare 4 concise STAR stories highlighting problem solving, conflict resolution, and leadership.',
      expectedBenefit: 0.20,
      effort: 'moderate',
      urgency: 'high',
    },
    {
      id: 'company_research',
      condition: 'company_knowledge < 0.6',
      title: 'Review Recent Company Engineering Blogs',
      recommendation: 'Read 2 recent tech blog posts or release notes from the hiring company.',
      expectedBenefit: 0.15,
      effort: 'minimal',
      urgency: 'medium',
    },
  ],
  contextPromptAdditions: 'Focus on topic alignment, preparation completeness, behavioral story readiness, and technical confidence. NEVER claim to predict hiring decisions directly.',
};
