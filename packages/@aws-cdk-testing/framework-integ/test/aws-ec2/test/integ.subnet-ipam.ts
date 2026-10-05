import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { CfnIPAM, CfnIPAMPool, IpAddresses, Subnet, Vpc } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

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
 * Each run also leaves five retained Lambda log groups (/aws/lambda/aws-cdk-ec2-ipam-subnet-*).
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

// IPAM takes several minutes to discover a new VPC, and the pool below fails until the VPC is
// monitored in the scope, so wait until IPAM lists the VPC in the private default scope
const isVpcDiscovered = new Function(stack, 'IsVpcDiscovered', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(30),
  memorySize: 256,
  code: Code.fromInline(`
const { EC2Client, GetIpamResourceCidrsCommand } = require('@aws-sdk/client-ec2');
exports.handler = async (event) => {
  if (event.RequestType === 'Delete') return { IsComplete: true };
  const res = await new EC2Client().send(new GetIpamResourceCidrsCommand({
    IpamScopeId: event.ResourceProperties.IpamScopeId,
    ResourceId: event.ResourceProperties.VpcId,
  }));
  return { IsComplete: res.IpamResourceCidrs.length > 0 };
};
  `),
});
isVpcDiscovered.addToRolePolicy(new PolicyStatement({
  actions: ['ec2:GetIpamResourceCidrs'],
  resources: [stack.formatArn({
    service: 'ec2',
    region: '',
    resource: 'ipam-scope',
    resourceName: ipam.attrPrivateDefaultScopeId,
  })],
}));

const vpcDiscoveredProvider = new Provider(stack, 'VpcDiscoveredProvider', {
  onEventHandler: new Function(stack, 'OnVpcDiscoveredEvent', {
    runtime: STANDARD_NODEJS_RUNTIME,
    handler: 'index.handler',
    code: Code.fromInline('exports.handler = async () => ({});'),
  }),
  isCompleteHandler: isVpcDiscovered,
  queryInterval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(45),
});

const vpcDiscovered = new cdk.CustomResource(stack, 'VpcDiscovered', {
  serviceToken: vpcDiscoveredProvider.serviceToken,
  properties: {
    IpamScopeId: ipam.attrPrivateDefaultScopeId,
    VpcId: vpc.vpcId,
  },
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
pool.node.addDependency(vpcDiscovered);

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
