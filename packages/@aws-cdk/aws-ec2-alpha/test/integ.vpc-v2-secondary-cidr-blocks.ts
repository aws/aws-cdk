/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-secondary-cidr-blocks');

/** Test RFC 1918 primary (10.0.0.0/8) with publicly routable secondary */
const vpc1 = new vpc_v2.VpcV2(stack, 'VpcWithPublicSecondary', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4('198.18.0.0/26', {
      cidrBlockName: 'PublicSecondary',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

// Create a subnet in the primary CIDR block
new SubnetV2(stack, 'SubnetInPrimary1', {
  vpc: vpc1,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// Create a subnet in the secondary publicly routable CIDR block
new SubnetV2(stack, 'SubnetInSecondary1', {
  vpc: vpc1,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('198.18.0.0/28'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/** Test RFC 1918 primary (10.0.0.0/8) with 100.64.0.0/10 secondary (Carrier-grade NAT) */
const vpc2 = new vpc_v2.VpcV2(stack, 'VpcWithCarrierGradeNat', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4('100.64.0.0/16', {
      cidrBlockName: 'CarrierGradeNat',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

// Create a subnet in the primary CIDR block
new SubnetV2(stack, 'SubnetInPrimary2', {
  vpc: vpc2,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('10.0.1.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// Create a subnet in the 100.64.0.0/10 secondary CIDR block
new SubnetV2(stack, 'SubnetInCarrierGradeNat', {
  vpc: vpc2,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('100.64.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/** Test 192.168.0.0/16 primary with publicly routable secondary */
const vpc3 = new vpc_v2.VpcV2(stack, 'Vpc192WithPublicSecondary', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('192.168.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4('203.0.113.0/24', {
      cidrBlockName: 'PublicSecondary192',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

// Create a subnet in the secondary publicly routable CIDR block
new SubnetV2(stack, 'SubnetInSecondary192', {
  vpc: vpc3,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('203.0.113.0/28'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/** Test 172.16.0.0/12 primary with publicly routable secondary */
const vpc4 = new vpc_v2.VpcV2(stack, 'Vpc172WithPublicSecondary', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('172.16.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4('198.51.100.0/24', {
      cidrBlockName: 'PublicSecondary172',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

// Create a subnet in the secondary publicly routable CIDR block
new SubnetV2(stack, 'SubnetInSecondary172', {
  vpc: vpc4,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('198.51.100.0/28'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new IntegTest(app, 'integtest-secondary-cidr-blocks', {
  testCases: [stack],
});

