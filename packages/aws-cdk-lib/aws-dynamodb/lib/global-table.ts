import { Construct } from 'constructs';
import { CfnGlobalTable } from './dynamodb.generated';
import {
  SecondaryIndexProps, SchemaOptions, TableClass, LocalSecondaryIndexProps,
  BillingMode, Attribute, ProjectionType, TableEncryption, ITable,
} from './shared';
import { Table } from './table';
import { IStream } from '../../aws-kinesis';
import { IKey } from '../../aws-kms';
import {
  IResource, RemovalPolicy, Resource, Stack, Token, Lazy, ArnFormat,
} from '../../core';

/* eslint-disable no-console */

const HASH_KEY_TYPE = 'HASH';
const RANGE_KEY_TYPE = 'RANGE';
const NEW_AND_OLD_IMAGES = 'NEW_AND_OLD_IMAGES';
const MAX_GSI_COUNT = 20;
const MAX_LSI_COUNT = 5;
const MAX_NON_KEY_ATTRIBUTES = 100;
const DEFAULT_TARGET_UTILIZATION = 70;

/**
 * Capacity modes
 */
export enum CapacityMode {
  /**
   * Fixed capacity mode
   */
  FIXED = 'FIXED',

  /**
   * Autoscaled capacity mode
   */
  AUTOSCALED = 'AUTOSCALED',
}

/**
 * Options used to configure capacity
 */
export interface CapacityOptions {
  /**
   * The number of capacity units.
   *
   * @default - no capacity units
   */
  readonly units?: number;

  /**
   * The minimum allowable capacity.
   *
   * @default - no minimum capacity
   */
  readonly minCapacity?: number;

  /**
   * The maximum allowable capacity.
   *
   * @default - no maximum capacity
   */
  readonly maxCapacity?: number;

  /**
   * The ratio of consumed capacity units to provisioned capacity units.
   *
   * @default 70
   */
  readonly targetUtilizationPercent?: number;
}

/**
 * Options used to configure autoscaled capacity
 */
export interface AutoscaledCapacityOptions {
  /**
   * The minimum allowable capacity.
   *
   * @default - no minimum capacity
   */
  readonly minCapacity: number;

  /**
   * The maximum allowable capacity.
   *
   * @default - no maximum capacity
   */
  readonly maxCapacity: number;

  /**
   * The ratio of consumed capacity units to provisioned capacity units.
   *
   * @default 70
   */
  readonly targetUtilizationPercent?: number;
}

/**
 * Properties used to configure throughput capacity settings
 */
export interface ThroughputProps {
  /**
   * The read capacity.
   */
  readonly readCapacity: Capacity;

  /**
   * The write capacity.
   */
  readonly writeCapacity: Capacity;
}

/**
 * Properties used to configure a global secondary index
 */
export interface GlobalSecondaryIndexPropsV2 extends SchemaOptions, SecondaryIndexProps {
  /**
   * The read capacity for the global secondary index
   *
   * @default
   */
  readonly readCapacity?: Capacity;

  /**
   * The write capacity for the global secondary index
   *
   * @default
   */
  readonly writeCapacity?: Capacity;
}

/**
 * Options to configure a global secondary index on a per-replica basis
 */
export interface ReplicaGlobalSecondaryIndexOptions {
  /**
   * Whether CloudWatch contributor insights is enabled on the global secondary index.
   *
   * @default - contributor insights is set based on global table contributor insights
   * setting
   */
  readonly contributorInsights?: boolean;

  /**
   * The read capacity for a specific global secondary index.
   *
   * @default - read capacity is inherited from the global secondary index configuration
   * at the global table level
   */
  readonly readCapacity?: Capacity;
}

/**
 * Configurable table options common to global tables and replica tables
 */
export interface TableOptionsV2 {
  /**
   * Whether CloudWatch contributor insights is enabled on all replica tables in the
   * global table.
   *
   * Note: This is configurable on a per-replica basis.
   *
   * @default false
   */
  readonly contributorInsights?: boolean;

  /**
   * Whether deletion protection is enabled on all replica tables in the global table.
   *
   * Note: This is configurable on a per-replica basis.
   *
   * @default false
   */
  readonly deletionProtection?: boolean;

  /**
   * Whether point-in-time recovery is enabled on all replica tables in the global table.
   *
   * Note: This is configurable on a per-replica basis.
   *
   * @default false
   */
  readonly pointInTimeRecovery?: boolean;

  /**
   * The table class for all replica tables in the global table.
   *
   * Note: This is configurable on a per-replica basis.
   *
   * @default TableClass.STANDARD
   */
  readonly tableClass?: TableClass;
}

/**
 * Properties used to configure a replica table
 */
export interface ReplicaTableProps extends TableOptionsV2 {
  /**
   * The region that the replica table will be created in.
   */
  readonly region: string;

  /**
   * The read capacity for the replica table.
   *
   * @default - replica table read capacity is inherited from read capacity defined at
   * global table
   */
  readonly readCapacity?: Capacity;

  /**
   * Kinesis Data Stream to capture item-level changes for the replica table.
   *
   * @default - no Kinesis Data Stream
   */
  readonly kinesisStream?: IStream;

  /**
   * Options used to configure global secondary indexes on a per-replica basis.
   *
   * @default - global secondary index options configured on the global table level will
   * be applied to the replica table
   */
  readonly globalSecondaryIndexOptions?: { [indexName: string]: ReplicaGlobalSecondaryIndexOptions };
}

/**
 * Properties used to configure a global table
 */
export interface GlobalTableProps extends TableOptionsV2, SchemaOptions {
  /**
   * The name of all replica tables in the global table.
   *
   * @default - generated by CloudFormation
   */
  readonly tableName?: string;

  /**
   * The name of the TTL attribute for all replica tables in the global table.
   *
   * @default - TTL is disabled
   */
  readonly timeToLiveAttribute?: string;

  /**
   * The removal policy applied to the global table.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * The billing mode and the associated read and write capacity settings for all replica
   * tables in the global table.
   *
   * Note: Read capacity is configurable on a per-replica basis.
   *
   * @default Billing.onDemand()
   */
  readonly billing?: Billing;

  /**
   * Properties used to configure the replica tables in the global table.
   *
   * Note: You can add or remove replicas after table creation, but you can only add or
   * remove a single replica in each update.
   *
   * @default - a single replica table will be created in the region the global table is
   * deployed to
   */
  readonly replicas?: ReplicaTableProps[];

  /**
   * Global secondary indexes to define on all replica tables in the global table.
   *
   * Note: Global secondary indexes can be configured on a per-replica basis. Tables only
   * support a maximum of 20 global secondary indexes. You can only create or delete one
   * global secondary index in a single stack operation.
   *
   * @default - no global secondary indexes
   */
  readonly globalSecondaryIndexes?: GlobalSecondaryIndexPropsV2[];

  /**
   * Local secondary indexes to define on all replica tables in the global table.
   *
   * Note: Tables only support a maximum of 5 local secondary indexes.
   *
   * @default - no local secondary indexes
   */
  readonly localSecondaryIndexes?: LocalSecondaryIndexProps[];

  /**
   * The server-side encryption to apply to all replica tables in the global table.
   *
   * Note: If the encryption type is customer managed, you must provide the ARN of a KMS
   * key for each replica region.
   *
   * @default TableEncryptionV2.dynamoOwnedKey()
   */
  readonly encryption?: TableEncryptionV2;
}

/**
 * Represents an instance of a global table
 */
export interface IGlobalTable extends IResource {
  /**
   * The ARN of the replica table in the region that the global table is deployed to.
   *
   * @attribute
   */
  readonly tableArn: string;

  /**
   * The name of all replica tables in the global table.
   *
   * @attribute
   */
  readonly tableName: string;

  /**
   * The ID of the replica table in the region that the global table is deployed to.
   *
   * @attribute
   */
  readonly tableId?: string;

  /**
   * The ARN of the DynamoDB stream of the replica table in the region that the global
   * table is deployed to.
   *
   * @attribute
   */
  readonly tableStreamArn?: string;
}

/**
 * Attributes of a global table
 */
export interface GlobalTableAttributes {
  readonly tableArn?: string;
  readonly tableName?: string;
  readonly tableId?: string;
  readonly tableStreamArn?: string;
  readonly encryption?: TableEncryptionV2;
  readonly replicaRegions?: string[];
}

/**
 * The base class for a global table
 */
abstract class GlobalTableBase extends Resource implements IGlobalTable {
  /**
   * The ARN of the replica table in the region that the global table is deployed to.
   *
   * @attribute
   */
  public abstract readonly tableArn: string;

  /**
   * The name of all replica tables in the global table.
   *
   * @attribute
   */
  public abstract readonly tableName: string;

  /**
   * The ID of the replica table in the region that the global table is deployed to.
   *
   * @attribute
   */
  public abstract readonly tableId?: string;

  /**
   * The ARN of the DynamoDB stream of the replica table in the region that the global
   * table is deployed to.
   *
   * @attribute
   */
  public abstract readonly tableStreamArn?: string;

  /**
   * The server-side encryption for the global table and its replica tables.
   */
  public abstract readonly encryption?: TableEncryptionV2;

  /**
   * @internal
   */
  protected readonly _replicaTables = new Map<string, ReplicaTableProps>();

  /**
   *
   * @param region the region of the replica table
   */
  public replica(region: string): ITable {
    if (!this._replicaTables.has(region)) {
      throw new Error(`The global table does not have a replica table defined in region ${region}`);
    }

    return Table.fromTableAttributes(this, `ReplicaTable-${region}`, {});
  }
}

/**
 * A global table
 */
export class GlobalTable extends GlobalTableBase {
  /**
   * Creates a Global Table construct that represents an external global table via table name.
   *
   * @param scope construct scope (usually `this`)
   * @param id construct name
   * @param tableName the name of the global table
   */
  public static fromTableName(scope: Construct, id: string, tableName: string): IGlobalTable {
    return GlobalTable.fromTableAttributes(scope, id, { tableName });
  }

  /**
   * Creates a Global Table construct that represents an external global table via table ARN.
   *
   * @param scope construct scope (usually `this`)
   * @param id construct name
   * @param tableArn the ARN of the global table
   */
  public static fromTableArn(scope: Construct, id: string, tableArn: string): IGlobalTable {
    return GlobalTable.fromTableAttributes(scope, id, { tableArn });
  }

  /**
   * Creates a Global Table construct that represents an external global table.
   *
   * @param scope construct scope (usually `this`)
   * @param id construct name
   * @param attrs the attributes representing the global table
   */
  public static fromTableAttributes(scope: Construct, id: string, attrs: GlobalTableAttributes): IGlobalTable {
    class Import extends GlobalTableBase {
      public readonly tableArn: string;
      public readonly tableName: string;
      public readonly tableId?: string;
      public readonly tableStreamArn?: string;
      public readonly encryption?: TableEncryptionV2;

      public constructor(tableArn: string, tableName: string, tableId?: string, tableStreamArn?: string) {
        super(scope, id);
        this.tableArn = tableArn;
        this.tableName = tableName;
        this.tableId = tableId;
        this.tableStreamArn = tableStreamArn;
      }
    }

    let tableName: string;
    let tableArn: string;
    const stack = Stack.of(scope);
    if (!attrs.tableArn) {
      if (!attrs.tableName) {
        throw new Error('At least one of tableArn or tableName must be provided');
      }

      tableName = attrs.tableName;
      tableArn = stack.formatArn({
        service: 'dynamodb',
        resource: 'table',
        resourceName: tableName,
      });
    } else {
      if (attrs.tableArn) {
        throw new Error('Only one of tableArn or tableName can be provided, but not both');
      }

      tableArn = attrs.tableArn;
      const resourceName = stack.splitArn(tableArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
      if (!resourceName) {
        throw new Error('Invalid table ARN');
      }
      tableName = resourceName;
    }

    return new Import(tableArn, tableName, attrs.tableId, attrs.tableStreamArn);
  }

  /**
   * Returns the ARN of the replica table in the region that the global table is deployed to.
   *
   * @attribute
   */
  public readonly tableArn: string;

  /**
   * Returns the name of all replica tables in the global table.
   *
   * @attribute
   */
  public readonly tableName: string;

  /**
   * Returns the ID of the replica table in the region that the global table is deployed to.
   *
   * @attribute
   */
  public readonly tableId?: string;

  /**
   * Returns the ARN of the DynamoDB stream of the replica table in the region that the global
   * table is deployed to.
   *
   * @attribute
   */
  public readonly tableStreamArn?: string;

  /**
   * Returns the server-side encryption for the global table and its replica tables.
   */
  public readonly encryption?: TableEncryptionV2;

  private readonly billingMode: string;
  private readonly partitionKey: Attribute;
  private readonly tableOptions: TableOptionsV2;

  private readonly readProvisioning?: CfnGlobalTable.ReadProvisionedThroughputSettingsProperty;
  private readonly writeProvisioning?: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty;

  private readonly attributeDefinitions: CfnGlobalTable.AttributeDefinitionProperty[] = [];
  private readonly keySchema: CfnGlobalTable.KeySchemaProperty[] = [];
  private readonly nonKeyAttributes = new Set<string>();

  private readonly _localSecondaryIndexes = new Map<string, CfnGlobalTable.LocalSecondaryIndexProperty>();
  private readonly _globalSecondaryIndexes = new Map<string, CfnGlobalTable.GlobalSecondaryIndexProperty>();
  private readonly globalSecondaryIndexReadCapacitys = new Map<string, Capacity>();

  public constructor(scope: Construct, id: string, props: GlobalTableProps) {
    super(scope, id, { physicalName: props.tableName });

    this.partitionKey = props.partitionKey;
    this.tableOptions = props;

    if (props.billing) {
      this.billingMode = props.billing.mode;
      if (this.billingMode === BillingMode.PROVISIONED) {
        this.readProvisioning = this.configureReadProvisioning(props.billing.readCapacity);
        this.writeProvisioning = this.configureWriteProvisioning(props.billing.writeCapacity);
      }
    } else {
      this.billingMode = BillingMode.PAY_PER_REQUEST;
    }

    this.addKey(props.partitionKey, HASH_KEY_TYPE);
    if (props.sortKey) {
      this.addKey(props.sortKey, RANGE_KEY_TYPE);
    }

    this.encryption = props.encryption;
    const sseSpecification = this.encryption ? this.configureSseSpecification(this.encryption) : undefined;

    props.globalSecondaryIndexes?.forEach(gsi => this.addGlobalSecondaryIndex(gsi));
    props.localSecondaryIndexes?.forEach(lsi => this.addLocalSecondaryIndex(lsi));
    props.replicas?.forEach(replica => this.addReplica(replica));

    const resource = new CfnGlobalTable(scope, 'Resource', {
      tableName: this.physicalName,
      keySchema: this.keySchema,
      attributeDefinitions: Lazy.any({ produce: () => this.attributeDefinitions }),
      replicas: Lazy.any({ produce: () => this.replicaTables }),
      localSecondaryIndexes: Lazy.any({ produce: () => this.localSecondaryIndexes }, { omitEmptyArray: true }),
      globalSecondaryIndexes: Lazy.any({ produce: () => this.globalSecondaryIndexes }, { omitEmptyArray: true }),
      billingMode: this.billingMode,
      streamSpecification: { streamViewType: NEW_AND_OLD_IMAGES },
      writeProvisionedThroughputSettings: this.writeProvisioning,
      sseSpecification,
      timeToLiveSpecification: props.timeToLiveAttribute
        ? { attributeName: props.timeToLiveAttribute, enabled: true }
        : undefined,
    });
    resource.applyRemovalPolicy(props.removalPolicy);

    this.tableArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'dynamodb',
      resource: 'table',
      resourceName: this.physicalName,
    });
    this.tableName = this.getResourceNameAttribute(resource.ref);
    this.tableId = resource.attrTableId;
    this.tableStreamArn = resource.attrStreamArn;

    if (props.tableName) {
      this.node.addMetadata('aws:cdk:hasPhysicalName', this.tableName);
    }
  }

  private get localSecondaryIndexes() {
    const localSecondaryIndexes: CfnGlobalTable.LocalSecondaryIndexProperty[] = [];

    for (const localSecondaryIndex of this._localSecondaryIndexes.values()) {
      localSecondaryIndexes.push(localSecondaryIndex);
    }

    return localSecondaryIndexes;
  }

  private get globalSecondaryIndexes() {
    const globalSecondaryIndexes: CfnGlobalTable.GlobalSecondaryIndexProperty[] = [];

    for (const globalSecondaryIndex of this._globalSecondaryIndexes.values()) {
      globalSecondaryIndexes.push(globalSecondaryIndex);
    }

    return globalSecondaryIndexes;
  }

  private get replicaTables() {
    const replicaTables: CfnGlobalTable.ReplicaSpecificationProperty[] = [];

    if (!this._replicaTables.has(this.stack.region)) {
      const replicaTable = this.configureReplicaTable({ region: this.stack.region });
      replicaTables.push(replicaTable);
    }

    for (const replicaTable of this._replicaTables.values()) {
      replicaTables.push(this.configureReplicaTable(replicaTable));
    }

    return replicaTables;
  }

  /**
   * Add a local secondary index to the global table and its replicas
   *
   * @param props the properties of the local secondary index to add
   */
  public addLocalSecondaryIndex(props: LocalSecondaryIndexProps) {
    this.validateIndexName(props.indexName);

    if (this._localSecondaryIndexes.size === MAX_LSI_COUNT) {
      throw new Error(`A table can only support a maximum of ${MAX_LSI_COUNT} local secondary indexes`);
    }

    const localSecondaryIndex = this.configureLocalSecondaryIndex(props);
    this._localSecondaryIndexes.set(props.indexName, localSecondaryIndex);
  }

  /**
   * Add a global secondary index to the global table and its replicas
   *
   * @param props the properties of the global secondary index to add
   */
  public addGlobalSecondaryIndex(props: GlobalSecondaryIndexPropsV2) {
    this.validateIndexName(props.indexName);

    if (this._globalSecondaryIndexes.size === MAX_GSI_COUNT) {
      throw new Error(`A table can only support a maximum of ${MAX_GSI_COUNT} global secondary indexes`);
    }

    if (this.billingMode === BillingMode.PAY_PER_REQUEST && (props.readCapacity || props.writeCapacity)) {
      throw new Error(`You cannot configure read or write capacity on a global secondary index if the billing mode is ${BillingMode.PAY_PER_REQUEST}`);
    }

    if (this.billingMode === BillingMode.PROVISIONED && !props.readCapacity) {
      throw new Error(`You must specify 'readCapacity' on a global secondary index when the billing mode is ${BillingMode.PROVISIONED}`);
    }

    const globalSecondaryIndex = this.configureGlobalSecondaryIndex(props);
    this._globalSecondaryIndexes.set(props.indexName, globalSecondaryIndex);
  }

  /**
   * Add a replica table to the global table
   *
   * @param props the properties of the replica table to add
   */
  public addReplica(props: ReplicaTableProps) {
    if (Token.isUnresolved(this.stack.region)) {
      throw new Error('You cannot add replica tables to a region agnostic stack');
    }

    if (Token.isUnresolved(props.region)) {
      throw new Error('Replica table region must not be a token');
    }

    if (this._replicaTables.has(props.region)) {
      throw new Error(`Duplicate replica region, ${props.region}, is not allowed`);
    }

    this._replicaTables.set(props.region, props);
  }

  private configureLocalSecondaryIndex(props: LocalSecondaryIndexProps): CfnGlobalTable.LocalSecondaryIndexProperty {
    const indexKeySchema = this.configureIndexKeySchema(this.partitionKey, props.sortKey);
    const indexProjection = this.configureIndexProjection(props);

    return {
      indexName: props.indexName,
      keySchema: indexKeySchema,
      projection: indexProjection,
    };
  }

  private configureGlobalSecondaryIndex(props: GlobalSecondaryIndexPropsV2): CfnGlobalTable.GlobalSecondaryIndexProperty {
    const indexKeySchema = this.configureIndexKeySchema(props.partitionKey, props.sortKey);
    const indexProjection = this.configureIndexProjection(props);

    if (props.readCapacity) {
      this.globalSecondaryIndexReadCapacitys.set(props.indexName, props.readCapacity);
    }

    const writeProvisionedThroughputSettings = props.writeCapacity
      ? this.configureWriteProvisioning(props.writeCapacity)
      : this.writeProvisioning;

    return {
      indexName: props.indexName,
      keySchema: indexKeySchema,
      projection: indexProjection,
      writeProvisionedThroughputSettings,
    };
  }

  private configureReplicaGlobalSecondaryIndexes(options?: { [indexName: string]: ReplicaGlobalSecondaryIndexOptions }) {
    const processedGlobalSecondaryIndexes = [];
    const globalSecondaryIndexes: CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty[] = [];
    if (options) {
      for (const indexName of Object.keys(options)) {
        if (!this._globalSecondaryIndexes.has(indexName)) {
          throw new Error(`Cannot configure global secondary index, ${indexName}, because it is not defined on the global table`);
        }

        processedGlobalSecondaryIndexes.push(indexName);
        const replicaGsiOptions = options[indexName];

        if (this.billingMode === BillingMode.PAY_PER_REQUEST && replicaGsiOptions.readCapacity) {
          throw new Error(`Cannot configure 'readCapacity' for global secondary index, ${indexName}, because billing mode is ${BillingMode.PAY_PER_REQUEST}`);
        }

        const contributorInsights = replicaGsiOptions.contributorInsights ?? this.tableOptions.contributorInsights;
        const readCapacity = replicaGsiOptions.readCapacity ?? this.globalSecondaryIndexReadCapacitys.get(indexName);

        const readProvisionedThroughputSettings = readCapacity
          ? this.configureReadProvisioning(readCapacity)
          : undefined;

        globalSecondaryIndexes.push({
          indexName,
          readProvisionedThroughputSettings,
          contributorInsightsSpecification: contributorInsights !== undefined
            ? { enabled: contributorInsights }
            : undefined,
        });
      }
    }

    // each gsi needs to be specified on replicas for provisioned billing
    if (this.billingMode === BillingMode.PROVISIONED) {
      for (const gsi of this._globalSecondaryIndexes.values()) {
        if (processedGlobalSecondaryIndexes.includes(gsi.indexName)) {
          continue;
        }

        const readCapacity = this.globalSecondaryIndexReadCapacitys.get(gsi.indexName);
        const readProvisionedThroughputSettings = readCapacity
          ? this.configureReadProvisioning(readCapacity)
          : undefined;

        globalSecondaryIndexes.push({
          indexName: gsi.indexName,
          readProvisionedThroughputSettings,
          contributorInsightsSpecification: this.tableOptions.contributorInsights
            ? { enabled: this.tableOptions.contributorInsights }
            : undefined,
        });
      }
    }

    return globalSecondaryIndexes.length > 0 ? globalSecondaryIndexes : undefined;
  }

  private configureReplicaTable(props: ReplicaTableProps): CfnGlobalTable.ReplicaSpecificationProperty {
    const globalSecondaryIndexes = this.configureReplicaGlobalSecondaryIndexes(props.globalSecondaryIndexOptions);
    const pointInTimeRecovery = props.pointInTimeRecovery ?? this.tableOptions.pointInTimeRecovery;
    const contributorInsights = props.contributorInsights ?? this.tableOptions.contributorInsights;
    const readProvisionedThroughputSettings = props.readCapacity
      ? this.configureReadProvisioning(props.readCapacity)
      : this.readProvisioning;

    return {
      region: props.region,
      readProvisionedThroughputSettings,
      globalSecondaryIndexes,
      deletionProtectionEnabled: props.deletionProtection ?? this.tableOptions.deletionProtection,
      tableClass: props.tableClass ?? this.tableOptions.tableClass,
      sseSpecification: this.configureReplicaSseSpecification(props.region),
      kinesisStreamSpecification: props.kinesisStream
        ? { streamArn: props.kinesisStream.streamArn }
        : undefined,
      contributorInsightsSpecification: contributorInsights !== undefined
        ? { enabled: contributorInsights }
        : undefined,
      pointInTimeRecoverySpecification: pointInTimeRecovery !== undefined
        ? { pointInTimeRecoveryEnabled: pointInTimeRecovery }
        : undefined,
    };
  }

  private configureSseSpecification(encryption: TableEncryptionV2): CfnGlobalTable.SSESpecificationProperty {
    if (encryption.type === TableEncryption.DEFAULT) {
      return { sseEnabled: false };
    }

    return { sseEnabled: true, sseType: 'KMS' };
  }

  private configureReplicaSseSpecification(region: string): CfnGlobalTable.ReplicaSSESpecificationProperty | undefined {
    if (!this.encryption || this.encryption.type !== TableEncryption.CUSTOMER_MANAGED) {
      return undefined;
    }

    if (region === this.stack.region) {
      return { kmsMasterKeyId: this.encryption.tableKey.keyArn };
    }

    if (this.encryption && this.encryption.type === TableEncryption.CUSTOMER_MANAGED) {
      const regionInReplicaKeyArns = this.encryption.replicaKeyArns.hasOwnProperty(region);
      if (!regionInReplicaKeyArns) {
        throw new Error(`You must specify a KMS key ARN for each replica table when encryption type is ${TableEncryption.CUSTOMER_MANAGED}`);
      }
    }

    return { kmsMasterKeyId: this.encryption.replicaKeyArns[region] };
  }

  private configureReadProvisioning(readCapacity: Capacity): CfnGlobalTable.ReadProvisionedThroughputSettingsProperty {
    if (readCapacity.mode === CapacityMode.FIXED) {
      return { readCapacityUnits: readCapacity.units };
    }

    return {
      readCapacityAutoScalingSettings: {
        minCapacity: readCapacity.minCapacity,
        maxCapacity: readCapacity.maxCapacity,
        targetTrackingScalingPolicyConfiguration: {
          targetValue: readCapacity.targetUtilizationPercent,
        },
      },
    };
  }

  private configureWriteProvisioning(writeCapacity: Capacity): CfnGlobalTable.WriteProvisionedThroughputSettingsProperty {
    if (writeCapacity.mode === CapacityMode.FIXED) {
      throw new Error(`Write capacity must be configured using ${CapacityMode.AUTOSCALED} capacity mode`);
    }

    return {
      writeCapacityAutoScalingSettings: {
        minCapacity: writeCapacity.minCapacity,
        maxCapacity: writeCapacity.maxCapacity,
        targetTrackingScalingPolicyConfiguration: {
          targetValue: writeCapacity.targetUtilizationPercent,
        },
      },
    };
  }

  private configureIndexKeySchema(partitionKey: Attribute, sortKey?: Attribute) {
    this.addAttributeDefinition(partitionKey);

    const indexKeySchema: CfnGlobalTable.KeySchemaProperty[] = [
      { attributeName: partitionKey.name, keyType: HASH_KEY_TYPE },
    ];

    if (sortKey) {
      this.addAttributeDefinition(sortKey);
      indexKeySchema.push({ attributeName: sortKey.name, keyType: RANGE_KEY_TYPE });
    }

    return indexKeySchema;
  }

  private configureIndexProjection(props: SecondaryIndexProps): CfnGlobalTable.ProjectionProperty {
    if (props.projectionType === ProjectionType.INCLUDE && !props.nonKeyAttributes) {
      throw new Error(`Non-key attributes should be specified when using ${ProjectionType.INCLUDE} projection type`);
    }

    if (props.projectionType !== ProjectionType.INCLUDE && props.nonKeyAttributes) {
      throw new Error(`Non-key attributes should not be specified when not using ${ProjectionType.INCLUDE} projection type`);
    }

    if (props.nonKeyAttributes) {
      props.nonKeyAttributes.forEach(attr => this.nonKeyAttributes.add(attr));
    }

    if (this.nonKeyAttributes.size > MAX_NON_KEY_ATTRIBUTES) {
      throw new Error(`The maximum number of nonKeyAttributes across all secondary indexes is ${MAX_NON_KEY_ATTRIBUTES}`);
    }

    return {
      projectionType: props.projectionType ?? ProjectionType.ALL,
      nonKeyAttributes: props.nonKeyAttributes ?? undefined,
    };
  }

  private addKey(key: Attribute, keyType: string) {
    this.addAttributeDefinition(key);
    this.keySchema.push({ attributeName: key.name, keyType });
  }

  private addAttributeDefinition(attribute: Attribute) {
    const { name, type } = attribute;

    const existingAttributeDef = this.attributeDefinitions.find(def => def.attributeName === name);
    if (existingAttributeDef && existingAttributeDef.attributeType !== type) {
      throw new Error(`Unable to specify ${name} as ${type} because it was already defined as ${existingAttributeDef.attributeType}`);
    }

    if (!existingAttributeDef) {
      this.attributeDefinitions.push({ attributeName: name, attributeType: type });
    }
  }

  private validateIndexName(indexName: string) {
    if (this._localSecondaryIndexes.has(indexName) || this._globalSecondaryIndexes.has(indexName)) {
      throw new Error(`Duplicate secondary index name, ${indexName}, is not allowed`);
    }
  }
}

/**
 * Used to configure how you are charged for read and write throughput and how you
 * manage capacity for a global table and its replicas
 */
export class Billing {
  /**
   * Configure on-demand billing.
   *
   * Note: This will set the billing mode to PAY_PER_REQUEST.
   */
  public static onDemand() {
    return new Billing(BillingMode.PAY_PER_REQUEST, undefined, undefined);
  }

  /**
   * Configure provisioned billing.
   *
   * Note: This will set the billing mode to PROVISIONED.
   */
  public static provisioned(props: ThroughputProps) {
    return new Billing(BillingMode.PROVISIONED, props.readCapacity, props.writeCapacity);
  }

  public readonly mode: string;
  private readonly _readCapacity?: Capacity;
  private readonly _writeCapacity?: Capacity;

  public get readCapacity() {
    if (!this._readCapacity) {
      throw new Error(`readCapacity is not configured when billing mode is ${BillingMode.PAY_PER_REQUEST}`);
    }
    return this._readCapacity;
  }

  public get writeCapacity() {
    if (!this._writeCapacity) {
      throw new Error(`writeCapacity is not configured when billing mode is ${BillingMode.PAY_PER_REQUEST}`);
    }
    return this._writeCapacity;
  }

  private constructor(mode: string, readCapacity: Capacity | undefined, writeCapacity: Capacity | undefined) {
    this.mode = mode;
    this._readCapacity = readCapacity;
    this._writeCapacity = writeCapacity;
  }
}

/**
 * Used to configure read and write capacity for a global table and its replicas
 */
export class Capacity {
  /**
   * Configure fixed capacity.
   *
   * Note: This will set the capacity mode to FIXED.
   */
  public static fixed(units: number) {
    return new Capacity(CapacityMode.FIXED, { units });
  }

  /**
   * Configure autoscaled capacity.
   *
   * Note: This will set the capacity mode to AUTOSCALED.
   */
  public static autoscaled(options: AutoscaledCapacityOptions) {
    return new Capacity(CapacityMode.AUTOSCALED, { ...options });
  }

  public readonly mode: string;
  private readonly _units?: number;
  private readonly _minCapacity?: number;
  private readonly _maxCapacity?: number;
  private readonly _targetUtilizationPercent?: number;

  public get units() {
    if (this._units === undefined) {
      throw new Error(`Capacity units are not configured when capacity mode is ${CapacityMode.AUTOSCALED}`);
    }
    return this._units;
  }

  public get minCapacity() {
    if (this._minCapacity === undefined) {
      throw new Error(`Minimum capacity is not configured when capacity mode is ${CapacityMode.FIXED}`);
    }
    return this._minCapacity;
  }

  public get maxCapacity() {
    if (this._maxCapacity === undefined) {
      throw new Error(`Maximum capacity is not configured when capacity mode is ${CapacityMode.FIXED}`);
    }
    return this._maxCapacity;
  }

  public get targetUtilizationPercent() {
    if (this.mode === CapacityMode.FIXED) {
      throw new Error(`Target utilization percent is not configured when capacity mode is ${CapacityMode.FIXED}`);
    }
    return this._targetUtilizationPercent ?? DEFAULT_TARGET_UTILIZATION;
  }

  private constructor(mode: string, options: CapacityOptions) {
    if (options.minCapacity && options.maxCapacity) {
      if (options.minCapacity > options.maxCapacity) {
        throw new Error(`Min capacity: ${options.minCapacity} must be less than or equal to max capacity: ${options.maxCapacity}`);
      }
    }

    if (options.targetUtilizationPercent && (options.targetUtilizationPercent < 20 || options.targetUtilizationPercent > 90)) {
      throw new Error(`Target utilization percent must be between 20 and 90, inclusive. Provided: ${options.targetUtilizationPercent}`);
    }

    this.mode = mode;
    this._units = options.units;
    this._minCapacity = options.minCapacity;
    this._maxCapacity = options.maxCapacity;
    this._targetUtilizationPercent = options.targetUtilizationPercent;
  }
}

/**
 * Used to configure server-side encryption for a global table and its replicas
 */
export class TableEncryptionV2 {
  /**
   * Configure table encryption using a DynamoDB owned key.
   *
   * Note: This will set the encryption type to AWS_OWNED.
   */
  public static dynamoOwnedKey() {
    return new TableEncryptionV2(TableEncryption.DEFAULT, undefined, undefined);
  }

  /**
   * Configure table encryption using an AWS managed key.
   *
   * Note: This will set the encryption type to AWS_MANAGED.
   */
  public static awsManagedKey() {
    return new TableEncryptionV2(TableEncryption.AWS_MANAGED, undefined, undefined);
  }

  /**
   * Configure table encryption using a customer managed key.
   *
   * Note: This will set the encryption type to CUSTOMER_MANAGED.
   *
   * @param tableKey the KMS key used for the replica table in the deployment region
   * @param replicaKeyArns KMS key ARNS for all replica tables except the replica table in the
   * deployment region
   */
  public static customerManagedKey(tableKey: IKey, replicaKeyArns: { [region: string]: string } = {}) {
    return new TableEncryptionV2(TableEncryption.CUSTOMER_MANAGED, tableKey, replicaKeyArns);
  }

  public readonly type: string;
  private readonly _tableKey?: IKey;
  private readonly _replicaKeyArns?: { [region: string]: string };

  public get tableKey() {
    if (this._tableKey === undefined) {
      throw new Error(`Table key is only configured when encryption type is ${TableEncryption.CUSTOMER_MANAGED}`);
    }
    return this._tableKey;
  }

  public get replicaKeyArns() {
    if (this._replicaKeyArns === undefined) {
      throw new Error(`Replica key ARNs are only configured when encryption type is ${TableEncryption.CUSTOMER_MANAGED}`);
    }
    return this._replicaKeyArns;
  }

  private constructor(type: string, tableKey: IKey | undefined, replicaKeyArns: { [region: string]: string } | undefined) {
    this.type = type;
    this._tableKey = tableKey;
    this._replicaKeyArns = replicaKeyArns;
  }
}
