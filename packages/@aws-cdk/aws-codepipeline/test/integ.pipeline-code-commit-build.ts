import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-codebuild');

const repository = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'source', { pipeline });
new codecommit.PipelineSourceAction(stack, 'source', {
  stage: sourceStage,
  outputArtifactName: 'SourceArtifact',
  repository,
  pollForSourceChanges: true,
});

const project = new codebuild.Project(stack, 'MyBuildProject', {
  source: new codebuild.CodePipelineSource(),
});

const buildStage = new codepipeline.Stage(pipeline, 'build', { pipeline });
project.addBuildToPipeline(buildStage, 'build');
project.addTestToPipeline(buildStage, 'test');

app.run();
