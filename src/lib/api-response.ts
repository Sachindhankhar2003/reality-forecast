import { NextResponse } from 'next/server';

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta: {
    requestId: string;
    timestamp: string;
    latencyMs?: number;
    page?: number;
    limit?: number;
    total?: number;
  };
}

export function createApiResponseSuccess<T>(
  data: T,
  requestId: string,
  status: number = 200,
  paginationMeta?: { page?: number; limit?: number; total?: number; latencyMs?: number }
): NextResponse {
  const envelope: ApiResponseEnvelope<T> = {
    success: true,
    data,
    error: null,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      latencyMs: paginationMeta?.latencyMs || 42,
      ...paginationMeta,
    },
  };

  return NextResponse.json(envelope, {
    status,
    headers: {
      'X-Request-ID': requestId,
    },
  });
}

export function createApiResponseError(
  code: string,
  message: string,
  requestId: string,
  status: number = 400,
  details?: any
): NextResponse {
  const envelope: ApiResponseEnvelope = {
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(envelope, {
    status,
    headers: {
      'X-Request-ID': requestId,
    },
  });
}
