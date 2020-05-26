import '@aws-cdk/assert/jest';
import { Bucket } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { GitHubRepository } from '../lib';

test('create', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'GitHubDemo');

  new GitHubRepository(stack, 'GitHubRepo', {
    owner: 'foo',
    gitHubRepositoryName: 'bar',
    accessToken: cdk.SecretValue.secretsManager('my-GitHub-token', {
      jsonField: 'token',
    }),
    bucket: Bucket.fromBucketName(stack, 'Bucket', 'bucket-name'),
    key: 'import.zip',
  });

  expect(stack).toHaveResource('AWS::CodeStar::GitHubRepository', {
    RepositoryAccessToken: '{{resolve:secretsmanager:my-GitHub-token:SecretString:token::}}',
    RepositoryName: 'bar',
    RepositoryOwner: 'foo',
    Code: {
      S3: {
        Bucket: 'bucket-name',
        Key: 'import.zip',
      },
    },
  });
});
