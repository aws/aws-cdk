import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-with-pipeline-triggers');

const sourceOutput = new codepipeline.Artifact();
// Make sure you specify a valid connection ARN.
const connectionArn = process.env.CONNECTION_ARN || 'MOCK';
const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'CodeStarConnectionsSourceAction',
  output: sourceOutput,
  connectionArn,
  owner: 'go-to-k',
  repo: 'cdk-pipelines-demo',
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          project: new codebuild.PipelineProject(stack, 'MyProject'),
          input: sourceOutput,
          outputs: [new codepipeline.Artifact()],
          environmentVariables: {
            CommitId: { value: sourceAction.variables.commitId },
          },
        }),
      ],
    },
  ],
  triggers: [{
    providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
    gitConfiguration: {
      sourceAction,
      pushFilter: [{
        excludedTags: ['exclude1', 'exclude2'],
        includedTags: ['include1', 'include2'],
      }],
    },
  }],
});

new IntegTest(app, 'codepipeline-with-pipeline-triggers-test', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
