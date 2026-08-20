export interface EventItem {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
}

export interface SchedulingConflict {
  eventId1: string;
  eventId2: string;
  conflictType: 'OVERLAP' | 'INSUFFICIENT_TRAVEL_BUFFER' | 'PREPARATION_GAP';
  severity: 'HIGH' | 'MEDIUM';
  description: string;
  suggestedAction: string;
}

export function parseMultiEventSchedule(rawText: string): EventItem[] {
  const lines = rawText.split(/[\n;]+/).map((l) => l.trim()).filter(Boolean);
  const events: EventItem[] = [];

  let defaultHour = 9;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length < 3) continue;

    // Check for explicit time pattern like "at 10", "at 1", "at 3:00"
    const timeMatch = line.match(/(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);

    let startH = defaultHour;
    let startM = 0;

    if (timeMatch && line.toLowerCase().includes('at')) {
      let h = parseInt(timeMatch[1], 10);
      const isPm = timeMatch[3]?.toLowerCase() === 'pm' || (h < 8 && !timeMatch[3]);
      if (isPm && h < 12) h += 12;
      startH = h;
      if (timeMatch[2]) startM = parseInt(timeMatch[2], 10);
    }

    const endH = startH + 1;
    const startStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;
    const endStr = `${endH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;

    events.push({
      id: `evt-${i + 1}`,
      title: line,
      startTime: startStr,
      endTime: endStr,
    });

    defaultHour = Math.max(defaultHour + 2, startH + 2);
  }

  return events;
}

export function analyzeScheduleConflicts(events: EventItem[]): {
  conflicts: SchedulingConflict[];
  hasConflicts: boolean;
  timelineSummary: string;
} {
  const conflicts: SchedulingConflict[] = [];

  for (let i = 0; i < events.length - 1; i++) {
    const current = events[i];
    const next = events[i + 1];

    const [currEndH, currEndM] = current.endTime.split(':').map(Number);
    const [nextStartH, nextStartM] = next.startTime.split(':').map(Number);

    const currEndMins = currEndH * 60 + currEndM;
    const nextStartMins = nextStartH * 60 + nextStartM;

    const gapMins = nextStartMins - currEndMins;

    if (gapMins < 0) {
      conflicts.push({
        eventId1: current.id,
        eventId2: next.id,
        conflictType: 'OVERLAP',
        severity: 'HIGH',
        description: `Direct time conflict between '${current.title}' and '${next.title}'.`,
        suggestedAction: `Reschedule '${next.title}' to start after ${current.endTime}.`,
      });
    } else if (gapMins < 30) {
      conflicts.push({
        eventId1: current.id,
        eventId2: next.id,
        conflictType: 'INSUFFICIENT_TRAVEL_BUFFER',
        severity: 'MEDIUM',
        description: `Tight ${gapMins}-minute buffer between '${current.title}' and '${next.title}'.`,
        suggestedAction: `Extend departure buffer by 15-20 minutes to accommodate traffic variability.`,
      });
    }
  }

  return {
    conflicts,
    hasConflicts: conflicts.length > 0,
    timelineSummary: `Parsed ${events.length} multi-event items with ${conflicts.length} identified scheduling risk warnings.`,
  };
}
