import { AWS_REGIONS, AWS_SERVICES } from '../build-tools/aws-entities';
import { RegionInfo } from '../lib';

test('built-in data is correct', () => {
  const snapshot: any = {};
  for (const name of AWS_REGIONS) {
    const region = RegionInfo.get(name);

    const servicePrincipals: { [service: string]: string | undefined } = {};
    AWS_SERVICES.forEach(service => servicePrincipals[service] = region.servicePrincipal(service));

    snapshot[name] = {
      cdkMetadataResourceAvailable: region.cdkMetadataResourceAvailable,
      domainSuffix: region.domainSuffix,
      partition: region.partition,
      s3StaticWebsiteEndpoint: region.s3StaticWebsiteEndpoint,
      vpcEndPointServiceNamePrefix: region.vpcEndpointServiceNamePrefix,
      servicePrincipals,
    };
  }
  expect(snapshot).toMatchSnapshot();
});

test('built-in data features known regions', () => {
  const regions = RegionInfo.regions;

  for (const expected of AWS_REGIONS) {
    expect(regions.map(region => region.name)).toContain(expected);
  }
});
