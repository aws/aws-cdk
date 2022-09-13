import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

/* eslint-disable quote-props */

let stack: cdk.Stack;

beforeEach(() => {
  stack = new cdk.Stack();
});

test('can create default config', () => {
  // WHEN
  new codedeploy.LambdaDeploymentConfig(stack, 'MyConfig');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
    'ComputePlatform': 'Lambda',
    'TrafficRoutingConfig': {
      'Type': 'AllAtOnce',
    },
  });
});

test('can create all-at-once config', () => {
  // WHEN
  new codedeploy.LambdaDeploymentConfig(stack, 'MyConfig', {
    trafficRoutingConfig: new codedeploy.AllAtOnceTrafficRoutingConfig(),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
    'ComputePlatform': 'Lambda',
    'TrafficRoutingConfig': {
      'Type': 'AllAtOnce',
    },
  });
});

test('can create linear config', () => {
  // WHEN
  new codedeploy.LambdaDeploymentConfig(stack, 'MyConfig', {
    trafficRoutingConfig: new codedeploy.TimeBasedLinearTrafficRoutingConfig({
      interval: cdk.Duration.minutes(1),
      percentage: 5,
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
    'ComputePlatform': 'Lambda',
    'TrafficRoutingConfig': {
      'TimeBasedLinear': {
        'LinearInterval': 1,
        'LinearPercentage': 5,
      },
      'Type': 'TimeBasedLinear',
    },
  });
});

test('can create canary config', () => {
  // WHEN
  new codedeploy.LambdaDeploymentConfig(stack, 'MyConfig', {
    trafficRoutingConfig: new codedeploy.TimeBasedCanaryTrafficRoutingConfig({
      interval: cdk.Duration.minutes(1),
      percentage: 5,
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
    'ComputePlatform': 'Lambda',
    'TrafficRoutingConfig': {
      'TimeBasedCanary': {
        'CanaryInterval': 1,
        'CanaryPercentage': 5,
      },
      'Type': 'TimeBasedCanary',
    },
  });
});

test('can create a config with a specific name', () => {
  // WHEN
  new codedeploy.LambdaDeploymentConfig(stack, 'MyConfig', {
    deploymentConfigName: 'MyCanaryConfig',
    trafficRoutingConfig: new codedeploy.TimeBasedCanaryTrafficRoutingConfig({
      interval: cdk.Duration.minutes(1),
      percentage: 5,
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
    'ComputePlatform': 'Lambda',
    'DeploymentConfigName': 'MyCanaryConfig',
    'TrafficRoutingConfig': {
      'TimeBasedCanary': {
        'CanaryInterval': 1,
        'CanaryPercentage': 5,
      },
      'Type': 'TimeBasedCanary',
    },
  });
});

test('can be imported', () => {
  const deploymentConfig = codedeploy.LambdaDeploymentConfig.fromLambdaDeploymentConfigName(stack, 'MyDC', 'MyDC');

  expect(deploymentConfig).not.toEqual(undefined);
});

test('fail with more than 100 characters in name', () => {
  const app = new cdk.App();
  const stackWithApp = new cdk.Stack(app);
  new codedeploy.LambdaDeploymentConfig(stackWithApp, 'MyConfig', {
    trafficRoutingConfig: new codedeploy.TimeBasedCanaryTrafficRoutingConfig({
      interval: cdk.Duration.minutes(1),
      percentage: 5,
    }),
    deploymentConfigName: 'a'.repeat(101),
  });

  expect(() => app.synth()).toThrow(`Deployment config name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
});

test('fail with unallowed characters in name', () => {
  const app = new cdk.App();
  const stackWithApp = new cdk.Stack(app);
  new codedeploy.LambdaDeploymentConfig(stackWithApp, 'MyConfig', {
    trafficRoutingConfig: new codedeploy.TimeBasedCanaryTrafficRoutingConfig({
      interval: cdk.Duration.minutes(1),
      percentage: 5,
    }),
    deploymentConfigName: 'my name',
  });

  expect(() => app.synth()).toThrow('Deployment config name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
});
