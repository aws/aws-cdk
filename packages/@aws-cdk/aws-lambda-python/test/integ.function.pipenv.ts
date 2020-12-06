/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
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
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_6,
    });
    new CfnOutput(this, 'InlineFunctionName', {
      value: pythonFunctionInline.functionName,
    });

    const pythonFunction27 = new lambda.PythonFunction(this, 'my_handler_python_27', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_2_7,
    });
    new CfnOutput(this, 'Python27FunctionName', {
      value: pythonFunction27.functionName,
    });

    const pythonFunction38 = new lambda.PythonFunction(this, 'my_handler_python_38', {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_3_8,
    });
    new CfnOutput(this, 'Python38FunctionName', {
      value: pythonFunction38.functionName,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-python');
app.synth();
