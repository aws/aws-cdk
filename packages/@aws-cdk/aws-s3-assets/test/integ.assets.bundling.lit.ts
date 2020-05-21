import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';
import * as assets from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /// !show
    new assets.Asset(this, 'BundledAsset', {
      path: path.join(__dirname, 'markdown-asset'), // /asset-input and working directory in the container
      bundling: {
        image: assets.BundlingDockerImage.fromAsset(path.join(__dirname, 'alpine-markdown')), // Build an image
        command: [
          'sh', '-c', `
            markdown index.md > /asset-output/index.html
          `,
        ],
      },
    });
    /// !hide
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-assets-bundling');
app.synth();
