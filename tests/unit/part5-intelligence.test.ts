import { describe, it, expect } from 'vitest';
import { providerRegistry } from '@/providers/registry';
import { providerCache } from '@/lib/cache';
import { geocodeLocation } from '@/services/location/geocoding';
import { calculateDepartureRecommendation } from '@/services/travel/departure-recommendation';
import { classifyEvidenceFreshness, resolveEvidenceConflict } from '@/services/engine/conflict-resolver';
import { calculateInterviewReadiness, evaluateInterviewAnswer } from '@/services/interview/interview-prep-engine';

describe('Part 5: Real-World Intelligence & Live Data Layer Test Suite', () => {
  describe('Provider Registry & Operational Status (Item 3 & 5)', () => {
    it('returns operational status list without leaking credentials', () => {
      const providers = providerRegistry.getProviderStatusList();
      expect(providers.length).toBeGreaterThan(0);

      for (const p of providers) {
        expect(p.id).toBeDefined();
        expect(p.name).toBeDefined();
        expect(typeof p.configured).toBe('boolean');
        expect(typeof p.available).toBe('boolean');

        // Security check: Must NOT leak API keys
        expect((p as any).apiKey).toBeUndefined();
        expect((p as any).secret).toBeUndefined();
      }
    });
  });

  describe('Provider Cache Layer (Item 32 & 36)', () => {
    it('handles cache set, hit, miss, and expiry', () => {
      const key = `test_key_${Date.now()}`;
      providerCache.set(key, { data: 'weather_payload' }, 5000, 'open-meteo');

      const cached = providerCache.get<{ data: string }>(key);
      expect(cached.hit).toBe(true);
      expect(cached.isExpired).toBe(false);
      expect(cached.value?.data).toBe('weather_payload');

      const miss = providerCache.get('non_existent_key');
      expect(miss.hit).toBe(false);
    });
  });

  describe('Geocoding & Location Disambiguation (Item 11 & 12)', () => {
    it('normalizes location coordinates for Noida and Gurgaon', async () => {
      const geoNoida = await geocodeLocation('Noida');
      expect(geoNoida.city).toBe('Noida');
      expect(geoNoida.isAmbiguous).toBe(false);
      expect(geoNoida.lat).toBeGreaterThan(0);

      const geoGurgaon = await geocodeLocation('Cyber City Gurgaon');
      expect(geoGurgaon.city).toBe('Gurgaon');
      expect(geoGurgaon.isAmbiguous).toBe(false);
    });

    it('flags ambiguous location queries like "Springfield"', async () => {
      const geoAmbiguous = await geocodeLocation('Springfield');
      expect(geoAmbiguous.isAmbiguous).toBe(true);
      expect(geoAmbiguous.possibleMatches?.length).toBeGreaterThan(1);
    });
  });

  describe('Departure Recommendation Engine (Item 9 & 10)', () => {
    it('calculates recommended departure time and route alternatives', () => {
      const mockTraffic = {
        origin: 'Noida',
        destination: 'Delhi',
        distanceKm: 28,
        normalDurationMins: 35,
        currentTrafficDurationMins: 55,
        delayMins: 20,
        delayRatio: 0.57,
        congestionLevel: 'heavy' as const,
        incidentCount: 2,
      };

      const result = calculateDepartureRecommendation('10:00', mockTraffic);

      expect(result.recommendedDepartureTime).toBeDefined();
      expect(result.delayMins).toBe(20);
      expect(result.delayRatio).toBe(0.57);
      expect(result.uncertaintyBufferMins).toBe(30);
      expect(result.routeAlternatives.length).toBe(3);
    });
  });

  describe('Freshness & Conflict Resolution Engine (Item 7, 15, 28)', () => {
    it('classifies evidence freshness accurately', () => {
      const now = new Date().toISOString();
      const freshStatus = classifyEvidenceFreshness(now);
      expect(freshStatus).toBe('FRESH');
    });

    it('resolves weighted estimate when two external sources disagree', () => {
      const sources = [
        { sourceName: 'TomTom Traffic API', value: 55, sourceQuality: 'OFFICIAL' as const, freshness: 'FRESH' as const, confidence: 0.95 },
        { sourceName: 'Mapbox Route API', value: 40, sourceQuality: 'REPUTABLE' as const, freshness: 'RECENT' as const, confidence: 0.85 },
      ];

      const resolved = resolveEvidenceConflict(sources);

      expect(resolved.hasConflict).toBe(true);
      expect(resolved.resolvedEstimate).toBeGreaterThan(40);
      expect(resolved.resolvedEstimate).toBeLessThan(55);
      expect(resolved.explanation).toContain('Conflict detected');
    });
  });

  describe('Interview Intelligence & Readiness Engine (Item 17, 19, 20)', () => {
    it('computes 6 readiness dimensions for interview preparation', () => {
      const readiness = calculateInterviewReadiness(['TypeScript', 'React'], ['React', 'TypeScript', 'System Design']);

      expect(readiness.technicalReadiness).toBeGreaterThan(0);
      expect(readiness.roleAlignmentScore).toBeGreaterThan(0);
    });

    it('evaluates interview answer structure using STAR criteria', () => {
      const answer = 'Situation: In my previous project, task was reducing latency. Action: I added indexes. Result: Reduced latency by 40%.';
      const evalResult = evaluateInterviewAnswer('Explain DB optimization', answer);

      expect(evalResult.score).toBeGreaterThanOrEqual(0.80);
      expect(evalResult.strengths.length).toBeGreaterThan(0);
      expect(evalResult.followUpQuestion).toBeDefined();
    });
  });
});
