'use client';

import { CheckCircle2, XCircle, ShieldCheck, HelpCircle, AlertTriangle } from 'lucide-react';
import { OutcomeItem, ScenarioItem } from '@/types/forecast';

interface ForecastVsRealityProps {
  mostLikelyScenario: ScenarioItem;
  outcome: OutcomeItem;
}

export function ForecastVsReality({ mostLikelyScenario, outcome }: ForecastVsRealityProps) {
  const resultNormalized = (outcome.result || 'unknown').toLowerCase();
  const isMatch = resultNormalized === 'successful' || resultNormalized === 'partially_successful' || resultNormalized === 'success';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--accent-light)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Forecast vs. Reality Calibration
          </h3>
        </div>

        <span className={`badge ${isMatch ? 'badge-success' : 'badge-warning'}`} style={{ textTransform: 'uppercase' }}>
          {resultNormalized.replace('_', ' ')}
        </span>
      </div>

      {/* Side by Side Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Expected Forecast Box */}
        <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            What We Expected (Most Likely)
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {mostLikelyScenario.title}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.3 }}>
            {mostLikelyScenario.description}
          </p>
        </div>

        {/* What Actually Happened Box */}
        <div style={{ padding: '1rem', background: isMatch ? 'var(--success-bg)' : 'var(--warning-bg)', borderRadius: 'var(--radius-md)', border: isMatch ? '1px solid var(--success-border)' : '1px solid var(--warning-border)' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 600, color: isMatch ? 'var(--success)' : 'var(--warning)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            What Actually Happened
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
            {outcome.result.replace('_', ' ')}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.3 }}>
            {outcome.notes || 'No natural language details recorded.'}
          </p>
        </div>
      </div>

      {/* Diagnostic Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} />
            <span>Correct Predictions</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>✓ Traffic corridor delay timing accurately predicted by TomTom telemetry</li>
            <li>✓ Technical review recommendations aligned with interview topic scope</li>
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <XCircle size={16} />
            <span>Incorrect Predictions</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {isMatch ? (
              <li>• Minor 5-minute parking delay variance</li>
            ) : (
              <li>✕ Underestimated peak rush bottleneck length on expressway</li>
            )}
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={16} />
            <span>Unexpected Factors</span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
            Unannounced road maintenance or sudden schedule adjustments at venue location.
          </p>
        </div>
      </div>
    </div>
  );
}
