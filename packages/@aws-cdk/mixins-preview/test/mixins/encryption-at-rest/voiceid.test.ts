/**
 * Unit tests for AWS VoiceID encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::VoiceID::Domain
 *
 * VoiceID Domain requires a KMS key for encryption. When a KMS key is provided,
 * customer-managed encryption is enabled via the serverSideEncryptionConfiguration.kmsKeyId property.
 * When no KMS key is provided, the mixin does not modify the construct.
 */

import { CfnDomain } from 'aws-cdk-lib/aws-voiceid';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDomainEncryptionAtRestMixin } from '../../../lib/services/aws-voiceid/encryption-at-rest-mixins.generated';

describe('CfnDomainEncryptionAtRestMixin', () => {
  test('supports CfnDomain', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      name: 'test-domain',
      serverSideEncryptionConfiguration: {
        kmsKeyId: kmsKey.keyArn,
      },
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack, kmsKey } = createTestContext();
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      name: 'test-domain',
      serverSideEncryptionConfiguration: {
        kmsKeyId: 'placeholder-key',
      },
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::VoiceID::Domain', {
      Name: 'test-domain',
      ServerSideEncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      name: 'test-domain',
      description: 'Test VoiceID domain',
      serverSideEncryptionConfiguration: {
        kmsKeyId: 'placeholder-key',
      },
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::VoiceID::Domain', {
      Name: 'test-domain',
      Description: 'Test VoiceID domain',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      ServerSideEncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnDomain(stack, 'Resource', {
      name: 'test-domain',
      serverSideEncryptionConfiguration: {
        kmsKeyId: kmsKey.keyArn,
      },
    });
    const mixin = new CfnDomainEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
