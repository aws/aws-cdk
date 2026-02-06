/**
 * Unit tests for AWS FSx encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::FSx::FileSystem
 */

import { CfnFileSystem } from 'aws-cdk-lib/aws-fsx';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnFileSystemEncryptionAtRestMixin } from '../../../lib/services/aws-fsx/encryption-at-rest-mixins.generated';

describe('CfnFileSystemEncryptionAtRestMixin', () => {
  test('supports CfnFileSystem', () => {
    const { stack } = createTestContext();
    // FSx FileSystem requires fileSystemType and subnetIds
    const resource = new CfnFileSystem(stack, 'Resource', {
      fileSystemType: 'LUSTRE',
      subnetIds: ['subnet-12345678'],
    });
    const mixin = new CfnFileSystemEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFileSystemEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnFileSystem(stack, 'Resource', {
      fileSystemType: 'LUSTRE',
      subnetIds: ['subnet-12345678'],
    });
    const mixin = new CfnFileSystemEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // FSx uses AWS managed key by default when no customer key is provided
    // The mixin only sets kmsKeyId when a customer key is provided
    template().hasResourceProperties('AWS::FSx::FileSystem', {
      FileSystemType: 'LUSTRE',
      SubnetIds: ['subnet-12345678'],
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnFileSystem(stack, 'Resource', {
      fileSystemType: 'LUSTRE',
      subnetIds: ['subnet-12345678'],
    });
    const mixin = new CfnFileSystemEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::FSx::FileSystem', {
      FileSystemType: 'LUSTRE',
      SubnetIds: ['subnet-12345678'],
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
