/// !cdk-integ pragma:ignore-assets
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

    const projectDirectory = path.join(__dirname, 'lambda-handler-project');
    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: path.join(projectDirectory, 'lambda'),
      runtime: Runtime.PYTHON_3_6,
      layers: [
        new lambda.PythonLayerVersion(this, 'Shared', {
          entry: path.join(projectDirectory, 'shared'),
          compatibleRuntimes: [Runtime.PYTHON_3_6],
        }),
      ],
    });

    new CfnOutput(this, 'FunctionArn', {
      value: fn.functionArn,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-function-project');
app.synth();
