import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as gamelift from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const build = new gamelift.Build(this, 'Build', {
      content: gamelift.Content.fromAsset(path.join(__dirname, 'my-game-build')),
      operatingSystem: gamelift.OperatingSystem.AMAZON_LINUX_2,
    });

    new gamelift.BuildFleet(this, 'BuildFleet', {
      fleetName: 'test-fleet',
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
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-build-fleet');
new IntegTest(app, 'BuildFleet', {
  testCases: [stack],
});

app.synth();
