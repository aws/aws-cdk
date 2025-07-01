import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../../lib';
import { Construct } from 'constructs';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';

/**
 * Test cases:
 *
 * | props.encryption | props.encryptionKey | bucketEncryption (expected)     | encryptionKey (expected)      |
 * |------------------|---------------------|---------------------------------|-------------------------------|
 * | undefined        | k                   | aws:kms                         | k                             |
 * | KMS              | undefined           | aws:kms                         | new key (allow maintenance SP)|
 * | KMS              | k                   | aws:kms                         | k                             |
 * | S3_MANAGED       | undefined           | AES256                          | undefined                     |
 */

abstract class EncryptionTestBase extends core.Stack {
  public abstract validateAssertions(integ: IntegTest): void;
}

class OnlyEncryptionKeyTest extends EncryptionTestBase {
  public readonly tableBucket: s3tables.TableBucket;
  public readonly key: kms.IKey;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.key = new kms.Key(this, 'Key', {});
    this.tableBucket = new s3tables.TableBucket(this, id, {
      tableBucketName: 'integ-tb-key-only',
      encryptionKey: this.key,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    const encryptionConfig = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'GetTableBucketEncryptionCommand', {
      tableBucketARN: this.tableBucket.tableBucketArn,
    });

    encryptionConfig.expect(ExpectedResult.objectLike({
      encryptionConfiguration: {
        sseAlgorithm: 'aws:kms',
        kmsKeyArn: this.key.keyArn,
      },
    }));
  }
}

class OnlyKMSEncryptionTypeTest extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.tableBucket = new s3tables.TableBucket(this, id, {
      tableBucketName: 'integ-tb-kms-encryption-type-only',
      encryption: s3tables.TableBucketEncryption.KMS,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    const encryptionConfig = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'GetTableBucketEncryptionCommand', {
      tableBucketARN: this.tableBucket.tableBucketArn,
    });

    encryptionConfig.expect(ExpectedResult.objectLike({
      encryptionConfiguration: {
        sseAlgorithm: 'aws:kms',
        kmsKeyArn: Match.stringLikeRegexp('arn:aws:kms:.*:key/[\w-]+'),
      },
    }));
  }
}
class KeyWithKMSEncryptionTypeTest extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;
  public readonly key: kms.IKey;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.key = new kms.Key(this, 'Key', {});
    this.tableBucket = new s3tables.TableBucket(this, id, {
      tableBucketName: 'integ-tb-key-with-type',
      account: props?.env?.account,
      region: props?.env?.region,
      encryption: s3tables.TableBucketEncryption.KMS,
      encryptionKey: this.key,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    const encryptionConfig = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'GetTableBucketEncryptionCommand', {
      tableBucketARN: this.tableBucket.tableBucketArn,
    });

    encryptionConfig.expect(ExpectedResult.objectLike({
      encryptionConfiguration: {
        sseAlgorithm: 'aws:kms',
        kmsKeyArn: this.key.keyArn,
      },
    }));
  }
}
class OnlyS3ManagedEncryptionTest extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.tableBucket = new s3tables.TableBucket(this, id, {
      tableBucketName: 'integ-tb-s3-managed-encryption-type-only',
      encryption: s3tables.TableBucketEncryption.S3_MANAGED,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    const encryptionConfig = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'GetTableBucketEncryptionCommand', {
      tableBucketARN: this.tableBucket.tableBucketArn,
    });

    encryptionConfig.expect(ExpectedResult.objectLike({
      encryptionConfiguration: {
        sseAlgorithm: 'AES256',
      },
    }));
  }
}

const app = new core.App();

const testCases = [
  new OnlyEncryptionKeyTest(app, 'OnlyEncryptionKeyTest', {}),
  new OnlyKMSEncryptionTypeTest(app, 'OnlyKMSEncryptionTypeTest', {}),
  new KeyWithKMSEncryptionTypeTest(app, 'KeyWithKMSEncryptionTypeTest', {}),
  new OnlyS3ManagedEncryptionTest(app, 'OnlyS3ManagedEncryptionTest', {}),
];

new IntegTest(app, 'TableBucketEncryptionIntegTest', { testCases });

// TODO: Uncomment to add assertions once SDK is updated to include GetTableBucketEncryption API
// testCases.forEach(testCase => testCase.validateAssertions(integ));

app.synth();
