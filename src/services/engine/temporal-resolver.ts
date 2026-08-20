import { ResolvedTemporal } from './types';

export function resolveTemporalExpressions(text: string, baseDate: Date = new Date()): ResolvedTemporal {
  const lower = text.toLowerCase();
  const target = new Date(baseDate);

  let isAmbiguous = false;
  let explanation = 'Extracted relative temporal expressions.';

  if (lower.includes('tomorrow')) {
    target.setDate(target.getDate() + 1);
  } else if (lower.includes('tonight')) {
    target.setHours(20, 0, 0, 0);
  } else if (lower.includes('this weekend')) {
    const day = target.getDay();
    const diff = day === 0 ? 0 : 6 - day;
    target.setDate(target.getDate() + diff);
    isAmbiguous = true;
    explanation = 'Resolved to upcoming weekend (Saturday).';
  } else if (lower.includes('in 2 hours')) {
    target.setHours(target.getHours() + 2);
  }

  // Extract explicit time (e.g. "10 am", "10:30 am", "8 pm")
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  let timeStr = '10:00';

  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const mins = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridian = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

    if (meridian === 'pm' && hours < 12) hours += 12;
    if (meridian === 'am' && hours === 12) hours = 0;

    target.setHours(hours, mins, 0, 0);
    timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  } else {
    isAmbiguous = true;
    explanation += ' Exact time not specified, defaulted to morning.';
  }

  const yyyy = target.getFullYear();
  const mm = (target.getMonth() + 1).toString().padStart(2, '0');
  const dd = target.getDate().toString().padStart(2, '0');

  return {
    targetDate: `${yyyy}-${mm}-${dd}`,
    targetTime: timeStr,
    isoTimestamp: target.toISOString(),
    isAmbiguous,
    explanation,
  };
}
