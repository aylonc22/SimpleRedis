// test/commands.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { handleCommand, resetStore } from '../src/commands';

beforeEach(()=>{
   resetStore();
})
describe('handleCommand', () => {
  it('responds to PING', () => {
    const res = handleCommand(['PING']);
    expect(res).toBe('+PONG\r\n');
  });

  it('responds to ECHO with argument', () => {
    const res = handleCommand(['ECHO', 'hello']);
    expect(res).toBe('+hello\r\n');
  });

  it('returns error on ECHO without argument', () => {
    const res = handleCommand(['ECHO']);
    expect(res).toBe('-ERR missing argument\r\n');
  });

  it('sets and gets a key', () => {
    handleCommand(['SET', 'foo', 'bar']);
    const res = handleCommand(['GET', 'foo']);
    expect(res).toBe('$3\r\nbar\r\n');
  });

  it('returns null for nonexistent key', () => {
    const res = handleCommand(['GET', 'nope']);
    expect(res).toBe('$-1\r\n');
  });

  it('returns error for unknown command', () => {
    const res = handleCommand(['UNKNOWN']);
    expect(res).toBe("-ERR unknown command: UNKNOWN\r\n");
  });

  it('returns error for incomplete SET', () => {
    const res = handleCommand(['SET', 'only_key']);
    expect(res).toBe('-ERR wrong number of arguments for SET\r\n');
  });

  it('returns error for incomplete GET', () => {
    const res = handleCommand(['GET']);
    expect(res).toBe('-ERR wrong number of arguments for GET\r\n');
  });

  it('handles INCR correctly', () => {
  handleCommand(['SET', 'counter', '5']);
  expect(handleCommand(['INCR', 'counter'])).toBe(':6\r\n');
  expect(handleCommand(['GET', 'counter'])).toBe('$1\r\n6\r\n');
});

 it('handles DECR correctly', () => {
  handleCommand(['SET', 'counter', '5']);
  expect(handleCommand(['DECR', 'counter'])).toBe(':4\r\n');
  expect(handleCommand(['GET', 'counter'])).toBe('$1\r\n4\r\n');
});

it('handles KEYS * correctly', () => {
  handleCommand(['SET', 'a', '1']);
  handleCommand(['SET', 'b', '2']);
  const response = handleCommand(['KEYS', '*']); 
  expect(response.startsWith('*2\r\n')).toBe(true);
});

it('EXISTS returns 1 if key exists, 0 otherwise', () => { 
  handleCommand(['SET', 'foo', 'bar']);
  expect(handleCommand(['EXISTS', 'foo'])).toBe(':1\r\n');
  expect(handleCommand(['EXISTS', 'baz'])).toBe(':0\r\n');
});

it('EXPIRE sets TTL and returns 1, 0 if key missing', () => { 
  handleCommand(['SET', 'foo', 'bar']);
  expect(handleCommand(['EXPIRE', 'foo', '2'])).toBe(':1\r\n');
  expect(handleCommand(['EXPIRE', 'baz', '2'])).toBe(':0\r\n');
});

it('TTL returns -2 for nonexistent key', () => {
  expect(handleCommand(['TTL', 'missing'])).toBe(':-2\r\n');
});

it('TTL returns -1 for key without expiration', () => {
  handleCommand(['SET', 'foo', 'bar']);
  expect(handleCommand(['TTL', 'foo'])).toBe(':-1\r\n');
});

it('TTL returns positive number for key with expiration', async () => {
  handleCommand(['SET', 'foo', 'bar']);
  handleCommand(['EXPIRE', 'foo', '5']);
  const ttlResponse = handleCommand(['TTL', 'foo']);
  const ttl = parseInt(ttlResponse.slice(1).trim()); // remove ':' and whitespace
  expect(ttl).toBeGreaterThan(0);
  expect(ttl).toBeLessThanOrEqual(5);
});

it('TTL returns -2 after key expired', async () => {
  handleCommand(['SET', 'foo', 'bar']);
  handleCommand(['EXPIRE', 'foo', '1']); // expire after 1 second

  // wait for 2 seconds to ensure expiration
  await new Promise((r) => setTimeout(r, 2100));

  expect(handleCommand(['TTL', 'foo'])).toBe(':-2\r\n');
  expect(handleCommand(['GET', 'foo'])).toBe('$-1\r\n');
});
});
