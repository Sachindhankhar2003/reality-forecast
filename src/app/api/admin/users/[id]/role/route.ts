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
    const newRole = body.role;

    if (newRole !== 'USER' && newRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid role. Must be USER or ADMIN.' } },
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

    // Last-Admin Protection Guard
    if (targetUser.role === 'ADMIN' && newRole === 'USER') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN', status: 'ACTIVE' },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Cannot demote the final active system administrator.',
            },
          },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    // Record Audit Log
    await logAuditEvent(
      'USER_ROLE_CHANGED',
      'User',
      targetUserId,
      auth.user.id,
      { oldRole: targetUser.role, newRole }
    );

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Role update failed.' } },
      { status: 500 }
    );
  }
}
