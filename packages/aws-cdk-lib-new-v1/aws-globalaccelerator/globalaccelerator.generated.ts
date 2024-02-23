/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::GlobalAccelerator::Accelerator` resource is a Global Accelerator resource type that contains information about how you create an accelerator.
 *
 * An accelerator includes one or more listeners that process inbound connections and direct traffic to one or more endpoint groups, each of which includes endpoints, such as Application Load Balancers, Network Load Balancers, and Amazon EC2 instances.
 *
 * @cloudformationResource AWS::GlobalAccelerator::Accelerator
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html
 */
export class CfnAccelerator extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GlobalAccelerator::Accelerator";

  /**
   * Build a CfnAccelerator from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccelerator {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAcceleratorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccelerator(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the accelerator, such as `arn:aws:globalaccelerator::012345678901:accelerator/1234abcd-abcd-1234-abcd-1234abcdefgh` .
   *
   * @cloudformationAttribute AcceleratorArn
   */
  public readonly attrAcceleratorArn: string;

  /**
   * The Domain Name System (DNS) name that Global Accelerator creates that points to an accelerator's static IPv4 addresses.
   *
   * @cloudformationAttribute DnsName
   */
  public readonly attrDnsName: string;

  /**
   * The DNS name that Global Accelerator creates that points to a dual-stack accelerator's four static IP addresses: two IPv4 addresses and two IPv6 addresses.
   *
   * @cloudformationAttribute DualStackDnsName
   */
  public readonly attrDualStackDnsName: string;

  /**
   * The array of IPv4 addresses in the IP address set. An IP address set can have a maximum of two IP addresses.
   *
   * @cloudformationAttribute Ipv4Addresses
   */
  public readonly attrIpv4Addresses: Array<string>;

  /**
   * The array of IPv6 addresses in the IP address set. An IP address set can have a maximum of two IP addresses.
   *
   * @cloudformationAttribute Ipv6Addresses
   */
  public readonly attrIpv6Addresses: Array<string>;

  /**
   * Indicates whether the accelerator is enabled. The value is true or false. The default value is true.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * Optionally, if you've added your own IP address pool to Global Accelerator (BYOIP), you can choose IP addresses from your own pool to use for the accelerator's static IP addresses when you create an accelerator.
   */
  public ipAddresses?: Array<string>;

  /**
   * The IP address type that an accelerator supports.
   */
  public ipAddressType?: string;

  /**
   * The name of the accelerator.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Create tags for an accelerator.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAcceleratorProps) {
    super(scope, id, {
      "type": CfnAccelerator.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrAcceleratorArn = cdk.Token.asString(this.getAtt("AcceleratorArn", cdk.ResolutionTypeHint.STRING));
    this.attrDnsName = cdk.Token.asString(this.getAtt("DnsName", cdk.ResolutionTypeHint.STRING));
    this.attrDualStackDnsName = cdk.Token.asString(this.getAtt("DualStackDnsName", cdk.ResolutionTypeHint.STRING));
    this.attrIpv4Addresses = cdk.Token.asList(this.getAtt("Ipv4Addresses", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrIpv6Addresses = cdk.Token.asList(this.getAtt("Ipv6Addresses", cdk.ResolutionTypeHint.STRING_LIST));
    this.enabled = props.enabled;
    this.ipAddresses = props.ipAddresses;
    this.ipAddressType = props.ipAddressType;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GlobalAccelerator::Accelerator", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "enabled": this.enabled,
      "ipAddresses": this.ipAddresses,
      "ipAddressType": this.ipAddressType,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccelerator.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAcceleratorPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccelerator`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html
 */
export interface CfnAcceleratorProps {
  /**
   * Indicates whether the accelerator is enabled. The value is true or false. The default value is true.
   *
   * If the value is set to true, the accelerator cannot be deleted. If set to false, accelerator can be deleted.
   *
   * @default - true
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * Optionally, if you've added your own IP address pool to Global Accelerator (BYOIP), you can choose IP addresses from your own pool to use for the accelerator's static IP addresses when you create an accelerator.
   *
   * You can specify one or two addresses, separated by a comma. Do not include the /32 suffix.
   *
   * Only one IP address from each of your IP address ranges can be used for each accelerator. If you specify only one IP address from your IP address range, Global Accelerator assigns a second static IP address for the accelerator from the AWS IP address pool.
   *
   * Note that you can't update IP addresses for an existing accelerator. To change them, you must create a new accelerator with the new addresses.
   *
   * For more information, see [Bring Your Own IP Addresses (BYOIP)](https://docs.aws.amazon.com/global-accelerator/latest/dg/using-byoip.html) in the *AWS Global Accelerator Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-ipaddresses
   */
  readonly ipAddresses?: Array<string>;

  /**
   * The IP address type that an accelerator supports.
   *
   * For a standard accelerator, the value can be IPV4 or DUAL_STACK.
   *
   * @default - "IPV4"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-ipaddresstype
   */
  readonly ipAddressType?: string;

  /**
   * The name of the accelerator.
   *
   * The name must contain only alphanumeric characters or hyphens (-), and must not begin or end with a hyphen.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-name
   */
  readonly name: string;

  /**
   * Create tags for an accelerator.
   *
   * For more information, see [Tagging](https://docs.aws.amazon.com/global-accelerator/latest/dg/tagging-in-global-accelerator.html) in the *AWS Global Accelerator Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAcceleratorProps`
 *
 * @param properties - the TypeScript properties of a `CfnAcceleratorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAcceleratorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  errors.collect(cdk.propertyValidator("ipAddresses", cdk.listValidator(cdk.validateString))(properties.ipAddresses));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAcceleratorProps\"");
}

// @ts-ignore TS6133
function convertCfnAcceleratorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAcceleratorPropsValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "IpAddressType": cdk.stringToCloudFormation(properties.ipAddressType),
    "IpAddresses": cdk.listMapper(cdk.stringToCloudFormation)(properties.ipAddresses),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAcceleratorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAcceleratorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAcceleratorProps>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("ipAddresses", "IpAddresses", (properties.IpAddresses != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IpAddresses) : undefined));
  ret.addPropertyResult("ipAddressType", "IpAddressType", (properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GlobalAccelerator::EndpointGroup` resource is a Global Accelerator resource type that contains information about how you create an endpoint group for the specified listener.
 *
 * An endpoint group is a collection of endpoints in one AWS Region .
 *
 * @cloudformationResource AWS::GlobalAccelerator::EndpointGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html
 */
export class CfnEndpointGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GlobalAccelerator::EndpointGroup";

  /**
   * Build a CfnEndpointGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEndpointGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEndpointGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEndpointGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the endpoint group, such as `arn:aws:globalaccelerator::012345678901:accelerator/1234abcd-abcd-1234-abcd-1234abcdefgh/listener/0123vxyz/endpoint-group/098765zyxwvu` .
   *
   * @cloudformationAttribute EndpointGroupArn
   */
  public readonly attrEndpointGroupArn: string;

  /**
   * The list of endpoint objects.
   */
  public endpointConfigurations?: Array<CfnEndpointGroup.EndpointConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The AWS Regions where the endpoint group is located.
   */
  public endpointGroupRegion: string;

  /**
   * The time—10 seconds or 30 seconds—between health checks for each endpoint.
   */
  public healthCheckIntervalSeconds?: number;

  /**
   * If the protocol is HTTP/S, then this value provides the ping path that Global Accelerator uses for the destination on the endpoints for health checks.
   */
  public healthCheckPath?: string;

  /**
   * The port that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group.
   */
  public healthCheckPort?: number;

  /**
   * The protocol that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group.
   */
  public healthCheckProtocol?: string;

  /**
   * The Amazon Resource Name (ARN) of the listener.
   */
  public listenerArn: string;

  /**
   * Allows you to override the destination ports used to route traffic to an endpoint.
   */
  public portOverrides?: Array<cdk.IResolvable | CfnEndpointGroup.PortOverrideProperty> | cdk.IResolvable;

  /**
   * The number of consecutive health checks required to set the state of a healthy endpoint to unhealthy, or to set an unhealthy endpoint to healthy.
   */
  public thresholdCount?: number;

  /**
   * The percentage of traffic to send to an AWS Regions .
   */
  public trafficDialPercentage?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEndpointGroupProps) {
    super(scope, id, {
      "type": CfnEndpointGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "endpointGroupRegion", this);
    cdk.requireProperty(props, "listenerArn", this);

    this.attrEndpointGroupArn = cdk.Token.asString(this.getAtt("EndpointGroupArn", cdk.ResolutionTypeHint.STRING));
    this.endpointConfigurations = props.endpointConfigurations;
    this.endpointGroupRegion = props.endpointGroupRegion;
    this.healthCheckIntervalSeconds = props.healthCheckIntervalSeconds;
    this.healthCheckPath = props.healthCheckPath;
    this.healthCheckPort = props.healthCheckPort;
    this.healthCheckProtocol = props.healthCheckProtocol;
    this.listenerArn = props.listenerArn;
    this.portOverrides = props.portOverrides;
    this.thresholdCount = props.thresholdCount;
    this.trafficDialPercentage = props.trafficDialPercentage;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "endpointConfigurations": this.endpointConfigurations,
      "endpointGroupRegion": this.endpointGroupRegion,
      "healthCheckIntervalSeconds": this.healthCheckIntervalSeconds,
      "healthCheckPath": this.healthCheckPath,
      "healthCheckPort": this.healthCheckPort,
      "healthCheckProtocol": this.healthCheckProtocol,
      "listenerArn": this.listenerArn,
      "portOverrides": this.portOverrides,
      "thresholdCount": this.thresholdCount,
      "trafficDialPercentage": this.trafficDialPercentage
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEndpointGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEndpointGroupPropsToCloudFormation(props);
  }
}

export namespace CfnEndpointGroup {
  /**
   * Override specific listener ports used to route traffic to endpoints that are part of an endpoint group.
   *
   * For example, you can create a port override in which the listener receives user traffic on ports 80 and 443, but your accelerator routes that traffic to ports 1080 and 1443, respectively, on the endpoints.
   *
   * For more information, see [Port overrides](https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoint-groups-port-override.html) in the *AWS Global Accelerator Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-portoverride.html
   */
  export interface PortOverrideProperty {
    /**
     * The endpoint port that you want a listener port to be mapped to.
     *
     * This is the port on the endpoint, such as the Application Load Balancer or Amazon EC2 instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-portoverride.html#cfn-globalaccelerator-endpointgroup-portoverride-endpointport
     */
    readonly endpointPort: number;

    /**
     * The listener port that you want to map to a specific endpoint port.
     *
     * This is the port that user traffic arrives to the Global Accelerator on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-portoverride.html#cfn-globalaccelerator-endpointgroup-portoverride-listenerport
     */
    readonly listenerPort: number;
  }

  /**
   * A complex type for endpoints.
   *
   * A resource must be valid and active when you add it as an endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html
   */
  export interface EndpointConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the cross-account attachment that specifies the endpoints (resources) that can be added to accelerators and principals that have permission to add the endpoints to accelerators.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html#cfn-globalaccelerator-endpointgroup-endpointconfiguration-attachmentarn
     */
    readonly attachmentArn?: string;

    /**
     * Indicates whether client IP address preservation is enabled for an Application Load Balancer endpoint.
     *
     * The value is true or false. The default value is true for new accelerators.
     *
     * If the value is set to true, the client's IP address is preserved in the `X-Forwarded-For` request header as traffic travels to applications on the Application Load Balancer endpoint fronted by the accelerator.
     *
     * For more information, see [Preserve Client IP Addresses](https://docs.aws.amazon.com/global-accelerator/latest/dg/preserve-client-ip-address.html) in the *AWS Global Accelerator Developer Guide* .
     *
     * @default - true
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html#cfn-globalaccelerator-endpointgroup-endpointconfiguration-clientippreservationenabled
     */
    readonly clientIpPreservationEnabled?: boolean | cdk.IResolvable;

    /**
     * An ID for the endpoint.
     *
     * If the endpoint is a Network Load Balancer or Application Load Balancer, this is the Amazon Resource Name (ARN) of the resource. If the endpoint is an Elastic IP address, this is the Elastic IP address allocation ID. For Amazon EC2 instances, this is the EC2 instance ID. A resource must be valid and active when you add it as an endpoint.
     *
     * For cross-account endpoints, this must be the ARN of the resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html#cfn-globalaccelerator-endpointgroup-endpointconfiguration-endpointid
     */
    readonly endpointId: string;

    /**
     * The weight associated with the endpoint.
     *
     * When you add weights to endpoints, you configure Global Accelerator to route traffic based on proportions that you specify. For example, you might specify endpoint weights of 4, 5, 5, and 6 (sum=20). The result is that 4/20 of your traffic, on average, is routed to the first endpoint, 5/20 is routed both to the second and third endpoints, and 6/20 is routed to the last endpoint. For more information, see [Endpoint Weights](https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-endpoint-weights.html) in the *AWS Global Accelerator Developer Guide* .
     *
     * @default - 100
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html#cfn-globalaccelerator-endpointgroup-endpointconfiguration-weight
     */
    readonly weight?: number;
  }
}

/**
 * Properties for defining a `CfnEndpointGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html
 */
export interface CfnEndpointGroupProps {
  /**
   * The list of endpoint objects.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-endpointconfigurations
   */
  readonly endpointConfigurations?: Array<CfnEndpointGroup.EndpointConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The AWS Regions where the endpoint group is located.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-endpointgroupregion
   */
  readonly endpointGroupRegion: string;

  /**
   * The time—10 seconds or 30 seconds—between health checks for each endpoint.
   *
   * The default value is 30.
   *
   * @default - 30
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckintervalseconds
   */
  readonly healthCheckIntervalSeconds?: number;

  /**
   * If the protocol is HTTP/S, then this value provides the ping path that Global Accelerator uses for the destination on the endpoints for health checks.
   *
   * The default is slash (/).
   *
   * @default - "/"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckpath
   */
  readonly healthCheckPath?: string;

  /**
   * The port that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group.
   *
   * The default port is the port for the listener that this endpoint group is associated with. If the listener port is a list, Global Accelerator uses the first specified port in the list of ports.
   *
   * @default - -1
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckport
   */
  readonly healthCheckPort?: number;

  /**
   * The protocol that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group.
   *
   * The default value is TCP.
   *
   * @default - "TCP"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckprotocol
   */
  readonly healthCheckProtocol?: string;

  /**
   * The Amazon Resource Name (ARN) of the listener.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-listenerarn
   */
  readonly listenerArn: string;

  /**
   * Allows you to override the destination ports used to route traffic to an endpoint.
   *
   * Using a port override lets you map a list of external destination ports (that your users send traffic to) to a list of internal destination ports that you want an application endpoint to receive traffic on.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-portoverrides
   */
  readonly portOverrides?: Array<cdk.IResolvable | CfnEndpointGroup.PortOverrideProperty> | cdk.IResolvable;

  /**
   * The number of consecutive health checks required to set the state of a healthy endpoint to unhealthy, or to set an unhealthy endpoint to healthy.
   *
   * The default value is 3.
   *
   * @default - 3
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-thresholdcount
   */
  readonly thresholdCount?: number;

  /**
   * The percentage of traffic to send to an AWS Regions .
   *
   * Additional traffic is distributed to other endpoint groups for this listener.
   *
   * Use this action to increase (dial up) or decrease (dial down) traffic to a specific Region. The percentage is applied to the traffic that would otherwise have been routed to the Region based on optimal routing.
   *
   * The default value is 100.
   *
   * @default - 100
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-trafficdialpercentage
   */
  readonly trafficDialPercentage?: number;
}

/**
 * Determine whether the given properties match those of a `PortOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `PortOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointGroupPortOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpointPort", cdk.requiredValidator)(properties.endpointPort));
  errors.collect(cdk.propertyValidator("endpointPort", cdk.validateNumber)(properties.endpointPort));
  errors.collect(cdk.propertyValidator("listenerPort", cdk.requiredValidator)(properties.listenerPort));
  errors.collect(cdk.propertyValidator("listenerPort", cdk.validateNumber)(properties.listenerPort));
  return errors.wrap("supplied properties not correct for \"PortOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointGroupPortOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointGroupPortOverridePropertyValidator(properties).assertSuccess();
  return {
    "EndpointPort": cdk.numberToCloudFormation(properties.endpointPort),
    "ListenerPort": cdk.numberToCloudFormation(properties.listenerPort)
  };
}

// @ts-ignore TS6133
function CfnEndpointGroupPortOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpointGroup.PortOverrideProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointGroup.PortOverrideProperty>();
  ret.addPropertyResult("endpointPort", "EndpointPort", (properties.EndpointPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.EndpointPort) : undefined));
  ret.addPropertyResult("listenerPort", "ListenerPort", (properties.ListenerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ListenerPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndpointConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointGroupEndpointConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachmentArn", cdk.validateString)(properties.attachmentArn));
  errors.collect(cdk.propertyValidator("clientIpPreservationEnabled", cdk.validateBoolean)(properties.clientIpPreservationEnabled));
  errors.collect(cdk.propertyValidator("endpointId", cdk.requiredValidator)(properties.endpointId));
  errors.collect(cdk.propertyValidator("endpointId", cdk.validateString)(properties.endpointId));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"EndpointConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointGroupEndpointConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointGroupEndpointConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AttachmentArn": cdk.stringToCloudFormation(properties.attachmentArn),
    "ClientIPPreservationEnabled": cdk.booleanToCloudFormation(properties.clientIpPreservationEnabled),
    "EndpointId": cdk.stringToCloudFormation(properties.endpointId),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnEndpointGroupEndpointConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpointGroup.EndpointConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointGroup.EndpointConfigurationProperty>();
  ret.addPropertyResult("attachmentArn", "AttachmentArn", (properties.AttachmentArn != null ? cfn_parse.FromCloudFormation.getString(properties.AttachmentArn) : undefined));
  ret.addPropertyResult("clientIpPreservationEnabled", "ClientIPPreservationEnabled", (properties.ClientIPPreservationEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ClientIPPreservationEnabled) : undefined));
  ret.addPropertyResult("endpointId", "EndpointId", (properties.EndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointId) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEndpointGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnEndpointGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpointConfigurations", cdk.listValidator(CfnEndpointGroupEndpointConfigurationPropertyValidator))(properties.endpointConfigurations));
  errors.collect(cdk.propertyValidator("endpointGroupRegion", cdk.requiredValidator)(properties.endpointGroupRegion));
  errors.collect(cdk.propertyValidator("endpointGroupRegion", cdk.validateString)(properties.endpointGroupRegion));
  errors.collect(cdk.propertyValidator("healthCheckIntervalSeconds", cdk.validateNumber)(properties.healthCheckIntervalSeconds));
  errors.collect(cdk.propertyValidator("healthCheckPath", cdk.validateString)(properties.healthCheckPath));
  errors.collect(cdk.propertyValidator("healthCheckPort", cdk.validateNumber)(properties.healthCheckPort));
  errors.collect(cdk.propertyValidator("healthCheckProtocol", cdk.validateString)(properties.healthCheckProtocol));
  errors.collect(cdk.propertyValidator("listenerArn", cdk.requiredValidator)(properties.listenerArn));
  errors.collect(cdk.propertyValidator("listenerArn", cdk.validateString)(properties.listenerArn));
  errors.collect(cdk.propertyValidator("portOverrides", cdk.listValidator(CfnEndpointGroupPortOverridePropertyValidator))(properties.portOverrides));
  errors.collect(cdk.propertyValidator("thresholdCount", cdk.validateNumber)(properties.thresholdCount));
  errors.collect(cdk.propertyValidator("trafficDialPercentage", cdk.validateNumber)(properties.trafficDialPercentage));
  return errors.wrap("supplied properties not correct for \"CfnEndpointGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnEndpointGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointGroupPropsValidator(properties).assertSuccess();
  return {
    "EndpointConfigurations": cdk.listMapper(convertCfnEndpointGroupEndpointConfigurationPropertyToCloudFormation)(properties.endpointConfigurations),
    "EndpointGroupRegion": cdk.stringToCloudFormation(properties.endpointGroupRegion),
    "HealthCheckIntervalSeconds": cdk.numberToCloudFormation(properties.healthCheckIntervalSeconds),
    "HealthCheckPath": cdk.stringToCloudFormation(properties.healthCheckPath),
    "HealthCheckPort": cdk.numberToCloudFormation(properties.healthCheckPort),
    "HealthCheckProtocol": cdk.stringToCloudFormation(properties.healthCheckProtocol),
    "ListenerArn": cdk.stringToCloudFormation(properties.listenerArn),
    "PortOverrides": cdk.listMapper(convertCfnEndpointGroupPortOverridePropertyToCloudFormation)(properties.portOverrides),
    "ThresholdCount": cdk.numberToCloudFormation(properties.thresholdCount),
    "TrafficDialPercentage": cdk.numberToCloudFormation(properties.trafficDialPercentage)
  };
}

// @ts-ignore TS6133
function CfnEndpointGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpointGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointGroupProps>();
  ret.addPropertyResult("endpointConfigurations", "EndpointConfigurations", (properties.EndpointConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnEndpointGroupEndpointConfigurationPropertyFromCloudFormation)(properties.EndpointConfigurations) : undefined));
  ret.addPropertyResult("endpointGroupRegion", "EndpointGroupRegion", (properties.EndpointGroupRegion != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointGroupRegion) : undefined));
  ret.addPropertyResult("healthCheckIntervalSeconds", "HealthCheckIntervalSeconds", (properties.HealthCheckIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckIntervalSeconds) : undefined));
  ret.addPropertyResult("healthCheckPath", "HealthCheckPath", (properties.HealthCheckPath != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckPath) : undefined));
  ret.addPropertyResult("healthCheckPort", "HealthCheckPort", (properties.HealthCheckPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckPort) : undefined));
  ret.addPropertyResult("healthCheckProtocol", "HealthCheckProtocol", (properties.HealthCheckProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckProtocol) : undefined));
  ret.addPropertyResult("listenerArn", "ListenerArn", (properties.ListenerArn != null ? cfn_parse.FromCloudFormation.getString(properties.ListenerArn) : undefined));
  ret.addPropertyResult("portOverrides", "PortOverrides", (properties.PortOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnEndpointGroupPortOverridePropertyFromCloudFormation)(properties.PortOverrides) : undefined));
  ret.addPropertyResult("thresholdCount", "ThresholdCount", (properties.ThresholdCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThresholdCount) : undefined));
  ret.addPropertyResult("trafficDialPercentage", "TrafficDialPercentage", (properties.TrafficDialPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.TrafficDialPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GlobalAccelerator::Listener` resource is a Global Accelerator resource type that contains information about how you create a listener to process inbound connections from clients to an accelerator.
 *
 * Connections arrive to assigned static IP addresses on a port, port range, or list of port ranges that you specify.
 *
 * @cloudformationResource AWS::GlobalAccelerator::Listener
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html
 */
export class CfnListener extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GlobalAccelerator::Listener";

  /**
   * Build a CfnListener from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListener {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnListenerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnListener(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the listener, such as `arn:aws:globalaccelerator::012345678901:accelerator/1234abcd-abcd-1234-abcd-1234abcdefgh/listener/0123vxyz` .
   *
   * @cloudformationAttribute ListenerArn
   */
  public readonly attrListenerArn: string;

  /**
   * The Amazon Resource Name (ARN) of your accelerator.
   */
  public acceleratorArn: string;

  /**
   * Client affinity lets you direct all requests from a user to the same endpoint, if you have stateful applications, regardless of the port and protocol of the client request.
   */
  public clientAffinity?: string;

  /**
   * The list of port ranges for the connections from clients to the accelerator.
   */
  public portRanges: Array<cdk.IResolvable | CfnListener.PortRangeProperty> | cdk.IResolvable;

  /**
   * The protocol for the connections from clients to the accelerator.
   */
  public protocol: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnListenerProps) {
    super(scope, id, {
      "type": CfnListener.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "acceleratorArn", this);
    cdk.requireProperty(props, "portRanges", this);
    cdk.requireProperty(props, "protocol", this);

    this.attrListenerArn = cdk.Token.asString(this.getAtt("ListenerArn", cdk.ResolutionTypeHint.STRING));
    this.acceleratorArn = props.acceleratorArn;
    this.clientAffinity = props.clientAffinity;
    this.portRanges = props.portRanges;
    this.protocol = props.protocol;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceleratorArn": this.acceleratorArn,
      "clientAffinity": this.clientAffinity,
      "portRanges": this.portRanges,
      "protocol": this.protocol
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnListener.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnListenerPropsToCloudFormation(props);
  }
}

export namespace CfnListener {
  /**
   * A complex type for a range of ports for a listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-listener-portrange.html
   */
  export interface PortRangeProperty {
    /**
     * The first port in the range of ports, inclusive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-listener-portrange.html#cfn-globalaccelerator-listener-portrange-fromport
     */
    readonly fromPort: number;

    /**
     * The last port in the range of ports, inclusive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-listener-portrange.html#cfn-globalaccelerator-listener-portrange-toport
     */
    readonly toPort: number;
  }
}

/**
 * Properties for defining a `CfnListener`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html
 */
export interface CfnListenerProps {
  /**
   * The Amazon Resource Name (ARN) of your accelerator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-acceleratorarn
   */
  readonly acceleratorArn: string;

  /**
   * Client affinity lets you direct all requests from a user to the same endpoint, if you have stateful applications, regardless of the port and protocol of the client request.
   *
   * Client affinity gives you control over whether to always route each client to the same specific endpoint.
   *
   * AWS Global Accelerator uses a consistent-flow hashing algorithm to choose the optimal endpoint for a connection. If client affinity is `NONE` , Global Accelerator uses the "five-tuple" (5-tuple) properties—source IP address, source port, destination IP address, destination port, and protocol—to select the hash value, and then chooses the best endpoint. However, with this setting, if someone uses different ports to connect to Global Accelerator, their connections might not be always routed to the same endpoint because the hash value changes.
   *
   * If you want a given client to always be routed to the same endpoint, set client affinity to `SOURCE_IP` instead. When you use the `SOURCE_IP` setting, Global Accelerator uses the "two-tuple" (2-tuple) properties— source (client) IP address and destination IP address—to select the hash value.
   *
   * The default value is `NONE` .
   *
   * @default - "NONE"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-clientaffinity
   */
  readonly clientAffinity?: string;

  /**
   * The list of port ranges for the connections from clients to the accelerator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-portranges
   */
  readonly portRanges: Array<cdk.IResolvable | CfnListener.PortRangeProperty> | cdk.IResolvable;

  /**
   * The protocol for the connections from clients to the accelerator.
   *
   * @default - "TCP"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-protocol
   */
  readonly protocol: string;
}

/**
 * Determine whether the given properties match those of a `PortRangeProperty`
 *
 * @param properties - the TypeScript properties of a `PortRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerPortRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fromPort", cdk.requiredValidator)(properties.fromPort));
  errors.collect(cdk.propertyValidator("fromPort", cdk.validateNumber)(properties.fromPort));
  errors.collect(cdk.propertyValidator("toPort", cdk.requiredValidator)(properties.toPort));
  errors.collect(cdk.propertyValidator("toPort", cdk.validateNumber)(properties.toPort));
  return errors.wrap("supplied properties not correct for \"PortRangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerPortRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerPortRangePropertyValidator(properties).assertSuccess();
  return {
    "FromPort": cdk.numberToCloudFormation(properties.fromPort),
    "ToPort": cdk.numberToCloudFormation(properties.toPort)
  };
}

// @ts-ignore TS6133
function CfnListenerPortRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListener.PortRangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.PortRangeProperty>();
  ret.addPropertyResult("fromPort", "FromPort", (properties.FromPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.FromPort) : undefined));
  ret.addPropertyResult("toPort", "ToPort", (properties.ToPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ToPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnListenerProps`
 *
 * @param properties - the TypeScript properties of a `CfnListenerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceleratorArn", cdk.requiredValidator)(properties.acceleratorArn));
  errors.collect(cdk.propertyValidator("acceleratorArn", cdk.validateString)(properties.acceleratorArn));
  errors.collect(cdk.propertyValidator("clientAffinity", cdk.validateString)(properties.clientAffinity));
  errors.collect(cdk.propertyValidator("portRanges", cdk.requiredValidator)(properties.portRanges));
  errors.collect(cdk.propertyValidator("portRanges", cdk.listValidator(CfnListenerPortRangePropertyValidator))(properties.portRanges));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"CfnListenerProps\"");
}

// @ts-ignore TS6133
function convertCfnListenerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerPropsValidator(properties).assertSuccess();
  return {
    "AcceleratorArn": cdk.stringToCloudFormation(properties.acceleratorArn),
    "ClientAffinity": cdk.stringToCloudFormation(properties.clientAffinity),
    "PortRanges": cdk.listMapper(convertCfnListenerPortRangePropertyToCloudFormation)(properties.portRanges),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnListenerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerProps>();
  ret.addPropertyResult("acceleratorArn", "AcceleratorArn", (properties.AcceleratorArn != null ? cfn_parse.FromCloudFormation.getString(properties.AcceleratorArn) : undefined));
  ret.addPropertyResult("clientAffinity", "ClientAffinity", (properties.ClientAffinity != null ? cfn_parse.FromCloudFormation.getString(properties.ClientAffinity) : undefined));
  ret.addPropertyResult("portRanges", "PortRanges", (properties.PortRanges != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerPortRangePropertyFromCloudFormation)(properties.PortRanges) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}