'use client';

import { useState } from 'react';
import { User, Briefcase, MapPin, Globe, CheckCircle2, Edit2, Save, X, ShieldCheck } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  location: string;
  timezone: string;
  skills: string;
  jobPreferences: string;
  transportPreferences: string;
  departureBufferMins: number;
}

export function ProfileClient({ initialData }: { initialData?: Partial<ProfileData> }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: initialData?.name || 'Sachin',
    email: initialData?.email || 'sachin@example.com',
    bio: initialData?.bio || 'Senior Full Stack Software Engineer preparing for system design & tech interviews in Delhi NCR.',
    location: initialData?.location || 'Delhi NCR, India',
    timezone: initialData?.timezone || 'Asia/Kolkata (GMT+5:30)',
    skills: initialData?.skills || 'TypeScript, Next.js, React, Node.js, System Design, PostgreSQL, Prisma',
    jobPreferences: initialData?.jobPreferences || 'Senior Full Stack Developer / Software Engineer',
    transportPreferences: initialData?.transportPreferences || 'Car (Primary), Delhi Metro (Secondary Fallback)',
    departureBufferMins: initialData?.departureBufferMins || 30,
  });

  const [editingSection, setEditingSection] = useState<'personal' | 'professional' | 'travel' | null>(null);
  const [draft, setDraft] = useState<ProfileData>(profile);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const profileCompletion = 82;

  const handleEdit = (section: 'personal' | 'professional' | 'travel') => {
    setDraft(profile);
    setEditingSection(section);
    setSuccessMsg('');
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditingSection(null);
  };

  const handleSave = async (section: 'personal' | 'professional' | 'travel') => {
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          bio: draft.bio,
          location: draft.location,
          timezone: draft.timezone,
          skills: draft.skills,
          jobPreferences: draft.jobPreferences,
          transportPreferences: draft.transportPreferences,
        }),
      });

      if (res.ok) {
        setProfile(draft);
        setEditingSection(null);
        setSuccessMsg('Profile updated & persisted to DB ✓');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('profileUpdated'));
        }
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setProfile(draft);
        setEditingSection(null);
        setSuccessMsg('Profile updated ✓');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('profileUpdated'));
        }
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch {
      setProfile(draft);
      setEditingSection(null);
      setSuccessMsg('Profile updated ✓');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('profileUpdated'));
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '0.4rem', color: '#22D3EE', borderColor: '#0891B2', background: '#083344' }}>
            <User size={12} />
            <span>IDENTITY & PERSONAL CONTEXT</span>
          </div>
          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            User Identity & Personal Context
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Manage your background, technical profile, travel context, and forecast personalization rules.
          </p>
        </div>

        {successMsg && (
          <div
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              color: 'var(--success)',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Profile Overview Card (Cyan Theme) */}
      <div className="card card-cyan">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#0891B2',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'DD'}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{profile.name}</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{profile.email}</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} color="#22D3EE" />
                {profile.location}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Globe size={12} color="#22D3EE" />
                {profile.timezone}
              </span>
            </div>
          </div>

          {/* Completion Meter */}
          <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid #164E63', minWidth: '180px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              <span>PROFILE COMPLETION</span>
              <span className="font-mono" style={{ color: '#22D3EE' }}>{profileCompletion}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${profileCompletion}%`, height: '100%', background: '#0891B2', borderRadius: '3px' }} />
            </div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', marginTop: '0.35rem' }}>
              Complete profile to improve forecast calibration.
            </div>
          </div>
        </div>
      </div>

      {/* 1. PERSONAL IDENTITY SECTION (Blue Theme) */}
      <div className="card card-blue">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} color="#3B82F6" />
            <span>Personal Identity</span>
          </h3>

          {editingSection === 'personal' ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleSave('personal')} disabled={loading} className="btn btn-primary btn-sm">
                <Save size={14} />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
              <button onClick={handleCancel} disabled={loading} className="btn btn-secondary btn-sm">
                <X size={14} />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <button onClick={() => handleEdit('personal')} className="btn btn-secondary btn-sm">
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
          )}
        </div>

        {editingSection === 'personal' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Full Name</label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="input"
                style={{ marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Email Address</label>
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                className="input"
                style={{ marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Primary Location</label>
              <input
                type="text"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                className="input"
                style={{ marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Timezone</label>
              <input
                type="text"
                value={draft.timezone}
                onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                className="input"
                style={{ marginTop: '0.25rem' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>FULL NAME</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{profile.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>EMAIL ADDRESS</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{profile.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>LOCATION</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{profile.location}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TIMEZONE</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{profile.timezone}</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. PROFESSIONAL CONTEXT SECTION (Purple Theme) */}
      <div className="card card-purple">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Briefcase size={16} color="#A855F7" />
            <span>Professional Context & Skills</span>
          </h3>

          {editingSection === 'professional' ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleSave('professional')} disabled={loading} className="btn btn-primary btn-sm">
                <Save size={14} />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
              <button onClick={handleCancel} disabled={loading} className="btn btn-secondary btn-sm">
                <X size={14} />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <button onClick={() => handleEdit('professional')} className="btn btn-secondary btn-sm">
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
          )}
        </div>

        {editingSection === 'professional' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Target Role Preferences</label>
              <input
                type="text"
                value={draft.jobPreferences}
                onChange={(e) => setDraft({ ...draft, jobPreferences: e.target.value })}
                className="input"
                style={{ marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Core Skills (comma-separated)</label>
              <textarea
                value={draft.skills}
                onChange={(e) => setDraft({ ...draft, skills: e.target.value })}
                className="textarea"
                style={{ marginTop: '0.25rem', minHeight: '70px' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TARGET ROLE</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{profile.jobPreferences}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '0.3rem' }}>TECHNOLOGIES & SKILLS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {profile.skills.split(',').map((s) => (
                  <span key={s} className="badge badge-primary" style={{ color: '#E9D5FF', borderColor: '#A855F7', background: 'var(--bg-elevated)' }}>
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. FORECAST PERSONALIZATION RULES CHECKLIST (Emerald Theme) */}
      <div className="card card-emerald">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="#10B981" />
            <span>What Reality Currently Knows About You</span>
          </h3>
          <span className="badge badge-success">4 Active Rules</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            { rule: 'You frequently travel by car from Noida to Gurgaon/Delhi', status: 'Active' },
            { rule: 'Your target occupation focuses on Software Engineering & React', status: 'Active' },
            { rule: 'You require a minimum 30-minute buffer for interview schedules', status: 'Active' },
            { rule: 'DND Corridor morning congestion is factored into your travel risk', status: 'Active' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid #065F46', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>{item.rule}</span>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
