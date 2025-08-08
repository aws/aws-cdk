import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Tags } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': true,
  },
});

const stack = new cdk.Stack(app, 'loggroup-tag-inherit');

const fn = new lambda.Function(stack, 'TaggedLmbdaFunction', {
  code: lambda.Code.fromInline('exports.handler = async () => {};'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

// Tag the function
Tags.of(fn).add('Environment', 'Test');
Tags.of(fn).add('Owner', 'CDKTeam');

const integ = new IntegTest(app, 'integ-tests-lambda-loggroup-tag-inherit', {
  testCases: [stack],
});

const tag_assertion = integ.assertions.awsApiCall('CloudWatchLogs', 'listTagsLogGroup', {
  logGroupName: `/aws/lambda/${fn.functionName}`,
});

// tag_assertion.provider.addPolicyStatementFromSdkCall('logs', 'listTagsLogGroup');
tag_assertion.expect(ExpectedResult.objectLike({
  tags: {
    Environment: 'Test',
    Owner: 'CDKTeam',
  },
}));
