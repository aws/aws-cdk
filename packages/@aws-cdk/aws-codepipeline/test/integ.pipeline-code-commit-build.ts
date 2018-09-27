import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-codebuild');

const repository = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'source', { pipeline });
const source = new codecommit.PipelineSourceAction(stack, 'source', {
  stage: sourceStage,
  artifactName: 'SourceArtifact',
  repository,
});

const project = new codebuild.Project(stack, 'MyBuildProject', {
  source: new codebuild.CodePipelineSource(),
});

const buildStage = new codepipeline.Stage(pipeline, 'build', { pipeline });
project.addBuildToPipeline(buildStage, 'build', {
  inputArtifact: source.artifact,
});

process.stdout.write(app.run());
