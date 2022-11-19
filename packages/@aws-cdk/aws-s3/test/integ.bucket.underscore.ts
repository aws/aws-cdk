#!/usr/bin/env node
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as s3 from '../lib';

class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'MyBucket_UnderscoreTest', {
      encryption: s3.BucketEncryption.KMS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const user = new iam.User(this, 'MyUser');
    bucket.grantReadWrite(user);
  }
}

const app = new cdk.App();

const testCase = new Test(app, 'test-bucket-name-with-underscore');

new IntegTest(app, 'bucket-name-with-underscore', {
  testCases: [testCase],
});
