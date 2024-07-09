import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import * as subnet from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { AddressFamily } from '../lib';

export function createTestSubnet(
    stack: cdk.Stack,
    config: {
      vpcV2: vpc.VpcV2;
      availabilityZone: string;
      cidrBlock: subnet.Ipv4Cidr;
      subnetType: SubnetType;
      addressFamily?: AddressFamily;
      ipv6Cidr?: subnet.Ipv6Cidr;
    }
  ): subnet.SubnetV2 {
    const { vpcV2, availabilityZone, cidrBlock, subnetType, ipv6Cidr } = config;
  
    return new subnet.SubnetV2(stack, 'TestSubnet', {
      vpc: vpcV2,
      availabilityZone,
      cidrBlock: cidrBlock,
      subnetType,
      ipv6CidrBlock: ipv6Cidr,
    });
  }