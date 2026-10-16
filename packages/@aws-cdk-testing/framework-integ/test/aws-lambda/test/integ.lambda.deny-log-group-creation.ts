import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * * The function's role is denied `logs:CreateLogGroup` on its log group, in both ARN forms.
 * * The function's role can still create other log groups, such as Lambda Insights'.
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

const logGroupArn = (logGroupName: string) => stack.formatArn({
  service: 'logs',
  resource: 'log-group',
  resourceName: logGroupName,
  arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
});

const expectCreateLogGroup = (resourceArn: string, decision: string) => {
  integ.assertions.awsApiCall('IAM', 'simulatePrincipalPolicy', {
    PolicySourceArn: fn.role!.roleArn,
    ActionNames: ['logs:CreateLogGroup'],
    ResourceArns: [resourceArn],
  }).expect(ExpectedResult.objectLike({
    EvaluationResults: [{ EvalActionName: 'logs:CreateLogGroup', EvalDecision: decision }],
  }));
};

expectCreateLogGroup(logGroupArn(fn.logGroup.logGroupName), 'explicitDeny');
expectCreateLogGroup(fn.logGroup.logGroupArn, 'explicitDeny');
expectCreateLogGroup(logGroupArn('/aws/lambda-insights:*'), 'allowed');
