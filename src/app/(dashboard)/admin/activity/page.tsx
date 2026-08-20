'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Users, Cpu, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminActivityPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperationalStats();
  }, []);

  async function fetchOperationalStats() {
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch operational stats', e);
    } finally {
      setLoading(false);
    }
  }

  const hasDomainData = stats?.domainDistribution && stats.domainDistribution.length > 0;
  const totalDomainCount = hasDomainData
    ? stats.domainDistribution.reduce((acc: number, curr: any) => acc + curr.count, 0)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* PAGE HEADER */}
      <div>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Activity color="#A855F7" size={28} />
          <span>Admin Operational Intelligence & Activity</span>
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Real-time system health, API response latency, and decision intelligence telemetry.
        </p>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading operational telemetry...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* TOP METRICS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={14} color="#A855F7" />
                <span>TOTAL USERS</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats?.totalUsers ?? 0}</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981' }}>{stats?.activeUsers ?? 0} Active Sessions</div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Cpu size={14} color="#A855F7" />
                <span>FORECAST RUNS</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats?.totalForecasts ?? 0}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>100% Deterministic</div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} color="#A855F7" />
                <span>INTERVIEWS ANALYZED</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats?.totalInterviews ?? 0}</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981' }}>Readiness Evaluations</div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={14} color="#A855F7" />
                <span>ACCURACY BRIER</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats?.brierAccuracyScore ? stats.brierAccuracyScore : 'Not enough data yet'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981' }}>
                {stats?.brierAccuracyScore ? 'High Calibration' : 'Evaluations Required'}
              </div>
            </div>
          </div>

          {/* TELEMETRY BREAKDOWN CARD */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#A855F7" />
              <span>Domain Telemetry Breakdown</span>
            </h3>

            {!hasDomainData || totalDomainCount === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Not enough data yet. Create forecasts to populate domain distribution telemetry.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.domainDistribution.map((item: any) => {
                  const percentage = Math.round((item.count / totalDomainCount) * 100);
                  return (
                    <div key={item.domain}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        <span style={{ textTransform: 'capitalize' }}>{item.domain}</span>
                        <span style={{ fontWeight: 700 }}>{percentage}% ({item.count})</span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: '#A855F7' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
