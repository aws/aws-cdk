// /*
//  * Our integration tests act as snapshot tests to make sure the rendered template is stable.
//  * If any changes to the result are required,
//  * you need to perform an actual CloudFormation deployment of this application,
//  * and, if it is successful, a new snapshot will be written out.
//  *
//  * For more information on CDK integ tests,
//  * see the main CONTRIBUTING.md file.
//  */

import * as vpc_v2 from '../lib/vpc-v2';
import { AddressFamily, Ipam, IpamPoolPublicIpSource } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { SubnetV2, Ipv4Cidr, Ipv6Cidr } from '../lib/subnet-v2';
//import { rangesOverlap } from '../lib/util';
//import { CidrBlockIpv6 } from '../lib/util';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha');

const ipam = new Ipam(stack, 'IpamTest');

/**Test Ipam Pool Ipv4 */

const pool1 = ipam.privateScope.addPool('PrivatePool0', {
  addressFamily: AddressFamily.IP_V4,
  provisionedCidrs: [{ cidr: '10.2.0.0/16' }],
  locale: 'eu-central-1',
});

const pool2 = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V6,
  awsService: 'ec2',
  locale: 'eu-central-1',
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});
pool2.provisionCidr('PublicPool0Cidr', { netmaskLength: 52 } );
//TODO: Test Ipam Pool Ipv6

/** Test Ipv4 Primary and Secondary address */
new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4Ipam({
      ipv4IpamPool: pool1,
      ipv4NetmaskLength: 20,
    }),
    //Test secondary ipv6 address
    vpc_v2.IpAddresses.amazonProvidedIpv6(),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

/**
 * Integ test for VPC with IPAM pool to be run with --no-clean
 */
const vpc = new vpc_v2.VpcV2(stack, 'Vpc-integ-test-2', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv6Ipam({
    ipv6IpamPool: pool2,
    ipv6NetmaskLength: 60,
  }),
  vpc_v2.IpAddresses.ipv4('10.2.0.0/16'),
  vpc_v2.IpAddresses.ipv4('10.3.0.0/16')],
});

new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: 'us-west-2a',
  cidrBlock: new Ipv4Cidr('10.1.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new SubnetV2(stack, 'testsubnet', {
  vpc,
  availabilityZone: 'us-west-2a',
  cidrBlock: new Ipv4Cidr('10.2.0.0/24'),
  ipv6CidrBlock: new Ipv6Cidr('2001:db8:1::/64'), //Test secondary ipv6 address
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// const cidr = new CidrBlockIpv6('2001:0db8:0000:0001::/60');
// console.log(cidr.minIp(), cidr.maxIp());

// const cidr2 = new CidrBlockIpv6('2001:db8:1234:0001:0000::/68');
// console.log(cidr2.minIp(), cidr2.maxIp());

//validate ipv6
new SubnetV2(stack, 'validateIpv6', {
  vpc,
  cidrBlock: new Ipv4Cidr('10.3.0.0/24'),
  availabilityZone: 'us-west-2a',
  //ipv6CidrBlock: new Ipv6Cidr('2001:db8::/48'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

