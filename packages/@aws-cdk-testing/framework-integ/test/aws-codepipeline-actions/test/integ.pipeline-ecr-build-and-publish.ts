import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

/*
 * To run this integ test, the following steps are required.
 * 1. Create a test repository on GitHub (in the code below, it is 'cdk-codepipeline-demo-1')
 * 2. Create a Dockerfile with any content at the path `./my-dir/Dockerfile`
 * 3. Set the `owner` and `repo` of `CodeStarConnectionsSourceAction` to your GitHub account name and repository name
 * 4. Create a Connections in the CodePipeline management console that accesses your GitHub account
 * 5. Set the ARN of that Connections to the `CONNECTION_ARN` environment variable in the integ test execution environment
 * 6. After running the integ test, replace the value of CONNECTION_ARN written in the file generated in CloudAssembly (integ.pipeline-ecr-build-and-publish.js.snapshot/*) with the string `MOCK`
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'codepipeline-ecr-build-and-publish');

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

const repository = new ecr.Repository(stack, 'Repository', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  emptyOnDelete: true,
});

const imageTag1 = 'my-tag-1';
const imageTag2 = 'my-tag-2';
const buildAction = new cpactions.EcrBuildAndPublishAction({
  actionName: 'EcrBuildAndPublishAction',
  repository: repository,
  dockerfileDirectoryPath: './my-dir', // The path indicates ./my-dir/Dockerfile in the source repository
  imageTags: [imageTag1, imageTag2],
  input: sourceOutput,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
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

const integ = new IntegTest(app, 'codepipeline-ecr-build-and-publish-test', {
  testCases: [stack],
  diffAssets: true,
});

const startPipelineCall = integ.assertions.awsApiCall('CodePipeline', 'startPipelineExecution', {
  name: pipeline.pipelineName,
});

const describeImagesCall = integ.assertions.awsApiCall('ECR', 'describeImages', {
  repositoryName: repository.repositoryName,
}).expect(ExpectedResult.objectLike({
  imageDetails: Match.arrayWith([
    Match.objectLike({
      imageTags: Match.arrayWith([imageTag1, imageTag2]),
    }),
  ]),
}));

startPipelineCall.next(
  integ.assertions.awsApiCall('CodePipeline', 'getPipelineState', {
    name: pipeline.pipelineName,
  }).expect(ExpectedResult.objectLike({
    stageStates: Match.arrayWith([
      Match.objectLike({
        stageName: 'Build',
        latestExecution: Match.objectLike({
          status: 'Succeeded',
        }),
      }),
    ]),
  })).waitForAssertions({
    totalTimeout: cdk.Duration.minutes(5),
  }).next(describeImagesCall),
);
