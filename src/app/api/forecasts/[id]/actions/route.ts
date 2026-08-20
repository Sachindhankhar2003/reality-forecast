import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getForecastFromDB } from '@/services/db/forecast.service';
import { analyzePersonalOutcomeHistory } from '@/services/personal-intelligence/outcome-analyzer';
import { getRelevantMemories } from '@/services/personal-intelligence/memory-retriever';
import { generatePersonalizedActions } from '@/services/personal-intelligence/personal-advice-engine';

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

  const biasAnalysis = await analyzePersonalOutcomeHistory(userId, forecast.domain);
  const memories = await getRelevantMemories(userId, forecast.domain, forecast.originalInput);
  const actions = generatePersonalizedActions(biasAnalysis, memories, forecast.domain);

  return NextResponse.json({
    success: true,
    data: {
      forecastId: forecast.id,
      topActions: actions, // Enforces top 3 max limit
    },
  });
}
