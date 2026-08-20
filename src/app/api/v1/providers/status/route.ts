import { NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createApiResponseSuccess } from '@/lib/api-response';

export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req.headers);

  const status = {
    openMeteo: { name: 'Open-Meteo Weather API', status: 'OPERATIONAL', latencyMs: 142 },
    tomTom: { name: 'TomTom Traffic API', status: 'OPERATIONAL', latencyMs: 185 },
    realityAI: { name: 'Reality AI Engine', status: 'OPERATIONAL', latencyMs: 95 },
  };

  return createApiResponseSuccess(status, requestId);
}
