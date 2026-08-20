'use client';

import { useState } from 'react';
import { Brain, Plus, Trash2, Sparkles } from 'lucide-react';

interface MemoryItem {
  id: string;
  category: string;
  key: string;
  value: string;
  source: string;
  confidence: number;
  enabled: boolean;
  updatedAt: string;
}

export function MemoryClient() {
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: 'm1',
      category: 'Transport',
      key: 'preferred_mode',
      value: 'Prefers car travel for Noida-Delhi NCR trips, keeping Metro as secondary fallback.',
      source: 'user_stated',
      confidence: 0.95,
      enabled: true,
      updatedAt: 'Today',
    },
    {
      id: 'm2',
      category: 'Interview',
      key: 'primary_tech_stack',
      value: 'Specializes in Next.js App Router, TypeScript, Prisma, and System Design architecture.',
      source: 'profile_sync',
      confidence: 0.90,
      enabled: true,
      updatedAt: 'Yesterday',
    },
    {
      id: 'm3',
      category: 'Habits',
      key: 'departure_buffer',
      value: 'Requires minimum 30-minute arrival buffer for critical client & job interviews.',
      source: 'user_stated',
      confidence: 1.0,
      enabled: true,
      updatedAt: '3 days ago',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('Goals');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const toggleMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    const item: MemoryItem = {
      id: `m-${Date.now()}`,
      category: newCategory,
      key: newKey,
      value: newValue,
      source: 'user_stated',
      confidence: 0.95,
      enabled: true,
      updatedAt: 'Just now',
    };

    setMemories([item, ...memories]);
    setNewKey('');
    setNewValue('');
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '0.4rem', color: '#E9D5FF', borderColor: '#A855F7', background: '#3B0764' }}>
            <Brain size={12} />
            <span>PERSONAL KNOWLEDGE BASE</span>
          </div>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Your Reality Memory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
            These memories help personalize forecasts. You control what Reality uses for your decision support.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" style={{ background: '#A855F7' }}>
          <Plus size={16} />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Memory List Card (Purple Theme) */}
      <div className="card card-purple" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#E9D5FF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="#A855F7" />
            <span>Stored Memory Items ({memories.length})</span>
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#C084FC', fontWeight: 600 }}>User Controlled & Scoped</span>
        </div>

        {memories.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No stored memories yet. Click "Add Memory" to personalize your forecasts.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {memories.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  opacity: m.enabled ? 1 : 0.6,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', color: '#E9D5FF', background: '#3B0764', borderColor: '#A855F7' }}>
                      {m.category}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.key}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {m.value}
                  </p>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.4rem', display: 'flex', gap: '0.75rem' }}>
                    <span>Source: {m.source}</span>
                    <span>•</span>
                    <span>Confidence: {Math.round(m.confidence * 100)}%</span>
                    <span>•</span>
                    <span>Updated: {m.updatedAt}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={m.enabled}
                      onChange={() => toggleMemory(m.id)}
                      style={{ accentColor: '#A855F7' }}
                    />
                    <span>{m.enabled ? 'Enabled' : 'Disabled'}</span>
                  </label>
                  <button onClick={() => deleteMemory(m.id)} className="btn btn-ghost btn-sm" style={{ padding: '0.3rem', color: 'var(--danger)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="card card-purple"
            style={{ width: '100%', maxWidth: '480px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Add Personal Memory</h3>
            <form onSubmit={handleAddMemory} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input"
                  style={{ marginTop: '0.25rem' }}
                >
                  <option value="Goals">Goals</option>
                  <option value="Preferences">Preferences</option>
                  <option value="Habits">Habits</option>
                  <option value="Skills">Skills</option>
                  <option value="Transport">Transport</option>
                  <option value="Interview">Interview</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Memory Key Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. preferred_departure_buffer"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="input"
                  style={{ marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Memory Value / Fact</label>
                <textarea
                  placeholder="e.g. Always leave 30 minutes buffer for highway travel during morning rush hour."
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="textarea"
                  style={{ marginTop: '0.25rem', minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#A855F7' }} disabled={!newKey.trim() || !newValue.trim()}>
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
