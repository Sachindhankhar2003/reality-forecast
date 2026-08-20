import { prisma } from '@/lib/db';

export async function logAuditEvent(
  action: string,
  entityType: string,
  entityId?: string,
  userId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
) {
  try {
    return await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId: entityId || null,
        userId: userId || null,
        details: details ? JSON.stringify(details) : null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
}
