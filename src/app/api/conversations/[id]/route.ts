import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getConversationById,
  updateConversationTitle,
  deleteConversation,
} from '@/services/db/conversation.service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  const conversation = await getConversationById(id, userId);

  if (!conversation) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found or access denied.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: conversation,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Title is required.' } },
        { status: 400 }
      );
    }

    const updated = await updateConversationTitle(id, userId, body.title);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: error.message || 'Update failed.' } },
      { status: 404 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  try {
    await deleteConversation(id, userId);
    return NextResponse.json({ success: true, data: { deletedId: id } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: error.message || 'Delete failed.' } },
      { status: 404 }
    );
  }
}
