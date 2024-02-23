/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * You can use the `AWS::Cassandra::Keyspace` resource to create a new keyspace in Amazon Keyspaces (for Apache Cassandra).
 *
 * For more information, see [Create a keyspace and a table](https://docs.aws.amazon.com/keyspaces/latest/devguide/getting-started.ddl.html) in the *Amazon Keyspaces Developer Guide* .
 *
 * @cloudformationResource AWS::Cassandra::Keyspace
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html
 */
export class CfnKeyspace extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cassandra::Keyspace";

  /**
   * Build a CfnKeyspace from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnKeyspace {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnKeyspacePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnKeyspace(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the keyspace to be created.
   */
  public keyspaceName?: string;

  /**
   * Specifies the `ReplicationStrategy` of a keyspace. The options are:.
   */
  public replicationSpecification?: cdk.IResolvable | CfnKeyspace.ReplicationSpecificationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnKeyspaceProps = {}) {
    super(scope, id, {
      "type": CfnKeyspace.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.keyspaceName = props.keyspaceName;
    this.replicationSpecification = props.replicationSpecification;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Cassandra::Keyspace", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "keyspaceName": this.keyspaceName,
      "replicationSpecification": this.replicationSpecification,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnKeyspace.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnKeyspacePropsToCloudFormation(props);
  }
}

export namespace CfnKeyspace {
  /**
   * You can use `ReplicationSpecification` to configure the `ReplicationStrategy` of a keyspace in Amazon Keyspaces.
   *
   * The `ReplicationSpecification` property is `CreateOnly` and cannot be changed after the keyspace has been created. This property applies automatically to all tables in the keyspace.
   *
   * For more information, see [Multi-Region Replication](https://docs.aws.amazon.com/keyspaces/latest/devguide/multiRegion-replication.html) in the *Amazon Keyspaces Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-keyspace-replicationspecification.html
   */
  export interface ReplicationSpecificationProperty {
    /**
     * Specifies the AWS Regions that the keyspace is replicated in.
     *
     * You must specify at least two and up to six Regions, including the Region that the keyspace is being created in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-keyspace-replicationspecification.html#cfn-cassandra-keyspace-replicationspecification-regionlist
     */
    readonly regionList?: Array<string>;

    /**
     * The options are:.
     *
     * - `SINGLE_REGION` (optional)
     * - `MULTI_REGION`
     *
     * If no value is specified, the default is `SINGLE_REGION` . If `MULTI_REGION` is specified, `RegionList` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-keyspace-replicationspecification.html#cfn-cassandra-keyspace-replicationspecification-replicationstrategy
     */
    readonly replicationStrategy?: string;
  }
}

/**
 * Properties for defining a `CfnKeyspace`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html
 */
export interface CfnKeyspaceProps {
  /**
   * The name of the keyspace to be created.
   *
   * The keyspace name is case sensitive. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the keyspace name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * *Length constraints:* Minimum length of 3. Maximum length of 255.
   *
   * *Pattern:* `^[a-zA-Z0-9][a-zA-Z0-9_]{1,47}$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html#cfn-cassandra-keyspace-keyspacename
   */
  readonly keyspaceName?: string;

  /**
   * Specifies the `ReplicationStrategy` of a keyspace. The options are:.
   *
   * - `SINGLE_REGION` for a single Region keyspace (optional) or
   * - `MULTI_REGION` for a multi-Region keyspace
   *
   * If no `ReplicationStrategy` is provided, the default is `SINGLE_REGION` . If you choose `MULTI_REGION` , you must also provide a `RegionList` with the AWS Regions that the keyspace is replicated in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html#cfn-cassandra-keyspace-replicationspecification
   */
  readonly replicationSpecification?: cdk.IResolvable | CfnKeyspace.ReplicationSpecificationProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html#cfn-cassandra-keyspace-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ReplicationSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKeyspaceReplicationSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("regionList", cdk.listValidator(cdk.validateString))(properties.regionList));
  errors.collect(cdk.propertyValidator("replicationStrategy", cdk.validateString)(properties.replicationStrategy));
  return errors.wrap("supplied properties not correct for \"ReplicationSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnKeyspaceReplicationSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKeyspaceReplicationSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "RegionList": cdk.listMapper(cdk.stringToCloudFormation)(properties.regionList),
    "ReplicationStrategy": cdk.stringToCloudFormation(properties.replicationStrategy)
  };
}

// @ts-ignore TS6133
function CfnKeyspaceReplicationSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnKeyspace.ReplicationSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyspace.ReplicationSpecificationProperty>();
  ret.addPropertyResult("regionList", "RegionList", (properties.RegionList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RegionList) : undefined));
  ret.addPropertyResult("replicationStrategy", "ReplicationStrategy", (properties.ReplicationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnKeyspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnKeyspaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnKeyspacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyspaceName", cdk.validateString)(properties.keyspaceName));
  errors.collect(cdk.propertyValidator("replicationSpecification", CfnKeyspaceReplicationSpecificationPropertyValidator)(properties.replicationSpecification));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnKeyspaceProps\"");
}

// @ts-ignore TS6133
function convertCfnKeyspacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnKeyspacePropsValidator(properties).assertSuccess();
  return {
    "KeyspaceName": cdk.stringToCloudFormation(properties.keyspaceName),
    "ReplicationSpecification": convertCfnKeyspaceReplicationSpecificationPropertyToCloudFormation(properties.replicationSpecification),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnKeyspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKeyspaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyspaceProps>();
  ret.addPropertyResult("keyspaceName", "KeyspaceName", (properties.KeyspaceName != null ? cfn_parse.FromCloudFormation.getString(properties.KeyspaceName) : undefined));
  ret.addPropertyResult("replicationSpecification", "ReplicationSpecification", (properties.ReplicationSpecification != null ? CfnKeyspaceReplicationSpecificationPropertyFromCloudFormation(properties.ReplicationSpecification) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * You can use the `AWS::Cassandra::Table` resource to create a new table in Amazon Keyspaces (for Apache Cassandra).
 *
 * For more information, see [Create a keyspace and a table](https://docs.aws.amazon.com/keyspaces/latest/devguide/getting-started.ddl.html) in the *Amazon Keyspaces Developer Guide* .
 *
 * @cloudformationResource AWS::Cassandra::Table
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html
 */
export class CfnTable extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cassandra::Table";

  /**
   * Build a CfnTable from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTable {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTablePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTable(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The billing mode for the table, which determines how you'll be charged for reads and writes:.
   */
  public billingMode?: CfnTable.BillingModeProperty | cdk.IResolvable;

  /**
   * Enables client-side timestamps for the table.
   */
  public clientSideTimestampsEnabled?: boolean | cdk.IResolvable;

  /**
   * One or more columns that determine how the table data is sorted.
   */
  public clusteringKeyColumns?: Array<CfnTable.ClusteringKeyColumnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The default Time To Live (TTL) value for all rows in a table in seconds.
   */
  public defaultTimeToLive?: number;

  /**
   * The encryption at rest options for the table.
   */
  public encryptionSpecification?: CfnTable.EncryptionSpecificationProperty | cdk.IResolvable;

  /**
   * The name of the keyspace to create the table in.
   */
  public keyspaceName: string;

  /**
   * One or more columns that uniquely identify every row in the table.
   */
  public partitionKeyColumns: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies if point-in-time recovery is enabled or disabled for the table.
   */
  public pointInTimeRecoveryEnabled?: boolean | cdk.IResolvable;

  /**
   * One or more columns that are not part of the primary key - that is, columns that are *not* defined as partition key columns or clustering key columns.
   */
  public regularColumns?: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the table to be created.
   */
  public tableName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTableProps) {
    super(scope, id, {
      "type": CfnTable.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "keyspaceName", this);
    cdk.requireProperty(props, "partitionKeyColumns", this);

    this.billingMode = props.billingMode;
    this.clientSideTimestampsEnabled = props.clientSideTimestampsEnabled;
    this.clusteringKeyColumns = props.clusteringKeyColumns;
    this.defaultTimeToLive = props.defaultTimeToLive;
    this.encryptionSpecification = props.encryptionSpecification;
    this.keyspaceName = props.keyspaceName;
    this.partitionKeyColumns = props.partitionKeyColumns;
    this.pointInTimeRecoveryEnabled = props.pointInTimeRecoveryEnabled;
    this.regularColumns = props.regularColumns;
    this.tableName = props.tableName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Cassandra::Table", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "billingMode": this.billingMode,
      "clientSideTimestampsEnabled": this.clientSideTimestampsEnabled,
      "clusteringKeyColumns": this.clusteringKeyColumns,
      "defaultTimeToLive": this.defaultTimeToLive,
      "encryptionSpecification": this.encryptionSpecification,
      "keyspaceName": this.keyspaceName,
      "partitionKeyColumns": this.partitionKeyColumns,
      "pointInTimeRecoveryEnabled": this.pointInTimeRecoveryEnabled,
      "regularColumns": this.regularColumns,
      "tableName": this.tableName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTable.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTablePropsToCloudFormation(props);
  }
}

export namespace CfnTable {
  /**
   * Defines an individual column within the clustering key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-clusteringkeycolumn.html
   */
  export interface ClusteringKeyColumnProperty {
    /**
     * The name and data type of this clustering key column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-clusteringkeycolumn.html#cfn-cassandra-table-clusteringkeycolumn-column
     */
    readonly column: CfnTable.ColumnProperty | cdk.IResolvable;

    /**
     * The order in which this column's data is stored:.
     *
     * - `ASC` (default) - The column's data is stored in ascending order.
     * - `DESC` - The column's data is stored in descending order.
     *
     * @default - "ASC"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-clusteringkeycolumn.html#cfn-cassandra-table-clusteringkeycolumn-orderby
     */
    readonly orderBy?: string;
  }

  /**
   * The name and data type of an individual column in a table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-column.html
   */
  export interface ColumnProperty {
    /**
     * The name of the column.
     *
     * For more information, see [Identifiers](https://docs.aws.amazon.com/keyspaces/latest/devguide/cql.elements.html#cql.elements.identifier) in the *Amazon Keyspaces Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-column.html#cfn-cassandra-table-column-columnname
     */
    readonly columnName: string;

    /**
     * The data type of the column.
     *
     * For more information, see [Data types](https://docs.aws.amazon.com/keyspaces/latest/devguide/cql.elements.html#cql.data-types) in the *Amazon Keyspaces Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-column.html#cfn-cassandra-table-column-columntype
     */
    readonly columnType: string;
  }

  /**
   * Determines the billing mode for the table - on-demand or provisioned.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-billingmode.html
   */
  export interface BillingModeProperty {
    /**
     * The billing mode for the table:.
     *
     * - On-demand mode - `ON_DEMAND`
     * - Provisioned mode - `PROVISIONED`
     *
     * > If you choose `PROVISIONED` mode, then you also need to specify provisioned throughput (read and write capacity) for the table.
     *
     * Valid values: `ON_DEMAND` | `PROVISIONED`
     *
     * @default - "ON_DEMAND"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-billingmode.html#cfn-cassandra-table-billingmode-mode
     */
    readonly mode: string;

    /**
     * The provisioned read capacity and write capacity for the table.
     *
     * For more information, see [Provisioned throughput capacity mode](https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html#ReadWriteCapacityMode.Provisioned) in the *Amazon Keyspaces Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-billingmode.html#cfn-cassandra-table-billingmode-provisionedthroughput
     */
    readonly provisionedThroughput?: cdk.IResolvable | CfnTable.ProvisionedThroughputProperty;
  }

  /**
   * The provisioned throughput for the table, which consists of `ReadCapacityUnits` and `WriteCapacityUnits` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-provisionedthroughput.html
   */
  export interface ProvisionedThroughputProperty {
    /**
     * The amount of read capacity that's provisioned for the table.
     *
     * For more information, see [Read/write capacity mode](https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html) in the *Amazon Keyspaces Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-provisionedthroughput.html#cfn-cassandra-table-provisionedthroughput-readcapacityunits
     */
    readonly readCapacityUnits: number;

    /**
     * The amount of write capacity that's provisioned for the table.
     *
     * For more information, see [Read/write capacity mode](https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html) in the *Amazon Keyspaces Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-provisionedthroughput.html#cfn-cassandra-table-provisionedthroughput-writecapacityunits
     */
    readonly writeCapacityUnits: number;
  }

  /**
   * Specifies the encryption at rest option selected for the table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-encryptionspecification.html
   */
  export interface EncryptionSpecificationProperty {
    /**
     * The encryption at rest options for the table.
     *
     * - *AWS owned key* (default) - `AWS_OWNED_KMS_KEY`
     * - *Customer managed key* - `CUSTOMER_MANAGED_KMS_KEY`
     *
     * > If you choose `CUSTOMER_MANAGED_KMS_KEY` , a `kms_key_identifier` in the format of a key ARN is required.
     *
     * Valid values: `CUSTOMER_MANAGED_KMS_KEY` | `AWS_OWNED_KMS_KEY` .
     *
     * @default - "AWS_OWNED_KMS_KEY"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-encryptionspecification.html#cfn-cassandra-table-encryptionspecification-encryptiontype
     */
    readonly encryptionType: string;

    /**
     * Requires a `kms_key_identifier` in the format of a key ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-encryptionspecification.html#cfn-cassandra-table-encryptionspecification-kmskeyidentifier
     */
    readonly kmsKeyIdentifier?: string;
  }
}

/**
 * Properties for defining a `CfnTable`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html
 */
export interface CfnTableProps {
  /**
   * The billing mode for the table, which determines how you'll be charged for reads and writes:.
   *
   * - *On-demand mode* (default) - You pay based on the actual reads and writes your application performs.
   * - *Provisioned mode* - Lets you specify the number of reads and writes per second that you need for your application.
   *
   * If you don't specify a value for this property, then the table will use on-demand mode.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-billingmode
   */
  readonly billingMode?: CfnTable.BillingModeProperty | cdk.IResolvable;

  /**
   * Enables client-side timestamps for the table.
   *
   * By default, the setting is disabled. You can enable client-side timestamps with the following option:
   *
   * - `status: "enabled"`
   *
   * After client-side timestamps are enabled for a table, you can't disable this setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-clientsidetimestampsenabled
   */
  readonly clientSideTimestampsEnabled?: boolean | cdk.IResolvable;

  /**
   * One or more columns that determine how the table data is sorted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-clusteringkeycolumns
   */
  readonly clusteringKeyColumns?: Array<CfnTable.ClusteringKeyColumnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The default Time To Live (TTL) value for all rows in a table in seconds.
   *
   * The maximum configurable value is 630,720,000 seconds, which is the equivalent of 20 years. By default, the TTL value for a table is 0, which means data does not expire.
   *
   * For more information, see [Setting the default TTL value for a table](https://docs.aws.amazon.com/keyspaces/latest/devguide/TTL-how-it-works.html#ttl-howitworks_default_ttl) in the *Amazon Keyspaces Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-defaulttimetolive
   */
  readonly defaultTimeToLive?: number;

  /**
   * The encryption at rest options for the table.
   *
   * - *AWS owned key* (default) - The key is owned by Amazon Keyspaces.
   * - *Customer managed key* - The key is stored in your account and is created, owned, and managed by you.
   *
   * > If you choose encryption with a customer managed key, you must specify a valid customer managed KMS key with permissions granted to Amazon Keyspaces.
   *
   * For more information, see [Encryption at rest in Amazon Keyspaces](https://docs.aws.amazon.com/keyspaces/latest/devguide/EncryptionAtRest.html) in the *Amazon Keyspaces Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-encryptionspecification
   */
  readonly encryptionSpecification?: CfnTable.EncryptionSpecificationProperty | cdk.IResolvable;

  /**
   * The name of the keyspace to create the table in.
   *
   * The keyspace must already exist.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-keyspacename
   */
  readonly keyspaceName: string;

  /**
   * One or more columns that uniquely identify every row in the table.
   *
   * Every table must have a partition key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-partitionkeycolumns
   */
  readonly partitionKeyColumns: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies if point-in-time recovery is enabled or disabled for the table.
   *
   * The options are `PointInTimeRecoveryEnabled=true` and `PointInTimeRecoveryEnabled=false` . If not specified, the default is `PointInTimeRecoveryEnabled=false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-pointintimerecoveryenabled
   */
  readonly pointInTimeRecoveryEnabled?: boolean | cdk.IResolvable;

  /**
   * One or more columns that are not part of the primary key - that is, columns that are *not* defined as partition key columns or clustering key columns.
   *
   * You can add regular columns to existing tables by adding them to the template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-regularcolumns
   */
  readonly regularColumns?: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the table to be created.
   *
   * The table name is case sensitive. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the table name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you can't perform updates that require replacing this resource. You can perform updates that require no interruption or some interruption. If you must replace the resource, specify a new name.
   *
   * *Length constraints:* Minimum length of 3. Maximum length of 255.
   *
   * *Pattern:* `^[a-zA-Z0-9][a-zA-Z0-9_]{1,47}$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-tablename
   */
  readonly tableName?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ColumnProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("columnName", cdk.requiredValidator)(properties.columnName));
  errors.collect(cdk.propertyValidator("columnName", cdk.validateString)(properties.columnName));
  errors.collect(cdk.propertyValidator("columnType", cdk.requiredValidator)(properties.columnType));
  errors.collect(cdk.propertyValidator("columnType", cdk.validateString)(properties.columnType));
  return errors.wrap("supplied properties not correct for \"ColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableColumnPropertyValidator(properties).assertSuccess();
  return {
    "ColumnName": cdk.stringToCloudFormation(properties.columnName),
    "ColumnType": cdk.stringToCloudFormation(properties.columnType)
  };
}

// @ts-ignore TS6133
function CfnTableColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ColumnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ColumnProperty>();
  ret.addPropertyResult("columnName", "ColumnName", (properties.ColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnName) : undefined));
  ret.addPropertyResult("columnType", "ColumnType", (properties.ColumnType != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClusteringKeyColumnProperty`
 *
 * @param properties - the TypeScript properties of a `ClusteringKeyColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableClusteringKeyColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("column", cdk.requiredValidator)(properties.column));
  errors.collect(cdk.propertyValidator("column", CfnTableColumnPropertyValidator)(properties.column));
  errors.collect(cdk.propertyValidator("orderBy", cdk.validateString)(properties.orderBy));
  return errors.wrap("supplied properties not correct for \"ClusteringKeyColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableClusteringKeyColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableClusteringKeyColumnPropertyValidator(properties).assertSuccess();
  return {
    "Column": convertCfnTableColumnPropertyToCloudFormation(properties.column),
    "OrderBy": cdk.stringToCloudFormation(properties.orderBy)
  };
}

// @ts-ignore TS6133
function CfnTableClusteringKeyColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ClusteringKeyColumnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ClusteringKeyColumnProperty>();
  ret.addPropertyResult("column", "Column", (properties.Column != null ? CfnTableColumnPropertyFromCloudFormation(properties.Column) : undefined));
  ret.addPropertyResult("orderBy", "OrderBy", (properties.OrderBy != null ? cfn_parse.FromCloudFormation.getString(properties.OrderBy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProvisionedThroughputProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableProvisionedThroughputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("readCapacityUnits", cdk.requiredValidator)(properties.readCapacityUnits));
  errors.collect(cdk.propertyValidator("readCapacityUnits", cdk.validateNumber)(properties.readCapacityUnits));
  errors.collect(cdk.propertyValidator("writeCapacityUnits", cdk.requiredValidator)(properties.writeCapacityUnits));
  errors.collect(cdk.propertyValidator("writeCapacityUnits", cdk.validateNumber)(properties.writeCapacityUnits));
  return errors.wrap("supplied properties not correct for \"ProvisionedThroughputProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableProvisionedThroughputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableProvisionedThroughputPropertyValidator(properties).assertSuccess();
  return {
    "ReadCapacityUnits": cdk.numberToCloudFormation(properties.readCapacityUnits),
    "WriteCapacityUnits": cdk.numberToCloudFormation(properties.writeCapacityUnits)
  };
}

// @ts-ignore TS6133
function CfnTableProvisionedThroughputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.ProvisionedThroughputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ProvisionedThroughputProperty>();
  ret.addPropertyResult("readCapacityUnits", "ReadCapacityUnits", (properties.ReadCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReadCapacityUnits) : undefined));
  ret.addPropertyResult("writeCapacityUnits", "WriteCapacityUnits", (properties.WriteCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.WriteCapacityUnits) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BillingModeProperty`
 *
 * @param properties - the TypeScript properties of a `BillingModeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableBillingModePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mode", cdk.requiredValidator)(properties.mode));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("provisionedThroughput", CfnTableProvisionedThroughputPropertyValidator)(properties.provisionedThroughput));
  return errors.wrap("supplied properties not correct for \"BillingModeProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableBillingModePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableBillingModePropertyValidator(properties).assertSuccess();
  return {
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "ProvisionedThroughput": convertCfnTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput)
  };
}

// @ts-ignore TS6133
function CfnTableBillingModePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.BillingModeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.BillingModeProperty>();
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("provisionedThroughput", "ProvisionedThroughput", (properties.ProvisionedThroughput != null ? CfnTableProvisionedThroughputPropertyFromCloudFormation(properties.ProvisionedThroughput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableEncryptionSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionType", cdk.requiredValidator)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("encryptionType", cdk.validateString)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("kmsKeyIdentifier", cdk.validateString)(properties.kmsKeyIdentifier));
  return errors.wrap("supplied properties not correct for \"EncryptionSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableEncryptionSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableEncryptionSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionType": cdk.stringToCloudFormation(properties.encryptionType),
    "KmsKeyIdentifier": cdk.stringToCloudFormation(properties.kmsKeyIdentifier)
  };
}

// @ts-ignore TS6133
function CfnTableEncryptionSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.EncryptionSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.EncryptionSpecificationProperty>();
  ret.addPropertyResult("encryptionType", "EncryptionType", (properties.EncryptionType != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionType) : undefined));
  ret.addPropertyResult("kmsKeyIdentifier", "KmsKeyIdentifier", (properties.KmsKeyIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTablePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("billingMode", CfnTableBillingModePropertyValidator)(properties.billingMode));
  errors.collect(cdk.propertyValidator("clientSideTimestampsEnabled", cdk.validateBoolean)(properties.clientSideTimestampsEnabled));
  errors.collect(cdk.propertyValidator("clusteringKeyColumns", cdk.listValidator(CfnTableClusteringKeyColumnPropertyValidator))(properties.clusteringKeyColumns));
  errors.collect(cdk.propertyValidator("defaultTimeToLive", cdk.validateNumber)(properties.defaultTimeToLive));
  errors.collect(cdk.propertyValidator("encryptionSpecification", CfnTableEncryptionSpecificationPropertyValidator)(properties.encryptionSpecification));
  errors.collect(cdk.propertyValidator("keyspaceName", cdk.requiredValidator)(properties.keyspaceName));
  errors.collect(cdk.propertyValidator("keyspaceName", cdk.validateString)(properties.keyspaceName));
  errors.collect(cdk.propertyValidator("partitionKeyColumns", cdk.requiredValidator)(properties.partitionKeyColumns));
  errors.collect(cdk.propertyValidator("partitionKeyColumns", cdk.listValidator(CfnTableColumnPropertyValidator))(properties.partitionKeyColumns));
  errors.collect(cdk.propertyValidator("pointInTimeRecoveryEnabled", cdk.validateBoolean)(properties.pointInTimeRecoveryEnabled));
  errors.collect(cdk.propertyValidator("regularColumns", cdk.listValidator(CfnTableColumnPropertyValidator))(properties.regularColumns));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTableProps\"");
}

// @ts-ignore TS6133
function convertCfnTablePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTablePropsValidator(properties).assertSuccess();
  return {
    "BillingMode": convertCfnTableBillingModePropertyToCloudFormation(properties.billingMode),
    "ClientSideTimestampsEnabled": cdk.booleanToCloudFormation(properties.clientSideTimestampsEnabled),
    "ClusteringKeyColumns": cdk.listMapper(convertCfnTableClusteringKeyColumnPropertyToCloudFormation)(properties.clusteringKeyColumns),
    "DefaultTimeToLive": cdk.numberToCloudFormation(properties.defaultTimeToLive),
    "EncryptionSpecification": convertCfnTableEncryptionSpecificationPropertyToCloudFormation(properties.encryptionSpecification),
    "KeyspaceName": cdk.stringToCloudFormation(properties.keyspaceName),
    "PartitionKeyColumns": cdk.listMapper(convertCfnTableColumnPropertyToCloudFormation)(properties.partitionKeyColumns),
    "PointInTimeRecoveryEnabled": cdk.booleanToCloudFormation(properties.pointInTimeRecoveryEnabled),
    "RegularColumns": cdk.listMapper(convertCfnTableColumnPropertyToCloudFormation)(properties.regularColumns),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTableProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTableProps>();
  ret.addPropertyResult("billingMode", "BillingMode", (properties.BillingMode != null ? CfnTableBillingModePropertyFromCloudFormation(properties.BillingMode) : undefined));
  ret.addPropertyResult("clientSideTimestampsEnabled", "ClientSideTimestampsEnabled", (properties.ClientSideTimestampsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ClientSideTimestampsEnabled) : undefined));
  ret.addPropertyResult("clusteringKeyColumns", "ClusteringKeyColumns", (properties.ClusteringKeyColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnTableClusteringKeyColumnPropertyFromCloudFormation)(properties.ClusteringKeyColumns) : undefined));
  ret.addPropertyResult("defaultTimeToLive", "DefaultTimeToLive", (properties.DefaultTimeToLive != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTimeToLive) : undefined));
  ret.addPropertyResult("encryptionSpecification", "EncryptionSpecification", (properties.EncryptionSpecification != null ? CfnTableEncryptionSpecificationPropertyFromCloudFormation(properties.EncryptionSpecification) : undefined));
  ret.addPropertyResult("keyspaceName", "KeyspaceName", (properties.KeyspaceName != null ? cfn_parse.FromCloudFormation.getString(properties.KeyspaceName) : undefined));
  ret.addPropertyResult("partitionKeyColumns", "PartitionKeyColumns", (properties.PartitionKeyColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnTableColumnPropertyFromCloudFormation)(properties.PartitionKeyColumns) : undefined));
  ret.addPropertyResult("pointInTimeRecoveryEnabled", "PointInTimeRecoveryEnabled", (properties.PointInTimeRecoveryEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PointInTimeRecoveryEnabled) : undefined));
  ret.addPropertyResult("regularColumns", "RegularColumns", (properties.RegularColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnTableColumnPropertyFromCloudFormation)(properties.RegularColumns) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}