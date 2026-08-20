import { Memory } from '@prisma/client';
import { prisma } from '@/lib/db';

export interface ProcessedMemory {
  id: string;
  category: string;
  key: string;
  value: string;
  confidence: number;
  freshnessStatus: 'CURRENT' | 'AGING' | 'STALE';
  relevanceScore: number;
}

export async function getRelevantMemories(
  userId: string,
  domain: string,
  activityText: string
): Promise<ProcessedMemory[]> {
  const memories = await prisma.memory.findMany({
    where: { userId, enabled: true },
    orderBy: { updatedAt: 'desc' },
  });

  const now = Date.now();
  const lowerActivity = activityText.toLowerCase();

  return memories
    .map((mem) => {
      // 1. Memory Decay Calculation
      const ageDays = (now - new Date(mem.updatedAt).getTime()) / (1000 * 3600 * 24);
      let freshnessStatus: 'CURRENT' | 'AGING' | 'STALE' = 'CURRENT';
      let decayFactor = 1.0;

      if (ageDays > 180) {
        freshnessStatus = 'STALE';
        decayFactor = 0.6;
      } else if (ageDays > 60) {
        freshnessStatus = 'AGING';
        decayFactor = 0.85;
      }

      // 2. Semantic & Domain Relevance Match
      let relevanceScore = 0.3; // Default baseline relevance
      if (mem.category.toLowerCase() === domain.toLowerCase()) {
        relevanceScore += 0.4;
      }

      if (
        lowerActivity.includes(mem.key.toLowerCase()) ||
        lowerActivity.includes(mem.value.toLowerCase().slice(0, 8))
      ) {
        relevanceScore += 0.3;
      }

      const finalConfidence = parseFloat((mem.confidence * decayFactor).toFixed(2));

      return {
        id: mem.id,
        category: mem.category,
        key: mem.key,
        value: mem.value,
        confidence: finalConfidence,
        freshnessStatus,
        relevanceScore: parseFloat(Math.min(relevanceScore, 1.0).toFixed(2)),
      };
    })
    .filter((mem) => mem.relevanceScore >= 0.5 && mem.confidence >= 0.4) // Exclude irrelevant / stale memories
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
