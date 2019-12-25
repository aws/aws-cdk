import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-manual-approval');

const bucket = new s3.Bucket(stack, 'Bucket');

new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
  stages: [
    {
      stageName: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'S3',
          bucket,
          bucketKey: 'file.zip',
          output: new codepipeline.Artifact(),
        }),
      ],
    },
    {
      stageName: 'Approve',
      actions: [
        new cpactions.ManualApprovalAction({
          actionName: 'ManualApproval',
          notifyEmails: ['adamruka85@gmail.com'],
        }),
      ],
    },
  ],
});

app.synth();
