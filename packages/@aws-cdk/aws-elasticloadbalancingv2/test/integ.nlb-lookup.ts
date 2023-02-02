import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as elbv2 from '../lib';
import { IntegTestCaseStack } from '@aws-cdk/integ-tests';

const appWithLb = new cdk.App();
const stackWithLb = new cdk.Stack(appWithLb, 'aws-cdk-elbv2-StackWithLb', {
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
cdk.Tags.of(lb).add('some', 'tag');
const lbArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/network/my-load-balancer/50dc6c495c0c9188';

const appUnderTest = new cdk.App();
const stackLookup = new IntegTestCaseStack(appUnderTest, 'aws-cdk-elbv2-integ-StackUnderTest', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const lbByAttributes = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stackLookup, 'NlbByAttributes', {
  loadBalancerArn: lbArn,
});

lbByAttributes.metrics.activeFlowCount().createAlarm(stackLookup, 'NlbByAttributes_AlarmFlowCount', {
  evaluationPeriods: 1,
  threshold: 0,
});

new integ.IntegTest(appUnderTest, 'elbv2-integ', {
  testCases: [stackLookup],
});

appWithLb.synth();
appUnderTest.synth();
