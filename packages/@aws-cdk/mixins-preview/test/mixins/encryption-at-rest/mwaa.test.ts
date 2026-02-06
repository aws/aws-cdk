/**
 * Unit tests for AWS MWAA (Managed Workflows for Apache Airflow) encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::MWAA::Environment
 *
 * MWAA Environment supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKey property.
 */

import { CfnEnvironment } from 'aws-cdk-lib/aws-mwaa';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnEnvironmentEncryptionAtRestMixin } from '../../../lib/services/aws-mwaa/encryption-at-rest-mixins.generated';

describe('CfnEnvironmentEncryptionAtRestMixin', () => {
  test('supports CfnEnvironment', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::MWAA::Environment', {
      Name: 'test-environment',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::MWAA::Environment', {
      Name: 'test-environment',
      KmsKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
      environmentClass: 'mw1.small',
      maxWorkers: 10,
      tags: { Environment: 'Test' },
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::MWAA::Environment', {
      Name: 'test-environment',
      EnvironmentClass: 'mw1.small',
      MaxWorkers: 10,
      KmsKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      name: 'test-environment',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
