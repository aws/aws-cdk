import type * as cdk from 'aws-cdk-lib';
import type { SubnetType } from 'aws-cdk-lib/aws-ec2';
import type { AddressFamily } from '../lib';
import * as subnet from '../lib/subnet-v2';
import type * as vpc from '../lib/vpc-v2';

export function createTestSubnet(
  stack: cdk.Stack,
  config: {
    vpcV2: vpc.VpcV2;
    availabilityZone: string;
    cidrBlock: subnet.IpCidr;
    subnetType: SubnetType;
    addressFamily?: AddressFamily;
    ipv6Cidr?: subnet.IpCidr;
    assignIpv6AddressOnCreation?: boolean;
  },
): subnet.SubnetV2 {
  const { vpcV2, availabilityZone, cidrBlock, subnetType, ipv6Cidr, assignIpv6AddressOnCreation } = config;

  return new subnet.SubnetV2(stack, 'TestSubnet', {
    vpc: vpcV2,
    availabilityZone,
    ipv4CidrBlock: cidrBlock,
    subnetType,
    ipv6CidrBlock: ipv6Cidr,
    assignIpv6AddressOnCreation,
  });
}
