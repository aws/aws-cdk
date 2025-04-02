import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

/*
 * To run this integ test, the following steps are required.
 *
 * 1. Create a test repository with any repository name on your GitHub account
 * 2. Create a Connections in the CodePipeline management console that accesses your GitHub account
 * 3. Set the ARN of that Connections to the `CONNECTION_ARN` environment variable in the integ test execution environment
 * 4. Set your GitHub account name and the repository name to the `REPO_OWNER` and `REPO_NAME` environment variables in the integ test execution environment
 * 5. After running the integ test, replace the value of `CONNECTION_ARN`, `REPO_OWNER`, and `REPO_NAME` written in the file generated in CloudAssembly (integ.THIS_FILE.js.snapshot/*) with the string `MOCK`
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'codepipeline-source-code-scan-action');

// Make sure you specify your connection ARN, your repository owner and name.
const connectionArn = process.env.CONNECTION_ARN || 'MOCK';
const owner = process.env.REPO_OWNER || 'MOCK';
const repo = process.env.REPO_NAME || 'MOCK';
if (connectionArn === 'MOCK') {
  cdk.Annotations.of(stack).addWarningV2('integ:connection-arn', 'You must specify your connection ARN in the CONNECTION_ARN environment variable');
}
if (owner === 'MOCK') {
  cdk.Annotations.of(stack).addWarningV2('integ:repo-owner', 'You must specify your repository owner in the REPO_OWNER environment variable');
}
if (repo === 'MOCK') {
  cdk.Annotations.of(stack).addWarningV2('integ:repo-name', 'You must specify your repository name in the REPO_NAME environment variable');
}

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'CodeStarConnectionsSourceAction',
  output: sourceOutput,
  connectionArn,
  owner,
  repo,
});

const scanOutput = new codepipeline.Artifact();
const scanAction = new cpactions.InspectorSourceCodeScanAction({
  actionName: 'InspectorSourceCodeScanAction',
  input: sourceOutput,
  output: scanOutput,
  criticalThreshold: 1,
  highThreshold: 1,
  mediumThreshold: 1,
  lowThreshold: 1,
});

const deployBucket = new s3.Bucket(stack, 'DeployBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const deployAction = new cpactions.S3DeployAction({
  actionName: 'DeployAction',
  input: scanOutput,
  bucket: deployBucket,
  objectKey: 'my-key',
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Invoke',
      actions: [scanAction],
    },
    {
      stageName: 'Deploy',
      actions: [deployAction],
    },
  ],
});

const integ = new IntegTest(app, 'codepipeline-source-code-scan-action-test', {
  testCases: [stack],
  diffAssets: true,
});

const startPipelineCall = integ.assertions.awsApiCall('CodePipeline', 'startPipelineExecution', {
  name: pipeline.pipelineName,
});

startPipelineCall.next(
  integ.assertions.awsApiCall('CodePipeline', 'getPipelineState', {
    name: pipeline.pipelineName,
  }).expect(ExpectedResult.objectLike({
    stageStates: Match.arrayWith([
      Match.objectLike({
        stageName: 'Invoke',
        latestExecution: Match.objectLike({
          status: 'Succeeded',
        }),
      }),
    ]),
  })).waitForAssertions({
    totalTimeout: cdk.Duration.minutes(5),
  }),
);
