import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/db';
import { createUser } from '@/services/db/user.service';
import { createForecastInDB, getForecastFromDB } from '@/services/db/forecast.service';
import { checkRateLimit } from '@/lib/rate-limit';

describe('Part 3: Backend Security, Database & Auth Suite', () => {
  let userA: any;
  let userB: any;

  beforeAll(async () => {
    // Setup test users
    userA = await createUser(`usera_${Date.now()}@test.com`, 'Password123!', 'User A');
    userB = await createUser(`userb_${Date.now()}@test.com`, 'Password123!', 'User B');
  });

  describe('User Ownership & Cross-User Authorization (Item 23)', () => {
    it('prevents User B from accessing User A forecast data', async () => {
      const forecastA = await createForecastInDB(
        {
          id: `fc-test-a-${Date.now()}`,
          userId: userA.id,
          title: 'User A Private Trip',
          originalInput: 'Private travel plan',
          domain: 'travel',
          status: 'ready',
          location: 'Delhi',
          summary: 'Private forecast',
          overallScore: 0.8,
          confidence: 0.9,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          context: [],
          sources: [],
          factors: [],
          scenarios: [],
          risks: [],
          advice: [],
        },
        userA.id
      );

      // User A can access their own forecast
      const fetchedByA = await getForecastFromDB(forecastA.id, userA.id);
      expect(fetchedByA).not.toBeNull();
      expect(fetchedByA?.title).toBe('User A Private Trip');

      // User B MUST get null when requesting User A forecast ID (404 enforcement)
      const fetchedByB = await getForecastFromDB(forecastA.id, userB.id);
      expect(fetchedByB).toBeNull();
    });
  });

  describe('Rate Limiter Protection (Item 28)', () => {
    it('blocks requests exceeding configured threshold window', () => {
      const rateKey = `test_limit_${Date.now()}`;
      const limit = 3;

      const req1 = checkRateLimit(rateKey, limit, 60000);
      expect(req1.allowed).toBe(true);

      const req2 = checkRateLimit(rateKey, limit, 60000);
      expect(req2.allowed).toBe(true);

      const req3 = checkRateLimit(rateKey, limit, 60000);
      expect(req3.allowed).toBe(true);

      // 4th request MUST be blocked
      const req4 = checkRateLimit(rateKey, limit, 60000);
      expect(req4.allowed).toBe(false);
      expect(req4.remaining).toBe(0);
    });
  });

  describe('Database Cascade & Relation Integrity (Item 21)', () => {
    it('persists scenarios and risks in atomic transaction', async () => {
      const fcId = `fc-cascade-${Date.now()}`;
      await createForecastInDB(
        {
          id: fcId,
          userId: userA.id,
          title: 'Cascade Test Event',
          originalInput: 'Testing DB cascade',
          domain: 'interview',
          status: 'ready',
          location: 'Delhi',
          summary: 'Cascade summary',
          overallScore: 0.75,
          confidence: 0.85,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          context: [{ id: 'ctx1', key: 'Role', value: 'Dev', source: 'user_input', confidence: 1.0 }],
          sources: [],
          factors: [],
          scenarios: [
            {
              id: 'sc1',
              type: 'most_likely',
              title: 'Pass Interview',
              description: 'Success scenario',
              probability: 0.7,
              confidence: 0.8,
              impactScore: 0.8,
              controllability: 0.7,
              evidence: 'Strong technical match',
            },
          ],
          risks: [
            {
              id: 'r1',
              title: 'Traffic Delay',
              description: 'DND traffic',
              category: 'Travel',
              likelihood: 0.5,
              impact: 0.7,
              controllability: 0.6,
              timeSensitivity: 0.8,
              severity: 'medium',
              compositeScore: 4.2,
              mitigation: 'Leave early',
            },
          ],
          advice: [],
        },
        userA.id
      );

      const dbRecord = await getForecastFromDB(fcId, userA.id);
      expect(dbRecord?.scenarios.length).toBe(1);
      expect(dbRecord?.scenarios[0].title).toBe('Pass Interview');
      expect(dbRecord?.risks.length).toBe(1);
      expect(dbRecord?.risks[0].severity).toBe('medium');
    });
  });
});
