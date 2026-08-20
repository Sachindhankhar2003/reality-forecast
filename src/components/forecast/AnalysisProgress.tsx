'use client';

import { CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Step {
  id: string;
  label: string;
}

const steps: Step[] = [
  { id: '1', label: 'Understanding your plan' },
  { id: '2', label: 'Identifying relevant factors' },
  { id: '3', label: 'Checking live telemetry (Open-Meteo & TomTom)' },
  { id: '4', label: 'Building possible scenarios' },
  { id: '5', label: 'Preparing personalized recommendations' },
];

interface AnalysisProgressProps {
  onComplete?: () => void;
}

export function AnalysisProgress({ onComplete }: AnalysisProgressProps) {
  const [completedIndex, setCompletedIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="card" style={{ background: 'var(--bg-secondary)', padding: '2rem', maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Generating Forecast & Analyzing Telemetry
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
        {steps.map((step, idx) => {
          const isDone = idx < completedIndex;
          const isCurrent = idx === completedIndex;

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isCurrent ? 'var(--bg-elevated)' : 'transparent',
                border: isCurrent ? '1px solid var(--border-color)' : '1px solid transparent',
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isDone ? 'var(--text-primary)' : isCurrent ? 'var(--accent-light)' : 'var(--text-tertiary)',
                }}
              >
                {step.label}
              </span>

              {isDone ? (
                <CheckCircle2 size={18} color="var(--success)" />
              ) : isCurrent ? (
                <Loader2 size={18} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
