import * as codecommit from '../../aws-codecommit';
import * as codepipeline from '../../aws-codepipeline';
import * as cdk from '../../core';
import * as cpactions from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');

/// !show
// Source stage: read from repository
const repo = new codecommit.Repository(stack, 'TemplateRepo', {
  repositoryName: 'template-repo',
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const source = new cpactions.CodeCommitSourceAction({
  actionName: 'Source',
  repository: repo,
  output: sourceOutput,
  trigger: cpactions.CodeCommitTrigger.POLL,
});
const sourceStage = {
  stageName: 'Source',
  actions: [source],
};

// Deployment stage: create and deploy changeset with manual approval
const stackName = 'OurStack';
const changeSetName = 'StagedChangeSet';

const prodStage = {
  stageName: 'Deploy',
  actions: [
    new cpactions.CloudFormationCreateReplaceChangeSetAction({
      actionName: 'PrepareChanges',
      stackName,
      changeSetName,
      adminPermissions: true,
      templatePath: sourceOutput.atPath('template.yaml'),
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

app.synth();
