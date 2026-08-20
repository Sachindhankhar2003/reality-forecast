import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/services/db/audit.service';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id: targetUserId } = await params;

  try {
    const body = await req.json();
    const newStatus = body.status;

    if (newStatus !== 'ACTIVE' && newStatus !== 'DISABLED') {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid status. Must be ACTIVE or DISABLED.' } },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } },
        { status: 404 }
      );
    }

    // Last-Admin Protection Guard for Disabling Account
    if (targetUser.role === 'ADMIN' && newStatus === 'DISABLED') {
      const activeAdminCount = await prisma.user.count({
        where: { role: 'ADMIN', status: 'ACTIVE' },
      });

      if (activeAdminCount <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Cannot disable the final active system administrator account.',
            },
          },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: newStatus },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    // Audit Log
    await logAuditEvent(
      newStatus === 'DISABLED' ? 'USER_DISABLED' : 'USER_ENABLED',
      'User',
      targetUserId,
      auth.user.id,
      { oldStatus: targetUser.status, newStatus }
    );

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Status update failed.' } },
      { status: 500 }
    );
  }
}
