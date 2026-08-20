import { prisma } from '@/lib/db';
import { ForecastRecord } from '@/types/forecast';

export async function createForecastInDB(forecastData: ForecastRecord, userId: string) {
  return prisma.$transaction(
    async (tx) => {
      // 1. Create central Forecast record
      const forecast = await tx.forecast.create({
        data: {
          id: forecastData.id,
          userId,
          title: forecastData.title,
          originalInput: forecastData.originalInput,
          domain: forecastData.domain,
          status: forecastData.status.toUpperCase(),
          eventAt: forecastData.eventAt ? new Date(forecastData.eventAt) : null,
          location: forecastData.location,
          summary: forecastData.summary,
          overallScore: forecastData.overallScore,
          confidence: forecastData.confidence,
        },
      });

      // 2. Create extracted Context items
      if (forecastData.context && forecastData.context.length > 0) {
        await tx.forecastContext.createMany({
          data: forecastData.context.map((c) => ({
            forecastId: forecast.id,
            key: c.key,
            value: c.value,
            source: c.source,
            confidence: c.confidence,
          })),
        });
      }

      // 3. Create Data Sources
      if (forecastData.sources && forecastData.sources.length > 0) {
        await tx.dataSource.createMany({
          data: forecastData.sources.map((s) => ({
            forecastId: forecast.id,
            provider: s.provider,
            dataType: s.dataType,
            confidence: s.confidence,
            dataJson: JSON.stringify(s.data),
          })),
        });
      }

      // 4. Create Forecast Factors
      if (forecastData.factors && forecastData.factors.length > 0) {
        await tx.forecastFactor.createMany({
          data: forecastData.factors.map((f) => ({
            forecastId: forecast.id,
            name: f.name,
            category: f.category,
            value: f.value,
            normalizedValue: f.normalizedValue,
            weight: f.weight,
            impact: f.impact.toUpperCase(),
            evidence: f.evidence,
          })),
        });
      }

      // 5. Create Scenarios
      if (forecastData.scenarios && forecastData.scenarios.length > 0) {
        await tx.scenario.createMany({
          data: forecastData.scenarios.map((sc) => ({
            forecastId: forecast.id,
            type: sc.type.toUpperCase(),
            title: sc.title,
            description: sc.description,
            probability: sc.probability,
            confidence: sc.confidence,
            impactScore: sc.impactScore,
            controllability: sc.controllability,
            evidence: sc.evidence,
            actionsJson: sc.recommendedActions ? JSON.stringify(sc.recommendedActions) : null,
          })),
        });
      }

      // 6. Create Risks
      if (forecastData.risks && forecastData.risks.length > 0) {
        await tx.risk.createMany({
          data: forecastData.risks.map((r) => ({
            forecastId: forecast.id,
            title: r.title,
            description: r.description,
            category: r.category,
            likelihood: r.likelihood,
            impact: r.impact,
            controllability: r.controllability,
            timeSensitivity: r.timeSensitivity,
            severity: r.severity.toUpperCase(),
            compositeScore: r.compositeScore,
            mitigation: r.mitigation,
          })),
        });
      }

      // 7. Create Recommendations (Advice)
      if (forecastData.advice && forecastData.advice.length > 0) {
        await tx.recommendation.createMany({
          data: forecastData.advice.map((a) => ({
            forecastId: forecast.id,
            title: a.title,
            description: a.description,
            expectedBenefit: a.expectedBenefit,
            effort: a.effort.toUpperCase(),
            urgency: a.urgency.toUpperCase(),
            controllability: a.controllability,
          })),
        });
      }

      // 8. Log Audit inside same tx context to prevent SQLite lock collisions
      await tx.auditLog.create({
        data: {
          action: 'FORECAST_CREATED',
          entityType: 'Forecast',
          entityId: forecast.id,
          userId,
          details: JSON.stringify({ title: forecast.title, domain: forecast.domain }),
        },
      });

      return forecast;
    },
    { maxWait: 10000, timeout: 25000 }
  );
}

export async function getForecastFromDB(id: string, userId?: string) {
  const forecast = await prisma.forecast.findFirst({
    where: {
      id,
      ...(userId ? { userId } : {}), // Authorization ownership filter
    },
    include: {
      contexts: true,
      sources: true,
      factors: true,
      scenarios: true,
      risks: true,
      recommendations: true,
      whatIfRuns: true,
      outcome: {
        include: { evaluation: true },
      },
    },
  });

  if (!forecast) return null;

  // Map to frontend interface
  return {
    id: forecast.id,
    userId: forecast.userId,
    title: forecast.title,
    originalInput: forecast.originalInput,
    domain: forecast.domain.toLowerCase() as any,
    status: forecast.status.toLowerCase() as any,
    eventAt: forecast.eventAt ? forecast.eventAt.toISOString() : undefined,
    location: forecast.location || 'Delhi NCR, India',
    summary: forecast.summary,
    overallScore: forecast.overallScore,
    confidence: forecast.confidence,
    createdAt: forecast.createdAt.toISOString(),
    updatedAt: forecast.updatedAt.toISOString(),
    context: forecast.contexts.map((c) => ({ id: c.id, key: c.key, value: c.value, source: c.source as any, confidence: c.confidence })),
    sources: forecast.sources.map((s) => ({ id: s.id, provider: s.provider, dataType: s.dataType, retrievedAt: s.retrievedAt.toISOString(), confidence: s.confidence, data: s.dataJson ? JSON.parse(s.dataJson) : {} })),
    factors: forecast.factors.map((f) => ({ id: f.id, name: f.name, category: f.category, value: f.value, normalizedValue: f.normalizedValue, weight: f.weight, impact: f.impact.toLowerCase() as any, evidence: f.evidence })),
    scenarios: forecast.scenarios.map((sc) => ({ id: sc.id, type: sc.type.toLowerCase() as any, title: sc.title, description: sc.description, probability: sc.probability, confidence: sc.confidence, impactScore: sc.impactScore, controllability: sc.controllability, evidence: sc.evidence, recommendedActions: sc.actionsJson ? JSON.parse(sc.actionsJson) : [] })),
    risks: forecast.risks.map((r) => ({ id: r.id, title: r.title, description: r.description, category: r.category, likelihood: r.likelihood, impact: r.impact, controllability: r.controllability, timeSensitivity: r.timeSensitivity, severity: r.severity.toLowerCase() as any, compositeScore: r.compositeScore, mitigation: r.mitigation })),
    advice: forecast.recommendations.map((a) => ({ id: a.id, title: a.title, description: a.description, expectedBenefit: a.expectedBenefit, effort: a.effort.toLowerCase() as any, urgency: a.urgency.toLowerCase() as any, controllability: a.controllability })),
    whatIfRuns: forecast.whatIfRuns.map((w) => ({ id: w.id, userInput: w.userInput, summary: w.summary, deltaScore: w.deltaScore, createdAt: w.createdAt.toISOString(), modifiedFactors: w.modifiedFactors ? JSON.parse(w.modifiedFactors) : [], scenarios: w.scenariosJson ? JSON.parse(w.scenariosJson) : [] })),
    outcome: forecast.outcome ? { id: forecast.outcome.id, result: forecast.outcome.result.toLowerCase() as any, notes: forecast.outcome.notes || undefined, recordedAt: forecast.outcome.recordedAt.toISOString(), accuracyScore: forecast.outcome.evaluation?.accuracyScore || 0.90 } : undefined,
  } as ForecastRecord;
}

export async function getUserForecastsFromDB(userId: string, limit = 50, offset = 0) {
  const records = await prisma.forecast.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      scenarios: true,
      risks: true,
    },
  });

  return records.map((f) => ({
    id: f.id,
    userId: f.userId,
    title: f.title,
    originalInput: f.originalInput,
    domain: f.domain.toLowerCase() as any,
    status: f.status.toLowerCase() as any,
    location: f.location || 'Delhi NCR, India',
    summary: f.summary,
    overallScore: f.overallScore,
    confidence: f.confidence,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    scenarios: f.scenarios.map((sc) => ({ id: sc.id, type: sc.type.toLowerCase() as any, title: sc.title, description: sc.description, probability: sc.probability, confidence: sc.confidence, impactScore: sc.impactScore, controllability: sc.controllability, evidence: sc.evidence })),
    risks: f.risks.map((r) => ({ id: r.id, title: r.title, description: r.description, category: r.category, likelihood: r.likelihood, impact: r.impact, controllability: r.controllability, timeSensitivity: r.timeSensitivity, severity: r.severity.toLowerCase() as any, compositeScore: r.compositeScore, mitigation: r.mitigation })),
    context: [],
    sources: [],
    factors: [],
    advice: [],
  }));
}
