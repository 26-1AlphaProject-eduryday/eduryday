import { describe, it, expect } from 'vitest';
import { ok, fail } from './response';

describe('response helpers', () => {
  it('ok() returns success response with data', async () => {
    const res = ok({ foo: 'bar' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data).toEqual({ foo: 'bar' });
  });

  it('fail() returns error response with code and message', async () => {
    const res = fail('VALIDATION_ERROR', 'Invalid input', 400);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe('VALIDATION_ERROR');
    expect(json.message).toBe('Invalid input');
  });

  it('fail() defaults to status 400', async () => {
    const res = fail('TEST', 'Test error');
    expect(res.status).toBe(400);
  });
});
