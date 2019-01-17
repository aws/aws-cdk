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
  artifactsStore: new codepipeline.ArtifactsStore(stack, 'ArtifactsStore', { bucket } )
});

const repository = new ecr.Repository(stack, 'MyEcrRepo');
const sourceStage = pipeline.addStage('Source');
repository.addToPipeline(sourceStage, 'ECR_Source');

const approveStage = pipeline.addStage('Approve');
new codepipeline.ManualApprovalAction(stack, 'ManualApproval', {
  stage: approveStage,
});

app.run();
