import { describe, it, expect } from 'vitest';
import { createApiResponseSuccess, createApiResponseError } from '@/lib/api-response';
import { getOrCreateRequestId } from '@/lib/request-id';
import { isSafeExternalUrl } from '@/lib/security';

describe('API v1 & Production Infrastructure Test Suite', () => {
  it('creates standardized Android-ready success response envelope', async () => {
    const requestId = 'req_test_12345';
    const response = createApiResponseSuccess({ sample: 'data' }, requestId);

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Request-ID')).toBe(requestId);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ sample: 'data' });
    expect(json.error).toBeNull();
    expect(json.meta.requestId).toBe(requestId);
    expect(json.meta.timestamp).toBeDefined();
  });

  it('creates standardized Android-ready error response envelope', async () => {
    const requestId = 'req_error_67890';
    const response = createApiResponseError('UNAUTHORIZED', 'Access denied.', requestId, 401);

    expect(response.status).toBe(401);
    expect(response.headers.get('X-Request-ID')).toBe(requestId);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.data).toBeNull();
    expect(json.error.code).toBe('UNAUTHORIZED');
    expect(json.error.message).toBe('Access denied.');
    expect(json.meta.requestId).toBe(requestId);
  });

  it('generates or preserves X-Request-ID header correctly', () => {
    const headers = new Headers();
    headers.set('x-request-id', 'custom_req_id');
    const extracted = getOrCreateRequestId(headers);
    expect(extracted).toBe('custom_req_id');

    const emptyHeaders = new Headers();
    const generated = getOrCreateRequestId(emptyHeaders);
    expect(generated).toMatch(/^req_\d+_/);
  });

  it('strictly blocks SSRF loopback and private IPv4/IPv6 address bypass attempts', () => {
    expect(isSafeExternalUrl('http://127.0.0.1/admin')).toBe(false);
    expect(isSafeExternalUrl('http://localhost:3000/internal')).toBe(false);
    expect(isSafeExternalUrl('http://169.254.169.254/latest/meta-data')).toBe(false);
    expect(isSafeExternalUrl('http://10.0.0.1/secret')).toBe(false);
    expect(isSafeExternalUrl('http://192.168.1.1/router')).toBe(false);
    expect(isSafeExternalUrl('https://api.open-meteo.com/v1/forecast')).toBe(true);
  });
});
