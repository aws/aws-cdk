import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-lambda');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  crossAccountKeys: true,
});

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
  runtime: STANDARD_NODEJS_RUNTIME,
});
const lambdaStage = pipeline.addStage({ stageName: 'Lambda' });
lambdaStage.addAction(new cpactions.LambdaInvokeAction({
  actionName: 'Lambda',
  lambda: lambdaFun,
}));

app.synth();
