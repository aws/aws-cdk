import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import * as gamelift from '../lib';
import { BalancingStrategy } from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create default VPC
    const vpc = new ec2.Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false });

    // Create default launch template
    const launchTemplate = new ec2.LaunchTemplate(this, 'LaunchTemplate', {
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
    });

    new gamelift.GameServerGroup(this, 'MyGameServerGroup', {
      instanceDefinitions: [{
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
      },
      {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
      }],
      minSize: 1,
      maxSize: 10,
      protectGameServer: true,
      balancingStrategy: BalancingStrategy.ON_DEMAND_ONLY,
      vpc: vpc,
      launchTemplate: launchTemplate,
      gameServerGroupName: 'test-gameservergroup-name',
    });
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-game-server-group');
new IntegTest(app, 'GameServerGroup', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-central-1', 'ap-northeast-1', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1', 'sa-east-1'],
});

app.synth();
