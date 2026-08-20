import { ForecastDomain } from '@/types/domain';

export interface ExtractedContext {
  title: string;
  domain: ForecastDomain;
  eventAt?: string;
  location?: string;
  entities: { key: string; value: string; confidence: number }[];
  summary: string;
  extractedFields: Record<string, string>;
}

export async function extractContextFromNL(input: string): Promise<ExtractedContext> {
  const lower = input.toLowerCase();

  // Rule + Pattern domain detection fallback
  let domain: ForecastDomain = 'generic';

  if (lower.includes('interview') || lower.includes('job') || lower.includes('hiring') || lower.includes('resume')) {
    domain = 'interview';
  } else if (lower.includes('travel') || lower.includes('delhi') || lower.includes('car') || lower.includes('flight') || lower.includes('commute') || lower.includes('drive') || lower.includes('train') || lower.includes('bus')) {
    domain = 'travel';
  } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort') || lower.includes('room')) {
    domain = 'hotel';
  } else if (lower.includes('exam') || lower.includes('test') || lower.includes('syllabus') || lower.includes('study')) {
    domain = 'exam';
  } else if (lower.includes('meeting') || lower.includes('presentation') || lower.includes('deck') || lower.includes('pitch')) {
    domain = 'meeting';
  }

  // Extract location
  let location: string | undefined = undefined;
  if (lower.includes('delhi')) location = 'Delhi, India';
  else if (lower.includes('mumbai')) location = 'Mumbai, India';
  else if (lower.includes('bengaluru') || lower.includes('bangalore')) location = 'Bengaluru, India';
  else if (lower.includes('london')) location = 'London, UK';
  else if (lower.includes('new york')) location = 'New York, USA';

  // Extract time reference
  let eventAt: string | undefined = undefined;
  const now = new Date();

  if (lower.includes('tomorrow')) {
    const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
    tomorrow.setHours(10, 0, 0, 0);
    eventAt = tomorrow.toISOString();
  } else if (lower.includes('today') || lower.includes('tonight')) {
    const today = new Date(now.getTime() + 4 * 3600 * 1000);
    eventAt = today.toISOString();
  } else {
    // Default to next day 10 AM
    const defaultDate = new Date(now.getTime() + 24 * 3600 * 1000);
    defaultDate.setHours(10, 0, 0, 0);
    eventAt = defaultDate.toISOString();
  }

  // Generate clean title
  let title = input.trim();
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }

  const extractedFields: Record<string, string> = {
    original_input: input,
  };

  if (domain === 'travel') {
    extractedFields.origin = location ? 'Starting Point' : 'Home';
    extractedFields.destination = location || 'Destination';
    extractedFields.travel_mode = lower.includes('car') ? 'car' : lower.includes('train') ? 'train' : lower.includes('flight') ? 'flight' : 'car';
    extractedFields.departure_time = eventAt;
  } else if (domain === 'interview') {
    extractedFields.target_company = lower.includes('google') ? 'Google' : lower.includes('amazon') ? 'Amazon' : 'Tech Company';
    extractedFields.role_title = lower.includes('developer') || lower.includes('software') ? 'Software Developer' : 'Candidate Role';
    extractedFields.interview_type = lower.includes('system design') ? 'system_design' : lower.includes('technical') ? 'technical' : 'technical';
    extractedFields.location_or_mode = lower.includes('car') || location ? 'in_person' : 'video_call';
  }

  return {
    title,
    domain,
    eventAt,
    location,
    entities: [
      { key: 'domain', value: domain, confidence: 0.95 },
      { key: 'location', value: location || 'Not specified', confidence: 0.85 },
      { key: 'time', value: eventAt, confidence: 0.90 },
    ],
    summary: `Forecast request for ${domain.toUpperCase()} domain. Context extracted: ${title}`,
    extractedFields,
  };
}
