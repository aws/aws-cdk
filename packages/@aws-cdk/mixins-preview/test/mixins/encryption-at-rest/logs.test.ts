/**
 * Unit tests for AWS CloudWatch Logs encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Logs::LogAnomalyDetector
 * - AWS::Logs::LogGroup
 *
 * Both resources are encrypted with AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the kmsKeyId property.
 */

import { CfnLogAnomalyDetector, CfnLogGroup } from 'aws-cdk-lib/aws-logs';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnLogAnomalyDetectorEncryptionAtRestMixin,
  CfnLogGroupEncryptionAtRestMixin,
} from '../../../lib/services/aws-logs/encryption-at-rest-mixins.generated';

describe('CfnLogAnomalyDetectorEncryptionAtRestMixin', () => {
  test('supports CfnLogAnomalyDetector', () => {
    const { stack } = createTestContext();
    const resource = new CfnLogAnomalyDetector(stack, 'Resource', {});
    const mixin = new CfnLogAnomalyDetectorEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnLogAnomalyDetectorEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnLogAnomalyDetector(stack, 'Resource', {});
    const mixin = new CfnLogAnomalyDetectorEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyId is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Logs::LogAnomalyDetector', {});
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnLogAnomalyDetector(stack, 'Resource', {});
    const mixin = new CfnLogAnomalyDetectorEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Logs::LogAnomalyDetector', {
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnLogGroupEncryptionAtRestMixin', () => {
  test('supports CfnLogGroup', () => {
    const { stack } = createTestContext();
    const resource = new CfnLogGroup(stack, 'Resource', {});
    const mixin = new CfnLogGroupEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnLogGroupEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnLogGroup(stack, 'Resource', {});
    const mixin = new CfnLogGroupEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyId is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Logs::LogGroup', {});
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnLogGroup(stack, 'Resource', {});
    const mixin = new CfnLogGroupEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Logs::LogGroup', {
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
