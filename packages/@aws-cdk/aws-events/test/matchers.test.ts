import { Matchers } from '../lib';

describe(Matchers, () => {
  test('anythingBut', () => {
    expect(Matchers.anythingBut(1, 2, 3).toEventBridgeMatcher()).toEqual([
      { 'anything-but': [1, 2, 3] },
    ]);

    expect(Matchers.anythingBut('foo', 'bar').toEventBridgeMatcher()).toEqual([
      { 'anything-but': ['foo', 'bar'] },
    ]);

    expect(() => Matchers.anythingBut(1, 'foo').toEventBridgeMatcher()).toThrowError(/only strings or only numbers/);
    expect(() => Matchers.anythingBut({ foo: 42 }).toEventBridgeMatcher()).toThrowError(/only strings or only numbers/);
    expect(() => Matchers.anythingBut().toEventBridgeMatcher()).toThrowError(/must be non-empty lists/);
  });

  test('anythingButPrefix', () => {
    expect(Matchers.anythingButPrefix('foo').toEventBridgeMatcher()).toEqual([
      { 'anything-but': { prefix: 'foo' } },
    ]);
  });

  test('numeric', () => {
    expect(Matchers.numeric(Matchers.greaterThan(-100), Matchers.lessThanOrEqual(200)).toEventBridgeMatcher()).toEqual([
      { numeric: ['>', -100, '<=', 200] },
    ]);

    expect(() => Matchers.numeric().toEventBridgeMatcher()).toThrowError(/must be non-empty lists/);
  });

  test('interval', () => {
    expect(Matchers.interval(0, 100).toEventBridgeMatcher()).toEqual([
      { numeric: ['>=', 0, '<=', 100] },
    ]);

    expect(() => Matchers.interval(1, 0).toEventBridgeMatcher()).toThrowError('Invalid interval: [1, 0]');
  });

  test('cidr', () => {
    // IPv4
    expect(Matchers.cidr('198.51.100.14/24').toEventBridgeMatcher()).toEqual([
      { cidr: '198.51.100.14/24' },
    ]);

    // IPv6
    expect(Matchers.cidr('2001:db8::/48').toEventBridgeMatcher()).toEqual([
      { cidr: '2001:db8::/48' },
    ]);

    // Invalid
    expect(() => Matchers.cidr('a.b.c/31').toEventBridgeMatcher()).toThrow(/Invalid IP address range/);
  });
});