import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: auth.user.id, read: false },
    });

    return createApiResponseSuccess({ notifications, unreadCount }, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch notifications.', requestId, 500);
  }
}

export async function PUT(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const body = await req.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: auth.user.id, read: false },
        data: { read: true },
      });
      return createApiResponseSuccess({ success: true, message: 'All notifications marked as read' }, requestId);
    }

    if (!notificationId) {
      return createApiResponseError('VALIDATION_ERROR', 'notificationId or markAllRead is required.', requestId, 400);
    }

    const updated = await prisma.notification.updateMany({
      where: { id: notificationId, userId: auth.user.id },
      data: { read: true },
    });

    return createApiResponseSuccess(updated, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to update notification.', requestId, 500);
  }
}
