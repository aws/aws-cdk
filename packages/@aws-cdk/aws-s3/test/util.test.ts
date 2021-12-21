import * as cdk from '@aws-cdk/core';
import { parseBucketArn, parseBucketName } from '../lib/util';

describe('utils', () => {
  describe('parseBucketArn', () => {
    test('explicit arn', () => {
      const stack = new cdk.Stack();
      const bucketArn = 'my:bucket:arn';
      expect(parseBucketArn(stack, { bucketArn })).toEqual(bucketArn);
    });

    test('produce arn from bucket name', () => {
      const stack = new cdk.Stack();
      const bucketName = 'hello';
      expect(stack.resolve(parseBucketArn(stack, { bucketName }))).toEqual({
        'Fn::Join':
          ['',
            ['arn:',
              { Ref: 'AWS::Partition' },
              ':s3:::hello']],
      });
    });

    test('fails if neither arn nor name are provided', () => {
      const stack = new cdk.Stack();
      expect(() => parseBucketArn(stack, {})).toThrow(/Cannot determine bucket ARN. At least `bucketArn` or `bucketName` is needed/);
    });
  });

  describe('parseBucketName', () => {

    test('explicit name', () => {
      const stack = new cdk.Stack();
      const bucketName = 'foo';
      expect(stack.resolve(parseBucketName(stack, { bucketName }))).toEqual('foo');
    });

    test('extract bucket name from string arn', () => {
      const stack = new cdk.Stack();
      const bucketArn = 'arn:aws:s3:::my-bucket';
      expect(stack.resolve(parseBucketName(stack, { bucketArn }))).toEqual('my-bucket');
    });

    test('can parse bucket name even if it contains a token', () => {
      const stack = new cdk.Stack();
      const bucketArn = `arn:aws:s3:::${cdk.Token.asString({ Ref: 'my-bucket' })}`;

      expect(
        stack.resolve(parseBucketName(stack, { bucketArn })),
      ).toEqual(
        { Ref: 'my-bucket' },
      );
    });

    test('fails if ARN has invalid format', () => {
      const stack = new cdk.Stack();
      const bucketArn = 'invalid-arn';
      expect(() => parseBucketName(stack, { bucketArn })).toThrow(/ARNs must/);
    });
  });
});
