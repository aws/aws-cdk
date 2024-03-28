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

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codebuild-batch');

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

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.CodeCommitSourceAction({
  actionName: 'Source',
  repository,
  output: sourceOutput,
  role: pipelineRole,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [
    sourceAction,
  ],
});

const project = new codebuild.PipelineProject(stack, 'MyBuildProject', {
  grantReportGroupPermissions: false,
});
const buildAction = new cpactions.CodeBuildAction({
  actionName: 'Build',
  project,
  executeBatchBuild: true,
  input: sourceOutput,
  role: pipelineRole,
});
pipeline.addStage({
  stageName: 'Build',
  actions: [
    buildAction,
  ],
});

app.synth();
