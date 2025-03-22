import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  treeMetadata: false,
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-with-pipeline-triggers');
const codeStarConnection = new cdk.aws_codestarconnections.CfnConnection(stack, 'test-connection', {
  connectionName: 'test-connection',
  providerType: 'GitHub',
});

const connectionArn = codeStarConnection.attrConnectionArn;

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

// for pull request filter with branches and file paths
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
      pullRequestFilter: [{
        branchesExcludes: ['exclude1', 'exclude2'],
        branchesIncludes: ['include1', 'include2'],
        filePathsExcludes: ['/path/to/exclude1', '/path/to/exclude2'],
        filePathsIncludes: ['/path/to/include1', '/path/to/include2'],
        events: [codepipeline.GitPullRequestEvent.OPEN, codepipeline.GitPullRequestEvent.UPDATED],
      }],
    },
  }],
});

const inputArtifact = new codepipeline.Artifact();
const outputArtifact = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'integ-action-name',
  output: inputArtifact,
  connectionArn,
  owner: 'cp-dev',
  repo: 'cp-triggers-integ-repo',
});

new codepipeline.Pipeline(stack, 'codepipeline-integ-trigger-test', {
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
  triggers: [{
    providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
    gitConfiguration: {
      sourceAction: sourceAction,
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

const awsApiCall3 = integrationTest.assertions.awsApiCall('CodePipeline', 'getPipeline', { name: 'codepipeline-integ-trigger-test' });
awsApiCall3.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp('my-codepipeline-integ-trigger-test'));
awsApiCall1.assertAtPath('pipeline.stages.0.name', ExpectedResult.stringLikeRegexp('Source'));
awsApiCall1.assertAtPath('pipeline.stages.1.name', ExpectedResult.stringLikeRegexp('Build'));
awsApiCall1.assertAtPath('pipeline.triggers.0.providerType', ExpectedResult.stringLikeRegexp(codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION));
awsApiCall1.assertAtPath('pipeline.triggers.0.gitConfiguration.sourceActionName', ExpectedResult.stringLikeRegexp('integ-action-name'));
awsApiCall1.assertAtPath('pipeline.triggers.0.gitConfiguration.push.0',
  ExpectedResult.objectLike({
    branches: {
      includes: ['include1', 'include2'],
      excludes: ['exclude1', 'exclude2'],
    },
    filePaths: {
      includes: ['/path/to/include1', '/path/to/include2'],
      excludes: ['/path/to/exclude1', '/path/to/exclude2'],
    },
  }));

app.synth();
