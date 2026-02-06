/**
 * Unit tests for AWS GroundStation encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::GroundStation::MissionProfile
 *
 * GroundStation MissionProfile supports optional KMS encryption.
 */

import { CfnMissionProfile } from 'aws-cdk-lib/aws-groundstation';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnMissionProfileEncryptionAtRestMixin } from '../../../lib/services/aws-groundstation/encryption-at-rest-mixins.generated';

describe('CfnMissionProfileEncryptionAtRestMixin', () => {
  test('supports CfnMissionProfile', () => {
    const { stack } = createTestContext();
    const resource = new CfnMissionProfile(stack, 'Resource', {
      dataflowEdges: [],
      minimumViableContactDurationSeconds: 120,
      name: 'test-mission-profile',
      trackingConfigArn: 'arn:aws:groundstation:us-east-1:123456789012:config/tracking/test-config',
    });
    const mixin = new CfnMissionProfileEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnMissionProfileEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnMissionProfile(stack, 'Resource', {
      dataflowEdges: [],
      minimumViableContactDurationSeconds: 120,
      name: 'test-mission-profile',
      trackingConfigArn: 'arn:aws:groundstation:us-east-1:123456789012:config/tracking/test-config',
    });
    const mixin = new CfnMissionProfileEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::GroundStation::MissionProfile', {
      Name: 'test-mission-profile',
      StreamsKmsRole: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnMissionProfile(stack, 'Resource', {
      dataflowEdges: [],
      minimumViableContactDurationSeconds: 120,
      name: 'test-mission-profile',
      trackingConfigArn: 'arn:aws:groundstation:us-east-1:123456789012:config/tracking/test-config',
    });
    const mixin = new CfnMissionProfileEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
