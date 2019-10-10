import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

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
