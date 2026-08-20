export function getOrCreateRequestId(headers: Headers): string {
  const existing = headers.get('x-request-id') || headers.get('X-Request-ID');
  if (existing) return existing;
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
