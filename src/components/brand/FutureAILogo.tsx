'use client';

interface FutureAILogoProps {
  size?: number;
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export function FutureAILogo({
  size = 32,
  showText = true,
  subtitle = 'Reality Forecast',
  className = '',
}: FutureAILogoProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      {/* Future AI Styled Emblem Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="40" height="40" rx="12" fill="url(#fai_bg_grad)" />
        {/* Curved 'F' Mark with Sleek Gradient */}
        <path
          d="M12 28V12H26C27.1 12 28 12.9 28 14C28 15.1 27.1 16 26 16H17V19H24C25.1 19 26 19.9 26 21C26 22.1 25.1 23 24 23H17V28H12Z"
          fill="url(#fai_f_grad)"
        />
        {/* Orbital Trajectory Spark */}
        <circle cx="28" cy="14" r="2.5" fill="#60A5FA" />
        <defs>
          <linearGradient id="fai_bg_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="fai_f_grad" x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E0E7FF" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: `${Math.max(16, size * 0.55)}px`,
              letterSpacing: '-0.02em',
              color: '#0F172A',
              lineHeight: 1.1,
              fontFamily: 'Inter, var(--font-sans), sans-serif',
            }}
          >
            Future AI
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: `${Math.max(11, size * 0.35)}px`,
                color: '#64748B',
                fontWeight: 600,
                marginTop: '0.15rem',
                letterSpacing: '0.02em',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
