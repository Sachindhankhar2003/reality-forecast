import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { getUserForecastsFromDB, createForecastInDB } from '@/services/db/forecast.service';
import { generateFullForecast } from '@/services/forecast/forecast-engine';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required to access forecasts.', requestId, 401);
  }

  try {
    const forecasts = await getUserForecastsFromDB(auth.user.id);
    return createApiResponseSuccess(forecasts, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch forecasts.', requestId, 500);
  }
}

export async function POST(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required to create a forecast.', requestId, 401);
  }

  // Rate Limiting
  const rateCheck = checkRateLimit(`forecast_create_${auth.user.id}`, 10, 60000);
  if (!rateCheck.allowed) {
    return createApiResponseError('RATE_LIMITED', 'Rate limit exceeded for forecast creation.', requestId, 429);
  }

  try {
    const body = await req.json();
    const prompt = body.prompt || body.title || body.originalInput;

    if (!prompt) {
      return createApiResponseError('VALIDATION_ERROR', 'Prompt is required.', requestId, 400);
    }

    const generatedRecord = await generateFullForecast(prompt);
    await createForecastInDB(generatedRecord, auth.user.id);

    return createApiResponseSuccess(generatedRecord, requestId, 201);
  } catch (error: any) {
    return createApiResponseError('INTERNAL_ERROR', error.message || 'Forecast generation failed.', requestId, 500);
  }
}
