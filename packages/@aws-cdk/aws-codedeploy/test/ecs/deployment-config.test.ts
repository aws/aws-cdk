import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';
import { AllAtOnceTrafficRoutingConfig, TimeBasedCanaryTrafficRoutingConfig, TimeBasedLinearTrafficRoutingConfig } from '../../lib';

/* eslint-disable quote-props */

describe('CodeDeploy DeploymentConfig', () => {
  test('can be created without props', () => {
    const stack = new cdk.Stack();

    new codedeploy.EcsDeploymentConfig(stack, 'DeploymentConfig', {});

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'ComputePlatform': 'ECS',
    });
  });

  test('can be created with a name', () => {
    const stack = new cdk.Stack();

    new codedeploy.EcsDeploymentConfig(stack, 'DeploymentConfig', {
      deploymentConfigName: 'AAA',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'ComputePlatform': 'ECS',
      'DeploymentConfigName': 'AAA',
    });
  });

  test('can be created by specifying AllAtOnce', () => {
    const stack = new cdk.Stack();

    new codedeploy.EcsDeploymentConfig(stack, 'DeploymentConfig', {
      trafficRoutingConfig: new AllAtOnceTrafficRoutingConfig(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'ComputePlatform': 'ECS',
      'TrafficRoutingConfig': {
        'Type': 'AllAtOnce',
      },
    });
  });

  test('can be created by specifying TimeBasedCanary', () => {
    const stack = new cdk.Stack();

    new codedeploy.EcsDeploymentConfig(stack, 'DeploymentConfig', {
      trafficRoutingConfig: new TimeBasedCanaryTrafficRoutingConfig(2, 20),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'ComputePlatform': 'ECS',
      'TrafficRoutingConfig': {
        'Type': 'TimeBasedCanary',
        'TimeBasedCanary': {
          'CanaryInterval': 2,
          'CanaryPercentage': 20,
        },
      },
    });
  });

  test('can be created by specifying TimeBasedLinear', () => {
    const stack = new cdk.Stack();

    new codedeploy.EcsDeploymentConfig(stack, 'DeploymentConfig', {
      trafficRoutingConfig: new TimeBasedLinearTrafficRoutingConfig(2, 20),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'ComputePlatform': 'ECS',
      'TrafficRoutingConfig': {
        'Type': 'TimeBasedLinear',
        'TimeBasedLinear': {
          'LinearInterval': 2,
          'LinearPercentage': 20,
        },
      },
    });
  });

  test('can be imported', () => {
    const stack = new cdk.Stack();

    const deploymentConfig = codedeploy.EcsDeploymentConfig.fromEcsDeploymentConfigName(stack, 'MyDC', 'MyDC');

    expect(deploymentConfig).not.toEqual(undefined);
  });

  test('fail with more than 100 characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.EcsDeploymentConfig(stack, 'DeploymentConfig', {
      deploymentConfigName: 'a'.repeat(101),
    });

    expect(() => app.synth()).toThrow(`Deployment config name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
  });

  test('fail with unallowed characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.EcsDeploymentConfig(stack, 'DeploymentConfig', {
      deploymentConfigName: 'my name',
    });

    expect(() => app.synth()).toThrow('Deployment config name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
  });
});
