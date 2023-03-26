import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html
 */
export interface CfnGroupProps {
    /**
     * The filter expression defining the parameters to include traces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-filterexpression
     */
    readonly filterExpression?: string;
    /**
     * The unique case-sensitive name of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-groupname
     */
    readonly groupName?: string;
    /**
     * The structure containing configurations related to insights.
     *
     * - The InsightsEnabled boolean can be set to true to enable insights for the group or false to disable insights for the group.
     * - The NotificationsEnabled boolean can be set to true to enable insights notifications through Amazon EventBridge for the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-insightsconfiguration
     */
    readonly insightsConfiguration?: CfnGroup.InsightsConfigurationProperty | cdk.IResolvable;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-tags
     */
    readonly tags?: any[];
}
/**
 * A CloudFormation `AWS::XRay::Group`
 *
 * Use the `AWS::XRay::Group` resource to specify a group with a name and a filter expression.
 *
 * @cloudformationResource AWS::XRay::Group
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html
 */
export declare class CfnGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::XRay::Group";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroup;
    /**
     * The group ARN that was created or updated.
     * @cloudformationAttribute GroupARN
     */
    readonly attrGroupArn: string;
    /**
     * The filter expression defining the parameters to include traces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-filterexpression
     */
    filterExpression: string | undefined;
    /**
     * The unique case-sensitive name of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-groupname
     */
    groupName: string | undefined;
    /**
     * The structure containing configurations related to insights.
     *
     * - The InsightsEnabled boolean can be set to true to enable insights for the group or false to disable insights for the group.
     * - The NotificationsEnabled boolean can be set to true to enable insights notifications through Amazon EventBridge for the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-insightsconfiguration
     */
    insightsConfiguration: CfnGroup.InsightsConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-tags
     */
    tags: any[] | undefined;
    /**
     * Create a new `AWS::XRay::Group`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnGroupProps);
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
export declare namespace CfnGroup {
    /**
     * The structure containing configurations related to insights.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-insightsconfiguration.html
     */
    interface InsightsConfigurationProperty {
        /**
         * Set the InsightsEnabled value to true to enable insights or false to disable insights.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-insightsconfiguration.html#cfn-xray-group-insightsconfiguration-insightsenabled
         */
        readonly insightsEnabled?: boolean | cdk.IResolvable;
        /**
         * Set the NotificationsEnabled value to true to enable insights notifications. Notifications can only be enabled on a group with InsightsEnabled set to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-insightsconfiguration.html#cfn-xray-group-insightsconfiguration-notificationsenabled
         */
        readonly notificationsEnabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnGroup {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-tagsitems.html
     */
    interface TagsItemsProperty {
        /**
         * `CfnGroup.TagsItemsProperty.Key`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-tagsitems.html#cfn-xray-group-tagsitems-key
         */
        readonly key: string;
        /**
         * `CfnGroup.TagsItemsProperty.Value`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-tagsitems.html#cfn-xray-group-tagsitems-value
         */
        readonly value: string;
    }
}
/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {
    /**
     * The resource policy document, which can be up to 5kb in size.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-policydocument
     */
    readonly policyDocument: string;
    /**
     * The name of the resource policy. Must be unique within a specific AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-policyname
     */
    readonly policyName: string;
    /**
     * `AWS::XRay::ResourcePolicy.BypassPolicyLockoutCheck`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-bypasspolicylockoutcheck
     */
    readonly bypassPolicyLockoutCheck?: boolean | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::XRay::ResourcePolicy`
 *
 * Sets the resource policy to grant one or more AWS services and accounts permissions to access X-Ray. Each resource policy will be associated with a specific AWS account. Each AWS account can have a maximum of 5 resource policies, and each policy name must be unique within that account. The maximum size of each resource policy is 5KB.
 *
 * @cloudformationResource AWS::XRay::ResourcePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html
 */
export declare class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::XRay::ResourcePolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy;
    /**
     * The resource policy document, which can be up to 5kb in size.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-policydocument
     */
    policyDocument: string;
    /**
     * The name of the resource policy. Must be unique within a specific AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-policyname
     */
    policyName: string;
    /**
     * `AWS::XRay::ResourcePolicy.BypassPolicyLockoutCheck`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-bypasspolicylockoutcheck
     */
    bypassPolicyLockoutCheck: boolean | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::XRay::ResourcePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps);
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
 * Properties for defining a `CfnSamplingRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html
 */
export interface CfnSamplingRuleProps {
    /**
     * The name of the sampling rule. Specify a rule by either name or ARN, but not both. Used only when deleting a sampling rule. When creating or updating a sampling rule, use the `RuleName` or `RuleARN` properties within `SamplingRule` or `SamplingRuleUpdate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-rulename
     */
    readonly ruleName?: string;
    /**
     * The sampling rule to be created.
     *
     * Must be provided if creating a new sampling rule. Not valid when updating an existing sampling rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingrule
     */
    readonly samplingRule?: CfnSamplingRule.SamplingRuleProperty | cdk.IResolvable;
    /**
     * `AWS::XRay::SamplingRule.SamplingRuleRecord`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingrulerecord
     */
    readonly samplingRuleRecord?: CfnSamplingRule.SamplingRuleRecordProperty | cdk.IResolvable;
    /**
     * A document specifying changes to a sampling rule's configuration.
     *
     * Must be provided if updating an existing sampling rule. Not valid when creating a new sampling rule.
     *
     * > The `Version` of a sampling rule cannot be updated, and is not part of `SamplingRuleUpdate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingruleupdate
     */
    readonly samplingRuleUpdate?: CfnSamplingRule.SamplingRuleUpdateProperty | cdk.IResolvable;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-tags
     */
    readonly tags?: any[];
}
/**
 * A CloudFormation `AWS::XRay::SamplingRule`
 *
 * Use the `AWS::XRay::SamplingRule` resource to specify a sampling rule, which controls sampling behavior for instrumented applications. A new sampling rule is created by specifying a `SamplingRule` . To change the configuration of an existing sampling rule, specify a `SamplingRuleUpdate` .
 *
 * Services retrieve rules with [GetSamplingRules](https://docs.aws.amazon.com//xray/latest/api/API_GetSamplingRules.html) , and evaluate each rule in ascending order of *priority* for each request. If a rule matches, the service records a trace, borrowing it from the reservoir size. After 10 seconds, the service reports back to X-Ray with [GetSamplingTargets](https://docs.aws.amazon.com//xray/latest/api/API_GetSamplingTargets.html) to get updated versions of each in-use rule. The updated rule contains a trace quota that the service can use instead of borrowing from the reservoir.
 *
 * @cloudformationResource AWS::XRay::SamplingRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html
 */
export declare class CfnSamplingRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::XRay::SamplingRule";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSamplingRule;
    /**
     * The sampling rule ARN that was created or updated.
     * @cloudformationAttribute RuleARN
     */
    readonly attrRuleArn: string;
    /**
     * The name of the sampling rule. Specify a rule by either name or ARN, but not both. Used only when deleting a sampling rule. When creating or updating a sampling rule, use the `RuleName` or `RuleARN` properties within `SamplingRule` or `SamplingRuleUpdate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-rulename
     */
    ruleName: string | undefined;
    /**
     * The sampling rule to be created.
     *
     * Must be provided if creating a new sampling rule. Not valid when updating an existing sampling rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingrule
     */
    samplingRule: CfnSamplingRule.SamplingRuleProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::XRay::SamplingRule.SamplingRuleRecord`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingrulerecord
     */
    samplingRuleRecord: CfnSamplingRule.SamplingRuleRecordProperty | cdk.IResolvable | undefined;
    /**
     * A document specifying changes to a sampling rule's configuration.
     *
     * Must be provided if updating an existing sampling rule. Not valid when creating a new sampling rule.
     *
     * > The `Version` of a sampling rule cannot be updated, and is not part of `SamplingRuleUpdate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingruleupdate
     */
    samplingRuleUpdate: CfnSamplingRule.SamplingRuleUpdateProperty | cdk.IResolvable | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-tags
     */
    tags: any[] | undefined;
    /**
     * Create a new `AWS::XRay::SamplingRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnSamplingRuleProps);
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
export declare namespace CfnSamplingRule {
    /**
     * A sampling rule that services use to decide whether to instrument a request. Rule fields can match properties of the service, or properties of a request. The service can ignore rules that don't match its properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html
     */
    interface SamplingRuleProperty {
        /**
         * Matches attributes derived from the request.
         *
         * *Map Entries:* Maximum number of 5 items.
         *
         * *Key Length Constraints:* Minimum length of 1. Maximum length of 32.
         *
         * *Value Length Constraints:* Minimum length of 1. Maximum length of 32.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-attributes
         */
        readonly attributes?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The percentage of matching requests to instrument, after the reservoir is exhausted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-fixedrate
         */
        readonly fixedRate?: number;
        /**
         * Matches the HTTP method of a request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-httpmethod
         */
        readonly httpMethod?: string;
        /**
         * Matches the hostname from a request URL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-host
         */
        readonly host?: string;
        /**
         * The priority of the sampling rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-priority
         */
        readonly priority?: number;
        /**
         * A fixed number of matching requests to instrument per second, prior to applying the fixed rate. The reservoir is not used directly by services, but applies to all services using the rule collectively.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-reservoirsize
         */
        readonly reservoirSize?: number;
        /**
         * Matches the ARN of the AWS resource on which the service runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-resourcearn
         */
        readonly resourceArn?: string;
        /**
         * The ARN of the sampling rule. You must specify either RuleARN or RuleName, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-rulearn
         */
        readonly ruleArn?: string;
        /**
         * The name of the sampling rule. You must specify either RuleARN or RuleName, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-rulename
         */
        readonly ruleName?: string;
        /**
         * Matches the `name` that the service uses to identify itself in segments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-servicename
         */
        readonly serviceName?: string;
        /**
         * Matches the `origin` that the service uses to identify its type in segments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-servicetype
         */
        readonly serviceType?: string;
        /**
         * Matches the path from a request URL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-urlpath
         */
        readonly urlPath?: string;
        /**
         * The version of the sampling rule format ( `1` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html#cfn-xray-samplingrule-samplingrule-version
         */
        readonly version?: number;
    }
}
export declare namespace CfnSamplingRule {
    /**
     * A [SamplingRule](https://docs.aws.amazon.com//xray/latest/api/API_SamplingRule.html) and its metadata.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html
     */
    interface SamplingRuleRecordProperty {
        /**
         * When the rule was created, in Unix time seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html#cfn-xray-samplingrule-samplingrulerecord-createdat
         */
        readonly createdAt?: string;
        /**
         * When the rule was last modified, in Unix time seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html#cfn-xray-samplingrule-samplingrulerecord-modifiedat
         */
        readonly modifiedAt?: string;
        /**
         * The sampling rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html#cfn-xray-samplingrule-samplingrulerecord-samplingrule
         */
        readonly samplingRule?: CfnSamplingRule.SamplingRuleProperty | cdk.IResolvable;
    }
}
export declare namespace CfnSamplingRule {
    /**
     * A document specifying changes to a sampling rule's configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html
     */
    interface SamplingRuleUpdateProperty {
        /**
         * Matches attributes derived from the request.
         *
         * *Map Entries:* Maximum number of 5 items.
         *
         * *Key Length Constraints:* Minimum length of 1. Maximum length of 32.
         *
         * *Value Length Constraints:* Minimum length of 1. Maximum length of 32.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-attributes
         */
        readonly attributes?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The percentage of matching requests to instrument, after the reservoir is exhausted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-fixedrate
         */
        readonly fixedRate?: number;
        /**
         * Matches the HTTP method of a request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-httpmethod
         */
        readonly httpMethod?: string;
        /**
         * Matches the hostname from a request URL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-host
         */
        readonly host?: string;
        /**
         * The priority of the sampling rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-priority
         */
        readonly priority?: number;
        /**
         * A fixed number of matching requests to instrument per second, prior to applying the fixed rate. The reservoir is not used directly by services, but applies to all services using the rule collectively.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-reservoirsize
         */
        readonly reservoirSize?: number;
        /**
         * Matches the ARN of the AWS resource on which the service runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-resourcearn
         */
        readonly resourceArn?: string;
        /**
         * The ARN of the sampling rule. You must specify either RuleARN or RuleName, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-rulearn
         */
        readonly ruleArn?: string;
        /**
         * The name of the sampling rule. You must specify either RuleARN or RuleName, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-rulename
         */
        readonly ruleName?: string;
        /**
         * Matches the `name` that the service uses to identify itself in segments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-servicename
         */
        readonly serviceName?: string;
        /**
         * Matches the `origin` that the service uses to identify its type in segments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-servicetype
         */
        readonly serviceType?: string;
        /**
         * Matches the path from a request URL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html#cfn-xray-samplingrule-samplingruleupdate-urlpath
         */
        readonly urlPath?: string;
    }
}
export declare namespace CfnSamplingRule {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-tagsitems.html
     */
    interface TagsItemsProperty {
        /**
         * `CfnSamplingRule.TagsItemsProperty.Key`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-tagsitems.html#cfn-xray-samplingrule-tagsitems-key
         */
        readonly key: string;
        /**
         * `CfnSamplingRule.TagsItemsProperty.Value`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-tagsitems.html#cfn-xray-samplingrule-tagsitems-value
         */
        readonly value: string;
    }
}
