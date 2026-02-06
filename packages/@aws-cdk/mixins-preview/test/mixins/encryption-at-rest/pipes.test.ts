/**
 * Unit tests for AWS Pipes encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Pipes::Pipe
 *
 * Pipes supports optional KMS encryption. When no KMS key is provided,
 * AWS managed encryption is used by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the kmsKeyIdentifier property.
 */

import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnPipeEncryptionAtRestMixin } from '../../../lib/services/aws-pipes/encryption-at-rest-mixins.generated';

describe('CfnPipeEncryptionAtRestMixin', () => {
  test('supports CfnPipe', () => {
    const { stack } = createTestContext();
    const resource = new CfnPipe(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      source: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
      target: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    });
    const mixin = new CfnPipeEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnPipeEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnPipe(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      source: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
      target: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    });
    const mixin = new CfnPipeEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyIdentifier is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Pipes::Pipe', {
      RoleArn: 'arn:aws:iam::123456789012:role/test-role',
      Source: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
      Target: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnPipe(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      source: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
      target: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    });
    const mixin = new CfnPipeEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Pipes::Pipe', {
      RoleArn: 'arn:aws:iam::123456789012:role/test-role',
      Source: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
      Target: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
      KmsKeyIdentifier: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing pipe configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnPipe(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      source: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
      target: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
      name: 'test-pipe',
      description: 'A test pipe for encryption testing',
      desiredState: 'RUNNING',
    });
    const mixin = new CfnPipeEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Pipes::Pipe', {
      RoleArn: 'arn:aws:iam::123456789012:role/test-role',
      Source: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
      Target: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
      Name: 'test-pipe',
      Description: 'A test pipe for encryption testing',
      DesiredState: 'RUNNING',
      KmsKeyIdentifier: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnPipe(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      source: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
      target: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    });
    const mixin = new CfnPipeEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
