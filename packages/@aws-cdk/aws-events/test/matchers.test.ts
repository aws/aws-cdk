import { App, Stack } from '@aws-cdk/core';
import { Match } from '../lib';

describe(Match, () => {
  const app = new App();
  const stack = new Stack(app, 'stack');

  test('anythingBut', () => {
    expect(stack.resolve(Match.anythingBut(1, 2, 3))).toEqual([
      { 'anything-but': [1, 2, 3] },
    ]);

    expect(stack.resolve(Match.anythingBut('foo', 'bar'))).toEqual([
      { 'anything-but': ['foo', 'bar'] },
    ]);

    expect(() => stack.resolve(Match.anythingBut(1, 'foo'))).toThrowError(/only strings or only numbers/);
    expect(() => stack.resolve(Match.anythingBut({ foo: 42 }))).toThrowError(/only strings or only numbers/);
    expect(() => stack.resolve(Match.anythingBut())).toThrowError(/must be non-empty lists/);
  });

  test('anythingButPrefix', () => {
    expect(stack.resolve(Match.anythingButPrefix('foo'))).toEqual([
      { 'anything-but': { prefix: 'foo' } },
    ]);
  });

  test('numeric', () => {
    expect(stack.resolve(Match.allOf(Match.greaterThan(-100), Match.lessThanOrEqual(200)))).toEqual([
      { numeric: ['>', -100, '<=', 200] },
    ]);

    expect(() => stack.resolve(Match.allOf())).toThrowError(/A list of matchers must contain at least one element/);
  });

  test('interval', () => {
    expect(stack.resolve(Match.interval(0, 100))).toEqual([
      { numeric: ['>=', 0, '<=', 100] },
    ]);

    expect(() => stack.resolve(Match.interval(1, 0))).toThrowError('Invalid interval: [1, 0]');
  });

  test('cidr', () => {
    // IPv4
    expect(stack.resolve(Match.cidr('198.51.100.14/24'))).toEqual([
      { cidr: '198.51.100.14/24' },
    ]);

    // IPv6
    expect(stack.resolve(Match.cidr('2001:db8::/48'))).toEqual([
      { cidr: '2001:db8::/48' },
    ]);

    // Invalid
    expect(() => stack.resolve(Match.cidr('a.b.c/31'))).toThrow(/Invalid IP address range/);
  });

  test('anyOf', () => {
    expect(stack.resolve(Match.anyOf(Match.equal(0), Match.equal(1)))).toEqual([
      { numeric: ['=', 0] },
      { numeric: ['=', 1] },
    ]);

    expect(() => stack.resolve(Match.anyOf())).toThrow(/A list of matchers must contain at least one element/);
  });

  test('prefix', () => {
    expect(stack.resolve(Match.prefix('foo'))).toEqual([
      { prefix: 'foo' },
    ]);
  });

  test('suffix', () => {
    expect(stack.resolve(Match.suffix('foo'))).toEqual([
      { suffix: 'foo' },
    ]);
  });

  test('equalsIgnoreCase', () => {
    expect(stack.resolve(Match.equalsIgnoreCase('foo'))).toEqual([
      { 'equals-ignore-case': 'foo' },
    ]);
  });
});
