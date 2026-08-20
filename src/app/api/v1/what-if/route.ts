import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { simulateWhatIfTool } from '@/services/ai/assistant-tools';
import { createWhatIfRunInDB } from '@/services/db/whatif.service';

export async function POST(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const body = await req.json();
    const { forecastId, userInput } = body;

    if (!userInput) {
      return createApiResponseError('VALIDATION_ERROR', 'userInput is required.', requestId, 400);
    }

    const targetForecastId = forecastId || 'fc-current';
    const simulation = await simulateWhatIfTool(targetForecastId, userInput);

    if ('error' in simulation && simulation.error) {
      return createApiResponseError('SIMULATION_FAILED', simulation.error, requestId, 400);
    }

    return createApiResponseSuccess(simulation, requestId);
  } catch (error: any) {
    return createApiResponseError('INTERNAL_ERROR', error.message || 'What-If simulation failed.', requestId, 500);
  }
}
