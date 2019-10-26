import cloudtrail = require('@aws-cdk/aws-cloudtrail');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

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
trail.addS3EventSelector([bucket.arnForObjects(key)], { readWriteType: cloudtrail.ReadWriteType.WRITE_ONLY, includeManagementEvents: false });
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
  runtime: lambda.Runtime.NODEJS_LATEST,
});
const lambdaStage = pipeline.addStage({ stageName: 'Lambda' });
lambdaStage.addAction(new cpactions.LambdaInvokeAction({
  actionName: 'Lambda' ,
  lambda: lambdaFun,
}));

app.synth();
