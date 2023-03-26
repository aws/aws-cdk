// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:12.697Z","fingerprint":"czOAK7RbOsj/wsPKdpE/SxVvC2z3l9rq5G0Ns5FgLH8="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnBillingGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html
 */
export interface CfnBillingGroupProps {

    /**
     * The set of accounts that will be under the billing group. The set of accounts resemble the linked accounts in a consolidated family.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-accountgrouping
     */
    readonly accountGrouping: CfnBillingGroup.AccountGroupingProperty | cdk.IResolvable;

    /**
     * The preferences and settings that will be used to compute the AWS charges for a billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-computationpreference
     */
    readonly computationPreference: CfnBillingGroup.ComputationPreferenceProperty | cdk.IResolvable;

    /**
     * The billing group's name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-name
     */
    readonly name: string;

    /**
     * The account ID that serves as the main account in a billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-primaryaccountid
     */
    readonly primaryAccountId: string;

    /**
     * The description of the billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-description
     */
    readonly description?: string;

    /**
     * `AWS::BillingConductor::BillingGroup.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnBillingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnBillingGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnBillingGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountGrouping', cdk.requiredValidator)(properties.accountGrouping));
    errors.collect(cdk.propertyValidator('accountGrouping', CfnBillingGroup_AccountGroupingPropertyValidator)(properties.accountGrouping));
    errors.collect(cdk.propertyValidator('computationPreference', cdk.requiredValidator)(properties.computationPreference));
    errors.collect(cdk.propertyValidator('computationPreference', CfnBillingGroup_ComputationPreferencePropertyValidator)(properties.computationPreference));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('primaryAccountId', cdk.requiredValidator)(properties.primaryAccountId));
    errors.collect(cdk.propertyValidator('primaryAccountId', cdk.validateString)(properties.primaryAccountId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnBillingGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::BillingGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnBillingGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::BillingGroup` resource.
 */
// @ts-ignore TS6133
function cfnBillingGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBillingGroupPropsValidator(properties).assertSuccess();
    return {
        AccountGrouping: cfnBillingGroupAccountGroupingPropertyToCloudFormation(properties.accountGrouping),
        ComputationPreference: cfnBillingGroupComputationPreferencePropertyToCloudFormation(properties.computationPreference),
        Name: cdk.stringToCloudFormation(properties.name),
        PrimaryAccountId: cdk.stringToCloudFormation(properties.primaryAccountId),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnBillingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBillingGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBillingGroupProps>();
    ret.addPropertyResult('accountGrouping', 'AccountGrouping', CfnBillingGroupAccountGroupingPropertyFromCloudFormation(properties.AccountGrouping));
    ret.addPropertyResult('computationPreference', 'ComputationPreference', CfnBillingGroupComputationPreferencePropertyFromCloudFormation(properties.ComputationPreference));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('primaryAccountId', 'PrimaryAccountId', cfn_parse.FromCloudFormation.getString(properties.PrimaryAccountId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::BillingConductor::BillingGroup`
 *
 * Creates a billing group that resembles a consolidated billing family that AWS charges, based off of the predefined pricing plan computation.
 *
 * @cloudformationResource AWS::BillingConductor::BillingGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html
 */
export class CfnBillingGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::BillingConductor::BillingGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBillingGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBillingGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBillingGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the created billing group.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The time the billing group was created.
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: number;

    /**
     * The most recent time the billing group was modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: number;

    /**
     * The number of accounts in the particular billing group.
     * @cloudformationAttribute Size
     */
    public readonly attrSize: number;

    /**
     * The billing group status. Only one of the valid values can be used.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The reason why the billing group is in its current status.
     * @cloudformationAttribute StatusReason
     */
    public readonly attrStatusReason: string;

    /**
     * The set of accounts that will be under the billing group. The set of accounts resemble the linked accounts in a consolidated family.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-accountgrouping
     */
    public accountGrouping: CfnBillingGroup.AccountGroupingProperty | cdk.IResolvable;

    /**
     * The preferences and settings that will be used to compute the AWS charges for a billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-computationpreference
     */
    public computationPreference: CfnBillingGroup.ComputationPreferenceProperty | cdk.IResolvable;

    /**
     * The billing group's name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-name
     */
    public name: string;

    /**
     * The account ID that serves as the main account in a billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-primaryaccountid
     */
    public primaryAccountId: string;

    /**
     * The description of the billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-description
     */
    public description: string | undefined;

    /**
     * `AWS::BillingConductor::BillingGroup.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::BillingConductor::BillingGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBillingGroupProps) {
        super(scope, id, { type: CfnBillingGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'accountGrouping', this);
        cdk.requireProperty(props, 'computationPreference', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'primaryAccountId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asNumber(this.getAtt('CreationTime', cdk.ResolutionTypeHint.NUMBER));
        this.attrLastModifiedTime = cdk.Token.asNumber(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.NUMBER));
        this.attrSize = cdk.Token.asNumber(this.getAtt('Size', cdk.ResolutionTypeHint.NUMBER));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));
        this.attrStatusReason = cdk.Token.asString(this.getAtt('StatusReason', cdk.ResolutionTypeHint.STRING));

        this.accountGrouping = props.accountGrouping;
        this.computationPreference = props.computationPreference;
        this.name = props.name;
        this.primaryAccountId = props.primaryAccountId;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BillingConductor::BillingGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBillingGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accountGrouping: this.accountGrouping,
            computationPreference: this.computationPreference,
            name: this.name,
            primaryAccountId: this.primaryAccountId,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBillingGroupPropsToCloudFormation(props);
    }
}

export namespace CfnBillingGroup {
    /**
     * The set of accounts that will be under the billing group. The set of accounts resemble the linked accounts in a consolidated family.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-accountgrouping.html
     */
    export interface AccountGroupingProperty {
        /**
         * The account IDs that make up the billing group. Account IDs must be a part of the consolidated billing family, and not associated with another billing group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-accountgrouping.html#cfn-billingconductor-billinggroup-accountgrouping-linkedaccountids
         */
        readonly linkedAccountIds: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AccountGroupingProperty`
 *
 * @param properties - the TypeScript properties of a `AccountGroupingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBillingGroup_AccountGroupingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('linkedAccountIds', cdk.requiredValidator)(properties.linkedAccountIds));
    errors.collect(cdk.propertyValidator('linkedAccountIds', cdk.listValidator(cdk.validateString))(properties.linkedAccountIds));
    return errors.wrap('supplied properties not correct for "AccountGroupingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::BillingGroup.AccountGrouping` resource
 *
 * @param properties - the TypeScript properties of a `AccountGroupingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::BillingGroup.AccountGrouping` resource.
 */
// @ts-ignore TS6133
function cfnBillingGroupAccountGroupingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBillingGroup_AccountGroupingPropertyValidator(properties).assertSuccess();
    return {
        LinkedAccountIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.linkedAccountIds),
    };
}

// @ts-ignore TS6133
function CfnBillingGroupAccountGroupingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBillingGroup.AccountGroupingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBillingGroup.AccountGroupingProperty>();
    ret.addPropertyResult('linkedAccountIds', 'LinkedAccountIds', cfn_parse.FromCloudFormation.getStringArray(properties.LinkedAccountIds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBillingGroup {
    /**
     * The preferences and settings that will be used to compute the AWS charges for a billing group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-computationpreference.html
     */
    export interface ComputationPreferenceProperty {
        /**
         * The Amazon Resource Name (ARN) of the pricing plan used to compute the AWS charges for a billing group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-computationpreference.html#cfn-billingconductor-billinggroup-computationpreference-pricingplanarn
         */
        readonly pricingPlanArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComputationPreferenceProperty`
 *
 * @param properties - the TypeScript properties of a `ComputationPreferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnBillingGroup_ComputationPreferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pricingPlanArn', cdk.requiredValidator)(properties.pricingPlanArn));
    errors.collect(cdk.propertyValidator('pricingPlanArn', cdk.validateString)(properties.pricingPlanArn));
    return errors.wrap('supplied properties not correct for "ComputationPreferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::BillingGroup.ComputationPreference` resource
 *
 * @param properties - the TypeScript properties of a `ComputationPreferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::BillingGroup.ComputationPreference` resource.
 */
// @ts-ignore TS6133
function cfnBillingGroupComputationPreferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBillingGroup_ComputationPreferencePropertyValidator(properties).assertSuccess();
    return {
        PricingPlanArn: cdk.stringToCloudFormation(properties.pricingPlanArn),
    };
}

// @ts-ignore TS6133
function CfnBillingGroupComputationPreferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBillingGroup.ComputationPreferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBillingGroup.ComputationPreferenceProperty>();
    ret.addPropertyResult('pricingPlanArn', 'PricingPlanArn', cfn_parse.FromCloudFormation.getString(properties.PricingPlanArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCustomLineItem`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html
 */
export interface CfnCustomLineItemProps {

    /**
     * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-billinggrouparn
     */
    readonly billingGroupArn: string;

    /**
     * The custom line item's name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-name
     */
    readonly name: string;

    /**
     * A time range for which the custom line item is effective.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-billingperiodrange
     */
    readonly billingPeriodRange?: CfnCustomLineItem.BillingPeriodRangeProperty | cdk.IResolvable;

    /**
     * The charge details of a custom line item. It should contain only one of `Flat` or `Percentage` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-customlineitemchargedetails
     */
    readonly customLineItemChargeDetails?: CfnCustomLineItem.CustomLineItemChargeDetailsProperty | cdk.IResolvable;

    /**
     * The custom line item's description. This is shown on the Bills page in association with the charge value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-description
     */
    readonly description?: string;

    /**
     * A map that contains tag keys and tag values that are attached to a custom line item.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnCustomLineItemProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomLineItemProps`
 *
 * @returns the result of the validation.
 */
function CfnCustomLineItemPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('billingGroupArn', cdk.requiredValidator)(properties.billingGroupArn));
    errors.collect(cdk.propertyValidator('billingGroupArn', cdk.validateString)(properties.billingGroupArn));
    errors.collect(cdk.propertyValidator('billingPeriodRange', CfnCustomLineItem_BillingPeriodRangePropertyValidator)(properties.billingPeriodRange));
    errors.collect(cdk.propertyValidator('customLineItemChargeDetails', CfnCustomLineItem_CustomLineItemChargeDetailsPropertyValidator)(properties.customLineItemChargeDetails));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCustomLineItemProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem` resource
 *
 * @param properties - the TypeScript properties of a `CfnCustomLineItemProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem` resource.
 */
// @ts-ignore TS6133
function cfnCustomLineItemPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomLineItemPropsValidator(properties).assertSuccess();
    return {
        BillingGroupArn: cdk.stringToCloudFormation(properties.billingGroupArn),
        Name: cdk.stringToCloudFormation(properties.name),
        BillingPeriodRange: cfnCustomLineItemBillingPeriodRangePropertyToCloudFormation(properties.billingPeriodRange),
        CustomLineItemChargeDetails: cfnCustomLineItemCustomLineItemChargeDetailsPropertyToCloudFormation(properties.customLineItemChargeDetails),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCustomLineItemPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItemProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItemProps>();
    ret.addPropertyResult('billingGroupArn', 'BillingGroupArn', cfn_parse.FromCloudFormation.getString(properties.BillingGroupArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('billingPeriodRange', 'BillingPeriodRange', properties.BillingPeriodRange != null ? CfnCustomLineItemBillingPeriodRangePropertyFromCloudFormation(properties.BillingPeriodRange) : undefined);
    ret.addPropertyResult('customLineItemChargeDetails', 'CustomLineItemChargeDetails', properties.CustomLineItemChargeDetails != null ? CfnCustomLineItemCustomLineItemChargeDetailsPropertyFromCloudFormation(properties.CustomLineItemChargeDetails) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::BillingConductor::CustomLineItem`
 *
 * Creates a custom line item that can be used to create a one-time or recurring, fixed or percentage-based charge that you can apply to a single billing group. You can apply custom line items to the current or previous billing period. You can create either a fee or a discount custom line item.
 *
 * @cloudformationResource AWS::BillingConductor::CustomLineItem
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html
 */
export class CfnCustomLineItem extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::BillingConductor::CustomLineItem";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomLineItem {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCustomLineItemPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCustomLineItem(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The number of resources that are associated to the custom line item.
     * @cloudformationAttribute AssociationSize
     */
    public readonly attrAssociationSize: number;

    /**
     * The time created.
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: number;

    /**
     * The custom line item's charge value currency. Only one of the valid values can be used.
     * @cloudformationAttribute CurrencyCode
     */
    public readonly attrCurrencyCode: string;

    /**
     * The most recent time the custom line item was modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: number;

    /**
     * The product code associated with the custom line item.
     * @cloudformationAttribute ProductCode
     */
    public readonly attrProductCode: string;

    /**
     * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-billinggrouparn
     */
    public billingGroupArn: string;

    /**
     * The custom line item's name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-name
     */
    public name: string;

    /**
     * A time range for which the custom line item is effective.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-billingperiodrange
     */
    public billingPeriodRange: CfnCustomLineItem.BillingPeriodRangeProperty | cdk.IResolvable | undefined;

    /**
     * The charge details of a custom line item. It should contain only one of `Flat` or `Percentage` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-customlineitemchargedetails
     */
    public customLineItemChargeDetails: CfnCustomLineItem.CustomLineItemChargeDetailsProperty | cdk.IResolvable | undefined;

    /**
     * The custom line item's description. This is shown on the Bills page in association with the charge value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-description
     */
    public description: string | undefined;

    /**
     * A map that contains tag keys and tag values that are attached to a custom line item.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::BillingConductor::CustomLineItem`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCustomLineItemProps) {
        super(scope, id, { type: CfnCustomLineItem.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'billingGroupArn', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrAssociationSize = cdk.Token.asNumber(this.getAtt('AssociationSize', cdk.ResolutionTypeHint.NUMBER));
        this.attrCreationTime = cdk.Token.asNumber(this.getAtt('CreationTime', cdk.ResolutionTypeHint.NUMBER));
        this.attrCurrencyCode = cdk.Token.asString(this.getAtt('CurrencyCode', cdk.ResolutionTypeHint.STRING));
        this.attrLastModifiedTime = cdk.Token.asNumber(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.NUMBER));
        this.attrProductCode = cdk.Token.asString(this.getAtt('ProductCode', cdk.ResolutionTypeHint.STRING));

        this.billingGroupArn = props.billingGroupArn;
        this.name = props.name;
        this.billingPeriodRange = props.billingPeriodRange;
        this.customLineItemChargeDetails = props.customLineItemChargeDetails;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BillingConductor::CustomLineItem", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomLineItem.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            billingGroupArn: this.billingGroupArn,
            name: this.name,
            billingPeriodRange: this.billingPeriodRange,
            customLineItemChargeDetails: this.customLineItemChargeDetails,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCustomLineItemPropsToCloudFormation(props);
    }
}

export namespace CfnCustomLineItem {
    /**
     * The billing period range in which the custom line item request will be applied.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-billingperiodrange.html
     */
    export interface BillingPeriodRangeProperty {
        /**
         * The exclusive end billing period that defines a billing period range where a custom line is applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-billingperiodrange.html#cfn-billingconductor-customlineitem-billingperiodrange-exclusiveendbillingperiod
         */
        readonly exclusiveEndBillingPeriod?: string;
        /**
         * The inclusive start billing period that defines a billing period range where a custom line is applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-billingperiodrange.html#cfn-billingconductor-customlineitem-billingperiodrange-inclusivestartbillingperiod
         */
        readonly inclusiveStartBillingPeriod?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BillingPeriodRangeProperty`
 *
 * @param properties - the TypeScript properties of a `BillingPeriodRangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCustomLineItem_BillingPeriodRangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exclusiveEndBillingPeriod', cdk.validateString)(properties.exclusiveEndBillingPeriod));
    errors.collect(cdk.propertyValidator('inclusiveStartBillingPeriod', cdk.validateString)(properties.inclusiveStartBillingPeriod));
    return errors.wrap('supplied properties not correct for "BillingPeriodRangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem.BillingPeriodRange` resource
 *
 * @param properties - the TypeScript properties of a `BillingPeriodRangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem.BillingPeriodRange` resource.
 */
// @ts-ignore TS6133
function cfnCustomLineItemBillingPeriodRangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomLineItem_BillingPeriodRangePropertyValidator(properties).assertSuccess();
    return {
        ExclusiveEndBillingPeriod: cdk.stringToCloudFormation(properties.exclusiveEndBillingPeriod),
        InclusiveStartBillingPeriod: cdk.stringToCloudFormation(properties.inclusiveStartBillingPeriod),
    };
}

// @ts-ignore TS6133
function CfnCustomLineItemBillingPeriodRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItem.BillingPeriodRangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.BillingPeriodRangeProperty>();
    ret.addPropertyResult('exclusiveEndBillingPeriod', 'ExclusiveEndBillingPeriod', properties.ExclusiveEndBillingPeriod != null ? cfn_parse.FromCloudFormation.getString(properties.ExclusiveEndBillingPeriod) : undefined);
    ret.addPropertyResult('inclusiveStartBillingPeriod', 'InclusiveStartBillingPeriod', properties.InclusiveStartBillingPeriod != null ? cfn_parse.FromCloudFormation.getString(properties.InclusiveStartBillingPeriod) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCustomLineItem {
    /**
     * The charge details of a custom line item. It should contain only one of `Flat` or `Percentage` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html
     */
    export interface CustomLineItemChargeDetailsProperty {
        /**
         * A `CustomLineItemFlatChargeDetails` that describes the charge details of a flat custom line item.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html#cfn-billingconductor-customlineitem-customlineitemchargedetails-flat
         */
        readonly flat?: CfnCustomLineItem.CustomLineItemFlatChargeDetailsProperty | cdk.IResolvable;
        /**
         * A `CustomLineItemPercentageChargeDetails` that describes the charge details of a percentage custom line item.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html#cfn-billingconductor-customlineitem-customlineitemchargedetails-percentage
         */
        readonly percentage?: CfnCustomLineItem.CustomLineItemPercentageChargeDetailsProperty | cdk.IResolvable;
        /**
         * The type of the custom line item that indicates whether the charge is a fee or credit.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html#cfn-billingconductor-customlineitem-customlineitemchargedetails-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomLineItemChargeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomLineItemChargeDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCustomLineItem_CustomLineItemChargeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('flat', CfnCustomLineItem_CustomLineItemFlatChargeDetailsPropertyValidator)(properties.flat));
    errors.collect(cdk.propertyValidator('percentage', CfnCustomLineItem_CustomLineItemPercentageChargeDetailsPropertyValidator)(properties.percentage));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CustomLineItemChargeDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem.CustomLineItemChargeDetails` resource
 *
 * @param properties - the TypeScript properties of a `CustomLineItemChargeDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem.CustomLineItemChargeDetails` resource.
 */
// @ts-ignore TS6133
function cfnCustomLineItemCustomLineItemChargeDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomLineItem_CustomLineItemChargeDetailsPropertyValidator(properties).assertSuccess();
    return {
        Flat: cfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyToCloudFormation(properties.flat),
        Percentage: cfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyToCloudFormation(properties.percentage),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemChargeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItem.CustomLineItemChargeDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.CustomLineItemChargeDetailsProperty>();
    ret.addPropertyResult('flat', 'Flat', properties.Flat != null ? CfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyFromCloudFormation(properties.Flat) : undefined);
    ret.addPropertyResult('percentage', 'Percentage', properties.Percentage != null ? CfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyFromCloudFormation(properties.Percentage) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCustomLineItem {
    /**
     * The charge details of a custom line item. It should contain only one of `Flat` or `Percentage` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemflatchargedetails.html
     */
    export interface CustomLineItemFlatChargeDetailsProperty {
        /**
         * The custom line item's fixed charge value in USD.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemflatchargedetails.html#cfn-billingconductor-customlineitem-customlineitemflatchargedetails-chargevalue
         */
        readonly chargeValue: number;
    }
}

/**
 * Determine whether the given properties match those of a `CustomLineItemFlatChargeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomLineItemFlatChargeDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCustomLineItem_CustomLineItemFlatChargeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('chargeValue', cdk.requiredValidator)(properties.chargeValue));
    errors.collect(cdk.propertyValidator('chargeValue', cdk.validateNumber)(properties.chargeValue));
    return errors.wrap('supplied properties not correct for "CustomLineItemFlatChargeDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem.CustomLineItemFlatChargeDetails` resource
 *
 * @param properties - the TypeScript properties of a `CustomLineItemFlatChargeDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem.CustomLineItemFlatChargeDetails` resource.
 */
// @ts-ignore TS6133
function cfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomLineItem_CustomLineItemFlatChargeDetailsPropertyValidator(properties).assertSuccess();
    return {
        ChargeValue: cdk.numberToCloudFormation(properties.chargeValue),
    };
}

// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItem.CustomLineItemFlatChargeDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.CustomLineItemFlatChargeDetailsProperty>();
    ret.addPropertyResult('chargeValue', 'ChargeValue', cfn_parse.FromCloudFormation.getNumber(properties.ChargeValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCustomLineItem {
    /**
     * A representation of the charge details associated with a percentage custom line item.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitempercentagechargedetails.html
     */
    export interface CustomLineItemPercentageChargeDetailsProperty {
        /**
         * A list of resource ARNs to associate to the percentage custom line item.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitempercentagechargedetails.html#cfn-billingconductor-customlineitem-customlineitempercentagechargedetails-childassociatedresources
         */
        readonly childAssociatedResources?: string[];
        /**
         * The custom line item's percentage value. This will be multiplied against the combined value of its associated resources to determine its charge value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitempercentagechargedetails.html#cfn-billingconductor-customlineitem-customlineitempercentagechargedetails-percentagevalue
         */
        readonly percentageValue: number;
    }
}

/**
 * Determine whether the given properties match those of a `CustomLineItemPercentageChargeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomLineItemPercentageChargeDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCustomLineItem_CustomLineItemPercentageChargeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('childAssociatedResources', cdk.listValidator(cdk.validateString))(properties.childAssociatedResources));
    errors.collect(cdk.propertyValidator('percentageValue', cdk.requiredValidator)(properties.percentageValue));
    errors.collect(cdk.propertyValidator('percentageValue', cdk.validateNumber)(properties.percentageValue));
    return errors.wrap('supplied properties not correct for "CustomLineItemPercentageChargeDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem.CustomLineItemPercentageChargeDetails` resource
 *
 * @param properties - the TypeScript properties of a `CustomLineItemPercentageChargeDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::CustomLineItem.CustomLineItemPercentageChargeDetails` resource.
 */
// @ts-ignore TS6133
function cfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomLineItem_CustomLineItemPercentageChargeDetailsPropertyValidator(properties).assertSuccess();
    return {
        ChildAssociatedResources: cdk.listMapper(cdk.stringToCloudFormation)(properties.childAssociatedResources),
        PercentageValue: cdk.numberToCloudFormation(properties.percentageValue),
    };
}

// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItem.CustomLineItemPercentageChargeDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.CustomLineItemPercentageChargeDetailsProperty>();
    ret.addPropertyResult('childAssociatedResources', 'ChildAssociatedResources', properties.ChildAssociatedResources != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ChildAssociatedResources) : undefined);
    ret.addPropertyResult('percentageValue', 'PercentageValue', cfn_parse.FromCloudFormation.getNumber(properties.PercentageValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPricingPlan`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html
 */
export interface CfnPricingPlanProps {

    /**
     * The name of a pricing plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-name
     */
    readonly name: string;

    /**
     * The pricing plan description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-description
     */
    readonly description?: string;

    /**
     * The `PricingRuleArns` that are associated with the Pricing Plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-pricingrulearns
     */
    readonly pricingRuleArns?: string[];

    /**
     * A map that contains tag keys and tag values that are attached to a pricing plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPricingPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnPricingPlanProps`
 *
 * @returns the result of the validation.
 */
function CfnPricingPlanPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('pricingRuleArns', cdk.listValidator(cdk.validateString))(properties.pricingRuleArns));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPricingPlanProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::PricingPlan` resource
 *
 * @param properties - the TypeScript properties of a `CfnPricingPlanProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::PricingPlan` resource.
 */
// @ts-ignore TS6133
function cfnPricingPlanPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPricingPlanPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        PricingRuleArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.pricingRuleArns),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPricingPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPricingPlanProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPricingPlanProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('pricingRuleArns', 'PricingRuleArns', properties.PricingRuleArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PricingRuleArns) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::BillingConductor::PricingPlan`
 *
 * Creates a pricing plan that is used for computing AWS charges for billing groups.
 *
 * @cloudformationResource AWS::BillingConductor::PricingPlan
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html
 */
export class CfnPricingPlan extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::BillingConductor::PricingPlan";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPricingPlan {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPricingPlanPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPricingPlan(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the created pricing plan.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The time the pricing plan was created.
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: number;

    /**
     * The most recent time the pricing plan was modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: number;

    /**
     * The pricing rules count currently associated with this pricing plan list element.
     * @cloudformationAttribute Size
     */
    public readonly attrSize: number;

    /**
     * The name of a pricing plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-name
     */
    public name: string;

    /**
     * The pricing plan description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-description
     */
    public description: string | undefined;

    /**
     * The `PricingRuleArns` that are associated with the Pricing Plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-pricingrulearns
     */
    public pricingRuleArns: string[] | undefined;

    /**
     * A map that contains tag keys and tag values that are attached to a pricing plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::BillingConductor::PricingPlan`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPricingPlanProps) {
        super(scope, id, { type: CfnPricingPlan.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asNumber(this.getAtt('CreationTime', cdk.ResolutionTypeHint.NUMBER));
        this.attrLastModifiedTime = cdk.Token.asNumber(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.NUMBER));
        this.attrSize = cdk.Token.asNumber(this.getAtt('Size', cdk.ResolutionTypeHint.NUMBER));

        this.name = props.name;
        this.description = props.description;
        this.pricingRuleArns = props.pricingRuleArns;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BillingConductor::PricingPlan", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPricingPlan.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            description: this.description,
            pricingRuleArns: this.pricingRuleArns,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPricingPlanPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPricingRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html
 */
export interface CfnPricingRuleProps {

    /**
     * The name of a pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-name
     */
    readonly name: string;

    /**
     * The scope of pricing rule that indicates if it is globally applicable, or if it is service-specific.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-scope
     */
    readonly scope: string;

    /**
     * The type of pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-type
     */
    readonly type: string;

    /**
     * The seller of services provided by AWS , their affiliates, or third-party providers selling services via AWS Marketplace .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-billingentity
     */
    readonly billingEntity?: string;

    /**
     * The pricing rule description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-description
     */
    readonly description?: string;

    /**
     * A percentage modifier applied on the public pricing rates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-modifierpercentage
     */
    readonly modifierPercentage?: number;

    /**
     * `AWS::BillingConductor::PricingRule.Operation`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-operation
     */
    readonly operation?: string;

    /**
     * If the `Scope` attribute is `SERVICE` , this attribute indicates which service the `PricingRule` is applicable for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-service
     */
    readonly service?: string;

    /**
     * A map that contains tag keys and tag values that are attached to a pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The set of tiering configurations for the pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-tiering
     */
    readonly tiering?: CfnPricingRule.TieringProperty | cdk.IResolvable;

    /**
     * `AWS::BillingConductor::PricingRule.UsageType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-usagetype
     */
    readonly usageType?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPricingRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnPricingRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnPricingRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('billingEntity', cdk.validateString)(properties.billingEntity));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('modifierPercentage', cdk.validateNumber)(properties.modifierPercentage));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('operation', cdk.validateString)(properties.operation));
    errors.collect(cdk.propertyValidator('scope', cdk.requiredValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('service', cdk.validateString)(properties.service));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('tiering', CfnPricingRule_TieringPropertyValidator)(properties.tiering));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('usageType', cdk.validateString)(properties.usageType));
    return errors.wrap('supplied properties not correct for "CfnPricingRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::PricingRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnPricingRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::PricingRule` resource.
 */
// @ts-ignore TS6133
function cfnPricingRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPricingRulePropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Scope: cdk.stringToCloudFormation(properties.scope),
        Type: cdk.stringToCloudFormation(properties.type),
        BillingEntity: cdk.stringToCloudFormation(properties.billingEntity),
        Description: cdk.stringToCloudFormation(properties.description),
        ModifierPercentage: cdk.numberToCloudFormation(properties.modifierPercentage),
        Operation: cdk.stringToCloudFormation(properties.operation),
        Service: cdk.stringToCloudFormation(properties.service),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Tiering: cfnPricingRuleTieringPropertyToCloudFormation(properties.tiering),
        UsageType: cdk.stringToCloudFormation(properties.usageType),
    };
}

// @ts-ignore TS6133
function CfnPricingRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPricingRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPricingRuleProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('scope', 'Scope', cfn_parse.FromCloudFormation.getString(properties.Scope));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('billingEntity', 'BillingEntity', properties.BillingEntity != null ? cfn_parse.FromCloudFormation.getString(properties.BillingEntity) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('modifierPercentage', 'ModifierPercentage', properties.ModifierPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ModifierPercentage) : undefined);
    ret.addPropertyResult('operation', 'Operation', properties.Operation != null ? cfn_parse.FromCloudFormation.getString(properties.Operation) : undefined);
    ret.addPropertyResult('service', 'Service', properties.Service != null ? cfn_parse.FromCloudFormation.getString(properties.Service) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('tiering', 'Tiering', properties.Tiering != null ? CfnPricingRuleTieringPropertyFromCloudFormation(properties.Tiering) : undefined);
    ret.addPropertyResult('usageType', 'UsageType', properties.UsageType != null ? cfn_parse.FromCloudFormation.getString(properties.UsageType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::BillingConductor::PricingRule`
 *
 * Creates a pricing rule which can be associated with a pricing plan, or a set of pricing plans.
 *
 * @cloudformationResource AWS::BillingConductor::PricingRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html
 */
export class CfnPricingRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::BillingConductor::PricingRule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPricingRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPricingRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPricingRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) used to uniquely identify a pricing rule.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The pricing plans count that this pricing rule is associated with.
     * @cloudformationAttribute AssociatedPricingPlanCount
     */
    public readonly attrAssociatedPricingPlanCount: number;

    /**
     * The time the pricing rule was created.
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: number;

    /**
     * The most recent time the pricing rule was modified.
     * @cloudformationAttribute LastModifiedTime
     */
    public readonly attrLastModifiedTime: number;

    /**
     * The name of a pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-name
     */
    public name: string;

    /**
     * The scope of pricing rule that indicates if it is globally applicable, or if it is service-specific.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-scope
     */
    public scope: string;

    /**
     * The type of pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-type
     */
    public type: string;

    /**
     * The seller of services provided by AWS , their affiliates, or third-party providers selling services via AWS Marketplace .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-billingentity
     */
    public billingEntity: string | undefined;

    /**
     * The pricing rule description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-description
     */
    public description: string | undefined;

    /**
     * A percentage modifier applied on the public pricing rates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-modifierpercentage
     */
    public modifierPercentage: number | undefined;

    /**
     * `AWS::BillingConductor::PricingRule.Operation`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-operation
     */
    public operation: string | undefined;

    /**
     * If the `Scope` attribute is `SERVICE` , this attribute indicates which service the `PricingRule` is applicable for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-service
     */
    public service: string | undefined;

    /**
     * A map that contains tag keys and tag values that are attached to a pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The set of tiering configurations for the pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-tiering
     */
    public tiering: CfnPricingRule.TieringProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::BillingConductor::PricingRule.UsageType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-usagetype
     */
    public usageType: string | undefined;

    /**
     * Create a new `AWS::BillingConductor::PricingRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPricingRuleProps) {
        super(scope, id, { type: CfnPricingRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'scope', this);
        cdk.requireProperty(props, 'type', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrAssociatedPricingPlanCount = cdk.Token.asNumber(this.getAtt('AssociatedPricingPlanCount', cdk.ResolutionTypeHint.NUMBER));
        this.attrCreationTime = cdk.Token.asNumber(this.getAtt('CreationTime', cdk.ResolutionTypeHint.NUMBER));
        this.attrLastModifiedTime = cdk.Token.asNumber(this.getAtt('LastModifiedTime', cdk.ResolutionTypeHint.NUMBER));

        this.name = props.name;
        this.scope = props.scope;
        this.type = props.type;
        this.billingEntity = props.billingEntity;
        this.description = props.description;
        this.modifierPercentage = props.modifierPercentage;
        this.operation = props.operation;
        this.service = props.service;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BillingConductor::PricingRule", props.tags, { tagPropertyName: 'tags' });
        this.tiering = props.tiering;
        this.usageType = props.usageType;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPricingRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            scope: this.scope,
            type: this.type,
            billingEntity: this.billingEntity,
            description: this.description,
            modifierPercentage: this.modifierPercentage,
            operation: this.operation,
            service: this.service,
            tags: this.tags.renderTags(),
            tiering: this.tiering,
            usageType: this.usageType,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPricingRulePropsToCloudFormation(props);
    }
}

export namespace CfnPricingRule {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-freetier.html
     */
    export interface FreeTierProperty {
        /**
         * `CfnPricingRule.FreeTierProperty.Activated`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-freetier.html#cfn-billingconductor-pricingrule-freetier-activated
         */
        readonly activated: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FreeTierProperty`
 *
 * @param properties - the TypeScript properties of a `FreeTierProperty`
 *
 * @returns the result of the validation.
 */
function CfnPricingRule_FreeTierPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activated', cdk.requiredValidator)(properties.activated));
    errors.collect(cdk.propertyValidator('activated', cdk.validateBoolean)(properties.activated));
    return errors.wrap('supplied properties not correct for "FreeTierProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::PricingRule.FreeTier` resource
 *
 * @param properties - the TypeScript properties of a `FreeTierProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::PricingRule.FreeTier` resource.
 */
// @ts-ignore TS6133
function cfnPricingRuleFreeTierPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPricingRule_FreeTierPropertyValidator(properties).assertSuccess();
    return {
        Activated: cdk.booleanToCloudFormation(properties.activated),
    };
}

// @ts-ignore TS6133
function CfnPricingRuleFreeTierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPricingRule.FreeTierProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPricingRule.FreeTierProperty>();
    ret.addPropertyResult('activated', 'Activated', cfn_parse.FromCloudFormation.getBoolean(properties.Activated));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPricingRule {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-tiering.html
     */
    export interface TieringProperty {
        /**
         * `CfnPricingRule.TieringProperty.FreeTier`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-tiering.html#cfn-billingconductor-pricingrule-tiering-freetier
         */
        readonly freeTier?: CfnPricingRule.FreeTierProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TieringProperty`
 *
 * @param properties - the TypeScript properties of a `TieringProperty`
 *
 * @returns the result of the validation.
 */
function CfnPricingRule_TieringPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('freeTier', CfnPricingRule_FreeTierPropertyValidator)(properties.freeTier));
    return errors.wrap('supplied properties not correct for "TieringProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::BillingConductor::PricingRule.Tiering` resource
 *
 * @param properties - the TypeScript properties of a `TieringProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::BillingConductor::PricingRule.Tiering` resource.
 */
// @ts-ignore TS6133
function cfnPricingRuleTieringPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPricingRule_TieringPropertyValidator(properties).assertSuccess();
    return {
        FreeTier: cfnPricingRuleFreeTierPropertyToCloudFormation(properties.freeTier),
    };
}

// @ts-ignore TS6133
function CfnPricingRuleTieringPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPricingRule.TieringProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPricingRule.TieringProperty>();
    ret.addPropertyResult('freeTier', 'FreeTier', properties.FreeTier != null ? CfnPricingRuleFreeTierPropertyFromCloudFormation(properties.FreeTier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
