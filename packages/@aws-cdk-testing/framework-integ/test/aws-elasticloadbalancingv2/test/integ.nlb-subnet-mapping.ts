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
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/8'),
  maxAzs: 1,
  subnetConfiguration: [
    {
      cidrMask: 16,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 16,
      name: 'Private',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    {
      cidrMask: 16,
      name: 'Isolated',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
  natGateways: 1,
});

const publicSubnet = vpc.selectSubnets({
  subnetType: ec2.SubnetType.PUBLIC,
}).subnets[0];
(publicSubnet.node.defaultChild as ec2.CfnSubnet).addPropertyOverride('CidrBlock', '10.0.0.0/16');

const privateSubnet = vpc.selectSubnets({
  subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
}).subnets[0];
(privateSubnet.node.defaultChild as ec2.CfnSubnet).addPropertyOverride('CidrBlock', '10.1.0.0/16');

const isolatedSubnet = vpc.selectSubnets({
  subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
}).subnets[0];
(isolatedSubnet.node.defaultChild as ec2.CfnSubnet).addPropertyOverride('CidrBlock', '10.2.0.0/16');

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
      privateIpv4Address: '10.0.12.29',
    },
  ],
});

new integ.IntegTest(app, 'NlbSubnetMappingStackTest', {
  testCases: [stack],
});
