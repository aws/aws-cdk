import * as cloudtrail from '@aws-cdk/aws-cloudtrail';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-lambda');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = pipeline.addStage({ stageName: 'Source' });
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const key = 'key';
const trail = new cloudtrail.Trail(stack, 'CloudTrail');
trail.addS3EventSelector([{ bucket, objectPrefix: key }], { readWriteType: cloudtrail.ReadWriteType.WRITE_ONLY, includeManagementEvents: false });
sourceStage.addAction(new cpactions.S3SourceAction({
  actionName: 'Source',
  output: new codepipeline.Artifact('SourceArtifact'),
  bucket,
  bucketKey: key,
  trigger: cpactions.S3Trigger.EVENTS,
}));

const lambdaFun = new lambda.Function(stack, 'LambdaFun', {
  code: new lambda.InlineCode(`
    exports.handler = function () {
      console.log("Hello, world!");
    };
  `),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});
const lambdaStage = pipeline.addStage({ stageName: 'Lambda' });
lambdaStage.addAction(new cpactions.LambdaInvokeAction({
  actionName: 'Lambda',
  lambda: lambdaFun,
}));

app.synth();
