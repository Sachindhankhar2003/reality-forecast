import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/db';

describe('Phase 12 — User Feedback & Onboarding Integration Suite', () => {

  it('should create and retrieve user feedback tickets correctly', async () => {
    const user = await prisma.user.create({
      data: {
        email: `feedback.user.${Date.now()}@example.com`,
        role: 'USER',
      },
    });

    const ticket = await prisma.userFeedback.create({
      data: {
        userId: user.id,
        category: 'INCORRECT_FORECAST',
        message: 'Travel prediction did not include 15m parking buffer in Gurgaon.',
        status: 'OPEN',
      },
    });

    expect(ticket).toBeDefined();
    expect(ticket.status).toBe('OPEN');
    expect(ticket.category).toBe('INCORRECT_FORECAST');

    // Admin updates response
    const updated = await prisma.userFeedback.update({
      where: { id: ticket.id },
      data: {
        status: 'RESOLVED',
        adminResponse: 'Thank you! We are integrating parking duration into travel forecasts.',
        resolvedAt: new Date(),
      },
    });

    expect(updated.status).toBe('RESOLVED');
    expect(updated.adminResponse).toContain('parking duration');
    expect(updated.resolvedAt).toBeDefined();
  });
});
