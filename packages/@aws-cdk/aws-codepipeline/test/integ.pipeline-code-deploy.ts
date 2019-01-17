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
  artifactsStore: new codepipeline.ArtifactsStore(stack, 'ArtifactsStore', {
    bucket
  })
});

const sourceStage = new codepipeline.Stage(stack, 'Source', { pipeline });
bucket.addToPipeline(sourceStage, 'S3Source', {
  bucketKey: 'application.zip',
  outputArtifactName: 'SourceOutput',
});

const deployStage = new codepipeline.Stage(stack, 'Deploy', { pipeline });
deploymentGroup.addToPipeline(deployStage, 'CodeDeploy');

app.run();
