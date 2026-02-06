/**
 * Unit tests for AWS SNS encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::SNS::Topic
 *
 * SNS Topic supports optional KMS encryption. When no KMS key is provided,
 * messages are not encrypted by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the kmsMasterKeyId property.
 */

import { CfnTopic } from 'aws-cdk-lib/aws-sns';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnTopicEncryptionAtRestMixin } from '../../../lib/services/aws-sns/encryption-at-rest-mixins.generated';

describe('CfnTopicEncryptionAtRestMixin', () => {
  test('supports CfnTopic', () => {
    const { stack } = createTestContext();
    const resource = new CfnTopic(stack, 'Resource', {
      topicName: 'test-topic',
    });
    const mixin = new CfnTopicEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnTopicEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no encryption by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnTopic(stack, 'Resource', {
      topicName: 'test-topic',
    });
    const mixin = new CfnTopicEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsMasterKeyId is set - SNS topics are not encrypted by default
    template().hasResourceProperties('AWS::SNS::Topic', {
      TopicName: 'test-topic',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnTopic(stack, 'Resource', {
      topicName: 'test-topic',
    });
    const mixin = new CfnTopicEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SNS::Topic', {
      TopicName: 'test-topic',
      KmsMasterKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing topic configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnTopic(stack, 'Resource', {
      topicName: 'test-topic',
      displayName: 'Test Topic Display Name',
      fifoTopic: false,
    });
    const mixin = new CfnTopicEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SNS::Topic', {
      TopicName: 'test-topic',
      DisplayName: 'Test Topic Display Name',
      FifoTopic: false,
      KmsMasterKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies encryption to FIFO topic with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnTopic(stack, 'Resource', {
      topicName: 'test-topic.fifo',
      fifoTopic: true,
      contentBasedDeduplication: true,
    });
    const mixin = new CfnTopicEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SNS::Topic', {
      TopicName: 'test-topic.fifo',
      FifoTopic: true,
      ContentBasedDeduplication: true,
      KmsMasterKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnTopic(stack, 'Resource', {
      topicName: 'test-topic',
    });
    const mixin = new CfnTopicEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
