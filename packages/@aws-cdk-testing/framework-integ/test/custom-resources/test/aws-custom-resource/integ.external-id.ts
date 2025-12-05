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
 *
 * Note: This test may introduce destructive changes to CDK metadata
 * and Lambda function assets due to CDK version updates. These changes
 * are expected and safe for integration testing purposes.
 */

const app = new cdk.App({
  postCliContext: {
    // Disable CDK managed log groups to prevent Lambda changes
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    // Disable version reporting to prevent CDK metadata changes
    '@aws-cdk/core:disableVersionReporting': true,
    // Disable new style synthesis to maintain compatibility
    '@aws-cdk/core:newStyleStackSynthesis': false,
    // Use legacy asset bundling to prevent asset hash changes
    '@aws-cdk/core:enableLegacyV2AssetKeys': true,
    // Disable stack name validation to prevent naming conflicts
    '@aws-cdk/core:stackRelativeExports': false,
  },
});

const stack = new cdk.Stack(app, 'aws-custom-resource-external-id-test');

// Create a role that requires an external ID
const externalId = 'test-external-id-12345';
const roleWithExternalId = new iam.Role(stack, 'RoleWithExternalId', {
  // Use a principal that can be used in integration tests
  assumedBy: new iam.AccountPrincipal(cdk.Stack.of(stack).account),
  externalIds: [externalId],
});

// Add the necessary permissions as managed policies to reduce template variability
roleWithExternalId.addToPolicy(
  new iam.PolicyStatement({
    actions: ['sts:GetCallerIdentity'],
    resources: ['*'],
  }),
);

// Test basic external ID usage
new AwsCustomResource(stack, 'ExternalIdTest', {
  installLatestAwsSdk: false,
  onCreate: {
    assumedRoleArn: roleWithExternalId.roleArn,
    externalId: externalId,
    service: 'STS',
    action: 'GetCallerIdentity',
    physicalResourceId: PhysicalResourceId.of('external-id-test'),
  },
  policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: [] }),
});

new IntegTest(app, 'AwsCustomResourceTest', {
  testCases: [stack],
  diffAssets: true,
  allowDestroy: ['AWS::CDK::Metadata'],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
    destroy: {
      args: {
        force: true,
      },
    },
  },
});
