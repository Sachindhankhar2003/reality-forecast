import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const [auditCount, rateLimitEvents, blockedRequests] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { action: { contains: 'RATE_LIMIT' } } }),
      prisma.auditLog.count({ where: { action: { contains: 'BLOCKED' } } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAuditEvents: auditCount,
        rateLimitEvents,
        blockedRequests,
        ssrfProtection: 'ACTIVE (Strict Loopback & Internal IP Blocklist)',
        promptInjectionFilter: 'ACTIVE (Sanitizer & Context Isolation)',
        serverSideRBAC: 'ENFORCED',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Security status failed.' } },
      { status: 500 }
    );
  }
}
