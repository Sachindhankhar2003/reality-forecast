'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const trafficData = [
  { time: '07:30 AM', delay: 5, onTime: 95 },
  { time: '08:00 AM', delay: 10, onTime: 90 },
  { time: '08:20 AM', delay: 12, onTime: 92 }, // Optimal
  { time: '08:45 AM', delay: 28, onTime: 45 }, // Peak delay
  { time: '09:15 AM', delay: 35, onTime: 25 },
  { time: '09:45 AM', delay: 18, onTime: 70 },
  { time: '10:00 AM', delay: 10, onTime: 85 },
];

export function TrafficChart() {
  return (
    <div
      className="card card-purple"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
            STATISTICAL FORECAST
          </span>
          <h3
            className="font-display"
            style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}
          >
            Traffic Delay & Arrival Timeline Graph
          </h3>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>
          Optimal Departure: 08:20 AM
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height: '220px', marginTop: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#261147" />
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="m" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1D0C38',
                borderColor: '#A855F7',
                borderRadius: '8px',
                color: '#FFF',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value} min extra traffic`, 'Delay']}
            />
            <ReferenceLine x="08:20 AM" stroke="#34D399" strokeWidth={2} label={{ value: 'Best Departure (08:20 AM)', fill: '#34D399', fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="delay"
              stroke="#A855F7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#trafficGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <span>🟢 08:20 AM: Best time (30m buffer)</span>
        <span>🔴 08:45 AM: Heavy traffic (+28m delay)</span>
      </div>
    </div>
  );
}
