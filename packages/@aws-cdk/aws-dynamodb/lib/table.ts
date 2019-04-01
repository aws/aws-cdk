import appscaling = require('@aws-cdk/aws-applicationautoscaling');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Construct, Token } from '@aws-cdk/cdk';
import { CfnTable } from './dynamodb.generated';
import { EnableScalingProps, IScalableTableAttribute } from './scalable-attribute-api';
import { ScalableTableAttribute } from './scalable-table-attribute';

const HASH_KEY_TYPE = 'HASH';
const RANGE_KEY_TYPE = 'RANGE';

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

export interface TableProps {
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
   * Enforces a particular physical table name.
   * @default <generated>
   */
  readonly tableName?: string;

  /**
   * Whether point-in-time recovery is enabled.
   * @default undefined, point-in-time recovery is disabled
   */
  readonly pitrEnabled?: boolean;

  /**
   * Whether server-side encryption with an AWS managed customer master key is enabled.
   * @default undefined, server-side encryption is enabled with an AWS owned customer master key
   */
  readonly sseEnabled?: boolean;

  /**
   * When an item in the table is modified, StreamViewType determines what information
   * is written to the stream for this table. Valid values for StreamViewType are:
   * @default undefined, streams are disabled
   */
  readonly streamSpecification?: StreamViewType;

  /**
   * The name of TTL attribute.
   * @default undefined, TTL is disabled
   */
  readonly ttlAttributeName?: string;
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
   * @default undefined
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
   * @default undefined
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
export class Table extends Construct {
  /**
   * Permits an IAM Principal to list all DynamoDB Streams.
   * @param principal The principal (no-op if undefined)
   */
  public static grantListStreams(principal?: iam.IPrincipal): iam.Grant {
    return iam.Grant.onPrincipal({
      principal,
      actions: ['dynamodb:ListStreams'],
      resourceArns: ['*'],
    });
 }

  public readonly tableArn: string;
  public readonly tableName: string;
  public readonly tableStreamArn: string;

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
    super(scope, id);

    this.billingMode = props.billingMode || BillingMode.Provisioned;
    this.validateProvisioning(props);

    this.table = new CfnTable(this, 'Resource', {
      tableName: props.tableName,
      keySchema: this.keySchema,
      attributeDefinitions: this.attributeDefinitions,
      globalSecondaryIndexes: new Token(() => this.globalSecondaryIndexes.length > 0 ? this.globalSecondaryIndexes : undefined),
      localSecondaryIndexes: new Token(() => this.localSecondaryIndexes.length > 0 ? this.localSecondaryIndexes : undefined),
      pointInTimeRecoverySpecification: props.pitrEnabled ? { pointInTimeRecoveryEnabled: props.pitrEnabled } : undefined,
      billingMode: this.billingMode === BillingMode.PayPerRequest ? this.billingMode : undefined,
      provisionedThroughput: props.billingMode === BillingMode.PayPerRequest ? undefined : {
        readCapacityUnits: props.readCapacity || 5,
        writeCapacityUnits: props.writeCapacity || 5
      },
      sseSpecification: props.sseEnabled ? { sseEnabled: props.sseEnabled } : undefined,
      streamSpecification: props.streamSpecification ? { streamViewType: props.streamSpecification } : undefined,
      timeToLiveSpecification: props.ttlAttributeName ? { attributeName: props.ttlAttributeName, enabled: true } : undefined
    });

    if (props.tableName) { this.node.addMetadata('aws:cdk:hasPhysicalName', props.tableName); }

    this.tableArn = this.table.tableArn;
    this.tableName = this.table.tableName;
    this.tableStreamArn = this.table.tableStreamArn;

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
    if (this.globalSecondaryIndexes.length === 5) {
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
      throw new RangeError('a maximum number of global secondary index per table is 5');
    }

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
      provisionedThroughput: this.billingMode === BillingMode.PayPerRequest ? undefined : {
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
    if (this.localSecondaryIndexes.length === 5) {
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
      throw new RangeError('a maximum number of local secondary index per table is 5');
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
    if (this.billingMode === BillingMode.PayPerRequest) {
      throw new Error('AutoScaling is not available for tables with PAY_PER_REQUEST billing mode');
    }

    return this.tableScaling.scalableReadAttribute = new ScalableTableAttribute(this, 'ReadScaling', {
      serviceNamespace: appscaling.ServiceNamespace.DynamoDb,
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
    if (this.billingMode === BillingMode.PayPerRequest) {
      throw new Error('AutoScaling is not available for tables with PAY_PER_REQUEST billing mode');
    }

    return this.tableScaling.scalableWriteAttribute = new ScalableTableAttribute(this, 'WriteScaling', {
      serviceNamespace: appscaling.ServiceNamespace.DynamoDb,
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
    if (this.billingMode === BillingMode.PayPerRequest) {
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
      serviceNamespace: appscaling.ServiceNamespace.DynamoDb,
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
    if (this.billingMode === BillingMode.PayPerRequest) {
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
      serviceNamespace: appscaling.ServiceNamespace.DynamoDb,
      resourceId: `table/${this.tableName}/index/${indexName}`,
      dimension: 'dynamodb:index:WriteCapacityUnits',
      role: this.scalingRole,
      ...props
    });
  }

  /**
   * Adds an IAM policy statement associated with this table to an IAM
   * principal's policy.
   * @param principal The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:PutItem", "dynamodb:GetItem", ...)
   */
  public grant(principal?: iam.IPrincipal, ...actions: string[]): iam.Grant {
    return iam.Grant.onPrincipal({
      principal,
      actions,
      resourceArns: [
        this.tableArn,
        new cdk.Token(() => this.hasIndex ? `${this.tableArn}/index/*` : cdk.Aws.noValue).toString()
      ],
      scope: this,
    });
  }

  /**
   * Adds an IAM policy statement associated with this table's stream to an
   * IAM principal's policy.
   * @param principal The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:DescribeStream", "dynamodb:GetRecords", ...)
   */
  public grantStream(principal?: iam.IPrincipal, ...actions: string[]) {
    return iam.Grant.onPrincipal({
      principal,
      actions,
      resourceArns: [this.tableStreamArn],
      scope: this,
    });
  }

  /**
   * Permits an IAM principal all data read operations from this table:
   * BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan.
   * @param principal The principal to grant access to
   */
  public grantReadData(principal?: iam.IPrincipal) {
    return this.grant(principal, ...READ_DATA_ACTIONS);
  }

  /**
   * Permis an IAM principal all stream data read operations for this
   * table's stream:
   * DescribeStream, GetRecords, GetShardIterator, ListStreams.
   * @param principal The principal to grant access to
   */
  public grantStreamRead(principal?: iam.IPrincipal) {
    return this.grantStream(principal, ...READ_STREAM_DATA_ACTIONS);
  }

  /**
   * Permits an IAM principal all data write operations to this table:
   * BatchWriteItem, PutItem, UpdateItem, DeleteItem.
   * @param principal The principal to grant access to
   */
  public grantWriteData(principal?: iam.IPrincipal) {
    return this.grant(principal, ...WRITE_DATA_ACTIONS);
  }

  /**
   * Permits an IAM principal to all data read/write operations to this table.
   * BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan,
   * BatchWriteItem, PutItem, UpdateItem, DeleteItem
   * @param principal The principal to grant access to
   */
  public grantReadWriteData(principal?: iam.IPrincipal) {
    return this.grant(principal, ...READ_DATA_ACTIONS, ...WRITE_DATA_ACTIONS);
  }

  /**
   * Permits all DynamoDB operations ("dynamodb:*") to an IAM principal.
   * @param principal The principal to grant access to
   */
  public grantFullAccess(principal?: iam.IPrincipal) {
    return this.grant(principal, 'dynamodb:*');
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
    if (this.billingMode === BillingMode.PayPerRequest) {
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
    if (props.projectionType === ProjectionType.Include && !props.nonKeyAttributes) {
      // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-projectionobject.html
      throw new Error(`non-key attributes should be specified when using ${ProjectionType.Include} projection type`);
    }

    if (props.projectionType !== ProjectionType.Include && props.nonKeyAttributes) {
      // this combination causes validation exception, status code 400, while trying to create CFN stack
      throw new Error(`non-key attributes should not be specified when not using ${ProjectionType.Include} projection type`);
    }

    if (props.nonKeyAttributes) {
      this.validateNonKeyAttributes(props.nonKeyAttributes);
    }

    return {
      projectionType: props.projectionType ? props.projectionType : ProjectionType.All,
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
    return iam.Role.import(this, 'ScalingRole', {
      roleArn: this.node.stack.formatArn({
        // https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-service-linked-roles.html
        service: 'iam',
        resource: 'role/aws-service-role/dynamodb.application-autoscaling.amazonaws.com',
        resourceName: 'AWSServiceRoleForApplicationAutoScaling_DynamoDBTable'
      })
    });
  }

  /**
   * Whether this table has indexes
   */
  private get hasIndex(): boolean {
    return this.globalSecondaryIndexes.length + this.localSecondaryIndexes.length > 0;
  }
}

export enum AttributeType {
  Binary = 'B',
  Number = 'N',
  String = 'S',
}

/**
 * DyanmoDB's Read/Write capacity modes.
 */
export enum BillingMode {
  /**
   * Pay only for what you use. You don't configure Read/Write capacity units.
   */
  PayPerRequest = 'PAY_PER_REQUEST',
  /**
   * Explicitly specified Read/Write capacity units.
   */
  Provisioned = 'PROVISIONED',
}

export enum ProjectionType {
  KeysOnly = 'KEYS_ONLY',
  Include = 'INCLUDE',
  All = 'ALL'
}

/**
 * When an item in the table is modified, StreamViewType determines what information
 * is written to the stream for this table. Valid values for StreamViewType are:
 * @link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_StreamSpecification.html
 * @enum {string}
 */
export enum StreamViewType {
  /** The entire item, as it appears after it was modified, is written to the stream. */
  NewImage = 'NEW_IMAGE',
  /** The entire item, as it appeared before it was modified, is written to the stream. */
  OldImage = 'OLD_IMAGE',
  /** Both the new and the old item images of the item are written to the stream. */
  NewAndOldImages = 'NEW_AND_OLD_IMAGES',
  /** Only the key attributes of the modified item are written to the stream. */
  KeysOnly = 'KEYS_ONLY'
}

/**
 * Just a convenient way to keep track of both attributes
 */
interface ScalableAttributePair {
  scalableReadAttribute?: ScalableTableAttribute;
  scalableWriteAttribute?: ScalableTableAttribute;
}
