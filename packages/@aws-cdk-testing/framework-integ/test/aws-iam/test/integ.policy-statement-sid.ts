import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test to verify that PolicyStatements with valid alphanumeric SIDs
 * can be successfully deployed to AWS.
 *
 * This test validates that the SID validation logic doesn't interfere with
 * actual CloudFormation deployment of valid PolicyStatements.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'PolicyStatementSidTest');

const role = new iam.Role(stack, 'TestRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  inlinePolicies: {
    TestPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          sid: 'ValidSid123',
          effect: iam.Effect.ALLOW,
          actions: ['s3:GetObject'],
          resources: ['arn:aws:s3:::example-bucket/*'],
        }),
        new iam.PolicyStatement({
          sid: 'ALLCAPS',
          effect: iam.Effect.ALLOW,
          actions: ['s3:ListBucket'],
          resources: ['arn:aws:s3:::example-bucket'],
        }),
        new iam.PolicyStatement({
          sid: '123456',
          effect: iam.Effect.ALLOW,
          actions: ['logs:CreateLogGroup'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          sid: 'abc123DEF',
          effect: iam.Effect.ALLOW,
          actions: ['logs:CreateLogStream'],
          resources: ['*'],
        }),
        // Test statement without SID (should still work)
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['logs:PutLogEvents'],
          resources: ['*'],
        }),
      ],
    }),
  },
});

const managedPolicy = new iam.ManagedPolicy(stack, 'TestManagedPolicy', {
  statements: [
    new iam.PolicyStatement({
      sid: 'ManagedPolicySid1',
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:GetItem'],
      resources: ['*'],
    }),
  ],
});

role.addManagedPolicy(managedPolicy);

new integ.IntegTest(app, 'PolicyStatementSidIntegTest', {
  testCases: [stack],
});
