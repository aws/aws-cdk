import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, InvocationType, Match } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as destinations from 'aws-cdk-lib/aws-lambda-destinations';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

// Test success case with:
// 1. Invoke first function in the chain
//   aws lambda invoke --function-name <first function name> --invocation-type Event --payload '"OK"' response.json
// 2. Check logs of third function (should show 'Event: "OK"')
//   aws logs filter-log-events --log-group-name /aws/lambda/<third function name>
//
// Test failure case with:
// 1. Invoke first function in the chain
//   aws lambda invoke --function-name <first function name> --invocation-type Event --payload '"error"' response.json
// 2. Check logs of error function (should show 'Event: {"errorType": "Error", "errorMessage": "UnkownError", "trace":"..."}')
//   aws logs filter-log-events --log-group-name /aws/lambda/<error function name>

class TestStack extends Stack {
  public readonly firstFunctionName: string;
  public readonly thirdFunctionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaProps: lambda.FunctionProps = {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        console.log('Event: %j', event);
        if (event.status === 'error') throw new Error('UnkownError');
        return event;
      };`),
    };

    const first = new lambda.Function(this, 'First', lambdaProps);
    const second = new lambda.Function(this, 'Second', lambdaProps);
    const third = new lambda.Function(this, 'Third', lambdaProps);
    const error = new lambda.Function(this, 'Error', lambdaProps);
    this.firstFunctionName = first.functionName;
    this.thirdFunctionName = third.functionName;

    first.configureAsyncInvoke({
      onSuccess: new destinations.LambdaDestination(second, { responseOnly: true }),
      onFailure: new destinations.LambdaDestination(error, { responseOnly: true }),
      retryAttempts: 0,
    });

    second.configureAsyncInvoke({
      onSuccess: new destinations.LambdaDestination(third, { responseOnly: true }),
    });

    new CfnOutput(this, 'FirstFunctionName', { value: first.functionName });
    new CfnOutput(this, 'ThirdFunctionName', { value: third.functionName });
    new CfnOutput(this, 'ErrorFunctionName', { value: error.functionName });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new TestStack(app, 'aws-cdk-lambda-chain');
const integ = new IntegTest(app, 'LambdaDestChain3', {
  testCases: [stack],
});
integ.assertions.invokeFunction({
  functionName: stack.firstFunctionName,
  invocationType: InvocationType.EVENT,
  payload: JSON.stringify({
    status: 'success',
  }),
});

integ.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: `/aws/lambda/${stack.thirdFunctionName}`,
}).expect(ExpectedResult.objectLike({
  events: Match.arrayWith([
    Match.objectLike({
      message: Match.stringLikeRegexp('success'),
    }),
  ]),
})).waitForAssertions();

app.synth();
