import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { getUserInterviewsFromDB, createInterviewInDB } from '@/services/db/interview.service';
import { generateInterviewAnalysis } from '@/services/interview/interview-engine';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const interviews = await getUserInterviewsFromDB(auth.user.id);
    return createApiResponseSuccess(interviews, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch interviews.', requestId, 500);
  }
}

export async function POST(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const body = await req.json();
    const { companyName, roleTitle, jobDescription } = body;

    if (!companyName || !roleTitle) {
      return createApiResponseError('VALIDATION_ERROR', 'companyName and roleTitle are required.', requestId, 400);
    }

    const analysis = generateInterviewAnalysis(companyName, roleTitle, jobDescription);
    const interview = await createInterviewInDB(auth.user.id, analysis);

    return createApiResponseSuccess(interview, requestId, 201);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to create interview simulation.', requestId, 500);
  }
}
