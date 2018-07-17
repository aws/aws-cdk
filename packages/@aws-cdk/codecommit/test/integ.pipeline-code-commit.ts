import * as codepipeline from '@aws-cdk/codepipeline';
import { App, Stack } from '@aws-cdk/core';
import * as codecommit from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-codepipeline-codecommit');

const repo = new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'source');
new codecommit.PipelineSource(sourceStage, 'source', {
    artifactName: 'SourceArtifact',
    repository: repo,
});

const buildStage = new codepipeline.Stage(pipeline, 'build');
new codepipeline.ApprovalAction(buildStage, 'manual');

process.stdout.write(app.run());
