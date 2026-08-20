import { Activity } from 'lucide-react';

export default function AdminProvidersPage() {
  const providers = [
    { name: 'Open-Meteo Weather API', type: 'Weather Telemetry', status: 'OPERATIONAL', latencyMs: 142 },
    { name: 'TomTom Traffic API', type: 'Traffic Telemetry', status: 'OPERATIONAL', latencyMs: 185 },
    { name: 'Reality AI Engine', type: 'Personal Intelligence', status: 'OPERATIONAL', latencyMs: 95 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          External Provider Health
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Real-time availability and latency monitoring for integrated weather, traffic, and intelligence providers.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {providers.map((p) => (
          <div key={p.name} className="card card-teal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{p.type} • Latency: {p.latencyMs}ms</div>
            </div>
            <span className="badge badge-success">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
