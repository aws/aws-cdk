/*
 * This integration test deploys a VPC that contains a BYOIP IPv6 address.
 * The address is owned by the CDK maintainers, who are able to run and
 * update the test if need be for future changes.
 *
 * Notes on how to run this integ test
 * Replace the ipv6PoolId and ipv6CidrBlock for VPC with the one that is owned by your account.
 */

import * as vpc_v2 from '../lib/vpc-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { IpCidr, SubnetV2 } from '../lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'vpc-byoip-ipv6');

const myVpc = new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv6ByoipPool({
      ipv6PoolId: 'ipv6pool-ec2-0a95217e154b65493', // To Be Replaced
      cidrBlockName: 'MyByoipIpv6Block',
      ipv6CidrBlock: '2600:f0f0:8::/56', // To Be Replaced
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

new SubnetV2(stack, 'Subnet-integ-test-1', {
  vpc: myVpc,
  ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
  ipv6CidrBlock: new IpCidr('2600:f0f0:8:1::/64'), // To Be Replaced
  availabilityZone: 'us-west-2a',
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/**
 * Check for non-ovelapping subnet range
 */
new SubnetV2(stack, 'Subnet-integ-test-2', {
  vpc: myVpc,
  ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
  ipv6CidrBlock: new IpCidr('2600:f0f0:8:0::/64'), // To Be Replaced
  availabilityZone: 'us-west-2a',
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

