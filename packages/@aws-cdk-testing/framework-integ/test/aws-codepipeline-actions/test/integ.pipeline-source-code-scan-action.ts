import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

/*
 * To run this integ test, the following steps are required.
 * 1. Create a test repository on GitHub (in the code below, it is 'cdk-codepipeline-demo-1')
 * 2. Create a Dockerfile with any content at the path `./my-dir/Dockerfile`
 * 3. Set the `owner` and `repo` of `CodeStarConnectionsSourceAction` to your GitHub account name and repository name
 * 4. Create a Connections in the CodePipeline management console that accesses your GitHub account
 * 5. Set the ARN of that Connections to the `CONNECTION_ARN` environment variable in the integ test execution environment
 * 6. After running the integ test, replace the value of CONNECTION_ARN written in the file generated in CloudAssembly (integ.pipeline-source-code-scan-action.js.snapshot/*) with the string `MOCK`
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'codepipeline-source-code-scan-action');

// Make sure you specify a valid connection ARN.
const connectionArn = process.env.CONNECTION_ARN || 'MOCK';
if (connectionArn === 'MOCK') {
  cdk.Annotations.of(stack).addWarningV2('integ:connection-arn', 'You must specify a valid connection ARN in the CONNECTION_ARN environment variable');
}

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'CodeStarConnectionsSourceAction',
  output: sourceOutput,
  connectionArn,
  // Please change the owner and repo if you execute this test
  owner: 'go-to-k',
  repo: 'cdk-codepipeline-demo-1',
});

const buildOutput = new codepipeline.Artifact();
const buildAction = new cpactions.InspectorSourceCodeScanAction({
  actionName: 'InspectorSourceCodeScanAction',
  input: sourceOutput,
  output: buildOutput,
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
  input: buildOutput,
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
      actions: [buildAction],
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
