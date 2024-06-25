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
import { AddressFamily, Ipam } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Ipv4Cidr, /*Ipv6Cidr,*/ SubnetV2 } from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

// as in unit tests, we use a qualified import,
// not bring in individual classes
//import * as er from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha-new');

const ipam = new Ipam(stack, 'Ipam');

const pool = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V4,
  provisionedCidrs: [{ cidr: '10.2.0.0/16' }],
  locale: 'us-west-2',
});

const vpc = new vpc_v2.VpcV2(stack, 'VPCTest', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4Ipam({
      ipv4IpamPool: pool,
      ipv4NetmaskLength: 20,
    }),
    vpc_v2.IpAddresses.amazonProvidedIpv6(),
    // vpc_v2.IpAddresses.ipv4('192.168.0.0/16'), Test for invalid RFC range
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: 'us-west-2a',
  cidrBlock: new Ipv4Cidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

//const selection = vpc.selectSubnets();
vpc.enableVpnGateway({
  vpnRoutePropagation: [{
    subnetType: SubnetType.PRIVATE_ISOLATED, // optional, defaults to "PUBLIC"
  }],
  type: 'ipsec.1',
});

//log(selection)

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

