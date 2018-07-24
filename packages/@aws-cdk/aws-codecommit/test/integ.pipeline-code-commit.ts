import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import codecommit = require('../lib');

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
