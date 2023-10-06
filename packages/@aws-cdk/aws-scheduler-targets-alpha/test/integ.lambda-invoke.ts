import * as path from 'path';
import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaInvoke } from '../lib';

/*
 * Stack verification steps:
 * The lambda function is implemented to add a tag:
 *   Key: OutputValue
 *   Value: base64 JSON string of the input event
 * The lambda function is invoked by the scheduler every minute
 * The assertion checks that the expected tag is created by calling listTags on the lambda function
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-schedule');

const functionName = 'TestSchedulerLambdaInvokeTarget';
const functionArn = stack.formatArn({
  service: 'lambda',
  resource: 'function',
  resourceName: functionName,
  arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
});
const payload = 'test';

const func = new lambda.Function(stack, 'MyLambda', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.schedule-lambda-target.handler')),
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(30),
  runtime: lambda.Runtime.NODEJS_LATEST,
  functionName: functionName,
});
func.addEnvironment('FUNC_ARN', stack.resolve(functionArn));

func.addToRolePolicy(new iam.PolicyStatement(
  new iam.PolicyStatement({
    actions: ['lambda:TagResource'],
    resources: ['*'],
  }),
));

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new LambdaInvoke(func, {
    input: scheduler.ScheduleTargetInput.fromText(payload),
  }),
});

const integ = new IntegTest(app, 'integtest-lambda-invoke', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const invokeListTags = integ.assertions.awsApiCall('Lambda', 'listTags', {
  Resource: func.functionArn,
});

// Verifies that expected tag is created for the lambda function
invokeListTags.expect(ExpectedResult.objectLike({
  Tags: {
    OutputValue: Buffer.from(JSON.stringify(payload)).toString('base64'),
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(5),
});
