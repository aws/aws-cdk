import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

// tslint:disable:object-literal-key-quotes

const app = new cdk.App();

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

const project = new codebuild.PipelineProject(stack, 'MyBuildProject');
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
