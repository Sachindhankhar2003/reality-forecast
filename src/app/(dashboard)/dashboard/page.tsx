import Link from 'next/link';
import { forecastStore } from '@/lib/forecast-store';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { QuickPredictInput } from '@/components/dashboard/QuickPredictInput';
import { DirectPredictionCard } from '@/components/dashboard/DirectPredictionCard';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { LiveConditionsCard } from '@/components/dashboard/LiveConditionsCard';
import { TransportComparisonCard } from '@/components/dashboard/TransportComparisonCard';
import { ShortestPathCard } from '@/components/dashboard/ShortestPathCard';
import {
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  const userName = user?.name || 'Sachin';
  const forecasts = forecastStore.getAllForecasts();
  const activeForecast = forecasts[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* 1. Hero Section: Quick Predict Input Component */}
      <div className="card card-indigo" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              <Shield size={12} />
              <span>REALITY FORECAST ENGINE</span>
            </div>
            <h1
              className="font-display"
              style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
            >
              Good morning, {userName}.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
              Type or speak what you need to do. Reality AI will predict departure time, best transit mode, and shortest safe paths.
            </p>
          </div>
        </div>

        {/* Quick Predict Input Component (GPS Location + Voice Input + Templates) */}
        <QuickPredictInput />
      </div>

      {/* 2. DIRECT PREDICTED ACTION CARD (Google Calendar + WhatsApp Share + Push Notification Alert) */}
      <DirectPredictionCard forecastId={activeForecast?.id} />

      {/* 3. LIVE WEATHER & ATMOSPHERIC TELEMETRY BOX */}
      <LiveConditionsCard />

      {/* 4. TRANSPORT MODE COMPARISON CARD */}
      <TransportComparisonCard />

      {/* 5. SHORTEST & SAFEST ROUTE PATH CARD */}
      <ShortestPathCard />

      {/* 6. TRAFFIC TIMELINE GRAPH */}
      <TrafficChart />

      {/* 7. TOP ACTION CHECKLIST */}
      <div className="card card-emerald" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={18} color="#10B981" />
          <span>Top Recommended Actions</span>
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', gap: '0.75rem', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#10B981' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>1. Take Delhi Metro Yellow Line at 08:20 AM</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Fastest, 100% on-time mode with zero highway traffic delay</div>
            </div>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', gap: '0.75rem', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#10B981' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>2. Review System Design & React STAR Scenarios</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Prepares technical responses for 10:00 AM interview</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
