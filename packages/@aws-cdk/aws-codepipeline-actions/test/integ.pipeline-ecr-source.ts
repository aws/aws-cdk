import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-ecr-source');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactBucket: bucket,
});

const repository = new ecr.Repository(stack, 'MyEcrRepo', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const sourceStage = pipeline.addStage({ stageName: 'Source' });
sourceStage.addAction(new cpactions.EcrSourceAction({
  actionName: 'ECR_Source',
  output: new codepipeline.Artifact(),
  repository,
}));

const approveStage = pipeline.addStage({ stageName: 'Approve' });
approveStage.addAction(new cpactions.ManualApprovalAction({ actionName: 'ManualApproval' }));

app.synth();
