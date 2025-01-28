import * as vpc_v2 from '../lib/vpc-v2';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

/**
 * Instructions to run this test
 * 1. Replace requestor account with a valid requestor account id.
 * 2. Replace acceptor account with a valid acceptor account id.
 * 3. Replace the policyName to the new policy name created in acceptor account after first deployment.
 * 4. Replace vpcId under encoded policy to id of acceptor VPC once deployed in account.
 * 5. Run the test using `yarn integ integ.vpc-peerings.js`
 */

const requestorAccount = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const acceptorAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';
const policyName = 'acceptorVpcVpcPeeringRoleDefaultPolicyE79C72D0'; // Replace policy name

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

// Required only for cross-account peering connection, added here for assertion on policy
const peeringRole = acceptorVpc.createAcceptorVpcRole(requestorAccount);

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

const policyAssertion = integ.assertions.awsApiCall('IAM', 'GetRolePolicyCommand', {
  RoleName: peeringRole.roleName,
  PolicyName: policyName,
});

const encodedPolicy = encodeURIComponent(JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'ec2:AcceptVpcPeeringConnection',
      Resource: `arn:aws:ec2:eu-west-2:${acceptorAccount}:vpc/vpc-067bee2f1080d0e83`, // Replace VPC id here
      Effect: 'Allow',
    },
    {
      Condition: {
        StringEquals: {
          'ec2:AccepterVpc': `arn:aws:ec2:eu-west-2:${acceptorAccount}:vpc/vpc-067bee2f1080d0e83`, // Replace VPC id here
        },
      },
      Action: 'ec2:AcceptVpcPeeringConnection',
      Resource: `arn:aws:ec2:eu-west-2:${acceptorAccount}:vpc-peering-connection/*`,
      Effect: 'Allow',
    },
  ],
},
)).replace(/%2F\*/g, '%2F%2A'); // Needed to replace /* in the policy which is encoded as '%2F%2A' in API response of `GetRolePolicyCommand` policy document.

policyAssertion.expect(ExpectedResult.objectLike({
  PolicyDocument: encodedPolicy,
}));

