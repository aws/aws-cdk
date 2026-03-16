import { Construct } from 'constructs';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as s3 from '../lib';
import { BucketAutoDeleteObjects, BucketVersioning, BucketBlockPublicAccess, BucketPolicyStatements } from '../lib/mixins';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('S3 Mixins', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
  });

  describe('AutoDeleteObjects', () => {
    test('applies to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      bucket.with(new BucketAutoDeleteObjects());

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::S3AutoDeleteObjects', {
        BucketName: { Ref: 'Bucket' },
      });
    });

    test('creates bucket policy with correct permissions', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      bucket.with(new BucketAutoDeleteObjects());

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        Bucket: { Ref: 'Bucket' },
        PolicyDocument: {
          Statement: [{
            Action: [
              's3:PutBucketPolicy',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
            ],
            Effect: 'Allow',
            Resource: [
              { 'Fn::GetAtt': ['Bucket', 'Arn'] },
              { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['Bucket', 'Arn'] }, '/*']] },
            ],
          }],
        },
      });
    });

    test('custom resource depends on bucket policy', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      bucket.with(new BucketAutoDeleteObjects());

      const template = Template.fromStack(stack);
      template.hasResource('Custom::S3AutoDeleteObjects', {
        DependsOn: ['BucketS3BucketPolicyF025ED2B'],
      });
    });

    test('only one lambda is created for multiple buckets', () => {
      const bucket1 = new s3.CfnBucket(stack, 'Bucket1');
      bucket1.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      bucket1.with(new BucketAutoDeleteObjects());
      const bucket2 = new s3.CfnBucket(stack, 'Bucket2');
      bucket2.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      bucket2.with(new BucketAutoDeleteObjects());

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
    });

    test('validation fails if deletion policy is not DELETE', () => {
      new s3.CfnBucket(stack, 'Bucket')
        .with(new BucketAutoDeleteObjects());

      expect(() => app.synth()).toThrow(/AutoDeleteObjects/);
    });

    test('removal policy can be set after mixin is applied', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.with(new BucketAutoDeleteObjects());
      bucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::S3AutoDeleteObjects', {
        BucketName: { Ref: 'Bucket' },
      });
    });

    test('shares lambda provider with L2 autoDeleteObjects property', () => {
      const bucket1 = new s3.CfnBucket(stack, 'Bucket1');
      bucket1.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      bucket1.with(new BucketAutoDeleteObjects());

      new s3.Bucket(stack, 'Bucket2', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      });

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
    });

    test('can be applied retrospectively to an L2 bucket', () => {
      const bucket = new s3.Bucket(stack, 'Bucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      bucket.with(new BucketAutoDeleteObjects());

      const template = Template.fromStack(stack);
      template.resourceCountIs('Custom::S3AutoDeleteObjects', 1);
      template.resourceCountIs('AWS::S3::BucketPolicy', 1);
    });

    test('throws when applied to an L2 bucket that already has autoDeleteObjects enabled', () => {
      const bucket = new s3.Bucket(stack, 'Bucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      });

      expect(() => bucket.with(new BucketAutoDeleteObjects())).toThrow(/AutoDeleteObjectsCustomResource/);
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new BucketAutoDeleteObjects();

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('BucketVersioning', () => {
    test('applies to S3 bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new BucketVersioning();

      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Enabled');
    });

    test('suspends versioning when disabled', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new BucketVersioning(false);

      mixin.applyTo(bucket);

      const versionConfig = bucket.versioningConfiguration as any;
      expect(versionConfig?.status).toBe('Suspended');
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new BucketVersioning();

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('BucketBlockPublicAccess', () => {
    test('applies to S3 bucket with defaults', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new BucketBlockPublicAccess();

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
      const mixin = new BucketBlockPublicAccess(s3.BlockPublicAccess.BLOCK_ACLS_ONLY);

      mixin.applyTo(bucket);

      const accessConfig = bucket.publicAccessBlockConfiguration as any;
      expect(accessConfig.blockPublicAcls).toBe(true);
      expect(accessConfig.blockPublicPolicy).toBe(false);
      expect(accessConfig.ignorePublicAcls).toBe(true);
      expect(accessConfig.restrictPublicBuckets).toBe(false);
    });

    test('do not block public access and policy', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const mixin = new BucketBlockPublicAccess(new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
      }));

      mixin.applyTo(bucket);

      const accessConfig = bucket.publicAccessBlockConfiguration as any;
      expect(accessConfig.blockPublicAcls).toBe(false);
      expect(accessConfig.blockPublicPolicy).toBe(false);
      expect(accessConfig.ignorePublicAcls).toBe(true);
      expect(accessConfig.restrictPublicBuckets).toBe(true);
    });

    test('apply block public access on l2 bucket', () => {
      const bucket = new s3.Bucket(stack, 'Bucket')
        .with(new BucketBlockPublicAccess());

      const accessConfig = (bucket.node.defaultChild as s3.CfnBucket).publicAccessBlockConfiguration as any;
      expect(accessConfig.blockPublicAcls).toBe(true);
      expect(accessConfig.blockPublicPolicy).toBe(true);
      expect(accessConfig.ignorePublicAcls).toBe(true);
      expect(accessConfig.restrictPublicBuckets).toBe(true);
    });

    test('does not support non-S3 constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new BucketBlockPublicAccess();

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('BucketPolicyStatements', () => {
    test('adds statements to bucket policy', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const bucketPolicy = new s3.CfnBucketPolicy(stack, 'BucketPolicy', {
        bucket: bucket.ref,
        policyDocument: new iam.PolicyDocument(),
      });

      const mixin = new BucketPolicyStatements([
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
      const mixin = new BucketPolicyStatements([]);

      expect(mixin.supports(bucket)).toBe(false);
    });
  });
});
