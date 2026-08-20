'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createForecastAction } from '@/actions/forecast-actions';
import { Sparkles, ArrowRight, ShieldAlert, Car, Briefcase, GraduationCap } from 'lucide-react';

function NewForecastForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('input', input);

    const res = await createForecastAction(formData);

    if (res.success && res.data) {
      router.push(`/forecasts/${res.data.id}`);
    } else {
      setError(res.error || 'Failed to create forecast.');
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title Header */}
      <div>
        <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
          <Sparkles size={12} />
          <span>NATURAL LANGUAGE INTENT EXTRACTION</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Create Evidence-Based Forecast
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.25rem', lineHeight: 1.5 }}>
          Describe your upcoming event, journey, or plan in plain English. The context engine will extract factors, fetch real-time telemetry, and build scenario distributions.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            What are you planning to do?
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Tomorrow I have a software developer interview in Delhi. I will travel by car."
            className="textarea"
            style={{ minHeight: '110px', fontSize: '0.95rem', lineHeight: 1.5 }}
            disabled={loading}
          />
        </div>

        {/* Live Intent Interpretation Preview */}
        {input.trim().length > 10 && (
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} color="var(--accent-light)" />
              <span>Extracted Intent Breakdown</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              <div>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Domain: </span>
                <span style={{ fontWeight: 600, color: 'var(--accent-light)' }}>
                  {input.toLowerCase().includes('interview') ? 'Interview' : input.toLowerCase().includes('delhi') || input.toLowerCase().includes('drive') || input.toLowerCase().includes('noida') ? 'Travel' : 'Generic'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Date: </span>
                <span style={{ color: 'var(--text-primary)' }}>{input.toLowerCase().includes('tomorrow') ? 'Tomorrow' : 'Specified date'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Time: </span>
                <span style={{ color: 'var(--text-primary)' }}>{input.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)/i)?.[0] || 'Not specified'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Location: </span>
                <span style={{ color: 'var(--text-primary)' }}>{input.toLowerCase().includes('gurgaon') ? 'Gurgaon' : input.toLowerCase().includes('delhi') ? 'Delhi' : 'Not specified'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Transport: </span>
                <span style={{ color: 'var(--text-primary)' }}>{input.toLowerCase().includes('drive') || input.toLowerCase().includes('car') ? 'Car / Drive' : 'Unspecified'}</span>
              </div>
            </div>

            {/* Highest-value clarification prompt if company missing in interview */}
            {input.toLowerCase().includes('interview') && !input.match(/(?:at|with)\s+[A-Z][a-zA-Z]+/i) && (
              <div style={{ marginTop: '0.65rem', paddingTop: '0.5rem', borderTop: '1px border var(--border-color)', color: 'var(--warning)', fontSize: '0.75rem', fontWeight: 500 }}>
                💡 <strong>Highest-Value Clarification:</strong> Which company or organization is this interview with? (Adding this improves domain precision).
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            * Uses Open-Meteo weather telemetry and TomTom traffic corridor analysis
          </span>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !input.trim()}>
            {loading ? (
              <span>Analyzing & Fetching Telemetry...</span>
            ) : (
              <>
                <span>Generate Forecast</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Domain Quick Sample Cards */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Or select a sample plan template:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
          <div
            className="card card-interactive"
            onClick={() => handleSuggestionClick('Tomorrow I have a software developer interview in Delhi. I will travel by car.')}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
          >
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Delhi Software Developer Interview</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>Travel domain + technical readiness factor evaluation</div>
            </div>
          </div>

          <div
            className="card card-interactive"
            onClick={() => handleSuggestionClick('I have an important business client presentation in Bengaluru tomorrow at 10 AM.')}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
          >
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Car size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Bengaluru Client Pitch</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>Traffic corridor delays + deck preparation readiness</div>
            </div>
          </div>

          <div
            className="card card-interactive"
            onClick={() => handleSuggestionClick('I am taking the national engineering entrance exam in Mumbai on Sunday morning.')}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
          >
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mumbai Exam Center Plan</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>Test center travel buffer + syllabus coverage model</div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="card" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldAlert size={16} color="var(--warning)" />
          <span>Scientific Disclaimer</span>
        </div>
        Reality Forecast computes probabilistic estimates based on live telemetry and factor weighting. It does NOT claim to literally predict hiring decisions or guaranteed pass rates.
      </div>
    </div>
  );
}

export default function NewForecastPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', color: 'var(--text-tertiary)' }}>Loading natural language forecast form...</div>}>
      <NewForecastForm />
    </Suspense>
  );
}
