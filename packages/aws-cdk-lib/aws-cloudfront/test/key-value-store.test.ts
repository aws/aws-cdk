import * as path from 'node:path';
import { Match, Template } from '../../assertions';
import * as s3 from '../../aws-s3';
import { App, Stack } from '../../core';
import { KeyValueStore, ImportSource } from '../lib';

describe('Key Value Store', () => {
  test('minimal example', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new KeyValueStore(stack, 'TestStore');

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        TestStore8BB973CF: {
          Type: 'AWS::CloudFront::KeyValueStore',
          Properties: {
            Name: 'TestStore',
          },
        },
      },
    });
  });

  test('with name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new KeyValueStore(stack, 'TestStore', {
      keyValueStoreName: 'TestStoreName',
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        TestStore8BB973CF: {
          Type: 'AWS::CloudFront::KeyValueStore',
          Properties: {
            Name: 'TestStoreName',
          },
        },
      },
    });
  });

  test('with comment', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new KeyValueStore(stack, 'TestStore', {
      comment: 'Test comment',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::KeyValueStore', {
      Comment: 'Test comment',
    });
  });

  test('with code from S3 bucket', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const bucket = s3.Bucket.fromBucketArn(stack, 'TestBucket', 'arn:aws:s3:::bucket');
    new KeyValueStore(stack, 'TestStore', {
      source: ImportSource.fromBucket(bucket, 'test'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::KeyValueStore', {
      ImportSource: {
        SourceArn: 'arn:aws:s3:::bucket/test',
        SourceType: 'S3',
      },
    });
  });

  test('with code from local file', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new KeyValueStore(stack, 'TestStore', {
      source: ImportSource.fromAsset(path.join(__dirname, 'key-value-store-source.json')),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::KeyValueStore', {
      ImportSource: {
        SourceArn: Match.anyValue(),
        SourceType: 'S3',
      },
    });
  });

  test('imported resource throws error when missing ID', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(
      () => KeyValueStore.fromKeyValueStoreArn(stack, 'TestStore', 'arn:aws:cloudfront::123456789012:key-value-store'),
    ).toThrow(/Invalid Key Store Arn:/);
  });

  test('imported resource throws error when accessing status', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const store = KeyValueStore.fromKeyValueStoreArn(stack, 'TestStore', 'arn:aws:cloudfront::123456789012:key-value-store/id1');

    // THEN
    expect(() => store.keyValueStoreStatus).toThrow('Status is not available for imported Key Value Store');
  });
});
