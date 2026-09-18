import { APPCONFIG_LAMBDA_LAYER_ARNS, CLOUDWATCH_LAMBDA_INSIGHTS_ARNS } from '../build-tools/fact-tables';
import { FactName, RegionInfo } from '../lib';
import { AWS_REGIONS } from '../lib/aws-entities';

test('built-in data is correct', () => {
  const snapshot: any = {};
  for (const name of AWS_REGIONS) {
    const region = RegionInfo.get(name);

    const lambdaInsightsVersions: { [service: string]: string | undefined } = {};
    const lambdaInsightsArmVersions: { [service: string]: string | undefined } = {};
    const appConfigLayerVersions: { [service: string]: string | undefined } = {};
    const appConfigLayerArmVersions: { [service: string]: string | undefined } = {};

    for (const version in CLOUDWATCH_LAMBDA_INSIGHTS_ARNS) {
      lambdaInsightsVersions[version] = region.cloudwatchLambdaInsightsArn(version);

      if ('arm64' in CLOUDWATCH_LAMBDA_INSIGHTS_ARNS[version]) {
        lambdaInsightsArmVersions[version] = region.cloudwatchLambdaInsightsArn(version, 'arm64');
      }
    }

    for (const version in APPCONFIG_LAMBDA_LAYER_ARNS) {
      appConfigLayerVersions[version] = region.appConfigLambdaArn(version);

      if ('arm64' in APPCONFIG_LAMBDA_LAYER_ARNS[version]) {
        appConfigLayerArmVersions[version] = region.appConfigLambdaArn(version, 'arm64');
      }
    }

    snapshot[name] = {
      domainSuffix: region.domainSuffix,
      partition: region.partition,
      s3StaticWebsiteEndpoint: region.s3StaticWebsiteEndpoint,
      vpcEndPointServiceNamePrefix: region.vpcEndpointServiceNamePrefix,
      lambdaInsightsVersions,
      lambdaInsightsArmVersions,
      appConfigLayerVersions,
      appConfigLayerArmVersions,
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

test.each([
  // Two regions added in #35371 took the hosted zone ID of the row above them. Pinned
  // here alongside the regions they were copied from, so the pairs cannot silently
  // collide again. Values from
  // https://docs.aws.amazon.com/general/latest/gr/elasticbeanstalk.html
  ['ap-southeast-7', 'Z08384933QM5LSQCVMNZM'],
  ['ap-northeast-1', 'Z1R25G3KIG2GBW'],
  ['eu-south-2', 'Z0243492AO4B9S3KI68O'],
  ['eu-north-1', 'Z23GO28BZ5AETM'],
])('%p has its own Elastic Beanstalk hosted zone ID: %p', (region, expected) => {
  expect(RegionInfo.get(region).ebsEnvEndpointHostedZoneId).toEqual(expected);
});
