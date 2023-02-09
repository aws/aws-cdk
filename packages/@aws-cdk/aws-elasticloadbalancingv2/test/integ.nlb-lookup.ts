import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { IntegTestCaseStack } from '@aws-cdk/integ-tests';
import * as elbv2 from '../lib';

const app = new cdk.App();
const stackWithLb = new cdk.Stack(app, 'aws-cdk-elbv2-StackWithLb', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const vpc = new ec2.Vpc(stackWithLb, 'VPC', {
  maxAzs: 2,
  vpcName: 'my-vpc-name',
});

const lb = new elbv2.NetworkLoadBalancer(stackWithLb, 'LB', {
  vpc,
  internetFacing: true,
  loadBalancerName: 'my-load-balancer',
});
new cdk.CfnOutput(stackWithLb, 'NlbArn', {
  value: lb.loadBalancerArn,
  exportName: 'NlbArn',
});

const stackLookup = new IntegTestCaseStack(app, 'aws-cdk-elbv2-integ-StackUnderTest', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const lbByHardcodedArn = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stackLookup, 'NlbByHardcodedArn', {
  loadBalancerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/network/my-load-balancer/50dc6c495c0c9188',
});
lbByHardcodedArn.metrics.activeFlowCount().createAlarm(stackLookup, 'NlbByHardcodedArn_AlarmFlowCount', {
  evaluationPeriods: 1,
  threshold: 0,
});

const lbByCfnOutputsFromAnotherStackOutsideCdk = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stackLookup, 'NlbByCfnOutputsFromAnotherStackOutsideCdk', {
  loadBalancerArn: cdk.Fn.importValue('NlbArn'),
});
lbByCfnOutputsFromAnotherStackOutsideCdk.metrics.activeFlowCount().createAlarm(stackLookup, 'NlbByCfnOutputsFromAnotherStackOutsideCdk_AlarmFlowCount', {
  evaluationPeriods: 1,
  threshold: 0,
});

const lbByCfnOutputsFromAnotherStackWithinCdk = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stackLookup, 'NlbByCfnOutputsFromAnotherStackWithinCdk', {
  loadBalancerArn: lb.loadBalancerArn,
});
lbByCfnOutputsFromAnotherStackWithinCdk.metrics.activeFlowCount().createAlarm(stackLookup, 'NlbByCfnOutputsFromAnotherStackWithinCdk_AlarmFlowCount', {
  evaluationPeriods: 1,
  threshold: 0,
});

new integ.IntegTest(app, 'elbv2-integ', {
  testCases: [stackLookup],
  enableLookups: true,
});

app.synth();
