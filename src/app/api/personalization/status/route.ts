import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { analyzePersonalOutcomeHistory } from '@/services/personal-intelligence/outcome-analyzer';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  const travelBias = await analyzePersonalOutcomeHistory(userId, 'travel');
  const interviewBias = await analyzePersonalOutcomeHistory(userId, 'interview');

  return NextResponse.json({
    success: true,
    data: {
      personalizationEnabled: true,
      memoryEnabled: true,
      outcomeLearningEnabled: true,
      sampleSizes: {
        travel: travelBias.sampleSize,
        interview: interviewBias.sampleSize,
      },
      patternStrengths: {
        travel: travelBias.patternStrength,
        interview: interviewBias.patternStrength,
      },
      confidence: parseFloat(((travelBias.confidence + interviewBias.confidence) / 2).toFixed(2)),
    },
  });
}
