/**
 * Unit tests for AWS AppConfig encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::AppConfig::ConfigurationProfile
 * - AWS::AppConfig::Deployment
 *
 * AppConfig supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyIdentifier property.
 */

import { CfnConfigurationProfile, CfnDeployment } from 'aws-cdk-lib/aws-appconfig';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnConfigurationProfileEncryptionAtRestMixin,
  CfnDeploymentEncryptionAtRestMixin,
} from '../../../lib/services/aws-appconfig/encryption-at-rest-mixins.generated';

describe('CfnConfigurationProfileEncryptionAtRestMixin', () => {
  test('supports CfnConfigurationProfile', () => {
    const { stack } = createTestContext();
    const resource = new CfnConfigurationProfile(stack, 'Resource', {
      applicationId: 'test-app-id',
      name: 'test-profile',
      locationUri: 'hosted',
    });
    const mixin = new CfnConfigurationProfileEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnConfigurationProfileEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnConfigurationProfile(stack, 'Resource', {
      applicationId: 'test-app-id',
      name: 'test-profile',
      locationUri: 'hosted',
    });
    const mixin = new CfnConfigurationProfileEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      ApplicationId: 'test-app-id',
      Name: 'test-profile',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnConfigurationProfile(stack, 'Resource', {
      applicationId: 'test-app-id',
      name: 'test-profile',
      locationUri: 'hosted',
    });
    const mixin = new CfnConfigurationProfileEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      ApplicationId: 'test-app-id',
      Name: 'test-profile',
      KmsKeyIdentifier: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnConfigurationProfile(stack, 'Resource', {
      applicationId: 'test-app-id',
      name: 'test-profile',
      locationUri: 'hosted',
    });
    const mixin = new CfnConfigurationProfileEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnDeploymentEncryptionAtRestMixin', () => {
  test('supports CfnDeployment', () => {
    const { stack } = createTestContext();
    const resource = new CfnDeployment(stack, 'Resource', {
      applicationId: 'test-app-id',
      configurationProfileId: 'test-profile-id',
      configurationVersion: '1',
      deploymentStrategyId: 'test-strategy-id',
      environmentId: 'test-env-id',
    });
    const mixin = new CfnDeploymentEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDeploymentEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDeployment(stack, 'Resource', {
      applicationId: 'test-app-id',
      configurationProfileId: 'test-profile-id',
      configurationVersion: '1',
      deploymentStrategyId: 'test-strategy-id',
      environmentId: 'test-env-id',
    });
    const mixin = new CfnDeploymentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppConfig::Deployment', {
      ApplicationId: 'test-app-id',
      KmsKeyIdentifier: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnDeployment(stack, 'Resource', {
      applicationId: 'test-app-id',
      configurationProfileId: 'test-profile-id',
      configurationVersion: '1',
      deploymentStrategyId: 'test-strategy-id',
      environmentId: 'test-env-id',
    });
    const mixin = new CfnDeploymentEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
