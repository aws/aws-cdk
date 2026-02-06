/**
 * Unit tests for AWS KinesisFirehose encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::KinesisFirehose::DeliveryStream
 *
 * DeliveryStream supports optional KMS encryption. When no KMS key is provided,
 * the mixin still sets keyType to 'CUSTOMER_MANAGED_CMK'. When a KMS key is provided,
 * customer-managed encryption is enabled via the deliveryStreamEncryptionConfigurationInput property.
 *
 * NOTE: There is a known issue in the mixin implementation where the property name
 * 'keyARN' is used instead of 'KeyARN' (case mismatch). This causes the KMS key ARN
 * to not be properly set in the CloudFormation template. The tests document this
 * behavior and will pass once the mixin is fixed.
 */

import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDeliveryStreamEncryptionAtRestMixin } from '../../../lib/services/aws-kinesisfirehose/encryption-at-rest-mixins.generated';

describe('CfnDeliveryStreamEncryptionAtRestMixin', () => {
  test('supports CfnDeliveryStream', () => {
    const { stack } = createTestContext();
    const resource = new CfnDeliveryStream(stack, 'Resource', {
      deliveryStreamName: 'test-delivery-stream',
    });
    const mixin = new CfnDeliveryStreamEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDeliveryStreamEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (sets AWS_OWNED_CMK key type)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDeliveryStream(stack, 'Resource', {
      deliveryStreamName: 'test-delivery-stream',
    });
    const mixin = new CfnDeliveryStreamEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, keyType is set to CUSTOMER_MANAGED_CMK but no keyARN
    template().hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamName: 'test-delivery-stream',
      DeliveryStreamEncryptionConfigurationInput: {
        KeyType: 'AWS_OWNED_CMK',
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDeliveryStream(stack, 'Resource', {
      deliveryStreamName: 'test-delivery-stream',
    });
    const mixin = new CfnDeliveryStreamEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamName: 'test-delivery-stream',
      DeliveryStreamEncryptionConfigurationInput: {
        KeyType: 'CUSTOMER_MANAGED_CMK',
        KeyARN: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('preserves existing delivery stream configuration when applying encryption', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDeliveryStream(stack, 'Resource', {
      deliveryStreamName: 'test-delivery-stream',
      deliveryStreamType: 'DirectPut',
    });
    const mixin = new CfnDeliveryStreamEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamName: 'test-delivery-stream',
      DeliveryStreamType: 'DirectPut',
      DeliveryStreamEncryptionConfigurationInput: {
        KeyType: 'CUSTOMER_MANAGED_CMK',
        KeyARN: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnDeliveryStream(stack, 'Resource', {
      deliveryStreamName: 'test-delivery-stream',
    });
    const mixin = new CfnDeliveryStreamEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
