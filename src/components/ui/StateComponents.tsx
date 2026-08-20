'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: 'var(--bg-card)',
        border: '1px dashed var(--border-highlight)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {Icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
          }}
        >
          <Icon size={24} />
        </div>
      )}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5, marginBottom: '1.25rem' }}>
        {description}
      </p>
      {actionLabel && (
        actionHref ? (
          <a href={actionHref} className="btn btn-primary btn-md">
            {actionLabel}
          </a>
        ) : (
          <button onClick={onAction} className="btn btn-primary btn-md">
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Service Unavailable',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--danger-bg)',
        border: '1px solid var(--danger-border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem',
      }}
    >
      <AlertCircle size={20} color="var(--danger)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.2rem' }}>
          {title}
        </h4>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {message}
        </p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingSkeleton({ message }: LoadingStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {message && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
          {message}
        </div>
      )}
      <div style={{ width: '100%', height: '100px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', opacity: 0.6 }} />
      <div style={{ width: '100%', height: '180px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', opacity: 0.4 }} />
    </div>
  );
}
