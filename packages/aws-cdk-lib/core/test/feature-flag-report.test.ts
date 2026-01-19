import { FeatureFlagReportProperties } from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '../../cx-api';
import { App } from '../lib';
import { generateFeatureFlagReport } from '../lib/private/feature-flag-report';

describe('generate feature flag report', () => {
  test('feature flag report can be retrieved from CloudAssembly using its artifact ID', () => {
    const app = new App();
    const assembly = app.synth();
    expect(assembly.manifest.artifacts?.['aws-cdk-lib/feature-flag-report']).toBeDefined();
  });
  test('report contains context values that represent the feature flags', () => {
    const app = new App({
      context: {
        '@aws-cdk/aws-ec2:bastionHostUseAmazonLinux2023ByDefault': true,
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    const assembly = app.synth();
    const report = assembly.manifest.artifacts?.['aws-cdk-lib/feature-flag-report'];
    expect(report).toEqual(expect.objectContaining({
      type: 'cdk:feature-flag-report',
      properties: expect.objectContaining({
        module: 'aws-cdk-lib',
        flags: expect.objectContaining({
          '@aws-cdk/aws-ec2:bastionHostUseAmazonLinux2023ByDefault': expect.objectContaining({
            userValue: true,
            recommendedValue: true,
          }),
          '@aws-cdk/core:newStyleStackSynthesis': expect.objectContaining({
            userValue: false,
            recommendedValue: true,
            unconfiguredBehavesLike: {
              v2: true,
            },
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
  test('expired flags are not included in report', () => {
    const app = new App();
    const builder = new cxapi.CloudAssemblyBuilder('/tmp/test');
    const spy = jest.spyOn(builder, 'addArtifact');

    generateFeatureFlagReport(builder, app);

    const flags = (spy.mock.calls[0][1].properties as FeatureFlagReportProperties).flags;
    // For example
    expect(Object.keys(flags)).not.toContain('aws-cdk:enableDiffNoFail');
  });
});
