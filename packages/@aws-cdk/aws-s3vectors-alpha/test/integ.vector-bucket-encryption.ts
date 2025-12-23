import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as s3vectors from '../lib';

/**
 * Test cases for vector bucket encryption:
 *
 * | props.encryption | props.encryptionKey | bucketEncryption (expected) | encryptionKey (expected)      |
 * |------------------|---------------------|-----------------------------|-------------------------------|
 * | undefined        | k                   | aws:kms                     | k                             |
 * | KMS              | undefined           | aws:kms                     | new key (auto-generated)      |
 * | KMS              | k                   | aws:kms                     | k                             |
 * | S3_MANAGED       | undefined           | AES256                      | undefined                     |
 */

class OnlyEncryptionKeyTest extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;
  public readonly key: kms.IKey;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.key = new kms.Key(this, 'Key', {});
    this.vectorBucket = new s3vectors.VectorBucket(this, 'VectorBucket', {
      vectorBucketName: 'integ-vb-key-only',
      encryptionKey: this.key,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

class OnlyKMSEncryptionTypeTest extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.vectorBucket = new s3vectors.VectorBucket(this, 'VectorBucket', {
      vectorBucketName: 'integ-vb-kms-encryption-type-only',
      encryption: s3vectors.VectorBucketEncryption.KMS,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

class KeyWithKMSEncryptionTypeTest extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;
  public readonly key: kms.IKey;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.key = new kms.Key(this, 'Key', {});
    this.vectorBucket = new s3vectors.VectorBucket(this, 'VectorBucket', {
      vectorBucketName: 'integ-vb-key-with-type',
      encryption: s3vectors.VectorBucketEncryption.KMS,
      encryptionKey: this.key,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

class OnlyS3ManagedEncryptionTest extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.vectorBucket = new s3vectors.VectorBucket(this, 'VectorBucket', {
      vectorBucketName: 'integ-vb-s3-managed-encryption-type-only',
      encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const testCases = [
  new OnlyEncryptionKeyTest(app, 'OnlyEncryptionKeyTest'),
  new OnlyKMSEncryptionTypeTest(app, 'OnlyKMSEncryptionTypeTest'),
  new KeyWithKMSEncryptionTypeTest(app, 'KeyWithKMSEncryptionTypeTest'),
  new OnlyS3ManagedEncryptionTest(app, 'OnlyS3ManagedEncryptionTest'),
];

new IntegTest(app, 'VectorBucketEncryptionIntegTest', { testCases });
