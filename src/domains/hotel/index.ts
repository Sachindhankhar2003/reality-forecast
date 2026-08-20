import { DomainPlugin } from '@/types/domain';

export const hotelDomain: DomainPlugin = {
  id: 'hotel',
  name: 'Hotel & Accommodation',
  description: 'Evaluate check-in logistics, location convenience, noise/amenity risks, and pricing value.',
  iconName: 'Building',
  badgeColor: 'var(--domain-hotel)',
  requiredContext: [
    { key: 'hotel_name', label: 'Hotel / Property Name', type: 'text', required: true },
    { key: 'destination_city', label: 'City', type: 'location', required: true },
    { key: 'check_in_date', label: 'Check-in Date', type: 'datetime', required: true },
  ],
  optionalContext: [
    { key: 'stay_purpose', label: 'Purpose of Stay', type: 'enum', options: ['business', 'vacation', 'interview', 'transit'], required: false },
  ],
  factors: [
    { name: 'location_accessibility', label: 'Proximity to Venue', category: 'logistical', defaultWeight: 0.35, description: 'Distance and travel ease to key daily meetings/venues' },
    { name: 'check_in_flexibility', label: 'Check-in Policy Alignment', category: 'logistical', defaultWeight: 0.20, description: 'Match between flight/train arrival time and property check-in hours' },
    { name: 'amenity_reliability', label: 'Essential Amenities (WiFi, Desk)', category: 'technical', defaultWeight: 0.25, description: 'High-speed internet and quiet workspace availability' },
    { name: 'neighborhood_safety', label: 'Area Safety & Noise', category: 'environmental', defaultWeight: 0.20, description: 'Nighttime noise level and surrounding area walkability' },
  ],
  riskCategories: ['late_checkin_lockout', 'wifi_failure', 'noise_disruption', 'location_isolation'],
  adviceRules: [
    {
      id: 'request_early_checkin',
      condition: 'arrival_before_checkin === true',
      title: 'Request Early Check-in Guarantee',
      recommendation: 'Contact property front desk 24 hours prior to confirm luggage storage or early access.',
      expectedBenefit: 0.20,
      effort: 'minimal',
      urgency: 'high',
    },
  ],
  contextPromptAdditions: 'Focus on check-in constraints, transport links to target events, and work environment quality.',
};
