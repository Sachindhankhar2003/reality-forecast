'use server';

import { forecastStore } from '@/lib/forecast-store';
import { WhatIfRunItem } from '@/types/forecast';
import { revalidatePath } from 'next/cache';

export async function runWhatIfAction(
  forecastId: string,
  whatIfInput: string
): Promise<{ success: boolean; data?: WhatIfRunItem; error?: string }> {
  try {
    if (!whatIfInput || whatIfInput.trim().length < 3) {
      return { success: false, error: 'Please enter a valid what-if hypothesis.' };
    }

    const run = forecastStore.addWhatIfRun(forecastId, whatIfInput);
    if (!run) {
      return { success: false, error: 'Forecast not found.' };
    }

    revalidatePath(`/forecasts/${forecastId}`);
    return { success: true, data: run };
  } catch (err) {
    console.error('Failed to run what-if simulation:', err);
    return { success: false, error: 'Failed to process simulation.' };
  }
}
