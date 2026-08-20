import { prisma } from '@/lib/db';
import { FileText } from 'lucide-react';

export default async function AdminAuditPage() {
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Audit Logs
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Historical record of administrative actions, role changes, account updates, and system events.
        </p>
      </div>

      <div className="card card-purple" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem' }}>Actor</th>
              <th style={{ padding: '0.75rem 1rem' }}>Action</th>
              <th style={{ padding: '0.75rem 1rem' }}>Entity</th>
              <th style={{ padding: '0.75rem 1rem' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }} className="font-mono">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>{log.user?.email || log.userId || 'System'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-primary">{log.action}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {log.entityType} {log.entityId ? `#${log.entityId.slice(0, 8)}` : ''}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {log.details || '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
