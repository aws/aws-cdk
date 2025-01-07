import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { IResource } from '../../core';

/**
 * Supported DynamoDB table operations.
 */
export enum Operation {

  /** GetItem */
  GET_ITEM = 'GetItem',

  /** BatchGetItem */
  BATCH_GET_ITEM = 'BatchGetItem',

  /** Scan */
  SCAN = 'Scan',

  /** Query */
  QUERY = 'Query',

  /** GetRecords */
  GET_RECORDS = 'GetRecords',

  /** PutItem */
  PUT_ITEM = 'PutItem',

  /** DeleteItem */
  DELETE_ITEM = 'DeleteItem',

  /** UpdateItem */
  UPDATE_ITEM = 'UpdateItem',

  /** BatchWriteItem */
  BATCH_WRITE_ITEM = 'BatchWriteItem',

  /** TransactWriteItems */
  TRANSACT_WRITE_ITEMS = 'TransactWriteItems',

  /** TransactGetItems */
  TRANSACT_GET_ITEMS = 'TransactGetItems',

  /** ExecuteTransaction */
  EXECUTE_TRANSACTION = 'ExecuteTransaction',

  /** BatchExecuteStatement */
  BATCH_EXECUTE_STATEMENT = 'BatchExecuteStatement',

  /** ExecuteStatement */
  EXECUTE_STATEMENT = 'ExecuteStatement',
}

/**
 * Options for configuring a system errors metric that considers multiple operations.
 */
export interface SystemErrorsForOperationsMetricOptions extends cloudwatch.MetricOptions {

  /**
   * The operations to apply the metric to.
   *
   * @default - All operations available by DynamoDB tables will be considered.
   */
  readonly operations?: Operation[];
}

/**
 * Options for configuring metrics that considers multiple operations.
 */
export interface OperationsMetricOptions extends SystemErrorsForOperationsMetricOptions {}

/**
 * Represents an attribute for describing the key schema for the table
 * and indexes.
 */
export interface Attribute {
  /**
   * The name of an attribute.
   */
  readonly name: string;

  /**
   * The data type of an attribute.
   */
  readonly type: AttributeType;
}

/**
 * Reference to WarmThroughput for a DynamoDB table
 */
export interface WarmThroughput {
  /**
   * Configures the number of read units per second a table will be able to handle instantly
   * @default - no readUnitsPerSecond configured
  */
  readonly readUnitsPerSecond?: number;
  /**
   * Configures the number of write units per second a table will be able to handle instantly
   * @default - no writeUnitsPerSecond configured
  */
  readonly writeUnitsPerSecond?: number;
}

/**
 * Data types for attributes within a table
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes
 */
export enum AttributeType {
  /**
   * Up to 400KiB of binary data (which must be encoded as base64 before sending to DynamoDB)
   */
  BINARY = 'B',

  /**
   * Numeric values made of up to 38 digits (positive, negative or zero)
   */
  NUMBER = 'N',

  /**
   * Up to 400KiB of UTF-8 encoded text
   */
  STRING = 'S',
}

/**
 * DynamoDB's Read/Write capacity modes.
 */
export enum BillingMode {
  /**
   * Pay only for what you use. You don't configure Read/Write capacity units.
   */
  PAY_PER_REQUEST = 'PAY_PER_REQUEST',

  /**
   * Explicitly specified Read/Write capacity units.
   */
  PROVISIONED = 'PROVISIONED',
}

/**
 * The set of attributes that are projected into the index
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Projection.html
 */
export enum ProjectionType {
  /**
   * Only the index and primary keys are projected into the index.
   */
  KEYS_ONLY = 'KEYS_ONLY',

  /**
   * Only the specified table attributes are projected into the index. The list
   * of projected attributes is in `nonKeyAttributes`.
   */
  INCLUDE = 'INCLUDE',

  /**
   * All of the table attributes are projected into the index.
   */
  ALL = 'ALL',
}

/**
 * DynamoDB's table class.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.TableClasses.html
 */
export enum TableClass {
  /**
   * Default table class for DynamoDB.
   */
  STANDARD = 'STANDARD',

  /**
   * Table class for DynamoDB that reduces storage costs compared to existing DynamoDB
   * standard tables.
   */
  STANDARD_INFREQUENT_ACCESS = 'STANDARD_INFREQUENT_ACCESS',
}

/**
 * What kind of server-side encryption to apply to this table.
 */
export enum TableEncryption {
  /**
   * Server-side KMS encryption with a master key owned by AWS.
   */
  DEFAULT = 'AWS_OWNED',

  /**
   * Server-side KMS encryption with a customer master key managed by customer.
   * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
   *
   * > **NOTE**: if `encryptionKey` is not specified and the `Table` construct creates
   * > a KMS key for you, the key will be created with default permissions. If you are using
   * > CDKv2, these permissions will be sufficient to enable the key for use with DynamoDB tables.
   * > If you are using CDKv1, make sure the feature flag `@aws-cdk/aws-kms:defaultKeyPolicies`
   * > is set to `true` in your `cdk.json`.
   */
  CUSTOMER_MANAGED = 'CUSTOMER_MANAGED',

  /**
   * Server-side KMS encryption with a master key managed by AWS.
   */
  AWS_MANAGED = 'AWS_MANAGED',
}

/**
 * When an item in the table is modified, StreamViewType determines what information
 * is written to the stream for this table.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_StreamSpecification.html
 */
export enum StreamViewType {
  /**
   * The entire item, as it appears after it was modified, is written to the stream.
   */
  NEW_IMAGE = 'NEW_IMAGE',

  /**
   * The entire item, as it appeared before it was modified, is written to the stream.
   */
  OLD_IMAGE = 'OLD_IMAGE',

  /**
   * Both the new and the old item images of the item are written to the stream.
   */
  NEW_AND_OLD_IMAGES = 'NEW_AND_OLD_IMAGES',

  /**
   * Only the key attributes of the modified item are written to the stream.
   */
  KEYS_ONLY = 'KEYS_ONLY',
}

/**
 * Properties for a secondary index
 */
export interface SecondaryIndexProps {
  /**
   * The name of the secondary index.
   */
  readonly indexName: string;

  /**
   * The set of attributes that are projected into the secondary index.
   * @default ALL
   */
  readonly projectionType?: ProjectionType;

  /**
   * The non-key attributes that are projected into the secondary index.
   * @default - No additional attributes
   */
  readonly nonKeyAttributes?: string[];
}

/**
 * Properties for a local secondary index
 */
export interface LocalSecondaryIndexProps extends SecondaryIndexProps {
  /**
   * The attribute of a sort key for the local secondary index.
   */
  readonly sortKey: Attribute;
}

/**
 * An interface that represents a DynamoDB Table - either created with the CDK, or an existing one.
 */
export interface ITable extends IResource {
  /**
   * Arn of the dynamodb table.
   *
   * @attribute
   */
  readonly tableArn: string;

  /**
   * Table name of the dynamodb table.
   *
   * @attribute
   */
  readonly tableName: string;

  /**
   * ARN of the table's stream, if there is one.
   *
   * @attribute
   */
  readonly tableStreamArn?: string;

  /**
   *
   * Optional KMS encryption key associated with this table.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Adds an IAM policy statement associated with this table to an IAM
   * principal's policy.
   *
   * If `encryptionKey` is present, appropriate grants to the key needs to be added
   * separately using the `table.encryptionKey.grant*` methods.
   *
   * @param grantee The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:PutItem", "dynamodb:GetItem", ...)
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Adds an IAM policy statement associated with this table's stream to an
   * IAM principal's policy.
   *
   * If `encryptionKey` is present, appropriate grants to the key needs to be added
   * separately using the `table.encryptionKey.grant*` methods.
   *
   * @param grantee The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:DescribeStream", "dynamodb:GetRecords", ...)
   */
  grantStream(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Permits an IAM principal all data read operations from this table:
   * BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan.
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  grantReadData(grantee: iam.IGrantable): iam.Grant;

  /**
   * Permits an IAM Principal to list streams attached to current dynamodb table.
   *
   * @param grantee The principal (no-op if undefined)
   */
  grantTableListStreams(grantee: iam.IGrantable): iam.Grant;

  /**
   * Permits an IAM principal all stream data read operations for this
   * table's stream:
   * DescribeStream, GetRecords, GetShardIterator, ListStreams.
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  grantStreamRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Permits an IAM principal all data write operations to this table:
   * BatchWriteItem, PutItem, UpdateItem, DeleteItem.
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  grantWriteData(grantee: iam.IGrantable): iam.Grant;

  /**
   * Permits an IAM principal to all data read/write operations to this table.
   * BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan,
   * BatchWriteItem, PutItem, UpdateItem, DeleteItem
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  grantReadWriteData(grantee: iam.IGrantable): iam.Grant;

  /**
   * Permits all DynamoDB operations ("dynamodb:*") to an IAM principal.
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  grantFullAccess(grantee: iam.IGrantable): iam.Grant;

  /**
   * Metric for the number of Errors executing all Lambdas
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the consumed read capacity units
   *
   * @param props properties of a metric
   */
  metricConsumedReadCapacityUnits(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the consumed write capacity units
   *
   * @param props properties of a metric
   */
  metricConsumedWriteCapacityUnits(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the system errors
   *
   * @param props properties of a metric
   *
   * @deprecated use `metricSystemErrorsForOperations`
   */
  metricSystemErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the system errors this table
   *
   * @param props properties of a metric
   *
   */
  metricSystemErrorsForOperations(props?: SystemErrorsForOperationsMetricOptions): cloudwatch.IMetric;

  /**
   * Metric for the user errors
   *
   * @param props properties of a metric
   */
  metricUserErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the conditional check failed requests
   *
   * @param props properties of a metric
   */
  metricConditionalCheckFailedRequests(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for throttled requests
   *
   * @param props properties of a metric
   *
   * @deprecated use `metricThrottledRequestsForOperations`
   */
  metricThrottledRequests(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for throttled requests
   *
   * @param props properties of a metric
   *
   */
  metricThrottledRequestsForOperations(props?: OperationsMetricOptions): cloudwatch.IMetric;

  /**
   * Metric for the successful request latency
   *
   * @param props properties of a metric
   *
   */
  metricSuccessfulRequestLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
