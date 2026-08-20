'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ForecastRecord } from '@/types/forecast';
import { Compass, Plus, Search, Filter, Calendar, MapPin, ArrowRight } from 'lucide-react';

export function ForecastLibraryClient({ initialForecasts }: { initialForecasts: ForecastRecord[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  const filteredForecasts = initialForecasts.filter((fc) => {
    const loc = fc.location || '';
    const matchesSearch =
      fc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.originalInput.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain =
      selectedDomain === 'ALL' || fc.domain.toLowerCase() === selectedDomain.toLowerCase();

    return matchesSearch && matchesDomain;
  });

  const getThemeClass = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'interview': return 'card-purple';
      case 'travel': return 'card-blue';
      case 'exam': return 'card-emerald';
      case 'meeting': return 'card-amber';
      case 'hotel': return 'card-rose';
      default: return 'card-cyan';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '0.4rem', color: '#E9D5FF', borderColor: '#A855F7', background: '#3B0764' }}>
            <Compass size={12} />
            <span>PREDICTION LIBRARY & ARCHIVE</span>
          </div>
          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Prediction Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Historical timeline of decision forecasts, evidence packages, and verified outcome calibration.
          </p>
        </div>

        <Link href="/forecasts/new" className="btn btn-primary" style={{ background: '#A855F7' }}>
          <Plus size={16} />
          <span>New Forecast</span>
        </Link>
      </div>

      {/* Search & Domain Filter Bar (Purple Card Theme) */}
      <div className="card card-purple" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search past predictions (e.g. What happened with my Gurgaon interview?)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#C084FC', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={13} />
            DOMAIN:
          </span>
          {['ALL', 'TRAVEL', 'INTERVIEW', 'EXAM', 'MEETING', 'PERSONAL'].map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`btn ${selectedDomain === dom ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{
                fontSize: '0.75rem',
                padding: '0.3rem 0.75rem',
                background: selectedDomain === dom ? '#A855F7' : 'var(--bg-elevated)',
              }}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Forecast Timeline / Archive List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredForecasts.length === 0 ? (
          <div className="card card-purple" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No predictions found matching "{searchQuery}". Try adjusting your search query or domain filter.
          </div>
        ) : (
          filteredForecasts.map((fc) => {
            const cardThemeClass = getThemeClass(fc.domain);
            return (
              <div
                key={fc.id}
                className={`card card-interactive ${cardThemeClass}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.675rem', background: 'var(--bg-elevated)' }}>
                      {fc.domain.toUpperCase()}
                    </span>
                    <span className={`badge ${fc.status.toUpperCase() === 'READY' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.675rem' }}>
                      {fc.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      {new Date(fc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    <Link href={`/forecasts/${fc.id}`} style={{ color: 'var(--text-primary)' }}>
                      {fc.title}
                    </Link>
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={13} color="var(--accent-primary)" />
                      {fc.location || 'Location Not Specified'}
                    </span>
                    <span>•</span>
                    <span>{fc.scenarios.length} Scenarios</span>
                    <span>•</span>
                    <span>{fc.risks.length} Risks</span>
                  </div>
                </div>

                {/* Feasibility & Confidence Indicators */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>FEASIBILITY</div>
                    <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>
                      {Math.round(fc.overallScore * 100)}%
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>CONFIDENCE</div>
                    <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C084FC' }}>
                      {Math.round(fc.confidence * 100)}%
                    </div>
                  </div>

                  <Link href={`/forecasts/${fc.id}`} className="btn btn-secondary btn-sm" style={{ background: 'var(--bg-elevated)' }}>
                    <span>Analyze</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
