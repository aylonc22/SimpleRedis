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

it('handles KEYS * correctly', () => {
  handleCommand(['SET', 'a', '1']);
  handleCommand(['SET', 'b', '2']);
  const response = handleCommand(['KEYS', '*']);
  console.log(response);
  expect(response.startsWith('*2\r\n')).toBe(true);
});
});
