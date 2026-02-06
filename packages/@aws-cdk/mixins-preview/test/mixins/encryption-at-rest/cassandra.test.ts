/**
 * Unit tests for AWS Cassandra encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Cassandra::Table
 */

import { CfnTable } from 'aws-cdk-lib/aws-cassandra';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnTableEncryptionAtRestMixin } from '../../../lib/services/aws-cassandra/encryption-at-rest-mixins.generated';

describe('CfnTableEncryptionAtRestMixin', () => {
  test('supports CfnTable', () => {
    const { stack } = createTestContext();
    const resource = new CfnTable(stack, 'Resource', {
      keyspaceName: 'test-keyspace',
      partitionKeyColumns: [{ columnName: 'id', columnType: 'text' }],
    });
    const mixin = new CfnTableEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnTableEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS owned key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnTable(stack, 'Resource', {
      keyspaceName: 'test-keyspace',
      partitionKeyColumns: [{ columnName: 'id', columnType: 'text' }],
    });
    const mixin = new CfnTableEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Cassandra::Table', {
      KeyspaceName: 'test-keyspace',
      EncryptionSpecification: {
        EncryptionType: 'AWS_OWNED_KMS_KEY',
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnTable(stack, 'Resource', {
      keyspaceName: 'test-keyspace',
      partitionKeyColumns: [{ columnName: 'id', columnType: 'text' }],
    });
    const mixin = new CfnTableEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Cassandra::Table', {
      KeyspaceName: 'test-keyspace',
      EncryptionSpecification: {
        EncryptionType: 'CUSTOMER_MANAGED_KMS_KEY',
        KmsKeyIdentifier: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});
