/**
 * Unit tests for AWS DMS encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::DMS::Endpoint
 * - AWS::DMS::InstanceProfile
 * - AWS::DMS::ReplicationInstance
 *
 * DMS supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled.
 */

import { CfnEndpoint, CfnReplicationInstance } from 'aws-cdk-lib/aws-dms';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnEndpointEncryptionAtRestMixin,
  CfnReplicationInstanceEncryptionAtRestMixin,
} from '../../../lib/services/aws-dms/encryption-at-rest-mixins.generated';

describe('CfnEndpointEncryptionAtRestMixin', () => {
  test('supports CfnEndpoint', () => {
    const { stack } = createTestContext();
    const resource = new CfnEndpoint(stack, 'Resource', {
      endpointType: 'source',
      engineName: 'mysql',
    });
    const mixin = new CfnEndpointEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEndpointEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEndpoint(stack, 'Resource', {
      endpointType: 'source',
      engineName: 'mysql',
    });
    const mixin = new CfnEndpointEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DMS::Endpoint', {
      EndpointType: 'source',
      EngineName: 'mysql',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEndpoint(stack, 'Resource', {
      endpointType: 'source',
      engineName: 'mysql',
    });
    const mixin = new CfnEndpointEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DMS::Endpoint', {
      EndpointType: 'source',
      EngineName: 'mysql',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnEndpoint(stack, 'Resource', {
      endpointType: 'source',
      engineName: 'mysql',
    });
    const mixin = new CfnEndpointEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnReplicationInstanceEncryptionAtRestMixin', () => {
  test('supports CfnReplicationInstance', () => {
    const { stack } = createTestContext();
    const resource = new CfnReplicationInstance(stack, 'Resource', {
      replicationInstanceClass: 'dms.t3.micro',
    });
    const mixin = new CfnReplicationInstanceEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnReplicationInstanceEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnReplicationInstance(stack, 'Resource', {
      replicationInstanceClass: 'dms.t3.micro',
    });
    const mixin = new CfnReplicationInstanceEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DMS::ReplicationInstance', {
      ReplicationInstanceClass: 'dms.t3.micro',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnReplicationInstance(stack, 'Resource', {
      replicationInstanceClass: 'dms.t3.micro',
    });
    const mixin = new CfnReplicationInstanceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DMS::ReplicationInstance', {
      ReplicationInstanceClass: 'dms.t3.micro',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnReplicationInstance(stack, 'Resource', {
      replicationInstanceClass: 'dms.r5.large',
      allocatedStorage: 100,
      multiAz: true,
      publiclyAccessible: false,
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnReplicationInstanceEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DMS::ReplicationInstance', {
      ReplicationInstanceClass: 'dms.r5.large',
      AllocatedStorage: 100,
      MultiAZ: true,
      PubliclyAccessible: false,
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnReplicationInstance(stack, 'Resource', {
      replicationInstanceClass: 'dms.t3.micro',
    });
    const mixin = new CfnReplicationInstanceEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
