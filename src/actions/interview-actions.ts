'use server';

import { forecastStore } from '@/lib/forecast-store';
import { evaluateMockAnswer, InterviewAnalysis } from '@/services/interview/interview-engine';
import { revalidatePath } from 'next/cache';

export async function createInterviewAction(company: string, role: string, jd?: string): Promise<{ success: boolean; data?: InterviewAnalysis; error?: string }> {
  try {
    const intv = forecastStore.createInterview(company, role, jd);
    revalidatePath('/interviews');
    return { success: true, data: intv };
  } catch (err) {
    console.error('Failed to create interview analysis:', err);
    return { success: false, error: 'Failed to create interview analysis.' };
  }
}

export async function submitMockAnswerAction(questionText: string, userAnswer: string) {
  try {
    if (!userAnswer || userAnswer.trim().length < 5) {
      return { success: false, error: 'Please provide a more complete answer.' };
    }
    const evalResult = evaluateMockAnswer(questionText, userAnswer);
    return { success: true, data: evalResult };
  } catch (err) {
    console.error('Failed to evaluate mock answer:', err);
    return { success: false, error: 'Evaluation error.' };
  }
}
