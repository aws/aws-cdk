// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * aws lambda invoke --function-name <function name> --invocation-type Event --payload $(base64 <<<''OK'') response.json
 */

class TestStack extends Stack {
  public readonly functionNames: string[] = [];
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pythonFunction39 = new lambda.PythonFunction(this, 'my_handler_inline', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_9,
    });
    this.functionNames.push(pythonFunction39.functionName);

    const pythonFunction38 = new lambda.PythonFunction(this, 'my_handler_python_38', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_8,
    });
    this.functionNames.push(pythonFunction38.functionName);

    const pythonFunction37 = new lambda.PythonFunction(this, 'my_handler_python_37', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_7,
    });
    this.functionNames.push(pythonFunction37.functionName);

    const pythonFunction39Excludes = new lambda.PythonFunction(this, 'my_handler_inline_excludes', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_9,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction39Excludes.functionName);

    const pythonFunction38Excludes = new lambda.PythonFunction(this, 'my_handler_python_38_excludes', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_8,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction38Excludes.functionName);

    const pythonFunction37Excludes = new lambda.PythonFunction(this, 'my_handler_python_37_excludes', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_7,
      bundling: {
        assetExcludes: ['.ignorefile'],
      },
    });
    this.functionNames.push(pythonFunction37Excludes.functionName);
  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-lambda-python-pipenv');
const integ = new IntegTest(app, 'pipenv', {
  testCases: [testCase],
  // disabling update workflow because we don't want to include the assets in the snapshot
  // python bundling changes the asset hash pretty frequently
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
