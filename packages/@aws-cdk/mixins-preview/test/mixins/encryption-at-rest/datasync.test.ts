/**
 * Unit tests for AWS DataSync encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::DataSync::LocationEFS (no KMS support)
 * - AWS::DataSync::LocationHDFS
 *
 * LocationEFS does not support customer-managed KMS keys.
 * LocationHDFS uses AWS managed key by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the kmsKeyProviderUri property.
 */

import { CfnLocationHDFS } from 'aws-cdk-lib/aws-datasync';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnLocationHDFSEncryptionAtRestMixin,
} from '../../../lib/services/aws-datasync/encryption-at-rest-mixins.generated';

describe('CfnLocationHDFSEncryptionAtRestMixin', () => {
  test('supports CfnLocationHDFS', () => {
    const { stack } = createTestContext();
    const resource = new CfnLocationHDFS(stack, 'Resource', {
      agentArns: ['arn:aws:datasync:us-east-1:123456789012:agent/agent-12345678901234567'],
      authenticationType: 'SIMPLE',
      nameNodes: [
        {
          hostname: 'namenode.example.com',
          port: 8020,
        },
      ],
    });
    const mixin = new CfnLocationHDFSEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnLocationHDFSEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnLocationHDFS(stack, 'Resource', {
      agentArns: ['arn:aws:datasync:us-east-1:123456789012:agent/agent-12345678901234567'],
      authenticationType: 'SIMPLE',
      nameNodes: [
        {
          hostname: 'namenode.example.com',
          port: 8020,
        },
      ],
    });
    const mixin = new CfnLocationHDFSEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyProviderUri is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::DataSync::LocationHDFS', {
      AgentArns: ['arn:aws:datasync:us-east-1:123456789012:agent/agent-12345678901234567'],
      AuthenticationType: 'SIMPLE',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnLocationHDFS(stack, 'Resource', {
      agentArns: ['arn:aws:datasync:us-east-1:123456789012:agent/agent-12345678901234567'],
      authenticationType: 'SIMPLE',
      nameNodes: [
        {
          hostname: 'namenode.example.com',
          port: 8020,
        },
      ],
    });
    const mixin = new CfnLocationHDFSEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DataSync::LocationHDFS', {
      AgentArns: ['arn:aws:datasync:us-east-1:123456789012:agent/agent-12345678901234567'],
      AuthenticationType: 'SIMPLE',
      KmsKeyProviderUri: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
