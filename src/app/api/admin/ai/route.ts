import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const [totalRequests, successfulRequests, failedRequests, totalConversations, totalMessages, usageGroup] = await Promise.all([
      prisma.aPIUsage.count(),
      prisma.aPIUsage.count({ where: { success: true } }),
      prisma.aPIUsage.count({ where: { success: false } }),
      prisma.conversation.count(),
      prisma.conversationMessage.count(),
      prisma.aPIUsage.groupBy({
        by: ['provider'],
        _count: { id: true },
        _avg: { latencyMs: true },
      }),
    ]);

    const providerStats = usageGroup.map((p) => ({
      provider: p.provider,
      count: p._count.id,
      avgLatencyMs: Math.round(p._avg.latencyMs || 0),
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalRequests,
        successfulRequests,
        failedRequests,
        totalConversations,
        totalMessages,
        providerStats,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'AI analytics failed.' } },
      { status: 500 }
    );
  }
}
