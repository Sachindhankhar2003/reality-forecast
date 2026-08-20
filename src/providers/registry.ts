export interface ProviderConfig {
  id: string;
  name: string;
  category: 'weather' | 'traffic' | 'maps' | 'search' | 'company' | 'jobs' | 'hotels' | 'events';
  configured: boolean;
  available: boolean;
  priority: number; // 1 = Primary, 2 = Secondary, 3 = Fallback
  timeoutMs: number;
  maxRetries: number;
  lastChecked: string;
  error?: string;
  latencyMs?: number;
}

class ProviderRegistry {
  private providers: Map<string, ProviderConfig> = new Map();

  constructor() {
    this.initializeRegistry();
  }

  private initializeRegistry() {
    const now = new Date().toISOString();

    // 1. Weather Providers
    this.providers.set('open-meteo', {
      id: 'open-meteo',
      name: 'Open-Meteo Weather API',
      category: 'weather',
      configured: true, // Keyless open API
      available: true,
      priority: 1,
      timeoutMs: 5000,
      maxRetries: 2,
      lastChecked: now,
      latencyMs: 120,
    });

    // 2. Traffic Providers
    this.providers.set('tomtom-traffic', {
      id: 'tomtom-traffic',
      name: 'TomTom Traffic Telemetry',
      category: 'traffic',
      configured: !!process.env.TOMTOM_API_KEY,
      available: true, // Available via live API or telemetry fallback model
      priority: 1,
      timeoutMs: 5000,
      maxRetries: 1,
      lastChecked: now,
      latencyMs: 180,
    });

    // 3. Maps & Geocoding Providers
    this.providers.set('mapbox-maps', {
      id: 'mapbox-maps',
      name: 'Mapbox Geocoding & Routing',
      category: 'maps',
      configured: !!process.env.MAPBOX_ACCESS_TOKEN,
      available: true,
      priority: 1,
      timeoutMs: 6000,
      maxRetries: 1,
      lastChecked: now,
      latencyMs: 140,
    });

    // 4. AI Engine Provider
    this.providers.set('gemini-ai', {
      id: 'gemini-ai',
      name: 'Google Gemini 2.5 Flash Engine',
      category: 'company',
      configured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here',
      available: true,
      priority: 1,
      timeoutMs: 8000,
      maxRetries: 2,
      lastChecked: now,
      latencyMs: 450,
    });
  }

  getProviderStatusList(): ProviderConfig[] {
    return Array.from(this.providers.values());
  }

  getProvider(id: string): ProviderConfig | undefined {
    return this.providers.get(id);
  }
}

export const providerRegistry = new ProviderRegistry();
