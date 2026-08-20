import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const [totalForecasts, domainGroup, statusGroup, avgScores] = await Promise.all([
      prisma.forecast.count(),
      prisma.forecast.groupBy({
        by: ['domain'],
        _count: { id: true },
      }),
      prisma.forecast.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.forecast.aggregate({
        _avg: {
          overallScore: true,
          confidence: true,
        },
      }),
    ]);

    const domainBreakdown = domainGroup.map((d) => ({ domain: d.domain, count: d._count.id }));
    const statusBreakdown = statusGroup.map((s) => ({ status: s.status, count: s._count.id }));

    return NextResponse.json({
      success: true,
      data: {
        totalForecasts,
        domainBreakdown,
        statusBreakdown,
        averageFeasibility: avgScores._avg.overallScore || 0,
        averageConfidence: avgScores._avg.confidence || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Forecast analytics failed.' } },
      { status: 500 }
    );
  }
}
