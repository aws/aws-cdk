import { Construct } from 'constructs';
import { Stack, App, Resource } from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as kms from 'aws-cdk-lib/aws-kms';
import { tryFindBucketConstruct, tryFindBucketPolicyForBucket, tryFindDeliverySourceForResource, tryFindKmsKeyConstruct, tryFindKmsKeyforBucket } from '../../lib/mixins/private/reflections';

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

describe('find DeliverySource', () => {
  let app: App;
  let stack: Stack;
  let logType: string = 'ACCESS_LOGS';

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('find in construct tree', () => {
    test('returns undefined when no delivery source exists', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      expect(tryFindDeliverySourceForResource(bucket, bucket.attrArn, logType)).toBeUndefined();
    });

    test('finds delivery source as direct child of construct', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const source = new logs.CfnDeliverySource(bucket, 'BucketSource', {
        name: 'bucket-source',
        resourceArn: bucket.attrArn,
        logType,
      });

      expect(tryFindDeliverySourceForResource(bucket, bucket.attrArn, logType)).toBe(source);
    });

    test('finds delivery source as transitive child of construct', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const intermediate = new Construct(bucket, 'Intermediate');
      const source = new logs.CfnDeliverySource(intermediate, 'BucketSource', {
        name: 'bucket-source',
        resourceArn: bucket.attrArn,
        logType,
      });

      expect(tryFindDeliverySourceForResource(bucket, bucket.attrArn, logType)).toBe(source);
    });

    test('finds delivery source as sibling (child of parent)', () => {
      const parent = new Construct(stack, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const source = new logs.CfnDeliverySource(parent, 'BucketSource', {
        name: 'bucket-source',
        resourceArn: bucket.attrArn,
        logType,
      });

      expect(tryFindDeliverySourceForResource(bucket, bucket.attrArn, logType)).toBe(source);
    });

    test('finds delivery source in parent hierarchy', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const source = new logs.CfnDeliverySource(grandparent, 'BucketSource', {
        name: 'bucket-source',
        resourceArn: bucket.attrArn,
        logType,
      });

      expect(tryFindDeliverySourceForResource(bucket, bucket.attrArn, logType)).toBe(source);
    });

    test('finds cousin delivery sources', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const auncle = new Construct(grandparent, 'Auncle');

      const bucket = new s3.CfnBucket(parent, 'Bucket');
      const source = new logs.CfnDeliverySource(auncle, 'BucketSource', {
        name: 'bucket-source',
        resourceArn: bucket.attrArn,
        logType,
      });

      expect(tryFindDeliverySourceForResource(bucket, bucket.attrArn, logType)).toBe(source);
    });

    test('ignores unrelated delivery sources', () => {
      const bucket1 = new s3.CfnBucket(stack, 'Bucket1');
      const bucket2 = new s3.CfnBucket(stack, 'Bucket2');
      new logs.CfnDeliverySource(stack, 'BucketSourceA', {
        name: 'bucket-source-1a',
        resourceArn: bucket1.attrArn,
        logType: 'ERROR_LOGS',
      });

      new logs.CfnDeliverySource(stack, 'BucketSourceB', {
        name: 'bucket-source-2b',
        resourceArn: bucket2.attrArn,
        logType,
      });

      expect(tryFindDeliverySourceForResource(bucket1, bucket1.attrArn, logType)).toBeUndefined();
    });
  });
});

describe('find KMSKey from Id', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('find in construct tree', () => {
    test('returns undefined when KMS key does not exist', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      expect(tryFindKmsKeyforBucket(bucket)).toBeUndefined();
    });

    test('returns KMS Key if it exists', () => {
      const kmsKey = new kms.Key(stack, 'Key', {});
      const bucket = new s3.Bucket(stack, 'Bucket', {
        encryptionKey: kmsKey,
      });
      expect(tryFindKmsKeyforBucket(bucket)).toBe(kmsKey.node.defaultChild);
    });

    test('returns key associate with the bucket even if there are multiple keys', () => {
      const kmsKey1 = new kms.Key(stack, 'Key1', {});
      const bucket = new s3.Bucket(stack, 'Bucket', {
        encryptionKey: kmsKey1,
      });
      new kms.Key(stack, 'Key2', {});
      expect(tryFindKmsKeyforBucket(bucket)).toBe(kmsKey1.node.defaultChild);
    });

    test('finds KMS key in parent hierarchy', () => {
      const parent = new Construct(stack, 'Parent');
      const kmsKey = new kms.Key(parent, 'Key', {});
      const bucket = new s3.Bucket(parent, 'Bucket', {
        encryptionKey: kmsKey,
      });
      expect(tryFindKmsKeyforBucket(bucket)).toBe(kmsKey.node.defaultChild);
    });

    test('finds L1 KMS Key', () => {
      const kmsKey = new kms.CfnKey(stack, 'Key');
      const bucket = new s3.CfnBucket(stack, 'Bucket', {
        bucketEncryption: {
          serverSideEncryptionConfiguration: [
            {
              bucketKeyEnabled: true,
              serverSideEncryptionByDefault: {
                kmsMasterKeyId: kmsKey.attrKeyId,
                sseAlgorithm: 'aws:kms',
              },
            },
          ],
        },
      });
      expect(tryFindKmsKeyforBucket(bucket)).toBe(kmsKey);
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
      expect(tryFindBucketConstruct(bucket)).toBe(bucket);
    });

    test('returns correct Bucket if there are multiple in a stack', () => {
      const bucket1 = new s3.CfnBucket(stack, 'Bucket1');
      new s3.CfnBucket(stack, 'Bucket2');
      expect(tryFindBucketConstruct(bucket1)).toBe(bucket1);
    });

    test('returns Bucket L1 if the initial bucket is an L2', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      expect(tryFindBucketConstruct(bucket)).toBe(bucket.node.defaultChild);
    });

    test('finds grandchild Bucket', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const bucket = new s3.CfnBucket(parent, 'Bucket');

      expect(tryFindBucketConstruct(bucket)).toBe(bucket);
    });

    test('finds correct bucket when there are multiple buckets at different levels of the construct tree', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      new s3.CfnBucket(stack, 'Bucket1');
      const parent = new Construct(grandparent, 'Parent');
      const bucket2 = new s3.CfnBucket(parent, 'Bucket2');

      expect(tryFindBucketConstruct(bucket2)).toBe(bucket2);
    });
  });
});

describe('find KMSKey from Ref', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('find in construct tree', () => {
    test('returns KMS Key if it exists', () => {
      const kmsKey = new kms.CfnKey(stack, 'Key', {});
      expect(tryFindKmsKeyConstruct(kmsKey)).toBe(kmsKey);
    });

    test('returns correct KMS key if there are multiple in a stack', () => {
      const kmsKey1 = new kms.CfnKey(stack, 'Key1', {});
      new kms.CfnKey(stack, 'Key2', {});
      expect(tryFindKmsKeyConstruct(kmsKey1)).toBe(kmsKey1);
    });

    test('returns KMS key L1 if the initial key is an L2', () => {
      const kmsKey = new kms.Key(stack, 'Key');
      expect(tryFindKmsKeyConstruct(kmsKey)).toBe(kmsKey.node.defaultChild);
    });

    test('finds grandchild KMS key', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      const parent = new Construct(grandparent, 'Parent');
      const kmsKey = new kms.CfnKey(parent, 'Key');

      expect(tryFindKmsKeyConstruct(kmsKey)).toBe(kmsKey);
    });

    test('finds correct key when there are multiple keys at different levels of the construct tree', () => {
      const grandparent = new Construct(stack, 'Grandparent');
      new kms.CfnKey(stack, 'Key1');
      const parent = new Construct(grandparent, 'Parent');
      const kmsKey2 = new kms.CfnKey(parent, 'Key2');

      expect(tryFindKmsKeyConstruct(kmsKey2)).toBe(kmsKey2);
    });
  });
});
