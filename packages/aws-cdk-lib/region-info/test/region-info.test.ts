import { CLOUDWATCH_LAMBDA_INSIGHTS_ARNS } from '../build-tools/fact-tables';
import { FactName, RegionInfo } from '../lib';
import { AWS_REGIONS, AWS_SERVICES } from '../lib/aws-entities';

test('built-in data is correct', () => {
  const snapshot: any = {};
  for (const name of AWS_REGIONS) {
    const region = RegionInfo.get(name);

    const servicePrincipals: { [service: string]: string | undefined } = {};
    const lambdaInsightsVersions: { [service: string]: string | undefined } = {};
    const lambdaInsightsArmVersions: { [service: string]: string | undefined } = {};

    AWS_SERVICES.forEach(service => servicePrincipals[service] = region.servicePrincipal(service));

    for (const version in CLOUDWATCH_LAMBDA_INSIGHTS_ARNS) {
      lambdaInsightsVersions[version] = region.cloudwatchLambdaInsightsArn(version);

      if ('arm64' in CLOUDWATCH_LAMBDA_INSIGHTS_ARNS[version]) {
        lambdaInsightsArmVersions[version] = region.cloudwatchLambdaInsightsArn(version, 'arm64');
      }
    };

    snapshot[name] = {
      cdkMetadataResourceAvailable: region.cdkMetadataResourceAvailable,
      domainSuffix: region.domainSuffix,
      partition: region.partition,
      s3StaticWebsiteEndpoint: region.s3StaticWebsiteEndpoint,
      vpcEndPointServiceNamePrefix: region.vpcEndpointServiceNamePrefix,
      servicePrincipals,
      lambdaInsightsVersions,
      lambdaInsightsArmVersions,
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

test('limitedRegionMap only returns information for certain regions', () => {

  const map = RegionInfo.limitedRegionMap(FactName.ELBV2_ACCOUNT, ['aws']);
  expect(map['us-east-1']).toBeDefined();
  expect(map['cn-north-1']).not.toBeDefined();

  const map2 = RegionInfo.limitedRegionMap(FactName.ELBV2_ACCOUNT, ['aws-cn']);
  expect(map2['us-east-1']).not.toBeDefined();
  expect(map2['cn-north-1']).toBeDefined();
});


test.each([
  ['us-east-1', false],
  ['me-south-1', true],
  ['us-iso-west-1', false],
])('%p should be opt-in: %p', (region, expected) => {
  expect(RegionInfo.get(region).isOptInRegion).toEqual(expected);
});