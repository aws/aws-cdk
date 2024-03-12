import { singletonEventRole } from './util';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import * as secretsmanager from '../../aws-secretsmanager';
import * as sqs from '../../aws-sqs';

/**
 * Configuration properties of an Amazon Redshift Query event.
 */
export interface RedshiftQueryProps {

  /**
   * The Amazon Redshift database to run the query against.
   *
   * @default - dev
   */
  readonly database?: string;

  /**
   * The Amazon Redshift database user to run the query as. This is required when authenticating via temporary credentials.
   *
   * @default - No Database user is specified
   */
  readonly dbUser?: string;

  /**
   * The secret containing the password for the database user. This is required when authenticating via Secrets Manager.
   * If the full secret ARN is not specified, this will instead use the secret name.
   *
   * @default - No secret is specified
   */
  readonly secret?: secretsmanager.ISecret;

  /**
   * The SQL query to run. This will use the `executeStatement` API.
   *
   * @default - No SQL query is specified
   */
  readonly sql?: string;

  /**
   * The SQL queries to run. All statements are executed as a single transaction. They each run serially, as appeared in the array; the next sql statement will not run until the previous statement completes.
   * If any statement fails, the entire transaction is rolled back. This will use the `batchExecuteStatement` API.
   *
   * @default - No SQL queries are specified
   */
  readonly batchSQL?: string[];

  /**
   * The name of the SQL statement. You can name the SQL statement for identitfication purposes. It is recommended to append a `QS2-` prefix to the statement name, to allow Amazon Redshift to identify the Event Bridge rule, and present it in the Amazon Redshift console.
   *
   * @default - No statement name is specified
   */
  readonly statementName?: string;

  /**
   * Should an event be sent back to Event Bridge when the SQL statement is executed.
   *
   * @default - false
   */
  readonly withEvent?: boolean;

  /**
   * The queue to be used as dead letter queue.
   *
   * @default - No dead letter queue is specified
   */
  readonly deadLetterQueue?: sqs.IQueue;

  /**
   * The IAM role to be used to execute the SQL statement.
   *
   * @default - a new role will be created.
   */
  readonly role?: iam.IRole;
}

/**
 * Schedule an Amazon Redshift Query to be run, using the Redshift Data API.
 * It is recommended to append a `QS2-` prefix to both `statementName` and `ruleName`, to allow Amazon Redshift to identify the Event Bridge rule, and present it in the Amazon Redshift console.
 */
export class RedshiftQuery implements events.IRuleTarget {
  constructor(private readonly clusterArn: string, private readonly props: RedshiftQueryProps = {
    database: 'dev',
  }) {
  }

  bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const role = this.props.role ?? singletonEventRole(rule);
    if (this.props.sql) {
      role.addToPrincipalPolicy(this.putEventStatement());
    }
    if (this.props.batchSQL) {
      role.addToPrincipalPolicy(this.putBatchEventStatement());
    }

    return {
      arn: this.clusterArn,
      deadLetterConfig: this.props.deadLetterQueue ? { arn: this.props.deadLetterQueue?.queueArn } : undefined,
      role,
      redshiftDataParameters: {
        database: this.props.database ?? 'dev',
        dbUser: this.props.dbUser,
        secretManagerArn: this.props.secret?.secretFullArn ?? this.props.secret?.secretName,
        sql: this.props.sql,
        sqls: this.props.batchSQL,
        statementName: this.props.statementName,
        withEvent: this.props.withEvent,
      },
    };
  }

  private putEventStatement() {
    return new iam.PolicyStatement({
      actions: ['redshift-data:ExecuteStatement'],
      resources: [this.clusterArn],
    });
  }

  private putBatchEventStatement() {
    return new iam.PolicyStatement({
      actions: ['redshift-data:BatchExecuteStatement'],
      resources: [this.clusterArn],
    });
  }
}
