/**
 * Unit tests for AWS Redshift encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Redshift::Cluster
 * - AWS::Redshift::Integration
 */

import { CfnCluster, CfnIntegration } from 'aws-cdk-lib/aws-redshift';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnClusterEncryptionAtRestMixin,
  CfnIntegrationEncryptionAtRestMixin,
} from '../../../lib/services/aws-redshift/encryption-at-rest-mixins.generated';

describe('CfnClusterEncryptionAtRestMixin', () => {
  test('supports CfnCluster', () => {
    const { stack } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterType: 'single-node',
      dbName: 'testdb',
      masterUsername: 'admin',
      masterUserPassword: 'password123',
      nodeType: 'dc2.large',
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnClusterEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterType: 'single-node',
      dbName: 'testdb',
      masterUsername: 'admin',
      masterUserPassword: 'password123',
      nodeType: 'dc2.large',
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Redshift::Cluster', {
      DBName: 'testdb',
      Encrypted: true,
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterType: 'single-node',
      dbName: 'testdb',
      masterUsername: 'admin',
      masterUserPassword: 'password123',
      nodeType: 'dc2.large',
    });
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Redshift::Cluster', {
      DBName: 'testdb',
      Encrypted: true,
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnIntegrationEncryptionAtRestMixin', () => {
  test('supports CfnIntegration', () => {
    const { stack } = createTestContext();
    const resource = new CfnIntegration(stack, 'Resource', {
      sourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
      targetArn: 'arn:aws:redshift:us-east-1:123456789012:namespace:target-namespace',
    });
    const mixin = new CfnIntegrationEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnIntegrationEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnIntegration(stack, 'Resource', {
      sourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
      targetArn: 'arn:aws:redshift:us-east-1:123456789012:namespace:target-namespace',
    });
    const mixin = new CfnIntegrationEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::Redshift::Integration', {
      SourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnIntegration(stack, 'Resource', {
      sourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
      targetArn: 'arn:aws:redshift:us-east-1:123456789012:namespace:target-namespace',
    });
    const mixin = new CfnIntegrationEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Redshift::Integration', {
      SourceArn: 'arn:aws:rds:us-east-1:123456789012:cluster:source-cluster',
      KMSKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
