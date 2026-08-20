import { getRelevantMemories } from './memory-retriever';
import { analyzePersonalOutcomeHistory } from './outcome-analyzer';
import { calculatePersonalAdjustment } from './personal-adjustment-engine';
import { generatePersonalizedActions } from './personal-advice-engine';
import { prisma } from '@/lib/db';

export async function processPersonalIntelligence(
  userId: string,
  forecastId: string,
  domain: string,
  baselineScore: number,
  originalInput: string
) {
  // 1. Retrieve Relevant Memories
  const memories = await getRelevantMemories(userId, domain, originalInput);

  // 2. Analyze Personal Outcome Bias
  const biasAnalysis = await analyzePersonalOutcomeHistory(userId, domain);

  // 3. Compute Bounded Score Adjustment
  const isHeavyTraffic = originalInput.toLowerCase().includes('traffic') || originalInput.toLowerCase().includes('car');
  const adjustment = calculatePersonalAdjustment(baselineScore, biasAnalysis, isHeavyTraffic);

  // 4. Generate Personalized Actions
  const topActions = generatePersonalizedActions(biasAnalysis, memories, domain);

  // 5. Persist ForecastPersonalization record
  try {
    await prisma.forecastPersonalization.upsert({
      where: { forecastId },
      update: {
        baselineScore,
        personalAdjustment: adjustment.personalAdjustment,
        finalScore: adjustment.finalScore,
        personalConfidence: biasAnalysis.confidence,
        personalFactorsJson: JSON.stringify({
          biasType: biasAnalysis.biasType,
          patternStrength: biasAnalysis.patternStrength,
          sampleSize: biasAnalysis.sampleSize,
          explanation: adjustment.adjustmentExplanation,
          relevantMemories: memories,
        }),
      },
      create: {
        forecastId,
        baselineScore,
        personalAdjustment: adjustment.personalAdjustment,
        finalScore: adjustment.finalScore,
        personalConfidence: biasAnalysis.confidence,
        personalFactorsJson: JSON.stringify({
          biasType: biasAnalysis.biasType,
          patternStrength: biasAnalysis.patternStrength,
          sampleSize: biasAnalysis.sampleSize,
          explanation: adjustment.adjustmentExplanation,
          relevantMemories: memories,
        }),
      },
    });
  } catch (err) {
    console.warn('Personalization DB upsert warning:', err);
  }

  return {
    baselineScore,
    personalAdjustment: adjustment.personalAdjustment,
    finalScore: adjustment.finalScore,
    confidence: biasAnalysis.confidence,
    explanation: adjustment.adjustmentExplanation,
    memories,
    biasAnalysis,
    topActions,
  };
}
