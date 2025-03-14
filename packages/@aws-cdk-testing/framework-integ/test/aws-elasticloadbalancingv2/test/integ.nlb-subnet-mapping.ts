import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'NlbSubnetMappingStack');

const dualstackVpc = new ec2.Vpc(stack, 'DualStackVpc', {
  maxAzs: 2,
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  natGateways: 0,
});

const dualstackNlb = new elbv2.NetworkLoadBalancer(stack, 'DualStackLb', {
  vpc: dualstackVpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'LbSg', { vpc: dualstackVpc }),
  ],
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
  enablePrefixForIpv6SourceNat: true,
  subnetMappings: [
    {
      subnet: dualstackVpc.publicSubnets[0],
      sourceNatIpv6Prefix: elbv2.SourceNatIpv6Prefix.autoAssigned(),
    },
  ],
});

const udpListener = dualstackNlb.addListener('UdpListener', {
  port: 1229,
  protocol: elbv2.Protocol.UDP,
});
const udpTargetGroup = new elbv2.NetworkTargetGroup(stack, 'UdpTargetGroup', {
  vpc: dualstackVpc,
  port: 1229,
  protocol: elbv2.Protocol.UDP,
  ipAddressType: elbv2.TargetGroupIpAddressType.IPV6,
});
udpListener.addTargetGroups('TargetGroup', udpTargetGroup);

const vpc = new ec2.Vpc(stack, 'MyVPC', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  maxAzs: 1,
  subnetConfiguration: [
    {
      cidrMask: 20,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 20,
      name: 'Private',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    {
      cidrMask: 20,
      name: 'Isolated',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
  natGateways: 1,
});

const publicSubnet = vpc.selectSubnets({
  subnetType: ec2.SubnetType.PUBLIC,
}).subnets[0];
(publicSubnet.node.defaultChild as ec2.CfnSubnet).addPropertyOverride('CidrBlock', '10.0.0.0/24');

const privateSubnet = vpc.selectSubnets({
  subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
}).subnets[0];
(privateSubnet.node.defaultChild as ec2.CfnSubnet).addPropertyOverride('CidrBlock', '10.0.1.0/24');

const isolatedSubnet = vpc.selectSubnets({
  subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
}).subnets[0];
(isolatedSubnet.node.defaultChild as ec2.CfnSubnet).addPropertyOverride('CidrBlock', '10.0.2.0/24');

const elasticIp = new ec2.CfnEIP(stack, 'ElasticIp');

new elbv2.NetworkLoadBalancer(stack, 'InternetFacingLb', {
  vpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'InternetFacingLbSg', { vpc }),
  ],
  subnetMappings: [
    {
      subnet: publicSubnet,
      allocationId: elasticIp.attrAllocationId,
    },
  ],
});

new elbv2.NetworkLoadBalancer(stack, 'InternalLb', {
  vpc,
  internetFacing: false,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'InternalLbSg', { vpc }),
  ],
  subnetMappings: [
    {
      subnet: privateSubnet,
      privateIpv4Address: '10.0.1.70',
    },
  ],
});

new integ.IntegTest(app, 'NlbSubnetMappingStackTest', {
  testCases: [stack],
});
