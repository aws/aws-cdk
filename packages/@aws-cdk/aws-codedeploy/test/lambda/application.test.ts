import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

describe('CodeDeploy Lambda Application', () => {
  test('can be created', () => {
    const stack = new cdk.Stack();
    new codedeploy.LambdaApplication(stack, 'MyApp');
    expect(stack).toHaveResource('AWS::CodeDeploy::Application', {
      ComputePlatform: 'Lambda',
    });
  });

  test('can be created with explicit name', () => {
    const stack = new cdk.Stack();
    new codedeploy.LambdaApplication(stack, 'MyApp', {
      applicationName: 'my-name',
    });
    expect(stack).toHaveResource('AWS::CodeDeploy::Application', {
      ApplicationName: 'my-name',
      ComputePlatform: 'Lambda',
    });
  });
});
