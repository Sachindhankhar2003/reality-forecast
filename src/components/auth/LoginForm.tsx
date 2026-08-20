'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FutureAILogo } from '@/components/brand/FutureAILogo';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CloudSun,
  Car,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface LoginFormProps {
  callbackUrl?: string;
  initialError?: string;
}

export function LoginForm({ callbackUrl = '/dashboard', initialError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(initialError || '');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('Invalid email or password. Please verify your credentials and try again.');
        setLoading(false);
      } else {
        const destination = callbackUrl && !callbackUrl.includes('/login') ? callbackUrl : '/dashboard';
        window.location.href = destination;
      }
    } catch {
      setError('An unexpected authentication error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setError('Google sign-in could not be completed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setInfoMessage('Password reset instructions will be sent to your registered email if password recovery is configured on your server.');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F0F4FF 0%, #E8EEFF 50%, #F5F3FF 100%)',
        padding: '1.5rem 1rem',
        fontFamily: 'Inter, var(--font-sans), system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Outer Rounded Container Card */}
      <div
        style={{
          maxWidth: '1060px',
          width: '100%',
          minHeight: '620px',
          borderRadius: '24px',
          background: '#FFFFFF',
          boxShadow: '0 20px 60px rgba(30, 41, 59, 0.08), 0 4px 16px rgba(59, 130, 246, 0.04)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        {/* ================= LEFT PANEL (48%) ================= */}
        <div
          style={{
            background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 50%, #E0E7FF 100%)',
            padding: '2.5rem 2.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            borderRight: '1px solid rgba(226, 232, 240, 0.6)',
          }}
        >
          {/* Top Brand Logo */}
          <div>
            <FutureAILogo size={32} showText={true} subtitle="Reality Forecast" />
          </div>

          {/* Center Headline & Subtitle */}
          <div style={{ margin: '2rem 0', zIndex: 2 }}>
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                lineHeight: 1.18,
              }}
            >
              Plan Smarter.<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Arrive Better.
              </span>
            </h1>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#475569',
                marginTop: '0.85rem',
                lineHeight: 1.5,
                maxWidth: '380px',
              }}
            >
              AI-powered forecasts, real-time insights, and personalized guidance for every important moment.
            </p>
          </div>

          {/* Bottom Visual Horizon Illustration with Floating Telemetry Cards */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '210px',
              marginTop: 'auto',
              borderRadius: '16px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(224,231,255,0.6) 100%)',
              border: '1px solid rgba(255,255,255,0.8)',
              overflow: 'hidden',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            {/* SVG Skyline & Road Vector Graphic */}
            <svg
              viewBox="0 0 400 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.65,
                pointerEvents: 'none',
              }}
            >
              {/* City Silhouette */}
              <path
                d="M30 140V100H45V140M60 140V85H80V140M95 140V110H110V140M140 140V70H170V140M190 140V90H215V140M250 140V75H280V140M310 140V105H330V140"
                stroke="#C7D2FE"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              {/* Winding Highway Curve */}
              <path
                d="M-20 140C100 130 150 90 280 80C340 75 380 60 420 50"
                stroke="#3B82F6"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M-20 140C100 130 150 90 280 80C340 75 380 60 420 50"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Floating Visual Card 1: Weather */}
            <div
              style={{
                position: 'relative',
                zIndex: 3,
                alignSelf: 'flex-start',
                marginBottom: '0.65rem',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '0.55rem 0.85rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloudSun size={18} color="#D97706" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>25°C</div>
                <div style={{ fontSize: '0.675rem', color: '#64748B' }}>Partly Cloudy</div>
              </div>
            </div>

            {/* Floating Visual Card 2: Traffic */}
            <div
              style={{
                position: 'relative',
                zIndex: 3,
                alignSelf: 'flex-start',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '0.55rem 0.85rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: '#D1FAE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Car size={18} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 500 }}>Traffic</div>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#059669' }}>Moderate</div>
              </div>
              <MapPin size={14} color="#3B82F6" style={{ marginLeft: '0.3rem' }} />
            </div>
          </div>
        </div>

        {/* ================= RIGHT LOGIN CARD (52%) ================= */}
        <div
          style={{
            padding: '2.75rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: '#FFFFFF',
          }}
        >
          {/* Header & Greeting */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {/* Soft Emblem Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(224, 231, 255, 0.8)',
              }}
            >
              <Sparkles size={26} color="#3B82F6" />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Welcome Back 👋
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.2rem' }}>
              Sign in to continue to Future AI
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Info Alert */}
          {infoMessage && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#EFF6FF',
                border: '1px solid #93C5FD',
                color: '#1E40AF',
                fontSize: '0.825rem',
              }}
            >
              {infoMessage}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#1E293B',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Google G Logo SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              margin: '1.25rem 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'none',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: '#0F172A',
                    background: '#FFFFFF',
                    transition: 'border 0.15s ease',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: '#0F172A',
                    background: '#FFFFFF',
                    transition: 'border 0.15s ease',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 0,
                    display: 'flex',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8rem',
                    color: '#2563EB',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Sign In Primary Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)',
                color: '#FFFFFF',
                fontSize: '0.925rem',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.15s ease',
                marginTop: '0.35rem',
              }}
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <ArrowRight size={18} />}
            </button>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#2563EB', borderRadius: '4px', cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ fontSize: '0.825rem', color: '#475569', cursor: 'pointer' }}>
                Remember me
              </label>
            </div>
          </form>

          {/* Bottom Sign Up Link */}
          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
