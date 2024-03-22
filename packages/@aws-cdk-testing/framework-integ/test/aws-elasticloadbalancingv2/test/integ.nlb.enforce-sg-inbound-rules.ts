import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ-enforce-sg-inbound-rules');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'SG', { vpc }),
  ],
  enforceSecurityGroupInboundRulesOnPrivateLinkTraffic: true,
});

new IntegTest(app, 'IntegTest', { testCases: [stack] });
