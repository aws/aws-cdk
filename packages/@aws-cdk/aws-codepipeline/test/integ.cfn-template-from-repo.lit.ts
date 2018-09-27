import cfn = require('@aws-cdk/aws-cloudformation');
import codecommit = require('@aws-cdk/aws-codecommit');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');

/// !show
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

// Source stage: read from repository
const repo = new codecommit.Repository(stack, 'TemplateRepo', {
  repositoryName: 'template-repo'
});
const sourceStage = new codepipeline.Stage(pipeline, 'Source', { pipeline });
const source = new codecommit.PipelineSourceAction(stack, 'Source', {
  stage: sourceStage,
  repository: repo,
  artifactName: 'SourceArtifact',
});

// Deployment stage: create and deploy changeset with manual approval
const prodStage = new codepipeline.Stage(pipeline, 'Deploy', { pipeline });
const stackName = 'OurStack';
const changeSetName = 'StagedChangeSet';

new cfn.PipelineCreateReplaceChangeSetAction(prodStage, 'PrepareChanges', {
  stage: prodStage,
  stackName,
  changeSetName,
  fullPermissions: true,
  templatePath: source.artifact.subartifact('template.yaml'),
});

new codepipeline.ManualApprovalAction(stack, 'ApproveChanges', {
  stage: prodStage,
});

new cfn.PipelineExecuteChangeSetAction(stack, 'ExecuteChanges', {
  stage: prodStage,
  stackName,
  changeSetName,
});
/// !hide

process.stdout.write(app.run());
