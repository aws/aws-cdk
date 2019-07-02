import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

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

const deployBucket = new s3.Bucket(stack, 'DeployBucket', {});

new codepipeline.Pipeline(stack, 'Pipeline', {
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
        })
      ],
    },
  ],
});

app.synth();
