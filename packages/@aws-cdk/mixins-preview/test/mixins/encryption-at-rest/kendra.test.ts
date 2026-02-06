/**
 * Unit tests for AWS Kendra encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Kendra::Index
 */

import { CfnIndex } from 'aws-cdk-lib/aws-kendra';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnIndexEncryptionAtRestMixin } from '../../../lib/services/aws-kendra/encryption-at-rest-mixins.generated';

describe('CfnIndexEncryptionAtRestMixin', () => {
  test('supports CfnIndex', () => {
    const { stack } = createTestContext();
    const resource = new CfnIndex(stack, 'Resource', {
      name: 'test-index',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      edition: 'DEVELOPER_EDITION',
    });
    const mixin = new CfnIndexEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnIndexEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnIndex(stack, 'Resource', {
      name: 'test-index',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      edition: 'DEVELOPER_EDITION',
    });
    const mixin = new CfnIndexEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Kendra::Index', {
      Name: 'test-index',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnIndex(stack, 'Resource', {
      name: 'test-index',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      edition: 'DEVELOPER_EDITION',
    });
    const mixin = new CfnIndexEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Kendra::Index', {
      Name: 'test-index',
      ServerSideEncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});
