#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { ListenerAction } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

class ElbV2AsgStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      restrictDefaultSecurityGroup: false,
    });

    const asg = new autoscaling.AutoScalingGroup(this, 'Fleet', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage(),
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
    });

    const listener = lb.addListener('Listener', {
      port: 80,
    });

    listener.addTargets('Target', {
      port: 80,
      targets: [asg],
    });

    listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    asg.scaleOnRequestCount('AModestLoad', {
      targetRequestsPerSecond: 1,
    });
  }
}

class ElbV2AsgAtgStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
    });
    const alb = new elbv2.ApplicationLoadBalancer(this, 'alb', {
      vpc,
      internetFacing: true,
    });
    const listener = alb.addListener('Listener', {
      port: 80,
      open: true,
    });

    const asg = new autoscaling.AutoScalingGroup(this, 'Asg', {
      vpc,
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: new ec2.AmazonLinuxImage(),
    });

    const atg1 = new elbv2.ApplicationTargetGroup(this, 'ATG1', {
      port: 443,
      vpc,
    });
    const atg2 = new elbv2.ApplicationTargetGroup(this, 'ATG2', {
      port: 443,
      vpc,
    });

    listener.addAction('tgs', {
      action: ListenerAction.weightedForward([
        { targetGroup: atg1, weight: 1 },
        { targetGroup: atg2, weight: 1 },
      ]),
    });

    asg.attachToApplicationTargetGroup(atg1);
    asg.attachToApplicationTargetGroup(atg2);
  }
}
const app = new cdk.App();

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [
    new ElbV2AsgStack(app, 'aws-cdk-asg-integ'),
    new ElbV2AsgAtgStack(app, 'aws-cdk-asg-atg-integ'),
  ],
});
