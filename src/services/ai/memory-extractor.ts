import { sanitizeInput } from '@/lib/security';

export interface MemoryCandidate {
  category: 'Transport' | 'Interview' | 'Habits' | 'Goals' | 'Preferences';
  key: string;
  value: string;
  confidence: number;
}

export function extractMemoryCandidates(userMessage: string): MemoryCandidate[] {
  const sanitized = sanitizeInput(userMessage);
  const lower = sanitized.toLowerCase();
  const candidates: MemoryCandidate[] = [];

  // Reject sensitive keywords or auth tokens instantly
  if (
    lower.includes('password') ||
    lower.includes('secret') ||
    lower.includes('api_key') ||
    lower.includes('token') ||
    lower.includes('bearer') ||
    lower.includes('auth_') ||
    lower.includes('private_key')
  ) {
    return [];
  }

  // 1. Transport preference pattern
  if (
    lower.includes('usually travel') ||
    lower.includes('prefer metro') ||
    lower.includes('drive car') ||
    lower.includes('take train') ||
    lower.includes('commute by')
  ) {
    let mode = 'car';
    if (lower.includes('metro')) mode = 'metro';
    else if (lower.includes('train')) mode = 'train';
    else if (lower.includes('cab') || lower.includes('uber')) mode = 'cab';

    candidates.push({
      category: 'Transport',
      key: 'preferred_mode',
      value: `User stated transport preference: ${mode}`,
      confidence: 0.9,
    });
  }

  // 2. Career & Role preference pattern
  if (
    lower.includes('prefer backend') ||
    lower.includes('prefer frontend') ||
    lower.includes('full stack') ||
    lower.includes('system design') ||
    lower.includes('preparing for')
  ) {
    let role = 'Software Engineer';
    if (lower.includes('backend')) role = 'Backend Engineer';
    else if (lower.includes('frontend')) role = 'Frontend Engineer';
    else if (lower.includes('full stack')) role = 'Full Stack Engineer';
    else if (lower.includes('system design')) role = 'System Design Preparation';

    candidates.push({
      category: 'Interview',
      key: 'target_role',
      value: `User stated career focus: ${role}`,
      confidence: 0.88,
    });
  }

  // 3. Schedule & Habit constraint pattern
  if (
    lower.includes('early morning') ||
    lower.includes('buffer') ||
    lower.includes('leave early') ||
    lower.includes('night shift') ||
    lower.includes('don\'t like') ||
    lower.includes('dont like')
  ) {
    candidates.push({
      category: 'Habits',
      key: 'schedule_preference',
      value: `User stated schedule preference: ${sanitized}`,
      confidence: 0.85,
    });
  }

  return candidates;
}
