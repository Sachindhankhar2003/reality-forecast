import { prisma } from '@/lib/db';

export interface UserDeletionResult {
  userId: string;
  deletedForecastsCount: number;
  deletedMemoriesCount: number;
  deletedInterviewsCount: number;
  accountDeleted: boolean;
  completedAt: string;
}

export async function deleteUserDataAndAccount(userId: string): Promise<UserDeletionResult> {
  // Cascading deletes for user data
  const [deletedForecasts, deletedMemories, deletedInterviews] = await prisma.$transaction([
    prisma.forecast.deleteMany({ where: { userId } }),
    prisma.memory.deleteMany({ where: { userId } }),
    prisma.interview.deleteMany({ where: { userId } }),
  ]);

  // Delete user record if not demo user
  let accountDeleted = false;
  if (userId !== 'demo-dev-user') {
    const deletedUser = await prisma.user.deleteMany({ where: { id: userId } });
    accountDeleted = deletedUser.count > 0;
  }

  return {
    userId,
    deletedForecastsCount: deletedForecasts.count,
    deletedMemoriesCount: deletedMemories.count,
    deletedInterviewsCount: deletedInterviews.count,
    accountDeleted,
    completedAt: new Date().toISOString(),
  };
}
