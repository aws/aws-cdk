import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Mixins from '../../lib/services/aws-s3/mixins';
import { PropertyMergeStrategy } from '../../lib/mixins';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('S3 Mixins', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('AutoDeleteObjects', () => {
    test('applies to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.AutoDeleteObjects();

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      expect(bucket.node.metadata.find(m => m.type === 'autoDeleteObjects')).toBeDefined();
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new s3Mixins.AutoDeleteObjects();

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('EnableVersioning', () => {
    test('applies to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.EnableVersioning();

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new s3Mixins.EnableVersioning();

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('CfnBucketMixin', () => {
    test('applies properties to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.CfnBucketMixin({ bucketName: 'test-bucket' });

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      expect(bucket.bucketName).toBe('test-bucket');
    });

    test('merges nested properties by default', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.versioningConfiguration = { status: 'Enabled' };

      const mixin = new s3Mixins.CfnBucketMixin({
        versioningConfiguration: { mfaDelete: 'Disabled' } as any,
      });
      mixin.applyTo(bucket);

      expect(bucket.versioningConfiguration).toEqual({
        status: 'Enabled',
        mfaDelete: 'Disabled',
      });
    });

    test('merges deeply nested properties', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.lifecycleConfiguration = {
        rules: [{ id: 'rule1', status: 'Enabled' }],
      };

      const mixin = new s3Mixins.CfnBucketMixin({
        lifecycleConfiguration: {
          rules: [{ id: 'rule2', status: 'Enabled' }],
        },
      });
      mixin.applyTo(bucket);

      expect(bucket.lifecycleConfiguration?.rules).toEqual([{ id: 'rule2', status: 'Enabled' }]);
    });

    test('overrides properties with OVERRIDE strategy', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.versioningConfiguration = { status: 'Enabled' };

      const mixin = new s3Mixins.CfnBucketMixin(
        { versioningConfiguration: { mfaDelete: 'Disabled' } as any },
        { strategy: PropertyMergeStrategy.OVERRIDE },
      );
      mixin.applyTo(bucket);

      expect(bucket.versioningConfiguration).toEqual({ mfaDelete: 'Disabled' });
    });

    test('uses MERGE strategy by default', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.versioningConfiguration = { status: 'Enabled' };

      const mixin = new s3Mixins.CfnBucketMixin({
        versioningConfiguration: { mfaDelete: 'Disabled' } as any,
      });
      mixin.applyTo(bucket);

      expect(bucket.versioningConfiguration).toEqual({
        status: 'Enabled',
        mfaDelete: 'Disabled',
      });
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new s3Mixins.CfnBucketMixin({ bucketName: 'test' });

      expect(mixin.supports(construct)).toBe(false);
    });
  });
});
