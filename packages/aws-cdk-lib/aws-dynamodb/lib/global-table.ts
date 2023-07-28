import { Construct } from 'constructs';
import { IStream } from '../../aws-kinesis';
import { IResource, RemovalPolicy, Resource, Stack, Token, Lazy, ArnFormat } from '../../core';
import {
  SecondaryIndexProps, SchemaOptions, TableClass, LocalSecondaryIndexProps,
  BillingMode, Attribute, ProjectionType,
} from './shared';
import { CfnGlobalTable } from './dynamodb.generated';

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
  FIXED = 'FIXED',
  AUTOSCALED = 'AUTOSCALED',
}

/**
 * Options used to configure capacity
 */
export interface CapacityOptions {
  readonly units?: number;
  readonly minCapacity?: number;
  readonly maxCapacity?: number;
  readonly targetUtilizationPercent?: number;
}

/**
 * Options used to configure autoscaled capacity
 */
export interface AutoscaledCapacityOptions {
  readonly minCapacity: number;
  readonly maxCapacity: number;
  readonly targetUtilizationPercent?: number;
}

/**
 * Properties used to configure throughput capacity settings
 */
export interface ThroughputProps {
  readonly readCapacity: Capacity;
  readonly writeCapacity: Capacity;
}

/**
 * Properties used to configure a global secondary index
 */
export interface GlobalSecondaryIndexPropsV2 extends SchemaOptions, SecondaryIndexProps {
  readonly readCapacity?: Capacity;
  readonly writeCapacity?: Capacity;
}

/**
 * Options to configure a global secondary index on a per-replica basis
 */
export interface ReplicaGlobalSecondaryIndexOptions {
  readonly indexName: string;
  readonly contributorInsights?: boolean;
  readonly readCapacity?: Capacity;
}

/**
 * Configurable table options common to global tables and replica tables
 */
export interface TableOptionsV2 {
  readonly contributorInsights?: boolean;
  readonly deletionProtection?: boolean;
  readonly pointInTimeRecovery?: boolean;
  readonly tableClass?: TableClass;
}

/**
 * Properties used to configure a replica table
 */
export interface ReplicaTableProps extends TableOptionsV2 {
  readonly region: string;
  readonly readCapacity?: Capacity;
  readonly kinesisStream?: IStream;
  readonly globalSecondaryIndexOptions?: { [indexName: string]: ReplicaGlobalSecondaryIndexOptions };
}

/**
 * Properties used to configure a global table
 */
export interface GlobalTableProps extends TableOptionsV2, SchemaOptions {
  readonly tableName?: string;
  readonly timeToLiveAttribute?: string;
  readonly removalPolicy?: RemovalPolicy;
  readonly billing?: Billing;
  readonly replicas?: ReplicaTableProps[];
  readonly globalSecondaryIndexes?: GlobalSecondaryIndexPropsV2[];
  readonly localSecondaryIndexes?: LocalSecondaryIndexProps[];
  readonly encryption?: TableEncryptionV2;
}

/**
 * Represents an instance of a global table
 */
export interface IGlobalTable extends IResource {
  readonly tableArn: string;
  readonly tableName: string;
  readonly tableId?: string;
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
}

/**
 * The base class for a global table
 */
abstract class GlobalTableBase extends Resource implements IGlobalTable {
  public abstract readonly tableArn: string;
  public abstract readonly tableName: string;
  public abstract readonly tableId?: string;
  public abstract readonly tableStreamArn?: string;
}

/**
 * A global table
 */
export class GlobalTable extends GlobalTableBase {
  public static fromTableName(scope: Construct, id: string, tableName: string): IGlobalTable {
    return GlobalTable.fromTableAttributes(scope, id, { tableName });
  }

  public static fromTableArn(scope: Construct, id: string, tableArn: string): IGlobalTable {
    return GlobalTable.fromTableAttributes(scope, id, { tableArn });
  }

  public static fromTableAttributes(scope: Construct, id: string, attrs: GlobalTableAttributes): IGlobalTable {
    class Import extends GlobalTableBase {
      public readonly tableArn: string;
      public readonly tableName: string;
      public readonly tableId?: string;
      public readonly tableStreamArn?: string;

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
        throw new Error('');
      }
      tableName = resourceName;
    }

    return new Import(tableArn, tableName, attrs.tableId, attrs.tableStreamArn);
  }

  public readonly tableArn: string;
  public readonly tableName: string;
  public readonly tableId?: string;
  public readonly tableStreamArn?: string;

  private readonly region: string;
  private readonly billingMode: string;
  private readonly partitionKey: Attribute;
  private readonly tableOptions: TableOptionsV2;

  private readonly readProvisioning?: CfnGlobalTable.ReadProvisionedThroughputSettingsProperty;
  private readonly writeProvisioning?: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty;

  private readonly attributeDefinitions: CfnGlobalTable.AttributeDefinitionProperty[] = [];
  private readonly keySchema: CfnGlobalTable.KeySchemaProperty[] = [];
  private readonly nonKeyAttributes = new Set<string>();

  private readonly _replicaTables = new Map<string, ReplicaTableProps>();

  private readonly localSecondaryIndexes = new Map<string, CfnGlobalTable.LocalSecondaryIndexProperty>();
  private readonly globalSecondaryIndexes = new Map<string, CfnGlobalTable.GlobalSecondaryIndexProperty>();
  private readonly globalSecondaryIndexReadCapacitys = new Map<string, Capacity>();

  public constructor(scope: Construct, id: string, props: GlobalTableProps) {
    super(scope, id, { physicalName: props.tableName });

    this.region = Stack.of(this).region;
    if (Token.isUnresolved(this.region)) {
      throw new Error('The deployment region for a global table must not be a token');
    }

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

    props.globalSecondaryIndexes?.forEach(gsi => this.addGlobalSecondaryIndex(gsi));

    const resource = new CfnGlobalTable(scope, 'Resource', {
      tableName: this.physicalName,
      keySchema: this.keySchema,
      attributeDefinitions: Lazy.any({ produce: () => this.attributeDefinitions }),
      replicas: Lazy.any({ produce: () => this.replicaTables }),
      localSecondaryIndexes: Lazy.any({ produce: () => Array.from(this.localSecondaryIndexes.values()) }),
      globalSecondaryIndexes: Lazy.any({ produce: () => Array.from(this.globalSecondaryIndexes.values()) }),
      billingMode: this.billingMode,
      streamSpecification: { streamViewType: NEW_AND_OLD_IMAGES },
      writeProvisionedThroughputSettings: this.writeProvisioning,
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

  private get replicaTables() {
    const replicaTables: CfnGlobalTable.ReplicaSpecificationProperty[] = [];

    if (!this._replicaTables.has(this.region)) {
      const replicaTable = this.configureReplicaTable({ region: this.region });
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

    if (this.localSecondaryIndexes.size > MAX_LSI_COUNT) {
      throw new Error(`A table can only support a maximum of ${MAX_LSI_COUNT} local secondary indexes`);
    }

    const localSecondaryIndex = this.configureLocalSecondaryIndex(props);
    this.localSecondaryIndexes.set(props.indexName, localSecondaryIndex);
  }

  /**
   * Add a global secondary index to the global table and its replicas
   *
   * @param props the properties of the global secondary index to add
   */
  public addGlobalSecondaryIndex(props: GlobalSecondaryIndexPropsV2) {
    this.validateIndexName(props.indexName);

    if (this.globalSecondaryIndexes.size === MAX_GSI_COUNT) {
      throw new Error(`A table can only support a maximum of ${MAX_GSI_COUNT} global secondary indexes`);
    }

    if (this.billingMode === BillingMode.PAY_PER_REQUEST && (props.readCapacity || props.writeCapacity)) {
      throw new Error(`You cannot configure read or write capacity on a global secondary index if the billing mode is ${BillingMode.PAY_PER_REQUEST}`);
    }

    if (this.billingMode === BillingMode.PROVISIONED && !props.readCapacity) {
      throw new Error(`You must specify 'readCapacity' on a global secondary index when the billing mode is ${BillingMode.PROVISIONED}`);
    }

    const globalSecondaryIndex = this.configureGlobalSecondaryIndex(props);
    this.globalSecondaryIndexes.set(props.indexName, globalSecondaryIndex);
  }

  /**
   * Add a replica table to the global table
   *
   * @param props the properties of the replica table to add
   */
  public addReplica(props: ReplicaTableProps) {
    if (Token.isUnresolved(props.region)) {
      throw new Error('Replica table `region` must not be a token');
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
    if (!options) {
      return undefined;
    }

    const globalSecondaryIndexes: CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty[] = [];
    for (const indexName of Object.keys(options)) {
      if (!this.globalSecondaryIndexes.has(indexName)) {
        throw new Error(`Cannot configure global secondary index, ${indexName}, because it is not defined on the global table`);
      }

      const replicaGsiOptions = options[indexName];

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

    return globalSecondaryIndexes;
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
    if (this.localSecondaryIndexes.has(indexName) || this.globalSecondaryIndexes.has(indexName)) {
      throw new Error(`Duplicate secondary index name, ${indexName}, is not allowed`);
    }
  }
}

/**
 * A class used to configure how you are charged for read and write throughput and how you
 * manage capacity for a global table and its replicas
 */
export class Billing {
  public static onDemand() {
    return new Billing(BillingMode.PAY_PER_REQUEST, undefined, undefined);
  }

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
      throw new Error(`writeCapacity is not configured when billing mode is ${BillingMode.PROVISIONED}`);
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
 * A class used to configure read and write capacity for a global table and its replicas
 */
export class Capacity {
  public static fixed(units: number) {
    return new Capacity(CapacityMode.FIXED, { units });
  }

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
      throw new Error(`Capacity units are not configured when capacity mode is ${CapacityMode.FIXED}`);
    }
    return this._units;
  }

  public get minCapacity() {
    if (this._minCapacity === undefined) {
      throw new Error(`Minimum capacity is not configured when capacity mode is ${CapacityMode.AUTOSCALED}`);
    }
    return this._minCapacity;
  }

  public get maxCapacity() {
    if (this._maxCapacity === undefined) {
      throw new Error(`Maximum capacity is not configured when capacity mode is ${CapacityMode.AUTOSCALED}`);
    }
    return this._maxCapacity;
  }

  public get targetUtilizationPercent() {
    if (this._targetUtilizationPercent === undefined) {
      throw new Error(`Target utilization percent is not configured when capacity mode is ${CapacityMode.AUTOSCALED}`);
    }
    return this._targetUtilizationPercent ?? DEFAULT_TARGET_UTILIZATION;
  }

  private constructor(mode: string, options: CapacityOptions) {
    this.mode = mode;
    this._units = options.units;
    this._minCapacity = options.minCapacity;
    this._maxCapacity = options.maxCapacity;
    this._targetUtilizationPercent = options.targetUtilizationPercent;
  }
}

export class TableEncryptionV2 {}
