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

  test('fail with more than 100 characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.LambdaApplication(stack, 'MyApp', {
      applicationName: 'a'.repeat(101),
    });

    expect(() => app.synth()).toThrow(`Application name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
  });

  test('fail with unallowed characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.LambdaApplication(stack, 'MyApp', {
      applicationName: 'my name',
    });

    expect(() => app.synth()).toThrow('Application name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
  });
});
