// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
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
  public readonly functionNames: string[] = [];
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const defaultFunction = new lambda.PythonFunction(this, 'my_handler', {
      entry: path.join(__dirname, 'lambda-handler'),
      runtime: Runtime.PYTHON_3_9,
    });
    this.functionNames.push(defaultFunction.functionName);

    new CfnOutput(this, 'DefaultFunctionArn', {
      value: defaultFunction.functionArn,
    });

    const functionWithExcludes = new lambda.PythonFunction(this, 'my_handler_excludes', {
      entry: path.join(__dirname, 'lambda-handler'),
      runtime: Runtime.PYTHON_3_9,
      bundling: {
        assetExcludes: ['.ignorefiles'],
      },
    });
    this.functionNames.push(functionWithExcludes.functionName);

    new CfnOutput(this, 'FunctionArnWithExcludes', {
      value: functionWithExcludes.functionArn,
    });

  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-lambda-python-function');
const integ = new IntegTest(app, 'lambda-python-function', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});

testCase.functionNames.forEach(functionName => {
  const invoke = integ.assertions.invokeFunction({
    functionName: functionName,
  });

  invoke.expect(ExpectedResult.objectLike({
    Payload: '200',
  }));
});

app.synth();
