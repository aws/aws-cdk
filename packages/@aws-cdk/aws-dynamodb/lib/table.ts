import appscaling = require('@aws-cdk/aws-applicationautoscaling');
import iam = require('@aws-cdk/aws-iam');
import { Aws, Construct, Lazy, RemovalPolicy, Resource, Stack } from '@aws-cdk/core';
import { CfnTable } from './dynamodb.generated';
import { EnableScalingProps, IScalableTableAttribute } from './scalable-attribute-api';
import { ScalableTableAttribute } from './scalable-table-attribute';

const HASH_KEY_TYPE = 'HASH';
const RANGE_KEY_TYPE = 'RANGE';

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
const MAX_LOCAL_SECONDARY_INDEX_COUNT = 5;

const READ_DATA_ACTIONS = [
  'dynamodb:BatchGetItem',
  'dynamodb:GetRecords',
  'dynamodb:GetShardIterator',
  'dynamodb:Query',
  'dynamodb:GetItem',
  'dynamodb:Scan'
];

const READ_STREAM_DATA_ACTIONS = [
  "dynamodb:DescribeStream",
  "dynamodb:GetRecords",
  "dynamodb:GetShardIterator",
];

const WRITE_DATA_ACTIONS = [
  'dynamodb:BatchWriteItem',
  'dynamodb:PutItem',
  'dynamodb:UpdateItem',
  'dynamodb:DeleteItem'
];

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

export interface TableOptions {
  /**
   * Partition key attribute definition.
   */
  readonly partitionKey: Attribute;

  /**
   * Table sort key attribute definition.
   *
   * @default no sort key
   */
  readonly sortKey?: Attribute;

  /**
   * The read capacity for the table. Careful if you add Global Secondary Indexes, as
   * those will share the table's provisioned throughput.
   *
   * Can only be provided if billingMode is Provisioned.
   *
   * @default 5
   */
  readonly readCapacity?: number;
  /**
   * The write capacity for the table. Careful if you add Global Secondary Indexes, as
   * those will share the table's provisioned throughput.
   *
   * Can only be provided if billingMode is Provisioned.
   *
   * @default 5
   */
  readonly writeCapacity?: number;

  /**
   * Specify how you are charged for read and write throughput and how you manage capacity.
   * @default Provisioned
   */
  readonly billingMode?: BillingMode;

  /**
   * Whether point-in-time recovery is enabled.
   * @default - point-in-time recovery is disabled
   */
  readonly pointInTimeRecovery?: boolean;

  /**
   * Whether server-side encryption with an AWS managed customer master key is enabled.
   * @default - server-side encryption is enabled with an AWS owned customer master key
   */
  readonly serverSideEncryption?: boolean;

  /**
   * The name of TTL attribute.
   * @default - TTL is disabled
   */
  readonly timeToLiveAttribute?: string;

  /**
   * When an item in the table is modified, StreamViewType determines what information
   * is written to the stream for this table.
   *
   * @default - streams are disabled
   */
  readonly stream?: StreamViewType;

  /**
   * The removal policy to apply to the DynamoDB Table.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

export interface TableProps extends TableOptions {
  /**
   * Enforces a particular physical table name.
   * @default <generated>
   */
  readonly tableName?: string;
}

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

export interface GlobalSecondaryIndexProps extends SecondaryIndexProps {
  /**
   * The attribute of a partition key for the global secondary index.
   */
  readonly partitionKey: Attribute;

  /**
   * The attribute of a sort key for the global secondary index.
   * @default - No sort key
   */
  readonly sortKey?: Attribute;

  /**
   * The read capacity for the global secondary index.
   *
   * Can only be provided if table billingMode is Provisioned or undefined.
   *
   * @default 5
   */
  readonly readCapacity?: number;

  /**
   * The write capacity for the global secondary index.
   *
   * Can only be provided if table billingMode is Provisioned or undefined.
   *
   * @default 5
   */
  readonly writeCapacity?: number;
}

export interface LocalSecondaryIndexProps extends SecondaryIndexProps {
  /**
   * The attribute of a sort key for the local secondary index.
   */
  readonly sortKey: Attribute;
}

/**
 * Provides a DynamoDB table.
 */
export class Table extends Resource {
  /**
   * Permits an IAM Principal to list all DynamoDB Streams.
   * @param grantee The principal (no-op if undefined)
   */
  public static grantListStreams(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['dynamodb:ListStreams'],
      resourceArns: ['*'],
    });
 }

 /**
  * @attribute
  */
  public readonly tableArn: string;

  /**
   * @attribute
   */
  public readonly tableName: string;

  /**
   * @attribute
   */
  public readonly tableStreamArn: string | undefined;

  private readonly table: CfnTable;

  private readonly keySchema = new Array<CfnTable.KeySchemaProperty>();
  private readonly attributeDefinitions = new Array<CfnTable.AttributeDefinitionProperty>();
  private readonly globalSecondaryIndexes = new Array<CfnTable.GlobalSecondaryIndexProperty>();
  private readonly localSecondaryIndexes = new Array<CfnTable.LocalSecondaryIndexProperty>();

  private readonly secondaryIndexNames: string[] = [];
  private readonly nonKeyAttributes: string[] = [];

  private readonly tablePartitionKey: Attribute;
  private readonly tableSortKey?: Attribute;

  private readonly billingMode: BillingMode;
  private readonly tableScaling: ScalableAttributePair = {};
  private readonly indexScaling = new Map<string, ScalableAttributePair>();
  private readonly scalingRole: iam.IRole;

  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id, {
      physicalName: props.tableName,
    });

    this.billingMode = props.billingMode || BillingMode.PROVISIONED;
    this.validateProvisioning(props);

    this.table = new CfnTable(this, 'Resource', {
      tableName: this.physicalName,
      keySchema: this.keySchema,
      attributeDefinitions: this.attributeDefinitions,
      globalSecondaryIndexes: Lazy.anyValue({ produce: () => this.globalSecondaryIndexes }, { omitEmptyArray: true }),
      localSecondaryIndexes: Lazy.anyValue({ produce: () => this.localSecondaryIndexes }, { omitEmptyArray: true }),
      pointInTimeRecoverySpecification: props.pointInTimeRecovery ? { pointInTimeRecoveryEnabled: props.pointInTimeRecovery } : undefined,
      billingMode: this.billingMode === BillingMode.PAY_PER_REQUEST ? this.billingMode : undefined,
      provisionedThroughput: props.billingMode === BillingMode.PAY_PER_REQUEST ? undefined : {
        readCapacityUnits: props.readCapacity || 5,
        writeCapacityUnits: props.writeCapacity || 5
      },
      sseSpecification: props.serverSideEncryption ? { sseEnabled: props.serverSideEncryption } : undefined,
      streamSpecification: props.stream ? { streamViewType: props.stream } : undefined,
      timeToLiveSpecification: props.timeToLiveAttribute ? { attributeName: props.timeToLiveAttribute, enabled: true } : undefined
    });
    this.table.applyRemovalPolicy(props.removalPolicy);

    if (props.tableName) { this.node.addMetadata('aws:cdk:hasPhysicalName', props.tableName); }

    this.tableArn = this.getResourceArnAttribute(this.table.attrArn, {
      service: 'dynamodb',
      resource: 'table',
      resourceName: this.physicalName,
    });
    this.tableName = this.getResourceNameAttribute(this.table.ref);

    this.tableStreamArn = props.stream ? this.table.attrStreamArn : undefined;

    this.scalingRole = this.makeScalingRole();

    this.addKey(props.partitionKey, HASH_KEY_TYPE);
    this.tablePartitionKey = props.partitionKey;

    if (props.sortKey) {
      this.addKey(props.sortKey, RANGE_KEY_TYPE);
      this.tableSortKey = props.sortKey;
    }
  }

  /**
   * Add a global secondary index of table.
   *
   * @param props the property of global secondary index
   */
  public addGlobalSecondaryIndex(props: GlobalSecondaryIndexProps) {
    this.validateProvisioning(props);
    this.validateIndexName(props.indexName);

    // build key schema and projection for index
    const gsiKeySchema = this.buildIndexKeySchema(props.partitionKey, props.sortKey);
    const gsiProjection = this.buildIndexProjection(props);

    this.secondaryIndexNames.push(props.indexName);
    this.globalSecondaryIndexes.push({
      indexName: props.indexName,
      keySchema: gsiKeySchema,
      projection: gsiProjection,
      provisionedThroughput: this.billingMode === BillingMode.PAY_PER_REQUEST ? undefined : {
        readCapacityUnits: props.readCapacity || 5,
        writeCapacityUnits: props.writeCapacity || 5
      }
    });

    this.indexScaling.set(props.indexName, {});
  }

  /**
   * Add a local secondary index of table.
   *
   * @param props the property of local secondary index
   */
  public addLocalSecondaryIndex(props: LocalSecondaryIndexProps) {
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
    if (this.localSecondaryIndexes.length >= MAX_LOCAL_SECONDARY_INDEX_COUNT) {
      throw new RangeError(`a maximum number of local secondary index per table is ${MAX_LOCAL_SECONDARY_INDEX_COUNT}`);
    }

    this.validateIndexName(props.indexName);

    // build key schema and projection for index
    const lsiKeySchema = this.buildIndexKeySchema(this.tablePartitionKey, props.sortKey);
    const lsiProjection = this.buildIndexProjection(props);

    this.secondaryIndexNames.push(props.indexName);
    this.localSecondaryIndexes.push({
      indexName: props.indexName,
      keySchema: lsiKeySchema,
      projection: lsiProjection
    });
  }

  /**
   * Enable read capacity scaling for this table
   *
   * @returns An object to configure additional AutoScaling settings
   */
  public autoScaleReadCapacity(props: EnableScalingProps): IScalableTableAttribute {
    if (this.tableScaling.scalableReadAttribute) {
      throw new Error('Read AutoScaling already enabled for this table');
    }
    if (this.billingMode === BillingMode.PAY_PER_REQUEST) {
      throw new Error('AutoScaling is not available for tables with PAY_PER_REQUEST billing mode');
    }

    return this.tableScaling.scalableReadAttribute = new ScalableTableAttribute(this, 'ReadScaling', {
      serviceNamespace: appscaling.ServiceNamespace.DYNAMODB,
      resourceId: `table/${this.tableName}`,
      dimension: 'dynamodb:table:ReadCapacityUnits',
      role: this.scalingRole,
      ...props
    });
  }

  /**
   * Enable write capacity scaling for this table
   *
   * @returns An object to configure additional AutoScaling settings for this attribute
   */
  public autoScaleWriteCapacity(props: EnableScalingProps): IScalableTableAttribute {
    if (this.tableScaling.scalableWriteAttribute) {
      throw new Error('Write AutoScaling already enabled for this table');
    }
    if (this.billingMode === BillingMode.PAY_PER_REQUEST) {
      throw new Error('AutoScaling is not available for tables with PAY_PER_REQUEST billing mode');
    }

    return this.tableScaling.scalableWriteAttribute = new ScalableTableAttribute(this, 'WriteScaling', {
      serviceNamespace: appscaling.ServiceNamespace.DYNAMODB,
      resourceId: `table/${this.tableName}`,
      dimension: 'dynamodb:table:WriteCapacityUnits',
      role: this.scalingRole,
      ...props,
    });
  }

  /**
   * Enable read capacity scaling for the given GSI
   *
   * @returns An object to configure additional AutoScaling settings for this attribute
   */
  public autoScaleGlobalSecondaryIndexReadCapacity(indexName: string, props: EnableScalingProps): IScalableTableAttribute {
    if (this.billingMode === BillingMode.PAY_PER_REQUEST) {
      throw new Error('AutoScaling is not available for tables with PAY_PER_REQUEST billing mode');
    }
    const attributePair = this.indexScaling.get(indexName);
    if (!attributePair) {
      throw new Error(`No global secondary index with name ${indexName}`);
    }
    if (attributePair.scalableReadAttribute) {
      throw new Error('Read AutoScaling already enabled for this index');
    }

    return attributePair.scalableReadAttribute = new ScalableTableAttribute(this, `${indexName}ReadScaling`, {
      serviceNamespace: appscaling.ServiceNamespace.DYNAMODB,
      resourceId: `table/${this.tableName}/index/${indexName}`,
      dimension: 'dynamodb:index:ReadCapacityUnits',
      role: this.scalingRole,
      ...props
    });
  }

  /**
   * Enable write capacity scaling for the given GSI
   *
   * @returns An object to configure additional AutoScaling settings for this attribute
   */
  public autoScaleGlobalSecondaryIndexWriteCapacity(indexName: string, props: EnableScalingProps): IScalableTableAttribute {
    if (this.billingMode === BillingMode.PAY_PER_REQUEST) {
      throw new Error('AutoScaling is not available for tables with PAY_PER_REQUEST billing mode');
    }
    const attributePair = this.indexScaling.get(indexName);
    if (!attributePair) {
      throw new Error(`No global secondary index with name ${indexName}`);
    }
    if (attributePair.scalableWriteAttribute) {
      throw new Error('Write AutoScaling already enabled for this index');
    }

    return attributePair.scalableWriteAttribute = new ScalableTableAttribute(this, `${indexName}WriteScaling`, {
      serviceNamespace: appscaling.ServiceNamespace.DYNAMODB,
      resourceId: `table/${this.tableName}/index/${indexName}`,
      dimension: 'dynamodb:index:WriteCapacityUnits',
      role: this.scalingRole,
      ...props
    });
  }

  /**
   * Adds an IAM policy statement associated with this table to an IAM
   * principal's policy.
   * @param grantee The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:PutItem", "dynamodb:GetItem", ...)
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [
        this.tableArn,
        Lazy.stringValue({ produce: () => this.hasIndex ? `${this.tableArn}/index/*` : Aws.NO_VALUE })
      ],
      scope: this,
    });
  }

  /**
   * Adds an IAM policy statement associated with this table's stream to an
   * IAM principal's policy.
   * @param grantee The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:DescribeStream", "dynamodb:GetRecords", ...)
   */
  public grantStream(grantee: iam.IGrantable, ...actions: string[]) {
    if (!this.tableStreamArn) {
      throw new Error(`DynamoDB Streams must be enabled on the table ${this.node.path}`);
    }

    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.tableStreamArn],
      scope: this,
    });
  }

  /**
   * Permits an IAM principal all data read operations from this table:
   * BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan.
   * @param grantee The principal to grant access to
   */
  public grantReadData(grantee: iam.IGrantable) {
    return this.grant(grantee, ...READ_DATA_ACTIONS);
  }

  /**
   * Permis an IAM principal all stream data read operations for this
   * table's stream:
   * DescribeStream, GetRecords, GetShardIterator, ListStreams.
   * @param grantee The principal to grant access to
   */
  public grantStreamRead(grantee: iam.IGrantable) {
    return this.grantStream(grantee, ...READ_STREAM_DATA_ACTIONS);
  }

  /**
   * Permits an IAM principal all data write operations to this table:
   * BatchWriteItem, PutItem, UpdateItem, DeleteItem.
   * @param grantee The principal to grant access to
   */
  public grantWriteData(grantee: iam.IGrantable) {
    return this.grant(grantee, ...WRITE_DATA_ACTIONS);
  }

  /**
   * Permits an IAM principal to all data read/write operations to this table.
   * BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan,
   * BatchWriteItem, PutItem, UpdateItem, DeleteItem
   * @param grantee The principal to grant access to
   */
  public grantReadWriteData(grantee: iam.IGrantable) {
    return this.grant(grantee, ...READ_DATA_ACTIONS, ...WRITE_DATA_ACTIONS);
  }

  /**
   * Permits all DynamoDB operations ("dynamodb:*") to an IAM principal.
   * @param grantee The principal to grant access to
   */
  public grantFullAccess(grantee: iam.IGrantable) {
    return this.grant(grantee, 'dynamodb:*');
  }

  /**
   * Validate the table construct.
   *
   * @returns an array of validation error message
   */
  protected validate(): string[] {
    const errors = new Array<string>();

    if (!this.tablePartitionKey) {
      errors.push('a partition key must be specified');
    }
    if (this.localSecondaryIndexes.length > 0 && !this.tableSortKey) {
      errors.push('a sort key of the table must be specified to add local secondary indexes');
    }

    return errors;
  }

  /**
   * Validate read and write capacity are not specified for on-demand tables (billing mode PAY_PER_REQUEST).
   *
   * @param props read and write capacity properties
   */
  private validateProvisioning(props: { readCapacity?: number, writeCapacity?: number}): void {
    if (this.billingMode === BillingMode.PAY_PER_REQUEST) {
      if (props.readCapacity !== undefined || props.writeCapacity !== undefined) {
        throw new Error('you cannot provision read and write capacity for a table with PAY_PER_REQUEST billing mode');
      }
    }
  }

  /**
   * Validate index name to check if a duplicate name already exists.
   *
   * @param indexName a name of global or local secondary index
   */
  private validateIndexName(indexName: string) {
    if (this.secondaryIndexNames.includes(indexName)) {
      // a duplicate index name causes validation exception, status code 400, while trying to create CFN stack
      throw new Error(`a duplicate index name, ${indexName}, is not allowed`);
    }
    this.secondaryIndexNames.push(indexName);
  }

  /**
   * Validate non-key attributes by checking limits within secondary index, which may vary in future.
   *
   * @param nonKeyAttributes a list of non-key attribute names
   */
  private validateNonKeyAttributes(nonKeyAttributes: string[]) {
    if (this.nonKeyAttributes.length + nonKeyAttributes.length > 20) {
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
      throw new RangeError('a maximum number of nonKeyAttributes across all of secondary indexes is 20');
    }

    // store all non-key attributes
    this.nonKeyAttributes.push(...nonKeyAttributes);

    // throw error if key attribute is part of non-key attributes
    this.attributeDefinitions.forEach(keyAttribute => {
      if (typeof keyAttribute.attributeName === 'string' && this.nonKeyAttributes.includes(keyAttribute.attributeName)) {
        throw new Error(`a key attribute, ${keyAttribute.attributeName}, is part of a list of non-key attributes, ${this.nonKeyAttributes}` +
          ', which is not allowed since all key attributes are added automatically and this configuration causes stack creation failure');
      }
    });
  }

  private buildIndexKeySchema(partitionKey: Attribute, sortKey?: Attribute): CfnTable.KeySchemaProperty[] {
    this.registerAttribute(partitionKey);
    const indexKeySchema: CfnTable.KeySchemaProperty[] = [
      { attributeName: partitionKey.name, keyType: HASH_KEY_TYPE }
    ];

    if (sortKey) {
      this.registerAttribute(sortKey);
      indexKeySchema.push({ attributeName: sortKey.name, keyType: RANGE_KEY_TYPE });
    }

    return indexKeySchema;
  }

  private buildIndexProjection(props: SecondaryIndexProps): CfnTable.ProjectionProperty {
    if (props.projectionType === ProjectionType.INCLUDE && !props.nonKeyAttributes) {
      // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-projectionobject.html
      throw new Error(`non-key attributes should be specified when using ${ProjectionType.INCLUDE} projection type`);
    }

    if (props.projectionType !== ProjectionType.INCLUDE && props.nonKeyAttributes) {
      // this combination causes validation exception, status code 400, while trying to create CFN stack
      throw new Error(`non-key attributes should not be specified when not using ${ProjectionType.INCLUDE} projection type`);
    }

    if (props.nonKeyAttributes) {
      this.validateNonKeyAttributes(props.nonKeyAttributes);
    }

    return {
      projectionType: props.projectionType ? props.projectionType : ProjectionType.ALL,
      nonKeyAttributes: props.nonKeyAttributes ? props.nonKeyAttributes : undefined
    };
  }

  private findKey(keyType: string) {
    return this.keySchema.find(prop => prop.keyType === keyType);
  }

  private addKey(attribute: Attribute, keyType: string) {
    const existingProp = this.findKey(keyType);
    if (existingProp) {
      throw new Error(`Unable to set ${attribute.name} as a ${keyType} key, because ${existingProp.attributeName} is a ${keyType} key`);
    }
    this.registerAttribute(attribute);
    this.keySchema.push({
      attributeName: attribute.name,
      keyType
    });
    return this;
  }

  /**
   * Register the key attribute of table or secondary index to assemble attribute definitions of TableResourceProps.
   *
   * @param attribute the key attribute of table or secondary index
   */
  private registerAttribute(attribute: Attribute) {
    const name = attribute.name;
    const type = attribute.type;
    const existingDef = this.attributeDefinitions.find(def => def.attributeName === name);
    if (existingDef && existingDef.attributeType !== type) {
      throw new Error(`Unable to specify ${name} as ${type} because it was already defined as ${existingDef.attributeType}`);
    }
    if (!existingDef) {
      this.attributeDefinitions.push({
        attributeName: name,
        attributeType: type
      });
    }
  }

  /**
   * Return the role that will be used for AutoScaling
   */
  private makeScalingRole(): iam.IRole {
    // Use a Service Linked Role.
    // https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-service-linked-roles.html
    return iam.Role.fromRoleArn(this, 'ScalingRole', Stack.of(this).formatArn({
      service: 'iam',
      region: '',
      resource: 'role/aws-service-role/dynamodb.application-autoscaling.amazonaws.com',
      resourceName: 'AWSServiceRoleForApplicationAutoScaling_DynamoDBTable'
    }));
  }

  /**
   * Whether this table has indexes
   */
  private get hasIndex(): boolean {
    return this.globalSecondaryIndexes.length + this.localSecondaryIndexes.length > 0;
  }
}

export enum AttributeType {
  BINARY = 'B',
  NUMBER = 'N',
  STRING = 'S',
}

/**
 * DyanmoDB's Read/Write capacity modes.
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

export enum ProjectionType {
  KEYS_ONLY = 'KEYS_ONLY',
  INCLUDE = 'INCLUDE',
  ALL = 'ALL'
}

/**
 * When an item in the table is modified, StreamViewType determines what information
 * is written to the stream for this table.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_StreamSpecification.html
 */
export enum StreamViewType {
  /** The entire item, as it appears after it was modified, is written to the stream. */
  NEW_IMAGE = 'NEW_IMAGE',
  /** The entire item, as it appeared before it was modified, is written to the stream. */
  OLD_IMAGE = 'OLD_IMAGE',
  /** Both the new and the old item images of the item are written to the stream. */
  NEW_AND_OLD_IMAGES = 'NEW_AND_OLD_IMAGES',
  /** Only the key attributes of the modified item are written to the stream. */
  KEYS_ONLY = 'KEYS_ONLY'
}

/**
 * Just a convenient way to keep track of both attributes
 */
interface ScalableAttributePair {
  scalableReadAttribute?: ScalableTableAttribute;
  scalableWriteAttribute?: ScalableTableAttribute;
}
