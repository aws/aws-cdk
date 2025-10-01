// ABOUTME: Ultra-simplified RedshiftQueryScheduler using only scheduled EventBridge Rule
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { ValidationError } from 'aws-cdk-lib/core';

/**
 * Properties for the RedshiftQueryScheduler construct.
 */
export interface RedshiftQuerySchedulerProps {
  /**
   * The name of the scheduler. This will be used to create the EventBridge Scheduler rule name
   * and the StatementName in RedshiftDataParameters, both prefixed with "QS2-".
   */
  readonly schedulerName: string;

  /**
   * The name of the Redshift database to execute queries against.
   */
  readonly database: string;

  /**
   * The ARN of the Redshift cluster. Cannot be used together with workgroupArn.
   *
   * @default - No cluster ARN specified
   */
  readonly clusterArn?: string;

  /**
   * The ARN of the Redshift Serverless workgroup. Cannot be used together with clusterArn.
   * When using workgroupArn, dbUser cannot be specified.
   *
   * @default - No workgroup ARN specified
   */
  readonly workgroupArn?: string;

  /**
   * The database user name for authentication. Cannot be used together with secret.
   * Cannot be used when workgroupArn is specified.
   *
   * @default - No database user specified
   */
  readonly dbUser?: string;

  /**
   * The secret containing database credentials. Cannot be used together with dbUser.
   *
   * @default - No secret specified
   */
  readonly secret?: secretsmanager.ISecret;

  /**
   * A single SQL statement to execute. Cannot be used together with sqls.
   *
   * @default - No single SQL statement specified
   */
  readonly sql?: string;

  /**
   * Multiple SQL statements to execute as a transaction. Cannot be used together with sql.
   *
   * @default - No SQL statements array specified
   */
  readonly sqls?: string[];

  /**
   * The schedule expression that defines when the query should be executed.
   */
  readonly schedule: scheduler.ScheduleExpression;

  /**
   * A description for the scheduler.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Whether the scheduler is enabled.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The IAM role to use for executing the Redshift query.
   * This role must have permissions to execute queries on the specified Redshift cluster or workgroup.
   *
   * @default - A new role will be created with the necessary permissions
   */
  readonly role?: iam.IRole;
}

/**
 * A construct that creates a scheduled EventBridge Rule to execute Redshift queries using the Redshift Data API.
 *
 * This construct uses the simplest possible approach: a single EventBridge Rule with a schedule
 * that directly targets RedshiftQuery. No EventBridge Scheduler needed.
 *
 * The EventBridge rule name and StatementName are both set to "QS2-{schedulerName}" to enable
 * identification in the Amazon Redshift console.
 *
 * @example
 * new RedshiftQueryScheduler(this, 'MyScheduler', {
 *   schedulerName: 'daily-report',
 *   database: 'analytics',
 *   clusterArn: 'arn:aws:redshift:us-east-1:123456789012:cluster:my-cluster',
 *   dbUser: 'scheduler_user',
 *   sql: 'CALL generate_daily_report()',
 *   schedule: ScheduleExpression.rate(Duration.days(1)),
 * });
 */
export class RedshiftQueryScheduler extends Construct {
  /**
   * The EventBridge Rule created by this construct.
   */
  public readonly rule: events.Rule;

  constructor(scope: Construct, id: string, props: RedshiftQuerySchedulerProps) {
    super(scope, id);

    // Validate input parameters
    this.validateProps(props);

    const ruleName = `QS2-${props.schedulerName}`;
    const statementName = `QS2-${props.schedulerName}`;
    const targetArn = props.clusterArn || props.workgroupArn!;

    // Create scheduled EventBridge Rule
    this.rule = new events.Rule(this, 'Rule', {
      ruleName: ruleName,
      schedule: events.Schedule.expression(props.schedule.expressionString),
      description: props.description,
      enabled: props.enabled ?? true,
    });

    // Create RedshiftQuery target with parameter mapping
    const redshiftQueryProps: targets.RedshiftQueryProps = {
      database: props.database,
      dbUser: props.dbUser,
      secret: props.secret,
      sql: props.sql ? [props.sql] : props.sqls!,
      statementName: statementName,
      sendEventBridgeEvent: true, // Maps to WithEvent: true
      role: props.role,
    };

    const redshiftTarget = new targets.RedshiftQuery(targetArn, redshiftQueryProps);
    this.rule.addTarget(redshiftTarget);
  }

  private validateProps(props: RedshiftQuerySchedulerProps): void {
    // Validate target ARN (cluster or workgroup)
    const hasCluster = !!props.clusterArn;
    const hasWorkgroup = !!props.workgroupArn;

    if (hasCluster && hasWorkgroup) {
      throw new ValidationError('Cannot specify both clusterArn and workgroupArn. Choose exactly one.', this);
    }

    if (!hasCluster && !hasWorkgroup) {
      throw new ValidationError('Must specify exactly one of clusterArn or workgroupArn.', this);
    }

    // Validate authentication
    const hasDbUser = !!props.dbUser;
    const hasSecret = !!props.secret;

    if (hasDbUser && hasSecret) {
      throw new ValidationError('Cannot specify both dbUser and secret. Choose exactly one.', this);
    }

    if (!hasDbUser && !hasSecret) {
      throw new ValidationError('Must specify exactly one of dbUser or secret.', this);
    }

    // Validate workgroup + dbUser restriction
    if (hasWorkgroup && hasDbUser) {
      throw new ValidationError('Cannot specify dbUser when using workgroupArn.', this);
    }

    // Validate SQL content first
    if (props.sql !== undefined && props.sql.trim() === '') {
      throw new ValidationError('sql cannot be empty.', this);
    }

    if (props.sqls !== undefined && props.sqls.length === 0) {
      throw new ValidationError('sqls array cannot be empty.', this);
    }

    // Validate SQL presence
    const hasSql = !!props.sql && props.sql.trim() !== '';
    const hasSqls = !!props.sqls && props.sqls.length > 0;

    if (hasSql && hasSqls) {
      throw new ValidationError('Cannot specify both sql and sqls. Choose exactly one.', this);
    }

    if (!hasSql && !hasSqls) {
      throw new ValidationError('Must specify exactly one of sql or sqls.', this);
    }
  }
}
