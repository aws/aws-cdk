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
          // Could normally be something like:
          // ```
          // [
          //   'pip', 'install',
          //   '-r', '/asset/requirements.txt',
          //   '-t', '/asset',
          // ]
          // ```
          // but we need to remove the __pycache__ folders to ensure a stable
          // CDK asset hash for the integ test expectation, so we do:
          '/bin/bash', '-c', `
          pip install -r /asset/requirements.txt -t /asset &&
          find /asset -type d -name __pycache__ -exec rm -rf {} +
          `,
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
