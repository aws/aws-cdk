/**
 * Unit tests for AWS RDS encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::RDS::CustomDBEngineVersion
 * - AWS::RDS::DBCluster
 * - AWS::RDS::DBInstance
 * - AWS::RDS::GlobalCluster (no KMS support - Category 3)
 * - AWS::RDS::Integration
 */

import {
  CfnCustomDBEngineVersion,
  CfnDBCluster,
  CfnDBInstance,
  CfnGlobalCluster,
  CfnIntegration,
} from 'aws-cdk-lib/aws-rds';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnCustomDBEngineVersionEncryptionAtRestMixin,
  CfnDBClusterEncryptionAtRestMixin,
  CfnDBInstanceEncryptionAtRestMixin,
  CfnGlobalClusterEncryptionAtRestMixin,
  CfnIntegrationEncryptionAtRestMixin,
} from '../../../lib/services/aws-rds/encryption-at-rest-mixins.generated';

describe('CfnCustomDBEngineVersionEncryptionAtRestMixin', () => {
  test('supports CfnCustomDBEngineVersion', () => {
    const { stack } = createTestContext();
    const resource = new CfnCustomDBEngineVersion(stack, 'Resource', {
      databaseInstallationFilesS3BucketName: 'test-bucket',
      engine: 'custom-oracle-ee',
      engineVersion: '19.custom_version',
    });
    const mixin = new CfnCustomDBEngineVersionEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnCustomDBEngineVersionEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnCustomDBEngineVersion(stack, 'Resource', {
      databaseInstallationFilesS3BucketName: 'test-bucket',
      engine: 'custom-oracle-ee',
      engineVersion: '19.custom_version',
    });
    const mixin = new CfnCustomDBEngineVersionEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::RDS::CustomDBEngineVersion', {
      Engine: 'custom-oracle-ee',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnCustomDBEngineVersion(stack, 'Resource', {
      databaseInstallationFilesS3BucketName: 'test-bucket',
      engine: 'custom-oracle-ee',
      engineVersion: '19.custom_version',
    });
    const mixin = new CfnCustomDBEngineVersionEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::RDS::CustomDBEngineVersion', {
      Engine: 'custom-oracle-ee',
      KMSKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnDBClusterEncryptionAtRestMixin', () => {
  test('supports CfnDBCluster', () => {
    const { stack } = createTestContext();
    const resource = new CfnDBCluster(stack, 'Resource', {
      engine: 'aurora-mysql',
    });
    const mixin = new CfnDBClusterEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDBClusterEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDBCluster(stack, 'Resource', {
      engine: 'aurora-mysql',
    });
    const mixin = new CfnDBClusterEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-mysql',
      StorageEncrypted: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDBCluster(stack, 'Resource', {
      engine: 'aurora-mysql',
    });
    const mixin = new CfnDBClusterEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-mysql',
      StorageEncrypted: true,
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnDBInstanceEncryptionAtRestMixin', () => {
  test('supports CfnDBInstance', () => {
    const { stack } = createTestContext();
    const resource = new CfnDBInstance(stack, 'Resource', {
      dbInstanceClass: 'db.t3.micro',
    });
    const mixin = new CfnDBInstanceEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDBInstanceEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDBInstance(stack, 'Resource', {
      dbInstanceClass: 'db.t3.micro',
    });
    const mixin = new CfnDBInstanceEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::RDS::DBInstance', {
      DBInstanceClass: 'db.t3.micro',
      StorageEncrypted: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDBInstance(stack, 'Resource', {
      dbInstanceClass: 'db.t3.micro',
    });
    const mixin = new CfnDBInstanceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::RDS::DBInstance', {
      DBInstanceClass: 'db.t3.micro',
      StorageEncrypted: true,
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnGlobalClusterEncryptionAtRestMixin', () => {
  test('supports CfnGlobalCluster', () => {
    const { stack } = createTestContext();
    const resource = new CfnGlobalCluster(stack, 'Resource', {});
    const mixin = new CfnGlobalClusterEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnGlobalClusterEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies service-managed encryption (no KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnGlobalCluster(stack, 'Resource', {});
    const mixin = new CfnGlobalClusterEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::RDS::GlobalCluster', {
      StorageEncrypted: true,
    });
  });
});

describe('CfnIntegrationEncryptionAtRestMixin', () => {
  test('supports CfnIntegration', () => {
    const { stack } = createTestContext();
    const resource = new CfnIntegration(stack, 'Resource', {
      sourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
      targetArn: 'arn:aws:redshift:us-east-1:123456789012:namespace:target-namespace',
    });
    const mixin = new CfnIntegrationEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnIntegrationEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnIntegration(stack, 'Resource', {
      sourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
      targetArn: 'arn:aws:redshift:us-east-1:123456789012:namespace:target-namespace',
    });
    const mixin = new CfnIntegrationEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::RDS::Integration', {
      SourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnIntegration(stack, 'Resource', {
      sourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
      targetArn: 'arn:aws:redshift:us-east-1:123456789012:namespace:target-namespace',
    });
    const mixin = new CfnIntegrationEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::RDS::Integration', {
      SourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
      KMSKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
