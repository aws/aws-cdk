/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new Amazon DocumentDB elastic cluster and returns its cluster structure.
 *
 * @cloudformationResource AWS::DocDBElastic::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DocDBElastic::Cluster";

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
   * @cloudformationAttribute ClusterArn
   */
  public readonly attrClusterArn: string;

  /**
   * The URL used to connect to the elastic cluster.
   *
   * @cloudformationAttribute ClusterEndpoint
   */
  public readonly attrClusterEndpoint: string;

  /**
   * The name of the Amazon DocumentDB elastic clusters administrator.
   */
  public adminUserName: string;

  /**
   * The password for the Elastic DocumentDB cluster administrator and can contain any printable ASCII characters.
   */
  public adminUserPassword?: string;

  /**
   * The authentication type used to determine where to fetch the password used for accessing the elastic cluster.
   */
  public authType: string;

  /**
   * The name of the new elastic cluster. This parameter is stored as a lowercase string.
   */
  public clusterName: string;

  /**
   * The KMS key identifier to use to encrypt the new elastic cluster.
   */
  public kmsKeyId?: string;

  /**
   * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   */
  public preferredMaintenanceWindow?: string;

  /**
   * The number of vCPUs assigned to each elastic cluster shard.
   */
  public shardCapacity: number;

  /**
   * The number of shards assigned to the elastic cluster.
   */
  public shardCount: number;

  /**
   * The Amazon EC2 subnet IDs for the new elastic cluster.
   */
  public subnetIds?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to be assigned to the new elastic cluster.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A list of EC2 VPC security groups to associate with the new elastic cluster.
   */
  public vpcSecurityGroupIds?: Array<string>;

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

    cdk.requireProperty(props, "adminUserName", this);
    cdk.requireProperty(props, "authType", this);
    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "shardCapacity", this);
    cdk.requireProperty(props, "shardCount", this);

    this.attrClusterArn = cdk.Token.asString(this.getAtt("ClusterArn", cdk.ResolutionTypeHint.STRING));
    this.attrClusterEndpoint = cdk.Token.asString(this.getAtt("ClusterEndpoint", cdk.ResolutionTypeHint.STRING));
    this.adminUserName = props.adminUserName;
    this.adminUserPassword = props.adminUserPassword;
    this.authType = props.authType;
    this.clusterName = props.clusterName;
    this.kmsKeyId = props.kmsKeyId;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.shardCapacity = props.shardCapacity;
    this.shardCount = props.shardCount;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DocDBElastic::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "adminUserName": this.adminUserName,
      "adminUserPassword": this.adminUserPassword,
      "authType": this.authType,
      "clusterName": this.clusterName,
      "kmsKeyId": this.kmsKeyId,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "shardCapacity": this.shardCapacity,
      "shardCount": this.shardCount,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags(),
      "vpcSecurityGroupIds": this.vpcSecurityGroupIds
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

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html
 */
export interface CfnClusterProps {
  /**
   * The name of the Amazon DocumentDB elastic clusters administrator.
   *
   * *Constraints* :
   *
   * - Must be from 1 to 63 letters or numbers.
   * - The first character must be a letter.
   * - Cannot be a reserved word.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-adminusername
   */
  readonly adminUserName: string;

  /**
   * The password for the Elastic DocumentDB cluster administrator and can contain any printable ASCII characters.
   *
   * *Constraints* :
   *
   * - Must contain from 8 to 100 characters.
   * - Cannot contain a forward slash (/), double quote ("), or the "at" symbol (@).
   * - A valid `AdminUserName` entry is also required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-adminuserpassword
   */
  readonly adminUserPassword?: string;

  /**
   * The authentication type used to determine where to fetch the password used for accessing the elastic cluster.
   *
   * Valid types are `PLAIN_TEXT` or `SECRET_ARN` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-authtype
   */
  readonly authType: string;

  /**
   * The name of the new elastic cluster. This parameter is stored as a lowercase string.
   *
   * *Constraints* :
   *
   * - Must contain from 1 to 63 letters, numbers, or hyphens.
   * - The first character must be a letter.
   * - Cannot end with a hyphen or contain two consecutive hyphens.
   *
   * *Example* : `my-cluster`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-clustername
   */
  readonly clusterName: string;

  /**
   * The KMS key identifier to use to encrypt the new elastic cluster.
   *
   * The KMS key identifier is the Amazon Resource Name (ARN) for the KMS encryption key. If you are creating a cluster using the same Amazon account that owns this KMS encryption key, you can use the KMS key alias instead of the ARN as the KMS encryption key.
   *
   * If an encryption key is not specified, Amazon DocumentDB uses the default encryption key that KMS creates for your account. Your account has a different default encryption key for each Amazon Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
   *
   * *Format* : `ddd:hh24:mi-ddd:hh24:mi`
   *
   * *Default* : a 30-minute window selected at random from an 8-hour block of time for each AWS Region , occurring on a random day of the week.
   *
   * *Valid days* : Mon, Tue, Wed, Thu, Fri, Sat, Sun
   *
   * *Constraints* : Minimum 30-minute window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * The number of vCPUs assigned to each elastic cluster shard.
   *
   * Maximum is 64. Allowed values are 2, 4, 8, 16, 32, 64.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-shardcapacity
   */
  readonly shardCapacity: number;

  /**
   * The number of shards assigned to the elastic cluster.
   *
   * Maximum is 32.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-shardcount
   */
  readonly shardCount: number;

  /**
   * The Amazon EC2 subnet IDs for the new elastic cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-subnetids
   */
  readonly subnetIds?: Array<string>;

  /**
   * The tags to be assigned to the new elastic cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A list of EC2 VPC security groups to associate with the new elastic cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-vpcsecuritygroupids
   */
  readonly vpcSecurityGroupIds?: Array<string>;
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
  errors.collect(cdk.propertyValidator("adminUserName", cdk.requiredValidator)(properties.adminUserName));
  errors.collect(cdk.propertyValidator("adminUserName", cdk.validateString)(properties.adminUserName));
  errors.collect(cdk.propertyValidator("adminUserPassword", cdk.validateString)(properties.adminUserPassword));
  errors.collect(cdk.propertyValidator("authType", cdk.requiredValidator)(properties.authType));
  errors.collect(cdk.propertyValidator("authType", cdk.validateString)(properties.authType));
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("shardCapacity", cdk.requiredValidator)(properties.shardCapacity));
  errors.collect(cdk.propertyValidator("shardCapacity", cdk.validateNumber)(properties.shardCapacity));
  errors.collect(cdk.propertyValidator("shardCount", cdk.requiredValidator)(properties.shardCount));
  errors.collect(cdk.propertyValidator("shardCount", cdk.validateNumber)(properties.shardCount));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupIds", cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "AdminUserName": cdk.stringToCloudFormation(properties.adminUserName),
    "AdminUserPassword": cdk.stringToCloudFormation(properties.adminUserPassword),
    "AuthType": cdk.stringToCloudFormation(properties.authType),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "ShardCapacity": cdk.numberToCloudFormation(properties.shardCapacity),
    "ShardCount": cdk.numberToCloudFormation(properties.shardCount),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcSecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds)
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
  ret.addPropertyResult("adminUserName", "AdminUserName", (properties.AdminUserName != null ? cfn_parse.FromCloudFormation.getString(properties.AdminUserName) : undefined));
  ret.addPropertyResult("adminUserPassword", "AdminUserPassword", (properties.AdminUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.AdminUserPassword) : undefined));
  ret.addPropertyResult("authType", "AuthType", (properties.AuthType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthType) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("shardCapacity", "ShardCapacity", (properties.ShardCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShardCapacity) : undefined));
  ret.addPropertyResult("shardCount", "ShardCount", (properties.ShardCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShardCount) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcSecurityGroupIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}