import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { AwsCliLayer } from '../lib';

describe('create a layer version', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('using already installed package', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AwsCliLayer(stack, 'MyLayer', { quiet: false });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
  });

  test('downloading and installing package', () => {
    // GIVEN
    // Makes AwsCliLayer._tryLoadPackage return undefined
    jest.spyOn(AwsCliLayer, '_tryLoadPackage').mockReturnValue(undefined);

    const stack = new Stack();

    // WHEN
    new AwsCliLayer(stack, 'MyLayer', { quiet: false });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
  });

  test('using the fallback', () => {
    // GIVEN
    // Makes AwsCliLayer._tryLoadPackage and AwsCliLayer._downloadPackge return undefined
    jest.spyOn(AwsCliLayer, '_tryLoadPackage').mockReturnValue(undefined);
    jest.spyOn(AwsCliLayer, '_downloadPackage').mockReturnValue(undefined);

    const stack = new Stack();

    // WHEN
    new AwsCliLayer(stack, 'MyLayer', { quiet: false });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
  });
});