import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Mixins from '../../../lib/services/aws-s3/mixins';
import '../../../lib/with';
import { PropertyMergeStrategy } from '../../../lib/mixins';

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

  describe('CfnBucketPropsMixin', () => {
    test('applies properties to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.CfnBucketPropsMixin({ bucketName: 'test-bucket' });

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      expect(bucket.bucketName).toBe('test-bucket');
    });

    test('merges nested properties by default', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.versioningConfiguration = { status: 'Enabled' };

      const mixin = new s3Mixins.CfnBucketPropsMixin({
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

      const mixin = new s3Mixins.CfnBucketPropsMixin({
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

      const mixin = new s3Mixins.CfnBucketPropsMixin(
        { versioningConfiguration: { mfaDelete: 'Disabled' } as any },
        { strategy: PropertyMergeStrategy.override() },
      );
      mixin.applyTo(bucket);

      expect(bucket.versioningConfiguration).toEqual({ mfaDelete: 'Disabled' });
    });

    test('uses MERGE strategy by default', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.versioningConfiguration = { status: 'Enabled' };

      const mixin = new s3Mixins.CfnBucketPropsMixin({
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
      const mixin = new s3Mixins.CfnBucketPropsMixin({ bucketName: 'test' });

      expect(mixin.supports(construct)).toBe(false);
    });

    test('accepts deeply nested properties with cross-service references', () => {
      const key = new kms.Key(stack, 'Key');

      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.CfnBucketPropsMixin({
        bucketEncryption: {
          serverSideEncryptionConfiguration: [{
            serverSideEncryptionByDefault: {
              sseAlgorithm: 'aws:kms',
              kmsMasterKeyId: key,
            },
          }],
        },
      });
      mixin.applyTo(bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [{
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'aws:kms',
              KMSMasterKeyID: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
            },
          }],
        },
      });
    });

    test('accepts deeply nested properties with string token references', () => {
      const key = new kms.Key(stack, 'Key');

      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.CfnBucketPropsMixin({
        bucketEncryption: {
          serverSideEncryptionConfiguration: [{
            serverSideEncryptionByDefault: {
              sseAlgorithm: 'aws:kms',
              kmsMasterKeyId: key.keyArn,
            },
          }],
        },
      });
      mixin.applyTo(bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [{
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'aws:kms',
              KMSMasterKeyID: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
            },
          }],
        },
      });
    });

    test('handles undefined nested properties through flatten path', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      // Only set a non-relationship property, leaving bucketEncryption undefined
      const mixin = new s3Mixins.CfnBucketPropsMixin({
        bucketName: 'my-bucket',
      });
      mixin.applyTo(bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: 'my-bucket',
      });
    });
  });
});
