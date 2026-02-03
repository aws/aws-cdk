import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-lambda-1');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const userPool = new UserPool(stack, 'myUserPoolTest', {
  lambdaTriggers: {
    fn,
  },
});

const cognitoPolicy = new iam.PolicyStatement({
  actions: ['cognito:*'],
  resources: [userPool.userPoolArn],
});

fn.addToRolePolicy(cognitoPolicy);

/**
 * The purpose of this test is to ensure there is not a circular dependency between the resources.
 * If you edit the snapshot, use yarn integ --update-on-failure to update the snapshot.
 * Since only CFN will show the circular depndency error.
 */
new IntegTest(app, 'lambda-circular', {
  testCases: [stack],
});
