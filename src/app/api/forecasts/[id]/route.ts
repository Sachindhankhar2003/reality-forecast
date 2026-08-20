import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getForecastFromDB } from '@/services/db/forecast.service';
import { forecastStore } from '@/lib/forecast-store';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';
  const { id } = await params;

  // Try Database first with ownership check
  let forecast = await getForecastFromDB(id, userId);

  // Fallback to memory store if demo seed ID
  if (!forecast) {
    forecast = forecastStore.getForecast(id) || null;
  }

  // Cross-user ownership enforcement: return 404 if missing or unauthorized
  if (!forecast) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'NOT_FOUND', message: `Forecast record '${id}' not found.` },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: forecast,
  });
}
