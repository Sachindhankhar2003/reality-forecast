'use client';

import { useState, useEffect } from 'react';
import { Activity, Bell, Search, UserCheck, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const [userName, setUserName] = useState('Sachin');

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const json = await res.json();
      if (json.success && json.data?.name) {
        setUserName(json.data.name);
      }
    } catch {
      // Fallback to default
    }
  };

  useEffect(() => {
    fetchUserProfile();

    const handleProfileUpdate = () => {
      fetchUserProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const initials = userName
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join('')
    .slice(0, 2) || 'DD';

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Quick Search */}
        <div className="mobile-hide" style={{ position: 'relative', width: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search forecasts, risks, or actions..."
            className="input"
            style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', height: '34px', fontSize: '0.8rem' }}
          />
        </div>

        {/* Telemetry Status Indicator */}
        <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>
          <Activity size={12} />
          <span>Live Telemetry Active</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Dark / Light Theme Toggle */}
        <ThemeToggle />

        <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
          <Bell size={16} />
        </button>

        {/* User Account Button */}
        <Link
          href="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.6rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
            {initials}
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>{userName}</span>
              <UserCheck size={12} color="var(--success)" />
            </div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)' }}>Pro Account</div>
          </div>
        </Link>

        {/* Log Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', gap: '0.35rem', color: '#EF4444' }}
          title="Sign out of your account"
        >
          <LogOut size={15} />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}
