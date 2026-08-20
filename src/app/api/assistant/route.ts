import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sanitizeInput } from '@/services/engine/sanitizer';
import { generateAgentResponse, getCurrentEvidence } from '@/services/ai/assistant-tools';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'demo-dev-user';

    const body = await req.json();
    const rawPrompt = body.prompt || body.message || '';
    if (!rawPrompt.trim()) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Prompt message is required.' } },
        { status: 400 }
      );
    }

    // Strict prompt injection defense & input sanitization
    const sanitizedPrompt = sanitizeInput(rawPrompt);

    // Dynamic Conversational Agent Response Generation
    const agentResult = await generateAgentResponse(sanitizedPrompt, userId);
    const evidence = await getCurrentEvidence();

    return NextResponse.json({
      success: true,
      data: {
        sanitizedPrompt,
        answer: agentResult.answer,
        toolUsed: agentResult.toolUsed,
        contextUsed: agentResult.contextUsed,
        evidenceDistinction: {
          facts: evidence.facts,
          estimates: evidence.estimates,
          inferences: evidence.inferences,
          unknowns: evidence.unknowns,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Assistant request failed.' } },
      { status: 500 }
    );
  }
}
