import * as cdk from '@aws-cdk/core';
import { AwsCustomResource, PhysicalResourceId, AwsCustomResourcePolicy } from '@aws-cdk/custom-resources';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import { AwsIpam, CfnIPAM, CfnIPAMPool, CfnVPC, SubnetType, Vpc } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-ipam-vpc');

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
  ipamProvider: new AwsIpam({
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

new AwsCustomResource(stack, 'cleanUpIpam', { // Cleanup as the IPAM does not delete otherwise, must use aws-sdk-js2 newer than: 1094.0
  installLatestAwsSdk: true,
  onCreate: {
    service: 'EC2',
    action: 'deleteIpam',
    parameters: {
      IpamId: ipam.getAtt('IpamId').toString(),
      Cascade: true,
    },
    physicalResourceId: PhysicalResourceId.of('cleanUpIpam'),
  },

  policy: AwsCustomResourcePolicy.fromSdkCalls({
    resources: AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
}).node.addDependency(awsIpamVpc);


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
  "Vpcs": [
      {
          "CidrBlock": "100.100.0.0/18",
      }
  ]
}));

app.synth();


