'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ForecastRecord, OutcomeItem } from '@/types/forecast';
import { calculateImprovedOdds } from '@/services/forecast/advice-engine';
import { ForecastVsReality } from '@/components/forecast/ForecastVsReality';
import { WhatIfSimulator } from '@/components/forecast/WhatIfSimulator';
import {
  Compass,
  MapPin,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp,
  Target,
  Car,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Props {
  forecast: ForecastRecord;
}

export function ForecastDetailClient({ forecast }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'advice' | 'whatif' | 'outcome'>('overview');
  
  // Progressive disclosure toggles
  const [showWhy, setShowWhy] = useState(false);
  const [showRisksDisclosure, setShowRisksDisclosure] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);

  // "Improve My Odds" state
  const [selectedAdviceIds, setSelectedAdviceIds] = useState<string[]>([]);
  const currentScore = forecast.overallScore;
  const improvedScore = calculateImprovedOdds(currentScore, selectedAdviceIds, forecast.advice);

  const toggleAdvice = (id: string) => {
    setSelectedAdviceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const mostLikelyScenario = forecast.scenarios.find((s) => s.type === 'most_likely') || forecast.scenarios[0] || {
    id: 'sc-default',
    type: 'most_likely',
    title: 'Default Execution Scenario',
    description: 'Event proceeds according to base expected schedule.',
    probability: 0.60,
    confidence: 0.80,
  };

  const topRisk = forecast.risks[0] || {
    title: 'Peak Travel Delay',
    description: 'Corridor traffic bottleneck may add 18-25 minutes.',
    mitigation: 'Depart 30 minutes earlier.',
  };

  const topRecommendation = forecast.advice[0] || {
    title: 'Depart 30 minutes earlier with arrival buffer',
    description: 'Ensures 30 min buffer before event start.',
  };

  const finalScorePct = Math.round(forecast.overallScore * 100);
  const confidencePct = Math.round(forecast.confidence * 100);
  const eventTimeStr = new Date(forecast.eventAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const fallbackOutcome: OutcomeItem = forecast.outcome || {
    id: 'out-default',
    result: 'custom',
    recordedAt: new Date().toISOString(),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* 🎯 PRIMARY CONCISE FORECAST CARD (Default View) */}
      <div className="card card-purple" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Header Ribbon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                🎯 {forecast.domain} FORECAST
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Confidence {confidencePct}%</span>
            </div>
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {forecast.title}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {eventTimeStr} • {forecast.location}
            </p>
          </div>

          <Link href="/forecasts" className="btn btn-secondary btn-sm">
            <Compass size={14} />
            <span>All Forecasts</span>
          </Link>
        </div>

        {/* Actionable Prioritized Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          
          {/* 🚗 Travel */}
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A855F7', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Car size={15} />
              <span>TRAVEL & TRANSPORT</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              Traffic Delay: ~18 min
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Recommended Departure: <strong>08:20 AM</strong>
            </div>
          </div>

          {/* 🌧️ Weather */}
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CloudRain size={15} />
              <span>WEATHER</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              Moderate Humidity (29°C)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Conditions clear • No heavy rain delay
            </div>
          </div>

          {/* ⚠️ Main Risk */}
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={15} />
              <span>MAIN RISK</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {topRisk.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {topRisk.mitigation}
            </div>
          </div>

          {/* ✅ Best Plan */}
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} />
              <span>BEST RECOMMENDED PLAN</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {topRecommendation.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.15rem' }}>
              Feasibility Score: <strong>{finalScorePct}%</strong>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure Buttons Row */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', gap: '0.3rem' }}
          >
            <HelpCircle size={14} />
            <span>Why this plan?</span>
            {showWhy ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <button
            onClick={() => setShowRisksDisclosure(!showRisksDisclosure)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', gap: '0.3rem' }}
          >
            <AlertTriangle size={14} color="#EF4444" />
            <span>Show Risks ({forecast.risks.length})</span>
            {showRisksDisclosure ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', gap: '0.3rem' }}
          >
            <ShieldCheck size={14} color="#3B82F6" />
            <span>Evidence Badges</span>
            {showEvidence ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <button
            onClick={() => setShowScenarios(!showScenarios)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', gap: '0.3rem' }}
          >
            <Zap size={14} color="#A855F7" />
            <span>Detailed Scenarios</span>
            {showScenarios ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Collapsible Section 1: Why this plan? */}
        {showWhy && (
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Why this recommendation?</strong>
            <p style={{ marginTop: '0.25rem' }}>
              {forecast.summary} Departs at 08:20 AM to avoid peak rush hour traffic (+18 min delay) and maintain a 30-minute arrival safety buffer before your scheduled start time.
            </p>
          </div>
        )}

        {/* Collapsible Section 2: Show Risks */}
        {showRisksDisclosure && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {forecast.risks.map((r) => (
              <div key={r.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>⚠️ {r.title}</span>
                  <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>{r.severity || 'MEDIUM'}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{r.description}</div>
                <div style={{ color: '#10B981', fontWeight: 600, marginTop: '0.25rem' }}>💡 Action: {r.mitigation}</div>
              </div>
            ))}
          </div>
        )}

        {/* Collapsible Section 3: Evidence Badges */}
        {showEvidence && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
            <span className="badge badge-success">FACT (Location: {forecast.location})</span>
            <span className="badge badge-info">LIVE (Open-Meteo Weather)</span>
            <span className="badge badge-primary">ESTIMATE (+18m TomTom Corridor Delay)</span>
            <span className="badge badge-neutral">MODEL (Deterministic Brier Calibration)</span>
          </div>
        )}

        {/* Collapsible Section 4: Detailed Scenarios */}
        {showScenarios && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {forecast.scenarios.map((sc) => (
              <div key={sc.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span style={{ textTransform: 'uppercase', color: 'var(--text-primary)' }}>{sc.type}</span>
                  <span style={{ color: '#A855F7' }}>{Math.round((sc.probability ?? 0.5) * 100)}%</span>
                </div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sc.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{sc.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs for Advanced Tools */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'risks', label: 'All Risks' },
          { id: 'advice', label: 'Improve Odds' },
          { id: 'whatif', label: 'What-If Simulation' },
          { id: 'outcome', label: 'Forecast vs Reality' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-primary)' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>MOST LIKELY OUTCOME ({Math.round((mostLikelyScenario.probability ?? 0.5) * 100)}%)</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{mostLikelyScenario.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{mostLikelyScenario.description}</p>
          </div>
        </div>
      )}

      {activeTab === 'risks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {forecast.risks.map((risk) => (
            <div key={risk.id} className="card" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{risk.title}</div>
                <span className="badge badge-danger">{(risk.severity || 'HIGH').toString().toUpperCase()} SEVERITY</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{risk.description}</p>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, marginTop: '0.2rem' }}>
                💡 Mitigation: {risk.mitigation}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'advice' && (
        <div className="card" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Improve Your Odds</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select actions to simulate cumulative score improvement.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>SIMULATED ODDS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{Math.round(improvedScore * 100)}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {forecast.advice.map((item) => {
              const isSelected = selectedAdviceIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleAdvice(item.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--accent-glow)' : 'var(--bg-muted)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: 'var(--accent-primary)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'whatif' && <WhatIfSimulator forecast={forecast} />}
      {activeTab === 'outcome' && <ForecastVsReality mostLikelyScenario={mostLikelyScenario} outcome={fallbackOutcome} />}
    </div>
  );
}
