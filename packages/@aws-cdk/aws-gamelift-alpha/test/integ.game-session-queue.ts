import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sns from 'aws-cdk-lib/aws-sns';
import type { Construct } from 'constructs';
import * as gamelift from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const build = new gamelift.Build(this, 'Build', {
      content: gamelift.Content.fromAsset(path.join(__dirname, 'my-game-build')),
      operatingSystem: gamelift.OperatingSystem.AMAZON_LINUX_2,
    });

    const fleet = new gamelift.BuildFleet(this, 'BuildFleet', {
      fleetName: 'test-fleet-gsq',
      content: build,
      ingressRules: [{
        source: gamelift.Peer.anyIpv4(),
        port: gamelift.Port.tcp(1935),
      }],
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
      runtimeConfiguration: {
        gameSessionActivationTimeout: Duration.seconds(300),
        maxConcurrentGameSessionActivations: 1,
        serverProcesses: [{
          launchPath: '/local/game/TestApplicationServer',
          parameters: 'port:1935 gameSessionLengthSeconds:20',
          concurrentExecutions: 1,
        }],
      },
    });
    const alias = fleet.addAlias('live');

    const topic = new sns.Topic(this, 'MyTopic', {});

    const queue = new gamelift.GameSessionQueue(this, 'MyGameSessionQueue', {
      gameSessionQueueName: 'test-gameSessionQueue',
      customEventData: 'test-event-data',
      allowedLocations: ['eu-west-1', 'eu-west-2'],
      destinations: [fleet],
      notificationTarget: topic,
      playerLatencyPolicies: [{
        maximumIndividualPlayerLatency: cdk.Duration.millis(100),
        policyDuration: cdk.Duration.seconds(300),
      }],
      priorityConfiguration: {
        locationOrder: [
          'eu-west-1',
          'eu-west-2',
        ],
        priorityOrder: [
          gamelift.PriorityType.LATENCY,
          gamelift.PriorityType.COST,
          gamelift.PriorityType.DESTINATION,
          gamelift.PriorityType.LOCATION,
        ],
      },
      timeout: cdk.Duration.seconds(300),
    });

    queue.addDestination(alias);
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-gameSessionQueue');
new IntegTest(app, 'GameSessionQueue', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-central-1', 'ap-northeast-1', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1', 'sa-east-1'],
});

app.synth();
