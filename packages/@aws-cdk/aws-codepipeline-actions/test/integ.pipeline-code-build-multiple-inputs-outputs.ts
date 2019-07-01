import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codebuild-multiple-inputs-outputs');

const repository = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'MyIntegTestTempRepo',
});
const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
});
const pipelineRole = pipeline.role;

const source1Output = new codepipeline.Artifact();
const sourceAction1 = new cpactions.CodeCommitSourceAction({
  actionName: 'Source1',
  repository,
  output: source1Output,
  role: pipelineRole,
});
const source2Output = new codepipeline.Artifact();
const sourceAction2 = new cpactions.S3SourceAction({
  actionName: 'Source2',
  bucketKey: 'some/path',
  bucket,
  output: source2Output,
  role: pipelineRole,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [
    sourceAction1,
    sourceAction2,
  ],
});

const project = new codebuild.PipelineProject(stack, 'MyBuildProject');
const buildAction = new cpactions.CodeBuildAction({
  actionName: 'Build1',
  project,
  input: source1Output,
  extraInputs: [
    source2Output,
  ],
  outputs: [
    new codepipeline.Artifact(),
    new codepipeline.Artifact(),
  ],
  role: pipelineRole,
});
const testAction = new cpactions.CodeBuildAction({
  type: cpactions.CodeBuildActionType.TEST,
  actionName: 'Build2',
  project,
  input: source2Output,
  extraInputs: [
    source1Output,
  ],
  outputs: [
    new codepipeline.Artifact('CustomOutput2'),
  ],
  role: pipelineRole,
});
pipeline.addStage({
  stageName: 'Build',
  actions: [
    buildAction,
    testAction,
  ],
});

app.synth();
