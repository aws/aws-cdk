import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * * The function's role has an inline policy that denies `logs:CreateLogGroup`.
 * * The function still runs and logs to the log group CDK manages for it.
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': true,
    '@aws-cdk/aws-lambda:denyLogGroupCreation': true,
  },
});

const stack = new cdk.Stack(app, 'lambda-deny-log-group-creation');

const fn = new lambda.Function(stack, 'Function', {
  code: lambda.Code.fromInline('exports.handler = async () => { console.log("invoked"); };'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_LATEST,
});

const integ = new IntegTest(app, 'integ-tests-lambda-deny-log-group-creation', {
  testCases: [stack],
});

integ.assertions.invokeFunction({ functionName: fn.functionName }).expect(ExpectedResult.objectLike({
  StatusCode: 200,
}));

integ.assertions.awsApiCall('IAM', 'getRolePolicy', {
  RoleName: fn.role!.roleName,
  PolicyName: 'DenyLogGroupCreation',
}).expect(ExpectedResult.objectLike({
  PolicyName: 'DenyLogGroupCreation',
}));
