import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { parseBucketArn, parseBucketName } from '../lib/util';

export = {
  parseBucketArn: {
    'explicit arn'(test: Test) {
      const bucketArn = 'my:bucket:arn';
      test.deepEqual(parseBucketArn({ bucketArn }), bucketArn);
      test.done();
    },

    'produce arn from bucket name'(test: Test) {
      const bucketName = 'hello';
      test.deepEqual(cdk.resolve(parseBucketArn({ bucketName })), { 'Fn::Join':
      [ '',
        [ 'arn',
        ':',
        { Ref: 'AWS::Partition' },
        ':',
        's3',
        ':',
        '',
        ':',
        '',
        ':',
        'hello' ] ] });
      test.done();
    },

    'fails if neither arn nor name are provided'(test: Test) {
      test.throws(() => parseBucketArn({}), /Cannot determine bucket ARN. At least `bucketArn` or `bucketName` is needed/);
      test.done();
    }
  },

  parseBucketName: {

    'explicit name'(test: Test) {
      const bucketName = 'foo';
      test.deepEqual(cdk.resolve(parseBucketName({ bucketName })), 'foo');
      test.done();
    },

    'extract bucket name from string arn'(test: Test) {
      const bucketArn = 'arn:aws:s3:::my-bucket';
      test.deepEqual(cdk.resolve(parseBucketName({ bucketArn })), 'my-bucket');
      test.done();
    },

    'undefined if cannot extract name from a non-string arn'(test: Test) {
      const bucketArn = new cdk.FnConcat('arn:aws:s3:::', 'my-bucket').toString();
      test.deepEqual(cdk.resolve(parseBucketName({ bucketArn })), undefined);
      test.done();
    },

    'fails if arn uses a non "s3" service'(test: Test) {
      const bucketArn = 'arn:aws:xx:::my-bucket';
      test.throws(() => parseBucketName({ bucketArn }), /Invalid ARN/);
      test.done();
    },

    'fails if ARN has invalid format'(test: Test) {
      const bucketArn = 'invalid-arn';
      test.throws(() => parseBucketName({ bucketArn }), /ARNs must have at least 6 components/);
      test.done();
    },

    'fails if ARN has path'(test: Test) {
      const bucketArn = 'arn:aws:s3:::my-bucket/path';
      test.throws(() => parseBucketName({ bucketArn }), /Bucket ARN must not contain a path/);
      test.done();
    }
  },
};
