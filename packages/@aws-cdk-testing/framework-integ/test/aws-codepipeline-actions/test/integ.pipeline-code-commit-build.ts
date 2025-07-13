import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

/* eslint-disable quote-props */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-codebuild');

const repository = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.CodeCommitSourceAction({
  actionName: 'source',
  output: sourceOutput,
  repository,
  trigger: cpactions.CodeCommitTrigger.POLL,
});

const project = new codebuild.PipelineProject(stack, 'MyBuildProject', {
  grantReportGroupPermissions: false,
});
const buildAction = new cpactions.CodeBuildAction({
  actionName: 'build',
  project,
  input: sourceOutput,
  outputs: [new codepipeline.Artifact()],
  environmentVariables: {
    'TEST_ENV_VARIABLE': {
      value: 'test env variable value',
    },
    'PARAM_STORE_VARIABLE': {
      value: 'param_store',
      type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
    },
  },
});
const testAction = new cpactions.CodeBuildAction({
  type: cpactions.CodeBuildActionType.TEST,
  actionName: 'test',
  project,
  input: sourceOutput,
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'source',
      actions: [sourceAction],
    },
  ],
}).addStage({
  stageName: 'build',
  actions: [
    buildAction,
    testAction,
  ],
});

app.synth();
