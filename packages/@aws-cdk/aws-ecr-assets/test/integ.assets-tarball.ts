import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as assets from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-assets-tarball');

const asset = new assets.TarballImageAsset(stack, 'DockerImage', {
  tarballFile: path.join(__dirname, 'demo-tarball-hello-world/hello-world.tar'),
});

const asset2 = new assets.TarballImageAsset(stack, 'DockerImage2', {
  tarballFile: path.join(__dirname, 'demo-tarball-hello-world/hello-world.tar'),
});

const user = new iam.User(stack, 'MyUser');
asset.repository.grantPull(user);
asset2.repository.grantPull(user);

new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });
new cdk.CfnOutput(stack, 'ImageUri2', { value: asset2.imageUri });

new IntegTest(app, 'LoadFromTarball', {
  testCases: [
    stack,
  ],
});
