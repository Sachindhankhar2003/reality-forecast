import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { addMessageToConversation } from '@/services/db/conversation.service';
import { sanitizeInput } from '@/lib/security';
import { generateAgentResponse } from '@/services/ai/assistant-tools';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await params;
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  try {
    const body = await req.json();
    const rawPrompt = body.prompt || body.content || '';
    const prompt = sanitizeInput(rawPrompt);

    if (!prompt.trim()) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Message content is required.' } },
        { status: 400 }
      );
    }

    // 1. Add user message to DB
    const userMsg = await addMessageToConversation(conversationId, userId, 'USER', prompt);

    // 2. Generate Dynamic Conversational Agent Response
    const agentResult = await generateAgentResponse(prompt, userId);

    // 3. Add assistant message to DB
    const assistantMsg = await addMessageToConversation(
      conversationId,
      userId,
      'ASSISTANT',
      agentResult.answer,
      agentResult.contextUsed
    );

    return NextResponse.json({
      success: true,
      data: {
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        toolUsed: agentResult.toolUsed,
        contextUsed: agentResult.contextUsed,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Failed to process message.' } },
      { status: 500 }
    );
  }
}
