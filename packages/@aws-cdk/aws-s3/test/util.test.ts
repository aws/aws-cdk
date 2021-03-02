import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { parseBucketArn, parseBucketName } from '../lib/util';

nodeunitShim({
  parseBucketArn: {
    'explicit arn'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = 'my:bucket:arn';
      test.deepEqual(parseBucketArn(stack, { bucketArn }), bucketArn);
      test.done();
    },

    'produce arn from bucket name'(test: Test) {
      const stack = new cdk.Stack();
      const bucketName = 'hello';
      test.deepEqual(stack.resolve(parseBucketArn(stack, { bucketName })), {
        'Fn::Join':
          ['',
            ['arn:',
              { Ref: 'AWS::Partition' },
              ':s3:::hello']],
      });
      test.done();
    },

    'fails if neither arn nor name are provided'(test: Test) {
      const stack = new cdk.Stack();
      test.throws(() => parseBucketArn(stack, {}), /Cannot determine bucket ARN. At least `bucketArn` or `bucketName` is needed/);
      test.done();
    },
  },

  parseBucketName: {

    'explicit name'(test: Test) {
      const stack = new cdk.Stack();
      const bucketName = 'foo';
      test.deepEqual(stack.resolve(parseBucketName(stack, { bucketName })), 'foo');
      test.done();
    },

    'extract bucket name from string arn'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = 'arn:aws:s3:::my-bucket';
      test.deepEqual(stack.resolve(parseBucketName(stack, { bucketArn })), 'my-bucket');
      test.done();
    },

    'can parse bucket name even if it contains a token'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = `arn:aws:s3:::${cdk.Token.asString({ Ref: 'my-bucket' })}`;

      test.deepEqual(
        stack.resolve(parseBucketName(stack, { bucketArn })),
        { Ref: 'my-bucket' },
      );
      test.done();
    },

    'fails if ARN has invalid format'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = 'invalid-arn';
      test.throws(() => parseBucketName(stack, { bucketArn }), /ARNs must/);
      test.done();
    },
  },
});
