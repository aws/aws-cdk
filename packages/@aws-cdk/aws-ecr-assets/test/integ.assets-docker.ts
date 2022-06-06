import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as assets from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-assets-docker');

const asset = new assets.DockerImageAsset(stack, 'DockerImage', {
  directory: path.join(__dirname, 'demo-image'),
});

const asset2 = new assets.DockerImageAsset(stack, 'DockerImage2', {
  directory: path.join(__dirname, 'demo-image'),
});

const asset3 = new assets.DockerImageAsset(stack, 'DockerImage3', {
  directory: path.join(__dirname, 'demo-image'),
  platform: assets.Platform.LINUX_ARM64,
});

const user = new iam.User(stack, 'MyUser');
asset.repository.grantPull(user);
asset2.repository.grantPull(user);
asset3.repository.grantPull(user);

new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });
new cdk.CfnOutput(stack, 'ImageUri2', { value: asset2.imageUri });
new cdk.CfnOutput(stack, 'ImageUri3', { value: asset3.imageUri });

app.synth();
