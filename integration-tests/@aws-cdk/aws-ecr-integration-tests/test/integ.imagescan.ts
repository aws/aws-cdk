/// !cdk-integ pragma:ignore-assets
import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo', {
  imageScanOnPush: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

repo.onImageScanCompleted('ImageScanComplete');

new cdk.CfnOutput(stack, 'RepositoryURI', {
  value: repo.repositoryUri,
});

app.synth();
