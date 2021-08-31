import * as path from 'path';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Code } from '../lib';

describe('Code', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('.fromBucket()', () => {
    let bucket: s3.IBucket;
    let key: string;

    beforeEach(() => {
      bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'bucketName');
      key = 'script';
    });

    test('with valid bucket name and key and calling bind() returns correct s3 location', () => {
      expect(Code.fromBucket(bucket, key).bind(stack)).toEqual({
        s3Location: {
          bucketName: 'bucketName',
          objectKey: 'script',
        },
      });
    });
  });

  describe('.fromAsset()', () => {
    let filePath: string;
    let directoryPath: string;

    beforeEach(() => {
      filePath = path.join(__dirname, 'job-script/hello_world.py');
      directoryPath = path.join(__dirname, 'job-script');
    });

    test('with valid and existing file path and calling bind() returns an s3 location', () => {
      const codeConfig = Code.fromAsset(filePath).bind(stack);
      expect(codeConfig.s3Location.bucketName).toBeDefined();
      expect(codeConfig.s3Location.objectKey).toBeDefined();
    });

    test('with an unsupported directory path and calling bind() throws', () => {
      expect(() => Code.fromAsset(directoryPath).bind(stack))
        .toThrow(/Only files are supported/);
    });

    test('throws if bound with another stack', () => {
      const stack2 = new cdk.Stack();
      const asset = Code.fromAsset(filePath);
      asset.bind(stack);

      expect(() => asset.bind(stack2))
        .toThrow(/associated with another stack/);
    });
  });
});