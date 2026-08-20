'use client';

interface RealityLogoProps {
  size?: number;
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export function RealityLogo({
  size = 32,
  showText = true,
  subtitle = 'Future Intelligence for Real Decisions',
  className = '',
}: RealityLogoProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
      }}
    >
      {/* Futuristic Trajectory & Reality Check Symbol */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer Hex Shield Frame */}
        <path
          d="M16 2L28 8.5V23.5L16 30L4 23.5V8.5L16 2Z"
          fill="url(#logo_grad_rf)"
          stroke="#A855F7"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Prediction Trajectory Vector */}
        <path
          d="M9 20C12 14 16 11 23 10"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 1"
        />

        {/* Reality Check Signal Mark */}
        <path
          d="M11 16L15 20L22 12"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Future Timeline Pointer Dot */}
        <circle cx="23" cy="10" r="2.5" fill="#C084FC" />

        <defs>
          <linearGradient
            id="logo_grad_rf"
            x1="4"
            y1="2"
            x2="28"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A855F7" />
            <stop offset="1" stopColor="#6B21A8" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            className="font-display"
            style={{
              fontWeight: 800,
              fontSize: `${Math.max(15, size * 0.55)}px`,
              letterSpacing: '-0.02em',
              color: '#F5F3FF',
              lineHeight: 1.1,
            }}
          >
            Reality Forecast
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: `${Math.max(10, size * 0.35)}px`,
                color: '#C4B5FD',
                fontWeight: 500,
                marginTop: '0.1rem',
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
