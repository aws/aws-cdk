import { anything, arrayWith, objectLike } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as ccommit from '@aws-cdk/aws-codecommit';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../../lib';
import { PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('CodeCommit source handles tokenized names correctly', () => {
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.codeCommit(repo, 'main'),
  });

  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Source',
      Actions: [
        objectLike({
          Configuration: objectLike({
            RepositoryName: { 'Fn::GetAtt': [anything(), 'Name'] },
          }),
          Name: { 'Fn::GetAtt': [anything(), 'Name'] },
        }),
      ],
    }),
  });
});

test('S3 source handles tokenized names correctly', () => {
  const buckit = new s3.Bucket(pipelineStack, 'Buckit');
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.s3(buckit, 'thefile.zip'),
  });

  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Source',
      Actions: [
        objectLike({
          Configuration: objectLike({
            S3Bucket: { Ref: anything() },
            S3ObjectKey: 'thefile.zip',
          }),
          Name: { Ref: anything() },
        }),
      ],
    }),
  });
});


// a-z0-9.@-_