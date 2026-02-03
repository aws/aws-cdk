/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { AddressFamily, AwsServiceName, IpCidr, Ipam, IpamPoolPublicIpSource, SubnetV2 } from '../lib';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha-integ-ipam');

const ipam = new Ipam(stack, 'IpamTest');

const pool1 = ipam.privateScope.addPool('PrivatePool0', {
  addressFamily: AddressFamily.IP_V4,
  ipv4ProvisionedCidrs: ['10.2.0.0/16'],
  locale: stack.region,
});

const pool2 = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V6,
  awsService: AwsServiceName.EC2,
  locale: stack.region,
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});
const poolCidr = pool2.provisionCidr('PublicPool0Cidr', { netmaskLength: 52 });

const vpc = new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4Ipam({
      ipamPool: pool1,
      netmaskLength: 20,
      cidrBlockName: 'ipv4IpamCidr',
    }),
    vpc_v2.IpAddresses.ipv6Ipam({
      ipamPool: pool2,
      netmaskLength: 60,
      cidrBlockName: 'Ipv6IpamCidr',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: stack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/**
 * Custom resource to ensure IPAM pool allocations are fully released before
 * CloudFormation attempts to deprovision the pool CIDR. The VPC CIDR block
 * disassociation is async — CloudFormation may try to deprovision the pool
 * CIDR before the allocation is actually released, causing DELETE_FAILED.
 *
 * Deletion ordering: VPC deleted → cleanup waits for allocs to drain → pool CIDR deprovisioned
 */
const cleanupFn = new NodejsFunction(stack, 'IpamCleanupFn', {
  runtime: Runtime.NODEJS_LATEST,
  entry: path.join(__dirname, 'ipam-cleanup-handler', 'index.ts'),
  handler: 'handler',
  timeout: cdk.Duration.minutes(15),
  initialPolicy: [new iam.PolicyStatement({
    actions: ['ec2:GetIpamPoolAllocations', 'ec2:GetIpamPoolCidrs', 'ec2:DeprovisionIpamPoolCidr'],
    resources: ['*'],
  })],
});

const cleanupProvider = new Provider(stack, 'IpamCleanupProvider', {
  onEventHandler: cleanupFn,
});

const cleanup = new cdk.CustomResource(stack, 'IpamPoolCleanup', {
  serviceToken: cleanupProvider.serviceToken,
  properties: { PoolId: pool2.ipamPoolId },
});

// Deletion order: VPC → cleanup (waits for allocs to drain + deprovisions) → pool CIDR
vpc.node.addDependency(cleanup);
cleanup.node.addDependency(poolCidr);

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});
