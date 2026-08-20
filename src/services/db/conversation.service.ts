import { prisma } from '@/lib/db';

export async function getUserConversations(userId: string) {
  return await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' },
        take: 1, // Only get first message for preview
      },
    },
  });
}

export async function getConversationById(id: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });

  return conversation;
}

export async function createConversation(userId: string, title?: string, domain?: string) {
  // Ensure user record exists in database
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: `${userId}@example.com`,
      name: 'Developer User',
    },
  });

  return await prisma.conversation.create({
    data: {
      userId,
      title: title || 'New Intelligence Conversation',
      domain: domain || 'general',
      messages: {
        create: [
          {
            role: 'ASSISTANT',
            content: 'Hello! I am Reality AI, your evidence-aware decision assistant. How can I support your planning today?',
          },
        ],
      },
    },
    include: {
      messages: true,
    },
  });
}

export async function addMessageToConversation(
  conversationId: string,
  userId: string,
  role: 'USER' | 'ASSISTANT' | 'SYSTEM',
  content: string,
  contextUsed?: string
) {
  // Ensure conversation belongs to user
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });

  if (!conversation) {
    throw new Error('Conversation not found or unauthorized.');
  }

  const message = await prisma.conversationMessage.create({
    data: {
      conversationId,
      role,
      content,
      contextUsed,
    },
  });

  // Touch conversation updatedAt timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function updateConversationTitle(conversationId: string, userId: string, title: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });

  if (!conversation) {
    throw new Error('Conversation not found or unauthorized.');
  }

  return await prisma.conversation.update({
    where: { id: conversationId },
    data: { title },
  });
}

export async function deleteConversation(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });

  if (!conversation) {
    throw new Error('Conversation not found or unauthorized.');
  }

  return await prisma.conversation.delete({
    where: { id: conversationId },
  });
}
