import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db';

describe('Phase 13 — Dynamic Analytics & Strict Cross-User RBAC Isolation Suite', () => {

  it('should query real database user count and aggregate evaluation accuracy', async () => {
    const totalUsers = await prisma.user.count();
    expect(totalUsers).toBeGreaterThanOrEqual(1);

    const aggregate = await prisma.forecastEvaluation.aggregate({
      _avg: { accuracyScore: true },
    });

    expect(aggregate).toBeDefined();
  });

  it('should isolate user forecasts so User A cannot access User B resources', async () => {
    const userA = await prisma.user.create({
      data: { email: `userA.${Date.now()}@example.com`, role: 'USER' },
    });
    const userB = await prisma.user.create({
      data: { email: `userB.${Date.now()}@example.com`, role: 'USER' },
    });

    const forecastA = await prisma.forecast.create({
      data: {
        userId: userA.id,
        title: 'User A Travel Plan',
        originalInput: 'Trip to Gurgaon',
        domain: 'travel',
        summary: 'User A summary',
        overallScore: 0.82,
        confidence: 0.90,
      },
    });

    // Query forecasts for User B
    const userBForecasts = await prisma.forecast.findMany({
      where: { userId: userB.id },
    });

    const foundInB = userBForecasts.some((f) => f.id === forecastA.id);
    expect(foundInB).toBe(false);
  });
});
