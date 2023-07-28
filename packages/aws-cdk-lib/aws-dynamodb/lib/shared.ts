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
 * Represents the table schema attributes.
 */
export interface SchemaOptions {
  /**
   * Partition key attribute definition.
   */
  readonly partitionKey: Attribute;

  /**
   * Sort key attribute definition.
   *
   * @default no sort key
   */
  readonly sortKey?: Attribute;
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
  ALL = 'ALL'
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
