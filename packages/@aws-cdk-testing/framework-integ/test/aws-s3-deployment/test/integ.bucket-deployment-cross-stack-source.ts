import { App, Stack, StackProps } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Bucket } from 'aws-cdk-lib/aws-s3';

class Stack2 extends Stack {
  userPool: UserPool;

  constructor (scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    this.userPool = new UserPool(this, 'userpool');
  }
}

class Stack1 extends Stack {
  bucket: Bucket;

  constructor (scope: Construct, id: string, props: { userPool: UserPool }) {
    super(scope, id);
    this.bucket = new Bucket(this, 'bucket');
    new BucketDeployment(this, 'XXXXXXXXXX', {
      destinationBucket: this.bucket,
      sources: [
        Source.data('test.txt', props.userPool.userPoolId),
      ],
    });
  }
}

const app = new App();
const stack2 = new Stack2(app, 'stack2');
const stack1 = new Stack1(app, 'stack1', { userPool: stack2.userPool });

const integTest = new integ.IntegTest(app, 'integ-cross-stack-source', {
  testCases: [
    stack1,
  ],
});

integTest.assertions.awsApiCall('S3', 'getObject', {
  Bucket: stack1.bucket.bucketName,
  Key: 'test.txt',
}).expect(ExpectedResult.objectLike({
  Body: stack2.userPool.userPoolId,
}));
