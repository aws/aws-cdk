import { Template } from '../../assertions';
import * as cdk from '../../core';
import { DeploymentStrategy, DeploymentStrategyId, RolloutStrategy } from '../lib';

describe('deployment strategy', () => {
  test('default deployment strategy', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      rolloutStrategy: RolloutStrategy.linear({
        growthFactor: 10,
        deploymentDuration: cdk.Duration.minutes(10),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MyDeploymentStrategy',
      DeploymentDurationInMinutes: 10,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      GrowthType: 'LINEAR',
    });
  });

  test('deployment strategy with name', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      deploymentStrategyName: 'TestDeploymentStrategy',
      rolloutStrategy: RolloutStrategy.linear({
        growthFactor: 10,
        deploymentDuration: cdk.Duration.minutes(10),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'TestDeploymentStrategy',
      DeploymentDurationInMinutes: 10,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      GrowthType: 'LINEAR',
    });
  });

  test('deployment strategy duration in seconds', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      deploymentStrategyName: 'TestDeploymentStrategy',
      rolloutStrategy: RolloutStrategy.linear({
        growthFactor: 10,
        deploymentDuration: cdk.Duration.seconds(120),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'TestDeploymentStrategy',
      DeploymentDurationInMinutes: 2,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      GrowthType: 'LINEAR',
    });
  });

  test('deployment strategy with description', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      deploymentStrategyName: 'TestDeploymentStrategy',
      rolloutStrategy: RolloutStrategy.linear({
        growthFactor: 10,
        deploymentDuration: cdk.Duration.minutes(10),
      }),
      description: 'This is my description',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'TestDeploymentStrategy',
      DeploymentDurationInMinutes: 10,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      Description: 'This is my description',
      GrowthType: 'LINEAR',
    });
  });

  test('deployment strategy with final bake time', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      deploymentStrategyName: 'TestDeploymentStrategy',
      rolloutStrategy: RolloutStrategy.linear({
        growthFactor: 10,
        deploymentDuration: cdk.Duration.minutes(10),
        finalBakeTime: cdk.Duration.minutes(30),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'TestDeploymentStrategy',
      DeploymentDurationInMinutes: 10,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      FinalBakeTimeInMinutes: 30,
      GrowthType: 'LINEAR',
    });
  });

  test('deployment strategy with growth type', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      deploymentStrategyName: 'TestDeploymentStrategy',
      rolloutStrategy: RolloutStrategy.exponential({
        growthFactor: 10,
        deploymentDuration: cdk.Duration.minutes(10),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'TestDeploymentStrategy',
      DeploymentDurationInMinutes: 10,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      GrowthType: 'EXPONENTIAL',
    });
  });

  test('deployment strategy with replicate to', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      deploymentStrategyName: 'TestDeploymentStrategy',
      rolloutStrategy: RolloutStrategy.linear({
        growthFactor: 10,
        deploymentDuration: cdk.Duration.minutes(10),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'TestDeploymentStrategy',
      DeploymentDurationInMinutes: 10,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      GrowthType: 'LINEAR',
    });
  });

  test('from deployment strategy arn', () => {
    const stack = new cdk.Stack();
    const deploymentStrategy = DeploymentStrategy.fromDeploymentStrategyArn(stack, 'MyDeploymentStrategy',
      'arn:aws:appconfig:us-west-2:123456789012:deploymentstrategy/abc123');

    expect(deploymentStrategy.deploymentStrategyId).toEqual('abc123');
    expect(deploymentStrategy.env.account).toEqual('123456789012');
    expect(deploymentStrategy.env.region).toEqual('us-west-2');
  });

  test('from deployment strategy arn with no resource name', () => {
    const stack = new cdk.Stack();
    expect(() => {
      DeploymentStrategy.fromDeploymentStrategyArn(stack, 'MyDeploymentStrategy',
        'arn:aws:appconfig:us-west-2:123456789012:deploymentstrategy/');
    }).toThrow('Missing required deployment strategy id from deployment strategy ARN');
  });

  test('from deployment strategy id', () => {
    const cdkApp = new cdk.App();
    const stack = new cdk.Stack(cdkApp, 'Stack', {
      env: {
        region: 'us-west-2',
        account: '123456789012',
      },
    });
    const deploymentStrategy = DeploymentStrategy.fromDeploymentStrategyId(stack, 'MyDeploymentStrategy', DeploymentStrategyId.fromString('abc123'));

    expect(deploymentStrategy.deploymentStrategyId).toEqual('abc123');
    expect(deploymentStrategy.env.account).toEqual('123456789012');
    expect(deploymentStrategy.env.region).toEqual('us-west-2');
  });

  test('from predefined all at once deployment strategy id', () => {
    const cdkApp = new cdk.App();
    const stack = new cdk.Stack(cdkApp, 'Stack', {
      env: {
        region: 'us-west-2',
        account: '123456789012',
      },
    });
    const deploymentStrategy = DeploymentStrategy.fromDeploymentStrategyId(stack, 'MyDeploymentStrategy', DeploymentStrategyId.ALL_AT_ONCE);

    expect(deploymentStrategy.deploymentStrategyId).toEqual('AppConfig.AllAtOnce');
    expect(deploymentStrategy.env.account).toEqual('123456789012');
    expect(deploymentStrategy.env.region).toEqual('us-west-2');
  });

  test('from predefined canary deployment strategy id', () => {
    const cdkApp = new cdk.App();
    const stack = new cdk.Stack(cdkApp, 'Stack', {
      env: {
        region: 'us-west-2',
        account: '123456789012',
      },
    });
    const deploymentStrategy = DeploymentStrategy.fromDeploymentStrategyId(stack, 'MyDeploymentStrategy', DeploymentStrategyId.CANARY_10_PERCENT_20_MINUTES);

    expect(deploymentStrategy.deploymentStrategyId).toEqual('AppConfig.Canary10Percent20Minutes');
    expect(deploymentStrategy.env.account).toEqual('123456789012');
    expect(deploymentStrategy.env.region).toEqual('us-west-2');
  });

  test('from predefined linear deployment strategy id', () => {
    const cdkApp = new cdk.App();
    const stack = new cdk.Stack(cdkApp, 'Stack', {
      env: {
        region: 'us-west-2',
        account: '123456789012',
      },
    });
    const deploymentStrategy = DeploymentStrategy.fromDeploymentStrategyId(stack, 'MyDeploymentStrategy', DeploymentStrategyId.LINEAR_50_PERCENT_EVERY_30_SECONDS);

    expect(deploymentStrategy.deploymentStrategyId).toEqual('AppConfig.Linear50PercentEvery30Seconds');
    expect(deploymentStrategy.env.account).toEqual('123456789012');
    expect(deploymentStrategy.env.region).toEqual('us-west-2');
  });

  test('all at once deployment strategy with no bake time', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      rolloutStrategy: RolloutStrategy.ALL_AT_ONCE,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MyDeploymentStrategy',
      DeploymentDurationInMinutes: 0,
      GrowthFactor: 100,
      FinalBakeTimeInMinutes: 10,
      ReplicateTo: 'NONE',
      GrowthType: 'LINEAR',
    });
  });

  test('all at once deployment strategy with bake time', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      rolloutStrategy: RolloutStrategy.ALL_AT_ONCE,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MyDeploymentStrategy',
      DeploymentDurationInMinutes: 0,
      GrowthFactor: 100,
      FinalBakeTimeInMinutes: 10,
      ReplicateTo: 'NONE',
      GrowthType: 'LINEAR',
    });
  });

  test('canary deployment strategy with no bake time', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      rolloutStrategy: RolloutStrategy.CANARY_10_PERCENT_20_MINUTES,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MyDeploymentStrategy',
      DeploymentDurationInMinutes: 20,
      GrowthFactor: 10,
      FinalBakeTimeInMinutes: 10,
      ReplicateTo: 'NONE',
      GrowthType: 'EXPONENTIAL',
    });
  });

  test('linear deployment strategy with no bake time', () => {
    const stack = new cdk.Stack();
    new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
      rolloutStrategy: RolloutStrategy.LINEAR_50_PERCENT_EVERY_30_SECONDS,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MyDeploymentStrategy',
      DeploymentDurationInMinutes: 1,
      GrowthFactor: 50,
      FinalBakeTimeInMinutes: 1,
      ReplicateTo: 'NONE',
      GrowthType: 'LINEAR',
    });
  });
});
