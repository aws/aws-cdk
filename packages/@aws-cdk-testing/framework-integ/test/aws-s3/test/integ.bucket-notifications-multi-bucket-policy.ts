import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'S3NotificationMultiBucketPolicyTest');

// Create multiple buckets with notifications to verify per-bucket IAM policies
const bucket1 = new s3.Bucket(stack, 'Bucket1', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const bucket2 = new s3.Bucket(stack, 'Bucket2', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const bucket3 = new s3.Bucket(stack, 'Bucket3', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const topic = new sns.Topic(stack, 'Topic');

// Add notifications to each bucket - this should create separate HandlerPolicy for each
bucket1.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SnsDestination(topic));
bucket2.addEventNotification(s3.EventType.OBJECT_REMOVED, new s3n.SnsDestination(topic));
bucket3.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3n.SnsDestination(topic));

// Export the handler role name for cross-stack assertion access
new cdk.CfnOutput(stack, 'HandlerRoleName', {
  value: cdk.Fn.ref('BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleB6FB88EC'),
  exportName: 'HandlerRoleName',
});

const integTest = new integ.IntegTest(app, 'S3NotificationMultiBucketPolicyIntegTest', {
  testCases: [stack],
  diffAssets: true,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
  },
});

const roleName = cdk.Fn.importValue('HandlerRoleName');

// Verify the handler role has 3 separate per-bucket inline policies (one per bucket)
const listPolicies = integTest.assertions.awsApiCall('IAM', 'listRolePolicies', {
  RoleName: roleName,
});
listPolicies.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['iam:ListRolePolicies', 'iam:GetRolePolicy'],
  Resource: ['*'],
});
listPolicies.assertAtPath('PolicyNames.0', integ.ExpectedResult.stringLikeRegexp('Bucket1NotificationsHandlerPolicy.*'));
listPolicies.assertAtPath('PolicyNames.1', integ.ExpectedResult.stringLikeRegexp('Bucket2NotificationsHandlerPolicy.*'));
listPolicies.assertAtPath('PolicyNames.2', integ.ExpectedResult.stringLikeRegexp('Bucket3NotificationsHandlerPolicy.*'));

// Verify each policy document contains s3:PutBucketNotification scoped to its bucket
// getRolePolicy returns PolicyDocument as a URL-encoded JSON string
for (const [bucketLabel, policyName] of [
  ['bucket1', 'Bucket1NotificationsHandlerPolicy2894F2A2'],
  ['bucket2', 'Bucket2NotificationsHandlerPolicy2BDDB4E2'],
  ['bucket3', 'Bucket3NotificationsHandlerPolicyA409718A'],
]) {
  integTest.assertions.awsApiCall('IAM', 'getRolePolicy', {
    RoleName: roleName,
    PolicyName: policyName,
  }).expect(integ.ExpectedResult.objectLike({
    PolicyName: policyName,
    PolicyDocument: integ.Match.stringLikeRegexp(`.*PutBucketNotification.*${bucketLabel}.*`),
  }));
}

app.synth();
