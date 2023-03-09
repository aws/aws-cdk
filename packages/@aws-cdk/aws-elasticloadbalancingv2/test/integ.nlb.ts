import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
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

const listener = lb.addListener('Listener', {
  port: 443,
});

const group = listener.addTargets('Target', {
  port: 443,
  targets: [new elbv2.IpTarget('10.0.1.1')],
});

group.configureHealthCheck({
  interval: cdk.Duration.seconds(250),
  protocol: elbv2.Protocol.TCP,
});

vpc.publicSubnets.forEach(subnet => group.node.addDependency(subnet));
group.node.addDependency(vpc.internetConnectivityEstablished);

// The target's security group must allow being routed by the LB and the clients.

new integ.IntegTest(app, 'elbv2-integ', {
  testCases: [stack],
});

app.synth();
