import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import cpactions = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');

/// !show
// Source stage: read from repository
const repo = new codecommit.Repository(stack, 'TemplateRepo', {
  repositoryName: 'template-repo'
});
const source = new cpactions.CodeCommitSourceAction({
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
    new cpactions.CloudFormationCreateReplaceChangeSetAction({
      actionName: 'PrepareChanges',
      stackName,
      changeSetName,
      adminPermissions: true,
      templatePath: source.outputArtifact.atPath('template.yaml'),
      runOrder: 1,
    }),
    new cpactions.ManualApprovalAction({
      actionName: 'ApproveChanges',
      runOrder: 2,
    }),
    new cpactions.CloudFormationExecuteChangeSetAction({
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
