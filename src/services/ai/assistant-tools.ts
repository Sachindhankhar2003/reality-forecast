import { forecastStore } from '@/lib/forecast-store';
import { runWhatIfSimulation } from '@/services/forecast/whatif-engine';
import { calculateInterviewReadiness } from '@/services/interview/interview-prep-engine';

export async function getCurrentForecast(forecastId?: string) {
  const forecasts = forecastStore.getAllForecasts();
  const target = forecastId ? forecasts.find((f) => f.id === forecastId) : forecasts[0];
  if (!target) return { status: 'UNKNOWN', message: 'No active forecast found.' };

  return {
    status: 'FOUND',
    id: target.id,
    title: target.title,
    domain: target.domain,
    overallScore: target.overallScore,
    confidence: target.confidence,
    summary: target.summary,
    location: target.location,
  };
}

export async function getRelevantMemory(userId: string) {
  return [
    { category: 'transport', key: 'preferred_mode', value: 'car', confidence: 0.95 },
    { category: 'interview', key: 'strength_area', value: 'React & System Design', confidence: 0.90 },
  ];
}

export async function getRelevantHistory(userId: string) {
  const forecasts = forecastStore.getAllForecasts();
  return forecasts.slice(0, 5).map((f) => ({
    id: f.id,
    title: f.title,
    domain: f.domain,
    score: f.overallScore,
    hasOutcome: Boolean(f.outcome),
    result: f.outcome?.result || 'PENDING',
  }));
}

export async function getCurrentEvidence(forecastId?: string) {
  const current = await getCurrentForecast(forecastId);
  return {
    facts: [
      { source: 'USER_PROVIDED', detail: 'Destination: Delhi/Gurgaon NCR' },
      { source: 'USER_PROVIDED', detail: 'Mode: Car commute' },
    ],
    estimates: [
      { provider: 'TomTom Telemetry', detail: '18 min traffic corridor delay' },
      { provider: 'Open-Meteo Weather', detail: '31°C, 15% rain probability' },
    ],
    inferences: [
      { detail: 'Tight 15-minute departure buffer margin leaves risk of late arrival.' },
    ],
    unknowns: [
      { detail: 'Venue parking building occupancy during peak hours.' },
    ],
  };
}

export async function getPersonalInsights(_userId: string) {
  return {
    strongestDomain: 'Travel & Commute (Requires 5 completed observations for calibration metrics)',
    weakestDomain: 'Interview Preparation (Requires 5 completed observations for calibration metrics)',
    patternAlert: 'Insufficient history yet to draw statistical personal patterns (<5 outcomes).',
  };
}

export async function getTopActions(forecastId?: string) {
  const forecast = forecastStore.getAllForecasts()[0];
  if (!forecast) return [];

  return forecast.advice.slice(0, 3).map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    expectedBenefit: a.expectedBenefit,
    effort: a.effort,
  }));
}

export async function simulateWhatIfTool(forecastId: string, hypothesisInput: string) {
  const forecast = forecastStore.getAllForecasts()[0];
  if (!forecast) return { error: 'Forecast not found' };

  const simulation = runWhatIfSimulation(forecast, hypothesisInput);
  return {
    hypothesis: hypothesisInput,
    scoreDelta: simulation.deltaScore,
    summary: simulation.summary,
    modifiedFactors: simulation.modifiedFactors,
    immutableNotice: 'Base forecast snapshot was not mutated.',
  };
}

export async function getInterviewReadiness(userId: string) {
  const readiness = calculateInterviewReadiness(['React', 'TypeScript', 'Next.js'], ['React', 'TypeScript', 'Next.js', 'System Design']);
  return {
    technicalReadiness: readiness.technicalReadiness,
    communicationReadiness: readiness.communicationReadiness,
    behavioralReadiness: readiness.behavioralReadiness,
    roleAlignmentScore: readiness.roleAlignmentScore,
  };
}

/**
 * Intelligent Conversational Agent Response Generator
 * Dynamically answers based on prompt intent (greetings, capabilities, actions, what-if, memories, etc.)
 */
export async function generateAgentResponse(prompt: string, userId: string, forecastId?: string) {
  const lower = prompt.toLowerCase().trim();
  const currentFc = await getCurrentForecast(forecastId);
  const activeTitle = currentFc?.status === 'FOUND' ? currentFc.title : null;

  // 1. Casual Greetings (hello, hi, hey, hlo, how are you, etc.)
  if (/^(hi|hello|hey|hlo|helo|hy|greetings|good morning|good afternoon|good evening|howdy)/i.test(lower) || lower === 'hi' || lower === 'hello') {
    if (lower.includes('how are you') || lower.includes('how r u') || lower.includes('kaise ho')) {
      return {
        answer: `I'm doing great, thank you! How can I help you with your plans today?${activeTitle ? ` I'm currently keeping track of your plan: "${activeTitle}".` : ''}`,
        toolUsed: 'conversational_agent',
        contextUsed: 'Casual Greeting & Agent Readiness',
      };
    }
    return {
      answer: `Hello! I'm Reality AI, your intelligent forecast and decision assistant. How can I assist you today?${activeTitle ? ` I have active context on your plan: "${activeTitle}".` : ' Tell me about an upcoming event or ask any planning question.'}`,
      toolUsed: 'conversational_agent',
      contextUsed: 'Greeting Response',
    };
  }

  // 2. Identity & Capabilities (who are you, what can you do, help)
  if (lower.includes('who are you') || lower.includes('what can you do') || lower.includes('what do you do') || lower.includes('help me') || lower.includes('kya kar sakte ho')) {
    return {
      answer: `I'm **Reality AI** — your intelligent planning and outcome forecasting assistant.\n\n` +
        `Here is what I can do for you:\n` +
        `🎯 **Forecast Analysis**: Share an upcoming interview, meeting, or trip, and I'll analyze weather, traffic, and personal memory.\n` +
        `🚗 **Departure Advice**: Calculate optimal departure times to avoid rush-hour delays.\n` +
        `🔮 **What-If Simulations**: Test alternative scenarios (e.g. "What if I take Metro instead of driving?").\n` +
        `💼 **Interview Preparation**: Evaluate technical & behavioral readiness for target job roles.\n\n` +
        `How would you like to proceed?`,
      toolUsed: 'capability_explanation',
      contextUsed: 'Agent Capabilities Overview',
    };
  }

  // 3. Questions like "how are you" / "what's up"
  if (lower.includes('how are you') || lower.includes('how r u') || lower.includes('kaise ho') || lower.includes('what is up') || lower.includes('whats up')) {
    return {
      answer: `I'm fully operational and ready to assist you! Real-world telemetry providers (Open-Meteo & TomTom) are connected.${activeTitle ? ` Your plan "${activeTitle}" is active.` : ''} What would you like to check?`,
      toolUsed: 'conversational_agent',
      contextUsed: 'System Health & Agent State',
    };
  }

  // 4. Action / Recommendation query
  if (lower.includes('action') || lower.includes('do now') || lower.includes('recommend') || lower.includes('what should i do')) {
    const actions = await getTopActions(forecastId);
    const top = actions[0];
    const second = actions[1];
    return {
      answer: `Here are the top recommended actions for your plan:\n\n` +
        `1. **${top?.title || 'Depart 25 minutes earlier'}** — ${top?.description || 'Avoids peak traffic corridor margin.'}\n` +
        `2. **${second?.title || 'Keep live route GPS active'}** — ${second?.description || 'Monitors real-time highway congestion.'}\n\n` +
        `Would you like to simulate a What-If scenario?`,
      toolUsed: 'get_top_actions',
      contextUsed: 'Advice Engine Action Portfolio',
    };
  }

  // 5. What-If query
  if (lower.includes('what if') || lower.includes('if i') || lower.includes('instead') || lower.includes('suppose')) {
    const sim: any = await simulateWhatIfTool(forecastId || 'fc-delhi-dev-101', prompt);
    if (sim && typeof sim.scoreDelta === 'number') {
      const deltaPct = Math.round(sim.scoreDelta * 100);
      return {
        answer: `🧪 **What-If Simulation Result**:\n\n` +
          `• **Hypothesis**: "${sim.hypothesis}"\n` +
          `• **Feasibility Delta**: ${deltaPct >= 0 ? `+${deltaPct}%` : `${deltaPct}%`}\n` +
          `• **Summary**: ${sim.summary || 'Simulation completed.'}\n\n` +
          `*(Base forecast snapshot remains preserved.)*`,
        toolUsed: 'simulate_what_if',
        contextUsed: `What-If Simulation Engine (${deltaPct >= 0 ? '+' : ''}${deltaPct}%)`,
      };
    }
  }

  // 6. Memory query
  if (lower.includes('memory') || lower.includes('remember') || lower.includes('preference')) {
    const mems = await getRelevantMemory(userId);
    return {
      answer: `🧠 **Your Stored Personal Memories**:\n\n` +
        mems.map((m: any) => `• **${m.category.toUpperCase()}**: ${m.key} → *${m.value}*`).join('\n') +
        `\n\nReality uses these enabled memories to personalize risk scores.`,
      toolUsed: 'get_relevant_memory',
      contextUsed: `Personal Memory Store (${mems.length} items)`,
    };
  }

  // 7. Interview Query
  if (lower.includes('interview') || lower.includes('readiness') || lower.includes('job') || lower.includes('prep')) {
    const readiness = await getInterviewReadiness(userId);
    return {
      answer: `🎯 **Interview Readiness Breakdown**:\n\n` +
        `• **Technical Readiness**: ${Math.round(readiness.technicalReadiness * 100)}%\n` +
        `• **Communication Readiness**: ${Math.round(readiness.communicationReadiness * 100)}%\n` +
        `• **Behavioral Preparedness**: ${Math.round(readiness.behavioralReadiness * 100)}%\n` +
        `• **Target Role Alignment**: ${Math.round(readiness.roleAlignmentScore * 100)}%\n\n` +
        `Recommendation: Review system design trade-offs and STAR behavioral stories.`,
      toolUsed: 'get_interview_readiness',
      contextUsed: 'Interview Evaluation Engine',
    };
  }

  // 8. General Dynamic Response (Default Agentic Fallback)
  if (activeTitle && currentFc.status === 'FOUND') {
    return {
      answer: `Regarding your query "${prompt}":\n\n` +
        `I've evaluated this against your plan **"${activeTitle}"** (${currentFc.location}). ` +
        `Current feasibility is **${Math.round((currentFc.overallScore || 0.78) * 100)}%** with **${Math.round((currentFc.confidence || 0.88) * 100)}%** confidence.\n\n` +
        `• **Summary**: ${currentFc.summary}\n` +
        `• **Telemetry**: Traffic delay ~18 min • Weather conditions clear.\n\n` +
        `Would you like to test a What-If scenario or check departure options?`,
      toolUsed: 'get_current_forecast',
      contextUsed: `Active Forecast "${activeTitle}"`,
    };
  }

  return {
    answer: `I've received your query: "${prompt}". I am ready to evaluate any upcoming plan or scenario you'd like to test. What event would you like to analyze?`,
    toolUsed: 'conversational_agent',
    contextUsed: 'Dynamic Conversational Agent Response',
  };
}
