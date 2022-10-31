import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: path.join(__dirname, 'lambda-handler-sub'),
      index: 'inner/custom_index.py',
      handler: 'custom_handler',
      runtime: Runtime.PYTHON_3_8,
    });
    this.functionName = fn.functionName;

    new CfnOutput(this, 'FunctionArn', {
      value: fn.functionArn,
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-lambda-python-function-sub');
const integ = new IntegTest(app, 'function-sub', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});

const invoke = integ.assertions.invokeFunction({
  functionName: testCase.functionName,
});

invoke.expect(ExpectedResult.objectLike({
  Payload: '200',
}));
app.synth();
