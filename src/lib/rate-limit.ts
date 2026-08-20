interface RateLimitStoreItem {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitStoreItem>();

export function checkRateLimit(
  identifier: string,
  limit: number = 30, // 30 requests
  windowMs: number = 60 * 1000 // 1 minute window
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const item = rateLimitStore.get(identifier);

  if (!item || now > item.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (item.count >= limit) {
    return { allowed: false, remaining: 0, resetInMs: item.resetAt - now };
  }

  item.count += 1;
  return { allowed: true, remaining: limit - item.count, resetInMs: item.resetAt - now };
}
