import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * aws lambda invoke --function-name <function name> --invocation-type Event --payload $(base64 <<<''OK'') response.json
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pythonFunctionInline = new lambda.PythonFunction(this, 'my_handler_inline', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_9,
    });
    new CfnOutput(this, 'inlineFunctionName', {
      value: pythonFunctionInline.functionName,
    });

    const pythonFunction38 = new lambda.PythonFunction(this, 'my_handler_python_38', {
      entry: path.join(__dirname, 'lambda-handler-poetry'),
      runtime: Runtime.PYTHON_3_8,
    });
    new CfnOutput(this, 'Python38FunctionName', {
      value: pythonFunction38.functionName,
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'cdk-integ-lambda-python');

new IntegTest(app, 'poetry', {
  testCases: [testCase],
  // disabling update workflow because we don't want to include the assets in the snapshot
  // python bundling changes the asset hash pretty frequently
  stackUpdateWorkflow: false,
});

app.synth();
