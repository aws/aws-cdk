import * as ddb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DynamoMethod, getDynamoResourceArn, transformAttributeValueMap } from './private/utils';
import { DynamoAttributeValue, DynamoConsumedCapacity, DynamoItemCollectionMetrics, DynamoReturnValues } from './shared-types';

/**
 * Properties for DynamoDeleteItem Task
 */
export interface DynamoDeleteItemProps extends sfn.TaskStateBaseProps {
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
   * A condition that must be satisfied in order for a conditional DeleteItem to succeed.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ConditionExpression
   *
   * @default - No condition expression
   */
  readonly conditionExpression?: string;

  /**
   * One or more substitution tokens for attribute names in an expression
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ExpressionAttributeNames
   *
   * @default - No expression attribute names
   */
  readonly expressionAttributeNames?: { [key: string]: string };

  /**
   * One or more values that can be substituted in an expression.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ExpressionAttributeValues
   *
   * @default - No expression attribute values
   */
  readonly expressionAttributeValues?: { [key: string]: DynamoAttributeValue };

  /**
   * Determines the level of detail about provisioned throughput consumption that is returned in the response
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ReturnConsumedCapacity
   *
   * @default DynamoConsumedCapacity.NONE
   */
  readonly returnConsumedCapacity?: DynamoConsumedCapacity;

  /**
   * Determines whether item collection metrics are returned.
   * If set to SIZE, the response includes statistics about item collections, if any,
   * that were modified during the operation are returned in the response.
   * If set to NONE (the default), no statistics are returned.
   *
   * @default DynamoItemCollectionMetrics.NONE
   */
  readonly returnItemCollectionMetrics?: DynamoItemCollectionMetrics;

  /**
   * Use ReturnValues if you want to get the item attributes as they appeared before they were deleted.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ReturnValues
   *
   * @default DynamoReturnValues.NONE
   */
  readonly returnValues?: DynamoReturnValues;
}

/**
 * A StepFunctions task to call DynamoDeleteItem
 */
export class DynamoDeleteItem extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: DynamoDeleteItemProps) {
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
        actions: [`dynamodb:${DynamoMethod.DELETE}Item`],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: getDynamoResourceArn(DynamoMethod.DELETE),
      Parameters: sfn.FieldUtils.renderObject({
        Key: transformAttributeValueMap(this.props.key),
        TableName: this.props.table.tableName,
        ConditionExpression: this.props.conditionExpression,
        ExpressionAttributeNames: this.props.expressionAttributeNames,
        ExpressionAttributeValues: transformAttributeValueMap(this.props.expressionAttributeValues),
        ReturnConsumedCapacity: this.props.returnConsumedCapacity,
        ReturnItemCollectionMetrics: this.props.returnItemCollectionMetrics,
        ReturnValues: this.props.returnValues,
      }),
    };
  }
}
