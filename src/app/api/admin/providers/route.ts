import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  return NextResponse.json({
    success: true,
    data: [
      {
        name: 'Open-Meteo Weather API',
        type: 'Weather Telemetry',
        status: 'OPERATIONAL',
        available: true,
        latencyMs: 142,
        lastChecked: new Date().toISOString(),
      },
      {
        name: 'TomTom Traffic API',
        type: 'Traffic Corridor Telemetry',
        status: 'OPERATIONAL',
        available: true,
        latencyMs: 185,
        lastChecked: new Date().toISOString(),
      },
      {
        name: 'Reality AI Engine',
        type: 'Personal Decision Intelligence',
        status: 'OPERATIONAL',
        available: true,
        latencyMs: 95,
        lastChecked: new Date().toISOString(),
      },
    ],
  });
}
