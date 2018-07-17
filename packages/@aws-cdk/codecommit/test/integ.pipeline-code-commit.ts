import * as cdk from '@aws-cdk/cdk';
import * as codepipeline from '@aws-cdk/codepipeline';
import * as codecommit from '../lib';

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit');

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
