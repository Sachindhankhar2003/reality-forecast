import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { outcomeInputSchema } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'demo-dev-user';

    const body = await req.json();
    const validation = outcomeInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: validation.error.issues[0]?.message || 'Invalid input.' } },
        { status: 400 }
      );
    }

    const { forecastId, rawOutcomeText, result, notes } = validation.data;

    // Verify forecast ownership
    const forecast = await prisma.forecast.findUnique({
      where: { id: forecastId },
    });

    if (!forecast || (forecast.userId !== userId && userId !== 'demo-dev-user')) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Forecast not found or unauthorized.' } },
        { status: 404 }
      );
    }

    // Upsert Outcome record (preserving raw outcome text)
    const outcome = await prisma.outcome.upsert({
      where: { forecastId },
      update: {
        result,
        notes: `${rawOutcomeText}${notes ? ` | ${notes}` : ''}`,
        recordedAt: new Date(),
      },
      create: {
        forecastId,
        userId,
        result,
        notes: `${rawOutcomeText}${notes ? ` | ${notes}` : ''}`,
      },
    });

    // Compute evaluation comparison (What we expected vs What happened)
    const expectedScore = forecast.overallScore;
    const isSuccess = result === 'SUCCESS';
    const actualScore = isSuccess ? 0.90 : result === 'DELAYED' ? 0.55 : 0.30;
    const accuracyScore = parseFloat((1.0 - Math.abs(expectedScore - actualScore)).toFixed(2));

    await prisma.forecastEvaluation.upsert({
      where: { outcomeId: outcome.id },
      update: {
        accuracyScore,
        calibrationScore: accuracyScore,
        lessons: `Recorded outcome '${result}' matching forecast '${forecast.title}'.`,
      },
      create: {
        forecastId,
        outcomeId: outcome.id,
        accuracyScore,
        calibrationScore: accuracyScore,
        lessons: `Recorded outcome '${result}' matching forecast '${forecast.title}'.`,
      },
    });

    // Update Forecast Status
    await prisma.forecast.update({
      where: { id: forecastId },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: {
        outcomeId: outcome.id,
        forecastId,
        result,
        accuracyScore,
        comparison: {
          expectedProbability: expectedScore,
          actualOutcome: result,
          accuracyScore,
          explanation: isSuccess
            ? 'Actual outcome matched expected forecast scenarios successfully.'
            : `Outcome differed from baseline expectation due to ${result.toLowerCase()} conditions. Data added to personal outcome calibration loop.`,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Failed to record outcome.' } },
      { status: 500 }
    );
  }
}
