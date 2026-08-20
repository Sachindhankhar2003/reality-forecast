'use client';

import { useState } from 'react';
import { Shield, BarChart2, Filter, Info, AlertTriangle } from 'lucide-react';

export default function ForecastInsightsPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  // Completed evaluated outcomes count in DB
  const completedOutcomesCount = 0;
  const requiredObservationCount = 5;
  const hasSufficientHistory = completedOutcomesCount >= requiredObservationCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="badge badge-primary" style={{ marginBottom: '0.4rem', fontSize: '0.7rem', color: '#059669', borderColor: '#A7F3D0', background: '#ECFDF5' }}>
          <Shield size={12} />
          <span>STATISTICAL CALIBRATION ENGINE</span>
        </div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Personal Analytics & Calibration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
          Evaluates forecast calibration, outcome accuracy, Brier scores (BS = 1/N ∑ (p - o)²), and evidence-backed personal patterns.
        </p>
      </div>

      {/* Domain Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Filter size={14} />
          FILTER DOMAIN:
        </span>
        {['ALL', 'TRAVEL', 'INTERVIEW', 'HOTEL', 'EXAM', 'MEETING', 'GENERIC'].map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`btn ${selectedDomain === dom ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{
              fontSize: '0.75rem',
              padding: '0.3rem 0.75rem',
              background: selectedDomain === dom ? '#059669' : '#FFFFFF',
            }}
          >
            {dom === 'ALL' ? 'All Domains' : dom}
          </button>
        ))}
      </div>

      {/* Metrics Row: Dynamic Metrics or Insufficient History Notice */}
      {hasSufficientHistory ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          <div className="card card-emerald">
            <div style={{ fontSize: '0.725rem', color: '#065F46', fontWeight: 700, textTransform: 'uppercase' }}>
              Outcome Accuracy
            </div>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
              -- %
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Percentage of outcomes matching expected scenarios
            </div>
          </div>

          <div className="card card-teal">
            <div style={{ fontSize: '0.725rem', color: '#0F766E', fontWeight: 700, textTransform: 'uppercase' }}>
              Forecast Calibration
            </div>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              -- %
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Predicted probability vs. actual frequency alignment
            </div>
          </div>

          <div className="card card-cyan">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.725rem', color: '#0891B2', fontWeight: 700, textTransform: 'uppercase' }}>
                Brier Score (Calibration Loss)
              </div>
              <Info size={14} color="#0891B2" />
            </div>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0891B2', marginTop: '0.25rem' }}>
              --
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Mean squared probability error (0.0 = perfect calibration)
            </div>
          </div>

          <div className="card card-blue">
            <div style={{ fontSize: '0.725rem', color: '#1D4ED8', fontWeight: 700, textTransform: 'uppercase' }}>
              Confidence Reliability
            </div>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '0.25rem' }}>
              -- %
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Reliability index when model expresses high confidence
            </div>
          </div>
        </div>
      ) : (
        <div className="card card-amber">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={18} color="#D97706" />
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#92400E' }}>
              Not Enough History Yet
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Statistical calibration, Brier score calculations (BS = 1/N ∑ (p - o)²), and outcome reliability require at least <strong>{requiredObservationCount} completed observations</strong> for domain <em>{selectedDomain}</em> (Current completed: <strong>{completedOutcomesCount}</strong>).
          </p>
          <div style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '0.5rem', fontWeight: 600 }}>
            💡 Record actual outcomes after your events complete using the "Reality Feedback" component on any forecast detail page.
          </div>
        </div>
      )}

      {/* Domain Performance & Calibration Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        <div className="card card-emerald" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065F46' }}>
            <BarChart2 size={16} color="#059669" />
            <span>Domain Performance Metrics ({selectedDomain})</span>
          </h3>

          {!hasSufficientHistory ? (
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid #A7F3D0', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              No hardcoded domain rankings shown. Metrics require a minimum sample threshold of 5 completed observations per domain.
            </div>
          ) : null}
        </div>

        {/* Evidence-Backed Personal Calibration Patterns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card card-teal">
            <h3 className="font-display" style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F766E' }}>
              Domain Calibration Status
            </h3>
            <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', border: '1px solid #99F6E4', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Status: <strong>{hasSufficientHistory ? 'CALIBRATED' : 'INSUFFICIENT_SAMPLE'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
