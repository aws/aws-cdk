import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3vectors from '../../lib';

/**
 * Test matrix for VectorBucket encryption:
 *
 * | props.encryption | props.encryptionKey | expected sseType | encryptionKey                |
 * |------------------|---------------------|------------------|------------------------------|
 * | undefined        | k                   | aws:kms          | k                            |
 * | KMS              | undefined           | aws:kms          | new key                      |
 * | KMS              | k                   | aws:kms          | k                            |
 * | S3_MANAGED       | undefined           | AES256           | undefined                    |
 */

abstract class EncryptionTestBase extends core.Stack {
  public abstract validateAssertions(integ: IntegTest): void;
}

class OnlyEncryptionKeyTest extends EncryptionTestBase {
  public readonly vectorBucket: s3vectors.VectorBucket;
  public readonly key: kms.IKey;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.key = new kms.Key(this, 'Key', { removalPolicy: core.RemovalPolicy.DESTROY });
    this.vectorBucket = new s3vectors.VectorBucket(this, 'Bucket', {
      vectorBucketName: 'integ-vb-key-only',
      encryptionKey: this.key,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketCommand', {
      vectorBucketArn: this.vectorBucket.vectorBucketArn,
    }).expect(ExpectedResult.objectLike({
      vectorBucket: {
        encryptionConfiguration: {
          sseType: 'aws:kms',
          kmsKeyArn: this.key.keyArn,
        },
      },
    }));
  }
}

class OnlyKmsEncryptionTypeTest extends EncryptionTestBase {
  public readonly vectorBucket: s3vectors.VectorBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.vectorBucket = new s3vectors.VectorBucket(this, 'Bucket', {
      vectorBucketName: 'integ-vb-kms-only',
      encryption: s3vectors.VectorBucketEncryption.KMS,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketCommand', {
      vectorBucketArn: this.vectorBucket.vectorBucketArn,
    }).expect(ExpectedResult.objectLike({
      vectorBucket: {
        encryptionConfiguration: {
          sseType: 'aws:kms',
          kmsKeyArn: Match.stringLikeRegexp('arn:aws:kms:.*:key/[\\w-]+'),
        },
      },
    }));
  }
}

class KeyWithKmsEncryptionTypeTest extends EncryptionTestBase {
  public readonly vectorBucket: s3vectors.VectorBucket;
  public readonly key: kms.IKey;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.key = new kms.Key(this, 'Key', { removalPolicy: core.RemovalPolicy.DESTROY });
    this.vectorBucket = new s3vectors.VectorBucket(this, 'Bucket', {
      vectorBucketName: 'integ-vb-key-with-type',
      encryption: s3vectors.VectorBucketEncryption.KMS,
      encryptionKey: this.key,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketCommand', {
      vectorBucketArn: this.vectorBucket.vectorBucketArn,
    }).expect(ExpectedResult.objectLike({
      vectorBucket: {
        encryptionConfiguration: {
          sseType: 'aws:kms',
          kmsKeyArn: this.key.keyArn,
        },
      },
    }));
  }
}

class S3ManagedEncryptionTest extends EncryptionTestBase {
  public readonly vectorBucket: s3vectors.VectorBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.vectorBucket = new s3vectors.VectorBucket(this, 'Bucket', {
      vectorBucketName: 'integ-vb-s3-managed',
      encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketCommand', {
      vectorBucketArn: this.vectorBucket.vectorBucketArn,
    }).expect(ExpectedResult.objectLike({
      vectorBucket: {
        encryptionConfiguration: {
          sseType: 'AES256',
        },
      },
    }));
  }
}

const app = new core.App();

const testCases: EncryptionTestBase[] = [
  new OnlyEncryptionKeyTest(app, 'OnlyEncryptionKeyTest'),
  new OnlyKmsEncryptionTypeTest(app, 'OnlyKmsEncryptionTypeTest'),
  new KeyWithKmsEncryptionTypeTest(app, 'KeyWithKmsEncryptionTypeTest'),
  new S3ManagedEncryptionTest(app, 'S3ManagedEncryptionTest'),
];

const integ = new IntegTest(app, 'VectorBucketEncryptionIntegTest', { testCases });

testCases.forEach(testCase => testCase.validateAssertions(integ));

app.synth();
