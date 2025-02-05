import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IpAddresses, CfnIPAM, CfnIPAMPool, CfnVPC, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-ipam-vpc');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

/**
 * ### MANUAL CLEAN UP REQUIRED ###
 *
 * When IPAM is created running this integ-test it is not currently removed after the test run is complete.
 *
 */

const ipam = new CfnIPAM(stack, 'IPAM', {
  operatingRegions: [
    { regionName: stack.region },
  ],
  tags: [{
    key: 'stack',
    value: stack.stackId,
  }],
});
ipam.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

const pool = new CfnIPAMPool(stack, 'Pool', {
  description: 'Testing pool',
  addressFamily: 'ipv4',
  autoImport: false,
  locale: stack.region,
  ipamScopeId: ipam.attrPrivateDefaultScopeId,
  provisionedCidrs: [{
    cidr: '100.100.0.0/16',
  }],
});
pool.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

const awsIpamVpc = new Vpc(stack, 'AwsIpamVpc', {
  ipAddresses: IpAddresses.awsIpamAllocation({
    ipv4IpamPoolId: pool.ref,
    ipv4NetmaskLength: 18,
    defaultSubnetIpv4NetmaskLength: 24,
  }),
  maxAzs: 2,
  subnetConfiguration: [{
    name: 'private',
    subnetType: SubnetType.PRIVATE_ISOLATED,
    cidrMask: 24,
  }],
});

// needs AwsApiCall Support for installLatestAwsSdk first, or another way to clean the Ipam
// new AwsApiCall(stack, 'cleanUpIpam', {
//   service: 'EC2',
//   api: 'deleteIpam',
//   installLatestAwsSdk: true,
//   parameters: {
//     IpamId: ipam.attrIpamId,
//     Cascade: true,
//   },
// });

/**
 * Testing That the Vpc is Deployed with the correct Cidrs.
 **/
const integ = new IntegTest(app, 'Vpc-Ipam', {
  testCases: [stack],
  allowDestroy: ['EC2::IPAM'],
});

integ.assertions.awsApiCall('EC2', 'describeVpcs', {
  VpcIds: [(awsIpamVpc.node.defaultChild as CfnVPC).getAtt('VpcId').toString()],
}).expect(ExpectedResult.objectLike({
  Vpcs: [
    {
      CidrBlock: '100.100.0.0/18',
    },
  ],
}));

app.synth();

