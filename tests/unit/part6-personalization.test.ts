import { describe, it, expect } from 'vitest';
import { calculatePersonalAdjustment } from '@/services/personal-intelligence/personal-adjustment-engine';
import { generatePersonalizedActions } from '@/services/personal-intelligence/personal-advice-engine';
import { PersonalBiasAnalysis } from '@/services/personal-intelligence/outcome-analyzer';

describe('Part 6: Personal Intelligence & Personalized Forecasting Test Suite', () => {
  describe('Sample Size Thresholds & Pattern Strength (Item 13)', () => {
    it('returns 0 adjustment when sample size is below 3 observations (NO_PATTERN)', () => {
      const bias: PersonalBiasAnalysis = {
        patternStrength: 'NO_PATTERN',
        biasType: 'NONE',
        sampleSize: 2,
        averageScoreError: -0.08,
        confidence: 0.3,
        explanation: 'Insufficient data',
      };

      const result = calculatePersonalAdjustment(0.65, bias, false);

      expect(result.personalAdjustment).toBe(0);
      expect(result.finalScore).toBe(0.65);
    });
  });

  describe('Bounded Adjustment Limits (Item 17)', () => {
    it('clamps extreme personal historical adjustments within [-0.15, +0.15]', () => {
      const extremeNegativeBias: PersonalBiasAnalysis = {
        patternStrength: 'STRONGER_PATTERN',
        biasType: 'LATE_DEPARTURE',
        sampleSize: 12,
        averageScoreError: -0.40, // Extreme error attempt
        confidence: 0.90,
        explanation: 'Strong late departure trend',
      };

      const result = calculatePersonalAdjustment(0.70, extremeNegativeBias, false);

      expect(result.personalAdjustment).toBeGreaterThanOrEqual(-0.15);
      expect(result.personalAdjustment).toBe(-0.15);
      expect(result.finalScore).toBe(0.55);
    });
  });

  describe('Live Evidence Override Boundary (Item 48)', () => {
    it('prevents positive historical bias from overriding severe live traffic congestion', () => {
      const positiveBias: PersonalBiasAnalysis = {
        patternStrength: 'EMERGING_PATTERN',
        biasType: 'OPTIMISTIC_ESTIMATION',
        sampleSize: 6,
        averageScoreError: 0.12, // Positive bias
        confidence: 0.80,
        explanation: 'Optimistic travel trend',
      };

      // Live severe traffic congestion is TRUE
      const result = calculatePersonalAdjustment(0.60, positiveBias, true);

      expect(result.isOverridePrevented).toBe(true);
      expect(result.personalAdjustment).toBe(0);
      expect(result.finalScore).toBe(0.60);
    });
  });

  describe('Personal Advice & Action Prioritization (Items 20, 23)', () => {
    it('generates tailored action recommendations limited to top 3 items', () => {
      const bias: PersonalBiasAnalysis = {
        patternStrength: 'WEAK_PATTERN',
        biasType: 'LATE_DEPARTURE',
        sampleSize: 4,
        averageScoreError: -0.08,
        confidence: 0.70,
        explanation: 'Late departure trend',
      };

      const memories = [
        { id: 'm1', category: 'SKILL', key: 'tech', value: 'React, TypeScript', confidence: 0.9, freshnessStatus: 'CURRENT' as const, relevanceScore: 0.9 },
      ];

      const actions = generatePersonalizedActions(bias, memories, 'interview');

      expect(actions.length).toBeLessThanOrEqual(3);
      expect(actions[0].personalReason).toBeDefined();
      expect(actions[0].personalReason).toContain('arrived late');
    });
  });
});
