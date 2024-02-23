/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies an Access Control List.
 *
 * For more information, see [Authenticating users with Access Contol Lists (ACLs)](https://docs.aws.amazon.com/memorydb/latest/devguide/clusters.acls.html) .
 *
 * @cloudformationResource AWS::MemoryDB::ACL
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-acl.html
 */
export class CfnACL extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MemoryDB::ACL";

  /**
   * Build a CfnACL from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnACL {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnACLPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnACL(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the ARN of the Access Control List, such as `arn:aws:memorydb:us-east-1:123456789012:acl/my-acl`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Indicates ACL status.
   *
   * *Valid values* : `creating` | `active` | `modifying` | `deleting`
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The name of the Access Control List.
   */
  public aclName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The list of users that belong to the Access Control List.
   */
  public userNames?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnACLProps) {
    super(scope, id, {
      "type": CfnACL.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "aclName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.aclName = props.aclName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MemoryDB::ACL", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userNames = props.userNames;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "aclName": this.aclName,
      "tags": this.tags.renderTags(),
      "userNames": this.userNames
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnACL.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnACLPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnACL`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-acl.html
 */
export interface CfnACLProps {
  /**
   * The name of the Access Control List.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-acl.html#cfn-memorydb-acl-aclname
   */
  readonly aclName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-acl.html#cfn-memorydb-acl-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The list of users that belong to the Access Control List.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-acl.html#cfn-memorydb-acl-usernames
   */
  readonly userNames?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnACLProps`
 *
 * @param properties - the TypeScript properties of a `CfnACLProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnACLPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aclName", cdk.requiredValidator)(properties.aclName));
  errors.collect(cdk.propertyValidator("aclName", cdk.validateString)(properties.aclName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userNames", cdk.listValidator(cdk.validateString))(properties.userNames));
  return errors.wrap("supplied properties not correct for \"CfnACLProps\"");
}

// @ts-ignore TS6133
function convertCfnACLPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnACLPropsValidator(properties).assertSuccess();
  return {
    "ACLName": cdk.stringToCloudFormation(properties.aclName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.userNames)
  };
}

// @ts-ignore TS6133
function CfnACLPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnACLProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnACLProps>();
  ret.addPropertyResult("aclName", "ACLName", (properties.ACLName != null ? cfn_parse.FromCloudFormation.getString(properties.ACLName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("userNames", "UserNames", (properties.UserNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.UserNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a cluster .
 *
 * All nodes in the cluster run the same protocol-compliant engine software.
 *
 * @cloudformationResource AWS::MemoryDB::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MemoryDB::Cluster";

  /**
   * Build a CfnCluster from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCluster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the ARN of the cluster , such as `arn:aws:memorydb:us-east-1:123456789012:cluster/my-cluster`
   *
   * @cloudformationAttribute ARN
   */
  public readonly attrArn: string;

  /**
   * The DNS address of the primary read-write node.
   *
   * @cloudformationAttribute ClusterEndpoint.Address
   */
  public readonly attrClusterEndpointAddress: string;

  /**
   * The port number that the engine is listening on.
   *
   * @cloudformationAttribute ClusterEndpoint.Port
   */
  public readonly attrClusterEndpointPort: number;

  /**
   * The status of the parameter group used by the cluster , for example `active` or `applying` .
   *
   * @cloudformationAttribute ParameterGroupStatus
   */
  public readonly attrParameterGroupStatus: string;

  /**
   * The status of the cluster. For example, 'available', 'updating' or 'creating'.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The name of the Access Control List to associate with the cluster .
   */
  public aclName: string;

  /**
   * When set to true, the cluster will automatically receive minor engine version upgrades after launch.
   */
  public autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * The cluster 's configuration endpoint.
   */
  public clusterEndpoint?: CfnCluster.EndpointProperty | cdk.IResolvable;

  /**
   * The name of the cluster .
   */
  public clusterName: string;

  /**
   * Enables data tiering.
   */
  public dataTiering?: string;

  /**
   * A description of the cluster .
   */
  public description?: string;

  /**
   * The Redis engine version used by the cluster .
   */
  public engineVersion?: string;

  /**
   * The user-supplied name of a final cluster snapshot.
   */
  public finalSnapshotName?: string;

  /**
   * The ID of the KMS key used to encrypt the cluster .
   */
  public kmsKeyId?: string;

  /**
   * Specifies the weekly time range during which maintenance on the cluster is performed.
   */
  public maintenanceWindow?: string;

  /**
   * The cluster 's node type.
   */
  public nodeType: string;

  /**
   * The number of replicas to apply to each shard.
   */
  public numReplicasPerShard?: number;

  /**
   * The number of shards in the cluster .
   */
  public numShards?: number;

  /**
   * The name of the parameter group used by the cluster .
   */
  public parameterGroupName?: string;

  /**
   * The port used by the cluster .
   */
  public port?: number;

  /**
   * A list of security group names to associate with this cluster .
   */
  public securityGroupIds?: Array<string>;

  /**
   * A list of Amazon Resource Names (ARN) that uniquely identify the RDB snapshot files stored in Amazon S3.
   */
  public snapshotArns?: Array<string>;

  /**
   * The name of a snapshot from which to restore data into the new cluster .
   */
  public snapshotName?: string;

  /**
   * The number of days for which MemoryDB retains automatic snapshots before deleting them.
   */
  public snapshotRetentionLimit?: number;

  /**
   * The daily time range (in UTC) during which MemoryDB begins taking a daily snapshot of your shard.
   */
  public snapshotWindow?: string;

  /**
   * When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the ARN of the SNS topic, such as `arn:aws:memorydb:us-east-1:123456789012:mySNSTopic`.
   */
  public snsTopicArn?: string;

  /**
   * The SNS topic must be in Active status to receive notifications.
   */
  public snsTopicStatus?: string;

  /**
   * The name of the subnet group used by the cluster .
   */
  public subnetGroupName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A flag to indicate if In-transit encryption is enabled.
   */
  public tlsEnabled?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterProps) {
    super(scope, id, {
      "type": CfnCluster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "aclName", this);
    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "nodeType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("ARN", cdk.ResolutionTypeHint.STRING));
    this.attrClusterEndpointAddress = cdk.Token.asString(this.getAtt("ClusterEndpoint.Address", cdk.ResolutionTypeHint.STRING));
    this.attrClusterEndpointPort = cdk.Token.asNumber(this.getAtt("ClusterEndpoint.Port", cdk.ResolutionTypeHint.NUMBER));
    this.attrParameterGroupStatus = cdk.Token.asString(this.getAtt("ParameterGroupStatus", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.aclName = props.aclName;
    this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
    this.clusterEndpoint = props.clusterEndpoint;
    this.clusterName = props.clusterName;
    this.dataTiering = props.dataTiering;
    this.description = props.description;
    this.engineVersion = props.engineVersion;
    this.finalSnapshotName = props.finalSnapshotName;
    this.kmsKeyId = props.kmsKeyId;
    this.maintenanceWindow = props.maintenanceWindow;
    this.nodeType = props.nodeType;
    this.numReplicasPerShard = props.numReplicasPerShard;
    this.numShards = props.numShards;
    this.parameterGroupName = props.parameterGroupName;
    this.port = props.port;
    this.securityGroupIds = props.securityGroupIds;
    this.snapshotArns = props.snapshotArns;
    this.snapshotName = props.snapshotName;
    this.snapshotRetentionLimit = props.snapshotRetentionLimit;
    this.snapshotWindow = props.snapshotWindow;
    this.snsTopicArn = props.snsTopicArn;
    this.snsTopicStatus = props.snsTopicStatus;
    this.subnetGroupName = props.subnetGroupName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MemoryDB::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tlsEnabled = props.tlsEnabled;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "aclName": this.aclName,
      "autoMinorVersionUpgrade": this.autoMinorVersionUpgrade,
      "clusterEndpoint": this.clusterEndpoint,
      "clusterName": this.clusterName,
      "dataTiering": this.dataTiering,
      "description": this.description,
      "engineVersion": this.engineVersion,
      "finalSnapshotName": this.finalSnapshotName,
      "kmsKeyId": this.kmsKeyId,
      "maintenanceWindow": this.maintenanceWindow,
      "nodeType": this.nodeType,
      "numReplicasPerShard": this.numReplicasPerShard,
      "numShards": this.numShards,
      "parameterGroupName": this.parameterGroupName,
      "port": this.port,
      "securityGroupIds": this.securityGroupIds,
      "snapshotArns": this.snapshotArns,
      "snapshotName": this.snapshotName,
      "snapshotRetentionLimit": this.snapshotRetentionLimit,
      "snapshotWindow": this.snapshotWindow,
      "snsTopicArn": this.snsTopicArn,
      "snsTopicStatus": this.snsTopicStatus,
      "subnetGroupName": this.subnetGroupName,
      "tags": this.tags.renderTags(),
      "tlsEnabled": this.tlsEnabled
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterPropsToCloudFormation(props);
  }
}

export namespace CfnCluster {
  /**
   * Represents the information required for client programs to connect to the cluster and its nodes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-memorydb-cluster-endpoint.html
   */
  export interface EndpointProperty {
    /**
     * The DNS hostname of the node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-memorydb-cluster-endpoint.html#cfn-memorydb-cluster-endpoint-address
     */
    readonly address?: string;

    /**
     * The port number that the engine is listening on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-memorydb-cluster-endpoint.html#cfn-memorydb-cluster-endpoint-port
     */
    readonly port?: number;
  }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html
 */
export interface CfnClusterProps {
  /**
   * The name of the Access Control List to associate with the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-aclname
   */
  readonly aclName: string;

  /**
   * When set to true, the cluster will automatically receive minor engine version upgrades after launch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-autominorversionupgrade
   */
  readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

  /**
   * The cluster 's configuration endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-clusterendpoint
   */
  readonly clusterEndpoint?: CfnCluster.EndpointProperty | cdk.IResolvable;

  /**
   * The name of the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-clustername
   */
  readonly clusterName: string;

  /**
   * Enables data tiering.
   *
   * Data tiering is only supported for replication groups using the r6gd node type. This parameter must be set to true when using r6gd nodes. For more information, see [Data tiering](https://docs.aws.amazon.com/memorydb/latest/devguide/data-tiering.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-datatiering
   */
  readonly dataTiering?: string;

  /**
   * A description of the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-description
   */
  readonly description?: string;

  /**
   * The Redis engine version used by the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-engineversion
   */
  readonly engineVersion?: string;

  /**
   * The user-supplied name of a final cluster snapshot.
   *
   * This is the unique name that identifies the snapshot. MemoryDB creates the snapshot, and then deletes the cluster immediately afterward.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-finalsnapshotname
   */
  readonly finalSnapshotName?: string;

  /**
   * The ID of the KMS key used to encrypt the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * Specifies the weekly time range during which maintenance on the cluster is performed.
   *
   * It is specified as a range in the format `ddd:hh24:mi-ddd:hh24:mi` (24H Clock UTC). The minimum maintenance window is a 60 minute period.
   *
   * *Pattern* : `ddd:hh24:mi-ddd:hh24:mi`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-maintenancewindow
   */
  readonly maintenanceWindow?: string;

  /**
   * The cluster 's node type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-nodetype
   */
  readonly nodeType: string;

  /**
   * The number of replicas to apply to each shard.
   *
   * *Default value* : `1`
   *
   * *Maximum value* : `5`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-numreplicaspershard
   */
  readonly numReplicasPerShard?: number;

  /**
   * The number of shards in the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-numshards
   */
  readonly numShards?: number;

  /**
   * The name of the parameter group used by the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-parametergroupname
   */
  readonly parameterGroupName?: string;

  /**
   * The port used by the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-port
   */
  readonly port?: number;

  /**
   * A list of security group names to associate with this cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * A list of Amazon Resource Names (ARN) that uniquely identify the RDB snapshot files stored in Amazon S3.
   *
   * The snapshot files are used to populate the new cluster . The Amazon S3 object name in the ARN cannot contain any commas.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-snapshotarns
   */
  readonly snapshotArns?: Array<string>;

  /**
   * The name of a snapshot from which to restore data into the new cluster .
   *
   * The snapshot status changes to restoring while the new cluster is being created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-snapshotname
   */
  readonly snapshotName?: string;

  /**
   * The number of days for which MemoryDB retains automatic snapshots before deleting them.
   *
   * For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-snapshotretentionlimit
   */
  readonly snapshotRetentionLimit?: number;

  /**
   * The daily time range (in UTC) during which MemoryDB begins taking a daily snapshot of your shard.
   *
   * Example: 05:00-09:00 If you do not specify this parameter, MemoryDB automatically chooses an appropriate time range.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-snapshotwindow
   */
  readonly snapshotWindow?: string;

  /**
   * When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the ARN of the SNS topic, such as `arn:aws:memorydb:us-east-1:123456789012:mySNSTopic`.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-snstopicarn
   */
  readonly snsTopicArn?: string;

  /**
   * The SNS topic must be in Active status to receive notifications.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-snstopicstatus
   */
  readonly snsTopicStatus?: string;

  /**
   * The name of the subnet group used by the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-subnetgroupname
   */
  readonly subnetGroupName?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A flag to indicate if In-transit encryption is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-cluster.html#cfn-memorydb-cluster-tlsenabled
   */
  readonly tlsEnabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `EndpointProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"EndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnClusterEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EndpointProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aclName", cdk.requiredValidator)(properties.aclName));
  errors.collect(cdk.propertyValidator("aclName", cdk.validateString)(properties.aclName));
  errors.collect(cdk.propertyValidator("autoMinorVersionUpgrade", cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
  errors.collect(cdk.propertyValidator("clusterEndpoint", CfnClusterEndpointPropertyValidator)(properties.clusterEndpoint));
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("dataTiering", cdk.validateString)(properties.dataTiering));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("finalSnapshotName", cdk.validateString)(properties.finalSnapshotName));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("maintenanceWindow", cdk.validateString)(properties.maintenanceWindow));
  errors.collect(cdk.propertyValidator("nodeType", cdk.requiredValidator)(properties.nodeType));
  errors.collect(cdk.propertyValidator("nodeType", cdk.validateString)(properties.nodeType));
  errors.collect(cdk.propertyValidator("numReplicasPerShard", cdk.validateNumber)(properties.numReplicasPerShard));
  errors.collect(cdk.propertyValidator("numShards", cdk.validateNumber)(properties.numShards));
  errors.collect(cdk.propertyValidator("parameterGroupName", cdk.validateString)(properties.parameterGroupName));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("snapshotArns", cdk.listValidator(cdk.validateString))(properties.snapshotArns));
  errors.collect(cdk.propertyValidator("snapshotName", cdk.validateString)(properties.snapshotName));
  errors.collect(cdk.propertyValidator("snapshotRetentionLimit", cdk.validateNumber)(properties.snapshotRetentionLimit));
  errors.collect(cdk.propertyValidator("snapshotWindow", cdk.validateString)(properties.snapshotWindow));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("snsTopicStatus", cdk.validateString)(properties.snsTopicStatus));
  errors.collect(cdk.propertyValidator("subnetGroupName", cdk.validateString)(properties.subnetGroupName));
  errors.collect(cdk.propertyValidator("tlsEnabled", cdk.validateBoolean)(properties.tlsEnabled));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "ACLName": cdk.stringToCloudFormation(properties.aclName),
    "AutoMinorVersionUpgrade": cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
    "ClusterEndpoint": convertCfnClusterEndpointPropertyToCloudFormation(properties.clusterEndpoint),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "DataTiering": cdk.stringToCloudFormation(properties.dataTiering),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "FinalSnapshotName": cdk.stringToCloudFormation(properties.finalSnapshotName),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "MaintenanceWindow": cdk.stringToCloudFormation(properties.maintenanceWindow),
    "NodeType": cdk.stringToCloudFormation(properties.nodeType),
    "NumReplicasPerShard": cdk.numberToCloudFormation(properties.numReplicasPerShard),
    "NumShards": cdk.numberToCloudFormation(properties.numShards),
    "ParameterGroupName": cdk.stringToCloudFormation(properties.parameterGroupName),
    "Port": cdk.numberToCloudFormation(properties.port),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SnapshotArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.snapshotArns),
    "SnapshotName": cdk.stringToCloudFormation(properties.snapshotName),
    "SnapshotRetentionLimit": cdk.numberToCloudFormation(properties.snapshotRetentionLimit),
    "SnapshotWindow": cdk.stringToCloudFormation(properties.snapshotWindow),
    "SnsTopicArn": cdk.stringToCloudFormation(properties.snsTopicArn),
    "SnsTopicStatus": cdk.stringToCloudFormation(properties.snsTopicStatus),
    "SubnetGroupName": cdk.stringToCloudFormation(properties.subnetGroupName),
    "TLSEnabled": cdk.booleanToCloudFormation(properties.tlsEnabled),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
  ret.addPropertyResult("aclName", "ACLName", (properties.ACLName != null ? cfn_parse.FromCloudFormation.getString(properties.ACLName) : undefined));
  ret.addPropertyResult("autoMinorVersionUpgrade", "AutoMinorVersionUpgrade", (properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined));
  ret.addPropertyResult("clusterEndpoint", "ClusterEndpoint", (properties.ClusterEndpoint != null ? CfnClusterEndpointPropertyFromCloudFormation(properties.ClusterEndpoint) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("dataTiering", "DataTiering", (properties.DataTiering != null ? cfn_parse.FromCloudFormation.getString(properties.DataTiering) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("finalSnapshotName", "FinalSnapshotName", (properties.FinalSnapshotName != null ? cfn_parse.FromCloudFormation.getString(properties.FinalSnapshotName) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("maintenanceWindow", "MaintenanceWindow", (properties.MaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.MaintenanceWindow) : undefined));
  ret.addPropertyResult("nodeType", "NodeType", (properties.NodeType != null ? cfn_parse.FromCloudFormation.getString(properties.NodeType) : undefined));
  ret.addPropertyResult("numReplicasPerShard", "NumReplicasPerShard", (properties.NumReplicasPerShard != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumReplicasPerShard) : undefined));
  ret.addPropertyResult("numShards", "NumShards", (properties.NumShards != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumShards) : undefined));
  ret.addPropertyResult("parameterGroupName", "ParameterGroupName", (properties.ParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterGroupName) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("snapshotArns", "SnapshotArns", (properties.SnapshotArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SnapshotArns) : undefined));
  ret.addPropertyResult("snapshotName", "SnapshotName", (properties.SnapshotName != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotName) : undefined));
  ret.addPropertyResult("snapshotRetentionLimit", "SnapshotRetentionLimit", (properties.SnapshotRetentionLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.SnapshotRetentionLimit) : undefined));
  ret.addPropertyResult("snapshotWindow", "SnapshotWindow", (properties.SnapshotWindow != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotWindow) : undefined));
  ret.addPropertyResult("snsTopicArn", "SnsTopicArn", (properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined));
  ret.addPropertyResult("snsTopicStatus", "SnsTopicStatus", (properties.SnsTopicStatus != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicStatus) : undefined));
  ret.addPropertyResult("subnetGroupName", "SubnetGroupName", (properties.SubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetGroupName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tlsEnabled", "TLSEnabled", (properties.TLSEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TLSEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new MemoryDB parameter group.
 *
 * A parameter group is a collection of parameters and their values that are applied to all of the nodes in any cluster . For more information, see [Configuring engine parameters using parameter groups](https://docs.aws.amazon.com/memorydb/latest/devguide/parametergroups.html) .
 *
 * @cloudformationResource AWS::MemoryDB::ParameterGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-parametergroup.html
 */
export class CfnParameterGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MemoryDB::ParameterGroup";

  /**
   * Build a CfnParameterGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnParameterGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnParameterGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnParameterGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the ARN of the parameter group, such as `arn:aws:memorydb:us-east-1:123456789012:parametergroup/my-parameter-group`
   *
   * @cloudformationAttribute ARN
   */
  public readonly attrArn: string;

  /**
   * A description of the parameter group.
   */
  public description?: string;

  /**
   * The name of the parameter group family that this parameter group is compatible with.
   */
  public family: string;

  /**
   * The name of the parameter group.
   */
  public parameterGroupName: string;

  /**
   * Returns the detailed parameter list for the parameter group.
   */
  public parameters?: any | cdk.IResolvable;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnParameterGroupProps) {
    super(scope, id, {
      "type": CfnParameterGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "family", this);
    cdk.requireProperty(props, "parameterGroupName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("ARN", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.family = props.family;
    this.parameterGroupName = props.parameterGroupName;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MemoryDB::ParameterGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "family": this.family,
      "parameterGroupName": this.parameterGroupName,
      "parameters": this.parameters,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnParameterGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnParameterGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnParameterGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-parametergroup.html
 */
export interface CfnParameterGroupProps {
  /**
   * A description of the parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-parametergroup.html#cfn-memorydb-parametergroup-description
   */
  readonly description?: string;

  /**
   * The name of the parameter group family that this parameter group is compatible with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-parametergroup.html#cfn-memorydb-parametergroup-family
   */
  readonly family: string;

  /**
   * The name of the parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-parametergroup.html#cfn-memorydb-parametergroup-parametergroupname
   */
  readonly parameterGroupName: string;

  /**
   * Returns the detailed parameter list for the parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-parametergroup.html#cfn-memorydb-parametergroup-parameters
   */
  readonly parameters?: any | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-parametergroup.html#cfn-memorydb-parametergroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnParameterGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnParameterGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnParameterGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("family", cdk.requiredValidator)(properties.family));
  errors.collect(cdk.propertyValidator("family", cdk.validateString)(properties.family));
  errors.collect(cdk.propertyValidator("parameterGroupName", cdk.requiredValidator)(properties.parameterGroupName));
  errors.collect(cdk.propertyValidator("parameterGroupName", cdk.validateString)(properties.parameterGroupName));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnParameterGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnParameterGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnParameterGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Family": cdk.stringToCloudFormation(properties.family),
    "ParameterGroupName": cdk.stringToCloudFormation(properties.parameterGroupName),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnParameterGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnParameterGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnParameterGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("family", "Family", (properties.Family != null ? cfn_parse.FromCloudFormation.getString(properties.Family) : undefined));
  ret.addPropertyResult("parameterGroupName", "ParameterGroupName", (properties.ParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterGroupName) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a subnet group.
 *
 * A subnet group is a collection of subnets (typically private) that you can designate for your cluster s running in an Amazon Virtual Private Cloud (VPC) environment. When you create a cluster in an Amazon VPC , you must specify a subnet group. MemoryDB uses that subnet group to choose a subnet and IP addresses within that subnet to associate with your nodes. For more information, see [Subnets and subnet groups](https://docs.aws.amazon.com/memorydb/latest/devguide/subnetgroups.html) .
 *
 * @cloudformationResource AWS::MemoryDB::SubnetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-subnetgroup.html
 */
export class CfnSubnetGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MemoryDB::SubnetGroup";

  /**
   * Build a CfnSubnetGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSubnetGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSubnetGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSubnetGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the ARN of the subnet group, such as `arn:aws:memorydb:us-east-1:123456789012:subnetgroup/my-subnet-group`
   *
   * @cloudformationAttribute ARN
   */
  public readonly attrArn: string;

  /**
   * A description of the subnet group.
   */
  public description?: string;

  /**
   * The name of the subnet group to be used for the cluster .
   */
  public subnetGroupName: string;

  /**
   * A list of Amazon VPC subnet IDs for the subnet group.
   */
  public subnetIds: Array<string>;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnSubnetGroupProps) {
    super(scope, id, {
      "type": CfnSubnetGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "subnetGroupName", this);
    cdk.requireProperty(props, "subnetIds", this);

    this.attrArn = cdk.Token.asString(this.getAtt("ARN", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.subnetGroupName = props.subnetGroupName;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MemoryDB::SubnetGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "subnetGroupName": this.subnetGroupName,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubnetGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSubnetGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSubnetGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-subnetgroup.html
 */
export interface CfnSubnetGroupProps {
  /**
   * A description of the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-subnetgroup.html#cfn-memorydb-subnetgroup-description
   */
  readonly description?: string;

  /**
   * The name of the subnet group to be used for the cluster .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-subnetgroup.html#cfn-memorydb-subnetgroup-subnetgroupname
   */
  readonly subnetGroupName: string;

  /**
   * A list of Amazon VPC subnet IDs for the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-subnetgroup.html#cfn-memorydb-subnetgroup-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-subnetgroup.html#cfn-memorydb-subnetgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnSubnetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubnetGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSubnetGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("subnetGroupName", cdk.requiredValidator)(properties.subnetGroupName));
  errors.collect(cdk.propertyValidator("subnetGroupName", cdk.validateString)(properties.subnetGroupName));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSubnetGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnSubnetGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubnetGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "SubnetGroupName": cdk.stringToCloudFormation(properties.subnetGroupName),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSubnetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubnetGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubnetGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("subnetGroupName", "SubnetGroupName", (properties.SubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetGroupName) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a MemoryDB user.
 *
 * For more information, see [Authenticating users with Access Contol Lists (ACLs)](https://docs.aws.amazon.com/memorydb/latest/devguide/clusters.acls.html) .
 *
 * @cloudformationResource AWS::MemoryDB::User
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-user.html
 */
export class CfnUser extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MemoryDB::User";

  /**
   * Build a CfnUser from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUser {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUser(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the ARN of the user, such as `arn:aws:memorydb:us-east-1:123456789012:user/user1`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Indicates the user status.
   *
   * *Valid values* : `active` | `modifying` | `deleting`
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * Access permissions string used for this user.
   */
  public accessString?: string;

  /**
   * Denotes whether the user requires a password to authenticate.
   */
  public authenticationMode?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the user.
   */
  public userName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserProps) {
    super(scope, id, {
      "type": CfnUser.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "userName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.accessString = props.accessString;
    this.authenticationMode = props.authenticationMode;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MemoryDB::User", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userName = props.userName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessString": this.accessString,
      "authenticationMode": this.authenticationMode,
      "tags": this.tags.renderTags(),
      "userName": this.userName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUser.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPropsToCloudFormation(props);
  }
}

export namespace CfnUser {
  /**
   * Denotes the user's authentication properties, such as whether it requires a password to authenticate.
   *
   * Used in output responses.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-memorydb-user-authenticationmode.html
   */
  export interface AuthenticationModeProperty {
    /**
     * The password(s) used for authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-memorydb-user-authenticationmode.html#cfn-memorydb-user-authenticationmode-passwords
     */
    readonly passwords?: Array<string>;

    /**
     * Indicates whether the user requires a password to authenticate.
     *
     * All newly-created users require a password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-memorydb-user-authenticationmode.html#cfn-memorydb-user-authenticationmode-type
     */
    readonly type?: string;
  }
}

/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-user.html
 */
export interface CfnUserProps {
  /**
   * Access permissions string used for this user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-user.html#cfn-memorydb-user-accessstring
   */
  readonly accessString?: string;

  /**
   * Denotes whether the user requires a password to authenticate.
   *
   * *Example:*
   *
   * `mynewdbuser: Type: AWS::MemoryDB::User Properties: AccessString: on ~* &* +@all AuthenticationMode: Passwords: '1234567890123456' Type: password UserName: mynewdbuser AuthenticationMode: { "Passwords": ["1234567890123456"], "Type": "Password" }`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-user.html#cfn-memorydb-user-authenticationmode
   */
  readonly authenticationMode?: any | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-user.html#cfn-memorydb-user-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-memorydb-user.html#cfn-memorydb-user-username
   */
  readonly userName: string;
}

/**
 * Determine whether the given properties match those of a `AuthenticationModeProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticationModeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserAuthenticationModePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("passwords", cdk.listValidator(cdk.validateString))(properties.passwords));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"AuthenticationModeProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserAuthenticationModePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserAuthenticationModePropertyValidator(properties).assertSuccess();
  return {
    "Passwords": cdk.listMapper(cdk.stringToCloudFormation)(properties.passwords),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnUserAuthenticationModePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUser.AuthenticationModeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.AuthenticationModeProperty>();
  ret.addPropertyResult("passwords", "Passwords", (properties.Passwords != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Passwords) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessString", cdk.validateString)(properties.accessString));
  errors.collect(cdk.propertyValidator("authenticationMode", cdk.validateObject)(properties.authenticationMode));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userName", cdk.requiredValidator)(properties.userName));
  errors.collect(cdk.propertyValidator("userName", cdk.validateString)(properties.userName));
  return errors.wrap("supplied properties not correct for \"CfnUserProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPropsValidator(properties).assertSuccess();
  return {
    "AccessString": cdk.stringToCloudFormation(properties.accessString),
    "AuthenticationMode": cdk.objectToCloudFormation(properties.authenticationMode),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserName": cdk.stringToCloudFormation(properties.userName)
  };
}

// @ts-ignore TS6133
function CfnUserPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProps>();
  ret.addPropertyResult("accessString", "AccessString", (properties.AccessString != null ? cfn_parse.FromCloudFormation.getString(properties.AccessString) : undefined));
  ret.addPropertyResult("authenticationMode", "AuthenticationMode", (properties.AuthenticationMode != null ? cfn_parse.FromCloudFormation.getAny(properties.AuthenticationMode) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("userName", "UserName", (properties.UserName != null ? cfn_parse.FromCloudFormation.getString(properties.UserName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}