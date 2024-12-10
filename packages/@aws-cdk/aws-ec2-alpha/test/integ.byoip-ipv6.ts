/*
 * This integration test deploys a VPC that contains a BYOIP IPv6 address.
 * The address is owned by the CDK maintainers, who are able to run and
 * update the test if need be for future changes.
 */

import * as vpc_v2 from '../lib/vpc-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'vpc-byoip-ipv6');

new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv6Pool('TBD', {
        ipv6Pool: 'TBD',
        cidrBlockName: 'MyByoipIpv6Block',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

