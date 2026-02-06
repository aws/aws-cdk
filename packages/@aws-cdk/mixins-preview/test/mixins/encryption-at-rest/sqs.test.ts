/**
 * Unit tests for AWS SQS encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::SQS::Queue
 *
 * SQS Queue supports optional KMS encryption. SQS-managed encryption (SSE-SQS)
 * is enabled by default for new queues. When a KMS key is provided,
 * customer-managed encryption (SSE-KMS) is enabled via the kmsMasterKeyId property.
 */

import { CfnQueue } from 'aws-cdk-lib/aws-sqs';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnQueueEncryptionAtRestMixin } from '../../../lib/services/aws-sqs/encryption-at-rest-mixins.generated';

describe('CfnQueueEncryptionAtRestMixin', () => {
  test('supports CfnQueue', () => {
    const { stack } = createTestContext();
    const resource = new CfnQueue(stack, 'Resource', {
      queueName: 'test-queue',
    });
    const mixin = new CfnQueueEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnQueueEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses SQS-managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnQueue(stack, 'Resource', {
      queueName: 'test-queue',
    });
    const mixin = new CfnQueueEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, SqsManagedSseEnabled is set to true for SSE-SQS encryption
    template().hasResourceProperties('AWS::SQS::Queue', {
      QueueName: 'test-queue',
      SqsManagedSseEnabled: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnQueue(stack, 'Resource', {
      queueName: 'test-queue',
    });
    const mixin = new CfnQueueEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SQS::Queue', {
      QueueName: 'test-queue',
      SqsManagedSseEnabled: false,
      KmsMasterKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing queue configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnQueue(stack, 'Resource', {
      queueName: 'test-queue',
      visibilityTimeout: 60,
      messageRetentionPeriod: 86400,
    });
    const mixin = new CfnQueueEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SQS::Queue', {
      QueueName: 'test-queue',
      VisibilityTimeout: 60,
      MessageRetentionPeriod: 86400,
      SqsManagedSseEnabled: false,
      KmsMasterKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies encryption to FIFO queue with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnQueue(stack, 'Resource', {
      queueName: 'test-queue.fifo',
      fifoQueue: true,
      contentBasedDeduplication: true,
    });
    const mixin = new CfnQueueEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::SQS::Queue', {
      QueueName: 'test-queue.fifo',
      FifoQueue: true,
      ContentBasedDeduplication: true,
      SqsManagedSseEnabled: false,
      KmsMasterKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnQueue(stack, 'Resource', {
      queueName: 'test-queue',
    });
    const mixin = new CfnQueueEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
