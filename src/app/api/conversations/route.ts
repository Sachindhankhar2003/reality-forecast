import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserConversations, createConversation } from '@/services/db/conversation.service';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  let conversations = await getUserConversations(userId);

  // Auto-provision initial conversation if user has none
  if (conversations.length === 0) {
    const initialConv = await createConversation(userId, 'Gurgaon React Interview Prep', 'interview');
    conversations = [initialConv as any];
  }

  return NextResponse.json({
    success: true,
    data: conversations,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  try {
    const body = await req.json().catch(() => ({}));
    const conversation = await createConversation(userId, body.title, body.domain);

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Failed to create conversation.' } },
      { status: 500 }
    );
  }
}
