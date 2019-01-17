import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-manual-approval');

const bucket = new s3.Bucket(stack, 'Bucket');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactsStore: new codepipeline.ArtifactsStore(stack, 'ArtifactsStore', { bucket } )
});

const sourceStage = pipeline.addStage('Source');
bucket.addToPipeline(sourceStage, 'S3', {
  bucketKey: 'file.zip',
});

const approveStage = pipeline.addStage('Approve');
new codepipeline.ManualApprovalAction(stack, 'ManualApproval', {
  stage: approveStage,
  notifyEmails: ['adamruka85@gmail.com']
});

app.run();
