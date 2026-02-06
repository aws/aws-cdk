/**
 * Unit tests for AWS MediaConnect encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::MediaConnect::FlowEntitlement (no KMS support)
 * - AWS::MediaConnect::FlowOutput (no KMS support)
 *
 * MediaConnect resources do not support customer-managed KMS keys.
 * The mixin applies service-managed encryption.
 */

import { CfnFlowEntitlement, CfnFlowOutput } from 'aws-cdk-lib/aws-mediaconnect';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnFlowEntitlementEncryptionAtRestMixin,
  CfnFlowOutputEncryptionAtRestMixin,
} from '../../../lib/services/aws-mediaconnect/encryption-at-rest-mixins.generated';

describe('CfnFlowEntitlementEncryptionAtRestMixin', () => {
  test('supports CfnFlowEntitlement', () => {
    const { stack } = createTestContext();
    const resource = new CfnFlowEntitlement(stack, 'Resource', {
      description: 'Test entitlement',
      flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:test-flow',
      name: 'test-entitlement',
      subscribers: ['arn:aws:iam::123456789012:root'],
    });
    const mixin = new CfnFlowEntitlementEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFlowEntitlementEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption (no KMS support - uses service-managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnFlowEntitlement(stack, 'Resource', {
      description: 'Test entitlement',
      flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:test-flow',
      name: 'test-entitlement',
      subscribers: ['arn:aws:iam::123456789012:root'],
    });
    const mixin = new CfnFlowEntitlementEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::MediaConnect::FlowEntitlement', {
      Name: 'test-entitlement',
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnFlowEntitlement(stack, 'Resource', {
      description: 'Test entitlement',
      flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:test-flow',
      name: 'test-entitlement',
      subscribers: ['arn:aws:iam::123456789012:root'],
    });
    const mixin = new CfnFlowEntitlementEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnFlowOutputEncryptionAtRestMixin', () => {
  test('supports CfnFlowOutput', () => {
    const { stack } = createTestContext();
    const resource = new CfnFlowOutput(stack, 'Resource', {
      flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:test-flow',
      protocol: 'zixi-push',
    });
    const mixin = new CfnFlowOutputEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFlowOutputEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption (no KMS support - uses service-managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnFlowOutput(stack, 'Resource', {
      flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:test-flow',
      protocol: 'zixi-push',
    });
    const mixin = new CfnFlowOutputEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::MediaConnect::FlowOutput', {
      Protocol: 'zixi-push',
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnFlowOutput(stack, 'Resource', {
      flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:test-flow',
      protocol: 'zixi-push',
    });
    const mixin = new CfnFlowOutputEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
