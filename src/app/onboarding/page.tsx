'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Briefcase, Target, Navigation, ArrowRight, Check } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState('Software Developer');
  const [targetGoal, setTargetGoal] = useState('Getting a Senior Developer / Lead Role');
  const [primaryTransport, setPrimaryTransport] = useState('Delhi Metro & Car');
  const [submitting, setSubmitting] = useState(false);

  async function handleFinishOnboarding() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession,
          targetGoal,
          primaryTransport,
          timezone: 'Asia/Kolkata',
          skills: 'TypeScript, Next.js, System Architecture',
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error('Failed to complete onboarding', e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-main)', padding: '1.5rem' }}>
      <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.15)', marginBottom: '0.75rem' }}>
            <Compass size={32} color="#A855F7" />
          </div>
          <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome to Reality Forecast</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tell Reality about yourself to calibrate your personal decision intelligence.</p>
        </div>

        {/* STEP PROGRESS */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                height: '4px',
                width: '60px',
                borderRadius: '2px',
                background: s <= step ? '#A855F7' : 'var(--border-color)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* STEP 1: PROFESSION */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} color="#A855F7" />
              <span>What do you usually do?</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Software Developer', 'B.Tech / CSE Student', 'Job Seeker / Applicant', 'Engineering Manager', 'Freelancer', 'Other'].map((item) => (
                <button
                  key={item}
                  onClick={() => setProfession(item)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: profession === item ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-elevated)',
                    border: profession === item ? '2px solid #A855F7' : '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: TARGET GOAL */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="#A855F7" />
              <span>What are you currently trying to achieve?</span>
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              placeholder="e.g. Getting a software developer job in Gurgaon"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
            />
            <button onClick={() => setStep(3)} className="btn btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 3: TRANSPORT & FINISH */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="#A855F7" />
              <span>How do you usually travel?</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Delhi Metro & Car', 'Car / Taxi', 'Bike / Two-Wheeler', 'Public Bus / Auto'].map((item) => (
                <button
                  key={item}
                  onClick={() => setPrimaryTransport(item)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: primaryTransport === item ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-elevated)',
                    border: primaryTransport === item ? '2px solid #A855F7' : '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              disabled={submitting}
              onClick={handleFinishOnboarding}
              className="btn btn-primary"
              style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Check size={16} />
              <span>{submitting ? 'Calibrating...' : 'Complete & Launch Dashboard'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
