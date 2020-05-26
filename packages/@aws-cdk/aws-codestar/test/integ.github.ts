import { Bucket } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { GithubRepository } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'GithubDemo');

new GithubRepository(stack, 'GithubRepo', {
  owner: 'foo',
  name: 'bar',
  accessToken: cdk.SecretValue.secretsManager('my-github-token', {
    jsonField: 'token',
  }),
  bucket: Bucket.fromBucketName(stack, 'Bucket', 'bucket-name'),
  key: 'import.zip',
});