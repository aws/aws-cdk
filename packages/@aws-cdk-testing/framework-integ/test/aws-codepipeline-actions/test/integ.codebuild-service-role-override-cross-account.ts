import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Cross-account variant: the CodeBuild project lives in account B and the pipeline in account A.
 * With the `@aws-cdk/aws-codepipeline-actions:autoScopeCodeBuildRoleForFullClone` flag enabled, the
 * repository-scoped service role is auto-created in the project account (B), the `iam:PassRole` grant
 * lands on the account-B action role, and the pipeline (A) references it via `ServiceRoleArnOverride`.
 */

const pipelineAccount = process.env.PIPELINE_ACCOUNT || '111111111111';
const projectAccount = process.env.PROJECT_ACCOUNT || '222222222222';
const region = process.env.CDK_INTEG_REGION || 'us-east-1';

const app = new cdk.App({
  context: {
    '@aws-cdk/aws-codepipeline-actions:autoScopeCodeBuildRoleForFullClone': true,
  },
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const projectStack = new cdk.Stack(app, 'codebuild-service-role-override-cross-account-project', {
  env: { account: projectAccount, region },
});

const pipelineStack = new cdk.Stack(app, 'codebuild-service-role-override-cross-account-pipeline', {
  env: { account: pipelineAccount, region },
});

const connectionArn = process.env.CONNECTION_ARN
  || `arn:aws:codeconnections:${region}:${pipelineAccount}:connection/MOCK`;
const owner = process.env.REPO_OWNER || 'test-owner';
const repo = process.env.REPO_NAME || 'test-repo';
const branch = process.env.BRANCH || 'master';

const project = new codebuild.PipelineProject(projectStack, 'MyBuildProject', {
  projectName: 'my-cross-account-full-clone-project',
  ...(process.env.INLINE_BUILDSPEC ? {
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: { build: { commands: ['echo "Full Clone source checked out by the scoped override role"'] } },
    }),
  } : {}),
});

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'CodeStarConnectionsSourceAction',
  output: sourceOutput,
  connectionArn,
  owner,
  repo,
  branch,
  codeBuildCloneOutput: true,
});

const buildAction = new cpactions.CodeBuildAction({
  actionName: 'CodeBuildFullCloneAction',
  project,
  input: sourceOutput,
});

new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [buildAction],
    },
  ],
});

new IntegTest(app, 'codebuild-service-role-override-cross-account-test', {
  testCases: [pipelineStack],
  diffAssets: true,
});
