import * as vpc_v2 from '../lib/vpc-v2';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VpcPeeringSameAccountIntegStack');

const acceptorVpc = new vpc_v2.VpcV2(stack, 'acceptorVpc', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
});

// Same account VPC peering
const requestorVpc = new vpc_v2.VpcV2(stack, 'requestorVpcSameAccount', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
});

const connection = requestorVpc.createPeeringConnection('sameAccountPeering', {
  acceptorVpc: acceptorVpc,
});

const integ = new IntegTest(app, 'VpcSameAccountInteg', {
  testCases: [stack],
});

// Assertion to verify peering connection is established successfully
const peeringAssertion = integ.assertions.awsApiCall('EC2', 'describeVpcPeeringConnections', {
  // Pass id of the peering connection
  VpcPeeringConnectionIds: [connection.routerTargetId],
});

peeringAssertion.expect(ExpectedResult.objectLike({
  VpcPeeringConnections: Match.arrayWith([
    Match.objectLike({
      Status: {
        Code: 'active',
      },
    }),
  ]),
}));

