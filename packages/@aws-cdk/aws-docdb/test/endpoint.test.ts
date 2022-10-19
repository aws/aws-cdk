import { Token } from '@aws-cdk/core';
import { Endpoint } from '../lib';

const CDK_NUMERIC_TOKEN = Token.asNumber({ Ref: 'abc' });

describe('Endpoint', () => {
  test('accepts tokens for the port value', () => {
    // GIVEN
    const token = CDK_NUMERIC_TOKEN;

    // WHEN
    const endpoint = new Endpoint('127.0.0.1', token);

    // THEN
    expect(endpoint.port).toBe(token);
  });

  test('accepts valid port string numbers', () => {
    // GIVEN
    for (const port of [1, 50, 65535]) {
      // WHEN
      const endpoint = new Endpoint('127.0.0.1', port);

      // THEN
      expect(endpoint.port).toBe(port);
    }
  });

  test('throws an exception for port numbers below the minimum', () => {
    // GIVEN
    const port = 0;

    // WHEN
    function createInvalidEnpoint() {
      new Endpoint('127.0.0.1', port);
    }

    // THEN
    expect(createInvalidEnpoint)
      .toThrow();
  });

  test('throws an exception for port numbers above the maximum', () => {
    // GIVEN
    const port = 65536;

    // WHEN
    function createInvalidEnpoint() {
      new Endpoint('127.0.0.1', port);
    }

    // THEN
    expect(createInvalidEnpoint)
      .toThrow();
  });

  test('throws an exception for floating-point port numbers', () => {
    // GIVEN
    const port = 1.5;

    // WHEN
    function createInvalidEnpoint() {
      new Endpoint('127.0.0.1', port);
    }

    // THEN
    expect(createInvalidEnpoint)
      .toThrow();
  });

  describe('.portAsString()', () => {
    test('converts port tokens to string tokens', () => {
      // GIVEN
      const port = CDK_NUMERIC_TOKEN;
      const endpoint = new Endpoint('127.0.0.1', port);

      // WHEN
      const result = endpoint.portAsString();

      // THEN
      // Should return a string token
      expect(Token.isUnresolved(result)).toBeTruthy();
      // It should not just be the string representation of the numeric token
      expect(result).not.toBe(port.toString());
    });

    test('converts resolved port numbers to string representation', () => {
      // GIVEN
      const port = 1500;
      const endpoint = new Endpoint('127.0.0.1', port);

      // WHEN
      const result = endpoint.portAsString();

      // THEN
      expect(result).toBe(port.toString());
    });
  });
});
