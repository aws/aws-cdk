import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

/* IPv6 workaround found here: https://github.com/aws/aws-cdk/issues/894 */
const valueOrDie = <T, C extends T = T>(value: T | undefined, err: Error): C => {
  if (value === undefined) { throw err; }
  return value as C;
};

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-nlb-dualstack-internet-facing');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
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

const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
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
  timeout: cdk.Duration.seconds(100),
  protocol: elbv2.Protocol.TCP,
  healthyThresholdCount: 5,
  unhealthyThresholdCount: 2,
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

  group.node.addDependency(subnet);
});

// The target's security group must allow being routed by the LB and the clients.

new integ.IntegTest(app, 'NlbDualstackInternetFacingInteg', {
  testCases: [stack],
});

app.synth();
