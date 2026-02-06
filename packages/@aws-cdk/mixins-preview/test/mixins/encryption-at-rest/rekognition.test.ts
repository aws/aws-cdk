/**
 * Unit tests for AWS Rekognition encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Rekognition::StreamProcessor
 */

import { CfnStreamProcessor } from 'aws-cdk-lib/aws-rekognition';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnStreamProcessorEncryptionAtRestMixin } from '../../../lib/services/aws-rekognition/encryption-at-rest-mixins.generated';

describe('CfnStreamProcessorEncryptionAtRestMixin', () => {
  test('supports CfnStreamProcessor', () => {
    const { stack } = createTestContext();
    const resource = new CfnStreamProcessor(stack, 'Resource', {
      kinesisVideoStream: {
        arn: 'arn:aws:kinesisvideo:us-east-1:123456789012:stream/test-stream/1234567890123',
      },
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnStreamProcessorEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnStreamProcessorEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnStreamProcessor(stack, 'Resource', {
      kinesisVideoStream: {
        arn: 'arn:aws:kinesisvideo:us-east-1:123456789012:stream/test-stream/1234567890123',
      },
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnStreamProcessorEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Rekognition::StreamProcessor', {
      RoleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStreamProcessor(stack, 'Resource', {
      kinesisVideoStream: {
        arn: 'arn:aws:kinesisvideo:us-east-1:123456789012:stream/test-stream/1234567890123',
      },
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });
    const mixin = new CfnStreamProcessorEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Rekognition::StreamProcessor', {
      RoleArn: 'arn:aws:iam::123456789012:role/test-role',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
