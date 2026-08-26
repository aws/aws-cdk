import * as path from 'path';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { LambdaInvoke } from 'aws-cdk-lib/aws-scheduler-targets';

const LAMBDA_TAGGING_PERMISSION = new iam.PolicyStatement(
  new iam.PolicyStatement({
    actions: ['lambda:TagResource'],
    resources: ['*'],
  }),
);

/*
 * Stack verification steps:
 * The lambda function is implemented to add a tag:
 *   Key: OutputValue
 *   Value: base64 JSON string of the input event
 * The lambda function is invoked by the scheduler every minute
 * The assertion checks that the expected tag is created by calling listTags on the lambda function
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
/**
 * 1st stack creates a lambda which will be imported to 2nd stack to test using imported lambda
 */
const lambdaStack = new cdk.Stack(app, 'aws-cdk-schedule-lambda');

const funcName = 'FirstSelfTaggingLambda';
const funcToBeImported = new lambda.Function(lambdaStack, 'MyLambda', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.schedule-lambda-target.handler')),
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(30),
  runtime: lambda.Runtime.NODEJS_LATEST,
  functionName: funcName,
});
funcToBeImported.addToRolePolicy(LAMBDA_TAGGING_PERMISSION);

const funcToBeImportedStaticArn = lambdaStack.formatArn({
  service: 'lambda',
  resource: 'function',
  resourceName: funcName,
  arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
});
funcToBeImported.addEnvironment('FUNC_ARN', lambdaStack.resolve(funcToBeImportedStaticArn));

/**
 * 2nd stack creates a lambda and a schedule to check they integrate correctly.
 * It also creates a schedule to use with an imported lambda from the 1st stack above.
 */

const scheduleStack = new cdk.Stack(app, 'aws-cdk-schedule');
scheduleStack.addDependency(lambdaStack);

// 1st case with imported lambda
const importedFunc = lambda.Function.fromFunctionAttributes(scheduleStack, 'importedFromFirstStack', {
  functionArn: funcToBeImportedStaticArn,
  skipPermissions: true,
});
const importedLambdaTagValue = 'importedLambdaTagValue';
new scheduler.Schedule(scheduleStack, 'ScheduleWithImportedLambda', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new LambdaInvoke(importedFunc, {
    input: scheduler.ScheduleTargetInput.fromObject({ tagValue: importedLambdaTagValue }),
  }),
});

// 2nd case with lambda and schedule in same stack
const secondFuncName = 'SecondSelfTaggingLambda';
const sameStackFunc = new lambda.Function(scheduleStack, 'MyLambda', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.schedule-lambda-target.handler')),
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(30),
  runtime: lambda.Runtime.NODEJS_LATEST,
  functionName: secondFuncName,
});
sameStackFunc.addToRolePolicy(LAMBDA_TAGGING_PERMISSION);
const sameStackFuncStaticArn = scheduleStack.formatArn({
  service: 'lambda',
  resource: 'function',
  resourceName: secondFuncName,
  arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
});
sameStackFunc.addEnvironment('FUNC_ARN', scheduleStack.resolve(sameStackFuncStaticArn));

const sameStackLambdaTagValue = 'sameStackLambdaTagValue';
new scheduler.Schedule(scheduleStack, 'ScheduleWithSameStackLambda', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new LambdaInvoke(sameStackFunc, {
    input: scheduler.ScheduleTargetInput.fromObject({ tagValue: sameStackLambdaTagValue }),
  }),
});

// 3rd case testing reusing target lambda, static date and target props
new scheduler.Schedule(scheduleStack, 'ScheduleWithStaticDate', {
  schedule: scheduler.ScheduleExpression.at(new Date('2000-01-01T00:00:00Z')),
  target: new LambdaInvoke(sameStackFunc, { maxEventAge: cdk.Duration.minutes(1), retryAttempts: 1 }),
});

const integ = new IntegTest(app, 'integtest-lambda-invoke', {
  testCases: [scheduleStack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const listTagsOnImportedLambda = integ.assertions.awsApiCall('Lambda', 'listTags', {
  Resource: funcToBeImportedStaticArn,
});

// Verifies that expected tag is created for the lambda function
listTagsOnImportedLambda.expect(ExpectedResult.objectLike({
  Tags: {
    OutputValue: Buffer.from(JSON.stringify(importedLambdaTagValue)).toString('base64'),
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(10),
});

const listTagsOnSameStackLambda = integ.assertions.awsApiCall('Lambda', 'listTags', {
  Resource: sameStackFuncStaticArn,
});

// Verifies that expected tag is created for the lambda function
listTagsOnSameStackLambda.expect(ExpectedResult.objectLike({
  Tags: {
    OutputValue: Buffer.from(JSON.stringify(sameStackLambdaTagValue)).toString('base64'),
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(10),
});
