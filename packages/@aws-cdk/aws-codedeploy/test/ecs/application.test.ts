import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

describe('CodeDeploy ECS Application', () => {
  test('can be created', () => {
    const stack = new cdk.Stack();
    new codedeploy.EcsApplication(stack, 'MyApp');

    expect(stack).toHaveResource('AWS::CodeDeploy::Application', {
      ComputePlatform: 'ECS',
    });
  });

  test('can be created with explicit name', () => {
    const stack = new cdk.Stack();
    new codedeploy.EcsApplication(stack, 'MyApp', {
      applicationName: 'my-name',
    });

    expect(stack).toHaveResource('AWS::CodeDeploy::Application', {
      ApplicationName: 'my-name',
      ComputePlatform: 'ECS',
    });
  });
});
