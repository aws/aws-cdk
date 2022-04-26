import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-s3-deploy');

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket,
  bucketKey: 'key',
});

const deployBucket = new s3.Bucket(stack, 'DeployBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const otherDeployBucket = new s3.Bucket(stack, 'OtherDeployBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Deploy',
      actions: [
        new cpactions.S3DeployAction({
          actionName: 'DeployAction',
          input: sourceOutput,
          bucket: deployBucket,
          accessControl: s3.BucketAccessControl.PUBLIC_READ,
          cacheControl: [
            cpactions.CacheControl.setPublic(),
            cpactions.CacheControl.maxAge(cdk.Duration.hours(12)),
          ],
        }),
      ],
    },
    {
      stageName: 'Disabled',
      transitionToEnabled: false,
      actions: [
        new cpactions.S3DeployAction({
          actionName: 'DisabledDeployAction',
          input: sourceOutput,
          bucket: otherDeployBucket,
        }),
      ],
    },
  ],
});

app.synth();
