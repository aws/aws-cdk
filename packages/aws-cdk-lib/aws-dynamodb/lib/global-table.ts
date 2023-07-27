import { Construct } from 'constructs';
import { CfnGlobalTable } from './dynamodb.generated';
import {
  Attribute, SchemaOptions, TableClass, SecondaryIndexProps,
  BillingMode, ProjectionType,
} from './shared';
import { IStream } from '../../aws-kinesis';
import { IResource, Lazy, RemovalPolicy, Resource, Token, Stack, ArnFormat } from '../../core';

const HASH_KEY_TYPE = 'HASH';
const RANGE_KEY_TYPE = 'RANGE';
const NEW_AND_OLD_IMAGES = 'NEW_AND_OLD_IMAGES';
const MAX_GSI_COUNT = 20;
const MAX_LSI_COUNT = 5;
const MAX_NON_KEY_ATTRIBUTES = 100;
const DEFAULT_TARGET_UTILIZATION = 70;

export enum CapacityMode {
  FIXED = 'FIXED',
  AUTOSCALED = 'AUTOSCALED',
}

interface CapacityConfigOptions {
  readonly units?: number;
  readonly minCapacity?: number;
  readonly maxCapacity?: number;
  readonly targetUtilizationPercent?: number;
}

export interface ThroughputOptions {
  readonly readCapacity: Capacity;
  readonly writeCapacity: Capacity;
}

export interface AutoscaledCapacityOptions {
  readonly minCapacity: number;
  readonly maxCapacity: number;
  readonly targetUtilizationPercent?: number;
}

export interface ReplicaGlobalSecondaryIndexOptions {
  readonly indexName: string;
  readonly contributorInsights?: boolean;
  readonly readCapacity?: Capacity;
}

export interface GlobalSecondaryIndexPropsV2 extends SchemaOptions, SecondaryIndexProps {
  readonly readCapacity?: Capacity;
  readonly writeCapacity?: Capacity;
}

export interface LocalSecondaryIndexPropsV2 extends SecondaryIndexProps {
  readonly sortKey: Attribute;
}

interface TableOptions {
  readonly contributorInsights?: boolean;
  readonly deletionProtection?: boolean;
  readonly pointInTimeRecovery?: boolean;
  readonly tableClass?: TableClass;
}

export interface ReplicaTableProps extends TableOptions {
  readonly region: string;
  readonly readCapacity?: Capacity;
  readonly kinesisStream?: IStream;
  readonly globalSecondaryIndexOptions?: { [indexName: string]: ReplicaGlobalSecondaryIndexOptions };
}

export interface GlobalTableProps extends TableOptions, SchemaOptions {
  readonly tableName?: string;
  readonly timeToLiveAttribute?: string;
  readonly removalPolicy?: RemovalPolicy;
  readonly billing?: Billing;
  readonly replicas?: ReplicaTableProps[];
  readonly globalSecondaryIndexes?: GlobalSecondaryIndexPropsV2[];
  readonly localSecondaryIndexes?: LocalSecondaryIndexPropsV2[];
  readonly encryption?: TableEncryptionV2;
}

export interface IGlobalTable extends IResource {
  readonly tableArn: string;
  readonly tableName: string;
  readonly tableId?: string;
  readonly tableStreamArn?: string;
}

export interface GlobalTableAttributes {
  readonly tableArn?: string;
  readonly tableName?: string;
  readonly tableId?: string;
  readonly tableStreamArn?: string;
}

abstract class GlobalTableBase extends Resource implements IGlobalTable {
  public abstract readonly tableArn: string;
  public abstract readonly tableName: string;
  public abstract readonly tableId?: string;
  public abstract readonly tableStreamArn?: string;
}

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

  private readonly tablePartitionKey: Attribute;
  private readonly billingMode: string;
  private readonly deploymentRegion: string;

  private readonly globalTableOptions: TableOptions;
  private readonly tableReadProvisioning?: CfnGlobalTable.ReadProvisionedThroughputSettingsProperty;
  private readonly tableWriteProvisioning?: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty;

  private readonly keySchema: CfnGlobalTable.KeySchemaProperty[] = [];
  private readonly attributeDefinitions: CfnGlobalTable.AttributeDefinitionProperty[] = [];
  private readonly nonKeyAttributes = new Set<string>();

  private readonly _replicaTables = new Map<string, ReplicaTableProps>();

  private readonly globalSecondaryReadCapacitys = new Map<string, Capacity>();
  private readonly _globalSecondaryIndexes = new Map<string, CfnGlobalTable.GlobalSecondaryIndexProperty>();
  private readonly _localSecondaryIndexes = new Map<string, CfnGlobalTable.LocalSecondaryIndexProperty>();

  public constructor(scope: Construct, id: string, props: GlobalTableProps) {
    super(scope, id, { physicalName: props.tableName });

    this.deploymentRegion = Stack.of(this).region;
    if (Token.isUnresolved(this.deploymentRegion)) {
      throw new Error('The region of the stack a global table is defined in must not be a token');
    }

    this.globalTableOptions = props;
    this.tablePartitionKey = props.partitionKey;

    if (props.billing) {
      this.billingMode = props.billing.mode;
      if (this.billingMode === BillingMode.PROVISIONED) {
        this.tableReadProvisioning = this.configureReadProvisioning(props.billing.readCapacity);
        this.tableWriteProvisioning = this.configureWriteProvisioning(props.billing.writeCapacity);
      }
    } else {
      this.billingMode = BillingMode.PAY_PER_REQUEST;
    }

    this.addKey(props.partitionKey, HASH_KEY_TYPE);
    if (props.sortKey) {
      this.addKey(props.sortKey, RANGE_KEY_TYPE);
    }

    props.replicas?.forEach(replica => this.addReplica(replica));
    props.globalSecondaryIndexes?.forEach(gsi => this.addGlobalSecondaryIndex(gsi));
    props.localSecondaryIndexes?.forEach(lsi => this.addLocalSecondaryIndex(lsi));

    const resource = new CfnGlobalTable(this, 'Resource', {
      tableName: this.physicalName,
      keySchema: this.keySchema,
      attributeDefinitions: Lazy.any({ produce: () => this.attributeDefinitions }),
      replicas: Lazy.any({ produce: () => this.replicaTables }),
      globalSecondaryIndexes: Lazy.any({ produce: () => this.globalSecondaryIndexes }, { omitEmptyArray: true }),
      localSecondaryIndexes: Lazy.any({ produce: () => this.localSecondaryIndexes }, { omitEmptyArray: true }),
      streamSpecification: { streamViewType: NEW_AND_OLD_IMAGES },
      billingMode: this.billingMode,
      writeProvisionedThroughputSettings: this.tableWriteProvisioning,
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

  /**
   * Add a global secondary index to the global table.
   *
   * @param props the properties of the global secondary index to add
   */
  public addGlobalSecondaryIndex(props: GlobalSecondaryIndexPropsV2) {
    this.validateIndexName(props.indexName);

    if (this._globalSecondaryIndexes.size === MAX_GSI_COUNT) {
      throw new Error(`A table can only have a maximum of ${MAX_GSI_COUNT} global secondary indexes`);
    }

    if (this.billingMode === BillingMode.PAY_PER_REQUEST && (props.readCapacity || props.writeCapacity)) {
      throw new Error('You cannot provision read and write capacity for a global secondary index on a table with on-demand billing mode');
    }

    if (this.billingMode === BillingMode.PROVISIONED && !props.readCapacity) {
      throw new Error(`You must specify 'readCapacity' on a global secondary index when the billing mode is ${BillingMode.PROVISIONED}`);
    }

    const globalSecondaryIndex = this.configureGlobalSecondaryIndex(props);
    this._globalSecondaryIndexes.set(props.indexName, globalSecondaryIndex);
  }

  /**
   * Add a local secondary index to the global table.
   *
   * @param props the properties of the local secondary index to add
   */
  public addLocalSecondaryIndex(props: LocalSecondaryIndexPropsV2) {
    this.validateIndexName(props.indexName);

    if (this._localSecondaryIndexes.size > MAX_LSI_COUNT) {
      throw new Error(`A table can only have a maximum of ${MAX_LSI_COUNT} local secondary indexes`);
    }

    const localSecondaryIndex = this.configureLocalSecondaryIndex(props);
    this._localSecondaryIndexes.set(props.indexName, localSecondaryIndex);
  }

  /**
   * Add a replica table to the global table.
   *
   * @param props the properties of the replica table to add
   */
  public addReplica(props: ReplicaTableProps) {
    if (Token.isUnresolved(props.region)) {
      throw new Error('Replica table `region` value must not be a token');
    }

    if (this._replicaTables.has(props.region)) {
      throw new Error(`Duplicate replica region, ${props.region}, is not allowed`);
    }

    this._replicaTables.set(props.region, props);
  }

  private get globalSecondaryIndexes() {
    return Array.from(this._globalSecondaryIndexes.values());
  }

  private get localSecondaryIndexes() {
    return Array.from(this._localSecondaryIndexes.values());
  }

  private get replicaTables() {
    const replicaTables: CfnGlobalTable.ReplicaSpecificationProperty[] = [];

    if (!this._replicaTables.has(this.deploymentRegion)) {
      replicaTables.push(this.configureReplicaTable({ region: this.deploymentRegion }));
    }

    for (const replicaTable of this._replicaTables.values()) {
      replicaTables.push(this.configureReplicaTable(replicaTable));
    }

    return replicaTables;
  }

  private configureReplicaTable(replicaTable: ReplicaTableProps): CfnGlobalTable.ReplicaSpecificationProperty {
    const pointInTimeRecovery = replicaTable.pointInTimeRecovery ?? this.globalTableOptions.pointInTimeRecovery;
    const contributorInsights = replicaTable.contributorInsights ?? this.globalTableOptions.contributorInsights;
    const readProvisionedThroughputSettings = replicaTable.readCapacity
      ? this.configureReadProvisioning(replicaTable.readCapacity)
      : this.tableReadProvisioning;

    const globalSecondaryIndexes: CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty[] = [];
    for (const indexName of this._globalSecondaryIndexes.keys()) {
      if (!this._globalSecondaryIndexes.has(indexName)) {
        throw new Error();
      }

      const replicaGsiOptions = replicaTable.globalSecondaryIndexOptions
        ? replicaTable.globalSecondaryIndexOptions[indexName]
        : undefined;

      if (this.billingMode === BillingMode.PAY_PER_REQUEST && replicaGsiOptions?.readCapacity) {
        throw new Error(`You cannot configure replica global secondary index, ${indexName}, 'readCapacity' when table billing mode is ${BillingMode.PAY_PER_REQUEST}`);
      }

      const replicaGsi = this.configureReplicaGlobalSecondaryIndex({
        indexName,
        contributorInsights: replicaGsiOptions?.contributorInsights ?? this.globalTableOptions.contributorInsights,
        readCapacity: replicaGsiOptions?.readCapacity ?? this.globalSecondaryReadCapacitys.get(indexName),
      });

      globalSecondaryIndexes.push(replicaGsi);
    }

    return {
      region: replicaTable.region,
      readProvisionedThroughputSettings,
      deletionProtectionEnabled: replicaTable.deletionProtection ?? this.globalTableOptions.deletionProtection,
      tableClass: replicaTable.tableClass ?? this.globalTableOptions.tableClass,
      globalSecondaryIndexes: globalSecondaryIndexes.length > 0
        ? globalSecondaryIndexes
        : undefined,
      kinesisStreamSpecification: replicaTable.kinesisStream
        ? { streamArn: replicaTable.kinesisStream.streamArn }
        : undefined,
      contributorInsightsSpecification: contributorInsights !== undefined
        ? { enabled: contributorInsights }
        : undefined,
      pointInTimeRecoverySpecification: pointInTimeRecovery !== undefined
        ? { pointInTimeRecoveryEnabled: pointInTimeRecovery }
        : undefined,
    };
  }

  private configureGlobalSecondaryIndex(gsi: GlobalSecondaryIndexPropsV2): CfnGlobalTable.GlobalSecondaryIndexProperty {
    const indexKeySchema = this.buildIndexKeySchema(gsi.partitionKey, gsi.sortKey);
    const indexProjection = this.buildIndexProjection(gsi);

    if (gsi.readCapacity) {
      this.globalSecondaryReadCapacitys.set(gsi.indexName, gsi.readCapacity);
    }

    const writeProvisionedThroughputSettings = gsi.writeCapacity
      ? this.configureWriteProvisioning(gsi.writeCapacity)
      : this.tableWriteProvisioning;

    return {
      indexName: gsi.indexName,
      keySchema: indexKeySchema,
      projection: indexProjection,
      writeProvisionedThroughputSettings,
    };
  }

  private configureReplicaGlobalSecondaryIndex(gsi: ReplicaGlobalSecondaryIndexOptions):
  CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty {
    return {
      indexName: gsi.indexName,
      readProvisionedThroughputSettings: gsi.readCapacity
        ? this.configureReadProvisioning(gsi.readCapacity)
        : this.tableReadProvisioning,
      contributorInsightsSpecification: gsi.contributorInsights !== undefined
        ? { enabled: gsi.contributorInsights }
        : undefined,
    };
  }

  private configureLocalSecondaryIndex(lsi: LocalSecondaryIndexPropsV2): CfnGlobalTable.LocalSecondaryIndexProperty {
    const indexKeySchema = this.buildIndexKeySchema(this.tablePartitionKey, lsi.sortKey);
    const indexProjection = this.buildIndexProjection(lsi);

    return {
      indexName: lsi.indexName,
      keySchema: indexKeySchema,
      projection: indexProjection,
    };
  }

  private configureWriteProvisioning(writeCapacity: Capacity): CfnGlobalTable.WriteProvisionedThroughputSettingsProperty {
    if (writeCapacity.mode === CapacityMode.FIXED) {
      throw new Error('Write capacity must be configured using autoscaled capacity mode');
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

  private buildIndexKeySchema(partitionKey: Attribute, sortKey?: Attribute) {
    this.addAttributeDefinition(partitionKey);
    const indexKeySchema: CfnGlobalTable.KeySchemaProperty[] = [
      { attributeName: partitionKey.name, keyType: HASH_KEY_TYPE },
    ];

    if (sortKey) {
      indexKeySchema.push({ attributeName: sortKey.name, keyType: RANGE_KEY_TYPE });
    }

    return indexKeySchema;
  }

  private buildIndexProjection(props: SecondaryIndexProps): CfnGlobalTable.ProjectionProperty {
    if (props.projectionType === ProjectionType.INCLUDE && !props.nonKeyAttributes) {
      throw new Error(`Non-key attributes should be specified when using ${ProjectionType.INCLUDE} projection type`);
    }

    if (props.projectionType !== ProjectionType.INCLUDE && props.nonKeyAttributes) {
      throw new Error(`Non-key attributes should not be specified when not using ${ProjectionType.INCLUDE} projection type`);
    }

    if (props.nonKeyAttributes) {
      this.validateNonKeyAttributes(props.nonKeyAttributes);
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
    // attribute definitions cannot be redefined
    if (existingAttributeDef && existingAttributeDef.attributeType !== type) {
      throw new Error(`Unable to specify ${name} as ${type} because it was already defined as ${existingAttributeDef.attributeType}`);
    }

    if (!existingAttributeDef) {
      this.attributeDefinitions.push({ attributeName: name, attributeType: type });
    }
  }

  private validateIndexName(indexName: string) {
    if (this._globalSecondaryIndexes.has(indexName) || this._localSecondaryIndexes.has(indexName)) {
      throw new Error(`Duplicate secondary index name, ${indexName}, is not allowed`);
    }
  }

  private validateNonKeyAttributes(nonKeyAttributes: string[]) {
    if (this.nonKeyAttributes.size + nonKeyAttributes.length > MAX_NON_KEY_ATTRIBUTES) {
      throw new Error(`The maximum number of nonKeyAttributes across all secondary indexes is ${MAX_NON_KEY_ATTRIBUTES}`);
    }
  }
}

export class Billing {
  public static onDemand() {
    return new Billing(BillingMode.PAY_PER_REQUEST);
  }

  public static provisioned(options: ThroughputOptions) {
    return new Billing(BillingMode.PROVISIONED, options);
  }

  public readonly mode: string;
  private readonly _readCapacity?: Capacity;
  private readonly _writeCapacity?: Capacity;

  public get readCapacity() {
    if (!this._readCapacity) {
      throw new Error();
    }
    return this._readCapacity;
  }

  public get writeCapacity() {
    if (!this._writeCapacity) {
      throw new Error();
    }
    return this._writeCapacity;
  }

  private constructor(mode: string, options?: ThroughputOptions) {
    this.mode = mode;
    this._readCapacity = options?.readCapacity;
    this._writeCapacity = options?.writeCapacity;
  }
}

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
      throw new Error(`Capacity units are not configured for ${CapacityMode.AUTOSCALED} capacity mode`);
    }
    return this._units;
  }

  public get minCapacity() {
    if (this._minCapacity === undefined) {
      throw new Error(`Minimum capacity is not configured for ${CapacityMode.FIXED} capacity mode`);
    }
    return this._minCapacity;
  }

  public get maxCapacity() {
    if (this._maxCapacity === undefined) {
      throw new Error(`Maximum capacity is not configured for ${CapacityMode.FIXED} capacity mode`);
    }
    return this._maxCapacity;
  }

  public get targetUtilizationPercent() {
    if (this.mode === CapacityMode.FIXED) {
      throw new Error(`Target utilization percent is not configured for ${CapacityMode.FIXED} capacity mode`);
    }
    return this._targetUtilizationPercent ?? DEFAULT_TARGET_UTILIZATION;
  }

  private constructor(mode: string, options: CapacityConfigOptions) {
    this.mode = mode;
    this._units = options.units;
    this._minCapacity = options.minCapacity;
    this._maxCapacity = options.maxCapacity;
    this._targetUtilizationPercent = options.targetUtilizationPercent;
  }
}

export class TableEncryptionV2 {}
