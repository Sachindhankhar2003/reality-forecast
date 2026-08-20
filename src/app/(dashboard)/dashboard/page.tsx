import Link from 'next/link';
import { prisma } from '@/lib/db';
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
  Sparkles,
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  const userName = user?.name || 'Sachin';

  // Fetch real forecasts from DB for this user
  let latestForecast = null;
  if (user?.id) {
    latestForecast = await prisma.forecast.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }).catch(() => null);
  }

  const hasRealForecast = !!latestForecast;

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
              Type what you need to do and your location. Reality AI will predict departure time, best transit mode, and shortest safe paths.
            </p>
          </div>
        </div>

        {/* Quick Predict Input Component (GPS Location + Voice Input + Templates) */}
        <QuickPredictInput />
      </div>

      {/* 2. Show DirectPredictionCard only if user has real forecasts */}
      {hasRealForecast ? (
        <DirectPredictionCard forecastId={latestForecast!.id} />
      ) : (
        /* Empty state CTA — shown before first prediction */
        <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '2px dashed var(--border-color)', background: 'var(--bg-elevated)' }}>
          <Sparkles size={36} color="var(--accent-light)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No predictions yet
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Type your event + location above and click <strong>Predict Plan</strong> to get your first AI-powered forecast with live weather, traffic and route analysis.
          </p>
          <Link href="/forecasts/new" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            <Sparkles size={16} />
            <span>Create First Prediction</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* 3–6: Live cards — only show when user has made a prediction */}
      {hasRealForecast && (
        <>
          {/* LIVE WEATHER & ATMOSPHERIC TELEMETRY BOX */}
          <LiveConditionsCard />

          {/* TRANSPORT MODE COMPARISON CARD */}
          <TransportComparisonCard />

          {/* SHORTEST & SAFEST ROUTE PATH CARD */}
          <ShortestPathCard />

          {/* TRAFFIC TIMELINE GRAPH */}
          <TrafficChart />
        </>
      )}

    </div>
  );
}

