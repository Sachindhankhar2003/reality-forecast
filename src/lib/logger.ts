export interface LogPayload {
  requestId?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  latencyMs?: number;
  userId?: string;
  provider?: string;
  errorCode?: string;
  message: string;
  details?: Record<string, unknown>;
}

function sanitizeLogDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) return undefined;
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(details)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('token') ||
      lowerKey.includes('auth') ||
      lowerKey.includes('key')
    ) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export const logger = {
  info: (payload: LogPayload) => {
    const output = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      ...payload,
      details: sanitizeLogDetails(payload.details),
    };
    console.log(JSON.stringify(output));
  },

  warn: (payload: LogPayload) => {
    const output = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      ...payload,
      details: sanitizeLogDetails(payload.details),
    };
    console.warn(JSON.stringify(output));
  },

  error: (payload: LogPayload) => {
    const output = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      ...payload,
      details: sanitizeLogDetails(payload.details),
    };
    console.error(JSON.stringify(output));
  },
};
