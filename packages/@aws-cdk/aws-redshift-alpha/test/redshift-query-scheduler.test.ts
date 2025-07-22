// ABOUTME: Unit tests for ultra-simplified RedshiftQueryScheduler construct
// ABOUTME: Tests scheduled EventBridge Rule with RedshiftQuery target - no EventBridge Scheduler needed
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Duration, Stack } from 'aws-cdk-lib/core';
import { RedshiftQueryScheduler } from '../lib/redshift-query-scheduler';

describe('RedshiftQueryScheduler', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  describe('Basic functionality', () => {
    test('creates scheduled rule with cluster ARN and dbUser', () => {
      // ARRANGE
      const props = {
        schedulerName: 'test-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sql: 'SELECT * FROM test_table',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT
      new RedshiftQueryScheduler(stack, 'TestScheduler', props);

      // ASSERT
      const template = Template.fromStack(stack);

      // Verify scheduled EventBridge Rule is created (no separate Scheduler needed)
      template.hasResourceProperties('AWS::Events::Rule', {
        Name: 'QS2-test-scheduler',
        ScheduleExpression: 'rate(5 minutes)',
        State: 'ENABLED',
        Targets: [{
          Arn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
          RedshiftDataParameters: {
            Database: 'test-db',
            DbUser: 'test-user',
            Sql: 'SELECT * FROM test_table',
            StatementName: 'QS2-test-scheduler',
            WithEvent: true,
          },
        }],
      });

      // Verify no EventBridge Scheduler is created
      template.resourceCountIs('AWS::Scheduler::Schedule', 0);
    });

    test('creates scheduled rule with workgroup ARN and secret object', () => {
      // ARRANGE
      const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'TestSecret', 'test-secret');

      const props = {
        schedulerName: 'secret-scheduler',
        database: 'test-db',
        workgroupArn: 'arn:aws:redshift-serverless:us-east-1:123456789012:workgroup/test-workgroup',
        secret: secret,
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.hours(1)),
      };

      // ACT
      new RedshiftQueryScheduler(stack, 'SecretScheduler', props);

      // ASSERT
      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::Events::Rule', {
        Name: 'QS2-secret-scheduler',
        ScheduleExpression: 'rate(1 hour)',
        Targets: [{
          Arn: 'arn:aws:redshift-serverless:us-east-1:123456789012:workgroup/test-workgroup',
          RedshiftDataParameters: {
            Database: 'test-db',
            SecretManagerArn: 'test-secret',
            Sql: 'SELECT 1',
            StatementName: 'QS2-secret-scheduler',
            WithEvent: true,
          },
        }],
      });
    });

    test('maps single sql to array format for RedshiftQuery', () => {
      // ARRANGE
      const props = {
        schedulerName: 'single-sql',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sql: 'SELECT COUNT(*) FROM orders',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(30)),
      };

      // ACT
      new RedshiftQueryScheduler(stack, 'SingleSqlScheduler', props);

      // ASSERT
      const template = Template.fromStack(stack);

      // Verify single SQL is converted to array format
      template.hasResourceProperties('AWS::Events::Rule', {
        Targets: [{
          RedshiftDataParameters: {
            Sql: 'SELECT COUNT(*) FROM orders', // RedshiftQuery handles single SQL
          },
        }],
      });
    });

    test('handles multiple sqls correctly', () => {
      // ARRANGE
      const props = {
        schedulerName: 'multi-sql',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sqls: ['DELETE FROM temp_data', 'VACUUM temp_data', 'ANALYZE temp_data'],
        schedule: scheduler.ScheduleExpression.rate(Duration.hours(2)),
      };

      // ACT
      new RedshiftQueryScheduler(stack, 'MultiSqlScheduler', props);

      // ASSERT
      const template = Template.fromStack(stack);

      // Verify multiple SQLs are passed as array
      template.hasResourceProperties('AWS::Events::Rule', {
        Targets: [{
          RedshiftDataParameters: {
            Sqls: ['DELETE FROM temp_data', 'VACUUM temp_data', 'ANALYZE temp_data'],
          },
        }],
      });
    });
  });

  describe('Validation', () => {
    test('throws error when both clusterArn and workgroupArn are provided', () => {
      // ARRANGE
      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        workgroupArn: 'arn:aws:redshift-serverless:us-east-1:123456789012:workgroup/test-workgroup',
        dbUser: 'test-user',
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler', props);
      }).toThrow('Cannot specify both clusterArn and workgroupArn. Choose exactly one.');
    });

    test('throws error when neither clusterArn nor workgroupArn are provided', () => {
      // ARRANGE
      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        dbUser: 'test-user',
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler', props);
      }).toThrow('Must specify exactly one of clusterArn or workgroupArn.');
    });

    test('throws error when both dbUser and secret are provided', () => {
      // ARRANGE
      const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'TestSecret2', 'test-secret');

      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        secret: secret,
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler2', props);
      }).toThrow('Cannot specify both dbUser and secret. Choose exactly one.');
    });

    test('throws error when dbUser is provided with workgroupArn', () => {
      // ARRANGE
      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        workgroupArn: 'arn:aws:redshift-serverless:us-east-1:123456789012:workgroup/test-workgroup',
        dbUser: 'test-user',
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler', props);
      }).toThrow('Cannot specify dbUser when using workgroupArn.');
    });

    test('throws error when both sql and sqls are provided', () => {
      // ARRANGE
      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sql: 'SELECT 1',
        sqls: ['SELECT 2'],
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler', props);
      }).toThrow('Cannot specify both sql and sqls. Choose exactly one.');
    });

    test('throws error when neither sql nor sqls are provided', () => {
      // ARRANGE
      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler', props);
      }).toThrow('Must specify exactly one of sql or sqls.');
    });

    test('throws error when neither dbUser nor secret are provided', () => {
      // ARRANGE
      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler', props);
      }).toThrow('Must specify exactly one of dbUser or secret.');
    });

    test('throws error when sqls array is empty', () => {
      // ARRANGE
      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sqls: [],
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler', props);
      }).toThrow('sqls array cannot be empty.');
    });

    test('throws error when sql is empty string', () => {
      // ARRANGE
      const props = {
        schedulerName: 'invalid-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sql: '',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT & ASSERT
      expect(() => {
        new RedshiftQueryScheduler(stack, 'InvalidScheduler', props);
      }).toThrow('sql cannot be empty.');
    });
  });

  describe('Edge cases', () => {
    test('handles special characters in schedulerName', () => {
      // ARRANGE
      const props = {
        schedulerName: 'test-scheduler_with-special.chars',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
      };

      // ACT
      new RedshiftQueryScheduler(stack, 'SpecialCharsScheduler', props);

      // ASSERT
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Events::Rule', {
        Name: 'QS2-test-scheduler_with-special.chars',
        Targets: [{
          RedshiftDataParameters: {
            StatementName: 'QS2-test-scheduler_with-special.chars',
          },
        }],
      });
    });

    test('creates scheduler with optional description and enabled flag', () => {
      // ARRANGE
      const props = {
        schedulerName: 'described-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
        description: 'Test scheduler description',
        enabled: false,
      };

      // ACT
      new RedshiftQueryScheduler(stack, 'DescribedScheduler', props);

      // ASSERT
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Events::Rule', {
        Description: 'Test scheduler description',
        State: 'DISABLED',
      });
    });

    test('creates scheduler with custom IAM role', () => {
      // ARRANGE
      const customRole = new iam.Role(stack, 'CustomRedshiftRole', {
        assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
        description: 'Custom role for Redshift query execution',
      });

      customRole.addToPolicy(new iam.PolicyStatement({
        actions: ['redshift-data:ExecuteStatement'],
        resources: ['*'],
      }));

      const props = {
        schedulerName: 'role-scheduler',
        database: 'test-db',
        clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
        dbUser: 'test-user',
        sql: 'SELECT 1',
        schedule: scheduler.ScheduleExpression.rate(Duration.minutes(5)),
        role: customRole,
      };

      // ACT
      new RedshiftQueryScheduler(stack, 'RoleScheduler', props);

      // ASSERT
      const template = Template.fromStack(stack);

      // Verify the custom role is used in the target
      template.hasResourceProperties('AWS::Events::Rule', {
        Name: 'QS2-role-scheduler',
        Targets: [{
          Arn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
          RoleArn: {
            'Fn::GetAtt': ['CustomRedshiftRole1EB1A91A', 'Arn'],
          },
          RedshiftDataParameters: {
            Database: 'test-db',
            DbUser: 'test-user',
            Sql: 'SELECT 1',
            StatementName: 'QS2-role-scheduler',
            WithEvent: true,
          },
        }],
      });
    });
  });
});
