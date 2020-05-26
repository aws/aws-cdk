import { Bucket } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { GitHubRepository } from '../lib';

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