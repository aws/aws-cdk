import * as lambda from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as destinations from '../lib';

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
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaProps: lambda.FunctionProps = {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        console.log('Event: %j', event);
        if (event === 'error') throw new Error('UnkownError');
        return event;
      };`),
    };

    const first = new lambda.Function(this, 'First', lambdaProps);
    const second = new lambda.Function(this, 'Second', lambdaProps);
    const third = new lambda.Function(this, 'Third', lambdaProps);
    const error = new lambda.Function(this, 'Error', lambdaProps);

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

const app = new App();

new TestStack(app, 'aws-cdk-lambda-chain');

app.synth();
