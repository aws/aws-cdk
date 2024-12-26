import { App, RemovalPolicy, RemovalPolicies, Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'TestStack');

// Create resources
new s3.Bucket(stack, 'TestBucket');
new dynamodb.Table(stack, 'TestTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
const user = new iam.User(stack, 'TestUser');
user.applyRemovalPolicy(RemovalPolicy.RETAIN);

// Apply different removal policies to demonstrate functionality
RemovalPolicies.of(stack).destroy();

new integ.IntegTest(app, 'RemovalPoliciesTest', {
  testCases: [stack],
});
