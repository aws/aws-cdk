/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::NeptuneGraph::Graph resource creates an Amazon NeptuneGraph Graph.
 *
 * @cloudformationResource AWS::NeptuneGraph::Graph
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html
 */
export class CfnGraph extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NeptuneGraph::Graph";

  /**
   * Build a CfnGraph from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGraph {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGraphPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGraph(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The connection endpoint for the graph. For example: `g-12a3bcdef4.us-east-1.neptune-graph.amazonaws.com`
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * Graph resource ARN
   *
   * @cloudformationAttribute GraphArn
   */
  public readonly attrGraphArn: string;

  /**
   * The auto-generated id assigned by the service.
   *
   * @cloudformationAttribute GraphId
   */
  public readonly attrGraphId: string;

  /**
   * Value that indicates whether the Graph has deletion protection enabled.
   */
  public deletionProtection?: boolean | cdk.IResolvable;

  /**
   * Contains a user-supplied name for the Graph.
   */
  public graphName?: string;

  /**
   * Memory for the Graph.
   */
  public provisionedMemory: number;

  /**
   * Specifies whether the Graph can be reached over the internet. Access to all graphs requires IAM authentication.
   */
  public publicConnectivity?: boolean | cdk.IResolvable;

  /**
   * Specifies the number of replicas you want when finished. All replicas will be provisioned in different availability zones.
   */
  public replicaCount?: number;

  /**
   * The tags associated with this graph.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The vector search configuration.
   */
  public vectorSearchConfiguration?: cdk.IResolvable | CfnGraph.VectorSearchConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGraphProps) {
    super(scope, id, {
      "type": CfnGraph.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "provisionedMemory", this);

    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrGraphArn = cdk.Token.asString(this.getAtt("GraphArn", cdk.ResolutionTypeHint.STRING));
    this.attrGraphId = cdk.Token.asString(this.getAtt("GraphId", cdk.ResolutionTypeHint.STRING));
    this.deletionProtection = props.deletionProtection;
    this.graphName = props.graphName;
    this.provisionedMemory = props.provisionedMemory;
    this.publicConnectivity = props.publicConnectivity;
    this.replicaCount = props.replicaCount;
    this.tags = props.tags;
    this.vectorSearchConfiguration = props.vectorSearchConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deletionProtection": this.deletionProtection,
      "graphName": this.graphName,
      "provisionedMemory": this.provisionedMemory,
      "publicConnectivity": this.publicConnectivity,
      "replicaCount": this.replicaCount,
      "tags": this.tags,
      "vectorSearchConfiguration": this.vectorSearchConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGraph.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGraphPropsToCloudFormation(props);
  }
}

export namespace CfnGraph {
  /**
   * The vector search configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-neptunegraph-graph-vectorsearchconfiguration.html
   */
  export interface VectorSearchConfigurationProperty {
    /**
     * The vector search dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-neptunegraph-graph-vectorsearchconfiguration.html#cfn-neptunegraph-graph-vectorsearchconfiguration-vectorsearchdimension
     */
    readonly vectorSearchDimension: number;
  }
}

/**
 * Properties for defining a `CfnGraph`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html
 */
export interface CfnGraphProps {
  /**
   * Value that indicates whether the Graph has deletion protection enabled.
   *
   * The graph can't be deleted when deletion protection is enabled.
   *
   * _Default_: If not specified, the default value is true.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html#cfn-neptunegraph-graph-deletionprotection
   */
  readonly deletionProtection?: boolean | cdk.IResolvable;

  /**
   * Contains a user-supplied name for the Graph.
   *
   * If you don't specify a name, we generate a unique Graph Name using a combination of Stack Name and a UUID comprising of 4 characters.
   *
   * _Important_: If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html#cfn-neptunegraph-graph-graphname
   */
  readonly graphName?: string;

  /**
   * Memory for the Graph.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html#cfn-neptunegraph-graph-provisionedmemory
   */
  readonly provisionedMemory: number;

  /**
   * Specifies whether the Graph can be reached over the internet. Access to all graphs requires IAM authentication.
   *
   * When the Graph is publicly reachable, its Domain Name System (DNS) endpoint resolves to the public IP address from the internet.
   *
   * When the Graph isn't publicly reachable, you need to create a PrivateGraphEndpoint in a given VPC to ensure the DNS name resolves to a private IP address that is reachable from the VPC.
   *
   * _Default_: If not specified, the default value is false.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html#cfn-neptunegraph-graph-publicconnectivity
   */
  readonly publicConnectivity?: boolean | cdk.IResolvable;

  /**
   * Specifies the number of replicas you want when finished. All replicas will be provisioned in different availability zones.
   *
   * Replica Count should always be less than or equal to 2.
   *
   * _Default_: If not specified, the default value is 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html#cfn-neptunegraph-graph-replicacount
   */
  readonly replicaCount?: number;

  /**
   * The tags associated with this graph.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html#cfn-neptunegraph-graph-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The vector search configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-graph.html#cfn-neptunegraph-graph-vectorsearchconfiguration
   */
  readonly vectorSearchConfiguration?: cdk.IResolvable | CfnGraph.VectorSearchConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `VectorSearchConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VectorSearchConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphVectorSearchConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vectorSearchDimension", cdk.requiredValidator)(properties.vectorSearchDimension));
  errors.collect(cdk.propertyValidator("vectorSearchDimension", cdk.validateNumber)(properties.vectorSearchDimension));
  return errors.wrap("supplied properties not correct for \"VectorSearchConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnGraphVectorSearchConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphVectorSearchConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "VectorSearchDimension": cdk.numberToCloudFormation(properties.vectorSearchDimension)
  };
}

// @ts-ignore TS6133
function CfnGraphVectorSearchConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGraph.VectorSearchConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraph.VectorSearchConfigurationProperty>();
  ret.addPropertyResult("vectorSearchDimension", "VectorSearchDimension", (properties.VectorSearchDimension != null ? cfn_parse.FromCloudFormation.getNumber(properties.VectorSearchDimension) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGraphProps`
 *
 * @param properties - the TypeScript properties of a `CfnGraphProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deletionProtection", cdk.validateBoolean)(properties.deletionProtection));
  errors.collect(cdk.propertyValidator("graphName", cdk.validateString)(properties.graphName));
  errors.collect(cdk.propertyValidator("provisionedMemory", cdk.requiredValidator)(properties.provisionedMemory));
  errors.collect(cdk.propertyValidator("provisionedMemory", cdk.validateNumber)(properties.provisionedMemory));
  errors.collect(cdk.propertyValidator("publicConnectivity", cdk.validateBoolean)(properties.publicConnectivity));
  errors.collect(cdk.propertyValidator("replicaCount", cdk.validateNumber)(properties.replicaCount));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vectorSearchConfiguration", CfnGraphVectorSearchConfigurationPropertyValidator)(properties.vectorSearchConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnGraphProps\"");
}

// @ts-ignore TS6133
function convertCfnGraphPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphPropsValidator(properties).assertSuccess();
  return {
    "DeletionProtection": cdk.booleanToCloudFormation(properties.deletionProtection),
    "GraphName": cdk.stringToCloudFormation(properties.graphName),
    "ProvisionedMemory": cdk.numberToCloudFormation(properties.provisionedMemory),
    "PublicConnectivity": cdk.booleanToCloudFormation(properties.publicConnectivity),
    "ReplicaCount": cdk.numberToCloudFormation(properties.replicaCount),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VectorSearchConfiguration": convertCfnGraphVectorSearchConfigurationPropertyToCloudFormation(properties.vectorSearchConfiguration)
  };
}

// @ts-ignore TS6133
function CfnGraphPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphProps>();
  ret.addPropertyResult("deletionProtection", "DeletionProtection", (properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined));
  ret.addPropertyResult("graphName", "GraphName", (properties.GraphName != null ? cfn_parse.FromCloudFormation.getString(properties.GraphName) : undefined));
  ret.addPropertyResult("provisionedMemory", "ProvisionedMemory", (properties.ProvisionedMemory != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProvisionedMemory) : undefined));
  ret.addPropertyResult("publicConnectivity", "PublicConnectivity", (properties.PublicConnectivity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PublicConnectivity) : undefined));
  ret.addPropertyResult("replicaCount", "ReplicaCount", (properties.ReplicaCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReplicaCount) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vectorSearchConfiguration", "VectorSearchConfiguration", (properties.VectorSearchConfiguration != null ? CfnGraphVectorSearchConfigurationPropertyFromCloudFormation(properties.VectorSearchConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::NeptuneGraph::PrivateGraphEndpoint resource creates an Amazon NeptuneGraph PrivateGraphEndpoint.
 *
 * @cloudformationResource AWS::NeptuneGraph::PrivateGraphEndpoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-privategraphendpoint.html
 */
export class CfnPrivateGraphEndpoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NeptuneGraph::PrivateGraphEndpoint";

  /**
   * Build a CfnPrivateGraphEndpoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPrivateGraphEndpoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPrivateGraphEndpointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPrivateGraphEndpoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * PrivateGraphEndpoint resource identifier generated by concatenating the associated GraphIdentifier and VpcId with an underscore separator.
   *
   *  For example, if GraphIdentifier is `g-12a3bcdef4` and VpcId is `vpc-0a12bc34567de8f90`, the generated PrivateGraphEndpointIdentifier will be `g-12a3bcdef4_vpc-0a12bc34567de8f90`
   *
   * @cloudformationAttribute PrivateGraphEndpointIdentifier
   */
  public readonly attrPrivateGraphEndpointIdentifier: string;

  /**
   * VPC endpoint that provides a private connection between the Graph and specified VPC.
   *
   * @cloudformationAttribute VpcEndpointId
   */
  public readonly attrVpcEndpointId: string;

  /**
   * The auto-generated Graph Id assigned by the service.
   */
  public graphIdentifier: string;

  /**
   * The security group Ids associated with the VPC where you want the private graph endpoint to be created, ie, the graph will be reachable from within the VPC.
   */
  public securityGroupIds?: Array<string>;

  /**
   * The subnet Ids associated with the VPC where you want the private graph endpoint to be created, ie, the graph will be reachable from within the VPC.
   */
  public subnetIds?: Array<string>;

  /**
   * The VPC where you want the private graph endpoint to be created, ie, the graph will be reachable from within the VPC.
   */
  public vpcId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPrivateGraphEndpointProps) {
    super(scope, id, {
      "type": CfnPrivateGraphEndpoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "graphIdentifier", this);
    cdk.requireProperty(props, "vpcId", this);

    this.attrPrivateGraphEndpointIdentifier = cdk.Token.asString(this.getAtt("PrivateGraphEndpointIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrVpcEndpointId = cdk.Token.asString(this.getAtt("VpcEndpointId", cdk.ResolutionTypeHint.STRING));
    this.graphIdentifier = props.graphIdentifier;
    this.securityGroupIds = props.securityGroupIds;
    this.subnetIds = props.subnetIds;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "graphIdentifier": this.graphIdentifier,
      "securityGroupIds": this.securityGroupIds,
      "subnetIds": this.subnetIds,
      "vpcId": this.vpcId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPrivateGraphEndpoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPrivateGraphEndpointPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPrivateGraphEndpoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-privategraphendpoint.html
 */
export interface CfnPrivateGraphEndpointProps {
  /**
   * The auto-generated Graph Id assigned by the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-privategraphendpoint.html#cfn-neptunegraph-privategraphendpoint-graphidentifier
   */
  readonly graphIdentifier: string;

  /**
   * The security group Ids associated with the VPC where you want the private graph endpoint to be created, ie, the graph will be reachable from within the VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-privategraphendpoint.html#cfn-neptunegraph-privategraphendpoint-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * The subnet Ids associated with the VPC where you want the private graph endpoint to be created, ie, the graph will be reachable from within the VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-privategraphendpoint.html#cfn-neptunegraph-privategraphendpoint-subnetids
   */
  readonly subnetIds?: Array<string>;

  /**
   * The VPC where you want the private graph endpoint to be created, ie, the graph will be reachable from within the VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-neptunegraph-privategraphendpoint.html#cfn-neptunegraph-privategraphendpoint-vpcid
   */
  readonly vpcId: string;
}

/**
 * Determine whether the given properties match those of a `CfnPrivateGraphEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnPrivateGraphEndpointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrivateGraphEndpointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("graphIdentifier", cdk.requiredValidator)(properties.graphIdentifier));
  errors.collect(cdk.propertyValidator("graphIdentifier", cdk.validateString)(properties.graphIdentifier));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnPrivateGraphEndpointProps\"");
}

// @ts-ignore TS6133
function convertCfnPrivateGraphEndpointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrivateGraphEndpointPropsValidator(properties).assertSuccess();
  return {
    "GraphIdentifier": cdk.stringToCloudFormation(properties.graphIdentifier),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnPrivateGraphEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrivateGraphEndpointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrivateGraphEndpointProps>();
  ret.addPropertyResult("graphIdentifier", "GraphIdentifier", (properties.GraphIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.GraphIdentifier) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}