import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
  },
});

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

const project = new codebuild.PipelineProject(stack, 'MyBuildProject', {
  grantReportGroupPermissions: false,
});
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
