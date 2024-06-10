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

// as in unit tests, we use a qualified import,
// not bring in individual classes
//import * as er from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha');

const ipam = new Ipam(stack, 'Ipam');

const pool = ipam.publicScope.addPool({
  addressFamily: AddressFamily.IP_V4,
  provisionedCidrs: [{ cidr: '10.2.0.0/16' }],
});

new vpc_v2.VpcV2(stack, 'VPCTest', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv4Ipam({
    ipv4IpamPoolId: pool,
    netmaskLength: 20,
  })],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

// new er.ExampleResource(stack, 'ExampleResource', {
//   // we don't want to leave trash in the account after running the deployment of this
//   removalPolicy: core.RemovalPolicy.DESTROY,
// });

app.synth();

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});
