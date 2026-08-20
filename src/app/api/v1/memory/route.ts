import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { getUserMemoriesInDB, createMemoryInDB } from '@/services/db/memory.service';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const memories = await getUserMemoriesInDB(auth.user.id);
    return createApiResponseSuccess(memories, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch memory items.', requestId, 500);
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
    const { category, key, value } = body;

    if (!category || !key || !value) {
      return createApiResponseError('VALIDATION_ERROR', 'category, key, and value are required.', requestId, 400);
    }

    const newMemory = await createMemoryInDB(auth.user.id, category, key, value);

    return createApiResponseSuccess(newMemory, requestId, 201);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to save memory item.', requestId, 500);
  }
}
