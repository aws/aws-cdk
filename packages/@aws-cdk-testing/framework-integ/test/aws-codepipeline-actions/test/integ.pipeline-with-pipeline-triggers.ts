import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-with-pipeline-triggers');

// Make sure you specify a valid connection ARN.
const connectionArn = process.env.CONNECTION_ARN || 'MOCK';
if (connectionArn === 'MOCK') {
  cdk.Annotations.of(stack).addWarningV2('integ:connection-arn', 'You must specify a valid connection ARN in the CONNECTION_ARN environment variable');
}

const sourceOutput1 = new codepipeline.Artifact();
const sourceAction1 = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'CodeStarConnectionsSourceAction',
  output: sourceOutput1,
  connectionArn,
  owner: 'go-to-k',
  repo: 'cdk-codepipeline-demo-1',
});

// for push filter with tags
new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineName: 'my-pipeline',
  pipelineType: codepipeline.PipelineType.V2,
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction1],
    },
    {
      stageName: 'Build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          project: new codebuild.PipelineProject(stack, 'MyProject'),
          input: sourceOutput1,
          outputs: [new codepipeline.Artifact()],
          environmentVariables: {
            CommitId: { value: sourceAction1.variables.commitId },
          },
        }),
      ],
    },
  ],
  triggers: [{
    providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
    gitConfiguration: {
      sourceAction: sourceAction1,
      pushFilter: [{
        tagsExcludes: ['exclude1', 'exclude2'],
        tagsIncludes: ['include1', 'include2'],
      }],
    },
  }],
});

const sourceOutput2 = new codepipeline.Artifact();
const sourceAction2 = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'CodeStarConnectionsSourceAction2',
  output: sourceOutput2,
  connectionArn,
  owner: 'go-to-k',
  repo: 'cdk-codepipeline-demo-2',
});

// for push filter with branches and file paths
new codepipeline.Pipeline(stack, 'Pipeline2', {
  pipelineName: 'my-pipeline2',
  pipelineType: codepipeline.PipelineType.V2,
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction2],
    },
    {
      stageName: 'Build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'CodeBuild2',
          project: new codebuild.PipelineProject(stack, 'MyProject2'),
          input: sourceOutput2,
          outputs: [new codepipeline.Artifact()],
          environmentVariables: {
            CommitId: { value: sourceAction2.variables.commitId },
          },
        }),
      ],
    },
  ],
  triggers: [{
    providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
    gitConfiguration: {
      sourceAction: sourceAction2,
      pushFilter: [{
        branchesExcludes: ['exclude1', 'exclude2'],
        branchesIncludes: ['include1', 'include2'],
        filePathsExcludes: ['/path/to/exclude1', '/path/to/exclude2'],
        filePathsIncludes: ['/path/to/include1', '/path/to/include2'],
      }],
    },
  }],
});

const integrationTest = new IntegTest(app, 'codepipeline-with-pipeline-triggers-test', {
  testCases: [stack],
  diffAssets: true,
});

const awsApiCall1 = integrationTest.assertions.awsApiCall('CodePipeline', 'getPipeline', { name: 'my-pipeline' });
awsApiCall1.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp('my-pipeline'));

const awsApiCall2 = integrationTest.assertions.awsApiCall('CodePipeline', 'getPipeline', { name: 'my-pipeline2' });
awsApiCall2.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp('my-pipeline2'));

app.synth();
