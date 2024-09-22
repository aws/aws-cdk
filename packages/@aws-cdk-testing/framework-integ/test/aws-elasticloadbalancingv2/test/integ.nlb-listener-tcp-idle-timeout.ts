import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'nlb-tcp-idle-timeout');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

const nlb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'SG', { vpc }),
  ],
});

const group = new elbv2.NetworkTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });

nlb.addListener('Listener', {
  port: 80,
  protocol: elbv2.Protocol.TCP,
  tcpIdleTimeout: cdk.Duration.seconds(100),
  defaultAction: elbv2.NetworkListenerAction.forward([group]),
});

new integ.IntegTest(app, 'nlb-tcp-idle-timeout-test', {
  testCases: [stack],
});
