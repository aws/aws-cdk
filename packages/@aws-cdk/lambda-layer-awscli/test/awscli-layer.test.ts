import { env } from 'process';
import { Annotations, Match, Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { AwsCliLayer } from '../lib';

describe('create a layer version', () => {

  beforeEach(() => {
    env.CDK_DEBUG = 'true';
  });

  afterEach(() => {
    jest.resetAllMocks();
    env.CDK_DEBUG = 'false';
  });

  test('using already installed package', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AwsCliLayer(stack, 'MyLayer');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('.*'));
    Annotations.fromStack(stack).hasInfo('*', Match.stringLikeRegexp('Successfully loaded @aws-cdk/asset-awscli-v1 from pre-installed packages.'));
  });

  test('downloading and installing package', () => {
    // GIVEN
    // Makes AwsCliLayer._tryLoadPackage return undefined
    jest.spyOn(AwsCliLayer, '_tryLoadPackage').mockReturnValue(undefined);

    const stack = new Stack();

    // WHEN
    new AwsCliLayer(stack, 'MyLayer');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('.*'));
    Annotations.fromStack(stack).hasInfo('*', Match.stringLikeRegexp('Installing from: .*/.cdk/npm-cache/'));
  });

  test('using the fallback', () => {
    // GIVEN
    // Makes AwsCliLayer._tryLoadPackage and AwsCliLayer._downloadPackge return undefined
    jest.spyOn(AwsCliLayer, '_tryLoadPackage').mockReturnValue(undefined);
    jest.spyOn(AwsCliLayer, '_downloadPackage').mockReturnValue(undefined);

    const stack = new Stack();

    // WHEN
    const layer = new AwsCliLayer(stack, 'MyLayer');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
    Annotations.fromStack(stack).hasInfo('*', Match.stringLikeRegexp('Unable to load @aws-cdk/asset-awscli-v1. Falling back to use layer.zip bundled with aws-cdk-lib'));
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('WARNING! ACTION REQUIRED!'));
    expect(layer.node.tryFindChild('cli-notice')).toBeDefined();
  });
});