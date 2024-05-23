import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-nlb-dualstack-internal');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
  subnetConfiguration: [
    {
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      name: 'Isolated',
    },
  ],
});

const ipv6Block = new ec2.CfnVPCCidrBlock(
  stack,
  'IPv6_Block',
  {
    vpcId: vpc.vpcId,
    amazonProvidedIpv6CidrBlock: true,
  },
);
const vpcIpv6CidrBlock = cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks);

const subnetIpv6CidrBlocks = cdk.Fn.cidr(vpcIpv6CidrBlock, 256, '64');

const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  denyAllIgwTraffic: true,
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
});

const group = new elbv2.NetworkTargetGroup(stack, 'tg', {
  vpc: lb.vpc,
  port: 3000,
});

lb.addListener('Listener', {
  protocol: elbv2.Protocol.TCP,
  port: 3000,
  defaultAction: elbv2.NetworkListenerAction.forward([group]),
});

group.configureHealthCheck({
  interval: cdk.Duration.seconds(250),
  timeout: cdk.Duration.seconds(100),
  protocol: elbv2.Protocol.TCP,
  healthyThresholdCount: 5,
  unhealthyThresholdCount: 2,
});

vpc.isolatedSubnets.forEach((subnet, idx) => {
  subnet.node.addDependency(ipv6Block);
  const cfnSubnet = subnet.node.defaultChild as ec2.CfnSubnet;
  cfnSubnet.ipv6CidrBlock = cdk.Fn.select(idx, subnetIpv6CidrBlocks);
  cfnSubnet.assignIpv6AddressOnCreation = true;

  group.node.addDependency(subnet);
});

new integ.IntegTest(app, 'NlbDualstackInternalInteg', {
  testCases: [stack],
});

app.synth();
