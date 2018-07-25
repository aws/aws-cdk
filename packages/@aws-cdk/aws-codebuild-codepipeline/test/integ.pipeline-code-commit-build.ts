import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codecommitPipeline = require('@aws-cdk/aws-codecommit-codepipeline');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import codebuildPipeline = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-codebuild');

const repo = new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'source');
const source = new codecommitPipeline.PipelineSource(sourceStage, 'source', {
    artifactName: 'SourceArtifact',
    repository: repo,
});

const buildStage = new codepipeline.Stage(pipeline, 'build');
const project = new codebuild.BuildProject(stack, 'MyBuildProject', {
    source: new codebuild.CodePipelineSource(),
});

new codebuildPipeline.PipelineBuildAction(buildStage, 'build', {
    project,
    inputArtifact: source.artifact
});

process.stdout.write(app.run());
