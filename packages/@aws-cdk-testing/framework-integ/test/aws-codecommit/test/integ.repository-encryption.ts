#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'RepositoryEncryption');

const kmsKey = new kms.Key(stack, 'MyKey');
new codecommit.Repository(stack, 'MyCodecommitRepository', {
  repositoryName: 'my-test-repository',
  kmsKey,
});

new integ.IntegTest(app, 'RepositoryEncryptionTest', {
  testCases: [stack],
});
