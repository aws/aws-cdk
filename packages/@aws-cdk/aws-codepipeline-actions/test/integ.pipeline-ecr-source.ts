import codepipeline = require('@aws-cdk/aws-codepipeline');
import ecr = require('@aws-cdk/aws-ecr');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-ecr-source');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactBucket: bucket,
});

const repository = new ecr.Repository(stack, 'MyEcrRepo');
const sourceStage = pipeline.addStage({ stageName: 'Source' });
sourceStage.addAction(new cpactions.EcrSourceAction({
  actionName: 'ECR_Source',
  output: new codepipeline.Artifact(),
  repository,
}));

const approveStage = pipeline.addStage({ stageName: 'Approve' });
approveStage.addAction(new cpactions.ManualApprovalAction({ actionName: 'ManualApproval' }));

app.synth();
