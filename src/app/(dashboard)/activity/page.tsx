'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

export default function UserActivityPage() {
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  async function fetchActivity() {
    try {
      const res = await fetch('/api/v1/forecasts');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map((f: any) => ({
          id: f.id,
          action: 'Forecast Executed',
          title: f.title || f.originalInput,
          domain: f.domain,
          time: new Date(f.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          score: `${Math.round((f.overallScore || 0.75) * 100)}%`,
        }));
        setActivityLogs(mapped);
      }
    } catch (e) {
      console.error('Failed to fetch user activity timeline', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      {/* PAGE HEADER */}
      <div>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Activity color="#A855F7" size={28} />
          <span>My Activity Timeline & Decision Logs</span>
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Transparent execution record of your forecasts, evidence queries, and assistant interactions.
        </p>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading activity logs...</div>
      ) : (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Personal Activity Log</h3>

          {activityLogs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Not enough data yet. Create forecasts on Dashboard to view your activity timeline.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.15)' }}>
                      <CheckCircle2 size={16} color="#A855F7" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{log.action}</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{log.title}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} />
                      <span>{log.time}</span>
                    </span>
                    <span className="badge badge-purple">{log.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
