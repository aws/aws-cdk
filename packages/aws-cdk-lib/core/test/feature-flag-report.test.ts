import { FeatureFlagReportProperties } from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '../../cx-api';
import { App } from '../lib';
import { generateFeatureFlagReport } from '../lib/private/feature-flag-report';

jest.mock('../../cx-api', () => {
  const actual = jest.requireActual('../../cx-api');
  return {
    ...actual,
    CloudAssemblyBuilder: jest.fn().mockImplementation(() => ({
      addArtifact: jest.fn(),
    })),
  };
});

describe('generate feature flag report', () => {
  test('populates the correct userValue based on the context', () => {
    const app = new App({
      context: {
        '@aws-cdk/aws-ec2:bastionHostUseAmazonLinux2023ByDefault': true,
        '@aws-cdk/core:aspectStabilization': false,
      },
    });
    const builder = new cxapi.CloudAssemblyBuilder('/tmp/test');
    const spy = jest.spyOn(builder, 'addArtifact');

    generateFeatureFlagReport(builder, app);

    expect(spy).toHaveBeenCalledTimes(1);

    const [artifactId, artifact] = spy.mock.calls[0];

    expect(artifact).toBeDefined();
    expect(artifact?.properties).toBeDefined();

    const props = artifact.properties as FeatureFlagReportProperties;
    const flags = props.flags;
    expect(flags).toBeDefined();

    expect(flags?.['@aws-cdk/aws-ec2:bastionHostUseAmazonLinux2023ByDefault']?.userValue).toEqual(true);
    expect(flags?.['@aws-cdk/core:aspectStabilization']?.userValue).toEqual(false);
  });
  test('successfully creates an artifact stored in the CloudAssembly', () => {
    const app = new App({
      context: {
        '@aws-cdk/aws-s3:grantWriteWithoutAcl': true,
      },
    });
    const builder = new cxapi.CloudAssemblyBuilder('/tmp/test');
    const spy = jest.spyOn(builder, 'addArtifact');

    generateFeatureFlagReport(builder, app);

    expect(spy).toHaveBeenCalledTimes(1);

    const [artifactId, artifact] = spy.mock.calls[0];

    expect(artifactId).toEqual('feature flag report');
    expect(artifact).toMatchObject({
      type: 'cdk:feature-flag-report',
      properties: {
        module: '@aws-cdk/core',
      },
    });

    const flags = (artifact.properties as FeatureFlagReportProperties).flags;
    expect(flags).toBeDefined();
    expect(flags['@aws-cdk/aws-s3:grantWriteWithoutAcl']).toBeDefined();
    expect(flags['@aws-cdk/aws-s3:grantWriteWithoutAcl'].userValue).toBe(true);
  });

  test('defaults userValue to false when not set in context', () => {
    const app = new App();
    const builder = new cxapi.CloudAssemblyBuilder('/tmp/test');
    const spy = jest.spyOn(builder, 'addArtifact');

    generateFeatureFlagReport(builder, app);

    const flags = (spy.mock.calls[0][1].properties as FeatureFlagReportProperties).flags;
    expect(flags['@aws-cdk/aws-ec2:bastionHostUseAmazonLinux2023ByDefault'].userValue).toBe(false);
  });
});

