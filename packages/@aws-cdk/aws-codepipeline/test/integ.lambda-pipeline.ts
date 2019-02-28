import cloudtrail = require('@aws-cdk/aws-cloudtrail');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-lambda');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = pipeline.addStage({ name: 'Source' });
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.Destroy,
});
const key = 'key';
const trail = new cloudtrail.CloudTrail(stack, 'CloudTrail');
trail.addS3EventSelector([bucket.arnForObjects(key)], { readWriteType: cloudtrail.ReadWriteType.WriteOnly, includeManagementEvents: false });
sourceStage.addAction(new s3.PipelineSourceAction({
  actionName: 'Source',
  outputArtifactName: 'SourceArtifact',
  bucket,
  bucketKey: key,
  pollForSourceChanges: false,
}));

const lambdaFun = new lambda.Function(stack, 'LambdaFun', {
  code: new lambda.InlineCode(`
    exports.handler = function () {
      console.log("Hello, world!");
    };
  `),
  handler: 'index.handler',
  runtime: lambda.Runtime.NodeJS610,
});
const lambdaStage = pipeline.addStage({ name: 'Lambda' });
lambdaStage.addAction(lambdaFun.toCodePipelineInvokeAction({ actionName: 'Lambda' }));

app.run();
