import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

describe('CodeDeploy Lambda Application', () => {
  test('can be created', () => {
    const stack = new cdk.Stack();
    new codedeploy.LambdaApplication(stack, 'MyApp');
    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::Application', {
      ComputePlatform: 'Lambda',
    });
  });

  test('can be created with explicit name', () => {
    const stack = new cdk.Stack();
    new codedeploy.LambdaApplication(stack, 'MyApp', {
      applicationName: 'my-name',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::Application', {
      ApplicationName: 'my-name',
      ComputePlatform: 'Lambda',
    });
  });
});
