// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:25.972Z","fingerprint":"l9I9FiJTjG5wUfVu5SJZAYpsDk2HNva64ftsL46Ueoc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnFirewall`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html
 */
export interface CfnFirewallProps {

    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallname
     */
    readonly firewallName: string;

    /**
     * The Amazon Resource Name (ARN) of the firewall policy.
     *
     * The relationship of firewall to firewall policy is many to one. Each firewall requires one firewall policy association, and you can use the same firewall policy for multiple firewalls.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallpolicyarn
     */
    readonly firewallPolicyArn: string;

    /**
     * The public subnets that Network Firewall is using for the firewall. Each subnet must belong to a different Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-subnetmappings
     */
    readonly subnetMappings: Array<CfnFirewall.SubnetMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The unique identifier of the VPC where the firewall is in use. You can't change the VPC of a firewall after you create the firewall.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-vpcid
     */
    readonly vpcId: string;

    /**
     * A flag indicating whether it is possible to delete the firewall. A setting of `TRUE` indicates that the firewall is protected against deletion. Use this setting to protect against accidentally deleting a firewall that is in use. When you create a firewall, the operation initializes this flag to `TRUE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-deleteprotection
     */
    readonly deleteProtection?: boolean | cdk.IResolvable;

    /**
     * A description of the firewall.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-description
     */
    readonly description?: string;

    /**
     * A setting indicating whether the firewall is protected against a change to the firewall policy association. Use this setting to protect against accidentally modifying the firewall policy for a firewall that is in use. When you create a firewall, the operation initializes this setting to `TRUE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallpolicychangeprotection
     */
    readonly firewallPolicyChangeProtection?: boolean | cdk.IResolvable;

    /**
     * A setting indicating whether the firewall is protected against changes to the subnet associations. Use this setting to protect against accidentally modifying the subnet associations for a firewall that is in use. When you create a firewall, the operation initializes this setting to `TRUE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-subnetchangeprotection
     */
    readonly subnetChangeProtection?: boolean | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnFirewallProps`
 *
 * @param properties - the TypeScript properties of a `CfnFirewallProps`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteProtection', cdk.validateBoolean)(properties.deleteProtection));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('firewallName', cdk.requiredValidator)(properties.firewallName));
    errors.collect(cdk.propertyValidator('firewallName', cdk.validateString)(properties.firewallName));
    errors.collect(cdk.propertyValidator('firewallPolicyArn', cdk.requiredValidator)(properties.firewallPolicyArn));
    errors.collect(cdk.propertyValidator('firewallPolicyArn', cdk.validateString)(properties.firewallPolicyArn));
    errors.collect(cdk.propertyValidator('firewallPolicyChangeProtection', cdk.validateBoolean)(properties.firewallPolicyChangeProtection));
    errors.collect(cdk.propertyValidator('subnetChangeProtection', cdk.validateBoolean)(properties.subnetChangeProtection));
    errors.collect(cdk.propertyValidator('subnetMappings', cdk.requiredValidator)(properties.subnetMappings));
    errors.collect(cdk.propertyValidator('subnetMappings', cdk.listValidator(CfnFirewall_SubnetMappingPropertyValidator))(properties.subnetMappings));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('vpcId', cdk.requiredValidator)(properties.vpcId));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "CfnFirewallProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::Firewall` resource
 *
 * @param properties - the TypeScript properties of a `CfnFirewallProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::Firewall` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPropsValidator(properties).assertSuccess();
    return {
        FirewallName: cdk.stringToCloudFormation(properties.firewallName),
        FirewallPolicyArn: cdk.stringToCloudFormation(properties.firewallPolicyArn),
        SubnetMappings: cdk.listMapper(cfnFirewallSubnetMappingPropertyToCloudFormation)(properties.subnetMappings),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
        DeleteProtection: cdk.booleanToCloudFormation(properties.deleteProtection),
        Description: cdk.stringToCloudFormation(properties.description),
        FirewallPolicyChangeProtection: cdk.booleanToCloudFormation(properties.firewallPolicyChangeProtection),
        SubnetChangeProtection: cdk.booleanToCloudFormation(properties.subnetChangeProtection),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFirewallPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallProps>();
    ret.addPropertyResult('firewallName', 'FirewallName', cfn_parse.FromCloudFormation.getString(properties.FirewallName));
    ret.addPropertyResult('firewallPolicyArn', 'FirewallPolicyArn', cfn_parse.FromCloudFormation.getString(properties.FirewallPolicyArn));
    ret.addPropertyResult('subnetMappings', 'SubnetMappings', cfn_parse.FromCloudFormation.getArray(CfnFirewallSubnetMappingPropertyFromCloudFormation)(properties.SubnetMappings));
    ret.addPropertyResult('vpcId', 'VpcId', cfn_parse.FromCloudFormation.getString(properties.VpcId));
    ret.addPropertyResult('deleteProtection', 'DeleteProtection', properties.DeleteProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteProtection) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('firewallPolicyChangeProtection', 'FirewallPolicyChangeProtection', properties.FirewallPolicyChangeProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FirewallPolicyChangeProtection) : undefined);
    ret.addPropertyResult('subnetChangeProtection', 'SubnetChangeProtection', properties.SubnetChangeProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SubnetChangeProtection) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::NetworkFirewall::Firewall`
 *
 * Use the `Firewall` to provide stateful, managed, network firewall and intrusion detection and prevention filtering for your VPCs in Amazon VPC .
 *
 * The firewall defines the configuration settings for an AWS Network Firewall firewall. The settings include the firewall policy, the subnets in your VPC to use for the firewall endpoints, and any tags that are attached to the firewall AWS resource.
 *
 * @cloudformationResource AWS::NetworkFirewall::Firewall
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html
 */
export class CfnFirewall extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkFirewall::Firewall";

    /**
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
        const ret = new CfnFirewall(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique IDs of the firewall endpoints for all of the subnets that you attached to the firewall. The subnets are not listed in any particular order. For example: `["us-west-2c:vpce-111122223333", "us-west-2a:vpce-987654321098", "us-west-2b:vpce-012345678901"]` .
     * @cloudformationAttribute EndpointIds
     */
    public readonly attrEndpointIds: string[];

    /**
     * The Amazon Resource Name (ARN) of the `Firewall` .
     * @cloudformationAttribute FirewallArn
     */
    public readonly attrFirewallArn: string;

    /**
     * The name of the `Firewall` resource.
     * @cloudformationAttribute FirewallId
     */
    public readonly attrFirewallId: string;

    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallname
     */
    public firewallName: string;

    /**
     * The Amazon Resource Name (ARN) of the firewall policy.
     *
     * The relationship of firewall to firewall policy is many to one. Each firewall requires one firewall policy association, and you can use the same firewall policy for multiple firewalls.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallpolicyarn
     */
    public firewallPolicyArn: string;

    /**
     * The public subnets that Network Firewall is using for the firewall. Each subnet must belong to a different Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-subnetmappings
     */
    public subnetMappings: Array<CfnFirewall.SubnetMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The unique identifier of the VPC where the firewall is in use. You can't change the VPC of a firewall after you create the firewall.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-vpcid
     */
    public vpcId: string;

    /**
     * A flag indicating whether it is possible to delete the firewall. A setting of `TRUE` indicates that the firewall is protected against deletion. Use this setting to protect against accidentally deleting a firewall that is in use. When you create a firewall, the operation initializes this flag to `TRUE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-deleteprotection
     */
    public deleteProtection: boolean | cdk.IResolvable | undefined;

    /**
     * A description of the firewall.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-description
     */
    public description: string | undefined;

    /**
     * A setting indicating whether the firewall is protected against a change to the firewall policy association. Use this setting to protect against accidentally modifying the firewall policy for a firewall that is in use. When you create a firewall, the operation initializes this setting to `TRUE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-firewallpolicychangeprotection
     */
    public firewallPolicyChangeProtection: boolean | cdk.IResolvable | undefined;

    /**
     * A setting indicating whether the firewall is protected against changes to the subnet associations. Use this setting to protect against accidentally modifying the subnet associations for a firewall that is in use. When you create a firewall, the operation initializes this setting to `TRUE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-subnetchangeprotection
     */
    public subnetChangeProtection: boolean | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewall.html#cfn-networkfirewall-firewall-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkFirewall::Firewall`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFirewallProps) {
        super(scope, id, { type: CfnFirewall.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'firewallName', this);
        cdk.requireProperty(props, 'firewallPolicyArn', this);
        cdk.requireProperty(props, 'subnetMappings', this);
        cdk.requireProperty(props, 'vpcId', this);
        this.attrEndpointIds = cdk.Token.asList(this.getAtt('EndpointIds', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrFirewallArn = cdk.Token.asString(this.getAtt('FirewallArn', cdk.ResolutionTypeHint.STRING));
        this.attrFirewallId = cdk.Token.asString(this.getAtt('FirewallId', cdk.ResolutionTypeHint.STRING));

        this.firewallName = props.firewallName;
        this.firewallPolicyArn = props.firewallPolicyArn;
        this.subnetMappings = props.subnetMappings;
        this.vpcId = props.vpcId;
        this.deleteProtection = props.deleteProtection;
        this.description = props.description;
        this.firewallPolicyChangeProtection = props.firewallPolicyChangeProtection;
        this.subnetChangeProtection = props.subnetChangeProtection;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkFirewall::Firewall", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFirewall.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            firewallName: this.firewallName,
            firewallPolicyArn: this.firewallPolicyArn,
            subnetMappings: this.subnetMappings,
            vpcId: this.vpcId,
            deleteProtection: this.deleteProtection,
            description: this.description,
            firewallPolicyChangeProtection: this.firewallPolicyChangeProtection,
            subnetChangeProtection: this.subnetChangeProtection,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFirewallPropsToCloudFormation(props);
    }
}

export namespace CfnFirewall {
    /**
     * The ID for a subnet that you want to associate with the firewall. AWS Network Firewall creates an instance of the associated firewall in each subnet that you specify, to filter traffic in the subnet's Availability Zone.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewall-subnetmapping.html
     */
    export interface SubnetMappingProperty {
        /**
         * The unique identifier for the subnet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewall-subnetmapping.html#cfn-networkfirewall-firewall-subnetmapping-subnetid
         */
        readonly subnetId: string;
    }
}

/**
 * Determine whether the given properties match those of a `SubnetMappingProperty`
 *
 * @param properties - the TypeScript properties of a `SubnetMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewall_SubnetMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('subnetId', cdk.requiredValidator)(properties.subnetId));
    errors.collect(cdk.propertyValidator('subnetId', cdk.validateString)(properties.subnetId));
    return errors.wrap('supplied properties not correct for "SubnetMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::Firewall.SubnetMapping` resource
 *
 * @param properties - the TypeScript properties of a `SubnetMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::Firewall.SubnetMapping` resource.
 */
// @ts-ignore TS6133
function cfnFirewallSubnetMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewall_SubnetMappingPropertyValidator(properties).assertSuccess();
    return {
        SubnetId: cdk.stringToCloudFormation(properties.subnetId),
    };
}

// @ts-ignore TS6133
function CfnFirewallSubnetMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewall.SubnetMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewall.SubnetMappingProperty>();
    ret.addPropertyResult('subnetId', 'SubnetId', cfn_parse.FromCloudFormation.getString(properties.SubnetId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFirewallPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html
 */
export interface CfnFirewallPolicyProps {

    /**
     * The traffic filtering behavior of a firewall policy, defined in a collection of stateless and stateful rule groups and other settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy
     */
    readonly firewallPolicy: CfnFirewallPolicy.FirewallPolicyProperty | cdk.IResolvable;

    /**
     * The descriptive name of the firewall policy. You can't change the name of a firewall policy after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicyname
     */
    readonly firewallPolicyName: string;

    /**
     * A description of the firewall policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnFirewallPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnFirewallPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('firewallPolicy', cdk.requiredValidator)(properties.firewallPolicy));
    errors.collect(cdk.propertyValidator('firewallPolicy', CfnFirewallPolicy_FirewallPolicyPropertyValidator)(properties.firewallPolicy));
    errors.collect(cdk.propertyValidator('firewallPolicyName', cdk.requiredValidator)(properties.firewallPolicyName));
    errors.collect(cdk.propertyValidator('firewallPolicyName', cdk.validateString)(properties.firewallPolicyName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnFirewallPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnFirewallPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicyPropsValidator(properties).assertSuccess();
    return {
        FirewallPolicy: cfnFirewallPolicyFirewallPolicyPropertyToCloudFormation(properties.firewallPolicy),
        FirewallPolicyName: cdk.stringToCloudFormation(properties.firewallPolicyName),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicyProps>();
    ret.addPropertyResult('firewallPolicy', 'FirewallPolicy', CfnFirewallPolicyFirewallPolicyPropertyFromCloudFormation(properties.FirewallPolicy));
    ret.addPropertyResult('firewallPolicyName', 'FirewallPolicyName', cfn_parse.FromCloudFormation.getString(properties.FirewallPolicyName));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::NetworkFirewall::FirewallPolicy`
 *
 * Use the `FirewallPolicy` to define the stateless and stateful network traffic filtering behavior for your `Firewall` . You can use one firewall policy for multiple firewalls.
 *
 * @cloudformationResource AWS::NetworkFirewall::FirewallPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html
 */
export class CfnFirewallPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkFirewall::FirewallPolicy";

    /**
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
        const ret = new CfnFirewallPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the `FirewallPolicy` .
     * @cloudformationAttribute FirewallPolicyArn
     */
    public readonly attrFirewallPolicyArn: string;

    /**
     * The unique ID of the `FirewallPolicy` resource.
     * @cloudformationAttribute FirewallPolicyId
     */
    public readonly attrFirewallPolicyId: string;

    /**
     * The traffic filtering behavior of a firewall policy, defined in a collection of stateless and stateful rule groups and other settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy
     */
    public firewallPolicy: CfnFirewallPolicy.FirewallPolicyProperty | cdk.IResolvable;

    /**
     * The descriptive name of the firewall policy. You can't change the name of a firewall policy after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicyname
     */
    public firewallPolicyName: string;

    /**
     * A description of the firewall policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkFirewall::FirewallPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFirewallPolicyProps) {
        super(scope, id, { type: CfnFirewallPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'firewallPolicy', this);
        cdk.requireProperty(props, 'firewallPolicyName', this);
        this.attrFirewallPolicyArn = cdk.Token.asString(this.getAtt('FirewallPolicyArn', cdk.ResolutionTypeHint.STRING));
        this.attrFirewallPolicyId = cdk.Token.asString(this.getAtt('FirewallPolicyId', cdk.ResolutionTypeHint.STRING));

        this.firewallPolicy = props.firewallPolicy;
        this.firewallPolicyName = props.firewallPolicyName;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkFirewall::FirewallPolicy", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFirewallPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            firewallPolicy: this.firewallPolicy,
            firewallPolicyName: this.firewallPolicyName,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFirewallPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnFirewallPolicy {
    /**
     * A custom action to use in stateless rule actions settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-actiondefinition.html
     */
    export interface ActionDefinitionProperty {
        /**
         * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet. This setting defines a CloudWatch dimension value to be published.
         *
         * You can pair this custom action with any of the standard stateless rule actions. For example, you could pair this in a rule action with the standard action that forwards the packet for stateful inspection. Then, when a packet matches the rule, Network Firewall publishes metrics for the packet and forwards it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-actiondefinition.html#cfn-networkfirewall-firewallpolicy-actiondefinition-publishmetricaction
         */
        readonly publishMetricAction?: CfnFirewallPolicy.PublishMetricActionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_ActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('publishMetricAction', CfnFirewallPolicy_PublishMetricActionPropertyValidator)(properties.publishMetricAction));
    return errors.wrap('supplied properties not correct for "ActionDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.ActionDefinition` resource
 *
 * @param properties - the TypeScript properties of a `ActionDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.ActionDefinition` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyActionDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_ActionDefinitionPropertyValidator(properties).assertSuccess();
    return {
        PublishMetricAction: cfnFirewallPolicyPublishMetricActionPropertyToCloudFormation(properties.publishMetricAction),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.ActionDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.ActionDefinitionProperty>();
    ret.addPropertyResult('publishMetricAction', 'PublishMetricAction', properties.PublishMetricAction != null ? CfnFirewallPolicyPublishMetricActionPropertyFromCloudFormation(properties.PublishMetricAction) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFirewallPolicy {
    /**
     * An optional, non-standard action to use for stateless packet handling. You can define this in addition to the standard action that you must specify.
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-customaction.html
     */
    export interface CustomActionProperty {
        /**
         * The custom action associated with the action name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-customaction.html#cfn-networkfirewall-firewallpolicy-customaction-actiondefinition
         */
        readonly actionDefinition: CfnFirewallPolicy.ActionDefinitionProperty | cdk.IResolvable;
        /**
         * The descriptive name of the custom action. You can't change the name of a custom action after you create it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-customaction.html#cfn-networkfirewall-firewallpolicy-customaction-actionname
         */
        readonly actionName: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomActionProperty`
 *
 * @param properties - the TypeScript properties of a `CustomActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_CustomActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionDefinition', cdk.requiredValidator)(properties.actionDefinition));
    errors.collect(cdk.propertyValidator('actionDefinition', CfnFirewallPolicy_ActionDefinitionPropertyValidator)(properties.actionDefinition));
    errors.collect(cdk.propertyValidator('actionName', cdk.requiredValidator)(properties.actionName));
    errors.collect(cdk.propertyValidator('actionName', cdk.validateString)(properties.actionName));
    return errors.wrap('supplied properties not correct for "CustomActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.CustomAction` resource
 *
 * @param properties - the TypeScript properties of a `CustomActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.CustomAction` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyCustomActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_CustomActionPropertyValidator(properties).assertSuccess();
    return {
        ActionDefinition: cfnFirewallPolicyActionDefinitionPropertyToCloudFormation(properties.actionDefinition),
        ActionName: cdk.stringToCloudFormation(properties.actionName),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyCustomActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.CustomActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.CustomActionProperty>();
    ret.addPropertyResult('actionDefinition', 'ActionDefinition', CfnFirewallPolicyActionDefinitionPropertyFromCloudFormation(properties.ActionDefinition));
    ret.addPropertyResult('actionName', 'ActionName', cfn_parse.FromCloudFormation.getString(properties.ActionName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFirewallPolicy {
    /**
     * The value to use in an Amazon CloudWatch custom metric dimension. This is used in the `PublishMetrics` custom action. A CloudWatch custom metric dimension is a name/value pair that's part of the identity of a metric.
     *
     * AWS Network Firewall sets the dimension name to `CustomAction` and you provide the dimension value.
     *
     * For more information about CloudWatch custom metric dimensions, see [Publishing Custom Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html#usingDimensions) in the [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-dimension.html
     */
    export interface DimensionProperty {
        /**
         * The value to use in the custom metric dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-dimension.html#cfn-networkfirewall-firewallpolicy-dimension-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_DimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "DimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.Dimension` resource
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.Dimension` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_DimensionPropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.DimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.DimensionProperty>();
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFirewallPolicy {
    /**
     * The traffic filtering behavior of a firewall policy, defined in a collection of stateless and stateful rule groups and other settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html
     */
    export interface FirewallPolicyProperty {
        /**
         * The default actions to take on a packet that doesn't match any stateful rules. The stateful default action is optional, and is only valid when using the strict rule order.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statefuldefaultactions
         */
        readonly statefulDefaultActions?: string[];
        /**
         * Additional options governing how Network Firewall handles stateful rules. The stateful rule groups that you use in your policy must have stateful rule options settings that are compatible with these settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statefulengineoptions
         */
        readonly statefulEngineOptions?: CfnFirewallPolicy.StatefulEngineOptionsProperty | cdk.IResolvable;
        /**
         * References to the stateful rule groups that are used in the policy. These define the inspection criteria in stateful rules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statefulrulegroupreferences
         */
        readonly statefulRuleGroupReferences?: Array<CfnFirewallPolicy.StatefulRuleGroupReferenceProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The custom action definitions that are available for use in the firewall policy's `StatelessDefaultActions` setting. You name each custom action that you define, and then you can use it by name in your default actions specifications.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statelesscustomactions
         */
        readonly statelessCustomActions?: Array<CfnFirewallPolicy.CustomActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The actions to take on a packet if it doesn't match any of the stateless rules in the policy. If you want non-matching packets to be forwarded for stateful inspection, specify `aws:forward_to_sfe` .
         *
         * You must specify one of the standard actions: `aws:pass` , `aws:drop` , or `aws:forward_to_sfe` . In addition, you can specify custom actions that are compatible with your standard section choice.
         *
         * For example, you could specify `["aws:pass"]` or you could specify `["aws:pass", “customActionName”]` . For information about compatibility, see the custom action descriptions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statelessdefaultactions
         */
        readonly statelessDefaultActions: string[];
        /**
         * The actions to take on a fragmented packet if it doesn't match any of the stateless rules in the policy. If you want non-matching fragmented packets to be forwarded for stateful inspection, specify `aws:forward_to_sfe` .
         *
         * You must specify one of the standard actions: `aws:pass` , `aws:drop` , or `aws:forward_to_sfe` . In addition, you can specify custom actions that are compatible with your standard section choice.
         *
         * For example, you could specify `["aws:pass"]` or you could specify `["aws:pass", “customActionName”]` . For information about compatibility, see the custom action descriptions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statelessfragmentdefaultactions
         */
        readonly statelessFragmentDefaultActions: string[];
        /**
         * References to the stateless rule groups that are used in the policy. These define the matching criteria in stateless rules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-firewallpolicy.html#cfn-networkfirewall-firewallpolicy-firewallpolicy-statelessrulegroupreferences
         */
        readonly statelessRuleGroupReferences?: Array<CfnFirewallPolicy.StatelessRuleGroupReferenceProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FirewallPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `FirewallPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_FirewallPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statefulDefaultActions', cdk.listValidator(cdk.validateString))(properties.statefulDefaultActions));
    errors.collect(cdk.propertyValidator('statefulEngineOptions', CfnFirewallPolicy_StatefulEngineOptionsPropertyValidator)(properties.statefulEngineOptions));
    errors.collect(cdk.propertyValidator('statefulRuleGroupReferences', cdk.listValidator(CfnFirewallPolicy_StatefulRuleGroupReferencePropertyValidator))(properties.statefulRuleGroupReferences));
    errors.collect(cdk.propertyValidator('statelessCustomActions', cdk.listValidator(CfnFirewallPolicy_CustomActionPropertyValidator))(properties.statelessCustomActions));
    errors.collect(cdk.propertyValidator('statelessDefaultActions', cdk.requiredValidator)(properties.statelessDefaultActions));
    errors.collect(cdk.propertyValidator('statelessDefaultActions', cdk.listValidator(cdk.validateString))(properties.statelessDefaultActions));
    errors.collect(cdk.propertyValidator('statelessFragmentDefaultActions', cdk.requiredValidator)(properties.statelessFragmentDefaultActions));
    errors.collect(cdk.propertyValidator('statelessFragmentDefaultActions', cdk.listValidator(cdk.validateString))(properties.statelessFragmentDefaultActions));
    errors.collect(cdk.propertyValidator('statelessRuleGroupReferences', cdk.listValidator(CfnFirewallPolicy_StatelessRuleGroupReferencePropertyValidator))(properties.statelessRuleGroupReferences));
    return errors.wrap('supplied properties not correct for "FirewallPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.FirewallPolicy` resource
 *
 * @param properties - the TypeScript properties of a `FirewallPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.FirewallPolicy` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyFirewallPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_FirewallPolicyPropertyValidator(properties).assertSuccess();
    return {
        StatefulDefaultActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.statefulDefaultActions),
        StatefulEngineOptions: cfnFirewallPolicyStatefulEngineOptionsPropertyToCloudFormation(properties.statefulEngineOptions),
        StatefulRuleGroupReferences: cdk.listMapper(cfnFirewallPolicyStatefulRuleGroupReferencePropertyToCloudFormation)(properties.statefulRuleGroupReferences),
        StatelessCustomActions: cdk.listMapper(cfnFirewallPolicyCustomActionPropertyToCloudFormation)(properties.statelessCustomActions),
        StatelessDefaultActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.statelessDefaultActions),
        StatelessFragmentDefaultActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.statelessFragmentDefaultActions),
        StatelessRuleGroupReferences: cdk.listMapper(cfnFirewallPolicyStatelessRuleGroupReferencePropertyToCloudFormation)(properties.statelessRuleGroupReferences),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyFirewallPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.FirewallPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.FirewallPolicyProperty>();
    ret.addPropertyResult('statefulDefaultActions', 'StatefulDefaultActions', properties.StatefulDefaultActions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.StatefulDefaultActions) : undefined);
    ret.addPropertyResult('statefulEngineOptions', 'StatefulEngineOptions', properties.StatefulEngineOptions != null ? CfnFirewallPolicyStatefulEngineOptionsPropertyFromCloudFormation(properties.StatefulEngineOptions) : undefined);
    ret.addPropertyResult('statefulRuleGroupReferences', 'StatefulRuleGroupReferences', properties.StatefulRuleGroupReferences != null ? cfn_parse.FromCloudFormation.getArray(CfnFirewallPolicyStatefulRuleGroupReferencePropertyFromCloudFormation)(properties.StatefulRuleGroupReferences) : undefined);
    ret.addPropertyResult('statelessCustomActions', 'StatelessCustomActions', properties.StatelessCustomActions != null ? cfn_parse.FromCloudFormation.getArray(CfnFirewallPolicyCustomActionPropertyFromCloudFormation)(properties.StatelessCustomActions) : undefined);
    ret.addPropertyResult('statelessDefaultActions', 'StatelessDefaultActions', cfn_parse.FromCloudFormation.getStringArray(properties.StatelessDefaultActions));
    ret.addPropertyResult('statelessFragmentDefaultActions', 'StatelessFragmentDefaultActions', cfn_parse.FromCloudFormation.getStringArray(properties.StatelessFragmentDefaultActions));
    ret.addPropertyResult('statelessRuleGroupReferences', 'StatelessRuleGroupReferences', properties.StatelessRuleGroupReferences != null ? cfn_parse.FromCloudFormation.getArray(CfnFirewallPolicyStatelessRuleGroupReferencePropertyFromCloudFormation)(properties.StatelessRuleGroupReferences) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFirewallPolicy {
    /**
     * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet. This setting defines a CloudWatch dimension value to be published.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-publishmetricaction.html
     */
    export interface PublishMetricActionProperty {
        /**
         * `CfnFirewallPolicy.PublishMetricActionProperty.Dimensions`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-publishmetricaction.html#cfn-networkfirewall-firewallpolicy-publishmetricaction-dimensions
         */
        readonly dimensions: Array<CfnFirewallPolicy.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PublishMetricActionProperty`
 *
 * @param properties - the TypeScript properties of a `PublishMetricActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_PublishMetricActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensions', cdk.requiredValidator)(properties.dimensions));
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnFirewallPolicy_DimensionPropertyValidator))(properties.dimensions));
    return errors.wrap('supplied properties not correct for "PublishMetricActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.PublishMetricAction` resource
 *
 * @param properties - the TypeScript properties of a `PublishMetricActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.PublishMetricAction` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyPublishMetricActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_PublishMetricActionPropertyValidator(properties).assertSuccess();
    return {
        Dimensions: cdk.listMapper(cfnFirewallPolicyDimensionPropertyToCloudFormation)(properties.dimensions),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyPublishMetricActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.PublishMetricActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.PublishMetricActionProperty>();
    ret.addPropertyResult('dimensions', 'Dimensions', cfn_parse.FromCloudFormation.getArray(CfnFirewallPolicyDimensionPropertyFromCloudFormation)(properties.Dimensions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFirewallPolicy {
    /**
     * Configuration settings for the handling of the stateful rule groups in a firewall policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulengineoptions.html
     */
    export interface StatefulEngineOptionsProperty {
        /**
         * Indicates how to manage the order of stateful rule evaluation for the policy. `DEFAULT_ACTION_ORDER` is the default behavior. Stateful rules are provided to the rule engine as Suricata compatible strings, and Suricata evaluates them based on certain settings. For more information, see [Evaluation order for stateful rules](https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html) in the *AWS Network Firewall Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulengineoptions.html#cfn-networkfirewall-firewallpolicy-statefulengineoptions-ruleorder
         */
        readonly ruleOrder?: string;
        /**
         * Configures how Network Firewall processes traffic when a network connection breaks midstream. Network connections can break due to disruptions in external networks or within the firewall itself.
         *
         * - `DROP` - Network Firewall fails closed and drops all subsequent traffic going to the firewall. This is the default behavior.
         * - `CONTINUE` - Network Firewall continues to apply rules to the subsequent traffic without context from traffic before the break. This impacts the behavior of rules that depend on this context. For example, if you have a stateful rule to `drop http` traffic, Network Firewall won't match the traffic for this rule because the service won't have the context from session initialization defining the application layer protocol as HTTP. However, this behavior is rule dependent—a TCP-layer rule using a `flow:stateless` rule would still match, as would the `aws:drop_strict` default action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulengineoptions.html#cfn-networkfirewall-firewallpolicy-statefulengineoptions-streamexceptionpolicy
         */
        readonly streamExceptionPolicy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StatefulEngineOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulEngineOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_StatefulEngineOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ruleOrder', cdk.validateString)(properties.ruleOrder));
    errors.collect(cdk.propertyValidator('streamExceptionPolicy', cdk.validateString)(properties.streamExceptionPolicy));
    return errors.wrap('supplied properties not correct for "StatefulEngineOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.StatefulEngineOptions` resource
 *
 * @param properties - the TypeScript properties of a `StatefulEngineOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.StatefulEngineOptions` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyStatefulEngineOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_StatefulEngineOptionsPropertyValidator(properties).assertSuccess();
    return {
        RuleOrder: cdk.stringToCloudFormation(properties.ruleOrder),
        StreamExceptionPolicy: cdk.stringToCloudFormation(properties.streamExceptionPolicy),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyStatefulEngineOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.StatefulEngineOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.StatefulEngineOptionsProperty>();
    ret.addPropertyResult('ruleOrder', 'RuleOrder', properties.RuleOrder != null ? cfn_parse.FromCloudFormation.getString(properties.RuleOrder) : undefined);
    ret.addPropertyResult('streamExceptionPolicy', 'StreamExceptionPolicy', properties.StreamExceptionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.StreamExceptionPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFirewallPolicy {
    /**
     * The setting that allows the policy owner to change the behavior of the rule group within a policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupoverride.html
     */
    export interface StatefulRuleGroupOverrideProperty {
        /**
         * The action that changes the rule group from `DROP` to `ALERT` . This only applies to managed rule groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupoverride.html#cfn-networkfirewall-firewallpolicy-statefulrulegroupoverride-action
         */
        readonly action?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StatefulRuleGroupOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulRuleGroupOverrideProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_StatefulRuleGroupOverridePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    return errors.wrap('supplied properties not correct for "StatefulRuleGroupOverrideProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.StatefulRuleGroupOverride` resource
 *
 * @param properties - the TypeScript properties of a `StatefulRuleGroupOverrideProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.StatefulRuleGroupOverride` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyStatefulRuleGroupOverridePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_StatefulRuleGroupOverridePropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyStatefulRuleGroupOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.StatefulRuleGroupOverrideProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.StatefulRuleGroupOverrideProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFirewallPolicy {
    /**
     * Identifier for a single stateful rule group, used in a firewall policy to refer to a rule group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupreference.html
     */
    export interface StatefulRuleGroupReferenceProperty {
        /**
         * The action that allows the policy owner to override the behavior of the rule group within a policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statefulrulegroupreference-override
         */
        readonly override?: CfnFirewallPolicy.StatefulRuleGroupOverrideProperty | cdk.IResolvable;
        /**
         * An integer setting that indicates the order in which to run the stateful rule groups in a single `FirewallPolicy` . This setting only applies to firewall policies that specify the `STRICT_ORDER` rule order in the stateful engine options settings.
         *
         * Network Firewall evalutes each stateful rule group against a packet starting with the group that has the lowest priority setting. You must ensure that the priority settings are unique within each policy.
         *
         * You can change the priority settings of your rule groups at any time. To make it easier to insert rule groups later, number them so there's a wide range in between, for example use 100, 200, and so on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statefulrulegroupreference-priority
         */
        readonly priority?: number;
        /**
         * The Amazon Resource Name (ARN) of the stateful rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statefulrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statefulrulegroupreference-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `StatefulRuleGroupReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulRuleGroupReferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_StatefulRuleGroupReferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('override', CfnFirewallPolicy_StatefulRuleGroupOverridePropertyValidator)(properties.override));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "StatefulRuleGroupReferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.StatefulRuleGroupReference` resource
 *
 * @param properties - the TypeScript properties of a `StatefulRuleGroupReferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.StatefulRuleGroupReference` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyStatefulRuleGroupReferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_StatefulRuleGroupReferencePropertyValidator(properties).assertSuccess();
    return {
        Override: cfnFirewallPolicyStatefulRuleGroupOverridePropertyToCloudFormation(properties.override),
        Priority: cdk.numberToCloudFormation(properties.priority),
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyStatefulRuleGroupReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.StatefulRuleGroupReferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.StatefulRuleGroupReferenceProperty>();
    ret.addPropertyResult('override', 'Override', properties.Override != null ? CfnFirewallPolicyStatefulRuleGroupOverridePropertyFromCloudFormation(properties.Override) : undefined);
    ret.addPropertyResult('priority', 'Priority', properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined);
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFirewallPolicy {
    /**
     * Identifier for a single stateless rule group, used in a firewall policy to refer to the rule group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statelessrulegroupreference.html
     */
    export interface StatelessRuleGroupReferenceProperty {
        /**
         * An integer setting that indicates the order in which to run the stateless rule groups in a single `FirewallPolicy` . Network Firewall applies each stateless rule group to a packet starting with the group that has the lowest priority setting. You must ensure that the priority settings are unique within each policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statelessrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statelessrulegroupreference-priority
         */
        readonly priority: number;
        /**
         * The Amazon Resource Name (ARN) of the stateless rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-firewallpolicy-statelessrulegroupreference.html#cfn-networkfirewall-firewallpolicy-statelessrulegroupreference-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `StatelessRuleGroupReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `StatelessRuleGroupReferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnFirewallPolicy_StatelessRuleGroupReferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "StatelessRuleGroupReferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.StatelessRuleGroupReference` resource
 *
 * @param properties - the TypeScript properties of a `StatelessRuleGroupReferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::FirewallPolicy.StatelessRuleGroupReference` resource.
 */
// @ts-ignore TS6133
function cfnFirewallPolicyStatelessRuleGroupReferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFirewallPolicy_StatelessRuleGroupReferencePropertyValidator(properties).assertSuccess();
    return {
        Priority: cdk.numberToCloudFormation(properties.priority),
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnFirewallPolicyStatelessRuleGroupReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFirewallPolicy.StatelessRuleGroupReferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFirewallPolicy.StatelessRuleGroupReferenceProperty>();
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLoggingConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html
 */
export interface CfnLoggingConfigurationProps {

    /**
     * The Amazon Resource Name (ARN) of the `Firewall` that the logging configuration is associated with. You can't change the firewall specification after you create the logging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-firewallarn
     */
    readonly firewallArn: string;

    /**
     * Defines how AWS Network Firewall performs logging for a `Firewall` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-loggingconfiguration
     */
    readonly loggingConfiguration: CfnLoggingConfiguration.LoggingConfigurationProperty | cdk.IResolvable;

    /**
     * The name of the firewall that the logging configuration is associated with. You can't change the firewall specification after you create the logging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-firewallname
     */
    readonly firewallName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLoggingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoggingConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('firewallArn', cdk.requiredValidator)(properties.firewallArn));
    errors.collect(cdk.propertyValidator('firewallArn', cdk.validateString)(properties.firewallArn));
    errors.collect(cdk.propertyValidator('firewallName', cdk.validateString)(properties.firewallName));
    errors.collect(cdk.propertyValidator('loggingConfiguration', cdk.requiredValidator)(properties.loggingConfiguration));
    errors.collect(cdk.propertyValidator('loggingConfiguration', CfnLoggingConfiguration_LoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
    return errors.wrap('supplied properties not correct for "CfnLoggingConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::LoggingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnLoggingConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::LoggingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfigurationPropsValidator(properties).assertSuccess();
    return {
        FirewallArn: cdk.stringToCloudFormation(properties.firewallArn),
        LoggingConfiguration: cfnLoggingConfigurationLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration),
        FirewallName: cdk.stringToCloudFormation(properties.firewallName),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfigurationProps>();
    ret.addPropertyResult('firewallArn', 'FirewallArn', cfn_parse.FromCloudFormation.getString(properties.FirewallArn));
    ret.addPropertyResult('loggingConfiguration', 'LoggingConfiguration', CfnLoggingConfigurationLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration));
    ret.addPropertyResult('firewallName', 'FirewallName', properties.FirewallName != null ? cfn_parse.FromCloudFormation.getString(properties.FirewallName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::NetworkFirewall::LoggingConfiguration`
 *
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
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html
 */
export class CfnLoggingConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkFirewall::LoggingConfiguration";

    /**
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
        const ret = new CfnLoggingConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the `Firewall` that the logging configuration is associated with. You can't change the firewall specification after you create the logging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-firewallarn
     */
    public firewallArn: string;

    /**
     * Defines how AWS Network Firewall performs logging for a `Firewall` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-loggingconfiguration
     */
    public loggingConfiguration: CfnLoggingConfiguration.LoggingConfigurationProperty | cdk.IResolvable;

    /**
     * The name of the firewall that the logging configuration is associated with. You can't change the firewall specification after you create the logging configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-firewallname
     */
    public firewallName: string | undefined;

    /**
     * Create a new `AWS::NetworkFirewall::LoggingConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLoggingConfigurationProps) {
        super(scope, id, { type: CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'firewallArn', this);
        cdk.requireProperty(props, 'loggingConfiguration', this);

        this.firewallArn = props.firewallArn;
        this.loggingConfiguration = props.loggingConfiguration;
        this.firewallName = props.firewallName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            firewallArn: this.firewallArn,
            loggingConfiguration: this.loggingConfiguration,
            firewallName: this.firewallName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLoggingConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnLoggingConfiguration {
    /**
     * Defines where AWS Network Firewall sends logs for the firewall for one log type. This is used in `LoggingConfiguration` . You can send each type of log to an Amazon S3 bucket, a CloudWatch log group, or a Kinesis Data Firehose delivery stream.
     *
     * Network Firewall generates logs for stateful rule groups. You can save alert and flow log types. The stateful rules engine records flow logs for all network traffic that it receives. It records alert logs for traffic that matches stateful rules that have the rule action set to `DROP` or `ALERT` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-logdestinationconfig.html
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-logdestinationconfig.html#cfn-networkfirewall-loggingconfiguration-logdestinationconfig-logdestination
         */
        readonly logDestination: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The type of storage destination to send these logs to. You can send logs to an Amazon S3 bucket, a CloudWatch log group, or a Kinesis Data Firehose delivery stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-logdestinationconfig.html#cfn-networkfirewall-loggingconfiguration-logdestinationconfig-logdestinationtype
         */
        readonly logDestinationType: string;
        /**
         * The type of log to send. Alert logs report traffic that matches a stateful rule with an action setting that sends an alert log message. Flow logs are standard network traffic flow logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-logdestinationconfig.html#cfn-networkfirewall-loggingconfiguration-logdestinationconfig-logtype
         */
        readonly logType: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogDestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LogDestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_LogDestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logDestination', cdk.requiredValidator)(properties.logDestination));
    errors.collect(cdk.propertyValidator('logDestination', cdk.hashValidator(cdk.validateString))(properties.logDestination));
    errors.collect(cdk.propertyValidator('logDestinationType', cdk.requiredValidator)(properties.logDestinationType));
    errors.collect(cdk.propertyValidator('logDestinationType', cdk.validateString)(properties.logDestinationType));
    errors.collect(cdk.propertyValidator('logType', cdk.requiredValidator)(properties.logType));
    errors.collect(cdk.propertyValidator('logType', cdk.validateString)(properties.logType));
    return errors.wrap('supplied properties not correct for "LogDestinationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::LoggingConfiguration.LogDestinationConfig` resource
 *
 * @param properties - the TypeScript properties of a `LogDestinationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::LoggingConfiguration.LogDestinationConfig` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationLogDestinationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_LogDestinationConfigPropertyValidator(properties).assertSuccess();
    return {
        LogDestination: cdk.hashMapper(cdk.stringToCloudFormation)(properties.logDestination),
        LogDestinationType: cdk.stringToCloudFormation(properties.logDestinationType),
        LogType: cdk.stringToCloudFormation(properties.logType),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationLogDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.LogDestinationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.LogDestinationConfigProperty>();
    ret.addPropertyResult('logDestination', 'LogDestination', cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.LogDestination));
    ret.addPropertyResult('logDestinationType', 'LogDestinationType', cfn_parse.FromCloudFormation.getString(properties.LogDestinationType));
    ret.addPropertyResult('logType', 'LogType', cfn_parse.FromCloudFormation.getString(properties.LogType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
    /**
     * Defines how AWS Network Firewall performs logging for a `Firewall` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-loggingconfiguration.html
     */
    export interface LoggingConfigurationProperty {
        /**
         * Defines the logging destinations for the logs for a firewall. Network Firewall generates logs for stateful rule groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-loggingconfiguration-loggingconfiguration.html#cfn-networkfirewall-loggingconfiguration-loggingconfiguration-logdestinationconfigs
         */
        readonly logDestinationConfigs: Array<CfnLoggingConfiguration.LogDestinationConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_LoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logDestinationConfigs', cdk.requiredValidator)(properties.logDestinationConfigs));
    errors.collect(cdk.propertyValidator('logDestinationConfigs', cdk.listValidator(CfnLoggingConfiguration_LogDestinationConfigPropertyValidator))(properties.logDestinationConfigs));
    return errors.wrap('supplied properties not correct for "LoggingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::LoggingConfiguration.LoggingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::LoggingConfiguration.LoggingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationLoggingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_LoggingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        LogDestinationConfigs: cdk.listMapper(cfnLoggingConfigurationLogDestinationConfigPropertyToCloudFormation)(properties.logDestinationConfigs),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.LoggingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.LoggingConfigurationProperty>();
    ret.addPropertyResult('logDestinationConfigs', 'LogDestinationConfigs', cfn_parse.FromCloudFormation.getArray(CfnLoggingConfigurationLogDestinationConfigPropertyFromCloudFormation)(properties.LogDestinationConfigs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRuleGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html
 */
export interface CfnRuleGroupProps {

    /**
     * The maximum operating resources that this rule group can use. You can't change a rule group's capacity setting after you create the rule group. When you update a rule group, you are limited to this capacity. When you reference a rule group from a firewall policy, Network Firewall reserves this capacity for the rule group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-capacity
     */
    readonly capacity: number;

    /**
     * The descriptive name of the rule group. You can't change the name of a rule group after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroupname
     */
    readonly ruleGroupName: string;

    /**
     * Indicates whether the rule group is stateless or stateful. If the rule group is stateless, it contains
     * stateless rules. If it is stateful, it contains stateful rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-type
     */
    readonly type: string;

    /**
     * A description of the rule group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-description
     */
    readonly description?: string;

    /**
     * An object that defines the rule group rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup
     */
    readonly ruleGroup?: CfnRuleGroup.RuleGroupProperty | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnRuleGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('capacity', cdk.requiredValidator)(properties.capacity));
    errors.collect(cdk.propertyValidator('capacity', cdk.validateNumber)(properties.capacity));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('ruleGroup', CfnRuleGroup_RuleGroupPropertyValidator)(properties.ruleGroup));
    errors.collect(cdk.propertyValidator('ruleGroupName', cdk.requiredValidator)(properties.ruleGroupName));
    errors.collect(cdk.propertyValidator('ruleGroupName', cdk.validateString)(properties.ruleGroupName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnRuleGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroupPropsValidator(properties).assertSuccess();
    return {
        Capacity: cdk.numberToCloudFormation(properties.capacity),
        RuleGroupName: cdk.stringToCloudFormation(properties.ruleGroupName),
        Type: cdk.stringToCloudFormation(properties.type),
        Description: cdk.stringToCloudFormation(properties.description),
        RuleGroup: cfnRuleGroupRuleGroupPropertyToCloudFormation(properties.ruleGroup),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroupProps>();
    ret.addPropertyResult('capacity', 'Capacity', cfn_parse.FromCloudFormation.getNumber(properties.Capacity));
    ret.addPropertyResult('ruleGroupName', 'RuleGroupName', cfn_parse.FromCloudFormation.getString(properties.RuleGroupName));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('ruleGroup', 'RuleGroup', properties.RuleGroup != null ? CfnRuleGroupRuleGroupPropertyFromCloudFormation(properties.RuleGroup) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::NetworkFirewall::RuleGroup`
 *
 * Use the `RuleGroup` to define a reusable collection of stateless or stateful network traffic filtering rules. You use rule groups in an `FirewallPolicy` to specify the filtering behavior of an `Firewall` .
 *
 * @cloudformationResource AWS::NetworkFirewall::RuleGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html
 */
export class CfnRuleGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkFirewall::RuleGroup";

    /**
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
        const ret = new CfnRuleGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the `RuleGroup` .
     * @cloudformationAttribute RuleGroupArn
     */
    public readonly attrRuleGroupArn: string;

    /**
     * The unique ID of the `RuleGroup` resource.
     * @cloudformationAttribute RuleGroupId
     */
    public readonly attrRuleGroupId: string;

    /**
     * The maximum operating resources that this rule group can use. You can't change a rule group's capacity setting after you create the rule group. When you update a rule group, you are limited to this capacity. When you reference a rule group from a firewall policy, Network Firewall reserves this capacity for the rule group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-capacity
     */
    public capacity: number;

    /**
     * The descriptive name of the rule group. You can't change the name of a rule group after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroupname
     */
    public ruleGroupName: string;

    /**
     * Indicates whether the rule group is stateless or stateful. If the rule group is stateless, it contains
     * stateless rules. If it is stateful, it contains stateful rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-type
     */
    public type: string;

    /**
     * A description of the rule group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-description
     */
    public description: string | undefined;

    /**
     * An object that defines the rule group rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup
     */
    public ruleGroup: CfnRuleGroup.RuleGroupProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkfirewall-rulegroup.html#cfn-networkfirewall-rulegroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkFirewall::RuleGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRuleGroupProps) {
        super(scope, id, { type: CfnRuleGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'capacity', this);
        cdk.requireProperty(props, 'ruleGroupName', this);
        cdk.requireProperty(props, 'type', this);
        this.attrRuleGroupArn = cdk.Token.asString(this.getAtt('RuleGroupArn', cdk.ResolutionTypeHint.STRING));
        this.attrRuleGroupId = cdk.Token.asString(this.getAtt('RuleGroupId', cdk.ResolutionTypeHint.STRING));

        this.capacity = props.capacity;
        this.ruleGroupName = props.ruleGroupName;
        this.type = props.type;
        this.description = props.description;
        this.ruleGroup = props.ruleGroup;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkFirewall::RuleGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRuleGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            capacity: this.capacity,
            ruleGroupName: this.ruleGroupName,
            type: this.type,
            description: this.description,
            ruleGroup: this.ruleGroup,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRuleGroupPropsToCloudFormation(props);
    }
}

export namespace CfnRuleGroup {
    /**
     * A custom action to use in stateless rule actions settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-actiondefinition.html
     */
    export interface ActionDefinitionProperty {
        /**
         * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet. This setting defines a CloudWatch dimension value to be published.
         *
         * You can pair this custom action with any of the standard stateless rule actions. For example, you could pair this in a rule action with the standard action that forwards the packet for stateful inspection. Then, when a packet matches the rule, Network Firewall publishes metrics for the packet and forwards it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-actiondefinition.html#cfn-networkfirewall-rulegroup-actiondefinition-publishmetricaction
         */
        readonly publishMetricAction?: CfnRuleGroup.PublishMetricActionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_ActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('publishMetricAction', CfnRuleGroup_PublishMetricActionPropertyValidator)(properties.publishMetricAction));
    return errors.wrap('supplied properties not correct for "ActionDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.ActionDefinition` resource
 *
 * @param properties - the TypeScript properties of a `ActionDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.ActionDefinition` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupActionDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_ActionDefinitionPropertyValidator(properties).assertSuccess();
    return {
        PublishMetricAction: cfnRuleGroupPublishMetricActionPropertyToCloudFormation(properties.publishMetricAction),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ActionDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ActionDefinitionProperty>();
    ret.addPropertyResult('publishMetricAction', 'PublishMetricAction', properties.PublishMetricAction != null ? CfnRuleGroupPublishMetricActionPropertyFromCloudFormation(properties.PublishMetricAction) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A single IP address specification. This is used in the `RuleGroup.MatchAttributes` source and destination specifications.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-address.html
     */
    export interface AddressProperty {
        /**
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-address.html#cfn-networkfirewall-rulegroup-address-addressdefinition
         */
        readonly addressDefinition: string;
    }
}

/**
 * Determine whether the given properties match those of a `AddressProperty`
 *
 * @param properties - the TypeScript properties of a `AddressProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_AddressPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addressDefinition', cdk.requiredValidator)(properties.addressDefinition));
    errors.collect(cdk.propertyValidator('addressDefinition', cdk.validateString)(properties.addressDefinition));
    return errors.wrap('supplied properties not correct for "AddressProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.Address` resource
 *
 * @param properties - the TypeScript properties of a `AddressProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.Address` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupAddressPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_AddressPropertyValidator(properties).assertSuccess();
    return {
        AddressDefinition: cdk.stringToCloudFormation(properties.addressDefinition),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupAddressPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.AddressProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.AddressProperty>();
    ret.addPropertyResult('addressDefinition', 'AddressDefinition', cfn_parse.FromCloudFormation.getString(properties.AddressDefinition));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * An optional, non-standard action to use for stateless packet handling. You can define this in addition to the standard action that you must specify.
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-customaction.html
     */
    export interface CustomActionProperty {
        /**
         * The custom action associated with the action name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-customaction.html#cfn-networkfirewall-rulegroup-customaction-actiondefinition
         */
        readonly actionDefinition: CfnRuleGroup.ActionDefinitionProperty | cdk.IResolvable;
        /**
         * The descriptive name of the custom action. You can't change the name of a custom action after you create it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-customaction.html#cfn-networkfirewall-rulegroup-customaction-actionname
         */
        readonly actionName: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomActionProperty`
 *
 * @param properties - the TypeScript properties of a `CustomActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CustomActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionDefinition', cdk.requiredValidator)(properties.actionDefinition));
    errors.collect(cdk.propertyValidator('actionDefinition', CfnRuleGroup_ActionDefinitionPropertyValidator)(properties.actionDefinition));
    errors.collect(cdk.propertyValidator('actionName', cdk.requiredValidator)(properties.actionName));
    errors.collect(cdk.propertyValidator('actionName', cdk.validateString)(properties.actionName));
    return errors.wrap('supplied properties not correct for "CustomActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.CustomAction` resource
 *
 * @param properties - the TypeScript properties of a `CustomActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.CustomAction` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCustomActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CustomActionPropertyValidator(properties).assertSuccess();
    return {
        ActionDefinition: cfnRuleGroupActionDefinitionPropertyToCloudFormation(properties.actionDefinition),
        ActionName: cdk.stringToCloudFormation(properties.actionName),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomActionProperty>();
    ret.addPropertyResult('actionDefinition', 'ActionDefinition', CfnRuleGroupActionDefinitionPropertyFromCloudFormation(properties.ActionDefinition));
    ret.addPropertyResult('actionName', 'ActionName', cfn_parse.FromCloudFormation.getString(properties.ActionName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The value to use in an Amazon CloudWatch custom metric dimension. This is used in the `PublishMetrics` custom action. A CloudWatch custom metric dimension is a name/value pair that's part of the identity of a metric.
     *
     * AWS Network Firewall sets the dimension name to `CustomAction` and you provide the dimension value.
     *
     * For more information about CloudWatch custom metric dimensions, see [Publishing Custom Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html#usingDimensions) in the [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-dimension.html
     */
    export interface DimensionProperty {
        /**
         * The value to use in the custom metric dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-dimension.html#cfn-networkfirewall-rulegroup-dimension-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_DimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "DimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.Dimension` resource
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.Dimension` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_DimensionPropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.DimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.DimensionProperty>();
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The 5-tuple criteria for AWS Network Firewall to use to inspect packet headers in stateful traffic flow inspection. Traffic flows that match the criteria are a match for the corresponding stateful rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html
     */
    export interface HeaderProperty {
        /**
         * The destination IP address or address range to inspect for, in CIDR notation. To match with any address, specify `ANY` .
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-destination
         */
        readonly destination: string;
        /**
         * The destination port to inspect for. You can specify an individual port, for example `1994` and you can specify a port range, for example `1990:1994` . To match with any port, specify `ANY` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-destinationport
         */
        readonly destinationPort: string;
        /**
         * The direction of traffic flow to inspect. If set to `ANY` , the inspection matches bidirectional traffic, both from the source to the destination and from the destination to the source. If set to `FORWARD` , the inspection only matches traffic going from the source to the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-direction
         */
        readonly direction: string;
        /**
         * The protocol to inspect for. To specify all, you can use `IP` , because all traffic on AWS and on the internet is IP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-protocol
         */
        readonly protocol: string;
        /**
         * The source IP address or address range to inspect for, in CIDR notation. To match with any address, specify `ANY` .
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-source
         */
        readonly source: string;
        /**
         * The source port to inspect for. You can specify an individual port, for example `1994` and you can specify a port range, for example `1990:1994` . To match with any port, specify `ANY` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-header.html#cfn-networkfirewall-rulegroup-header-sourceport
         */
        readonly sourcePort: string;
    }
}

/**
 * Determine whether the given properties match those of a `HeaderProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_HeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    errors.collect(cdk.propertyValidator('destinationPort', cdk.requiredValidator)(properties.destinationPort));
    errors.collect(cdk.propertyValidator('destinationPort', cdk.validateString)(properties.destinationPort));
    errors.collect(cdk.propertyValidator('direction', cdk.requiredValidator)(properties.direction));
    errors.collect(cdk.propertyValidator('direction', cdk.validateString)(properties.direction));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('source', cdk.requiredValidator)(properties.source));
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    errors.collect(cdk.propertyValidator('sourcePort', cdk.requiredValidator)(properties.sourcePort));
    errors.collect(cdk.propertyValidator('sourcePort', cdk.validateString)(properties.sourcePort));
    return errors.wrap('supplied properties not correct for "HeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.Header` resource
 *
 * @param properties - the TypeScript properties of a `HeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.Header` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_HeaderPropertyValidator(properties).assertSuccess();
    return {
        Destination: cdk.stringToCloudFormation(properties.destination),
        DestinationPort: cdk.stringToCloudFormation(properties.destinationPort),
        Direction: cdk.stringToCloudFormation(properties.direction),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        Source: cdk.stringToCloudFormation(properties.source),
        SourcePort: cdk.stringToCloudFormation(properties.sourcePort),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.HeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.HeaderProperty>();
    ret.addPropertyResult('destination', 'Destination', cfn_parse.FromCloudFormation.getString(properties.Destination));
    ret.addPropertyResult('destinationPort', 'DestinationPort', cfn_parse.FromCloudFormation.getString(properties.DestinationPort));
    ret.addPropertyResult('direction', 'Direction', cfn_parse.FromCloudFormation.getString(properties.Direction));
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addPropertyResult('source', 'Source', cfn_parse.FromCloudFormation.getString(properties.Source));
    ret.addPropertyResult('sourcePort', 'SourcePort', cfn_parse.FromCloudFormation.getString(properties.SourcePort));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A list of IP addresses and address ranges, in CIDR notation. This is part of a `RuleGroup.RuleVariables` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ipset.html
     */
    export interface IPSetProperty {
        /**
         * The list of IP addresses and address ranges, in CIDR notation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ipset.html#cfn-networkfirewall-rulegroup-ipset-definition
         */
        readonly definition?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `IPSetProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_IPSetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('definition', cdk.listValidator(cdk.validateString))(properties.definition));
    return errors.wrap('supplied properties not correct for "IPSetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.IPSet` resource
 *
 * @param properties - the TypeScript properties of a `IPSetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.IPSet` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupIPSetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_IPSetPropertyValidator(properties).assertSuccess();
    return {
        Definition: cdk.listMapper(cdk.stringToCloudFormation)(properties.definition),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupIPSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.IPSetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.IPSetProperty>();
    ret.addPropertyResult('definition', 'Definition', properties.Definition != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Definition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Configures one or more `IPSetReferences` for a Suricata-compatible rule group. An IP set reference is a rule variable that references a resource that you create and manage in another AWS service, such as an Amazon VPC prefix list. Network Firewall IP set references enable you to dynamically update the contents of your rules. When you create, update, or delete the IP set you are referencing in your rule, Network Firewall automatically updates the rule's content with the changes. For more information about IP set references in Network Firewall , see [Using IP set references](https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-groups-ip-set-references.html) in the *Network Firewall Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ipsetreference.html
     */
    export interface IPSetReferenceProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource to include in the `RuleGroup.IPSetReference` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ipsetreference.html#cfn-networkfirewall-rulegroup-ipsetreference-referencearn
         */
        readonly referenceArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `IPSetReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_IPSetReferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('referenceArn', cdk.validateString)(properties.referenceArn));
    return errors.wrap('supplied properties not correct for "IPSetReferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.IPSetReference` resource
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.IPSetReference` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupIPSetReferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_IPSetReferencePropertyValidator(properties).assertSuccess();
    return {
        ReferenceArn: cdk.stringToCloudFormation(properties.referenceArn),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupIPSetReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.IPSetReferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.IPSetReferenceProperty>();
    ret.addPropertyResult('referenceArn', 'ReferenceArn', properties.ReferenceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Criteria for Network Firewall to use to inspect an individual packet in stateless rule inspection. Each match attributes set can include one or more items such as IP address, CIDR range, port number, protocol, and TCP flags.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html
     */
    export interface MatchAttributesProperty {
        /**
         * The destination ports to inspect for. If not specified, this matches with any destination port. This setting is only used for protocols 6 (TCP) and 17 (UDP).
         *
         * You can specify individual ports, for example `1994` and you can specify port ranges, for example `1990:1994` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-destinationports
         */
        readonly destinationPorts?: Array<CfnRuleGroup.PortRangeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The destination IP addresses and address ranges to inspect for, in CIDR notation. If not specified, this matches with any destination address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-destinations
         */
        readonly destinations?: Array<CfnRuleGroup.AddressProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The protocols to inspect for, specified using each protocol's assigned internet protocol number (IANA). If not specified, this matches with any protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-protocols
         */
        readonly protocols?: number[] | cdk.IResolvable;
        /**
         * The source ports to inspect for. If not specified, this matches with any source port. This setting is only used for protocols 6 (TCP) and 17 (UDP).
         *
         * You can specify individual ports, for example `1994` and you can specify port ranges, for example `1990:1994` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-sourceports
         */
        readonly sourcePorts?: Array<CfnRuleGroup.PortRangeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The source IP addresses and address ranges to inspect for, in CIDR notation. If not specified, this matches with any source address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-sources
         */
        readonly sources?: Array<CfnRuleGroup.AddressProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The TCP flags and masks to inspect for. If not specified, this matches with any settings. This setting is only used for protocol 6 (TCP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-matchattributes.html#cfn-networkfirewall-rulegroup-matchattributes-tcpflags
         */
        readonly tcpFlags?: Array<CfnRuleGroup.TCPFlagFieldProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MatchAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `MatchAttributesProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_MatchAttributesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationPorts', cdk.listValidator(CfnRuleGroup_PortRangePropertyValidator))(properties.destinationPorts));
    errors.collect(cdk.propertyValidator('destinations', cdk.listValidator(CfnRuleGroup_AddressPropertyValidator))(properties.destinations));
    errors.collect(cdk.propertyValidator('protocols', cdk.listValidator(cdk.validateNumber))(properties.protocols));
    errors.collect(cdk.propertyValidator('sourcePorts', cdk.listValidator(CfnRuleGroup_PortRangePropertyValidator))(properties.sourcePorts));
    errors.collect(cdk.propertyValidator('sources', cdk.listValidator(CfnRuleGroup_AddressPropertyValidator))(properties.sources));
    errors.collect(cdk.propertyValidator('tcpFlags', cdk.listValidator(CfnRuleGroup_TCPFlagFieldPropertyValidator))(properties.tcpFlags));
    return errors.wrap('supplied properties not correct for "MatchAttributesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.MatchAttributes` resource
 *
 * @param properties - the TypeScript properties of a `MatchAttributesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.MatchAttributes` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupMatchAttributesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_MatchAttributesPropertyValidator(properties).assertSuccess();
    return {
        DestinationPorts: cdk.listMapper(cfnRuleGroupPortRangePropertyToCloudFormation)(properties.destinationPorts),
        Destinations: cdk.listMapper(cfnRuleGroupAddressPropertyToCloudFormation)(properties.destinations),
        Protocols: cdk.listMapper(cdk.numberToCloudFormation)(properties.protocols),
        SourcePorts: cdk.listMapper(cfnRuleGroupPortRangePropertyToCloudFormation)(properties.sourcePorts),
        Sources: cdk.listMapper(cfnRuleGroupAddressPropertyToCloudFormation)(properties.sources),
        TCPFlags: cdk.listMapper(cfnRuleGroupTCPFlagFieldPropertyToCloudFormation)(properties.tcpFlags),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupMatchAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.MatchAttributesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.MatchAttributesProperty>();
    ret.addPropertyResult('destinationPorts', 'DestinationPorts', properties.DestinationPorts != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupPortRangePropertyFromCloudFormation)(properties.DestinationPorts) : undefined);
    ret.addPropertyResult('destinations', 'Destinations', properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupAddressPropertyFromCloudFormation)(properties.Destinations) : undefined);
    ret.addPropertyResult('protocols', 'Protocols', properties.Protocols != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Protocols) : undefined);
    ret.addPropertyResult('sourcePorts', 'SourcePorts', properties.SourcePorts != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupPortRangePropertyFromCloudFormation)(properties.SourcePorts) : undefined);
    ret.addPropertyResult('sources', 'Sources', properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupAddressPropertyFromCloudFormation)(properties.Sources) : undefined);
    ret.addPropertyResult('tcpFlags', 'TCPFlags', properties.TCPFlags != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTCPFlagFieldPropertyFromCloudFormation)(properties.TCPFlags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A single port range specification. This is used for source and destination port ranges in the stateless `RuleGroup.MatchAttributes` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portrange.html
     */
    export interface PortRangeProperty {
        /**
         * The lower limit of the port range. This must be less than or equal to the `ToPort` specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portrange.html#cfn-networkfirewall-rulegroup-portrange-fromport
         */
        readonly fromPort: number;
        /**
         * The upper limit of the port range. This must be greater than or equal to the `FromPort` specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portrange.html#cfn-networkfirewall-rulegroup-portrange-toport
         */
        readonly toPort: number;
    }
}

/**
 * Determine whether the given properties match those of a `PortRangeProperty`
 *
 * @param properties - the TypeScript properties of a `PortRangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_PortRangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fromPort', cdk.requiredValidator)(properties.fromPort));
    errors.collect(cdk.propertyValidator('fromPort', cdk.validateNumber)(properties.fromPort));
    errors.collect(cdk.propertyValidator('toPort', cdk.requiredValidator)(properties.toPort));
    errors.collect(cdk.propertyValidator('toPort', cdk.validateNumber)(properties.toPort));
    return errors.wrap('supplied properties not correct for "PortRangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.PortRange` resource
 *
 * @param properties - the TypeScript properties of a `PortRangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.PortRange` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupPortRangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_PortRangePropertyValidator(properties).assertSuccess();
    return {
        FromPort: cdk.numberToCloudFormation(properties.fromPort),
        ToPort: cdk.numberToCloudFormation(properties.toPort),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupPortRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.PortRangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.PortRangeProperty>();
    ret.addPropertyResult('fromPort', 'FromPort', cfn_parse.FromCloudFormation.getNumber(properties.FromPort));
    ret.addPropertyResult('toPort', 'ToPort', cfn_parse.FromCloudFormation.getNumber(properties.ToPort));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A set of port ranges for use in the rules in a rule group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portset.html
     */
    export interface PortSetProperty {
        /**
         * The set of port ranges.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-portset.html#cfn-networkfirewall-rulegroup-portset-definition
         */
        readonly definition?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `PortSetProperty`
 *
 * @param properties - the TypeScript properties of a `PortSetProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_PortSetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('definition', cdk.listValidator(cdk.validateString))(properties.definition));
    return errors.wrap('supplied properties not correct for "PortSetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.PortSet` resource
 *
 * @param properties - the TypeScript properties of a `PortSetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.PortSet` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupPortSetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_PortSetPropertyValidator(properties).assertSuccess();
    return {
        Definition: cdk.listMapper(cdk.stringToCloudFormation)(properties.definition),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupPortSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.PortSetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.PortSetProperty>();
    ret.addPropertyResult('definition', 'Definition', properties.Definition != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Definition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet. This setting defines a CloudWatch dimension value to be published.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-publishmetricaction.html
     */
    export interface PublishMetricActionProperty {
        /**
         * `CfnRuleGroup.PublishMetricActionProperty.Dimensions`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-publishmetricaction.html#cfn-networkfirewall-rulegroup-publishmetricaction-dimensions
         */
        readonly dimensions: Array<CfnRuleGroup.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PublishMetricActionProperty`
 *
 * @param properties - the TypeScript properties of a `PublishMetricActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_PublishMetricActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensions', cdk.requiredValidator)(properties.dimensions));
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnRuleGroup_DimensionPropertyValidator))(properties.dimensions));
    return errors.wrap('supplied properties not correct for "PublishMetricActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.PublishMetricAction` resource
 *
 * @param properties - the TypeScript properties of a `PublishMetricActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.PublishMetricAction` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupPublishMetricActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_PublishMetricActionPropertyValidator(properties).assertSuccess();
    return {
        Dimensions: cdk.listMapper(cfnRuleGroupDimensionPropertyToCloudFormation)(properties.dimensions),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupPublishMetricActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.PublishMetricActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.PublishMetricActionProperty>();
    ret.addPropertyResult('dimensions', 'Dimensions', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupDimensionPropertyFromCloudFormation)(properties.Dimensions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Configures the `ReferenceSets` for a stateful rule group. For more information, see the [Using IP set references in Suricata compatible rule groups](https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-groups-ip-set-references.html) in the *Network Firewall User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-referencesets.html
     */
    export interface ReferenceSetsProperty {
        /**
         * The IP set references to use in the stateful rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-referencesets.html#cfn-networkfirewall-rulegroup-referencesets-ipsetreferences
         */
        readonly ipSetReferences?: { [key: string]: (CfnRuleGroup.IPSetReferenceProperty | cdk.IResolvable) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReferenceSetsProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceSetsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_ReferenceSetsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ipSetReferences', cdk.hashValidator(CfnRuleGroup_IPSetReferencePropertyValidator))(properties.ipSetReferences));
    return errors.wrap('supplied properties not correct for "ReferenceSetsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.ReferenceSets` resource
 *
 * @param properties - the TypeScript properties of a `ReferenceSetsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.ReferenceSets` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupReferenceSetsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_ReferenceSetsPropertyValidator(properties).assertSuccess();
    return {
        IPSetReferences: cdk.hashMapper(cfnRuleGroupIPSetReferencePropertyToCloudFormation)(properties.ipSetReferences),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupReferenceSetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ReferenceSetsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ReferenceSetsProperty>();
    ret.addPropertyResult('ipSetReferences', 'IPSetReferences', properties.IPSetReferences != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleGroupIPSetReferencePropertyFromCloudFormation)(properties.IPSetReferences) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The inspection criteria and action for a single stateless rule. AWS Network Firewall inspects each packet for the specified matching criteria. When a packet matches the criteria, Network Firewall performs the rule's actions on the packet.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruledefinition.html
     */
    export interface RuleDefinitionProperty {
        /**
         * The actions to take on a packet that matches one of the stateless rule definition's match attributes. You must specify a standard action and you can add custom actions.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruledefinition.html#cfn-networkfirewall-rulegroup-ruledefinition-actions
         */
        readonly actions: string[];
        /**
         * Criteria for Network Firewall to use to inspect an individual packet in stateless rule inspection. Each match attributes set can include one or more items such as IP address, CIDR range, port number, protocol, and TCP flags.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruledefinition.html#cfn-networkfirewall-rulegroup-ruledefinition-matchattributes
         */
        readonly matchAttributes: CfnRuleGroup.MatchAttributesProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RuleDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(cdk.validateString))(properties.actions));
    errors.collect(cdk.propertyValidator('matchAttributes', cdk.requiredValidator)(properties.matchAttributes));
    errors.collect(cdk.propertyValidator('matchAttributes', CfnRuleGroup_MatchAttributesPropertyValidator)(properties.matchAttributes));
    return errors.wrap('supplied properties not correct for "RuleDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RuleDefinition` resource
 *
 * @param properties - the TypeScript properties of a `RuleDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RuleDefinition` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRuleDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RuleDefinitionPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
        MatchAttributes: cfnRuleGroupMatchAttributesPropertyToCloudFormation(properties.matchAttributes),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RuleDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleDefinitionProperty>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getStringArray(properties.Actions));
    ret.addPropertyResult('matchAttributes', 'MatchAttributes', CfnRuleGroupMatchAttributesPropertyFromCloudFormation(properties.MatchAttributes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html
     */
    export interface RuleGroupProperty {
        /**
         * The reference sets for the stateful rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup-referencesets
         */
        readonly referenceSets?: CfnRuleGroup.ReferenceSetsProperty | cdk.IResolvable;
        /**
         * Settings that are available for use in the rules in the rule group. You can only use these for stateful rule groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup-rulevariables
         */
        readonly ruleVariables?: CfnRuleGroup.RuleVariablesProperty | cdk.IResolvable;
        /**
         * The stateful rules or stateless rules for the rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup-rulessource
         */
        readonly rulesSource: CfnRuleGroup.RulesSourceProperty | cdk.IResolvable;
        /**
         * Additional options governing how Network Firewall handles stateful rules. The policies where you use your stateful rule group must have stateful rule options settings that are compatible with these settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulegroup.html#cfn-networkfirewall-rulegroup-rulegroup-statefulruleoptions
         */
        readonly statefulRuleOptions?: CfnRuleGroup.StatefulRuleOptionsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleGroupProperty`
 *
 * @param properties - the TypeScript properties of a `RuleGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RuleGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('referenceSets', CfnRuleGroup_ReferenceSetsPropertyValidator)(properties.referenceSets));
    errors.collect(cdk.propertyValidator('ruleVariables', CfnRuleGroup_RuleVariablesPropertyValidator)(properties.ruleVariables));
    errors.collect(cdk.propertyValidator('rulesSource', cdk.requiredValidator)(properties.rulesSource));
    errors.collect(cdk.propertyValidator('rulesSource', CfnRuleGroup_RulesSourcePropertyValidator)(properties.rulesSource));
    errors.collect(cdk.propertyValidator('statefulRuleOptions', CfnRuleGroup_StatefulRuleOptionsPropertyValidator)(properties.statefulRuleOptions));
    return errors.wrap('supplied properties not correct for "RuleGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RuleGroup` resource
 *
 * @param properties - the TypeScript properties of a `RuleGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RuleGroup` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRuleGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RuleGroupPropertyValidator(properties).assertSuccess();
    return {
        ReferenceSets: cfnRuleGroupReferenceSetsPropertyToCloudFormation(properties.referenceSets),
        RuleVariables: cfnRuleGroupRuleVariablesPropertyToCloudFormation(properties.ruleVariables),
        RulesSource: cfnRuleGroupRulesSourcePropertyToCloudFormation(properties.rulesSource),
        StatefulRuleOptions: cfnRuleGroupStatefulRuleOptionsPropertyToCloudFormation(properties.statefulRuleOptions),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RuleGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleGroupProperty>();
    ret.addPropertyResult('referenceSets', 'ReferenceSets', properties.ReferenceSets != null ? CfnRuleGroupReferenceSetsPropertyFromCloudFormation(properties.ReferenceSets) : undefined);
    ret.addPropertyResult('ruleVariables', 'RuleVariables', properties.RuleVariables != null ? CfnRuleGroupRuleVariablesPropertyFromCloudFormation(properties.RuleVariables) : undefined);
    ret.addPropertyResult('rulesSource', 'RulesSource', CfnRuleGroupRulesSourcePropertyFromCloudFormation(properties.RulesSource));
    ret.addPropertyResult('statefulRuleOptions', 'StatefulRuleOptions', properties.StatefulRuleOptions != null ? CfnRuleGroupStatefulRuleOptionsPropertyFromCloudFormation(properties.StatefulRuleOptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Additional settings for a stateful rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruleoption.html
     */
    export interface RuleOptionProperty {
        /**
         * `CfnRuleGroup.RuleOptionProperty.Keyword`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruleoption.html#cfn-networkfirewall-rulegroup-ruleoption-keyword
         */
        readonly keyword: string;
        /**
         * `CfnRuleGroup.RuleOptionProperty.Settings`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-ruleoption.html#cfn-networkfirewall-rulegroup-ruleoption-settings
         */
        readonly settings?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `RuleOptionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleOptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RuleOptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyword', cdk.requiredValidator)(properties.keyword));
    errors.collect(cdk.propertyValidator('keyword', cdk.validateString)(properties.keyword));
    errors.collect(cdk.propertyValidator('settings', cdk.listValidator(cdk.validateString))(properties.settings));
    return errors.wrap('supplied properties not correct for "RuleOptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RuleOption` resource
 *
 * @param properties - the TypeScript properties of a `RuleOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RuleOption` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRuleOptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RuleOptionPropertyValidator(properties).assertSuccess();
    return {
        Keyword: cdk.stringToCloudFormation(properties.keyword),
        Settings: cdk.listMapper(cdk.stringToCloudFormation)(properties.settings),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RuleOptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleOptionProperty>();
    ret.addPropertyResult('keyword', 'Keyword', cfn_parse.FromCloudFormation.getString(properties.Keyword));
    ret.addPropertyResult('settings', 'Settings', properties.Settings != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Settings that are available for use in the rules in the `RuleGroup` where this is defined.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulevariables.html
     */
    export interface RuleVariablesProperty {
        /**
         * A list of IP addresses and address ranges, in CIDR notation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulevariables.html#cfn-networkfirewall-rulegroup-rulevariables-ipsets
         */
        readonly ipSets?: { [key: string]: (CfnRuleGroup.IPSetProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * A list of port ranges.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulevariables.html#cfn-networkfirewall-rulegroup-rulevariables-portsets
         */
        readonly portSets?: { [key: string]: (CfnRuleGroup.PortSetProperty | cdk.IResolvable) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleVariablesProperty`
 *
 * @param properties - the TypeScript properties of a `RuleVariablesProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RuleVariablesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ipSets', cdk.hashValidator(CfnRuleGroup_IPSetPropertyValidator))(properties.ipSets));
    errors.collect(cdk.propertyValidator('portSets', cdk.hashValidator(CfnRuleGroup_PortSetPropertyValidator))(properties.portSets));
    return errors.wrap('supplied properties not correct for "RuleVariablesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RuleVariables` resource
 *
 * @param properties - the TypeScript properties of a `RuleVariablesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RuleVariables` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRuleVariablesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RuleVariablesPropertyValidator(properties).assertSuccess();
    return {
        IPSets: cdk.hashMapper(cfnRuleGroupIPSetPropertyToCloudFormation)(properties.ipSets),
        PortSets: cdk.hashMapper(cfnRuleGroupPortSetPropertyToCloudFormation)(properties.portSets),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleVariablesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RuleVariablesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleVariablesProperty>();
    ret.addPropertyResult('ipSets', 'IPSets', properties.IPSets != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleGroupIPSetPropertyFromCloudFormation)(properties.IPSets) : undefined);
    ret.addPropertyResult('portSets', 'PortSets', properties.PortSets != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleGroupPortSetPropertyFromCloudFormation)(properties.PortSets) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The stateless or stateful rules definitions for use in a single rule group. Each rule group requires a single `RulesSource` . You can use an instance of this for either stateless rules or stateful rules.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html
     */
    export interface RulesSourceProperty {
        /**
         * Stateful inspection criteria for a domain list rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html#cfn-networkfirewall-rulegroup-rulessource-rulessourcelist
         */
        readonly rulesSourceList?: CfnRuleGroup.RulesSourceListProperty | cdk.IResolvable;
        /**
         * Stateful inspection criteria, provided in Suricata compatible intrusion prevention system (IPS) rules. Suricata is an open-source network IPS that includes a standard rule-based language for network traffic inspection.
         *
         * These rules contain the inspection criteria and the action to take for traffic that matches the criteria, so this type of rule group doesn't have a separate action setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html#cfn-networkfirewall-rulegroup-rulessource-rulesstring
         */
        readonly rulesString?: string;
        /**
         * An array of individual stateful rules inspection criteria to be used together in a stateful rule group. Use this option to specify simple Suricata rules with protocol, source and destination, ports, direction, and rule options. For information about the Suricata `Rules` format, see [Rules Format](https://docs.aws.amazon.com/https://suricata.readthedocs.io/rules/intro.html#) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html#cfn-networkfirewall-rulegroup-rulessource-statefulrules
         */
        readonly statefulRules?: Array<CfnRuleGroup.StatefulRuleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Stateless inspection criteria to be used in a stateless rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessource.html#cfn-networkfirewall-rulegroup-rulessource-statelessrulesandcustomactions
         */
        readonly statelessRulesAndCustomActions?: CfnRuleGroup.StatelessRulesAndCustomActionsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RulesSourceProperty`
 *
 * @param properties - the TypeScript properties of a `RulesSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RulesSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rulesSourceList', CfnRuleGroup_RulesSourceListPropertyValidator)(properties.rulesSourceList));
    errors.collect(cdk.propertyValidator('rulesString', cdk.validateString)(properties.rulesString));
    errors.collect(cdk.propertyValidator('statefulRules', cdk.listValidator(CfnRuleGroup_StatefulRulePropertyValidator))(properties.statefulRules));
    errors.collect(cdk.propertyValidator('statelessRulesAndCustomActions', CfnRuleGroup_StatelessRulesAndCustomActionsPropertyValidator)(properties.statelessRulesAndCustomActions));
    return errors.wrap('supplied properties not correct for "RulesSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RulesSource` resource
 *
 * @param properties - the TypeScript properties of a `RulesSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RulesSource` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRulesSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RulesSourcePropertyValidator(properties).assertSuccess();
    return {
        RulesSourceList: cfnRuleGroupRulesSourceListPropertyToCloudFormation(properties.rulesSourceList),
        RulesString: cdk.stringToCloudFormation(properties.rulesString),
        StatefulRules: cdk.listMapper(cfnRuleGroupStatefulRulePropertyToCloudFormation)(properties.statefulRules),
        StatelessRulesAndCustomActions: cfnRuleGroupStatelessRulesAndCustomActionsPropertyToCloudFormation(properties.statelessRulesAndCustomActions),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRulesSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RulesSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RulesSourceProperty>();
    ret.addPropertyResult('rulesSourceList', 'RulesSourceList', properties.RulesSourceList != null ? CfnRuleGroupRulesSourceListPropertyFromCloudFormation(properties.RulesSourceList) : undefined);
    ret.addPropertyResult('rulesString', 'RulesString', properties.RulesString != null ? cfn_parse.FromCloudFormation.getString(properties.RulesString) : undefined);
    ret.addPropertyResult('statefulRules', 'StatefulRules', properties.StatefulRules != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupStatefulRulePropertyFromCloudFormation)(properties.StatefulRules) : undefined);
    ret.addPropertyResult('statelessRulesAndCustomActions', 'StatelessRulesAndCustomActions', properties.StatelessRulesAndCustomActions != null ? CfnRuleGroupStatelessRulesAndCustomActionsPropertyFromCloudFormation(properties.StatelessRulesAndCustomActions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Stateful inspection criteria for a domain list rule group.
     *
     * For HTTPS traffic, domain filtering is SNI-based. It uses the server name indicator extension of the TLS handshake.
     *
     * By default, Network Firewall domain list inspection only includes traffic coming from the VPC where you deploy the firewall. To inspect traffic from IP addresses outside of the deployment VPC, you set the `HOME_NET` rule variable to include the CIDR range of the deployment VPC plus the other CIDR ranges. For more information, see `RuleGroup.RuleVariables` in this guide and [Stateful domain list rule groups in AWS Network Firewall](https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-domain-names.html) in the *Network Firewall Developer Guide*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessourcelist.html
     */
    export interface RulesSourceListProperty {
        /**
         * Whether you want to allow or deny access to the domains in your target list.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessourcelist.html#cfn-networkfirewall-rulegroup-rulessourcelist-generatedrulestype
         */
        readonly generatedRulesType: string;
        /**
         * The types of targets to inspect for. Valid values are `TLS_SNI` and `HTTP_HOST` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessourcelist.html#cfn-networkfirewall-rulegroup-rulessourcelist-targettypes
         */
        readonly targetTypes: string[];
        /**
         * The domains that you want to inspect for in your traffic flows. Valid domain specifications are the following:
         *
         * - Explicit names. For example, `abc.example.com` matches only the domain `abc.example.com` .
         * - Names that use a domain wildcard, which you indicate with an initial ' `.` '. For example, `.example.com` matches `example.com` and matches all subdomains of `example.com` , such as `abc.example.com` and `www.example.com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-rulessourcelist.html#cfn-networkfirewall-rulegroup-rulessourcelist-targets
         */
        readonly targets: string[];
    }
}

/**
 * Determine whether the given properties match those of a `RulesSourceListProperty`
 *
 * @param properties - the TypeScript properties of a `RulesSourceListProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RulesSourceListPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('generatedRulesType', cdk.requiredValidator)(properties.generatedRulesType));
    errors.collect(cdk.propertyValidator('generatedRulesType', cdk.validateString)(properties.generatedRulesType));
    errors.collect(cdk.propertyValidator('targetTypes', cdk.requiredValidator)(properties.targetTypes));
    errors.collect(cdk.propertyValidator('targetTypes', cdk.listValidator(cdk.validateString))(properties.targetTypes));
    errors.collect(cdk.propertyValidator('targets', cdk.requiredValidator)(properties.targets));
    errors.collect(cdk.propertyValidator('targets', cdk.listValidator(cdk.validateString))(properties.targets));
    return errors.wrap('supplied properties not correct for "RulesSourceListProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RulesSourceList` resource
 *
 * @param properties - the TypeScript properties of a `RulesSourceListProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.RulesSourceList` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRulesSourceListPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RulesSourceListPropertyValidator(properties).assertSuccess();
    return {
        GeneratedRulesType: cdk.stringToCloudFormation(properties.generatedRulesType),
        TargetTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.targetTypes),
        Targets: cdk.listMapper(cdk.stringToCloudFormation)(properties.targets),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRulesSourceListPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RulesSourceListProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RulesSourceListProperty>();
    ret.addPropertyResult('generatedRulesType', 'GeneratedRulesType', cfn_parse.FromCloudFormation.getString(properties.GeneratedRulesType));
    ret.addPropertyResult('targetTypes', 'TargetTypes', cfn_parse.FromCloudFormation.getStringArray(properties.TargetTypes));
    ret.addPropertyResult('targets', 'Targets', cfn_parse.FromCloudFormation.getStringArray(properties.Targets));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A single Suricata rules specification, for use in a stateful rule group. Use this option to specify a simple Suricata rule with protocol, source and destination, ports, direction, and rule options. For information about the Suricata `Rules` format, see [Rules Format](https://docs.aws.amazon.com/https://suricata.readthedocs.io/rules/intro.html#) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulrule.html
     */
    export interface StatefulRuleProperty {
        /**
         * Defines what Network Firewall should do with the packets in a traffic flow when the flow matches the stateful rule criteria. For all actions, Network Firewall performs the specified action and discontinues stateful inspection of the traffic flow.
         *
         * The actions for a stateful rule are defined as follows:
         *
         * - *PASS* - Permits the packets to go to the intended destination.
         * - *DROP* - Blocks the packets from going to the intended destination and sends an alert log message, if alert logging is configured in the `Firewall` `LoggingConfiguration` .
         * - *ALERT* - Permits the packets to go to the intended destination and sends an alert log message, if alert logging is configured in the `Firewall` `LoggingConfiguration` .
         *
         * You can use this action to test a rule that you intend to use to drop traffic. You can enable the rule with `ALERT` action, verify in the logs that the rule is filtering as you want, then change the action to `DROP` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulrule.html#cfn-networkfirewall-rulegroup-statefulrule-action
         */
        readonly action: string;
        /**
         * The stateful inspection criteria for this rule, used to inspect traffic flows.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulrule.html#cfn-networkfirewall-rulegroup-statefulrule-header
         */
        readonly header: CfnRuleGroup.HeaderProperty | cdk.IResolvable;
        /**
         * Additional settings for a stateful rule, provided as keywords and settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulrule.html#cfn-networkfirewall-rulegroup-statefulrule-ruleoptions
         */
        readonly ruleOptions: Array<CfnRuleGroup.RuleOptionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StatefulRuleProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_StatefulRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('header', cdk.requiredValidator)(properties.header));
    errors.collect(cdk.propertyValidator('header', CfnRuleGroup_HeaderPropertyValidator)(properties.header));
    errors.collect(cdk.propertyValidator('ruleOptions', cdk.requiredValidator)(properties.ruleOptions));
    errors.collect(cdk.propertyValidator('ruleOptions', cdk.listValidator(CfnRuleGroup_RuleOptionPropertyValidator))(properties.ruleOptions));
    return errors.wrap('supplied properties not correct for "StatefulRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.StatefulRule` resource
 *
 * @param properties - the TypeScript properties of a `StatefulRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.StatefulRule` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupStatefulRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_StatefulRulePropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        Header: cfnRuleGroupHeaderPropertyToCloudFormation(properties.header),
        RuleOptions: cdk.listMapper(cfnRuleGroupRuleOptionPropertyToCloudFormation)(properties.ruleOptions),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupStatefulRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.StatefulRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatefulRuleProperty>();
    ret.addPropertyResult('action', 'Action', cfn_parse.FromCloudFormation.getString(properties.Action));
    ret.addPropertyResult('header', 'Header', CfnRuleGroupHeaderPropertyFromCloudFormation(properties.Header));
    ret.addPropertyResult('ruleOptions', 'RuleOptions', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupRuleOptionPropertyFromCloudFormation)(properties.RuleOptions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Additional options governing how Network Firewall handles the rule group. You can only use these for stateful rule groups.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulruleoptions.html
     */
    export interface StatefulRuleOptionsProperty {
        /**
         * Indicates how to manage the order of the rule evaluation for the rule group. `DEFAULT_ACTION_ORDER` is the default behavior. Stateful rules are provided to the rule engine as Suricata compatible strings, and Suricata evaluates them based on certain settings. For more information, see [Evaluation order for stateful rules](https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html) in the *AWS Network Firewall Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statefulruleoptions.html#cfn-networkfirewall-rulegroup-statefulruleoptions-ruleorder
         */
        readonly ruleOrder?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StatefulRuleOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `StatefulRuleOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_StatefulRuleOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ruleOrder', cdk.validateString)(properties.ruleOrder));
    return errors.wrap('supplied properties not correct for "StatefulRuleOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.StatefulRuleOptions` resource
 *
 * @param properties - the TypeScript properties of a `StatefulRuleOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.StatefulRuleOptions` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupStatefulRuleOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_StatefulRuleOptionsPropertyValidator(properties).assertSuccess();
    return {
        RuleOrder: cdk.stringToCloudFormation(properties.ruleOrder),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupStatefulRuleOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.StatefulRuleOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatefulRuleOptionsProperty>();
    ret.addPropertyResult('ruleOrder', 'RuleOrder', properties.RuleOrder != null ? cfn_parse.FromCloudFormation.getString(properties.RuleOrder) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A single stateless rule. This is used in `RuleGroup.StatelessRulesAndCustomActions` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrule.html
     */
    export interface StatelessRuleProperty {
        /**
         * Indicates the order in which to run this rule relative to all of the rules that are defined for a stateless rule group. Network Firewall evaluates the rules in a rule group starting with the lowest priority setting. You must ensure that the priority settings are unique for the rule group.
         *
         * Each stateless rule group uses exactly one `StatelessRulesAndCustomActions` object, and each `StatelessRulesAndCustomActions` contains exactly one `StatelessRules` object. To ensure unique priority settings for your rule groups, set unique priorities for the stateless rules that you define inside any single `StatelessRules` object.
         *
         * You can change the priority settings of your rules at any time. To make it easier to insert rules later, number them so there's a wide range in between, for example use 100, 200, and so on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrule.html#cfn-networkfirewall-rulegroup-statelessrule-priority
         */
        readonly priority: number;
        /**
         * Defines the stateless 5-tuple packet inspection criteria and the action to take on a packet that matches the criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrule.html#cfn-networkfirewall-rulegroup-statelessrule-ruledefinition
         */
        readonly ruleDefinition: CfnRuleGroup.RuleDefinitionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StatelessRuleProperty`
 *
 * @param properties - the TypeScript properties of a `StatelessRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_StatelessRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('ruleDefinition', cdk.requiredValidator)(properties.ruleDefinition));
    errors.collect(cdk.propertyValidator('ruleDefinition', CfnRuleGroup_RuleDefinitionPropertyValidator)(properties.ruleDefinition));
    return errors.wrap('supplied properties not correct for "StatelessRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.StatelessRule` resource
 *
 * @param properties - the TypeScript properties of a `StatelessRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.StatelessRule` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupStatelessRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_StatelessRulePropertyValidator(properties).assertSuccess();
    return {
        Priority: cdk.numberToCloudFormation(properties.priority),
        RuleDefinition: cfnRuleGroupRuleDefinitionPropertyToCloudFormation(properties.ruleDefinition),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupStatelessRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.StatelessRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatelessRuleProperty>();
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('ruleDefinition', 'RuleDefinition', CfnRuleGroupRuleDefinitionPropertyFromCloudFormation(properties.RuleDefinition));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Stateless inspection criteria. Each stateless rule group uses exactly one of these data types to define its stateless rules.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrulesandcustomactions.html
     */
    export interface StatelessRulesAndCustomActionsProperty {
        /**
         * Defines an array of individual custom action definitions that are available for use by the stateless rules in this `StatelessRulesAndCustomActions` specification. You name each custom action that you define, and then you can use it by name in your stateless rule `RuleGroup.RuleDefinition` `Actions` specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrulesandcustomactions.html#cfn-networkfirewall-rulegroup-statelessrulesandcustomactions-customactions
         */
        readonly customActions?: Array<CfnRuleGroup.CustomActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Defines the set of stateless rules for use in a stateless rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-statelessrulesandcustomactions.html#cfn-networkfirewall-rulegroup-statelessrulesandcustomactions-statelessrules
         */
        readonly statelessRules: Array<CfnRuleGroup.StatelessRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StatelessRulesAndCustomActionsProperty`
 *
 * @param properties - the TypeScript properties of a `StatelessRulesAndCustomActionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_StatelessRulesAndCustomActionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customActions', cdk.listValidator(CfnRuleGroup_CustomActionPropertyValidator))(properties.customActions));
    errors.collect(cdk.propertyValidator('statelessRules', cdk.requiredValidator)(properties.statelessRules));
    errors.collect(cdk.propertyValidator('statelessRules', cdk.listValidator(CfnRuleGroup_StatelessRulePropertyValidator))(properties.statelessRules));
    return errors.wrap('supplied properties not correct for "StatelessRulesAndCustomActionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.StatelessRulesAndCustomActions` resource
 *
 * @param properties - the TypeScript properties of a `StatelessRulesAndCustomActionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.StatelessRulesAndCustomActions` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupStatelessRulesAndCustomActionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_StatelessRulesAndCustomActionsPropertyValidator(properties).assertSuccess();
    return {
        CustomActions: cdk.listMapper(cfnRuleGroupCustomActionPropertyToCloudFormation)(properties.customActions),
        StatelessRules: cdk.listMapper(cfnRuleGroupStatelessRulePropertyToCloudFormation)(properties.statelessRules),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupStatelessRulesAndCustomActionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.StatelessRulesAndCustomActionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatelessRulesAndCustomActionsProperty>();
    ret.addPropertyResult('customActions', 'CustomActions', properties.CustomActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupCustomActionPropertyFromCloudFormation)(properties.CustomActions) : undefined);
    ret.addPropertyResult('statelessRules', 'StatelessRules', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupStatelessRulePropertyFromCloudFormation)(properties.StatelessRules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * TCP flags and masks to inspect packets for. This is used in the `RuleGroup.MatchAttributes` specification.
     *
     * For example:
     *
     * `"TCPFlags": [ { "Flags": [ "ECE", "SYN" ], "Masks": [ "SYN", "ECE" ] } ]`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-tcpflagfield.html
     */
    export interface TCPFlagFieldProperty {
        /**
         * Used in conjunction with the `Masks` setting to define the flags that must be set and flags that must not be set in order for the packet to match. This setting can only specify values that are also specified in the `Masks` setting.
         *
         * For the flags that are specified in the masks setting, the following must be true for the packet to match:
         *
         * - The ones that are set in this flags setting must be set in the packet.
         * - The ones that are not set in this flags setting must also not be set in the packet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-tcpflagfield.html#cfn-networkfirewall-rulegroup-tcpflagfield-flags
         */
        readonly flags: string[];
        /**
         * The set of flags to consider in the inspection. To inspect all flags in the valid values list, leave this with no setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkfirewall-rulegroup-tcpflagfield.html#cfn-networkfirewall-rulegroup-tcpflagfield-masks
         */
        readonly masks?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `TCPFlagFieldProperty`
 *
 * @param properties - the TypeScript properties of a `TCPFlagFieldProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_TCPFlagFieldPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('flags', cdk.requiredValidator)(properties.flags));
    errors.collect(cdk.propertyValidator('flags', cdk.listValidator(cdk.validateString))(properties.flags));
    errors.collect(cdk.propertyValidator('masks', cdk.listValidator(cdk.validateString))(properties.masks));
    return errors.wrap('supplied properties not correct for "TCPFlagFieldProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.TCPFlagField` resource
 *
 * @param properties - the TypeScript properties of a `TCPFlagFieldProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkFirewall::RuleGroup.TCPFlagField` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupTCPFlagFieldPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_TCPFlagFieldPropertyValidator(properties).assertSuccess();
    return {
        Flags: cdk.listMapper(cdk.stringToCloudFormation)(properties.flags),
        Masks: cdk.listMapper(cdk.stringToCloudFormation)(properties.masks),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupTCPFlagFieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.TCPFlagFieldProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.TCPFlagFieldProperty>();
    ret.addPropertyResult('flags', 'Flags', cfn_parse.FromCloudFormation.getStringArray(properties.Flags));
    ret.addPropertyResult('masks', 'Masks', properties.Masks != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Masks) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
