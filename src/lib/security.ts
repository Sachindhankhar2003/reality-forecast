import { z } from 'zod';

export function isSafeExternalUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();

    // SSRF Blocklist (Localhost, Private IPs, Link-Local, Cloud Metadata)
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.startsWith('169.254.') || // Link-local / Cloud metadata (169.254.169.254)
      hostname.startsWith('162.254.') ||
      hostname.startsWith('192.168.') || // Private Class C
      hostname.startsWith('10.') ||      // Private Class A
      hostname.startsWith('172.16.') ||  // Private Class B ranges
      hostname.startsWith('172.31.') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const planInputSchema = z.object({
  planText: z.string().min(3, 'Plan text must be at least 3 characters.').max(1000, 'Plan text exceeds 1000 characters.'),
  domain: z.string().optional(),
  targetTime: z.string().optional(),
});

export const outcomeInputSchema = z.object({
  forecastId: z.string().min(1, 'Forecast ID is required.'),
  rawOutcomeText: z.string().min(3, 'Outcome text must be at least 3 characters.'),
  result: z.enum(['SUCCESS', 'PARTIAL', 'FAILED', 'DELAYED', 'CANCELLED', 'UNEXPECTED', 'UNKNOWN']).default('SUCCESS'),
  notes: z.string().optional(),
});

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}
