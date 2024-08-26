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
import { AddressFamily, AwsServiceName, Ipam, IpamPoolPublicIpSource } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';

/**
 * Integ test for VPC with IPAM pool to be run with --no-clean
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha');

const ipam = new Ipam(stack, 'IpamTest', {
  operatingRegion: ['ap-south-1'],
});

/**Test Ipam Pool Ipv4 */

const pool1 = ipam.privateScope.addPool('PrivatePool0', {
  addressFamily: AddressFamily.IP_V4,
  ipv4ProvisionedCidrs: ['10.2.0.0/16'],
  locale: 'ap-south-1',
});

const pool2 = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V6,
  awsService: AwsServiceName.EC2,
  locale: 'ap-south-1',
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});
pool2.provisionCidr('PublicPool0Cidr', { netmaskLength: 52 } );

/** Test Ipv4 Primary and Secondary address IpvIPAM */
new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4Ipam({
      ipamPool: pool1,
      netmaskLength: 20,
      cidrBlockName: 'ipv4IpamCidr',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

new vpc_v2.VpcV2(stack, 'Vpc-integ-test-2', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv6Ipam({
    ipamPool: pool2,
    netmaskLength: 60,
    cidrBlockName: 'Ipv6IpamCidr',
  })],
});

/**
 * Integ test for VPC with IPAM pool to be run with --no-clean
 *  due to dependency on de-allocation of provisioned ipv6 CIDR
 */
new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});