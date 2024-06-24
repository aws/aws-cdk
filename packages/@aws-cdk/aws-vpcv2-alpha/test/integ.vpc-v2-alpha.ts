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
import { AddressFamily, Ipam } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha');

const ipam = new Ipam(stack, 'Ipam');

/**Test Ipam Pool Ipv4 */

const pool1 = ipam.privateScope.addPool({
  addressFamily: AddressFamily.IP_V4,
  provisionedCidrs: [{ cidr: '10.2.0.0/16' }],
  locale: 'eu-west-1',
});

ipam.publicScope.addPool({
  addressFamily: AddressFamily.IP_V6,
  awsService: 'ec2',
  locale: 'eu-west-1',
  publicIpSource: 'amazon',
});

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

new vpc_v2.VpcV2(stack, 'Vpc-integ-test-2', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  // secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv6Ipam({
  //   ipv6IpamPool: pool2,
  //   ipv6NetmaskLength: 52,
  // })],
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});
