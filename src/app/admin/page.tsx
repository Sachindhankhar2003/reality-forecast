import { prisma } from '@/lib/db';
import { Users, BarChart2, Cpu, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export default async function AdminOverviewPage() {
  const [
    totalUsers,
    activeUsers,
    totalForecasts,
    totalInterviews,
    totalConversations,
    totalAIRequests,
    systemErrors,
    domainGroup,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.forecast.count(),
    prisma.interview.count(),
    prisma.conversation.count(),
    prisma.aPIUsage.count(),
    prisma.aPIUsage.count({ where: { success: false } }),
    prisma.forecast.groupBy({
      by: ['domain'],
      _count: { id: true },
    }),
  ]);

  const statCards = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'var(--theme-profile)' },
    { label: 'Active Users', value: activeUsers, icon: ShieldCheck, color: 'var(--success)' },
    { label: 'Total Forecasts', value: totalForecasts, icon: BarChart2, color: 'var(--theme-forecast)' },
    { label: 'Total Interviews', value: totalInterviews, icon: Cpu, color: 'var(--theme-interview)' },
    { label: 'AI Conversations', value: totalConversations, icon: Cpu, color: 'var(--theme-memory)' },
    { label: 'AI API Requests', value: totalAIRequests, icon: Activity, color: 'var(--theme-dashboard)' },
    { label: 'System Errors', value: systemErrors, icon: AlertTriangle, color: 'var(--danger)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Enterprise System Overview
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Real-time aggregated platform metrics, database records, and operational health status.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card card-purple" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  {card.label}
                </span>
                <Icon size={16} color={card.color} />
              </div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Domain Distribution & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        <div className="card card-indigo" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Forecast Domain Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {domainGroup.map((d) => (
              <div key={d.domain} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{d.domain.toUpperCase()}</span>
                <span className="badge badge-primary">{d._count.id} Records</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-teal" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Telemetry & Security Policy
          </h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            • Server-side RBAC enforced for all admin endpoints.<br />
            • Last-Admin protection active.<br />
            • SSRF and Prompt Injection sanitizers active.<br />
            • Controlled AI tool execution enabled.
          </div>
        </div>
      </div>
    </div>
  );
}
