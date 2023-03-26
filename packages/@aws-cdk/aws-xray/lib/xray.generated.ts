// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:36.819Z","fingerprint":"u1q4VFu95+GPlTYj2m0Ju7cZEHZhY4doKLdk6zD2i4k="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

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
 * Determine whether the given properties match those of a `CfnGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filterExpression', cdk.validateString)(properties.filterExpression));
    errors.collect(cdk.propertyValidator('groupName', cdk.validateString)(properties.groupName));
    errors.collect(cdk.propertyValidator('insightsConfiguration', CfnGroup_InsightsConfigurationPropertyValidator)(properties.insightsConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateObject))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::Group` resource
 *
 * @param properties - the TypeScript properties of a `CfnGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::Group` resource.
 */
// @ts-ignore TS6133
function cfnGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGroupPropsValidator(properties).assertSuccess();
    return {
        FilterExpression: cdk.stringToCloudFormation(properties.filterExpression),
        GroupName: cdk.stringToCloudFormation(properties.groupName),
        InsightsConfiguration: cfnGroupInsightsConfigurationPropertyToCloudFormation(properties.insightsConfiguration),
        Tags: cdk.listMapper(cdk.objectToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupProps>();
    ret.addPropertyResult('filterExpression', 'FilterExpression', properties.FilterExpression != null ? cfn_parse.FromCloudFormation.getString(properties.FilterExpression) : undefined);
    ret.addPropertyResult('groupName', 'GroupName', properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined);
    ret.addPropertyResult('insightsConfiguration', 'InsightsConfiguration', properties.InsightsConfiguration != null ? CfnGroupInsightsConfigurationPropertyFromCloudFormation(properties.InsightsConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::XRay::Group";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The group ARN that was created or updated.
     * @cloudformationAttribute GroupARN
     */
    public readonly attrGroupArn: string;

    /**
     * The filter expression defining the parameters to include traces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-filterexpression
     */
    public filterExpression: string | undefined;

    /**
     * The unique case-sensitive name of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-groupname
     */
    public groupName: string | undefined;

    /**
     * The structure containing configurations related to insights.
     *
     * - The InsightsEnabled boolean can be set to true to enable insights for the group or false to disable insights for the group.
     * - The NotificationsEnabled boolean can be set to true to enable insights notifications through Amazon EventBridge for the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-insightsconfiguration
     */
    public insightsConfiguration: CfnGroup.InsightsConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-group.html#cfn-xray-group-tags
     */
    public tags: any[] | undefined;

    /**
     * Create a new `AWS::XRay::Group`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGroupProps = {}) {
        super(scope, id, { type: CfnGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrGroupArn = cdk.Token.asString(this.getAtt('GroupARN', cdk.ResolutionTypeHint.STRING));

        this.filterExpression = props.filterExpression;
        this.groupName = props.groupName;
        this.insightsConfiguration = props.insightsConfiguration;
        this.tags = props.tags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            filterExpression: this.filterExpression,
            groupName: this.groupName,
            insightsConfiguration: this.insightsConfiguration,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGroupPropsToCloudFormation(props);
    }
}

export namespace CfnGroup {
    /**
     * The structure containing configurations related to insights.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-insightsconfiguration.html
     */
    export interface InsightsConfigurationProperty {
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

/**
 * Determine whether the given properties match those of a `InsightsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InsightsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGroup_InsightsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('insightsEnabled', cdk.validateBoolean)(properties.insightsEnabled));
    errors.collect(cdk.propertyValidator('notificationsEnabled', cdk.validateBoolean)(properties.notificationsEnabled));
    return errors.wrap('supplied properties not correct for "InsightsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::Group.InsightsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `InsightsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::Group.InsightsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnGroupInsightsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGroup_InsightsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        InsightsEnabled: cdk.booleanToCloudFormation(properties.insightsEnabled),
        NotificationsEnabled: cdk.booleanToCloudFormation(properties.notificationsEnabled),
    };
}

// @ts-ignore TS6133
function CfnGroupInsightsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroup.InsightsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroup.InsightsConfigurationProperty>();
    ret.addPropertyResult('insightsEnabled', 'InsightsEnabled', properties.InsightsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InsightsEnabled) : undefined);
    ret.addPropertyResult('notificationsEnabled', 'NotificationsEnabled', properties.NotificationsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotificationsEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGroup {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-group-tagsitems.html
     */
    export interface TagsItemsProperty {
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
 * Determine whether the given properties match those of a `TagsItemsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsItemsProperty`
 *
 * @returns the result of the validation.
 */
function CfnGroup_TagsItemsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsItemsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::Group.TagsItems` resource
 *
 * @param properties - the TypeScript properties of a `TagsItemsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::Group.TagsItems` resource.
 */
// @ts-ignore TS6133
function cfnGroupTagsItemsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGroup_TagsItemsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnGroupTagsItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroup.TagsItemsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroup.TagsItemsProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnResourcePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bypassPolicyLockoutCheck', cdk.validateBoolean)(properties.bypassPolicyLockoutCheck));
    errors.collect(cdk.propertyValidator('policyDocument', cdk.requiredValidator)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('policyDocument', cdk.validateString)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('policyName', cdk.requiredValidator)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    return errors.wrap('supplied properties not correct for "CfnResourcePolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::ResourcePolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::ResourcePolicy` resource.
 */
// @ts-ignore TS6133
function cfnResourcePolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourcePolicyPropsValidator(properties).assertSuccess();
    return {
        PolicyDocument: cdk.stringToCloudFormation(properties.policyDocument),
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
        BypassPolicyLockoutCheck: cdk.booleanToCloudFormation(properties.bypassPolicyLockoutCheck),
    };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
    ret.addPropertyResult('policyDocument', 'PolicyDocument', cfn_parse.FromCloudFormation.getString(properties.PolicyDocument));
    ret.addPropertyResult('policyName', 'PolicyName', cfn_parse.FromCloudFormation.getString(properties.PolicyName));
    ret.addPropertyResult('bypassPolicyLockoutCheck', 'BypassPolicyLockoutCheck', properties.BypassPolicyLockoutCheck != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BypassPolicyLockoutCheck) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::XRay::ResourcePolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResourcePolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourcePolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The resource policy document, which can be up to 5kb in size.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-policydocument
     */
    public policyDocument: string;

    /**
     * The name of the resource policy. Must be unique within a specific AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-policyname
     */
    public policyName: string;

    /**
     * `AWS::XRay::ResourcePolicy.BypassPolicyLockoutCheck`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-resourcepolicy.html#cfn-xray-resourcepolicy-bypasspolicylockoutcheck
     */
    public bypassPolicyLockoutCheck: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::XRay::ResourcePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
        super(scope, id, { type: CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policyDocument', this);
        cdk.requireProperty(props, 'policyName', this);

        this.policyDocument = props.policyDocument;
        this.policyName = props.policyName;
        this.bypassPolicyLockoutCheck = props.bypassPolicyLockoutCheck;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            policyDocument: this.policyDocument,
            policyName: this.policyName,
            bypassPolicyLockoutCheck: this.bypassPolicyLockoutCheck,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourcePolicyPropsToCloudFormation(props);
    }
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
 * Determine whether the given properties match those of a `CfnSamplingRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnSamplingRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnSamplingRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ruleName', cdk.validateString)(properties.ruleName));
    errors.collect(cdk.propertyValidator('samplingRule', CfnSamplingRule_SamplingRulePropertyValidator)(properties.samplingRule));
    errors.collect(cdk.propertyValidator('samplingRuleRecord', CfnSamplingRule_SamplingRuleRecordPropertyValidator)(properties.samplingRuleRecord));
    errors.collect(cdk.propertyValidator('samplingRuleUpdate', CfnSamplingRule_SamplingRuleUpdatePropertyValidator)(properties.samplingRuleUpdate));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateObject))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSamplingRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::SamplingRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnSamplingRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::SamplingRule` resource.
 */
// @ts-ignore TS6133
function cfnSamplingRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSamplingRulePropsValidator(properties).assertSuccess();
    return {
        RuleName: cdk.stringToCloudFormation(properties.ruleName),
        SamplingRule: cfnSamplingRuleSamplingRulePropertyToCloudFormation(properties.samplingRule),
        SamplingRuleRecord: cfnSamplingRuleSamplingRuleRecordPropertyToCloudFormation(properties.samplingRuleRecord),
        SamplingRuleUpdate: cfnSamplingRuleSamplingRuleUpdatePropertyToCloudFormation(properties.samplingRuleUpdate),
        Tags: cdk.listMapper(cdk.objectToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSamplingRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSamplingRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRuleProps>();
    ret.addPropertyResult('ruleName', 'RuleName', properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined);
    ret.addPropertyResult('samplingRule', 'SamplingRule', properties.SamplingRule != null ? CfnSamplingRuleSamplingRulePropertyFromCloudFormation(properties.SamplingRule) : undefined);
    ret.addPropertyResult('samplingRuleRecord', 'SamplingRuleRecord', properties.SamplingRuleRecord != null ? CfnSamplingRuleSamplingRuleRecordPropertyFromCloudFormation(properties.SamplingRuleRecord) : undefined);
    ret.addPropertyResult('samplingRuleUpdate', 'SamplingRuleUpdate', properties.SamplingRuleUpdate != null ? CfnSamplingRuleSamplingRuleUpdatePropertyFromCloudFormation(properties.SamplingRuleUpdate) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnSamplingRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::XRay::SamplingRule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSamplingRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSamplingRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnSamplingRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The sampling rule ARN that was created or updated.
     * @cloudformationAttribute RuleARN
     */
    public readonly attrRuleArn: string;

    /**
     * The name of the sampling rule. Specify a rule by either name or ARN, but not both. Used only when deleting a sampling rule. When creating or updating a sampling rule, use the `RuleName` or `RuleARN` properties within `SamplingRule` or `SamplingRuleUpdate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-rulename
     */
    public ruleName: string | undefined;

    /**
     * The sampling rule to be created.
     *
     * Must be provided if creating a new sampling rule. Not valid when updating an existing sampling rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingrule
     */
    public samplingRule: CfnSamplingRule.SamplingRuleProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::XRay::SamplingRule.SamplingRuleRecord`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingrulerecord
     */
    public samplingRuleRecord: CfnSamplingRule.SamplingRuleRecordProperty | cdk.IResolvable | undefined;

    /**
     * A document specifying changes to a sampling rule's configuration.
     *
     * Must be provided if updating an existing sampling rule. Not valid when creating a new sampling rule.
     *
     * > The `Version` of a sampling rule cannot be updated, and is not part of `SamplingRuleUpdate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-samplingruleupdate
     */
    public samplingRuleUpdate: CfnSamplingRule.SamplingRuleUpdateProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-xray-samplingrule.html#cfn-xray-samplingrule-tags
     */
    public tags: any[] | undefined;

    /**
     * Create a new `AWS::XRay::SamplingRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSamplingRuleProps = {}) {
        super(scope, id, { type: CfnSamplingRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrRuleArn = cdk.Token.asString(this.getAtt('RuleARN', cdk.ResolutionTypeHint.STRING));

        this.ruleName = props.ruleName;
        this.samplingRule = props.samplingRule;
        this.samplingRuleRecord = props.samplingRuleRecord;
        this.samplingRuleUpdate = props.samplingRuleUpdate;
        this.tags = props.tags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSamplingRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            ruleName: this.ruleName,
            samplingRule: this.samplingRule,
            samplingRuleRecord: this.samplingRuleRecord,
            samplingRuleUpdate: this.samplingRuleUpdate,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSamplingRulePropsToCloudFormation(props);
    }
}

export namespace CfnSamplingRule {
    /**
     * A sampling rule that services use to decide whether to instrument a request. Rule fields can match properties of the service, or properties of a request. The service can ignore rules that don't match its properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrule.html
     */
    export interface SamplingRuleProperty {
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
        readonly attributes?: { [key: string]: (string) } | cdk.IResolvable;
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

/**
 * Determine whether the given properties match those of a `SamplingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `SamplingRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnSamplingRule_SamplingRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.hashValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('fixedRate', cdk.validateNumber)(properties.fixedRate));
    errors.collect(cdk.propertyValidator('httpMethod', cdk.validateString)(properties.httpMethod));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('reservoirSize', cdk.validateNumber)(properties.reservoirSize));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('ruleArn', cdk.validateString)(properties.ruleArn));
    errors.collect(cdk.propertyValidator('ruleName', cdk.validateString)(properties.ruleName));
    errors.collect(cdk.propertyValidator('serviceName', cdk.validateString)(properties.serviceName));
    errors.collect(cdk.propertyValidator('serviceType', cdk.validateString)(properties.serviceType));
    errors.collect(cdk.propertyValidator('urlPath', cdk.validateString)(properties.urlPath));
    errors.collect(cdk.propertyValidator('version', cdk.validateNumber)(properties.version));
    return errors.wrap('supplied properties not correct for "SamplingRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::SamplingRule.SamplingRule` resource
 *
 * @param properties - the TypeScript properties of a `SamplingRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::SamplingRule.SamplingRule` resource.
 */
// @ts-ignore TS6133
function cfnSamplingRuleSamplingRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSamplingRule_SamplingRulePropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
        FixedRate: cdk.numberToCloudFormation(properties.fixedRate),
        HTTPMethod: cdk.stringToCloudFormation(properties.httpMethod),
        Host: cdk.stringToCloudFormation(properties.host),
        Priority: cdk.numberToCloudFormation(properties.priority),
        ReservoirSize: cdk.numberToCloudFormation(properties.reservoirSize),
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
        RuleARN: cdk.stringToCloudFormation(properties.ruleArn),
        RuleName: cdk.stringToCloudFormation(properties.ruleName),
        ServiceName: cdk.stringToCloudFormation(properties.serviceName),
        ServiceType: cdk.stringToCloudFormation(properties.serviceType),
        URLPath: cdk.stringToCloudFormation(properties.urlPath),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnSamplingRuleSamplingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSamplingRule.SamplingRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRule.SamplingRuleProperty>();
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined);
    ret.addPropertyResult('fixedRate', 'FixedRate', properties.FixedRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.FixedRate) : undefined);
    ret.addPropertyResult('httpMethod', 'HTTPMethod', properties.HTTPMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HTTPMethod) : undefined);
    ret.addPropertyResult('host', 'Host', properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined);
    ret.addPropertyResult('priority', 'Priority', properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined);
    ret.addPropertyResult('reservoirSize', 'ReservoirSize', properties.ReservoirSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReservoirSize) : undefined);
    ret.addPropertyResult('resourceArn', 'ResourceARN', properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined);
    ret.addPropertyResult('ruleArn', 'RuleARN', properties.RuleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RuleARN) : undefined);
    ret.addPropertyResult('ruleName', 'RuleName', properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined);
    ret.addPropertyResult('serviceName', 'ServiceName', properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined);
    ret.addPropertyResult('serviceType', 'ServiceType', properties.ServiceType != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceType) : undefined);
    ret.addPropertyResult('urlPath', 'URLPath', properties.URLPath != null ? cfn_parse.FromCloudFormation.getString(properties.URLPath) : undefined);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSamplingRule {
    /**
     * A [SamplingRule](https://docs.aws.amazon.com//xray/latest/api/API_SamplingRule.html) and its metadata.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingrulerecord.html
     */
    export interface SamplingRuleRecordProperty {
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

/**
 * Determine whether the given properties match those of a `SamplingRuleRecordProperty`
 *
 * @param properties - the TypeScript properties of a `SamplingRuleRecordProperty`
 *
 * @returns the result of the validation.
 */
function CfnSamplingRule_SamplingRuleRecordPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('createdAt', cdk.validateString)(properties.createdAt));
    errors.collect(cdk.propertyValidator('modifiedAt', cdk.validateString)(properties.modifiedAt));
    errors.collect(cdk.propertyValidator('samplingRule', CfnSamplingRule_SamplingRulePropertyValidator)(properties.samplingRule));
    return errors.wrap('supplied properties not correct for "SamplingRuleRecordProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::SamplingRule.SamplingRuleRecord` resource
 *
 * @param properties - the TypeScript properties of a `SamplingRuleRecordProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::SamplingRule.SamplingRuleRecord` resource.
 */
// @ts-ignore TS6133
function cfnSamplingRuleSamplingRuleRecordPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSamplingRule_SamplingRuleRecordPropertyValidator(properties).assertSuccess();
    return {
        CreatedAt: cdk.stringToCloudFormation(properties.createdAt),
        ModifiedAt: cdk.stringToCloudFormation(properties.modifiedAt),
        SamplingRule: cfnSamplingRuleSamplingRulePropertyToCloudFormation(properties.samplingRule),
    };
}

// @ts-ignore TS6133
function CfnSamplingRuleSamplingRuleRecordPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSamplingRule.SamplingRuleRecordProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRule.SamplingRuleRecordProperty>();
    ret.addPropertyResult('createdAt', 'CreatedAt', properties.CreatedAt != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedAt) : undefined);
    ret.addPropertyResult('modifiedAt', 'ModifiedAt', properties.ModifiedAt != null ? cfn_parse.FromCloudFormation.getString(properties.ModifiedAt) : undefined);
    ret.addPropertyResult('samplingRule', 'SamplingRule', properties.SamplingRule != null ? CfnSamplingRuleSamplingRulePropertyFromCloudFormation(properties.SamplingRule) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSamplingRule {
    /**
     * A document specifying changes to a sampling rule's configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-samplingruleupdate.html
     */
    export interface SamplingRuleUpdateProperty {
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
        readonly attributes?: { [key: string]: (string) } | cdk.IResolvable;
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

/**
 * Determine whether the given properties match those of a `SamplingRuleUpdateProperty`
 *
 * @param properties - the TypeScript properties of a `SamplingRuleUpdateProperty`
 *
 * @returns the result of the validation.
 */
function CfnSamplingRule_SamplingRuleUpdatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.hashValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('fixedRate', cdk.validateNumber)(properties.fixedRate));
    errors.collect(cdk.propertyValidator('httpMethod', cdk.validateString)(properties.httpMethod));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('reservoirSize', cdk.validateNumber)(properties.reservoirSize));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('ruleArn', cdk.validateString)(properties.ruleArn));
    errors.collect(cdk.propertyValidator('ruleName', cdk.validateString)(properties.ruleName));
    errors.collect(cdk.propertyValidator('serviceName', cdk.validateString)(properties.serviceName));
    errors.collect(cdk.propertyValidator('serviceType', cdk.validateString)(properties.serviceType));
    errors.collect(cdk.propertyValidator('urlPath', cdk.validateString)(properties.urlPath));
    return errors.wrap('supplied properties not correct for "SamplingRuleUpdateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::SamplingRule.SamplingRuleUpdate` resource
 *
 * @param properties - the TypeScript properties of a `SamplingRuleUpdateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::SamplingRule.SamplingRuleUpdate` resource.
 */
// @ts-ignore TS6133
function cfnSamplingRuleSamplingRuleUpdatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSamplingRule_SamplingRuleUpdatePropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
        FixedRate: cdk.numberToCloudFormation(properties.fixedRate),
        HTTPMethod: cdk.stringToCloudFormation(properties.httpMethod),
        Host: cdk.stringToCloudFormation(properties.host),
        Priority: cdk.numberToCloudFormation(properties.priority),
        ReservoirSize: cdk.numberToCloudFormation(properties.reservoirSize),
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
        RuleARN: cdk.stringToCloudFormation(properties.ruleArn),
        RuleName: cdk.stringToCloudFormation(properties.ruleName),
        ServiceName: cdk.stringToCloudFormation(properties.serviceName),
        ServiceType: cdk.stringToCloudFormation(properties.serviceType),
        URLPath: cdk.stringToCloudFormation(properties.urlPath),
    };
}

// @ts-ignore TS6133
function CfnSamplingRuleSamplingRuleUpdatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSamplingRule.SamplingRuleUpdateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRule.SamplingRuleUpdateProperty>();
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined);
    ret.addPropertyResult('fixedRate', 'FixedRate', properties.FixedRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.FixedRate) : undefined);
    ret.addPropertyResult('httpMethod', 'HTTPMethod', properties.HTTPMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HTTPMethod) : undefined);
    ret.addPropertyResult('host', 'Host', properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined);
    ret.addPropertyResult('priority', 'Priority', properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined);
    ret.addPropertyResult('reservoirSize', 'ReservoirSize', properties.ReservoirSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReservoirSize) : undefined);
    ret.addPropertyResult('resourceArn', 'ResourceARN', properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined);
    ret.addPropertyResult('ruleArn', 'RuleARN', properties.RuleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RuleARN) : undefined);
    ret.addPropertyResult('ruleName', 'RuleName', properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined);
    ret.addPropertyResult('serviceName', 'ServiceName', properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined);
    ret.addPropertyResult('serviceType', 'ServiceType', properties.ServiceType != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceType) : undefined);
    ret.addPropertyResult('urlPath', 'URLPath', properties.URLPath != null ? cfn_parse.FromCloudFormation.getString(properties.URLPath) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSamplingRule {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-xray-samplingrule-tagsitems.html
     */
    export interface TagsItemsProperty {
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

/**
 * Determine whether the given properties match those of a `TagsItemsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsItemsProperty`
 *
 * @returns the result of the validation.
 */
function CfnSamplingRule_TagsItemsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsItemsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::XRay::SamplingRule.TagsItems` resource
 *
 * @param properties - the TypeScript properties of a `TagsItemsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::XRay::SamplingRule.TagsItems` resource.
 */
// @ts-ignore TS6133
function cfnSamplingRuleTagsItemsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSamplingRule_TagsItemsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnSamplingRuleTagsItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSamplingRule.TagsItemsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSamplingRule.TagsItemsProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
