import { anything, arrayWith, objectLike } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as ccommit from '@aws-cdk/aws-codecommit';
import { CodeCommitTrigger, GitHubTrigger } from '@aws-cdk/aws-codepipeline-actions';
import { AnyPrincipal, Role } from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { SecretValue, Stack, Token } from '@aws-cdk/core';
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

test('CodeCommit source honors all valid properties', () => {
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.codeCommit(repo, 'main', {
      codeBuildCloneOutput: true,
      trigger: CodeCommitTrigger.POLL,
      eventRole: new Role(pipelineStack, 'role', {
        assumedBy: new AnyPrincipal(),
        roleName: 'some-role',
      }),
    }),
  });

  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Source',
      Actions: [
        objectLike({
          Configuration: objectLike({
            BranchName: 'main',
            PollForSourceChanges: true,
            OutputArtifactFormat: 'CODEBUILD_CLONE_REF',
          }),
          RoleArn: { 'Fn::GetAtt': [anything(), 'Arn'] },
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

test('GitHub source honors all valid properties', () => {
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.gitHub('owner/repo', 'main', {
      trigger: GitHubTrigger.POLL,
      authentication: SecretValue.plainText('super-secret'),
    }),
  });

  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Source',
      Actions: [
        objectLike({
          Configuration: objectLike({
            Owner: 'owner',
            Repo: 'repo',
            Branch: 'main',
            PollForSourceChanges: true,
            OAuthToken: 'super-secret',
          }),
          Name: 'owner_repo',
        }),
      ],
    }),
  });
});

test('GitHub source does not accept ill-formatted identifiers', () => {
  expect(() => {
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
      input: cdkp.CodePipelineSource.gitHub('repo-only', 'main'),
    });
  }).toThrow('GitHub repository name should be a resolved string like \'<owner>/<repo>\', got \'repo-only\'');
});

test('GitHub source does not accept unresolved identifiers', () => {
  expect(() => {
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
      input: cdkp.CodePipelineSource.gitHub(Token.asString({}), 'main'),
    });
  }).toThrow(/Step id cannot be unresolved/);
});


// a-z0-9.@-_