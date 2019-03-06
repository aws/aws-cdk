import { AWS_REGIONS, AWS_SERVICES } from '../build-tools/aws-entities';
import { Facts, RegionInfo } from '../lib';

describe('find', () => {
  test('returns undefined for an unknown fact', () => {
    expect(RegionInfo.find(AWS_REGIONS[0], 'not:a:known:fact')).toBe(undefined);
  });

  test('returns undefined for an unknown region', () => {
    expect(RegionInfo.find('bermuda-triangle-42', Facts.partition)).toBe(undefined);
  });
});

describe('register', () => {
  test('allows registering an arbitrary fact', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = 'my:custom:fact';
    const value = '1337';

    // WHEN
    expect(RegionInfo.find(region, name)).toBe(undefined);
    expect(() => RegionInfo.register({ region, name, value })).not.toThrowError();

    // THEN
    expect(RegionInfo.find(region, name)).toBe(value);

    // Cleanup
    RegionInfo.unregister(region, name);
  });

  test('allows re-registering a fact with the same value', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = 'my:custom:fact';
    const value = '1337';

    // WHEN
    expect(RegionInfo.find(region, name)).toBe(undefined);
    expect(() => RegionInfo.register({ region, name, value })).not.toThrowError();

    // THEN
    expect(() => RegionInfo.register({ region, name, value })).not.toThrowError();
    expect(RegionInfo.find(region, name)).toBe(value);

    // Cleanup
    RegionInfo.unregister(region, name);
  });

  test('disallows re-registering a fact with a different value', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = Facts.partition;
    const value = '1337';

    // WHEN
    expect(RegionInfo.find(region, name)).not.toBe(value);

    // THEN
    expect(() => RegionInfo.register({ region, name, value }))
      .toThrowError(/already has a fact/);
  });

  test('allows overriding an arbitrary fact', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const name = 'my:custom:fact';
    const value = '1337';

    // WHEN
    expect(RegionInfo.find(region, name)).toBe(undefined);
    expect(() => RegionInfo.register({ region, name, value })).not.toThrowError();
    expect(RegionInfo.find(region, name)).toBe(value);

    // THEN
    expect(() => RegionInfo.register({ region, name, value: 'Foo' }, true)).not.toThrowError();
    expect(RegionInfo.find(region, name)).toBe('Foo');

    // Cleanup
    RegionInfo.unregister(region, name);
  });
});

test('built-in data is correct', () => {
  const snapshot: any = {};
  for (const region of AWS_REGIONS) {
    const servicePrincipals: { [service: string]: string | undefined } = {};
    AWS_SERVICES.forEach(service => servicePrincipals[service] = RegionInfo.find(region, Facts.servicePrincipal(service)));

    snapshot[region] = {
      partition: RegionInfo.find(region, Facts.partition),
      domainSuffix: RegionInfo.find(region, Facts.domainSuffix),
      cdkMetadataResourcePresent: RegionInfo.find(region, Facts.cdkMetadataResourcePresent),
      s3StaticWebsiteEndpoint: RegionInfo.find(region, Facts.s3StaticWebsiteEndpoint),
      servicePrincipals,
    };
  }
  expect(snapshot).toMatchSnapshot();
});
