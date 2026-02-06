/**
 * Unit tests for AWS DynamoDB encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::DynamoDB::GlobalTable (no KMS support - Category 3)
 * - AWS::DynamoDB::Table
 */

import { CfnGlobalTable, CfnTable } from 'aws-cdk-lib/aws-dynamodb';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnGlobalTableEncryptionAtRestMixin,
  CfnTableEncryptionAtRestMixin,
} from '../../../lib/services/aws-dynamodb/encryption-at-rest-mixins.generated';

describe('CfnGlobalTableEncryptionAtRestMixin', () => {
  test('supports CfnGlobalTable', () => {
    const { stack } = createTestContext();
    const resource = new CfnGlobalTable(stack, 'Resource', {
      tableName: 'test-table',
      keySchema: [{ attributeName: 'id', keyType: 'HASH' }],
      attributeDefinitions: [{ attributeName: 'id', attributeType: 'S' }],
      replicas: [{ region: 'us-east-1' }],
    });
    const mixin = new CfnGlobalTableEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnGlobalTableEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies service-managed encryption (no KMS support)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnGlobalTable(stack, 'Resource', {
      tableName: 'test-table',
      keySchema: [{ attributeName: 'id', keyType: 'HASH' }],
      attributeDefinitions: [{ attributeName: 'id', attributeType: 'S' }],
      replicas: [{ region: 'us-east-1' }],
    });
    const mixin = new CfnGlobalTableEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableName: 'test-table',
      SSESpecification: {
        SSEEnabled: true,
        SSEType: 'KMS',
      },
    });
  });
});

describe('CfnTableEncryptionAtRestMixin', () => {
  test('supports CfnTable', () => {
    const { stack } = createTestContext();
    const resource = new CfnTable(stack, 'Resource', {
      tableName: 'test-table',
      keySchema: [{ attributeName: 'id', keyType: 'HASH' }],
      attributeDefinitions: [{ attributeName: 'id', attributeType: 'S' }],
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
      tableName: 'test-table',
      keySchema: [{ attributeName: 'id', keyType: 'HASH' }],
      attributeDefinitions: [{ attributeName: 'id', attributeType: 'S' }],
    });
    const mixin = new CfnTableEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'test-table',
      SSESpecification: {
        SSEEnabled: true,
        SSEType: 'KMS',
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnTable(stack, 'Resource', {
      tableName: 'test-table',
      keySchema: [{ attributeName: 'id', keyType: 'HASH' }],
      attributeDefinitions: [{ attributeName: 'id', attributeType: 'S' }],
    });
    const mixin = new CfnTableEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'test-table',
      SSESpecification: {
        SSEEnabled: true,
        SSEType: 'KMS',
        KMSMasterKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });
});
