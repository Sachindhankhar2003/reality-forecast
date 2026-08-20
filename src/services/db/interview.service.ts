import { prisma } from '@/lib/db';
import { InterviewAnalysis } from '@/services/interview/interview-engine';
import { logAuditEvent } from './audit.service';

export async function createInterviewInDB(userId: string, data: InterviewAnalysis) {
  const interview = await prisma.interview.create({
    data: {
      id: data.id,
      userId,
      companyName: data.companyName,
      roleTitle: data.roleTitle,
      technicalReadiness: data.technicalReadiness,
      communicationReadiness: data.communicationReadiness,
      behavioralReadiness: data.behavioralReadiness,
      roleMatchScore: data.roleMatchScore,
      questions: {
        create: data.suggestedQuestions.map((q, idx) => ({
          id: q.id,
          questionText: q.text,
          category: q.category,
          difficulty: q.difficulty.toUpperCase(),
          displayOrder: idx,
        })),
      },
    },
    include: { questions: true },
  });

  await logAuditEvent('INTERVIEW_CREATED', 'Interview', interview.id, userId, { company: data.companyName, role: data.roleTitle });
  return interview;
}

export async function saveInterviewAnswerInDB(questionId: string, answerText: string, evaluation: any) {
  return prisma.interviewAnswer.upsert({
    where: { questionId },
    update: {
      answerText,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengthsJson: JSON.stringify(evaluation.strengths),
      improvementsJson: JSON.stringify(evaluation.improvements),
      followUpQuestion: evaluation.followUpQuestion || null,
    },
    create: {
      questionId,
      answerText,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengthsJson: JSON.stringify(evaluation.strengths),
      improvementsJson: JSON.stringify(evaluation.improvements),
      followUpQuestion: evaluation.followUpQuestion || null,
    },
  });
}

export async function getUserInterviewsFromDB(userId: string) {
  return prisma.interview.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      questions: {
        include: { answer: true },
      },
    },
  });
}
