import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const [
      totalUsers,
      activeUsers,
      totalForecasts,
      totalInterviews,
      totalConversations,
      totalAIRequests,
      systemErrors,
      completedOutcomes,
      evalAggregate,
      domainGroup,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.forecast.count(),
      prisma.interview.count(),
      prisma.conversation.count(),
      prisma.aPIUsage.count(),
      prisma.aPIUsage.count({ where: { success: false } }),
      prisma.outcome.count(),
      prisma.forecastEvaluation.aggregate({
        _avg: { accuracyScore: true },
      }),
      prisma.forecast.groupBy({
        by: ['domain'],
        _count: { id: true },
      }),
    ]);

    const domainDistribution = domainGroup.map((g) => ({
      domain: g.domain,
      count: g._count.id,
    }));

    const avgBrierScore = evalAggregate._avg.accuracyScore
      ? Number(evalAggregate._avg.accuracyScore.toFixed(2))
      : null;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalForecasts,
        totalInterviews,
        totalConversations,
        totalAIRequests,
        systemErrors,
        completedOutcomes,
        brierAccuracyScore: avgBrierScore,
        domainDistribution,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Failed to fetch admin stats.' } },
      { status: 500 }
    );
  }
}
