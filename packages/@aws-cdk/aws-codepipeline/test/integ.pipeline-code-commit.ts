import codecommit = require('@aws-cdk/aws-codecommit');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit');

const repo = new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'source', { pipeline });
new codecommit.PipelineSource(stack, 'source', {
    stage: sourceStage,
    artifactName: 'SourceArtifact',
    repository: repo,
});

const buildStage = new codepipeline.Stage(stack, 'build', { pipeline });
new codepipeline.ManualApprovalAction(stack, 'manual', {
    stage: buildStage,
});

process.stdout.write(app.run());
