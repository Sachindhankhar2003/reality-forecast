import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteUserDataAndAccount } from '@/services/user/privacy-service';

export async function POST() {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'demo-dev-user';

    const result = await deleteUserDataAndAccount(userId);

    return NextResponse.json({
      success: true,
      message: 'User data and associated memory records purged successfully.',
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process account deletion.';
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message },
      },
      { status: 500 }
    );
  }
}
