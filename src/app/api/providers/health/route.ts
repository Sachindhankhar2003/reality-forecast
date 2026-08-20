import { NextResponse } from 'next/server';
import { getProviderHealthStatus } from '@/services/providers/health-service';

export async function GET() {
  try {
    const healthReports = await getProviderHealthStatus();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      providers: healthReports,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve provider health status.';
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message },
      },
      { status: 500 }
    );
  }
}
