import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { findUserById, updateUserProfile } from '@/services/db/user.service';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const user = await findUserById(auth.user.id);
    return createApiResponseSuccess(user, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to fetch profile.', requestId, 500);
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
    const { name, bio, location, timezone, skills, jobPreferences, transportPreferences } = body;

    const updatedProfile = await updateUserProfile(auth.user.id, {
      name,
      bio,
      location,
      timezone,
      skills,
      jobPreferences,
      transportPreferences,
    });

    return createApiResponseSuccess(updatedProfile, requestId);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Failed to update profile.', requestId, 500);
  }
}
