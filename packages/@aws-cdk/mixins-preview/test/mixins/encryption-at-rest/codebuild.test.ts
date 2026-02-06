/**
 * Unit tests for AWS CodeBuild encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::CodeBuild::Project
 *
 * CodeBuild Project supports optional KMS encryption for build artifacts.
 * Uses AWS managed S3 key by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the encryptionKey property.
 */

import { CfnProject } from 'aws-cdk-lib/aws-codebuild';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnProjectEncryptionAtRestMixin } from '../../../lib/services/aws-codebuild/encryption-at-rest-mixins.generated';

describe('CfnProjectEncryptionAtRestMixin', () => {
  test('supports CfnProject', () => {
    const { stack } = createTestContext();
    const resource = new CfnProject(stack, 'Resource', {
      artifacts: {
        type: 'NO_ARTIFACTS',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/codebuild/standard:5.0',
        type: 'LINUX_CONTAINER',
      },
      serviceRole: 'arn:aws:iam::123456789012:role/codebuild-role',
      source: {
        type: 'NO_SOURCE',
      },
    });
    const mixin = new CfnProjectEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnProjectEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnProject(stack, 'Resource', {
      artifacts: {
        type: 'NO_ARTIFACTS',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/codebuild/standard:5.0',
        type: 'LINUX_CONTAINER',
      },
      serviceRole: 'arn:aws:iam::123456789012:role/codebuild-role',
      source: {
        type: 'NO_SOURCE',
      },
    });
    const mixin = new CfnProjectEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeBuild::Project', {
      Artifacts: {
        Type: 'NO_ARTIFACTS',
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnProject(stack, 'Resource', {
      artifacts: {
        type: 'S3',
        location: 'test-bucket',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/codebuild/standard:5.0',
        type: 'LINUX_CONTAINER',
      },
      serviceRole: 'arn:aws:iam::123456789012:role/codebuild-role',
      source: {
        type: 'NO_SOURCE',
      },
    });
    const mixin = new CfnProjectEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeBuild::Project', {
      EncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnProject(stack, 'Resource', {
      name: 'test-project',
      artifacts: {
        type: 'NO_ARTIFACTS',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_MEDIUM',
        image: 'aws/codebuild/standard:5.0',
        type: 'LINUX_CONTAINER',
      },
      serviceRole: 'arn:aws:iam::123456789012:role/codebuild-role',
      source: {
        type: 'GITHUB',
        location: 'https://github.com/test/repo.git',
      },
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnProjectEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::CodeBuild::Project', {
      Name: 'test-project',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      EncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnProject(stack, 'Resource', {
      artifacts: {
        type: 'NO_ARTIFACTS',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/codebuild/standard:5.0',
        type: 'LINUX_CONTAINER',
      },
      serviceRole: 'arn:aws:iam::123456789012:role/codebuild-role',
      source: {
        type: 'NO_SOURCE',
      },
    });
    const mixin = new CfnProjectEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
