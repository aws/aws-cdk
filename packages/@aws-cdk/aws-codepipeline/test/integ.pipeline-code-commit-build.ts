import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-codebuild');

const repository = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});
const sourceAction = new codecommit.PipelineSourceAction({
  actionName: 'source',
  outputArtifactName: 'SourceArtifact',
  repository,
  pollForSourceChanges: true,
});

const project = new codebuild.Project(stack, 'MyBuildProject', {
  source: new codebuild.CodePipelineSource(),
});
const buildAction = new codebuild.PipelineBuildAction({
  actionName: 'build',
  project,
  inputArtifact: sourceAction.outputArtifact,
});
const testAction = new codebuild.PipelineTestAction({
  actionName: 'test',
  project,
  inputArtifact: sourceAction.outputArtifact,
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    {
      name: 'source',
      actions: [sourceAction],
    },
  ],
}).addStage({
  name: 'build',
  actions: [
    buildAction,
    testAction,
  ],
});

app.run();
