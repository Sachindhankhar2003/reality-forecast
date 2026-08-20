import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/services/db/audit.service';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const admin = await requireAdmin();
  if (admin.error) {
    return createApiResponseError('FORBIDDEN', 'Admin access required.', requestId, 403);
  }

  try {
    const requests = await prisma.userFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
    return createApiResponseSuccess(requests, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch support requests.', requestId, 500);
  }
}

export async function PUT(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const admin = await requireAdmin();
  if (admin.error) {
    return createApiResponseError('FORBIDDEN', 'Admin access required.', requestId, 403);
  }

  try {
    const body = await req.json();
    const { id, status, adminResponse, adminNote, priority } = body;

    if (!id) {
      return createApiResponseError('VALIDATION_ERROR', 'Request id is required.', requestId, 400);
    }

    const updated = await prisma.userFeedback.update({
      where: { id },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(adminResponse !== undefined && { adminResponse }),
        ...(adminNote !== undefined && { adminNote }),
        ...(priority && { priority: priority.toUpperCase() }),
        ...(status === 'RESOLVED' && { resolvedAt: new Date() }),
      },
    });

    await logAuditEvent('FEEDBACK_UPDATED_BY_ADMIN', 'UserFeedback', id, admin.user.id, { status, priority });

    return createApiResponseSuccess(updated, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to update support request.', requestId, 500);
  }
}
