'use server';

import { forecastStore } from '@/lib/forecast-store';
import { ForecastRecord } from '@/types/forecast';
import { revalidatePath } from 'next/cache';

export async function createForecastAction(formData: FormData): Promise<{ success: boolean; data?: ForecastRecord; error?: string }> {
  try {
    const input = formData.get('input') as string;
    if (!input || input.trim().length < 5) {
      return { success: false, error: 'Please enter a description of your planned event or situation (at least 5 characters).' };
    }

    const forecast = await forecastStore.createForecastFromNL(input);
    revalidatePath('/forecasts');
    revalidatePath('/dashboard');
    return { success: true, data: forecast };
  } catch (err) {
    console.error('Failed to create forecast:', err);
    return { success: false, error: 'Failed to process natural language input. Please try again.' };
  }
}

export async function getForecastAction(id: string): Promise<ForecastRecord | null> {
  return forecastStore.getForecast(id) || null;
}

export async function getAllForecastsAction(): Promise<ForecastRecord[]> {
  return forecastStore.getAllForecasts();
}
