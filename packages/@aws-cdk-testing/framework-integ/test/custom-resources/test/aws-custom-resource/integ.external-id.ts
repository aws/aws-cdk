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
    new iam.ArnPrincipal('arn:aws:iam::123456789012:role/TestAssumeRole')
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

new IntegTest(app, 'AwsCustomResourceExternalIdIntegTest', {
  testCases: [stack],
});
