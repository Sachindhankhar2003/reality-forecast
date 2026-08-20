import { ForecastDomain } from '@/types/domain';

interface ClassificationResult {
  domain: ForecastDomain;
  confidence: number;
  reason: string;
}

export function classifyDomain(text: string): ClassificationResult {
  const lower = text.toLowerCase();

  if (/\b(interview|job|hiring|recruiter|technical round|hr round|resume)\b/.test(lower)) {
    return {
      domain: 'interview',
      confidence: 0.95,
      reason: 'Extracted keywords related to hiring, interview rounds, or candidate evaluation.',
    };
  }

  if (/\b(drive|car|flight|travel|metro|train|traffic|highway|trip|noida|delhi|gurgaon|airport)\b/.test(lower)) {
    return {
      domain: 'travel',
      confidence: 0.90,
      reason: 'Extracted transport, corridor, or travel route keywords.',
    };
  }

  if (/\b(hotel|booking|stay|resort|check-in|airbnb|room)\b/.test(lower)) {
    return {
      domain: 'hotel',
      confidence: 0.90,
      reason: 'Extracted accommodation and hotel stay keywords.',
    };
  }

  if (/\b(exam|test|certification|sat|gre|gate|upsc|grade|pass|fail)\b/.test(lower)) {
    return {
      domain: 'exam',
      confidence: 0.92,
      reason: 'Extracted academic assessment or certification exam keywords.',
    };
  }

  if (/\b(meeting|sync|standup|presentation|client call|zoom|demo)\b/.test(lower)) {
    return {
      domain: 'meeting',
      confidence: 0.88,
      reason: 'Extracted corporate meeting or presentation sync keywords.',
    };
  }

  if (/\b(event|conference|hackathon|wedding|concert|party)\b/.test(lower)) {
    return {
      domain: 'event',
      confidence: 0.85,
      reason: 'Extracted scheduled event or gathering keywords.',
    };
  }

  // Low confidence fallback to GENERIC
  return {
    domain: 'generic',
    confidence: 0.50,
    reason: 'No high-confidence domain-specific keywords matched. Defaulting to Generic domain strategy.',
  };
}
