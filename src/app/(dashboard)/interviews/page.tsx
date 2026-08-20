import Link from 'next/link';
import { forecastStore } from '@/lib/forecast-store';
import { Briefcase, ArrowRight, Shield } from 'lucide-react';

export default async function InterviewIntelListPage() {
  const interviews = forecastStore.getAllInterviews();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div>
        <div className="badge badge-primary" style={{ marginBottom: '0.4rem', fontSize: '0.7rem', color: '#D97706', borderColor: '#FDE68A', background: '#FFFBEB' }}>
          <Briefcase size={12} />
          <span>PREPARATION READINESS ENGINE</span>
        </div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Interview Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
          Technical readiness analysis, role match evaluation, and adaptive STAR framework mock interviews.
        </p>
      </div>

      {/* List of Interview Preps (Amber Card Theme) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {interviews.map((intv) => (
          <div key={intv.id} className="card card-amber" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-primary" style={{ color: '#D97706', background: '#FFFFFF', borderColor: '#FDE68A' }}>
                  ROLE READINESS MODEL
                </span>
                <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>{intv.companyName}</span>
              </div>

              <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                {intv.roleTitle} @ {intv.companyName}
              </h3>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {intv.preparationGaps.length} Preparation Gaps Identified • {intv.suggestedQuestions.length} Practice Questions Ready
              </p>
            </div>

            {/* Readiness Scores */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TECHNICAL</div>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                  {Math.round(intv.technicalReadiness * 100)}%
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>BEHAVIORAL</div>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D97706' }}>
                  {Math.round(intv.behavioralReadiness * 100)}%
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>ROLE MATCH</div>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563EB' }}>
                  {Math.round(intv.roleMatchScore * 100)}%
                </div>
              </div>

              <Link href={`/interviews/${intv.id}`} className="btn btn-primary btn-sm" style={{ background: '#D97706' }}>
                <span>Start Mock Interview</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Ethics Disclaimer */}
      <div className="card card-rose" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        <div style={{ fontWeight: 600, color: '#BE123C', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Shield size={16} color="#E11D48" />
          <span>Interview Readiness Model Scope</span>
        </div>
        The interview module evaluates your preparation completeness, technical topic alignment, and story clarity. It does NOT attempt to predict whether a specific employer will extend a job offer.
      </div>
    </div>
  );
}
