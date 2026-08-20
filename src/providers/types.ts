export type DataStatus = 'LIVE' | 'RECENT' | 'ESTIMATED' | 'USER_PROVIDED' | 'INFERRED' | 'UNKNOWN';
export type Freshness = 'FRESH' | 'RECENT' | 'STALE' | 'EXPIRED';
export type SourceQuality = 'OFFICIAL' | 'PRIMARY' | 'REPUTABLE' | 'SECONDARY' | 'UNKNOWN';

export interface ProviderResponse<T> {
  source: string;
  providerName: string;
  status: DataStatus;
  freshness: Freshness;
  sourceQuality: SourceQuality;
  retrievedAt: string;
  validUntil: string;
  confidence: number;
  data: T;
  metadata?: Record<string, unknown>;
}

export interface WeatherData {
  location: string;
  temperatureC: number;
  condition: string;
  precipitationProbability: number;
  precipitationAmountMm?: number;
  windSpeedKmh: number;
  visibilityKm: number;
  severeWeatherNotice?: string;
  forecastSummary: string;
}

export interface TrafficData {
  origin: string;
  destination: string;
  distanceKm: number;
  normalDurationMins: number;
  currentTrafficDurationMins: number;
  delayMins: number;
  delayRatio: number; // (current - normal) / normal
  congestionLevel: 'low' | 'moderate' | 'heavy' | 'severe';
  incidentCount: number;
  recommendedDepartureTime?: string;
}

export interface LocationResult {
  query: string;
  displayName: string;
  city?: string;
  region?: string;
  country?: string;
  lat?: number;
  lng?: number;
  isAmbiguous: boolean;
  possibleMatches?: string[];
}

export interface RouteAlternative {
  name: string;
  distanceKm: number;
  durationMins: number;
  trafficDelayMins: number;
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH';
  highlights: string[];
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  sourceQuality: SourceQuality;
  publishedAt?: string;
  retrievedAt: string;
  relevance: number;
}

export interface CompanyData {
  companyName: string;
  industry?: string;
  website?: string;
  size?: string;
  description?: string;
  verifiedOfficial: boolean;
}

export interface JobData {
  roleTitle: string;
  company: string;
  location?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  salaryRange?: string;
  sourceUrl?: string;
}

export interface HotelData {
  propertyName: string;
  destination: string;
  pricePerNight?: number;
  availabilityConfirmed: boolean;
  rating?: number;
  source: string;
}

export interface EventData {
  eventName: string;
  venueName: string;
  startTime: string;
  endTime?: string;
  location: string;
  availabilityConfirmed: boolean;
  source: string;
}

// Provider Interfaces
export interface WeatherProvider {
  getWeather(location: string): Promise<ProviderResponse<WeatherData>>;
}

export interface TrafficProvider {
  getTraffic(origin: string, destination: string, travelMode?: string): Promise<ProviderResponse<TrafficData>>;
}

export interface MapsProvider {
  geocode(query: string): Promise<LocationResult>;
}

export interface SearchProvider {
  search(query: string): Promise<SearchResult[]>;
}

export interface CompanyProvider {
  getCompany(query: string): Promise<CompanyData | null>;
}

export interface JobsProvider {
  searchJobs(query: string): Promise<JobData[]>;
}

export interface HotelProvider {
  searchHotels(destination: string): Promise<HotelData[]>;
}

export interface EventsProvider {
  searchEvents(location: string): Promise<EventData[]>;
}
