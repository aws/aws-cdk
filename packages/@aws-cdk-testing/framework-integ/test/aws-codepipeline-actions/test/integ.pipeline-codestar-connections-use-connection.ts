import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Deploys a pipeline with a CodeStarConnectionsSourceAction (with codeBuildCloneOutput)
 * followed by a CodeBuildAction.
 *
 * Both the source action role and the CodeBuild project role must be allowed
 * 'codestar-connections:UseConnection' and 'codeconnections:UseConnection' on the connection,
 * as required by CodePipeline after AWS CodeStar Connections was renamed to AWS CodeConnections.
 *
 * The connection stays in PENDING status, so the pipeline execution itself is not exercised.
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'codepipeline-codestar-connections-use-connection');

const connection = new cdk.aws_codestarconnections.CfnConnection(stack, 'Connection', {
  connectionName: 'cdk-integ-use-connection',
  providerType: 'GitHub',
});

const sourceOutput = new codepipeline.Artifact();

new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [
        new cpactions.CodeStarConnectionsSourceAction({
          actionName: 'Source',
          output: sourceOutput,
          connectionArn: connection.attrConnectionArn,
          owner: 'aws',
          repo: 'aws-cdk',
          branch: 'main',
          codeBuildCloneOutput: true,
        }),
      ],
    },
    {
      stageName: 'Build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'Build',
          project: new codebuild.PipelineProject(stack, 'Project'),
          input: sourceOutput,
        }),
      ],
    },
  ],
});

new IntegTest(app, 'codepipeline-codestar-connections-use-connection-test', {
  testCases: [stack],
});
