import { Construct } from 'constructs';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3';
import { Stack, App, Resource } from '../../core';
import { tryFindBucketConstruct, tryFindBucketPolicyForBucket, tryFindKmsKeyforBucket } from '../lib/private/reflections';

/** Compare constructs by node path to avoid circular JSON serialization in Jest error messages */
function expectSameConstruct(actual: any, expected: any) {
  expect(actual?.node.path).toBe(expected?.node.path);
  expect(actual).toBe(expected);
}

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

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('finds bucket policy as transitive child of bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const intermediate = new Construct(bucket, 'Intermediate');
      const policy = new s3.CfnBucketPolicy(intermediate, 'Policy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('finds bucket policy as sibling (child of parent)', () => {
      const parent = new Construct(stack, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const policy = new s3.CfnBucketPolicy(parent, 'Policy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('finds bucket policy in parent hierarchy', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const policy = new s3.CfnBucketPolicy(grandparent, 'Policy', {
        bucket: bucket.ref,
        policyDocument: {},
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
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

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
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

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), childPolicy);
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

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), closerPolicy);
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

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), closerPolicy);
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

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('matches L2 Bucket with policy using bucketRef.bucketName', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket.bucketRef.bucketName,
        policyDocument: {},
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('matches L2 Bucket with policy using bucketArn', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket.bucketArn,
        policyDocument: {},
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('matches L2 Bucket', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket,
        policyDocument: {},
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('matches L1 Bucket', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket,
        policyDocument: {},
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('matches custom IBucketRef implementation', () => {
      const bucket = new CustomBucket(stack, 'CustomBucket', 'my-bucket');
      const policy = new s3.CfnBucketPolicy(bucket, 'Policy', {
        bucket: bucket,
        policyDocument: {},
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });

    test('matches L2 BucketPolicy', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const policy = new s3.BucketPolicy(bucket, 'Policy', {
        bucket: bucket,
      });

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy.node.defaultChild);
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

      expectSameConstruct(tryFindBucketPolicyForBucket(bucket), policy);
    });
  });
});

describe('find Bucket from Ref', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('find in construct tree', () => {
    test('returns Bucket if it exists', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      expectSameConstruct(tryFindBucketConstruct(bucket), bucket);
    });

    test('returns correct Bucket if there are multiple in a stack', () => {
      const bucket1 = new s3.CfnBucket(stack, 'Bucket1');
      new s3.CfnBucket(stack, 'Bucket2');
      expectSameConstruct(tryFindBucketConstruct(bucket1), bucket1);
    });

    test('returns Bucket L1 if the initial bucket is an L2', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      expectSameConstruct(tryFindBucketConstruct(bucket), bucket.node.defaultChild);
    });

    test('finds grandchild Bucket', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');

      expectSameConstruct(tryFindBucketConstruct(bucket), bucket);
    });

    test('finds correct bucket when there are multiple buckets at different levels of the construct tree', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      new s3.CfnBucket(stack, 'Bucket1');
      const parent = new Construct(grandparent, 'Parent');
      const bucket2 = new s3.CfnBucket(parent, 'Bucket2');

      expectSameConstruct(tryFindBucketConstruct(bucket2), bucket2);
    });
  });
});

describe('find KMS key for Bucket', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  test('returns undefined when bucket has no encryption', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket');
    expect(tryFindKmsKeyforBucket(bucket)).toBeUndefined();
  });

  test('returns undefined when bucket uses S3-managed encryption', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket', {
      bucketEncryption: {
        serverSideEncryptionConfiguration: [{
          serverSideEncryptionByDefault: {
            sseAlgorithm: 'AES256',
          },
        }],
      },
    });
    expect(tryFindKmsKeyforBucket(bucket)).toBeUndefined();
  });

  test('finds KMS key when bucket uses KMS encryption with key ref', () => {
    const key = new kms.CfnKey(stack, 'Key', {
      keyPolicy: {},
    });
    const bucket = new s3.CfnBucket(stack, 'Bucket', {
      bucketEncryption: {
        serverSideEncryptionConfiguration: [{
          serverSideEncryptionByDefault: {
            sseAlgorithm: 'aws:kms',
            kmsMasterKeyId: key.ref,
          },
        }],
      },
    });

    expectSameConstruct(tryFindKmsKeyforBucket(bucket), key);
  });

  test('finds KMS key when bucket uses KMS encryption with key attrArn', () => {
    const key = new kms.CfnKey(stack, 'Key', {
      keyPolicy: {},
    });
    const bucket = new s3.CfnBucket(stack, 'Bucket', {
      bucketEncryption: {
        serverSideEncryptionConfiguration: [{
          serverSideEncryptionByDefault: {
            sseAlgorithm: 'aws:kms',
            kmsMasterKeyId: key.attrArn,
          },
        }],
      },
    });

    expectSameConstruct(tryFindKmsKeyforBucket(bucket), key);
  });

  test('finds KMS key for L2 Bucket', () => {
    const key = new kms.Key(stack, 'Key');
    const bucket = new s3.Bucket(stack, 'Bucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: key,
    });

    expectSameConstruct(tryFindKmsKeyforBucket(bucket), key.node.defaultChild);
  });

  test('returns undefined when KMS key is not in the construct tree', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket', {
      bucketEncryption: {
        serverSideEncryptionConfiguration: [{
          serverSideEncryptionByDefault: {
            sseAlgorithm: 'aws:kms',
            kmsMasterKeyId: 'arn:aws:kms:us-east-1:123456789012:key/some-external-key',
          },
        }],
      },
    });

    expect(tryFindKmsKeyforBucket(bucket)).toBeUndefined();
  });
});
