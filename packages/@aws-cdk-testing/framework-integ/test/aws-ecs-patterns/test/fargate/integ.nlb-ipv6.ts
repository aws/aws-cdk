import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Ipv6NlbStack');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
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

vpc.publicSubnets.forEach((subnet, idx) => {
  subnet.node.addDependency(ipv6Block);
  const cfnSubnet = subnet.node.defaultChild as ec2.CfnSubnet;
  cfnSubnet.ipv6CidrBlock = cdk.Fn.select(idx, subnetIpv6CidrBlocks);
  cfnSubnet.assignIpv6AddressOnCreation = true;
});

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NlbFargateService', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
});

new integ.IntegTest(app, 'Ipv6NlbTest', {
  testCases: [stack],
});
