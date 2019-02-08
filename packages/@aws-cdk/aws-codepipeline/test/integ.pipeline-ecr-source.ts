import ecr = require('@aws-cdk/aws-ecr');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-ecr-source');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.Destroy,
});
const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactBucket: bucket,
});

const repository = new ecr.Repository(stack, 'MyEcrRepo');
const sourceStage = pipeline.addStage({ name: 'Source' });
sourceStage.addAction(repository.toCodePipelineSourceAction({ actionName: 'ECR_Source' }));

const approveStage = pipeline.addStage({ name: 'Approve' });
approveStage.addAction(new codepipeline.ManualApprovalAction({ actionName: 'ManualApproval' }));

app.run();
