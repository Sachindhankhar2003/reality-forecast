import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserForecastsFromDB, createForecastInDB } from '@/services/db/forecast.service';
import { generateFullForecast } from '@/services/forecast/forecast-engine';
import { z } from 'zod';

const createForecastSchema = z.object({
  prompt: z.string().min(3, 'Plan description must be at least 3 characters.'),
});

export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const forecasts = await getUserForecastsFromDB(userId, limit, offset);
  return NextResponse.json({
    success: true,
    data: forecasts,
    pagination: { limit, offset, count: forecasts.length },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  // Rate Limiting Protection (Max 20 forecast creations per minute)
  const rateLimit = checkRateLimit(`forecast_create_${userId}`, 20, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many forecast requests. Try again in ${Math.ceil(rateLimit.resetInMs / 1000)} seconds.`,
        },
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { prompt } = createForecastSchema.parse(body);

    const generatedRecord = await generateFullForecast(prompt);
    await createForecastInDB(generatedRecord, userId);

    return NextResponse.json({
      success: true,
      data: generatedRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid forecast payload.', details: error.errors || error.message } },
      { status: 400 }
    );
  }
}
