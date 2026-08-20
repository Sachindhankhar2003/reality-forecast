import { GoogleGenerativeAI } from '@google/generative-ai';

interface StructuredExplanationInput {
  domain: string;
  originalInput: string;
  factors: any[];
  scenarios: any[];
  risks: any[];
  advice: any[];
  overallScore: number;
  confidence: number;
}

export interface StructuredExplanationOutput {
  summary: string;
  keyFactorsExplanation: string;
  knownFacts: string[];
  inferredAssumptions: string[];
  uncertainties: string[];
}

export async function generateAIExplanation(
  input: StructuredExplanationInput
): Promise<StructuredExplanationOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Graceful fallback if Gemini API Key is not configured
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    return {
      summary: `Evidence-based forecast generated for ${input.domain.toUpperCase()} plan. Overall situational index is ${Math.round(input.overallScore * 100)}% with ${Math.round(input.confidence * 100)}% telemetry confidence.`,
      keyFactorsExplanation: `Primary factors driving this forecast include ${input.factors.map((f) => f.name).join(', ')}.`,
      knownFacts: [input.originalInput],
      inferredAssumptions: ['Standard commute corridor delay profiles apply', 'Technical role assessment matches standard industry benchmarks'],
      uncertainties: ['Unannounced traffic incidents', 'Specific recruiter interview question variations'],
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are the AI Explanation Layer for Reality Forecast, an evidence-based decision support system.
Explain the structured forecast data below concisely and objectively.

CRITICAL INSTRUCTIONS:
1. Do NOT invent probabilities, weather, traffic facts, or company claims.
2. Rely strictly on the structured factors, scenarios, and risks provided.
3. Explicitly categorize into Known Facts, Inferred Assumptions, and Unknowns.

STRUCTURED INPUT:
Domain: ${input.domain}
User Plan: ${input.originalInput}
Situational Index: ${Math.round(input.overallScore * 100)}%
Confidence: ${Math.round(input.confidence * 100)}%
Factors: ${JSON.stringify(input.factors)}
Scenarios: ${JSON.stringify(input.scenarios)}
Risks: ${JSON.stringify(input.risks)}

Return ONLY valid JSON matching this schema:
{
  "summary": "2-sentence high level summary",
  "keyFactorsExplanation": "Explanation of primary factors driving the forecast",
  "knownFacts": ["fact 1", "fact 2"],
  "inferredAssumptions": ["inference 1"],
  "uncertainties": ["uncertainty 1"]
}
`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as StructuredExplanationOutput;
    }
  } catch (error) {
    console.warn('AI Explainer call failed, using fallback explanation:', error);
  }

  return {
    summary: `Forecast generated for ${input.domain.toUpperCase()} plan based on retrieved telemetry and domain factors.`,
    keyFactorsExplanation: `Key drivers: ${input.factors.map((f) => f.name).join(', ')}.`,
    knownFacts: [input.originalInput],
    inferredAssumptions: ['Standard commute corridor traffic applies'],
    uncertainties: ['External incident variations'],
  };
}
