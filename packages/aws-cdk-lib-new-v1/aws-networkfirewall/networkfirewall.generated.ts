/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Use the `Firewall` to provide stateful, managed, network firewall and intrusion detection and prevention filtering for your VPCs in Amazon VPC .
 *
 * The firewall defines the configuration settings for an AWS Network Firewall firewall. The settings include the firewall policy, the subnets in your VPC to use for the firewall endpoints, and any tags that are attached to the firewall AWS resource.
 *
 * @cloudformationResource AWS::NetworkFirewall::Firewall
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html
 */
export class CfnFirewall extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkFirewall::Firewall";

  /**
   * Build a CfnFirewall from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFirewall {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFirewallPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFirewall(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique IDs of the firewall endpoints for all of the subnets that you attached to the firewall. The subnets are not listed in any particular order. For example: `["us-west-2c:vpce-111122223333", "us-west-2a:vpce-987654321098", "us-west-2b:vpce-012345678901"]` .
   *
   * @cloudformationAttribute EndpointIds
   */
  public readonly attrEndpointIds: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the `Firewall` .
   *
   * @cloudformationAttribute FirewallArn
   */
  public readonly attrFirewallArn: string;

  /**
   * The name of the `Firewall` resource.
   *
   * @cloudformationAttribute FirewallId
   */
  public readonly attrFirewallId: string;

  /**
   * A flag indicating whether it is possible to delete the firewall.
   */
  public deleteProtection?: boolean | cdk.IResolvable;

  /**
   * A description of the firewall.
   */
  public description?: string;

  /**
   * The descriptive name of the firewall.
   */
  public firewallName: string;

  /**
   * The Amazon Resource Name (ARN) of the firewall policy.
   */
  public firewallPolicyArn: string;

  /**
   * A setting indicating whether the firewall is protected against a change to the firewall policy association.
   */
  public firewallPolicyChangeProtection?: boolean | cdk.IResolvable;

  /**
   * A setting indicating whether the firewall is protected against changes to the subnet associations.
   */
  public subnetChangeProtection?: boolean | cdk.IResolvable;

  /**
   * The public subnets that Network Firewall is using for the firewall.
   */
  public subnetMappings: Array<cdk.IResolvable | CfnFirewall.SubnetMappingProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The unique identifier of the VPC where the firewall is in use.
   */
  public vpcId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFirewallProps) {
    super(scope, id, {
      "type": CfnFirewall.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "firewallName", this);
    cdk.requireProperty(props, "firewallPolicyArn", this);
    cdk.requireProperty(props, "subnetMappings", this);
    cdk.requireProperty(props, "vpcId", this);

    this.attrEndpointIds = cdk.Token.asList(this.getAtt("EndpointIds", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrFirewallArn = cdk.Token.asString(this.getAtt("FirewallArn", cdk.ResolutionTypeHint.STRING));
    this.attrFirewallId = cdk.Token.asString(this.getAtt("FirewallId", cdk.ResolutionTypeHint.STRING));
    this.deleteProtection = props.deleteProtection;
    this.description = props.description;
    this.firewallName = props.firewallName;
    this.firewallPolicyArn = props.firewallPolicyArn;
    this.firewallPolicyChangeProtection = props.firewallPolicyChangeProtection;
    this.subnetChangeProtection = props.subnetChangeProtection;
    this.subnetMappings = props.subnetMappings;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkFirewall::Firewall", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deleteProtection": this.deleteProtection,
      "description": this.description,
      "firewallName": this.firewallName,
      "firewallPolicyArn": this.firewallPolicyArn,
      "firewallPolicyChangeProtection": this.firewallPolicyChangeProtection,
      "subnetChangeProtection": this.subnetChangeProtection,
      "subnetMappings": this.subnetMappings,
      "tags": this.tags.renderTags(),
      "vpcId": this.vpcId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFirewall.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFirewallPropsToCloudFormation(props);
  }
}

export namespace CfnFirewall {
  /**
   * The ID for a subnet that you want to associate with the firewall.
   *
   * AWS Network Firewall creates an instance of the associated firewall in each subnet that you specify, to filter traffic in the subnet's Availability Zone.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewall-subnetmapping.html
   */
  export interface SubnetMappingProperty {
    /**
     * The subnet's IP address type.
     *
     * You can't change the IP address type after you create the subnet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewall-subnetmapping.html#cfn-networkfirewall-firewall-subnetmapping-ipaddresstype
     */
    readonly ipAddressType?: string;

    /**
     * The unique identifier for the subnet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewall-subnetmapping.html#cfn-networkfirewall-firewall-subnetmapping-subnetid
     */
    readonly subnetId: string;
  }
}

/**
 * Properties for defining a `CfnFirewall`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html
 */
export interface CfnFirewallProps {
  /**
   * A flag indicating whether it is possible to delete the firewall.
   *
   * A setting of `TRUE` indicates that the firewall is protected against deletion. Use this setting to protect against accidentally deleting a firewall that is in use. When you create a firewall, the operation initializes this flag to `TRUE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-deleteprotection
   */
  readonly deleteProtection?: boolean | cdk.IResolvable;

  /**
   * A description of the firewall.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-description
   */
  readonly description?: string;

  /**
   * The descriptive name of the firewall.
   *
   * You can't change the name of a firewall after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallname
   */
  readonly firewallName: string;

  /**
   * The Amazon Resource Name (ARN) of the firewall policy.
   *
   * The relationship of firewall to firewall policy is many to one. Each firewall requires one firewall policy association, and you can use the same firewall policy for multiple firewalls.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallpolicyarn
   */
  readonly firewallPolicyArn: string;

  /**
   * A setting indicating whether the firewall is protected against a change to the firewall policy association.
   *
   * Use this setting to protect against accidentally modifying the firewall policy for a firewall that is in use. When you create a firewall, the operation initializes this setting to `TRUE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallpolicychangeprotection
   */
  readonly firewallPolicyChangeProtection?: boolean | cdk.IResolvable;

  /**
   * A setting indicating whether the firewall is protected against changes to the subnet associations.
   *
   * Use this setting to protect against accidentally modifying the subnet associations for a firewall that is in use. When you create a firewall, the operation initializes this setting to `TRUE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-subnetchangeprotection
   */
  readonly subnetChangeProtection?: boolean | cdk.IResolvable;

  /**
   * The public subnets that Network Firewall is using for the firewall.
   *
   * Each subnet must belong to a different Availability Zone.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-subnetmappings
   */
  readonly subnetMappings: Array<cdk.IResolvable | CfnFirewall.SubnetMappingProperty> | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The unique identifier of the VPC where the firewall is in use.
   *
   * You can't change the VPC of a firewall after you create the firewall.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-vpcid
   */
  readonly vpcId: string;
}

/**
 * Determine whether the given properties match those of a `SubnetMappingProperty`
 *
 * @param properties - the TypeScript properties of a `SubnetMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallSubnetMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  errors.collect(cdk.propertyValidator("subnetId", cdk.requiredValidator)(properties.subnetId));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  return errors.wrap("supplied properties not correct for \"SubnetMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallSubnetMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallSubnetMappingPropertyValidator(properties).assertSuccess();
  return {
    "IPAddressType": cdk.stringToCloudFormation(properties.ipAddressType),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId)
  };
}

// @ts-ignore TS6133
function CfnFirewallSubnetMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFirewall.SubnetMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewall.SubnetMappingProperty>();
  ret.addPropertyResult("ipAddressType", "IPAddressType", (properties.IPAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IPAddressType) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFirewallProps`
 *
 * @param properties - the TypeScript properties of a `CfnFirewallProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteProtection", cdk.validateBoolean)(properties.deleteProtection));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("firewallName", cdk.requiredValidator)(properties.firewallName));
  errors.collect(cdk.propertyValidator("firewallName", cdk.validateString)(properties.firewallName));
  errors.collect(cdk.propertyValidator("firewallPolicyArn", cdk.requiredValidator)(properties.firewallPolicyArn));
  errors.collect(cdk.propertyValidator("firewallPolicyArn", cdk.validateString)(properties.firewallPolicyArn));
  errors.collect(cdk.propertyValidator("firewallPolicyChangeProtection", cdk.validateBoolean)(properties.firewallPolicyChangeProtection));
  errors.collect(cdk.propertyValidator("subnetChangeProtection", cdk.validateBoolean)(properties.subnetChangeProtection));
  errors.collect(cdk.propertyValidator("subnetMappings", cdk.requiredValidator)(properties.subnetMappings));
  errors.collect(cdk.propertyValidator("subnetMappings", cdk.listValidator(CfnFirewallSubnetMappingPropertyValidator))(properties.subnetMappings));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnFirewallProps\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPropsValidator(properties).assertSuccess();
  return {
    "DeleteProtection": cdk.booleanToCloudFormation(properties.deleteProtection),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FirewallName": cdk.stringToCloudFormation(properties.firewallName),
    "FirewallPolicyArn": cdk.stringToCloudFormation(properties.firewallPolicyArn),
    "FirewallPolicyChangeProtection": cdk.booleanToCloudFormation(properties.firewallPolicyChangeProtection),
    "SubnetChangeProtection": cdk.booleanToCloudFormation(properties.subnetChangeProtection),
    "SubnetMappings": cdk.listMapper(convertCfnFirewallSubnetMappingPropertyToCloudFormation)(properties.subnetMappings),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnFirewallPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallProps>();
  ret.addPropertyResult("deleteProtection", "DeleteProtection", (properties.DeleteProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteProtection) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("firewallName", "FirewallName", (properties.FirewallName != null ? cfn_parse.FromCloudFormation.getString(properties.FirewallName) : undefined));
  ret.addPropertyResult("firewallPolicyArn", "FirewallPolicyArn", (properties.FirewallPolicyArn != null ? cfn_parse.FromCloudFormation.getString(properties.FirewallPolicyArn) : undefined));
  ret.addPropertyResult("firewallPolicyChangeProtection", "FirewallPolicyChangeProtection", (properties.FirewallPolicyChangeProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FirewallPolicyChangeProtection) : undefined));
  ret.addPropertyResult("subnetChangeProtection", "SubnetChangeProtection", (properties.SubnetChangeProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SubnetChangeProtection) : undefined));
  ret.addPropertyResult("subnetMappings", "SubnetMappings", (properties.SubnetMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnFirewallSubnetMappingPropertyFromCloudFormation)(properties.SubnetMappings) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `FirewallPolicy` to define the stateless and stateful network traffic filtering behavior for your `Firewall` .
 *
 * You can use one firewall policy for multiple firewalls.
 *
 * @cloudformationResource AWS::NetworkFirewall::FirewallPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html
 */
export class CfnFirewallPolicy extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkFirewall::FirewallPolicy";

  /**
   * Build a CfnFirewallPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFirewallPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFirewallPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFirewallPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `FirewallPolicy` .
   *
   * @cloudformationAttribute FirewallPolicyArn
   */
  public readonly attrFirewallPolicyArn: string;

  /**
   * The unique ID of the `FirewallPolicy` resource.
   *
   * @cloudformationAttribute FirewallPolicyId
   */
  public readonly attrFirewallPolicyId: string;

  /**
   * A description of the firewall policy.
   */
  public description?: string;

  /**
   * The traffic filtering behavior of a firewall policy, defined in a collection of stateless and stateful rule groups and other settings.
   */
  public firewallPolicy: CfnFirewallPolicy.FirewallPolicyProperty | cdk.IResolvable;

  /**
   * The descriptive name of the firewall policy.
   */
  public firewallPolicyName: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnFirewallPolicyProps) {
    super(scope, id, {
      "type": CfnFirewallPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "firewallPolicy", this);
    cdk.requireProperty(props, "firewallPolicyName", this);

    this.attrFirewallPolicyArn = cdk.Token.asString(this.getAtt("FirewallPolicyArn", cdk.ResolutionTypeHint.STRING));
    this.attrFirewallPolicyId = cdk.Token.asString(this.getAtt("FirewallPolicyId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.firewallPolicy = props.firewallPolicy;
    this.firewallPolicyName = props.firewallPolicyName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkFirewall::FirewallPolicy", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "firewallPolicy": this.firewallPolicy,
      "firewallPolicyName": this.firewallPolicyName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFirewallPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFirewallPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnFirewallPolicy {
  /**
   * The traffic filtering behavior of a firewall policy, defined in a collection of stateless and stateful rule groups and other settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html
   */
  export interface FirewallPolicyProperty {
    /**
     * Contains variables that you can use to override default Suricata settings in your firewall policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-policyvariables
     */
    readonly policyVariables?: cdk.IResolvable | CfnFirewallPolicy.PolicyVariablesProperty;

    /**
     * The default actions to take on a packet that doesn't match any stateful rules.
     *
     * The stateful default action is optional, and is only valid when using the strict rule order.
     *
     * Valid values of the stateful default action:
     *
     * - aws:drop_strict
     * - aws:drop_established
     * - aws:alert_strict
     * - aws:alert_established
     *
     * For more information, see [Strict evaluation order](https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html#suricata-strict-rule-evaluation-order.html) in the *AWS Network Firewall Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statefuldefaultactions
     */
    readonly statefulDefaultActions?: Array<string>;

    /**
     * Additional options governing how Network Firewall handles stateful rules.
     *
     * The stateful rule groups that you use in your policy must have stateful rule options settings that are compatible with these settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statefulengineoptions
     */
    readonly statefulEngineOptions?: cdk.IResolvable | CfnFirewallPolicy.StatefulEngineOptionsProperty;

    /**
     * References to the stateful rule groups that are used in the policy.
     *
     * These define the inspection criteria in stateful rules.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statefulrulegroupreferences
     */
    readonly statefulRuleGroupReferences?: Array<cdk.IResolvable | CfnFirewallPolicy.StatefulRuleGroupReferenceProperty> | cdk.IResolvable;

    /**
     * The custom action definitions that are available for use in the firewall policy's `StatelessDefaultActions` setting.
     *
     * You name each custom action that you define, and then you can use it by name in your default actions specifications.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statelesscustomactions
     */
    readonly statelessCustomActions?: Array<CfnFirewallPolicy.CustomActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The actions to take on a packet if it doesn't match any of the stateless rules in the policy.
     *
     * If you want non-matching packets to be forwarded for stateful inspection, specify `aws:forward_to_sfe` .
     *
     * You must specify one of the standard actions: `aws:pass` , `aws:drop` , or `aws:forward_to_sfe` . In addition, you can specify custom actions that are compatible with your standard section choice.
     *
     * For example, you could specify `["aws:pass"]` or you could specify `["aws:pass", “customActionName”]` . For information about compatibility, see the custom action descriptions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statelessdefaultactions
     */
    readonly statelessDefaultActions: Array<string>;

    /**
     * The actions to take on a fragmented packet if it doesn't match any of the stateless rules in the policy.
     *
     * If you want non-matching fragmented packets to be forwarded for stateful inspection, specify `aws:forward_to_sfe` .
     *
     * You must specify one of the standard actions: `aws:pass` , `aws:drop` , or `aws:forward_to_sfe` . In addition, you can specify custom actions that are compatible with your standard section choice.
     *
     * For example, you could specify `["aws:pass"]` or you could specify `["aws:pass", “customActionName”]` . For information about compatibility, see the custom action descriptions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statelessfragmentdefaultactions
     */
    readonly statelessFragmentDefaultActions: Array<string>;

    /**
     * References to the stateless rule groups that are used in the policy.
     *
     * These define the matching criteria in stateless rules.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statelessrulegroupreferences
     */
    readonly statelessRuleGroupReferences?: Array<cdk.IResolvable | CfnFirewallPolicy.StatelessRuleGroupReferenceProperty> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the TLS inspection configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-tlsinspectionconfigurationarn
     */
    readonly tlsInspectionConfigurationArn?: string;
  }

  /**
   * Identifier for a single stateless rule group, used in a firewall policy to refer to the rule group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statelessrulegroupreference.html
   */
  export interface StatelessRuleGroupReferenceProperty {
    /**
     * An integer setting that indicates the order in which to run the stateless rule groups in a single `FirewallPolicy` .
     *
     * Network Firewall applies each stateless rule group to a packet starting with the group that has the lowest priority setting. You must ensure that the priority settings are unique within each policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statelessrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statelessrulegroupreference-priority
     */
    readonly priority: number;

    /**
     * The Amazon Resource Name (ARN) of the stateless rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statelessrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statelessrulegroupreference-resourcearn
     */
    readonly resourceArn: string;
  }

  /**
   * Identifier for a single stateful rule group, used in a firewall policy to refer to a rule group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupreference.html
   */
  export interface StatefulRuleGroupReferenceProperty {
    /**
     * The action that allows the policy owner to override the behavior of the rule group within a policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statefulrulegroupreference-override
     */
    readonly override?: cdk.IResolvable | CfnFirewallPolicy.StatefulRuleGroupOverrideProperty;

    /**
     * An integer setting that indicates the order in which to run the stateful rule groups in a single `FirewallPolicy` .
     *
     * This setting only applies to firewall policies that specify the `STRICT_ORDER` rule order in the stateful engine options settings.
     *
     * Network Firewall evalutes each stateful rule group against a packet starting with the group that has the lowest priority setting. You must ensure that the priority settings are unique within each policy.
     *
     * You can change the priority settings of your rule groups at any time. To make it easier to insert rule groups later, number them so there's a wide range in between, for example use 100, 200, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statefulrulegroupreference-priority
     */
    readonly priority?: number;

    /**
     * The Amazon Resource Name (ARN) of the stateful rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statefulrulegroupreference-resourcearn
     */
    readonly resourceArn: string;
  }

  /**
   * The setting that allows the policy owner to change the behavior of the rule group within a policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupoverride.html
   */
  export interface StatefulRuleGroupOverrideProperty {
    /**
     * The action that changes the rule group from `DROP` to `ALERT` .
     *
     * This only applies to managed rule groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupoverride.html#cfn-networkfirewall-firewallpolicy-statefulrulegroupoverride-action
     */
    readonly action?: string;
  }

  /**
   * Configuration settings for the handling of the stateful rule groups in a firewall policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulengineoptions.html
   */
  export interface StatefulEngineOptionsProperty {
    /**
     * Indicates how to manage the order of stateful rule evaluation for the policy.
     *
     * `STRICT_ORDER` is the default and recommended option. With `STRICT_ORDER` , provide your rules in the order that you want them to be evaluated. You can then choose one or more default actions for packets that don't match any rules. Choose `STRICT_ORDER` to have the stateful rules engine determine the evaluation order of your rules. The default action for this rule order is `PASS` , followed by `DROP` , `REJECT` , and `ALERT` actions. Stateful rules are provided to the rule engine as Suricata compatible strings, and Suricata evaluates them based on your settings. For more information, see [Evaluation order for stateful rules](https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html) in the *AWS Network Firewall Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulengineoptions.html#cfn-networkfirewall-firewallpolicy-statefulengineoptions-ruleorder
     */
    readonly ruleOrder?: string;

    /**
     * Configures how Network Firewall processes traffic when a network connection breaks midstream.
     *
     * Network connections can break due to disruptions in external networks or within the firewall itself.
     *
     * - `DROP` - Network Firewall fails closed and drops all subsequent traffic going to the firewall. This is the default behavior.
     * - `CONTINUE` - Network Firewall continues to apply rules to the subsequent traffic without context from traffic before the break. This impacts the behavior of rules that depend on this context. For example, if you have a stateful rule to `drop http` traffic, Network Firewall won't match the traffic for this rule because the service won't have the context from session initialization defining the application layer protocol as HTTP. However, this behavior is rule dependent—a TCP-layer rule using a `flow:stateless` rule would still match, as would the `aws:drop_strict` default action.
     * - `REJECT` - Network Firewall fails closed and drops all subsequent traffic going to the firewall. Network Firewall also sends a TCP reject packet back to your client so that the client can immediately establish a new session. Network Firewall will have context about the new session and will apply rules to the subsequent traffic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulengineoptions.html#cfn-networkfirewall-firewallpolicy-statefulengineoptions-streamexceptionpolicy
     */
    readonly streamExceptionPolicy?: string;
  }

  /**
   * An optional, non-standard action to use for stateless packet handling.
   *
   * You can define this in addition to the standard action that you must specify.
   *
   * You define and name the custom actions that you want to be able to use, and then you reference them by name in your actions settings.
   *
   * You can use custom actions in the following places:
   *
   * - In an `RuleGroup.StatelessRulesAndCustomActions` . The custom actions are available for use by name inside the `StatelessRulesAndCustomActions` where you define them. You can use them for your stateless rule actions to specify what to do with a packet that matches the rule's match attributes.
   * - In an `FirewallPolicy` specification, in `StatelessCustomActions` . The custom actions are available for use inside the policy where you define them. You can use them for the policy's default stateless actions settings to specify what to do with packets that don't match any of the policy's stateless rules.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-customaction.html
   */
  export interface CustomActionProperty {
    /**
     * The custom action associated with the action name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-customaction.html#cfn-networkfirewall-firewallpolicy-customaction-actiondefinition
     */
    readonly actionDefinition: CfnFirewallPolicy.ActionDefinitionProperty | cdk.IResolvable;

    /**
     * The descriptive name of the custom action.
     *
     * You can't change the name of a custom action after you create it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-customaction.html#cfn-networkfirewall-firewallpolicy-customaction-actionname
     */
    readonly actionName: string;
  }

  /**
   * A custom action to use in stateless rule actions settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-actiondefinition.html
   */
  export interface ActionDefinitionProperty {
    /**
     * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet.
     *
     * This setting defines a CloudWatch dimension value to be published.
     *
     * You can pair this custom action with any of the standard stateless rule actions. For example, you could pair this in a rule action with the standard action that forwards the packet for stateful inspection. Then, when a packet matches the rule, Network Firewall publishes metrics for the packet and forwards it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-actiondefinition.html#cfn-networkfirewall-firewallpolicy-actiondefinition-publishmetricaction
     */
    readonly publishMetricAction?: cdk.IResolvable | CfnFirewallPolicy.PublishMetricActionProperty;
  }

  /**
   * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet.
   *
   * This setting defines a CloudWatch dimension value to be published.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-publishmetricaction.html
   */
  export interface PublishMetricActionProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-publishmetricaction.html#cfn-networkfirewall-firewallpolicy-publishmetricaction-dimensions
     */
    readonly dimensions: Array<CfnFirewallPolicy.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The value to use in an Amazon CloudWatch custom metric dimension.
   *
   * This is used in the `PublishMetrics` custom action. A CloudWatch custom metric dimension is a name/value pair that's part of the identity of a metric.
   *
   * AWS Network Firewall sets the dimension name to `CustomAction` and you provide the dimension value.
   *
   * For more information about CloudWatch custom metric dimensions, see [Publishing Custom Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html#usingDimensions) in the [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-dimension.html
   */
  export interface DimensionProperty {
    /**
     * The value to use in the custom metric dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-dimension.html#cfn-networkfirewall-firewallpolicy-dimension-value
     */
    readonly value: string;
  }

  /**
   * Contains variables that you can use to override default Suricata settings in your firewall policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-policyvariables.html
   */
  export interface PolicyVariablesProperty {
    /**
     * The IPv4 or IPv6 addresses in CIDR notation to use for the Suricata `HOME_NET` variable.
     *
     * If your firewall uses an inspection VPC, you might want to override the `HOME_NET` variable with the CIDRs of your home networks. If you don't override `HOME_NET` with your own CIDRs, Network Firewall by default uses the CIDR of your inspection VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-policyvariables.html#cfn-networkfirewall-firewallpolicy-policyvariables-rulevariables
     */
    readonly ruleVariables?: cdk.IResolvable | Record<string, CfnFirewallPolicy.IPSetProperty | cdk.IResolvable>;
  }

  /**
   * A list of IP addresses and address ranges, in CIDR notation.
   *
   * This is part of a `RuleVariables` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-ipset.html
   */
  export interface IPSetProperty {
    /**
     * The list of IP addresses and address ranges, in CIDR notation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-ipset.html#cfn-networkfirewall-firewallpolicy-ipset-definition
     */
    readonly definition?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnFirewallPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html
 */
export interface CfnFirewallPolicyProps {
  /**
   * A description of the firewall policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-description
   */
  readonly description?: string;

  /**
   * The traffic filtering behavior of a firewall policy, defined in a collection of stateless and stateful rule groups and other settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy
   */
  readonly firewallPolicy: CfnFirewallPolicy.FirewallPolicyProperty | cdk.IResolvable;

  /**
   * The descriptive name of the firewall policy.
   *
   * You can't change the name of a firewall policy after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicyname
   */
  readonly firewallPolicyName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `StatelessRuleGroupReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `StatelessRuleGroupReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyStatelessRuleGroupReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"StatelessRuleGroupReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyStatelessRuleGroupReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyStatelessRuleGroupReferencePropertyValidator(properties).assertSuccess();
  return {
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyStatelessRuleGroupReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFirewallPolicy.StatelessRuleGroupReferenceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.StatelessRuleGroupReferenceProperty>();
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatefulRuleGroupOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulRuleGroupOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyStatefulRuleGroupOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  return errors.wrap("supplied properties not correct for \"StatefulRuleGroupOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyStatefulRuleGroupOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyStatefulRuleGroupOverridePropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyStatefulRuleGroupOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFirewallPolicy.StatefulRuleGroupOverrideProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.StatefulRuleGroupOverrideProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatefulRuleGroupReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulRuleGroupReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyStatefulRuleGroupReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("override", CfnFirewallPolicyStatefulRuleGroupOverridePropertyValidator)(properties.override));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"StatefulRuleGroupReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyStatefulRuleGroupReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyStatefulRuleGroupReferencePropertyValidator(properties).assertSuccess();
  return {
    "Override": convertCfnFirewallPolicyStatefulRuleGroupOverridePropertyToCloudFormation(properties.override),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyStatefulRuleGroupReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFirewallPolicy.StatefulRuleGroupReferenceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.StatefulRuleGroupReferenceProperty>();
  ret.addPropertyResult("override", "Override", (properties.Override != null ? CfnFirewallPolicyStatefulRuleGroupOverridePropertyFromCloudFormation(properties.Override) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatefulEngineOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulEngineOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyStatefulEngineOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ruleOrder", cdk.validateString)(properties.ruleOrder));
  errors.collect(cdk.propertyValidator("streamExceptionPolicy", cdk.validateString)(properties.streamExceptionPolicy));
  return errors.wrap("supplied properties not correct for \"StatefulEngineOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyStatefulEngineOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyStatefulEngineOptionsPropertyValidator(properties).assertSuccess();
  return {
    "RuleOrder": cdk.stringToCloudFormation(properties.ruleOrder),
    "StreamExceptionPolicy": cdk.stringToCloudFormation(properties.streamExceptionPolicy)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyStatefulEngineOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFirewallPolicy.StatefulEngineOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.StatefulEngineOptionsProperty>();
  ret.addPropertyResult("ruleOrder", "RuleOrder", (properties.RuleOrder != null ? cfn_parse.FromCloudFormation.getString(properties.RuleOrder) : undefined));
  ret.addPropertyResult("streamExceptionPolicy", "StreamExceptionPolicy", (properties.StreamExceptionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.StreamExceptionPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"DimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.DimensionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.DimensionProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PublishMetricActionProperty`
 *
 * @param properties - the TypeScript properties of a `PublishMetricActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyPublishMetricActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensions", cdk.requiredValidator)(properties.dimensions));
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnFirewallPolicyDimensionPropertyValidator))(properties.dimensions));
  return errors.wrap("supplied properties not correct for \"PublishMetricActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyPublishMetricActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyPublishMetricActionPropertyValidator(properties).assertSuccess();
  return {
    "Dimensions": cdk.listMapper(convertCfnFirewallPolicyDimensionPropertyToCloudFormation)(properties.dimensions)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyPublishMetricActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFirewallPolicy.PublishMetricActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.PublishMetricActionProperty>();
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnFirewallPolicyDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("publishMetricAction", CfnFirewallPolicyPublishMetricActionPropertyValidator)(properties.publishMetricAction));
  return errors.wrap("supplied properties not correct for \"ActionDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyActionDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyActionDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "PublishMetricAction": convertCfnFirewallPolicyPublishMetricActionPropertyToCloudFormation(properties.publishMetricAction)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.ActionDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.ActionDefinitionProperty>();
  ret.addPropertyResult("publishMetricAction", "PublishMetricAction", (properties.PublishMetricAction != null ? CfnFirewallPolicyPublishMetricActionPropertyFromCloudFormation(properties.PublishMetricAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomActionProperty`
 *
 * @param properties - the TypeScript properties of a `CustomActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyCustomActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionDefinition", cdk.requiredValidator)(properties.actionDefinition));
  errors.collect(cdk.propertyValidator("actionDefinition", CfnFirewallPolicyActionDefinitionPropertyValidator)(properties.actionDefinition));
  errors.collect(cdk.propertyValidator("actionName", cdk.requiredValidator)(properties.actionName));
  errors.collect(cdk.propertyValidator("actionName", cdk.validateString)(properties.actionName));
  return errors.wrap("supplied properties not correct for \"CustomActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyCustomActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyCustomActionPropertyValidator(properties).assertSuccess();
  return {
    "ActionDefinition": convertCfnFirewallPolicyActionDefinitionPropertyToCloudFormation(properties.actionDefinition),
    "ActionName": cdk.stringToCloudFormation(properties.actionName)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyCustomActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.CustomActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.CustomActionProperty>();
  ret.addPropertyResult("actionDefinition", "ActionDefinition", (properties.ActionDefinition != null ? CfnFirewallPolicyActionDefinitionPropertyFromCloudFormation(properties.ActionDefinition) : undefined));
  ret.addPropertyResult("actionName", "ActionName", (properties.ActionName != null ? cfn_parse.FromCloudFormation.getString(properties.ActionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IPSetProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyIPSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("definition", cdk.listValidator(cdk.validateString))(properties.definition));
  return errors.wrap("supplied properties not correct for \"IPSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyIPSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyIPSetPropertyValidator(properties).assertSuccess();
  return {
    "Definition": cdk.listMapper(cdk.stringToCloudFormation)(properties.definition)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyIPSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.IPSetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.IPSetProperty>();
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Definition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PolicyVariablesProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyVariablesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyPolicyVariablesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ruleVariables", cdk.hashValidator(CfnFirewallPolicyIPSetPropertyValidator))(properties.ruleVariables));
  return errors.wrap("supplied properties not correct for \"PolicyVariablesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyPolicyVariablesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyPolicyVariablesPropertyValidator(properties).assertSuccess();
  return {
    "RuleVariables": cdk.hashMapper(convertCfnFirewallPolicyIPSetPropertyToCloudFormation)(properties.ruleVariables)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyPolicyVariablesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFirewallPolicy.PolicyVariablesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.PolicyVariablesProperty>();
  ret.addPropertyResult("ruleVariables", "RuleVariables", (properties.RuleVariables != null ? cfn_parse.FromCloudFormation.getMap(CfnFirewallPolicyIPSetPropertyFromCloudFormation)(properties.RuleVariables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirewallPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `FirewallPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyFirewallPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyVariables", CfnFirewallPolicyPolicyVariablesPropertyValidator)(properties.policyVariables));
  errors.collect(cdk.propertyValidator("statefulDefaultActions", cdk.listValidator(cdk.validateString))(properties.statefulDefaultActions));
  errors.collect(cdk.propertyValidator("statefulEngineOptions", CfnFirewallPolicyStatefulEngineOptionsPropertyValidator)(properties.statefulEngineOptions));
  errors.collect(cdk.propertyValidator("statefulRuleGroupReferences", cdk.listValidator(CfnFirewallPolicyStatefulRuleGroupReferencePropertyValidator))(properties.statefulRuleGroupReferences));
  errors.collect(cdk.propertyValidator("statelessCustomActions", cdk.listValidator(CfnFirewallPolicyCustomActionPropertyValidator))(properties.statelessCustomActions));
  errors.collect(cdk.propertyValidator("statelessDefaultActions", cdk.requiredValidator)(properties.statelessDefaultActions));
  errors.collect(cdk.propertyValidator("statelessDefaultActions", cdk.listValidator(cdk.validateString))(properties.statelessDefaultActions));
  errors.collect(cdk.propertyValidator("statelessFragmentDefaultActions", cdk.requiredValidator)(properties.statelessFragmentDefaultActions));
  errors.collect(cdk.propertyValidator("statelessFragmentDefaultActions", cdk.listValidator(cdk.validateString))(properties.statelessFragmentDefaultActions));
  errors.collect(cdk.propertyValidator("statelessRuleGroupReferences", cdk.listValidator(CfnFirewallPolicyStatelessRuleGroupReferencePropertyValidator))(properties.statelessRuleGroupReferences));
  errors.collect(cdk.propertyValidator("tlsInspectionConfigurationArn", cdk.validateString)(properties.tlsInspectionConfigurationArn));
  return errors.wrap("supplied properties not correct for \"FirewallPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyFirewallPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyFirewallPolicyPropertyValidator(properties).assertSuccess();
  return {
    "PolicyVariables": convertCfnFirewallPolicyPolicyVariablesPropertyToCloudFormation(properties.policyVariables),
    "StatefulDefaultActions": cdk.listMapper(cdk.stringToCloudFormation)(properties.statefulDefaultActions),
    "StatefulEngineOptions": convertCfnFirewallPolicyStatefulEngineOptionsPropertyToCloudFormation(properties.statefulEngineOptions),
    "StatefulRuleGroupReferences": cdk.listMapper(convertCfnFirewallPolicyStatefulRuleGroupReferencePropertyToCloudFormation)(properties.statefulRuleGroupReferences),
    "StatelessCustomActions": cdk.listMapper(convertCfnFirewallPolicyCustomActionPropertyToCloudFormation)(properties.statelessCustomActions),
    "StatelessDefaultActions": cdk.listMapper(cdk.stringToCloudFormation)(properties.statelessDefaultActions),
    "StatelessFragmentDefaultActions": cdk.listMapper(cdk.stringToCloudFormation)(properties.statelessFragmentDefaultActions),
    "StatelessRuleGroupReferences": cdk.listMapper(convertCfnFirewallPolicyStatelessRuleGroupReferencePropertyToCloudFormation)(properties.statelessRuleGroupReferences),
    "TLSInspectionConfigurationArn": cdk.stringToCloudFormation(properties.tlsInspectionConfigurationArn)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyFirewallPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.FirewallPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.FirewallPolicyProperty>();
  ret.addPropertyResult("policyVariables", "PolicyVariables", (properties.PolicyVariables != null ? CfnFirewallPolicyPolicyVariablesPropertyFromCloudFormation(properties.PolicyVariables) : undefined));
  ret.addPropertyResult("statefulDefaultActions", "StatefulDefaultActions", (properties.StatefulDefaultActions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StatefulDefaultActions) : undefined));
  ret.addPropertyResult("statefulEngineOptions", "StatefulEngineOptions", (properties.StatefulEngineOptions != null ? CfnFirewallPolicyStatefulEngineOptionsPropertyFromCloudFormation(properties.StatefulEngineOptions) : undefined));
  ret.addPropertyResult("statefulRuleGroupReferences", "StatefulRuleGroupReferences", (properties.StatefulRuleGroupReferences != null ? cfn_parse.FromCloudFormation.getArray(CfnFirewallPolicyStatefulRuleGroupReferencePropertyFromCloudFormation)(properties.StatefulRuleGroupReferences) : undefined));
  ret.addPropertyResult("statelessCustomActions", "StatelessCustomActions", (properties.StatelessCustomActions != null ? cfn_parse.FromCloudFormation.getArray(CfnFirewallPolicyCustomActionPropertyFromCloudFormation)(properties.StatelessCustomActions) : undefined));
  ret.addPropertyResult("statelessDefaultActions", "StatelessDefaultActions", (properties.StatelessDefaultActions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StatelessDefaultActions) : undefined));
  ret.addPropertyResult("statelessFragmentDefaultActions", "StatelessFragmentDefaultActions", (properties.StatelessFragmentDefaultActions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StatelessFragmentDefaultActions) : undefined));
  ret.addPropertyResult("statelessRuleGroupReferences", "StatelessRuleGroupReferences", (properties.StatelessRuleGroupReferences != null ? cfn_parse.FromCloudFormation.getArray(CfnFirewallPolicyStatelessRuleGroupReferencePropertyFromCloudFormation)(properties.StatelessRuleGroupReferences) : undefined));
  ret.addPropertyResult("tlsInspectionConfigurationArn", "TLSInspectionConfigurationArn", (properties.TLSInspectionConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.TLSInspectionConfigurationArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFirewallPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnFirewallPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFirewallPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("firewallPolicy", cdk.requiredValidator)(properties.firewallPolicy));
  errors.collect(cdk.propertyValidator("firewallPolicy", CfnFirewallPolicyFirewallPolicyPropertyValidator)(properties.firewallPolicy));
  errors.collect(cdk.propertyValidator("firewallPolicyName", cdk.requiredValidator)(properties.firewallPolicyName));
  errors.collect(cdk.propertyValidator("firewallPolicyName", cdk.validateString)(properties.firewallPolicyName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFirewallPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnFirewallPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFirewallPolicyPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FirewallPolicy": convertCfnFirewallPolicyFirewallPolicyPropertyToCloudFormation(properties.firewallPolicy),
    "FirewallPolicyName": cdk.stringToCloudFormation(properties.firewallPolicyName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFirewallPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicyProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("firewallPolicy", "FirewallPolicy", (properties.FirewallPolicy != null ? CfnFirewallPolicyFirewallPolicyPropertyFromCloudFormation(properties.FirewallPolicy) : undefined));
  ret.addPropertyResult("firewallPolicyName", "FirewallPolicyName", (properties.FirewallPolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.FirewallPolicyName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `LoggingConfiguration` to define the destinations and logging options for an `Firewall` .
 *
 * You must change the logging configuration by changing one `LogDestinationConfig` setting at a time in your `LogDestinationConfigs` .
 *
 * You can make only one of the following changes to your `LoggingConfiguration` resource:
 *
 * - Create a new log destination object by adding a single `LogDestinationConfig` array element to `LogDestinationConfigs` .
 * - Delete a log destination object by removing a single `LogDestinationConfig` array element from `LogDestinationConfigs` .
 * - Change the `LogDestination` setting in a single `LogDestinationConfig` array element.
 *
 * You can't change the `LogDestinationType` or `LogType` in a `LogDestinationConfig` . To change these settings, delete the existing `LogDestinationConfig` object and create a new one, in two separate modifications.
 *
 * @cloudformationResource AWS::NetworkFirewall::LoggingConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html
 */
export class CfnLoggingConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkFirewall::LoggingConfiguration";

  /**
   * Build a CfnLoggingConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoggingConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoggingConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLoggingConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `Firewall` that the logging configuration is associated with.
   */
  public firewallArn: string;

  /**
   * The name of the firewall that the logging configuration is associated with.
   */
  public firewallName?: string;

  /**
   * Defines how AWS Network Firewall performs logging for a `Firewall` .
   */
  public loggingConfiguration: cdk.IResolvable | CfnLoggingConfiguration.LoggingConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoggingConfigurationProps) {
    super(scope, id, {
      "type": CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "firewallArn", this);
    cdk.requireProperty(props, "loggingConfiguration", this);

    this.firewallArn = props.firewallArn;
    this.firewallName = props.firewallName;
    this.loggingConfiguration = props.loggingConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "firewallArn": this.firewallArn,
      "firewallName": this.firewallName,
      "loggingConfiguration": this.loggingConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoggingConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnLoggingConfiguration {
  /**
   * Defines how AWS Network Firewall performs logging for a `Firewall` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-loggingconfiguration.html
   */
  export interface LoggingConfigurationProperty {
    /**
     * Defines the logging destinations for the logs for a firewall.
     *
     * Network Firewall generates logs for stateful rule groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-loggingconfiguration-logdestinationconfigs
     */
    readonly logDestinationConfigs: Array<cdk.IResolvable | CfnLoggingConfiguration.LogDestinationConfigProperty> | cdk.IResolvable;
  }

  /**
   * Defines where AWS Network Firewall sends logs for the firewall for one log type.
   *
   * This is used in `LoggingConfiguration` . You can send each type of log to an Amazon S3 bucket, a CloudWatch log group, or a Kinesis Data Firehose delivery stream.
   *
   * Network Firewall generates logs for stateful rule groups. You can save alert and flow log types. The stateful rules engine records flow logs for all network traffic that it receives. It records alert logs for traffic that matches stateful rules that have the rule action set to `DROP` or `ALERT` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-logdestinationconfig.html
   */
  export interface LogDestinationConfigProperty {
    /**
     * The named location for the logs, provided in a key:value mapping that is specific to the chosen destination type.
     *
     * - For an Amazon S3 bucket, provide the name of the bucket, with key `bucketName` , and optionally provide a prefix, with key `prefix` . The following example specifies an Amazon S3 bucket named `DOC-EXAMPLE-BUCKET` and the prefix `alerts` :
     *
     * `"LogDestination": { "bucketName": "DOC-EXAMPLE-BUCKET", "prefix": "alerts" }`
     * - For a CloudWatch log group, provide the name of the CloudWatch log group, with key `logGroup` . The following example specifies a log group named `alert-log-group` :
     *
     * `"LogDestination": { "logGroup": "alert-log-group" }`
     * - For a Kinesis Data Firehose delivery stream, provide the name of the delivery stream, with key `deliveryStream` . The following example specifies a delivery stream named `alert-delivery-stream` :
     *
     * `"LogDestination": { "deliveryStream": "alert-delivery-stream" }`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-logdestinationconfig.html#cfn-networkfirewall-loggingconfiguration-logdestinationconfig-logdestination
     */
    readonly logDestination: cdk.IResolvable | Record<string, string>;

    /**
     * The type of storage destination to send these logs to.
     *
     * You can send logs to an Amazon S3 bucket, a CloudWatch log group, or a Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-logdestinationconfig.html#cfn-networkfirewall-loggingconfiguration-logdestinationconfig-logdestinationtype
     */
    readonly logDestinationType: string;

    /**
     * The type of log to send.
     *
     * Alert logs report traffic that matches a stateful rule with an action setting that sends an alert log message. Flow logs are standard network traffic flow logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-logdestinationconfig.html#cfn-networkfirewall-loggingconfiguration-logdestinationconfig-logtype
     */
    readonly logType: string;
  }
}

/**
 * Properties for defining a `CfnLoggingConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html
 */
export interface CfnLoggingConfigurationProps {
  /**
   * The Amazon Resource Name (ARN) of the `Firewall` that the logging configuration is associated with.
   *
   * You can't change the firewall specification after you create the logging configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-firewallarn
   */
  readonly firewallArn: string;

  /**
   * The name of the firewall that the logging configuration is associated with.
   *
   * You can't change the firewall specification after you create the logging configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-firewallname
   */
  readonly firewallName?: string;

  /**
   * Defines how AWS Network Firewall performs logging for a `Firewall` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-loggingconfiguration
   */
  readonly loggingConfiguration: cdk.IResolvable | CfnLoggingConfiguration.LoggingConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `LogDestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LogDestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationLogDestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logDestination", cdk.requiredValidator)(properties.logDestination));
  errors.collect(cdk.propertyValidator("logDestination", cdk.hashValidator(cdk.validateString))(properties.logDestination));
  errors.collect(cdk.propertyValidator("logDestinationType", cdk.requiredValidator)(properties.logDestinationType));
  errors.collect(cdk.propertyValidator("logDestinationType", cdk.validateString)(properties.logDestinationType));
  errors.collect(cdk.propertyValidator("logType", cdk.requiredValidator)(properties.logType));
  errors.collect(cdk.propertyValidator("logType", cdk.validateString)(properties.logType));
  return errors.wrap("supplied properties not correct for \"LogDestinationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationLogDestinationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationLogDestinationConfigPropertyValidator(properties).assertSuccess();
  return {
    "LogDestination": cdk.hashMapper(cdk.stringToCloudFormation)(properties.logDestination),
    "LogDestinationType": cdk.stringToCloudFormation(properties.logDestinationType),
    "LogType": cdk.stringToCloudFormation(properties.logType)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationLogDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggingConfiguration.LogDestinationConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.LogDestinationConfigProperty>();
  ret.addPropertyResult("logDestination", "LogDestination", (properties.LogDestination != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.LogDestination) : undefined));
  ret.addPropertyResult("logDestinationType", "LogDestinationType", (properties.LogDestinationType != null ? cfn_parse.FromCloudFormation.getString(properties.LogDestinationType) : undefined));
  ret.addPropertyResult("logType", "LogType", (properties.LogType != null ? cfn_parse.FromCloudFormation.getString(properties.LogType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationLoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logDestinationConfigs", cdk.requiredValidator)(properties.logDestinationConfigs));
  errors.collect(cdk.propertyValidator("logDestinationConfigs", cdk.listValidator(CfnLoggingConfigurationLogDestinationConfigPropertyValidator))(properties.logDestinationConfigs));
  return errors.wrap("supplied properties not correct for \"LoggingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationLoggingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationLoggingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogDestinationConfigs": cdk.listMapper(convertCfnLoggingConfigurationLogDestinationConfigPropertyToCloudFormation)(properties.logDestinationConfigs)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggingConfiguration.LoggingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.LoggingConfigurationProperty>();
  ret.addPropertyResult("logDestinationConfigs", "LogDestinationConfigs", (properties.LogDestinationConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnLoggingConfigurationLogDestinationConfigPropertyFromCloudFormation)(properties.LogDestinationConfigs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLoggingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoggingConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("firewallArn", cdk.requiredValidator)(properties.firewallArn));
  errors.collect(cdk.propertyValidator("firewallArn", cdk.validateString)(properties.firewallArn));
  errors.collect(cdk.propertyValidator("firewallName", cdk.validateString)(properties.firewallName));
  errors.collect(cdk.propertyValidator("loggingConfiguration", cdk.requiredValidator)(properties.loggingConfiguration));
  errors.collect(cdk.propertyValidator("loggingConfiguration", CfnLoggingConfigurationLoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnLoggingConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationPropsValidator(properties).assertSuccess();
  return {
    "FirewallArn": cdk.stringToCloudFormation(properties.firewallArn),
    "FirewallName": cdk.stringToCloudFormation(properties.firewallName),
    "LoggingConfiguration": convertCfnLoggingConfigurationLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfigurationProps>();
  ret.addPropertyResult("firewallArn", "FirewallArn", (properties.FirewallArn != null ? cfn_parse.FromCloudFormation.getString(properties.FirewallArn) : undefined));
  ret.addPropertyResult("firewallName", "FirewallName", (properties.FirewallName != null ? cfn_parse.FromCloudFormation.getString(properties.FirewallName) : undefined));
  ret.addPropertyResult("loggingConfiguration", "LoggingConfiguration", (properties.LoggingConfiguration != null ? CfnLoggingConfigurationLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `RuleGroup` to define a reusable collection of stateless or stateful network traffic filtering rules.
 *
 * You use rule groups in an `FirewallPolicy` to specify the filtering behavior of an `Firewall` .
 *
 * @cloudformationResource AWS::NetworkFirewall::RuleGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html
 */
export class CfnRuleGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkFirewall::RuleGroup";

  /**
   * Build a CfnRuleGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRuleGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRuleGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRuleGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `RuleGroup` .
   *
   * @cloudformationAttribute RuleGroupArn
   */
  public readonly attrRuleGroupArn: string;

  /**
   * The unique ID of the `RuleGroup` resource.
   *
   * @cloudformationAttribute RuleGroupId
   */
  public readonly attrRuleGroupId: string;

  /**
   * The maximum operating resources that this rule group can use.
   */
  public capacity: number;

  /**
   * A description of the rule group.
   */
  public description?: string;

  /**
   * An object that defines the rule group rules.
   */
  public ruleGroup?: cdk.IResolvable | CfnRuleGroup.RuleGroupProperty;

  /**
   * The descriptive name of the rule group.
   */
  public ruleGroupName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Indicates whether the rule group is stateless or stateful.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRuleGroupProps) {
    super(scope, id, {
      "type": CfnRuleGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "capacity", this);
    cdk.requireProperty(props, "ruleGroupName", this);
    cdk.requireProperty(props, "type", this);

    this.attrRuleGroupArn = cdk.Token.asString(this.getAtt("RuleGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrRuleGroupId = cdk.Token.asString(this.getAtt("RuleGroupId", cdk.ResolutionTypeHint.STRING));
    this.capacity = props.capacity;
    this.description = props.description;
    this.ruleGroup = props.ruleGroup;
    this.ruleGroupName = props.ruleGroupName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkFirewall::RuleGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capacity": this.capacity,
      "description": this.description,
      "ruleGroup": this.ruleGroup,
      "ruleGroupName": this.ruleGroupName,
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRuleGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRuleGroupPropsToCloudFormation(props);
  }
}

export namespace CfnRuleGroup {
  /**
   * The object that defines the rules in a rule group.
   *
   * AWS Network Firewall uses a rule group to inspect and control network traffic. You define stateless rule groups to inspect individual packets and you define stateful rule groups to inspect packets in the context of their traffic flow.
   *
   * To use a rule group, you include it by reference in an Network Firewall firewall policy, then you use the policy in a firewall. You can reference a rule group from more than one firewall policy, and you can use a firewall policy in more than one firewall.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html
   */
  export interface RuleGroupProperty {
    /**
     * The reference sets for the stateful rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup-referencesets
     */
    readonly referenceSets?: cdk.IResolvable | CfnRuleGroup.ReferenceSetsProperty;

    /**
     * The stateful rules or stateless rules for the rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup-rulessource
     */
    readonly rulesSource: cdk.IResolvable | CfnRuleGroup.RulesSourceProperty;

    /**
     * Settings that are available for use in the rules in the rule group.
     *
     * You can only use these for stateful rule groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup-rulevariables
     */
    readonly ruleVariables?: cdk.IResolvable | CfnRuleGroup.RuleVariablesProperty;

    /**
     * Additional options governing how Network Firewall handles stateful rules.
     *
     * The policies where you use your stateful rule group must have stateful rule options settings that are compatible with these settings. Some limitations apply; for more information, see [Strict evaluation order](https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-limitations-caveats.html) in the *AWS Network Firewall Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup-statefulruleoptions
     */
    readonly statefulRuleOptions?: cdk.IResolvable | CfnRuleGroup.StatefulRuleOptionsProperty;
  }

  /**
   * Additional options governing how Network Firewall handles the rule group.
   *
   * You can only use these for stateful rule groups.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulruleoptions.html
   */
  export interface StatefulRuleOptionsProperty {
    /**
     * Indicates how to manage the order of the rule evaluation for the rule group.
     *
     * `DEFAULT_ACTION_ORDER` is the default behavior. Stateful rules are provided to the rule engine as Suricata compatible strings, and Suricata evaluates them based on certain settings. For more information, see [Evaluation order for stateful rules](https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html) in the *AWS Network Firewall Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulruleoptions.html#cfn-networkfirewall-rulegroup-statefulruleoptions-ruleorder
     */
    readonly ruleOrder?: string;
  }

  /**
   * Configures the `ReferenceSets` for a stateful rule group.
   *
   * For more information, see the [Using IP set references in Suricata compatible rule groups](https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-groups-ip-set-references.html) in the *Network Firewall User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-referencesets.html
   */
  export interface ReferenceSetsProperty {
    /**
     * The IP set references to use in the stateful rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-referencesets.html#cfn-networkfirewall-rulegroup-referencesets-ipsetreferences
     */
    readonly ipSetReferences?: cdk.IResolvable | Record<string, CfnRuleGroup.IPSetReferenceProperty | cdk.IResolvable>;
  }

  /**
   * Configures one or more `IPSetReferences` for a Suricata-compatible rule group.
   *
   * An IP set reference is a rule variable that references a resource that you create and manage in another AWS service, such as an Amazon VPC prefix list. Network Firewall IP set references enable you to dynamically update the contents of your rules. When you create, update, or delete the IP set you are referencing in your rule, Network Firewall automatically updates the rule's content with the changes. For more information about IP set references in Network Firewall , see [Using IP set references](https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-groups-ip-set-references.html) in the *Network Firewall Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ipsetreference.html
   */
  export interface IPSetReferenceProperty {
    /**
     * The Amazon Resource Name (ARN) of the resource to include in the `RuleGroup.IPSetReference` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ipsetreference.html#cfn-networkfirewall-rulegroup-ipsetreference-referencearn
     */
    readonly referenceArn?: string;
  }

  /**
   * The stateless or stateful rules definitions for use in a single rule group.
   *
   * Each rule group requires a single `RulesSource` . You can use an instance of this for either stateless rules or stateful rules.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html
   */
  export interface RulesSourceProperty {
    /**
     * Stateful inspection criteria for a domain list rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html#cfn-networkfirewall-rulegroup-rulessource-rulessourcelist
     */
    readonly rulesSourceList?: cdk.IResolvable | CfnRuleGroup.RulesSourceListProperty;

    /**
     * Stateful inspection criteria, provided in Suricata compatible rules.
     *
     * Suricata is an open-source threat detection framework that includes a standard rule-based language for network traffic inspection.
     *
     * These rules contain the inspection criteria and the action to take for traffic that matches the criteria, so this type of rule group doesn't have a separate action setting.
     *
     * > You can't use the `priority` keyword if the `RuleOrder` option in `StatefulRuleOptions` is set to `STRICT_ORDER` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html#cfn-networkfirewall-rulegroup-rulessource-rulesstring
     */
    readonly rulesString?: string;

    /**
     * An array of individual stateful rules inspection criteria to be used together in a stateful rule group.
     *
     * Use this option to specify simple Suricata rules with protocol, source and destination, ports, direction, and rule options. For information about the Suricata `Rules` format, see [Rules Format](https://docs.aws.amazon.com/https://suricata.readthedocs.io/en/suricata-6.0.9/rules/intro.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html#cfn-networkfirewall-rulegroup-rulessource-statefulrules
     */
    readonly statefulRules?: Array<cdk.IResolvable | CfnRuleGroup.StatefulRuleProperty> | cdk.IResolvable;

    /**
     * Stateless inspection criteria to be used in a stateless rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html#cfn-networkfirewall-rulegroup-rulessource-statelessrulesandcustomactions
     */
    readonly statelessRulesAndCustomActions?: cdk.IResolvable | CfnRuleGroup.StatelessRulesAndCustomActionsProperty;
  }

  /**
   * Stateless inspection criteria.
   *
   * Each stateless rule group uses exactly one of these data types to define its stateless rules.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrulesandcustomactions.html
   */
  export interface StatelessRulesAndCustomActionsProperty {
    /**
     * Defines an array of individual custom action definitions that are available for use by the stateless rules in this `StatelessRulesAndCustomActions` specification.
     *
     * You name each custom action that you define, and then you can use it by name in your stateless rule `RuleGroup.RuleDefinition` `Actions` specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrulesandcustomactions.html#cfn-networkfirewall-rulegroup-statelessrulesandcustomactions-customactions
     */
    readonly customActions?: Array<CfnRuleGroup.CustomActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Defines the set of stateless rules for use in a stateless rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrulesandcustomactions.html#cfn-networkfirewall-rulegroup-statelessrulesandcustomactions-statelessrules
     */
    readonly statelessRules: Array<cdk.IResolvable | CfnRuleGroup.StatelessRuleProperty> | cdk.IResolvable;
  }

  /**
   * A single stateless rule.
   *
   * This is used in `RuleGroup.StatelessRulesAndCustomActions` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrule.html
   */
  export interface StatelessRuleProperty {
    /**
     * Indicates the order in which to run this rule relative to all of the rules that are defined for a stateless rule group.
     *
     * Network Firewall evaluates the rules in a rule group starting with the lowest priority setting. You must ensure that the priority settings are unique for the rule group.
     *
     * Each stateless rule group uses exactly one `StatelessRulesAndCustomActions` object, and each `StatelessRulesAndCustomActions` contains exactly one `StatelessRules` object. To ensure unique priority settings for your rule groups, set unique priorities for the stateless rules that you define inside any single `StatelessRules` object.
     *
     * You can change the priority settings of your rules at any time. To make it easier to insert rules later, number them so there's a wide range in between, for example use 100, 200, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrule.html#cfn-networkfirewall-rulegroup-statelessrule-priority
     */
    readonly priority: number;

    /**
     * Defines the stateless 5-tuple packet inspection criteria and the action to take on a packet that matches the criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrule.html#cfn-networkfirewall-rulegroup-statelessrule-ruledefinition
     */
    readonly ruleDefinition: cdk.IResolvable | CfnRuleGroup.RuleDefinitionProperty;
  }

  /**
   * The inspection criteria and action for a single stateless rule.
   *
   * AWS Network Firewall inspects each packet for the specified matching criteria. When a packet matches the criteria, Network Firewall performs the rule's actions on the packet.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruledefinition.html
   */
  export interface RuleDefinitionProperty {
    /**
     * The actions to take on a packet that matches one of the stateless rule definition's match attributes.
     *
     * You must specify a standard action and you can add custom actions.
     *
     * > Network Firewall only forwards a packet for stateful rule inspection if you specify `aws:forward_to_sfe` for a rule that the packet matches, or if the packet doesn't match any stateless rule and you specify `aws:forward_to_sfe` for the `StatelessDefaultActions` setting for the `FirewallPolicy` .
     *
     * For every rule, you must specify exactly one of the following standard actions.
     *
     * - *aws:pass* - Discontinues all inspection of the packet and permits it to go to its intended destination.
     * - *aws:drop* - Discontinues all inspection of the packet and blocks it from going to its intended destination.
     * - *aws:forward_to_sfe* - Discontinues stateless inspection of the packet and forwards it to the stateful rule engine for inspection.
     *
     * Additionally, you can specify a custom action. To do this, you define a custom action by name and type, then provide the name you've assigned to the action in this `Actions` setting.
     *
     * To provide more than one action in this setting, separate the settings with a comma. For example, if you have a publish metrics custom action that you've named `MyMetricsAction` , then you could specify the standard action `aws:pass` combined with the custom action using `[“aws:pass”, “MyMetricsAction”]` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruledefinition.html#cfn-networkfirewall-rulegroup-ruledefinition-actions
     */
    readonly actions: Array<string>;

    /**
     * Criteria for Network Firewall to use to inspect an individual packet in stateless rule inspection.
     *
     * Each match attributes set can include one or more items such as IP address, CIDR range, port number, protocol, and TCP flags.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruledefinition.html#cfn-networkfirewall-rulegroup-ruledefinition-matchattributes
     */
    readonly matchAttributes: cdk.IResolvable | CfnRuleGroup.MatchAttributesProperty;
  }

  /**
   * Criteria for Network Firewall to use to inspect an individual packet in stateless rule inspection.
   *
   * Each match attributes set can include one or more items such as IP address, CIDR range, port number, protocol, and TCP flags.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html
   */
  export interface MatchAttributesProperty {
    /**
     * The destination ports to inspect for.
     *
     * If not specified, this matches with any destination port. This setting is only used for protocols 6 (TCP) and 17 (UDP).
     *
     * You can specify individual ports, for example `1994` and you can specify port ranges, for example `1990:1994` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-destinationports
     */
    readonly destinationPorts?: Array<cdk.IResolvable | CfnRuleGroup.PortRangeProperty> | cdk.IResolvable;

    /**
     * The destination IP addresses and address ranges to inspect for, in CIDR notation.
     *
     * If not specified, this matches with any destination address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-destinations
     */
    readonly destinations?: Array<CfnRuleGroup.AddressProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The protocols to inspect for, specified using each protocol's assigned internet protocol number (IANA).
     *
     * If not specified, this matches with any protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-protocols
     */
    readonly protocols?: Array<number> | cdk.IResolvable;

    /**
     * The source ports to inspect for.
     *
     * If not specified, this matches with any source port. This setting is only used for protocols 6 (TCP) and 17 (UDP).
     *
     * You can specify individual ports, for example `1994` and you can specify port ranges, for example `1990:1994` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-sourceports
     */
    readonly sourcePorts?: Array<cdk.IResolvable | CfnRuleGroup.PortRangeProperty> | cdk.IResolvable;

    /**
     * The source IP addresses and address ranges to inspect for, in CIDR notation.
     *
     * If not specified, this matches with any source address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-sources
     */
    readonly sources?: Array<CfnRuleGroup.AddressProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The TCP flags and masks to inspect for.
     *
     * If not specified, this matches with any settings. This setting is only used for protocol 6 (TCP).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-tcpflags
     */
    readonly tcpFlags?: Array<cdk.IResolvable | CfnRuleGroup.TCPFlagFieldProperty> | cdk.IResolvable;
  }

  /**
   * TCP flags and masks to inspect packets for. This is used in the `RuleGroup.MatchAttributes` specification.
   *
   * For example:
   *
   * `"TCPFlags": [ { "Flags": [ "ECE", "SYN" ], "Masks": [ "SYN", "ECE" ] } ]`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-tcpflagfield.html
   */
  export interface TCPFlagFieldProperty {
    /**
     * Used in conjunction with the `Masks` setting to define the flags that must be set and flags that must not be set in order for the packet to match.
     *
     * This setting can only specify values that are also specified in the `Masks` setting.
     *
     * For the flags that are specified in the masks setting, the following must be true for the packet to match:
     *
     * - The ones that are set in this flags setting must be set in the packet.
     * - The ones that are not set in this flags setting must also not be set in the packet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-tcpflagfield.html#cfn-networkfirewall-rulegroup-tcpflagfield-flags
     */
    readonly flags: Array<string>;

    /**
     * The set of flags to consider in the inspection.
     *
     * To inspect all flags in the valid values list, leave this with no setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-tcpflagfield.html#cfn-networkfirewall-rulegroup-tcpflagfield-masks
     */
    readonly masks?: Array<string>;
  }

  /**
   * A single port range specification.
   *
   * This is used for source and destination port ranges in the stateless `RuleGroup.MatchAttributes` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portrange.html
   */
  export interface PortRangeProperty {
    /**
     * The lower limit of the port range.
     *
     * This must be less than or equal to the `ToPort` specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portrange.html#cfn-networkfirewall-rulegroup-portrange-fromport
     */
    readonly fromPort: number;

    /**
     * The upper limit of the port range.
     *
     * This must be greater than or equal to the `FromPort` specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portrange.html#cfn-networkfirewall-rulegroup-portrange-toport
     */
    readonly toPort: number;
  }

  /**
   * A single IP address specification.
   *
   * This is used in the `RuleGroup.MatchAttributes` source and destination specifications.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-address.html
   */
  export interface AddressProperty {
    /**
     * Specify an IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
     *
     * Network Firewall supports all address ranges for IPv4 and IPv6.
     *
     * Examples:
     *
     * - To configure Network Firewall to inspect for the IP address 192.0.2.44, specify `192.0.2.44/32` .
     * - To configure Network Firewall to inspect for IP addresses from 192.0.2.0 to 192.0.2.255, specify `192.0.2.0/24` .
     * - To configure Network Firewall to inspect for the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify `1111:0000:0000:0000:0000:0000:0000:0111/128` .
     * - To configure Network Firewall to inspect for IP addresses from 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify `1111:0000:0000:0000:0000:0000:0000:0000/64` .
     *
     * For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-address.html#cfn-networkfirewall-rulegroup-address-addressdefinition
     */
    readonly addressDefinition: string;
  }

  /**
   * An optional, non-standard action to use for stateless packet handling.
   *
   * You can define this in addition to the standard action that you must specify.
   *
   * You define and name the custom actions that you want to be able to use, and then you reference them by name in your actions settings.
   *
   * You can use custom actions in the following places:
   *
   * - In an `RuleGroup.StatelessRulesAndCustomActions` . The custom actions are available for use by name inside the `StatelessRulesAndCustomActions` where you define them. You can use them for your stateless rule actions to specify what to do with a packet that matches the rule's match attributes.
   * - In an `FirewallPolicy` specification, in `StatelessCustomActions` . The custom actions are available for use inside the policy where you define them. You can use them for the policy's default stateless actions settings to specify what to do with packets that don't match any of the policy's stateless rules.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-customaction.html
   */
  export interface CustomActionProperty {
    /**
     * The custom action associated with the action name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-customaction.html#cfn-networkfirewall-rulegroup-customaction-actiondefinition
     */
    readonly actionDefinition: CfnRuleGroup.ActionDefinitionProperty | cdk.IResolvable;

    /**
     * The descriptive name of the custom action.
     *
     * You can't change the name of a custom action after you create it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-customaction.html#cfn-networkfirewall-rulegroup-customaction-actionname
     */
    readonly actionName: string;
  }

  /**
   * A custom action to use in stateless rule actions settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-actiondefinition.html
   */
  export interface ActionDefinitionProperty {
    /**
     * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet.
     *
     * This setting defines a CloudWatch dimension value to be published.
     *
     * You can pair this custom action with any of the standard stateless rule actions. For example, you could pair this in a rule action with the standard action that forwards the packet for stateful inspection. Then, when a packet matches the rule, Network Firewall publishes metrics for the packet and forwards it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-actiondefinition.html#cfn-networkfirewall-rulegroup-actiondefinition-publishmetricaction
     */
    readonly publishMetricAction?: cdk.IResolvable | CfnRuleGroup.PublishMetricActionProperty;
  }

  /**
   * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet.
   *
   * This setting defines a CloudWatch dimension value to be published.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-publishmetricaction.html
   */
  export interface PublishMetricActionProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-publishmetricaction.html#cfn-networkfirewall-rulegroup-publishmetricaction-dimensions
     */
    readonly dimensions: Array<CfnRuleGroup.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The value to use in an Amazon CloudWatch custom metric dimension.
   *
   * This is used in the `PublishMetrics` custom action. A CloudWatch custom metric dimension is a name/value pair that's part of the identity of a metric.
   *
   * AWS Network Firewall sets the dimension name to `CustomAction` and you provide the dimension value.
   *
   * For more information about CloudWatch custom metric dimensions, see [Publishing Custom Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html#usingDimensions) in the [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-dimension.html
   */
  export interface DimensionProperty {
    /**
     * The value to use in the custom metric dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-dimension.html#cfn-networkfirewall-rulegroup-dimension-value
     */
    readonly value: string;
  }

  /**
   * A single Suricata rules specification, for use in a stateful rule group.
   *
   * Use this option to specify a simple Suricata rule with protocol, source and destination, ports, direction, and rule options. For information about the Suricata `Rules` format, see [Rules Format](https://docs.aws.amazon.com/https://suricata.readthedocs.io/en/suricata-6.0.9/rules/intro.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulrule.html
   */
  export interface StatefulRuleProperty {
    /**
     * Defines what Network Firewall should do with the packets in a traffic flow when the flow matches the stateful rule criteria.
     *
     * For all actions, Network Firewall performs the specified action and discontinues stateful inspection of the traffic flow.
     *
     * The actions for a stateful rule are defined as follows:
     *
     * - *PASS* - Permits the packets to go to the intended destination.
     * - *DROP* - Blocks the packets from going to the intended destination and sends an alert log message, if alert logging is configured in the `Firewall` `LoggingConfiguration` .
     * - *REJECT* - Drops traffic that matches the conditions of the stateful rule and sends a TCP reset packet back to sender of the packet. A TCP reset packet is a packet with no payload and a `RST` bit contained in the TCP header flags. `REJECT` is available only for TCP traffic.
     * - *ALERT* - Permits the packets to go to the intended destination and sends an alert log message, if alert logging is configured in the `Firewall` `LoggingConfiguration` .
     *
     * You can use this action to test a rule that you intend to use to drop traffic. You can enable the rule with `ALERT` action, verify in the logs that the rule is filtering as you want, then change the action to `DROP` .
     * - *REJECT* - Drops TCP traffic that matches the conditions of the stateful rule, and sends a TCP reset packet back to sender of the packet. A TCP reset packet is a packet with no payload and a `RST` bit contained in the TCP header flags. Also sends an alert log mesage if alert logging is configured in the `Firewall` `LoggingConfiguration` .
     *
     * `REJECT` isn't currently available for use with IMAP and FTP protocols.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulrule.html#cfn-networkfirewall-rulegroup-statefulrule-action
     */
    readonly action: string;

    /**
     * The stateful inspection criteria for this rule, used to inspect traffic flows.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulrule.html#cfn-networkfirewall-rulegroup-statefulrule-header
     */
    readonly header: CfnRuleGroup.HeaderProperty | cdk.IResolvable;

    /**
     * Additional settings for a stateful rule, provided as keywords and settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulrule.html#cfn-networkfirewall-rulegroup-statefulrule-ruleoptions
     */
    readonly ruleOptions: Array<cdk.IResolvable | CfnRuleGroup.RuleOptionProperty> | cdk.IResolvable;
  }

  /**
   * The 5-tuple criteria for AWS Network Firewall to use to inspect packet headers in stateful traffic flow inspection.
   *
   * Traffic flows that match the criteria are a match for the corresponding stateful rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html
   */
  export interface HeaderProperty {
    /**
     * The destination IP address or address range to inspect for, in CIDR notation.
     *
     * To match with any address, specify `ANY` .
     *
     * Specify an IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation. Network Firewall supports all address ranges for IPv4 and IPv6.
     *
     * Examples:
     *
     * - To configure Network Firewall to inspect for the IP address 192.0.2.44, specify `192.0.2.44/32` .
     * - To configure Network Firewall to inspect for IP addresses from 192.0.2.0 to 192.0.2.255, specify `192.0.2.0/24` .
     * - To configure Network Firewall to inspect for the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify `1111:0000:0000:0000:0000:0000:0000:0111/128` .
     * - To configure Network Firewall to inspect for IP addresses from 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify `1111:0000:0000:0000:0000:0000:0000:0000/64` .
     *
     * For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-destination
     */
    readonly destination: string;

    /**
     * The destination port to inspect for.
     *
     * You can specify an individual port, for example `1994` and you can specify a port range, for example `1990:1994` . To match with any port, specify `ANY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-destinationport
     */
    readonly destinationPort: string;

    /**
     * The direction of traffic flow to inspect.
     *
     * If set to `ANY` , the inspection matches bidirectional traffic, both from the source to the destination and from the destination to the source. If set to `FORWARD` , the inspection only matches traffic going from the source to the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-direction
     */
    readonly direction: string;

    /**
     * The protocol to inspect for.
     *
     * To specify all, you can use `IP` , because all traffic on AWS and on the internet is IP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-protocol
     */
    readonly protocol: string;

    /**
     * The source IP address or address range to inspect for, in CIDR notation.
     *
     * To match with any address, specify `ANY` .
     *
     * Specify an IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation. Network Firewall supports all address ranges for IPv4 and IPv6.
     *
     * Examples:
     *
     * - To configure Network Firewall to inspect for the IP address 192.0.2.44, specify `192.0.2.44/32` .
     * - To configure Network Firewall to inspect for IP addresses from 192.0.2.0 to 192.0.2.255, specify `192.0.2.0/24` .
     * - To configure Network Firewall to inspect for the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify `1111:0000:0000:0000:0000:0000:0000:0111/128` .
     * - To configure Network Firewall to inspect for IP addresses from 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify `1111:0000:0000:0000:0000:0000:0000:0000/64` .
     *
     * For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-source
     */
    readonly source: string;

    /**
     * The source port to inspect for.
     *
     * You can specify an individual port, for example `1994` and you can specify a port range, for example `1990:1994` . To match with any port, specify `ANY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-sourceport
     */
    readonly sourcePort: string;
  }

  /**
   * Additional settings for a stateful rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruleoption.html
   */
  export interface RuleOptionProperty {
    /**
     * The Suricata rule option keywords.
     *
     * For Network Firewall , the keyword signature ID (sid) is required in the format `sid: 112233` . The sid must be unique within the rule group. For information about Suricata rule option keywords, see [Rule options](https://docs.aws.amazon.com/https://suricata.readthedocs.io/en/suricata-6.0.9/rules/intro.html#rule-options) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruleoption.html#cfn-networkfirewall-rulegroup-ruleoption-keyword
     */
    readonly keyword: string;

    /**
     * The Suricata rule option settings.
     *
     * Settings have zero or more values, and the number of possible settings and required settings depends on the keyword. The format for Settings is `number` . For information about Suricata rule option settings, see [Rule options](https://docs.aws.amazon.com/https://suricata.readthedocs.io/en/suricata-6.0.9/rules/intro.html#rule-options) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruleoption.html#cfn-networkfirewall-rulegroup-ruleoption-settings
     */
    readonly settings?: Array<string>;
  }

  /**
   * Stateful inspection criteria for a domain list rule group.
   *
   * For HTTPS traffic, domain filtering is SNI-based. It uses the server name indicator extension of the TLS handshake.
   *
   * By default, Network Firewall domain list inspection only includes traffic coming from the VPC where you deploy the firewall. To inspect traffic from IP addresses outside of the deployment VPC, you set the `HOME_NET` rule variable to include the CIDR range of the deployment VPC plus the other CIDR ranges. For more information, see `RuleGroup.RuleVariables` in this guide and [Stateful domain list rule groups in AWS Network Firewall](https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-domain-names.html) in the *Network Firewall Developer Guide*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessourcelist.html
   */
  export interface RulesSourceListProperty {
    /**
     * Whether you want to allow or deny access to the domains in your target list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessourcelist.html#cfn-networkfirewall-rulegroup-rulessourcelist-generatedrulestype
     */
    readonly generatedRulesType: string;

    /**
     * The domains that you want to inspect for in your traffic flows. Valid domain specifications are the following:.
     *
     * - Explicit names. For example, `abc.example.com` matches only the domain `abc.example.com` .
     * - Names that use a domain wildcard, which you indicate with an initial ' `.` '. For example, `.example.com` matches `example.com` and matches all subdomains of `example.com` , such as `abc.example.com` and `www.example.com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessourcelist.html#cfn-networkfirewall-rulegroup-rulessourcelist-targets
     */
    readonly targets: Array<string>;

    /**
     * The types of targets to inspect for.
     *
     * Valid values are `TLS_SNI` and `HTTP_HOST` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessourcelist.html#cfn-networkfirewall-rulegroup-rulessourcelist-targettypes
     */
    readonly targetTypes: Array<string>;
  }

  /**
   * Settings that are available for use in the rules in the `RuleGroup` where this is defined.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulevariables.html
   */
  export interface RuleVariablesProperty {
    /**
     * A list of IP addresses and address ranges, in CIDR notation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulevariables.html#cfn-networkfirewall-rulegroup-rulevariables-ipsets
     */
    readonly ipSets?: cdk.IResolvable | Record<string, CfnRuleGroup.IPSetProperty | cdk.IResolvable>;

    /**
     * A list of port ranges.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulevariables.html#cfn-networkfirewall-rulegroup-rulevariables-portsets
     */
    readonly portSets?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnRuleGroup.PortSetProperty>;
  }

  /**
   * A set of port ranges for use in the rules in a rule group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portset.html
   */
  export interface PortSetProperty {
    /**
     * The set of port ranges.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portset.html#cfn-networkfirewall-rulegroup-portset-definition
     */
    readonly definition?: Array<string>;
  }

  /**
   * A list of IP addresses and address ranges, in CIDR notation.
   *
   * This is part of a `RuleGroup.RuleVariables` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ipset.html
   */
  export interface IPSetProperty {
    /**
     * The list of IP addresses and address ranges, in CIDR notation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ipset.html#cfn-networkfirewall-rulegroup-ipset-definition
     */
    readonly definition?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnRuleGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html
 */
export interface CfnRuleGroupProps {
  /**
   * The maximum operating resources that this rule group can use.
   *
   * You can't change a rule group's capacity setting after you create the rule group. When you update a rule group, you are limited to this capacity. When you reference a rule group from a firewall policy, Network Firewall reserves this capacity for the rule group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-capacity
   */
  readonly capacity: number;

  /**
   * A description of the rule group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-description
   */
  readonly description?: string;

  /**
   * An object that defines the rule group rules.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup
   */
  readonly ruleGroup?: cdk.IResolvable | CfnRuleGroup.RuleGroupProperty;

  /**
   * The descriptive name of the rule group.
   *
   * You can't change the name of a rule group after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroupname
   */
  readonly ruleGroupName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Indicates whether the rule group is stateless or stateful.
   *
   * If the rule group is stateless, it contains
   * stateless rules. If it is stateful, it contains stateful rules.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `StatefulRuleOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulRuleOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupStatefulRuleOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ruleOrder", cdk.validateString)(properties.ruleOrder));
  return errors.wrap("supplied properties not correct for \"StatefulRuleOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupStatefulRuleOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupStatefulRuleOptionsPropertyValidator(properties).assertSuccess();
  return {
    "RuleOrder": cdk.stringToCloudFormation(properties.ruleOrder)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupStatefulRuleOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.StatefulRuleOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatefulRuleOptionsProperty>();
  ret.addPropertyResult("ruleOrder", "RuleOrder", (properties.RuleOrder != null ? cfn_parse.FromCloudFormation.getString(properties.RuleOrder) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IPSetReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupIPSetReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("referenceArn", cdk.validateString)(properties.referenceArn));
  return errors.wrap("supplied properties not correct for \"IPSetReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupIPSetReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupIPSetReferencePropertyValidator(properties).assertSuccess();
  return {
    "ReferenceArn": cdk.stringToCloudFormation(properties.referenceArn)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupIPSetReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.IPSetReferenceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.IPSetReferenceProperty>();
  ret.addPropertyResult("referenceArn", "ReferenceArn", (properties.ReferenceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReferenceSetsProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceSetsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupReferenceSetsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipSetReferences", cdk.hashValidator(CfnRuleGroupIPSetReferencePropertyValidator))(properties.ipSetReferences));
  return errors.wrap("supplied properties not correct for \"ReferenceSetsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupReferenceSetsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupReferenceSetsPropertyValidator(properties).assertSuccess();
  return {
    "IPSetReferences": cdk.hashMapper(convertCfnRuleGroupIPSetReferencePropertyToCloudFormation)(properties.ipSetReferences)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupReferenceSetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.ReferenceSetsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ReferenceSetsProperty>();
  ret.addPropertyResult("ipSetReferences", "IPSetReferences", (properties.IPSetReferences != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleGroupIPSetReferencePropertyFromCloudFormation)(properties.IPSetReferences) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TCPFlagFieldProperty`
 *
 * @param properties - the TypeScript properties of a `TCPFlagFieldProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupTCPFlagFieldPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("flags", cdk.requiredValidator)(properties.flags));
  errors.collect(cdk.propertyValidator("flags", cdk.listValidator(cdk.validateString))(properties.flags));
  errors.collect(cdk.propertyValidator("masks", cdk.listValidator(cdk.validateString))(properties.masks));
  return errors.wrap("supplied properties not correct for \"TCPFlagFieldProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupTCPFlagFieldPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupTCPFlagFieldPropertyValidator(properties).assertSuccess();
  return {
    "Flags": cdk.listMapper(cdk.stringToCloudFormation)(properties.flags),
    "Masks": cdk.listMapper(cdk.stringToCloudFormation)(properties.masks)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupTCPFlagFieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.TCPFlagFieldProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.TCPFlagFieldProperty>();
  ret.addPropertyResult("flags", "Flags", (properties.Flags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Flags) : undefined));
  ret.addPropertyResult("masks", "Masks", (properties.Masks != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Masks) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PortRangeProperty`
 *
 * @param properties - the TypeScript properties of a `PortRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupPortRangePropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnRuleGroupPortRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupPortRangePropertyValidator(properties).assertSuccess();
  return {
    "FromPort": cdk.numberToCloudFormation(properties.fromPort),
    "ToPort": cdk.numberToCloudFormation(properties.toPort)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupPortRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.PortRangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.PortRangeProperty>();
  ret.addPropertyResult("fromPort", "FromPort", (properties.FromPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.FromPort) : undefined));
  ret.addPropertyResult("toPort", "ToPort", (properties.ToPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ToPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AddressProperty`
 *
 * @param properties - the TypeScript properties of a `AddressProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupAddressPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addressDefinition", cdk.requiredValidator)(properties.addressDefinition));
  errors.collect(cdk.propertyValidator("addressDefinition", cdk.validateString)(properties.addressDefinition));
  return errors.wrap("supplied properties not correct for \"AddressProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupAddressPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupAddressPropertyValidator(properties).assertSuccess();
  return {
    "AddressDefinition": cdk.stringToCloudFormation(properties.addressDefinition)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupAddressPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.AddressProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.AddressProperty>();
  ret.addPropertyResult("addressDefinition", "AddressDefinition", (properties.AddressDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.AddressDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MatchAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `MatchAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupMatchAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationPorts", cdk.listValidator(CfnRuleGroupPortRangePropertyValidator))(properties.destinationPorts));
  errors.collect(cdk.propertyValidator("destinations", cdk.listValidator(CfnRuleGroupAddressPropertyValidator))(properties.destinations));
  errors.collect(cdk.propertyValidator("protocols", cdk.listValidator(cdk.validateNumber))(properties.protocols));
  errors.collect(cdk.propertyValidator("sourcePorts", cdk.listValidator(CfnRuleGroupPortRangePropertyValidator))(properties.sourcePorts));
  errors.collect(cdk.propertyValidator("sources", cdk.listValidator(CfnRuleGroupAddressPropertyValidator))(properties.sources));
  errors.collect(cdk.propertyValidator("tcpFlags", cdk.listValidator(CfnRuleGroupTCPFlagFieldPropertyValidator))(properties.tcpFlags));
  return errors.wrap("supplied properties not correct for \"MatchAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupMatchAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupMatchAttributesPropertyValidator(properties).assertSuccess();
  return {
    "DestinationPorts": cdk.listMapper(convertCfnRuleGroupPortRangePropertyToCloudFormation)(properties.destinationPorts),
    "Destinations": cdk.listMapper(convertCfnRuleGroupAddressPropertyToCloudFormation)(properties.destinations),
    "Protocols": cdk.listMapper(cdk.numberToCloudFormation)(properties.protocols),
    "SourcePorts": cdk.listMapper(convertCfnRuleGroupPortRangePropertyToCloudFormation)(properties.sourcePorts),
    "Sources": cdk.listMapper(convertCfnRuleGroupAddressPropertyToCloudFormation)(properties.sources),
    "TCPFlags": cdk.listMapper(convertCfnRuleGroupTCPFlagFieldPropertyToCloudFormation)(properties.tcpFlags)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupMatchAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.MatchAttributesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.MatchAttributesProperty>();
  ret.addPropertyResult("destinationPorts", "DestinationPorts", (properties.DestinationPorts != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupPortRangePropertyFromCloudFormation)(properties.DestinationPorts) : undefined));
  ret.addPropertyResult("destinations", "Destinations", (properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupAddressPropertyFromCloudFormation)(properties.Destinations) : undefined));
  ret.addPropertyResult("protocols", "Protocols", (properties.Protocols != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Protocols) : undefined));
  ret.addPropertyResult("sourcePorts", "SourcePorts", (properties.SourcePorts != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupPortRangePropertyFromCloudFormation)(properties.SourcePorts) : undefined));
  ret.addPropertyResult("sources", "Sources", (properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupAddressPropertyFromCloudFormation)(properties.Sources) : undefined));
  ret.addPropertyResult("tcpFlags", "TCPFlags", (properties.TCPFlags != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTCPFlagFieldPropertyFromCloudFormation)(properties.TCPFlags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRuleDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(cdk.validateString))(properties.actions));
  errors.collect(cdk.propertyValidator("matchAttributes", cdk.requiredValidator)(properties.matchAttributes));
  errors.collect(cdk.propertyValidator("matchAttributes", CfnRuleGroupMatchAttributesPropertyValidator)(properties.matchAttributes));
  return errors.wrap("supplied properties not correct for \"RuleDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRuleDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRuleDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
    "MatchAttributes": convertCfnRuleGroupMatchAttributesPropertyToCloudFormation(properties.matchAttributes)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RuleDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleDefinitionProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Actions) : undefined));
  ret.addPropertyResult("matchAttributes", "MatchAttributes", (properties.MatchAttributes != null ? CfnRuleGroupMatchAttributesPropertyFromCloudFormation(properties.MatchAttributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatelessRuleProperty`
 *
 * @param properties - the TypeScript properties of a `StatelessRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupStatelessRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("ruleDefinition", cdk.requiredValidator)(properties.ruleDefinition));
  errors.collect(cdk.propertyValidator("ruleDefinition", CfnRuleGroupRuleDefinitionPropertyValidator)(properties.ruleDefinition));
  return errors.wrap("supplied properties not correct for \"StatelessRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupStatelessRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupStatelessRulePropertyValidator(properties).assertSuccess();
  return {
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "RuleDefinition": convertCfnRuleGroupRuleDefinitionPropertyToCloudFormation(properties.ruleDefinition)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupStatelessRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.StatelessRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatelessRuleProperty>();
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("ruleDefinition", "RuleDefinition", (properties.RuleDefinition != null ? CfnRuleGroupRuleDefinitionPropertyFromCloudFormation(properties.RuleDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"DimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.DimensionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.DimensionProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PublishMetricActionProperty`
 *
 * @param properties - the TypeScript properties of a `PublishMetricActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupPublishMetricActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensions", cdk.requiredValidator)(properties.dimensions));
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnRuleGroupDimensionPropertyValidator))(properties.dimensions));
  return errors.wrap("supplied properties not correct for \"PublishMetricActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupPublishMetricActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupPublishMetricActionPropertyValidator(properties).assertSuccess();
  return {
    "Dimensions": cdk.listMapper(convertCfnRuleGroupDimensionPropertyToCloudFormation)(properties.dimensions)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupPublishMetricActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.PublishMetricActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.PublishMetricActionProperty>();
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("publishMetricAction", CfnRuleGroupPublishMetricActionPropertyValidator)(properties.publishMetricAction));
  return errors.wrap("supplied properties not correct for \"ActionDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupActionDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupActionDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "PublishMetricAction": convertCfnRuleGroupPublishMetricActionPropertyToCloudFormation(properties.publishMetricAction)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ActionDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ActionDefinitionProperty>();
  ret.addPropertyResult("publishMetricAction", "PublishMetricAction", (properties.PublishMetricAction != null ? CfnRuleGroupPublishMetricActionPropertyFromCloudFormation(properties.PublishMetricAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomActionProperty`
 *
 * @param properties - the TypeScript properties of a `CustomActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCustomActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionDefinition", cdk.requiredValidator)(properties.actionDefinition));
  errors.collect(cdk.propertyValidator("actionDefinition", CfnRuleGroupActionDefinitionPropertyValidator)(properties.actionDefinition));
  errors.collect(cdk.propertyValidator("actionName", cdk.requiredValidator)(properties.actionName));
  errors.collect(cdk.propertyValidator("actionName", cdk.validateString)(properties.actionName));
  return errors.wrap("supplied properties not correct for \"CustomActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCustomActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCustomActionPropertyValidator(properties).assertSuccess();
  return {
    "ActionDefinition": convertCfnRuleGroupActionDefinitionPropertyToCloudFormation(properties.actionDefinition),
    "ActionName": cdk.stringToCloudFormation(properties.actionName)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomActionProperty>();
  ret.addPropertyResult("actionDefinition", "ActionDefinition", (properties.ActionDefinition != null ? CfnRuleGroupActionDefinitionPropertyFromCloudFormation(properties.ActionDefinition) : undefined));
  ret.addPropertyResult("actionName", "ActionName", (properties.ActionName != null ? cfn_parse.FromCloudFormation.getString(properties.ActionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatelessRulesAndCustomActionsProperty`
 *
 * @param properties - the TypeScript properties of a `StatelessRulesAndCustomActionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupStatelessRulesAndCustomActionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customActions", cdk.listValidator(CfnRuleGroupCustomActionPropertyValidator))(properties.customActions));
  errors.collect(cdk.propertyValidator("statelessRules", cdk.requiredValidator)(properties.statelessRules));
  errors.collect(cdk.propertyValidator("statelessRules", cdk.listValidator(CfnRuleGroupStatelessRulePropertyValidator))(properties.statelessRules));
  return errors.wrap("supplied properties not correct for \"StatelessRulesAndCustomActionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupStatelessRulesAndCustomActionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupStatelessRulesAndCustomActionsPropertyValidator(properties).assertSuccess();
  return {
    "CustomActions": cdk.listMapper(convertCfnRuleGroupCustomActionPropertyToCloudFormation)(properties.customActions),
    "StatelessRules": cdk.listMapper(convertCfnRuleGroupStatelessRulePropertyToCloudFormation)(properties.statelessRules)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupStatelessRulesAndCustomActionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.StatelessRulesAndCustomActionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatelessRulesAndCustomActionsProperty>();
  ret.addPropertyResult("customActions", "CustomActions", (properties.CustomActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupCustomActionPropertyFromCloudFormation)(properties.CustomActions) : undefined));
  ret.addPropertyResult("statelessRules", "StatelessRules", (properties.StatelessRules != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupStatelessRulePropertyFromCloudFormation)(properties.StatelessRules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeaderProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  errors.collect(cdk.propertyValidator("destinationPort", cdk.requiredValidator)(properties.destinationPort));
  errors.collect(cdk.propertyValidator("destinationPort", cdk.validateString)(properties.destinationPort));
  errors.collect(cdk.propertyValidator("direction", cdk.requiredValidator)(properties.direction));
  errors.collect(cdk.propertyValidator("direction", cdk.validateString)(properties.direction));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  errors.collect(cdk.propertyValidator("sourcePort", cdk.requiredValidator)(properties.sourcePort));
  errors.collect(cdk.propertyValidator("sourcePort", cdk.validateString)(properties.sourcePort));
  return errors.wrap("supplied properties not correct for \"HeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination),
    "DestinationPort": cdk.stringToCloudFormation(properties.destinationPort),
    "Direction": cdk.stringToCloudFormation(properties.direction),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "Source": cdk.stringToCloudFormation(properties.source),
    "SourcePort": cdk.stringToCloudFormation(properties.sourcePort)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.HeaderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.HeaderProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined));
  ret.addPropertyResult("destinationPort", "DestinationPort", (properties.DestinationPort != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPort) : undefined));
  ret.addPropertyResult("direction", "Direction", (properties.Direction != null ? cfn_parse.FromCloudFormation.getString(properties.Direction) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addPropertyResult("sourcePort", "SourcePort", (properties.SourcePort != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleOptionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRuleOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyword", cdk.requiredValidator)(properties.keyword));
  errors.collect(cdk.propertyValidator("keyword", cdk.validateString)(properties.keyword));
  errors.collect(cdk.propertyValidator("settings", cdk.listValidator(cdk.validateString))(properties.settings));
  return errors.wrap("supplied properties not correct for \"RuleOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRuleOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRuleOptionPropertyValidator(properties).assertSuccess();
  return {
    "Keyword": cdk.stringToCloudFormation(properties.keyword),
    "Settings": cdk.listMapper(cdk.stringToCloudFormation)(properties.settings)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RuleOptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleOptionProperty>();
  ret.addPropertyResult("keyword", "Keyword", (properties.Keyword != null ? cfn_parse.FromCloudFormation.getString(properties.Keyword) : undefined));
  ret.addPropertyResult("settings", "Settings", (properties.Settings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Settings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatefulRuleProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupStatefulRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("header", cdk.requiredValidator)(properties.header));
  errors.collect(cdk.propertyValidator("header", CfnRuleGroupHeaderPropertyValidator)(properties.header));
  errors.collect(cdk.propertyValidator("ruleOptions", cdk.requiredValidator)(properties.ruleOptions));
  errors.collect(cdk.propertyValidator("ruleOptions", cdk.listValidator(CfnRuleGroupRuleOptionPropertyValidator))(properties.ruleOptions));
  return errors.wrap("supplied properties not correct for \"StatefulRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupStatefulRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupStatefulRulePropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Header": convertCfnRuleGroupHeaderPropertyToCloudFormation(properties.header),
    "RuleOptions": cdk.listMapper(convertCfnRuleGroupRuleOptionPropertyToCloudFormation)(properties.ruleOptions)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupStatefulRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.StatefulRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatefulRuleProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("header", "Header", (properties.Header != null ? CfnRuleGroupHeaderPropertyFromCloudFormation(properties.Header) : undefined));
  ret.addPropertyResult("ruleOptions", "RuleOptions", (properties.RuleOptions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupRuleOptionPropertyFromCloudFormation)(properties.RuleOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RulesSourceListProperty`
 *
 * @param properties - the TypeScript properties of a `RulesSourceListProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRulesSourceListPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("generatedRulesType", cdk.requiredValidator)(properties.generatedRulesType));
  errors.collect(cdk.propertyValidator("generatedRulesType", cdk.validateString)(properties.generatedRulesType));
  errors.collect(cdk.propertyValidator("targetTypes", cdk.requiredValidator)(properties.targetTypes));
  errors.collect(cdk.propertyValidator("targetTypes", cdk.listValidator(cdk.validateString))(properties.targetTypes));
  errors.collect(cdk.propertyValidator("targets", cdk.requiredValidator)(properties.targets));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(cdk.validateString))(properties.targets));
  return errors.wrap("supplied properties not correct for \"RulesSourceListProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRulesSourceListPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRulesSourceListPropertyValidator(properties).assertSuccess();
  return {
    "GeneratedRulesType": cdk.stringToCloudFormation(properties.generatedRulesType),
    "TargetTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetTypes),
    "Targets": cdk.listMapper(cdk.stringToCloudFormation)(properties.targets)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRulesSourceListPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RulesSourceListProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RulesSourceListProperty>();
  ret.addPropertyResult("generatedRulesType", "GeneratedRulesType", (properties.GeneratedRulesType != null ? cfn_parse.FromCloudFormation.getString(properties.GeneratedRulesType) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Targets) : undefined));
  ret.addPropertyResult("targetTypes", "TargetTypes", (properties.TargetTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RulesSourceProperty`
 *
 * @param properties - the TypeScript properties of a `RulesSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRulesSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rulesSourceList", CfnRuleGroupRulesSourceListPropertyValidator)(properties.rulesSourceList));
  errors.collect(cdk.propertyValidator("rulesString", cdk.validateString)(properties.rulesString));
  errors.collect(cdk.propertyValidator("statefulRules", cdk.listValidator(CfnRuleGroupStatefulRulePropertyValidator))(properties.statefulRules));
  errors.collect(cdk.propertyValidator("statelessRulesAndCustomActions", CfnRuleGroupStatelessRulesAndCustomActionsPropertyValidator)(properties.statelessRulesAndCustomActions));
  return errors.wrap("supplied properties not correct for \"RulesSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRulesSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRulesSourcePropertyValidator(properties).assertSuccess();
  return {
    "RulesSourceList": convertCfnRuleGroupRulesSourceListPropertyToCloudFormation(properties.rulesSourceList),
    "RulesString": cdk.stringToCloudFormation(properties.rulesString),
    "StatefulRules": cdk.listMapper(convertCfnRuleGroupStatefulRulePropertyToCloudFormation)(properties.statefulRules),
    "StatelessRulesAndCustomActions": convertCfnRuleGroupStatelessRulesAndCustomActionsPropertyToCloudFormation(properties.statelessRulesAndCustomActions)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRulesSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RulesSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RulesSourceProperty>();
  ret.addPropertyResult("rulesSourceList", "RulesSourceList", (properties.RulesSourceList != null ? CfnRuleGroupRulesSourceListPropertyFromCloudFormation(properties.RulesSourceList) : undefined));
  ret.addPropertyResult("rulesString", "RulesString", (properties.RulesString != null ? cfn_parse.FromCloudFormation.getString(properties.RulesString) : undefined));
  ret.addPropertyResult("statefulRules", "StatefulRules", (properties.StatefulRules != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupStatefulRulePropertyFromCloudFormation)(properties.StatefulRules) : undefined));
  ret.addPropertyResult("statelessRulesAndCustomActions", "StatelessRulesAndCustomActions", (properties.StatelessRulesAndCustomActions != null ? CfnRuleGroupStatelessRulesAndCustomActionsPropertyFromCloudFormation(properties.StatelessRulesAndCustomActions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PortSetProperty`
 *
 * @param properties - the TypeScript properties of a `PortSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupPortSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("definition", cdk.listValidator(cdk.validateString))(properties.definition));
  return errors.wrap("supplied properties not correct for \"PortSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupPortSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupPortSetPropertyValidator(properties).assertSuccess();
  return {
    "Definition": cdk.listMapper(cdk.stringToCloudFormation)(properties.definition)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupPortSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.PortSetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.PortSetProperty>();
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Definition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IPSetProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupIPSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("definition", cdk.listValidator(cdk.validateString))(properties.definition));
  return errors.wrap("supplied properties not correct for \"IPSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupIPSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupIPSetPropertyValidator(properties).assertSuccess();
  return {
    "Definition": cdk.listMapper(cdk.stringToCloudFormation)(properties.definition)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupIPSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.IPSetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.IPSetProperty>();
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Definition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleVariablesProperty`
 *
 * @param properties - the TypeScript properties of a `RuleVariablesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRuleVariablesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipSets", cdk.hashValidator(CfnRuleGroupIPSetPropertyValidator))(properties.ipSets));
  errors.collect(cdk.propertyValidator("portSets", cdk.hashValidator(CfnRuleGroupPortSetPropertyValidator))(properties.portSets));
  return errors.wrap("supplied properties not correct for \"RuleVariablesProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRuleVariablesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRuleVariablesPropertyValidator(properties).assertSuccess();
  return {
    "IPSets": cdk.hashMapper(convertCfnRuleGroupIPSetPropertyToCloudFormation)(properties.ipSets),
    "PortSets": cdk.hashMapper(convertCfnRuleGroupPortSetPropertyToCloudFormation)(properties.portSets)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleVariablesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RuleVariablesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleVariablesProperty>();
  ret.addPropertyResult("ipSets", "IPSets", (properties.IPSets != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleGroupIPSetPropertyFromCloudFormation)(properties.IPSets) : undefined));
  ret.addPropertyResult("portSets", "PortSets", (properties.PortSets != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleGroupPortSetPropertyFromCloudFormation)(properties.PortSets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleGroupProperty`
 *
 * @param properties - the TypeScript properties of a `RuleGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRuleGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("referenceSets", CfnRuleGroupReferenceSetsPropertyValidator)(properties.referenceSets));
  errors.collect(cdk.propertyValidator("ruleVariables", CfnRuleGroupRuleVariablesPropertyValidator)(properties.ruleVariables));
  errors.collect(cdk.propertyValidator("rulesSource", cdk.requiredValidator)(properties.rulesSource));
  errors.collect(cdk.propertyValidator("rulesSource", CfnRuleGroupRulesSourcePropertyValidator)(properties.rulesSource));
  errors.collect(cdk.propertyValidator("statefulRuleOptions", CfnRuleGroupStatefulRuleOptionsPropertyValidator)(properties.statefulRuleOptions));
  return errors.wrap("supplied properties not correct for \"RuleGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRuleGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRuleGroupPropertyValidator(properties).assertSuccess();
  return {
    "ReferenceSets": convertCfnRuleGroupReferenceSetsPropertyToCloudFormation(properties.referenceSets),
    "RuleVariables": convertCfnRuleGroupRuleVariablesPropertyToCloudFormation(properties.ruleVariables),
    "RulesSource": convertCfnRuleGroupRulesSourcePropertyToCloudFormation(properties.rulesSource),
    "StatefulRuleOptions": convertCfnRuleGroupStatefulRuleOptionsPropertyToCloudFormation(properties.statefulRuleOptions)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RuleGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleGroupProperty>();
  ret.addPropertyResult("referenceSets", "ReferenceSets", (properties.ReferenceSets != null ? CfnRuleGroupReferenceSetsPropertyFromCloudFormation(properties.ReferenceSets) : undefined));
  ret.addPropertyResult("rulesSource", "RulesSource", (properties.RulesSource != null ? CfnRuleGroupRulesSourcePropertyFromCloudFormation(properties.RulesSource) : undefined));
  ret.addPropertyResult("ruleVariables", "RuleVariables", (properties.RuleVariables != null ? CfnRuleGroupRuleVariablesPropertyFromCloudFormation(properties.RuleVariables) : undefined));
  ret.addPropertyResult("statefulRuleOptions", "StatefulRuleOptions", (properties.StatefulRuleOptions != null ? CfnRuleGroupStatefulRuleOptionsPropertyFromCloudFormation(properties.StatefulRuleOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRuleGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacity", cdk.requiredValidator)(properties.capacity));
  errors.collect(cdk.propertyValidator("capacity", cdk.validateNumber)(properties.capacity));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("ruleGroup", CfnRuleGroupRuleGroupPropertyValidator)(properties.ruleGroup));
  errors.collect(cdk.propertyValidator("ruleGroupName", cdk.requiredValidator)(properties.ruleGroupName));
  errors.collect(cdk.propertyValidator("ruleGroupName", cdk.validateString)(properties.ruleGroupName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnRuleGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupPropsValidator(properties).assertSuccess();
  return {
    "Capacity": cdk.numberToCloudFormation(properties.capacity),
    "Description": cdk.stringToCloudFormation(properties.description),
    "RuleGroup": convertCfnRuleGroupRuleGroupPropertyToCloudFormation(properties.ruleGroup),
    "RuleGroupName": cdk.stringToCloudFormation(properties.ruleGroupName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroupProps>();
  ret.addPropertyResult("capacity", "Capacity", (properties.Capacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.Capacity) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("ruleGroup", "RuleGroup", (properties.RuleGroup != null ? CfnRuleGroupRuleGroupPropertyFromCloudFormation(properties.RuleGroup) : undefined));
  ret.addPropertyResult("ruleGroupName", "RuleGroupName", (properties.RuleGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleGroupName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The object that defines a TLS inspection configuration.
 *
 * This, along with `TLSInspectionConfigurationResponse` , define the TLS inspection configuration. You can retrieve all objects for a TLS inspection configuration by calling `DescribeTLSInspectionConfiguration` .
 *
 * AWS Network Firewall uses a TLS inspection configuration to decrypt traffic. Network Firewall re-encrypts the traffic before sending it to its destination.
 *
 * To use a TLS inspection configuration, you add it to a new Network Firewall firewall policy, then you apply the firewall policy to a firewall. Network Firewall acts as a proxy service to decrypt and inspect the traffic traveling through your firewalls. You can reference a TLS inspection configuration from more than one firewall policy, and you can use a firewall policy in more than one firewall. For more information about using TLS inspection configurations, see [Inspecting SSL/TLS traffic with TLS
 * inspection configurations](https://docs.aws.amazon.com/network-firewall/latest/developerguide/tls-inspection.html) in the *AWS Network Firewall Developer Guide* .
 *
 * @cloudformationResource AWS::NetworkFirewall::TLSInspectionConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-tlsinspectionconfiguration.html
 */
export class CfnTLSInspectionConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkFirewall::TLSInspectionConfiguration";

  /**
   * Build a CfnTLSInspectionConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTLSInspectionConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTLSInspectionConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTLSInspectionConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the TLS inspection configuration.
   *
   * @cloudformationAttribute TLSInspectionConfigurationArn
   */
  public readonly attrTlsInspectionConfigurationArn: string;

  /**
   * A unique identifier for the TLS inspection configuration. This ID is returned in the responses to create and list commands. You provide it to operations such as update and delete.
   *
   * @cloudformationAttribute TLSInspectionConfigurationId
   */
  public readonly attrTlsInspectionConfigurationId: string;

  /**
   * A description of the TLS inspection configuration.
   */
  public description?: string;

  /**
   * The key:value pairs to associate with the resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The object that defines a TLS inspection configuration.
   */
  public tlsInspectionConfiguration: cdk.IResolvable | CfnTLSInspectionConfiguration.TLSInspectionConfigurationProperty;

  /**
   * The descriptive name of the TLS inspection configuration.
   */
  public tlsInspectionConfigurationName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTLSInspectionConfigurationProps) {
    super(scope, id, {
      "type": CfnTLSInspectionConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "tlsInspectionConfiguration", this);
    cdk.requireProperty(props, "tlsInspectionConfigurationName", this);

    this.attrTlsInspectionConfigurationArn = cdk.Token.asString(this.getAtt("TLSInspectionConfigurationArn", cdk.ResolutionTypeHint.STRING));
    this.attrTlsInspectionConfigurationId = cdk.Token.asString(this.getAtt("TLSInspectionConfigurationId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.tags = props.tags;
    this.tlsInspectionConfiguration = props.tlsInspectionConfiguration;
    this.tlsInspectionConfigurationName = props.tlsInspectionConfigurationName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "tags": this.tags,
      "tlsInspectionConfiguration": this.tlsInspectionConfiguration,
      "tlsInspectionConfigurationName": this.tlsInspectionConfigurationName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTLSInspectionConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTLSInspectionConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnTLSInspectionConfiguration {
  /**
   * The object that defines a TLS inspection configuration.
   *
   * This, along with `TLSInspectionConfigurationResponse` , define the TLS inspection configuration. You can retrieve all objects for a TLS inspection configuration by calling `DescribeTLSInspectionConfiguration` .
   *
   * AWS Network Firewall uses a TLS inspection configuration to decrypt traffic. Network Firewall re-encrypts the traffic before sending it to its destination.
   *
   * To use a TLS inspection configuration, you add it to a new Network Firewall firewall policy, then you apply the firewall policy to a firewall. Network Firewall acts as a proxy service to decrypt and inspect the traffic traveling through your firewalls. You can reference a TLS inspection configuration from more than one firewall policy, and you can use a firewall policy in more than one firewall. For more information about using TLS inspection configurations, see [Inspecting SSL/TLS traffic with TLS
   * inspection configurations](https://docs.aws.amazon.com/network-firewall/latest/developerguide/tls-inspection.html) in the *AWS Network Firewall Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-tlsinspectionconfiguration.html
   */
  export interface TLSInspectionConfigurationProperty {
    /**
     * Lists the server certificate configurations that are associated with the TLS configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-tlsinspectionconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-tlsinspectionconfiguration-servercertificateconfigurations
     */
    readonly serverCertificateConfigurations?: Array<cdk.IResolvable | CfnTLSInspectionConfiguration.ServerCertificateConfigurationProperty> | cdk.IResolvable;
  }

  /**
   * Configures the AWS Certificate Manager certificates and scope that Network Firewall uses to decrypt and re-encrypt traffic using a `TLSInspectionConfiguration` .
   *
   * You can configure `ServerCertificates` for inbound SSL/TLS inspection, a `CertificateAuthorityArn` for outbound SSL/TLS inspection, or both. For information about working with certificates for TLS inspection, see [Using SSL/TLS server certficiates with TLS inspection configurations](https://docs.aws.amazon.com/network-firewall/latest/developerguide/tls-inspection-certificate-requirements.html) in the *AWS Network Firewall Developer Guide* .
   *
   * > If a server certificate that's associated with your `TLSInspectionConfiguration` is revoked, deleted, or expired it can result in client-side TLS errors.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration.html
   */
  export interface ServerCertificateConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the imported certificate authority (CA) certificate within AWS Certificate Manager (ACM) to use for outbound SSL/TLS inspection.
     *
     * The following limitations apply:
     *
     * - You can use CA certificates that you imported into ACM, but you can't generate CA certificates with ACM.
     * - You can't use certificates issued by AWS Private Certificate Authority .
     *
     * For more information about configuring certificates for outbound inspection, see [Using SSL/TLS certificates with certificates with TLS inspection configurations](https://docs.aws.amazon.com/network-firewall/latest/developerguide/tls-inspection-certificate-requirements.html) in the *AWS Network Firewall Developer Guide* .
     *
     * For information about working with certificates in ACM, see [Importing certificates](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html) in the *AWS Certificate Manager User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration-certificateauthorityarn
     */
    readonly certificateAuthorityArn?: string;

    /**
     * When enabled, Network Firewall checks if the server certificate presented by the server in the SSL/TLS connection has a revoked or unkown status.
     *
     * If the certificate has an unknown or revoked status, you must specify the actions that Network Firewall takes on outbound traffic. To check the certificate revocation status, you must also specify a `CertificateAuthorityArn` in `ServerCertificateConfiguration` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration-checkcertificaterevocationstatus
     */
    readonly checkCertificateRevocationStatus?: CfnTLSInspectionConfiguration.CheckCertificateRevocationStatusProperty | cdk.IResolvable;

    /**
     * A list of scopes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration-scopes
     */
    readonly scopes?: Array<cdk.IResolvable | CfnTLSInspectionConfiguration.ServerCertificateScopeProperty> | cdk.IResolvable;

    /**
     * The list of server certificates to use for inbound SSL/TLS inspection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificateconfiguration-servercertificates
     */
    readonly serverCertificates?: Array<cdk.IResolvable | CfnTLSInspectionConfiguration.ServerCertificateProperty> | cdk.IResolvable;
  }

  /**
   * Any AWS Certificate Manager (ACM) Secure Sockets Layer/Transport Layer Security (SSL/TLS) server certificate that's associated with a `ServerCertificateConfiguration` .
   *
   * Used in a `TLSInspectionConfiguration` for inspection of inbound traffic to your firewall. You must request or import a SSL/TLS certificate into ACM for each domain Network Firewall needs to decrypt and inspect. AWS Network Firewall uses the SSL/TLS certificates to decrypt specified inbound SSL/TLS traffic going to your firewall. For information about working with certificates in AWS Certificate Manager , see [Request a public certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) or [Importing certificates](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html) in the *AWS Certificate Manager User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificate.html
   */
  export interface ServerCertificateProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS Certificate Manager SSL/TLS server certificate that's used for inbound SSL/TLS inspection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificate.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificate-resourcearn
     */
    readonly resourceArn?: string;
  }

  /**
   * Settings that define the Secure Sockets Layer/Transport Layer Security (SSL/TLS) traffic that Network Firewall should decrypt for inspection by the stateful rule engine.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificatescope.html
   */
  export interface ServerCertificateScopeProperty {
    /**
     * The destination ports to decrypt for inspection, in Transmission Control Protocol (TCP) format.
     *
     * If not specified, this matches with any destination port.
     *
     * You can specify individual ports, for example `1994` , and you can specify port ranges, such as `1990:1994` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificatescope.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificatescope-destinationports
     */
    readonly destinationPorts?: Array<cdk.IResolvable | CfnTLSInspectionConfiguration.PortRangeProperty> | cdk.IResolvable;

    /**
     * The destination IP addresses and address ranges to decrypt for inspection, in CIDR notation.
     *
     * If not specified, this
     * matches with any destination address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificatescope.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificatescope-destinations
     */
    readonly destinations?: Array<CfnTLSInspectionConfiguration.AddressProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The protocols to decrypt for inspection, specified using each protocol's assigned internet protocol number (IANA).
     *
     * Network Firewall currently supports only TCP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificatescope.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificatescope-protocols
     */
    readonly protocols?: Array<number> | cdk.IResolvable;

    /**
     * The source ports to decrypt for inspection, in Transmission Control Protocol (TCP) format.
     *
     * If not specified, this matches with any source port.
     *
     * You can specify individual ports, for example `1994` , and you can specify port ranges, such as `1990:1994` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificatescope.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificatescope-sourceports
     */
    readonly sourcePorts?: Array<cdk.IResolvable | CfnTLSInspectionConfiguration.PortRangeProperty> | cdk.IResolvable;

    /**
     * The source IP addresses and address ranges to decrypt for inspection, in CIDR notation.
     *
     * If not specified, this
     * matches with any source address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-servercertificatescope.html#cfn-networkfirewall-tlsinspectionconfiguration-servercertificatescope-sources
     */
    readonly sources?: Array<CfnTLSInspectionConfiguration.AddressProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A single IP address specification.
   *
   * This is used in the `MatchAttributes` source and destination specifications.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-address.html
   */
  export interface AddressProperty {
    /**
     * Specify an IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
     *
     * Network Firewall supports all address ranges for IPv4 and IPv6.
     *
     * Examples:
     *
     * - To configure Network Firewall to inspect for the IP address 192.0.2.44, specify `192.0.2.44/32` .
     * - To configure Network Firewall to inspect for IP addresses from 192.0.2.0 to 192.0.2.255, specify `192.0.2.0/24` .
     * - To configure Network Firewall to inspect for the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify `1111:0000:0000:0000:0000:0000:0000:0111/128` .
     * - To configure Network Firewall to inspect for IP addresses from 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify `1111:0000:0000:0000:0000:0000:0000:0000/64` .
     *
     * For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-address.html#cfn-networkfirewall-tlsinspectionconfiguration-address-addressdefinition
     */
    readonly addressDefinition: string;
  }

  /**
   * A single port range specification.
   *
   * This is used for source and destination port ranges in the stateless rule `MatchAttributes` , `SourcePorts` , and `DestinationPorts` settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-portrange.html
   */
  export interface PortRangeProperty {
    /**
     * The lower limit of the port range.
     *
     * This must be less than or equal to the `ToPort` specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-portrange.html#cfn-networkfirewall-tlsinspectionconfiguration-portrange-fromport
     */
    readonly fromPort: number;

    /**
     * The upper limit of the port range.
     *
     * This must be greater than or equal to the `FromPort` specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-portrange.html#cfn-networkfirewall-tlsinspectionconfiguration-portrange-toport
     */
    readonly toPort: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-checkcertificaterevocationstatus.html
   */
  export interface CheckCertificateRevocationStatusProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-checkcertificaterevocationstatus.html#cfn-networkfirewall-tlsinspectionconfiguration-checkcertificaterevocationstatus-revokedstatusaction
     */
    readonly revokedStatusAction?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-tlsinspectionconfiguration-checkcertificaterevocationstatus.html#cfn-networkfirewall-tlsinspectionconfiguration-checkcertificaterevocationstatus-unknownstatusaction
     */
    readonly unknownStatusAction?: string;
  }
}

/**
 * Properties for defining a `CfnTLSInspectionConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-tlsinspectionconfiguration.html
 */
export interface CfnTLSInspectionConfigurationProps {
  /**
   * A description of the TLS inspection configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-tlsinspectionconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-description
   */
  readonly description?: string;

  /**
   * The key:value pairs to associate with the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-tlsinspectionconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The object that defines a TLS inspection configuration.
   *
   * This, along with `TLSInspectionConfigurationResponse` , define the TLS inspection configuration. You can retrieve all objects for a TLS inspection configuration by calling `DescribeTLSInspectionConfiguration` .
   *
   * AWS Network Firewall uses a TLS inspection configuration to decrypt traffic. Network Firewall re-encrypts the traffic before sending it to its destination.
   *
   * To use a TLS inspection configuration, you add it to a new Network Firewall firewall policy, then you apply the firewall policy to a firewall. Network Firewall acts as a proxy service to decrypt and inspect the traffic traveling through your firewalls. You can reference a TLS inspection configuration from more than one firewall policy, and you can use a firewall policy in more than one firewall. For more information about using TLS inspection configurations, see [Inspecting SSL/TLS traffic with TLS
   * inspection configurations](https://docs.aws.amazon.com/network-firewall/latest/developerguide/tls-inspection.html) in the *AWS Network Firewall Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-tlsinspectionconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-tlsinspectionconfiguration
   */
  readonly tlsInspectionConfiguration: cdk.IResolvable | CfnTLSInspectionConfiguration.TLSInspectionConfigurationProperty;

  /**
   * The descriptive name of the TLS inspection configuration.
   *
   * You can't change the name of a TLS inspection configuration after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-tlsinspectionconfiguration.html#cfn-networkfirewall-tlsinspectionconfiguration-tlsinspectionconfigurationname
   */
  readonly tlsInspectionConfigurationName: string;
}

/**
 * Determine whether the given properties match those of a `ServerCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ServerCertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTLSInspectionConfigurationServerCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"ServerCertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnTLSInspectionConfigurationServerCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTLSInspectionConfigurationServerCertificatePropertyValidator(properties).assertSuccess();
  return {
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnTLSInspectionConfigurationServerCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTLSInspectionConfiguration.ServerCertificateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTLSInspectionConfiguration.ServerCertificateProperty>();
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AddressProperty`
 *
 * @param properties - the TypeScript properties of a `AddressProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTLSInspectionConfigurationAddressPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addressDefinition", cdk.requiredValidator)(properties.addressDefinition));
  errors.collect(cdk.propertyValidator("addressDefinition", cdk.validateString)(properties.addressDefinition));
  return errors.wrap("supplied properties not correct for \"AddressProperty\"");
}

// @ts-ignore TS6133
function convertCfnTLSInspectionConfigurationAddressPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTLSInspectionConfigurationAddressPropertyValidator(properties).assertSuccess();
  return {
    "AddressDefinition": cdk.stringToCloudFormation(properties.addressDefinition)
  };
}

// @ts-ignore TS6133
function CfnTLSInspectionConfigurationAddressPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTLSInspectionConfiguration.AddressProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTLSInspectionConfiguration.AddressProperty>();
  ret.addPropertyResult("addressDefinition", "AddressDefinition", (properties.AddressDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.AddressDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PortRangeProperty`
 *
 * @param properties - the TypeScript properties of a `PortRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTLSInspectionConfigurationPortRangePropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnTLSInspectionConfigurationPortRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTLSInspectionConfigurationPortRangePropertyValidator(properties).assertSuccess();
  return {
    "FromPort": cdk.numberToCloudFormation(properties.fromPort),
    "ToPort": cdk.numberToCloudFormation(properties.toPort)
  };
}

// @ts-ignore TS6133
function CfnTLSInspectionConfigurationPortRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTLSInspectionConfiguration.PortRangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTLSInspectionConfiguration.PortRangeProperty>();
  ret.addPropertyResult("fromPort", "FromPort", (properties.FromPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.FromPort) : undefined));
  ret.addPropertyResult("toPort", "ToPort", (properties.ToPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ToPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerCertificateScopeProperty`
 *
 * @param properties - the TypeScript properties of a `ServerCertificateScopeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTLSInspectionConfigurationServerCertificateScopePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationPorts", cdk.listValidator(CfnTLSInspectionConfigurationPortRangePropertyValidator))(properties.destinationPorts));
  errors.collect(cdk.propertyValidator("destinations", cdk.listValidator(CfnTLSInspectionConfigurationAddressPropertyValidator))(properties.destinations));
  errors.collect(cdk.propertyValidator("protocols", cdk.listValidator(cdk.validateNumber))(properties.protocols));
  errors.collect(cdk.propertyValidator("sourcePorts", cdk.listValidator(CfnTLSInspectionConfigurationPortRangePropertyValidator))(properties.sourcePorts));
  errors.collect(cdk.propertyValidator("sources", cdk.listValidator(CfnTLSInspectionConfigurationAddressPropertyValidator))(properties.sources));
  return errors.wrap("supplied properties not correct for \"ServerCertificateScopeProperty\"");
}

// @ts-ignore TS6133
function convertCfnTLSInspectionConfigurationServerCertificateScopePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTLSInspectionConfigurationServerCertificateScopePropertyValidator(properties).assertSuccess();
  return {
    "DestinationPorts": cdk.listMapper(convertCfnTLSInspectionConfigurationPortRangePropertyToCloudFormation)(properties.destinationPorts),
    "Destinations": cdk.listMapper(convertCfnTLSInspectionConfigurationAddressPropertyToCloudFormation)(properties.destinations),
    "Protocols": cdk.listMapper(cdk.numberToCloudFormation)(properties.protocols),
    "SourcePorts": cdk.listMapper(convertCfnTLSInspectionConfigurationPortRangePropertyToCloudFormation)(properties.sourcePorts),
    "Sources": cdk.listMapper(convertCfnTLSInspectionConfigurationAddressPropertyToCloudFormation)(properties.sources)
  };
}

// @ts-ignore TS6133
function CfnTLSInspectionConfigurationServerCertificateScopePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTLSInspectionConfiguration.ServerCertificateScopeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTLSInspectionConfiguration.ServerCertificateScopeProperty>();
  ret.addPropertyResult("destinationPorts", "DestinationPorts", (properties.DestinationPorts != null ? cfn_parse.FromCloudFormation.getArray(CfnTLSInspectionConfigurationPortRangePropertyFromCloudFormation)(properties.DestinationPorts) : undefined));
  ret.addPropertyResult("destinations", "Destinations", (properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnTLSInspectionConfigurationAddressPropertyFromCloudFormation)(properties.Destinations) : undefined));
  ret.addPropertyResult("protocols", "Protocols", (properties.Protocols != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Protocols) : undefined));
  ret.addPropertyResult("sourcePorts", "SourcePorts", (properties.SourcePorts != null ? cfn_parse.FromCloudFormation.getArray(CfnTLSInspectionConfigurationPortRangePropertyFromCloudFormation)(properties.SourcePorts) : undefined));
  ret.addPropertyResult("sources", "Sources", (properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnTLSInspectionConfigurationAddressPropertyFromCloudFormation)(properties.Sources) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CheckCertificateRevocationStatusProperty`
 *
 * @param properties - the TypeScript properties of a `CheckCertificateRevocationStatusProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTLSInspectionConfigurationCheckCertificateRevocationStatusPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("revokedStatusAction", cdk.validateString)(properties.revokedStatusAction));
  errors.collect(cdk.propertyValidator("unknownStatusAction", cdk.validateString)(properties.unknownStatusAction));
  return errors.wrap("supplied properties not correct for \"CheckCertificateRevocationStatusProperty\"");
}

// @ts-ignore TS6133
function convertCfnTLSInspectionConfigurationCheckCertificateRevocationStatusPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTLSInspectionConfigurationCheckCertificateRevocationStatusPropertyValidator(properties).assertSuccess();
  return {
    "RevokedStatusAction": cdk.stringToCloudFormation(properties.revokedStatusAction),
    "UnknownStatusAction": cdk.stringToCloudFormation(properties.unknownStatusAction)
  };
}

// @ts-ignore TS6133
function CfnTLSInspectionConfigurationCheckCertificateRevocationStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTLSInspectionConfiguration.CheckCertificateRevocationStatusProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTLSInspectionConfiguration.CheckCertificateRevocationStatusProperty>();
  ret.addPropertyResult("revokedStatusAction", "RevokedStatusAction", (properties.RevokedStatusAction != null ? cfn_parse.FromCloudFormation.getString(properties.RevokedStatusAction) : undefined));
  ret.addPropertyResult("unknownStatusAction", "UnknownStatusAction", (properties.UnknownStatusAction != null ? cfn_parse.FromCloudFormation.getString(properties.UnknownStatusAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerCertificateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerCertificateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTLSInspectionConfigurationServerCertificateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateAuthorityArn", cdk.validateString)(properties.certificateAuthorityArn));
  errors.collect(cdk.propertyValidator("checkCertificateRevocationStatus", CfnTLSInspectionConfigurationCheckCertificateRevocationStatusPropertyValidator)(properties.checkCertificateRevocationStatus));
  errors.collect(cdk.propertyValidator("scopes", cdk.listValidator(CfnTLSInspectionConfigurationServerCertificateScopePropertyValidator))(properties.scopes));
  errors.collect(cdk.propertyValidator("serverCertificates", cdk.listValidator(CfnTLSInspectionConfigurationServerCertificatePropertyValidator))(properties.serverCertificates));
  return errors.wrap("supplied properties not correct for \"ServerCertificateConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTLSInspectionConfigurationServerCertificateConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTLSInspectionConfigurationServerCertificateConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CertificateAuthorityArn": cdk.stringToCloudFormation(properties.certificateAuthorityArn),
    "CheckCertificateRevocationStatus": convertCfnTLSInspectionConfigurationCheckCertificateRevocationStatusPropertyToCloudFormation(properties.checkCertificateRevocationStatus),
    "Scopes": cdk.listMapper(convertCfnTLSInspectionConfigurationServerCertificateScopePropertyToCloudFormation)(properties.scopes),
    "ServerCertificates": cdk.listMapper(convertCfnTLSInspectionConfigurationServerCertificatePropertyToCloudFormation)(properties.serverCertificates)
  };
}

// @ts-ignore TS6133
function CfnTLSInspectionConfigurationServerCertificateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTLSInspectionConfiguration.ServerCertificateConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTLSInspectionConfiguration.ServerCertificateConfigurationProperty>();
  ret.addPropertyResult("certificateAuthorityArn", "CertificateAuthorityArn", (properties.CertificateAuthorityArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateAuthorityArn) : undefined));
  ret.addPropertyResult("checkCertificateRevocationStatus", "CheckCertificateRevocationStatus", (properties.CheckCertificateRevocationStatus != null ? CfnTLSInspectionConfigurationCheckCertificateRevocationStatusPropertyFromCloudFormation(properties.CheckCertificateRevocationStatus) : undefined));
  ret.addPropertyResult("scopes", "Scopes", (properties.Scopes != null ? cfn_parse.FromCloudFormation.getArray(CfnTLSInspectionConfigurationServerCertificateScopePropertyFromCloudFormation)(properties.Scopes) : undefined));
  ret.addPropertyResult("serverCertificates", "ServerCertificates", (properties.ServerCertificates != null ? cfn_parse.FromCloudFormation.getArray(CfnTLSInspectionConfigurationServerCertificatePropertyFromCloudFormation)(properties.ServerCertificates) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TLSInspectionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TLSInspectionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTLSInspectionConfigurationTLSInspectionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serverCertificateConfigurations", cdk.listValidator(CfnTLSInspectionConfigurationServerCertificateConfigurationPropertyValidator))(properties.serverCertificateConfigurations));
  return errors.wrap("supplied properties not correct for \"TLSInspectionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTLSInspectionConfigurationTLSInspectionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTLSInspectionConfigurationTLSInspectionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ServerCertificateConfigurations": cdk.listMapper(convertCfnTLSInspectionConfigurationServerCertificateConfigurationPropertyToCloudFormation)(properties.serverCertificateConfigurations)
  };
}

// @ts-ignore TS6133
function CfnTLSInspectionConfigurationTLSInspectionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTLSInspectionConfiguration.TLSInspectionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTLSInspectionConfiguration.TLSInspectionConfigurationProperty>();
  ret.addPropertyResult("serverCertificateConfigurations", "ServerCertificateConfigurations", (properties.ServerCertificateConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnTLSInspectionConfigurationServerCertificateConfigurationPropertyFromCloudFormation)(properties.ServerCertificateConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTLSInspectionConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTLSInspectionConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTLSInspectionConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("tlsInspectionConfiguration", cdk.requiredValidator)(properties.tlsInspectionConfiguration));
  errors.collect(cdk.propertyValidator("tlsInspectionConfiguration", CfnTLSInspectionConfigurationTLSInspectionConfigurationPropertyValidator)(properties.tlsInspectionConfiguration));
  errors.collect(cdk.propertyValidator("tlsInspectionConfigurationName", cdk.requiredValidator)(properties.tlsInspectionConfigurationName));
  errors.collect(cdk.propertyValidator("tlsInspectionConfigurationName", cdk.validateString)(properties.tlsInspectionConfigurationName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTLSInspectionConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnTLSInspectionConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTLSInspectionConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "TLSInspectionConfiguration": convertCfnTLSInspectionConfigurationTLSInspectionConfigurationPropertyToCloudFormation(properties.tlsInspectionConfiguration),
    "TLSInspectionConfigurationName": cdk.stringToCloudFormation(properties.tlsInspectionConfigurationName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTLSInspectionConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTLSInspectionConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTLSInspectionConfigurationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tlsInspectionConfiguration", "TLSInspectionConfiguration", (properties.TLSInspectionConfiguration != null ? CfnTLSInspectionConfigurationTLSInspectionConfigurationPropertyFromCloudFormation(properties.TLSInspectionConfiguration) : undefined));
  ret.addPropertyResult("tlsInspectionConfigurationName", "TLSInspectionConfigurationName", (properties.TLSInspectionConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.TLSInspectionConfigurationName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}