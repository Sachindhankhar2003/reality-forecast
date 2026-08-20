export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove potential script tags and HTML markup
  let cleaned = input.replace(/<[^>]*>?/gm, '');

  // Strip prompt injection attempts
  const injectionPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions/gi,
    /disregard\s+(system\s+)?prompt/gi,
    /you\s+are\s+now\s+a/gi,
    /override\s+instructions/gi,
    /expose\s+api\s+keys?/gi,
  ];

  for (const pattern of injectionPatterns) {
    cleaned = cleaned.replace(pattern, '[FILTERED_INSTRUCTION_ATTEMPT]');
  }

  return cleaned.trim();
}
