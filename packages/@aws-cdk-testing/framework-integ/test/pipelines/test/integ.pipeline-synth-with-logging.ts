import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib/core';
import { Stack } from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { GitHubTrigger } from 'aws-cdk-lib/aws-codepipeline-actions';

/*
 * Stack verification steps:
 * * aws codebuild batch-get-projects --names <synth codebuild project name> : should return correct cloudwatchlog settings
 */
const app = new cdk.App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});
const stack = new Stack(app, 'LoggingPipelineStack');

const logGroup = new logs.LogGroup(stack, 'LogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const pipeline = new pipelines.CodePipeline(stack, 'Pipeline', {
  synth: new pipelines.CodeBuildStep('Synth', {
    input: pipelines.CodePipelineSource.gitHub('yo-ga/cdk-playground', 'main', {
      trigger: GitHubTrigger.NONE,
    }),
    commands: [
      'npm ci',
      'npm run build',
      'npx cdk synth',
    ],
    cloudWatchLogging: {
      logGroup: logGroup,
      prefix: 'prefix',
    },
  }),
});

const testCase = new integ.IntegTest(app, 'PipelineLoggingTest', {
  testCases: [stack],
});

pipeline.buildPipeline();
testCase.assertions
  .awsApiCall('CodeBuild', 'batchGetProjects', {
    names: [pipeline.synthProject.projectName],
  })
  .assertAtPath('projects.0.logsConfig.cloudWatchLogs.status', ExpectedResult.stringLikeRegexp('ENABLED'))
  .assertAtPath('projects.0.logsConfig.cloudWatchLogs.logGroup', ExpectedResult.stringLikeRegexp(logGroup.logGroupName))
  .assertAtPath('projects.0.logsConfig.cloudWatchLogs.streamName', ExpectedResult.stringLikeRegexp('prefix'));

app.synth();
