import codedeploy = require('@aws-cdk/aws-codedeploy');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codedeploy');

const application = new codedeploy.ServerApplication(stack, 'CodeDeployApplication', {
  applicationName: 'IntegTestDeployApp',
});

const deploymentConfig = new codedeploy.ServerDeploymentConfig(stack, 'CustomDeployConfig', {
  minHealthyHostCount: 0,
});

const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'CodeDeployGroup', {
  application,
  deploymentGroupName: 'IntegTestDeploymentGroup',
  deploymentConfig,
});

const bucket = new s3.Bucket(stack, 'CodeDeployPipelineIntegTest', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.Destroy,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
});

const sourceStage = pipeline.addStage({ name: 'Source' });
const sourceAction = bucket.toCodePipelineSourceAction({
  actionName: 'S3Source',
  bucketKey: 'application.zip',
  outputArtifactName: 'SourceOutput',
});
sourceStage.addAction(sourceAction);

const deployStage = pipeline.addStage({ name: 'Deploy' });
deployStage.addAction(deploymentGroup.toCodePipelineDeployAction({
  actionName: 'CodeDeploy',
  inputArtifact: sourceAction.outputArtifact,
}));

app.run();
