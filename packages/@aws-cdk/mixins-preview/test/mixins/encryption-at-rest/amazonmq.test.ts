/**
 * Unit tests for AWS AmazonMQ encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::AmazonMQ::Broker
 *
 * AmazonMQ Broker supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * encryptionOptions.kmsKeyId property.
 */

import { CfnBroker } from 'aws-cdk-lib/aws-amazonmq';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnBrokerEncryptionAtRestMixin } from '../../../lib/services/aws-amazonmq/encryption-at-rest-mixins.generated';

describe('CfnBrokerEncryptionAtRestMixin', () => {
  test('supports CfnBroker', () => {
    const { stack } = createTestContext();
    const resource = new CfnBroker(stack, 'Resource', {
      brokerName: 'test-broker',
      engineType: 'ACTIVEMQ',
      engineVersion: '5.17.6',
      hostInstanceType: 'mq.t3.micro',
      users: [{
        username: 'admin',
        password: 'password123',
      }],
      deploymentMode: 'SINGLE_INSTANCE',
      publiclyAccessible: false,
    });
    const mixin = new CfnBrokerEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnBrokerEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnBroker(stack, 'Resource', {
      brokerName: 'test-broker',
      engineType: 'ACTIVEMQ',
      engineVersion: '5.17.6',
      hostInstanceType: 'mq.t3.micro',
      users: [{
        username: 'admin',
        password: 'password123',
      }],
      deploymentMode: 'SINGLE_INSTANCE',
      publiclyAccessible: false,
    });
    const mixin = new CfnBrokerEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no encryptionOptions.kmsKeyId is set (uses AWS managed key by default)
    template().hasResourceProperties('AWS::AmazonMQ::Broker', {
      BrokerName: 'test-broker',
      EngineType: 'ACTIVEMQ',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnBroker(stack, 'Resource', {
      brokerName: 'test-broker',
      engineType: 'ACTIVEMQ',
      engineVersion: '5.17.6',
      hostInstanceType: 'mq.t3.micro',
      users: [{
        username: 'admin',
        password: 'password123',
      }],
      deploymentMode: 'SINGLE_INSTANCE',
      publiclyAccessible: false,
    });
    const mixin = new CfnBrokerEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AmazonMQ::Broker', {
      BrokerName: 'test-broker',
      EngineType: 'ACTIVEMQ',
      EncryptionOptions: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('preserves existing broker configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnBroker(stack, 'Resource', {
      brokerName: 'test-broker',
      engineType: 'ACTIVEMQ',
      engineVersion: '5.17.6',
      hostInstanceType: 'mq.m5.large',
      users: [{
        username: 'admin',
        password: 'password123',
      }],
      deploymentMode: 'ACTIVE_STANDBY_MULTI_AZ',
      publiclyAccessible: false,
      autoMinorVersionUpgrade: true,
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnBrokerEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AmazonMQ::Broker', {
      BrokerName: 'test-broker',
      EngineType: 'ACTIVEMQ',
      HostInstanceType: 'mq.m5.large',
      DeploymentMode: 'ACTIVE_STANDBY_MULTI_AZ',
      AutoMinorVersionUpgrade: true,
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      EncryptionOptions: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnBroker(stack, 'Resource', {
      brokerName: 'test-broker',
      engineType: 'ACTIVEMQ',
      engineVersion: '5.17.6',
      hostInstanceType: 'mq.t3.micro',
      users: [{
        username: 'admin',
        password: 'password123',
      }],
      deploymentMode: 'SINGLE_INSTANCE',
      publiclyAccessible: false,
    });
    const mixin = new CfnBrokerEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
