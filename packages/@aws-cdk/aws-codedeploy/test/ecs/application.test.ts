import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

describe('CodeDeploy ECS Application', () => {
  test('can be created', () => {
    const stack = new cdk.Stack();
    new codedeploy.EcsApplication(stack, 'MyApp');

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::Application', {
      ComputePlatform: 'ECS',
    });
  });

  test('can be created with explicit name', () => {
    const stack = new cdk.Stack();
    new codedeploy.EcsApplication(stack, 'MyApp', {
      applicationName: 'my-name',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::Application', {
      ApplicationName: 'my-name',
      ComputePlatform: 'ECS',
    });
  });
});
