/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::MediaConnect::Bridge resource defines a connection between your data center’s gateway instances and the cloud.
 *
 * For each bridge, you specify the type of bridge, transport protocol to use, and details for any outputs and failover.
 *
 * @cloudformationResource AWS::MediaConnect::Bridge
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html
 */
export class CfnBridge extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::Bridge";

  /**
   * Build a CfnBridge from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBridge {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBridgePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBridge(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the bridge.
   *
   * @cloudformationAttribute BridgeArn
   */
  public readonly attrBridgeArn: string;

  /**
   * The current status of the bridge. Possible values are: ACTIVE or STANDBY.
   *
   * @cloudformationAttribute BridgeState
   */
  public readonly attrBridgeState: string;

  /**
   * Create a bridge with the egress bridge type.
   */
  public egressGatewayBridge?: CfnBridge.EgressGatewayBridgeProperty | cdk.IResolvable;

  /**
   * Create a bridge with the ingress bridge type.
   */
  public ingressGatewayBridge?: CfnBridge.IngressGatewayBridgeProperty | cdk.IResolvable;

  /**
   * The name of the bridge.
   */
  public name: string;

  /**
   * The outputs that you want to add to this bridge.
   */
  public outputs?: Array<CfnBridge.BridgeOutputProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The bridge placement Amazon Resource Number (ARN).
   */
  public placementArn: string;

  /**
   * The settings for source failover.
   */
  public sourceFailoverConfig?: CfnBridge.FailoverConfigProperty | cdk.IResolvable;

  /**
   * The sources that you want to add to this bridge.
   */
  public sources: Array<CfnBridge.BridgeSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBridgeProps) {
    super(scope, id, {
      "type": CfnBridge.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "placementArn", this);
    cdk.requireProperty(props, "sources", this);

    this.attrBridgeArn = cdk.Token.asString(this.getAtt("BridgeArn", cdk.ResolutionTypeHint.STRING));
    this.attrBridgeState = cdk.Token.asString(this.getAtt("BridgeState", cdk.ResolutionTypeHint.STRING));
    this.egressGatewayBridge = props.egressGatewayBridge;
    this.ingressGatewayBridge = props.ingressGatewayBridge;
    this.name = props.name;
    this.outputs = props.outputs;
    this.placementArn = props.placementArn;
    this.sourceFailoverConfig = props.sourceFailoverConfig;
    this.sources = props.sources;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "egressGatewayBridge": this.egressGatewayBridge,
      "ingressGatewayBridge": this.ingressGatewayBridge,
      "name": this.name,
      "outputs": this.outputs,
      "placementArn": this.placementArn,
      "sourceFailoverConfig": this.sourceFailoverConfig,
      "sources": this.sources
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBridge.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBridgePropsToCloudFormation(props);
  }
}

export namespace CfnBridge {
  /**
   * The settings for source failover.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-failoverconfig.html
   */
  export interface FailoverConfigProperty {
    /**
     * The type of failover you choose for this flow.
     *
     * MERGE combines the source streams into a single stream, allowing graceful recovery from any single-source loss. FAILOVER allows switching between different streams.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-failoverconfig.html#cfn-mediaconnect-bridge-failoverconfig-failovermode
     */
    readonly failoverMode: string;

    /**
     * The priority you want to assign to a source.
     *
     * You can have a primary stream and a backup stream or two equally prioritized streams. This setting only applies when Failover Mode is set to FAILOVER.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-failoverconfig.html#cfn-mediaconnect-bridge-failoverconfig-sourcepriority
     */
    readonly sourcePriority?: cdk.IResolvable | CfnBridge.SourcePriorityProperty;

    /**
     * The state of source failover on the flow.
     *
     * If the state is inactive, the flow can have only one source. If the state is active, the flow can have one or two sources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-failoverconfig.html#cfn-mediaconnect-bridge-failoverconfig-state
     */
    readonly state?: string;
  }

  /**
   * The priority you want to assign to a source.
   *
   * You can have a primary stream and a backup stream or two equally prioritized streams. This setting only applies when Failover Mode is set to FAILOVER.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-sourcepriority.html
   */
  export interface SourcePriorityProperty {
    /**
     * The name of the source you choose as the primary source for this flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-sourcepriority.html#cfn-mediaconnect-bridge-sourcepriority-primarysource
     */
    readonly primarySource?: string;
  }

  /**
   * Create a bridge with the ingress bridge type.
   *
   * An ingress bridge is a ground-to-cloud bridge. The content originates at your premises and is delivered to the cloud.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-ingressgatewaybridge.html
   */
  export interface IngressGatewayBridgeProperty {
    /**
     * The maximum expected bitrate (in bps) of the ingress bridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-ingressgatewaybridge.html#cfn-mediaconnect-bridge-ingressgatewaybridge-maxbitrate
     */
    readonly maxBitrate: number;

    /**
     * The maximum number of outputs on the ingress bridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-ingressgatewaybridge.html#cfn-mediaconnect-bridge-ingressgatewaybridge-maxoutputs
     */
    readonly maxOutputs: number;
  }

  /**
   * Create a bridge with the egress bridge type.
   *
   * An egress bridge is a cloud-to-ground bridge. The content comes from an existing MediaConnect flow and is delivered to your premises.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-egressgatewaybridge.html
   */
  export interface EgressGatewayBridgeProperty {
    /**
     * The maximum expected bitrate (in bps) of the egress bridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-egressgatewaybridge.html#cfn-mediaconnect-bridge-egressgatewaybridge-maxbitrate
     */
    readonly maxBitrate: number;
  }

  /**
   * The output of the bridge.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgeoutput.html
   */
  export interface BridgeOutputProperty {
    /**
     * The output of the bridge.
     *
     * A network output is delivered to your premises.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgeoutput.html#cfn-mediaconnect-bridge-bridgeoutput-networkoutput
     */
    readonly networkOutput?: CfnBridge.BridgeNetworkOutputProperty | cdk.IResolvable;
  }

  /**
   * The output of the bridge.
   *
   * A network output is delivered to your premises.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworkoutput.html
   */
  export interface BridgeNetworkOutputProperty {
    /**
     * The network output IP Address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworkoutput.html#cfn-mediaconnect-bridge-bridgenetworkoutput-ipaddress
     */
    readonly ipAddress: string;

    /**
     * The network output name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworkoutput.html#cfn-mediaconnect-bridge-bridgenetworkoutput-name
     */
    readonly name: string;

    /**
     * The network output's gateway network name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworkoutput.html#cfn-mediaconnect-bridge-bridgenetworkoutput-networkname
     */
    readonly networkName: string;

    /**
     * The network output port.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworkoutput.html#cfn-mediaconnect-bridge-bridgenetworkoutput-port
     */
    readonly port: number;

    /**
     * The network output protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworkoutput.html#cfn-mediaconnect-bridge-bridgenetworkoutput-protocol
     */
    readonly protocol: string;

    /**
     * The network output TTL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworkoutput.html#cfn-mediaconnect-bridge-bridgenetworkoutput-ttl
     */
    readonly ttl: number;
  }

  /**
   * The bridge's source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgesource.html
   */
  export interface BridgeSourceProperty {
    /**
     * The source of the bridge.
     *
     * A flow source originates in MediaConnect as an existing cloud flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgesource.html#cfn-mediaconnect-bridge-bridgesource-flowsource
     */
    readonly flowSource?: CfnBridge.BridgeFlowSourceProperty | cdk.IResolvable;

    /**
     * The source of the bridge.
     *
     * A network source originates at your premises.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgesource.html#cfn-mediaconnect-bridge-bridgesource-networksource
     */
    readonly networkSource?: CfnBridge.BridgeNetworkSourceProperty | cdk.IResolvable;
  }

  /**
   * The source of the bridge.
   *
   * A network source originates at your premises.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworksource.html
   */
  export interface BridgeNetworkSourceProperty {
    /**
     * The network source multicast IP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworksource.html#cfn-mediaconnect-bridge-bridgenetworksource-multicastip
     */
    readonly multicastIp: string;

    /**
     * The name of the network source.
     *
     * This name is used to reference the source and must be unique among sources in this bridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworksource.html#cfn-mediaconnect-bridge-bridgenetworksource-name
     */
    readonly name: string;

    /**
     * The network source's gateway network name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworksource.html#cfn-mediaconnect-bridge-bridgenetworksource-networkname
     */
    readonly networkName: string;

    /**
     * The network source port.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworksource.html#cfn-mediaconnect-bridge-bridgenetworksource-port
     */
    readonly port: number;

    /**
     * The network source protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgenetworksource.html#cfn-mediaconnect-bridge-bridgenetworksource-protocol
     */
    readonly protocol: string;
  }

  /**
   * The source of the bridge.
   *
   * A flow source originates in MediaConnect as an existing cloud flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgeflowsource.html
   */
  export interface BridgeFlowSourceProperty {
    /**
     * The ARN of the cloud flow used as a source of this bridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgeflowsource.html#cfn-mediaconnect-bridge-bridgeflowsource-flowarn
     */
    readonly flowArn: string;

    /**
     * The name of the VPC interface attachment to use for this source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgeflowsource.html#cfn-mediaconnect-bridge-bridgeflowsource-flowvpcinterfaceattachment
     */
    readonly flowVpcInterfaceAttachment?: cdk.IResolvable | CfnBridge.VpcInterfaceAttachmentProperty;

    /**
     * The name of the flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-bridgeflowsource.html#cfn-mediaconnect-bridge-bridgeflowsource-name
     */
    readonly name: string;
  }

  /**
   * The VPC interface that you want to send your output to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-vpcinterfaceattachment.html
   */
  export interface VpcInterfaceAttachmentProperty {
    /**
     * The name of the VPC interface that you want to send your output to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridge-vpcinterfaceattachment.html#cfn-mediaconnect-bridge-vpcinterfaceattachment-vpcinterfacename
     */
    readonly vpcInterfaceName?: string;
  }
}

/**
 * Properties for defining a `CfnBridge`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html
 */
export interface CfnBridgeProps {
  /**
   * Create a bridge with the egress bridge type.
   *
   * An egress bridge is a cloud-to-ground bridge. The content comes from an existing MediaConnect flow and is delivered to your premises.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html#cfn-mediaconnect-bridge-egressgatewaybridge
   */
  readonly egressGatewayBridge?: CfnBridge.EgressGatewayBridgeProperty | cdk.IResolvable;

  /**
   * Create a bridge with the ingress bridge type.
   *
   * An ingress bridge is a ground-to-cloud bridge. The content originates at your premises and is delivered to the cloud.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html#cfn-mediaconnect-bridge-ingressgatewaybridge
   */
  readonly ingressGatewayBridge?: CfnBridge.IngressGatewayBridgeProperty | cdk.IResolvable;

  /**
   * The name of the bridge.
   *
   * This name can not be modified after the bridge is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html#cfn-mediaconnect-bridge-name
   */
  readonly name: string;

  /**
   * The outputs that you want to add to this bridge.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html#cfn-mediaconnect-bridge-outputs
   */
  readonly outputs?: Array<CfnBridge.BridgeOutputProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The bridge placement Amazon Resource Number (ARN).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html#cfn-mediaconnect-bridge-placementarn
   */
  readonly placementArn: string;

  /**
   * The settings for source failover.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html#cfn-mediaconnect-bridge-sourcefailoverconfig
   */
  readonly sourceFailoverConfig?: CfnBridge.FailoverConfigProperty | cdk.IResolvable;

  /**
   * The sources that you want to add to this bridge.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridge.html#cfn-mediaconnect-bridge-sources
   */
  readonly sources: Array<CfnBridge.BridgeSourceProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `SourcePriorityProperty`
 *
 * @param properties - the TypeScript properties of a `SourcePriorityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeSourcePriorityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("primarySource", cdk.validateString)(properties.primarySource));
  return errors.wrap("supplied properties not correct for \"SourcePriorityProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeSourcePriorityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeSourcePriorityPropertyValidator(properties).assertSuccess();
  return {
    "PrimarySource": cdk.stringToCloudFormation(properties.primarySource)
  };
}

// @ts-ignore TS6133
function CfnBridgeSourcePriorityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBridge.SourcePriorityProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.SourcePriorityProperty>();
  ret.addPropertyResult("primarySource", "PrimarySource", (properties.PrimarySource != null ? cfn_parse.FromCloudFormation.getString(properties.PrimarySource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FailoverConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FailoverConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeFailoverConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failoverMode", cdk.requiredValidator)(properties.failoverMode));
  errors.collect(cdk.propertyValidator("failoverMode", cdk.validateString)(properties.failoverMode));
  errors.collect(cdk.propertyValidator("sourcePriority", CfnBridgeSourcePriorityPropertyValidator)(properties.sourcePriority));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  return errors.wrap("supplied properties not correct for \"FailoverConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeFailoverConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeFailoverConfigPropertyValidator(properties).assertSuccess();
  return {
    "FailoverMode": cdk.stringToCloudFormation(properties.failoverMode),
    "SourcePriority": convertCfnBridgeSourcePriorityPropertyToCloudFormation(properties.sourcePriority),
    "State": cdk.stringToCloudFormation(properties.state)
  };
}

// @ts-ignore TS6133
function CfnBridgeFailoverConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridge.FailoverConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.FailoverConfigProperty>();
  ret.addPropertyResult("failoverMode", "FailoverMode", (properties.FailoverMode != null ? cfn_parse.FromCloudFormation.getString(properties.FailoverMode) : undefined));
  ret.addPropertyResult("sourcePriority", "SourcePriority", (properties.SourcePriority != null ? CfnBridgeSourcePriorityPropertyFromCloudFormation(properties.SourcePriority) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IngressGatewayBridgeProperty`
 *
 * @param properties - the TypeScript properties of a `IngressGatewayBridgeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeIngressGatewayBridgePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxBitrate", cdk.requiredValidator)(properties.maxBitrate));
  errors.collect(cdk.propertyValidator("maxBitrate", cdk.validateNumber)(properties.maxBitrate));
  errors.collect(cdk.propertyValidator("maxOutputs", cdk.requiredValidator)(properties.maxOutputs));
  errors.collect(cdk.propertyValidator("maxOutputs", cdk.validateNumber)(properties.maxOutputs));
  return errors.wrap("supplied properties not correct for \"IngressGatewayBridgeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeIngressGatewayBridgePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeIngressGatewayBridgePropertyValidator(properties).assertSuccess();
  return {
    "MaxBitrate": cdk.numberToCloudFormation(properties.maxBitrate),
    "MaxOutputs": cdk.numberToCloudFormation(properties.maxOutputs)
  };
}

// @ts-ignore TS6133
function CfnBridgeIngressGatewayBridgePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridge.IngressGatewayBridgeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.IngressGatewayBridgeProperty>();
  ret.addPropertyResult("maxBitrate", "MaxBitrate", (properties.MaxBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBitrate) : undefined));
  ret.addPropertyResult("maxOutputs", "MaxOutputs", (properties.MaxOutputs != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxOutputs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EgressGatewayBridgeProperty`
 *
 * @param properties - the TypeScript properties of a `EgressGatewayBridgeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeEgressGatewayBridgePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxBitrate", cdk.requiredValidator)(properties.maxBitrate));
  errors.collect(cdk.propertyValidator("maxBitrate", cdk.validateNumber)(properties.maxBitrate));
  return errors.wrap("supplied properties not correct for \"EgressGatewayBridgeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeEgressGatewayBridgePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeEgressGatewayBridgePropertyValidator(properties).assertSuccess();
  return {
    "MaxBitrate": cdk.numberToCloudFormation(properties.maxBitrate)
  };
}

// @ts-ignore TS6133
function CfnBridgeEgressGatewayBridgePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridge.EgressGatewayBridgeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.EgressGatewayBridgeProperty>();
  ret.addPropertyResult("maxBitrate", "MaxBitrate", (properties.MaxBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBitrate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BridgeNetworkOutputProperty`
 *
 * @param properties - the TypeScript properties of a `BridgeNetworkOutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeBridgeNetworkOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipAddress", cdk.requiredValidator)(properties.ipAddress));
  errors.collect(cdk.propertyValidator("ipAddress", cdk.validateString)(properties.ipAddress));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkName", cdk.requiredValidator)(properties.networkName));
  errors.collect(cdk.propertyValidator("networkName", cdk.validateString)(properties.networkName));
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("ttl", cdk.requiredValidator)(properties.ttl));
  errors.collect(cdk.propertyValidator("ttl", cdk.validateNumber)(properties.ttl));
  return errors.wrap("supplied properties not correct for \"BridgeNetworkOutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeBridgeNetworkOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeBridgeNetworkOutputPropertyValidator(properties).assertSuccess();
  return {
    "IpAddress": cdk.stringToCloudFormation(properties.ipAddress),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkName": cdk.stringToCloudFormation(properties.networkName),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "Ttl": cdk.numberToCloudFormation(properties.ttl)
  };
}

// @ts-ignore TS6133
function CfnBridgeBridgeNetworkOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridge.BridgeNetworkOutputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.BridgeNetworkOutputProperty>();
  ret.addPropertyResult("ipAddress", "IpAddress", (properties.IpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddress) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkName", "NetworkName", (properties.NetworkName != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkName) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("ttl", "Ttl", (properties.Ttl != null ? cfn_parse.FromCloudFormation.getNumber(properties.Ttl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BridgeOutputProperty`
 *
 * @param properties - the TypeScript properties of a `BridgeOutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeBridgeOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("networkOutput", CfnBridgeBridgeNetworkOutputPropertyValidator)(properties.networkOutput));
  return errors.wrap("supplied properties not correct for \"BridgeOutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeBridgeOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeBridgeOutputPropertyValidator(properties).assertSuccess();
  return {
    "NetworkOutput": convertCfnBridgeBridgeNetworkOutputPropertyToCloudFormation(properties.networkOutput)
  };
}

// @ts-ignore TS6133
function CfnBridgeBridgeOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridge.BridgeOutputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.BridgeOutputProperty>();
  ret.addPropertyResult("networkOutput", "NetworkOutput", (properties.NetworkOutput != null ? CfnBridgeBridgeNetworkOutputPropertyFromCloudFormation(properties.NetworkOutput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BridgeNetworkSourceProperty`
 *
 * @param properties - the TypeScript properties of a `BridgeNetworkSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeBridgeNetworkSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("multicastIp", cdk.requiredValidator)(properties.multicastIp));
  errors.collect(cdk.propertyValidator("multicastIp", cdk.validateString)(properties.multicastIp));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkName", cdk.requiredValidator)(properties.networkName));
  errors.collect(cdk.propertyValidator("networkName", cdk.validateString)(properties.networkName));
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"BridgeNetworkSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeBridgeNetworkSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeBridgeNetworkSourcePropertyValidator(properties).assertSuccess();
  return {
    "MulticastIp": cdk.stringToCloudFormation(properties.multicastIp),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkName": cdk.stringToCloudFormation(properties.networkName),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnBridgeBridgeNetworkSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridge.BridgeNetworkSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.BridgeNetworkSourceProperty>();
  ret.addPropertyResult("multicastIp", "MulticastIp", (properties.MulticastIp != null ? cfn_parse.FromCloudFormation.getString(properties.MulticastIp) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkName", "NetworkName", (properties.NetworkName != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkName) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcInterfaceAttachmentProperty`
 *
 * @param properties - the TypeScript properties of a `VpcInterfaceAttachmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeVpcInterfaceAttachmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vpcInterfaceName", cdk.validateString)(properties.vpcInterfaceName));
  return errors.wrap("supplied properties not correct for \"VpcInterfaceAttachmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeVpcInterfaceAttachmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeVpcInterfaceAttachmentPropertyValidator(properties).assertSuccess();
  return {
    "VpcInterfaceName": cdk.stringToCloudFormation(properties.vpcInterfaceName)
  };
}

// @ts-ignore TS6133
function CfnBridgeVpcInterfaceAttachmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBridge.VpcInterfaceAttachmentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.VpcInterfaceAttachmentProperty>();
  ret.addPropertyResult("vpcInterfaceName", "VpcInterfaceName", (properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BridgeFlowSourceProperty`
 *
 * @param properties - the TypeScript properties of a `BridgeFlowSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeBridgeFlowSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("flowArn", cdk.requiredValidator)(properties.flowArn));
  errors.collect(cdk.propertyValidator("flowArn", cdk.validateString)(properties.flowArn));
  errors.collect(cdk.propertyValidator("flowVpcInterfaceAttachment", CfnBridgeVpcInterfaceAttachmentPropertyValidator)(properties.flowVpcInterfaceAttachment));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"BridgeFlowSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeBridgeFlowSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeBridgeFlowSourcePropertyValidator(properties).assertSuccess();
  return {
    "FlowArn": cdk.stringToCloudFormation(properties.flowArn),
    "FlowVpcInterfaceAttachment": convertCfnBridgeVpcInterfaceAttachmentPropertyToCloudFormation(properties.flowVpcInterfaceAttachment),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnBridgeBridgeFlowSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridge.BridgeFlowSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.BridgeFlowSourceProperty>();
  ret.addPropertyResult("flowArn", "FlowArn", (properties.FlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.FlowArn) : undefined));
  ret.addPropertyResult("flowVpcInterfaceAttachment", "FlowVpcInterfaceAttachment", (properties.FlowVpcInterfaceAttachment != null ? CfnBridgeVpcInterfaceAttachmentPropertyFromCloudFormation(properties.FlowVpcInterfaceAttachment) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BridgeSourceProperty`
 *
 * @param properties - the TypeScript properties of a `BridgeSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeBridgeSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("flowSource", CfnBridgeBridgeFlowSourcePropertyValidator)(properties.flowSource));
  errors.collect(cdk.propertyValidator("networkSource", CfnBridgeBridgeNetworkSourcePropertyValidator)(properties.networkSource));
  return errors.wrap("supplied properties not correct for \"BridgeSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeBridgeSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeBridgeSourcePropertyValidator(properties).assertSuccess();
  return {
    "FlowSource": convertCfnBridgeBridgeFlowSourcePropertyToCloudFormation(properties.flowSource),
    "NetworkSource": convertCfnBridgeBridgeNetworkSourcePropertyToCloudFormation(properties.networkSource)
  };
}

// @ts-ignore TS6133
function CfnBridgeBridgeSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridge.BridgeSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridge.BridgeSourceProperty>();
  ret.addPropertyResult("flowSource", "FlowSource", (properties.FlowSource != null ? CfnBridgeBridgeFlowSourcePropertyFromCloudFormation(properties.FlowSource) : undefined));
  ret.addPropertyResult("networkSource", "NetworkSource", (properties.NetworkSource != null ? CfnBridgeBridgeNetworkSourcePropertyFromCloudFormation(properties.NetworkSource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBridgeProps`
 *
 * @param properties - the TypeScript properties of a `CfnBridgeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("egressGatewayBridge", CfnBridgeEgressGatewayBridgePropertyValidator)(properties.egressGatewayBridge));
  errors.collect(cdk.propertyValidator("ingressGatewayBridge", CfnBridgeIngressGatewayBridgePropertyValidator)(properties.ingressGatewayBridge));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("outputs", cdk.listValidator(CfnBridgeBridgeOutputPropertyValidator))(properties.outputs));
  errors.collect(cdk.propertyValidator("placementArn", cdk.requiredValidator)(properties.placementArn));
  errors.collect(cdk.propertyValidator("placementArn", cdk.validateString)(properties.placementArn));
  errors.collect(cdk.propertyValidator("sourceFailoverConfig", CfnBridgeFailoverConfigPropertyValidator)(properties.sourceFailoverConfig));
  errors.collect(cdk.propertyValidator("sources", cdk.requiredValidator)(properties.sources));
  errors.collect(cdk.propertyValidator("sources", cdk.listValidator(CfnBridgeBridgeSourcePropertyValidator))(properties.sources));
  return errors.wrap("supplied properties not correct for \"CfnBridgeProps\"");
}

// @ts-ignore TS6133
function convertCfnBridgePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgePropsValidator(properties).assertSuccess();
  return {
    "EgressGatewayBridge": convertCfnBridgeEgressGatewayBridgePropertyToCloudFormation(properties.egressGatewayBridge),
    "IngressGatewayBridge": convertCfnBridgeIngressGatewayBridgePropertyToCloudFormation(properties.ingressGatewayBridge),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Outputs": cdk.listMapper(convertCfnBridgeBridgeOutputPropertyToCloudFormation)(properties.outputs),
    "PlacementArn": cdk.stringToCloudFormation(properties.placementArn),
    "SourceFailoverConfig": convertCfnBridgeFailoverConfigPropertyToCloudFormation(properties.sourceFailoverConfig),
    "Sources": cdk.listMapper(convertCfnBridgeBridgeSourcePropertyToCloudFormation)(properties.sources)
  };
}

// @ts-ignore TS6133
function CfnBridgePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridgeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridgeProps>();
  ret.addPropertyResult("egressGatewayBridge", "EgressGatewayBridge", (properties.EgressGatewayBridge != null ? CfnBridgeEgressGatewayBridgePropertyFromCloudFormation(properties.EgressGatewayBridge) : undefined));
  ret.addPropertyResult("ingressGatewayBridge", "IngressGatewayBridge", (properties.IngressGatewayBridge != null ? CfnBridgeIngressGatewayBridgePropertyFromCloudFormation(properties.IngressGatewayBridge) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("outputs", "Outputs", (properties.Outputs != null ? cfn_parse.FromCloudFormation.getArray(CfnBridgeBridgeOutputPropertyFromCloudFormation)(properties.Outputs) : undefined));
  ret.addPropertyResult("placementArn", "PlacementArn", (properties.PlacementArn != null ? cfn_parse.FromCloudFormation.getString(properties.PlacementArn) : undefined));
  ret.addPropertyResult("sourceFailoverConfig", "SourceFailoverConfig", (properties.SourceFailoverConfig != null ? CfnBridgeFailoverConfigPropertyFromCloudFormation(properties.SourceFailoverConfig) : undefined));
  ret.addPropertyResult("sources", "Sources", (properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnBridgeBridgeSourcePropertyFromCloudFormation)(properties.Sources) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds outputs to an existing bridge.
 *
 * @cloudformationResource AWS::MediaConnect::BridgeOutput
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgeoutput.html
 */
export class CfnBridgeOutput extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::BridgeOutput";

  /**
   * Build a CfnBridgeOutput from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBridgeOutput {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBridgeOutputPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBridgeOutput(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the bridge that you want to describe.
   */
  public bridgeArn: string;

  /**
   * The network output name.
   */
  public name: string;

  /**
   * Add a network output to an existing bridge.
   */
  public networkOutput: CfnBridgeOutput.BridgeNetworkOutputProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBridgeOutputProps) {
    super(scope, id, {
      "type": CfnBridgeOutput.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bridgeArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "networkOutput", this);

    this.bridgeArn = props.bridgeArn;
    this.name = props.name;
    this.networkOutput = props.networkOutput;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bridgeArn": this.bridgeArn,
      "name": this.name,
      "networkOutput": this.networkOutput
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBridgeOutput.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBridgeOutputPropsToCloudFormation(props);
  }
}

export namespace CfnBridgeOutput {
  /**
   * The output of the bridge.
   *
   * A network output is delivered to your premises.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgeoutput-bridgenetworkoutput.html
   */
  export interface BridgeNetworkOutputProperty {
    /**
     * The network output IP Address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgeoutput-bridgenetworkoutput.html#cfn-mediaconnect-bridgeoutput-bridgenetworkoutput-ipaddress
     */
    readonly ipAddress: string;

    /**
     * The network output's gateway network name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgeoutput-bridgenetworkoutput.html#cfn-mediaconnect-bridgeoutput-bridgenetworkoutput-networkname
     */
    readonly networkName: string;

    /**
     * The network output port.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgeoutput-bridgenetworkoutput.html#cfn-mediaconnect-bridgeoutput-bridgenetworkoutput-port
     */
    readonly port: number;

    /**
     * The network output protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgeoutput-bridgenetworkoutput.html#cfn-mediaconnect-bridgeoutput-bridgenetworkoutput-protocol
     */
    readonly protocol: string;

    /**
     * The network output TTL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgeoutput-bridgenetworkoutput.html#cfn-mediaconnect-bridgeoutput-bridgenetworkoutput-ttl
     */
    readonly ttl: number;
  }
}

/**
 * Properties for defining a `CfnBridgeOutput`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgeoutput.html
 */
export interface CfnBridgeOutputProps {
  /**
   * The ARN of the bridge that you want to describe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgeoutput.html#cfn-mediaconnect-bridgeoutput-bridgearn
   */
  readonly bridgeArn: string;

  /**
   * The network output name.
   *
   * This name is used to reference the output and must be unique among outputs in this bridge.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgeoutput.html#cfn-mediaconnect-bridgeoutput-name
   */
  readonly name: string;

  /**
   * Add a network output to an existing bridge.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgeoutput.html#cfn-mediaconnect-bridgeoutput-networkoutput
   */
  readonly networkOutput: CfnBridgeOutput.BridgeNetworkOutputProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `BridgeNetworkOutputProperty`
 *
 * @param properties - the TypeScript properties of a `BridgeNetworkOutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeOutputBridgeNetworkOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipAddress", cdk.requiredValidator)(properties.ipAddress));
  errors.collect(cdk.propertyValidator("ipAddress", cdk.validateString)(properties.ipAddress));
  errors.collect(cdk.propertyValidator("networkName", cdk.requiredValidator)(properties.networkName));
  errors.collect(cdk.propertyValidator("networkName", cdk.validateString)(properties.networkName));
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("ttl", cdk.requiredValidator)(properties.ttl));
  errors.collect(cdk.propertyValidator("ttl", cdk.validateNumber)(properties.ttl));
  return errors.wrap("supplied properties not correct for \"BridgeNetworkOutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeOutputBridgeNetworkOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeOutputBridgeNetworkOutputPropertyValidator(properties).assertSuccess();
  return {
    "IpAddress": cdk.stringToCloudFormation(properties.ipAddress),
    "NetworkName": cdk.stringToCloudFormation(properties.networkName),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "Ttl": cdk.numberToCloudFormation(properties.ttl)
  };
}

// @ts-ignore TS6133
function CfnBridgeOutputBridgeNetworkOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridgeOutput.BridgeNetworkOutputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridgeOutput.BridgeNetworkOutputProperty>();
  ret.addPropertyResult("ipAddress", "IpAddress", (properties.IpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddress) : undefined));
  ret.addPropertyResult("networkName", "NetworkName", (properties.NetworkName != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkName) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("ttl", "Ttl", (properties.Ttl != null ? cfn_parse.FromCloudFormation.getNumber(properties.Ttl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBridgeOutputProps`
 *
 * @param properties - the TypeScript properties of a `CfnBridgeOutputProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeOutputPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bridgeArn", cdk.requiredValidator)(properties.bridgeArn));
  errors.collect(cdk.propertyValidator("bridgeArn", cdk.validateString)(properties.bridgeArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkOutput", cdk.requiredValidator)(properties.networkOutput));
  errors.collect(cdk.propertyValidator("networkOutput", CfnBridgeOutputBridgeNetworkOutputPropertyValidator)(properties.networkOutput));
  return errors.wrap("supplied properties not correct for \"CfnBridgeOutputProps\"");
}

// @ts-ignore TS6133
function convertCfnBridgeOutputPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeOutputPropsValidator(properties).assertSuccess();
  return {
    "BridgeArn": cdk.stringToCloudFormation(properties.bridgeArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkOutput": convertCfnBridgeOutputBridgeNetworkOutputPropertyToCloudFormation(properties.networkOutput)
  };
}

// @ts-ignore TS6133
function CfnBridgeOutputPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridgeOutputProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridgeOutputProps>();
  ret.addPropertyResult("bridgeArn", "BridgeArn", (properties.BridgeArn != null ? cfn_parse.FromCloudFormation.getString(properties.BridgeArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkOutput", "NetworkOutput", (properties.NetworkOutput != null ? CfnBridgeOutputBridgeNetworkOutputPropertyFromCloudFormation(properties.NetworkOutput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds sources to an existing bridge.
 *
 * @cloudformationResource AWS::MediaConnect::BridgeSource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgesource.html
 */
export class CfnBridgeSource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::BridgeSource";

  /**
   * Build a CfnBridgeSource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBridgeSource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBridgeSourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBridgeSource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the bridge that you want to describe.
   */
  public bridgeArn: string;

  /**
   * Add a flow source to an existing bridge.
   */
  public flowSource?: CfnBridgeSource.BridgeFlowSourceProperty | cdk.IResolvable;

  /**
   * The name of the flow source.
   */
  public name: string;

  /**
   * Add a network source to an existing bridge.
   */
  public networkSource?: CfnBridgeSource.BridgeNetworkSourceProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBridgeSourceProps) {
    super(scope, id, {
      "type": CfnBridgeSource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bridgeArn", this);
    cdk.requireProperty(props, "name", this);

    this.bridgeArn = props.bridgeArn;
    this.flowSource = props.flowSource;
    this.name = props.name;
    this.networkSource = props.networkSource;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bridgeArn": this.bridgeArn,
      "flowSource": this.flowSource,
      "name": this.name,
      "networkSource": this.networkSource
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBridgeSource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBridgeSourcePropsToCloudFormation(props);
  }
}

export namespace CfnBridgeSource {
  /**
   * The source of the bridge.
   *
   * A network source originates at your premises.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-bridgenetworksource.html
   */
  export interface BridgeNetworkSourceProperty {
    /**
     * The network source multicast IP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-bridgenetworksource.html#cfn-mediaconnect-bridgesource-bridgenetworksource-multicastip
     */
    readonly multicastIp: string;

    /**
     * The network source's gateway network name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-bridgenetworksource.html#cfn-mediaconnect-bridgesource-bridgenetworksource-networkname
     */
    readonly networkName: string;

    /**
     * The network source port.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-bridgenetworksource.html#cfn-mediaconnect-bridgesource-bridgenetworksource-port
     */
    readonly port: number;

    /**
     * The network source protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-bridgenetworksource.html#cfn-mediaconnect-bridgesource-bridgenetworksource-protocol
     */
    readonly protocol: string;
  }

  /**
   * The source of the bridge.
   *
   * A flow source originates in MediaConnect as an existing cloud flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-bridgeflowsource.html
   */
  export interface BridgeFlowSourceProperty {
    /**
     * The ARN of the cloud flow used as a source of this bridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-bridgeflowsource.html#cfn-mediaconnect-bridgesource-bridgeflowsource-flowarn
     */
    readonly flowArn: string;

    /**
     * The name of the VPC interface attachment to use for this source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-bridgeflowsource.html#cfn-mediaconnect-bridgesource-bridgeflowsource-flowvpcinterfaceattachment
     */
    readonly flowVpcInterfaceAttachment?: cdk.IResolvable | CfnBridgeSource.VpcInterfaceAttachmentProperty;
  }

  /**
   * The VPC interface that you want to send your output to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-vpcinterfaceattachment.html
   */
  export interface VpcInterfaceAttachmentProperty {
    /**
     * The name of the VPC interface that you want to send your output to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-bridgesource-vpcinterfaceattachment.html#cfn-mediaconnect-bridgesource-vpcinterfaceattachment-vpcinterfacename
     */
    readonly vpcInterfaceName?: string;
  }
}

/**
 * Properties for defining a `CfnBridgeSource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgesource.html
 */
export interface CfnBridgeSourceProps {
  /**
   * The ARN of the bridge that you want to describe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgesource.html#cfn-mediaconnect-bridgesource-bridgearn
   */
  readonly bridgeArn: string;

  /**
   * Add a flow source to an existing bridge.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgesource.html#cfn-mediaconnect-bridgesource-flowsource
   */
  readonly flowSource?: CfnBridgeSource.BridgeFlowSourceProperty | cdk.IResolvable;

  /**
   * The name of the flow source.
   *
   * This name is used to reference the source and must be unique among sources in this bridge.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgesource.html#cfn-mediaconnect-bridgesource-name
   */
  readonly name: string;

  /**
   * Add a network source to an existing bridge.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-bridgesource.html#cfn-mediaconnect-bridgesource-networksource
   */
  readonly networkSource?: CfnBridgeSource.BridgeNetworkSourceProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `BridgeNetworkSourceProperty`
 *
 * @param properties - the TypeScript properties of a `BridgeNetworkSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeSourceBridgeNetworkSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("multicastIp", cdk.requiredValidator)(properties.multicastIp));
  errors.collect(cdk.propertyValidator("multicastIp", cdk.validateString)(properties.multicastIp));
  errors.collect(cdk.propertyValidator("networkName", cdk.requiredValidator)(properties.networkName));
  errors.collect(cdk.propertyValidator("networkName", cdk.validateString)(properties.networkName));
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"BridgeNetworkSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeSourceBridgeNetworkSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeSourceBridgeNetworkSourcePropertyValidator(properties).assertSuccess();
  return {
    "MulticastIp": cdk.stringToCloudFormation(properties.multicastIp),
    "NetworkName": cdk.stringToCloudFormation(properties.networkName),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnBridgeSourceBridgeNetworkSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridgeSource.BridgeNetworkSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridgeSource.BridgeNetworkSourceProperty>();
  ret.addPropertyResult("multicastIp", "MulticastIp", (properties.MulticastIp != null ? cfn_parse.FromCloudFormation.getString(properties.MulticastIp) : undefined));
  ret.addPropertyResult("networkName", "NetworkName", (properties.NetworkName != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkName) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcInterfaceAttachmentProperty`
 *
 * @param properties - the TypeScript properties of a `VpcInterfaceAttachmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeSourceVpcInterfaceAttachmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vpcInterfaceName", cdk.validateString)(properties.vpcInterfaceName));
  return errors.wrap("supplied properties not correct for \"VpcInterfaceAttachmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeSourceVpcInterfaceAttachmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeSourceVpcInterfaceAttachmentPropertyValidator(properties).assertSuccess();
  return {
    "VpcInterfaceName": cdk.stringToCloudFormation(properties.vpcInterfaceName)
  };
}

// @ts-ignore TS6133
function CfnBridgeSourceVpcInterfaceAttachmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBridgeSource.VpcInterfaceAttachmentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridgeSource.VpcInterfaceAttachmentProperty>();
  ret.addPropertyResult("vpcInterfaceName", "VpcInterfaceName", (properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BridgeFlowSourceProperty`
 *
 * @param properties - the TypeScript properties of a `BridgeFlowSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeSourceBridgeFlowSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("flowArn", cdk.requiredValidator)(properties.flowArn));
  errors.collect(cdk.propertyValidator("flowArn", cdk.validateString)(properties.flowArn));
  errors.collect(cdk.propertyValidator("flowVpcInterfaceAttachment", CfnBridgeSourceVpcInterfaceAttachmentPropertyValidator)(properties.flowVpcInterfaceAttachment));
  return errors.wrap("supplied properties not correct for \"BridgeFlowSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnBridgeSourceBridgeFlowSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeSourceBridgeFlowSourcePropertyValidator(properties).assertSuccess();
  return {
    "FlowArn": cdk.stringToCloudFormation(properties.flowArn),
    "FlowVpcInterfaceAttachment": convertCfnBridgeSourceVpcInterfaceAttachmentPropertyToCloudFormation(properties.flowVpcInterfaceAttachment)
  };
}

// @ts-ignore TS6133
function CfnBridgeSourceBridgeFlowSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridgeSource.BridgeFlowSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridgeSource.BridgeFlowSourceProperty>();
  ret.addPropertyResult("flowArn", "FlowArn", (properties.FlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.FlowArn) : undefined));
  ret.addPropertyResult("flowVpcInterfaceAttachment", "FlowVpcInterfaceAttachment", (properties.FlowVpcInterfaceAttachment != null ? CfnBridgeSourceVpcInterfaceAttachmentPropertyFromCloudFormation(properties.FlowVpcInterfaceAttachment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBridgeSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnBridgeSourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBridgeSourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bridgeArn", cdk.requiredValidator)(properties.bridgeArn));
  errors.collect(cdk.propertyValidator("bridgeArn", cdk.validateString)(properties.bridgeArn));
  errors.collect(cdk.propertyValidator("flowSource", CfnBridgeSourceBridgeFlowSourcePropertyValidator)(properties.flowSource));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkSource", CfnBridgeSourceBridgeNetworkSourcePropertyValidator)(properties.networkSource));
  return errors.wrap("supplied properties not correct for \"CfnBridgeSourceProps\"");
}

// @ts-ignore TS6133
function convertCfnBridgeSourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBridgeSourcePropsValidator(properties).assertSuccess();
  return {
    "BridgeArn": cdk.stringToCloudFormation(properties.bridgeArn),
    "FlowSource": convertCfnBridgeSourceBridgeFlowSourcePropertyToCloudFormation(properties.flowSource),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkSource": convertCfnBridgeSourceBridgeNetworkSourcePropertyToCloudFormation(properties.networkSource)
  };
}

// @ts-ignore TS6133
function CfnBridgeSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBridgeSourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBridgeSourceProps>();
  ret.addPropertyResult("bridgeArn", "BridgeArn", (properties.BridgeArn != null ? cfn_parse.FromCloudFormation.getString(properties.BridgeArn) : undefined));
  ret.addPropertyResult("flowSource", "FlowSource", (properties.FlowSource != null ? CfnBridgeSourceBridgeFlowSourcePropertyFromCloudFormation(properties.FlowSource) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkSource", "NetworkSource", (properties.NetworkSource != null ? CfnBridgeSourceBridgeNetworkSourcePropertyFromCloudFormation(properties.NetworkSource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::MediaConnect::Flow resource defines a connection between one or more video sources and one or more outputs.
 *
 * For each flow, you specify the transport protocol to use, encryption information, and details for any outputs or entitlements that you want. AWS Elemental MediaConnect returns an ingest endpoint where you can send your live video as a single unicast stream. The service replicates and distributes the video to every output that you specify, whether inside or outside the AWS Cloud. You can also set up entitlements on a flow to allow other AWS accounts to access your content.
 *
 * @cloudformationResource AWS::MediaConnect::Flow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html
 */
export class CfnFlow extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::Flow";

  /**
   * Build a CfnFlow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFlowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFlow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the flow.
   *
   * @cloudformationAttribute FlowArn
   */
  public readonly attrFlowArn: string;

  /**
   * The Availability Zone that the flow was created in. These options are limited to the Availability Zones within the current AWS Region.
   *
   * @cloudformationAttribute FlowAvailabilityZone
   */
  public readonly attrFlowAvailabilityZone: string;

  /**
   * The IP address that the flow will be listening on for incoming content.
   *
   * @cloudformationAttribute Source.IngestIp
   */
  public readonly attrSourceIngestIp: string;

  /**
   * The ARN of the source.
   *
   * @cloudformationAttribute Source.SourceArn
   */
  public readonly attrSourceSourceArn: string;

  /**
   * The port that the flow will be listening on for incoming content.(ReadOnly)
   *
   * @cloudformationAttribute Source.SourceIngestPort
   */
  public readonly attrSourceSourceIngestPort: string;

  /**
   * The Availability Zone that you want to create the flow in.
   */
  public availabilityZone?: string;

  /**
   * The name of the flow.
   */
  public name: string;

  /**
   * The settings for the source that you want to use for the new flow.
   */
  public source: cdk.IResolvable | CfnFlow.SourceProperty;

  /**
   * The settings for source failover.
   */
  public sourceFailoverConfig?: CfnFlow.FailoverConfigProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFlowProps) {
    super(scope, id, {
      "type": CfnFlow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "source", this);

    this.attrFlowArn = cdk.Token.asString(this.getAtt("FlowArn", cdk.ResolutionTypeHint.STRING));
    this.attrFlowAvailabilityZone = cdk.Token.asString(this.getAtt("FlowAvailabilityZone", cdk.ResolutionTypeHint.STRING));
    this.attrSourceIngestIp = cdk.Token.asString(this.getAtt("Source.IngestIp", cdk.ResolutionTypeHint.STRING));
    this.attrSourceSourceArn = cdk.Token.asString(this.getAtt("Source.SourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrSourceSourceIngestPort = cdk.Token.asString(this.getAtt("Source.SourceIngestPort", cdk.ResolutionTypeHint.STRING));
    this.availabilityZone = props.availabilityZone;
    this.name = props.name;
    this.source = props.source;
    this.sourceFailoverConfig = props.sourceFailoverConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "availabilityZone": this.availabilityZone,
      "name": this.name,
      "source": this.source,
      "sourceFailoverConfig": this.sourceFailoverConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFlowPropsToCloudFormation(props);
  }
}

export namespace CfnFlow {
  /**
   * The settings for source failover.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html
   */
  export interface FailoverConfigProperty {
    /**
     * The type of failover you choose for this flow.
     *
     * MERGE combines the source streams into a single stream, allowing graceful recovery from any single-source loss. FAILOVER allows switching between different streams. The string for this property must be entered as MERGE or FAILOVER. No other string entry is valid.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html#cfn-mediaconnect-flow-failoverconfig-failovermode
     */
    readonly failoverMode?: string;

    /**
     * The size of the buffer (delay) that the service maintains.
     *
     * A larger buffer means a longer delay in transmitting the stream, but more room for error correction. A smaller buffer means a shorter delay, but less room for error correction. You can choose a value from 100-500 ms. If you keep this field blank, the service uses the default value of 200 ms. This setting only applies when Failover Mode is set to MERGE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html#cfn-mediaconnect-flow-failoverconfig-recoverywindow
     */
    readonly recoveryWindow?: number;

    /**
     * The priority you want to assign to a source.
     *
     * You can have a primary stream and a backup stream or two equally prioritized streams. This setting only applies when Failover Mode is set to FAILOVER.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html#cfn-mediaconnect-flow-failoverconfig-sourcepriority
     */
    readonly sourcePriority?: cdk.IResolvable | CfnFlow.SourcePriorityProperty;

    /**
     * The state of source failover on the flow.
     *
     * If the state is inactive, the flow can have only one source. If the state is active, the flow can have one or two sources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-failoverconfig.html#cfn-mediaconnect-flow-failoverconfig-state
     */
    readonly state?: string;
  }

  /**
   * The priority you want to assign to a source.
   *
   * You can have a primary stream and a backup stream or two equally prioritized streams. This setting only applies when Failover Mode is set to FAILOVER.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-sourcepriority.html
   */
  export interface SourcePriorityProperty {
    /**
     * The name of the source you choose as the primary source for this flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-sourcepriority.html#cfn-mediaconnect-flow-sourcepriority-primarysource
     */
    readonly primarySource: string;
  }

  /**
   * The details of the sources of the flow.
   *
   * If you are creating a flow with a VPC source, you must first create the flow with a temporary standard source by doing the following:
   *
   * - Use CloudFormation to create a flow with a standard source that uses the flow’s public IP address.
   * - Use CloudFormation to create the VPC interface to add to this flow. This can also be done as part of the previous step.
   * - After CloudFormation has created the flow and the VPC interface, update the source to point to the VPC interface that you created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html
   */
  export interface SourceProperty {
    /**
     * The type of encryption that is used on the content ingested from the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-decryption
     */
    readonly decryption?: CfnFlow.EncryptionProperty | cdk.IResolvable;

    /**
     * A description of the source.
     *
     * This description is not visible outside of the current AWS account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-description
     */
    readonly description?: string;

    /**
     * The ARN of the entitlement that allows you to subscribe to content that comes from another AWS account.
     *
     * The entitlement is set by the content originator and the ARN is generated as part of the originator’s flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-entitlementarn
     */
    readonly entitlementArn?: string;

    /**
     * The source configuration for cloud flows receiving a stream from a bridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-gatewaybridgesource
     */
    readonly gatewayBridgeSource?: CfnFlow.GatewayBridgeSourceProperty | cdk.IResolvable;

    /**
     * The IP address that the flow listens on for incoming content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-ingestip
     */
    readonly ingestIp?: string;

    /**
     * The port that the flow listens on for incoming content.
     *
     * If the protocol of the source is Zixi, the port must be set to 2088.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-ingestport
     */
    readonly ingestPort?: number;

    /**
     * The maximum bitrate for RIST, RTP, and RTP-FEC streams.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-maxbitrate
     */
    readonly maxBitrate?: number;

    /**
     * The maximum latency in milliseconds for a RIST or Zixi-based source.
     *
     * @default - 2000
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-maxlatency
     */
    readonly maxLatency?: number;

    /**
     * The minimum latency in milliseconds for SRT-based streams.
     *
     * In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
     *
     * @default - 2000
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-minlatency
     */
    readonly minLatency?: number;

    /**
     * The name of the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-name
     */
    readonly name?: string;

    /**
     * The protocol that is used by the source.
     *
     * AWS CloudFormation does not currently support CDI or ST 2110 JPEG XS source protocols.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-protocol
     */
    readonly protocol?: string;

    /**
     * The port that the flow uses to send outbound requests to initiate connection with the sender.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sendercontrolport
     */
    readonly senderControlPort?: number;

    /**
     * The IP address that the flow communicates with to initiate connection with the sender.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-senderipaddress
     */
    readonly senderIpAddress?: string;

    /**
     * The ARN of the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sourcearn
     */
    readonly sourceArn?: string;

    /**
     * The port that the flow listens on for incoming content.
     *
     * If the protocol of the source is Zixi, the port must be set to 2088.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sourceingestport
     */
    readonly sourceIngestPort?: string;

    /**
     * Source IP or domain name for SRT-caller protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sourcelisteneraddress
     */
    readonly sourceListenerAddress?: string;

    /**
     * Source port for SRT-caller protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-sourcelistenerport
     */
    readonly sourceListenerPort?: number;

    /**
     * The stream ID that you want to use for the transport.
     *
     * This parameter applies only to Zixi-based streams.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-streamid
     */
    readonly streamId?: string;

    /**
     * The name of the VPC interface that the source content comes from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-vpcinterfacename
     */
    readonly vpcInterfaceName?: string;

    /**
     * The range of IP addresses that are allowed to contribute content to your source.
     *
     * Format the IP addresses as a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-source.html#cfn-mediaconnect-flow-source-whitelistcidr
     */
    readonly whitelistCidr?: string;
  }

  /**
   * Information about the encryption of the flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html
   */
  export interface EncryptionProperty {
    /**
     * The type of algorithm that is used for static key encryption (such as aes128, aes192, or aes256).
     *
     * If you are using SPEKE or SRT-password encryption, this property must be left blank.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-algorithm
     */
    readonly algorithm?: string;

    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, to be used with the key for encrypting content.
     *
     * This parameter is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-constantinitializationvector
     */
    readonly constantInitializationVector?: string;

    /**
     * The value of one of the devices that you configured with your digital rights management (DRM) platform key provider.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-deviceid
     */
    readonly deviceId?: string;

    /**
     * The type of key that is used for the encryption.
     *
     * If you don't specify a `keyType` value, the service uses the default setting ( `static-key` ). Valid key types are: `static-key` , `speke` , and `srt-password` .
     *
     * @default - "static-key"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-keytype
     */
    readonly keyType?: string;

    /**
     * The AWS Region that the API Gateway proxy endpoint was created in.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-region
     */
    readonly region?: string;

    /**
     * An identifier for the content.
     *
     * The service sends this value to the key server to identify the current endpoint. The resource ID is also known as the content ID. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-resourceid
     */
    readonly resourceId?: string;

    /**
     * The Amazon Resource Name (ARN) of the role that you created during setup (when you set up MediaConnect as a trusted entity).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-rolearn
     */
    readonly roleArn: string;

    /**
     * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-secretarn
     */
    readonly secretArn?: string;

    /**
     * The URL from the API Gateway proxy that you set up to talk to your key server.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-encryption.html#cfn-mediaconnect-flow-encryption-url
     */
    readonly url?: string;
  }

  /**
   * The source configuration for cloud flows receiving a stream from a bridge.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-gatewaybridgesource.html
   */
  export interface GatewayBridgeSourceProperty {
    /**
     * The ARN of the bridge feeding this flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-gatewaybridgesource.html#cfn-mediaconnect-flow-gatewaybridgesource-bridgearn
     */
    readonly bridgeArn: string;

    /**
     * The name of the VPC interface attachment to use for this bridge source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-gatewaybridgesource.html#cfn-mediaconnect-flow-gatewaybridgesource-vpcinterfaceattachment
     */
    readonly vpcInterfaceAttachment?: cdk.IResolvable | CfnFlow.VpcInterfaceAttachmentProperty;
  }

  /**
   * The VPC interface that you want to send your output to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-vpcinterfaceattachment.html
   */
  export interface VpcInterfaceAttachmentProperty {
    /**
     * The name of the VPC interface that you want to send your output to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flow-vpcinterfaceattachment.html#cfn-mediaconnect-flow-vpcinterfaceattachment-vpcinterfacename
     */
    readonly vpcInterfaceName?: string;
  }
}

/**
 * Properties for defining a `CfnFlow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html
 */
export interface CfnFlowProps {
  /**
   * The Availability Zone that you want to create the flow in.
   *
   * These options are limited to the Availability Zones within the current AWS Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * The name of the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-name
   */
  readonly name: string;

  /**
   * The settings for the source that you want to use for the new flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-source
   */
  readonly source: cdk.IResolvable | CfnFlow.SourceProperty;

  /**
   * The settings for source failover.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flow.html#cfn-mediaconnect-flow-sourcefailoverconfig
   */
  readonly sourceFailoverConfig?: CfnFlow.FailoverConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `SourcePriorityProperty`
 *
 * @param properties - the TypeScript properties of a `SourcePriorityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSourcePriorityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("primarySource", cdk.requiredValidator)(properties.primarySource));
  errors.collect(cdk.propertyValidator("primarySource", cdk.validateString)(properties.primarySource));
  return errors.wrap("supplied properties not correct for \"SourcePriorityProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSourcePriorityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSourcePriorityPropertyValidator(properties).assertSuccess();
  return {
    "PrimarySource": cdk.stringToCloudFormation(properties.primarySource)
  };
}

// @ts-ignore TS6133
function CfnFlowSourcePriorityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SourcePriorityProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SourcePriorityProperty>();
  ret.addPropertyResult("primarySource", "PrimarySource", (properties.PrimarySource != null ? cfn_parse.FromCloudFormation.getString(properties.PrimarySource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FailoverConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FailoverConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowFailoverConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failoverMode", cdk.validateString)(properties.failoverMode));
  errors.collect(cdk.propertyValidator("recoveryWindow", cdk.validateNumber)(properties.recoveryWindow));
  errors.collect(cdk.propertyValidator("sourcePriority", CfnFlowSourcePriorityPropertyValidator)(properties.sourcePriority));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  return errors.wrap("supplied properties not correct for \"FailoverConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowFailoverConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowFailoverConfigPropertyValidator(properties).assertSuccess();
  return {
    "FailoverMode": cdk.stringToCloudFormation(properties.failoverMode),
    "RecoveryWindow": cdk.numberToCloudFormation(properties.recoveryWindow),
    "SourcePriority": convertCfnFlowSourcePriorityPropertyToCloudFormation(properties.sourcePriority),
    "State": cdk.stringToCloudFormation(properties.state)
  };
}

// @ts-ignore TS6133
function CfnFlowFailoverConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.FailoverConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.FailoverConfigProperty>();
  ret.addPropertyResult("failoverMode", "FailoverMode", (properties.FailoverMode != null ? cfn_parse.FromCloudFormation.getString(properties.FailoverMode) : undefined));
  ret.addPropertyResult("recoveryWindow", "RecoveryWindow", (properties.RecoveryWindow != null ? cfn_parse.FromCloudFormation.getNumber(properties.RecoveryWindow) : undefined));
  ret.addPropertyResult("sourcePriority", "SourcePriority", (properties.SourcePriority != null ? CfnFlowSourcePriorityPropertyFromCloudFormation(properties.SourcePriority) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithm", cdk.validateString)(properties.algorithm));
  errors.collect(cdk.propertyValidator("constantInitializationVector", cdk.validateString)(properties.constantInitializationVector));
  errors.collect(cdk.propertyValidator("deviceId", cdk.validateString)(properties.deviceId));
  errors.collect(cdk.propertyValidator("keyType", cdk.validateString)(properties.keyType));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"EncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "Algorithm": cdk.stringToCloudFormation(properties.algorithm),
    "ConstantInitializationVector": cdk.stringToCloudFormation(properties.constantInitializationVector),
    "DeviceId": cdk.stringToCloudFormation(properties.deviceId),
    "KeyType": cdk.stringToCloudFormation(properties.keyType),
    "Region": cdk.stringToCloudFormation(properties.region),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnFlowEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.EncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.EncryptionProperty>();
  ret.addPropertyResult("algorithm", "Algorithm", (properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined));
  ret.addPropertyResult("constantInitializationVector", "ConstantInitializationVector", (properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined));
  ret.addPropertyResult("deviceId", "DeviceId", (properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined));
  ret.addPropertyResult("keyType", "KeyType", (properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcInterfaceAttachmentProperty`
 *
 * @param properties - the TypeScript properties of a `VpcInterfaceAttachmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowVpcInterfaceAttachmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vpcInterfaceName", cdk.validateString)(properties.vpcInterfaceName));
  return errors.wrap("supplied properties not correct for \"VpcInterfaceAttachmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowVpcInterfaceAttachmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowVpcInterfaceAttachmentPropertyValidator(properties).assertSuccess();
  return {
    "VpcInterfaceName": cdk.stringToCloudFormation(properties.vpcInterfaceName)
  };
}

// @ts-ignore TS6133
function CfnFlowVpcInterfaceAttachmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.VpcInterfaceAttachmentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.VpcInterfaceAttachmentProperty>();
  ret.addPropertyResult("vpcInterfaceName", "VpcInterfaceName", (properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayBridgeSourceProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayBridgeSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowGatewayBridgeSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bridgeArn", cdk.requiredValidator)(properties.bridgeArn));
  errors.collect(cdk.propertyValidator("bridgeArn", cdk.validateString)(properties.bridgeArn));
  errors.collect(cdk.propertyValidator("vpcInterfaceAttachment", CfnFlowVpcInterfaceAttachmentPropertyValidator)(properties.vpcInterfaceAttachment));
  return errors.wrap("supplied properties not correct for \"GatewayBridgeSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowGatewayBridgeSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowGatewayBridgeSourcePropertyValidator(properties).assertSuccess();
  return {
    "BridgeArn": cdk.stringToCloudFormation(properties.bridgeArn),
    "VpcInterfaceAttachment": convertCfnFlowVpcInterfaceAttachmentPropertyToCloudFormation(properties.vpcInterfaceAttachment)
  };
}

// @ts-ignore TS6133
function CfnFlowGatewayBridgeSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.GatewayBridgeSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.GatewayBridgeSourceProperty>();
  ret.addPropertyResult("bridgeArn", "BridgeArn", (properties.BridgeArn != null ? cfn_parse.FromCloudFormation.getString(properties.BridgeArn) : undefined));
  ret.addPropertyResult("vpcInterfaceAttachment", "VpcInterfaceAttachment", (properties.VpcInterfaceAttachment != null ? CfnFlowVpcInterfaceAttachmentPropertyFromCloudFormation(properties.VpcInterfaceAttachment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("decryption", CfnFlowEncryptionPropertyValidator)(properties.decryption));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("entitlementArn", cdk.validateString)(properties.entitlementArn));
  errors.collect(cdk.propertyValidator("gatewayBridgeSource", CfnFlowGatewayBridgeSourcePropertyValidator)(properties.gatewayBridgeSource));
  errors.collect(cdk.propertyValidator("ingestIp", cdk.validateString)(properties.ingestIp));
  errors.collect(cdk.propertyValidator("ingestPort", cdk.validateNumber)(properties.ingestPort));
  errors.collect(cdk.propertyValidator("maxBitrate", cdk.validateNumber)(properties.maxBitrate));
  errors.collect(cdk.propertyValidator("maxLatency", cdk.validateNumber)(properties.maxLatency));
  errors.collect(cdk.propertyValidator("minLatency", cdk.validateNumber)(properties.minLatency));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("senderControlPort", cdk.validateNumber)(properties.senderControlPort));
  errors.collect(cdk.propertyValidator("senderIpAddress", cdk.validateString)(properties.senderIpAddress));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("sourceIngestPort", cdk.validateString)(properties.sourceIngestPort));
  errors.collect(cdk.propertyValidator("sourceListenerAddress", cdk.validateString)(properties.sourceListenerAddress));
  errors.collect(cdk.propertyValidator("sourceListenerPort", cdk.validateNumber)(properties.sourceListenerPort));
  errors.collect(cdk.propertyValidator("streamId", cdk.validateString)(properties.streamId));
  errors.collect(cdk.propertyValidator("vpcInterfaceName", cdk.validateString)(properties.vpcInterfaceName));
  errors.collect(cdk.propertyValidator("whitelistCidr", cdk.validateString)(properties.whitelistCidr));
  return errors.wrap("supplied properties not correct for \"SourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSourcePropertyValidator(properties).assertSuccess();
  return {
    "Decryption": convertCfnFlowEncryptionPropertyToCloudFormation(properties.decryption),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EntitlementArn": cdk.stringToCloudFormation(properties.entitlementArn),
    "GatewayBridgeSource": convertCfnFlowGatewayBridgeSourcePropertyToCloudFormation(properties.gatewayBridgeSource),
    "IngestIp": cdk.stringToCloudFormation(properties.ingestIp),
    "IngestPort": cdk.numberToCloudFormation(properties.ingestPort),
    "MaxBitrate": cdk.numberToCloudFormation(properties.maxBitrate),
    "MaxLatency": cdk.numberToCloudFormation(properties.maxLatency),
    "MinLatency": cdk.numberToCloudFormation(properties.minLatency),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "SenderControlPort": cdk.numberToCloudFormation(properties.senderControlPort),
    "SenderIpAddress": cdk.stringToCloudFormation(properties.senderIpAddress),
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn),
    "SourceIngestPort": cdk.stringToCloudFormation(properties.sourceIngestPort),
    "SourceListenerAddress": cdk.stringToCloudFormation(properties.sourceListenerAddress),
    "SourceListenerPort": cdk.numberToCloudFormation(properties.sourceListenerPort),
    "StreamId": cdk.stringToCloudFormation(properties.streamId),
    "VpcInterfaceName": cdk.stringToCloudFormation(properties.vpcInterfaceName),
    "WhitelistCidr": cdk.stringToCloudFormation(properties.whitelistCidr)
  };
}

// @ts-ignore TS6133
function CfnFlowSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SourceProperty>();
  ret.addPropertyResult("decryption", "Decryption", (properties.Decryption != null ? CfnFlowEncryptionPropertyFromCloudFormation(properties.Decryption) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("entitlementArn", "EntitlementArn", (properties.EntitlementArn != null ? cfn_parse.FromCloudFormation.getString(properties.EntitlementArn) : undefined));
  ret.addPropertyResult("gatewayBridgeSource", "GatewayBridgeSource", (properties.GatewayBridgeSource != null ? CfnFlowGatewayBridgeSourcePropertyFromCloudFormation(properties.GatewayBridgeSource) : undefined));
  ret.addPropertyResult("ingestIp", "IngestIp", (properties.IngestIp != null ? cfn_parse.FromCloudFormation.getString(properties.IngestIp) : undefined));
  ret.addPropertyResult("ingestPort", "IngestPort", (properties.IngestPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.IngestPort) : undefined));
  ret.addPropertyResult("maxBitrate", "MaxBitrate", (properties.MaxBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBitrate) : undefined));
  ret.addPropertyResult("maxLatency", "MaxLatency", (properties.MaxLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLatency) : undefined));
  ret.addPropertyResult("minLatency", "MinLatency", (properties.MinLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinLatency) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("senderControlPort", "SenderControlPort", (properties.SenderControlPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.SenderControlPort) : undefined));
  ret.addPropertyResult("senderIpAddress", "SenderIpAddress", (properties.SenderIpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.SenderIpAddress) : undefined));
  ret.addPropertyResult("sourceArn", "SourceArn", (properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined));
  ret.addPropertyResult("sourceIngestPort", "SourceIngestPort", (properties.SourceIngestPort != null ? cfn_parse.FromCloudFormation.getString(properties.SourceIngestPort) : undefined));
  ret.addPropertyResult("sourceListenerAddress", "SourceListenerAddress", (properties.SourceListenerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.SourceListenerAddress) : undefined));
  ret.addPropertyResult("sourceListenerPort", "SourceListenerPort", (properties.SourceListenerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.SourceListenerPort) : undefined));
  ret.addPropertyResult("streamId", "StreamId", (properties.StreamId != null ? cfn_parse.FromCloudFormation.getString(properties.StreamId) : undefined));
  ret.addPropertyResult("vpcInterfaceName", "VpcInterfaceName", (properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined));
  ret.addPropertyResult("whitelistCidr", "WhitelistCidr", (properties.WhitelistCidr != null ? cfn_parse.FromCloudFormation.getString(properties.WhitelistCidr) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFlowProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", CfnFlowSourcePropertyValidator)(properties.source));
  errors.collect(cdk.propertyValidator("sourceFailoverConfig", CfnFlowFailoverConfigPropertyValidator)(properties.sourceFailoverConfig));
  return errors.wrap("supplied properties not correct for \"CfnFlowProps\"");
}

// @ts-ignore TS6133
function convertCfnFlowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowPropsValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Source": convertCfnFlowSourcePropertyToCloudFormation(properties.source),
    "SourceFailoverConfig": convertCfnFlowFailoverConfigPropertyToCloudFormation(properties.sourceFailoverConfig)
  };
}

// @ts-ignore TS6133
function CfnFlowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowProps>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? CfnFlowSourcePropertyFromCloudFormation(properties.Source) : undefined));
  ret.addPropertyResult("sourceFailoverConfig", "SourceFailoverConfig", (properties.SourceFailoverConfig != null ? CfnFlowFailoverConfigPropertyFromCloudFormation(properties.SourceFailoverConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::MediaConnect::FlowEntitlement resource defines the permission that an AWS account grants to another AWS account to allow access to the content in a specific AWS Elemental MediaConnect flow.
 *
 * The content originator grants an entitlement to a specific AWS account (the subscriber). When an entitlement is granted, the subscriber can create a flow using the originator's flow as the source. Each flow can have up to 50 entitlements.
 *
 * @cloudformationResource AWS::MediaConnect::FlowEntitlement
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html
 */
export class CfnFlowEntitlement extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::FlowEntitlement";

  /**
   * Build a CfnFlowEntitlement from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowEntitlement {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFlowEntitlementPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFlowEntitlement(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The entitlement ARN.
   *
   * @cloudformationAttribute EntitlementArn
   */
  public readonly attrEntitlementArn: string;

  /**
   * The percentage of the entitlement data transfer fee that you want the subscriber to be responsible for.
   */
  public dataTransferSubscriberFeePercent?: number;

  /**
   * A description of the entitlement.
   */
  public description: string;

  /**
   * The type of encryption that MediaConnect will use on the output that is associated with the entitlement.
   */
  public encryption?: CfnFlowEntitlement.EncryptionProperty | cdk.IResolvable;

  /**
   * An indication of whether the new entitlement should be enabled or disabled as soon as it is created.
   */
  public entitlementStatus?: string;

  /**
   * The Amazon Resource Name (ARN) of the flow.
   */
  public flowArn: string;

  /**
   * The name of the entitlement.
   */
  public name: string;

  /**
   * The AWS account IDs that you want to share your content with.
   */
  public subscribers: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFlowEntitlementProps) {
    super(scope, id, {
      "type": CfnFlowEntitlement.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "flowArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "subscribers", this);

    this.attrEntitlementArn = cdk.Token.asString(this.getAtt("EntitlementArn", cdk.ResolutionTypeHint.STRING));
    this.dataTransferSubscriberFeePercent = props.dataTransferSubscriberFeePercent;
    this.description = props.description;
    this.encryption = props.encryption;
    this.entitlementStatus = props.entitlementStatus;
    this.flowArn = props.flowArn;
    this.name = props.name;
    this.subscribers = props.subscribers;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataTransferSubscriberFeePercent": this.dataTransferSubscriberFeePercent,
      "description": this.description,
      "encryption": this.encryption,
      "entitlementStatus": this.entitlementStatus,
      "flowArn": this.flowArn,
      "name": this.name,
      "subscribers": this.subscribers
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowEntitlement.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFlowEntitlementPropsToCloudFormation(props);
  }
}

export namespace CfnFlowEntitlement {
  /**
   * Information about the encryption of the flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html
   */
  export interface EncryptionProperty {
    /**
     * The type of algorithm that is used for static key encryption (such as aes128, aes192, or aes256).
     *
     * If you are using SPEKE or SRT-password encryption, this property must be left blank.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-algorithm
     */
    readonly algorithm: string;

    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, to be used with the key for encrypting content.
     *
     * This parameter is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-constantinitializationvector
     */
    readonly constantInitializationVector?: string;

    /**
     * The value of one of the devices that you configured with your digital rights management (DRM) platform key provider.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-deviceid
     */
    readonly deviceId?: string;

    /**
     * The type of key that is used for the encryption.
     *
     * If you don't specify a `keyType` value, the service uses the default setting ( `static-key` ). Valid key types are: `static-key` , `speke` , and `srt-password` .
     *
     * @default - "static-key"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-keytype
     */
    readonly keyType?: string;

    /**
     * The AWS Region that the API Gateway proxy endpoint was created in.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-region
     */
    readonly region?: string;

    /**
     * An identifier for the content.
     *
     * The service sends this value to the key server to identify the current endpoint. The resource ID is also known as the content ID. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-resourceid
     */
    readonly resourceId?: string;

    /**
     * The Amazon Resource Name (ARN) of the role that you created during setup (when you set up MediaConnect as a trusted entity).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-rolearn
     */
    readonly roleArn: string;

    /**
     * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-secretarn
     */
    readonly secretArn?: string;

    /**
     * The URL from the API Gateway proxy that you set up to talk to your key server.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowentitlement-encryption.html#cfn-mediaconnect-flowentitlement-encryption-url
     */
    readonly url?: string;
  }
}

/**
 * Properties for defining a `CfnFlowEntitlement`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html
 */
export interface CfnFlowEntitlementProps {
  /**
   * The percentage of the entitlement data transfer fee that you want the subscriber to be responsible for.
   *
   * @default - 0
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-datatransfersubscriberfeepercent
   */
  readonly dataTransferSubscriberFeePercent?: number;

  /**
   * A description of the entitlement.
   *
   * This description appears only on the MediaConnect console and is not visible outside of the current AWS account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-description
   */
  readonly description: string;

  /**
   * The type of encryption that MediaConnect will use on the output that is associated with the entitlement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-encryption
   */
  readonly encryption?: CfnFlowEntitlement.EncryptionProperty | cdk.IResolvable;

  /**
   * An indication of whether the new entitlement should be enabled or disabled as soon as it is created.
   *
   * If you don’t specify the entitlementStatus field in your request, MediaConnect sets it to ENABLED.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-entitlementstatus
   */
  readonly entitlementStatus?: string;

  /**
   * The Amazon Resource Name (ARN) of the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-flowarn
   */
  readonly flowArn: string;

  /**
   * The name of the entitlement.
   *
   * This value must be unique within the current flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-name
   */
  readonly name: string;

  /**
   * The AWS account IDs that you want to share your content with.
   *
   * The receiving accounts (subscribers) will be allowed to create their own flows using your content as the source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowentitlement.html#cfn-mediaconnect-flowentitlement-subscribers
   */
  readonly subscribers: Array<string>;
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowEntitlementEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithm", cdk.requiredValidator)(properties.algorithm));
  errors.collect(cdk.propertyValidator("algorithm", cdk.validateString)(properties.algorithm));
  errors.collect(cdk.propertyValidator("constantInitializationVector", cdk.validateString)(properties.constantInitializationVector));
  errors.collect(cdk.propertyValidator("deviceId", cdk.validateString)(properties.deviceId));
  errors.collect(cdk.propertyValidator("keyType", cdk.validateString)(properties.keyType));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"EncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowEntitlementEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowEntitlementEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "Algorithm": cdk.stringToCloudFormation(properties.algorithm),
    "ConstantInitializationVector": cdk.stringToCloudFormation(properties.constantInitializationVector),
    "DeviceId": cdk.stringToCloudFormation(properties.deviceId),
    "KeyType": cdk.stringToCloudFormation(properties.keyType),
    "Region": cdk.stringToCloudFormation(properties.region),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnFlowEntitlementEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowEntitlement.EncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowEntitlement.EncryptionProperty>();
  ret.addPropertyResult("algorithm", "Algorithm", (properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined));
  ret.addPropertyResult("constantInitializationVector", "ConstantInitializationVector", (properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined));
  ret.addPropertyResult("deviceId", "DeviceId", (properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined));
  ret.addPropertyResult("keyType", "KeyType", (properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFlowEntitlementProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowEntitlementProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowEntitlementPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataTransferSubscriberFeePercent", cdk.validateNumber)(properties.dataTransferSubscriberFeePercent));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("encryption", CfnFlowEntitlementEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("entitlementStatus", cdk.validateString)(properties.entitlementStatus));
  errors.collect(cdk.propertyValidator("flowArn", cdk.requiredValidator)(properties.flowArn));
  errors.collect(cdk.propertyValidator("flowArn", cdk.validateString)(properties.flowArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("subscribers", cdk.requiredValidator)(properties.subscribers));
  errors.collect(cdk.propertyValidator("subscribers", cdk.listValidator(cdk.validateString))(properties.subscribers));
  return errors.wrap("supplied properties not correct for \"CfnFlowEntitlementProps\"");
}

// @ts-ignore TS6133
function convertCfnFlowEntitlementPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowEntitlementPropsValidator(properties).assertSuccess();
  return {
    "DataTransferSubscriberFeePercent": cdk.numberToCloudFormation(properties.dataTransferSubscriberFeePercent),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Encryption": convertCfnFlowEntitlementEncryptionPropertyToCloudFormation(properties.encryption),
    "EntitlementStatus": cdk.stringToCloudFormation(properties.entitlementStatus),
    "FlowArn": cdk.stringToCloudFormation(properties.flowArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Subscribers": cdk.listMapper(cdk.stringToCloudFormation)(properties.subscribers)
  };
}

// @ts-ignore TS6133
function CfnFlowEntitlementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowEntitlementProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowEntitlementProps>();
  ret.addPropertyResult("dataTransferSubscriberFeePercent", "DataTransferSubscriberFeePercent", (properties.DataTransferSubscriberFeePercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.DataTransferSubscriberFeePercent) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnFlowEntitlementEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("entitlementStatus", "EntitlementStatus", (properties.EntitlementStatus != null ? cfn_parse.FromCloudFormation.getString(properties.EntitlementStatus) : undefined));
  ret.addPropertyResult("flowArn", "FlowArn", (properties.FlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.FlowArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("subscribers", "Subscribers", (properties.Subscribers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subscribers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::MediaConnect::FlowOutput resource defines the destination address, protocol, and port that AWS Elemental MediaConnect sends the ingested video to.
 *
 * Each flow can have up to 50 outputs. An output can have the same protocol or a different protocol from the source. The following protocols are supported: RIST, RTP, RTP-FEC, SRT-listener, SRT-caller, Zixi pull, Zixi push, and Fujitsu-QoS. CDI and ST 2110 JPEG XS protocols are not currently supported by AWS CloudFormation.
 *
 * @cloudformationResource AWS::MediaConnect::FlowOutput
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html
 */
export class CfnFlowOutput extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::FlowOutput";

  /**
   * Build a CfnFlowOutput from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowOutput {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFlowOutputPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFlowOutput(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the output.
   *
   * @cloudformationAttribute OutputArn
   */
  public readonly attrOutputArn: string;

  /**
   * The range of IP addresses that are allowed to initiate output requests to this flow.
   */
  public cidrAllowList?: Array<string>;

  /**
   * A description of the output.
   */
  public description?: string;

  /**
   * The IP address where you want to send the output.
   */
  public destination?: string;

  /**
   * The encryption credentials that you want to use for the output.
   */
  public encryption?: CfnFlowOutput.EncryptionProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the flow this output is attached to.
   */
  public flowArn: string;

  /**
   * The maximum latency in milliseconds.
   */
  public maxLatency?: number;

  /**
   * The minimum latency in milliseconds for SRT-based streams.
   */
  public minLatency?: number;

  /**
   * The name of the output.
   */
  public name?: string;

  /**
   * The port to use when MediaConnect distributes content to the output.
   */
  public port?: number;

  /**
   * The protocol to use for the output.
   */
  public protocol: string;

  /**
   * The identifier that is assigned to the Zixi receiver.
   */
  public remoteId?: string;

  /**
   * The smoothing latency in milliseconds for RIST, RTP, and RTP-FEC streams.
   */
  public smoothingLatency?: number;

  /**
   * The stream ID that you want to use for this transport.
   */
  public streamId?: string;

  /**
   * The VPC interface that you want to send your output to.
   */
  public vpcInterfaceAttachment?: cdk.IResolvable | CfnFlowOutput.VpcInterfaceAttachmentProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFlowOutputProps) {
    super(scope, id, {
      "type": CfnFlowOutput.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "flowArn", this);
    cdk.requireProperty(props, "protocol", this);

    this.attrOutputArn = cdk.Token.asString(this.getAtt("OutputArn", cdk.ResolutionTypeHint.STRING));
    this.cidrAllowList = props.cidrAllowList;
    this.description = props.description;
    this.destination = props.destination;
    this.encryption = props.encryption;
    this.flowArn = props.flowArn;
    this.maxLatency = props.maxLatency;
    this.minLatency = props.minLatency;
    this.name = props.name;
    this.port = props.port;
    this.protocol = props.protocol;
    this.remoteId = props.remoteId;
    this.smoothingLatency = props.smoothingLatency;
    this.streamId = props.streamId;
    this.vpcInterfaceAttachment = props.vpcInterfaceAttachment;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cidrAllowList": this.cidrAllowList,
      "description": this.description,
      "destination": this.destination,
      "encryption": this.encryption,
      "flowArn": this.flowArn,
      "maxLatency": this.maxLatency,
      "minLatency": this.minLatency,
      "name": this.name,
      "port": this.port,
      "protocol": this.protocol,
      "remoteId": this.remoteId,
      "smoothingLatency": this.smoothingLatency,
      "streamId": this.streamId,
      "vpcInterfaceAttachment": this.vpcInterfaceAttachment
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowOutput.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFlowOutputPropsToCloudFormation(props);
  }
}

export namespace CfnFlowOutput {
  /**
   * Information about the encryption of the flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html
   */
  export interface EncryptionProperty {
    /**
     * The type of algorithm that is used for static key encryption (such as aes128, aes192, or aes256).
     *
     * If you are using SPEKE or SRT-password encryption, this property must be left blank.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html#cfn-mediaconnect-flowoutput-encryption-algorithm
     */
    readonly algorithm?: string;

    /**
     * The type of key that is used for the encryption.
     *
     * If you don't specify a `keyType` value, the service uses the default setting ( `static-key` ). Valid key types are: `static-key` , `speke` , and `srt-password` .
     *
     * @default - "static-key"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html#cfn-mediaconnect-flowoutput-encryption-keytype
     */
    readonly keyType?: string;

    /**
     * The Amazon Resource Name (ARN) of the role that you created during setup (when you set up MediaConnect as a trusted entity).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html#cfn-mediaconnect-flowoutput-encryption-rolearn
     */
    readonly roleArn: string;

    /**
     * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-encryption.html#cfn-mediaconnect-flowoutput-encryption-secretarn
     */
    readonly secretArn: string;
  }

  /**
   * The VPC interface that you want to send your output to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-vpcinterfaceattachment.html
   */
  export interface VpcInterfaceAttachmentProperty {
    /**
     * The name of the VPC interface that you want to send your output to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowoutput-vpcinterfaceattachment.html#cfn-mediaconnect-flowoutput-vpcinterfaceattachment-vpcinterfacename
     */
    readonly vpcInterfaceName?: string;
  }
}

/**
 * Properties for defining a `CfnFlowOutput`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html
 */
export interface CfnFlowOutputProps {
  /**
   * The range of IP addresses that are allowed to initiate output requests to this flow.
   *
   * Format the IP addresses as a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-cidrallowlist
   */
  readonly cidrAllowList?: Array<string>;

  /**
   * A description of the output.
   *
   * This description is not visible outside of the current AWS account even if the account grants entitlements to other accounts.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-description
   */
  readonly description?: string;

  /**
   * The IP address where you want to send the output.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-destination
   */
  readonly destination?: string;

  /**
   * The encryption credentials that you want to use for the output.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-encryption
   */
  readonly encryption?: CfnFlowOutput.EncryptionProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the flow this output is attached to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-flowarn
   */
  readonly flowArn: string;

  /**
   * The maximum latency in milliseconds.
   *
   * This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-maxlatency
   */
  readonly maxLatency?: number;

  /**
   * The minimum latency in milliseconds for SRT-based streams.
   *
   * In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-minlatency
   */
  readonly minLatency?: number;

  /**
   * The name of the output.
   *
   * This value must be unique within the current flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-name
   */
  readonly name?: string;

  /**
   * The port to use when MediaConnect distributes content to the output.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-port
   */
  readonly port?: number;

  /**
   * The protocol to use for the output.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-protocol
   */
  readonly protocol: string;

  /**
   * The identifier that is assigned to the Zixi receiver.
   *
   * This parameter applies only to outputs that use Zixi pull.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-remoteid
   */
  readonly remoteId?: string;

  /**
   * The smoothing latency in milliseconds for RIST, RTP, and RTP-FEC streams.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-smoothinglatency
   */
  readonly smoothingLatency?: number;

  /**
   * The stream ID that you want to use for this transport.
   *
   * This parameter applies only to Zixi and SRT caller-based streams.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-streamid
   */
  readonly streamId?: string;

  /**
   * The VPC interface that you want to send your output to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowoutput.html#cfn-mediaconnect-flowoutput-vpcinterfaceattachment
   */
  readonly vpcInterfaceAttachment?: cdk.IResolvable | CfnFlowOutput.VpcInterfaceAttachmentProperty;
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowOutputEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithm", cdk.validateString)(properties.algorithm));
  errors.collect(cdk.propertyValidator("keyType", cdk.validateString)(properties.keyType));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  return errors.wrap("supplied properties not correct for \"EncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowOutputEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowOutputEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "Algorithm": cdk.stringToCloudFormation(properties.algorithm),
    "KeyType": cdk.stringToCloudFormation(properties.keyType),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn)
  };
}

// @ts-ignore TS6133
function CfnFlowOutputEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowOutput.EncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowOutput.EncryptionProperty>();
  ret.addPropertyResult("algorithm", "Algorithm", (properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined));
  ret.addPropertyResult("keyType", "KeyType", (properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcInterfaceAttachmentProperty`
 *
 * @param properties - the TypeScript properties of a `VpcInterfaceAttachmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowOutputVpcInterfaceAttachmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vpcInterfaceName", cdk.validateString)(properties.vpcInterfaceName));
  return errors.wrap("supplied properties not correct for \"VpcInterfaceAttachmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowOutputVpcInterfaceAttachmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowOutputVpcInterfaceAttachmentPropertyValidator(properties).assertSuccess();
  return {
    "VpcInterfaceName": cdk.stringToCloudFormation(properties.vpcInterfaceName)
  };
}

// @ts-ignore TS6133
function CfnFlowOutputVpcInterfaceAttachmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlowOutput.VpcInterfaceAttachmentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowOutput.VpcInterfaceAttachmentProperty>();
  ret.addPropertyResult("vpcInterfaceName", "VpcInterfaceName", (properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFlowOutputProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowOutputProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowOutputPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cidrAllowList", cdk.listValidator(cdk.validateString))(properties.cidrAllowList));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  errors.collect(cdk.propertyValidator("encryption", CfnFlowOutputEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("flowArn", cdk.requiredValidator)(properties.flowArn));
  errors.collect(cdk.propertyValidator("flowArn", cdk.validateString)(properties.flowArn));
  errors.collect(cdk.propertyValidator("maxLatency", cdk.validateNumber)(properties.maxLatency));
  errors.collect(cdk.propertyValidator("minLatency", cdk.validateNumber)(properties.minLatency));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("remoteId", cdk.validateString)(properties.remoteId));
  errors.collect(cdk.propertyValidator("smoothingLatency", cdk.validateNumber)(properties.smoothingLatency));
  errors.collect(cdk.propertyValidator("streamId", cdk.validateString)(properties.streamId));
  errors.collect(cdk.propertyValidator("vpcInterfaceAttachment", CfnFlowOutputVpcInterfaceAttachmentPropertyValidator)(properties.vpcInterfaceAttachment));
  return errors.wrap("supplied properties not correct for \"CfnFlowOutputProps\"");
}

// @ts-ignore TS6133
function convertCfnFlowOutputPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowOutputPropsValidator(properties).assertSuccess();
  return {
    "CidrAllowList": cdk.listMapper(cdk.stringToCloudFormation)(properties.cidrAllowList),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Destination": cdk.stringToCloudFormation(properties.destination),
    "Encryption": convertCfnFlowOutputEncryptionPropertyToCloudFormation(properties.encryption),
    "FlowArn": cdk.stringToCloudFormation(properties.flowArn),
    "MaxLatency": cdk.numberToCloudFormation(properties.maxLatency),
    "MinLatency": cdk.numberToCloudFormation(properties.minLatency),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "RemoteId": cdk.stringToCloudFormation(properties.remoteId),
    "SmoothingLatency": cdk.numberToCloudFormation(properties.smoothingLatency),
    "StreamId": cdk.stringToCloudFormation(properties.streamId),
    "VpcInterfaceAttachment": convertCfnFlowOutputVpcInterfaceAttachmentPropertyToCloudFormation(properties.vpcInterfaceAttachment)
  };
}

// @ts-ignore TS6133
function CfnFlowOutputPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowOutputProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowOutputProps>();
  ret.addPropertyResult("cidrAllowList", "CidrAllowList", (properties.CidrAllowList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CidrAllowList) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined));
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnFlowOutputEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("flowArn", "FlowArn", (properties.FlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.FlowArn) : undefined));
  ret.addPropertyResult("maxLatency", "MaxLatency", (properties.MaxLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLatency) : undefined));
  ret.addPropertyResult("minLatency", "MinLatency", (properties.MinLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinLatency) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("remoteId", "RemoteId", (properties.RemoteId != null ? cfn_parse.FromCloudFormation.getString(properties.RemoteId) : undefined));
  ret.addPropertyResult("smoothingLatency", "SmoothingLatency", (properties.SmoothingLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.SmoothingLatency) : undefined));
  ret.addPropertyResult("streamId", "StreamId", (properties.StreamId != null ? cfn_parse.FromCloudFormation.getString(properties.StreamId) : undefined));
  ret.addPropertyResult("vpcInterfaceAttachment", "VpcInterfaceAttachment", (properties.VpcInterfaceAttachment != null ? CfnFlowOutputVpcInterfaceAttachmentPropertyFromCloudFormation(properties.VpcInterfaceAttachment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::MediaConnect::FlowSource resource is used to add additional sources to an existing flow.
 *
 * Adding an additional source requires Failover to be enabled. When you enable Failover, the additional source must use the same protocol as the existing source. A source is the external video content that includes configuration information (encryption and source type) and a network address. Each flow has at least one source. A standard source comes from a source other than another AWS Elemental MediaConnect flow, such as an on-premises encoder.
 *
 * @cloudformationResource AWS::MediaConnect::FlowSource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html
 */
export class CfnFlowSource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::FlowSource";

  /**
   * Build a CfnFlowSource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowSource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFlowSourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFlowSource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The IP address that the flow listens on for incoming content.
   *
   * @cloudformationAttribute IngestIp
   */
  public readonly attrIngestIp: string;

  /**
   * The ARN of the source.
   *
   * @cloudformationAttribute SourceArn
   */
  public readonly attrSourceArn: string;

  /**
   * The port that the flow listens on for incoming content. If the protocol of the source is Zixi, the port must be set to 2088.
   *
   * @cloudformationAttribute SourceIngestPort
   */
  public readonly attrSourceIngestPort: string;

  /**
   * The type of encryption that is used on the content ingested from the source.
   */
  public decryption?: CfnFlowSource.EncryptionProperty | cdk.IResolvable;

  /**
   * A description of the source.
   */
  public description: string;

  /**
   * The ARN of the entitlement that allows you to subscribe to the flow.
   */
  public entitlementArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the flow this source is connected to.
   */
  public flowArn?: string;

  /**
   * The source configuration for cloud flows receiving a stream from a bridge.
   */
  public gatewayBridgeSource?: CfnFlowSource.GatewayBridgeSourceProperty | cdk.IResolvable;

  /**
   * The port that the flow listens on for incoming content.
   */
  public ingestPort?: number;

  /**
   * The maximum bitrate for RIST, RTP, and RTP-FEC streams.
   */
  public maxBitrate?: number;

  /**
   * The maximum latency in milliseconds.
   */
  public maxLatency?: number;

  /**
   * The minimum latency in milliseconds for SRT-based streams.
   */
  public minLatency?: number;

  /**
   * The name of the source.
   */
  public name: string;

  /**
   * The protocol that the source uses to deliver the content to MediaConnect.
   */
  public protocol?: string;

  /**
   * The port that the flow uses to send outbound requests to initiate connection with the sender.
   */
  public senderControlPort?: number;

  /**
   * The IP address that the flow communicates with to initiate connection with the sender.
   */
  public senderIpAddress?: string;

  /**
   * Source IP or domain name for SRT-caller protocol.
   */
  public sourceListenerAddress?: string;

  /**
   * Source port for SRT-caller protocol.
   */
  public sourceListenerPort?: number;

  /**
   * The stream ID that you want to use for this transport.
   */
  public streamId?: string;

  /**
   * The name of the VPC interface that you want to send your output to.
   */
  public vpcInterfaceName?: string;

  /**
   * The range of IP addresses that are allowed to contribute content to your source.
   */
  public whitelistCidr?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFlowSourceProps) {
    super(scope, id, {
      "type": CfnFlowSource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "name", this);

    this.attrIngestIp = cdk.Token.asString(this.getAtt("IngestIp", cdk.ResolutionTypeHint.STRING));
    this.attrSourceArn = cdk.Token.asString(this.getAtt("SourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrSourceIngestPort = cdk.Token.asString(this.getAtt("SourceIngestPort", cdk.ResolutionTypeHint.STRING));
    this.decryption = props.decryption;
    this.description = props.description;
    this.entitlementArn = props.entitlementArn;
    this.flowArn = props.flowArn;
    this.gatewayBridgeSource = props.gatewayBridgeSource;
    this.ingestPort = props.ingestPort;
    this.maxBitrate = props.maxBitrate;
    this.maxLatency = props.maxLatency;
    this.minLatency = props.minLatency;
    this.name = props.name;
    this.protocol = props.protocol;
    this.senderControlPort = props.senderControlPort;
    this.senderIpAddress = props.senderIpAddress;
    this.sourceListenerAddress = props.sourceListenerAddress;
    this.sourceListenerPort = props.sourceListenerPort;
    this.streamId = props.streamId;
    this.vpcInterfaceName = props.vpcInterfaceName;
    this.whitelistCidr = props.whitelistCidr;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "decryption": this.decryption,
      "description": this.description,
      "entitlementArn": this.entitlementArn,
      "flowArn": this.flowArn,
      "gatewayBridgeSource": this.gatewayBridgeSource,
      "ingestPort": this.ingestPort,
      "maxBitrate": this.maxBitrate,
      "maxLatency": this.maxLatency,
      "minLatency": this.minLatency,
      "name": this.name,
      "protocol": this.protocol,
      "senderControlPort": this.senderControlPort,
      "senderIpAddress": this.senderIpAddress,
      "sourceListenerAddress": this.sourceListenerAddress,
      "sourceListenerPort": this.sourceListenerPort,
      "streamId": this.streamId,
      "vpcInterfaceName": this.vpcInterfaceName,
      "whitelistCidr": this.whitelistCidr
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowSource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFlowSourcePropsToCloudFormation(props);
  }
}

export namespace CfnFlowSource {
  /**
   * Information about the encryption of the flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html
   */
  export interface EncryptionProperty {
    /**
     * The type of algorithm that is used for static key encryption (such as aes128, aes192, or aes256).
     *
     * If you are using SPEKE or SRT-password encryption, this property must be left blank.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-algorithm
     */
    readonly algorithm?: string;

    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, to be used with the key for encrypting content.
     *
     * This parameter is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-constantinitializationvector
     */
    readonly constantInitializationVector?: string;

    /**
     * The value of one of the devices that you configured with your digital rights management (DRM) platform key provider.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-deviceid
     */
    readonly deviceId?: string;

    /**
     * The type of key that is used for the encryption.
     *
     * If you don't specify a `keyType` value, the service uses the default setting ( `static-key` ). Valid key types are: `static-key` , `speke` , and `srt-password` .
     *
     * @default - "static-key"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-keytype
     */
    readonly keyType?: string;

    /**
     * The AWS Region that the API Gateway proxy endpoint was created in.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-region
     */
    readonly region?: string;

    /**
     * An identifier for the content.
     *
     * The service sends this value to the key server to identify the current endpoint. The resource ID is also known as the content ID. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-resourceid
     */
    readonly resourceId?: string;

    /**
     * The Amazon Resource Name (ARN) of the role that you created during setup (when you set up MediaConnect as a trusted entity).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-rolearn
     */
    readonly roleArn: string;

    /**
     * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-secretarn
     */
    readonly secretArn?: string;

    /**
     * The URL from the API Gateway proxy that you set up to talk to your key server.
     *
     * This parameter is required for SPEKE encryption and is not valid for static key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-encryption.html#cfn-mediaconnect-flowsource-encryption-url
     */
    readonly url?: string;
  }

  /**
   * The source configuration for cloud flows receiving a stream from a bridge.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-gatewaybridgesource.html
   */
  export interface GatewayBridgeSourceProperty {
    /**
     * The ARN of the bridge feeding this flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-gatewaybridgesource.html#cfn-mediaconnect-flowsource-gatewaybridgesource-bridgearn
     */
    readonly bridgeArn: string;

    /**
     * The name of the VPC interface attachment to use for this bridge source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-gatewaybridgesource.html#cfn-mediaconnect-flowsource-gatewaybridgesource-vpcinterfaceattachment
     */
    readonly vpcInterfaceAttachment?: cdk.IResolvable | CfnFlowSource.VpcInterfaceAttachmentProperty;
  }

  /**
   * The VPC interface that you want to send your output to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-vpcinterfaceattachment.html
   */
  export interface VpcInterfaceAttachmentProperty {
    /**
     * The name of the VPC interface that you want to send your output to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-flowsource-vpcinterfaceattachment.html#cfn-mediaconnect-flowsource-vpcinterfaceattachment-vpcinterfacename
     */
    readonly vpcInterfaceName?: string;
  }
}

/**
 * Properties for defining a `CfnFlowSource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html
 */
export interface CfnFlowSourceProps {
  /**
   * The type of encryption that is used on the content ingested from the source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-decryption
   */
  readonly decryption?: CfnFlowSource.EncryptionProperty | cdk.IResolvable;

  /**
   * A description of the source.
   *
   * This description is not visible outside of the current AWS account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-description
   */
  readonly description: string;

  /**
   * The ARN of the entitlement that allows you to subscribe to the flow.
   *
   * The entitlement is set by the content originator, and the ARN is generated as part of the originator's flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-entitlementarn
   */
  readonly entitlementArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the flow this source is connected to.
   *
   * The flow must have Failover enabled to add an additional source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-flowarn
   */
  readonly flowArn?: string;

  /**
   * The source configuration for cloud flows receiving a stream from a bridge.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-gatewaybridgesource
   */
  readonly gatewayBridgeSource?: CfnFlowSource.GatewayBridgeSourceProperty | cdk.IResolvable;

  /**
   * The port that the flow listens on for incoming content.
   *
   * If the protocol of the source is Zixi, the port must be set to 2088.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-ingestport
   */
  readonly ingestPort?: number;

  /**
   * The maximum bitrate for RIST, RTP, and RTP-FEC streams.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-maxbitrate
   */
  readonly maxBitrate?: number;

  /**
   * The maximum latency in milliseconds.
   *
   * This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
   *
   * @default - 2000
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-maxlatency
   */
  readonly maxLatency?: number;

  /**
   * The minimum latency in milliseconds for SRT-based streams.
   *
   * In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
   *
   * @default - 2000
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-minlatency
   */
  readonly minLatency?: number;

  /**
   * The name of the source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-name
   */
  readonly name: string;

  /**
   * The protocol that the source uses to deliver the content to MediaConnect.
   *
   * Adding additional sources to an existing flow requires Failover to be enabled. When you enable Failover, the additional source must use the same protocol as the existing source. Only the following protocols support failover: Zixi-push, RTP-FEC, RTP, RIST and SRT protocols.
   *
   * If you use failover with SRT caller or listener, the `FailoverMode` property must be set to `FAILOVER` . The `FailoverMode` property is found in the `FailoverConfig` resource of the same flow ARN you used for the source's `FlowArn` property. SRT caller/listener does not support merge mode failover.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-protocol
   */
  readonly protocol?: string;

  /**
   * The port that the flow uses to send outbound requests to initiate connection with the sender.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-sendercontrolport
   */
  readonly senderControlPort?: number;

  /**
   * The IP address that the flow communicates with to initiate connection with the sender.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-senderipaddress
   */
  readonly senderIpAddress?: string;

  /**
   * Source IP or domain name for SRT-caller protocol.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-sourcelisteneraddress
   */
  readonly sourceListenerAddress?: string;

  /**
   * Source port for SRT-caller protocol.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-sourcelistenerport
   */
  readonly sourceListenerPort?: number;

  /**
   * The stream ID that you want to use for this transport.
   *
   * This parameter applies only to Zixi and SRT caller-based streams.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-streamid
   */
  readonly streamId?: string;

  /**
   * The name of the VPC interface that you want to send your output to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-vpcinterfacename
   */
  readonly vpcInterfaceName?: string;

  /**
   * The range of IP addresses that are allowed to contribute content to your source.
   *
   * Format the IP addresses as a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowsource.html#cfn-mediaconnect-flowsource-whitelistcidr
   */
  readonly whitelistCidr?: string;
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSourceEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithm", cdk.validateString)(properties.algorithm));
  errors.collect(cdk.propertyValidator("constantInitializationVector", cdk.validateString)(properties.constantInitializationVector));
  errors.collect(cdk.propertyValidator("deviceId", cdk.validateString)(properties.deviceId));
  errors.collect(cdk.propertyValidator("keyType", cdk.validateString)(properties.keyType));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"EncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSourceEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSourceEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "Algorithm": cdk.stringToCloudFormation(properties.algorithm),
    "ConstantInitializationVector": cdk.stringToCloudFormation(properties.constantInitializationVector),
    "DeviceId": cdk.stringToCloudFormation(properties.deviceId),
    "KeyType": cdk.stringToCloudFormation(properties.keyType),
    "Region": cdk.stringToCloudFormation(properties.region),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnFlowSourceEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowSource.EncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowSource.EncryptionProperty>();
  ret.addPropertyResult("algorithm", "Algorithm", (properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined));
  ret.addPropertyResult("constantInitializationVector", "ConstantInitializationVector", (properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined));
  ret.addPropertyResult("deviceId", "DeviceId", (properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined));
  ret.addPropertyResult("keyType", "KeyType", (properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcInterfaceAttachmentProperty`
 *
 * @param properties - the TypeScript properties of a `VpcInterfaceAttachmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSourceVpcInterfaceAttachmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vpcInterfaceName", cdk.validateString)(properties.vpcInterfaceName));
  return errors.wrap("supplied properties not correct for \"VpcInterfaceAttachmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSourceVpcInterfaceAttachmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSourceVpcInterfaceAttachmentPropertyValidator(properties).assertSuccess();
  return {
    "VpcInterfaceName": cdk.stringToCloudFormation(properties.vpcInterfaceName)
  };
}

// @ts-ignore TS6133
function CfnFlowSourceVpcInterfaceAttachmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlowSource.VpcInterfaceAttachmentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowSource.VpcInterfaceAttachmentProperty>();
  ret.addPropertyResult("vpcInterfaceName", "VpcInterfaceName", (properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayBridgeSourceProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayBridgeSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSourceGatewayBridgeSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bridgeArn", cdk.requiredValidator)(properties.bridgeArn));
  errors.collect(cdk.propertyValidator("bridgeArn", cdk.validateString)(properties.bridgeArn));
  errors.collect(cdk.propertyValidator("vpcInterfaceAttachment", CfnFlowSourceVpcInterfaceAttachmentPropertyValidator)(properties.vpcInterfaceAttachment));
  return errors.wrap("supplied properties not correct for \"GatewayBridgeSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSourceGatewayBridgeSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSourceGatewayBridgeSourcePropertyValidator(properties).assertSuccess();
  return {
    "BridgeArn": cdk.stringToCloudFormation(properties.bridgeArn),
    "VpcInterfaceAttachment": convertCfnFlowSourceVpcInterfaceAttachmentPropertyToCloudFormation(properties.vpcInterfaceAttachment)
  };
}

// @ts-ignore TS6133
function CfnFlowSourceGatewayBridgeSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowSource.GatewayBridgeSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowSource.GatewayBridgeSourceProperty>();
  ret.addPropertyResult("bridgeArn", "BridgeArn", (properties.BridgeArn != null ? cfn_parse.FromCloudFormation.getString(properties.BridgeArn) : undefined));
  ret.addPropertyResult("vpcInterfaceAttachment", "VpcInterfaceAttachment", (properties.VpcInterfaceAttachment != null ? CfnFlowSourceVpcInterfaceAttachmentPropertyFromCloudFormation(properties.VpcInterfaceAttachment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFlowSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowSourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("decryption", CfnFlowSourceEncryptionPropertyValidator)(properties.decryption));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("entitlementArn", cdk.validateString)(properties.entitlementArn));
  errors.collect(cdk.propertyValidator("flowArn", cdk.validateString)(properties.flowArn));
  errors.collect(cdk.propertyValidator("gatewayBridgeSource", CfnFlowSourceGatewayBridgeSourcePropertyValidator)(properties.gatewayBridgeSource));
  errors.collect(cdk.propertyValidator("ingestPort", cdk.validateNumber)(properties.ingestPort));
  errors.collect(cdk.propertyValidator("maxBitrate", cdk.validateNumber)(properties.maxBitrate));
  errors.collect(cdk.propertyValidator("maxLatency", cdk.validateNumber)(properties.maxLatency));
  errors.collect(cdk.propertyValidator("minLatency", cdk.validateNumber)(properties.minLatency));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("senderControlPort", cdk.validateNumber)(properties.senderControlPort));
  errors.collect(cdk.propertyValidator("senderIpAddress", cdk.validateString)(properties.senderIpAddress));
  errors.collect(cdk.propertyValidator("sourceListenerAddress", cdk.validateString)(properties.sourceListenerAddress));
  errors.collect(cdk.propertyValidator("sourceListenerPort", cdk.validateNumber)(properties.sourceListenerPort));
  errors.collect(cdk.propertyValidator("streamId", cdk.validateString)(properties.streamId));
  errors.collect(cdk.propertyValidator("vpcInterfaceName", cdk.validateString)(properties.vpcInterfaceName));
  errors.collect(cdk.propertyValidator("whitelistCidr", cdk.validateString)(properties.whitelistCidr));
  return errors.wrap("supplied properties not correct for \"CfnFlowSourceProps\"");
}

// @ts-ignore TS6133
function convertCfnFlowSourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSourcePropsValidator(properties).assertSuccess();
  return {
    "Decryption": convertCfnFlowSourceEncryptionPropertyToCloudFormation(properties.decryption),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EntitlementArn": cdk.stringToCloudFormation(properties.entitlementArn),
    "FlowArn": cdk.stringToCloudFormation(properties.flowArn),
    "GatewayBridgeSource": convertCfnFlowSourceGatewayBridgeSourcePropertyToCloudFormation(properties.gatewayBridgeSource),
    "IngestPort": cdk.numberToCloudFormation(properties.ingestPort),
    "MaxBitrate": cdk.numberToCloudFormation(properties.maxBitrate),
    "MaxLatency": cdk.numberToCloudFormation(properties.maxLatency),
    "MinLatency": cdk.numberToCloudFormation(properties.minLatency),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "SenderControlPort": cdk.numberToCloudFormation(properties.senderControlPort),
    "SenderIpAddress": cdk.stringToCloudFormation(properties.senderIpAddress),
    "SourceListenerAddress": cdk.stringToCloudFormation(properties.sourceListenerAddress),
    "SourceListenerPort": cdk.numberToCloudFormation(properties.sourceListenerPort),
    "StreamId": cdk.stringToCloudFormation(properties.streamId),
    "VpcInterfaceName": cdk.stringToCloudFormation(properties.vpcInterfaceName),
    "WhitelistCidr": cdk.stringToCloudFormation(properties.whitelistCidr)
  };
}

// @ts-ignore TS6133
function CfnFlowSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowSourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowSourceProps>();
  ret.addPropertyResult("decryption", "Decryption", (properties.Decryption != null ? CfnFlowSourceEncryptionPropertyFromCloudFormation(properties.Decryption) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("entitlementArn", "EntitlementArn", (properties.EntitlementArn != null ? cfn_parse.FromCloudFormation.getString(properties.EntitlementArn) : undefined));
  ret.addPropertyResult("flowArn", "FlowArn", (properties.FlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.FlowArn) : undefined));
  ret.addPropertyResult("gatewayBridgeSource", "GatewayBridgeSource", (properties.GatewayBridgeSource != null ? CfnFlowSourceGatewayBridgeSourcePropertyFromCloudFormation(properties.GatewayBridgeSource) : undefined));
  ret.addPropertyResult("ingestPort", "IngestPort", (properties.IngestPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.IngestPort) : undefined));
  ret.addPropertyResult("maxBitrate", "MaxBitrate", (properties.MaxBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBitrate) : undefined));
  ret.addPropertyResult("maxLatency", "MaxLatency", (properties.MaxLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLatency) : undefined));
  ret.addPropertyResult("minLatency", "MinLatency", (properties.MinLatency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinLatency) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("senderControlPort", "SenderControlPort", (properties.SenderControlPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.SenderControlPort) : undefined));
  ret.addPropertyResult("senderIpAddress", "SenderIpAddress", (properties.SenderIpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.SenderIpAddress) : undefined));
  ret.addPropertyResult("sourceListenerAddress", "SourceListenerAddress", (properties.SourceListenerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.SourceListenerAddress) : undefined));
  ret.addPropertyResult("sourceListenerPort", "SourceListenerPort", (properties.SourceListenerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.SourceListenerPort) : undefined));
  ret.addPropertyResult("streamId", "StreamId", (properties.StreamId != null ? cfn_parse.FromCloudFormation.getString(properties.StreamId) : undefined));
  ret.addPropertyResult("vpcInterfaceName", "VpcInterfaceName", (properties.VpcInterfaceName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcInterfaceName) : undefined));
  ret.addPropertyResult("whitelistCidr", "WhitelistCidr", (properties.WhitelistCidr != null ? cfn_parse.FromCloudFormation.getString(properties.WhitelistCidr) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::MediaConnect::FlowVpcInterface resource is a connection between your AWS Elemental MediaConnect flow and a virtual private cloud (VPC) that you created using the Amazon Virtual Private Cloud service.
 *
 * To avoid streaming your content over the public internet, you can add up to two VPC interfaces to your flow and use those connections to transfer content between your VPC and MediaConnect.
 *
 * You can update an existing flow to add a VPC interface. If you haven’t created the flow yet, you must create the flow with a temporary standard source by doing the following:
 *
 * - Use CloudFormation to create a flow with a standard source that uses to the flow’s public IP address.
 * - Use CloudFormation to create a VPC interface to add to this flow. This can also be done as part of the previous step.
 * - After CloudFormation has created the flow and the VPC interface, update the source to point to the VPC interface that you created.
 *
 * @cloudformationResource AWS::MediaConnect::FlowVpcInterface
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html
 */
export class CfnFlowVpcInterface extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::FlowVpcInterface";

  /**
   * Build a CfnFlowVpcInterface from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowVpcInterface {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFlowVpcInterfacePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFlowVpcInterface(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The IDs of the network interfaces that MediaConnect created in your account.
   *
   * @cloudformationAttribute NetworkInterfaceIds
   */
  public readonly attrNetworkInterfaceIds: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the flow.
   */
  public flowArn: string;

  /**
   * The name of the VPC Interface.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of the role that you created when you set up MediaConnect as a trusted service.
   */
  public roleArn: string;

  /**
   * The VPC security groups that you want MediaConnect to use for your VPC configuration.
   */
  public securityGroupIds: Array<string>;

  /**
   * The subnet IDs that you want to use for your VPC interface.
   */
  public subnetId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFlowVpcInterfaceProps) {
    super(scope, id, {
      "type": CfnFlowVpcInterface.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "flowArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "securityGroupIds", this);
    cdk.requireProperty(props, "subnetId", this);

    this.attrNetworkInterfaceIds = cdk.Token.asList(this.getAtt("NetworkInterfaceIds", cdk.ResolutionTypeHint.STRING_LIST));
    this.flowArn = props.flowArn;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.securityGroupIds = props.securityGroupIds;
    this.subnetId = props.subnetId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "flowArn": this.flowArn,
      "name": this.name,
      "roleArn": this.roleArn,
      "securityGroupIds": this.securityGroupIds,
      "subnetId": this.subnetId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowVpcInterface.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFlowVpcInterfacePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnFlowVpcInterface`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html
 */
export interface CfnFlowVpcInterfaceProps {
  /**
   * The Amazon Resource Name (ARN) of the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-flowarn
   */
  readonly flowArn: string;

  /**
   * The name of the VPC Interface.
   *
   * This value must be unique within the current flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the role that you created when you set up MediaConnect as a trusted service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-rolearn
   */
  readonly roleArn: string;

  /**
   * The VPC security groups that you want MediaConnect to use for your VPC configuration.
   *
   * You must include at least one security group in the request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-securitygroupids
   */
  readonly securityGroupIds: Array<string>;

  /**
   * The subnet IDs that you want to use for your VPC interface.
   *
   * A range of IP addresses in your VPC. When you create your VPC, you specify a range of IPv4 addresses for the VPC in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16. This is the primary CIDR block for your VPC. When you create a subnet for your VPC, you specify the CIDR block for the subnet, which is a subset of the VPC CIDR block.
   *
   * The subnets that you use across all VPC interfaces on the flow must be in the same Availability Zone as the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-flowvpcinterface.html#cfn-mediaconnect-flowvpcinterface-subnetid
   */
  readonly subnetId: string;
}

/**
 * Determine whether the given properties match those of a `CfnFlowVpcInterfaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowVpcInterfaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowVpcInterfacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("flowArn", cdk.requiredValidator)(properties.flowArn));
  errors.collect(cdk.propertyValidator("flowArn", cdk.validateString)(properties.flowArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetId", cdk.requiredValidator)(properties.subnetId));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  return errors.wrap("supplied properties not correct for \"CfnFlowVpcInterfaceProps\"");
}

// @ts-ignore TS6133
function convertCfnFlowVpcInterfacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowVpcInterfacePropsValidator(properties).assertSuccess();
  return {
    "FlowArn": cdk.stringToCloudFormation(properties.flowArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId)
  };
}

// @ts-ignore TS6133
function CfnFlowVpcInterfacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowVpcInterfaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowVpcInterfaceProps>();
  ret.addPropertyResult("flowArn", "FlowArn", (properties.FlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.FlowArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::MediaConnect::Gateway resource is used to create a new gateway.
 *
 * AWS Elemental MediaConnect Gateway is a feature of MediaConnect that allows the deployment of on-premises resources for transporting live video to and from the AWS Cloud. MediaConnect Gateway allows you to contribute live video to the AWS Cloud from on-premises hardware, as well as distribute live video from the AWS Cloud to your local data center.
 *
 * @cloudformationResource AWS::MediaConnect::Gateway
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-gateway.html
 */
export class CfnGateway extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaConnect::Gateway";

  /**
   * Build a CfnGateway from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGateway {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGatewayPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGateway(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the gateway.
   *
   * @cloudformationAttribute GatewayArn
   */
  public readonly attrGatewayArn: string;

  /**
   * The current state of the gateway. Possible values are: CREATING, ACTIVE, UPDATING, ERROR, DELETING, DELETED.
   *
   * @cloudformationAttribute GatewayState
   */
  public readonly attrGatewayState: string;

  /**
   * The range of IP addresses that are allowed to contribute content or initiate output requests for flows communicating with this gateway.
   */
  public egressCidrBlocks: Array<string>;

  /**
   * The name of the network.
   */
  public name: string;

  /**
   * The list of networks that you want to add.
   */
  public networks: Array<CfnGateway.GatewayNetworkProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGatewayProps) {
    super(scope, id, {
      "type": CfnGateway.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "egressCidrBlocks", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "networks", this);

    this.attrGatewayArn = cdk.Token.asString(this.getAtt("GatewayArn", cdk.ResolutionTypeHint.STRING));
    this.attrGatewayState = cdk.Token.asString(this.getAtt("GatewayState", cdk.ResolutionTypeHint.STRING));
    this.egressCidrBlocks = props.egressCidrBlocks;
    this.name = props.name;
    this.networks = props.networks;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "egressCidrBlocks": this.egressCidrBlocks,
      "name": this.name,
      "networks": this.networks
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGateway.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGatewayPropsToCloudFormation(props);
  }
}

export namespace CfnGateway {
  /**
   * The network settings for a gateway.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-gateway-gatewaynetwork.html
   */
  export interface GatewayNetworkProperty {
    /**
     * A unique IP address range to use for this network.
     *
     * These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-gateway-gatewaynetwork.html#cfn-mediaconnect-gateway-gatewaynetwork-cidrblock
     */
    readonly cidrBlock: string;

    /**
     * The name of the network.
     *
     * This name is used to reference the network and must be unique among networks in this gateway.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediaconnect-gateway-gatewaynetwork.html#cfn-mediaconnect-gateway-gatewaynetwork-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnGateway`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-gateway.html
 */
export interface CfnGatewayProps {
  /**
   * The range of IP addresses that are allowed to contribute content or initiate output requests for flows communicating with this gateway.
   *
   * These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-gateway.html#cfn-mediaconnect-gateway-egresscidrblocks
   */
  readonly egressCidrBlocks: Array<string>;

  /**
   * The name of the network.
   *
   * This name is used to reference the network and must be unique among networks in this gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-gateway.html#cfn-mediaconnect-gateway-name
   */
  readonly name: string;

  /**
   * The list of networks that you want to add.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediaconnect-gateway.html#cfn-mediaconnect-gateway-networks
   */
  readonly networks: Array<CfnGateway.GatewayNetworkProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `GatewayNetworkProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayNetworkProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayGatewayNetworkPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cidrBlock", cdk.requiredValidator)(properties.cidrBlock));
  errors.collect(cdk.propertyValidator("cidrBlock", cdk.validateString)(properties.cidrBlock));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"GatewayNetworkProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayGatewayNetworkPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayGatewayNetworkPropertyValidator(properties).assertSuccess();
  return {
    "CidrBlock": cdk.stringToCloudFormation(properties.cidrBlock),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnGatewayGatewayNetworkPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GatewayNetworkProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GatewayNetworkProperty>();
  ret.addPropertyResult("cidrBlock", "CidrBlock", (properties.CidrBlock != null ? cfn_parse.FromCloudFormation.getString(properties.CidrBlock) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGatewayProps`
 *
 * @param properties - the TypeScript properties of a `CfnGatewayProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("egressCidrBlocks", cdk.requiredValidator)(properties.egressCidrBlocks));
  errors.collect(cdk.propertyValidator("egressCidrBlocks", cdk.listValidator(cdk.validateString))(properties.egressCidrBlocks));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networks", cdk.requiredValidator)(properties.networks));
  errors.collect(cdk.propertyValidator("networks", cdk.listValidator(CfnGatewayGatewayNetworkPropertyValidator))(properties.networks));
  return errors.wrap("supplied properties not correct for \"CfnGatewayProps\"");
}

// @ts-ignore TS6133
function convertCfnGatewayPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayPropsValidator(properties).assertSuccess();
  return {
    "EgressCidrBlocks": cdk.listMapper(cdk.stringToCloudFormation)(properties.egressCidrBlocks),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Networks": cdk.listMapper(convertCfnGatewayGatewayNetworkPropertyToCloudFormation)(properties.networks)
  };
}

// @ts-ignore TS6133
function CfnGatewayPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayProps>();
  ret.addPropertyResult("egressCidrBlocks", "EgressCidrBlocks", (properties.EgressCidrBlocks != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EgressCidrBlocks) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networks", "Networks", (properties.Networks != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayGatewayNetworkPropertyFromCloudFormation)(properties.Networks) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}