import { NextResponse } from 'next/server';
import { providerRegistry } from '@/providers/registry';

export async function GET() {
  const providers = providerRegistry.getProviderStatusList();

  return NextResponse.json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      activeProviderCount: providers.filter((p) => p.configured && p.available).length,
      providers: providers.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        configured: p.configured,
        available: p.available,
        priority: p.priority,
        timeoutMs: p.timeoutMs,
        latencyMs: p.latencyMs,
        lastChecked: p.lastChecked,
      })),
    },
  });
}
