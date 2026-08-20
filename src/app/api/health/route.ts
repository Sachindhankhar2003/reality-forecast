import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      data: {
        status: 'ok',
        app: 'Reality Forecast',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_DISCONNECTED',
          message: 'Database connectivity error.',
          details: error.message,
        },
      },
      { status: 503 }
    );
  }
}
