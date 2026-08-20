import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { updateUserProfile } from '@/services/db/user.service';
import { createMemoryInDB } from '@/services/db/memory.service';

export async function POST(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const body = await req.json();
    const { profession, targetGoal, primaryTransport, timezone, skills } = body;

    // Update Profile with Onboarding Preferences
    const profile = await updateUserProfile(auth.user.id, {
      bio: profession || 'Software Professional',
      jobPreferences: targetGoal || 'Career Advancement',
      transportPreferences: primaryTransport || 'Delhi Metro / Car',
      timezone: timezone || 'Asia/Kolkata',
      skills: Array.isArray(skills) ? skills.join(', ') : skills || 'TypeScript, React',
    });

    // Create Controlled Memories from Onboarding Context
    if (primaryTransport) {
      await createMemoryInDB(auth.user.id, 'Transport', 'preferred_transport', `Usually travels by ${primaryTransport}`);
    }
    if (targetGoal) {
      await createMemoryInDB(auth.user.id, 'Goal', 'current_target_goal', `Working toward: ${targetGoal}`);
    }

    return createApiResponseSuccess({ profile, onboardingCompleted: true }, requestId, 201);
  } catch (error: any) {
    return createApiResponseError('DATABASE_ERROR', error.message || 'Onboarding completion failed.', requestId, 500);
  }
}
