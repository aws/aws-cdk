import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cp from 'aws-cdk-lib/aws-codepipeline';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-integ-test-service-roles-for-actions');
const pipelineServiceRole = new iam.Role(stack, 'pipeline-role', {
  assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
  description: 'Service role for CodePipeline with CodeBuild, S3, and CodeDeploy permissions',
});

// Add CodeBuild permissions
pipelineServiceRole.addToPolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    'codebuild:BatchGetBuilds',
    'codebuild:StartBuild',
    'codebuild:StopBuild',
    'codebuild:RetryBuild',
  ],
  resources: ['*'],
}));
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

new cp.Pipeline(stack, 'codepipeline-integ-trigger-test', {
  pipelineName: 'codepipeline-integ-trigger-test',
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
new IntegTest(app, 'codepipeline-integ-test', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

app.synth();
