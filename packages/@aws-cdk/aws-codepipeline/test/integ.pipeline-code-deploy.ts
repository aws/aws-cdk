import codedeploy = require('@aws-cdk/aws-codedeploy');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codedeploy');

new codedeploy.cloudformation.ApplicationResource(stack, 'CodeDeployApplication', {
    applicationName: 'IntegTestDeployApp',
    computePlatform: 'Server',
});

const deploymentGroupRole = new iam.Role(stack, 'CodeDeployGroupRole', {
    assumedBy: new cdk.ServicePrincipal('codedeploy.amazonaws.com'),
    managedPolicyArns: ['arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole'],
});

new codedeploy.cloudformation.DeploymentGroupResource(stack, 'CodeDeployGroup', {
    applicationName: 'IntegTestDeployApp',
    serviceRoleArn: deploymentGroupRole.roleArn,
    deploymentGroupName: 'IntegTestDeploymentGroup',
});

const bucket = new s3.Bucket(stack, 'CodeDeployPipelineIntegTest', {
    versioned: true,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
    artifactBucket: bucket,
});

const sourceStage = new codepipeline.Stage(stack, 'Source', { pipeline });
const sourceAction = bucket.addToPipeline(sourceStage, 'S3Source', {
    bucketKey: 'application.zip',
    artifactName: 'SourceOutput',
});

const deployStage = new codepipeline.Stage(stack, 'Deploy', { pipeline });
new codedeploy.PipelineDeployAction(stack, 'CodeDeploy', {
    stage: deployStage,
    inputArtifact: sourceAction.artifact,
    applicationName: 'IntegTestDeployApp',
    deploymentGroupName: 'IntegTestDeploymentGroup',
});

process.stdout.write(app.run());
