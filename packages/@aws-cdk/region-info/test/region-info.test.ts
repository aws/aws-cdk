import { AWS_REGIONS, AWS_SERVICES } from '../build-tools/aws-entities';
import { Fact, FactName } from '../lib';

describe('find', () => {
  test('returns undefined for an unknown fact', () => {
    expect(Fact.find(AWS_REGIONS[0], 'not:a:known:fact')).toBe(undefined);
  });

  test('returns undefined for an unknown region', () => {
    expect(Fact.find('bermuda-triangle-42', FactName.partition)).toBe(undefined);
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
    const name = FactName.partition;
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

test('built-in data is correct', () => {
  const snapshot: any = {};
  for (const region of AWS_REGIONS) {
    const servicePrincipals: { [service: string]: string | undefined } = {};
    AWS_SERVICES.forEach(service => servicePrincipals[service] = Fact.find(region, FactName.servicePrincipal(service)));

    snapshot[region] = {
      partition: Fact.find(region, FactName.partition),
      domainSuffix: Fact.find(region, FactName.domainSuffix),
      cdkMetadataResourcePresent: Fact.find(region, FactName.cdkMetadataResourceAvailable),
      s3StaticWebsiteEndpoint: Fact.find(region, FactName.s3StaticWebsiteEndpoint),
      servicePrincipals,
    };
  }
  expect(snapshot).toMatchSnapshot();
});
