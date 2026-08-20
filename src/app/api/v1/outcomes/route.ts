import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { recordOutcomeInDB } from '@/services/db/outcome.service';

export async function POST(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const body = await req.json();
    const { forecastId, result, customResult, notes } = body;

    if (!forecastId || !result) {
      return createApiResponseError('VALIDATION_ERROR', 'forecastId and result are required.', requestId, 400);
    }

    const outcome = await recordOutcomeInDB(forecastId, auth.user.id, {
      id: `outc-${Date.now()}`,
      result,
      customResult,
      notes,
      recordedAt: new Date().toISOString(),
    });

    return createApiResponseSuccess(outcome, requestId, 201);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Outcome logging failed.', requestId, 500);
  }
}
