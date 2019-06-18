import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import targets = require('../../lib');

class MockAction extends codepipeline.Action {
  protected bind(_info: codepipeline.ActionBind): void {
    // void
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'pipeline-events');

const repo = new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'TestRepository'
});

const pipeline = new codepipeline.Pipeline(stack, 'pipelinePipeline22F2A91D');

const srcArtifact = new codepipeline.Artifact('Src');
pipeline.addStage({
  stageName: 'Source',
  actions: [new MockAction({
    actionName: 'CodeCommit',
    category: codepipeline.ActionCategory.Source,
    provider: 'CodeCommit',
    artifactBounds: { minInputs: 0, maxInputs: 0 , minOutputs: 1, maxOutputs: 1, },
    configuration: {
      RepositoryName: repo.repositoryName,
      BranchName: 'master',
    },
    outputs: [srcArtifact]})]
});
pipeline.addStage({
  stageName: 'Build',
  actions: [new MockAction({
    actionName: 'Hello',
    category: codepipeline.ActionCategory.Approval,
    provider: 'Manual',
    artifactBounds: { minInputs: 0, maxInputs: 0 , minOutputs: 0, maxOutputs: 0, }})]
});

new events.Rule(stack, 'rule', {
  schedule: events.Schedule.expression('rate(1 minute)'),
  targets: [new targets.CodePipeline(pipeline)]
});

app.synth();
