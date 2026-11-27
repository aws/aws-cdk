import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { CfnIPAM, CfnIPAMPool, IpAddresses, IpProtocol, Subnet, Vpc } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/*
 * Stack verification steps:
 * * The subnet is created without an Ipv6CidrBlock property; IPAM allocates its IPv6 CIDR at deploy time
 * * The assertion checks that the subnet has an IPv6 CIDR block with a /64 netmask
 *
 * An account can have only one IPAM per Region, so run this test in a Region without an IPAM.
 * If the pool deletion times out because IPAM is slow to release the subnet's allocation,
 * delete the IPAM with:
 *   aws ec2 delete-ipam --ipam-id <ipam-id> --cascade
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-ipam-subnet-ipv6');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

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

// A dual-stack VPC with an Amazon-provided IPv6 CIDR block and no subnets of its own
const vpc = new Vpc(stack, 'Vpc', {
  ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
  ipProtocol: IpProtocol.DUAL_STACK,
  subnetConfiguration: [],
});

// Amazon-provided IPv6 CIDR blocks are public, so IPAM monitors the VPC's IPv6 CIDR in the
// public default scope. IPAM takes several minutes to discover a new VPC, and the pool below
// fails until the VPC is monitored in the scope, so wait until IPAM lists the VPC there.
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
  return { IsComplete: res.IpamResourceCidrs.some((c) => c.ResourceCidr && c.ResourceCidr.includes(':')) };
};
  `),
});
isVpcDiscovered.addToRolePolicy(new PolicyStatement({
  actions: ['ec2:GetIpamResourceCidrs'],
  resources: [stack.formatArn({
    service: 'ec2',
    region: '',
    resource: 'ipam-scope',
    resourceName: ipam.attrPublicDefaultScopeId,
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
    IpamScopeId: ipam.attrPublicDefaultScopeId,
    VpcId: vpc.vpcId,
  },
});
// Wait for the VPC's IPv6 CIDR block association as well, not only the VPC
vpcDiscovered.node.addDependency(vpc);

// An IPv6 resource planning pool for the VPC: it provisions the VPC's IPv6 CIDR block, and
// the subnet's IPv6 CIDR is allocated from it
const pool = new CfnIPAMPool(stack, 'Ipv6Pool', {
  description: 'IPv6 resource planning pool for the VPC',
  addressFamily: 'ipv6',
  autoImport: false,
  locale: stack.region,
  ipamScopeId: ipam.attrPublicDefaultScopeId,
  sourceResource: {
    resourceId: vpc.vpcId,
    resourceOwner: stack.account,
    resourceRegion: stack.region,
    resourceType: 'vpc',
  },
  provisionedCidrs: [{
    cidr: cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks),
  }],
});
pool.node.addDependency(vpcDiscovered);

const subnet = new Subnet(stack, 'IpamIpv6Subnet', {
  vpcId: vpc.vpcId,
  availabilityZone: vpc.availabilityZones[0],
  cidrBlock: '10.0.0.0/24',
  ipv6IpamAllocation: {
    ipamPool: pool,
    netmaskLength: 64,
  },
  assignIpv6AddressOnCreation: true,
});

const integ = new IntegTest(app, 'SubnetIpv6Ipam', {
  testCases: [stack],
});

// The Amazon-provided block is not known in advance, so check only the netmask of the allocation
integ.assertions.awsApiCall('EC2', 'describeSubnets', {
  SubnetIds: [subnet.subnetId],
}).expect(ExpectedResult.objectLike({
  Subnets: [
    {
      Ipv6CidrBlockAssociationSet: [
        {
          Ipv6CidrBlock: Match.stringLikeRegexp('/64$'),
        },
      ],
    },
  ],
}));
