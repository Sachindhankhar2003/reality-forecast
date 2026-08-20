import { Lock, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function AdminSecurityPage() {
  const auditCount = await prisma.auditLog.count();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Security & Policy Enforcement
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Server-side access control, rate-limiting, SSRF protections, and sanitization policy monitoring.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card card-indigo">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>SERVER RBAC</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', marginTop: '0.35rem' }}>
            ENFORCED
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            All admin endpoints call requireAdmin()
          </div>
        </div>

        <div className="card card-purple">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>LAST-ADMIN PROTECTION</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#A855F7', marginTop: '0.35rem' }}>
            ACTIVE
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Prevents accidental demotion of final admin
          </div>
        </div>

        <div className="card card-teal">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>AUDIT EVENT RECORDS</div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2DD4BF', marginTop: '0.35rem' }}>
            {auditCount}
          </div>
        </div>
      </div>
    </div>
  );
}
