import * as path from 'path';
import { Architecture, Runtime } from '@aws-cdk/aws-lambda';
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

    const layer = new lambda.PythonLayerVersion(this, 'Layer', {
      entry: path.join(__dirname, 'lambda-handler-arm64/layer'),
      compatibleRuntimes: [Runtime.PYTHON_3_9],
      compatibleArchitectures: [Architecture.ARM_64],
    });

    const fn = new lambda.PythonFunction(this, 'Handler', {
      entry: path.join(__dirname, 'lambda-handler-arm64/handler'),
      runtime: Runtime.PYTHON_3_9,
      architecture: Architecture.ARM_64,
      layers: [layer],
    });
    this.functionName = fn.functionName;

    new CfnOutput(this, 'FunctionArn', {
      value: fn.functionArn,
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-lambda-python-arm64');
const integ = new IntegTest(app, 'lambda-python-arm64', {
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
