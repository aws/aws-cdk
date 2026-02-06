/**
 * Unit tests for AWS EFS encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::EFS::FileSystem
 */

import { CfnFileSystem } from 'aws-cdk-lib/aws-efs';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnFileSystemEncryptionAtRestMixin } from '../../../lib/services/aws-efs/encryption-at-rest-mixins.generated';

describe('CfnFileSystemEncryptionAtRestMixin', () => {
  test('supports CfnFileSystem', () => {
    const { stack } = createTestContext();
    const resource = new CfnFileSystem(stack, 'Resource', {});
    const mixin = new CfnFileSystemEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFileSystemEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses default EFS KMS key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnFileSystem(stack, 'Resource', {});
    const mixin = new CfnFileSystemEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // EFS sets Encrypted to true, uses default EFS KMS key when no customer key provided
    template().hasResourceProperties('AWS::EFS::FileSystem', {
      Encrypted: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnFileSystem(stack, 'Resource', {});
    const mixin = new CfnFileSystemEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::EFS::FileSystem', {
      Encrypted: true,
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
