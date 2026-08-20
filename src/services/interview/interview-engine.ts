export interface InterviewAnalysis {
  id: string;
  companyName: string;
  roleTitle: string;
  technicalReadiness: number; // 0.0 to 1.0
  communicationReadiness: number;
  behavioralReadiness: number;
  roleMatchScore: number;
  preparationGaps: { category: string; topic: string; priority: 'high' | 'medium' | 'low'; description: string }[];
  suggestedQuestions: { id: string; text: string; category: string; difficulty: 'easy' | 'medium' | 'hard' }[];
}

export interface MockInterviewTurn {
  questionId: string;
  questionText: string;
  category: string;
  userAnswer?: string;
  score?: number; // 0.0 to 1.0
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  followUpQuestion?: string;
}

export function generateInterviewAnalysis(company: string, role: string, jobDescription?: string): InterviewAnalysis {
  return {
    id: 'intv-' + Math.random().toString(36).substring(2, 9),
    companyName: company || 'Delhi Tech Corp',
    roleTitle: role || 'Software Developer',
    technicalReadiness: 0.78,
    communicationReadiness: 0.82,
    behavioralReadiness: 0.74,
    roleMatchScore: 0.80,
    preparationGaps: [
      {
        category: 'System Architecture',
        topic: 'Distributed Caching & Redis Integration',
        priority: 'high',
        description: 'Role requires experience designing fault-tolerant caching layers for high-throughput services.',
      },
      {
        category: 'Behavioral / Leadership',
        topic: 'Handling Cross-Team Engineering Conflicts',
        priority: 'medium',
        description: 'Prepare a specific STAR scenario demonstrating diplomatic conflict resolution with product managers.',
      },
      {
        category: 'Database Optimization',
        topic: 'PostgreSQL Indexing & Query Execution Plans',
        priority: 'medium',
        description: 'Review EXPLAIN ANALYZE tuning techniques for complex multi-table joins.',
      },
    ],
    suggestedQuestions: [
      {
        id: 'q-1',
        text: 'Walk me through a software project where you had to refactor a legacy service under tight timeline constraints.',
        category: 'Behavioral / Technical',
        difficulty: 'medium',
      },
      {
        id: 'q-2',
        text: 'How would you design a rate-limiting system for a public REST API handling 10,000 requests per second in Delhi NCR region?',
        category: 'System Design',
        difficulty: 'hard',
      },
      {
        id: 'q-3',
        text: 'Describe a situation where a production outage occurred. How did you diagnose the root cause and prevent recurrence?',
        category: 'Situational',
        difficulty: 'medium',
      },
    ],
  };
}

export function evaluateMockAnswer(questionText: string, userAnswer: string): {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  followUpQuestion?: string;
} {
  const wordCount = userAnswer.trim().split(/\s+/).length;
  let score = 0.75;
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount > 35) {
    score += 0.10;
    strengths.push('Good answer depth and context structure');
  } else {
    improvements.push('Elaborate with specific technical metrics or STAR outcomes');
  }

  if (userAnswer.toLowerCase().includes('result') || userAnswer.toLowerCase().includes('impact') || userAnswer.toLowerCase().includes('percent') || userAnswer.toLowerCase().includes('ms')) {
    score += 0.10;
    strengths.push('Included quantifiable impact metrics');
  } else {
    improvements.push('Quantify the engineering result (e.g. reduced latency by 35%)');
  }

  score = Math.min(0.95, Number(score.toFixed(2)));

  return {
    score,
    feedback: `Solid response (${Math.round(score * 100)}% score). You articulated the core problem well. Adding specific telemetry metrics would strengthen impact.`,
    strengths,
    improvements,
    followUpQuestion: 'How would your architecture handle a 5x sudden traffic spike during peak hours?',
  };
}
