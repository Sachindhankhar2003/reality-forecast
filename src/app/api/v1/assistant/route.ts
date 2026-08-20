import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { sanitizeInput } from '@/services/engine/sanitizer';
import {
  getCurrentForecast,
  getTopActions,
  simulateWhatIfTool,
  getInterviewReadiness,
} from '@/services/ai/assistant-tools';
import { extractMemoryCandidates } from '@/services/ai/memory-extractor';

export async function POST(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);
  const auth = await requireAuth();
  if (auth.error) {
    return createApiResponseError('UNAUTHORIZED', 'Authentication is required.', requestId, 401);
  }

  try {
    const body = await req.json();
    const rawPrompt = body.prompt || body.message || '';

    if (!rawPrompt.trim()) {
      return createApiResponseError('VALIDATION_ERROR', 'Prompt message is required.', requestId, 400);
    }

    const sanitizedPrompt = sanitizeInput(rawPrompt);
    const promptLower = sanitizedPrompt.toLowerCase();
    const memoryCandidates = extractMemoryCandidates(sanitizedPrompt);

    const currentForecast = await getCurrentForecast();
    let answer = '';
    let toolUsed = 'getCurrentForecast';

    if (promptLower.includes('action') || promptLower.includes('do now') || promptLower.includes('recommend')) {
      toolUsed = 'getTopActions';
      const actions = await getTopActions();
      answer = `Top recommended actions for '${currentForecast.title || 'Current Plan'}':
1. ${actions[0]?.title || 'Depart 25m earlier'} (${Math.round((actions[0]?.expectedBenefit || 0.18) * 100)}% estimated benefit)
2. ${actions[1]?.title || 'Keep live GPS active'} (${Math.round((actions[1]?.expectedBenefit || 0.10) * 100)}% estimated benefit)`;
    } else if (promptLower.includes('what if') || promptLower.includes('if i leave') || promptLower.includes('metro')) {
      toolUsed = 'simulateWhatIf';
      const sim = await simulateWhatIfTool('current', sanitizedPrompt);
      if ('scoreDelta' in sim) {
        answer = `What-If Simulation: Score Delta ${sim.scoreDelta && sim.scoreDelta > 0 ? `+${Math.round(sim.scoreDelta * 100)}%` : `${Math.round((sim.scoreDelta || 0) * 100)}%`}. ${sim.summary}`;
      } else {
        answer = 'What-If Simulation complete.';
      }
    } else if (promptLower.includes('interview') || promptLower.includes('readiness')) {
      toolUsed = 'getInterviewReadiness';
      const readiness = await getInterviewReadiness(auth.user.id);
      answer = `Interview Readiness Alignment: Technical ${Math.round(readiness.technicalReadiness * 100)}%, Communication ${Math.round(readiness.communicationReadiness * 100)}%.`;
    } else {
      answer = `Reality AI (Operating via Server Tools): Active Plan '${currentForecast.title || 'General Plan'}' with Feasibility Score ${Math.round((currentForecast.overallScore || 0.68) * 100)}%.`;
    }

    return createApiResponseSuccess(
      {
        sanitizedPrompt,
        answer,
        toolUsed,
        memoryCandidates,
      },
      requestId
    );
  } catch (error: any) {
    return createApiResponseError('AI_ERROR', error.message || 'Reality AI Assistant request failed.', requestId, 500);
  }
}
