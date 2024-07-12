/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import * as vpc_v2 from '../lib/vpc-v2';
import { AddressFamily, Ipam, IpamPoolPublicIpSource, Ipv4Cidr, SubnetV2 } from '../lib';
//import {  Ipv6Cidr } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha-new');

const ipam = new Ipam(stack, 'Ipam');

/**
 * Integ test for VPC with IPAM pool to be run with --no-clean
 */
const pool2 = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V6,
  awsService: 'ec2',
  locale: 'eu-west-2', //set to the region stack is being deployed to
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});

pool2.provisionCidr('PublicPool0Cidr', { netmaskLength: 52 } );

const vpc = new vpc_v2.VpcV2(stack, 'VPCTest', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv6Ipam({
    ipv6IpamPool: pool2,
    ipv6NetmaskLength: 56,
  })],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

/**
 * Since source for IPAM IPv6 is set to amazonProvided,
 * can assign IPv6 address only after the allocation
 * uncomment ipv6CidrBlock and provide valid IPv6 range
 */
new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: 'eu-west-2a',
  cidrBlock: new Ipv4Cidr('10.0.0.0/24'),
  //defined on the basis of allocation done in IPAM console
  //ipv6CidrBlock: new Ipv6Cidr('2a05:d02c:25:4000::/60'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

vpc.enableVpnGateway({
  vpnRoutePropagation: [{
    subnetType: SubnetType.PRIVATE_ISOLATED, // optional, defaults to "PUBLIC"
  }],
  type: 'ipsec.1',
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

