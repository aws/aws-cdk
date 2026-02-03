import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

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
          timeout: cdk.Duration.minutes(10),
        }),
      ],
    },
  ],
});

app.synth();
