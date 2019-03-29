import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cpactions = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-manual-approval');

const bucket = new s3.Bucket(stack, 'Bucket');

new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
  stages: [
    {
      name: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'S3',
          bucket,
          bucketKey: 'file.zip',
        }),
      ],
    },
    {
      name: 'Approve',
      actions: [
        new cpactions.ManualApprovalAction({
          actionName: 'ManualApproval',
          notifyEmails: ['adamruka85@gmail.com'],
        }),
      ],
    },
  ],
});

app.run();
