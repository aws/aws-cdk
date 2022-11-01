import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-gamelift-build-fleet');

const build = gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build'));

const fleet = new gamelift.BuildFleet(stack, 'BuildFleet', {
  content: build,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  runtimeConfiguration: {
    serverProcesses: [{
      launchPath: 'test-launch-path',
      concurrentExecutions: 10,
    }],
  },
});

fleet.addIngressRule(gamelift.Peer.anyIpv4(), gamelift.Port.allTcp());

app.synth();
