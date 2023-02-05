/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import { GitHubTrigger } from '@aws-cdk/aws-codepipeline-actions';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { ExpectedResult } from '@aws-cdk/integ-tests';
import * as pipelines from '../lib';

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
  codeBuildDefaults: {
    logging: {
      cloudWatch: {
        logGroup: logGroup,
        prefix: 'prefix',
        enabled: true,
      },
    },
  },
  synth: new pipelines.CodeBuildStep('Synth', {
    input: pipelines.CodePipelineSource.gitHub('yo-ga/cdk-playground', 'main', {
      trigger: GitHubTrigger.NONE,
    }),
    commands: [
      'npm ci',
      'npm run build',
      'npx cdk synth',
    ],
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
