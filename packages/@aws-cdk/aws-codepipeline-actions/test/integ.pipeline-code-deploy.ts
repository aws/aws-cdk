import codedeploy = require('@aws-cdk/aws-codedeploy');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codedeploy');

const application = new codedeploy.ServerApplication(stack, 'CodeDeployApplication', {
  applicationName: 'IntegTestDeployApp',
});

const deploymentConfig = new codedeploy.ServerDeploymentConfig(stack, 'CustomDeployConfig', {
  minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(0),
});

const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'CodeDeployGroup', {
  application,
  deploymentGroupName: 'IntegTestDeploymentGroup',
  deploymentConfig,
});

const bucket = new s3.Bucket(stack, 'CodeDeployPipelineIntegTest', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
});

const sourceStage = pipeline.addStage({ stageName: 'Source' });
const sourceOutput = new codepipeline.Artifact('SourceOutput');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'S3Source',
  bucketKey: 'application.zip',
  output: sourceOutput,
  bucket,
});
sourceStage.addAction(sourceAction);

const deployStage = pipeline.addStage({ stageName: 'Deploy' });
deployStage.addAction(new cpactions.CodeDeployServerDeployAction({
  actionName: 'CodeDeploy',
  deploymentGroup,
  input: sourceOutput,
}));

app.synth();
