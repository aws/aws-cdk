#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';

/**
 * Integration test for AwsCustomResource External ID support.
 * 
 * This test demonstrates the use of external IDs when assuming roles 
 * in cross-account scenarios to prevent "confused deputy" attacks.
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'aws-custom-resource-external-id-test');

// Create a role that requires an external ID
const externalId = 'test-external-id-12345';
const roleWithExternalId = new iam.Role(stack, 'RoleWithExternalId', {
  assumedBy: new iam.CompositePrincipal(
    new iam.ServicePrincipal('lambda.amazonaws.com'),
    new iam.AccountRootPrincipal()
  ),
  externalIds: [externalId],
  inlinePolicies: {
    STSPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['sts:GetCallerIdentity'],
          resources: ['*'],
        }),
      ],
    }),
  },
});

// Test 1: Basic external ID usage with onCreate
new AwsCustomResource(stack, 'BasicExternalIdTest', {
  installLatestAwsSdk: false,
  onCreate: {
    assumedRoleArn: roleWithExternalId.roleArn,
    externalId: externalId,
    service: 'STS',
    action: 'GetCallerIdentity',
    physicalResourceId: PhysicalResourceId.of('basic-external-id-test'),
  },
  policy: AwsCustomResourcePolicy.fromStatements([
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: [roleWithExternalId.roleArn],
    }),
  ]),
});

// Test 2: External ID with all lifecycle operations  
new AwsCustomResource(stack, 'FullLifecycleExternalIdTest', {
  installLatestAwsSdk: false,
  onCreate: {
    assumedRoleArn: roleWithExternalId.roleArn,
    externalId: externalId,
    service: 'STS',
    action: 'GetCallerIdentity',
    physicalResourceId: PhysicalResourceId.of('full-lifecycle-test'),
  },
  onUpdate: {
    assumedRoleArn: roleWithExternalId.roleArn,
    externalId: externalId,
    service: 'STS', 
    action: 'GetCallerIdentity',
  },
  onDelete: {
    assumedRoleArn: roleWithExternalId.roleArn,
    externalId: externalId,
    service: 'STS',
    action: 'GetCallerIdentity',
  },
  policy: AwsCustomResourcePolicy.fromStatements([
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: [roleWithExternalId.roleArn],
    }),
  ]),
});

// Test 3: Cross-region call with external ID
new AwsCustomResource(stack, 'CrossRegionExternalIdTest', {
  installLatestAwsSdk: false,
  onCreate: {
    assumedRoleArn: roleWithExternalId.roleArn,
    externalId: externalId,
    region: 'us-west-2', // Different region
    service: 'STS',
    action: 'GetCallerIdentity',
    physicalResourceId: PhysicalResourceId.of('cross-region-test'),
  },
  policy: AwsCustomResourcePolicy.fromStatements([
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: [roleWithExternalId.roleArn],
    }),
  ]),
});

// Test 4: Different external IDs for different operations
const createExternalId = 'create-external-id-456';
const updateExternalId = 'update-external-id-789';

const createRole = new iam.Role(stack, 'CreateRole', {
  assumedBy: new iam.CompositePrincipal(
    new iam.ServicePrincipal('lambda.amazonaws.com'),
    new iam.AccountRootPrincipal()
  ),
  externalIds: [createExternalId],
  inlinePolicies: {
    STSPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['sts:GetCallerIdentity'],
          resources: ['*'],
        }),
      ],
    }),
  },
});

const updateRole = new iam.Role(stack, 'UpdateRole', {
  assumedBy: new iam.CompositePrincipal(
    new iam.ServicePrincipal('lambda.amazonaws.com'),
    new iam.AccountRootPrincipal()
  ),
  externalIds: [updateExternalId],
  inlinePolicies: {
    STSPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['sts:GetCallerIdentity'],
          resources: ['*'],
        }),
      ],
    }),
  },
});

new AwsCustomResource(stack, 'DifferentExternalIdsTest', {
  installLatestAwsSdk: false,
  onCreate: {
    assumedRoleArn: createRole.roleArn,
    externalId: createExternalId,
    service: 'STS',
    action: 'GetCallerIdentity',
    physicalResourceId: PhysicalResourceId.of('different-external-ids-test'),
  },
  onUpdate: {
    assumedRoleArn: updateRole.roleArn,
    externalId: updateExternalId,
    service: 'STS',
    action: 'GetCallerIdentity',
  },
  policy: AwsCustomResourcePolicy.fromStatements([
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: [createRole.roleArn, updateRole.roleArn],
    }),
  ]),
});

// Export values to verify the functionality
new cdk.CfnOutput(stack, 'RoleWithExternalIdArn', {
  value: roleWithExternalId.roleArn,
  description: 'ARN of the role that requires an external ID',
});

new cdk.CfnOutput(stack, 'ExternalIdUsed', {
  value: externalId,
  description: 'The external ID used for role assumption',
});

// Integration test configuration
new IntegTest(app, 'AwsCustomResourceExternalIdIntegTest', {
  testCases: [stack],
  diffAssets: true,
  stackUpdateWorkflow: true,
});
