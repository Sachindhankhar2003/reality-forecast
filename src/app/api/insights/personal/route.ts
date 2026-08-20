import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { analyzePersonalOutcomeHistory } from '@/services/personal-intelligence/outcome-analyzer';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  const travelBias = await analyzePersonalOutcomeHistory(userId, 'travel');
  const interviewBias = await analyzePersonalOutcomeHistory(userId, 'interview');

  const insights = [];

  if (travelBias.sampleSize >= 3) {
    insights.push({
      id: 'ins-travel-1',
      domain: 'travel',
      title: 'Commute Buffer Calibration',
      insightText: travelBias.explanation,
      sampleSize: travelBias.sampleSize,
      confidence: travelBias.confidence,
      patternStrength: travelBias.patternStrength,
    });
  } else {
    insights.push({
      id: 'ins-travel-insufficient',
      domain: 'travel',
      title: 'Travel Calibration',
      insightText: 'Not enough travel outcome history to identify a reliable personal pattern yet (minimum 3 observations required).',
      sampleSize: travelBias.sampleSize,
      confidence: 0.30,
      patternStrength: 'NO_PATTERN',
    });
  }

  if (interviewBias.sampleSize >= 3) {
    insights.push({
      id: 'ins-interview-1',
      domain: 'interview',
      title: 'Interview Preparation Pattern',
      insightText: interviewBias.explanation,
      sampleSize: interviewBias.sampleSize,
      confidence: interviewBias.confidence,
      patternStrength: interviewBias.patternStrength,
    });
  }

  return NextResponse.json({
    success: true,
    data: insights,
  });
}
