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
import { IpCidr, SubnetV2 } from '../lib';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-secondary-cidr-blocks');

// RFC 1918 primary with a secondary block from 198.18.0.0/15
const vpcWithPublicSecondary = new vpc_v2.VpcV2(stack, 'VpcWithPublicSecondary', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv4('198.18.0.0/26', {
    cidrBlockName: 'PublicSecondary',
  })],
});

new SubnetV2(stack, 'SubnetInPrimary1', {
  vpc: vpcWithPublicSecondary,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new SubnetV2(stack, 'SubnetInSecondary1', {
  vpc: vpcWithPublicSecondary,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('198.18.0.0/28'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// RFC 1918 primary with a secondary block from 100.64.0.0/10
const vpcWithCarrierGradeNat = new vpc_v2.VpcV2(stack, 'VpcWithCarrierGradeNat', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv4('100.64.0.0/16', {
    cidrBlockName: 'CarrierGradeNat',
  })],
});

new SubnetV2(stack, 'SubnetInPrimary2', {
  vpc: vpcWithCarrierGradeNat,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('10.0.1.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new SubnetV2(stack, 'SubnetInCarrierGradeNat', {
  vpc: vpcWithCarrierGradeNat,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('100.64.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// 192.168.0.0/16 primary with a publicly routable secondary block
const vpc192WithPublicSecondary = new vpc_v2.VpcV2(stack, 'Vpc192WithPublicSecondary', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('192.168.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv4('203.0.113.0/24', {
    cidrBlockName: 'PublicSecondary192',
  })],
});

new SubnetV2(stack, 'SubnetInSecondary192', {
  vpc: vpc192WithPublicSecondary,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('203.0.113.0/28'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// 172.16.0.0/12 primary with a publicly routable secondary block
const vpc172WithPublicSecondary = new vpc_v2.VpcV2(stack, 'Vpc172WithPublicSecondary', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('172.16.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv4('198.51.100.0/24', {
    cidrBlockName: 'PublicSecondary172',
  })],
});

new SubnetV2(stack, 'SubnetInSecondary172', {
  vpc: vpc172WithPublicSecondary,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('198.51.100.0/28'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new IntegTest(app, 'integtest-secondary-cidr-blocks', {
  testCases: [stack],
});
