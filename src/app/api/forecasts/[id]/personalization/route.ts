import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getForecastFromDB } from '@/services/db/forecast.service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';
  const { id } = await params;

  const forecast = await getForecastFromDB(id, userId);
  if (!forecast) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: `Forecast '${id}' not found.` } },
      { status: 404 }
    );
  }

  const personalization = await prisma.forecastPersonalization.findUnique({
    where: { forecastId: id },
  });

  return NextResponse.json({
    success: true,
    data: {
      forecastId: id,
      baselineScore: personalization?.baselineScore || forecast.overallScore,
      personalAdjustment: personalization?.personalAdjustment || 0,
      finalScore: personalization?.finalScore || forecast.overallScore,
      baselineModelVersion: personalization?.baselineModelVersion || 'baseline-v1',
      personalizationModelVersion: personalization?.personalizationModelVersion || 'personalized-v1',
      personalConfidence: personalization?.personalConfidence || forecast.confidence,
      factors: personalization?.personalFactorsJson ? JSON.parse(personalization.personalFactorsJson) : {},
    },
  });
}
