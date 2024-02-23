/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a DAX cluster.
 *
 * All nodes in the cluster run the same DAX caching software.
 *
 * @cloudformationResource AWS::DAX::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DAX::Cluster";

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
   * Returns the ARN of the DAX cluster. For example:
   *
   * `{ "Fn::GetAtt": [" MyDAXCluster ", "Arn"] }`
   *
   * Returns a value similar to the following:
   *
   * `arn:aws:dax:us-east-1:111122223333:cache/MyDAXCluster`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the endpoint of the DAX cluster. For example:
   *
   * `{ "Fn::GetAtt": [" MyDAXCluster ", "ClusterDiscoveryEndpoint"] }`
   *
   * Returns a value similar to the following:
   *
   * `mydaxcluster.0h3d6x.clustercfg.dax.use1.cache.amazonaws.com:8111`
   *
   * @cloudformationAttribute ClusterDiscoveryEndpoint
   */
  public readonly attrClusterDiscoveryEndpoint: string;

  /**
   * Returns the endpoint URL of the DAX cluster.
   *
   * @cloudformationAttribute ClusterDiscoveryEndpointURL
   */
  public readonly attrClusterDiscoveryEndpointUrl: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Availability Zones (AZs) in which the cluster nodes will reside after the cluster has been created or updated.
   */
  public availabilityZones?: Array<string>;

  /**
   * The encryption type of the cluster's endpoint. Available values are:.
   */
  public clusterEndpointEncryptionType?: string;

  /**
   * The name of the DAX cluster.
   */
  public clusterName?: string;

  /**
   * The description of the cluster.
   */
  public description?: string;

  /**
   * A valid Amazon Resource Name (ARN) that identifies an IAM role.
   */
  public iamRoleArn: string;

  /**
   * The node type for the nodes in the cluster.
   */
  public nodeType: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon SNS topic to which notifications will be sent.
   */
  public notificationTopicArn?: string;

  /**
   * The parameter group to be associated with the DAX cluster.
   */
  public parameterGroupName?: string;

  /**
   * A range of time when maintenance of DAX cluster software will be performed.
   */
  public preferredMaintenanceWindow?: string;

  /**
   * The number of nodes in the DAX cluster.
   */
  public replicationFactor: number;

  /**
   * A list of security group IDs to be assigned to each node in the DAX cluster.
   */
  public securityGroupIds?: Array<string>;

  /**
   * Represents the settings used to enable server-side encryption on the cluster.
   */
  public sseSpecification?: cdk.IResolvable | CfnCluster.SSESpecificationProperty;

  /**
   * The name of the subnet group to be used for the replication group.
   */
  public subnetGroupName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A set of tags to associate with the DAX cluster.
   */
  public tagsRaw?: any;

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

    cdk.requireProperty(props, "iamRoleArn", this);
    cdk.requireProperty(props, "nodeType", this);
    cdk.requireProperty(props, "replicationFactor", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrClusterDiscoveryEndpoint = cdk.Token.asString(this.getAtt("ClusterDiscoveryEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrClusterDiscoveryEndpointUrl = cdk.Token.asString(this.getAtt("ClusterDiscoveryEndpointURL", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.availabilityZones = props.availabilityZones;
    this.clusterEndpointEncryptionType = props.clusterEndpointEncryptionType;
    this.clusterName = props.clusterName;
    this.description = props.description;
    this.iamRoleArn = props.iamRoleArn;
    this.nodeType = props.nodeType;
    this.notificationTopicArn = props.notificationTopicArn;
    this.parameterGroupName = props.parameterGroupName;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.replicationFactor = props.replicationFactor;
    this.securityGroupIds = props.securityGroupIds;
    this.sseSpecification = props.sseSpecification;
    this.subnetGroupName = props.subnetGroupName;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::DAX::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "availabilityZones": this.availabilityZones,
      "clusterEndpointEncryptionType": this.clusterEndpointEncryptionType,
      "clusterName": this.clusterName,
      "description": this.description,
      "iamRoleArn": this.iamRoleArn,
      "nodeType": this.nodeType,
      "notificationTopicArn": this.notificationTopicArn,
      "parameterGroupName": this.parameterGroupName,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "replicationFactor": this.replicationFactor,
      "securityGroupIds": this.securityGroupIds,
      "sseSpecification": this.sseSpecification,
      "subnetGroupName": this.subnetGroupName,
      "tags": this.tags.renderTags()
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
   * Represents the settings used to enable server-side encryption.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dax-cluster-ssespecification.html
   */
  export interface SSESpecificationProperty {
    /**
     * Indicates whether server-side encryption is enabled (true) or disabled (false) on the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dax-cluster-ssespecification.html#cfn-dax-cluster-ssespecification-sseenabled
     */
    readonly sseEnabled?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html
 */
export interface CfnClusterProps {
  /**
   * The Availability Zones (AZs) in which the cluster nodes will reside after the cluster has been created or updated.
   *
   * If provided, the length of this list must equal the `ReplicationFactor` parameter. If you omit this parameter, DAX will spread the nodes across Availability Zones for the highest availability.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-availabilityzones
   */
  readonly availabilityZones?: Array<string>;

  /**
   * The encryption type of the cluster's endpoint. Available values are:.
   *
   * - `NONE` - The cluster's endpoint will be unencrypted.
   * - `TLS` - The cluster's endpoint will be encrypted with Transport Layer Security, and will provide an x509 certificate for authentication.
   *
   * The default value is `NONE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-clusterendpointencryptiontype
   */
  readonly clusterEndpointEncryptionType?: string;

  /**
   * The name of the DAX cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-clustername
   */
  readonly clusterName?: string;

  /**
   * The description of the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-description
   */
  readonly description?: string;

  /**
   * A valid Amazon Resource Name (ARN) that identifies an IAM role.
   *
   * At runtime, DAX will assume this role and use the role's permissions to access DynamoDB on your behalf.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-iamrolearn
   */
  readonly iamRoleArn: string;

  /**
   * The node type for the nodes in the cluster.
   *
   * (All nodes in a DAX cluster are of the same type.)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-nodetype
   */
  readonly nodeType: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon SNS topic to which notifications will be sent.
   *
   * > The Amazon SNS topic owner must be same as the DAX cluster owner.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-notificationtopicarn
   */
  readonly notificationTopicArn?: string;

  /**
   * The parameter group to be associated with the DAX cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-parametergroupname
   */
  readonly parameterGroupName?: string;

  /**
   * A range of time when maintenance of DAX cluster software will be performed.
   *
   * For example: `sun:01:00-sun:09:00` . Cluster maintenance normally takes less than 30 minutes, and is performed automatically within the maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * The number of nodes in the DAX cluster.
   *
   * A replication factor of 1 will create a single-node cluster, without any read replicas. For additional fault tolerance, you can create a multiple node cluster with one or more read replicas. To do this, set `ReplicationFactor` to a number between 3 (one primary and two read replicas) and 10 (one primary and nine read replicas). `If the AvailabilityZones` parameter is provided, its length must equal the `ReplicationFactor` .
   *
   * > AWS recommends that you have at least two read replicas per cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-replicationfactor
   */
  readonly replicationFactor: number;

  /**
   * A list of security group IDs to be assigned to each node in the DAX cluster.
   *
   * (Each of the security group ID is system-generated.)
   *
   * If this parameter is not specified, DAX assigns the default VPC security group to each node.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * Represents the settings used to enable server-side encryption on the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-ssespecification
   */
  readonly sseSpecification?: cdk.IResolvable | CfnCluster.SSESpecificationProperty;

  /**
   * The name of the subnet group to be used for the replication group.
   *
   * > DAX clusters can only run in an Amazon VPC environment. All of the subnets that you specify in a subnet group must exist in the same VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-subnetgroupname
   */
  readonly subnetGroupName?: string;

  /**
   * A set of tags to associate with the DAX cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html#cfn-dax-cluster-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `SSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterSSESpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sseEnabled", cdk.validateBoolean)(properties.sseEnabled));
  return errors.wrap("supplied properties not correct for \"SSESpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterSSESpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterSSESpecificationPropertyValidator(properties).assertSuccess();
  return {
    "SSEEnabled": cdk.booleanToCloudFormation(properties.sseEnabled)
  };
}

// @ts-ignore TS6133
function CfnClusterSSESpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.SSESpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.SSESpecificationProperty>();
  ret.addPropertyResult("sseEnabled", "SSEEnabled", (properties.SSEEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SSEEnabled) : undefined));
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
  errors.collect(cdk.propertyValidator("availabilityZones", cdk.listValidator(cdk.validateString))(properties.availabilityZones));
  errors.collect(cdk.propertyValidator("clusterEndpointEncryptionType", cdk.validateString)(properties.clusterEndpointEncryptionType));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.requiredValidator)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("nodeType", cdk.requiredValidator)(properties.nodeType));
  errors.collect(cdk.propertyValidator("nodeType", cdk.validateString)(properties.nodeType));
  errors.collect(cdk.propertyValidator("notificationTopicArn", cdk.validateString)(properties.notificationTopicArn));
  errors.collect(cdk.propertyValidator("parameterGroupName", cdk.validateString)(properties.parameterGroupName));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("replicationFactor", cdk.requiredValidator)(properties.replicationFactor));
  errors.collect(cdk.propertyValidator("replicationFactor", cdk.validateNumber)(properties.replicationFactor));
  errors.collect(cdk.propertyValidator("sseSpecification", CfnClusterSSESpecificationPropertyValidator)(properties.sseSpecification));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetGroupName", cdk.validateString)(properties.subnetGroupName));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "AvailabilityZones": cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
    "ClusterEndpointEncryptionType": cdk.stringToCloudFormation(properties.clusterEndpointEncryptionType),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IAMRoleARN": cdk.stringToCloudFormation(properties.iamRoleArn),
    "NodeType": cdk.stringToCloudFormation(properties.nodeType),
    "NotificationTopicARN": cdk.stringToCloudFormation(properties.notificationTopicArn),
    "ParameterGroupName": cdk.stringToCloudFormation(properties.parameterGroupName),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "ReplicationFactor": cdk.numberToCloudFormation(properties.replicationFactor),
    "SSESpecification": convertCfnClusterSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetGroupName": cdk.stringToCloudFormation(properties.subnetGroupName),
    "Tags": cdk.objectToCloudFormation(properties.tags)
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
  ret.addPropertyResult("availabilityZones", "AvailabilityZones", (properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AvailabilityZones) : undefined));
  ret.addPropertyResult("clusterEndpointEncryptionType", "ClusterEndpointEncryptionType", (properties.ClusterEndpointEncryptionType != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterEndpointEncryptionType) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("iamRoleArn", "IAMRoleARN", (properties.IAMRoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.IAMRoleARN) : undefined));
  ret.addPropertyResult("nodeType", "NodeType", (properties.NodeType != null ? cfn_parse.FromCloudFormation.getString(properties.NodeType) : undefined));
  ret.addPropertyResult("notificationTopicArn", "NotificationTopicARN", (properties.NotificationTopicARN != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationTopicARN) : undefined));
  ret.addPropertyResult("parameterGroupName", "ParameterGroupName", (properties.ParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterGroupName) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("replicationFactor", "ReplicationFactor", (properties.ReplicationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReplicationFactor) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("sseSpecification", "SSESpecification", (properties.SSESpecification != null ? CfnClusterSSESpecificationPropertyFromCloudFormation(properties.SSESpecification) : undefined));
  ret.addPropertyResult("subnetGroupName", "SubnetGroupName", (properties.SubnetGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetGroupName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A named set of parameters that are applied to all of the nodes in a DAX cluster.
 *
 * @cloudformationResource AWS::DAX::ParameterGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html
 */
export class CfnParameterGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DAX::ParameterGroup";

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
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A description of the parameter group.
   */
  public description?: string;

  /**
   * The name of the parameter group.
   */
  public parameterGroupName?: string;

  /**
   * An array of name-value pairs for the parameters in the group.
   */
  public parameterNameValues?: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnParameterGroupProps = {}) {
    super(scope, id, {
      "type": CfnParameterGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.parameterGroupName = props.parameterGroupName;
    this.parameterNameValues = props.parameterNameValues;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "parameterGroupName": this.parameterGroupName,
      "parameterNameValues": this.parameterNameValues
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html
 */
export interface CfnParameterGroupProps {
  /**
   * A description of the parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-description
   */
  readonly description?: string;

  /**
   * The name of the parameter group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-parametergroupname
   */
  readonly parameterGroupName?: string;

  /**
   * An array of name-value pairs for the parameters in the group.
   *
   * Each element in the array represents a single parameter.
   *
   * > `record-ttl-millis` and `query-ttl-millis` are the only supported parameter names. For more details, see [Configuring TTL Settings](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.cluster-management.html#DAX.cluster-management.custom-settings.ttl) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-parametergroup.html#cfn-dax-parametergroup-parameternamevalues
   */
  readonly parameterNameValues?: any | cdk.IResolvable;
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
  errors.collect(cdk.propertyValidator("parameterGroupName", cdk.validateString)(properties.parameterGroupName));
  errors.collect(cdk.propertyValidator("parameterNameValues", cdk.validateObject)(properties.parameterNameValues));
  return errors.wrap("supplied properties not correct for \"CfnParameterGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnParameterGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnParameterGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ParameterGroupName": cdk.stringToCloudFormation(properties.parameterGroupName),
    "ParameterNameValues": cdk.objectToCloudFormation(properties.parameterNameValues)
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
  ret.addPropertyResult("parameterGroupName", "ParameterGroupName", (properties.ParameterGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterGroupName) : undefined));
  ret.addPropertyResult("parameterNameValues", "ParameterNameValues", (properties.ParameterNameValues != null ? cfn_parse.FromCloudFormation.getAny(properties.ParameterNameValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new subnet group.
 *
 * @cloudformationResource AWS::DAX::SubnetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html
 */
export class CfnSubnetGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DAX::SubnetGroup";

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
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The description of the subnet group.
   */
  public description?: string;

  /**
   * The name of the subnet group.
   */
  public subnetGroupName?: string;

  /**
   * A list of VPC subnet IDs for the subnet group.
   */
  public subnetIds: Array<string>;

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

    cdk.requireProperty(props, "subnetIds", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.subnetGroupName = props.subnetGroupName;
    this.subnetIds = props.subnetIds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "subnetGroupName": this.subnetGroupName,
      "subnetIds": this.subnetIds
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html
 */
export interface CfnSubnetGroupProps {
  /**
   * The description of the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-description
   */
  readonly description?: string;

  /**
   * The name of the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-subnetgroupname
   */
  readonly subnetGroupName?: string;

  /**
   * A list of VPC subnet IDs for the subnet group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-subnetgroup.html#cfn-dax-subnetgroup-subnetids
   */
  readonly subnetIds: Array<string>;
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
  errors.collect(cdk.propertyValidator("subnetGroupName", cdk.validateString)(properties.subnetGroupName));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"CfnSubnetGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnSubnetGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubnetGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "SubnetGroupName": cdk.stringToCloudFormation(properties.subnetGroupName),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
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
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}