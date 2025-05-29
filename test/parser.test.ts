// test/parser.test.ts
import { describe, it, expect } from 'vitest';
import { parseRESP } from '../src/parser';

describe('parseRESP', () => {
  it('parses a simple PING command', () => {
    const input = Buffer.from('*1\r\n$4\r\nPING\r\n');
    const result = parseRESP(input);
    expect(result).toEqual(['PING']);
  });

  it('parses a PING with argument', () => {
    const input = Buffer.from('*2\r\n$4\r\nPING\r\n$4\r\nPONG\r\n');
    const result = parseRESP(input);
    expect(result).toEqual(['PING', 'PONG']);
  });

  it('returns null on invalid RESP', () => {
    const input = Buffer.from('INVALID');
    const result = parseRESP(input);
    expect(result).toBeNull();
  });

  it('returns null on incomplete data', () => {
    const input = Buffer.from('*2\r\n$4\r\nPING\r\n$');
    const result = parseRESP(input);
    expect(result).toBeNull();
  });
});
