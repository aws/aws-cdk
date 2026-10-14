/*
 * Integration test focused on SubnetV2 availabilityZoneId functionality.
 *
 * This test validates that SubnetV2 can be created using availabilityZoneId
 * instead of availabilityZone, which is useful for cross-account scenarios
 * where AZ names may differ but AZ IDs remain consistent.
 *
 * REGION RESTRICTION: This test is restricted to us-east-1 because:
 * 1. The AZ ID mapping is hardcoded for us-east-1 (use1-az1, use1-az2, etc.)
 * 2. Different regions have different AZ ID prefixes (e.g., usw2-az1 for us-west-2)
 * 3. Each region has a different number of availability zones
 * 4. To support other regions, we'd need region-specific mappings
 */

import * as vpc_v2 from '../lib/vpc-v2';
import { IpCidr, SubnetV2 } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Token } from 'aws-cdk-lib';

const app = new cdk.App();

const supportedRegions = ['us-east-1'];
// Since the AZ IDs are hard-coded for us-east-1 in the mapping below,
// we need to restrict this test to that specific region.
const stack = new cdk.Stack(app, 'aws-cdk-subnet-v2-zone-id-test', {
  env: { region: 'us-east-1' },
});

if (process.env.CDK_INTEG_ACCOUNT !== '12345678') {
  // only validate if we are about to actually deploy.
  // TODO: better way to determine this, right now the 'CDK_INTEG_ACCOUNT' seems like the only way.
  if (Token.isUnresolved(stack.region)) {
    throw new Error(`region (${stack.region}) cannot be a token and must be configured to one of: ${supportedRegions}`);
  }
  if (!supportedRegions.includes(stack.region)) {
    throw new Error(`region (${stack.region}) must be configured to one of: ${supportedRegions}`);
  }
}

// Create VPC for testing with a unique CIDR to avoid conflicts
const vpc = new vpc_v2.VpcV2(stack, 'ZoneIdTestVpc', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.3.0.0/16'),
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

/**
 * AZ ID mapping for us-east-1 region
 *
 * IMPORTANT: AZ IDs are account-specific! The mapping below may not match
 * your AWS account. AZ IDs like 'use1-az1' are randomized per account to
 * distribute load across AWS infrastructure.
 *
 * Use AWS CLI to generate the correct mapping for your account:
 *
 * ```bash
 * aws ec2 describe-availability-zones --region us-east-1 \
 *   --output json | \
 *   jq -r '.AvailabilityZones | sort_by(.ZoneId) |
 *     to_entries |
 *     map("  az\(.key + 1): '\''\(.value.ZoneId)'\''") |
 *     ["{"] + . + ["}"] |
 *     join(",\n")'
 * ```
 */
const azIdMapping = new cdk.CfnMapping(stack, 'AZIdMapping', {
  mapping: {
    'us-east-1': {
      az1: 'use1-az4',
      az2: 'use1-az6',
      az3: 'use1-az1',
      az4: 'use1-az2',
      az5: 'use1-az3',
      az6: 'use1-az5',
    },
  },
});

/**
 * Test 1: Subnet with hardcoded AZ ID
 */
new SubnetV2(stack, 'SubnetWithHardcodedZoneId', {
  vpc,
  availabilityZoneId: 'use1-az4',
  ipv4CidrBlock: new IpCidr('10.3.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/**
 * Test 2: Subnet with AZ ID from mapping
 */
new SubnetV2(stack, 'SubnetWithMappedZoneId', {
  vpc,
  availabilityZoneId: azIdMapping.findInMap(cdk.Aws.REGION, 'az2'),
  ipv4CidrBlock: new IpCidr('10.3.1.0/24'),
  subnetType: SubnetType.PRIVATE_WITH_EGRESS,
});

/**
 * Test 3: Subnet with context-based AZ ID (allows override via context)
 */
const contextAzId = stack.node.tryGetContext('availabilityZoneId') ||
    azIdMapping.findInMap(cdk.Aws.REGION, 'az3');

new SubnetV2(stack, 'SubnetWithContextZoneId', {
  vpc,
  availabilityZoneId: contextAzId,
  ipv4CidrBlock: new IpCidr('10.3.2.0/24'),
  subnetType: SubnetType.PUBLIC,
});

/**
 * Test 4: Multiple subnets across different AZ IDs
 */
const azIds = ['az1', 'az2', 'az3'];
azIds.forEach((azKey, index) => {
  new SubnetV2(stack, `MultiZoneSubnet${index + 1}`, {
    vpc,
    availabilityZoneId: azIdMapping.findInMap(cdk.Aws.REGION, azKey),
    ipv4CidrBlock: new IpCidr(`10.3.${10 + index}.0/24`),
    subnetType: SubnetType.PRIVATE_ISOLATED,
  });
});

new IntegTest(app, 'subnet-v2-zone-id-integ-test', {
  testCases: [stack],
});

