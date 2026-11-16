import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
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
      fleetName: 'test-fleet-alias',
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

    new gamelift.Alias(this, 'FleetAlias', {
      aliasName: 'test-alias',
      fleet: fleet,
    });

    new gamelift.Alias(this, 'TerminalAlias', {
      aliasName: 'test-alias',
      terminalMessage: 'a terminal message',
    });
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-alias');
new IntegTest(app, 'Alias', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-central-1', 'ap-northeast-1', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1', 'sa-east-1'],
});

app.synth();
