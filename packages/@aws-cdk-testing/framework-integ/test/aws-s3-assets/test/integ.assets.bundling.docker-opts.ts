import * as path from 'path';
import { App, DockerImage, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as assets from 'aws-cdk-lib/aws-s3-assets';

const app = new App();
const stack = new Stack(app, 'cdk-integ-assets-bundling-docker-opts');

new assets.Asset(stack, 'BundledAsset', {
  path: path.join(__dirname, 'markdown-asset'), // /asset-input and working directory in the container
  bundling: {
    image: DockerImage.fromBuild(path.join(__dirname, 'alpine-markdown')), // Build an image
    command: [
      'sh', '-c', `
        markdown index.md > /asset-output/index.html
      `,
    ],
    network: 'host',
    platform: 'linux/amd64',
  },
});
/// !hide
new integ.IntegTest(app, 'cdk-integ-s3-assets-bundling-docker-opts', {
  testCases: [stack],
});

app.synth();
