import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-assets-docker-build-context');

const asset = new assets.DockerImageAsset(stack, 'DockerImageWithBuildContext', {
  directory: path.join(__dirname, 'demo-image-build-context', 'image'),
  buildContexts: {
    mycontext: path.join(__dirname, 'demo-image-build-context', 'context'),
  },
});

const user = new iam.User(stack, 'MyUser');
asset.repository.grantPull(user);

new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });

new IntegTest(app, 'DockerBuildContextTest', {
  testCases: [
    stack,
  ],
});
