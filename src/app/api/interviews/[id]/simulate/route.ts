import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { evaluateInterviewAnswer } from '@/services/interview/interview-prep-engine';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'demo-dev-user';
    const { id } = await params;

    const body = await req.json();
    const { questionId, answerText } = body;

    if (!questionId || !answerText) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'questionId and answerText are required.' } },
        { status: 400 }
      );
    }

    const question = await prisma.interviewQuestion.findUnique({
      where: { id: questionId },
      include: { interview: true },
    });

    if (!question || (question.interview.userId !== userId && userId !== 'demo-dev-user')) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Question not found or unauthorized.' } },
        { status: 404 }
      );
    }

    // Evaluate answer using STAR criteria
    const evaluation = evaluateInterviewAnswer(question.questionText, answerText);

    // Save InterviewAnswer record
    const record = await prisma.interviewAnswer.upsert({
      where: { questionId },
      update: {
        answerText,
        score: evaluation.score,
        feedback: `Communication: ${evaluation.communicationClarity}/10 | Technical: ${evaluation.technicalRelevance}/10 | Structure: ${evaluation.structureScore}/10`,
        strengthsJson: JSON.stringify(evaluation.strengths),
        improvementsJson: JSON.stringify(evaluation.improvements),
        followUpQuestion: evaluation.followUpQuestion,
        answeredAt: new Date(),
      },
      create: {
        questionId,
        answerText,
        score: evaluation.score,
        feedback: `Communication: ${evaluation.communicationClarity}/10 | Technical: ${evaluation.technicalRelevance}/10 | Structure: ${evaluation.structureScore}/10`,
        strengthsJson: JSON.stringify(evaluation.strengths),
        improvementsJson: JSON.stringify(evaluation.improvements),
        followUpQuestion: evaluation.followUpQuestion,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        answerId: record.id,
        score: evaluation.score,
        breakdown: {
          technicalRelevance: evaluation.technicalRelevance,
          communicationClarity: evaluation.communicationClarity,
          structureScore: evaluation.structureScore,
        },
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        followUpQuestion: evaluation.followUpQuestion,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Interview evaluation failed.' } },
      { status: 500 }
    );
  }
}
