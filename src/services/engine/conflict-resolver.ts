import { DataStatus, Freshness, SourceQuality } from '@/providers/types';

export interface ConflictEvidenceSource {
  sourceName: string;
  value: number;
  sourceQuality: SourceQuality;
  freshness: Freshness;
  confidence: number;
}

export interface ResolvedConflictResult {
  resolvedEstimate: number;
  confidence: number;
  hasConflict: boolean;
  explanation: string;
}

export function classifyEvidenceFreshness(retrievedAtIso: string): Freshness {
  const ageMs = Date.now() - new Date(retrievedAtIso).getTime();
  const ageHours = ageMs / (1000 * 3600);

  if (ageHours < 2) return 'FRESH';
  if (ageHours < 6) return 'RECENT';
  if (ageHours < 24) return 'STALE';
  return 'EXPIRED';
}

export function resolveEvidenceConflict(sources: ConflictEvidenceSource[]): ResolvedConflictResult {
  if (sources.length === 0) {
    return { resolvedEstimate: 0, confidence: 0.5, hasConflict: false, explanation: 'No evidence sources provided.' };
  }

  if (sources.length === 1) {
    return {
      resolvedEstimate: sources[0].value,
      confidence: sources[0].confidence,
      hasConflict: false,
      explanation: `Single authoritative source: ${sources[0].sourceName}`,
    };
  }

  // Calculate variance to detect conflict
  const values = sources.map((s) => s.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const varianceRatio = (maxVal - minVal) / (minVal || 1);

  const hasConflict = varianceRatio > 0.15; // >15% variance threshold

  // Quality multiplier mapping
  const qualityWeights: Record<SourceQuality, number> = {
    OFFICIAL: 1.5,
    PRIMARY: 1.3,
    REPUTABLE: 1.0,
    SECONDARY: 0.8,
    UNKNOWN: 0.5,
  };

  const freshnessWeights: Record<Freshness, number> = {
    FRESH: 1.2,
    RECENT: 1.0,
    STALE: 0.7,
    EXPIRED: 0.4,
  };

  let totalWeight = 0;
  let weightedSum = 0;

  for (const src of sources) {
    const weight = src.confidence * qualityWeights[src.sourceQuality] * freshnessWeights[src.freshness];
    weightedSum += src.value * weight;
    totalWeight += weight;
  }

  const resolvedEstimate = Math.round(weightedSum / totalWeight);

  let explanation = `Resolved weighted estimate combining ${sources.length} sources.`;
  if (hasConflict) {
    explanation = `Conflict detected (${sources.map((s) => `${s.sourceName}: ${s.value}`).join(', ')}). Resolved estimate set to ${resolvedEstimate} based on source quality and freshness.`;
  }

  return {
    resolvedEstimate,
    confidence: hasConflict ? 0.80 : 0.92,
    hasConflict,
    explanation,
  };
}
