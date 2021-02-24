import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as assets from '../lib';

const app = new cdk.App({
  context: {
    [cxapi.DOCKER_IGNORE_SUPPORT]: true,
  },
});
const stack = new cdk.Stack(app, 'integ-assets-docker');

const asset = new assets.DockerImageAsset(stack, 'DockerImage', {
  directory: path.join(__dirname, 'demo-image'),
});

const asset2 = new assets.DockerImageAsset(stack, 'DockerImage2', {
  directory: path.join(__dirname, 'demo-image'),
});

const user = new iam.User(stack, 'MyUser');
asset.repository.grantPull(user);
asset2.repository.grantPull(user);

new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });

app.synth();
