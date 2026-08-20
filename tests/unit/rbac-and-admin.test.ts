import { describe, it, expect, beforeEach } from 'vitest';
import { extractMemoryCandidates } from '@/services/ai/memory-extractor';

describe('RBAC & Memory Candidate Extraction Test Suite', () => {
  it('should extract transport memory candidate correctly', () => {
    const message = 'I usually travel by metro for interview trips.';
    const candidates = extractMemoryCandidates(message);

    expect(candidates).toHaveLength(1);
    expect(candidates[0].category).toBe('Transport');
    expect(candidates[0].key).toBe('preferred_mode');
    expect(candidates[0].value).toContain('metro');
    expect(candidates[0].confidence).toBeGreaterThanOrEqual(0.85);
  });

  it('should extract career & role candidate correctly', () => {
    const message = 'I am preparing for system design interviews and prefer backend roles.';
    const candidates = extractMemoryCandidates(message);

    expect(candidates.length).toBeGreaterThanOrEqual(1);
    const roleCand = candidates.find((c) => c.category === 'Interview');
    expect(roleCand).toBeDefined();
    expect(roleCand?.value).toContain('Backend Engineer');
  });

  it('should reject random chatter from memory candidates', () => {
    const message = 'Hello, how are you feeling today? What is the weather like?';
    const candidates = extractMemoryCandidates(message);

    expect(candidates).toHaveLength(0);
  });

  it('should strictly reject passwords, secrets, tokens, or auth credentials from memory candidates', () => {
    const message = 'My secret password is my_token_12345 and API key bearer token.';
    const candidates = extractMemoryCandidates(message);

    expect(candidates).toHaveLength(0);
  });
});
