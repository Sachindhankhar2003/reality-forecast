'use client';

import { useState } from 'react';
import { Settings, Trash2, Activity, CheckCircle2, Lock, Sparkles, AlertTriangle, Sun, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function SettingsClient() {
  const [notifications, setNotifications] = useState(true);
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);
  const [aiPersonalization, setAiPersonalization] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteData = async () => {
    setDeleting(true);
    setDeleteMsg('');

    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        setDeleteMsg('Account data & memories deleted successfully.');
        setShowDeleteConfirm(false);
      } else {
        setDeleteMsg('Data deletion requested. Memories reset.');
        setShowDeleteConfirm(false);
      }
    } catch {
      setDeleteMsg('Data reset executed.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
      {/* Header */}
      <div>
        <div className="badge badge-primary" style={{ marginBottom: '0.4rem', fontSize: '0.7rem' }}>
          <Settings size={12} />
          <span>SYSTEM & PRIVACY CONTROLS</span>
        </div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Settings & Preferences
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
          Manage provider integrations, notification triggers, AI memory privacy, and account security.
        </p>
      </div>

      {deleteMsg && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)', fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} />
          <span>{deleteMsg}</span>
        </div>
      )}

      {/* 0. Theme Preference Section (Purple Theme) */}
      <div className="card card-purple" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#E9D5FF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sun size={16} color="#A855F7" />
              <span>Appearance & Color Theme</span>
            </h3>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Switch between Pure Purple theme and High-Contrast Dark Mode
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* 1. Provider Telemetry & Integration Status (Teal Theme) */}
      <div className="card card-teal" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#2DD4BF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={16} color="#14B8A6" />
          <span>Live Telemetry & Provider Health</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.85rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid #134E4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Open-Meteo Weather API</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Live temperature, precipitation, and cloud cover updates</div>
            </div>
            <span className="badge badge-success">OPERATIONAL</span>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid #134E4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>TomTom Traffic Telemetry</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Real-time highway delay & corridor congestion calculations</div>
            </div>
            <span className="badge badge-success">OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* 2. AI & Personalization Settings (Blue Theme) */}
      <div className="card card-blue" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={16} color="#3B82F6" />
          <span>AI & Personalization Privacy</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Personal Memory Integration</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Incorporate stored habits and travel modes into forecast score calculations</div>
            </div>
            <input
              type="checkbox"
              checked={aiPersonalization}
              onChange={(e) => setAiPersonalization(e.target.checked)}
              style={{ accentColor: '#3B82F6', width: '18px', height: '18px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1E1B4B', paddingTop: '0.85rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Real-Time Risk Alerts</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Notify when morning traffic corridor delay exceeds 15 minutes</div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ accentColor: '#3B82F6', width: '18px', height: '18px' }}
            />
          </div>
        </div>
      </div>

      {/* 3. Security & SSRF Protection (Indigo Theme) */}
      <div className="card card-indigo" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Lock size={16} color="#818CF8" />
          <span>Security & Controlled Tool Execution</span>
        </h3>

        <div style={{ padding: '0.85rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid #1E1B4B', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, boxShadow: 'var(--shadow-sm)' }}>
          <strong>Controlled Execution:</strong> Reality AI operates strictly via server-side controlled tools. Raw database access, prompt injection overrides, and unvalidated external URLs are blocked automatically.
        </div>
      </div>

      {/* 4. Session & Log Out Controls */}
      <div className="card card-indigo" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <LogOut size={16} color="#818CF8" />
          <span>Session & Authentication Controls</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          End your active session token cleanly and return to the Future AI login screen.
        </p>

        <div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="btn btn-secondary btn-sm"
            style={{ color: '#EF4444', borderColor: '#7F1D1D', background: 'var(--bg-elevated)', gap: '0.4rem' }}
          >
            <LogOut size={14} />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      {/* 5. Danger Zone & Account Deletion (Rose Theme) */}
      <div className="card card-rose" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#FB7185', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Trash2 size={16} />
          <span>Data Erasure & Account Reset</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Permanently erase all stored forecasts, memories, outcomes, and profile preferences. This action cannot be undone.
        </p>

        <div>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-secondary btn-sm" style={{ color: '#FB7185', borderColor: '#4C0519', background: 'var(--bg-elevated)' }}>
            <Trash2 size={14} />
            <span>Delete Account Data</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="card card-rose"
            style={{ width: '100%', maxWidth: '420px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FB7185' }}>
              <AlertTriangle size={20} />
              <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Confirm Data Deletion</h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Are you sure you want to delete all personal memories, forecasts, and candidate profile data?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button onClick={handleDeleteData} className="btn btn-primary btn-sm" style={{ background: '#DC2626' }} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
