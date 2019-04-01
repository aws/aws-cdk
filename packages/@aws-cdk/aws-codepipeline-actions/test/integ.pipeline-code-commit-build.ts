import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import cpactions = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-codebuild');

const repository = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});
const sourceAction = new cpactions.CodeCommitSourceAction({
  actionName: 'source',
  outputArtifactName: 'SourceArtifact',
  repository,
  pollForSourceChanges: true,
});

const project = new codebuild.Project(stack, 'MyBuildProject', {
  source: new codebuild.CodePipelineSource(),
});
const buildAction = new cpactions.CodeBuildBuildAction({
  actionName: 'build',
  project,
  inputArtifact: sourceAction.outputArtifact,
});
const testAction = new cpactions.CodeBuildTestAction({
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
