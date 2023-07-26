import { Construct } from 'constructs';
import { CfnGlobalTable } from './dynamodb.generated';
import {
  Attribute, SchemaOptions, TableClass, SecondaryIndexProps,
  BillingMode, ProjectionType,
} from './shared';
import { IStream } from '../../aws-kinesis';
import { IResource, Lazy, RemovalPolicy, Resource, Token } from '../../core';

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
  readonly tableId: string;
  readonly tableStreamArn: string;
}

export interface GlobalTableAttributes {}

abstract class GlobalTableBase extends Resource implements IGlobalTable {
  public abstract readonly tableArn: string;
  public abstract readonly tableName: string;
  public abstract readonly tableId: string;
  public abstract readonly tableStreamArn: string;
}

export class GlobalTable extends GlobalTableBase {
  public readonly tableArn: string;
  public readonly tableName: string;
  public readonly tableId: string;
  public readonly tableStreamArn: string;

  private readonly tablePartitionKey: Attribute;
  private readonly billingMode: string;
  private readonly tableReadCapacity?: Capacity;
  private readonly tableWriteProvisioning?: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty;
  private readonly keySchema: CfnGlobalTable.KeySchemaProperty[] = [];
  private readonly attributeDefinitions: CfnGlobalTable.AttributeDefinitionProperty[] = [];
  private readonly nonKeyAttributes = new Set<string>();
  private readonly resolvedReplicaRegions = new Map<string, boolean>();
  private readonly replicaTables: ReplicaTableProps[];
  private readonly secondaryIndexSchemas = new Map<string, boolean>();
  private readonly globalSecondaryIndexes: GlobalSecondaryIndexPropsV2[];
  private readonly localSecondaryIndexes: LocalSecondaryIndexPropsV2[];

  public constructor(scope: Construct, id: string, props: GlobalTableProps) {
    super(scope, id, { physicalName: props.tableName });

    this.tablePartitionKey = props.partitionKey;

    if (props.billing) {
      this.billingMode = props.billing.mode;
      if (this.billingMode === BillingMode.PROVISIONED) {
        this.tableReadCapacity = props.billing.readCapacity;
        // writeCapacity has to be provided when billing mode is provisioned
        this.tableWriteProvisioning = this.configureWriteProvisioning(props.billing.writeCapacity);
      }
    } else {
      this.billingMode = BillingMode.PAY_PER_REQUEST;
    }

    this.addKey(props.partitionKey, HASH_KEY_TYPE);
    if (props.sortKey) {
      this.addKey(props.sortKey, RANGE_KEY_TYPE);
    }

    this.replicaTables = props.replicas ? props.replicas : [];
    this.globalSecondaryIndexes = props.globalSecondaryIndexes ? props.globalSecondaryIndexes : [];
    this.localSecondaryIndexes = props.localSecondaryIndexes ? props.localSecondaryIndexes : [];

    const resource = new CfnGlobalTable(this, 'Resource', {
      tableName: this.physicalName,
      keySchema: this.keySchema,
      attributeDefinitions: Lazy.any({ produce: () => this.attributeDefinitions }),
      replicas: Lazy.any({ produce: () => this.configureReplicaTables(props) }),
      globalSecondaryIndexes: Lazy.any({ produce: () => this.configureGlobalSecondaryIndexes() }, { omitEmptyArray: true }),
      localSecondaryIndexes: Lazy.any({ produce: () => this.configureLocalSecondaryIndexes() }, { omitEmptyArray: true }),
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
   * @param props the properties of a global secondary index
   */
  public addGlobalSecondaryIndex(props: GlobalSecondaryIndexPropsV2) {
    this.globalSecondaryIndexes.push(props);
  }

  /**
   * Add a local secondary index to the global table.
   *
   * @param props the properties of a local secondary index
   */
  public addLocalSecondaryIndex(props: LocalSecondaryIndexPropsV2) {
    this.localSecondaryIndexes.push(props);
  }

  private configureReplicaTables(props: TableOptions) {
    const replicaTables: CfnGlobalTable.ReplicaSpecificationProperty[] = [];

    for (const replicaTable of this.replicaTables) {
      const region = replicaTable.region;
      const isRegionResolved = !Token.isUnresolved(region);
      if (isRegionResolved && this.resolvedReplicaRegions.has(region)) {
        throw new Error(`Duplicate replica region, ${region}, is not allowed`);
      }

      if (isRegionResolved) {
        this.resolvedReplicaRegions.set(region, true);
      }

      let readProvisionedThroughputSettings = undefined;
      if (replicaTable.readCapacity) {
        readProvisionedThroughputSettings = this.configureReadProvisioning(replicaTable.readCapacity);
      } else if (this.tableReadCapacity) {
        readProvisionedThroughputSettings = this.configureReadProvisioning(this.tableReadCapacity);
      }

      const pointInTimeRecovery = replicaTable.pointInTimeRecovery ?? props.pointInTimeRecovery;
      const contributorInsights = replicaTable.contributorInsights ?? props.contributorInsights;

      replicaTables.push({
        region,
        readProvisionedThroughputSettings,
        deletionProtectionEnabled: replicaTable.contributorInsights ?? props.contributorInsights,
        tableClass: replicaTable.tableClass ?? props.tableClass,
        kinesisStreamSpecification: replicaTable.kinesisStream
          ? { streamArn: replicaTable.kinesisStream.streamArn }
          : undefined,
        contributorInsightsSpecification: contributorInsights !== undefined
          ? { enabled: contributorInsights }
          : undefined,
        pointInTimeRecoverySpecification: pointInTimeRecovery !== undefined
          ? { pointInTimeRecoveryEnabled: pointInTimeRecovery }
          : undefined,
      });
    }

    return replicaTables;
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

  private configureGlobalSecondaryIndexes() {
    const globalSecondaryIndexes: CfnGlobalTable.GlobalSecondaryIndexProperty[] = [];
    if (this.globalSecondaryIndexes.length > MAX_GSI_COUNT) {
      throw new Error(`A table can only have a maximum of ${MAX_GSI_COUNT} global secondary indexes`);
    }

    for (const index of this.globalSecondaryIndexes) {
      this.validateIndexName(index.indexName);
      if (this.billingMode === BillingMode.PAY_PER_REQUEST && (index.readCapacity || index.writeCapacity)) {
        throw new Error('You cannot provision read and write capacity for a global secondary index on a table with on-demand billing mode');
      }

      const indexKeySchema = this.buildIndexKeySchema(index.partitionKey, index.sortKey);
      const indexProjection = this.buildIndexProjection(index);

      let indexWriteProvisioning = undefined;
      if (this.billingMode === BillingMode.PROVISIONED && index.writeCapacity) {
        indexWriteProvisioning = this.configureWriteProvisioning(index.writeCapacity);
      }

      globalSecondaryIndexes.push({
        indexName: index.indexName,
        keySchema: indexKeySchema,
        projection: indexProjection,
        writeProvisionedThroughputSettings: indexWriteProvisioning ?? this.tableWriteProvisioning,
      });

      this.secondaryIndexSchemas.set(index.indexName, true);
    }

    return globalSecondaryIndexes;
  }

  private configureLocalSecondaryIndexes() {
    const localSecondaryIndexes: CfnGlobalTable.LocalSecondaryIndexProperty[] = [];
    if (this.localSecondaryIndexes.length > MAX_LSI_COUNT) {
      throw new Error(`A table can only have a maximum of ${MAX_LSI_COUNT} local secondary indexes`);
    }

    for (const index of this.localSecondaryIndexes) {
      this.validateIndexName(index.indexName);

      const indexKeySchema = this.buildIndexKeySchema(this.tablePartitionKey, index.sortKey);
      const indexProjection = this.buildIndexProjection(index);

      localSecondaryIndexes.push({
        indexName: index.indexName,
        keySchema: indexKeySchema,
        projection: indexProjection,
      });

      this.secondaryIndexSchemas.set(index.indexName, true);
    }

    return localSecondaryIndexes;
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
    if (this.secondaryIndexSchemas.has(indexName)) {
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
