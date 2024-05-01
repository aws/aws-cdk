import { DynamoDBMetrics } from './dynamodb-canned-metrics.generated';
import * as perms from './perms';
import { Operation, SystemErrorsForOperationsMetricOptions, OperationsMetricOptions, ITable } from './shared';
import { IMetric, MathExpression, Metric, MetricOptions, MetricProps } from '../../aws-cloudwatch';
import { Grant, IGrantable } from '../../aws-iam';
import { IKey } from '../../aws-kms';
import { Resource } from '../../core';

/**
 * Represents an instance of a DynamoDB table.
 */
export interface ITableV2 extends ITable {
  /**
   * The ID of the table.
   *
   * @attribute
   */
  readonly tableId?: string;
}

/**
 * Base class for a DynamoDB table.
 */
export abstract class TableBaseV2 extends Resource implements ITableV2 {
  /**
   * The ARN of the table.
   *
   * @attribute
   */
  public abstract readonly tableArn: string;

  /**
   * The name of the table.
   *
   * @attribute
   */
  public abstract readonly tableName: string;

  /**
   * The stream ARN of the table.
   *
   * @attribute
   */
  public abstract readonly tableStreamArn?: string;

  /**
   * The ID of the table.
   *
   * @attribute
   */
  public abstract readonly tableId?: string;

  /**
   * The KMS encryption key for the table.
   */
  public abstract readonly encryptionKey?: IKey;

  protected abstract readonly region: string;

  protected abstract get hasIndex(): boolean;

  /**
   * Adds an IAM policy statement associated with this table to an IAM principal's policy.
   *
   * Note: If `encryptionKey` is present, appropriate grants to the key needs to be added
   * separately using the `table.encryptionKey.grant*` methods.
   *
   * @param grantee the principal (no-op if undefined)
   * @param actions the set of actions to allow (i.e., 'dynamodb:PutItem', 'dynamodb:GetItem', etc.)
   */
  public grant(grantee: IGrantable, ...actions: string[]): Grant {
    const resourceArns = [this.tableArn];
    this.hasIndex && resourceArns.push(`${this.tableArn}/index/*`);
    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns,
      scope: this,
    });
  }

  /**
   * Adds an IAM policy statement associated with this table to an IAM principal's policy.
   *
   * Note: If `encryptionKey` is present, appropriate grants to the key needs to be added
   * separately using the `table.encryptionKey.grant*` methods.
   *
   * @param grantee the principal (no-op if undefined)
   * @param actions the set of actions to allow (i.e., 'dynamodb:DescribeStream', 'dynamodb:GetRecords', etc.)
   */
  public grantStream(grantee: IGrantable, ...actions: string[]): Grant {
    if (!this.tableStreamArn) {
      throw new Error(`No stream ARN found on the table ${this.node.path}`);
    }

    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.tableStreamArn],
    });
  }

  /**
   * Adds an IAM policy statement associated with this table to an IAM principal's policy.
   *
   * Actions: DescribeStream, GetRecords, GetShardIterator, ListStreams.
   *
   * Note: Appropriate grants will also be added to the customer-managed KMS keys associated with this
   * table if one was configured.
   *
   * @param grantee the principal to grant access to
   */
  public grantStreamRead(grantee: IGrantable): Grant {
    this.grantTableListStreams(grantee);

    const keyActions = perms.KEY_READ_ACTIONS;
    const streamActions = perms.READ_STREAM_DATA_ACTIONS;

    return this.combinedGrant(grantee, { keyActions, streamActions });
  }

  /**
   * Permits an IAM principal to list streams attached to this table.
   *
   * @param grantee the principal to grant access to
   */
  public grantTableListStreams(grantee: IGrantable): Grant {
    if (!this.tableStreamArn) {
      throw new Error(`No stream ARN found on the table ${this.node.path}`);
    }

    return Grant.addToPrincipal({
      grantee,
      actions: ['dynamodb:ListStreams'],
      resourceArns: [this.tableStreamArn],
    });
  }

  /**
   * Permits an IAM principal all data read operations on this table.
   *
   * Actions: BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan, DescribeTable.
   *
   * Note: Appropriate grants will also be added to the customer-managed KMS keys associated with this
   * table if one was configured.
   *
   * @param grantee the principal to grant access to
   */
  public grantReadData(grantee: IGrantable): Grant {
    const tableActions = perms.READ_DATA_ACTIONS.concat(perms.DESCRIBE_TABLE);
    return this.combinedGrant(grantee, { keyActions: perms.KEY_READ_ACTIONS, tableActions });
  }

  /**
   * Permits an IAM principal all data write operations on this table.
   *
   * Actions: BatchWriteItem, PutItem, UpdateItem, DeleteItem, DescribeTable.
   *
   * Note: Appropriate grants will also be added to the customer-managed KMS keys associated with this
   * table if one was configured.
   *
   * @param grantee the principal to grant access to
   */
  public grantWriteData(grantee: IGrantable): Grant {
    const tableActions = perms.WRITE_DATA_ACTIONS.concat(perms.DESCRIBE_TABLE);
    const keyActions = perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS);
    return this.combinedGrant(grantee, { keyActions, tableActions });
  }

  /**
   * Permits an IAM principal to all data read/write operations on this table.
   *
   * Actions: BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan, BatchWriteItem, PutItem, UpdateItem,
   * DeleteItem, DescribeTable.
   *
   * Note: Appropriate grants will also be added to the customer-managed KMS keys associated with this
   * table if one was configured.
   *
   * @param grantee the principal to grant access to
   */
  public grantReadWriteData(grantee: IGrantable): Grant {
    const tableActions = perms.READ_DATA_ACTIONS.concat(perms.WRITE_DATA_ACTIONS).concat(perms.DESCRIBE_TABLE);
    const keyActions = perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS);
    return this.combinedGrant(grantee, { keyActions, tableActions });
  }

  /**
   * Permits an IAM principal to all DynamoDB operations ('dynamodb:*') on this table.
   *
   * Note: Appropriate grants will also be added to the customer-managed KMS keys associated with this
   * table if one was configured.
   *
   * @param grantee the principal to grant access to
   */
  public grantFullAccess(grantee: IGrantable): Grant {
    const keyActions = perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS);
    return this.combinedGrant(grantee, { keyActions, tableActions: ['dynamodb:*'] });
  }

  /**
   * Return the given named metric for this table.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metric(metricName: string, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/DynamoDB',
      metricName,
      dimensionsMap: { TableName: this.tableName },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Metric for the consumed read capacity units for this table.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metricConsumedReadCapacityUnits(props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      ...DynamoDBMetrics.consumedReadCapacityUnitsSum({ TableName: this.tableName }),
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Metric for the consumed write capacity units for this table.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metricConsumedWriteCapacityUnits(props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      ...DynamoDBMetrics.consumedWriteCapacityUnitsSum({ TableName: this.tableName }),
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Metric for the user errors for this table.
   *
   * Note: This metric reports user errors across all the tables in the account and region the table
   * resides in.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metricUserErrors(props?: MetricOptions): Metric {
    if (props?.dimensions) {
      throw new Error('`dimensions` is not supported for the `UserErrors` metric');
    }

    return this.metric('UserErrors', { statistic: 'sum', ...props, dimensionsMap: {} });
  }

  /**
   * Metric for the conditional check failed requests for this table.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metricConditionalCheckFailedRequests(props?: MetricOptions): Metric {
    return this.metric('ConditionalCheckFailedRequests', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the successful request latency for this table.
   *
   * By default, the metric will be calculated as an average over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metricSuccessfulRequestLatency(props?: MetricOptions): Metric {
    if (!props?.dimensions?.Operation && !props?.dimensionsMap?.Operation) {
      throw new Error('`Operation` dimension must be passed for the `SuccessfulRequestLatency` metric');
    }

    const dimensionsMap = {
      TableName: this.tableName,
      Operation: props.dimensionsMap?.Operation ?? props.dimensions?.Operation,
    };

    const metricProps: MetricProps = {
      ...DynamoDBMetrics.successfulRequestLatencyAverage(dimensionsMap),
      ...props,
      dimensionsMap,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * How many requests are throttled on this table for the given operation
   *
   * By default, the metric will be calculated as an average over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metricThrottledRequestsForOperation(operation: string, props?: OperationsMetricOptions): IMetric {
    const metricProps: MetricProps = {
      ...DynamoDBMetrics.throttledRequestsSum({ Operation: operation, TableName: this.tableName }),
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * How many requests are throttled on this table. This will sum errors across all possible operations.
   *
   * By default, each individual metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metricThrottledRequestsForOperations(props?: OperationsMetricOptions): IMetric {
    return this.sumMetricsForOperations('ThrottledRequests', 'Sum of throttled requests across all operations', props);
  }

  /**
   * Metric for the system errors for this table. This will sum errors across all possible operations.
   *
   * By default, each individual metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metricSystemErrorsForOperations(props?: SystemErrorsForOperationsMetricOptions): IMetric {
    return this.sumMetricsForOperations('SystemErrors', 'Sum of errors across all operations', props);
  }

  /**
   * How many requests are throttled on this table.
   *
   * By default, each individual metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   *
   * @deprecated Do not use this function. It returns an invalid metric. Use `metricThrottledRequestsForOperation` instead.
   */
  public metricThrottledRequests(props?: MetricOptions): Metric {
    return this.metric('ThrottledRequests', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the system errors this table
   *
   * @deprecated use `metricSystemErrorsForOperations`.
   */
  public metricSystemErrors(props?: MetricOptions): Metric {
    if (!props?.dimensions?.Operation && !props?.dimensionsMap?.Operation) {
      // 'Operation' must be passed because its an operational metric.
      throw new Error("'Operation' dimension must be passed for the 'SystemErrors' metric.");
    }

    const dimensionsMap = {
      TableName: this.tableName,
      ...props?.dimensions ?? {},
      ...props?.dimensionsMap ?? {},
    };

    return this.metric('SystemErrors', { statistic: 'sum', ...props, dimensionsMap });
  }

  /**
   * Create a math expression for operations.
   */
  private sumMetricsForOperations(metricName: string, expressionLabel: string, props?: OperationsMetricOptions) {
    if (props?.dimensions?.Operation) {
      throw new Error('The Operation dimension is not supported. Use the `operations` property');
    }

    const operations = props?.operations ?? Object.values(Operation);
    const values = this.createMetricForOperations(metricName, operations, { statistic: 'sum', ...props });
    const sum = new MathExpression({
      expression: `${Object.keys(values).join(' + ')}`,
      usingMetrics: { ...values },
      color: props?.color,
      label: expressionLabel,
      period: props?.period,
    });

    return sum;
  }

  /**
   * Create a map of metrics that can be used in a math expression.
   *
   * Using the return value of this function as the `usingMetrics` property in `cloudwatch.MathExpression` allows you to
   * use the keys of this map as metric names inside you expression.
   */
  private createMetricForOperations(metricName: string, operations: Operation[], props?: MetricOptions,
    metricNameMapper?: (op: Operation) => string) {
    const metrics: Record<string, IMetric> = {};
    const mapper = metricNameMapper ?? (op => op.toLowerCase());

    if (props?.dimensions?.Operation) {
      throw new Error('Invalid properties. Operation dimension is not supported when calculating operational metrics');
    }

    for (const operation of operations) {
      const metric = this.metric(metricName, {
        ...props,
        dimensionsMap: { TableName: this.tableName, Operation: operation, ...props?.dimensions },
      });

      const operationMetricName = mapper(operation);
      const firstChar = operationMetricName.charAt(0);
      if (firstChar === firstChar.toUpperCase()) {
        throw new Error(`Mapper generated an illegal operation metric name: ${operationMetricName}. Must start with a lowercase letter`);
      }

      metrics[operationMetricName] = metric;
    }

    return metrics;
  }

  /**
   * Adds an IAM policy statement associated with this table to an IAM principal's policy.
   *
   * @param grantee the principal (no-op if undefined)
   * @param options options for keyActions, tableActions, and streamActions
   */
  private combinedGrant(grantee: IGrantable, options: { keyActions?: string[]; tableActions?: string[]; streamActions?: string[] }) {
    if (options.keyActions && this.encryptionKey) {
      this.encryptionKey.grant(grantee, ...options.keyActions);
    }

    if (options.tableActions) {
      const resourceArns = [this.tableArn];
      this.hasIndex && resourceArns.push(`${this.tableArn}/index/*`);
      return Grant.addToPrincipal({
        grantee,
        actions: options.tableActions,
        resourceArns,
        scope: this,
      });
    }

    if (options.streamActions) {
      if (!this.tableStreamArn) {
        throw new Error(`No stream ARNs found on the table ${this.node.path}`);
      }

      return Grant.addToPrincipal({
        grantee,
        actions: options.streamActions,
        resourceArns: [this.tableStreamArn],
        scope: this,
      });
    }

    throw new Error(`Unexpected 'action', ${options.tableActions || options.streamActions}`);
  }

  private configureMetric(props: MetricProps) {
    return new Metric({
      ...props,
      region: props?.region ?? this.region,
      account: props?.account ?? this.stack.account,
    });
  }
}
