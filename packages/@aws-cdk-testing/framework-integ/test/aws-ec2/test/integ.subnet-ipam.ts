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
 * As in integ.vpc-ipam.ts, the IPAM and the pool are retained after the test run and must be
 * deleted manually.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-ipam-subnet');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

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

// A VPC with a concrete CIDR and no subnets of its own
const vpc = new Vpc(stack, 'Vpc', {
  ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
  subnetConfiguration: [],
});

// A pool that plans the VPC's address space for subnets: it provisions the VPC CIDR
const pool = new CfnIPAMPool(stack, 'Pool', {
  description: 'Subnet pool for the VPC',
  addressFamily: 'ipv4',
  autoImport: false,
  locale: stack.region,
  ipamScopeId: ipam.attrPrivateDefaultScopeId,
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
