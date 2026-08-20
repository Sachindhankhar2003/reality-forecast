'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface UserRecord {
  id: string;
  email: string;
  name?: string | null;
  role: 'USER' | 'ADMIN';
  status: string;
  createdAt: string;
  lastLoginAt?: string | null;
  _count: {
    forecasts: number;
    interviews: number;
    conversations: number;
    memories: number;
  };
}

export function AdminUsersClient({ initialUsers }: { initialUsers: UserRecord[] }) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleToggle = async (user: UserRecord) => {
    const targetRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Are you sure you want to change ${user.email}'s role to ${targetRole}?`)) return;

    setLoadingId(user.id);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: data.data.role } : u))
        );
      } else {
        setErrorMsg(data.error?.message || 'Role update failed.');
      }
    } catch {
      setErrorMsg('Role update failed.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusToggle = async (user: UserRecord) => {
    const targetStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to change ${user.email}'s status to ${targetStatus}?`)) return;

    setLoadingId(user.id);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: data.data.status } : u))
        );
      } else {
        setErrorMsg(data.error?.message || 'Status update failed.');
      }
    } catch {
      setErrorMsg('Status update failed.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          User Management Console
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Inspect user accounts, assign admin roles, manage account status, and enforce last-admin security protection.
        </p>
      </div>

      {errorMsg && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Filter Bar */}
      <div className="card card-purple" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>ROLE:</span>
            {['ALL', 'USER', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`btn ${roleFilter === r ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                {r}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>STATUS:</span>
            {['ALL', 'ACTIVE', 'DISABLED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Records Table */}
      <div className="card card-indigo" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-tertiary)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>User / Email</th>
              <th style={{ padding: '0.75rem 1rem' }}>Role</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Forecasts</th>
              <th style={{ padding: '0.75rem 1rem' }}>Interviews</th>
              <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name || 'Unnamed User'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{u.email}</div>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-neutral'}`}>
                    {u.role}
                  </span>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                    {u.status}
                  </span>
                </td>

                <td style={{ padding: '0.85rem 1rem' }} className="font-mono">{u._count.forecasts}</td>
                <td style={{ padding: '0.85rem 1rem' }} className="font-mono">{u._count.interviews}</td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={loadingId === u.id}
                      className="btn btn-secondary btn-sm"
                    >
                      {u.role === 'ADMIN' ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      onClick={() => handleStatusToggle(u)}
                      disabled={loadingId === u.id}
                      className={`btn ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'} btn-sm`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {u.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                    </button>
                    <Link href={`/admin/users/${u.id}`} className="btn btn-ghost btn-sm">
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
