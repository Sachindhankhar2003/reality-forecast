'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, Clock, AlertCircle, ShieldAlert, Send } from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [adminResponseInput, setAdminResponseInput] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch('/api/admin/requests');
      const json = await res.json();
      if (json.success) {
        setRequests(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch support requests', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleResponseSubmit(newStatus: string = 'RESOLVED') {
    if (!selectedTicket) return;
    setUpdating(true);

    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicket.id,
          status: newStatus,
          adminResponse: adminResponseInput,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAdminResponseInput('');
        setSelectedTicket(null);
        fetchRequests();
      }
    } catch (e) {
      console.error('Failed to update ticket', e);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <MessageSquare color="#A855F7" size={28} />
            <span>Admin Requests & Feedback Center</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Review user feedback, bug reports, and issue official admin responses.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading support requests...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
          {/* TICKET LIST */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>User Tickets ({requests.length})</h3>

            {requests.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No feedback requests submitted yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {requests.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setAdminResponseInput(ticket.adminResponse || '');
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: selectedTicket?.id === ticket.id ? 'var(--bg-hover)' : 'var(--bg-elevated)',
                      border: selectedTicket?.id === ticket.id ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-purple">{ticket.category}</span>
                      <span className={`badge ${ticket.status === 'RESOLVED' ? 'badge-green' : 'badge-amber'}`}>{ticket.status}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ticket.message}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>User: {ticket.user?.name || ticket.user?.email}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TICKET DETAIL & RESPONSE DRAWER */}
          {selectedTicket && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Manage Ticket</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>User Email:</strong> {selectedTicket.user?.email}
              </div>
              <div style={{ padding: '0.85rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {selectedTicket.message}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Official Admin Response:</label>
                <textarea
                  rows={4}
                  value={adminResponseInput}
                  onChange={(e) => setAdminResponseInput(e.target.value)}
                  placeholder="Type official response visible to user..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  disabled={updating}
                  onClick={() => handleResponseSubmit('IN_REVIEW')}
                  className="btn btn-secondary"
                >
                  Mark In Review
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleResponseSubmit('RESOLVED')}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={14} />
                  <span>{updating ? 'Saving...' : 'Resolve & Reply'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
