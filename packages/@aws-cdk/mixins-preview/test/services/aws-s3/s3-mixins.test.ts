import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
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

  describe('AutoDeleteObjects', () => {
    test('applies to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.AutoDeleteObjects();

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::S3AutoDeleteObjects', {
        BucketName: { Ref: 'Bucket' },
      });
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        Bucket: { Ref: 'Bucket' },
      });
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new s3Mixins.AutoDeleteObjects();

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('BucketVersioning', () => {
    test('applies to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.BucketVersioning();

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');
    });

    test('suspends versioning when disabled', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.BucketVersioning(false);

      mixin.applyTo(bucket);

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Suspended');
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new s3Mixins.BucketVersioning();

      expect(mixin.supports(construct)).toBe(false);
    });
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
        { strategy: PropertyMergeStrategy.OVERRIDE },
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
  });

  describe('BucketPolicyStatementsMixin', () => {
    test('adds statements to bucket policy', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const bucketPolicy = new s3.CfnBucketPolicy(stack, 'BucketPolicy', {
        bucket: bucket.ref,
        policyDocument: new iam.PolicyDocument(),
      });

      const mixin = new s3Mixins.BucketPolicyStatementsMixin([
        new iam.PolicyStatement({
          actions: ['s3:GetObject'],
          resources: ['*'],
          principals: [new iam.AnyPrincipal()],
        }),
      ]);

      expect(mixin.supports(bucketPolicy)).toBe(true);
      mixin.applyTo(bucketPolicy);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: [{ Action: 's3:GetObject', Effect: 'Allow', Principal: { AWS: '*' }, Resource: '*' }],
        },
      });
    });

    test('does not support non-bucket-policy constructs', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.BucketPolicyStatementsMixin([]);

      expect(mixin.supports(bucket)).toBe(false);
    });
  });

  describe('BucketBlockPublicAccess', () => {
    test('applies to S3 bucket with defaults', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.BucketBlockPublicAccess();

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const accessConfig = bucket.publicAccessBlockConfiguration as any;
      expect(accessConfig.blockPublicAcls).toBe(true);
      expect(accessConfig.blockPublicPolicy).toBe(true);
      expect(accessConfig.ignorePublicAcls).toBe(true);
      expect(accessConfig.restrictPublicBuckets).toBe(true);
    });

    test('block ACLs public access only', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.BucketBlockPublicAccess(s3.BlockPublicAccess.BLOCK_ACLS_ONLY);

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const accessConfig = bucket.publicAccessBlockConfiguration as any;
      expect(accessConfig.blockPublicAcls).toBe(true);
      expect(accessConfig.blockPublicPolicy).toBe(false);
      expect(accessConfig.ignorePublicAcls).toBe(true);
      expect(accessConfig.restrictPublicBuckets).toBe(false);
    });

    test('do not block public access and policy', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new s3Mixins.BucketBlockPublicAccess(new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
      }));

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const accessConfig = bucket.publicAccessBlockConfiguration as any;
      expect(accessConfig.blockPublicAcls).toBe(false);
      expect(accessConfig.blockPublicPolicy).toBe(false);
      expect(accessConfig.ignorePublicAcls).toBe(true);
      expect(accessConfig.restrictPublicBuckets).toBe(true);
    });

    // const test = (l2bucket.node.defaultChild as s3.CfnBucket).versioningConfiguration as any;

    test('apply block public access on l2 bucket', () => {
      const bucket = new s3.Bucket(stack, 'Bucket')
        .with(new s3Mixins.BucketBlockPublicAccess());

      const accessConfig = (bucket.node.defaultChild as s3.CfnBucket).publicAccessBlockConfiguration as any;
      expect(accessConfig.blockPublicAcls).toBe(true);
      expect(accessConfig.blockPublicPolicy).toBe(true);
      expect(accessConfig.ignorePublicAcls).toBe(true);
      expect(accessConfig.restrictPublicBuckets).toBe(true);
    });
  });
});
