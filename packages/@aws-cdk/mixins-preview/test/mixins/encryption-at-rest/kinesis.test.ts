/**
 * Unit tests for AWS Kinesis encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Kinesis::Stream (KMS required)
 *
 * Kinesis Stream is a KMS-required resource type, meaning:
 * - A KMS key is mandatory for encryption
 * - The mixin constructor requires a KMS key parameter
 */

import { CfnStream } from 'aws-cdk-lib/aws-kinesis';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnStreamEncryptionAtRestMixin } from '../../../lib/services/aws-kinesis/encryption-at-rest-mixins.generated';

describe('CfnStreamEncryptionAtRestMixin', () => {
  test('supports CfnStream', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {
      name: 'test-stream',
    });
    const mixin = new CfnStreamEncryptionAtRestMixin(kmsKey);
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack, kmsKey } = createTestContext();
    const mixin = new CfnStreamEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {
      name: 'test-stream',
    });
    const mixin = new CfnStreamEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Kinesis::Stream', {
      Name: 'test-stream',
      StreamEncryption: {
        EncryptionType: 'KMS',
        KeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('preserves existing stream configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {
      name: 'test-stream',
      shardCount: 2,
      retentionPeriodHours: 48,
    });
    const mixin = new CfnStreamEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Kinesis::Stream', {
      Name: 'test-stream',
      ShardCount: 2,
      RetentionPeriodHours: 48,
      StreamEncryption: {
        EncryptionType: 'KMS',
        KeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {
      name: 'test-stream',
    });
    const mixin = new CfnStreamEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
