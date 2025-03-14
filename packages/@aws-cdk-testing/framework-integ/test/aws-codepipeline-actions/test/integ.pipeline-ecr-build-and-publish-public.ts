import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

/*
 * To run this integ test, the following steps are required.
 *
 * 1. Create a test repository with any repository name on your GitHub account
 * 2. Create a Dockerfile with any content at the path `./my-dir/Dockerfile` in the repository, and push it to the repository
 * 3. Create a Connections in the CodePipeline management console that accesses your GitHub account
 * 4. Set the ARN of that Connections to the `CONNECTION_ARN` environment variable in the integ test execution environment
 * 5. Set your GitHub account name and the repository name to the `REPO_OWNER` and `REPO_NAME` environment variables in the integ test execution environment
 * 6. After running the integ test, replace the value of `CONNECTION_ARN`, `REPO_OWNER`, and `REPO_NAME` written in the file generated in CloudAssembly (integ.THIS_FILE.js.snapshot/*) with the string `MOCK`
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'codepipeline-ecr-build-and-publish-public');

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

const repositoryName = 'my-repo/test-repository';
new ecr.CfnPublicRepository(stack, 'Repository', {
  repositoryName,
});

const imageTag = 'my-tag';
const buildAction = new cpactions.EcrBuildAndPublishAction({
  actionName: 'EcrBuildAndPublishAction',
  repositoryName,
  registryType: cpactions.RegistryType.PUBLIC,
  dockerfileDirectoryPath: './my-dir', // The path indicates ./my-dir/Dockerfile in the source repository
  imageTags: [imageTag],
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

const integ = new IntegTest(app, 'codepipeline-ecr-build-and-publish-public-test', {
  testCases: [stack],
  diffAssets: true,
  hooks: {
    postDeploy: [
      `aws ecr-public delete-repository --repository-name ${repositoryName} --force`,
    ],
  },
});

const startPipelineCall = integ.assertions.awsApiCall('CodePipeline', 'startPipelineExecution', {
  name: pipeline.pipelineName,
});

const describeImagesCall = integ.assertions.awsApiCall('ECR-Public', 'describeImages', {
  repositoryName,
}).expect(ExpectedResult.objectLike({
  imageDetails: Match.arrayWith([
    Match.objectLike({
      imageTags: Match.arrayWith([imageTag]),
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
