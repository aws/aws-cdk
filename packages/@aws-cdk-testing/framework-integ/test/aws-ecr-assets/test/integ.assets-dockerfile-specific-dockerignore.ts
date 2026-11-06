import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecr-assets:dockerfileSpecificIgnoreFile': true,
  },
});

const stack = new cdk.Stack(app, 'integ-assets-dockerfile-specific-dockerignore');

const asset = new assets.DockerImageAsset(stack, 'DockerImageWithDockerfileSpecificIgnore', {
  directory: path.join(__dirname, 'demo-dockerfile-specific-ignore'),
  file: 'Dockerfile.Custom',
});

const user = new iam.User(stack, 'MyUser');
asset.repository.grantPull(user);

new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });

new IntegTest(app, 'DockerfileSpecificDockerignoreTest', {
  testCases: [
    stack,
  ],
});
