// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:40:01.505Z","fingerprint":"8CPcz5Dvrnk2S/HYSe1UiNPAh6RzGBfy8Niuu4iFXss="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAggregationAuthorization`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html
 */
export interface CfnAggregationAuthorizationProps {

    /**
     * The 12-digit account ID of the account authorized to aggregate data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-authorizedaccountid
     */
    readonly authorizedAccountId: string;

    /**
     * The region authorized to collect aggregated data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-authorizedawsregion
     */
    readonly authorizedAwsRegion: string;

    /**
     * An array of tag object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAggregationAuthorizationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAggregationAuthorizationProps`
 *
 * @returns the result of the validation.
 */
function CfnAggregationAuthorizationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authorizedAccountId', cdk.requiredValidator)(properties.authorizedAccountId));
    errors.collect(cdk.propertyValidator('authorizedAccountId', cdk.validateString)(properties.authorizedAccountId));
    errors.collect(cdk.propertyValidator('authorizedAwsRegion', cdk.requiredValidator)(properties.authorizedAwsRegion));
    errors.collect(cdk.propertyValidator('authorizedAwsRegion', cdk.validateString)(properties.authorizedAwsRegion));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAggregationAuthorizationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::AggregationAuthorization` resource
 *
 * @param properties - the TypeScript properties of a `CfnAggregationAuthorizationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::AggregationAuthorization` resource.
 */
// @ts-ignore TS6133
function cfnAggregationAuthorizationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAggregationAuthorizationPropsValidator(properties).assertSuccess();
    return {
        AuthorizedAccountId: cdk.stringToCloudFormation(properties.authorizedAccountId),
        AuthorizedAwsRegion: cdk.stringToCloudFormation(properties.authorizedAwsRegion),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAggregationAuthorizationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAggregationAuthorizationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAggregationAuthorizationProps>();
    ret.addPropertyResult('authorizedAccountId', 'AuthorizedAccountId', cfn_parse.FromCloudFormation.getString(properties.AuthorizedAccountId));
    ret.addPropertyResult('authorizedAwsRegion', 'AuthorizedAwsRegion', cfn_parse.FromCloudFormation.getString(properties.AuthorizedAwsRegion));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::AggregationAuthorization`
 *
 * An object that represents the authorizations granted to aggregator accounts and regions.
 *
 * @cloudformationResource AWS::Config::AggregationAuthorization
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html
 */
export class CfnAggregationAuthorization extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::AggregationAuthorization";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAggregationAuthorization {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAggregationAuthorizationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAggregationAuthorization(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the aggregation object.
     * @cloudformationAttribute AggregationAuthorizationArn
     */
    public readonly attrAggregationAuthorizationArn: string;

    /**
     * The 12-digit account ID of the account authorized to aggregate data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-authorizedaccountid
     */
    public authorizedAccountId: string;

    /**
     * The region authorized to collect aggregated data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-authorizedawsregion
     */
    public authorizedAwsRegion: string;

    /**
     * An array of tag object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-aggregationauthorization.html#cfn-config-aggregationauthorization-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Config::AggregationAuthorization`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAggregationAuthorizationProps) {
        super(scope, id, { type: CfnAggregationAuthorization.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'authorizedAccountId', this);
        cdk.requireProperty(props, 'authorizedAwsRegion', this);
        this.attrAggregationAuthorizationArn = cdk.Token.asString(this.getAtt('AggregationAuthorizationArn', cdk.ResolutionTypeHint.STRING));

        this.authorizedAccountId = props.authorizedAccountId;
        this.authorizedAwsRegion = props.authorizedAwsRegion;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Config::AggregationAuthorization", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAggregationAuthorization.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            authorizedAccountId: this.authorizedAccountId,
            authorizedAwsRegion: this.authorizedAwsRegion,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAggregationAuthorizationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnConfigRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html
 */
export interface CfnConfigRuleProps {

    /**
     * Provides the rule owner ( `AWS` for managed rules, `CUSTOM_POLICY` for Custom Policy rules, and `CUSTOM_LAMBDA` for Custom Lambda rules), the rule identifier, and the notifications that cause the function to evaluate your AWS resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-source
     */
    readonly source: CfnConfigRule.SourceProperty | cdk.IResolvable;

    /**
     * A name for the AWS Config rule. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the rule name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-configrulename
     */
    readonly configRuleName?: string;

    /**
     * The description that you provide for the AWS Config rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-description
     */
    readonly description?: string;

    /**
     * A string, in JSON format, that is passed to the AWS Config rule Lambda function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-inputparameters
     */
    readonly inputParameters?: any | cdk.IResolvable;

    /**
     * The maximum frequency with which AWS Config runs evaluations for a rule. You can specify a value for `MaximumExecutionFrequency` when:
     *
     * - You are using an AWS managed rule that is triggered at a periodic frequency.
     * - Your custom rule is triggered when AWS Config delivers the configuration snapshot. For more information, see [ConfigSnapshotDeliveryProperties](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigSnapshotDeliveryProperties.html) .
     *
     * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-maximumexecutionfrequency
     */
    readonly maximumExecutionFrequency?: string;

    /**
     * Defines which resources can trigger an evaluation for the rule. The scope can include one or more resource types, a combination of one resource type and one resource ID, or a combination of a tag key and value. Specify a scope to constrain the resources that can trigger an evaluation for the rule. If you do not specify a scope, evaluations are triggered when any resource in the recording group changes.
     *
     * > The scope can be empty.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-scope
     */
    readonly scope?: CfnConfigRule.ScopeProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConfigRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configRuleName', cdk.validateString)(properties.configRuleName));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inputParameters', cdk.validateObject)(properties.inputParameters));
    errors.collect(cdk.propertyValidator('maximumExecutionFrequency', cdk.validateString)(properties.maximumExecutionFrequency));
    errors.collect(cdk.propertyValidator('scope', CfnConfigRule_ScopePropertyValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('source', cdk.requiredValidator)(properties.source));
    errors.collect(cdk.propertyValidator('source', CfnConfigRule_SourcePropertyValidator)(properties.source));
    return errors.wrap('supplied properties not correct for "CfnConfigRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigRule` resource.
 */
// @ts-ignore TS6133
function cfnConfigRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigRulePropsValidator(properties).assertSuccess();
    return {
        Source: cfnConfigRuleSourcePropertyToCloudFormation(properties.source),
        ConfigRuleName: cdk.stringToCloudFormation(properties.configRuleName),
        Description: cdk.stringToCloudFormation(properties.description),
        InputParameters: cdk.objectToCloudFormation(properties.inputParameters),
        MaximumExecutionFrequency: cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
        Scope: cfnConfigRuleScopePropertyToCloudFormation(properties.scope),
    };
}

// @ts-ignore TS6133
function CfnConfigRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRuleProps>();
    ret.addPropertyResult('source', 'Source', CfnConfigRuleSourcePropertyFromCloudFormation(properties.Source));
    ret.addPropertyResult('configRuleName', 'ConfigRuleName', properties.ConfigRuleName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigRuleName) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inputParameters', 'InputParameters', properties.InputParameters != null ? cfn_parse.FromCloudFormation.getAny(properties.InputParameters) : undefined);
    ret.addPropertyResult('maximumExecutionFrequency', 'MaximumExecutionFrequency', properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined);
    ret.addPropertyResult('scope', 'Scope', properties.Scope != null ? CfnConfigRuleScopePropertyFromCloudFormation(properties.Scope) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::ConfigRule`
 *
 * Adds or updates an AWS Config rule to evaluate if your AWS resources comply with your desired configurations. For information on how many AWS Config rules you can have per account, see [*Service Limits*](https://docs.aws.amazon.com/config/latest/developerguide/configlimits.html) in the *AWS Config Developer Guide* .
 *
 * There are two types of rules: *AWS Config Managed Rules* and *AWS Config Custom Rules* . You can use the `ConfigRule` resource to create both AWS Config Managed Rules and AWS Config Custom Rules.
 *
 * AWS Config Managed Rules are predefined, customizable rules created by AWS Config . For a list of managed rules, see [List of AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html) . If you are adding an AWS Config managed rule, you must specify the rule's identifier for the `SourceIdentifier` key.
 *
 * AWS Config Custom Rules are rules that you create from scratch. There are two ways to create AWS Config custom rules: with Lambda functions ( [AWS Lambda Developer Guide](https://docs.aws.amazon.com/config/latest/developerguide/gettingstarted-concepts.html#gettingstarted-concepts-function) ) and with Guard ( [Guard GitHub Repository](https://docs.aws.amazon.com/https://github.com/aws-cloudformation/cloudformation-guard) ), a policy-as-code language. AWS Config custom rules created with AWS Lambda are called *AWS Config Custom Lambda Rules* and AWS Config custom rules created with Guard are called *AWS Config Custom Policy Rules* .
 *
 * If you are adding a new AWS Config Custom Lambda rule, you first need to create an AWS Lambda function that the rule invokes to evaluate your resources. When you use the `ConfigRule` resource to add a Custom Lambda rule to AWS Config , you must specify the Amazon Resource Name (ARN) that AWS Lambda assigns to the function. You specify the ARN in the `SourceIdentifier` key. This key is part of the `Source` object, which is part of the `ConfigRule` object.
 *
 * For any new AWS Config rule that you add, specify the `ConfigRuleName` in the `ConfigRule` object. Do not specify the `ConfigRuleArn` or the `ConfigRuleId` . These values are generated by AWS Config for new rules.
 *
 * If you are updating a rule that you added previously, you can specify the rule by `ConfigRuleName` , `ConfigRuleId` , or `ConfigRuleArn` in the `ConfigRule` data type that you use in this request.
 *
 * For more information about developing and using AWS Config rules, see [Evaluating Resources with AWS Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html) in the *AWS Config Developer Guide* .
 *
 * @cloudformationResource AWS::Config::ConfigRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html
 */
export class CfnConfigRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::ConfigRule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfigRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the AWS Config rule, such as `arn:aws:config:us-east-1:123456789012:config-rule/config-rule-a1bzhi` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The compliance status of an AWS Config rule, such as `COMPLIANT` or `NON_COMPLIANT` .
     * @cloudformationAttribute Compliance.Type
     */
    public readonly attrComplianceType: string;

    /**
     * The ID of the AWS Config rule, such as `config-rule-a1bzhi` .
     * @cloudformationAttribute ConfigRuleId
     */
    public readonly attrConfigRuleId: string;

    /**
     * Provides the rule owner ( `AWS` for managed rules, `CUSTOM_POLICY` for Custom Policy rules, and `CUSTOM_LAMBDA` for Custom Lambda rules), the rule identifier, and the notifications that cause the function to evaluate your AWS resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-source
     */
    public source: CfnConfigRule.SourceProperty | cdk.IResolvable;

    /**
     * A name for the AWS Config rule. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the rule name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-configrulename
     */
    public configRuleName: string | undefined;

    /**
     * The description that you provide for the AWS Config rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-description
     */
    public description: string | undefined;

    /**
     * A string, in JSON format, that is passed to the AWS Config rule Lambda function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-inputparameters
     */
    public inputParameters: any | cdk.IResolvable | undefined;

    /**
     * The maximum frequency with which AWS Config runs evaluations for a rule. You can specify a value for `MaximumExecutionFrequency` when:
     *
     * - You are using an AWS managed rule that is triggered at a periodic frequency.
     * - Your custom rule is triggered when AWS Config delivers the configuration snapshot. For more information, see [ConfigSnapshotDeliveryProperties](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigSnapshotDeliveryProperties.html) .
     *
     * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-maximumexecutionfrequency
     */
    public maximumExecutionFrequency: string | undefined;

    /**
     * Defines which resources can trigger an evaluation for the rule. The scope can include one or more resource types, a combination of one resource type and one resource ID, or a combination of a tag key and value. Specify a scope to constrain the resources that can trigger an evaluation for the rule. If you do not specify a scope, evaluations are triggered when any resource in the recording group changes.
     *
     * > The scope can be empty.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-scope
     */
    public scope: CfnConfigRule.ScopeProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Config::ConfigRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigRuleProps) {
        super(scope, id, { type: CfnConfigRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'source', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrComplianceType = cdk.Token.asString(this.getAtt('Compliance.Type', cdk.ResolutionTypeHint.STRING));
        this.attrConfigRuleId = cdk.Token.asString(this.getAtt('ConfigRuleId', cdk.ResolutionTypeHint.STRING));

        this.source = props.source;
        this.configRuleName = props.configRuleName;
        this.description = props.description;
        this.inputParameters = props.inputParameters;
        this.maximumExecutionFrequency = props.maximumExecutionFrequency;
        this.scope = props.scope;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            source: this.source,
            configRuleName: this.configRuleName,
            description: this.description,
            inputParameters: this.inputParameters,
            maximumExecutionFrequency: this.maximumExecutionFrequency,
            scope: this.scope,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigRulePropsToCloudFormation(props);
    }
}

export namespace CfnConfigRule {
    /**
     * Provides the runtime system, policy definition, and whether debug logging enabled. You can specify the following CustomPolicyDetails parameter values only for AWS Config Custom Policy rules.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-custompolicydetails.html
     */
    export interface CustomPolicyDetailsProperty {
        /**
         * The boolean expression for enabling debug logging for your AWS Config Custom Policy rule. The default value is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-custompolicydetails.html#cfn-config-configrule-custompolicydetails-enabledebuglogdelivery
         */
        readonly enableDebugLogDelivery?: boolean | cdk.IResolvable;
        /**
         * The runtime system for your AWS Config Custom Policy rule. Guard is a policy-as-code language that allows you to write policies that are enforced by AWS Config Custom Policy rules. For more information about Guard, see the [Guard GitHub Repository](https://docs.aws.amazon.com/https://github.com/aws-cloudformation/cloudformation-guard) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-custompolicydetails.html#cfn-config-configrule-custompolicydetails-policyruntime
         */
        readonly policyRuntime?: string;
        /**
         * The policy definition containing the logic for your AWS Config Custom Policy rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-custompolicydetails.html#cfn-config-configrule-custompolicydetails-policytext
         */
        readonly policyText?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomPolicyDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomPolicyDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigRule_CustomPolicyDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enableDebugLogDelivery', cdk.validateBoolean)(properties.enableDebugLogDelivery));
    errors.collect(cdk.propertyValidator('policyRuntime', cdk.validateString)(properties.policyRuntime));
    errors.collect(cdk.propertyValidator('policyText', cdk.validateString)(properties.policyText));
    return errors.wrap('supplied properties not correct for "CustomPolicyDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigRule.CustomPolicyDetails` resource
 *
 * @param properties - the TypeScript properties of a `CustomPolicyDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigRule.CustomPolicyDetails` resource.
 */
// @ts-ignore TS6133
function cfnConfigRuleCustomPolicyDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigRule_CustomPolicyDetailsPropertyValidator(properties).assertSuccess();
    return {
        EnableDebugLogDelivery: cdk.booleanToCloudFormation(properties.enableDebugLogDelivery),
        PolicyRuntime: cdk.stringToCloudFormation(properties.policyRuntime),
        PolicyText: cdk.stringToCloudFormation(properties.policyText),
    };
}

// @ts-ignore TS6133
function CfnConfigRuleCustomPolicyDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRule.CustomPolicyDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.CustomPolicyDetailsProperty>();
    ret.addPropertyResult('enableDebugLogDelivery', 'EnableDebugLogDelivery', properties.EnableDebugLogDelivery != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDebugLogDelivery) : undefined);
    ret.addPropertyResult('policyRuntime', 'PolicyRuntime', properties.PolicyRuntime != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyRuntime) : undefined);
    ret.addPropertyResult('policyText', 'PolicyText', properties.PolicyText != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyText) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigRule {
    /**
     * Defines which resources trigger an evaluation for an AWS Config rule. The scope can include one or more resource types, a combination of a tag key and value, or a combination of one resource type and one resource ID. Specify a scope to constrain which resources trigger an evaluation for a rule. Otherwise, evaluations for the rule are triggered when any resource in your recording group changes in configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html
     */
    export interface ScopeProperty {
        /**
         * The ID of the only AWS resource that you want to trigger an evaluation for the rule. If you specify a resource ID, you must specify one resource type for `ComplianceResourceTypes` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-complianceresourceid
         */
        readonly complianceResourceId?: string;
        /**
         * The resource types of only those AWS resources that you want to trigger an evaluation for the rule. You can only specify one type if you also specify a resource ID for `ComplianceResourceId` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-complianceresourcetypes
         */
        readonly complianceResourceTypes?: string[];
        /**
         * The tag key that is applied to only those AWS resources that you want to trigger an evaluation for the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-tagkey
         */
        readonly tagKey?: string;
        /**
         * The tag value applied to only those AWS resources that you want to trigger an evaluation for the rule. If you specify a value for `TagValue` , you must also specify a value for `TagKey` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-tagvalue
         */
        readonly tagValue?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScopeProperty`
 *
 * @param properties - the TypeScript properties of a `ScopeProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigRule_ScopePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('complianceResourceId', cdk.validateString)(properties.complianceResourceId));
    errors.collect(cdk.propertyValidator('complianceResourceTypes', cdk.listValidator(cdk.validateString))(properties.complianceResourceTypes));
    errors.collect(cdk.propertyValidator('tagKey', cdk.validateString)(properties.tagKey));
    errors.collect(cdk.propertyValidator('tagValue', cdk.validateString)(properties.tagValue));
    return errors.wrap('supplied properties not correct for "ScopeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigRule.Scope` resource
 *
 * @param properties - the TypeScript properties of a `ScopeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigRule.Scope` resource.
 */
// @ts-ignore TS6133
function cfnConfigRuleScopePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigRule_ScopePropertyValidator(properties).assertSuccess();
    return {
        ComplianceResourceId: cdk.stringToCloudFormation(properties.complianceResourceId),
        ComplianceResourceTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.complianceResourceTypes),
        TagKey: cdk.stringToCloudFormation(properties.tagKey),
        TagValue: cdk.stringToCloudFormation(properties.tagValue),
    };
}

// @ts-ignore TS6133
function CfnConfigRuleScopePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRule.ScopeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.ScopeProperty>();
    ret.addPropertyResult('complianceResourceId', 'ComplianceResourceId', properties.ComplianceResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ComplianceResourceId) : undefined);
    ret.addPropertyResult('complianceResourceTypes', 'ComplianceResourceTypes', properties.ComplianceResourceTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ComplianceResourceTypes) : undefined);
    ret.addPropertyResult('tagKey', 'TagKey', properties.TagKey != null ? cfn_parse.FromCloudFormation.getString(properties.TagKey) : undefined);
    ret.addPropertyResult('tagValue', 'TagValue', properties.TagValue != null ? cfn_parse.FromCloudFormation.getString(properties.TagValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigRule {
    /**
     * Provides the CustomPolicyDetails, the rule owner ( `AWS` for managed rules, `CUSTOM_POLICY` for Custom Policy rules, and `CUSTOM_LAMBDA` for Custom Lambda rules), the rule identifier, and the events that cause the evaluation of your AWS resources.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html
     */
    export interface SourceProperty {
        /**
         * Provides the runtime system, policy definition, and whether debug logging is enabled. Required when owner is set to `CUSTOM_POLICY` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-custompolicydetails
         */
        readonly customPolicyDetails?: CfnConfigRule.CustomPolicyDetailsProperty | cdk.IResolvable;
        /**
         * Indicates whether AWS or the customer owns and manages the AWS Config rule.
         *
         * AWS Config Managed Rules are predefined rules owned by AWS . For more information, see [AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_use-managed-rules.html) in the *AWS Config developer guide* .
         *
         * AWS Config Custom Rules are rules that you can develop either with Guard ( `CUSTOM_POLICY` ) or AWS Lambda ( `CUSTOM_LAMBDA` ). For more information, see [AWS Config Custom Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html) in the *AWS Config developer guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-owner
         */
        readonly owner: string;
        /**
         * Provides the source and the message types that cause AWS Config to evaluate your AWS resources against a rule. It also provides the frequency with which you want AWS Config to run evaluations for the rule if the trigger type is periodic.
         *
         * If the owner is set to `CUSTOM_POLICY` , the only acceptable values for the AWS Config rule trigger message type are `ConfigurationItemChangeNotification` and `OversizedConfigurationItemChangeNotification` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-sourcedetails
         */
        readonly sourceDetails?: Array<CfnConfigRule.SourceDetailProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * For AWS Config Managed rules, a predefined identifier from a list. For example, `IAM_PASSWORD_POLICY` is a managed rule. To reference a managed rule, see [List of AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html) .
         *
         * For AWS Config Custom Lambda rules, the identifier is the Amazon Resource Name (ARN) of the rule's AWS Lambda function, such as `arn:aws:lambda:us-east-2:123456789012:function:custom_rule_name` .
         *
         * For AWS Config Custom Policy rules, this field will be ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-sourceidentifier
         */
        readonly sourceIdentifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigRule_SourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customPolicyDetails', CfnConfigRule_CustomPolicyDetailsPropertyValidator)(properties.customPolicyDetails));
    errors.collect(cdk.propertyValidator('owner', cdk.requiredValidator)(properties.owner));
    errors.collect(cdk.propertyValidator('owner', cdk.validateString)(properties.owner));
    errors.collect(cdk.propertyValidator('sourceDetails', cdk.listValidator(CfnConfigRule_SourceDetailPropertyValidator))(properties.sourceDetails));
    errors.collect(cdk.propertyValidator('sourceIdentifier', cdk.validateString)(properties.sourceIdentifier));
    return errors.wrap('supplied properties not correct for "SourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigRule.Source` resource
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigRule.Source` resource.
 */
// @ts-ignore TS6133
function cfnConfigRuleSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigRule_SourcePropertyValidator(properties).assertSuccess();
    return {
        CustomPolicyDetails: cfnConfigRuleCustomPolicyDetailsPropertyToCloudFormation(properties.customPolicyDetails),
        Owner: cdk.stringToCloudFormation(properties.owner),
        SourceDetails: cdk.listMapper(cfnConfigRuleSourceDetailPropertyToCloudFormation)(properties.sourceDetails),
        SourceIdentifier: cdk.stringToCloudFormation(properties.sourceIdentifier),
    };
}

// @ts-ignore TS6133
function CfnConfigRuleSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRule.SourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.SourceProperty>();
    ret.addPropertyResult('customPolicyDetails', 'CustomPolicyDetails', properties.CustomPolicyDetails != null ? CfnConfigRuleCustomPolicyDetailsPropertyFromCloudFormation(properties.CustomPolicyDetails) : undefined);
    ret.addPropertyResult('owner', 'Owner', cfn_parse.FromCloudFormation.getString(properties.Owner));
    ret.addPropertyResult('sourceDetails', 'SourceDetails', properties.SourceDetails != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigRuleSourceDetailPropertyFromCloudFormation)(properties.SourceDetails) : undefined);
    ret.addPropertyResult('sourceIdentifier', 'SourceIdentifier', properties.SourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceIdentifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigRule {
    /**
     * Provides the source and the message types that trigger AWS Config to evaluate your AWS resources against a rule. It also provides the frequency with which you want AWS Config to run evaluations for the rule if the trigger type is periodic. You can specify the parameter values for `SourceDetail` only for custom rules.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html
     */
    export interface SourceDetailProperty {
        /**
         * The source of the event, such as an AWS service, that triggers AWS Config to evaluate your AWS resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-source-sourcedetail-eventsource
         */
        readonly eventSource: string;
        /**
         * The frequency at which you want AWS Config to run evaluations for a custom rule with a periodic trigger. If you specify a value for `MaximumExecutionFrequency` , then `MessageType` must use the `ScheduledNotification` value.
         *
         * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
         * >
         * > Based on the valid value you choose, AWS Config runs evaluations once for each valid value. For example, if you choose `Three_Hours` , AWS Config runs evaluations once every three hours. In this case, `Three_Hours` is the frequency of this rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-sourcedetail-maximumexecutionfrequency
         */
        readonly maximumExecutionFrequency?: string;
        /**
         * The type of notification that triggers AWS Config to run an evaluation for a rule. You can specify the following notification types:
         *
         * - `ConfigurationItemChangeNotification` - Triggers an evaluation when AWS Config delivers a configuration item as a result of a resource change.
         * - `OversizedConfigurationItemChangeNotification` - Triggers an evaluation when AWS Config delivers an oversized configuration item. AWS Config may generate this notification type when a resource changes and the notification exceeds the maximum size allowed by Amazon SNS.
         * - `ScheduledNotification` - Triggers a periodic evaluation at the frequency specified for `MaximumExecutionFrequency` .
         * - `ConfigurationSnapshotDeliveryCompleted` - Triggers a periodic evaluation when AWS Config delivers a configuration snapshot.
         *
         * If you want your custom rule to be triggered by configuration changes, specify two SourceDetail objects, one for `ConfigurationItemChangeNotification` and one for `OversizedConfigurationItemChangeNotification` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source-sourcedetails.html#cfn-config-configrule-source-sourcedetail-messagetype
         */
        readonly messageType: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceDetailProperty`
 *
 * @param properties - the TypeScript properties of a `SourceDetailProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigRule_SourceDetailPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventSource', cdk.requiredValidator)(properties.eventSource));
    errors.collect(cdk.propertyValidator('eventSource', cdk.validateString)(properties.eventSource));
    errors.collect(cdk.propertyValidator('maximumExecutionFrequency', cdk.validateString)(properties.maximumExecutionFrequency));
    errors.collect(cdk.propertyValidator('messageType', cdk.requiredValidator)(properties.messageType));
    errors.collect(cdk.propertyValidator('messageType', cdk.validateString)(properties.messageType));
    return errors.wrap('supplied properties not correct for "SourceDetailProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigRule.SourceDetail` resource
 *
 * @param properties - the TypeScript properties of a `SourceDetailProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigRule.SourceDetail` resource.
 */
// @ts-ignore TS6133
function cfnConfigRuleSourceDetailPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigRule_SourceDetailPropertyValidator(properties).assertSuccess();
    return {
        EventSource: cdk.stringToCloudFormation(properties.eventSource),
        MaximumExecutionFrequency: cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
        MessageType: cdk.stringToCloudFormation(properties.messageType),
    };
}

// @ts-ignore TS6133
function CfnConfigRuleSourceDetailPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigRule.SourceDetailProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigRule.SourceDetailProperty>();
    ret.addPropertyResult('eventSource', 'EventSource', cfn_parse.FromCloudFormation.getString(properties.EventSource));
    ret.addPropertyResult('maximumExecutionFrequency', 'MaximumExecutionFrequency', properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined);
    ret.addPropertyResult('messageType', 'MessageType', cfn_parse.FromCloudFormation.getString(properties.MessageType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnConfigurationAggregator`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html
 */
export interface CfnConfigurationAggregatorProps {

    /**
     * Provides a list of source accounts and regions to be aggregated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-accountaggregationsources
     */
    readonly accountAggregationSources?: Array<CfnConfigurationAggregator.AccountAggregationSourceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the aggregator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-configurationaggregatorname
     */
    readonly configurationAggregatorName?: string;

    /**
     * Provides an organization and list of regions to be aggregated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-organizationaggregationsource
     */
    readonly organizationAggregationSource?: CfnConfigurationAggregator.OrganizationAggregationSourceProperty | cdk.IResolvable;

    /**
     * An array of tag object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationAggregatorProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationAggregatorProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationAggregatorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountAggregationSources', cdk.listValidator(CfnConfigurationAggregator_AccountAggregationSourcePropertyValidator))(properties.accountAggregationSources));
    errors.collect(cdk.propertyValidator('configurationAggregatorName', cdk.validateString)(properties.configurationAggregatorName));
    errors.collect(cdk.propertyValidator('organizationAggregationSource', CfnConfigurationAggregator_OrganizationAggregationSourcePropertyValidator)(properties.organizationAggregationSource));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnConfigurationAggregatorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigurationAggregator` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationAggregatorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigurationAggregator` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationAggregatorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationAggregatorPropsValidator(properties).assertSuccess();
    return {
        AccountAggregationSources: cdk.listMapper(cfnConfigurationAggregatorAccountAggregationSourcePropertyToCloudFormation)(properties.accountAggregationSources),
        ConfigurationAggregatorName: cdk.stringToCloudFormation(properties.configurationAggregatorName),
        OrganizationAggregationSource: cfnConfigurationAggregatorOrganizationAggregationSourcePropertyToCloudFormation(properties.organizationAggregationSource),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConfigurationAggregatorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAggregatorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAggregatorProps>();
    ret.addPropertyResult('accountAggregationSources', 'AccountAggregationSources', properties.AccountAggregationSources != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationAggregatorAccountAggregationSourcePropertyFromCloudFormation)(properties.AccountAggregationSources) : undefined);
    ret.addPropertyResult('configurationAggregatorName', 'ConfigurationAggregatorName', properties.ConfigurationAggregatorName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationAggregatorName) : undefined);
    ret.addPropertyResult('organizationAggregationSource', 'OrganizationAggregationSource', properties.OrganizationAggregationSource != null ? CfnConfigurationAggregatorOrganizationAggregationSourcePropertyFromCloudFormation(properties.OrganizationAggregationSource) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::ConfigurationAggregator`
 *
 * The details about the configuration aggregator, including information about source accounts, regions, and metadata of the aggregator.
 *
 * @cloudformationResource AWS::Config::ConfigurationAggregator
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html
 */
export class CfnConfigurationAggregator extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::ConfigurationAggregator";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationAggregator {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigurationAggregatorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfigurationAggregator(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the aggregator.
     * @cloudformationAttribute ConfigurationAggregatorArn
     */
    public readonly attrConfigurationAggregatorArn: string;

    /**
     * Provides a list of source accounts and regions to be aggregated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-accountaggregationsources
     */
    public accountAggregationSources: Array<CfnConfigurationAggregator.AccountAggregationSourceProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the aggregator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-configurationaggregatorname
     */
    public configurationAggregatorName: string | undefined;

    /**
     * Provides an organization and list of regions to be aggregated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-organizationaggregationsource
     */
    public organizationAggregationSource: CfnConfigurationAggregator.OrganizationAggregationSourceProperty | cdk.IResolvable | undefined;

    /**
     * An array of tag object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationaggregator.html#cfn-config-configurationaggregator-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Config::ConfigurationAggregator`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigurationAggregatorProps = {}) {
        super(scope, id, { type: CfnConfigurationAggregator.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrConfigurationAggregatorArn = cdk.Token.asString(this.getAtt('ConfigurationAggregatorArn', cdk.ResolutionTypeHint.STRING));

        this.accountAggregationSources = props.accountAggregationSources;
        this.configurationAggregatorName = props.configurationAggregatorName;
        this.organizationAggregationSource = props.organizationAggregationSource;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Config::ConfigurationAggregator", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationAggregator.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accountAggregationSources: this.accountAggregationSources,
            configurationAggregatorName: this.configurationAggregatorName,
            organizationAggregationSource: this.organizationAggregationSource,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigurationAggregatorPropsToCloudFormation(props);
    }
}

export namespace CfnConfigurationAggregator {
    /**
     * A collection of accounts and regions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-accountaggregationsource.html
     */
    export interface AccountAggregationSourceProperty {
        /**
         * The 12-digit account ID of the account being aggregated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-accountaggregationsource.html#cfn-config-configurationaggregator-accountaggregationsource-accountids
         */
        readonly accountIds: string[];
        /**
         * If true, aggregate existing AWS Config regions and future regions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-accountaggregationsource.html#cfn-config-configurationaggregator-accountaggregationsource-allawsregions
         */
        readonly allAwsRegions?: boolean | cdk.IResolvable;
        /**
         * The source regions being aggregated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-accountaggregationsource.html#cfn-config-configurationaggregator-accountaggregationsource-awsregions
         */
        readonly awsRegions?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AccountAggregationSourceProperty`
 *
 * @param properties - the TypeScript properties of a `AccountAggregationSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationAggregator_AccountAggregationSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountIds', cdk.requiredValidator)(properties.accountIds));
    errors.collect(cdk.propertyValidator('accountIds', cdk.listValidator(cdk.validateString))(properties.accountIds));
    errors.collect(cdk.propertyValidator('allAwsRegions', cdk.validateBoolean)(properties.allAwsRegions));
    errors.collect(cdk.propertyValidator('awsRegions', cdk.listValidator(cdk.validateString))(properties.awsRegions));
    return errors.wrap('supplied properties not correct for "AccountAggregationSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigurationAggregator.AccountAggregationSource` resource
 *
 * @param properties - the TypeScript properties of a `AccountAggregationSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigurationAggregator.AccountAggregationSource` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationAggregatorAccountAggregationSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationAggregator_AccountAggregationSourcePropertyValidator(properties).assertSuccess();
    return {
        AccountIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.accountIds),
        AllAwsRegions: cdk.booleanToCloudFormation(properties.allAwsRegions),
        AwsRegions: cdk.listMapper(cdk.stringToCloudFormation)(properties.awsRegions),
    };
}

// @ts-ignore TS6133
function CfnConfigurationAggregatorAccountAggregationSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAggregator.AccountAggregationSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAggregator.AccountAggregationSourceProperty>();
    ret.addPropertyResult('accountIds', 'AccountIds', cfn_parse.FromCloudFormation.getStringArray(properties.AccountIds));
    ret.addPropertyResult('allAwsRegions', 'AllAwsRegions', properties.AllAwsRegions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllAwsRegions) : undefined);
    ret.addPropertyResult('awsRegions', 'AwsRegions', properties.AwsRegions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AwsRegions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationAggregator {
    /**
     * This object contains regions to set up the aggregator and an IAM role to retrieve organization details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-organizationaggregationsource.html
     */
    export interface OrganizationAggregationSourceProperty {
        /**
         * If true, aggregate existing AWS Config regions and future regions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-organizationaggregationsource.html#cfn-config-configurationaggregator-organizationaggregationsource-allawsregions
         */
        readonly allAwsRegions?: boolean | cdk.IResolvable;
        /**
         * The source regions being aggregated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-organizationaggregationsource.html#cfn-config-configurationaggregator-organizationaggregationsource-awsregions
         */
        readonly awsRegions?: string[];
        /**
         * ARN of the IAM role used to retrieve AWS Organizations details associated with the aggregator account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationaggregator-organizationaggregationsource.html#cfn-config-configurationaggregator-organizationaggregationsource-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `OrganizationAggregationSourceProperty`
 *
 * @param properties - the TypeScript properties of a `OrganizationAggregationSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationAggregator_OrganizationAggregationSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allAwsRegions', cdk.validateBoolean)(properties.allAwsRegions));
    errors.collect(cdk.propertyValidator('awsRegions', cdk.listValidator(cdk.validateString))(properties.awsRegions));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "OrganizationAggregationSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigurationAggregator.OrganizationAggregationSource` resource
 *
 * @param properties - the TypeScript properties of a `OrganizationAggregationSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigurationAggregator.OrganizationAggregationSource` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationAggregatorOrganizationAggregationSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationAggregator_OrganizationAggregationSourcePropertyValidator(properties).assertSuccess();
    return {
        AllAwsRegions: cdk.booleanToCloudFormation(properties.allAwsRegions),
        AwsRegions: cdk.listMapper(cdk.stringToCloudFormation)(properties.awsRegions),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnConfigurationAggregatorOrganizationAggregationSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationAggregator.OrganizationAggregationSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationAggregator.OrganizationAggregationSourceProperty>();
    ret.addPropertyResult('allAwsRegions', 'AllAwsRegions', properties.AllAwsRegions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllAwsRegions) : undefined);
    ret.addPropertyResult('awsRegions', 'AwsRegions', properties.AwsRegions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AwsRegions) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnConfigurationRecorder`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html
 */
export interface CfnConfigurationRecorderProps {

    /**
     * The Amazon Resource Name (ARN) of the IAM (IAM) role that is used to make read or write requests to the delivery channel that you specify and to get configuration details for supported AWS resources. For more information, see [Permissions for the IAM Role Assigned](https://docs.aws.amazon.com/config/latest/developerguide/iamrole-permissions.html) to AWS Config in the AWS Config Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-rolearn
     */
    readonly roleArn: string;

    /**
     * A name for the configuration recorder. If you don't specify a name, AWS CloudFormation CloudFormation generates a unique physical ID and uses that ID for the configuration recorder name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > After you create a configuration recorder, you cannot rename it. If you don't want a name that AWS CloudFormation generates, specify a value for this property.
     *
     * Updates are not supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-name
     */
    readonly name?: string;

    /**
     * Indicates whether to record configurations for all supported resources or for a list of resource types. The resource types that you list must be supported by AWS Config .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-recordinggroup
     */
    readonly recordingGroup?: CfnConfigurationRecorder.RecordingGroupProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationRecorderProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationRecorderProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationRecorderPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('recordingGroup', CfnConfigurationRecorder_RecordingGroupPropertyValidator)(properties.recordingGroup));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CfnConfigurationRecorderProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigurationRecorder` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationRecorderProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigurationRecorder` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationRecorderPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationRecorderPropsValidator(properties).assertSuccess();
    return {
        RoleARN: cdk.stringToCloudFormation(properties.roleArn),
        Name: cdk.stringToCloudFormation(properties.name),
        RecordingGroup: cfnConfigurationRecorderRecordingGroupPropertyToCloudFormation(properties.recordingGroup),
    };
}

// @ts-ignore TS6133
function CfnConfigurationRecorderPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationRecorderProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationRecorderProps>();
    ret.addPropertyResult('roleArn', 'RoleARN', cfn_parse.FromCloudFormation.getString(properties.RoleARN));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('recordingGroup', 'RecordingGroup', properties.RecordingGroup != null ? CfnConfigurationRecorderRecordingGroupPropertyFromCloudFormation(properties.RecordingGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::ConfigurationRecorder`
 *
 * The AWS::Config::ConfigurationRecorder resource describes the AWS resource types for which AWS Config records configuration changes. The configuration recorder stores the configurations of the supported resources in your account as configuration items.
 *
 * > To enable AWS Config , you must create a configuration recorder and a delivery channel. AWS Config uses the delivery channel to deliver the configuration changes to your Amazon S3 bucket or Amazon SNS topic. For more information, see [AWS::Config::DeliveryChannel](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html) .
 *
 * AWS CloudFormation starts the recorder as soon as the delivery channel is available.
 *
 * To stop the recorder and delete it, delete the configuration recorder from your stack. To stop the recorder without deleting it, call the [StopConfigurationRecorder](https://docs.aws.amazon.com/config/latest/APIReference/API_StopConfigurationRecorder.html) action of the AWS Config API directly.
 *
 * For more information, see [Configuration Recorder](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#config-recorder) in the AWS Config Developer Guide.
 *
 * @cloudformationResource AWS::Config::ConfigurationRecorder
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html
 */
export class CfnConfigurationRecorder extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::ConfigurationRecorder";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationRecorder {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigurationRecorderPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfigurationRecorder(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the IAM (IAM) role that is used to make read or write requests to the delivery channel that you specify and to get configuration details for supported AWS resources. For more information, see [Permissions for the IAM Role Assigned](https://docs.aws.amazon.com/config/latest/developerguide/iamrole-permissions.html) to AWS Config in the AWS Config Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-rolearn
     */
    public roleArn: string;

    /**
     * A name for the configuration recorder. If you don't specify a name, AWS CloudFormation CloudFormation generates a unique physical ID and uses that ID for the configuration recorder name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > After you create a configuration recorder, you cannot rename it. If you don't want a name that AWS CloudFormation generates, specify a value for this property.
     *
     * Updates are not supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-name
     */
    public name: string | undefined;

    /**
     * Indicates whether to record configurations for all supported resources or for a list of resource types. The resource types that you list must be supported by AWS Config .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-recordinggroup
     */
    public recordingGroup: CfnConfigurationRecorder.RecordingGroupProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Config::ConfigurationRecorder`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigurationRecorderProps) {
        super(scope, id, { type: CfnConfigurationRecorder.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'roleArn', this);

        this.roleArn = props.roleArn;
        this.name = props.name;
        this.recordingGroup = props.recordingGroup;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationRecorder.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            roleArn: this.roleArn,
            name: this.name,
            recordingGroup: this.recordingGroup,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigurationRecorderPropsToCloudFormation(props);
    }
}

export namespace CfnConfigurationRecorder {
    /**
     * Specifies which AWS resource types AWS Config records for configuration changes. In the recording group, you specify whether you want to record all supported resource types or only specific types of resources.
     *
     * By default, AWS Config records the configuration changes for all supported types of *regional resources* that AWS Config discovers in the region in which it is running. Regional resources are tied to a region and can be used only in that region. Examples of regional resources are EC2 instances and EBS volumes.
     *
     * You can also have AWS Config record supported types of *global resources* . Global resources are not tied to a specific region and can be used in all regions. The global resource types that AWS Config supports include IAM users, groups, roles, and customer managed policies.
     *
     * > Global resource types onboarded to AWS Config recording after February 2022 will only be recorded in the service's home region for the commercial partition and AWS GovCloud (US) West for the GovCloud partition. You can view the Configuration Items for these new global resource types only in their home region and AWS GovCloud (US) West.
     * >
     * > Supported global resource types onboarded before February 2022 such as `AWS::IAM::Group` , `AWS::IAM::Policy` , `AWS::IAM::Role` , `AWS::IAM::User` remain unchanged, and they will continue to deliver Configuration Items in all supported regions in AWS Config . The change will only affect new global resource types onboarded after February 2022.
     * >
     * > To record global resource types onboarded after February 2022, enable All Supported Resource Types in the home region of the global resource type you want to record.
     *
     * If you don't want AWS Config to record all resources, you can specify which types of resources it will record with the `resourceTypes` parameter.
     *
     * For a list of supported resource types, see [Supported Resource Types](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources) .
     *
     * For more information and a table of the Home Regions for Global Resource Types Onboarded after February 2022, see [Selecting Which Resources AWS Config Records](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html
     */
    export interface RecordingGroupProperty {
        /**
         * Specifies whether AWS Config records configuration changes for every supported type of regional resource.
         *
         * If you set this option to `true` , when AWS Config adds support for a new type of regional resource, it starts recording resources of that type automatically.
         *
         * If you set this option to `true` , you cannot enumerate a list of `resourceTypes` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-allsupported
         */
        readonly allSupported?: boolean | cdk.IResolvable;
        /**
         * Specifies whether AWS Config includes all supported types of global resources (for example, IAM resources) with the resources that it records.
         *
         * Before you can set this option to `true` , you must set the `AllSupported` option to `true` .
         *
         * If you set this option to `true` , when AWS Config adds support for a new type of global resource, it starts recording resources of that type automatically.
         *
         * The configuration details for any global resource are the same in all regions. To prevent duplicate configuration items, you should consider customizing AWS Config in only one region to record global resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-includeglobalresourcetypes
         */
        readonly includeGlobalResourceTypes?: boolean | cdk.IResolvable;
        /**
         * A comma-separated list that specifies the types of AWS resources for which AWS Config records configuration changes (for example, `AWS::EC2::Instance` or `AWS::CloudTrail::Trail` ).
         *
         * To record all configuration changes, you must set the `AllSupported` option to `false` .
         *
         * If you set this option to `true` , when AWS Config adds support for a new type of resource, it will not record resources of that type unless you manually add that type to your recording group.
         *
         * For a list of valid `resourceTypes` values, see the *resourceType Value* column in [Supported AWS Resource Types](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-resourcetypes
         */
        readonly resourceTypes?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `RecordingGroupProperty`
 *
 * @param properties - the TypeScript properties of a `RecordingGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationRecorder_RecordingGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allSupported', cdk.validateBoolean)(properties.allSupported));
    errors.collect(cdk.propertyValidator('includeGlobalResourceTypes', cdk.validateBoolean)(properties.includeGlobalResourceTypes));
    errors.collect(cdk.propertyValidator('resourceTypes', cdk.listValidator(cdk.validateString))(properties.resourceTypes));
    return errors.wrap('supplied properties not correct for "RecordingGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConfigurationRecorder.RecordingGroup` resource
 *
 * @param properties - the TypeScript properties of a `RecordingGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConfigurationRecorder.RecordingGroup` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationRecorderRecordingGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationRecorder_RecordingGroupPropertyValidator(properties).assertSuccess();
    return {
        AllSupported: cdk.booleanToCloudFormation(properties.allSupported),
        IncludeGlobalResourceTypes: cdk.booleanToCloudFormation(properties.includeGlobalResourceTypes),
        ResourceTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypes),
    };
}

// @ts-ignore TS6133
function CfnConfigurationRecorderRecordingGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationRecorder.RecordingGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationRecorder.RecordingGroupProperty>();
    ret.addPropertyResult('allSupported', 'AllSupported', properties.AllSupported != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllSupported) : undefined);
    ret.addPropertyResult('includeGlobalResourceTypes', 'IncludeGlobalResourceTypes', properties.IncludeGlobalResourceTypes != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeGlobalResourceTypes) : undefined);
    ret.addPropertyResult('resourceTypes', 'ResourceTypes', properties.ResourceTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceTypes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnConformancePack`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html
 */
export interface CfnConformancePackProps {

    /**
     * Name of the conformance pack you want to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-conformancepackname
     */
    readonly conformancePackName: string;

    /**
     * A list of ConformancePackInputParameter objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-conformancepackinputparameters
     */
    readonly conformancePackInputParameters?: Array<CfnConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the Amazon S3 bucket where AWS Config stores conformance pack templates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-deliverys3bucket
     */
    readonly deliveryS3Bucket?: string;

    /**
     * The prefix for the Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-deliverys3keyprefix
     */
    readonly deliveryS3KeyPrefix?: string;

    /**
     * A string containing full conformance pack template body. Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.
     *
     * > You can only use a YAML template with two resource types: config rule ( `AWS::Config::ConfigRule` ) and a remediation action ( `AWS::Config::RemediationConfiguration` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templatebody
     */
    readonly templateBody?: string;

    /**
     * Location of file containing the template body (s3://bucketname/prefix). The uri must point to the conformance pack template (max size: 300 KB) that is located in an Amazon S3 bucket.
     *
     * > You must have access to read Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templates3uri
     */
    readonly templateS3Uri?: string;

    /**
     * `AWS::Config::ConformancePack.TemplateSSMDocumentDetails`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templatessmdocumentdetails
     */
    readonly templateSsmDocumentDetails?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConformancePackProps`
 *
 * @param properties - the TypeScript properties of a `CfnConformancePackProps`
 *
 * @returns the result of the validation.
 */
function CfnConformancePackPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conformancePackInputParameters', cdk.listValidator(CfnConformancePack_ConformancePackInputParameterPropertyValidator))(properties.conformancePackInputParameters));
    errors.collect(cdk.propertyValidator('conformancePackName', cdk.requiredValidator)(properties.conformancePackName));
    errors.collect(cdk.propertyValidator('conformancePackName', cdk.validateString)(properties.conformancePackName));
    errors.collect(cdk.propertyValidator('deliveryS3Bucket', cdk.validateString)(properties.deliveryS3Bucket));
    errors.collect(cdk.propertyValidator('deliveryS3KeyPrefix', cdk.validateString)(properties.deliveryS3KeyPrefix));
    errors.collect(cdk.propertyValidator('templateBody', cdk.validateString)(properties.templateBody));
    errors.collect(cdk.propertyValidator('templateS3Uri', cdk.validateString)(properties.templateS3Uri));
    errors.collect(cdk.propertyValidator('templateSsmDocumentDetails', cdk.validateObject)(properties.templateSsmDocumentDetails));
    return errors.wrap('supplied properties not correct for "CfnConformancePackProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConformancePack` resource
 *
 * @param properties - the TypeScript properties of a `CfnConformancePackProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConformancePack` resource.
 */
// @ts-ignore TS6133
function cfnConformancePackPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConformancePackPropsValidator(properties).assertSuccess();
    return {
        ConformancePackName: cdk.stringToCloudFormation(properties.conformancePackName),
        ConformancePackInputParameters: cdk.listMapper(cfnConformancePackConformancePackInputParameterPropertyToCloudFormation)(properties.conformancePackInputParameters),
        DeliveryS3Bucket: cdk.stringToCloudFormation(properties.deliveryS3Bucket),
        DeliveryS3KeyPrefix: cdk.stringToCloudFormation(properties.deliveryS3KeyPrefix),
        TemplateBody: cdk.stringToCloudFormation(properties.templateBody),
        TemplateS3Uri: cdk.stringToCloudFormation(properties.templateS3Uri),
        TemplateSSMDocumentDetails: cdk.objectToCloudFormation(properties.templateSsmDocumentDetails),
    };
}

// @ts-ignore TS6133
function CfnConformancePackPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConformancePackProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConformancePackProps>();
    ret.addPropertyResult('conformancePackName', 'ConformancePackName', cfn_parse.FromCloudFormation.getString(properties.ConformancePackName));
    ret.addPropertyResult('conformancePackInputParameters', 'ConformancePackInputParameters', properties.ConformancePackInputParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnConformancePackConformancePackInputParameterPropertyFromCloudFormation)(properties.ConformancePackInputParameters) : undefined);
    ret.addPropertyResult('deliveryS3Bucket', 'DeliveryS3Bucket', properties.DeliveryS3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryS3Bucket) : undefined);
    ret.addPropertyResult('deliveryS3KeyPrefix', 'DeliveryS3KeyPrefix', properties.DeliveryS3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryS3KeyPrefix) : undefined);
    ret.addPropertyResult('templateBody', 'TemplateBody', properties.TemplateBody != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateBody) : undefined);
    ret.addPropertyResult('templateS3Uri', 'TemplateS3Uri', properties.TemplateS3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateS3Uri) : undefined);
    ret.addPropertyResult('templateSsmDocumentDetails', 'TemplateSSMDocumentDetails', properties.TemplateSSMDocumentDetails != null ? cfn_parse.FromCloudFormation.getAny(properties.TemplateSSMDocumentDetails) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::ConformancePack`
 *
 * A conformance pack is a collection of AWS Config rules and remediation actions that can be easily deployed in an account and a region. ConformancePack creates a service linked role in your account. The service linked role is created only when the role does not exist in your account.
 *
 * @cloudformationResource AWS::Config::ConformancePack
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html
 */
export class CfnConformancePack extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::ConformancePack";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConformancePack {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConformancePackPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConformancePack(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Name of the conformance pack you want to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-conformancepackname
     */
    public conformancePackName: string;

    /**
     * A list of ConformancePackInputParameter objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-conformancepackinputparameters
     */
    public conformancePackInputParameters: Array<CfnConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the Amazon S3 bucket where AWS Config stores conformance pack templates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-deliverys3bucket
     */
    public deliveryS3Bucket: string | undefined;

    /**
     * The prefix for the Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-deliverys3keyprefix
     */
    public deliveryS3KeyPrefix: string | undefined;

    /**
     * A string containing full conformance pack template body. Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.
     *
     * > You can only use a YAML template with two resource types: config rule ( `AWS::Config::ConfigRule` ) and a remediation action ( `AWS::Config::RemediationConfiguration` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templatebody
     */
    public templateBody: string | undefined;

    /**
     * Location of file containing the template body (s3://bucketname/prefix). The uri must point to the conformance pack template (max size: 300 KB) that is located in an Amazon S3 bucket.
     *
     * > You must have access to read Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templates3uri
     */
    public templateS3Uri: string | undefined;

    /**
     * `AWS::Config::ConformancePack.TemplateSSMDocumentDetails`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-conformancepack.html#cfn-config-conformancepack-templatessmdocumentdetails
     */
    public templateSsmDocumentDetails: any | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Config::ConformancePack`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConformancePackProps) {
        super(scope, id, { type: CfnConformancePack.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'conformancePackName', this);

        this.conformancePackName = props.conformancePackName;
        this.conformancePackInputParameters = props.conformancePackInputParameters;
        this.deliveryS3Bucket = props.deliveryS3Bucket;
        this.deliveryS3KeyPrefix = props.deliveryS3KeyPrefix;
        this.templateBody = props.templateBody;
        this.templateS3Uri = props.templateS3Uri;
        this.templateSsmDocumentDetails = props.templateSsmDocumentDetails;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConformancePack.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            conformancePackName: this.conformancePackName,
            conformancePackInputParameters: this.conformancePackInputParameters,
            deliveryS3Bucket: this.deliveryS3Bucket,
            deliveryS3KeyPrefix: this.deliveryS3KeyPrefix,
            templateBody: this.templateBody,
            templateS3Uri: this.templateS3Uri,
            templateSsmDocumentDetails: this.templateSsmDocumentDetails,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConformancePackPropsToCloudFormation(props);
    }
}

export namespace CfnConformancePack {
    /**
     * Input parameters in the form of key-value pairs for the conformance pack, both of which you define. Keys can have a maximum character length of 255 characters, and values can have a maximum length of 4096 characters.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-conformancepackinputparameter.html
     */
    export interface ConformancePackInputParameterProperty {
        /**
         * One part of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-conformancepackinputparameter.html#cfn-config-conformancepack-conformancepackinputparameter-parametername
         */
        readonly parameterName: string;
        /**
         * Another part of the key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-conformancepackinputparameter.html#cfn-config-conformancepack-conformancepackinputparameter-parametervalue
         */
        readonly parameterValue: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConformancePackInputParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ConformancePackInputParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnConformancePack_ConformancePackInputParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('parameterName', cdk.requiredValidator)(properties.parameterName));
    errors.collect(cdk.propertyValidator('parameterName', cdk.validateString)(properties.parameterName));
    errors.collect(cdk.propertyValidator('parameterValue', cdk.requiredValidator)(properties.parameterValue));
    errors.collect(cdk.propertyValidator('parameterValue', cdk.validateString)(properties.parameterValue));
    return errors.wrap('supplied properties not correct for "ConformancePackInputParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConformancePack.ConformancePackInputParameter` resource
 *
 * @param properties - the TypeScript properties of a `ConformancePackInputParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConformancePack.ConformancePackInputParameter` resource.
 */
// @ts-ignore TS6133
function cfnConformancePackConformancePackInputParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConformancePack_ConformancePackInputParameterPropertyValidator(properties).assertSuccess();
    return {
        ParameterName: cdk.stringToCloudFormation(properties.parameterName),
        ParameterValue: cdk.stringToCloudFormation(properties.parameterValue),
    };
}

// @ts-ignore TS6133
function CfnConformancePackConformancePackInputParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConformancePack.ConformancePackInputParameterProperty>();
    ret.addPropertyResult('parameterName', 'ParameterName', cfn_parse.FromCloudFormation.getString(properties.ParameterName));
    ret.addPropertyResult('parameterValue', 'ParameterValue', cfn_parse.FromCloudFormation.getString(properties.ParameterValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConformancePack {
    /**
     * This API allows you to create a conformance pack template with an AWS Systems Manager document (SSM document). To deploy a conformance pack using an SSM document, first create an SSM document with conformance pack content, and then provide the `DocumentName` in the [PutConformancePack API](https://docs.aws.amazon.com/config/latest/APIReference/API_PutConformancePack.html) . You can also provide the `DocumentVersion` .
     *
     * The `TemplateSSMDocumentDetails` object contains the name of the SSM document and the version of the SSM document.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-templatessmdocumentdetails.html
     */
    export interface TemplateSSMDocumentDetailsProperty {
        /**
         * The name or Amazon Resource Name (ARN) of the SSM document to use to create a conformance pack. If you use the document name, AWS Config checks only your account and AWS Region for the SSM document. If you want to use an SSM document from another Region or account, you must provide the ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-templatessmdocumentdetails.html#cfn-config-conformancepack-templatessmdocumentdetails-documentname
         */
        readonly documentName?: string;
        /**
         * The version of the SSM document to use to create a conformance pack. By default, AWS Config uses the latest version.
         *
         * > This field is optional.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-conformancepack-templatessmdocumentdetails.html#cfn-config-conformancepack-templatessmdocumentdetails-documentversion
         */
        readonly documentVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TemplateSSMDocumentDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateSSMDocumentDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConformancePack_TemplateSSMDocumentDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('documentName', cdk.validateString)(properties.documentName));
    errors.collect(cdk.propertyValidator('documentVersion', cdk.validateString)(properties.documentVersion));
    return errors.wrap('supplied properties not correct for "TemplateSSMDocumentDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::ConformancePack.TemplateSSMDocumentDetails` resource
 *
 * @param properties - the TypeScript properties of a `TemplateSSMDocumentDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::ConformancePack.TemplateSSMDocumentDetails` resource.
 */
// @ts-ignore TS6133
function cfnConformancePackTemplateSSMDocumentDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConformancePack_TemplateSSMDocumentDetailsPropertyValidator(properties).assertSuccess();
    return {
        DocumentName: cdk.stringToCloudFormation(properties.documentName),
        DocumentVersion: cdk.stringToCloudFormation(properties.documentVersion),
    };
}

// @ts-ignore TS6133
function CfnConformancePackTemplateSSMDocumentDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConformancePack.TemplateSSMDocumentDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConformancePack.TemplateSSMDocumentDetailsProperty>();
    ret.addPropertyResult('documentName', 'DocumentName', properties.DocumentName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentName) : undefined);
    ret.addPropertyResult('documentVersion', 'DocumentVersion', properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDeliveryChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html
 */
export interface CfnDeliveryChannelProps {

    /**
     * The name of the Amazon S3 bucket to which AWS Config delivers configuration snapshots and configuration history files.
     *
     * If you specify a bucket that belongs to another AWS account , that bucket must have policies that grant access permissions to AWS Config . For more information, see [Permissions for the Amazon S3 Bucket](https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-policy.html) in the *AWS Config Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3bucketname
     */
    readonly s3BucketName: string;

    /**
     * The options for how often AWS Config delivers configuration snapshots to the Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-configsnapshotdeliveryproperties
     */
    readonly configSnapshotDeliveryProperties?: CfnDeliveryChannel.ConfigSnapshotDeliveryPropertiesProperty | cdk.IResolvable;

    /**
     * A name for the delivery channel. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the delivery channel name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * Updates are not supported. To change the name, you must run two separate updates. In the first update, delete this resource, and then recreate it with a new name in the second update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-name
     */
    readonly name?: string;

    /**
     * The prefix for the specified Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3keyprefix
     */
    readonly s3KeyPrefix?: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Key Management Service ( AWS KMS ) AWS KMS key (KMS key) used to encrypt objects delivered by AWS Config . Must belong to the same Region as the destination S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3kmskeyarn
     */
    readonly s3KmsKeyArn?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to which AWS Config sends notifications about configuration changes.
     *
     * If you choose a topic from another account, the topic must have policies that grant access permissions to AWS Config . For more information, see [Permissions for the Amazon SNS Topic](https://docs.aws.amazon.com/config/latest/developerguide/sns-topic-policy.html) in the *AWS Config Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-snstopicarn
     */
    readonly snsTopicArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDeliveryChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeliveryChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnDeliveryChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configSnapshotDeliveryProperties', CfnDeliveryChannel_ConfigSnapshotDeliveryPropertiesPropertyValidator)(properties.configSnapshotDeliveryProperties));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.requiredValidator)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.validateString)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3KeyPrefix', cdk.validateString)(properties.s3KeyPrefix));
    errors.collect(cdk.propertyValidator('s3KmsKeyArn', cdk.validateString)(properties.s3KmsKeyArn));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.validateString)(properties.snsTopicArn));
    return errors.wrap('supplied properties not correct for "CfnDeliveryChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::DeliveryChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeliveryChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::DeliveryChannel` resource.
 */
// @ts-ignore TS6133
function cfnDeliveryChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeliveryChannelPropsValidator(properties).assertSuccess();
    return {
        S3BucketName: cdk.stringToCloudFormation(properties.s3BucketName),
        ConfigSnapshotDeliveryProperties: cfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyToCloudFormation(properties.configSnapshotDeliveryProperties),
        Name: cdk.stringToCloudFormation(properties.name),
        S3KeyPrefix: cdk.stringToCloudFormation(properties.s3KeyPrefix),
        S3KmsKeyArn: cdk.stringToCloudFormation(properties.s3KmsKeyArn),
        SnsTopicARN: cdk.stringToCloudFormation(properties.snsTopicArn),
    };
}

// @ts-ignore TS6133
function CfnDeliveryChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryChannelProps>();
    ret.addPropertyResult('s3BucketName', 'S3BucketName', cfn_parse.FromCloudFormation.getString(properties.S3BucketName));
    ret.addPropertyResult('configSnapshotDeliveryProperties', 'ConfigSnapshotDeliveryProperties', properties.ConfigSnapshotDeliveryProperties != null ? CfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyFromCloudFormation(properties.ConfigSnapshotDeliveryProperties) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('s3KeyPrefix', 'S3KeyPrefix', properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined);
    ret.addPropertyResult('s3KmsKeyArn', 'S3KmsKeyArn', properties.S3KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.S3KmsKeyArn) : undefined);
    ret.addPropertyResult('snsTopicArn', 'SnsTopicARN', properties.SnsTopicARN != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicARN) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::DeliveryChannel`
 *
 * Specifies a delivery channel object to deliver configuration information to an Amazon S3 bucket and Amazon SNS topic.
 *
 * Before you can create a delivery channel, you must create a configuration recorder. You can use this action to change the Amazon S3 bucket or an Amazon SNS topic of the existing delivery channel. To change the Amazon S3 bucket or an Amazon SNS topic, call this action and specify the changed values for the S3 bucket and the SNS topic. If you specify a different value for either the S3 bucket or the SNS topic, this action will keep the existing value for the parameter that is not changed.
 *
 * > In the China (Beijing) Region, when you call this action, the Amazon S3 bucket must also be in the China (Beijing) Region. In all the other regions, AWS Config supports cross-region and cross-account delivery channels.
 *
 * You can have only one delivery channel per region per AWS account, and the delivery channel is required to use AWS Config .
 *
 * > AWS Config does not support the delivery channel to an Amazon S3 bucket bucket where object lock is enabled. For more information, see [How S3 Object Lock works](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html) .
 *
 * When you create the delivery channel, you can specify; how often AWS Config delivers configuration snapshots to your Amazon S3 bucket (for example, 24 hours), the S3 bucket to which AWS Config sends configuration snapshots and configuration history files, and the Amazon SNS topic to which AWS Config sends notifications about configuration changes, such as updated resources, AWS Config rule evaluations, and when AWS Config delivers the configuration snapshot to your S3 bucket. For more information, see [Deliver Configuration Items](https://docs.aws.amazon.com/config/latest/developerguide/how-does-config-work.html#delivery-channel) in the AWS Config Developer Guide.
 *
 * > To enable AWS Config , you must create a configuration recorder and a delivery channel. If you want to create the resources separately, you must create a configuration recorder before you can create a delivery channel. AWS Config uses the configuration recorder to capture configuration changes to your resources. For more information, see [AWS::Config::ConfigurationRecorder](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html) .
 *
 * For more information, see [Managing the Delivery Channel](https://docs.aws.amazon.com/config/latest/developerguide/manage-delivery-channel.html) in the AWS Config Developer Guide.
 *
 * @cloudformationResource AWS::Config::DeliveryChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html
 */
export class CfnDeliveryChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::DeliveryChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeliveryChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDeliveryChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDeliveryChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the Amazon S3 bucket to which AWS Config delivers configuration snapshots and configuration history files.
     *
     * If you specify a bucket that belongs to another AWS account , that bucket must have policies that grant access permissions to AWS Config . For more information, see [Permissions for the Amazon S3 Bucket](https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-policy.html) in the *AWS Config Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3bucketname
     */
    public s3BucketName: string;

    /**
     * The options for how often AWS Config delivers configuration snapshots to the Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-configsnapshotdeliveryproperties
     */
    public configSnapshotDeliveryProperties: CfnDeliveryChannel.ConfigSnapshotDeliveryPropertiesProperty | cdk.IResolvable | undefined;

    /**
     * A name for the delivery channel. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the delivery channel name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * Updates are not supported. To change the name, you must run two separate updates. In the first update, delete this resource, and then recreate it with a new name in the second update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-name
     */
    public name: string | undefined;

    /**
     * The prefix for the specified Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3keyprefix
     */
    public s3KeyPrefix: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the AWS Key Management Service ( AWS KMS ) AWS KMS key (KMS key) used to encrypt objects delivered by AWS Config . Must belong to the same Region as the destination S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-s3kmskeyarn
     */
    public s3KmsKeyArn: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to which AWS Config sends notifications about configuration changes.
     *
     * If you choose a topic from another account, the topic must have policies that grant access permissions to AWS Config . For more information, see [Permissions for the Amazon SNS Topic](https://docs.aws.amazon.com/config/latest/developerguide/sns-topic-policy.html) in the *AWS Config Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-deliverychannel.html#cfn-config-deliverychannel-snstopicarn
     */
    public snsTopicArn: string | undefined;

    /**
     * Create a new `AWS::Config::DeliveryChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeliveryChannelProps) {
        super(scope, id, { type: CfnDeliveryChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 's3BucketName', this);

        this.s3BucketName = props.s3BucketName;
        this.configSnapshotDeliveryProperties = props.configSnapshotDeliveryProperties;
        this.name = props.name;
        this.s3KeyPrefix = props.s3KeyPrefix;
        this.s3KmsKeyArn = props.s3KmsKeyArn;
        this.snsTopicArn = props.snsTopicArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeliveryChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            s3BucketName: this.s3BucketName,
            configSnapshotDeliveryProperties: this.configSnapshotDeliveryProperties,
            name: this.name,
            s3KeyPrefix: this.s3KeyPrefix,
            s3KmsKeyArn: this.s3KmsKeyArn,
            snsTopicArn: this.snsTopicArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDeliveryChannelPropsToCloudFormation(props);
    }
}

export namespace CfnDeliveryChannel {
    /**
     * Provides options for how often AWS Config delivers configuration snapshots to the Amazon S3 bucket in your delivery channel.
     *
     * > If you want to create a rule that triggers evaluations for your resources when AWS Config delivers the configuration snapshot, see the following:
     *
     * The frequency for a rule that triggers evaluations for your resources when AWS Config delivers the configuration snapshot is set by one of two values, depending on which is less frequent:
     *
     * - The value for the `deliveryFrequency` parameter within the delivery channel configuration, which sets how often AWS Config delivers configuration snapshots. This value also sets how often AWS Config invokes evaluations for AWS Config rules.
     * - The value for the `MaximumExecutionFrequency` parameter, which sets the maximum frequency with which AWS Config invokes evaluations for the rule. For more information, see [ConfigRule](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigRule.html) .
     *
     * If the `deliveryFrequency` value is less frequent than the `MaximumExecutionFrequency` value for a rule, AWS Config invokes the rule only as often as the `deliveryFrequency` value.
     *
     * - For example, you want your rule to run evaluations when AWS Config delivers the configuration snapshot.
     * - You specify the `MaximumExecutionFrequency` value for `Six_Hours` .
     * - You then specify the delivery channel `deliveryFrequency` value for `TwentyFour_Hours` .
     * - Because the value for `deliveryFrequency` is less frequent than `MaximumExecutionFrequency` , AWS Config invokes evaluations for the rule every 24 hours.
     *
     * You should set the `MaximumExecutionFrequency` value to be at least as frequent as the `deliveryFrequency` value. You can view the `deliveryFrequency` value by using the `DescribeDeliveryChannnels` action.
     *
     * To update the `deliveryFrequency` with which AWS Config delivers your configuration snapshots, use the `PutDeliveryChannel` action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-deliverychannel-configsnapshotdeliveryproperties.html
     */
    export interface ConfigSnapshotDeliveryPropertiesProperty {
        /**
         * The frequency with which AWS Config delivers configuration snapshots.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-deliverychannel-configsnapshotdeliveryproperties.html#cfn-config-deliverychannel-configsnapshotdeliveryproperties-deliveryfrequency
         */
        readonly deliveryFrequency?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigSnapshotDeliveryPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigSnapshotDeliveryPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeliveryChannel_ConfigSnapshotDeliveryPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deliveryFrequency', cdk.validateString)(properties.deliveryFrequency));
    return errors.wrap('supplied properties not correct for "ConfigSnapshotDeliveryPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::DeliveryChannel.ConfigSnapshotDeliveryProperties` resource
 *
 * @param properties - the TypeScript properties of a `ConfigSnapshotDeliveryPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::DeliveryChannel.ConfigSnapshotDeliveryProperties` resource.
 */
// @ts-ignore TS6133
function cfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeliveryChannel_ConfigSnapshotDeliveryPropertiesPropertyValidator(properties).assertSuccess();
    return {
        DeliveryFrequency: cdk.stringToCloudFormation(properties.deliveryFrequency),
    };
}

// @ts-ignore TS6133
function CfnDeliveryChannelConfigSnapshotDeliveryPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryChannel.ConfigSnapshotDeliveryPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryChannel.ConfigSnapshotDeliveryPropertiesProperty>();
    ret.addPropertyResult('deliveryFrequency', 'DeliveryFrequency', properties.DeliveryFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryFrequency) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnOrganizationConfigRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html
 */
export interface CfnOrganizationConfigRuleProps {

    /**
     * The name that you assign to organization AWS Config rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationconfigrulename
     */
    readonly organizationConfigRuleName: string;

    /**
     * A comma-separated list of accounts excluded from organization AWS Config rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-excludedaccounts
     */
    readonly excludedAccounts?: string[];

    /**
     * `AWS::Config::OrganizationConfigRule.OrganizationCustomCodeRuleMetadata`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata
     */
    readonly organizationCustomCodeRuleMetadata?: CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty | cdk.IResolvable;

    /**
     * An `OrganizationCustomRuleMetadata` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata
     */
    readonly organizationCustomRuleMetadata?: CfnOrganizationConfigRule.OrganizationCustomRuleMetadataProperty | cdk.IResolvable;

    /**
     * An `OrganizationManagedRuleMetadata` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata
     */
    readonly organizationManagedRuleMetadata?: CfnOrganizationConfigRule.OrganizationManagedRuleMetadataProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnOrganizationConfigRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnOrganizationConfigRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnOrganizationConfigRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excludedAccounts', cdk.listValidator(cdk.validateString))(properties.excludedAccounts));
    errors.collect(cdk.propertyValidator('organizationConfigRuleName', cdk.requiredValidator)(properties.organizationConfigRuleName));
    errors.collect(cdk.propertyValidator('organizationConfigRuleName', cdk.validateString)(properties.organizationConfigRuleName));
    errors.collect(cdk.propertyValidator('organizationCustomCodeRuleMetadata', CfnOrganizationConfigRule_OrganizationCustomCodeRuleMetadataPropertyValidator)(properties.organizationCustomCodeRuleMetadata));
    errors.collect(cdk.propertyValidator('organizationCustomRuleMetadata', CfnOrganizationConfigRule_OrganizationCustomRuleMetadataPropertyValidator)(properties.organizationCustomRuleMetadata));
    errors.collect(cdk.propertyValidator('organizationManagedRuleMetadata', CfnOrganizationConfigRule_OrganizationManagedRuleMetadataPropertyValidator)(properties.organizationManagedRuleMetadata));
    return errors.wrap('supplied properties not correct for "CfnOrganizationConfigRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::OrganizationConfigRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnOrganizationConfigRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::OrganizationConfigRule` resource.
 */
// @ts-ignore TS6133
function cfnOrganizationConfigRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOrganizationConfigRulePropsValidator(properties).assertSuccess();
    return {
        OrganizationConfigRuleName: cdk.stringToCloudFormation(properties.organizationConfigRuleName),
        ExcludedAccounts: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedAccounts),
        OrganizationCustomCodeRuleMetadata: cfnOrganizationConfigRuleOrganizationCustomCodeRuleMetadataPropertyToCloudFormation(properties.organizationCustomCodeRuleMetadata),
        OrganizationCustomRuleMetadata: cfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyToCloudFormation(properties.organizationCustomRuleMetadata),
        OrganizationManagedRuleMetadata: cfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyToCloudFormation(properties.organizationManagedRuleMetadata),
    };
}

// @ts-ignore TS6133
function CfnOrganizationConfigRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConfigRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConfigRuleProps>();
    ret.addPropertyResult('organizationConfigRuleName', 'OrganizationConfigRuleName', cfn_parse.FromCloudFormation.getString(properties.OrganizationConfigRuleName));
    ret.addPropertyResult('excludedAccounts', 'ExcludedAccounts', properties.ExcludedAccounts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedAccounts) : undefined);
    ret.addPropertyResult('organizationCustomCodeRuleMetadata', 'OrganizationCustomCodeRuleMetadata', properties.OrganizationCustomCodeRuleMetadata != null ? CfnOrganizationConfigRuleOrganizationCustomCodeRuleMetadataPropertyFromCloudFormation(properties.OrganizationCustomCodeRuleMetadata) : undefined);
    ret.addPropertyResult('organizationCustomRuleMetadata', 'OrganizationCustomRuleMetadata', properties.OrganizationCustomRuleMetadata != null ? CfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyFromCloudFormation(properties.OrganizationCustomRuleMetadata) : undefined);
    ret.addPropertyResult('organizationManagedRuleMetadata', 'OrganizationManagedRuleMetadata', properties.OrganizationManagedRuleMetadata != null ? CfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyFromCloudFormation(properties.OrganizationManagedRuleMetadata) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::OrganizationConfigRule`
 *
 * Adds or updates an AWS Config rule for your entire organization to evaluate if your AWS resources comply with your desired configurations. For information on how many organization AWS Config rules you can have per account, see [*Service Limits*](https://docs.aws.amazon.com/config/latest/developerguide/configlimits.html) in the *AWS Config Developer Guide* .
 *
 * Only a management account and a delegated administrator can create or update an organization AWS Config rule. When calling the `OrganizationConfigRule` resource with a delegated administrator, you must ensure AWS Organizations `ListDelegatedAdministrator` permissions are added. An organization can have up to 3 delegated administrators.
 *
 * The `OrganizationConfigRule` resource enables organization service access through the `EnableAWSServiceAccess` action and creates a service-linked role `AWSServiceRoleForConfigMultiAccountSetup` in the management or delegated administrator account of your organization. The service-linked role is created only when the role does not exist in the caller account. AWS Config verifies the existence of role with `GetRole` action.
 *
 * To use the `OrganizationConfigRule` resource with delegated administrator, register a delegated administrator by calling AWS Organization `register-delegated-administrator` for `config-multiaccountsetup.amazonaws.com` .
 *
 * There are two types of rules: *AWS Config Managed Rules* and *AWS Config Custom Rules* . You can use `PutOrganizationConfigRule` to create both AWS Config Managed Rules and AWS Config Custom Rules.
 *
 * AWS Config Managed Rules are predefined, customizable rules created by AWS Config . For a list of managed rules, see [List of AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html) . If you are adding an AWS Config managed rule, you must specify the rule's identifier for the `RuleIdentifier` key.
 *
 * AWS Config Custom Rules are rules that you create from scratch. There are two ways to create AWS Config custom rules: with Lambda functions ( [AWS Lambda Developer Guide](https://docs.aws.amazon.com/config/latest/developerguide/gettingstarted-concepts.html#gettingstarted-concepts-function) ) and with Guard ( [Guard GitHub Repository](https://docs.aws.amazon.com/https://github.com/aws-cloudformation/cloudformation-guard) ), a policy-as-code language. AWS Config custom rules created with AWS Lambda are called *AWS Config Custom Lambda Rules* and AWS Config custom rules created with Guard are called *AWS Config Custom Policy Rules* .
 *
 * If you are adding a new AWS Config Custom Lambda rule, you first need to create an AWS Lambda function in the management account or a delegated administrator that the rule invokes to evaluate your resources. You also need to create an IAM role in the managed account that can be assumed by the Lambda function. When you use `PutOrganizationConfigRule` to add a Custom Lambda rule to AWS Config , you must specify the Amazon Resource Name (ARN) that AWS Lambda assigns to the function.
 *
 * @cloudformationResource AWS::Config::OrganizationConfigRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html
 */
export class CfnOrganizationConfigRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::OrganizationConfigRule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOrganizationConfigRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnOrganizationConfigRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnOrganizationConfigRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name that you assign to organization AWS Config rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationconfigrulename
     */
    public organizationConfigRuleName: string;

    /**
     * A comma-separated list of accounts excluded from organization AWS Config rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-excludedaccounts
     */
    public excludedAccounts: string[] | undefined;

    /**
     * `AWS::Config::OrganizationConfigRule.OrganizationCustomCodeRuleMetadata`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata
     */
    public organizationCustomCodeRuleMetadata: CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty | cdk.IResolvable | undefined;

    /**
     * An `OrganizationCustomRuleMetadata` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata
     */
    public organizationCustomRuleMetadata: CfnOrganizationConfigRule.OrganizationCustomRuleMetadataProperty | cdk.IResolvable | undefined;

    /**
     * An `OrganizationManagedRuleMetadata` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconfigrule.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata
     */
    public organizationManagedRuleMetadata: CfnOrganizationConfigRule.OrganizationManagedRuleMetadataProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Config::OrganizationConfigRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOrganizationConfigRuleProps) {
        super(scope, id, { type: CfnOrganizationConfigRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'organizationConfigRuleName', this);

        this.organizationConfigRuleName = props.organizationConfigRuleName;
        this.excludedAccounts = props.excludedAccounts;
        this.organizationCustomCodeRuleMetadata = props.organizationCustomCodeRuleMetadata;
        this.organizationCustomRuleMetadata = props.organizationCustomRuleMetadata;
        this.organizationManagedRuleMetadata = props.organizationManagedRuleMetadata;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnOrganizationConfigRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            organizationConfigRuleName: this.organizationConfigRuleName,
            excludedAccounts: this.excludedAccounts,
            organizationCustomCodeRuleMetadata: this.organizationCustomCodeRuleMetadata,
            organizationCustomRuleMetadata: this.organizationCustomRuleMetadata,
            organizationManagedRuleMetadata: this.organizationManagedRuleMetadata,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnOrganizationConfigRulePropsToCloudFormation(props);
    }
}

export namespace CfnOrganizationConfigRule {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html
     */
    export interface OrganizationCustomCodeRuleMetadataProperty {
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.CodeText`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-codetext
         */
        readonly codeText: string;
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.DebugLogDeliveryAccounts`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-debuglogdeliveryaccounts
         */
        readonly debugLogDeliveryAccounts?: string[];
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.Description`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-description
         */
        readonly description?: string;
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.InputParameters`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-inputparameters
         */
        readonly inputParameters?: string;
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.MaximumExecutionFrequency`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-maximumexecutionfrequency
         */
        readonly maximumExecutionFrequency?: string;
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.OrganizationConfigRuleTriggerTypes`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-organizationconfigruletriggertypes
         */
        readonly organizationConfigRuleTriggerTypes?: string[];
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.ResourceIdScope`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-resourceidscope
         */
        readonly resourceIdScope?: string;
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.ResourceTypesScope`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-resourcetypesscope
         */
        readonly resourceTypesScope?: string[];
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.Runtime`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-runtime
         */
        readonly runtime: string;
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.TagKeyScope`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-tagkeyscope
         */
        readonly tagKeyScope?: string;
        /**
         * `CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty.TagValueScope`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomcoderulemetadata.html#cfn-config-organizationconfigrule-organizationcustomcoderulemetadata-tagvaluescope
         */
        readonly tagValueScope?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OrganizationCustomCodeRuleMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `OrganizationCustomCodeRuleMetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnOrganizationConfigRule_OrganizationCustomCodeRuleMetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codeText', cdk.requiredValidator)(properties.codeText));
    errors.collect(cdk.propertyValidator('codeText', cdk.validateString)(properties.codeText));
    errors.collect(cdk.propertyValidator('debugLogDeliveryAccounts', cdk.listValidator(cdk.validateString))(properties.debugLogDeliveryAccounts));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inputParameters', cdk.validateString)(properties.inputParameters));
    errors.collect(cdk.propertyValidator('maximumExecutionFrequency', cdk.validateString)(properties.maximumExecutionFrequency));
    errors.collect(cdk.propertyValidator('organizationConfigRuleTriggerTypes', cdk.listValidator(cdk.validateString))(properties.organizationConfigRuleTriggerTypes));
    errors.collect(cdk.propertyValidator('resourceIdScope', cdk.validateString)(properties.resourceIdScope));
    errors.collect(cdk.propertyValidator('resourceTypesScope', cdk.listValidator(cdk.validateString))(properties.resourceTypesScope));
    errors.collect(cdk.propertyValidator('runtime', cdk.requiredValidator)(properties.runtime));
    errors.collect(cdk.propertyValidator('runtime', cdk.validateString)(properties.runtime));
    errors.collect(cdk.propertyValidator('tagKeyScope', cdk.validateString)(properties.tagKeyScope));
    errors.collect(cdk.propertyValidator('tagValueScope', cdk.validateString)(properties.tagValueScope));
    return errors.wrap('supplied properties not correct for "OrganizationCustomCodeRuleMetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::OrganizationConfigRule.OrganizationCustomCodeRuleMetadata` resource
 *
 * @param properties - the TypeScript properties of a `OrganizationCustomCodeRuleMetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::OrganizationConfigRule.OrganizationCustomCodeRuleMetadata` resource.
 */
// @ts-ignore TS6133
function cfnOrganizationConfigRuleOrganizationCustomCodeRuleMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOrganizationConfigRule_OrganizationCustomCodeRuleMetadataPropertyValidator(properties).assertSuccess();
    return {
        CodeText: cdk.stringToCloudFormation(properties.codeText),
        DebugLogDeliveryAccounts: cdk.listMapper(cdk.stringToCloudFormation)(properties.debugLogDeliveryAccounts),
        Description: cdk.stringToCloudFormation(properties.description),
        InputParameters: cdk.stringToCloudFormation(properties.inputParameters),
        MaximumExecutionFrequency: cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
        OrganizationConfigRuleTriggerTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationConfigRuleTriggerTypes),
        ResourceIdScope: cdk.stringToCloudFormation(properties.resourceIdScope),
        ResourceTypesScope: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypesScope),
        Runtime: cdk.stringToCloudFormation(properties.runtime),
        TagKeyScope: cdk.stringToCloudFormation(properties.tagKeyScope),
        TagValueScope: cdk.stringToCloudFormation(properties.tagValueScope),
    };
}

// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationCustomCodeRuleMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConfigRule.OrganizationCustomCodeRuleMetadataProperty>();
    ret.addPropertyResult('codeText', 'CodeText', cfn_parse.FromCloudFormation.getString(properties.CodeText));
    ret.addPropertyResult('debugLogDeliveryAccounts', 'DebugLogDeliveryAccounts', properties.DebugLogDeliveryAccounts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DebugLogDeliveryAccounts) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inputParameters', 'InputParameters', properties.InputParameters != null ? cfn_parse.FromCloudFormation.getString(properties.InputParameters) : undefined);
    ret.addPropertyResult('maximumExecutionFrequency', 'MaximumExecutionFrequency', properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined);
    ret.addPropertyResult('organizationConfigRuleTriggerTypes', 'OrganizationConfigRuleTriggerTypes', properties.OrganizationConfigRuleTriggerTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OrganizationConfigRuleTriggerTypes) : undefined);
    ret.addPropertyResult('resourceIdScope', 'ResourceIdScope', properties.ResourceIdScope != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdScope) : undefined);
    ret.addPropertyResult('resourceTypesScope', 'ResourceTypesScope', properties.ResourceTypesScope != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceTypesScope) : undefined);
    ret.addPropertyResult('runtime', 'Runtime', cfn_parse.FromCloudFormation.getString(properties.Runtime));
    ret.addPropertyResult('tagKeyScope', 'TagKeyScope', properties.TagKeyScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagKeyScope) : undefined);
    ret.addPropertyResult('tagValueScope', 'TagValueScope', properties.TagValueScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagValueScope) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOrganizationConfigRule {
    /**
     * An object that specifies organization custom rule metadata such as resource type, resource ID of AWS resource, Lambda function ARN, and organization trigger types that trigger AWS Config to evaluate your AWS resources against a rule. It also provides the frequency with which you want AWS Config to run evaluations for the rule if the trigger type is periodic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html
     */
    export interface OrganizationCustomRuleMetadataProperty {
        /**
         * The description that you provide for your organization AWS Config rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-description
         */
        readonly description?: string;
        /**
         * A string, in JSON format, that is passed to your organization AWS Config rule Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-inputparameters
         */
        readonly inputParameters?: string;
        /**
         * The lambda function ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-lambdafunctionarn
         */
        readonly lambdaFunctionArn: string;
        /**
         * The maximum frequency with which AWS Config runs evaluations for a rule. Your custom rule is triggered when AWS Config delivers the configuration snapshot. For more information, see `ConfigSnapshotDeliveryProperties` .
         *
         * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-maximumexecutionfrequency
         */
        readonly maximumExecutionFrequency?: string;
        /**
         * The type of notification that triggers AWS Config to run an evaluation for a rule. You can specify the following notification types:
         *
         * - `ConfigurationItemChangeNotification` - Triggers an evaluation when AWS Config delivers a configuration item as a result of a resource change.
         * - `OversizedConfigurationItemChangeNotification` - Triggers an evaluation when AWS Config delivers an oversized configuration item. AWS Config may generate this notification type when a resource changes and the notification exceeds the maximum size allowed by Amazon SNS.
         * - `ScheduledNotification` - Triggers a periodic evaluation at the frequency specified for `MaximumExecutionFrequency` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-organizationconfigruletriggertypes
         */
        readonly organizationConfigRuleTriggerTypes: string[];
        /**
         * The ID of the AWS resource that was evaluated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-resourceidscope
         */
        readonly resourceIdScope?: string;
        /**
         * The type of the AWS resource that was evaluated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-resourcetypesscope
         */
        readonly resourceTypesScope?: string[];
        /**
         * One part of a key-value pair that make up a tag. A key is a general label that acts like a category for more specific tag values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-tagkeyscope
         */
        readonly tagKeyScope?: string;
        /**
         * The optional part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationcustomrulemetadata.html#cfn-config-organizationconfigrule-organizationcustomrulemetadata-tagvaluescope
         */
        readonly tagValueScope?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OrganizationCustomRuleMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `OrganizationCustomRuleMetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnOrganizationConfigRule_OrganizationCustomRuleMetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inputParameters', cdk.validateString)(properties.inputParameters));
    errors.collect(cdk.propertyValidator('lambdaFunctionArn', cdk.requiredValidator)(properties.lambdaFunctionArn));
    errors.collect(cdk.propertyValidator('lambdaFunctionArn', cdk.validateString)(properties.lambdaFunctionArn));
    errors.collect(cdk.propertyValidator('maximumExecutionFrequency', cdk.validateString)(properties.maximumExecutionFrequency));
    errors.collect(cdk.propertyValidator('organizationConfigRuleTriggerTypes', cdk.requiredValidator)(properties.organizationConfigRuleTriggerTypes));
    errors.collect(cdk.propertyValidator('organizationConfigRuleTriggerTypes', cdk.listValidator(cdk.validateString))(properties.organizationConfigRuleTriggerTypes));
    errors.collect(cdk.propertyValidator('resourceIdScope', cdk.validateString)(properties.resourceIdScope));
    errors.collect(cdk.propertyValidator('resourceTypesScope', cdk.listValidator(cdk.validateString))(properties.resourceTypesScope));
    errors.collect(cdk.propertyValidator('tagKeyScope', cdk.validateString)(properties.tagKeyScope));
    errors.collect(cdk.propertyValidator('tagValueScope', cdk.validateString)(properties.tagValueScope));
    return errors.wrap('supplied properties not correct for "OrganizationCustomRuleMetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::OrganizationConfigRule.OrganizationCustomRuleMetadata` resource
 *
 * @param properties - the TypeScript properties of a `OrganizationCustomRuleMetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::OrganizationConfigRule.OrganizationCustomRuleMetadata` resource.
 */
// @ts-ignore TS6133
function cfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOrganizationConfigRule_OrganizationCustomRuleMetadataPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        InputParameters: cdk.stringToCloudFormation(properties.inputParameters),
        LambdaFunctionArn: cdk.stringToCloudFormation(properties.lambdaFunctionArn),
        MaximumExecutionFrequency: cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
        OrganizationConfigRuleTriggerTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationConfigRuleTriggerTypes),
        ResourceIdScope: cdk.stringToCloudFormation(properties.resourceIdScope),
        ResourceTypesScope: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypesScope),
        TagKeyScope: cdk.stringToCloudFormation(properties.tagKeyScope),
        TagValueScope: cdk.stringToCloudFormation(properties.tagValueScope),
    };
}

// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationCustomRuleMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConfigRule.OrganizationCustomRuleMetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConfigRule.OrganizationCustomRuleMetadataProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inputParameters', 'InputParameters', properties.InputParameters != null ? cfn_parse.FromCloudFormation.getString(properties.InputParameters) : undefined);
    ret.addPropertyResult('lambdaFunctionArn', 'LambdaFunctionArn', cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionArn));
    ret.addPropertyResult('maximumExecutionFrequency', 'MaximumExecutionFrequency', properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined);
    ret.addPropertyResult('organizationConfigRuleTriggerTypes', 'OrganizationConfigRuleTriggerTypes', cfn_parse.FromCloudFormation.getStringArray(properties.OrganizationConfigRuleTriggerTypes));
    ret.addPropertyResult('resourceIdScope', 'ResourceIdScope', properties.ResourceIdScope != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdScope) : undefined);
    ret.addPropertyResult('resourceTypesScope', 'ResourceTypesScope', properties.ResourceTypesScope != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceTypesScope) : undefined);
    ret.addPropertyResult('tagKeyScope', 'TagKeyScope', properties.TagKeyScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagKeyScope) : undefined);
    ret.addPropertyResult('tagValueScope', 'TagValueScope', properties.TagValueScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagValueScope) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnOrganizationConfigRule {
    /**
     * An object that specifies organization managed rule metadata such as resource type and ID of AWS resource along with the rule identifier. It also provides the frequency with which you want AWS Config to run evaluations for the rule if the trigger type is periodic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html
     */
    export interface OrganizationManagedRuleMetadataProperty {
        /**
         * The description that you provide for your organization AWS Config rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-description
         */
        readonly description?: string;
        /**
         * A string, in JSON format, that is passed to your organization AWS Config rule Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-inputparameters
         */
        readonly inputParameters?: string;
        /**
         * The maximum frequency with which AWS Config runs evaluations for a rule. This is for an AWS Config managed rule that is triggered at a periodic frequency.
         *
         * > By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the `MaximumExecutionFrequency` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-maximumexecutionfrequency
         */
        readonly maximumExecutionFrequency?: string;
        /**
         * The ID of the AWS resource that was evaluated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-resourceidscope
         */
        readonly resourceIdScope?: string;
        /**
         * The type of the AWS resource that was evaluated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-resourcetypesscope
         */
        readonly resourceTypesScope?: string[];
        /**
         * For organization config managed rules, a predefined identifier from a list. For example, `IAM_PASSWORD_POLICY` is a managed rule. To reference a managed rule, see [Using AWS Config managed rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_use-managed-rules.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-ruleidentifier
         */
        readonly ruleIdentifier: string;
        /**
         * One part of a key-value pair that make up a tag. A key is a general label that acts like a category for more specific tag values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-tagkeyscope
         */
        readonly tagKeyScope?: string;
        /**
         * The optional part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconfigrule-organizationmanagedrulemetadata.html#cfn-config-organizationconfigrule-organizationmanagedrulemetadata-tagvaluescope
         */
        readonly tagValueScope?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OrganizationManagedRuleMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `OrganizationManagedRuleMetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnOrganizationConfigRule_OrganizationManagedRuleMetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inputParameters', cdk.validateString)(properties.inputParameters));
    errors.collect(cdk.propertyValidator('maximumExecutionFrequency', cdk.validateString)(properties.maximumExecutionFrequency));
    errors.collect(cdk.propertyValidator('resourceIdScope', cdk.validateString)(properties.resourceIdScope));
    errors.collect(cdk.propertyValidator('resourceTypesScope', cdk.listValidator(cdk.validateString))(properties.resourceTypesScope));
    errors.collect(cdk.propertyValidator('ruleIdentifier', cdk.requiredValidator)(properties.ruleIdentifier));
    errors.collect(cdk.propertyValidator('ruleIdentifier', cdk.validateString)(properties.ruleIdentifier));
    errors.collect(cdk.propertyValidator('tagKeyScope', cdk.validateString)(properties.tagKeyScope));
    errors.collect(cdk.propertyValidator('tagValueScope', cdk.validateString)(properties.tagValueScope));
    return errors.wrap('supplied properties not correct for "OrganizationManagedRuleMetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::OrganizationConfigRule.OrganizationManagedRuleMetadata` resource
 *
 * @param properties - the TypeScript properties of a `OrganizationManagedRuleMetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::OrganizationConfigRule.OrganizationManagedRuleMetadata` resource.
 */
// @ts-ignore TS6133
function cfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOrganizationConfigRule_OrganizationManagedRuleMetadataPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        InputParameters: cdk.stringToCloudFormation(properties.inputParameters),
        MaximumExecutionFrequency: cdk.stringToCloudFormation(properties.maximumExecutionFrequency),
        ResourceIdScope: cdk.stringToCloudFormation(properties.resourceIdScope),
        ResourceTypesScope: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypesScope),
        RuleIdentifier: cdk.stringToCloudFormation(properties.ruleIdentifier),
        TagKeyScope: cdk.stringToCloudFormation(properties.tagKeyScope),
        TagValueScope: cdk.stringToCloudFormation(properties.tagValueScope),
    };
}

// @ts-ignore TS6133
function CfnOrganizationConfigRuleOrganizationManagedRuleMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConfigRule.OrganizationManagedRuleMetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConfigRule.OrganizationManagedRuleMetadataProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inputParameters', 'InputParameters', properties.InputParameters != null ? cfn_parse.FromCloudFormation.getString(properties.InputParameters) : undefined);
    ret.addPropertyResult('maximumExecutionFrequency', 'MaximumExecutionFrequency', properties.MaximumExecutionFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumExecutionFrequency) : undefined);
    ret.addPropertyResult('resourceIdScope', 'ResourceIdScope', properties.ResourceIdScope != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdScope) : undefined);
    ret.addPropertyResult('resourceTypesScope', 'ResourceTypesScope', properties.ResourceTypesScope != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceTypesScope) : undefined);
    ret.addPropertyResult('ruleIdentifier', 'RuleIdentifier', cfn_parse.FromCloudFormation.getString(properties.RuleIdentifier));
    ret.addPropertyResult('tagKeyScope', 'TagKeyScope', properties.TagKeyScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagKeyScope) : undefined);
    ret.addPropertyResult('tagValueScope', 'TagValueScope', properties.TagValueScope != null ? cfn_parse.FromCloudFormation.getString(properties.TagValueScope) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnOrganizationConformancePack`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html
 */
export interface CfnOrganizationConformancePackProps {

    /**
     * The name you assign to an organization conformance pack.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-organizationconformancepackname
     */
    readonly organizationConformancePackName: string;

    /**
     * A list of `ConformancePackInputParameter` objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-conformancepackinputparameters
     */
    readonly conformancePackInputParameters?: Array<CfnOrganizationConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the Amazon S3 bucket where AWS Config stores conformance pack templates.
     *
     * > This field is optional.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-deliverys3bucket
     */
    readonly deliveryS3Bucket?: string;

    /**
     * Any folder structure you want to add to an Amazon S3 bucket.
     *
     * > This field is optional.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-deliverys3keyprefix
     */
    readonly deliveryS3KeyPrefix?: string;

    /**
     * A comma-separated list of accounts excluded from organization conformance pack.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-excludedaccounts
     */
    readonly excludedAccounts?: string[];

    /**
     * A string containing full conformance pack template body. Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-templatebody
     */
    readonly templateBody?: string;

    /**
     * Location of file containing the template body. The uri must point to the conformance pack template (max size: 300 KB).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-templates3uri
     */
    readonly templateS3Uri?: string;
}

/**
 * Determine whether the given properties match those of a `CfnOrganizationConformancePackProps`
 *
 * @param properties - the TypeScript properties of a `CfnOrganizationConformancePackProps`
 *
 * @returns the result of the validation.
 */
function CfnOrganizationConformancePackPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conformancePackInputParameters', cdk.listValidator(CfnOrganizationConformancePack_ConformancePackInputParameterPropertyValidator))(properties.conformancePackInputParameters));
    errors.collect(cdk.propertyValidator('deliveryS3Bucket', cdk.validateString)(properties.deliveryS3Bucket));
    errors.collect(cdk.propertyValidator('deliveryS3KeyPrefix', cdk.validateString)(properties.deliveryS3KeyPrefix));
    errors.collect(cdk.propertyValidator('excludedAccounts', cdk.listValidator(cdk.validateString))(properties.excludedAccounts));
    errors.collect(cdk.propertyValidator('organizationConformancePackName', cdk.requiredValidator)(properties.organizationConformancePackName));
    errors.collect(cdk.propertyValidator('organizationConformancePackName', cdk.validateString)(properties.organizationConformancePackName));
    errors.collect(cdk.propertyValidator('templateBody', cdk.validateString)(properties.templateBody));
    errors.collect(cdk.propertyValidator('templateS3Uri', cdk.validateString)(properties.templateS3Uri));
    return errors.wrap('supplied properties not correct for "CfnOrganizationConformancePackProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::OrganizationConformancePack` resource
 *
 * @param properties - the TypeScript properties of a `CfnOrganizationConformancePackProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::OrganizationConformancePack` resource.
 */
// @ts-ignore TS6133
function cfnOrganizationConformancePackPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOrganizationConformancePackPropsValidator(properties).assertSuccess();
    return {
        OrganizationConformancePackName: cdk.stringToCloudFormation(properties.organizationConformancePackName),
        ConformancePackInputParameters: cdk.listMapper(cfnOrganizationConformancePackConformancePackInputParameterPropertyToCloudFormation)(properties.conformancePackInputParameters),
        DeliveryS3Bucket: cdk.stringToCloudFormation(properties.deliveryS3Bucket),
        DeliveryS3KeyPrefix: cdk.stringToCloudFormation(properties.deliveryS3KeyPrefix),
        ExcludedAccounts: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedAccounts),
        TemplateBody: cdk.stringToCloudFormation(properties.templateBody),
        TemplateS3Uri: cdk.stringToCloudFormation(properties.templateS3Uri),
    };
}

// @ts-ignore TS6133
function CfnOrganizationConformancePackPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConformancePackProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConformancePackProps>();
    ret.addPropertyResult('organizationConformancePackName', 'OrganizationConformancePackName', cfn_parse.FromCloudFormation.getString(properties.OrganizationConformancePackName));
    ret.addPropertyResult('conformancePackInputParameters', 'ConformancePackInputParameters', properties.ConformancePackInputParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnOrganizationConformancePackConformancePackInputParameterPropertyFromCloudFormation)(properties.ConformancePackInputParameters) : undefined);
    ret.addPropertyResult('deliveryS3Bucket', 'DeliveryS3Bucket', properties.DeliveryS3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryS3Bucket) : undefined);
    ret.addPropertyResult('deliveryS3KeyPrefix', 'DeliveryS3KeyPrefix', properties.DeliveryS3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryS3KeyPrefix) : undefined);
    ret.addPropertyResult('excludedAccounts', 'ExcludedAccounts', properties.ExcludedAccounts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedAccounts) : undefined);
    ret.addPropertyResult('templateBody', 'TemplateBody', properties.TemplateBody != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateBody) : undefined);
    ret.addPropertyResult('templateS3Uri', 'TemplateS3Uri', properties.TemplateS3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateS3Uri) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::OrganizationConformancePack`
 *
 * OrganizationConformancePack deploys conformance packs across member accounts in an AWS Organizations . OrganizationConformancePack enables organization service access for `config-multiaccountsetup.amazonaws.com` through the `EnableAWSServiceAccess` action and creates a service linked role in the master account of your organization. The service linked role is created only when the role does not exist in the master account.
 *
 * @cloudformationResource AWS::Config::OrganizationConformancePack
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html
 */
export class CfnOrganizationConformancePack extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::OrganizationConformancePack";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOrganizationConformancePack {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnOrganizationConformancePackPropsFromCloudFormation(resourceProperties);
        const ret = new CfnOrganizationConformancePack(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name you assign to an organization conformance pack.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-organizationconformancepackname
     */
    public organizationConformancePackName: string;

    /**
     * A list of `ConformancePackInputParameter` objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-conformancepackinputparameters
     */
    public conformancePackInputParameters: Array<CfnOrganizationConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the Amazon S3 bucket where AWS Config stores conformance pack templates.
     *
     * > This field is optional.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-deliverys3bucket
     */
    public deliveryS3Bucket: string | undefined;

    /**
     * Any folder structure you want to add to an Amazon S3 bucket.
     *
     * > This field is optional.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-deliverys3keyprefix
     */
    public deliveryS3KeyPrefix: string | undefined;

    /**
     * A comma-separated list of accounts excluded from organization conformance pack.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-excludedaccounts
     */
    public excludedAccounts: string[] | undefined;

    /**
     * A string containing full conformance pack template body. Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-templatebody
     */
    public templateBody: string | undefined;

    /**
     * Location of file containing the template body. The uri must point to the conformance pack template (max size: 300 KB).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-organizationconformancepack.html#cfn-config-organizationconformancepack-templates3uri
     */
    public templateS3Uri: string | undefined;

    /**
     * Create a new `AWS::Config::OrganizationConformancePack`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOrganizationConformancePackProps) {
        super(scope, id, { type: CfnOrganizationConformancePack.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'organizationConformancePackName', this);

        this.organizationConformancePackName = props.organizationConformancePackName;
        this.conformancePackInputParameters = props.conformancePackInputParameters;
        this.deliveryS3Bucket = props.deliveryS3Bucket;
        this.deliveryS3KeyPrefix = props.deliveryS3KeyPrefix;
        this.excludedAccounts = props.excludedAccounts;
        this.templateBody = props.templateBody;
        this.templateS3Uri = props.templateS3Uri;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnOrganizationConformancePack.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            organizationConformancePackName: this.organizationConformancePackName,
            conformancePackInputParameters: this.conformancePackInputParameters,
            deliveryS3Bucket: this.deliveryS3Bucket,
            deliveryS3KeyPrefix: this.deliveryS3KeyPrefix,
            excludedAccounts: this.excludedAccounts,
            templateBody: this.templateBody,
            templateS3Uri: this.templateS3Uri,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnOrganizationConformancePackPropsToCloudFormation(props);
    }
}

export namespace CfnOrganizationConformancePack {
    /**
     * Input parameters in the form of key-value pairs for the conformance pack, both of which you define. Keys can have a maximum character length of 255 characters, and values can have a maximum length of 4096 characters.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconformancepack-conformancepackinputparameter.html
     */
    export interface ConformancePackInputParameterProperty {
        /**
         * One part of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconformancepack-conformancepackinputparameter.html#cfn-config-organizationconformancepack-conformancepackinputparameter-parametername
         */
        readonly parameterName: string;
        /**
         * One part of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-organizationconformancepack-conformancepackinputparameter.html#cfn-config-organizationconformancepack-conformancepackinputparameter-parametervalue
         */
        readonly parameterValue: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConformancePackInputParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ConformancePackInputParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnOrganizationConformancePack_ConformancePackInputParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('parameterName', cdk.requiredValidator)(properties.parameterName));
    errors.collect(cdk.propertyValidator('parameterName', cdk.validateString)(properties.parameterName));
    errors.collect(cdk.propertyValidator('parameterValue', cdk.requiredValidator)(properties.parameterValue));
    errors.collect(cdk.propertyValidator('parameterValue', cdk.validateString)(properties.parameterValue));
    return errors.wrap('supplied properties not correct for "ConformancePackInputParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::OrganizationConformancePack.ConformancePackInputParameter` resource
 *
 * @param properties - the TypeScript properties of a `ConformancePackInputParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::OrganizationConformancePack.ConformancePackInputParameter` resource.
 */
// @ts-ignore TS6133
function cfnOrganizationConformancePackConformancePackInputParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOrganizationConformancePack_ConformancePackInputParameterPropertyValidator(properties).assertSuccess();
    return {
        ParameterName: cdk.stringToCloudFormation(properties.parameterName),
        ParameterValue: cdk.stringToCloudFormation(properties.parameterValue),
    };
}

// @ts-ignore TS6133
function CfnOrganizationConformancePackConformancePackInputParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationConformancePack.ConformancePackInputParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationConformancePack.ConformancePackInputParameterProperty>();
    ret.addPropertyResult('parameterName', 'ParameterName', cfn_parse.FromCloudFormation.getString(properties.ParameterName));
    ret.addPropertyResult('parameterValue', 'ParameterValue', cfn_parse.FromCloudFormation.getString(properties.ParameterValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRemediationConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html
 */
export interface CfnRemediationConfigurationProps {

    /**
     * The name of the AWS Config rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-configrulename
     */
    readonly configRuleName: string;

    /**
     * Target ID is the name of the public document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targetid
     */
    readonly targetId: string;

    /**
     * The type of the target. Target executes remediation. For example, SSM document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targettype
     */
    readonly targetType: string;

    /**
     * The remediation is triggered automatically.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-automatic
     */
    readonly automatic?: boolean | cdk.IResolvable;

    /**
     * An ExecutionControls object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-executioncontrols
     */
    readonly executionControls?: CfnRemediationConfiguration.ExecutionControlsProperty | cdk.IResolvable;

    /**
     * The maximum number of failed attempts for auto-remediation. If you do not select a number, the default is 5.
     *
     * For example, if you specify MaximumAutomaticAttempts as 5 with RetryAttemptSeconds as 50 seconds, AWS Config will put a RemediationException on your behalf for the failing resource after the 5th failed attempt within 50 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-maximumautomaticattempts
     */
    readonly maximumAutomaticAttempts?: number;

    /**
     * An object of the RemediationParameterValue. For more information, see [RemediationParameterValue](https://docs.aws.amazon.com/config/latest/APIReference/API_RemediationParameterValue.html) .
     *
     * > The type is a map of strings to RemediationParameterValue.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * The type of a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-resourcetype
     */
    readonly resourceType?: string;

    /**
     * Maximum time in seconds that AWS Config runs auto-remediation. If you do not select a number, the default is 60 seconds.
     *
     * For example, if you specify RetryAttemptSeconds as 50 seconds and MaximumAutomaticAttempts as 5, AWS Config will run auto-remediations 5 times within 50 seconds before throwing an exception.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-retryattemptseconds
     */
    readonly retryAttemptSeconds?: number;

    /**
     * Version of the target. For example, version of the SSM document.
     *
     * > If you make backward incompatible changes to the SSM document, you must call PutRemediationConfiguration API again to ensure the remediations can run.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targetversion
     */
    readonly targetVersion?: string;
}

/**
 * Determine whether the given properties match those of a `CfnRemediationConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnRemediationConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnRemediationConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('automatic', cdk.validateBoolean)(properties.automatic));
    errors.collect(cdk.propertyValidator('configRuleName', cdk.requiredValidator)(properties.configRuleName));
    errors.collect(cdk.propertyValidator('configRuleName', cdk.validateString)(properties.configRuleName));
    errors.collect(cdk.propertyValidator('executionControls', CfnRemediationConfiguration_ExecutionControlsPropertyValidator)(properties.executionControls));
    errors.collect(cdk.propertyValidator('maximumAutomaticAttempts', cdk.validateNumber)(properties.maximumAutomaticAttempts));
    errors.collect(cdk.propertyValidator('parameters', cdk.validateObject)(properties.parameters));
    errors.collect(cdk.propertyValidator('resourceType', cdk.validateString)(properties.resourceType));
    errors.collect(cdk.propertyValidator('retryAttemptSeconds', cdk.validateNumber)(properties.retryAttemptSeconds));
    errors.collect(cdk.propertyValidator('targetId', cdk.requiredValidator)(properties.targetId));
    errors.collect(cdk.propertyValidator('targetId', cdk.validateString)(properties.targetId));
    errors.collect(cdk.propertyValidator('targetType', cdk.requiredValidator)(properties.targetType));
    errors.collect(cdk.propertyValidator('targetType', cdk.validateString)(properties.targetType));
    errors.collect(cdk.propertyValidator('targetVersion', cdk.validateString)(properties.targetVersion));
    return errors.wrap('supplied properties not correct for "CfnRemediationConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnRemediationConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnRemediationConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRemediationConfigurationPropsValidator(properties).assertSuccess();
    return {
        ConfigRuleName: cdk.stringToCloudFormation(properties.configRuleName),
        TargetId: cdk.stringToCloudFormation(properties.targetId),
        TargetType: cdk.stringToCloudFormation(properties.targetType),
        Automatic: cdk.booleanToCloudFormation(properties.automatic),
        ExecutionControls: cfnRemediationConfigurationExecutionControlsPropertyToCloudFormation(properties.executionControls),
        MaximumAutomaticAttempts: cdk.numberToCloudFormation(properties.maximumAutomaticAttempts),
        Parameters: cdk.objectToCloudFormation(properties.parameters),
        ResourceType: cdk.stringToCloudFormation(properties.resourceType),
        RetryAttemptSeconds: cdk.numberToCloudFormation(properties.retryAttemptSeconds),
        TargetVersion: cdk.stringToCloudFormation(properties.targetVersion),
    };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRemediationConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfigurationProps>();
    ret.addPropertyResult('configRuleName', 'ConfigRuleName', cfn_parse.FromCloudFormation.getString(properties.ConfigRuleName));
    ret.addPropertyResult('targetId', 'TargetId', cfn_parse.FromCloudFormation.getString(properties.TargetId));
    ret.addPropertyResult('targetType', 'TargetType', cfn_parse.FromCloudFormation.getString(properties.TargetType));
    ret.addPropertyResult('automatic', 'Automatic', properties.Automatic != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Automatic) : undefined);
    ret.addPropertyResult('executionControls', 'ExecutionControls', properties.ExecutionControls != null ? CfnRemediationConfigurationExecutionControlsPropertyFromCloudFormation(properties.ExecutionControls) : undefined);
    ret.addPropertyResult('maximumAutomaticAttempts', 'MaximumAutomaticAttempts', properties.MaximumAutomaticAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumAutomaticAttempts) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined);
    ret.addPropertyResult('resourceType', 'ResourceType', properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined);
    ret.addPropertyResult('retryAttemptSeconds', 'RetryAttemptSeconds', properties.RetryAttemptSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetryAttemptSeconds) : undefined);
    ret.addPropertyResult('targetVersion', 'TargetVersion', properties.TargetVersion != null ? cfn_parse.FromCloudFormation.getString(properties.TargetVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::RemediationConfiguration`
 *
 * An object that represents the details about the remediation configuration that includes the remediation action, parameters, and data to execute the action.
 *
 * @cloudformationResource AWS::Config::RemediationConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html
 */
export class CfnRemediationConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::RemediationConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRemediationConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRemediationConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRemediationConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the AWS Config rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-configrulename
     */
    public configRuleName: string;

    /**
     * Target ID is the name of the public document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targetid
     */
    public targetId: string;

    /**
     * The type of the target. Target executes remediation. For example, SSM document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targettype
     */
    public targetType: string;

    /**
     * The remediation is triggered automatically.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-automatic
     */
    public automatic: boolean | cdk.IResolvable | undefined;

    /**
     * An ExecutionControls object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-executioncontrols
     */
    public executionControls: CfnRemediationConfiguration.ExecutionControlsProperty | cdk.IResolvable | undefined;

    /**
     * The maximum number of failed attempts for auto-remediation. If you do not select a number, the default is 5.
     *
     * For example, if you specify MaximumAutomaticAttempts as 5 with RetryAttemptSeconds as 50 seconds, AWS Config will put a RemediationException on your behalf for the failing resource after the 5th failed attempt within 50 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-maximumautomaticattempts
     */
    public maximumAutomaticAttempts: number | undefined;

    /**
     * An object of the RemediationParameterValue. For more information, see [RemediationParameterValue](https://docs.aws.amazon.com/config/latest/APIReference/API_RemediationParameterValue.html) .
     *
     * > The type is a map of strings to RemediationParameterValue.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-parameters
     */
    public parameters: any | cdk.IResolvable | undefined;

    /**
     * The type of a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-resourcetype
     */
    public resourceType: string | undefined;

    /**
     * Maximum time in seconds that AWS Config runs auto-remediation. If you do not select a number, the default is 60 seconds.
     *
     * For example, if you specify RetryAttemptSeconds as 50 seconds and MaximumAutomaticAttempts as 5, AWS Config will run auto-remediations 5 times within 50 seconds before throwing an exception.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-retryattemptseconds
     */
    public retryAttemptSeconds: number | undefined;

    /**
     * Version of the target. For example, version of the SSM document.
     *
     * > If you make backward incompatible changes to the SSM document, you must call PutRemediationConfiguration API again to ensure the remediations can run.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-remediationconfiguration.html#cfn-config-remediationconfiguration-targetversion
     */
    public targetVersion: string | undefined;

    /**
     * Create a new `AWS::Config::RemediationConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRemediationConfigurationProps) {
        super(scope, id, { type: CfnRemediationConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'configRuleName', this);
        cdk.requireProperty(props, 'targetId', this);
        cdk.requireProperty(props, 'targetType', this);

        this.configRuleName = props.configRuleName;
        this.targetId = props.targetId;
        this.targetType = props.targetType;
        this.automatic = props.automatic;
        this.executionControls = props.executionControls;
        this.maximumAutomaticAttempts = props.maximumAutomaticAttempts;
        this.parameters = props.parameters;
        this.resourceType = props.resourceType;
        this.retryAttemptSeconds = props.retryAttemptSeconds;
        this.targetVersion = props.targetVersion;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRemediationConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            configRuleName: this.configRuleName,
            targetId: this.targetId,
            targetType: this.targetType,
            automatic: this.automatic,
            executionControls: this.executionControls,
            maximumAutomaticAttempts: this.maximumAutomaticAttempts,
            parameters: this.parameters,
            resourceType: this.resourceType,
            retryAttemptSeconds: this.retryAttemptSeconds,
            targetVersion: this.targetVersion,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRemediationConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnRemediationConfiguration {
    /**
     * An ExecutionControls object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-executioncontrols.html
     */
    export interface ExecutionControlsProperty {
        /**
         * A SsmControls object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-executioncontrols.html#cfn-config-remediationconfiguration-executioncontrols-ssmcontrols
         */
        readonly ssmControls?: CfnRemediationConfiguration.SsmControlsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ExecutionControlsProperty`
 *
 * @param properties - the TypeScript properties of a `ExecutionControlsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRemediationConfiguration_ExecutionControlsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ssmControls', CfnRemediationConfiguration_SsmControlsPropertyValidator)(properties.ssmControls));
    return errors.wrap('supplied properties not correct for "ExecutionControlsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.ExecutionControls` resource
 *
 * @param properties - the TypeScript properties of a `ExecutionControlsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.ExecutionControls` resource.
 */
// @ts-ignore TS6133
function cfnRemediationConfigurationExecutionControlsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRemediationConfiguration_ExecutionControlsPropertyValidator(properties).assertSuccess();
    return {
        SsmControls: cfnRemediationConfigurationSsmControlsPropertyToCloudFormation(properties.ssmControls),
    };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationExecutionControlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRemediationConfiguration.ExecutionControlsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.ExecutionControlsProperty>();
    ret.addPropertyResult('ssmControls', 'SsmControls', properties.SsmControls != null ? CfnRemediationConfigurationSsmControlsPropertyFromCloudFormation(properties.SsmControls) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRemediationConfiguration {
    /**
     * The value is either a dynamic (resource) value or a static value. You must select either a dynamic value or a static value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-remediationparametervalue.html
     */
    export interface RemediationParameterValueProperty {
        /**
         * The value is dynamic and changes at run-time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-remediationparametervalue.html#cfn-config-remediationconfiguration-remediationparametervalue-resourcevalue
         */
        readonly resourceValue?: CfnRemediationConfiguration.ResourceValueProperty | cdk.IResolvable;
        /**
         * The value is static and does not change at run-time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-remediationparametervalue.html#cfn-config-remediationconfiguration-remediationparametervalue-staticvalue
         */
        readonly staticValue?: CfnRemediationConfiguration.StaticValueProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RemediationParameterValueProperty`
 *
 * @param properties - the TypeScript properties of a `RemediationParameterValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnRemediationConfiguration_RemediationParameterValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceValue', CfnRemediationConfiguration_ResourceValuePropertyValidator)(properties.resourceValue));
    errors.collect(cdk.propertyValidator('staticValue', CfnRemediationConfiguration_StaticValuePropertyValidator)(properties.staticValue));
    return errors.wrap('supplied properties not correct for "RemediationParameterValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.RemediationParameterValue` resource
 *
 * @param properties - the TypeScript properties of a `RemediationParameterValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.RemediationParameterValue` resource.
 */
// @ts-ignore TS6133
function cfnRemediationConfigurationRemediationParameterValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRemediationConfiguration_RemediationParameterValuePropertyValidator(properties).assertSuccess();
    return {
        ResourceValue: cfnRemediationConfigurationResourceValuePropertyToCloudFormation(properties.resourceValue),
        StaticValue: cfnRemediationConfigurationStaticValuePropertyToCloudFormation(properties.staticValue),
    };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationRemediationParameterValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRemediationConfiguration.RemediationParameterValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.RemediationParameterValueProperty>();
    ret.addPropertyResult('resourceValue', 'ResourceValue', properties.ResourceValue != null ? CfnRemediationConfigurationResourceValuePropertyFromCloudFormation(properties.ResourceValue) : undefined);
    ret.addPropertyResult('staticValue', 'StaticValue', properties.StaticValue != null ? CfnRemediationConfigurationStaticValuePropertyFromCloudFormation(properties.StaticValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRemediationConfiguration {
    /**
     * The dynamic value of the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-resourcevalue.html
     */
    export interface ResourceValueProperty {
        /**
         * The value is a resource ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-resourcevalue.html#cfn-config-remediationconfiguration-resourcevalue-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceValueProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnRemediationConfiguration_ResourceValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ResourceValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.ResourceValue` resource
 *
 * @param properties - the TypeScript properties of a `ResourceValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.ResourceValue` resource.
 */
// @ts-ignore TS6133
function cfnRemediationConfigurationResourceValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRemediationConfiguration_ResourceValuePropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationResourceValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRemediationConfiguration.ResourceValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.ResourceValueProperty>();
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRemediationConfiguration {
    /**
     * AWS Systems Manager (SSM) specific remediation controls.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-ssmcontrols.html
     */
    export interface SsmControlsProperty {
        /**
         * The maximum percentage of remediation actions allowed to run in parallel on the non-compliant resources for that specific rule. You can specify a percentage, such as 10%. The default value is 10.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-ssmcontrols.html#cfn-config-remediationconfiguration-ssmcontrols-concurrentexecutionratepercentage
         */
        readonly concurrentExecutionRatePercentage?: number;
        /**
         * The percentage of errors that are allowed before SSM stops running automations on non-compliant resources for that specific rule. You can specify a percentage of errors, for example 10%. If you do not specifiy a percentage, the default is 50%. For example, if you set the ErrorPercentage to 40% for 10 non-compliant resources, then SSM stops running the automations when the fifth error is received.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-ssmcontrols.html#cfn-config-remediationconfiguration-ssmcontrols-errorpercentage
         */
        readonly errorPercentage?: number;
    }
}

/**
 * Determine whether the given properties match those of a `SsmControlsProperty`
 *
 * @param properties - the TypeScript properties of a `SsmControlsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRemediationConfiguration_SsmControlsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('concurrentExecutionRatePercentage', cdk.validateNumber)(properties.concurrentExecutionRatePercentage));
    errors.collect(cdk.propertyValidator('errorPercentage', cdk.validateNumber)(properties.errorPercentage));
    return errors.wrap('supplied properties not correct for "SsmControlsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.SsmControls` resource
 *
 * @param properties - the TypeScript properties of a `SsmControlsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.SsmControls` resource.
 */
// @ts-ignore TS6133
function cfnRemediationConfigurationSsmControlsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRemediationConfiguration_SsmControlsPropertyValidator(properties).assertSuccess();
    return {
        ConcurrentExecutionRatePercentage: cdk.numberToCloudFormation(properties.concurrentExecutionRatePercentage),
        ErrorPercentage: cdk.numberToCloudFormation(properties.errorPercentage),
    };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationSsmControlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRemediationConfiguration.SsmControlsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.SsmControlsProperty>();
    ret.addPropertyResult('concurrentExecutionRatePercentage', 'ConcurrentExecutionRatePercentage', properties.ConcurrentExecutionRatePercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConcurrentExecutionRatePercentage) : undefined);
    ret.addPropertyResult('errorPercentage', 'ErrorPercentage', properties.ErrorPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ErrorPercentage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRemediationConfiguration {
    /**
     * The static value of the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-staticvalue.html
     */
    export interface StaticValueProperty {
        /**
         * A list of values. For example, the ARN of the assumed role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-remediationconfiguration-staticvalue.html#cfn-config-remediationconfiguration-staticvalue-values
         */
        readonly values?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `StaticValueProperty`
 *
 * @param properties - the TypeScript properties of a `StaticValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnRemediationConfiguration_StaticValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "StaticValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.StaticValue` resource
 *
 * @param properties - the TypeScript properties of a `StaticValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::RemediationConfiguration.StaticValue` resource.
 */
// @ts-ignore TS6133
function cfnRemediationConfigurationStaticValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRemediationConfiguration_StaticValuePropertyValidator(properties).assertSuccess();
    return {
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnRemediationConfigurationStaticValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRemediationConfiguration.StaticValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRemediationConfiguration.StaticValueProperty>();
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStoredQuery`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html
 */
export interface CfnStoredQueryProps {

    /**
     * The expression of the query. For example, `SELECT resourceId, resourceType, supplementaryConfiguration.BucketVersioningConfiguration.status WHERE resourceType = 'AWS::S3::Bucket' AND supplementaryConfiguration.BucketVersioningConfiguration.status = 'Off'.`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-queryexpression
     */
    readonly queryExpression: string;

    /**
     * The name of the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-queryname
     */
    readonly queryName: string;

    /**
     * A unique description for the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-querydescription
     */
    readonly queryDescription?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnStoredQueryProps`
 *
 * @param properties - the TypeScript properties of a `CfnStoredQueryProps`
 *
 * @returns the result of the validation.
 */
function CfnStoredQueryPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('queryDescription', cdk.validateString)(properties.queryDescription));
    errors.collect(cdk.propertyValidator('queryExpression', cdk.requiredValidator)(properties.queryExpression));
    errors.collect(cdk.propertyValidator('queryExpression', cdk.validateString)(properties.queryExpression));
    errors.collect(cdk.propertyValidator('queryName', cdk.requiredValidator)(properties.queryName));
    errors.collect(cdk.propertyValidator('queryName', cdk.validateString)(properties.queryName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStoredQueryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Config::StoredQuery` resource
 *
 * @param properties - the TypeScript properties of a `CfnStoredQueryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Config::StoredQuery` resource.
 */
// @ts-ignore TS6133
function cfnStoredQueryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStoredQueryPropsValidator(properties).assertSuccess();
    return {
        QueryExpression: cdk.stringToCloudFormation(properties.queryExpression),
        QueryName: cdk.stringToCloudFormation(properties.queryName),
        QueryDescription: cdk.stringToCloudFormation(properties.queryDescription),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStoredQueryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStoredQueryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStoredQueryProps>();
    ret.addPropertyResult('queryExpression', 'QueryExpression', cfn_parse.FromCloudFormation.getString(properties.QueryExpression));
    ret.addPropertyResult('queryName', 'QueryName', cfn_parse.FromCloudFormation.getString(properties.QueryName));
    ret.addPropertyResult('queryDescription', 'QueryDescription', properties.QueryDescription != null ? cfn_parse.FromCloudFormation.getString(properties.QueryDescription) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Config::StoredQuery`
 *
 * Provides the details of a stored query.
 *
 * @cloudformationResource AWS::Config::StoredQuery
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html
 */
export class CfnStoredQuery extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Config::StoredQuery";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStoredQuery {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStoredQueryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStoredQuery(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Amazon Resource Name (ARN) of the query. For example, arn:partition:service:region:account-id:resource-type/resource-name/resource-id.
     * @cloudformationAttribute QueryArn
     */
    public readonly attrQueryArn: string;

    /**
     * The ID of the query.
     * @cloudformationAttribute QueryId
     */
    public readonly attrQueryId: string;

    /**
     * The expression of the query. For example, `SELECT resourceId, resourceType, supplementaryConfiguration.BucketVersioningConfiguration.status WHERE resourceType = 'AWS::S3::Bucket' AND supplementaryConfiguration.BucketVersioningConfiguration.status = 'Off'.`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-queryexpression
     */
    public queryExpression: string;

    /**
     * The name of the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-queryname
     */
    public queryName: string;

    /**
     * A unique description for the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-querydescription
     */
    public queryDescription: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-storedquery.html#cfn-config-storedquery-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Config::StoredQuery`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStoredQueryProps) {
        super(scope, id, { type: CfnStoredQuery.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'queryExpression', this);
        cdk.requireProperty(props, 'queryName', this);
        this.attrQueryArn = cdk.Token.asString(this.getAtt('QueryArn', cdk.ResolutionTypeHint.STRING));
        this.attrQueryId = cdk.Token.asString(this.getAtt('QueryId', cdk.ResolutionTypeHint.STRING));

        this.queryExpression = props.queryExpression;
        this.queryName = props.queryName;
        this.queryDescription = props.queryDescription;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Config::StoredQuery", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStoredQuery.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            queryExpression: this.queryExpression,
            queryName: this.queryName,
            queryDescription: this.queryDescription,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStoredQueryPropsToCloudFormation(props);
    }
}
