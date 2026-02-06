/**
 * Unit tests for AWS AppRunner encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::AppRunner::Service (KMS required)
 *
 * AppRunner Service is a KMS-required resource type, meaning:
 * - A KMS key is mandatory for encryption
 * - The mixin constructor requires a KMS key parameter
 */

import { CfnService } from 'aws-cdk-lib/aws-apprunner';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnServiceEncryptionAtRestMixin } from '../../../lib/services/aws-apprunner/encryption-at-rest-mixins.generated';

describe('CfnServiceEncryptionAtRestMixin', () => {
  test('supports CfnService', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnService(stack, 'Resource', {
      sourceConfiguration: {
        imageRepository: {
          imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
          imageRepositoryType: 'ECR_PUBLIC',
        },
      },
    });
    const mixin = new CfnServiceEncryptionAtRestMixin(kmsKey);
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack, kmsKey } = createTestContext();
    const mixin = new CfnServiceEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnService(stack, 'Resource', {
      sourceConfiguration: {
        imageRepository: {
          imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
          imageRepositoryType: 'ECR_PUBLIC',
        },
      },
    });
    const mixin = new CfnServiceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppRunner::Service', {
      EncryptionConfiguration: {
        KmsKey: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('preserves existing encryption configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnService(stack, 'Resource', {
      sourceConfiguration: {
        imageRepository: {
          imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
          imageRepositoryType: 'ECR_PUBLIC',
        },
      },
      encryptionConfiguration: {
        // Pre-existing configuration (if any)
      } as any,
    });
    const mixin = new CfnServiceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppRunner::Service', {
      EncryptionConfiguration: {
        KmsKey: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnService(stack, 'Resource', {
      sourceConfiguration: {
        imageRepository: {
          imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
          imageRepositoryType: 'ECR_PUBLIC',
        },
      },
    });
    const mixin = new CfnServiceEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
