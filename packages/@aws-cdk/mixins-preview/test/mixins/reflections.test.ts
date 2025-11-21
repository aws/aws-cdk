import { Construct } from 'constructs';
import { Stack, App, Resource } from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { tryFindBucketPolicyForBucket } from '../../lib/mixins/private/reflections';

class CustomBucket extends Resource implements s3.IBucketRef {
  public readonly bucketRef: s3.BucketReference;

  constructor(scope: Construct, id: string, bucketName: string) {
    super(scope, id);
    this.bucketRef = {
      bucketName,
      bucketArn: `arn:aws:s3:::${bucketName}`,
    };
  }
}

describe('find bucket policy', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('find in construct tree', () => {
    test('returns undefined when no bucket policy exists', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      expect(tryFindBucketPolicyForBucket(bucket)).toBeUndefined();
    });

    test('finds bucket policy as direct child of bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('finds bucket policy as transitive child of bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const intermediate = new Construct(bucket, 'Intermediate');
      const policy = new s3.CfnBucketPolicy(intermediate, 'Policy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('finds bucket policy as sibling (child of parent)', () => {
      const parent = new Construct(stack, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const policy = new s3.CfnBucketPolicy(parent, 'Policy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('finds bucket policy in parent hierarchy', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const policy = new s3.CfnBucketPolicy(grandparent, 'Policy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('finds cousin bucket policies', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const auncle = new Construct(grandparent, 'Auncle');

      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const policy = new s3.CfnBucketPolicy(auncle, 'Policy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('prefers closest child over parent policy', () => {
      const parent = new Construct(stack, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const childPolicy = new s3.CfnBucketPolicy(bucket, 'ChildPolicy', {
        bucket: bucket.ref,
        policyDocument: {},
      });
      new s3.CfnBucketPolicy(parent, 'ParentPolicy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(childPolicy);
    });

    test('prefers closer transitive child over distant one', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const child1 = new Construct(bucket, 'Child1');
      const closerPolicy = new s3.CfnBucketPolicy(child1, 'CloserPolicy', {
        bucket: bucket.ref,
        policyDocument: {},
      });
      const child2 = new Construct(bucket, 'Child2');
      const intermediate = new Construct(child2, 'Intermediate');
      new s3.CfnBucketPolicy(intermediate, 'FartherPolicy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(closerPolicy);
    });

    test('prefers closer parent over distant parent', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const closerPolicy = new s3.CfnBucketPolicy(parent, 'CloserPolicy', {
        bucket: bucket.ref,
        policyDocument: {},
      });
      new s3.CfnBucketPolicy(grandparent, 'FartherPolicy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(closerPolicy);
    });

    test('ignores unrelated bucket policies', () => {
      const bucket1 = new s3.CfnBucket(stack, 'Bucket1');
      const bucket2 = new s3.CfnBucket(stack, 'Bucket2');
      new s3.CfnBucketPolicy(bucket2, 'Policy', {
        bucket: bucket2.ref,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket1)).toBeUndefined();
    });
  });

  describe('matches different buckets', () => {
    test('matches L2 Bucket with policy using bucketName', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket.bucketName,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('matches L2 Bucket with policy using bucketRef.bucketName', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket.bucketRef.bucketName,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('matches L2 Bucket with policy using bucketArn', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket.bucketArn,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('matches L2 Bucket', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('matches L1 Bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('matches custom IBucketRef implementation', () => {
      const bucket = new CustomBucket(stack, 'CustomBucket', 'my-bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });

    test('matches L2 BucketPolicy', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.BucketPolicy(bucket, 'Policy', {
        bucket: bucket,
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy.node.defaultChild);
    });

    test('ignores policy for different bucket name', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      bucket.bucketName = 'my-bucket';
      new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: 'other-bucket',
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBeUndefined();
    });

    test('matches using attrArn', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket.attrArn,
        policyDocument: {},
      });

      expect(tryFindBucketPolicyForBucket(bucket)).toBe(policy);
    });
  });
});
