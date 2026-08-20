import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { getForecastFromDB } from '@/services/db/forecast.service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  const { id } = await params;

  try {
    const forecast = await getForecastFromDB(id, auth.user.id);
    if (!forecast) {
      return createApiResponseError('NOT_FOUND', 'Forecast not found or unauthorized.', requestId, 404);
    }

    return createApiResponseSuccess(forecast, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch forecast detail.', requestId, 500);
  }
}
