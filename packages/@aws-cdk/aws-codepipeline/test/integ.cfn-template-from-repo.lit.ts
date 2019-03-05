import cfn = require('@aws-cdk/aws-cloudformation');
import codecommit = require('@aws-cdk/aws-codecommit');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');

/// !show
// Source stage: read from repository
const repo = new codecommit.Repository(stack, 'TemplateRepo', {
  repositoryName: 'template-repo'
});
const source = new codecommit.PipelineSourceAction({
  actionName: 'Source',
  repository: repo,
  outputArtifactName: 'SourceArtifact',
  pollForSourceChanges: true,
});
const sourceStage = {
  name: 'Source',
  actions: [source],
};

// Deployment stage: create and deploy changeset with manual approval
const stackName = 'OurStack';
const changeSetName = 'StagedChangeSet';

const prodStage = {
  name: 'Deploy',
  actions: [
    new cfn.PipelineCreateReplaceChangeSetAction({
      actionName: 'PrepareChanges',
      stackName,
      changeSetName,
      adminPermissions: true,
      templatePath: source.outputArtifact.atPath('template.yaml'),
      runOrder: 1,
    }),
    new codepipeline.ManualApprovalAction({
      actionName: 'ApproveChanges',
      runOrder: 2,
    }),
    new cfn.PipelineExecuteChangeSetAction({
      actionName: 'ExecuteChanges',
      stackName,
      changeSetName,
      runOrder: 3,
    }),
  ],
};

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
      sourceStage,
      prodStage,
  ],
});
/// !hide

app.run();
