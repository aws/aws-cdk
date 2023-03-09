import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

/* eslint-disable quote-props */

describe('CodeDeploy DeploymentConfig', () => {
  test('can be created by specifying only minHealthyHostCount', () => {
    const stack = new cdk.Stack();

    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'MinimumHealthyHosts': {
        'Type': 'HOST_COUNT',
        'Value': 1,
      },
    });
  });

  test('can be created by specifying only minHealthyHostPercentage', () => {
    const stack = new cdk.Stack();

    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'MinimumHealthyHosts': {
        'Type': 'FLEET_PERCENT',
        'Value': 75,
      },
    });
  });

  test('can be imported', () => {
    const stack = new cdk.Stack();

    const deploymentConfig = codedeploy.ServerDeploymentConfig.fromServerDeploymentConfigName(stack, 'MyDC', 'MyDC');

    expect(deploymentConfig).not.toEqual(undefined);
  });

  test('fail with more than 100 characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
      deploymentConfigName: 'a'.repeat(101),
    });

    expect(() => app.synth()).toThrow(`Deployment config name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
  });

  test('fail with unallowed characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
      deploymentConfigName: 'my name',
    });

    expect(() => app.synth()).toThrow('Deployment config name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
  });
});
