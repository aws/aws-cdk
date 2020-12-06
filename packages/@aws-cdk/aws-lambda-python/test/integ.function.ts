import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const python36Function = new lambda.PythonFunction(this, 'my_handler', {
      entry: path.join(__dirname, 'lambda-handler'),
      runtime: Runtime.PYTHON_3_6,
    });
    new CfnOutput(this, 'Python36FunctionName', {
      value: python36Function.functionName,
    });

    const python38Function = new lambda.PythonFunction(this, 'my_handler_python_38', {
      entry: path.join(__dirname, 'lambda-handler'),
      runtime: Runtime.PYTHON_3_8,
    });
    new CfnOutput(this, 'Python38FunctionName', {
      value: python38Function.functionName,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-python');
app.synth();
