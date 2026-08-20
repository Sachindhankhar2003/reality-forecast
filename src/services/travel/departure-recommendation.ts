import { RouteAlternative, TrafficData } from '@/providers/types';

export interface DepartureRecommendation {
  targetArrivalTime: string; // HH:mm
  normalDurationMins: number;
  currentTrafficDurationMins: number;
  delayMins: number;
  delayRatio: number;
  uncertaintyBufferMins: number;
  recommendedDepartureTime: string; // HH:mm
  expectedArrivalWindow: string; // HH:mm - HH:mm
  routeAlternatives: RouteAlternative[];
}

export function calculateDepartureRecommendation(
  targetArrivalTime: string = '10:00',
  trafficData: TrafficData
): DepartureRecommendation {
  const normalDuration = Math.max(trafficData.normalDurationMins, 10);
  const currentDuration = Math.max(trafficData.currentTrafficDurationMins, normalDuration);
  const delayMins = Math.max(currentDuration - normalDuration, 0);

  // Clamp delay ratio (never negative)
  const delayRatio = parseFloat((delayMins / normalDuration).toFixed(2));

  // Dynamic uncertainty buffer based on congestion
  const bufferMins = trafficData.congestionLevel === 'heavy' ? 30 : trafficData.congestionLevel === 'moderate' ? 20 : 15;

  const totalLeadTimeMins = currentDuration + bufferMins;

  // Compute recommended departure time
  const [hoursStr, minsStr] = targetArrivalTime.split(':');
  const targetDate = new Date();
  targetDate.setHours(parseInt(hoursStr || '10', 10), parseInt(minsStr || '0', 10), 0, 0);

  const departureDate = new Date(targetDate.getTime() - totalLeadTimeMins * 60 * 1000);
  const depH = departureDate.getHours().toString().padStart(2, '0');
  const depM = departureDate.getMinutes().toString().padStart(2, '0');
  const recommendedDepartureTime = `${depH}:${depM}`;

  const windowStartDate = new Date(targetDate.getTime() - bufferMins * 60 * 1000);
  const winH1 = windowStartDate.getHours().toString().padStart(2, '0');
  const winM1 = windowStartDate.getMinutes().toString().padStart(2, '0');
  const expectedArrivalWindow = `${winH1}:${winM1} - ${targetArrivalTime}`;

  const routeAlternatives: RouteAlternative[] = [
    {
      name: 'Primary Highway Corridor (DND / Express Way)',
      distanceKm: trafficData.distanceKm,
      durationMins: currentDuration,
      trafficDelayMins: delayMins,
      riskFactor: delayMins > 15 ? 'HIGH' : 'MEDIUM',
      highlights: ['Direct multi-lane highway', 'Heavy morning rush hour toll congestion'],
    },
    {
      name: 'Secondary Arterial Route via Ring Road',
      distanceKm: Math.round(trafficData.distanceKm * 1.15),
      durationMins: currentDuration + 5,
      trafficDelayMins: Math.max(delayMins - 8, 5),
      riskFactor: 'MEDIUM',
      highlights: ['Bypasses main toll plaza', 'Multiple traffic signal intersections'],
    },
    {
      name: 'Express Transit (Delhi Metro Blue/Magenta Line)',
      distanceKm: Math.round(trafficData.distanceKm * 0.95),
      durationMins: 38,
      trafficDelayMins: 0,
      riskFactor: 'LOW',
      highlights: ['Immune to highway traffic congestion', 'Guaranteed 38-minute transit schedule'],
    },
  ];

  return {
    targetArrivalTime,
    normalDurationMins: normalDuration,
    currentTrafficDurationMins: currentDuration,
    delayMins,
    delayRatio,
    uncertaintyBufferMins: bufferMins,
    recommendedDepartureTime,
    expectedArrivalWindow,
    routeAlternatives,
  };
}
