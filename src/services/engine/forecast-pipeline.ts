import { sanitizeInput } from './sanitizer';
import { classifyDomain } from './domain-classifier';
import { resolveTemporalExpressions } from './temporal-resolver';
import { evaluateMissingInformation } from './missing-info-engine';
import { collectEvidenceParallel } from './evidence-collector';
import { calculateForecastScores } from './scoring-engine';
import { generateRiskMatrix } from './risk-engine';
import { generateAdviceList } from './advice-engine';
import { generateAIExplanation } from './ai-explainer';
import { ForecastSnapshot, ExtractedIntent, NormalizedFactor } from './types';
import { getDomainPlugin } from '@/domains/registry';

export async function runForecastPipeline(
  userInput: string,
  userId: string = 'demo-dev-user'
): Promise<ForecastSnapshot> {
  const startTime = Date.now();

  // 1. Input Normalization & Sanitization (Prompt injection defense)
  const cleanedInput = sanitizeInput(userInput);

  // 2. Domain Classification
  const classification = classifyDomain(cleanedInput);
  const domainPlugin = getDomainPlugin(classification.domain);

  // 3. Extracted Intent
  const intent: ExtractedIntent = {
    primaryActivity: cleanedInput,
    domain: classification.domain,
    confidence: classification.confidence,
    unknowns: [],
  };

  // Extract basic entities
  const lowerInput = cleanedInput.toLowerCase();
  
  // Locations
  if (lowerInput.includes('gurgaon')) intent.destinationRaw = 'Gurgaon, India';
  else if (lowerInput.includes('delhi')) intent.destinationRaw = 'Delhi, India';
  else if (lowerInput.includes('bengaluru') || lowerInput.includes('bangalore')) intent.destinationRaw = 'Bengaluru, India';
  else if (lowerInput.includes('mumbai')) intent.destinationRaw = 'Mumbai, India';

  if (lowerInput.includes('noida')) intent.originRaw = 'Noida, India';
  else if (lowerInput.includes('from delhi')) intent.originRaw = 'Delhi, India';

  // Transport
  if (lowerInput.includes('drive') || lowerInput.includes('car')) intent.transportRaw = 'car';
  else if (lowerInput.includes('metro')) intent.transportRaw = 'metro';
  else if (lowerInput.includes('train')) intent.transportRaw = 'train';
  else if (lowerInput.includes('flight')) intent.transportRaw = 'flight';

  // Role / Event / Time
  if (lowerInput.includes('react')) intent.roleRaw = 'React Developer';
  else if (lowerInput.includes('software')) intent.roleRaw = 'Software Developer';

  const timeMatch = cleanedInput.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  if (timeMatch) intent.timeRaw = timeMatch[1];

  const companyMatch = cleanedInput.match(/(?:at|with)\s+([A-Z][a-zA-Z0-9]+)/);
  if (companyMatch && !['Delhi', 'Noida', 'Gurgaon', 'Mumbai', 'Bengaluru'].includes(companyMatch[1])) {
    intent.companyRaw = companyMatch[1];
  }

  // 4. Temporal Understanding
  const temporal = resolveTemporalExpressions(cleanedInput);

  // 5. Missing Information Engine
  const missingInfo = evaluateMissingInformation(intent);

  // 6. Parallel Evidence Collection (Open-Meteo, TomTom, Memory)
  const location = intent.destinationRaw || 'Delhi NCR, India';
  const { evidenceList, hasPartialFailures } = await collectEvidenceParallel(location, userId);

  // 7. Feature Engineering & Domain Factor Extraction
  const factors: NormalizedFactor[] = domainPlugin.factors.map((def, idx) => {
    let rawVal = 0.75;
    let impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = 'POSITIVE';

    if (def.name.toLowerCase().includes('traffic')) {
      rawVal = 0.55;
      impact = 'NEGATIVE';
    }

    return {
      id: `f-${idx + 1}`,
      name: def.name,
      category: def.category,
      direction: impact,
      strength: rawVal >= 0.8 ? 'STRONG' : rawVal >= 0.5 ? 'MODERATE' : 'WEAK',
      numericalValue: rawVal,
      weight: def.defaultWeight,
      explanation: def.description,
      evidenceId: evidenceList[0]?.id,
    };
  });

  // 8. Forecast Calculation & Mutually Exclusive Scenario Distribution
  const scoring = calculateForecastScores(factors, evidenceList, missingInfo.length);

  // 9. Risk Matrix Analysis
  const risks = generateRiskMatrix(classification.domain, factors, location);

  // 10. Advice Engine Prioritization
  const advice = generateAdviceList(risks, classification.domain);

  // 11. AI Explanation Layer
  const aiExplanation = await generateAIExplanation({
    domain: classification.domain,
    originalInput: cleanedInput,
    factors,
    scenarios: scoring.scenarios,
    risks,
    advice,
    overallScore: scoring.overallScore,
    confidence: scoring.confidence,
  });

  // 12. Snapshot & Versioning
  const snapshot: ForecastSnapshot = {
    modelVersion: 'baseline-v1',
    version: 1,
    createdAt: new Date().toISOString(),
    originalInput: cleanedInput,
    intent,
    temporal,
    missingInfo,
    evidence: evidenceList,
    factors,
    scenarios: scoring.scenarios,
    risks,
    advice,
    overallScore: scoring.overallScore,
    confidence: hasPartialFailures ? parseFloat((scoring.confidence * 0.90).toFixed(2)) : scoring.confidence,
    uncertaintyExplanation: aiExplanation.summary,
  };

  console.log(`⚡ Forecast Pipeline finished in ${Date.now() - startTime}ms [Model: baseline-v1]`);
  return snapshot;
}
