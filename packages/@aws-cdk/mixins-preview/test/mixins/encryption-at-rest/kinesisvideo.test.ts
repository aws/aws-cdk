/**
 * Unit tests for AWS KinesisVideo encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::KinesisVideo::Stream
 *
 * KinesisVideo Stream supports optional KMS encryption. When no KMS key is provided,
 * AWS managed encryption is used by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the kmsKeyId property.
 */

import { CfnStream } from 'aws-cdk-lib/aws-kinesisvideo';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnStreamEncryptionAtRestMixin } from '../../../lib/services/aws-kinesisvideo/encryption-at-rest-mixins.generated';

describe('CfnStreamEncryptionAtRestMixin', () => {
  test('supports CfnStream', () => {
    const { stack } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {});
    const mixin = new CfnStreamEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnStreamEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {
      name: 'test-video-stream',
    });
    const mixin = new CfnStreamEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyId is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::KinesisVideo::Stream', {
      Name: 'test-video-stream',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {
      name: 'test-video-stream',
    });
    const mixin = new CfnStreamEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::KinesisVideo::Stream', {
      Name: 'test-video-stream',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing stream configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {
      name: 'test-video-stream',
      dataRetentionInHours: 24,
      deviceName: 'test-device',
    });
    const mixin = new CfnStreamEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::KinesisVideo::Stream', {
      Name: 'test-video-stream',
      DataRetentionInHours: 24,
      DeviceName: 'test-device',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnStream(stack, 'Resource', {
      name: 'test-video-stream',
    });
    const mixin = new CfnStreamEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
