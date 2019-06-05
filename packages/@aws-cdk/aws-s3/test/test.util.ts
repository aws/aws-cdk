import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { parseBucketArn, parseBucketName } from '../lib/util';

export = {
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
      test.deepEqual(stack.node.resolve(parseBucketArn(stack, { bucketName })), { 'Fn::Join':
      [ '',
        [ 'arn:',
        { Ref: 'AWS::Partition' },
        ':s3:::hello' ] ] });
      test.done();
    },

    'fails if neither arn nor name are provided'(test: Test) {
      const stack = new cdk.Stack();
      test.throws(() => parseBucketArn(stack, {}), /Cannot determine bucket ARN. At least `bucketArn` or `bucketName` is needed/);
      test.done();
    }
  },

  parseBucketName: {

    'explicit name'(test: Test) {
      const stack = new cdk.Stack();
      const bucketName = 'foo';
      test.deepEqual(stack.node.resolve(parseBucketName(stack, { bucketName })), 'foo');
      test.done();
    },

    'extract bucket name from string arn'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = 'arn:aws:s3:::my-bucket';
      test.deepEqual(stack.node.resolve(parseBucketName(stack, { bucketArn })), 'my-bucket');
      test.done();
    },

    'undefined if cannot extract name from a non-string arn'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = `arn:aws:s3:::${new cdk.Intrinsic({ Ref: 'my-bucket' })}`;
      test.deepEqual(stack.node.resolve(parseBucketName(stack, { bucketArn })), undefined);
      test.done();
    },

    'fails if arn uses a non "s3" service'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = 'arn:aws:xx:::my-bucket';
      test.throws(() => parseBucketName(stack, { bucketArn }), /Invalid ARN/);
      test.done();
    },

    'fails if ARN has invalid format'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = 'invalid-arn';
      test.throws(() => parseBucketName(stack, { bucketArn }), /ARNs must have at least 6 components/);
      test.done();
    },

    'fails if ARN has path'(test: Test) {
      const stack = new cdk.Stack();
      const bucketArn = 'arn:aws:s3:::my-bucket/path';
      test.throws(() => parseBucketName(stack, { bucketArn }), /Bucket ARN must not contain a path/);
      test.done();
    }
  },
};
