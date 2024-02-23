/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a cluster in Amazon Route 53 Application Recovery Controller.
 *
 * A cluster is a set of redundant Regional endpoints that you can run Route 53 ARC API calls against to update or get the state of one or more routing controls.
 *
 * @cloudformationResource AWS::Route53RecoveryControl::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Route53RecoveryControl::Cluster";

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
   * The Amazon Resource Name (ARN) of the cluster.
   *
   * @cloudformationAttribute ClusterArn
   */
  public readonly attrClusterArn: string;

  /**
   * An array of endpoints for the cluster. You specify one of these endpoints when you want to set or retrieve a routing control state in the cluster.
   *
   * @cloudformationAttribute ClusterEndpoints
   */
  public readonly attrClusterEndpoints: cdk.IResolvable;

  /**
   * The deployment status of the cluster. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * Name of the cluster.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags associated with the cluster.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

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

    cdk.requireProperty(props, "name", this);

    this.attrClusterArn = cdk.Token.asString(this.getAtt("ClusterArn", cdk.ResolutionTypeHint.STRING));
    this.attrClusterEndpoints = this.getAtt("ClusterEndpoints");
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryControl::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
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
   * A cluster endpoint.
   *
   * You specify one of the five cluster endpoints, which consists of an endpoint URL and an AWS Region, when you want to get or update a routing control state in the cluster.
   *
   * For more information, see [Code examples](https://docs.aws.amazon.com/r53recovery/latest/dg/service_code_examples.html) in the Amazon Route 53 Application Recovery Controller Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-cluster-clusterendpoint.html
   */
  export interface ClusterEndpointProperty {
    /**
     * A cluster endpoint URL for one of the five redundant clusters that you specify to set or retrieve a routing control state.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-cluster-clusterendpoint.html#cfn-route53recoverycontrol-cluster-clusterendpoint-endpoint
     */
    readonly endpoint?: string;

    /**
     * The AWS Region for a cluster endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-cluster-clusterendpoint.html#cfn-route53recoverycontrol-cluster-clusterendpoint-region
     */
    readonly region?: string;
  }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html
 */
export interface CfnClusterProps {
  /**
   * Name of the cluster.
   *
   * You can use any non-white space character in the name except the following: & > < ' (single quote) " (double quote) ; (semicolon).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html#cfn-route53recoverycontrol-cluster-name
   */
  readonly name: string;

  /**
   * The tags associated with the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html#cfn-route53recoverycontrol-cluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ClusterEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterClusterEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  return errors.wrap("supplied properties not correct for \"ClusterEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterClusterEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterClusterEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint),
    "Region": cdk.stringToCloudFormation(properties.region)
  };
}

// @ts-ignore TS6133
function CfnClusterClusterEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ClusterEndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ClusterEndpointProperty>();
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
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
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
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
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new control panel in Amazon Route 53 Application Recovery Controller.
 *
 * A control panel represents a group of routing controls that can be changed together in a single transaction. You can use a control panel to centrally view the operational status of applications across your organization, and trigger multi-app failovers in a single transaction, for example, to fail over from one AWS Region (cell) to another.
 *
 * @cloudformationResource AWS::Route53RecoveryControl::ControlPanel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html
 */
export class CfnControlPanel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Route53RecoveryControl::ControlPanel";

  /**
   * Build a CfnControlPanel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnControlPanel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnControlPanelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnControlPanel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the control panel.
   *
   * @cloudformationAttribute ControlPanelArn
   */
  public readonly attrControlPanelArn: string;

  /**
   * The boolean flag that is set to true for the default control panel in the cluster.
   *
   * @cloudformationAttribute DefaultControlPanel
   */
  public readonly attrDefaultControlPanel: cdk.IResolvable;

  /**
   * The number of routing controls in the control panel.
   *
   * @cloudformationAttribute RoutingControlCount
   */
  public readonly attrRoutingControlCount: number;

  /**
   * The deployment status of control panel. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The Amazon Resource Name (ARN) of the cluster for the control panel.
   */
  public clusterArn?: string;

  /**
   * The name of the control panel.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags associated with the control panel.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnControlPanelProps) {
    super(scope, id, {
      "type": CfnControlPanel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrControlPanelArn = cdk.Token.asString(this.getAtt("ControlPanelArn", cdk.ResolutionTypeHint.STRING));
    this.attrDefaultControlPanel = this.getAtt("DefaultControlPanel");
    this.attrRoutingControlCount = cdk.Token.asNumber(this.getAtt("RoutingControlCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.clusterArn = props.clusterArn;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryControl::ControlPanel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterArn": this.clusterArn,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnControlPanel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnControlPanelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnControlPanel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html
 */
export interface CfnControlPanelProps {
  /**
   * The Amazon Resource Name (ARN) of the cluster for the control panel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-clusterarn
   */
  readonly clusterArn?: string;

  /**
   * The name of the control panel.
   *
   * You can use any non-white space character in the name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-name
   */
  readonly name: string;

  /**
   * The tags associated with the control panel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnControlPanelProps`
 *
 * @param properties - the TypeScript properties of a `CfnControlPanelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnControlPanelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterArn", cdk.validateString)(properties.clusterArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnControlPanelProps\"");
}

// @ts-ignore TS6133
function convertCfnControlPanelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnControlPanelPropsValidator(properties).assertSuccess();
  return {
    "ClusterArn": cdk.stringToCloudFormation(properties.clusterArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnControlPanelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnControlPanelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnControlPanelProps>();
  ret.addPropertyResult("clusterArn", "ClusterArn", (properties.ClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a routing control in Amazon Route 53 Application Recovery Controller.
 *
 * Routing control states are maintained on the highly reliable cluster data plane.
 *
 * To get or update the state of the routing control, you must specify a cluster endpoint, which is an endpoint URL and an AWS Region. For more information, see [Code examples](https://docs.aws.amazon.com/r53recovery/latest/dg/service_code_examples.html) in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * @cloudformationResource AWS::Route53RecoveryControl::RoutingControl
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html
 */
export class CfnRoutingControl extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Route53RecoveryControl::RoutingControl";

  /**
   * Build a CfnRoutingControl from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoutingControl {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRoutingControlPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRoutingControl(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the routing control.
   *
   * @cloudformationAttribute RoutingControlArn
   */
  public readonly attrRoutingControlArn: string;

  /**
   * The deployment status of the routing control. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The Amazon Resource Name (ARN) of the cluster that hosts the routing control.
   */
  public clusterArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the control panel that includes the routing control.
   */
  public controlPanelArn?: string;

  /**
   * The name of the routing control.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRoutingControlProps) {
    super(scope, id, {
      "type": CfnRoutingControl.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrRoutingControlArn = cdk.Token.asString(this.getAtt("RoutingControlArn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.clusterArn = props.clusterArn;
    this.controlPanelArn = props.controlPanelArn;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterArn": this.clusterArn,
      "controlPanelArn": this.controlPanelArn,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoutingControl.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRoutingControlPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRoutingControl`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html
 */
export interface CfnRoutingControlProps {
  /**
   * The Amazon Resource Name (ARN) of the cluster that hosts the routing control.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-clusterarn
   */
  readonly clusterArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the control panel that includes the routing control.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-controlpanelarn
   */
  readonly controlPanelArn?: string;

  /**
   * The name of the routing control.
   *
   * You can use any non-white space character in the name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `CfnRoutingControlProps`
 *
 * @param properties - the TypeScript properties of a `CfnRoutingControlProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoutingControlPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterArn", cdk.validateString)(properties.clusterArn));
  errors.collect(cdk.propertyValidator("controlPanelArn", cdk.validateString)(properties.controlPanelArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnRoutingControlProps\"");
}

// @ts-ignore TS6133
function convertCfnRoutingControlPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutingControlPropsValidator(properties).assertSuccess();
  return {
    "ClusterArn": cdk.stringToCloudFormation(properties.clusterArn),
    "ControlPanelArn": cdk.stringToCloudFormation(properties.controlPanelArn),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRoutingControlPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoutingControlProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoutingControlProps>();
  ret.addPropertyResult("clusterArn", "ClusterArn", (properties.ClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterArn) : undefined));
  ret.addPropertyResult("controlPanelArn", "ControlPanelArn", (properties.ControlPanelArn != null ? cfn_parse.FromCloudFormation.getString(properties.ControlPanelArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a safety rule in a control panel in Amazon Route 53 Application Recovery Controller.
 *
 * Safety rules in Amazon Route 53 Application Recovery Controller let you add safeguards around changing routing control states, and enabling and disabling routing controls, to help prevent unwanted outcomes. Note that the name of a safety rule must be unique within a control panel.
 *
 * There are two types of safety rules in Route 53 ARC: assertion rules and gating rules.
 *
 * Assertion rule: An assertion rule enforces that, when you change a routing control state, certain criteria are met. For example, the criteria might be that at least one routing control state is `On` after the transaction completes so that traffic continues to be directed to at least one cell for the application. This prevents a fail-open scenario.
 *
 * Gating rule: A gating rule lets you configure a gating routing control as an overall on-off switch for a group of routing controls. Or, you can configure more complex gating scenarios, for example, by configuring multiple gating routing controls.
 *
 * For more information, see [Safety rules](https://docs.aws.amazon.com/r53recovery/latest/dg/routing-control.safety-rules.html) in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * @cloudformationResource AWS::Route53RecoveryControl::SafetyRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html
 */
export class CfnSafetyRule extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Route53RecoveryControl::SafetyRule";

  /**
   * Build a CfnSafetyRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSafetyRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSafetyRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSafetyRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the safety rule.
   *
   * @cloudformationAttribute SafetyRuleArn
   */
  public readonly attrSafetyRuleArn: string;

  /**
   * The deployment status of the safety rule. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * An assertion rule enforces that, when you change a routing control state, that the criteria that you set in the rule configuration is met.
   */
  public assertionRule?: CfnSafetyRule.AssertionRuleProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the control panel.
   */
  public controlPanelArn: string;

  /**
   * A gating rule verifies that a gating routing control or set of gating routing controls, evaluates as true, based on a rule configuration that you specify, which allows a set of routing control state changes to complete.
   */
  public gatingRule?: CfnSafetyRule.GatingRuleProperty | cdk.IResolvable;

  /**
   * The name of the assertion rule.
   */
  public name: string;

  /**
   * The criteria that you set for specific assertion controls (routing controls) that designate how many control states must be `ON` as the result of a transaction.
   */
  public ruleConfig: cdk.IResolvable | CfnSafetyRule.RuleConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags associated with the safety rule.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSafetyRuleProps) {
    super(scope, id, {
      "type": CfnSafetyRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "controlPanelArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "ruleConfig", this);

    this.attrSafetyRuleArn = cdk.Token.asString(this.getAtt("SafetyRuleArn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.assertionRule = props.assertionRule;
    this.controlPanelArn = props.controlPanelArn;
    this.gatingRule = props.gatingRule;
    this.name = props.name;
    this.ruleConfig = props.ruleConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryControl::SafetyRule", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assertionRule": this.assertionRule,
      "controlPanelArn": this.controlPanelArn,
      "gatingRule": this.gatingRule,
      "name": this.name,
      "ruleConfig": this.ruleConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSafetyRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSafetyRulePropsToCloudFormation(props);
  }
}

export namespace CfnSafetyRule {
  /**
   * An assertion rule enforces that, when you change a routing control state, that the criteria that you set in the rule configuration is met.
   *
   * Otherwise, the change to the routing control is not accepted. For example, the criteria might be that at least one routing control state is `On` after the transaction so that traffic continues to flow to at least one cell for the application. This ensures that you avoid a fail-open scenario.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-assertionrule.html
   */
  export interface AssertionRuleProperty {
    /**
     * The routing controls that are part of transactions that are evaluated to determine if a request to change a routing control state is allowed.
     *
     * For example, you might include three routing controls, one for each of three AWS Regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-assertionrule.html#cfn-route53recoverycontrol-safetyrule-assertionrule-assertedcontrols
     */
    readonly assertedControls: Array<string>;

    /**
     * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail.
     *
     * This helps prevent flapping of state. The wait period is 5000 ms by default, but you can choose a custom value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-assertionrule.html#cfn-route53recoverycontrol-safetyrule-assertionrule-waitperiodms
     */
    readonly waitPeriodMs: number;
  }

  /**
   * The rule configuration for an assertion rule.
   *
   * That is, the criteria that you set for specific assertion controls (routing controls) that specify how many controls must be enabled after a transaction completes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-ruleconfig.html
   */
  export interface RuleConfigProperty {
    /**
     * Logical negation of the rule.
     *
     * If the rule would usually evaluate true, it's evaluated as false, and vice versa.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-ruleconfig.html#cfn-route53recoverycontrol-safetyrule-ruleconfig-inverted
     */
    readonly inverted: boolean | cdk.IResolvable;

    /**
     * The value of N, when you specify an `ATLEAST` rule type.
     *
     * That is, `Threshold` is the number of controls that must be set when you specify an `ATLEAST` type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-ruleconfig.html#cfn-route53recoverycontrol-safetyrule-ruleconfig-threshold
     */
    readonly threshold: number;

    /**
     * A rule can be one of the following: `ATLEAST` , `AND` , or `OR` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-ruleconfig.html#cfn-route53recoverycontrol-safetyrule-ruleconfig-type
     */
    readonly type: string;
  }

  /**
   * A gating rule verifies that a gating routing control or set of gating routing controls, evaluates as true, based on a rule configuration that you specify, which allows a set of routing control state changes to complete.
   *
   * For example, if you specify one gating routing control and you set the `Type` in the rule configuration to `OR` , that indicates that you must set the gating routing control to `On` for the rule to evaluate as true; that is, for the gating control switch to be On. When you do that, then you can update the routing control states for the target routing controls that you specify in the gating rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-gatingrule.html
   */
  export interface GatingRuleProperty {
    /**
     * An array of gating routing control Amazon Resource Names (ARNs).
     *
     * For a simple on-off switch, specify the ARN for one routing control. The gating routing controls are evaluated by the rule configuration that you specify to determine if the target routing control states can be changed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-gatingrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule-gatingcontrols
     */
    readonly gatingControls: Array<string>;

    /**
     * An array of target routing control Amazon Resource Names (ARNs) for which the states can only be updated if the rule configuration that you specify evaluates to true for the gating routing control.
     *
     * As a simple example, if you have a single gating control, it acts as an overall on-off switch for a set of target routing controls. You can use this to manually override automated failover, for example.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-gatingrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule-targetcontrols
     */
    readonly targetControls: Array<string>;

    /**
     * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail.
     *
     * This helps prevent flapping of state. The wait period is 5000 ms by default, but you can choose a custom value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-gatingrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule-waitperiodms
     */
    readonly waitPeriodMs: number;
  }
}

/**
 * Properties for defining a `CfnSafetyRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html
 */
export interface CfnSafetyRuleProps {
  /**
   * An assertion rule enforces that, when you change a routing control state, that the criteria that you set in the rule configuration is met.
   *
   * Otherwise, the change to the routing control is not accepted. For example, the criteria might be that at least one routing control state is `On` after the transaction so that traffic continues to flow to at least one cell for the application. This ensures that you avoid a fail-open scenario.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-assertionrule
   */
  readonly assertionRule?: CfnSafetyRule.AssertionRuleProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the control panel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-controlpanelarn
   */
  readonly controlPanelArn: string;

  /**
   * A gating rule verifies that a gating routing control or set of gating routing controls, evaluates as true, based on a rule configuration that you specify, which allows a set of routing control state changes to complete.
   *
   * For example, if you specify one gating routing control and you set the `Type` in the rule configuration to `OR` , that indicates that you must set the gating routing control to `On` for the rule to evaluate as true; that is, for the gating control switch to be On. When you do that, then you can update the routing control states for the target routing controls that you specify in the gating rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule
   */
  readonly gatingRule?: CfnSafetyRule.GatingRuleProperty | cdk.IResolvable;

  /**
   * The name of the assertion rule.
   *
   * The name must be unique within a control panel. You can use any non-white space character in the name except the following: & > < ' (single quote) " (double quote) ; (semicolon)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-name
   */
  readonly name: string;

  /**
   * The criteria that you set for specific assertion controls (routing controls) that designate how many control states must be `ON` as the result of a transaction.
   *
   * For example, if you have three assertion controls, you might specify `ATLEAST 2` for your rule configuration. This means that at least two assertion controls must be `ON` , so that at least two AWS Regions have traffic flowing to them.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-ruleconfig
   */
  readonly ruleConfig: cdk.IResolvable | CfnSafetyRule.RuleConfigProperty;

  /**
   * The tags associated with the safety rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AssertionRuleProperty`
 *
 * @param properties - the TypeScript properties of a `AssertionRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSafetyRuleAssertionRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assertedControls", cdk.requiredValidator)(properties.assertedControls));
  errors.collect(cdk.propertyValidator("assertedControls", cdk.listValidator(cdk.validateString))(properties.assertedControls));
  errors.collect(cdk.propertyValidator("waitPeriodMs", cdk.requiredValidator)(properties.waitPeriodMs));
  errors.collect(cdk.propertyValidator("waitPeriodMs", cdk.validateNumber)(properties.waitPeriodMs));
  return errors.wrap("supplied properties not correct for \"AssertionRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnSafetyRuleAssertionRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSafetyRuleAssertionRulePropertyValidator(properties).assertSuccess();
  return {
    "AssertedControls": cdk.listMapper(cdk.stringToCloudFormation)(properties.assertedControls),
    "WaitPeriodMs": cdk.numberToCloudFormation(properties.waitPeriodMs)
  };
}

// @ts-ignore TS6133
function CfnSafetyRuleAssertionRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSafetyRule.AssertionRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSafetyRule.AssertionRuleProperty>();
  ret.addPropertyResult("assertedControls", "AssertedControls", (properties.AssertedControls != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AssertedControls) : undefined));
  ret.addPropertyResult("waitPeriodMs", "WaitPeriodMs", (properties.WaitPeriodMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.WaitPeriodMs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RuleConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSafetyRuleRuleConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inverted", cdk.requiredValidator)(properties.inverted));
  errors.collect(cdk.propertyValidator("inverted", cdk.validateBoolean)(properties.inverted));
  errors.collect(cdk.propertyValidator("threshold", cdk.requiredValidator)(properties.threshold));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateNumber)(properties.threshold));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"RuleConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSafetyRuleRuleConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSafetyRuleRuleConfigPropertyValidator(properties).assertSuccess();
  return {
    "Inverted": cdk.booleanToCloudFormation(properties.inverted),
    "Threshold": cdk.numberToCloudFormation(properties.threshold),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSafetyRuleRuleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSafetyRule.RuleConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSafetyRule.RuleConfigProperty>();
  ret.addPropertyResult("inverted", "Inverted", (properties.Inverted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inverted) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `GatingRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSafetyRuleGatingRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gatingControls", cdk.requiredValidator)(properties.gatingControls));
  errors.collect(cdk.propertyValidator("gatingControls", cdk.listValidator(cdk.validateString))(properties.gatingControls));
  errors.collect(cdk.propertyValidator("targetControls", cdk.requiredValidator)(properties.targetControls));
  errors.collect(cdk.propertyValidator("targetControls", cdk.listValidator(cdk.validateString))(properties.targetControls));
  errors.collect(cdk.propertyValidator("waitPeriodMs", cdk.requiredValidator)(properties.waitPeriodMs));
  errors.collect(cdk.propertyValidator("waitPeriodMs", cdk.validateNumber)(properties.waitPeriodMs));
  return errors.wrap("supplied properties not correct for \"GatingRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnSafetyRuleGatingRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSafetyRuleGatingRulePropertyValidator(properties).assertSuccess();
  return {
    "GatingControls": cdk.listMapper(cdk.stringToCloudFormation)(properties.gatingControls),
    "TargetControls": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetControls),
    "WaitPeriodMs": cdk.numberToCloudFormation(properties.waitPeriodMs)
  };
}

// @ts-ignore TS6133
function CfnSafetyRuleGatingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSafetyRule.GatingRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSafetyRule.GatingRuleProperty>();
  ret.addPropertyResult("gatingControls", "GatingControls", (properties.GatingControls != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.GatingControls) : undefined));
  ret.addPropertyResult("targetControls", "TargetControls", (properties.TargetControls != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetControls) : undefined));
  ret.addPropertyResult("waitPeriodMs", "WaitPeriodMs", (properties.WaitPeriodMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.WaitPeriodMs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSafetyRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnSafetyRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSafetyRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assertionRule", CfnSafetyRuleAssertionRulePropertyValidator)(properties.assertionRule));
  errors.collect(cdk.propertyValidator("controlPanelArn", cdk.requiredValidator)(properties.controlPanelArn));
  errors.collect(cdk.propertyValidator("controlPanelArn", cdk.validateString)(properties.controlPanelArn));
  errors.collect(cdk.propertyValidator("gatingRule", CfnSafetyRuleGatingRulePropertyValidator)(properties.gatingRule));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("ruleConfig", cdk.requiredValidator)(properties.ruleConfig));
  errors.collect(cdk.propertyValidator("ruleConfig", CfnSafetyRuleRuleConfigPropertyValidator)(properties.ruleConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSafetyRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnSafetyRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSafetyRulePropsValidator(properties).assertSuccess();
  return {
    "AssertionRule": convertCfnSafetyRuleAssertionRulePropertyToCloudFormation(properties.assertionRule),
    "ControlPanelArn": cdk.stringToCloudFormation(properties.controlPanelArn),
    "GatingRule": convertCfnSafetyRuleGatingRulePropertyToCloudFormation(properties.gatingRule),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RuleConfig": convertCfnSafetyRuleRuleConfigPropertyToCloudFormation(properties.ruleConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSafetyRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSafetyRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSafetyRuleProps>();
  ret.addPropertyResult("assertionRule", "AssertionRule", (properties.AssertionRule != null ? CfnSafetyRuleAssertionRulePropertyFromCloudFormation(properties.AssertionRule) : undefined));
  ret.addPropertyResult("controlPanelArn", "ControlPanelArn", (properties.ControlPanelArn != null ? cfn_parse.FromCloudFormation.getString(properties.ControlPanelArn) : undefined));
  ret.addPropertyResult("gatingRule", "GatingRule", (properties.GatingRule != null ? CfnSafetyRuleGatingRulePropertyFromCloudFormation(properties.GatingRule) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("ruleConfig", "RuleConfig", (properties.RuleConfig != null ? CfnSafetyRuleRuleConfigPropertyFromCloudFormation(properties.RuleConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}