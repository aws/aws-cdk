import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as gamelift from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ruleSet = new gamelift.MatchmakingRuleSet(this, 'QueuedMatchmakingConfiguration', {
      matchmakingRuleSetName: 'my-test-ruleset',
      content: gamelift.RuleSetContent.fromJsonFile(path.join(__dirname, 'my-ruleset/ruleset.json')),
    });

    const build = new gamelift.Build(this, 'Build', {
      content: gamelift.Content.fromAsset(path.join(__dirname, 'my-game-build')),
      operatingSystem: gamelift.OperatingSystem.AMAZON_LINUX_2,
    });

    const fleet = new gamelift.BuildFleet(this, 'BuildFleet', {
      fleetName: 'test-fleet',
      content: build,
      ingressRules: [{
        source: gamelift.Peer.anyIpv4(),
        port: gamelift.Port.tcp(1935),
      }],
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
      runtimeConfiguration: {
        gameSessionActivationTimeout: cdk.Duration.seconds(300),
        maxConcurrentGameSessionActivations: 1,
        serverProcesses: [{
          launchPath: '/local/game/TestApplicationServer',
          parameters: 'port:1935 gameSessionLengthSeconds:20',
          concurrentExecutions: 1,
        }],
      },
    });

    const queue = new gamelift.GameSessionQueue(this, 'MyGameSessionQueue', {
      gameSessionQueueName: 'test-gameSessionQueue',
      destinations: [fleet],
    });

    const matchmakingConfiguration = new gamelift.QueuedMatchmakingConfiguration(this, 'MyQueuedMatchmakingConfiguration', {
      matchmakingConfigurationName: 'test-config-name',
      gameSessionQueues: [queue],
      ruleSet: ruleSet,
      customEventData: 'event-data',
      gameProperties: [{
        key: 'test-key',
        value: 'test-value',
      }],
      gameSessionData: 'test-session-data',
      manualBackfillMode: true,
      additionalPlayerCount: 3,
      description: 'test description',
      requestTimeout: cdk.Duration.seconds(30),
      requireAcceptance: true,
      acceptanceTimeout: cdk.Duration.seconds(30),
    });

    new CfnOutput(this, 'MatchmakingConfigurationArn', { value: matchmakingConfiguration.matchmakingConfigurationArn });
    new CfnOutput(this, 'MatchmakingConfigurationName', { value: matchmakingConfiguration.matchmakingConfigurationName });
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-queued-matchmaking-configuration');
new IntegTest(app, 'QueuedMatchmakingConfiguration', {
  testCases: [stack],
});

app.synth();
