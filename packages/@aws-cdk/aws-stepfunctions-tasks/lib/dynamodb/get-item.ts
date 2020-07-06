import * as ddb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DynamoMethod, getDynamoResourceArn, transformAttributeValueMap } from './private/utils';
import { DynamoAttributeValue, DynamoConsumedCapacity, DynamoProjectionExpression } from './shared-types';

/**
 * Properties for DynamoGetItem Task
 */
export interface DynamoGetItemProps extends sfn.TaskStateBaseProps {
  /**
   * The name of the table containing the requested item.
   */
  readonly table: ddb.ITable;

  /**
   * Primary key of the item to retrieve.
   *
   * For the primary key, you must provide all of the attributes.
   * For example, with a simple primary key, you only need to provide a value for the partition key.
   * For a composite primary key, you must provide values for both the partition key and the sort key.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#DDB-GetItem-request-Key
   */
  readonly key: { [key: string]: DynamoAttributeValue };

  /**
   * Determines the read consistency model:
   * If set to true, then the operation uses strongly consistent reads;
   * otherwise, the operation uses eventually consistent reads.
   *
   * @default false
   */
  readonly consistentRead?: boolean;

  /**
   * One or more substitution tokens for attribute names in an expression
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#DDB-GetItem-request-ExpressionAttributeNames
   *
   * @default - No expression attributes
   */
  readonly expressionAttributeNames?: { [key: string]: string };

  /**
   * An array of DynamoProjectionExpression that identifies one or more attributes to retrieve from the table.
   * These attributes can include scalars, sets, or elements of a JSON document.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#DDB-GetItem-request-ProjectionExpression
   *
   * @default - No projection expression
   */
  readonly projectionExpression?: DynamoProjectionExpression[];

  /**
   * Determines the level of detail about provisioned throughput consumption that is returned in the response
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#DDB-GetItem-request-ReturnConsumedCapacity
   *
   * @default DynamoConsumedCapacity.NONE
   */
  readonly returnConsumedCapacity?: DynamoConsumedCapacity;
}

/**
 * A StepFunctions task to call DynamoGetItem
 */
export class DynamoGetItem extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: DynamoGetItemProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: [
          Stack.of(this).formatArn({
            service: 'dynamodb',
            resource: 'table',
            resourceName: props.table.tableName,
          }),
        ],
        actions: [`dynamodb:${DynamoMethod.GET}Item`],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: getDynamoResourceArn(DynamoMethod.GET),
      Parameters: sfn.FieldUtils.renderObject({
        Key: transformAttributeValueMap(this.props.key),
        TableName: this.props.table.tableName,
        ConsistentRead: this.props.consistentRead ?? false,
        ExpressionAttributeNames: this.props.expressionAttributeNames,
        ProjectionExpression: this.configureProjectionExpression(this.props.projectionExpression),
        ReturnConsumedCapacity: this.props.returnConsumedCapacity,
      }),
    };
  }

  private configureProjectionExpression(expressions?: DynamoProjectionExpression[]): string | undefined {
    return expressions ? expressions.map((expression) => expression.toString()).join(',') : undefined;
  }
}
