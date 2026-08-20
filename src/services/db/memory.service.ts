import { prisma } from '@/lib/db';
import { logAuditEvent } from './audit.service';

export async function getUserMemoriesInDB(userId: string) {
  return prisma.memory.findMany({
    where: { userId, enabled: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMemoryInDB(userId: string, category: string, key: string, value: string) {
  const memory = await prisma.memory.create({
    data: {
      userId,
      category,
      key,
      value,
      source: 'user_stated',
      enabled: true,
      confidence: 1.0,
    },
  });

  await logAuditEvent('MEMORY_CREATED', 'Memory', memory.id, userId, { key, category });
  return memory;
}

export async function toggleMemoryEnabledInDB(id: string, userId: string, enabled: boolean) {
  return prisma.memory.updateMany({
    where: { id, userId }, // Authorization check
    data: { enabled },
  });
}

export async function deleteMemoryInDB(id: string, userId: string) {
  const res = await prisma.memory.deleteMany({
    where: { id, userId }, // Authorization check
  });
  await logAuditEvent('MEMORY_DELETED', 'Memory', id, userId);
  return res;
}
