'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Home,
  Compass,
  Briefcase,
  TrendingUp,
  Brain,
  User,
  Settings,
  Plus,
  Sparkles,
  Lock,
  LogOut,
} from 'lucide-react';
import { RealityLogo } from '@/components/brand/RealityLogo';

const baseNavItems = [
  { label: 'Home', href: '/dashboard', icon: Home, color: 'var(--theme-dashboard)' },
  { label: 'Forecasts', href: '/forecasts', icon: Compass, color: 'var(--theme-forecast)' },
  { label: 'Interviews', href: '/interviews', icon: Briefcase, color: 'var(--theme-interview)' },
  { label: 'Insights', href: '/insights', icon: TrendingUp, color: 'var(--theme-insights)' },
  { label: 'Memory', href: '/memory', icon: Brain, color: 'var(--theme-memory)' },
  { label: 'Profile', href: '/profile', icon: User, color: 'var(--theme-profile)' },
  { label: 'Settings', href: '/settings', icon: Settings, color: 'var(--theme-settings)' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkRole() {
      try {
        const res = await fetch('/api/profile');
        const json = await res.json();
        if (json.success && (json.data?.role === 'ADMIN' || json.data?.email?.toLowerCase() === 'sachinadmin.app')) {
          setIsAdmin(true);
        }
      } catch {
        // Default to non-admin
      }
    }
    checkRole();
  }, []);

  const navItems = isAdmin
    ? [...baseNavItems, { label: 'Admin Console', href: '/admin', icon: Lock, color: '#A855F7' }]
    : baseNavItems;

  return (
    <aside className="sidebar">
      {/* Brand Header with RealityLogo */}
      <div
        style={{
          padding: '0.9rem 1.15rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Link href="/dashboard">
          <RealityLogo size={26} subtitle="Future Intelligence" />
        </Link>
      </div>

      {/* New Forecast Action Button */}
      <div style={{ padding: '0.9rem 1rem 0.4rem' }}>
        <Link
          href="/forecasts/new"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.55rem' }}
        >
          <Plus size={16} />
          <span>New Forecast</span>
        </Link>
      </div>

      {/* Navigation List */}
      <div style={{ flex: 1, padding: '0.5rem 0.75rem', overflowY: 'auto' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

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
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? item.color : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                  transition: 'all 0.12s ease',
                }}
              >
                <Icon size={17} style={{ color: isActive ? item.color : 'var(--text-tertiary)' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#EF4444',
              backgroundColor: 'transparent',
              borderLeft: '3px solid transparent',
              border: 'none',
              width: '100%',
              cursor: 'pointer',
              marginTop: '0.5rem',
              transition: 'all 0.12s ease',
            }}
          >
            <LogOut size={17} color="#EF4444" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>

      {/* Workspace & Status Footer */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Pro Intelligence</span>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Live</span>
        </div>
        <div style={{ fontSize: '0.685rem', color: 'var(--text-tertiary)', lineHeight: 1.3 }}>
          Telemetry: Open-Meteo & TomTom active
        </div>
      </div>
    </aside>
  );
}
