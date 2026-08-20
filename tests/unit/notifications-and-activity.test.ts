import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db';

describe('Phase 12 — Notifications & Operational Telemetry Suite', () => {

  it('should create, list, and mark notifications as read correctly', async () => {
    const user = await prisma.user.create({
      data: {
        email: `notify.user.${Date.now()}@example.com`,
        role: 'USER',
      },
    });

    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Forecast Update Available',
        message: 'TomTom reported traffic delay on NH-48 (+18m).',
        type: 'RISK_ALERT',
        read: false,
      },
    });

    expect(notification).toBeDefined();
    expect(notification.read).toBe(false);

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, read: false },
    });
    expect(unreadCount).toBe(1);

    // Mark as read
    await prisma.notification.updateMany({
      where: { userId: user.id, id: notification.id },
      data: { read: true },
    });

    const updatedUnreadCount = await prisma.notification.count({
      where: { userId: user.id, read: false },
    });
    expect(updatedUnreadCount).toBe(0);
  });
});
