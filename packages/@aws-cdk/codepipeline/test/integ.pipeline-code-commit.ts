import { BuildProject, CodePipelineSource } from '@aws-cdk/codebuild';
import { Repository } from '@aws-cdk/codecommit';
import { App, Stack } from '@aws-cdk/core';
import { CodeBuildAction, CodeCommitSource, Pipeline, Stage } from '../lib';
const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-codepipeline-codecommit');

const repo = new Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

const pipeline = new Pipeline(stack, 'Pipeline');

const sourceStage = new Stage(pipeline, 'source');
const source = new CodeCommitSource(sourceStage, 'source', {
    artifactName: 'SourceArtifact',
    repository: repo,
});

const buildStage = new Stage(pipeline, 'build');
const project = new BuildProject(stack, 'MyBuildProject', {
    source: new CodePipelineSource(),
});

new CodeBuildAction(buildStage, 'build', {
    project,
    inputArtifact: source.artifact
});

process.stdout.write(app.run());
