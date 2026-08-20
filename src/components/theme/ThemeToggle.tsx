'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('reality-theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('reality-theme', nextTheme);
  };

  if (!mounted) {
    return (
      <button className="btn btn-secondary btn-sm" style={{ padding: '0.4rem', borderRadius: '50%' }}>
        <Sun size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary btn-sm"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.65rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
      }}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon size={15} color="var(--accent-primary)" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={15} color="#f59e0b" />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
}
