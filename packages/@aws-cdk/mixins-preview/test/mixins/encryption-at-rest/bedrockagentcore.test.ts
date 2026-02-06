/**
 * Unit tests for AWS BedrockAgentCore encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::BedrockAgentCore::Gateway
 * - AWS::BedrockAgentCore::Memory
 */

import { CfnGateway, CfnMemory } from 'aws-cdk-lib/aws-bedrockagentcore';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnGatewayEncryptionAtRestMixin,
  CfnMemoryEncryptionAtRestMixin,
} from '../../../lib/services/aws-bedrockagentcore/encryption-at-rest-mixins.generated';

describe('CfnGatewayEncryptionAtRestMixin', () => {
  test('supports CfnGateway', () => {
    const { stack } = createTestContext();
    const resource = new CfnGateway(stack, 'Resource', {
      name: 'test-gateway',
      protocolType: 'MCP',
      authorizerType: 'CUSTOM_JWT',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      authorizerConfiguration: {
        customJwtAuthorizer: {
          discoveryUrl: 'https://example.com/.well-known/openid-configuration',
        },
      },
    });
    const mixin = new CfnGatewayEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnGatewayEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnGateway(stack, 'Resource', {
      name: 'test-gateway',
      protocolType: 'MCP',
      authorizerType: 'CUSTOM_JWT',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      authorizerConfiguration: {
        customJwtAuthorizer: {
          discoveryUrl: 'https://example.com/.well-known/openid-configuration',
        },
      },
    });
    const mixin = new CfnGatewayEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'test-gateway',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnGateway(stack, 'Resource', {
      name: 'test-gateway',
      protocolType: 'MCP',
      authorizerType: 'CUSTOM_JWT',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      authorizerConfiguration: {
        customJwtAuthorizer: {
          discoveryUrl: 'https://example.com/.well-known/openid-configuration',
        },
      },
    });
    const mixin = new CfnGatewayEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'test-gateway',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnMemoryEncryptionAtRestMixin', () => {
  test('supports CfnMemory', () => {
    const { stack } = createTestContext();
    const resource = new CfnMemory(stack, 'Resource', {
      name: 'test-memory',
      memoryStrategies: [],
      eventExpiryDuration: 86400,
    });
    const mixin = new CfnMemoryEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnMemoryEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no-op for standard KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnMemory(stack, 'Resource', {
      name: 'test-memory',
      memoryStrategies: [],
      eventExpiryDuration: 86400,
    });
    const mixin = new CfnMemoryEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test-memory',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnMemory(stack, 'Resource', {
      name: 'test-memory',
      memoryStrategies: [],
      eventExpiryDuration: 86400,
    });
    const mixin = new CfnMemoryEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test-memory',
      EncryptionKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
