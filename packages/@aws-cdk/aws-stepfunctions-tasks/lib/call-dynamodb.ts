import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Determines the level of detail about provisioned throughput consumption that is returned.
 */
export enum ReturnConsumedCapacity {
  /**
   * The response includes the aggregate ConsumedCapacity for the operation,
   * together with ConsumedCapacity for each table and secondary index that was accessed
   */
  INDEXES = 'INDEXES',

  /**
   * The response includes only the aggregate ConsumedCapacity for the operation.
   */
  TOTAL = 'TOTAL',

  /**
   * No ConsumedCapacity details are included in the response.
   */
  NONE = 'NONE'
}

/**
 * Determines whether item collection metrics are returned.
 */
export enum ReturnItemCollectionMetrics {
  /**
   * If set to SIZE, the response includes statistics about item collections,
   * if any, that were modified during the operation.
   */
  SIZE = 'SIZE',

  /**
   * If set to NONE, no statistics are returned.
   */
  NONE = 'NONE'
}

/**
 * Use ReturnValues if you want to get the item attributes as they appear before or after they are changed
 */
export enum ReturnValues {
  /**
   * Nothing is returned
   */
  NONE = 'NONE',

  /**
   * Returns all of the attributes of the item
   */
  ALL_OLD = 'ALL_OLD',

  /**
   * Returns only the updated attributes
   */
  UPDATED_OLD = 'UPDATED_OLD',

  /**
   * Returns all of the attributes of the item
   */
  ALL_NEW = 'ALL_NEW',

  /**
   * Returns only the updated attributes
   */
  UPDATED_NEW = 'UPDATED_NEW'
}

/**
 * Map of string to AttributeValue
 */
export interface DynamoAttributeValueMap {
  [key: string]: DynamoAttributeValue;
}

/**
 * Class to generate AttributeValue
 */
export class DynamoAttributeValue {
  private attributeValue: any = {};

  /**
   * Sets an attribute of type String. For example:  "S": "Hello"
   */
  public withS(value: string) {
    this.attributeValue.S = value;
    return this;
  }

  /**
   * Sets an attribute of type Number. For example:  "N": "123.45"
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public withN(value: string) {
    this.attributeValue.N = value;
    return this;
  }

  /**
   * Sets an attribute of type Binary. For example:  "B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk"
   */
  public withB(value: string) {
    this.attributeValue.B = value;
    return this;
  }

  /**
   * Sets an attribute of type String Set. For example:  "SS": ["Giraffe", "Hippo" ,"Zebra"]
   */
  public withSS(value: string[]) {
    this.attributeValue.SS = value;
    return this;
  }

  /**
   * Sets an attribute of type Number Set. For example:  "NS": ["42.2", "-19", "7.5", "3.14"]
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public withNS(value: string[]) {
    this.attributeValue.NS = value;
    return this;
  }

  /**
   * Sets an attribute of type Binary Set. For example:  "BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="]
   */
  public withBS(value: string[]) {
    this.attributeValue.BS = value;
    return this;
  }

  /**
   * Sets an attribute of type Map. For example:  "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}}
   */
  public withM(value: DynamoAttributeValueMap) {
    this.attributeValue.M = transformAttributeValueMap(value);
    return this;
  }

  /**
   * Sets an attribute of type List. For example:  "L": [ {"S": "Cookies"} , {"S": "Coffee"}, {"N", "3.14159"}]
   */
  public withL(value: DynamoAttributeValue[]) {
    this.attributeValue.L = value.map(val => val.toObject());
    return this;
  }

  /**
   * Sets an attribute of type Null. For example:  "NULL": true
   */
  public withNULL(value: boolean) {
    this.attributeValue.NULL = value;
    return this;
  }

  /**
   * Sets an attribute of type Boolean. For example:  "BOOL": true
   */
  public withBOOL(value: boolean) {
    this.attributeValue.BOOL = value;
    return this;
  }

  /**
   * Return the attributeValue object
   */
  public toObject() {
    return this.attributeValue;
  }
}

/**
 * Property for any key
 */
export interface DynamoAttribute {
  /**
   * The name of the attribute
   */
  readonly name: string;

  /**
   * The value of the attribute
   */
  readonly value: DynamoAttributeValue;
}

/**
 * Class to generate projection expression
 */
export class DynamoProjectionExpression {
  private expression: string[] = [];

  /**
   * Adds the passed attribute to the chain
   *
   * @param attr Attribute name
   */
  public withAttribute(attr: string): DynamoProjectionExpression {
    if (this.expression.length) {
      this.expression.push(`.${attr}`);
    } else {
      this.expression.push(attr);
    }
    return this;
  }

  /**
   * Adds the array literal access for passed index
   *
   * @param index array index
   */
  public atIndex(index: number): DynamoProjectionExpression {
    if (!this.expression.length) {
      throw new Error('Expression must start with an attribute');
    }

    this.expression.push(`[${index}]`);
    return this;
  }

  /**
   * converts and return the string expression
   */
  public toString(): string {
    return this.expression.join('');
  }
}

/**
 * Properties for DynamoGetItem Task
 */
export interface DynamoGetItemProps {
  /**
   * A attribute representing the partition key of the item to retrieve.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#DDB-GetItem-request-Key
   */
  readonly partitionKey: DynamoAttribute;

  /**
   * The name of the table containing the requested item.
   */
  readonly tableName: string;

  /**
   * A attribute representing the sort key of the item to retrieve.
   *
   * @default - No sort key
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#DDB-GetItem-request-Key
   */
  readonly sortKey?: DynamoAttribute;

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
   * @default ReturnConsumedCapacity.NONE
   */
  readonly returnConsumedCapacity?: ReturnConsumedCapacity;
}

/**
 * Properties for DynamoPutItem Task
 */
export interface DynamoPutItemProps {
  /**
   * A map of attribute name/value pairs, one for each attribute.
   * Only the primary key attributes are required;
   * you can optionally provide other attribute name-value pairs for the item.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#DDB-PutItem-request-Item
   */
  readonly item: DynamoAttributeValueMap;

  /**
   * The name of the table where the item should be writen .
   */
  readonly tableName: string;

  /**
   * A condition that must be satisfied in order for a conditional PutItem operation to succeed.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#DDB-PutItem-request-ConditionExpression
   *
   * @default - No condition expression
   */
  readonly conditionExpression?: string;

  /**
   * One or more substitution tokens for attribute names in an expression
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#DDB-PutItem-request-ExpressionAttributeNames
   *
   * @default - No expression attribute names
   */
  readonly expressionAttributeNames?: { [key: string]: string };

  /**
   * One or more values that can be substituted in an expression.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#DDB-PutItem-request-ExpressionAttributeValues
   *
   * @default - No expression attribute values
   */
  readonly expressionAttributeValues?: DynamoAttributeValueMap;

  /**
   * Determines the level of detail about provisioned throughput consumption that is returned in the response
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#DDB-PutItem-request-ReturnConsumedCapacity
   *
   * @default ReturnConsumedCapacity.NONE
   */
  readonly returnConsumedCapacity?: ReturnConsumedCapacity;

  /**
   * The item collection metrics to returned in the response
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LSI.html#LSI.ItemCollections
   *
   * @default ReturnItemCollectionMetrics.NONE
   */
  readonly returnItemCollectionMetrics?: ReturnItemCollectionMetrics;

  /**
   * Use ReturnValues if you want to get the item attributes as they appeared
   * before they were updated with the PutItem request.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#DDB-PutItem-request-ReturnValues
   *
   * @default ReturnValues.NONE
   */
  readonly returnValues?: ReturnValues;
}

/**
 * Properties for DynamoDeleteItem Task
 */
export interface DynamoDeleteItemProps {
  /**
   * An attribute representing the partition key of the item to delete.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-Key
   */
  readonly partitionKey: DynamoAttribute;

  /**
   * The name of the table containing the requested item.
   */
  readonly tableName: string;

  /**
   * An attribute representing the sort key of the item to delete.
   *
   * @default - No sort key
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-Key
   */
  readonly sortKey?: DynamoAttribute;

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
  readonly expressionAttributeValues?: DynamoAttributeValueMap;

  /**
   * Determines the level of detail about provisioned throughput consumption that is returned in the response
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ReturnConsumedCapacity
   *
   * @default ReturnConsumedCapacity.NONE
   */
  readonly returnConsumedCapacity?: ReturnConsumedCapacity;

  /**
   * Determines whether item collection metrics are returned.
   * If set to SIZE, the response includes statistics about item collections, if any,
   * that were modified during the operation are returned in the response.
   * If set to NONE (the default), no statistics are returned.
   *
   * @default ReturnItemCollectionMetrics.NONE
   */
  readonly returnItemCollectionMetrics?: ReturnItemCollectionMetrics;

  /**
   * Use ReturnValues if you want to get the item attributes as they appeared before they were deleted.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ReturnValues
   *
   * @default ReturnValues.NONE
   */
  readonly returnValues?: ReturnValues;
}

/**
 * Properties for DynamoUpdateItem Task
 */
export interface DynamoUpdateItemProps {
  /**
   * The partition key of the item to be updated.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-Key
   */
  readonly partitionKey: DynamoAttribute;

  /**
   * The name of the table containing the requested item.
   */
  readonly tableName: string;

  /**
   * The sort key of the item to be updated.
   *
   * @default - No sort key
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-Key
   */
  readonly sortKey?: DynamoAttribute;

  /**
   * A condition that must be satisfied in order for a conditional DeleteItem to succeed.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-ConditionExpression
   *
   * @default - No condition expression
   */
  readonly conditionExpression?: string;

  /**
   * One or more substitution tokens for attribute names in an expression
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-ExpressionAttributeNames
   *
   * @default - No expression attribute names
   */
  readonly expressionAttributeNames?: { [key: string]: string };

  /**
   * One or more values that can be substituted in an expression.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-ExpressionAttributeValues
   *
   * @default - No expression attribute values
   */
  readonly expressionAttributeValues?: DynamoAttributeValueMap;

  /**
   * Determines the level of detail about provisioned throughput consumption that is returned in the response
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-ReturnConsumedCapacity
   *
   * @default ReturnConsumedCapacity.NONE
   */
  readonly returnConsumedCapacity?: ReturnConsumedCapacity;

  /**
   * Determines whether item collection metrics are returned.
   * If set to SIZE, the response includes statistics about item collections, if any,
   * that were modified during the operation are returned in the response.
   * If set to NONE (the default), no statistics are returned.
   *
   * @default ReturnItemCollectionMetrics.NONE
   */
  readonly returnItemCollectionMetrics?: ReturnItemCollectionMetrics;

  /**
   * Use ReturnValues if you want to get the item attributes as they appeared before they were deleted.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-ReturnValues
   *
   * @default ReturnValues.NONE
   */
  readonly returnValues?: ReturnValues;

  /**
   * An expression that defines one or more attributes to be updated,
   * the action to be performed on them, and new values for them.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-UpdateExpression
   *
   * @default - No update expression
   */
  readonly updateExpression?: string;
}

/**
 * A StepFunctions task to call DynamoGetItem
 */
export class DynamoGetItem implements sfn.IStepFunctionsTask {
  constructor(private readonly props: DynamoGetItemProps) {
    validateTableName(props.tableName);
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getDynamoResourceArn(DynamoMethod.GET),
      policyStatements: getDynamoPolicyStatements(
        _task,
        this.props.tableName,
        DynamoMethod.GET
      ),
      parameters: {
        Key: configurePrimaryKey(this.props.partitionKey, this.props.sortKey),
        TableName: this.props.tableName,
        ConsistentRead: this.props.consistentRead ?? false,
        ExpressionAttributeNames: this.props.expressionAttributeNames,
        ProjectionExpression: this.configureProjectionExpression(
          this.props.projectionExpression
        ),
        ReturnConsumedCapacity: this.props.returnConsumedCapacity
      }
    };
  }

  private configureProjectionExpression(
    expressions?: DynamoProjectionExpression[]
  ): string | undefined {
    return expressions
      ? expressions.map(expression => expression.toString()).join(',')
      : undefined;
  }
}

/**
 * A StepFunctions task to call DynamoPutItem
 */
export class DynamoPutItem implements sfn.IStepFunctionsTask {
  constructor(private readonly props: DynamoPutItemProps) {
    validateTableName(props.tableName);
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getDynamoResourceArn(DynamoMethod.PUT),
      policyStatements: getDynamoPolicyStatements(
        _task,
        this.props.tableName,
        DynamoMethod.PUT
      ),
      parameters: {
        Item: transformAttributeValueMap(this.props.item),
        TableName: this.props.tableName,
        ConditionExpression: this.props.conditionExpression,
        ExpressionAttributeNames: this.props.expressionAttributeNames,
        ExpressionAttributeValues: transformAttributeValueMap(
          this.props.expressionAttributeValues
        ),
        ReturnConsumedCapacity: this.props.returnConsumedCapacity,
        ReturnItemCollectionMetrics: this.props.returnItemCollectionMetrics,
        ReturnValues: this.props.returnValues
      }
    };
  }
}

/**
 * A StepFunctions task to call DynamoDeleteItem
 */
export class DynamoDeleteItem implements sfn.IStepFunctionsTask {
  constructor(private readonly props: DynamoDeleteItemProps) {
    validateTableName(props.tableName);
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getDynamoResourceArn(DynamoMethod.DELETE),
      policyStatements: getDynamoPolicyStatements(
        _task,
        this.props.tableName,
        DynamoMethod.DELETE
      ),
      parameters: {
        Key: configurePrimaryKey(this.props.partitionKey, this.props.sortKey),
        TableName: this.props.tableName,
        ConditionExpression: this.props.conditionExpression,
        ExpressionAttributeNames: this.props.expressionAttributeNames,
        ExpressionAttributeValues: transformAttributeValueMap(
          this.props.expressionAttributeValues
        ),
        ReturnConsumedCapacity: this.props.returnConsumedCapacity,
        ReturnItemCollectionMetrics: this.props.returnItemCollectionMetrics,
        ReturnValues: this.props.returnValues
      }
    };
  }
}

/**
 * A StepFunctions task to call DynamoUpdateItem
 */
export class DynamoUpdateItem implements sfn.IStepFunctionsTask {
  constructor(private readonly props: DynamoUpdateItemProps) {
    validateTableName(props.tableName);
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getDynamoResourceArn(DynamoMethod.UPDATE),
      policyStatements: getDynamoPolicyStatements(
        _task,
        this.props.tableName,
        DynamoMethod.UPDATE
      ),
      parameters: {
        Key: configurePrimaryKey(this.props.partitionKey, this.props.sortKey),
        TableName: this.props.tableName,
        ConditionExpression: this.props.conditionExpression,
        ExpressionAttributeNames: this.props.expressionAttributeNames,
        ExpressionAttributeValues: transformAttributeValueMap(
          this.props.expressionAttributeValues
        ),
        ReturnConsumedCapacity: this.props.returnConsumedCapacity,
        ReturnItemCollectionMetrics: this.props.returnItemCollectionMetrics,
        ReturnValues: this.props.returnValues,
        UpdateExpression: this.props.updateExpression
      }
    };
  }
}

/**
 * A helper wrapper class to call all DynamoDB APIs
 */
export class CallDynamoDB {
  /**
   * Method to get DynamoGetItem task
   *
   * @param props DynamoGetItemProps
   */
  public static getItem(props: DynamoGetItemProps) {
    return new DynamoGetItem(props);
  }

  /**
   * Method to get DynamoPutItem task
   *
   * @param props DynamoPutItemProps
   */
  public static putItem(props: DynamoPutItemProps) {
    return new DynamoPutItem(props);
  }

  /**
   * Method to get DynamoDeleteItem task
   *
   * @param props DynamoDeleteItemProps
   */
  public static deleteItem(props: DynamoDeleteItemProps) {
    return new DynamoDeleteItem(props);
  }

  /**
   * Method to get DynamoUpdateItem task
   *
   * @param props DynamoUpdateItemProps
   */
  public static updateItem(props: DynamoUpdateItemProps) {
    return new DynamoUpdateItem(props);
  }
}

enum DynamoMethod {
  GET = 'Get',
  PUT = 'Put',
  DELETE = 'Delete',
  UPDATE = 'Update'
}

function validateTableName(tableName: string) {
  if (
    tableName.length < 3 ||
    tableName.length > 255 ||
    !new RegExp(/[a-zA-Z0-9_.-]+$/).test(tableName)
  ) {
    throw new Error(
      'TableName should not contain alphanumeric characters and should be between 3-255 characters long.'
    );
  }
}

function getDynamoResourceArn(method: DynamoMethod) {
  return getResourceArn(
    'dynamodb',
    `${method.toLowerCase()}Item`,
    sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
  );
}

function getDynamoPolicyStatements(
  task: sfn.Task,
  tableName: string,
  method: DynamoMethod
) {
  return [
    new iam.PolicyStatement({
      resources: [
        Stack.of(task).formatArn({
          service: 'dynamodb',
          resource: 'table',
          resourceName: tableName
        })
      ],
      actions: [`dynamodb:${method}Item`]
    })
  ];
}

function configurePrimaryKey(
  partitionKey: DynamoAttribute,
  sortKey?: DynamoAttribute
) {
  const key = {
    [partitionKey.name]: partitionKey.value.toObject()
  };

  if (sortKey) {
    key[sortKey.name] = sortKey.value.toObject();
  }

  return key;
}

function transformAttributeValueMap(attrMap?: DynamoAttributeValueMap) {
  const transformedValue: any = {};
  for (const key in attrMap) {
    if (key) {
      transformedValue[key] = attrMap[key].toObject();
    }
  }
  return attrMap ? transformedValue : undefined;
}
