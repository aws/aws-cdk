/**
 * Unit tests for AWS Scheduler encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Scheduler::Schedule
 *
 * Scheduler Schedule supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kmsKeyArn property.
 */

import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnScheduleEncryptionAtRestMixin } from '../../../lib/services/aws-scheduler/encryption-at-rest-mixins.generated';

describe('CfnScheduleEncryptionAtRestMixin', () => {
  test('supports CfnSchedule', () => {
    const { stack } = createTestContext();
    const resource = new CfnSchedule(stack, 'Resource', {
      flexibleTimeWindow: {
        mode: 'OFF',
      },
      scheduleExpression: 'rate(1 hour)',
      target: {
        arn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
        roleArn: 'arn:aws:iam::123456789012:role/scheduler-role',
      },
    });
    const mixin = new CfnScheduleEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnScheduleEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnSchedule(stack, 'Resource', {
      flexibleTimeWindow: {
        mode: 'OFF',
      },
      scheduleExpression: 'rate(1 hour)',
      target: {
        arn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
        roleArn: 'arn:aws:iam::123456789012:role/scheduler-role',
      },
    });
    const mixin = new CfnScheduleEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Scheduler::Schedule', {
      ScheduleExpression: 'rate(1 hour)',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnSchedule(stack, 'Resource', {
      flexibleTimeWindow: {
        mode: 'OFF',
      },
      scheduleExpression: 'rate(1 hour)',
      target: {
        arn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
        roleArn: 'arn:aws:iam::123456789012:role/scheduler-role',
      },
    });
    const mixin = new CfnScheduleEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Scheduler::Schedule', {
      ScheduleExpression: 'rate(1 hour)',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnSchedule(stack, 'Resource', {
      name: 'test-schedule',
      flexibleTimeWindow: {
        mode: 'FLEXIBLE',
        maximumWindowInMinutes: 15,
      },
      scheduleExpression: 'cron(0 12 * * ? *)',
      scheduleExpressionTimezone: 'America/New_York',
      target: {
        arn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
        roleArn: 'arn:aws:iam::123456789012:role/scheduler-role',
      },
    });
    const mixin = new CfnScheduleEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Scheduler::Schedule', {
      Name: 'test-schedule',
      ScheduleExpressionTimezone: 'America/New_York',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnSchedule(stack, 'Resource', {
      flexibleTimeWindow: {
        mode: 'OFF',
      },
      scheduleExpression: 'rate(1 hour)',
      target: {
        arn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
        roleArn: 'arn:aws:iam::123456789012:role/scheduler-role',
      },
    });
    const mixin = new CfnScheduleEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
