import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/services/db/audit.service';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const feedbackList = await prisma.userFeedback.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return createApiResponseSuccess(feedbackList, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch user feedback.', requestId, 500);
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
    const { category, message, forecastId } = body;

    if (!category || !message) {
      return createApiResponseError('VALIDATION_ERROR', 'category and message are required.', requestId, 400);
    }

    const newFeedback = await prisma.userFeedback.create({
      data: {
        userId: auth.user.id,
        category: category.toUpperCase(),
        message,
        forecastId: forecastId || null,
        status: 'OPEN',
        priority: 'MEDIUM',
      },
    });

    await logAuditEvent('FEEDBACK_SUBMITTED', 'UserFeedback', newFeedback.id, auth.user.id, { category });

    return createApiResponseSuccess(newFeedback, requestId, 201);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to submit feedback.', requestId, 500);
  }
}
