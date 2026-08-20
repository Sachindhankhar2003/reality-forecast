'use client';

import { useState } from 'react';
import { ForecastRecord, WhatIfRunItem } from '@/types/forecast';
import { runWhatIfAction } from '@/actions/whatif-actions';
import { Sliders, ArrowRight } from 'lucide-react';

interface WhatIfSimulatorProps {
  forecast: ForecastRecord;
}

export function WhatIfSimulator({ forecast }: WhatIfSimulatorProps) {
  const [whatIfInput, setWhatIfInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [runs, setRuns] = useState<WhatIfRunItem[]>(forecast.whatIfRuns || []);

  const handleSimulate = async (hypothesisText: string) => {
    if (!hypothesisText.trim()) return;
    setLoading(true);

    const res = await runWhatIfAction(forecast.id, hypothesisText);
    if (res.success && res.data) {
      setRuns([res.data, ...runs]);
      setWhatIfInput('');
    }
    setLoading(false);
  };

  const latestRun = runs[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hypothesis Input Box */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sliders size={16} color="var(--accent-light)" />
          <span>Interactive What-If Plan Simulator</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
          Simulate changes to departure time, transport mode, preparation depth, or risk assumptions. The original forecast snapshot remains 100% immutable.
        </p>

        {/* Quick Hypothesis Presets */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button
            onClick={() => handleSimulate('What if I leave 30 minutes earlier?')}
            className="btn btn-secondary btn-sm"
            disabled={loading}
            style={{ fontSize: '0.75rem' }}
          >
            ⏰ Leave 30m Earlier
          </button>
          <button
            onClick={() => handleSimulate('What if I take the Metro instead of driving?')}
            className="btn btn-secondary btn-sm"
            disabled={loading}
            style={{ fontSize: '0.75rem' }}
          >
            🚇 Take Metro Line
          </button>
          <button
            onClick={() => handleSimulate('What if I prepare system design questions for 2 hours tonight?')}
            className="btn btn-secondary btn-sm"
            disabled={loading}
            style={{ fontSize: '0.75rem' }}
          >
            📚 +2 Hours Tech Review
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulate(whatIfInput);
          }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
        >
          <input
            type="text"
            value={whatIfInput}
            onChange={(e) => setWhatIfInput(e.target.value)}
            placeholder='e.g. "What if severe traffic develops on the Noida Expressway?"'
            className="input"
            style={{ flex: 1, minWidth: '280px' }}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !whatIfInput.trim()}>
            {loading ? 'Calculating Engine Deltas...' : 'Simulate Plan'}
          </button>
        </form>
      </div>

      {/* Side-by-Side Comparison Display */}
      {latestRun && (
        <div className="card" style={{ border: '1px solid var(--accent-primary)', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-primary">SIMULATION RESULT: &quot;{latestRun.userInput}&quot;</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              Deterministic Score Delta Recomputed
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Current Base Snapshot */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>CURRENT FORECAST</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {Math.round(forecast.overallScore * 100)}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Confidence: {Math.round(forecast.confidence * 100)}%
              </div>
            </div>

            {/* Simulated What-If Snapshot */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--accent-primary)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 600 }}>SIMULATED WHAT-IF</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: latestRun.deltaScore >= 0 ? 'var(--success)' : 'var(--warning)', margin: '0.2rem 0' }}>
                {Math.round((forecast.overallScore + latestRun.deltaScore) * 100)}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                Delta: {latestRun.deltaScore >= 0 ? `+${Math.round(latestRun.deltaScore * 100)}%` : `${Math.round(latestRun.deltaScore * 100)}%`}
              </div>
            </div>
          </div>

          {/* Factor Modifications Breakdown */}
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Modified Factor & Telemetry Impact
            </div>
            {latestRun.modifiedFactors.map((mf, idx) => (
              <div key={idx} style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>• {mf.factorName}:</span>
                <span style={{ color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>{mf.originalValue}</span>
                <ArrowRight size={12} color="var(--accent-light)" />
                <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{mf.modifiedValue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
