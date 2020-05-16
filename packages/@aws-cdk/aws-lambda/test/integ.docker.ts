import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const assetPath = path.join(__dirname, 'python-lambda-handler');
    new lambda.Function(this, 'Function', {
      code: lambda.Code.fromDockerImage({
        image: 'python:3.6',
        assetPath, // this is /asset in the container
        command: [
          'pip', 'install',
          '-r', '/asset/requirements.txt',
          '-t', '/asset',
        ],
        sourceHash: calcSourceHash(assetPath),
      }),
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: 'index.handler',
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-docker');
app.synth();

// Custom source hash calculation to ensure consistent behavior
// with Python dependencies. Needed for integ test expectation.
function calcSourceHash(srcDir: string): string {
  const sha = crypto.createHash('sha256');
  const files = ['index.py', 'requirements.txt'];
  for (const file of files) {
    const data = fs.readFileSync(path.join(srcDir, file));
    sha.update(`<file name=${file}>`);
    sha.update(data);
    sha.update('</file>');
  }

  return sha.digest('hex');
}
