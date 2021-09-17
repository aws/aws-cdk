import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

/* eslint-disable quote-props */

describe('CodeDeploy DeploymentConfig', () => {
  test('can be created by specifying only minHealthyHostCount', () => {
    const stack = new cdk.Stack();

    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
    });

    expect(stack).toHaveResource('AWS::CodeDeploy::DeploymentConfig', {
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

    expect(stack).toHaveResource('AWS::CodeDeploy::DeploymentConfig', {
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
});
