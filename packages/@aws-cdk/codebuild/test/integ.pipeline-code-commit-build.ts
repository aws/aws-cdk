import * as cdk from '@aws-cdk/cdk';
import * as codecommit from '@aws-cdk/codecommit';
import * as codepipeline from '@aws-cdk/codepipeline';
import * as codebuild from '../lib';

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-codebuild');

const repo = new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'source');
const source = new codecommit.PipelineSource(sourceStage, 'source', {
    artifactName: 'SourceArtifact',
    repository: repo,
});

const buildStage = new codepipeline.Stage(pipeline, 'build');
const project = new codebuild.BuildProject(stack, 'MyBuildProject', {
    source: new codebuild.CodePipelineSource(),
});

new codebuild.PipelineBuildAction(buildStage, 'build', {
    project,
    inputArtifact: source.artifact
});

process.stdout.write(app.run());
