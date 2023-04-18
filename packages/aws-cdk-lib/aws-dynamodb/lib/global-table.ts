import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import * as kms from '../../aws-kms';
import { ArnFormat, Lazy, RemovalPolicy, Stack, Token } from "../../core";
import { Construct } from 'constructs';
import { CfnGlobalTable, CfnTable, CfnTableProps } from './dynamodb.generated';
import {
    Attribute, BillingMode, HASH_KEY_TYPE, ITable, LocalSecondaryIndexProps, MAX_LOCAL_SECONDARY_INDEX_COUNT,
    ProjectionType, RANGE_KEY_TYPE, SecondaryIndexProps, StreamViewType, TableAttributes, TableBase, TableClass, TableEncryption
} from "./share";

// remove
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
 * Properties of a DynamoDB Table
 *
 * Use `TableProps` for all table properties
 */
export interface TableOptions {
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
     * Pay only for what you use. You don't configure Read/Write capacity units.
     *
     * @default PAY_PER_REQUEST.
     */
    readonly billingMode?: BillingMode;

    /**
     * Whether point-in-time recovery is enabled.
     * @default - point-in-time recovery is disabled
     */
    readonly pointInTimeRecovery?: boolean;

    /**
     * Whether server-side encryption with an AWS managed customer master key is enabled.
     *
     * This property cannot be set if `encryption` and/or `encryptionKey` is set.
     *
     * @default - The table is encrypted with an encryption key managed by DynamoDB, and you are not charged any fee for using it.
     *
     * @deprecated This property is deprecated. In order to obtain the same behavior as
     * enabling this, set the `encryption` property to `TableEncryption.AWS_MANAGED` instead.
     */
    readonly serverSideEncryption?: boolean;

    /**
     * Specify the table class.
     * @default STANDARD
     */
    readonly tableClass?: TableClass;

    /**
     * Whether server-side encryption with an AWS managed customer master key is enabled.
     *
     * This property cannot be set if `serverSideEncryption` is set.
     *
     * > **NOTE**: if you set this to `CUSTOMER_MANAGED` and `encryptionKey` is not
     * > specified, the key that the Tablet generates for you will be created with
     * > default permissions. If you are using CDKv2, these permissions will be
     * > sufficient to enable the key for use with DynamoDB tables.  If you are
     * > using CDKv1, make sure the feature flag
     * > `@aws-cdk/aws-kms:defaultKeyPolicies` is set to `true` in your `cdk.json`.
     *
     * @default - The table is encrypted with an encryption key managed by DynamoDB, and you are not charged any fee for using it.
     */
    readonly encryption?: TableEncryption;

    /**
     * External KMS key to use for table encryption.
     *
     * This property can only be set if `encryption` is set to `TableEncryption.CUSTOMER_MANAGED`.
     *
     * @default - If `encryption` is set to `TableEncryption.CUSTOMER_MANAGED` and this
     * property is undefined, a new KMS key will be created and associated with this table.
     * If `encryption` and this property are both undefined, then the table is encrypted with
     * an encryption key managed by DynamoDB, and you are not charged any fee for using it.
     */
    readonly encryptionKey?: kms.IKey;

    /**
     * The name of TTL attribute.
     * @default - TTL is disabled
     */
    readonly timeToLiveAttribute?: string;

    /**
     * When an item in the table is modified, StreamViewType determines what information
     * is written to the stream for this table.
     *
     * @default - streams are disabled unless `replicationRegions` is specified
     */
    readonly stream?: StreamViewType;

    /**
     * The removal policy to apply to the DynamoDB Table.
     *
     * @default RemovalPolicy.RETAIN
     */
    readonly removalPolicy?: RemovalPolicy;

    /**
     * Whether CloudWatch contributor insights is enabled.
     *
     * @default false
     */
    readonly contributorInsightsEnabled?: boolean;
}

/**
 * Properties for a DynamoDB Table
 */
export interface TableProps extends TableOptions {
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

    /**
     * Enforces a particular physical table name.
     * @default <generated>
     */
    readonly tableName?: string;

    /**
     * Kinesis Data Stream to capture item-level changes for the table.
     *
     * @default - no Kinesis Data Stream
     */
    readonly kinesisStream?: kinesis.IStream;

    /**
     * Specifies the list of replicas for your global table. You can create a
     * new global table with as many replicas as needed. You can add or remove replicas
     * after table creation, but you can only add or remove a single replica in each update.
     *
     * @default - The list contains one element, the region where the stack defining the global table is deployed.
     */
    readonly replicas?: ReplicaProps[]

    /**
     * Specifies the capacities of
     */
    readonly capacity?: Capacity

    /**
     *
     */
    readonly writeProvisionedThroughputSettings?: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty

    /**
     * Allows you to specify the read capacity settings for a replica table
     * when the BillingMode is set to PROVISIONED. You must specify a value for either `ReadCapacityUnits`
     * or `ReadCapacityAutoScalingSettings`, but not both. You can switch between fixed capacity and auto scaling.
     *
     */
    readonly readProvisionedThroughputSettings?: CfnGlobalTable.ReadProvisionedThroughputSettingsProperty;
}

/**
 * Properties for Replication
 */

export interface ReplicaProps {
    /**
     * Regions where replica table will be created
     */
    readonly region: string

    /**
    * Kinesis Data Stream to capture item-level changes for the table.
    *
    * @default - no Kinesis Data Stream
    */
    readonly kinesisStream?: kinesis.IStream;

    /**
     * Specify the table class.
     * @default STANDARD
     */
    readonly tableClass?: TableClass;

    /**
     * Whether point-in-time recovery is enabled.
     * @default - point-in-time recovery is disabled
     */
    readonly pointInTimeRecovery?: boolean;

    /**
     * Whether CloudWatch contributor insights is enabled.
     *
     * @default false
     */
    readonly contributorInsightsEnabled?: boolean;

    /**
     * Allows you to specify the read capacity settings for a replica table
     * when the BillingMode is set to PROVISIONED. You must specify a value for either `ReadCapacityUnits`
     * or `ReadCapacityAutoScalingSettings`, but not both. You can switch between fixed capacity and auto scaling.
     */
    readonly readProvisionedThroughputSettings?: CfnGlobalTable.ReadProvisionedThroughputSettingsProperty;

    /**
     * Represents the properties of a global secondary index that can be set on a per-replica basis.
     */
    readonly replicaGlobalSecondaryIndexSpecification?: CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty;

    /**
    * Allows you to specify the read capacity settings for a replica table
    * when the BillingMode is set to PROVISIONED. You must specify a value for either `ReadCapacityUnits`
    * or `ReadCapacityAutoScalingSettings`, but not both. You can switch between fixed capacity and auto scaling.
    */
    readonly provisionedThroughput?: Throughput;
}

/**
 * Properties for a global secondary index
 */
export interface GlobalSecondaryIndexProps extends SecondaryIndexProps {
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

    readonly capacity?: Capacity
}

/**
 * Provides a Global DynamoDB table.
 */
export class GlobalTable extends TableBase {
    /**
     * Permits an IAM Principal to list all DynamoDB Streams.
     * @deprecated Use `#grantTableListStreams` for more granular permission
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
     * Creates a Table construct that represents an external table via table name.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param tableName The table's name.
     */
    public static fromTableName(scope: Construct, id: string, tableName: string): ITable {
        return GlobalTable.fromTableAttributes(scope, id, { tableName });
    }

    /**
     * Creates a Table construct that represents an external table via table arn.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param tableArn The table's ARN.
     */
    public static fromTableArn(scope: Construct, id: string, tableArn: string): ITable {
        return GlobalTable.fromTableAttributes(scope, id, { tableArn });
    }

    /**
     * Creates a Table construct that represents an external table.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param attrs A `TableAttributes` object.
     */
    public static fromTableAttributes(scope: Construct, id: string, attrs: TableAttributes): ITable {

        class Import extends TableBase {

            public readonly tableName: string;
            public readonly tableArn: string;
            public readonly tableStreamArn?: string;
            public readonly encryptionKey?: kms.IKey;
            protected readonly hasIndex = (attrs.grantIndexPermissions ?? false) ||
                (attrs.globalIndexes ?? []).length > 0 ||
                (attrs.localIndexes ?? []).length > 0;

            constructor(_tableArn: string, tableName: string, tableStreamArn?: string) {
                super(scope, id);
                this.tableArn = _tableArn;
                this.tableName = tableName;
                this.tableStreamArn = tableStreamArn;
                this.encryptionKey = attrs.encryptionKey;
            }
        }

        let name: string;
        let arn: string;
        const stack = Stack.of(scope);
        if (!attrs.tableName) {
            if (!attrs.tableArn) { throw new Error('One of tableName or tableArn is required!'); }

            arn = attrs.tableArn;
            const maybeTableName = stack.splitArn(attrs.tableArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
            if (!maybeTableName) { throw new Error('ARN for DynamoDB table must be in the form: ...'); }
            name = maybeTableName;
        } else {
            if (attrs.tableArn) { throw new Error('Only one of tableArn or tableName can be provided'); }
            name = attrs.tableName;
            arn = stack.formatArn({
                service: 'dynamodb',
                resource: 'table',
                resourceName: attrs.tableName,
            });
        }

        return new Import(arn, name, attrs.tableStreamArn);
    }

    public readonly encryptionKey?: kms.IKey;

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
    public capacity?: Capacity

    private readonly globalTable: CfnGlobalTable;

    private readonly replicas = new Array<CfnGlobalTable.ReplicaSpecificationProperty>
    private readonly replicaGlobalSecondaryIndexes = new Array<CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty>
    private readonly keySchema = new Array<CfnTable.KeySchemaProperty>();
    private readonly attributeDefinitions = new Array<CfnTable.AttributeDefinitionProperty>();
    private readonly globalSecondaryIndexes = new Array<CfnGlobalTable.GlobalSecondaryIndexProperty>();
    private readonly localSecondaryIndexes = new Array<CfnTable.LocalSecondaryIndexProperty>();

    private readonly secondaryIndexSchemas = new Map<string, SchemaOptions>();
    private readonly nonKeyAttributes = new Set<string>();

    private readonly tablePartitionKey: Attribute;
    private readonly tableSortKey?: Attribute;

    private readonly billingMode: BillingMode;

    constructor(scope: Construct, id: string, props: TableProps) {
        super(scope, id, {
            physicalName: props.tableName,
        });

        this.billingMode = props.capacity?.billMode || BillingMode.PAY_PER_REQUEST

        const { sseSpecification, encryptionKey } = this.parseEncryption(props);

        let streamSpecification: CfnTable.StreamSpecificationProperty | undefined;
        if (props.replicas) {
            if (props.stream && props.stream !== StreamViewType.NEW_AND_OLD_IMAGES) {
                throw new Error('`stream` must be set to `NEW_AND_OLD_IMAGES` when specifying `replicationRegions`');
            }
            streamSpecification = { streamViewType: StreamViewType.NEW_AND_OLD_IMAGES };

            this.billingMode = props.billingMode ?? BillingMode.PROVISIONED;
        } else {
            this.billingMode = props.billingMode ?? BillingMode.PAY_PER_REQUEST;
            if (props.stream) {
                streamSpecification = { streamViewType: props.stream };
            }
        }
        this.validateProvisioning(props.capacity?.provisionedCapacity);
        this.replicas.push({
            contributorInsightsSpecification: props.contributorInsightsEnabled !== undefined ? { enabled: props.contributorInsightsEnabled } : undefined,
            kinesisStreamSpecification: props.kinesisStream ? { streamArn: props.kinesisStream.streamArn } : undefined,
            pointInTimeRecoverySpecification: props.pointInTimeRecovery != null ? { pointInTimeRecoveryEnabled: props.pointInTimeRecovery } : undefined,
            region: Stack.of(this).region,
            tableClass: props.tableClass,
            globalSecondaryIndexes: this.replicaGlobalSecondaryIndexes,
            readProvisionedThroughputSettings: this.billingMode === BillingMode.PAY_PER_REQUEST ? undefined : {
                readCapacityAutoScalingSettings: props.capacity?.provisionedCapacity?.autoScaleRead,
                readCapacityUnits: props.capacity?.provisionedCapacity?.read || undefined,
            }
        })

        this.capacity = props.capacity
        this.globalTable = new CfnGlobalTable(this, 'Resource', {
            tableName: this.physicalName,
            keySchema: this.keySchema,
            attributeDefinitions: this.attributeDefinitions,
            globalSecondaryIndexes: Lazy.any({ produce: () => this.globalSecondaryIndexes }, { omitEmptyArray: true }),
            localSecondaryIndexes: Lazy.any({ produce: () => this.localSecondaryIndexes }, { omitEmptyArray: true }),
            billingMode: this.billingMode === BillingMode.PROVISIONED ? this.billingMode : BillingMode.PAY_PER_REQUEST,

            sseSpecification,
            streamSpecification,
            timeToLiveSpecification: props.timeToLiveAttribute ? { attributeName: props.timeToLiveAttribute, enabled: true } : undefined,
            replicas: Lazy.any({ produce: () => this.replicas }),
            writeProvisionedThroughputSettings: BillingMode.PAY_PER_REQUEST ? undefined : {
                writeCapacityAutoScalingSettings: props.capacity?.provisionedCapacity?.autoScaleWrite
            },
        });

        this.globalTable.applyRemovalPolicy(props.removalPolicy);

        this.encryptionKey = encryptionKey;

        this.tableArn = this.getResourceArnAttribute(this.globalTable.attrArn, {
            service: 'dynamodb',
            resource: 'table',
            resourceName: this.physicalName,
        });
        this.tableName = this.getResourceNameAttribute(this.globalTable.ref);

        if (props.tableName) { this.node.addMetadata('aws:cdk:hasPhysicalName', this.tableName); }

        this.tableStreamArn = streamSpecification ? this.globalTable.attrStreamArn : undefined;

        this.addKey(props.partitionKey, HASH_KEY_TYPE);
        this.tablePartitionKey = props.partitionKey;

        if (props.sortKey) {
            this.addKey(props.sortKey, RANGE_KEY_TYPE);
            this.tableSortKey = props.sortKey;
        }

        if (props.replicas && props.replicas.length > 0) {
            props.replicas.map((replica: ReplicaProps) => {
                this.addReplica(replica);
            })
        }

        this.node.addValidation({ validate: () => this.validateTable() });
    }

    /**
     * Adds replica of of thetable.
     *
     * @param props the property of replica table.
     */
    public addReplica(props: ReplicaProps) {
        const stack = Stack.of(this);

        if (!Token.isUnresolved(stack.region) && props.region.includes(stack.region)) {
            throw new Error('`replicationRegions` cannot include the region where this stack is deployed.');
        }

        this.replicaGlobalSecondaryIndexes.map((rep: any) => {
            if (rep.indexName === props.provisionedThroughput?.explicitProvisons?.globalSecondaryIndexes?.indexName) {
                rep.readProvisionedThroughputSettings = props.provisionedThroughput?.explicitProvisons?.globalSecondaryIndexes?.indexName
            }
        })
        this.replicas.push({
            contributorInsightsSpecification: props.contributorInsightsEnabled !== undefined ? { enabled: props.contributorInsightsEnabled } : undefined,
            kinesisStreamSpecification: props.kinesisStream ? { streamArn: props.kinesisStream.streamArn } : undefined,
            pointInTimeRecoverySpecification: props.pointInTimeRecovery != null ? { pointInTimeRecoveryEnabled: props.pointInTimeRecovery } : undefined,
            region: props.region,
            tableClass: props.tableClass,
            readProvisionedThroughputSettings: {
                readCapacityAutoScalingSettings: props.provisionedThroughput?.explicitProvisons?.table
            },
            globalSecondaryIndexes: this.replicaGlobalSecondaryIndexes,
        })
    }


    /**
     * Add a global secondary index of table.
     *
     * @param props the property of global secondary index
     */
    public addGlobalSecondaryIndex(props: GlobalSecondaryIndexProps) {
        this.validateProvisioning(props.capacity?.provisionedCapacity);
        this.validateIndexName(props.indexName);

        // build key schema and projection for index
        const gsiKeySchema = this.buildIndexKeySchema(props.partitionKey, props.sortKey);
        const gsiProjection = this.buildIndexProjection(props);

        this.globalSecondaryIndexes.push({
            indexName: props.indexName,
            keySchema: gsiKeySchema,
            projection: gsiProjection,
            writeProvisionedThroughputSettings: {
                writeCapacityAutoScalingSettings: props.capacity?.provisionedCapacity?.autoScaleWrite
            },
        });
        this.replicaGlobalSecondaryIndexes.push({
            indexName: props.indexName,
            readProvisionedThroughputSettings: {

            }
        })

        this.secondaryIndexSchemas.set(props.indexName, {
            partitionKey: props.partitionKey,
            sortKey: props.sortKey,
        });
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

        this.localSecondaryIndexes.push({
            indexName: props.indexName,
            keySchema: lsiKeySchema,
            projection: lsiProjection,
        });

        this.secondaryIndexSchemas.set(props.indexName, {
            partitionKey: this.tablePartitionKey,
            sortKey: props.sortKey,
        });
    }

    /**
     * Get schema attributes of table or index.
     *
     * @returns Schema of table or index.
     */
    public schema(indexName?: string): SchemaOptions {
        if (!indexName) {
            return {
                partitionKey: this.tablePartitionKey,
                sortKey: this.tableSortKey,
            };
        }
        let schema = this.secondaryIndexSchemas.get(indexName);
        if (!schema) {
            throw new Error(`Cannot find schema for index: ${indexName}. Use 'addGlobalSecondaryIndex' or 'addLocalSecondaryIndex' to add index`);
        }
        return schema;
    }

    /**
     * Validate the table construct.
     *
     * @returns an array of validation error message
     */
    private validateTable(): string[] {
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
     * @param props read, autoScaleRead and autoScaleWrite capacity properties
     */
    private validateProvisioning(props?: provisionedProps): void {
        if (this.billingMode === BillingMode.PAY_PER_REQUEST) {
            if (props?.read !== undefined || props?.autoScaleRead !== undefined || props?.autoScaleWrite) {
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
        if (this.secondaryIndexSchemas.has(indexName)) {
            // a duplicate index name causes validation exception, status code 400, while trying to create CFN stack
            throw new Error(`a duplicate index name, ${indexName}, is not allowed`);
        }
    }

    /**
     * Validate non-key attributes by checking limits within secondary index, which may vary in future.
     *
     * @param nonKeyAttributes a list of non-key attribute names
     */
    private validateNonKeyAttributes(nonKeyAttributes: string[]) {
        if (this.nonKeyAttributes.size + nonKeyAttributes.length > 100) {
            // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-secondary-indexes
            throw new RangeError('a maximum number of nonKeyAttributes across all of secondary indexes is 100');
        }

        // store all non-key attributes
        nonKeyAttributes.forEach(att => this.nonKeyAttributes.add(att));
    }

    private buildIndexKeySchema(partitionKey: Attribute, sortKey?: Attribute): CfnTable.KeySchemaProperty[] {
        this.registerAttribute(partitionKey);
        const indexKeySchema: CfnTable.KeySchemaProperty[] = [
            { attributeName: partitionKey.name, keyType: HASH_KEY_TYPE },
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
            projectionType: props.projectionType ?? ProjectionType.ALL,
            nonKeyAttributes: props.nonKeyAttributes ?? undefined,
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
            keyType,
        });
        return this;
    }

    /**
     * Register the key attribute of table or secondary index to assemble attribute definitions of TableResourceProps.
     *
     * @param attribute the key attribute of table or secondary index
     */
    private registerAttribute(attribute: Attribute) {
        const { name, type } = attribute;
        const existingDef = this.attributeDefinitions.find(def => def.attributeName === name);
        if (existingDef && existingDef.attributeType !== type) {
            throw new Error(`Unable to specify ${name} as ${type} because it was already defined as ${existingDef.attributeType}`);
        }
        if (!existingDef) {
            this.attributeDefinitions.push({
                attributeName: name,
                attributeType: type,
            });
        }
    }

    /**
     * Whether this table has indexes
     */
    protected get hasIndex(): boolean {
        return this.globalSecondaryIndexes.length + this.localSecondaryIndexes.length > 0;
    }

    /**
     * Set up key properties and return the Table encryption property from the
     * user's configuration.
     */
    private parseEncryption(props: TableProps): { sseSpecification: CfnTableProps['sseSpecification'], encryptionKey?: kms.IKey } {
        let encryptionType = props.encryption;

        if (encryptionType != null && props.serverSideEncryption != null) {
            throw new Error('Only one of encryption and serverSideEncryption can be specified, but both were provided');
        }

        if (props.serverSideEncryption && props.encryptionKey) {
            throw new Error('encryptionKey cannot be specified when serverSideEncryption is specified. Use encryption instead');
        }

        if (encryptionType === undefined) {
            encryptionType = props.encryptionKey != null
                // If there is a configured encryptionKey, the encryption is implicitly CUSTOMER_MANAGED
                ? TableEncryption.CUSTOMER_MANAGED
                // Otherwise, if severSideEncryption is enabled, it's AWS_MANAGED; else undefined (do not set anything)
                : props.serverSideEncryption ? TableEncryption.AWS_MANAGED : undefined;
        }

        if (encryptionType !== TableEncryption.CUSTOMER_MANAGED && props.encryptionKey) {
            throw new Error('`encryptionKey cannot be specified unless encryption is set to TableEncryption.CUSTOMER_MANAGED (it was set to ${encryptionType})`');
        }

        if (encryptionType === TableEncryption.CUSTOMER_MANAGED && props.replicas) {
            throw new Error('TableEncryption.CUSTOMER_MANAGED is not supported by DynamoDB Global Tables (where replicationRegions was set)');
        }

        switch (encryptionType) {
            case TableEncryption.CUSTOMER_MANAGED:
                const encryptionKey = props.encryptionKey ?? new kms.Key(this, 'Key', {
                    description: `Customer-managed key auto-created for encrypting DynamoDB table at ${this.node.path}`,
                    enableKeyRotation: true,
                });

                return {
                    sseSpecification: { sseEnabled: true, kmsMasterKeyId: encryptionKey.keyArn, sseType: 'KMS' },
                    encryptionKey,
                };

            case TableEncryption.AWS_MANAGED:
                // Not specifying "sseType: 'KMS'" here because it would cause phony changes to existing stacks.
                return { sseSpecification: { sseEnabled: true } };

            case TableEncryption.DEFAULT:
                return { sseSpecification: { sseEnabled: false } };

            case undefined:
                // Not specifying "sseEnabled: false" here because it would cause phony changes to existing stacks.
                return { sseSpecification: undefined };

            default:
                throw new Error(`Unexpected 'encryptionType': ${encryptionType}`);
        }
    }
}

interface provisionedProps {
    read?: number,
    // write?: number,
    autoScaleRead?: CfnGlobalTable.CapacityAutoScalingSettingsProperty
    autoScaleWrite?: CfnGlobalTable.CapacityAutoScalingSettingsProperty
}

export class Capacity {
    public readonly billMode: BillingMode
    public readonly provisionedCapacity?: provisionedProps

    public static readonly onDemand = new Capacity(BillingMode.PAY_PER_REQUEST)
    public static readonly payPerRequest = new Capacity(BillingMode.PAY_PER_REQUEST)
    public static provisioned(props: provisionedProps): Capacity {
        return new Capacity(BillingMode.PROVISIONED, props)
    }

    constructor(billingMode: BillingMode, props?: provisionedProps) {
        this.billMode = billingMode
        this.provisionedCapacity = props
    }

    //public readonly autoR?: IScalableTableAttribute
    //public readonly autoW?: IScalableTableAttribute

    // // /**
    // //  * addAuto
    // //  */
    // public addAuto(table: GlobalTable): void {
    //     this.autoR = table.autoScaleReadCapacity(Capacity.autoScaleRead!)
    //     this.autoW = table.autoScaleWriteCapacity(Capacity.autoScaleWrite!)
    // }
}

interface explicitProps {
    table: CfnGlobalTable.CapacityAutoScalingSettingsProperty
    globalSecondaryIndexes?: {
        [indexname: string]: CfnGlobalTable.CapacityAutoScalingSettingsProperty
    }
}

// interface ThroughputProvisions {
//     autoScale?: CfnGlobalTable.CapacityAutoScalingSettingsProperty
//     read?: number
// }

interface ThroughputProps {
    explicitProvisons?: explicitProps
    multiplier?: number
}

export class Throughput {
    explicitProvisons?: explicitProps
    multiplier?: number

    public static multiplier(props: number): Throughput {
        return new Throughput({ multiplier: props })
    }

    public static explicit(props: explicitProps): Throughput {
        return new Throughput({ explicitProvisons: props })
    }
    constructor(props?: ThroughputProps) {
        this.multiplier = props?.multiplier
        this.explicitProvisons = props?.explicitProvisons
    }
}