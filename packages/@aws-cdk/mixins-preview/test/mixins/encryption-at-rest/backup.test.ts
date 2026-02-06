/**
 * Unit tests for AWS Backup encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Backup::BackupVault
 */

import { CfnBackupVault } from 'aws-cdk-lib/aws-backup';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnBackupVaultEncryptionAtRestMixin } from '../../../lib/services/aws-backup/encryption-at-rest-mixins.generated';

describe('CfnBackupVaultEncryptionAtRestMixin', () => {
  test('supports CfnBackupVault', () => {
    const { stack } = createTestContext();
    const resource = new CfnBackupVault(stack, 'Resource', {
      backupVaultName: 'test-vault',
    });
    const mixin = new CfnBackupVaultEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnBackupVaultEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnBackupVault(stack, 'Resource', {
      backupVaultName: 'test-vault',
    });
    const mixin = new CfnBackupVaultEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::Backup::BackupVault', {
      BackupVaultName: 'test-vault',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnBackupVault(stack, 'Resource', {
      backupVaultName: 'test-vault',
    });
    const mixin = new CfnBackupVaultEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Backup::BackupVault', {
      BackupVaultName: 'test-vault',
      EncryptionKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
