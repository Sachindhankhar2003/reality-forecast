import { DomainPlugin } from '@/types/domain';

export const travelDomain: DomainPlugin = {
  id: 'travel',
  name: 'Travel & Commute',
  description: 'Forecast travel times, weather disruptions, transit delays, and route risks.',
  iconName: 'Navigation',
  badgeColor: 'var(--domain-travel)',
  requiredContext: [
    { key: 'origin', label: 'Origin Location', type: 'location', required: true, description: 'Starting city or address' },
    { key: 'destination', label: 'Destination', type: 'location', required: true, description: 'Target destination or venue' },
    { key: 'travel_mode', label: 'Travel Mode', type: 'enum', options: ['car', 'train', 'bus', 'flight', 'metro', 'walk'], required: true },
    { key: 'departure_time', label: 'Planned Departure Time', type: 'datetime', required: true },
  ],
  optionalContext: [
    { key: 'buffer_minutes', label: 'Buffer Time (minutes)', type: 'number', required: false },
    { key: 'flexibility', label: 'Schedule Flexibility', type: 'enum', options: ['strict', 'flexible', 'high_buffer'], required: false },
  ],
  factors: [
    { name: 'weather_severity', label: 'Weather Impact', category: 'environmental', defaultWeight: 0.25, description: 'Rain, fog, storm, or extreme temperature impact on route' },
    { name: 'traffic_density', label: 'Traffic & Congestion', category: 'environmental', defaultWeight: 0.30, description: 'Peak hour congestion and bottlenecks along the travel corridor' },
    { name: 'route_distance', label: 'Distance & Mode Capacity', category: 'logistical', defaultWeight: 0.15, description: 'Travel distance relative to chosen transit mode efficiency' },
    { name: 'buffer_sufficiency', label: 'Time Buffer Surplus', category: 'temporal', defaultWeight: 0.20, description: 'Extra margin allocated for unexpected disruptions' },
    { name: 'vehicle_condition', label: 'Transit Reliability', category: 'logistical', defaultWeight: 0.10, description: 'Vehicle or transit line historical reliability' },
  ],
  riskCategories: ['delays', 'weather_disruption', 'route_closure', 'transit_breakdown', 'parking_bottleneck'],
  adviceRules: [
    {
      id: 'leave_early',
      condition: 'traffic_density > 0.6',
      title: 'Advance Departure by 30 Mins',
      recommendation: 'Depart 30 minutes earlier than planned to bypass expected congestion bottlenecks.',
      expectedBenefit: 0.22,
      effort: 'minimal',
      urgency: 'high',
    },
    {
      id: 'switch_mode',
      condition: 'traffic_density > 0.8',
      title: 'Use Metro / Express Rail',
      recommendation: 'Switch from car to dedicated rail/metro to avoid severe highway gridlock.',
      expectedBenefit: 0.35,
      effort: 'moderate',
      urgency: 'high',
    },
    {
      id: 'check_parking',
      condition: 'destination_center === true',
      title: 'Pre-book Destination Parking',
      recommendation: 'Reserve parking in advance near destination to avoid 15-20 min circling delay.',
      expectedBenefit: 0.15,
      effort: 'minimal',
      urgency: 'medium',
    },
  ],
  contextPromptAdditions: 'Focus on route geometry, weather precipitation probabilities, traffic peak hours, and public transit schedules.',
};
