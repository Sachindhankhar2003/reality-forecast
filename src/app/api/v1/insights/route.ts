import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { analyzePersonalOutcomeHistory } from '@/services/personal-intelligence/outcome-analyzer';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const travelBias = await analyzePersonalOutcomeHistory(auth.user.id, 'travel');
    const interviewBias = await analyzePersonalOutcomeHistory(auth.user.id, 'interview');

    return createApiResponseSuccess(
      [
        { domain: 'travel', bias: travelBias },
        { domain: 'interview', bias: interviewBias },
      ],
      requestId
    );
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch personal insights.', requestId, 500);
  }
}
