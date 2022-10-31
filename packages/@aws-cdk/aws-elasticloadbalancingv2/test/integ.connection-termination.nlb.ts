#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as elbv2 from '../lib';


const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,

});

const targetGroup = new elbv2.NetworkTargetGroup(stack, 'TG', {
  vpc,
  port: 443,
  deregistrationDelay: Duration.seconds(5),
  connectionTermination: true,
});

lb.addListener('listener', {
  port: 443,
  defaultTargetGroups: [targetGroup],
});

targetGroup.node.addDependency(vpc.internetConnectivityEstablished);

// The target's security group must allow being routed by the LB and the clients.
new integ.IntegTest(app, 'targetGroupTest', {
  testCases: [stack],
});

app.synth();
