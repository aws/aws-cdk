import { App, MissingRemovalPolicies, RemovalPolicies, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const app = new App();
const stack = new Stack(app, 'TestStack');

new s3.Bucket(stack, 'TestBucket');

new dynamodb.Table(stack, 'TestTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});

new iam.User(stack, 'TestUser');

const destroyBucket = new Construct(stack, 'DestroyBucket');
new s3.Bucket(destroyBucket, 'Default');

RemovalPolicies.of(stack).retain({
  priority: 50,
});
RemovalPolicies.of(destroyBucket).destroy({
  priority: 100,
});

// Missing Policies
const missingPoliciesTest = new Construct(stack, 'MissingPoliciesTest');
new s3.Bucket(missingPoliciesTest, 'PreConfigured', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new s3.Bucket(missingPoliciesTest, 'NotConfigured');

MissingRemovalPolicies.of(missingPoliciesTest).retain();

const filteredTest = new Construct(stack, 'FilteredMissingPoliciesTest');
new s3.Bucket(filteredTest, 'BucketToRetain');
new dynamodb.Table(filteredTest, 'TableToSkip', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});

MissingRemovalPolicies.of(filteredTest).snapshot({
  applyToResourceTypes: [
    's3.CfnBucket',
  ],
});

new integ.IntegTest(app, 'RemovalPoliciesTest', {
  testCases: [stack],
});
