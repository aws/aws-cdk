import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Duration, Stack, App, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftQuerySchedulerTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Test 1: Cluster with dbUser and single SQL
    new redshift.RedshiftQueryScheduler(this, 'ClusterScheduler', {
      schedulerName: 'cluster-daily-report',
      database: 'analytics',
      clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
      dbUser: 'scheduler_user',
      sql: 'SELECT COUNT(*) FROM orders WHERE created_date = CURRENT_DATE',
      schedule: scheduler.ScheduleExpression.rate(Duration.days(1)),
      description: 'Daily order count report for cluster',
    });

    // Test 2: Workgroup with secret and multiple SQLs
    const secret = secretsmanager.Secret.fromSecretNameV2(this, 'RedshiftSecret', 'arn:aws:secretsmanager:us-east-1:123456789012:secret:redshift-credentials-abc123');

    new redshift.RedshiftQueryScheduler(this, 'WorkgroupScheduler', {
      schedulerName: 'workgroup-hourly-cleanup',
      database: 'warehouse',
      workgroupArn: 'arn:aws:redshift-serverless:us-east-1:123456789012:workgroup/test-workgroup',
      secret: secret,
      sqls: [
        'DELETE FROM temp_table WHERE created_at < CURRENT_TIMESTAMP - INTERVAL \'1 hour\'',
        'VACUUM temp_table',
        'ANALYZE temp_table',
      ],
      schedule: scheduler.ScheduleExpression.rate(Duration.hours(1)),
      description: 'Hourly cleanup for workgroup',
      enabled: true,
    });

    // Test 3: Disabled scheduler
    new redshift.RedshiftQueryScheduler(this, 'DisabledScheduler', {
      schedulerName: 'disabled-test',
      database: 'test_db',
      clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster-2',
      dbUser: 'test_user',
      sql: 'SELECT 1',
      schedule: scheduler.ScheduleExpression.rate(Duration.minutes(30)),
      description: 'Disabled scheduler for testing',
      enabled: false,
    });

    // Test 4: Custom IAM role
    const customRole = new iam.Role(this, 'CustomRedshiftRole', {
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
      description: 'Custom role for Redshift query execution',
    });

    customRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'redshift-data:ExecuteStatement',
        'redshift-data:DescribeStatement',
        'redshift-data:GetStatementResult',
      ],
      resources: ['*'],
    }));

    new redshift.RedshiftQueryScheduler(this, 'CustomRoleScheduler', {
      schedulerName: 'custom-role-test',
      database: 'analytics',
      clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:test-cluster',
      dbUser: 'scheduler_user',
      sql: 'SELECT COUNT(*) FROM users',
      schedule: scheduler.ScheduleExpression.rate(Duration.hours(12)),
      description: 'Scheduler with custom IAM role',
      role: customRole,
    });
  }
}

const app = new App();

const stack = new RedshiftQuerySchedulerTestStack(app, 'aws-redshift-alpha-query-scheduler', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

new integ.IntegTest(app, 'RedshiftQuerySchedulerIntegTest', {
  testCases: [stack],
});
