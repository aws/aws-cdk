import { Construct } from 'constructs';
import { Billing } from './billing';
import { Capacity } from './capacity';
import { CfnGlobalTable } from './dynamodb.generated';
import { TableEncryptionV2 } from './encryption';
import {
  Attribute,
  BillingMode,
  LocalSecondaryIndexProps,
  ProjectionType,
  SecondaryIndexProps,
  StreamViewType,
  TableClass,
  WarmThroughput,
} from './shared';
import { ITableV2, TableBaseV2 } from './table-v2-base';
import { PolicyDocument } from '../../aws-iam';
import { IStream } from '../../aws-kinesis';
import { IKey, Key } from '../../aws-kms';
import {
  ArnFormat,
  CfnTag,
  FeatureFlags,
  Lazy,
  PhysicalName,
  RemovalPolicy,
  Stack,
  TagManager,
  TagType,
  Token,
} from '../../core';
import * as cxapi from '../../cx-api';

const HASH_KEY_TYPE = 'HASH';
const RANGE_KEY_TYPE = 'RANGE';
const MAX_GSI_COUNT = 20;
const MAX_LSI_COUNT = 5;
const MAX_NON_KEY_ATTRIBUTES = 100;

/**
 * Options used to configure global secondary indexes on a replica table.
 */
export interface ReplicaGlobalSecondaryIndexOptions {
  /**
   * Whether CloudWatch contributor insights is enabled for a specific global secondary
   * index on a replica table.
   *
   * @default - inherited from the primary table
   */
  readonly contributorInsights?: boolean;

  /**
   * The read capacity for a specific global secondary index on a replica table.
   *
   * Note: This can only be configured if primary table billing is provisioned.
   *
   * @default - inherited from the primary table
   */
  readonly readCapacity?: Capacity;

  /**
   * The maximum read request units for a specific global secondary index on a replica table.
   *
   * Note: This can only be configured if primary table billing is PAY_PER_REQUEST.
   *
   * @default - inherited from the primary table
   */
  readonly maxReadRequestUnits?: number;
}

/**
 * Properties used to configure a global secondary index.
 */
export interface GlobalSecondaryIndexPropsV2 extends SecondaryIndexProps {
  /**
   * Partition key attribute definition.
   */
  readonly partitionKey: Attribute;

  /**
   * Sort key attribute definition.
   *
   * @default - no sort key
   */
  readonly sortKey?: Attribute;

  /**
   * The read capacity.
   *
   * Note: This can only be configured if the primary table billing is provisioned.
   *
   * @default - inherited from the primary table.
   */
  readonly readCapacity?: Capacity;

  /**
   * The write capacity.
   *
   * Note: This can only be configured if the primary table billing is provisioned.
   *
   * @default - inherited from the primary table.
   */
  readonly writeCapacity?: Capacity;

  /**
   * The maximum read request units.
   *
   * Note: This can only be configured if the primary table billing is PAY_PER_REQUEST.
   *
   * @default - inherited from the primary table.
   */
  readonly maxReadRequestUnits?: number;

  /**
   * The maximum write request units.
   *
   * Note: This can only be configured if the primary table billing is PAY_PER_REQUEST.
   *
   * @default - inherited from the primary table.
   */
  readonly maxWriteRequestUnits?: number;

  /**
   * The warm throughput configuration for the global secondary index.
   *
   * @default - no warm throughput is configured
   */
  readonly warmThroughput?: WarmThroughput;
}

/**
 * Options used to configure a DynamoDB table.
 */
export interface TableOptionsV2 {
  /**
   * Whether CloudWatch contributor insights is enabled.
   *
   * @default false
   */
  readonly contributorInsights?: boolean;

  /**
   * Whether deletion protection is enabled.
   *
   * @default false
   */
  readonly deletionProtection?: boolean;

  /**
   * Whether point-in-time recovery is enabled.
   *
   * @default false
   */
  readonly pointInTimeRecovery?: boolean;

  /**
   * The table class.
   *
   * @default TableClass.STANDARD
   */
  readonly tableClass?: TableClass;

  /**
   * Kinesis Data Stream to capture item level changes.
   *
   * @default - no Kinesis Data Stream
   */
  readonly kinesisStream?: IStream;

  /**
   * Tags to be applied to the primary table (default replica table).
   *
   * @default - no tags
   */
  readonly tags?: CfnTag[];

  /**
   * Resource policy to assign to DynamoDB Table.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-resourcepolicy
   * @default - No resource policy statements are added to the created table.
   */
  readonly resourcePolicy?: PolicyDocument;
}

/**
 * Properties used to configure a replica table.
 */
export interface ReplicaTableProps extends TableOptionsV2 {
  /**
   * The region that the replica table will be created in.
   */
  readonly region: string;

  /**
   * The read capacity.
   *
   * Note: This can only be configured if the primary table billing is provisioned.
   *
   * @default - inherited from the primary table
   */
  readonly readCapacity?: Capacity;

  /**
   * The maxium read request units.
   *
   * Note: This can only be configured if the primary table billing is PAY_PER_REQUEST.
   *
   * @default - inherited from the primary table
   */
  readonly maxReadRequestUnits?: number;

  /**
   * Options used to configure global secondary index properties.
   *
   * @default - inherited from the primary table
   */
  readonly globalSecondaryIndexOptions?: { [indexName: string]: ReplicaGlobalSecondaryIndexOptions };
}

/**
 * Properties used to configure a DynamoDB table.
 */
export interface TablePropsV2 extends TableOptionsV2 {
  /**
   * Partition key attribute definition.
   */
  readonly partitionKey: Attribute;

  /**
   * Sort key attribute definition.
   *
   * @default - no sort key
   */
  readonly sortKey?: Attribute;

  /**
   * The name of the table.
   *
   * @default - generated by CloudFormation
   */
  readonly tableName?: string;

  /**
   * The name of the TTL attribute.
   *
   * @default - TTL is disabled
   */
  readonly timeToLiveAttribute?: string;

  /**
   * When an item in the table is modified, StreamViewType determines what information is
   * written to the stream.
   *
   * @default - streams are disabled if replicas are not configured and this property is
   * not specified. If this property is not specified when replicas are configured, then
   * NEW_AND_OLD_IMAGES will be the StreamViewType for all replicas
   */
  readonly dynamoStream?: StreamViewType;

  /**
   * The removal policy applied to the table.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * The billing mode and capacity settings to apply to the table.
   *
   * @default Billing.onDemand()
   */
  readonly billing?: Billing;

  /**
   * Replica tables to deploy with the primary table.
   *
   * Note: Adding replica tables allows you to use your table as a global table. You
   * cannot specify a replica table in the region that the primary table will be deployed
   * to. Replica tables will only be supported if the stack deployment region is defined.
   *
   * @default - no replica tables
   */
  readonly replicas?: ReplicaTableProps[];

  /**
   * Global secondary indexes.
   *
   * Note: You can provide a maximum of 20 global secondary indexes.
   *
   * @default - no global secondary indexes
   */
  readonly globalSecondaryIndexes?: GlobalSecondaryIndexPropsV2[];

  /**
   * Local secondary indexes.
   *
   * Note: You can only provide a maximum of 5 local secondary indexes.
   *
   * @default - no local secondary indexes
   */
  readonly localSecondaryIndexes?: LocalSecondaryIndexProps[];

  /**
   * The server-side encryption.
   *
   * @default TableEncryptionV2.dynamoOwnedKey()
   */
  readonly encryption?: TableEncryptionV2;

  /**
   * The warm throughput configuration for the table.
   *
   * @default - no warm throughput is configured
   */
  readonly warmThroughput?: WarmThroughput;
}

/**
 * Attributes of a DynamoDB table.
 */
export interface TableAttributesV2 {
  /**
   * The ARN of the table.
   *
   * Note: You must specify this or the `tableName`.
   *
   * @default - table arn generated using `tableName` and region of stack
   */
  readonly tableArn?: string;

  /**
   * The name of the table.
   *
   * Note: You must specify this or the `tableArn`.
   *
   * @default - table name retrieved from provided `tableArn`
   */
  readonly tableName?: string;

  /**
   * The ID of the table.
   *
   * @default - no table id
   */
  readonly tableId?: string;

  /**
   * The stream ARN of the table.
   *
   * @default - no table stream ARN
   */
  readonly tableStreamArn?: string;

  /**
   * KMS encryption key for the table.
   *
   * @default - no KMS encryption key
   */
  readonly encryptionKey?: IKey;

  /**
   * The name of the global indexes set for the table.
   *
   * Note: You must set either this property or `localIndexes` if you want permissions
   * to be granted for indexes as well as the table itself.
   *
   * @default - no global indexes
   */
  readonly globalIndexes?: string[];

  /**
   * The name of the local indexes set for the table.
   *
   * Note: You must set either this property or `globalIndexes` if you want permissions
   * to be granted for indexes as well as the table itself.
   *
   * @default - no local indexes
   */
  readonly localIndexes?: string[];

  /**
   * Whether or not to grant permissions for all indexes of the table.
   *
   * Note: If false, permissions will only be granted to indexes when `globalIndexes`
   * or `localIndexes` is specified.
   *
   * @default false
   */
  readonly grantIndexPermissions?: boolean;
}

/**
 * A DynamoDB Table.
 */
export class TableV2 extends TableBaseV2 {
  /**
   * Creates a Table construct that represents an external table via table name.
   *
   * @param scope the parent creating construct (usually `this`)
   * @param id the construct's name
   * @param tableName the table's name
   */
  public static fromTableName(scope: Construct, id: string, tableName: string): ITableV2 {
    return TableV2.fromTableAttributes(scope, id, { tableName });
  }

  /**
   * Creates a Table construct that represents an external table via table ARN.
   *
   * @param scope the parent creating construct (usually `this`)
   * @param id the construct's name
   * @param tableArn the table's ARN
   */
  public static fromTableArn(scope: Construct, id: string, tableArn: string): ITableV2 {
    return TableV2.fromTableAttributes(scope, id, { tableArn });
  }

  /**
   * Creates a Table construct that represents an external table.
   *
   * @param scope the parent creating construct (usually `this`)
   * @param id the construct's name
   * @param attrs attributes of the table
   */
  public static fromTableAttributes(scope: Construct, id: string, attrs: TableAttributesV2): ITableV2 {
    class Import extends TableBaseV2 {
      public readonly tableArn: string;
      public readonly tableName: string;
      public readonly tableId?: string;
      public readonly tableStreamArn?: string;
      public readonly encryptionKey?: IKey;
      public readonly resourcePolicy?: PolicyDocument;

      protected readonly region: string;
      protected readonly hasIndex = (attrs.grantIndexPermissions ?? false) ||
        (attrs.globalIndexes ?? []).length > 0 ||
        (attrs.localIndexes ?? []).length > 0;

      public constructor(tableArn: string, tableName: string, tableId?: string, tableStreamArn?: string, resourcePolicy?: PolicyDocument) {
        super(scope, id, { environmentFromArn: tableArn });

        const resourceRegion = stack.splitArn(tableArn, ArnFormat.SLASH_RESOURCE_NAME).region;
        if (!resourceRegion) {
          throw new Error('Table ARN must be of the form: arn:<partition>:dynamodb:<region>:<account>:table/<table-name>');
        }

        this.region = resourceRegion;
        this.tableArn = tableArn;
        this.tableName = tableName;
        this.tableId = tableId;
        this.tableStreamArn = tableStreamArn;
        this.encryptionKey = attrs.encryptionKey;
        this.resourcePolicy = resourcePolicy;
      }
    }

    let tableName: string;
    let tableArn: string;
    const stack = Stack.of(scope);
    if (!attrs.tableArn) {
      if (!attrs.tableName) {
        throw new Error('At least one of `tableArn` or `tableName` must be provided');
      }

      tableName = attrs.tableName;
      tableArn = stack.formatArn({
        service: 'dynamodb',
        resource: 'table',
        resourceName: tableName,
      });
    } else {
      if (attrs.tableName) {
        throw new Error('Only one of `tableArn` or `tableName` can be provided, but not both');
      }

      tableArn = attrs.tableArn;
      const resourceName = stack.splitArn(tableArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
      if (!resourceName) {
        throw new Error('Table ARN must be of the form: arn:<partition>:dynamodb:<region>:<account>:table/<table-name>');
      }
      tableName = resourceName;
    }

    return new Import(tableArn, tableName, attrs.tableId, attrs.tableStreamArn);
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
  public readonly tableStreamArn?: string;

  /**
   * @attribute
   */
  public readonly tableId?: string;

  public readonly encryptionKey?: IKey;

  /**
   * @attribute
   */
  public resourcePolicy?: PolicyDocument;

  protected readonly region: string;

  protected readonly tags: TagManager;

  private readonly billingMode: string;
  private readonly partitionKey: Attribute;
  private readonly hasSortKey: boolean;
  private readonly tableOptions: TableOptionsV2;
  private readonly encryption?: TableEncryptionV2;

  private readonly keySchema: CfnGlobalTable.KeySchemaProperty[] = [];
  private readonly attributeDefinitions: CfnGlobalTable.AttributeDefinitionProperty[] = [];
  private readonly nonKeyAttributes = new Set<string>();

  private readonly readProvisioning?: CfnGlobalTable.ReadProvisionedThroughputSettingsProperty;
  private readonly writeProvisioning?: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty;

  private readonly maxReadRequestUnits?: number;
  private readonly maxWriteRequestUnits?: number;

  private readonly replicaTables = new Map<string, ReplicaTableProps>();
  private readonly replicaKeys: { [region: string]: IKey } = {};
  private readonly replicaTableArns: string[] = [];
  private readonly replicaStreamArns: string[] = [];

  private readonly globalSecondaryIndexes = new Map<string, CfnGlobalTable.GlobalSecondaryIndexProperty>();
  private readonly localSecondaryIndexes = new Map<string, CfnGlobalTable.LocalSecondaryIndexProperty>();
  private readonly globalSecondaryIndexReadCapacitys = new Map<string, Capacity>();
  private readonly globalSecondaryIndexMaxReadUnits = new Map<string, number>();

  public constructor(scope: Construct, id: string, props: TablePropsV2) {
    super(scope, id, { physicalName: props.tableName ?? PhysicalName.GENERATE_IF_NEEDED });

    this.tableOptions = props;
    this.partitionKey = props.partitionKey;
    this.hasSortKey = props.sortKey !== undefined;
    this.region = this.stack.region;
    this.tags = new TagManager(TagType.STANDARD, CfnGlobalTable.CFN_RESOURCE_TYPE_NAME);

    this.encryption = props.encryption;
    this.encryptionKey = this.encryption?.tableKey;
    this.configureReplicaKeys(this.encryption?.replicaKeyArns);

    this.addKey(props.partitionKey, HASH_KEY_TYPE);
    if (props.sortKey) {
      this.addKey(props.sortKey, RANGE_KEY_TYPE);
    }

    if (props.billing?.mode === BillingMode.PAY_PER_REQUEST || props.billing?.mode === undefined) {
      this.maxReadRequestUnits = props.billing?._renderReadCapacity();
      this.maxWriteRequestUnits = props.billing?._renderWriteCapacity();
      this.billingMode = BillingMode.PAY_PER_REQUEST;
    } else {
      this.readProvisioning = props.billing?._renderReadCapacity();
      this.writeProvisioning = props.billing?._renderWriteCapacity();
      this.billingMode = props.billing.mode;
    }

    props.globalSecondaryIndexes?.forEach(gsi => this.addGlobalSecondaryIndex(gsi));
    props.localSecondaryIndexes?.forEach(lsi => this.addLocalSecondaryIndex(lsi));

    const resource = new CfnGlobalTable(this, 'Resource', {
      tableName: this.physicalName,
      keySchema: this.keySchema,
      attributeDefinitions: Lazy.any({ produce: () => this.attributeDefinitions }),
      replicas: Lazy.any({ produce: () => this.renderReplicaTables() }),
      globalSecondaryIndexes: Lazy.any({ produce: () => this.renderGlobalIndexes() }, { omitEmptyArray: true }),
      localSecondaryIndexes: Lazy.any({ produce: () => this.renderLocalIndexes() }, { omitEmptyArray: true }),
      billingMode: this.billingMode,
      writeProvisionedThroughputSettings: this.writeProvisioning,
      writeOnDemandThroughputSettings: this.maxWriteRequestUnits
        ? { maxWriteRequestUnits: this.maxWriteRequestUnits }
        : undefined,
      streamSpecification: Lazy.any(
        { produce: () => props.dynamoStream ? { streamViewType: props.dynamoStream } : this.renderStreamSpecification() },
      ),
      sseSpecification: this.encryption?._renderSseSpecification(),
      timeToLiveSpecification: props.timeToLiveAttribute
        ? { attributeName: props.timeToLiveAttribute, enabled: true }
        : undefined,
      warmThroughput: props.warmThroughput ?? undefined,
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

    props.replicas?.forEach(replica => this.addReplica(replica));

    if (props.tableName) {
      this.node.addMetadata('aws:cdk:hasPhysicalName', this.tableName);
    }
  }

  /**
   * Add a replica table.
   *
   * Note: Adding a replica table will allow you to use your table as a global table.
   *
   * @param props the properties of the replica table to add
   */
  public addReplica(props: ReplicaTableProps) {
    this.validateReplica(props);

    const replicaArn = this.stack.formatArn({
      region: props.region,
      resource: 'table',
      service: 'dynamodb',
      resourceName: this.tableName,
    });
    this.replicaTableArns.push(replicaArn);

    const replicaStreamArn = `${replicaArn}/stream/*`;
    this.replicaStreamArns.push(replicaStreamArn);

    this.replicaTables.set(props.region, props);
  }

  /**
   * Add a global secondary index to the table.
   *
   * Note: Global secondary indexes will be inherited by all replica tables.
   *
   * @param props the properties of the global secondary index
   */
  public addGlobalSecondaryIndex(props: GlobalSecondaryIndexPropsV2) {
    this.validateGlobalSecondaryIndex(props);
    const globalSecondaryIndex = this.configureGlobalSecondaryIndex(props);
    this.globalSecondaryIndexes.set(props.indexName, globalSecondaryIndex);
  }

  /**
   * Add a local secondary index to the table.
   *
   * Note: Local secondary indexes will be inherited by all replica tables.
   *
   * @param props the properties of the local secondary index
   */
  public addLocalSecondaryIndex(props: LocalSecondaryIndexProps) {
    this.validateLocalSecondaryIndex(props);
    const localSecondaryIndex = this.configureLocalSecondaryIndex(props);
    this.localSecondaryIndexes.set(props.indexName, localSecondaryIndex);
  }

  /**
   * Retrieve a replica table.
   *
   * Note: Replica tables are not supported in a region agnostic stack.
   *
   * @param region the region of the replica table
   */
  public replica(region: string): ITableV2 {
    if (Token.isUnresolved(this.stack.region)) {
      throw new Error('Replica tables are not supported in a region agnostic stack');
    }

    if (Token.isUnresolved(region)) {
      throw new Error('Provided `region` cannot be a token');
    }

    if (region === this.stack.region) {
      return this;
    }

    if (!this.replicaTables.has(region)) {
      throw new Error(`No replica table exists in region ${region}`);
    }

    const replicaTableArn = this.replicaTableArns.find(arn => arn.includes(region));
    const replicaStreamArn = this.replicaStreamArns.find(arn => arn.includes(region));

    return TableV2.fromTableAttributes(this, `ReplicaTable${region}`, {
      tableArn: replicaTableArn,
      encryptionKey: this.replicaKeys[region],
      grantIndexPermissions: this.hasIndex,
      tableStreamArn: replicaStreamArn,
    });
  }

  private configureReplicaTable(props: ReplicaTableProps): CfnGlobalTable.ReplicaSpecificationProperty {
    const pointInTimeRecovery = props.pointInTimeRecovery ?? this.tableOptions.pointInTimeRecovery;
    const contributorInsights = props.contributorInsights ?? this.tableOptions.contributorInsights;

    /*
    * Feature flag set as the following may be a breaking change.
    * @see https://github.com/aws/aws-cdk/pull/31097
    * @see https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/cx-api/FEATURE_FLAGS.md
    */
    const resourcePolicy = FeatureFlags.of(this).isEnabled(cxapi.DYNAMODB_TABLEV2_RESOURCE_POLICY_PER_REPLICA)
      ? (props.region === this.region ? this.tableOptions.resourcePolicy : props.resourcePolicy) || undefined
      : props.resourcePolicy ?? this.tableOptions.resourcePolicy;

    const propTags: Record<string, string> = (props.tags ?? []).reduce((p, item) =>
      ({ ...p, [item.key]: item.value }), {},
    );

    const tags: CfnTag[] = Object.entries({
      ...this.tags.tagValues(),
      ...propTags,
    }).map(([k, v]) => ({ key: k, value: v }));

    return {
      region: props.region,
      globalSecondaryIndexes: this.configureReplicaGlobalSecondaryIndexes(props.globalSecondaryIndexOptions),
      deletionProtectionEnabled: props.deletionProtection ?? this.tableOptions.deletionProtection,
      tableClass: props.tableClass ?? this.tableOptions.tableClass,
      sseSpecification: this.encryption?._renderReplicaSseSpecification(this, props.region),
      kinesisStreamSpecification: props.kinesisStream
        ? { streamArn: props.kinesisStream.streamArn }
        : undefined,
      contributorInsightsSpecification: contributorInsights !== undefined
        ? { enabled: contributorInsights }
        : undefined,
      pointInTimeRecoverySpecification: pointInTimeRecovery !== undefined
        ? { pointInTimeRecoveryEnabled: pointInTimeRecovery }
        : undefined,
      readProvisionedThroughputSettings: props.readCapacity
        ? props.readCapacity._renderReadCapacity()
        : this.readProvisioning,
      tags: tags.length === 0 ? undefined : tags,
      readOnDemandThroughputSettings: props.maxReadRequestUnits
        ? { maxReadRequestUnits: props.maxReadRequestUnits }
        : this.maxReadRequestUnits
          ? { maxReadRequestUnits: this.maxReadRequestUnits }
          : undefined,
      resourcePolicy: resourcePolicy
        ? { policyDocument: resourcePolicy }
        : undefined,
    };
  }

  private configureGlobalSecondaryIndex(props: GlobalSecondaryIndexPropsV2): CfnGlobalTable.GlobalSecondaryIndexProperty {
    const keySchema = this.configureIndexKeySchema(props.partitionKey, props.sortKey);
    const projection = this.configureIndexProjection(props);

    props.readCapacity && this.globalSecondaryIndexReadCapacitys.set(props.indexName, props.readCapacity);
    const writeProvisionedThroughputSettings = props.writeCapacity ? props.writeCapacity._renderWriteCapacity() : this.writeProvisioning;

    props.maxReadRequestUnits && this.globalSecondaryIndexMaxReadUnits.set(props.indexName, props.maxReadRequestUnits);

    const warmThroughput = props.warmThroughput ?? undefined;

    const writeOnDemandThroughputSettings: CfnGlobalTable.WriteOnDemandThroughputSettingsProperty | undefined = props.maxWriteRequestUnits
      ? { maxWriteRequestUnits: props.maxWriteRequestUnits }
      : undefined;

    return {
      indexName: props.indexName,
      keySchema,
      projection,
      writeProvisionedThroughputSettings,
      writeOnDemandThroughputSettings,
      warmThroughput,
    };
  }

  private configureLocalSecondaryIndex(props: LocalSecondaryIndexProps): CfnGlobalTable.LocalSecondaryIndexProperty {
    const keySchema = this.configureIndexKeySchema(this.partitionKey, props.sortKey);
    const projection = this.configureIndexProjection(props);

    return {
      indexName: props.indexName,
      keySchema,
      projection,
    };
  }

  private configureReplicaGlobalSecondaryIndexes(options: { [indexName: string]: ReplicaGlobalSecondaryIndexOptions } = {}) {
    this.validateReplicaIndexOptions(options);

    const replicaGlobalSecondaryIndexes: CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty[] = [];
    const indexNamesFromOptions = Object.keys(options);

    for (const gsi of this.globalSecondaryIndexes.values()) {
      const indexName = gsi.indexName;
      let contributorInsights = this.tableOptions.contributorInsights;
      let readCapacity = this.globalSecondaryIndexReadCapacitys.get(indexName);
      let maxReadRequestUnits = this.globalSecondaryIndexMaxReadUnits.get(indexName);
      if (indexNamesFromOptions.includes(indexName)) {
        const indexOptions = options[indexName];
        contributorInsights = indexOptions.contributorInsights;
        readCapacity = indexOptions.readCapacity;
        maxReadRequestUnits = indexOptions.maxReadRequestUnits;
      }

      const readProvisionedThroughputSettings = readCapacity?._renderReadCapacity() ?? this.readProvisioning;

      const readOnDemandThroughputSettings: CfnGlobalTable.ReadOnDemandThroughputSettingsProperty | undefined = maxReadRequestUnits
        ? { maxReadRequestUnits: maxReadRequestUnits }
        : undefined;

      replicaGlobalSecondaryIndexes.push({
        indexName,
        readProvisionedThroughputSettings,
        readOnDemandThroughputSettings,
        contributorInsightsSpecification: contributorInsights !== undefined
          ? { enabled: contributorInsights }
          : undefined,
      });
    }

    return replicaGlobalSecondaryIndexes.length > 0 ? replicaGlobalSecondaryIndexes : undefined;
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
    this.validateIndexProjection(props);

    props.nonKeyAttributes?.forEach(attr => this.nonKeyAttributes.add(attr));
    if (this.nonKeyAttributes.size > MAX_NON_KEY_ATTRIBUTES) {
      throw new Error(`The maximum number of 'nonKeyAttributes' across all secondary indexes is ${MAX_NON_KEY_ATTRIBUTES}`);
    }

    return {
      projectionType: props.projectionType ?? ProjectionType.ALL,
      nonKeyAttributes: props.nonKeyAttributes ?? undefined,
    };
  }

  private configureReplicaKeys(replicaKeyArns: { [region: string]: string } = {}) {
    for (const [region, keyArn] of Object.entries(replicaKeyArns)) {
      this.replicaKeys[region] = Key.fromKeyArn(this, `ReplicaKey${region}`, keyArn);
    }
  }

  private renderReplicaTables() {
    const replicaTables: CfnGlobalTable.ReplicaSpecificationProperty[] = [];

    for (const replicaTable of this.replicaTables.values()) {
      replicaTables.push(this.configureReplicaTable(replicaTable));
    }
    replicaTables.push(this.configureReplicaTable({
      region: this.stack.region,
      kinesisStream: this.tableOptions.kinesisStream,
      tags: this.tableOptions.tags,
    }));

    return replicaTables;
  }

  private renderGlobalIndexes() {
    const globalSecondaryIndexes: CfnGlobalTable.GlobalSecondaryIndexProperty[] = [];

    for (const globalSecondaryIndex of this.globalSecondaryIndexes.values()) {
      globalSecondaryIndexes.push(globalSecondaryIndex);
    }

    return globalSecondaryIndexes;
  }

  private renderLocalIndexes() {
    const localSecondaryIndexes: CfnGlobalTable.LocalSecondaryIndexProperty[] = [];

    for (const localSecondaryIndex of this.localSecondaryIndexes.values()) {
      localSecondaryIndexes.push(localSecondaryIndex);
    }

    return localSecondaryIndexes;
  }

  private renderStreamSpecification(): CfnGlobalTable.StreamSpecificationProperty | undefined {
    return this.replicaTables.size > 0 ? { streamViewType: StreamViewType.NEW_AND_OLD_IMAGES } : undefined;
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

  protected get hasIndex() {
    return this.globalSecondaryIndexes.size + this.localSecondaryIndexes.size > 0;
  }

  private validateIndexName(indexName: string) {
    if (this.globalSecondaryIndexes.has(indexName) || this.localSecondaryIndexes.has(indexName)) {
      throw new Error(`Duplicate secondary index name, ${indexName}, is not allowed`);
    }
  }

  private validateIndexProjection(props: SecondaryIndexProps) {
    if (props.projectionType === ProjectionType.INCLUDE && !props.nonKeyAttributes) {
      throw new Error(`Non-key attributes should be specified when using ${ProjectionType.INCLUDE} projection type`);
    }

    if (props.projectionType !== ProjectionType.INCLUDE && props.nonKeyAttributes) {
      throw new Error(`Non-key attributes should not be specified when not using ${ProjectionType.INCLUDE} projection type`);
    }
  }

  private validateReplicaIndexOptions(options: { [indexName: string]: ReplicaGlobalSecondaryIndexOptions }) {
    for (const indexName of Object.keys(options)) {
      if (!this.globalSecondaryIndexes.has(indexName)) {
        throw new Error(`Cannot configure replica global secondary index, ${indexName}, because it is not defined on the primary table`);
      }

      const replicaGsiOptions = options[indexName];
      if (this.billingMode === BillingMode.PAY_PER_REQUEST && replicaGsiOptions.readCapacity) {
        throw new Error(`Cannot configure 'readCapacity' for replica global secondary index, ${indexName}, because billing mode is ${BillingMode.PAY_PER_REQUEST}`);
      }
    }
  }

  private validateReplica(props: ReplicaTableProps) {
    const stackRegion = this.stack.region;
    if (Token.isUnresolved(stackRegion)) {
      throw new Error('Replica tables are not supported in a region agnostic stack');
    }

    if (Token.isUnresolved(props.region)) {
      throw new Error('Replica table region must not be a token');
    }

    if (props.region === this.stack.region) {
      throw new Error(`You cannot add a replica table in the same region as the primary table - the primary table region is ${this.region}`);
    }

    if (this.replicaTables.has(props.region)) {
      throw new Error(`Duplicate replica table region, ${props.region}, is not allowed`);
    }

    if (this.billingMode === BillingMode.PAY_PER_REQUEST && props.readCapacity) {
      throw new Error(`You cannot provide 'readCapacity' on a replica table when the billing mode is ${BillingMode.PAY_PER_REQUEST}`);
    }
  }

  private validateGlobalSecondaryIndex(props: GlobalSecondaryIndexPropsV2) {
    this.validateIndexName(props.indexName);

    if (this.globalSecondaryIndexes.size === MAX_GSI_COUNT) {
      throw new Error(`You may not provide more than ${MAX_GSI_COUNT} global secondary indexes`);
    }

    if (this.billingMode === BillingMode.PAY_PER_REQUEST && (props.readCapacity || props.writeCapacity)) {
      throw new Error(`You cannot configure 'readCapacity' or 'writeCapacity' on a global secondary index when the billing mode is ${BillingMode.PAY_PER_REQUEST}`);
    }
  }

  private validateLocalSecondaryIndex(props: LocalSecondaryIndexProps) {
    this.validateIndexName(props.indexName);

    if (!this.hasSortKey) {
      throw new Error('The table must have a sort key in order to add a local secondary index');
    }

    if (this.localSecondaryIndexes.size === MAX_LSI_COUNT) {
      throw new Error(`You may not provide more than ${MAX_LSI_COUNT} local secondary indexes`);
    }
  }
}
