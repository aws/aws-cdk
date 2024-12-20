import { Fact, FactName } from '../lib';
import { AWS_REGIONS } from '../lib/aws-entities';

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
    expect(() => Fact.requireFact(AWS_REGIONS[0], 'not:a:known:fact')).toThrow();
  });

  test('throws error for an unknown region', () => {
    expect(() => Fact.requireFact('bermuda-triangle-42', FactName.PARTITION)).toThrow();
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
    expect(() => Fact.register({ region, name, value })).not.toThrow();

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
    expect(() => Fact.register({ region, name, value })).not.toThrow();

    // THEN
    expect(() => Fact.register({ region, name, value })).not.toThrow();
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
      .toThrow(/already has a fact/);
  });

  test('allows overriding an arbitrary fact', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = 'my:custom:fact';
    const value = '1337';

    // WHEN
    expect(Fact.find(region, name)).toBe(undefined);
    expect(() => Fact.register({ region, name, value })).not.toThrow();
    expect(Fact.find(region, name)).toBe(value);

    // THEN
    expect(() => Fact.register({ region, name, value: 'Foo' }, true)).not.toThrow();
    expect(Fact.find(region, name)).toBe('Foo');

    // Cleanup
    Fact.unregister(region, name);
  });

  test('registering a fact with a new region adds the region', () => {
    // GIVEN
    const region = 'my-custom-region';
    const name = FactName.PARTITION;
    const value = 'nebraska';

    // WHEN
    expect(Fact.find(region, name)).not.toBe(value);
    expect(() => Fact.register({ region, name, value })).not.toThrow();

    // THEN
    expect(Fact.regions.includes('my-custom-region')).toBeTruthy();
    expect(Fact.find(region, name)).toBe('nebraska');
  });

  test('regions does not return duplicate regions', () => {
    expect(new Set(Fact.regions).size == Fact.regions.length).toBeTruthy();
  });
});
