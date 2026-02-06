/**
 * Unit tests for AWS WorkSpacesThinClient encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::WorkSpacesThinClient::Environment
 *
 * WorkSpacesThinClient Environment supports optional KMS encryption. When no KMS key is provided,
 * AWS managed encryption is used by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the kmsKeyArn property.
 */

import { CfnEnvironment } from 'aws-cdk-lib/aws-workspacesthinclient';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnEnvironmentEncryptionAtRestMixin } from '../../../lib/services/aws-workspacesthinclient/encryption-at-rest-mixins.generated';

describe('CfnEnvironmentEncryptionAtRestMixin', () => {
  test('supports CfnEnvironment', () => {
    const { stack } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      desktopArn: 'arn:aws:workspaces:us-east-1:123456789012:workspace/ws-test123',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      desktopArn: 'arn:aws:workspaces:us-east-1:123456789012:workspace/ws-test123',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyArn is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::WorkSpacesThinClient::Environment', {
      DesktopArn: 'arn:aws:workspaces:us-east-1:123456789012:workspace/ws-test123',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEnvironment(stack, 'Resource', {
      desktopArn: 'arn:aws:workspaces:us-east-1:123456789012:workspace/ws-test123',
    });
    const mixin = new CfnEnvironmentEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::WorkSpacesThinClient::Environment', {
      DesktopArn: 'arn:aws:workspaces:us-east-1:123456789012:workspace/ws-test123',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
