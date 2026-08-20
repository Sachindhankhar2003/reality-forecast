import { prisma } from '@/lib/db';
import { BarChart2 } from 'lucide-react';

export default async function AdminForecastsPage() {
  const [totalForecasts, domainGroup, statusGroup, avgScores] = await Promise.all([
    prisma.forecast.count(),
    prisma.forecast.groupBy({
      by: ['domain'],
      _count: { id: true },
    }),
    prisma.forecast.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.forecast.aggregate({
      _avg: {
        overallScore: true,
        confidence: true,
      },
    }),
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Forecast Intelligence Analytics
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Aggregated forecast metrics, domain distribution, and model confidence scores.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card card-purple">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>TOTAL FORECASTS</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {totalForecasts}
          </div>
        </div>

        <div className="card card-emerald">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>AVG FEASIBILITY SCORE</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>
            {Math.round((avgScores._avg.overallScore || 0) * 100)}%
          </div>
        </div>

        <div className="card card-indigo">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>AVG MODEL CONFIDENCE</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818CF8', marginTop: '0.25rem' }}>
            {Math.round((avgScores._avg.confidence || 0) * 100)}%
          </div>
        </div>
      </div>

      <div className="card card-indigo" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700 }}>Domain Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {domainGroup.map((d) => (
            <div key={d.domain} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{d.domain.toUpperCase()}</span>
              <span className="badge badge-primary">{d._count.id} Records</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
