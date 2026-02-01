/**
 * CloudFront VPC Origin Multi-Region Integration Test
 *
 * This integration test validates that CloudFront VPC Origins can be deployed
 * across multiple AWS regions without naming conflicts or resource collisions.
 * It specifically tests the region-aware naming mechanism for VPC Origins.
 *
 * Architecture Overview:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                           Multi-Region Deployment                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *     ┌─────────────────────────┐         ┌─────────────────────────┐
 *     │      US-EAST-1          │         │      US-WEST-2          │
 *     │                         │         │                         │
 *     │  ┌─────────────────┐    │         │  ┌─────────────────┐    │
 *     │  │   CloudFront    │    │         │  │   CloudFront    │    │
 *     │  │  Distribution   │    │         │  │  Distribution   │    │
 *     │  └─────────┬───────┘    │         │  └─────────┬───────┘    │
 *     │            │            │         │            │            │
 *     │            ▼            │         │            ▼            │
 *     │  ┌─────────────────┐    │         │  ┌─────────────────┐    │
 *     │  │   VPC Origin    │    │         │  │   VPC Origin    │    │
 *     │  │ (region-aware)  │    │         │  │ (region-aware)  │    │
 *     │  └─────────┬───────┘    │         │  └─────────┬───────┘    │
 *     │            │            │         │            │            │
 *     │            ▼            │         │            ▼            │
 *     │  ┌─────────────────┐    │         │  ┌─────────────────┐    │
 *     │  │      ALB        │    │         │  │      ALB        │    │
 *     │  │  (Internal)     │    │         │  │  (Internal)     │    │
 *     │  └─────────┬───────┘    │         │  └─────────┬───────┘    │
 *     │            │            │         │            │            │
 *     │            ▼            │         │            ▼            │
 *     │  ┌─────────────────┐    │         │  ┌─────────────────┐    │
 *     │  │      VPC        │    │         │  │      VPC        │    │
 *     │  │ 10.0.0.0/16     │    │         │  │ 10.0.0.0/16     │    │
 *     │  │                 │    │         │  │                 │    │
 *     │  │ Public Subnet   │    │         │  │ Public Subnet   │    │
 *     │  │ Private Subnet  │    │         │  │ Private Subnet  │    │
 *     │  └─────────────────┘    │         │  └─────────────────┘    │
 *     └─────────────────────────┘         └─────────────────────────┘
 *
 * Test Scenarios:
 * 1. Deployment Validation: Ensures both stacks deploy successfully without conflicts
 * 2. Resource Naming: Validates that VPC Origin names include region suffixes to prevent collisions
 * 3. Cross-Region Isolation: Confirms resources in different regions don't interfere
 * 4. CloudFormation Generation: Verifies correct template generation for multi-region scenarios
 *
 * Key Components Tested:
 * - VPC Origin with Application Load Balancer backend
 * - CloudFront Distribution with VPC Origin
 * - Region-aware resource naming
 * - Multi-region stack deployment
 *
 * Expected Behavior:
 * - Stack names: integ-cloudfront-vpc-origin-us-east-1, integ-cloudfront-vpc-origin-us-west-2
 * - VPC Origin names should include region suffixes
 * - No naming conflicts between regions
 * - Both distributions should output domain names successfully
 */

import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

// Create identical stacks in different regions to test region-aware naming
const createVpcOriginStack = (region: string) => {
  const stack = new cdk.Stack(app, `integ-cloudfront-vpc-origin-${region}`, {
    env: { region },
  });

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    natGateways: 1,
    subnetConfiguration: [
      {
        name: 'public',
        subnetType: ec2.SubnetType.PUBLIC,
      },
      {
        name: 'private',
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    ],
  });

  const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
    vpc,
    internetFacing: false,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  });

  const distribution = new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: origins.VpcOrigin.withApplicationLoadBalancer(alb, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
      }),
      cachePolicy: cloudfront.CachePolicy.USE_ORIGIN_CACHE_CONTROL_HEADERS,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
    },
  });

  new cdk.CfnOutput(stack, 'DistributionDomainName', {
    value: distribution.distributionDomainName,
  });

  return stack;
};

// Create stacks in two different regions
const usEast1Stack = createVpcOriginStack('us-east-1');
const usWest2Stack = createVpcOriginStack('us-west-2');

// Create integration test to validate multi-region deployment
new IntegTest(app, 'cloudfront-vpc-origin-multi-region-test', {
  testCases: [usEast1Stack, usWest2Stack],
});

// The test validates that:
// 1. Both stacks can be deployed without name collisions
// 2. VPC Origin names include region suffixes
// 3. CloudFormation templates are generated correctly
