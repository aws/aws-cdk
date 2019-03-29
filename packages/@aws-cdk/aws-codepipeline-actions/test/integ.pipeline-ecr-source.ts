import codepipeline = require('@aws-cdk/aws-codepipeline');
import ecr = require('@aws-cdk/aws-ecr');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cpactions = require('../lib');

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
sourceStage.addAction(new cpactions.EcrSourceAction({
  actionName: 'ECR_Source',
  repository,
}));

const approveStage = pipeline.addStage({ name: 'Approve' });
approveStage.addAction(new cpactions.ManualApprovalAction({ actionName: 'ManualApproval' }));

app.run();
