import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { CfnIPAM, CfnIPAMPool, IpAddresses, Subnet, Vpc } from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

/*
 * Stack verification steps:
 * * The subnet is created without a CidrBlock property; IPAM allocates its CIDR at deploy time
 * * The assertion checks that the allocated CIDR is the first /24 of the pool's provisioned range
 *
 * ### MANUAL CLEAN UP REQUIRED ###
 *
 * The IPAM and the pool are retained after the test run. An account can have only one IPAM
 * per Region, so delete it before running this test again in the same Region:
 *   aws ec2 delete-ipam --ipam-id <ipam-id> --cascade
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-ipam-subnet');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

// Pools in the private scope require the IPAM Advanced Tier
const ipam = new CfnIPAM(stack, 'IPAM', {
  tier: 'advanced',
  operatingRegions: [
    { regionName: stack.region },
  ],
  tags: [{
    key: 'stack',
    value: stack.stackId,
  }],
});
ipam.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

// A VPC with a concrete CIDR and no subnets of its own
const vpc = new Vpc(stack, 'Vpc', {
  ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
  subnetConfiguration: [],
});

// A resource planning pool for the VPC: subnets can only be allocated from a pool whose
// source resource is the VPC, and it provisions the VPC CIDR
const pool = new CfnIPAMPool(stack, 'Pool', {
  description: 'Resource planning pool for the VPC',
  addressFamily: 'ipv4',
  autoImport: false,
  locale: stack.region,
  ipamScopeId: ipam.attrPrivateDefaultScopeId,
  sourceResource: {
    resourceId: vpc.vpcId,
    resourceOwner: stack.account,
    resourceRegion: stack.region,
    resourceType: 'vpc',
  },
  provisionedCidrs: [{
    cidr: '10.0.0.0/16',
  }],
});
pool.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

const subnet = new Subnet(stack, 'IpamSubnet', {
  vpcId: vpc.vpcId,
  availabilityZone: vpc.availabilityZones[0],
  ipv4IpamAllocation: {
    ipamPool: pool,
    netmaskLength: 24,
  },
});

const integ = new IntegTest(app, 'SubnetIpam', {
  testCases: [stack],
  allowDestroy: ['EC2::IPAM'],
});

// The first allocation from a fresh pool is the lowest /24 of the provisioned range
integ.assertions.awsApiCall('EC2', 'describeSubnets', {
  SubnetIds: [subnet.subnetId],
}).expect(ExpectedResult.objectLike({
  Subnets: [
    {
      CidrBlock: '10.0.0.0/24',
    },
  ],
}));
