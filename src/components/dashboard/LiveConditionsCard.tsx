'use client';

import { Sun, Wind, Car, ShieldCheck } from 'lucide-react';

export function LiveConditionsCard() {
  return (
    <div
      className="card card-teal"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} color="#2DD4BF" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2DD4BF', textTransform: 'uppercase' }}>
            LIVE WEATHER & ATMOSPHERIC CONDITIONS
          </span>
        </div>
        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
          UPDATED LIVE
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
        {/* Weather & Temp */}
        <div
          style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            borderLeft: '3px solid #F59E0B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>
            <Sun size={16} className="animate-spin-slow" />
            <span>TEMPERATURE & SKY</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            29°C <span style={{ fontSize: '0.8rem', color: '#FCD34D', fontWeight: 600 }}>Clear Sunny</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
            Feels like 31°C • Perfect commuting weather
          </div>
        </div>

        {/* Humidity & Wind */}
        <div
          style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            borderLeft: '3px solid #38BDF8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700 }}>
            <Wind size={16} />
            <span>WIND & HUMIDITY</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            12 km/h <span style={{ fontSize: '0.8rem', color: '#93C5FD', fontWeight: 600 }}>NW Wind</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
            48% Moderate humidity • Clear road visibility
          </div>
        </div>

        {/* Traffic Delay */}
        <div
          style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            borderLeft: '3px solid #F87171',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#F87171', fontWeight: 700 }}>
            <Car size={16} />
            <span>CORRIDOR TRAFFIC</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F87171', marginTop: '0.2rem' }}>
            +18 min delay
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
            Sirhaul border bottleneck corridor
          </div>
        </div>
      </div>
    </div>
  );
}
