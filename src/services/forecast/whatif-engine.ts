import { ForecastRecord, WhatIfRunItem, ScenarioItem } from '@/types/forecast';
import { generateScenarios } from './scenario-generator';

export function runWhatIfSimulation(forecast: ForecastRecord, whatIfInput: string): WhatIfRunItem {
  const lower = whatIfInput.toLowerCase();
  let scoreDelta = 0;
  const modifiedFactors: { factorName: string; originalValue: string; modifiedValue: string }[] = [];

  if (lower.includes('earlier') || lower.includes('hour early') || lower.includes('leave earlier') || lower.includes('30 min')) {
    scoreDelta = 0.18; // +18% improvement from avoiding traffic peak
    modifiedFactors.push({
      factorName: 'Departure Time & Peak Traffic',
      originalValue: 'Planned Schedule (Peak Traffic)',
      modifiedValue: '30-60 Mins Earlier (Off-Peak Window)',
    });
    modifiedFactors.push({
      factorName: 'Time Buffer Surplus',
      originalValue: '15 min buffer',
      modifiedValue: '45-60 min buffer',
    });
  } else if (lower.includes('metro') || lower.includes('train') || lower.includes('transit')) {
    scoreDelta = 0.22; // +22% improvement from dedicated rail route
    modifiedFactors.push({
      factorName: 'Mode Capacity & Congestion Immunity',
      originalValue: 'Car via Highway Corridor',
      modifiedValue: 'Metro / Dedicated Rail Transit',
    });
  } else if (lower.includes('prepare') || lower.includes('study') || lower.includes('review') || lower.includes('hours')) {
    scoreDelta = 0.15; // +15% improvement from additional preparation
    modifiedFactors.push({
      factorName: 'Technical Readiness & Confidence',
      originalValue: 'Standard Preparation',
      modifiedValue: '+2 Hours Focused Technical Review',
    });
  } else {
    scoreDelta = 0.10;
    modifiedFactors.push({
      factorName: 'Assumed Plan Adjustment',
      originalValue: 'Default Plan',
      modifiedValue: whatIfInput,
    });
  }

  const simulatedScore = Math.min(0.95, Number((forecast.overallScore + scoreDelta).toFixed(2)));

  // Generate updated scenario set for this simulation
  const simulatedScenarios: ScenarioItem[] = generateScenarios(simulatedScore, forecast.factors, forecast.domain);

  const whatIfRun: WhatIfRunItem = {
    id: 'wif-' + Math.random().toString(36).substring(2, 9),
    userInput: whatIfInput,
    summary: `Simulation shows a +${Math.round(scoreDelta * 100)}% shift in overall situational index (from ${Math.round(forecast.overallScore * 100)}% to ${Math.round(simulatedScore * 100)}%).`,
    deltaScore: scoreDelta,
    createdAt: new Date().toISOString(),
    modifiedFactors,
    scenarios: simulatedScenarios,
  };

  return whatIfRun;
}
