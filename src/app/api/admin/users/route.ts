import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const url = new URL(req.url);
  const search = url.searchParams.get('search') || '';
  const roleFilter = url.searchParams.get('role');
  const statusFilter = url.searchParams.get('status');

  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (roleFilter && (roleFilter === 'USER' || roleFilter === 'ADMIN')) {
      where.role = roleFilter;
    }
    if (statusFilter && (statusFilter === 'ACTIVE' || statusFilter === 'DISABLED')) {
      where.status = statusFilter;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            forecasts: true,
            interviews: true,
            conversations: true,
            memories: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Failed to fetch users.' } },
      { status: 500 }
    );
  }
}
