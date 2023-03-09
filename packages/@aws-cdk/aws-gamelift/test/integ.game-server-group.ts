import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as gamelift from '../lib';
import { BalancingStrategy } from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create default VPC
    const vpc = new ec2.Vpc(this, 'Vpc');

    //Create default launch template
    const launchTemplate = new ec2.LaunchTemplate(this, 'LaunchTemplate', {
      machineImage: ec2.MachineImage.latestAmazonLinux(),
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
});

app.synth();