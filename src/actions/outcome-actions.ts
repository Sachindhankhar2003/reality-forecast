'use server';

import { forecastStore } from '@/lib/forecast-store';
import { OutcomeItem } from '@/types/forecast';
import { revalidatePath } from 'next/cache';

export async function recordOutcomeAction(
  forecastId: string,
  result: OutcomeItem['result'],
  notes?: string,
  customResult?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const outcome: OutcomeItem = {
      id: 'out-' + Math.random().toString(36).substring(2, 9),
      result,
      notes,
      customResult,
      recordedAt: new Date().toISOString(),
      accuracyScore: result === 'successful' ? 0.92 : result === 'partially_successful' ? 0.75 : 0.40,
      lessons: result === 'successful'
        ? 'Allocating a 25-min departure buffer and tracking live traffic telemetries successfully prevented late arrival.'
        : 'Unexpected bottleneck occurred. Future forecasts will increase weight on single-corridor transit risks.',
    };

    forecastStore.recordOutcome(forecastId, outcome);
    revalidatePath(`/forecasts/${forecastId}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Failed to record outcome:', err);
    return { success: false, error: 'Failed to save actual outcome.' };
  }
}
