/*
 * Integration test for VPC with CloudFormation Parameter CIDR
 * This test validates that VpcV2 can accept Token-based CIDR values
 * enabling AWS Service Catalog deployments and multi-tenant scenarios.
 *
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-parameter-cidr');

// Create CloudFormation Parameter for VPC CIDR
const vpcCidr = new cdk.CfnParameter(stack, 'VpcCidr', {
  type: 'String',
  default: '10.5.0.0/16',
  description: 'VPC CIDR block for runtime allocation',
  allowedPattern: '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\\/(1[6-9]|2[0-8]))$',
  constraintDescription: 'CIDR block parameter must be in the form x.x.x.x/16-28',
});

// Create VPC with Token-based CIDR (CloudFormation Parameter)
const vpc = new vpc_v2.VpcV2(stack, 'VpcWithParameterCidr', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4(vpcCidr.valueAsString),
  enableDnsHostnames: true,
  enableDnsSupport: true,
  vpcName: 'ParameterizedVpc',
});

// Create subnets using Fn::Cidr for runtime calculation
// Subnet 1: Public subnet in us-west-2a
new SubnetV2(stack, 'PublicSubnet1', {
  vpc,
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr(
    cdk.Fn.select(0, cdk.Fn.cidr(vpc.vpcCidrBlock, 6, '8')),
  ),
  subnetType: SubnetType.PUBLIC,
});

// Subnet 2: Public subnet in us-west-2b
new SubnetV2(stack, 'PublicSubnet2', {
  vpc,
  availabilityZone: 'us-west-2b',
  ipv4CidrBlock: new IpCidr(
    cdk.Fn.select(1, cdk.Fn.cidr(vpc.vpcCidrBlock, 6, '8')),
  ),
  subnetType: SubnetType.PUBLIC,
});

// Subnet 3: Private subnet in us-west-2a
new SubnetV2(stack, 'PrivateSubnet1', {
  vpc,
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr(
    cdk.Fn.select(2, cdk.Fn.cidr(vpc.vpcCidrBlock, 6, '8')),
  ),
  subnetType: SubnetType.PRIVATE_WITH_EGRESS,
});

// Subnet 4: Private subnet in us-west-2b
new SubnetV2(stack, 'PrivateSubnet2', {
  vpc,
  availabilityZone: 'us-west-2b',
  ipv4CidrBlock: new IpCidr(
    cdk.Fn.select(3, cdk.Fn.cidr(vpc.vpcCidrBlock, 6, '8')),
  ),
  subnetType: SubnetType.PRIVATE_WITH_EGRESS,
});

// Output the VPC ID and CIDR for validation
new cdk.CfnOutput(stack, 'VpcId', {
  value: vpc.vpcId,
  description: 'VPC ID',
});

new cdk.CfnOutput(stack, 'VpcCidrBlock', {
  value: vpc.vpcCidrBlock,
  description: 'VPC CIDR Block',
});

new IntegTest(app, 'VpcV2ParameterCidrIntegTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
