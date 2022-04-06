import { Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

function mockFunction(stack: cdk.Stack, id: string) {
  return new lambda.Function(stack, id, {
    code: lambda.Code.fromInline('mock'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_10_X,
  });
}
function mockAlias(stack: cdk.Stack) {
  return new lambda.Alias(stack, 'Alias', {
    aliasName: 'my-alias',
    version: new lambda.Version(stack, 'Version', {
      lambda: mockFunction(stack, 'Function'),
    }),
  });
}

let stack: cdk.Stack;
let application: codedeploy.LambdaApplication;
let alias: lambda.Alias;

beforeEach(() => {
  stack = new cdk.Stack();
  application = new codedeploy.LambdaApplication(stack, 'MyApp');
  alias = mockAlias(stack);
});


test('custom resource created', () => {
  // WHEN
  const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
    type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
    interval: cdk.Duration.minutes(1),
    percentage: 5,
  });
  new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
    application,
    alias,
    deploymentConfig: config,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
    ServiceToken: {
      'Fn::GetAtt': [
        'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
        'Arn',
      ],
    },
    Create: '{"service":"CodeDeploy","action":"createDeploymentConfig","parameters":{"deploymentConfigName":"CustomConfig.LambdaCanary5Percent1Minutes","computePlatform":"Lambda","trafficRoutingConfig":{"type":"TimeBasedCanary","timeBasedCanary":{"canaryInterval":"1","canaryPercentage":"5"}}},"physicalResourceId":{"id":"CustomConfig.LambdaCanary5Percent1Minutes"}}',
    Update: '{"service":"CodeDeploy","action":"createDeploymentConfig","parameters":{"deploymentConfigName":"CustomConfig.LambdaCanary5Percent1Minutes","computePlatform":"Lambda","trafficRoutingConfig":{"type":"TimeBasedCanary","timeBasedCanary":{"canaryInterval":"1","canaryPercentage":"5"}}},"physicalResourceId":{"id":"CustomConfig.LambdaCanary5Percent1Minutes"}}',
    Delete: '{"service":"CodeDeploy","action":"deleteDeploymentConfig","parameters":{"deploymentConfigName":"CustomConfig.LambdaCanary5Percent1Minutes"}}',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'codedeploy:CreateDeploymentConfig',
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'codedeploy:DeleteDeploymentConfig',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('custom resource created with specific name', () => {
  // WHEN
  const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
    type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
    interval: cdk.Duration.minutes(1),
    percentage: 5,
    deploymentConfigName: 'MyDeploymentConfig',
  });
  new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
    application,
    alias,
    deploymentConfig: config,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
    Create: '{"service":"CodeDeploy","action":"createDeploymentConfig","parameters":{"deploymentConfigName":"MyDeploymentConfig","computePlatform":"Lambda","trafficRoutingConfig":{"type":"TimeBasedCanary","timeBasedCanary":{"canaryInterval":"1","canaryPercentage":"5"}}},"physicalResourceId":{"id":"MyDeploymentConfig"}}',
    Update: '{"service":"CodeDeploy","action":"createDeploymentConfig","parameters":{"deploymentConfigName":"MyDeploymentConfig","computePlatform":"Lambda","trafficRoutingConfig":{"type":"TimeBasedCanary","timeBasedCanary":{"canaryInterval":"1","canaryPercentage":"5"}}},"physicalResourceId":{"id":"MyDeploymentConfig"}}',
    Delete: '{"service":"CodeDeploy","action":"deleteDeploymentConfig","parameters":{"deploymentConfigName":"MyDeploymentConfig"}}',
  });
});

test('fail with more than 100 characters in name', () => {
  const app = new cdk.App();
  const stackWithApp = new cdk.Stack(app);
  new codedeploy.CustomLambdaDeploymentConfig(stackWithApp, 'CustomConfig', {
    type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
    interval: cdk.Duration.minutes(1),
    percentage: 5,
    deploymentConfigName: 'a'.repeat(101),
  });

  expect(() => app.synth()).toThrow(`Deployment config name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
});

test('fail with unallowed characters in name', () => {
  const app = new cdk.App();
  const stackWithApp = new cdk.Stack(app);
  new codedeploy.CustomLambdaDeploymentConfig(stackWithApp, 'CustomConfig', {
    type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
    interval: cdk.Duration.minutes(1),
    percentage: 5,
    deploymentConfigName: 'my name',
  });

  expect(() => app.synth()).toThrow('Deployment config name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
});

test('can create linear custom config', () => {
  // WHEN
  const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
    type: codedeploy.CustomLambdaDeploymentConfigType.LINEAR,
    interval: cdk.Duration.minutes(1),
    percentage: 5,
  });
  new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
    application,
    alias,
    deploymentConfig: config,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
    DeploymentConfigName: 'CustomConfig.LambdaLinear5PercentEvery1Minutes',
  });
});

test('can create canary custom config', () => {
  // WHEN
  const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
    type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
    interval: cdk.Duration.minutes(1),
    percentage: 5,
  });
  new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
    application,
    alias,
    deploymentConfig: config,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
    DeploymentConfigName: 'CustomConfig.LambdaCanary5Percent1Minutes',
  });
});

test('dependency on the config exists to ensure ordering', () => {
  // WHEN
  const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
    type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
    interval: cdk.Duration.minutes(1),
    percentage: 5,
  });
  new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
    application,
    alias,
    deploymentConfig: config,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::CodeDeploy::DeploymentGroup', {
    Properties: {
      DeploymentConfigName: 'CustomConfig.LambdaCanary5Percent1Minutes',
    },
    DependsOn: [
      'CustomConfigDeploymentConfigCustomResourcePolicy0426B684',
      'CustomConfigDeploymentConfigE9E1F384',
    ],
  });
});
