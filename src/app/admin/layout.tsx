import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import {
  ShieldAlert,
  Users,
  BarChart2,
  Cpu,
  Activity,
  Lock,
  FileText,
  Settings,
  LayoutDashboard,
  ArrowLeft,
} from 'lucide-react';
import { RealityLogo } from '@/components/brand/RealityLogo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser();

  // Server-Side Authorization Enforcement for Admin Console
  if (!user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (user.role !== 'ADMIN') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-primary)',
        }}
      >
        <div className="card card-rose" style={{ maxWidth: '480px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <ShieldAlert size={48} color="var(--danger)" />
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>
            403 — Unauthorized Access
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            You do not have administrator permissions to access the Reality Forecast Admin Console. Authorization is enforced on the server.
          </p>
          <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Return to User Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const adminNav = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Forecasts', href: '/admin/forecasts', icon: BarChart2 },
    { label: 'AI Activity', href: '/admin/ai', icon: Cpu },
    { label: 'Providers', href: '/admin/providers', icon: Activity },
    { label: 'Security', href: '/admin/security', icon: Lock },
    { label: 'Audit Logs', href: '/admin/audit', icon: FileText },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Enterprise Admin Sidebar */}
      <aside
        style={{
          width: '240px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '1rem 1.15rem', borderBottom: '1px solid var(--border-color)' }}>
          <RealityLogo size={24} subtitle="Enterprise Admin Console" />
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                <Icon size={16} color="var(--accent-primary)" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '0.85rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-muted)' }}>
          <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <ArrowLeft size={14} />
            <span>User Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            height: '56px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              ADMIN CONSOLE
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>• Authenticated as {user.email}</span>
          </div>

          <ThemeToggle />
        </header>

        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
