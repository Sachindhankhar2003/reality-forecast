'use client';

import { Train, Car, Bus, Navigation } from 'lucide-react';

export function TransportComparisonCard() {
  return (
    <div
      className="card card-purple"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Navigation size={16} color="#C084FC" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C084FC', textTransform: 'uppercase' }}>
            BEST TRANSPORT MODE ANALYSIS (METRO VS UBER VS CAR)
          </span>
        </div>
        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
          MULTI-MODAL COMPARISON
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        {/* Metro Option - BEST */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1.5px solid #10B981',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Train size={16} />
              <span>METRO (YELLOW / MAGENTA)</span>
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>BEST CHOICE</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
            42 Mins <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>(100% On-Time)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Zero traffic risk • Air-conditioned • Direct connection to Cyber City
          </div>
        </div>

        {/* Uber / Cab Option */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Car size={16} />
              <span>UBER / CAB</span>
            </span>
            <span className="badge badge-warning" style={{ fontSize: '0.6rem' }}>+18M DELAY</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
            55 Mins <span style={{ fontSize: '0.75rem', color: '#FCD34D', fontWeight: 600 }}>(Traffic Surge)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Comfortable • Subject to peak Highway traffic bottleneck
          </div>
        </div>

        {/* Drive Own Car */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Car size={16} />
              <span>DRIVE OWN CAR</span>
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.6rem' }}>PARKING NEEDED</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
            50 Mins <span style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 600 }}>(+10m Parking)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Full control • Toll charges applies • Requires parking slot search
          </div>
        </div>

        {/* Bus Option */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Bus size={16} />
              <span>PUBLIC BUS</span>
            </span>
            <span className="badge badge-danger" style={{ fontSize: '0.6rem' }}>SLOWEST</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
            75 Mins <span style={{ fontSize: '0.75rem', color: '#FCA5A5', fontWeight: 600 }}>(2 Transfers)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Lowest cost • Multiple bus changes required • High delay risk
          </div>
        </div>
      </div>
    </div>
  );
}
