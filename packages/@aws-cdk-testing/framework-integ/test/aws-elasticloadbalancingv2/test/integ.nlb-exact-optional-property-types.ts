import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

// Verifies that the NLB L2 construct with `securityGroups` and
// `enforceSecurityGroupInboundRulesOnPrivateLinkTraffic` set renders
// the expected CloudFormation. The synthesized template is identical
// before and after the type-shape fix in #38375; this test exists to
// satisfy the pr-linter requirement for fix-type PRs to ship an integ
// test alongside the unit test, and to lock in the property attributes
// emitted to the underlying CfnLoadBalancer.
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elasticloadbalancingv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  securityGroups: [sg],
  enforceSecurityGroupInboundRulesOnPrivateLinkTraffic: true,
});

new integ.IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
