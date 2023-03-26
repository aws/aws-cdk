// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:29.614Z","fingerprint":"xWIMkwJn8tA0NGMkgPO2OJQsZLji+HNaFyGl/yNhdvc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAssessmentTarget`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html
 */
export interface CfnAssessmentTargetProps {

    /**
     * The name of the Amazon Inspector assessment target. The name must be unique within the AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html#cfn-inspector-assessmenttarget-assessmenttargetname
     */
    readonly assessmentTargetName?: string;

    /**
     * The ARN that specifies the resource group that is used to create the assessment target. If `resourceGroupArn` is not specified, all EC2 instances in the current AWS account and Region are included in the assessment target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html#cfn-inspector-assessmenttarget-resourcegrouparn
     */
    readonly resourceGroupArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAssessmentTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTargetProps`
 *
 * @returns the result of the validation.
 */
function CfnAssessmentTargetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assessmentTargetName', cdk.validateString)(properties.assessmentTargetName));
    errors.collect(cdk.propertyValidator('resourceGroupArn', cdk.validateString)(properties.resourceGroupArn));
    return errors.wrap('supplied properties not correct for "CfnAssessmentTargetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Inspector::AssessmentTarget` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTargetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Inspector::AssessmentTarget` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentTargetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessmentTargetPropsValidator(properties).assertSuccess();
    return {
        AssessmentTargetName: cdk.stringToCloudFormation(properties.assessmentTargetName),
        ResourceGroupArn: cdk.stringToCloudFormation(properties.resourceGroupArn),
    };
}

// @ts-ignore TS6133
function CfnAssessmentTargetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessmentTargetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessmentTargetProps>();
    ret.addPropertyResult('assessmentTargetName', 'AssessmentTargetName', properties.AssessmentTargetName != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentTargetName) : undefined);
    ret.addPropertyResult('resourceGroupArn', 'ResourceGroupArn', properties.ResourceGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceGroupArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Inspector::AssessmentTarget`
 *
 * The `AWS::Inspector::AssessmentTarget` resource is used to create Amazon Inspector assessment targets, which specify the Amazon EC2 instances that will be analyzed during an assessment run.
 *
 * @cloudformationResource AWS::Inspector::AssessmentTarget
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html
 */
export class CfnAssessmentTarget extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Inspector::AssessmentTarget";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssessmentTarget {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAssessmentTargetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAssessmentTarget(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) that specifies the assessment target that is created.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the Amazon Inspector assessment target. The name must be unique within the AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html#cfn-inspector-assessmenttarget-assessmenttargetname
     */
    public assessmentTargetName: string | undefined;

    /**
     * The ARN that specifies the resource group that is used to create the assessment target. If `resourceGroupArn` is not specified, all EC2 instances in the current AWS account and Region are included in the assessment target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html#cfn-inspector-assessmenttarget-resourcegrouparn
     */
    public resourceGroupArn: string | undefined;

    /**
     * Create a new `AWS::Inspector::AssessmentTarget`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssessmentTargetProps = {}) {
        super(scope, id, { type: CfnAssessmentTarget.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.assessmentTargetName = props.assessmentTargetName;
        this.resourceGroupArn = props.resourceGroupArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssessmentTarget.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            assessmentTargetName: this.assessmentTargetName,
            resourceGroupArn: this.resourceGroupArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssessmentTargetPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnAssessmentTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html
 */
export interface CfnAssessmentTemplateProps {

    /**
     * The ARN of the assessment target to be included in the assessment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-assessmenttargetarn
     */
    readonly assessmentTargetArn: string;

    /**
     * The duration of the assessment run in seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-durationinseconds
     */
    readonly durationInSeconds: number;

    /**
     * The ARNs of the rules packages that you want to use in the assessment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-rulespackagearns
     */
    readonly rulesPackageArns: string[];

    /**
     * The user-defined name that identifies the assessment template that you want to create. You can create several assessment templates for the same assessment target. The names of the assessment templates that correspond to a particular assessment target must be unique.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-assessmenttemplatename
     */
    readonly assessmentTemplateName?: string;

    /**
     * The user-defined attributes that are assigned to every finding that is generated by the assessment run that uses this assessment template. Within an assessment template, each key must be unique.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-userattributesforfindings
     */
    readonly userAttributesForFindings?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAssessmentTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnAssessmentTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assessmentTargetArn', cdk.requiredValidator)(properties.assessmentTargetArn));
    errors.collect(cdk.propertyValidator('assessmentTargetArn', cdk.validateString)(properties.assessmentTargetArn));
    errors.collect(cdk.propertyValidator('assessmentTemplateName', cdk.validateString)(properties.assessmentTemplateName));
    errors.collect(cdk.propertyValidator('durationInSeconds', cdk.requiredValidator)(properties.durationInSeconds));
    errors.collect(cdk.propertyValidator('durationInSeconds', cdk.validateNumber)(properties.durationInSeconds));
    errors.collect(cdk.propertyValidator('rulesPackageArns', cdk.requiredValidator)(properties.rulesPackageArns));
    errors.collect(cdk.propertyValidator('rulesPackageArns', cdk.listValidator(cdk.validateString))(properties.rulesPackageArns));
    errors.collect(cdk.propertyValidator('userAttributesForFindings', cdk.listValidator(cdk.validateCfnTag))(properties.userAttributesForFindings));
    return errors.wrap('supplied properties not correct for "CfnAssessmentTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Inspector::AssessmentTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Inspector::AssessmentTemplate` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessmentTemplatePropsValidator(properties).assertSuccess();
    return {
        AssessmentTargetArn: cdk.stringToCloudFormation(properties.assessmentTargetArn),
        DurationInSeconds: cdk.numberToCloudFormation(properties.durationInSeconds),
        RulesPackageArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.rulesPackageArns),
        AssessmentTemplateName: cdk.stringToCloudFormation(properties.assessmentTemplateName),
        UserAttributesForFindings: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.userAttributesForFindings),
    };
}

// @ts-ignore TS6133
function CfnAssessmentTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessmentTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessmentTemplateProps>();
    ret.addPropertyResult('assessmentTargetArn', 'AssessmentTargetArn', cfn_parse.FromCloudFormation.getString(properties.AssessmentTargetArn));
    ret.addPropertyResult('durationInSeconds', 'DurationInSeconds', cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds));
    ret.addPropertyResult('rulesPackageArns', 'RulesPackageArns', cfn_parse.FromCloudFormation.getStringArray(properties.RulesPackageArns));
    ret.addPropertyResult('assessmentTemplateName', 'AssessmentTemplateName', properties.AssessmentTemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentTemplateName) : undefined);
    ret.addPropertyResult('userAttributesForFindings', 'UserAttributesForFindings', properties.UserAttributesForFindings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.UserAttributesForFindings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Inspector::AssessmentTemplate`
 *
 * The `AWS::Inspector::AssessmentTemplate` resource creates an Amazon Inspector assessment template, which specifies the Inspector assessment targets that will be evaluated by an assessment run and its related configurations.
 *
 * @cloudformationResource AWS::Inspector::AssessmentTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html
 */
export class CfnAssessmentTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Inspector::AssessmentTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssessmentTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAssessmentTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnAssessmentTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) that specifies the assessment template that is created.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ARN of the assessment target to be included in the assessment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-assessmenttargetarn
     */
    public assessmentTargetArn: string;

    /**
     * The duration of the assessment run in seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-durationinseconds
     */
    public durationInSeconds: number;

    /**
     * The ARNs of the rules packages that you want to use in the assessment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-rulespackagearns
     */
    public rulesPackageArns: string[];

    /**
     * The user-defined name that identifies the assessment template that you want to create. You can create several assessment templates for the same assessment target. The names of the assessment templates that correspond to a particular assessment target must be unique.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-assessmenttemplatename
     */
    public assessmentTemplateName: string | undefined;

    /**
     * The user-defined attributes that are assigned to every finding that is generated by the assessment run that uses this assessment template. Within an assessment template, each key must be unique.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-userattributesforfindings
     */
    public userAttributesForFindings: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Inspector::AssessmentTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssessmentTemplateProps) {
        super(scope, id, { type: CfnAssessmentTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'assessmentTargetArn', this);
        cdk.requireProperty(props, 'durationInSeconds', this);
        cdk.requireProperty(props, 'rulesPackageArns', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.assessmentTargetArn = props.assessmentTargetArn;
        this.durationInSeconds = props.durationInSeconds;
        this.rulesPackageArns = props.rulesPackageArns;
        this.assessmentTemplateName = props.assessmentTemplateName;
        this.userAttributesForFindings = props.userAttributesForFindings;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssessmentTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            assessmentTargetArn: this.assessmentTargetArn,
            durationInSeconds: this.durationInSeconds,
            rulesPackageArns: this.rulesPackageArns,
            assessmentTemplateName: this.assessmentTemplateName,
            userAttributesForFindings: this.userAttributesForFindings,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssessmentTemplatePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnResourceGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html
 */
export interface CfnResourceGroupProps {

    /**
     * The tags (key and value pairs) that will be associated with the resource group.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html#cfn-inspector-resourcegroup-resourcegrouptags
     */
    readonly resourceGroupTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnResourceGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceGroupTags', cdk.requiredValidator)(properties.resourceGroupTags));
    errors.collect(cdk.propertyValidator('resourceGroupTags', cdk.listValidator(cdk.validateCfnTag))(properties.resourceGroupTags));
    return errors.wrap('supplied properties not correct for "CfnResourceGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Inspector::ResourceGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Inspector::ResourceGroup` resource.
 */
// @ts-ignore TS6133
function cfnResourceGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceGroupPropsValidator(properties).assertSuccess();
    return {
        ResourceGroupTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.resourceGroupTags),
    };
}

// @ts-ignore TS6133
function CfnResourceGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceGroupProps>();
    ret.addPropertyResult('resourceGroupTags', 'ResourceGroupTags', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.ResourceGroupTags));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Inspector::ResourceGroup`
 *
 * The `AWS::Inspector::ResourceGroup` resource is used to create Amazon Inspector resource groups. A resource group defines a set of tags that, when queried, identify the AWS resources that make up the assessment target.
 *
 * @cloudformationResource AWS::Inspector::ResourceGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html
 */
export class CfnResourceGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Inspector::ResourceGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResourceGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourceGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) that specifies the resource group that is created.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The tags (key and value pairs) that will be associated with the resource group.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html#cfn-inspector-resourcegroup-resourcegrouptags
     */
    public resourceGroupTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Create a new `AWS::Inspector::ResourceGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceGroupProps) {
        super(scope, id, { type: CfnResourceGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceGroupTags', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.resourceGroupTags = props.resourceGroupTags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resourceGroupTags: this.resourceGroupTags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourceGroupPropsToCloudFormation(props);
    }
}
