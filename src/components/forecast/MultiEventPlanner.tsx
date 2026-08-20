'use client';

import { useState } from 'react';
import { parseMultiEventSchedule, analyzeScheduleConflicts, EventItem, SchedulingConflict } from '@/services/engine/multi-event-planner';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export function MultiEventPlanner() {
  const [scheduleText, setScheduleText] = useState(`Tomorrow:\nInterview at 10\nLunch at 1\nHotel check-in at 3\nGym at 6`);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [conflicts, setConflicts] = useState<SchedulingConflict[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseMultiEventSchedule(scheduleText);
    const result = analyzeScheduleConflicts(parsed);
    setEvents(parsed);
    setConflicts(result.conflicts);
    setAnalyzed(true);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={18} color="var(--accent-light)" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Multi-Event Day Plan Analyzer
        </h3>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        Enter a multi-event schedule to detect overlapping appointments, tight commute buffers, or unrealistic prep windows.
      </p>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          value={scheduleText}
          onChange={(e) => setScheduleText(e.target.value)}
          className="textarea"
          style={{ minHeight: '120px', fontFamily: 'monospace', fontSize: '0.85rem' }}
        />
        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          <span>Analyze Day Schedule</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {analyzed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          {/* Parsed Timeline */}
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Extracted Schedule Timeline ({events.length} Events)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {events.map((evt) => (
                <div key={evt.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{evt.title}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} />
                    <span>{evt.startTime} - {evt.endTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Identified Conflict Risk Audit */}
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: conflicts.length > 0 ? 'var(--warning)' : 'var(--success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {conflicts.length > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              <span>{conflicts.length > 0 ? `Detected ${conflicts.length} Schedule Warnings` : 'No Schedule Conflicts Detected'}</span>
            </div>

            {conflicts.map((c, idx) => (
              <div key={idx} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--warning-border)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--warning)', marginBottom: '0.2rem' }}>
                  {c.conflictType.replace('_', ' ')}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{c.description}</div>
                <div style={{ color: 'var(--accent-light)', fontWeight: 500 }}>💡 Recommendation: {c.suggestedAction}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
