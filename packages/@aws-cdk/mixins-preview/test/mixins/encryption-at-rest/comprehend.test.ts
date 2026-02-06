/**
 * Unit tests for AWS Comprehend encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Comprehend::DocumentClassifier
 */

import { CfnDocumentClassifier } from 'aws-cdk-lib/aws-comprehend';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnDocumentClassifierEncryptionAtRestMixin } from '../../../lib/services/aws-comprehend/encryption-at-rest-mixins.generated';

describe('CfnDocumentClassifierEncryptionAtRestMixin', () => {
  test('supports CfnDocumentClassifier', () => {
    const { stack } = createTestContext();
    const resource = new CfnDocumentClassifier(stack, 'Resource', {
      documentClassifierName: 'test-classifier',
      dataAccessRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      inputDataConfig: {
        s3Uri: 's3://test-bucket/input',
      },
      languageCode: 'en',
    });
    const mixin = new CfnDocumentClassifierEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDocumentClassifierEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDocumentClassifier(stack, 'Resource', {
      documentClassifierName: 'test-classifier',
      dataAccessRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      inputDataConfig: {
        s3Uri: 's3://test-bucket/input',
      },
      languageCode: 'en',
    });
    const mixin = new CfnDocumentClassifierEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Comprehend::DocumentClassifier', {
      DocumentClassifierName: 'test-classifier',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDocumentClassifier(stack, 'Resource', {
      documentClassifierName: 'test-classifier',
      dataAccessRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      inputDataConfig: {
        s3Uri: 's3://test-bucket/input',
      },
      languageCode: 'en',
    });
    const mixin = new CfnDocumentClassifierEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Comprehend::DocumentClassifier', {
      DocumentClassifierName: 'test-classifier',
      VolumeKmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
