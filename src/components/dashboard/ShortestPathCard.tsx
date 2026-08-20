'use client';

import { MapPin, ShieldCheck, CornerDownRight } from 'lucide-react';

export function ShortestPathCard() {
  return (
    <div
      className="card card-emerald"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={16} color="#34D399" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>
            SHORTEST & SAFEST ROUTE PATH ANALYSIS
          </span>
        </div>
        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
          OPTIMIZED ROUTE
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Shortest Route Path Details */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CornerDownRight size={14} />
            <span>SHORTEST RECOMMENDED PATH (38.5 KM)</span>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
            Noida Sector 62 → DND Flyway → Ashram → Outer Ring Road → NH-48 Express Lanes → Cyber City
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            ⚡ Fastest drive path bypassing Ashram bottleneck via new elevated highway.
          </div>
        </div>

        {/* Safety & Corridor Monitoring */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} />
            <span>SAFETY & SECURITY RATING</span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60A5FA' }}>
            98% Safety Score <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>(Very Safe)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            8-lane well-lit expressway corridor with 24/7 CCTV monitoring & highway emergency service.
          </div>
        </div>
      </div>
    </div>
  );
}
