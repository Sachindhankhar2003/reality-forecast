export interface InterviewReadinessDimensions {
  technicalReadiness: number; // 0.0 to 1.0
  communicationReadiness: number;
  behavioralReadiness: number;
  projectReadiness: number;
  roleAlignmentScore: number;
  preparationCompleteness: number;
}

export interface GeneratedQuestion {
  id: string;
  category: 'TECHNICAL' | 'PROJECT' | 'SYSTEM_DESIGN' | 'BEHAVIORAL' | 'HR';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  text: string;
  expectedFocus: string[];
  starGuide: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export function calculateInterviewReadiness(
  userSkills: string[] = [],
  requiredSkills: string[] = ['React', 'TypeScript', 'Next.js', 'System Design']
): InterviewReadinessDimensions {
  const matchCount = requiredSkills.filter((sk) =>
    userSkills.some((us) => us.toLowerCase().includes(sk.toLowerCase()))
  ).length;

  const techScore = parseFloat((matchCount / Math.max(requiredSkills.length, 1)).toFixed(2));
  const roleAlignment = parseFloat((0.60 + techScore * 0.35).toFixed(2));

  return {
    technicalReadiness: Math.min(Math.max(techScore, 0.60), 0.95),
    communicationReadiness: 0.85,
    behavioralReadiness: 0.80,
    projectReadiness: 0.78,
    roleAlignmentScore: roleAlignment,
    preparationCompleteness: 0.75,
  };
}

export function generateStructuredQuestions(
  role: string,
  company: string,
  userProjects: string[] = ['Mutual Fund Analytics', 'Reality Forecast App']
): GeneratedQuestion[] {
  return [
    {
      id: `q-tech-${Date.now()}-1`,
      category: 'TECHNICAL',
      difficulty: 'MEDIUM',
      text: `Explain how React Server Components differ from Client Components in Next.js 15, and when you would choose one over the other for a project at ${company}.`,
      expectedFocus: ['Server-side rendering', 'Bundle size optimization', 'Async component data fetching'],
      starGuide: {
        situation: 'Building a high-throughput dashboard page',
        task: 'Reduce client-side bundle weight',
        action: 'Migrate non-interactive data widgets to Server Components',
        result: 'Achieved 40% faster initial LCP load time',
      },
    },
    {
      id: `q-system-${Date.now()}-2`,
      category: 'SYSTEM_DESIGN',
      difficulty: 'HARD',
      text: `How would you architect a real-time telemetry pipeline for handling traffic and weather data with graceful fallback when external APIs fail?`,
      expectedFocus: ['Circuit breakers', 'In-memory caching', 'Fallback data models'],
      starGuide: {
        situation: 'External weather provider experiences 503 service outage',
        task: 'Maintain continuous user forecast generation without crashing',
        action: 'Implement parallel Promise.allSettled with cached fallback model',
        result: '100% uptime maintained during external outage window',
      },
    },
    {
      id: `q-proj-${Date.now()}-3`,
      category: 'PROJECT',
      difficulty: 'MEDIUM',
      text: `Walk me through the architecture of your '${userProjects[0] || 'Analytics'}' project. What was the toughest technical trade-off you made?`,
      expectedFocus: ['Database indexing', 'State synchronization', 'Trade-off justification'],
      starGuide: {
        situation: 'High query latency on large dataset',
        task: 'Optimize database response time',
        action: 'Added compound indexes and implemented selective caching',
        result: 'Reduced average response latency from 450ms to 42ms',
      },
    },
  ];
}

export function evaluateInterviewAnswer(
  questionText: string,
  answerText: string
): {
  score: number;
  technicalRelevance: number;
  communicationClarity: number;
  structureScore: number;
  strengths: string[];
  improvements: string[];
  followUpQuestion: string;
} {
  const wordCount = answerText.trim().split(/\s+/).length;
  const isStructured = answerText.toLowerCase().includes('result') || answerText.toLowerCase().includes('situation') || wordCount > 30;

  const score = isStructured ? 0.85 : 0.65;
  const techRel = isStructured ? 8.5 : 6.5;
  const clarity = wordCount > 20 ? 8.0 : 6.0;

  return {
    score,
    technicalRelevance: techRel,
    communicationClarity: clarity,
    structureScore: isStructured ? 8.0 : 5.5,
    strengths: [
      'Addressed technical core concepts directly',
      'Demonstrated practical software engineering awareness',
    ],
    improvements: [
      'Structure answer using the STAR technique (Situation, Task, Action, Result) for higher impact',
      'Quantify results with metrics (e.g. % latency reduction or throughput gains)',
    ],
    followUpQuestion: `That makes sense. Could you elaborate on how you handled error boundaries or edge cases during that process?`,
  };
}
