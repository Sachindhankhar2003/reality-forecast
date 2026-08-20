import { DomainPlugin } from '@/types/domain';

export const meetingDomain: DomainPlugin = {
  id: 'meeting',
  name: 'Meeting & Presentation',
  description: 'Evaluate agenda clarity, stakeholder alignment, deck/demo readiness, and timing risks.',
  iconName: 'Calendar',
  badgeColor: 'var(--domain-meeting)',
  requiredContext: [
    { key: 'meeting_title', label: 'Meeting Title / Objective', type: 'text', required: true },
    { key: 'meeting_time', label: 'Meeting Time', type: 'datetime', required: true },
    { key: 'attendees', label: 'Key Stakeholders / Roles', type: 'text', required: true },
  ],
  optionalContext: [
    { key: 'meeting_type', label: 'Type', type: 'enum', options: ['sales_pitch', 'internal_review', 'executive_brief', 'client_demo'], required: false },
  ],
  factors: [
    { name: 'agenda_alignment', label: 'Agenda & Decision Goal', category: 'personal', defaultWeight: 0.35, description: 'Clear explicit decision goals for the session' },
    { name: 'material_readiness', label: 'Deck & Demo Preparation', category: 'technical', defaultWeight: 0.30, description: 'Completeness and dry-run testing of slides/demos' },
    { name: 'stakeholder_buyin', label: 'Pre-meeting Alignment', category: 'personal', defaultWeight: 0.20, description: 'Prior standard alignment with key decision makers' },
    { name: 'tech_setup', label: 'AV & Conferencing Setup', category: 'technical', defaultWeight: 0.15, description: 'Reliability of link, hardware, and screen share' },
  ],
  riskCategories: ['overrunning_time', 'demo_failure', 'unaligned_stakeholders', 'missing_decision_maker'],
  adviceRules: [
    {
      id: 'pre_align_key_stakeholder',
      condition: 'stakeholder_buyin < 0.6',
      title: 'Send 5-min Pre-meeting Alignment Note',
      recommendation: 'Brief key decision maker 1 hour before to address friction points privately.',
      expectedBenefit: 0.25,
      effort: 'minimal',
      urgency: 'high',
    },
  ],
  contextPromptAdditions: 'Focus on meeting objectives, decision framing, demo risk prevention, and timekeeping.',
};
