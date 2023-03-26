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
 * A CloudFormation `AWS::BillingConductor::BillingGroup`
 *
 * Creates a billing group that resembles a consolidated billing family that AWS charges, based off of the predefined pricing plan computation.
 *
 * @cloudformationResource AWS::BillingConductor::BillingGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html
 */
export declare class CfnBillingGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::BillingConductor::BillingGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBillingGroup;
    /**
     * The Amazon Resource Name (ARN) of the created billing group.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The time the billing group was created.
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: number;
    /**
     * The most recent time the billing group was modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: number;
    /**
     * The number of accounts in the particular billing group.
     * @cloudformationAttribute Size
     */
    readonly attrSize: number;
    /**
     * The billing group status. Only one of the valid values can be used.
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The reason why the billing group is in its current status.
     * @cloudformationAttribute StatusReason
     */
    readonly attrStatusReason: string;
    /**
     * The set of accounts that will be under the billing group. The set of accounts resemble the linked accounts in a consolidated family.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-accountgrouping
     */
    accountGrouping: CfnBillingGroup.AccountGroupingProperty | cdk.IResolvable;
    /**
     * The preferences and settings that will be used to compute the AWS charges for a billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-computationpreference
     */
    computationPreference: CfnBillingGroup.ComputationPreferenceProperty | cdk.IResolvable;
    /**
     * The billing group's name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-name
     */
    name: string;
    /**
     * The account ID that serves as the main account in a billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-primaryaccountid
     */
    primaryAccountId: string;
    /**
     * The description of the billing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-description
     */
    description: string | undefined;
    /**
     * `AWS::BillingConductor::BillingGroup.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::BillingConductor::BillingGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBillingGroupProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnBillingGroup {
    /**
     * The set of accounts that will be under the billing group. The set of accounts resemble the linked accounts in a consolidated family.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-accountgrouping.html
     */
    interface AccountGroupingProperty {
        /**
         * The account IDs that make up the billing group. Account IDs must be a part of the consolidated billing family, and not associated with another billing group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-accountgrouping.html#cfn-billingconductor-billinggroup-accountgrouping-linkedaccountids
         */
        readonly linkedAccountIds: string[];
    }
}
export declare namespace CfnBillingGroup {
    /**
     * The preferences and settings that will be used to compute the AWS charges for a billing group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-computationpreference.html
     */
    interface ComputationPreferenceProperty {
        /**
         * The Amazon Resource Name (ARN) of the pricing plan used to compute the AWS charges for a billing group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-computationpreference.html#cfn-billingconductor-billinggroup-computationpreference-pricingplanarn
         */
        readonly pricingPlanArn: string;
    }
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
 * A CloudFormation `AWS::BillingConductor::CustomLineItem`
 *
 * Creates a custom line item that can be used to create a one-time or recurring, fixed or percentage-based charge that you can apply to a single billing group. You can apply custom line items to the current or previous billing period. You can create either a fee or a discount custom line item.
 *
 * @cloudformationResource AWS::BillingConductor::CustomLineItem
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html
 */
export declare class CfnCustomLineItem extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::BillingConductor::CustomLineItem";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomLineItem;
    /**
     * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The number of resources that are associated to the custom line item.
     * @cloudformationAttribute AssociationSize
     */
    readonly attrAssociationSize: number;
    /**
     * The time created.
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: number;
    /**
     * The custom line item's charge value currency. Only one of the valid values can be used.
     * @cloudformationAttribute CurrencyCode
     */
    readonly attrCurrencyCode: string;
    /**
     * The most recent time the custom line item was modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: number;
    /**
     * The product code associated with the custom line item.
     * @cloudformationAttribute ProductCode
     */
    readonly attrProductCode: string;
    /**
     * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-billinggrouparn
     */
    billingGroupArn: string;
    /**
     * The custom line item's name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-name
     */
    name: string;
    /**
     * A time range for which the custom line item is effective.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-billingperiodrange
     */
    billingPeriodRange: CfnCustomLineItem.BillingPeriodRangeProperty | cdk.IResolvable | undefined;
    /**
     * The charge details of a custom line item. It should contain only one of `Flat` or `Percentage` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-customlineitemchargedetails
     */
    customLineItemChargeDetails: CfnCustomLineItem.CustomLineItemChargeDetailsProperty | cdk.IResolvable | undefined;
    /**
     * The custom line item's description. This is shown on the Bills page in association with the charge value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-description
     */
    description: string | undefined;
    /**
     * A map that contains tag keys and tag values that are attached to a custom line item.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::BillingConductor::CustomLineItem`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCustomLineItemProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnCustomLineItem {
    /**
     * The billing period range in which the custom line item request will be applied.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-billingperiodrange.html
     */
    interface BillingPeriodRangeProperty {
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
export declare namespace CfnCustomLineItem {
    /**
     * The charge details of a custom line item. It should contain only one of `Flat` or `Percentage` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html
     */
    interface CustomLineItemChargeDetailsProperty {
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
export declare namespace CfnCustomLineItem {
    /**
     * The charge details of a custom line item. It should contain only one of `Flat` or `Percentage` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemflatchargedetails.html
     */
    interface CustomLineItemFlatChargeDetailsProperty {
        /**
         * The custom line item's fixed charge value in USD.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemflatchargedetails.html#cfn-billingconductor-customlineitem-customlineitemflatchargedetails-chargevalue
         */
        readonly chargeValue: number;
    }
}
export declare namespace CfnCustomLineItem {
    /**
     * A representation of the charge details associated with a percentage custom line item.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitempercentagechargedetails.html
     */
    interface CustomLineItemPercentageChargeDetailsProperty {
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
 * A CloudFormation `AWS::BillingConductor::PricingPlan`
 *
 * Creates a pricing plan that is used for computing AWS charges for billing groups.
 *
 * @cloudformationResource AWS::BillingConductor::PricingPlan
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html
 */
export declare class CfnPricingPlan extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::BillingConductor::PricingPlan";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPricingPlan;
    /**
     * The Amazon Resource Name (ARN) of the created pricing plan.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The time the pricing plan was created.
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: number;
    /**
     * The most recent time the pricing plan was modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: number;
    /**
     * The pricing rules count currently associated with this pricing plan list element.
     * @cloudformationAttribute Size
     */
    readonly attrSize: number;
    /**
     * The name of a pricing plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-name
     */
    name: string;
    /**
     * The pricing plan description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-description
     */
    description: string | undefined;
    /**
     * The `PricingRuleArns` that are associated with the Pricing Plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-pricingrulearns
     */
    pricingRuleArns: string[] | undefined;
    /**
     * A map that contains tag keys and tag values that are attached to a pricing plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::BillingConductor::PricingPlan`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPricingPlanProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
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
 * A CloudFormation `AWS::BillingConductor::PricingRule`
 *
 * Creates a pricing rule which can be associated with a pricing plan, or a set of pricing plans.
 *
 * @cloudformationResource AWS::BillingConductor::PricingRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html
 */
export declare class CfnPricingRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::BillingConductor::PricingRule";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPricingRule;
    /**
     * The Amazon Resource Name (ARN) used to uniquely identify a pricing rule.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The pricing plans count that this pricing rule is associated with.
     * @cloudformationAttribute AssociatedPricingPlanCount
     */
    readonly attrAssociatedPricingPlanCount: number;
    /**
     * The time the pricing rule was created.
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: number;
    /**
     * The most recent time the pricing rule was modified.
     * @cloudformationAttribute LastModifiedTime
     */
    readonly attrLastModifiedTime: number;
    /**
     * The name of a pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-name
     */
    name: string;
    /**
     * The scope of pricing rule that indicates if it is globally applicable, or if it is service-specific.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-scope
     */
    scope: string;
    /**
     * The type of pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-type
     */
    type: string;
    /**
     * The seller of services provided by AWS , their affiliates, or third-party providers selling services via AWS Marketplace .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-billingentity
     */
    billingEntity: string | undefined;
    /**
     * The pricing rule description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-description
     */
    description: string | undefined;
    /**
     * A percentage modifier applied on the public pricing rates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-modifierpercentage
     */
    modifierPercentage: number | undefined;
    /**
     * `AWS::BillingConductor::PricingRule.Operation`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-operation
     */
    operation: string | undefined;
    /**
     * If the `Scope` attribute is `SERVICE` , this attribute indicates which service the `PricingRule` is applicable for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-service
     */
    service: string | undefined;
    /**
     * A map that contains tag keys and tag values that are attached to a pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The set of tiering configurations for the pricing rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-tiering
     */
    tiering: CfnPricingRule.TieringProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::BillingConductor::PricingRule.UsageType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-usagetype
     */
    usageType: string | undefined;
    /**
     * Create a new `AWS::BillingConductor::PricingRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPricingRuleProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnPricingRule {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-freetier.html
     */
    interface FreeTierProperty {
        /**
         * `CfnPricingRule.FreeTierProperty.Activated`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-freetier.html#cfn-billingconductor-pricingrule-freetier-activated
         */
        readonly activated: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnPricingRule {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-tiering.html
     */
    interface TieringProperty {
        /**
         * `CfnPricingRule.TieringProperty.FreeTier`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-tiering.html#cfn-billingconductor-pricingrule-tiering-freetier
         */
        readonly freeTier?: CfnPricingRule.FreeTierProperty | cdk.IResolvable;
    }
}
