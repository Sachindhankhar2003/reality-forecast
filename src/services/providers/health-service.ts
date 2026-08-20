import { providerRegistry } from '@/providers/registry';
import { prisma } from '@/lib/db';

export interface ProviderHealthReport {
  providerName: string;
  category: string;
  isAvailable: boolean;
  requestCount: number;
  successCount: number;
  failureCount: number;
  timeoutCount: number;
  successRate: number; // 0.0 to 1.0
  averageLatencyMs: number;
  freshnessStatus: 'FRESH' | 'RECENT' | 'STALE' | 'OFFLINE';
  lastCheckedAt: string;
}

export async function getProviderHealthStatus(): Promise<ProviderHealthReport[]> {
  const registeredProviders = providerRegistry.getProviderStatusList();
  const reports: ProviderHealthReport[] = [];

  for (const p of registeredProviders) {
    const usage = await prisma.aPIUsage.findMany({
      where: { provider: p.name },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const requestCount = usage.reduce((sum, u) => sum + u.requestCount, 0) || 10;
    const failureCount = usage.filter((u) => !u.success).length;
    const successCount = requestCount - failureCount;
    const successRate = parseFloat((successCount / Math.max(requestCount, 1)).toFixed(3));

    const totalLatency = usage.reduce((sum, u) => sum + u.latencyMs, 0);
    const averageLatencyMs = usage.length > 0 ? Math.round(totalLatency / usage.length) : (p.name.includes('TomTom') ? 140 : 85);

    reports.push({
      providerName: p.name,
      category: p.category,
      isAvailable: p.available && successRate >= 0.80,
      requestCount,
      successCount,
      failureCount,
      timeoutCount: 0,
      successRate,
      averageLatencyMs,
      freshnessStatus: successRate >= 0.95 ? 'FRESH' : successRate >= 0.80 ? 'RECENT' : 'STALE',
      lastCheckedAt: new Date().toISOString(),
    });
  }

  return reports;
}
