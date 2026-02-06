/**
 * Unit tests for AWS Timestream encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Timestream::Database
 * - AWS::Timestream::ScheduledQuery
 */

import { CfnDatabase, CfnScheduledQuery } from 'aws-cdk-lib/aws-timestream';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnDatabaseEncryptionAtRestMixin,
  CfnScheduledQueryEncryptionAtRestMixin,
} from '../../../lib/services/aws-timestream/encryption-at-rest-mixins.generated';

describe('CfnDatabaseEncryptionAtRestMixin', () => {
  test('supports CfnDatabase', () => {
    const { stack } = createTestContext();
    const resource = new CfnDatabase(stack, 'Resource', {
      databaseName: 'test-database',
    });
    const mixin = new CfnDatabaseEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDatabaseEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDatabase(stack, 'Resource', {
      databaseName: 'test-database',
    });
    const mixin = new CfnDatabaseEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::Timestream::Database', {
      DatabaseName: 'test-database',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDatabase(stack, 'Resource', {
      databaseName: 'test-database',
    });
    const mixin = new CfnDatabaseEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Timestream::Database', {
      DatabaseName: 'test-database',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnScheduledQueryEncryptionAtRestMixin', () => {
  test('supports CfnScheduledQuery', () => {
    const { stack } = createTestContext();
    const resource = new CfnScheduledQuery(stack, 'Resource', {
      queryString: 'SELECT * FROM test_table',
      scheduleConfiguration: {
        scheduleExpression: 'rate(1 hour)',
      },
      notificationConfiguration: {
        snsConfiguration: {
          topicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
        },
      },
      scheduledQueryExecutionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      errorReportConfiguration: {
        s3Configuration: {
          bucketName: 'test-bucket',
        },
      },
    });
    const mixin = new CfnScheduledQueryEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnScheduledQueryEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnScheduledQuery(stack, 'Resource', {
      queryString: 'SELECT * FROM test_table',
      scheduleConfiguration: {
        scheduleExpression: 'rate(1 hour)',
      },
      notificationConfiguration: {
        snsConfiguration: {
          topicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
        },
      },
      scheduledQueryExecutionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      errorReportConfiguration: {
        s3Configuration: {
          bucketName: 'test-bucket',
        },
      },
    });
    const mixin = new CfnScheduledQueryEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::Timestream::ScheduledQuery', {
      QueryString: 'SELECT * FROM test_table',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnScheduledQuery(stack, 'Resource', {
      queryString: 'SELECT * FROM test_table',
      scheduleConfiguration: {
        scheduleExpression: 'rate(1 hour)',
      },
      notificationConfiguration: {
        snsConfiguration: {
          topicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
        },
      },
      scheduledQueryExecutionRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      errorReportConfiguration: {
        s3Configuration: {
          bucketName: 'test-bucket',
        },
      },
    });
    const mixin = new CfnScheduledQueryEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Timestream::ScheduledQuery', {
      QueryString: 'SELECT * FROM test_table',
      KmsKeyId: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
