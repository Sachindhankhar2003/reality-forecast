import { ExtractedIntent, MissingInfoItem } from './types';

export function evaluateMissingInformation(intent: ExtractedIntent): MissingInfoItem[] {
  const missing: MissingInfoItem[] = [];

  if (intent.domain === 'interview') {
    if (!intent.companyRaw) {
      missing.push({
        field: 'company',
        label: 'Company Name',
        category: 'USEFUL',
        informationValue: 0.85,
        question: 'Which company are you interviewing with?',
      });
    }

    if (!intent.roleRaw) {
      missing.push({
        field: 'role',
        label: 'Job Role',
        category: 'REQUIRED',
        informationValue: 0.95,
        question: 'What software position or level is this interview for?',
      });
    }

    if (!intent.timeRaw) {
      missing.push({
        field: 'time',
        label: 'Interview Time',
        category: 'REQUIRED',
        informationValue: 0.90,
        question: 'What time is the interview scheduled?',
      });
    }
  }

  if (intent.domain === 'travel') {
    if (!intent.originRaw) {
      missing.push({
        field: 'origin',
        label: 'Starting Location',
        category: 'USEFUL',
        informationValue: 0.80,
        question: 'Where will you be departing from?',
      });
    }

    if (!intent.destinationRaw) {
      missing.push({
        field: 'destination',
        label: 'Destination Location',
        category: 'REQUIRED',
        informationValue: 0.95,
        question: 'Where is the destination address?',
      });
    }
  }

  // Sort strictly by information value descending
  return missing.sort((a, b) => b.informationValue - a.informationValue);
}
