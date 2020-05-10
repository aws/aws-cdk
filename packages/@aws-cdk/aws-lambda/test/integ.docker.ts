import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'Function', {
      code: lambda.Code.fromDockerImage({
        image: 'python:3.6',
        assetPath: path.join(__dirname, 'python-lambda-handler'), // this is /asset in the container
        command: [
          'pip3', 'install',
          '-r', '/asset/requirements.txt',
          '-t', '/asset',
        ],
      }),
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: 'index.handler',
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-docker');
app.synth();
