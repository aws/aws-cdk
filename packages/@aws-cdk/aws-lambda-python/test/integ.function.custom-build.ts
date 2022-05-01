// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, DockerImage, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const entry = path.join(__dirname, 'lambda-handler-custom-build');
    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: entry,
      bundling: { image: DockerImage.fromBuild(path.join(entry)) },
      runtime: Runtime.PYTHON_3_8,
    });

    new CfnOutput(this, 'FunctionArn', {
      value: fn.functionArn,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-custom-build');
app.synth();
