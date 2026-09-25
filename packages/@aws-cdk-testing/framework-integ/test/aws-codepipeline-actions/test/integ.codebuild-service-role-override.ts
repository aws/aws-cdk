import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Full Clone CodeConnections source feeding a CodeBuild action with the
 * `@aws-cdk/aws-codepipeline-actions:autoScopeCodeBuildRoleForFullClone` feature flag enabled:
 * the action auto-creates a repository-scoped CodeBuild service role and wires it via the
 * `ServiceRoleArnOverride` action configuration property.
 */

const app = new cdk.App({
  context: {
    '@aws-cdk/aws-codepipeline-actions:autoScopeCodeBuildRoleForFullClone': true,
  },
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'codebuild-service-role-override');

const connectionArn = process.env.CONNECTION_ARN || 'arn:aws:codeconnections:us-east-1:123456789012:connection/MOCK';
const owner = process.env.REPO_OWNER || 'test-owner';
const repo = process.env.REPO_NAME || 'test-repo';
const branch = process.env.BRANCH || 'master';

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

const project = new codebuild.PipelineProject(stack, 'MyBuildProject', process.env.INLINE_BUILDSPEC ? {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: { build: { commands: ['echo "Full Clone source checked out by the scoped override role"'] } },
  }),
} : undefined);

const buildAction = new cpactions.CodeBuildAction({
  actionName: 'CodeBuildFullCloneAction',
  project,
  input: sourceOutput,
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
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

new IntegTest(app, 'codebuild-service-role-override-test', {
  testCases: [stack],
  diffAssets: true,
});
