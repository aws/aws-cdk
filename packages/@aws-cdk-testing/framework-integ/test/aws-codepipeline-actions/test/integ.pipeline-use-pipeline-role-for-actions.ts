import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as cdk from 'aws-cdk-lib';
import * as cp from 'aws-cdk-lib/aws-codepipeline';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-integ-test-service-roles-for-actions');
const inputArtifact = new cp.Artifact();
const outputArtifact = new cp.Artifact();
const codeStarConnection = new cdk.aws_codestarconnections.CfnConnection(stack, 'test-connection', {
  connectionName: 'test-connection',
  providerType: 'GitHub',
});

const connectionArn = codeStarConnection.attrConnectionArn;
const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'integ-action-name',
  output: inputArtifact,
  connectionArn,
  owner: 'cp-dev',
  repo: 'cp-triggers-integ-repo',
});

const pipelineName = 'codepipeline-integ-trigger-test';
new cp.Pipeline(stack, 'codepipeline-integ-trigger-test', {
  pipelineName,
  usePipelineRoleForActions: true,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'CodeBuildAction',
          project: new codebuild.PipelineProject(stack, 'cp-trigger-integ-test'),
          input: inputArtifact,
          outputs: [outputArtifact],
          environmentVariables: {
            CommitId: { value: sourceAction.variables.commitId },
          },
        }),
      ],
    },
  ],
});
const integrationTest = new IntegTest(app, 'codepipeline-integ-test', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

const awsApiCall1 = integrationTest.assertions.awsApiCall('CodePipeline', 'getPipeline', { name: pipelineName });
awsApiCall1.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp(pipelineName));
app.synth();
