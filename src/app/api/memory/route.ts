import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserMemoriesInDB, createMemoryInDB, deleteMemoryInDB } from '@/services/db/memory.service';
import { z } from 'zod';

const createMemorySchema = z.object({
  category: z.string().min(1),
  key: z.string().min(1),
  value: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  const memories = await getUserMemoriesInDB(userId);
  return NextResponse.json({
    success: true,
    data: memories,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  try {
    const body = await req.json();
    const { category, key, value } = createMemorySchema.parse(body);
    const memory = await createMemoryInDB(userId, category, key, value);

    return NextResponse.json({
      success: true,
      data: memory,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid memory data.', details: error.errors || error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_PARAM', message: 'Memory id parameter required.' } },
      { status: 400 }
    );
  }

  await deleteMemoryInDB(id, userId);
  return NextResponse.json({ success: true, data: { deletedId: id } });
}
