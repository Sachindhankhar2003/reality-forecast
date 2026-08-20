import { prisma } from '@/lib/db';
import { WhatIfRunItem } from '@/types/forecast';

export async function createWhatIfRunInDB(forecastId: string, userId: string, run: WhatIfRunItem) {
  return prisma.whatIfRun.create({
    data: {
      id: run.id,
      forecastId,
      userId,
      userInput: run.userInput,
      summary: run.summary,
      deltaScore: run.deltaScore,
      modifiedFactors: JSON.stringify(run.modifiedFactors),
      scenariosJson: JSON.stringify(run.scenarios),
    },
  });
}
