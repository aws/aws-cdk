/**
 * Unit tests for AWS Events encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Events::Archive
 * - AWS::Events::Connection
 * - AWS::Events::EventBus
 *
 * These resources support optional KMS encryption. When no KMS key is provided,
 * AWS managed encryption is used by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the kmsKeyIdentifier property.
 */

import { CfnArchive, CfnConnection, CfnEventBus } from 'aws-cdk-lib/aws-events';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnArchiveEncryptionAtRestMixin, CfnConnectionEncryptionAtRestMixin, CfnEventBusEncryptionAtRestMixin } from '../../../lib/services/aws-events/encryption-at-rest-mixins.generated';

describe('CfnArchiveEncryptionAtRestMixin', () => {
  test('supports CfnArchive', () => {
    const { stack } = createTestContext();
    const resource = new CfnArchive(stack, 'Resource', {
      sourceArn: 'arn:aws:events:us-east-1:123456789012:event-bus/default',
    });
    const mixin = new CfnArchiveEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnArchiveEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnArchive(stack, 'Resource', {
      sourceArn: 'arn:aws:events:us-east-1:123456789012:event-bus/default',
    });
    const mixin = new CfnArchiveEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyIdentifier is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Events::Archive', {
      SourceArn: 'arn:aws:events:us-east-1:123456789012:event-bus/default',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnArchive(stack, 'Resource', {
      sourceArn: 'arn:aws:events:us-east-1:123456789012:event-bus/default',
    });
    const mixin = new CfnArchiveEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Events::Archive', {
      SourceArn: 'arn:aws:events:us-east-1:123456789012:event-bus/default',
      KmsKeyIdentifier: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnConnectionEncryptionAtRestMixin', () => {
  test('supports CfnConnection', () => {
    const { stack } = createTestContext();
    const resource = new CfnConnection(stack, 'Resource', {
      authorizationType: 'API_KEY',
    });
    const mixin = new CfnConnectionEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnConnectionEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnConnection(stack, 'Resource', {
      authorizationType: 'API_KEY',
    });
    const mixin = new CfnConnectionEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyIdentifier is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Events::Connection', {
      AuthorizationType: 'API_KEY',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnConnection(stack, 'Resource', {
      authorizationType: 'API_KEY',
    });
    const mixin = new CfnConnectionEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Events::Connection', {
      AuthorizationType: 'API_KEY',
      KmsKeyIdentifier: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnEventBusEncryptionAtRestMixin', () => {
  test('supports CfnEventBus', () => {
    const { stack } = createTestContext();
    const resource = new CfnEventBus(stack, 'Resource', {
      name: 'test-event-bus',
    });
    const mixin = new CfnEventBusEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEventBusEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEventBus(stack, 'Resource', {
      name: 'test-event-bus',
    });
    const mixin = new CfnEventBusEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyIdentifier is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Events::EventBus', {
      Name: 'test-event-bus',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEventBus(stack, 'Resource', {
      name: 'test-event-bus',
    });
    const mixin = new CfnEventBusEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Events::EventBus', {
      Name: 'test-event-bus',
      KmsKeyIdentifier: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
