import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { getUserConversations, createConversation } from '@/services/db/conversation.service';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const conversations = await getUserConversations(auth.user.id);
    return createApiResponseSuccess(conversations, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch conversations.', requestId, 500);
  }
}

export async function POST(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { title, domain } = body;

    const newConversation = await createConversation(auth.user.id, title, domain);
    return createApiResponseSuccess(newConversation, requestId, 201);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to create conversation.', requestId, 500);
  }
}
