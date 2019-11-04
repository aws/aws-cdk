import s3 = require('@aws-cdk/aws-s3');
import { App, CfnOutput, Construct, Stack } from '@aws-cdk/core';
import { S3Assert } from './s3-assert';
import { S3File } from './s3-file';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'MyBucket');

    const file1 = new S3File(this, 'file1', {
      bucket,
      objectKey: 'second.txt',
      contents: 'Hello, world, 1980!',
      public: true,
    });

    const file2 = new S3File(this, 'file2', {
      bucket,
      contents: 'this file has a generated physical id'
    });

    new S3Assert(this, 'assert-file', {
      bucket,
      objectKey: 'second.txt',
      expectedContent: 'Hello, world, 1980!'
    });

    // to delay file1's creation (and test the async assertions), we will make sure
    // file2 will be created before file1.
    file1.node.addDependency(file2);

    new CfnOutput(this, 'file1-url', { value: file1.url });
    new CfnOutput(this, 'file2-url', { value: file2.url });
  }
}

const app = new App();
new TestStack(app, 'integ-provider-framework');
app.synth();
