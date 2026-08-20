'use client';

import { useState } from 'react';
import { CheckCircle2, Edit3, Sparkles } from 'lucide-react';

interface ContextReviewProps {
  extractedData: {
    event: string;
    date: string;
    time: string;
    location: string;
    travelMode: string;
  };
  onConfirm: (confirmedData: any) => void;
  onCancel: () => void;
}

export function ContextReviewStep({ extractedData, onConfirm, onCancel }: ContextReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(extractedData);

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-primary)', padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Sparkles size={16} color="var(--accent-light)" />
        <span className="badge badge-primary">SMART CONTEXT EXTRACTION REVIEW</span>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        I understood your plan as:
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Please verify the extracted parameters below before generating full telemetry and scenarios.
      </p>

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Event Title</label>
            <input
              type="text"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              className="input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Time</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Travel Mode</label>
              <input
                type="text"
                value={formData.travelMode}
                onChange={(e) => setFormData({ ...formData, travelMode: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <button onClick={handleSaveEdit} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
            Save Changes
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Event</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{formData.event}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Date & Time</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{formData.date} at {formData.time}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{formData.location}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Travel Mode</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem', textTransform: 'capitalize' }}>{formData.travelMode}</div>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setIsEditing(!isEditing)} className="btn btn-ghost btn-sm">
          <Edit3 size={16} />
          <span>{isEditing ? 'Cancel Edit' : 'Edit details'}</span>
        </button>

        <button onClick={() => onConfirm(formData)} className="btn btn-primary btn-lg">
          <CheckCircle2 size={18} />
          <span>Looks right — Generate Forecast</span>
        </button>
      </div>
    </div>
  );
}
