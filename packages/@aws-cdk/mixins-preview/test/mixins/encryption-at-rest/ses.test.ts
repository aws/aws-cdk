/**
 * Unit tests for AWS SES encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::SES::MailManagerArchive
 *
 * SES MailManagerArchive supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyArn property.
 */

import { CfnMailManagerArchive } from 'aws-cdk-lib/aws-ses';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnMailManagerArchiveEncryptionAtRestMixin } from '../../../lib/services/aws-ses/encryption-at-rest-mixins.generated';

describe('CfnMailManagerArchiveEncryptionAtRestMixin', () => {
  test('supports CfnMailManagerArchive', () => {
    const { stack } = createTestContext();
    const resource = new CfnMailManagerArchive(stack, 'Resource', {
      archiveName: 'test-archive',
    });
    const mixin = new CfnMailManagerArchiveEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnMailManagerArchiveEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnMailManagerArchive(stack, 'Resource', {
      archiveName: 'test-archive',
    });
    const mixin = new CfnMailManagerArchiveEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SES::MailManagerArchive', {
      ArchiveName: 'test-archive',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnMailManagerArchive(stack, 'Resource', {
      archiveName: 'test-archive',
    });
    const mixin = new CfnMailManagerArchiveEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SES::MailManagerArchive', {
      ArchiveName: 'test-archive',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnMailManagerArchive(stack, 'Resource', {
      archiveName: 'test-archive',
    });
    const mixin = new CfnMailManagerArchiveEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
