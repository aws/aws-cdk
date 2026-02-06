/**
 * Unit tests for AWS M2 (Mainframe Modernization) encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::M2::Application
 * - AWS::M2::Environment
 *
 * M2 supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyId property.
 */

import { CfnApplication, CfnEnvironment } from 'aws-cdk-lib/aws-m2';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnApplicationEncryptionAtRestMixin,
  CfnEnvironmentEncryptionAtRestMixin,
} from '../../../lib/services/aws-m2/encryption-at-rest-mixins.generated';

describe('CfnApplicationEncryptionAtRestMixin', () => {
  test('supports CfnApplication', () => {
    const { stack } = createTestContext();
    const resource = new CfnApplication(stack, 'Resource', {
      definition: {
        s3Location: 's3://test-bucket/app.zip',
      },
      engineType: 'microfocus',
      name: 'test-app',
    });
    const mixin = new CfnApplicationEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnApplicationEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnApplication(stack, 'Resource', {
      definition: {
        s3Location: 's3://test-bucket/app.zip',
      },
      engineType: 'microfocus',
      name: 'test-app',
    });
    const mixin = new CfnApplicationEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::M2::Application', {
      Name: 'test-app',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnApplication(stack, 'Resource', {
      definition: {
        s3Location: 's3://test-bucket/app.zip',
      },
      engineType: 'microfocus',
      name: 'test-app',
    });
    const mixin = new CfnApplicationEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnEnvironmentEncryptionAtRestMixin', () => {
  test('supports CfnEnvironment', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      engineType: 'microfocus',
      instanceType: 'M2.m5.large',
      name: 'test-env',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      engineType: 'microfocus',
      instanceType: 'M2.m5.large',
      name: 'test-env',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::M2::Environment', {
      Name: 'test-env',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      engineType: 'microfocus',
      instanceType: 'M2.m5.large',
      name: 'test-env',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
