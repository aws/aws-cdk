import codecommit = require('@aws-cdk/aws-codecommit');
import codecommitpl = require('@aws-cdk/aws-codecommit-codepipeline');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import cfnpl = require('../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');

/// !show
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

// Source stage: read from repository
const repo = new codecommit.Repository(stack, 'TemplateRepo', {
    repositoryName: 'template-repo'
});
const sourceStage = new codepipeline.Stage(pipeline, 'Source');
const source = new codecommitpl.PipelineSource(sourceStage, 'Source', {
    repository: repo,
    artifactName: 'SourceArtifact',
});

// Deployment stage: create and deploy changeset with manual approval
const prodStage = new codepipeline.Stage(pipeline, 'Deploy');
const stackName = 'OurStack';
const changeSetName = 'StagedChangeSet';

new cfnpl.CreateReplaceChangeSet(prodStage, 'PrepareChanges', {
    stackName,
    changeSetName,
    templatePath: source.artifact.subartifact('template.yaml'),
});

new codepipeline.ApprovalAction(prodStage, 'ApproveChanges');

new cfnpl.ExecuteChangeSet(prodStage, 'ExecuteChanges', {
    stackName,
    changeSetName,
});
/// !hide

process.stdout.write(app.run());