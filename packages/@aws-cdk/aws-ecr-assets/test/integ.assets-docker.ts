import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as assets from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-assets-docker');

const asset = new assets.DockerImageAsset(stack, 'DockerImage', {
  directory: path.join(__dirname, 'demo-image'),
});

new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });

app.synth();
