import type { Construct } from 'constructs';
import { transformAttributeValueMap } from './private/utils';
import type { DynamoAttributeValue, DynamoConsumedCapacity, DynamoItemCollectionMetrics } from './shared-types';
import type * as ddb from '../../../aws-dynamodb';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack, ValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Determines whether item attributes are returned when a condition check in a transaction fails.
 */
export enum DynamoReturnValuesOnConditionCheckFailure {
  /**
   * Return the item attributes as they appeared before the failed condition check
   */
  ALL_OLD = 'ALL_OLD',

  /**
   * Nothing is returned
   */
  NONE = 'NONE',
}

/**
 * Options shared by every item in a DynamoDB write transaction.
 */
export interface DynamoTransactItemBaseOptions {
  /**
   * The table the item belongs to.
   */
  readonly table: ddb.ITableRef;

  /**
   * One or more substitution tokens for attribute names in an expression.
   *
   * @default - No expression attribute names
   */
  readonly expressionAttributeNames?: { [key: string]: string };

  /**
   * One or more values that can be substituted in an expression.
   *
   * @default - No expression attribute values
   */
  readonly expressionAttributeValues?: { [key: string]: DynamoAttributeValue };

  /**
   * Whether to return the item attributes if the condition check for this item fails.
   *
   * @default DynamoReturnValuesOnConditionCheckFailure.NONE
   */
  readonly returnValuesOnConditionCheckFailure?: DynamoReturnValuesOnConditionCheckFailure;
}

/**
 * Options for a Put item in a DynamoDB write transaction.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Put.html
 */
export interface DynamoTransactPutOptions extends DynamoTransactItemBaseOptions {
  /**
   * A map of attribute name to attribute values, representing the primary key of the
   * item to be written and any other attributes.
   */
  readonly item: { [key: string]: DynamoAttributeValue };

  /**
   * A condition that must be satisfied for the write to succeed.
   *
   * @default - No condition expression
   */
  readonly conditionExpression?: string;
}

/**
 * Options for an Update item in a DynamoDB write transaction.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Update.html
 */
export interface DynamoTransactUpdateOptions extends DynamoTransactItemBaseOptions {
  /**
   * The primary key of the item to be updated.
   */
  readonly key: { [key: string]: DynamoAttributeValue };

  /**
   * An expression that defines one or more attributes to be updated.
   */
  readonly updateExpression: string;

  /**
   * A condition that must be satisfied for the update to succeed.
   *
   * @default - No condition expression
   */
  readonly conditionExpression?: string;
}

/**
 * Options for a Delete item in a DynamoDB write transaction.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Delete.html
 */
export interface DynamoTransactDeleteOptions extends DynamoTransactItemBaseOptions {
  /**
   * The primary key of the item to be deleted.
   */
  readonly key: { [key: string]: DynamoAttributeValue };

  /**
   * A condition that must be satisfied for the delete to succeed.
   *
   * @default - No condition expression
   */
  readonly conditionExpression?: string;
}

/**
 * Options for a ConditionCheck item in a DynamoDB write transaction.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ConditionCheck.html
 */
export interface DynamoTransactConditionCheckOptions extends DynamoTransactItemBaseOptions {
  /**
   * The primary key of the item to be checked.
   */
  readonly key: { [key: string]: DynamoAttributeValue };

  /**
   * A condition that must be satisfied for the transaction to succeed.
   */
  readonly conditionExpression: string;
}

/**
 * An item in a DynamoDB write transaction.
 *
 * Each item type grants the task the IAM action DynamoDB checks for it on its table:
 * `PutItem`, `UpdateItem`, `DeleteItem` or `ConditionCheckItem`.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis-iam.html
 */
export class DynamoTransactWriteItem {
  /**
   * Write a new item, or replace an existing one, as part of the transaction.
   */
  public static put(options: DynamoTransactPutOptions): DynamoTransactWriteItem {
    return new DynamoTransactWriteItem(options.table, 'PutItem', {
      Put: {
        ...renderBase(options),
        Item: transformAttributeValueMap(options.item),
        ConditionExpression: options.conditionExpression,
      },
    });
  }

  /**
   * Update an existing item's attributes as part of the transaction.
   */
  public static update(options: DynamoTransactUpdateOptions): DynamoTransactWriteItem {
    return new DynamoTransactWriteItem(options.table, 'UpdateItem', {
      Update: {
        ...renderBase(options),
        Key: transformAttributeValueMap(options.key),
        UpdateExpression: options.updateExpression,
        ConditionExpression: options.conditionExpression,
      },
    });
  }

  /**
   * Delete an item as part of the transaction.
   */
  public static delete(options: DynamoTransactDeleteOptions): DynamoTransactWriteItem {
    return new DynamoTransactWriteItem(options.table, 'DeleteItem', {
      Delete: {
        ...renderBase(options),
        Key: transformAttributeValueMap(options.key),
        ConditionExpression: options.conditionExpression,
      },
    });
  }

  /**
   * Check that an item exists or satisfies a condition, without modifying it.
   */
  public static conditionCheck(options: DynamoTransactConditionCheckOptions): DynamoTransactWriteItem {
    return new DynamoTransactWriteItem(options.table, 'ConditionCheckItem', {
      ConditionCheck: {
        ...renderBase(options),
        Key: transformAttributeValueMap(options.key),
        ConditionExpression: options.conditionExpression,
      },
    });
  }

  private constructor(
    private readonly table: ddb.ITableRef,
    private readonly action: string,
    private readonly rendered: { [key: string]: any },
  ) {}

  /**
   * The table this item belongs to.
   *
   * @internal
   */
  public get _table(): ddb.ITableRef {
    return this.table;
  }

  /**
   * The IAM action DynamoDB checks for this item.
   *
   * @internal
   */
  public get _iamAction(): string {
    return `dynamodb:${this.action}`;
  }

  /**
   * The item rendered as an element of `TransactItems`.
   *
   * @internal
   */
  public _render(): { [key: string]: any } {
    return this.rendered;
  }
}

function renderBase(options: DynamoTransactItemBaseOptions) {
  return {
    TableName: options.table.tableRef.tableName,
    ExpressionAttributeNames: options.expressionAttributeNames,
    ExpressionAttributeValues: transformAttributeValueMap(options.expressionAttributeValues),
    ReturnValuesOnConditionCheckFailure: options.returnValuesOnConditionCheckFailure,
  };
}

interface DynamoTransactWriteItemsOptions {
  /**
   * The items to write in the transaction, between 1 and 100.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#DDB-TransactWriteItems-request-TransactItems
   */
  readonly transactItems: DynamoTransactWriteItem[];

  /**
   * A token that makes the call idempotent, so retries with the same token
   * within 10 minutes do not apply the transaction twice.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#DDB-TransactWriteItems-request-ClientRequestToken
   *
   * @default - No client request token
   */
  readonly clientRequestToken?: string;

  /**
   * Determines the level of detail about provisioned throughput consumption that is returned in the response.
   *
   * @default DynamoConsumedCapacity.NONE
   */
  readonly returnConsumedCapacity?: DynamoConsumedCapacity;

  /**
   * Determines whether item collection metrics are returned in the response.
   *
   * @default DynamoItemCollectionMetrics.NONE
   */
  readonly returnItemCollectionMetrics?: DynamoItemCollectionMetrics;
}

/**
 * Properties for DynamoTransactWriteItems Task using JSONPath
 */
export interface DynamoTransactWriteItemsJsonPathProps extends sfn.TaskStateJsonPathBaseProps, DynamoTransactWriteItemsOptions {}

/**
 * Properties for DynamoTransactWriteItems Task using JSONata
 */
export interface DynamoTransactWriteItemsJsonataProps extends sfn.TaskStateJsonataBaseProps, DynamoTransactWriteItemsOptions {}

/**
 * Properties for DynamoTransactWriteItems Task
 */
export interface DynamoTransactWriteItemsProps extends sfn.TaskStateBaseProps, DynamoTransactWriteItemsOptions {}

/**
 * A Step Functions task that writes up to 100 items to one or more DynamoDB tables
 * in a single all-or-nothing transaction.
 *
 * Uses the AWS SDK service integration for `TransactWriteItems`.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html
 */
export class DynamoTransactWriteItems extends sfn.TaskStateBase {
  /**
   * A Step Functions task using JSONPath to call DynamoDB TransactWriteItems
   */
  public static jsonPath(scope: Construct, id: string, props: DynamoTransactWriteItemsJsonPathProps) {
    return new DynamoTransactWriteItems(scope, id, props);
  }

  /**
   * A Step Functions task using JSONata to call DynamoDB TransactWriteItems
   */
  public static jsonata(scope: Construct, id: string, props: DynamoTransactWriteItemsJsonataProps) {
    return new DynamoTransactWriteItems(scope, id, { ...props, queryLanguage: sfn.QueryLanguage.JSONATA });
  }

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: DynamoTransactWriteItemsProps) {
    super(scope, id, props);

    validatePatternSupported(props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE, [sfn.IntegrationPattern.REQUEST_RESPONSE]);

    const itemCount = props.transactItems.length;
    if (itemCount < 1 || itemCount > 100) {
      throw new ValidationError(lit`DynamoTransactWriteItemsCount`, `transactItems must contain between 1 and 100 items, got ${itemCount}`, this);
    }

    const actionsByTableName = new Map<string, Set<string>>();
    for (const item of props.transactItems) {
      const tableName = item._table.tableRef.tableName;
      const actions = actionsByTableName.get(tableName) ?? new Set<string>();
      actions.add(item._iamAction);
      actionsByTableName.set(tableName, actions);
    }

    this.taskPolicies = Array.from(actionsByTableName, ([tableName, actions]) => new iam.PolicyStatement({
      resources: [
        Stack.of(this).formatArn({
          service: 'dynamodb',
          resource: 'table',
          resourceName: tableName,
        }),
      ],
      actions: Array.from(actions).sort(),
    }));
  }

  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('aws-sdk:dynamodb', 'transactWriteItems'),
      ...this._renderParametersOrArguments({
        TransactItems: this.props.transactItems.map((item) => item._render()),
        ClientRequestToken: this.props.clientRequestToken,
        ReturnConsumedCapacity: this.props.returnConsumedCapacity,
        ReturnItemCollectionMetrics: this.props.returnItemCollectionMetrics,
      }, queryLanguage),
    };
  }
}
