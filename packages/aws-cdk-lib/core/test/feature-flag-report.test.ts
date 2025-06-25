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
      buildAssembly: jest.fn().mockReturnValue({
        tryGetArtifact: jest.fn().mockReturnValue('aws-cdk-lib/feature-flag-report'),
      }),
    })),
  };
});

describe('generate feature flag report', () => {
  test('feature flag report can be retrieved from CloudAssembly using its artifact ID', () => {
    const app = new App();
    const builder = new cxapi.CloudAssemblyBuilder('/tmp/test');

    generateFeatureFlagReport(builder, app);

    const cloudAssembly = builder.buildAssembly();
    expect(cloudAssembly.tryGetArtifact('aws-cdk-lib/feature-flag-report')).toEqual('aws-cdk-lib/feature-flag-report');
  });
  test('report contains context values that represent the feature flags', () => {
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

    expect(artifact).toEqual(expect.objectContaining({
      type: 'cdk:feature-flag-report',
      properties: expect.objectContaining({
        module: 'aws-cdk-lib',
        flags: expect.objectContaining({
          '@aws-cdk/aws-ec2:bastionHostUseAmazonLinux2023ByDefault': expect.objectContaining({
            userValue: true,
          }),
          '@aws-cdk/core:aspectStabilization': expect.objectContaining({
            userValue: false,
          }),
        }),
      }),
    }));
  });
  test('defaults userValue to undefined when not set in context', () => {
    const app = new App();
    const builder = new cxapi.CloudAssemblyBuilder('/tmp/test');
    const spy = jest.spyOn(builder, 'addArtifact');

    generateFeatureFlagReport(builder, app);

    const flags = (spy.mock.calls[0][1].properties as FeatureFlagReportProperties).flags;
    expect(flags).toEqual(expect.objectContaining({
      '@aws-cdk/aws-ec2:bastionHostUseAmazonLinux2023ByDefault': expect.objectContaining({
        userValue: undefined,
      }),
    }));
  });
});

