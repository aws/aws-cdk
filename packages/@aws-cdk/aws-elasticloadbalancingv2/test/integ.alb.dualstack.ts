#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import * as elbv2 from '../lib';

/* IPv6 workaround found here: https://github.com/aws/aws-cdk/issues/894 */
const valueOrDie = <T, C extends T = T>(value: T | undefined, err: Error): C => {
  if (value === undefined) { throw err; }
  return value as C;
};

/**
 * Integration test to deployability and use of dualstack ALB. Creates an ALB
 * with dualstack ipAddresType and an ipv6Block to add to VPC subnets. Main
 * test is for the inclusion of default IPv6 ingress rule.
 *
 * Stack Verification steps:
 * VPC is created with subnets that allow for IPv6 connection and then dualstack
 * ALB attaches a listener with dualstack that defaults IPv4/IPv6 ingress rule.
 *
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const ipv6Block = new ec2.CfnVPCCidrBlock(
  stack,
  'IPv6_Block',
  {
    vpcId: vpc.vpcId,
    amazonProvidedIpv6CidrBlock: true,
  },
);

// Get the vpc's internet gateway so we can create default routes for the
// public subnets.
const internetGateway = valueOrDie<IConstruct, ec2.CfnInternetGateway>(
  vpc.node.children.find(c => c instanceof ec2.CfnInternetGateway),
  new Error('Couldnt find an internet gateway'),
);


const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
  internetFacing: true,
});

const listener = lb.addListener('Listener', {
  port: 80,
});

const group1 = listener.addTargets('Target', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.6')],
});

const group2 = listener.addTargets('ConditionalTarget', {
  priority: 10,
  hostHeader: 'example.com',
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.5')],
});

vpc.publicSubnets.forEach((subnet, idx) => {
  // Add a default ipv6 route to the subnet's route table.
  const unboxedSubnet = subnet as ec2.Subnet;
  unboxedSubnet.addRoute('IPv6Default', {
    routerId: internetGateway.ref,
    routerType: ec2.RouterType.GATEWAY,
    destinationIpv6CidrBlock: '::/0',
  });

  // Find a CfnSubnet (raw cloudformation resources) child to the public
  // subnet nodes.
  const cfnSubnet = valueOrDie<IConstruct, ec2.CfnSubnet>(
    subnet.node.children.find(c => c instanceof ec2.CfnSubnet),
    new Error('Couldnt find a CfnSubnet'),
  );

  // Use the intrinsic Fn::Cidr CloudFormation function on the VPC's
  // first IPv6 block to determine ipv6 /64 cidrs for each subnet as
  // a function of the public subnet's index.
  const vpcCidrBlock = cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks);
  const ipv6Cidrs = cdk.Fn.cidr(
    vpcCidrBlock,
    vpc.publicSubnets.length,
    '64',
  );
  cfnSubnet.ipv6CidrBlock = cdk.Fn.select(idx, ipv6Cidrs);

  // The subnet depends on the ipv6 cidr being allocated.
  cfnSubnet.addDependency(ipv6Block);

  group1.node.addDependency(subnet);
  group2.node.addDependency(subnet);
});

listener.addAction('action1', {
  priority: 1,
  conditions: [
    elbv2.ListenerCondition.hostHeaders(['example.com']),
  ],
  action: elbv2.ListenerAction.fixedResponse(200, { messageBody: 'success' }),
});

group1.metricTargetResponseTime().createAlarm(stack, 'ResponseTimeHigh1', {
  threshold: 5,
  evaluationPeriods: 2,
});

group2.metricTargetResponseTime().createAlarm(stack, 'ResponseTimeHigh2', {
  threshold: 5,
  evaluationPeriods: 2,
});

app.synth();
