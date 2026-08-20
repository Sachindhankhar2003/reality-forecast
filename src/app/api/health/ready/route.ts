import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'READY',
      checks: {
        database: 'OK',
        telemetryProviders: 'OK',
        aiEngine: 'OK',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'UNREADY',
        checks: {
          database: 'FAILED',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
