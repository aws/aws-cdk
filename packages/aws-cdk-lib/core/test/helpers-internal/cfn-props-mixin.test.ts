import { Construct } from 'constructs';
import { CfnBucket } from '../../../aws-s3';
import { CfnQueue } from '../../../aws-sqs';
import { Stack, PropertyMergeStrategy } from '../../lib';
import { CfnPropsMixin } from '../../lib/helpers-internal/cfn-props-mixin';

describe('CfnPropsMixin', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('applies properties to matching resource', () => {
    const bucket = new CfnBucket(stack, 'Bucket');

    bucket.with(new CfnPropsMixin(CfnBucket, {
      bucketName: 'my-bucket',
    }));

    expect(bucket.bucketName).toBe('my-bucket');
  });

  test('applies multiple properties', () => {
    const bucket = new CfnBucket(stack, 'Bucket');

    bucket.with(new CfnPropsMixin(CfnBucket, {
      bucketName: 'my-bucket',
      versioningConfiguration: { status: 'Enabled' },
    }));

    expect(bucket.bucketName).toBe('my-bucket');
    expect(bucket.versioningConfiguration).toEqual({ status: 'Enabled' });
  });

  test('does not apply to non-matching resource type', () => {
    const queue = new CfnQueue(stack, 'Queue');

    queue.with(new CfnPropsMixin(CfnBucket, {
      bucketName: 'my-bucket',
    }));

    expect((queue as any).bucketName).toBeUndefined();
  });

  test('supports returns true for matching resource', () => {
    const bucket = new CfnBucket(stack, 'Bucket');
    const mixin = new CfnPropsMixin(CfnBucket, { bucketName: 'my-bucket' });

    expect(mixin.supports(bucket)).toBe(true);
  });

  test('supports returns false for non-matching resource', () => {
    const queue = new CfnQueue(stack, 'Queue');
    const mixin = new CfnPropsMixin(CfnBucket, { bucketName: 'my-bucket' });

    expect(mixin.supports(queue)).toBe(false);
  });

  test('supports returns false for non-CfnResource constructs', () => {
    const construct = new Construct(stack, 'Plain');
    const mixin = new CfnPropsMixin(CfnBucket, { bucketName: 'my-bucket' });

    expect(mixin.supports(construct)).toBe(false);
  });

  test('deep merges nested objects by default (combine strategy)', () => {
    const bucket = new CfnBucket(stack, 'Bucket', {
      publicAccessBlockConfiguration: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
      },
    });

    expect(bucket.publicAccessBlockConfiguration).toEqual({
      blockPublicAcls: true,
      blockPublicPolicy: true,
    });

    bucket.with(new CfnPropsMixin(CfnBucket, {
      publicAccessBlockConfiguration: {
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
    }));

    expect(bucket.publicAccessBlockConfiguration).toEqual({
      blockPublicAcls: true,
      blockPublicPolicy: true,
      ignorePublicAcls: true,
      restrictPublicBuckets: true,
    });
  });

  test('override strategy replaces values', () => {
    const bucket = new CfnBucket(stack, 'Bucket');
    bucket.tagsRaw = [{ key: 'Existing', value: 'Tag' }];

    bucket.with(new CfnPropsMixin(CfnBucket, {
      tagsRaw: [{ key: 'New', value: 'Tag' }],
    }, { strategy: PropertyMergeStrategy.override() }));

    expect(bucket.tagsRaw).toEqual([{ key: 'New', value: 'Tag' }]);
  });

  test('only applies keys present in props', () => {
    const bucket = new CfnBucket(stack, 'Bucket');
    bucket.bucketName = 'original';
    bucket.versioningConfiguration = { status: 'Enabled' };

    bucket.with(new CfnPropsMixin(CfnBucket, {
      bucketName: 'updated',
    }));

    expect(bucket.bucketName).toBe('updated');
    expect(bucket.versioningConfiguration).toEqual({ status: 'Enabled' });
  });
});
