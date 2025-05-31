import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { CODECOMMIT_SOURCE_ACTION_DEFAULT_BRANCH_NAME, CODEPIPELINE_DEFAULT_PIPELINE_TYPE_TO_V2, PIPELINE_REDUCE_STAGE_ROLE_TRUST_SCOPE } from 'aws-cdk-lib/cx-api';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

const defaultFeatureFlag = {
  [CODECOMMIT_SOURCE_ACTION_DEFAULT_BRANCH_NAME]: true,
  [CODEPIPELINE_DEFAULT_PIPELINE_TYPE_TO_V2]: false,
  [PIPELINE_REDUCE_STAGE_ROLE_TRUST_SCOPE]: false,
  '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
};
const app = new cdk.App({ postCliContext: defaultFeatureFlag });

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-custom-event');
const branch = 'test-branch';
const repo = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});

const eventPattern
      = {
        'detail-type': ['CodeCommit Repository State Change'],
        'resources': [repo.repositoryArn],
        'source': ['aws.codecommit'],
        'detail': {
          referenceType: ['branch'],
          event: ['referenceCreated', 'referenceUpdated'],
          referenceName: [branch],
        },
      };

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineName: 'IntegCustomEventPipeline',
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'source',
      actions: [
        new cpactions.CodeCommitSourceAction({
          actionName: 'source',
          repository: repo,
          output: new codepipeline.Artifact('SourceArtifact'),
          customEventRule: {
            eventPattern,
            description: 'Custom event rule for CodeCommit',
            ruleName: 'CustomEventRule',
            target: new LambdaFunction(
              new Function(stack, 'MyFunc', {
                runtime: Runtime.NODEJS_LATEST,
                handler: 'index.handler',
                code: Code.fromAsset(path.join(__dirname, 'custom-event-lambda')),
                initialPolicy: [
                  new PolicyStatement({
                    actions: ['codepipeline:StartPipelineExecution'],
                    resources: [`arn:aws:codepipeline:${stack.region}:${stack.account}:*`],
                  }),
                ],
              }),
            ),
          },
        }),
      ],
    },
    {
      stageName: 'build',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'manual' }),
      ],
    },
  ],
});

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

// 1. create a commit on the default branch because you need a commit to create a new branch
const commit = integ.assertions.awsApiCall('CodeCommit', 'CreateCommit', {
  branchName: 'main',
  repositoryName: repo.repositoryName,
  commitMessage: 'create default branch',
  email: 'test@foo.bar',
  authorName: 'test',
  putFiles: [{
    filePath: 'test.txt',
    fileContent: Buffer.from('hello world').toString('base64'),
  }],
});

// 2. Create a new branch because we test the custom event on a custom branch
integ.assertions.awsApiCall('CodeCommit', 'CreateBranch', {
  branchName: branch,
  commitId: commit.getAttString('commitId'),
  repositoryName: repo.repositoryName,
});

// 3. Create a commit on the new branch
integ.assertions.awsApiCall('CodeCommit', 'CreateCommit', {
  branchName: branch,
  parentCommitId: commit.getAttString('commitId'),
  repositoryName: repo.repositoryName,
  commitMessage: 'Test Custom Event',
  email: 'test@foo.bar',
  authorName: 'test',
  putFiles: [{
    filePath: 'integ.txt',
    fileContent: Buffer.from('This tests the custom events').toString('base64'),
  }],
}).waitForAssertions().assertAtPath('commitId', ExpectedResult.stringLikeRegexp('^[0-9a-f]{40}$'));

// Finally, assert that the pipeline is in progress
integ.assertions.awsApiCall('CodePipeline', 'ListPipelineExecutions', {
  pipelineName: pipeline.pipelineName,
}).waitForAssertions().assertAtPath('pipelineExecutionSummaries.0.status', ExpectedResult.stringLikeRegexp('InProgress'));
