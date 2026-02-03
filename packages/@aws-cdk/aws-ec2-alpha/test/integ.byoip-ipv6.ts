/*
 * This integration test deploys a VPC that contains IPv6 addresses.
 * Modified to use Amazon-provided IPv6 instead of BYOIP since the original
 * BYOIP pool is not available in test environments.
 */

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2 } from '../lib';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'vpc-byoip-ipv6');

const myVpc = new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvidedIpv6Block',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

new SubnetV2(stack, 'Subnet-integ-test-1', {
  vpc: myVpc,
  ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
  availabilityZone: cdk.Fn.select(0, cdk.Fn.getAzs()),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/**
 * Check for non-overlapping subnet range
 */
new SubnetV2(stack, 'Subnet-integ-test-2', {
  vpc: myVpc,
  ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
  availabilityZone: cdk.Fn.select(0, cdk.Fn.getAzs()),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

