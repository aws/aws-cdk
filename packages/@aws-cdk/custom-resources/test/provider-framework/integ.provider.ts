/// !cdk-integ *
import * as s3 from '@aws-cdk/aws-s3';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct, Node } from 'constructs';
import { S3Assert } from './integration-test-fixtures/s3-assert';
import { S3File } from './integration-test-fixtures/s3-file';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const file2Contents = 'this file has a generated physical id';
    const bucket = new s3.Bucket(this, 'MyBucket');

    const file1 = new S3File(this, 'file1', {
      bucket,
      objectKey: 'second.txt',
      contents: 'Hello, world, 1980!',
    });

    const file2 = new S3File(this, 'file2', {
      bucket,
      contents: file2Contents,
    });

    const file3 = new S3File(this, 'file3Utf8', {
      bucket,
      objectKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
      contents: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
    });

    new S3Assert(this, 'assert-file', {
      bucket,
      objectKey: file2.objectKey,
      expectedContent: file2Contents,
    });

    // delay file2 updates so we can test async assertions
    Node.of(file2).addDependency(file1);

    new CfnOutput(this, 'file1-url', { value: file1.url });
    new CfnOutput(this, 'file2-url', { value: file2.url });
    new CfnOutput(this, 'file3-url', { value: file3.url });
  }
}

const app = new App();
const stack = new TestStack(app, 'integ-provider-framework');

new integ.IntegTest(app, 'IntegProviderFrameworkTest', {
  testCases: [stack],
});

app.synth();
