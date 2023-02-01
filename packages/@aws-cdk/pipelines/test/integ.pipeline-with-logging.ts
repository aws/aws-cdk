/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import { GitHubTrigger } from '@aws-cdk/aws-codepipeline-actions';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { ExpectedResult } from '@aws-cdk/integ-tests';
import * as pipelines from '../lib';


const app = new cdk.App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});
const stack = new Stack(app, 'LoggingPipelineStack');

const bucket = new s3.Bucket(stack, 'MyLogsBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

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
      s3: {
        encrypted: true,
        bucket: bucket,
        prefix: 'test',
        enabled: true,
      },
    },
  },
  synth: new pipelines.CodeBuildStep('Synth', {
    input: pipelines.CodePipelineSource.gitHub('cdklabs/aws-cdk-testing-examples', 'main', {
      trigger: GitHubTrigger.NONE,
    }),
    commands: [
      'cd typescript',
      'npm ci',
      'npm run build',
      'npx cdk synth',
    ],
  }),
});

const postStep = new pipelines.CodeBuildStep('PostStep', {
  commands: ['export MY_VAR=test'],
});

pipeline.addWave('MyWave', {
  post: [postStep],
});

const testCase = new integ.IntegTest(app, 'PipelineLoggingTest', {
  testCases: [stack],
});

pipeline.buildPipeline();
const synthCodeBuildProject = testCase.assertions.awsApiCall('CodeBuild', 'batchGetProjects', {
  names: [pipeline.synthProject.projectName],
});

synthCodeBuildProject.assertAtPath('Projects.0.LogsConfig.CloudWatchLogs',
  ExpectedResult.objectLike({
    groupName: 'string',
    status: 'string',
    streamName: 'string',
  }));

synthCodeBuildProject.assertAtPath('Projects.0.LogsConfig.S3Logs',
  ExpectedResult.objectLike({
    bucketOwnerAccess: 'string',
    encryptionDisabled: false,
    location: 'string',
    status: 'string',
  }));

app.synth();
