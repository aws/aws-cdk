/**
 * Unit tests for AWS WorkSpaces encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::WorkSpaces::Workspace
 *
 * WorkSpaces Workspace supports optional KMS encryption. When no KMS key is provided,
 * encryption is enabled with AWS managed key. When a KMS key is provided,
 * customer-managed encryption is enabled.
 */

import { CfnWorkspace } from 'aws-cdk-lib/aws-workspaces';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnWorkspaceEncryptionAtRestMixin } from '../../../lib/services/aws-workspaces/encryption-at-rest-mixins.generated';

describe('CfnWorkspaceEncryptionAtRestMixin', () => {
  test('supports CfnWorkspace', () => {
    const { stack } = createTestContext();
    const resource = new CfnWorkspace(stack, 'Resource', {
      bundleId: 'wsb-test-bundle',
      directoryId: 'd-test-directory',
      userName: 'test-user',
    });
    const mixin = new CfnWorkspaceEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnWorkspaceEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (enables root volume encryption with AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnWorkspace(stack, 'Resource', {
      bundleId: 'wsb-test-bundle',
      directoryId: 'd-test-directory',
      userName: 'test-user',
    });
    const mixin = new CfnWorkspaceEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, rootVolumeEncryptionEnabled is set to true but no volumeEncryptionKey
    template().hasResourceProperties('AWS::WorkSpaces::Workspace', {
      BundleId: 'wsb-test-bundle',
      DirectoryId: 'd-test-directory',
      UserName: 'test-user',
      RootVolumeEncryptionEnabled: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnWorkspace(stack, 'Resource', {
      bundleId: 'wsb-test-bundle',
      directoryId: 'd-test-directory',
      userName: 'test-user',
    });
    const mixin = new CfnWorkspaceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::WorkSpaces::Workspace', {
      BundleId: 'wsb-test-bundle',
      DirectoryId: 'd-test-directory',
      UserName: 'test-user',
      RootVolumeEncryptionEnabled: true,
      VolumeEncryptionKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
