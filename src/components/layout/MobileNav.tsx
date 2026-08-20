'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PlusCircle,
  TrendingUp,
  Briefcase,
  Compass,
  Menu,
  X,
  User,
  Brain,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

const mobileNavItems = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Forecasts', href: '/forecasts', icon: Compass },
  { label: 'New', href: '/forecasts/new', icon: PlusCircle, highlight: true },
  { label: 'Interview', href: '/interviews', icon: Briefcase },
  { label: 'Insights', href: '/insights', icon: TrendingUp },
];

export function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Bottom Navigation Bar for Mobile */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 50,
          padding: '0 0.5rem',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.04)',
        }}
        className="mobile-bottom-bar"
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.15rem',
                flex: 1,
                color: item.highlight
                  ? 'var(--accent-primary)'
                  : isActive
                  ? 'var(--accent-primary)'
                  : 'var(--text-tertiary)',
                fontSize: '0.675rem',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  padding: item.highlight ? '0.25rem' : '0',
                  borderRadius: item.highlight ? '50%' : '0',
                  background: item.highlight ? 'var(--accent-glow)' : 'transparent',
                }}
              >
                <Icon size={item.highlight ? 20 : 18} color={item.highlight ? 'var(--accent-primary)' : undefined} />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.15rem',
            flex: 1,
            color: 'var(--text-tertiary)',
            fontSize: '0.675rem',
          }}
        >
          <Menu size={18} />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-over Mobile Drawer */}
      {drawerOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            style={{
              width: '280px',
              height: '100%',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-color)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Menu</div>
              <button onClick={() => setDrawerOpen(false)} className="btn btn-ghost btn-sm">
                <X size={20} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
              >
                <User size={18} />
                <span>User Profile</span>
              </Link>
              <Link
                href="/memory"
                onClick={() => setDrawerOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
              >
                <Brain size={18} />
                <span>AI Memory</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setDrawerOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
