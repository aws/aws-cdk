/**
 * Unit tests for AWS Config encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Config::DeliveryChannel
 *
 * DeliveryChannel uses AWS managed key for Config by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the s3KmsKeyArn property.
 */

import { CfnDeliveryChannel } from 'aws-cdk-lib/aws-config';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDeliveryChannelEncryptionAtRestMixin } from '../../../lib/services/aws-config/encryption-at-rest-mixins.generated';

describe('CfnDeliveryChannelEncryptionAtRestMixin', () => {
  test('supports CfnDeliveryChannel', () => {
    const { stack } = createTestContext();
    const resource = new CfnDeliveryChannel(stack, 'Resource', {
      s3BucketName: 'my-config-bucket',
    });
    const mixin = new CfnDeliveryChannelEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDeliveryChannelEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDeliveryChannel(stack, 'Resource', {
      s3BucketName: 'my-config-bucket',
    });
    const mixin = new CfnDeliveryChannelEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no S3KmsKeyArn is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Config::DeliveryChannel', {
      S3BucketName: 'my-config-bucket',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDeliveryChannel(stack, 'Resource', {
      s3BucketName: 'my-config-bucket',
    });
    const mixin = new CfnDeliveryChannelEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Config::DeliveryChannel', {
      S3BucketName: 'my-config-bucket',
      S3KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
