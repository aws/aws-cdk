import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, BundlingOutput, DockerImage, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as assets from 'aws-cdk-lib/aws-s3-assets';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /// !show
    const asset = new assets.Asset(this, 'BundledAsset', {
      path: path.join(__dirname, 'markdown-asset'), // /asset-input and working directory in the container
      bundling: {
        image: DockerImage.fromBuild(path.join(__dirname, 'alpine-markdown')), // Build an image
        outputType: BundlingOutput.SINGLE_FILE, // Bundle only the file and do not package it
        command: [
          'sh', '-c', `
            markdown index.md > /asset-output/index.html
          `,
        ],
      },
    });
    /// !hide

    const user = new iam.User(this, 'MyUser');
    asset.grantRead(user);

    new assets.Asset(this, 'BundledAssetWithoutExtension', {
      path: path.join(__dirname, 'markdown-asset'),
      bundling: {
        image: DockerImage.fromBuild(path.join(__dirname, 'alpine-markdown')),
        outputType: BundlingOutput.SINGLE_FILE,
        command: [
          'sh', '-c', 'echo 123 > /asset-output/main',
        ],
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-assets-bundling');

new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

app.synth();
