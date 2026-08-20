import { ForecastRecord } from '@/types/forecast';
import { runForecastPipeline } from '@/services/engine/forecast-pipeline';

export async function generateFullForecast(
  input: string,
  userId: string = 'demo-dev-user'
): Promise<ForecastRecord> {
  const snapshot = await runForecastPipeline(input, userId);

  return {
    id: `fc-${Date.now()}`,
    userId,
    title: `${snapshot.intent.domain.toUpperCase()} Forecast — ${snapshot.intent.destinationRaw || 'Delhi NCR'}`,
    originalInput: snapshot.originalInput,
    domain: snapshot.intent.domain,
    status: 'ready',
    eventAt: snapshot.temporal.isoTimestamp,
    location: snapshot.intent.destinationRaw || 'Delhi NCR, India',
    summary: snapshot.uncertaintyExplanation,
    overallScore: snapshot.overallScore,
    confidence: snapshot.confidence,
    createdAt: snapshot.createdAt,
    updatedAt: snapshot.createdAt,
    context: [
      { id: 'c1', key: 'domain', value: snapshot.intent.domain, source: 'inferred', confidence: snapshot.intent.confidence },
      { id: 'c2', key: 'target_date', value: snapshot.temporal.targetDate || 'Tomorrow', source: 'extracted', confidence: 0.95 },
      { id: 'c3', key: 'target_time', value: snapshot.temporal.targetTime || '10:00', source: 'extracted', confidence: 0.90 },
      { id: 'c4', key: 'location', value: snapshot.intent.destinationRaw || 'Delhi', source: 'extracted', confidence: 0.90 },
    ],
    sources: snapshot.evidence.map((ev) => ({
      id: ev.id,
      provider: ev.providerName,
      dataType: ev.source.toLowerCase() as any,
      retrievedAt: ev.retrievedAt,
      confidence: ev.reliability,
      data: ev.data,
    })),
    factors: snapshot.factors.map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category,
      value: f.explanation,
      normalizedValue: f.numericalValue,
      weight: f.weight,
      impact: f.direction.toLowerCase() as any,
      evidence: `Retrieved evidence reliability: ${Math.round(f.numericalValue * 100)}%`,
    })),
    scenarios: snapshot.scenarios.map((sc) => ({
      id: sc.id,
      type: sc.type.toLowerCase() as any,
      title: sc.title,
      description: sc.description,
      probability: sc.probability,
      confidence: sc.confidence,
      impactScore: sc.impactScore,
      controllability: sc.controllability,
      evidence: sc.evidenceSummary,
      recommendedActions: sc.recommendedActions,
    })),
    risks: snapshot.risks.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      likelihood: r.likelihood,
      impact: r.impact,
      controllability: r.controllability,
      timeSensitivity: r.timeSensitivity,
      severity: r.severity.toLowerCase() as any,
      compositeScore: r.compositeScore,
      mitigation: r.mitigation,
    })),
    advice: snapshot.advice.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      expectedBenefit: a.expectedBenefit,
      effort: a.effort.toLowerCase() as any,
      urgency: a.urgency.toLowerCase() as any,
      controllability: a.controllability,
      relatedRiskId: a.relatedRiskId,
    })),
    whatIfRuns: [],
  };
}
