import * as lambda from '@aws-cdk/aws-lambda';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as destinations from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaProps: lambda.FunctionProps = {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        console.log(event);
        return event;
      };`),
    };

    const first = new lambda.Function(this, 'First', lambdaProps);
    const second = new lambda.Function(this, 'Second', lambdaProps);
    const third = new lambda.Function(this, 'Third', lambdaProps);

    first.configureAsyncInvoke({
      onSuccess: new destinations.LambdaPayloadDestination(second),
    });

    second.configureAsyncInvoke({
      onSuccess: new destinations.LambdaPayloadDestination(third),
    });
  }
}

const app = new App();

new TestStack(app, 'aws-cdk-lambda-payload');

app.synth();
