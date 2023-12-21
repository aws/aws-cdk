import { App, Stack, Duration } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest, InvocationType } from '../../../lib';

const app = new App();
const stack = new Stack(app, 'InvokeFunctionAssertions');

const targetFunc = new lambda.Function(stack, 'TargetFunc', {
  code: lambda.Code.fromInline('exports.handler = async (event, context) => { return { foo: "bar" }; };'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_LATEST,
});

const integ = new IntegTest(app, 'AssertionsTest', {
  testCases: [stack],
});

// In this test, we are verifying that when 'invokeFunction' is used in conjunction with 'waitForAssertions',
// the invocation of the Lambda function is handled by the 'waiterProvider'.
// We are specifically checking that the correct IAM policy is set for the 'waiterProvider' and,
// that the Lambda function can be invoked correctly.
integ.assertions.invokeFunction({
  functionName: targetFunc.functionName,
  invocationType: InvocationType.EVENT,
  payload: JSON.stringify({ days: 1 }),
}).expect(
  ExpectedResult.objectLike({ StatusCode: 202 }),
).waitForAssertions({
  interval: Duration.seconds(30),
  totalTimeout: Duration.minutes(90),
});
