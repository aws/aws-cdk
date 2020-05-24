import { AWS_REGIONS } from '../build-tools/aws-entities';
import { Fact, FactName } from '../lib';

describe('find', () => {
  test('returns undefined for an unknown fact', () => {
    expect(Fact.find(AWS_REGIONS[0], 'not:a:known:fact')).toBe(undefined);
  });

  test('returns undefined for an unknown region', () => {
    expect(Fact.find('bermuda-triangle-42', FactName.PARTITION)).toBe(undefined);
  });
});

describe('requireFact', () => {
  test('throws error for an unknown fact', () => {
    expect(() => Fact.requireFact(AWS_REGIONS[0], 'not:a:known:fact')).toThrowError();
  });

  test('throws error for an unknown region', () => {
    expect(() => Fact.requireFact('bermuda-triangle-42', FactName.PARTITION)).toThrowError();
  });
});

describe('register', () => {
  test('allows registering an arbitrary fact', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = 'my:custom:fact';
    const value = '1337';

    // WHEN
    expect(Fact.find(region, name)).toBe(undefined);
    expect(() => Fact.register({ region, name, value })).not.toThrowError();

    // THEN
    expect(Fact.find(region, name)).toBe(value);

    // Cleanup
    Fact.unregister(region, name);
  });

  test('allows re-registering a fact with the same value', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = 'my:custom:fact';
    const value = '1337';

    // WHEN
    expect(Fact.find(region, name)).toBe(undefined);
    expect(() => Fact.register({ region, name, value })).not.toThrowError();

    // THEN
    expect(() => Fact.register({ region, name, value })).not.toThrowError();
    expect(Fact.find(region, name)).toBe(value);

    // Cleanup
    Fact.unregister(region, name);
  });

  test('disallows re-registering a fact with a different value', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = FactName.PARTITION;
    const value = '1337';

    // WHEN
    expect(Fact.find(region, name)).not.toBe(value);

    // THEN
    expect(() => Fact.register({ region, name, value }))
      .toThrowError(/already has a fact/);
  });

  test('allows overriding an arbitrary fact', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = 'my:custom:fact';
    const value = '1337';

    // WHEN
    expect(Fact.find(region, name)).toBe(undefined);
    expect(() => Fact.register({ region, name, value })).not.toThrowError();
    expect(Fact.find(region, name)).toBe(value);

    // THEN
    expect(() => Fact.register({ region, name, value: 'Foo' }, true)).not.toThrowError();
    expect(Fact.find(region, name)).toBe('Foo');

    // Cleanup
    Fact.unregister(region, name);
  });
});
