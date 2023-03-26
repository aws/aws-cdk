// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:45.571Z","fingerprint":"sgV/NWybhoox2LxQHq1NE6g14Ha8T6QFC6akf8/jBgo="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAnalysis`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html
 */
export interface CfnAnalysisProps {

    /**
     * The ID for the analysis that you're creating. This ID displays in the URL of the analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-analysisid
     */
    readonly analysisId: string;

    /**
     * The ID of the AWS account where you are creating an analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-awsaccountid
     */
    readonly awsAccountId: string;

    /**
     * A source entity to use for the analysis that you're creating. This metadata structure contains details that describe a source template and one or more datasets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-sourceentity
     */
    readonly sourceEntity: CfnAnalysis.AnalysisSourceEntityProperty | cdk.IResolvable;

    /**
     * `AWS::QuickSight::Analysis.Errors`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-errors
     */
    readonly errors?: Array<CfnAnalysis.AnalysisErrorProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A descriptive name for the analysis that you're creating. This name displays for the analysis in the Amazon QuickSight console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-name
     */
    readonly name?: string;

    /**
     * The parameter names and override values that you want to use. An analysis can have any parameter type, and some parameters might accept multiple values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-parameters
     */
    readonly parameters?: CfnAnalysis.ParametersProperty | cdk.IResolvable;

    /**
     * A structure that describes the principals and the resource-level permissions on an analysis. You can use the `Permissions` structure to grant permissions by providing a list of AWS Identity and Access Management (IAM) action information for each principal listed by Amazon Resource Name (ARN).
     *
     * To specify no permissions, omit `Permissions` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-permissions
     */
    readonly permissions?: Array<CfnAnalysis.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The ARN for the theme to apply to the analysis that you're creating. To see the theme in the Amazon QuickSight console, make sure that you have access to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-themearn
     */
    readonly themeArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAnalysisProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnalysisProps`
 *
 * @returns the result of the validation.
 */
function CfnAnalysisPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('analysisId', cdk.requiredValidator)(properties.analysisId));
    errors.collect(cdk.propertyValidator('analysisId', cdk.validateString)(properties.analysisId));
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.requiredValidator)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.validateString)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('errors', cdk.listValidator(CfnAnalysis_AnalysisErrorPropertyValidator))(properties.errors));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parameters', CfnAnalysis_ParametersPropertyValidator)(properties.parameters));
    errors.collect(cdk.propertyValidator('permissions', cdk.listValidator(CfnAnalysis_ResourcePermissionPropertyValidator))(properties.permissions));
    errors.collect(cdk.propertyValidator('sourceEntity', cdk.requiredValidator)(properties.sourceEntity));
    errors.collect(cdk.propertyValidator('sourceEntity', CfnAnalysis_AnalysisSourceEntityPropertyValidator)(properties.sourceEntity));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('themeArn', cdk.validateString)(properties.themeArn));
    return errors.wrap('supplied properties not correct for "CfnAnalysisProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis` resource
 *
 * @param properties - the TypeScript properties of a `CfnAnalysisProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysisPropsValidator(properties).assertSuccess();
    return {
        AnalysisId: cdk.stringToCloudFormation(properties.analysisId),
        AwsAccountId: cdk.stringToCloudFormation(properties.awsAccountId),
        SourceEntity: cfnAnalysisAnalysisSourceEntityPropertyToCloudFormation(properties.sourceEntity),
        Errors: cdk.listMapper(cfnAnalysisAnalysisErrorPropertyToCloudFormation)(properties.errors),
        Name: cdk.stringToCloudFormation(properties.name),
        Parameters: cfnAnalysisParametersPropertyToCloudFormation(properties.parameters),
        Permissions: cdk.listMapper(cfnAnalysisResourcePermissionPropertyToCloudFormation)(properties.permissions),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        ThemeArn: cdk.stringToCloudFormation(properties.themeArn),
    };
}

// @ts-ignore TS6133
function CfnAnalysisPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysisProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysisProps>();
    ret.addPropertyResult('analysisId', 'AnalysisId', cfn_parse.FromCloudFormation.getString(properties.AnalysisId));
    ret.addPropertyResult('awsAccountId', 'AwsAccountId', cfn_parse.FromCloudFormation.getString(properties.AwsAccountId));
    ret.addPropertyResult('sourceEntity', 'SourceEntity', CfnAnalysisAnalysisSourceEntityPropertyFromCloudFormation(properties.SourceEntity));
    ret.addPropertyResult('errors', 'Errors', properties.Errors != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalysisAnalysisErrorPropertyFromCloudFormation)(properties.Errors) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? CfnAnalysisParametersPropertyFromCloudFormation(properties.Parameters) : undefined);
    ret.addPropertyResult('permissions', 'Permissions', properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalysisResourcePermissionPropertyFromCloudFormation)(properties.Permissions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('themeArn', 'ThemeArn', properties.ThemeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThemeArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::QuickSight::Analysis`
 *
 * Creates an analysis in Amazon QuickSight.
 *
 * @cloudformationResource AWS::QuickSight::Analysis
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html
 */
export class CfnAnalysis extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::Analysis";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnalysis {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAnalysisPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAnalysis(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the analysis.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     *
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The ARNs of the datasets of the analysis.
     * @cloudformationAttribute DataSetArns
     */
    public readonly attrDataSetArns: string[];

    /**
     * The time that the analysis was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     *
     * @cloudformationAttribute Sheets
     */
    public readonly attrSheets: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The ID for the analysis that you're creating. This ID displays in the URL of the analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-analysisid
     */
    public analysisId: string;

    /**
     * The ID of the AWS account where you are creating an analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-awsaccountid
     */
    public awsAccountId: string;

    /**
     * A source entity to use for the analysis that you're creating. This metadata structure contains details that describe a source template and one or more datasets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-sourceentity
     */
    public sourceEntity: CfnAnalysis.AnalysisSourceEntityProperty | cdk.IResolvable;

    /**
     * `AWS::QuickSight::Analysis.Errors`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-errors
     */
    public errors: Array<CfnAnalysis.AnalysisErrorProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A descriptive name for the analysis that you're creating. This name displays for the analysis in the Amazon QuickSight console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-name
     */
    public name: string | undefined;

    /**
     * The parameter names and override values that you want to use. An analysis can have any parameter type, and some parameters might accept multiple values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-parameters
     */
    public parameters: CfnAnalysis.ParametersProperty | cdk.IResolvable | undefined;

    /**
     * A structure that describes the principals and the resource-level permissions on an analysis. You can use the `Permissions` structure to grant permissions by providing a list of AWS Identity and Access Management (IAM) action information for each principal listed by Amazon Resource Name (ARN).
     *
     * To specify no permissions, omit `Permissions` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-permissions
     */
    public permissions: Array<CfnAnalysis.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The ARN for the theme to apply to the analysis that you're creating. To see the theme in the Amazon QuickSight console, make sure that you have access to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-themearn
     */
    public themeArn: string | undefined;

    /**
     * Create a new `AWS::QuickSight::Analysis`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnalysisProps) {
        super(scope, id, { type: CfnAnalysis.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'analysisId', this);
        cdk.requireProperty(props, 'awsAccountId', this);
        cdk.requireProperty(props, 'sourceEntity', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrDataSetArns = cdk.Token.asList(this.getAtt('DataSetArns', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrSheets = this.getAtt('Sheets', cdk.ResolutionTypeHint.STRING);
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.analysisId = props.analysisId;
        this.awsAccountId = props.awsAccountId;
        this.sourceEntity = props.sourceEntity;
        this.errors = props.errors;
        this.name = props.name;
        this.parameters = props.parameters;
        this.permissions = props.permissions;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QuickSight::Analysis", props.tags, { tagPropertyName: 'tags' });
        this.themeArn = props.themeArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnalysis.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            analysisId: this.analysisId,
            awsAccountId: this.awsAccountId,
            sourceEntity: this.sourceEntity,
            errors: this.errors,
            name: this.name,
            parameters: this.parameters,
            permissions: this.permissions,
            tags: this.tags.renderTags(),
            themeArn: this.themeArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAnalysisPropsToCloudFormation(props);
    }
}

export namespace CfnAnalysis {
    /**
     * Analysis error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysiserror.html
     */
    export interface AnalysisErrorProperty {
        /**
         * The message associated with the analysis error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysiserror.html#cfn-quicksight-analysis-analysiserror-message
         */
        readonly message?: string;
        /**
         * The type of the analysis error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysiserror.html#cfn-quicksight-analysis-analysiserror-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AnalysisErrorProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisErrorProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_AnalysisErrorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('message', cdk.validateString)(properties.message));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "AnalysisErrorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.AnalysisError` resource
 *
 * @param properties - the TypeScript properties of a `AnalysisErrorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.AnalysisError` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisAnalysisErrorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_AnalysisErrorPropertyValidator(properties).assertSuccess();
    return {
        Message: cdk.stringToCloudFormation(properties.message),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnAnalysisAnalysisErrorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.AnalysisErrorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.AnalysisErrorProperty>();
    ret.addPropertyResult('message', 'Message', properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * The source entity of an analysis.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourceentity.html
     */
    export interface AnalysisSourceEntityProperty {
        /**
         * The source template for the source entity of the analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourceentity.html#cfn-quicksight-analysis-analysissourceentity-sourcetemplate
         */
        readonly sourceTemplate?: CfnAnalysis.AnalysisSourceTemplateProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AnalysisSourceEntityProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisSourceEntityProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_AnalysisSourceEntityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sourceTemplate', CfnAnalysis_AnalysisSourceTemplatePropertyValidator)(properties.sourceTemplate));
    return errors.wrap('supplied properties not correct for "AnalysisSourceEntityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.AnalysisSourceEntity` resource
 *
 * @param properties - the TypeScript properties of a `AnalysisSourceEntityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.AnalysisSourceEntity` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisAnalysisSourceEntityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_AnalysisSourceEntityPropertyValidator(properties).assertSuccess();
    return {
        SourceTemplate: cfnAnalysisAnalysisSourceTemplatePropertyToCloudFormation(properties.sourceTemplate),
    };
}

// @ts-ignore TS6133
function CfnAnalysisAnalysisSourceEntityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.AnalysisSourceEntityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.AnalysisSourceEntityProperty>();
    ret.addPropertyResult('sourceTemplate', 'SourceTemplate', properties.SourceTemplate != null ? CfnAnalysisAnalysisSourceTemplatePropertyFromCloudFormation(properties.SourceTemplate) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * The source template of an analysis.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourcetemplate.html
     */
    export interface AnalysisSourceTemplateProperty {
        /**
         * The Amazon Resource Name (ARN) of the source template of an analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourcetemplate.html#cfn-quicksight-analysis-analysissourcetemplate-arn
         */
        readonly arn: string;
        /**
         * The dataset references of the source template of an analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourcetemplate.html#cfn-quicksight-analysis-analysissourcetemplate-datasetreferences
         */
        readonly dataSetReferences: Array<CfnAnalysis.DataSetReferenceProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AnalysisSourceTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `AnalysisSourceTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_AnalysisSourceTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('dataSetReferences', cdk.requiredValidator)(properties.dataSetReferences));
    errors.collect(cdk.propertyValidator('dataSetReferences', cdk.listValidator(CfnAnalysis_DataSetReferencePropertyValidator))(properties.dataSetReferences));
    return errors.wrap('supplied properties not correct for "AnalysisSourceTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.AnalysisSourceTemplate` resource
 *
 * @param properties - the TypeScript properties of a `AnalysisSourceTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.AnalysisSourceTemplate` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisAnalysisSourceTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_AnalysisSourceTemplatePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        DataSetReferences: cdk.listMapper(cfnAnalysisDataSetReferencePropertyToCloudFormation)(properties.dataSetReferences),
    };
}

// @ts-ignore TS6133
function CfnAnalysisAnalysisSourceTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.AnalysisSourceTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.AnalysisSourceTemplateProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('dataSetReferences', 'DataSetReferences', cfn_parse.FromCloudFormation.getArray(CfnAnalysisDataSetReferencePropertyFromCloudFormation)(properties.DataSetReferences));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * Dataset reference.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datasetreference.html
     */
    export interface DataSetReferenceProperty {
        /**
         * Dataset Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datasetreference.html#cfn-quicksight-analysis-datasetreference-datasetarn
         */
        readonly dataSetArn: string;
        /**
         * Dataset placeholder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datasetreference.html#cfn-quicksight-analysis-datasetreference-datasetplaceholder
         */
        readonly dataSetPlaceholder: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataSetReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `DataSetReferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_DataSetReferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataSetArn', cdk.requiredValidator)(properties.dataSetArn));
    errors.collect(cdk.propertyValidator('dataSetArn', cdk.validateString)(properties.dataSetArn));
    errors.collect(cdk.propertyValidator('dataSetPlaceholder', cdk.requiredValidator)(properties.dataSetPlaceholder));
    errors.collect(cdk.propertyValidator('dataSetPlaceholder', cdk.validateString)(properties.dataSetPlaceholder));
    return errors.wrap('supplied properties not correct for "DataSetReferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.DataSetReference` resource
 *
 * @param properties - the TypeScript properties of a `DataSetReferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.DataSetReference` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisDataSetReferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_DataSetReferencePropertyValidator(properties).assertSuccess();
    return {
        DataSetArn: cdk.stringToCloudFormation(properties.dataSetArn),
        DataSetPlaceholder: cdk.stringToCloudFormation(properties.dataSetPlaceholder),
    };
}

// @ts-ignore TS6133
function CfnAnalysisDataSetReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.DataSetReferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.DataSetReferenceProperty>();
    ret.addPropertyResult('dataSetArn', 'DataSetArn', cfn_parse.FromCloudFormation.getString(properties.DataSetArn));
    ret.addPropertyResult('dataSetPlaceholder', 'DataSetPlaceholder', cfn_parse.FromCloudFormation.getString(properties.DataSetPlaceholder));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * A date-time parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datetimeparameter.html
     */
    export interface DateTimeParameterProperty {
        /**
         * A display name for the date-time parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datetimeparameter.html#cfn-quicksight-analysis-datetimeparameter-name
         */
        readonly name: string;
        /**
         * The values for the date-time parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datetimeparameter.html#cfn-quicksight-analysis-datetimeparameter-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `DateTimeParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DateTimeParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_DateTimeParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "DateTimeParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.DateTimeParameter` resource
 *
 * @param properties - the TypeScript properties of a `DateTimeParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.DateTimeParameter` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisDateTimeParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_DateTimeParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnAnalysisDateTimeParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.DateTimeParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.DateTimeParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * A decimal parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-decimalparameter.html
     */
    export interface DecimalParameterProperty {
        /**
         * A display name for the decimal parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-decimalparameter.html#cfn-quicksight-analysis-decimalparameter-name
         */
        readonly name: string;
        /**
         * The values for the decimal parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-decimalparameter.html#cfn-quicksight-analysis-decimalparameter-values
         */
        readonly values: number[] | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DecimalParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DecimalParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_DecimalParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateNumber))(properties.values));
    return errors.wrap('supplied properties not correct for "DecimalParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.DecimalParameter` resource
 *
 * @param properties - the TypeScript properties of a `DecimalParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.DecimalParameter` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisDecimalParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_DecimalParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.numberToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnAnalysisDecimalParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.DecimalParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.DecimalParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * An integer parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-integerparameter.html
     */
    export interface IntegerParameterProperty {
        /**
         * The name of the integer parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-integerparameter.html#cfn-quicksight-analysis-integerparameter-name
         */
        readonly name: string;
        /**
         * The values for the integer parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-integerparameter.html#cfn-quicksight-analysis-integerparameter-values
         */
        readonly values: number[] | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IntegerParameterProperty`
 *
 * @param properties - the TypeScript properties of a `IntegerParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_IntegerParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateNumber))(properties.values));
    return errors.wrap('supplied properties not correct for "IntegerParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.IntegerParameter` resource
 *
 * @param properties - the TypeScript properties of a `IntegerParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.IntegerParameter` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisIntegerParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_IntegerParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.numberToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnAnalysisIntegerParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.IntegerParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.IntegerParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * A list of Amazon QuickSight parameters and the list's override values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html
     */
    export interface ParametersProperty {
        /**
         * The parameters that have a data type of date-time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html#cfn-quicksight-analysis-parameters-datetimeparameters
         */
        readonly dateTimeParameters?: Array<CfnAnalysis.DateTimeParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of decimal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html#cfn-quicksight-analysis-parameters-decimalparameters
         */
        readonly decimalParameters?: Array<CfnAnalysis.DecimalParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html#cfn-quicksight-analysis-parameters-integerparameters
         */
        readonly integerParameters?: Array<CfnAnalysis.IntegerParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html#cfn-quicksight-analysis-parameters-stringparameters
         */
        readonly stringParameters?: Array<CfnAnalysis.StringParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_ParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dateTimeParameters', cdk.listValidator(CfnAnalysis_DateTimeParameterPropertyValidator))(properties.dateTimeParameters));
    errors.collect(cdk.propertyValidator('decimalParameters', cdk.listValidator(CfnAnalysis_DecimalParameterPropertyValidator))(properties.decimalParameters));
    errors.collect(cdk.propertyValidator('integerParameters', cdk.listValidator(CfnAnalysis_IntegerParameterPropertyValidator))(properties.integerParameters));
    errors.collect(cdk.propertyValidator('stringParameters', cdk.listValidator(CfnAnalysis_StringParameterPropertyValidator))(properties.stringParameters));
    return errors.wrap('supplied properties not correct for "ParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.Parameters` resource
 *
 * @param properties - the TypeScript properties of a `ParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.Parameters` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_ParametersPropertyValidator(properties).assertSuccess();
    return {
        DateTimeParameters: cdk.listMapper(cfnAnalysisDateTimeParameterPropertyToCloudFormation)(properties.dateTimeParameters),
        DecimalParameters: cdk.listMapper(cfnAnalysisDecimalParameterPropertyToCloudFormation)(properties.decimalParameters),
        IntegerParameters: cdk.listMapper(cfnAnalysisIntegerParameterPropertyToCloudFormation)(properties.integerParameters),
        StringParameters: cdk.listMapper(cfnAnalysisStringParameterPropertyToCloudFormation)(properties.stringParameters),
    };
}

// @ts-ignore TS6133
function CfnAnalysisParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.ParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.ParametersProperty>();
    ret.addPropertyResult('dateTimeParameters', 'DateTimeParameters', properties.DateTimeParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalysisDateTimeParameterPropertyFromCloudFormation)(properties.DateTimeParameters) : undefined);
    ret.addPropertyResult('decimalParameters', 'DecimalParameters', properties.DecimalParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalysisDecimalParameterPropertyFromCloudFormation)(properties.DecimalParameters) : undefined);
    ret.addPropertyResult('integerParameters', 'IntegerParameters', properties.IntegerParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalysisIntegerParameterPropertyFromCloudFormation)(properties.IntegerParameters) : undefined);
    ret.addPropertyResult('stringParameters', 'StringParameters', properties.StringParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalysisStringParameterPropertyFromCloudFormation)(properties.StringParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-resourcepermission.html
     */
    export interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-resourcepermission.html#cfn-quicksight-analysis-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-resourcepermission.html#cfn-quicksight-analysis-resourcepermission-principal
         */
        readonly principal: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourcePermissionProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_ResourcePermissionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(cdk.validateString))(properties.actions));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    return errors.wrap('supplied properties not correct for "ResourcePermissionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.ResourcePermission` resource
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.ResourcePermission` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisResourcePermissionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_ResourcePermissionPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
        Principal: cdk.stringToCloudFormation(properties.principal),
    };
}

// @ts-ignore TS6133
function CfnAnalysisResourcePermissionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.ResourcePermissionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.ResourcePermissionProperty>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getStringArray(properties.Actions));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * A *sheet* , which is an object that contains a set of visuals that are viewed together on one page in Amazon QuickSight. Every analysis and dashboard contains at least one sheet. Each sheet contains at least one visualization widget, for example a chart, pivot table, or narrative insight. Sheets can be associated with other components, such as controls, filters, and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-sheet.html
     */
    export interface SheetProperty {
        /**
         * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-sheet.html#cfn-quicksight-analysis-sheet-name
         */
        readonly name?: string;
        /**
         * The unique identifier associated with a sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-sheet.html#cfn-quicksight-analysis-sheet-sheetid
         */
        readonly sheetId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SheetProperty`
 *
 * @param properties - the TypeScript properties of a `SheetProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_SheetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sheetId', cdk.validateString)(properties.sheetId));
    return errors.wrap('supplied properties not correct for "SheetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.Sheet` resource
 *
 * @param properties - the TypeScript properties of a `SheetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.Sheet` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisSheetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_SheetPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SheetId: cdk.stringToCloudFormation(properties.sheetId),
    };
}

// @ts-ignore TS6133
function CfnAnalysisSheetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.SheetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.SheetProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sheetId', 'SheetId', properties.SheetId != null ? cfn_parse.FromCloudFormation.getString(properties.SheetId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalysis {
    /**
     * A string parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-stringparameter.html
     */
    export interface StringParameterProperty {
        /**
         * A display name for a string parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-stringparameter.html#cfn-quicksight-analysis-stringparameter-name
         */
        readonly name: string;
        /**
         * The values of a string parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-stringparameter.html#cfn-quicksight-analysis-stringparameter-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `StringParameterProperty`
 *
 * @param properties - the TypeScript properties of a `StringParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalysis_StringParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "StringParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.StringParameter` resource
 *
 * @param properties - the TypeScript properties of a `StringParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Analysis.StringParameter` resource.
 */
// @ts-ignore TS6133
function cfnAnalysisStringParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalysis_StringParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnAnalysisStringParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalysis.StringParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalysis.StringParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDashboard`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html
 */
export interface CfnDashboardProps {

    /**
     * The ID of the AWS account where you want to create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-awsaccountid
     */
    readonly awsAccountId: string;

    /**
     * The ID for the dashboard, also added to the IAM policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-dashboardid
     */
    readonly dashboardId: string;

    /**
     * The entity that you are using as a source when you create the dashboard. In `SourceEntity` , you specify the type of object that you want to use. You can only create a dashboard from a template, so you use a `SourceTemplate` entity. If you need to create a dashboard from an analysis, first convert the analysis to a template by using the `CreateTemplate` API operation. For `SourceTemplate` , specify the Amazon Resource Name (ARN) of the source template. The `SourceTemplate` ARN can contain any AWS account; and any QuickSight-supported AWS Region .
     *
     * Use the `DataSetReferences` entity within `SourceTemplate` to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-sourceentity
     */
    readonly sourceEntity: CfnDashboard.DashboardSourceEntityProperty | cdk.IResolvable;

    /**
     * Options for publishing the dashboard when you create it:
     *
     * - `AvailabilityStatus` for `AdHocFilteringOption` - This status can be either `ENABLED` or `DISABLED` . When this is set to `DISABLED` , Amazon QuickSight disables the left filter pane on the published dashboard, which can be used for ad hoc (one-time) filtering. This option is `ENABLED` by default.
     * - `AvailabilityStatus` for `ExportToCSVOption` - This status can be either `ENABLED` or `DISABLED` . The visual option to export data to .CSV format isn't enabled when this is set to `DISABLED` . This option is `ENABLED` by default.
     * - `VisibilityState` for `SheetControlsOption` - This visibility state can be either `COLLAPSED` or `EXPANDED` . This option is `COLLAPSED` by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-dashboardpublishoptions
     */
    readonly dashboardPublishOptions?: CfnDashboard.DashboardPublishOptionsProperty | cdk.IResolvable;

    /**
     * The display name of the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-name
     */
    readonly name?: string;

    /**
     * The parameters for the creation of the dashboard, which you want to use to override the default settings. A dashboard can have any type of parameters, and some parameters might accept multiple values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-parameters
     */
    readonly parameters?: CfnDashboard.ParametersProperty | cdk.IResolvable;

    /**
     * A structure that contains the permissions of the dashboard. You can use this structure for granting permissions by providing a list of IAM action information for each principal ARN.
     *
     * To specify no permissions, omit the permissions list.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-permissions
     */
    readonly permissions?: Array<CfnDashboard.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The Amazon Resource Name (ARN) of the theme that is being used for this dashboard. If you add a value for this field, it overrides the value that is used in the source entity. The theme ARN must exist in the same AWS account where you create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-themearn
     */
    readonly themeArn?: string;

    /**
     * A description for the first version of the dashboard being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-versiondescription
     */
    readonly versionDescription?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDashboardProps`
 *
 * @param properties - the TypeScript properties of a `CfnDashboardProps`
 *
 * @returns the result of the validation.
 */
function CfnDashboardPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.requiredValidator)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.validateString)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('dashboardId', cdk.requiredValidator)(properties.dashboardId));
    errors.collect(cdk.propertyValidator('dashboardId', cdk.validateString)(properties.dashboardId));
    errors.collect(cdk.propertyValidator('dashboardPublishOptions', CfnDashboard_DashboardPublishOptionsPropertyValidator)(properties.dashboardPublishOptions));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parameters', CfnDashboard_ParametersPropertyValidator)(properties.parameters));
    errors.collect(cdk.propertyValidator('permissions', cdk.listValidator(CfnDashboard_ResourcePermissionPropertyValidator))(properties.permissions));
    errors.collect(cdk.propertyValidator('sourceEntity', cdk.requiredValidator)(properties.sourceEntity));
    errors.collect(cdk.propertyValidator('sourceEntity', CfnDashboard_DashboardSourceEntityPropertyValidator)(properties.sourceEntity));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('themeArn', cdk.validateString)(properties.themeArn));
    errors.collect(cdk.propertyValidator('versionDescription', cdk.validateString)(properties.versionDescription));
    return errors.wrap('supplied properties not correct for "CfnDashboardProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard` resource
 *
 * @param properties - the TypeScript properties of a `CfnDashboardProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard` resource.
 */
// @ts-ignore TS6133
function cfnDashboardPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboardPropsValidator(properties).assertSuccess();
    return {
        AwsAccountId: cdk.stringToCloudFormation(properties.awsAccountId),
        DashboardId: cdk.stringToCloudFormation(properties.dashboardId),
        SourceEntity: cfnDashboardDashboardSourceEntityPropertyToCloudFormation(properties.sourceEntity),
        DashboardPublishOptions: cfnDashboardDashboardPublishOptionsPropertyToCloudFormation(properties.dashboardPublishOptions),
        Name: cdk.stringToCloudFormation(properties.name),
        Parameters: cfnDashboardParametersPropertyToCloudFormation(properties.parameters),
        Permissions: cdk.listMapper(cfnDashboardResourcePermissionPropertyToCloudFormation)(properties.permissions),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        ThemeArn: cdk.stringToCloudFormation(properties.themeArn),
        VersionDescription: cdk.stringToCloudFormation(properties.versionDescription),
    };
}

// @ts-ignore TS6133
function CfnDashboardPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboardProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboardProps>();
    ret.addPropertyResult('awsAccountId', 'AwsAccountId', cfn_parse.FromCloudFormation.getString(properties.AwsAccountId));
    ret.addPropertyResult('dashboardId', 'DashboardId', cfn_parse.FromCloudFormation.getString(properties.DashboardId));
    ret.addPropertyResult('sourceEntity', 'SourceEntity', CfnDashboardDashboardSourceEntityPropertyFromCloudFormation(properties.SourceEntity));
    ret.addPropertyResult('dashboardPublishOptions', 'DashboardPublishOptions', properties.DashboardPublishOptions != null ? CfnDashboardDashboardPublishOptionsPropertyFromCloudFormation(properties.DashboardPublishOptions) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? CfnDashboardParametersPropertyFromCloudFormation(properties.Parameters) : undefined);
    ret.addPropertyResult('permissions', 'Permissions', properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(CfnDashboardResourcePermissionPropertyFromCloudFormation)(properties.Permissions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('themeArn', 'ThemeArn', properties.ThemeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThemeArn) : undefined);
    ret.addPropertyResult('versionDescription', 'VersionDescription', properties.VersionDescription != null ? cfn_parse.FromCloudFormation.getString(properties.VersionDescription) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::QuickSight::Dashboard`
 *
 * Creates a dashboard from a template. To first create a template, see the `CreateTemplate` API operation.
 *
 * A dashboard is an entity in Amazon QuickSight that identifies Amazon QuickSight reports, created from analyses. You can share Amazon QuickSight dashboards. With the right permissions, you can create scheduled email reports from them. If you have the correct permissions, you can create a dashboard from a template that exists in a different AWS account .
 *
 * @cloudformationResource AWS::QuickSight::Dashboard
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html
 */
export class CfnDashboard extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::Dashboard";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDashboard {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDashboardPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDashboard(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the dashboard.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The time this dashboard version was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The time that the dashboard was last published.
     * @cloudformationAttribute LastPublishedTime
     */
    public readonly attrLastPublishedTime: string;

    /**
     * The time that the dashboard was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     *
     * @cloudformationAttribute Version.Arn
     */
    public readonly attrVersionArn: string;

    /**
     *
     * @cloudformationAttribute Version.CreatedTime
     */
    public readonly attrVersionCreatedTime: string;

    /**
     *
     * @cloudformationAttribute Version.DataSetArns
     */
    public readonly attrVersionDataSetArns: string[];

    /**
     *
     * @cloudformationAttribute Version.Description
     */
    public readonly attrVersionDescription: string;

    /**
     *
     * @cloudformationAttribute Version.Errors
     */
    public readonly attrVersionErrors: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Version.Sheets
     */
    public readonly attrVersionSheets: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Version.SourceEntityArn
     */
    public readonly attrVersionSourceEntityArn: string;

    /**
     *
     * @cloudformationAttribute Version.Status
     */
    public readonly attrVersionStatus: string;

    /**
     *
     * @cloudformationAttribute Version.ThemeArn
     */
    public readonly attrVersionThemeArn: string;

    /**
     *
     * @cloudformationAttribute Version.VersionNumber
     */
    public readonly attrVersionVersionNumber: cdk.IResolvable;

    /**
     * The ID of the AWS account where you want to create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-awsaccountid
     */
    public awsAccountId: string;

    /**
     * The ID for the dashboard, also added to the IAM policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-dashboardid
     */
    public dashboardId: string;

    /**
     * The entity that you are using as a source when you create the dashboard. In `SourceEntity` , you specify the type of object that you want to use. You can only create a dashboard from a template, so you use a `SourceTemplate` entity. If you need to create a dashboard from an analysis, first convert the analysis to a template by using the `CreateTemplate` API operation. For `SourceTemplate` , specify the Amazon Resource Name (ARN) of the source template. The `SourceTemplate` ARN can contain any AWS account; and any QuickSight-supported AWS Region .
     *
     * Use the `DataSetReferences` entity within `SourceTemplate` to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-sourceentity
     */
    public sourceEntity: CfnDashboard.DashboardSourceEntityProperty | cdk.IResolvable;

    /**
     * Options for publishing the dashboard when you create it:
     *
     * - `AvailabilityStatus` for `AdHocFilteringOption` - This status can be either `ENABLED` or `DISABLED` . When this is set to `DISABLED` , Amazon QuickSight disables the left filter pane on the published dashboard, which can be used for ad hoc (one-time) filtering. This option is `ENABLED` by default.
     * - `AvailabilityStatus` for `ExportToCSVOption` - This status can be either `ENABLED` or `DISABLED` . The visual option to export data to .CSV format isn't enabled when this is set to `DISABLED` . This option is `ENABLED` by default.
     * - `VisibilityState` for `SheetControlsOption` - This visibility state can be either `COLLAPSED` or `EXPANDED` . This option is `COLLAPSED` by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-dashboardpublishoptions
     */
    public dashboardPublishOptions: CfnDashboard.DashboardPublishOptionsProperty | cdk.IResolvable | undefined;

    /**
     * The display name of the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-name
     */
    public name: string | undefined;

    /**
     * The parameters for the creation of the dashboard, which you want to use to override the default settings. A dashboard can have any type of parameters, and some parameters might accept multiple values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-parameters
     */
    public parameters: CfnDashboard.ParametersProperty | cdk.IResolvable | undefined;

    /**
     * A structure that contains the permissions of the dashboard. You can use this structure for granting permissions by providing a list of IAM action information for each principal ARN.
     *
     * To specify no permissions, omit the permissions list.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-permissions
     */
    public permissions: Array<CfnDashboard.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The Amazon Resource Name (ARN) of the theme that is being used for this dashboard. If you add a value for this field, it overrides the value that is used in the source entity. The theme ARN must exist in the same AWS account where you create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-themearn
     */
    public themeArn: string | undefined;

    /**
     * A description for the first version of the dashboard being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-versiondescription
     */
    public versionDescription: string | undefined;

    /**
     * Create a new `AWS::QuickSight::Dashboard`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDashboardProps) {
        super(scope, id, { type: CfnDashboard.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'awsAccountId', this);
        cdk.requireProperty(props, 'dashboardId', this);
        cdk.requireProperty(props, 'sourceEntity', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastPublishedTime = cdk.Token.asString(this.getAtt('LastPublishedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrVersionArn = cdk.Token.asString(this.getAtt('Version.Arn', cdk.ResolutionTypeHint.STRING));
        this.attrVersionCreatedTime = cdk.Token.asString(this.getAtt('Version.CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrVersionDataSetArns = cdk.Token.asList(this.getAtt('Version.DataSetArns', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrVersionDescription = cdk.Token.asString(this.getAtt('Version.Description', cdk.ResolutionTypeHint.STRING));
        this.attrVersionErrors = this.getAtt('Version.Errors', cdk.ResolutionTypeHint.STRING);
        this.attrVersionSheets = this.getAtt('Version.Sheets', cdk.ResolutionTypeHint.STRING);
        this.attrVersionSourceEntityArn = cdk.Token.asString(this.getAtt('Version.SourceEntityArn', cdk.ResolutionTypeHint.STRING));
        this.attrVersionStatus = cdk.Token.asString(this.getAtt('Version.Status', cdk.ResolutionTypeHint.STRING));
        this.attrVersionThemeArn = cdk.Token.asString(this.getAtt('Version.ThemeArn', cdk.ResolutionTypeHint.STRING));
        this.attrVersionVersionNumber = this.getAtt('Version.VersionNumber', cdk.ResolutionTypeHint.STRING);

        this.awsAccountId = props.awsAccountId;
        this.dashboardId = props.dashboardId;
        this.sourceEntity = props.sourceEntity;
        this.dashboardPublishOptions = props.dashboardPublishOptions;
        this.name = props.name;
        this.parameters = props.parameters;
        this.permissions = props.permissions;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QuickSight::Dashboard", props.tags, { tagPropertyName: 'tags' });
        this.themeArn = props.themeArn;
        this.versionDescription = props.versionDescription;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDashboard.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            awsAccountId: this.awsAccountId,
            dashboardId: this.dashboardId,
            sourceEntity: this.sourceEntity,
            dashboardPublishOptions: this.dashboardPublishOptions,
            name: this.name,
            parameters: this.parameters,
            permissions: this.permissions,
            tags: this.tags.renderTags(),
            themeArn: this.themeArn,
            versionDescription: this.versionDescription,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDashboardPropsToCloudFormation(props);
    }
}

export namespace CfnDashboard {
    /**
     * An ad hoc (one-time) filtering option.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-adhocfilteringoption.html
     */
    export interface AdHocFilteringOptionProperty {
        /**
         * Availability status.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-adhocfilteringoption.html#cfn-quicksight-dashboard-adhocfilteringoption-availabilitystatus
         */
        readonly availabilityStatus?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AdHocFilteringOptionProperty`
 *
 * @param properties - the TypeScript properties of a `AdHocFilteringOptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_AdHocFilteringOptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityStatus', cdk.validateString)(properties.availabilityStatus));
    return errors.wrap('supplied properties not correct for "AdHocFilteringOptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.AdHocFilteringOption` resource
 *
 * @param properties - the TypeScript properties of a `AdHocFilteringOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.AdHocFilteringOption` resource.
 */
// @ts-ignore TS6133
function cfnDashboardAdHocFilteringOptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_AdHocFilteringOptionPropertyValidator(properties).assertSuccess();
    return {
        AvailabilityStatus: cdk.stringToCloudFormation(properties.availabilityStatus),
    };
}

// @ts-ignore TS6133
function CfnDashboardAdHocFilteringOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.AdHocFilteringOptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.AdHocFilteringOptionProperty>();
    ret.addPropertyResult('availabilityStatus', 'AvailabilityStatus', properties.AvailabilityStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityStatus) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Dashboard error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboarderror.html
     */
    export interface DashboardErrorProperty {
        /**
         * Message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboarderror.html#cfn-quicksight-dashboard-dashboarderror-message
         */
        readonly message?: string;
        /**
         * Type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboarderror.html#cfn-quicksight-dashboard-dashboarderror-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DashboardErrorProperty`
 *
 * @param properties - the TypeScript properties of a `DashboardErrorProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_DashboardErrorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('message', cdk.validateString)(properties.message));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "DashboardErrorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardError` resource
 *
 * @param properties - the TypeScript properties of a `DashboardErrorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardError` resource.
 */
// @ts-ignore TS6133
function cfnDashboardDashboardErrorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_DashboardErrorPropertyValidator(properties).assertSuccess();
    return {
        Message: cdk.stringToCloudFormation(properties.message),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnDashboardDashboardErrorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.DashboardErrorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.DashboardErrorProperty>();
    ret.addPropertyResult('message', 'Message', properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Dashboard publish options.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardpublishoptions.html
     */
    export interface DashboardPublishOptionsProperty {
        /**
         * Ad hoc (one-time) filtering option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardpublishoptions.html#cfn-quicksight-dashboard-dashboardpublishoptions-adhocfilteringoption
         */
        readonly adHocFilteringOption?: CfnDashboard.AdHocFilteringOptionProperty | cdk.IResolvable;
        /**
         * Export to .csv option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardpublishoptions.html#cfn-quicksight-dashboard-dashboardpublishoptions-exporttocsvoption
         */
        readonly exportToCsvOption?: CfnDashboard.ExportToCSVOptionProperty | cdk.IResolvable;
        /**
         * Sheet controls option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardpublishoptions.html#cfn-quicksight-dashboard-dashboardpublishoptions-sheetcontrolsoption
         */
        readonly sheetControlsOption?: CfnDashboard.SheetControlsOptionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DashboardPublishOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DashboardPublishOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_DashboardPublishOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adHocFilteringOption', CfnDashboard_AdHocFilteringOptionPropertyValidator)(properties.adHocFilteringOption));
    errors.collect(cdk.propertyValidator('exportToCsvOption', CfnDashboard_ExportToCSVOptionPropertyValidator)(properties.exportToCsvOption));
    errors.collect(cdk.propertyValidator('sheetControlsOption', CfnDashboard_SheetControlsOptionPropertyValidator)(properties.sheetControlsOption));
    return errors.wrap('supplied properties not correct for "DashboardPublishOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardPublishOptions` resource
 *
 * @param properties - the TypeScript properties of a `DashboardPublishOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardPublishOptions` resource.
 */
// @ts-ignore TS6133
function cfnDashboardDashboardPublishOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_DashboardPublishOptionsPropertyValidator(properties).assertSuccess();
    return {
        AdHocFilteringOption: cfnDashboardAdHocFilteringOptionPropertyToCloudFormation(properties.adHocFilteringOption),
        ExportToCSVOption: cfnDashboardExportToCSVOptionPropertyToCloudFormation(properties.exportToCsvOption),
        SheetControlsOption: cfnDashboardSheetControlsOptionPropertyToCloudFormation(properties.sheetControlsOption),
    };
}

// @ts-ignore TS6133
function CfnDashboardDashboardPublishOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.DashboardPublishOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.DashboardPublishOptionsProperty>();
    ret.addPropertyResult('adHocFilteringOption', 'AdHocFilteringOption', properties.AdHocFilteringOption != null ? CfnDashboardAdHocFilteringOptionPropertyFromCloudFormation(properties.AdHocFilteringOption) : undefined);
    ret.addPropertyResult('exportToCsvOption', 'ExportToCSVOption', properties.ExportToCSVOption != null ? CfnDashboardExportToCSVOptionPropertyFromCloudFormation(properties.ExportToCSVOption) : undefined);
    ret.addPropertyResult('sheetControlsOption', 'SheetControlsOption', properties.SheetControlsOption != null ? CfnDashboardSheetControlsOptionPropertyFromCloudFormation(properties.SheetControlsOption) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Dashboard source entity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourceentity.html
     */
    export interface DashboardSourceEntityProperty {
        /**
         * Source template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourceentity.html#cfn-quicksight-dashboard-dashboardsourceentity-sourcetemplate
         */
        readonly sourceTemplate?: CfnDashboard.DashboardSourceTemplateProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DashboardSourceEntityProperty`
 *
 * @param properties - the TypeScript properties of a `DashboardSourceEntityProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_DashboardSourceEntityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sourceTemplate', CfnDashboard_DashboardSourceTemplatePropertyValidator)(properties.sourceTemplate));
    return errors.wrap('supplied properties not correct for "DashboardSourceEntityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardSourceEntity` resource
 *
 * @param properties - the TypeScript properties of a `DashboardSourceEntityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardSourceEntity` resource.
 */
// @ts-ignore TS6133
function cfnDashboardDashboardSourceEntityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_DashboardSourceEntityPropertyValidator(properties).assertSuccess();
    return {
        SourceTemplate: cfnDashboardDashboardSourceTemplatePropertyToCloudFormation(properties.sourceTemplate),
    };
}

// @ts-ignore TS6133
function CfnDashboardDashboardSourceEntityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.DashboardSourceEntityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.DashboardSourceEntityProperty>();
    ret.addPropertyResult('sourceTemplate', 'SourceTemplate', properties.SourceTemplate != null ? CfnDashboardDashboardSourceTemplatePropertyFromCloudFormation(properties.SourceTemplate) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Dashboard source template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourcetemplate.html
     */
    export interface DashboardSourceTemplateProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourcetemplate.html#cfn-quicksight-dashboard-dashboardsourcetemplate-arn
         */
        readonly arn: string;
        /**
         * Dataset references.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourcetemplate.html#cfn-quicksight-dashboard-dashboardsourcetemplate-datasetreferences
         */
        readonly dataSetReferences: Array<CfnDashboard.DataSetReferenceProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DashboardSourceTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `DashboardSourceTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_DashboardSourceTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('dataSetReferences', cdk.requiredValidator)(properties.dataSetReferences));
    errors.collect(cdk.propertyValidator('dataSetReferences', cdk.listValidator(CfnDashboard_DataSetReferencePropertyValidator))(properties.dataSetReferences));
    return errors.wrap('supplied properties not correct for "DashboardSourceTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardSourceTemplate` resource
 *
 * @param properties - the TypeScript properties of a `DashboardSourceTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardSourceTemplate` resource.
 */
// @ts-ignore TS6133
function cfnDashboardDashboardSourceTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_DashboardSourceTemplatePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        DataSetReferences: cdk.listMapper(cfnDashboardDataSetReferencePropertyToCloudFormation)(properties.dataSetReferences),
    };
}

// @ts-ignore TS6133
function CfnDashboardDashboardSourceTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.DashboardSourceTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.DashboardSourceTemplateProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('dataSetReferences', 'DataSetReferences', cfn_parse.FromCloudFormation.getArray(CfnDashboardDataSetReferencePropertyFromCloudFormation)(properties.DataSetReferences));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Dashboard version.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html
     */
    export interface DashboardVersionProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-arn
         */
        readonly arn?: string;
        /**
         * The time that this dashboard version was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-createdtime
         */
        readonly createdTime?: string;
        /**
         * The Amazon Resource Numbers (ARNs) for the datasets that are associated with this version of the dashboard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-datasetarns
         */
        readonly dataSetArns?: string[];
        /**
         * Description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-description
         */
        readonly description?: string;
        /**
         * Errors associated with this dashboard version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-errors
         */
        readonly errors?: Array<CfnDashboard.DashboardErrorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of the associated sheets with the unique identifier and name of each sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-sheets
         */
        readonly sheets?: Array<CfnDashboard.SheetProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Source entity ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-sourceentityarn
         */
        readonly sourceEntityArn?: string;
        /**
         * The HTTP status of the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-status
         */
        readonly status?: string;
        /**
         * The ARN of the theme associated with a version of the dashboard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-themearn
         */
        readonly themeArn?: string;
        /**
         * Version number for this version of the dashboard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-versionnumber
         */
        readonly versionNumber?: number;
    }
}

/**
 * Determine whether the given properties match those of a `DashboardVersionProperty`
 *
 * @param properties - the TypeScript properties of a `DashboardVersionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_DashboardVersionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('dataSetArns', cdk.listValidator(cdk.validateString))(properties.dataSetArns));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('errors', cdk.listValidator(CfnDashboard_DashboardErrorPropertyValidator))(properties.errors));
    errors.collect(cdk.propertyValidator('sheets', cdk.listValidator(CfnDashboard_SheetPropertyValidator))(properties.sheets));
    errors.collect(cdk.propertyValidator('sourceEntityArn', cdk.validateString)(properties.sourceEntityArn));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('themeArn', cdk.validateString)(properties.themeArn));
    errors.collect(cdk.propertyValidator('versionNumber', cdk.validateNumber)(properties.versionNumber));
    return errors.wrap('supplied properties not correct for "DashboardVersionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardVersion` resource
 *
 * @param properties - the TypeScript properties of a `DashboardVersionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DashboardVersion` resource.
 */
// @ts-ignore TS6133
function cfnDashboardDashboardVersionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_DashboardVersionPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        DataSetArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.dataSetArns),
        Description: cdk.stringToCloudFormation(properties.description),
        Errors: cdk.listMapper(cfnDashboardDashboardErrorPropertyToCloudFormation)(properties.errors),
        Sheets: cdk.listMapper(cfnDashboardSheetPropertyToCloudFormation)(properties.sheets),
        SourceEntityArn: cdk.stringToCloudFormation(properties.sourceEntityArn),
        Status: cdk.stringToCloudFormation(properties.status),
        ThemeArn: cdk.stringToCloudFormation(properties.themeArn),
        VersionNumber: cdk.numberToCloudFormation(properties.versionNumber),
    };
}

// @ts-ignore TS6133
function CfnDashboardDashboardVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.DashboardVersionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.DashboardVersionProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('dataSetArns', 'DataSetArns', properties.DataSetArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DataSetArns) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('errors', 'Errors', properties.Errors != null ? cfn_parse.FromCloudFormation.getArray(CfnDashboardDashboardErrorPropertyFromCloudFormation)(properties.Errors) : undefined);
    ret.addPropertyResult('sheets', 'Sheets', properties.Sheets != null ? cfn_parse.FromCloudFormation.getArray(CfnDashboardSheetPropertyFromCloudFormation)(properties.Sheets) : undefined);
    ret.addPropertyResult('sourceEntityArn', 'SourceEntityArn', properties.SourceEntityArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceEntityArn) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('themeArn', 'ThemeArn', properties.ThemeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThemeArn) : undefined);
    ret.addPropertyResult('versionNumber', 'VersionNumber', properties.VersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.VersionNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Dataset reference.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datasetreference.html
     */
    export interface DataSetReferenceProperty {
        /**
         * Dataset Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datasetreference.html#cfn-quicksight-dashboard-datasetreference-datasetarn
         */
        readonly dataSetArn: string;
        /**
         * Dataset placeholder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datasetreference.html#cfn-quicksight-dashboard-datasetreference-datasetplaceholder
         */
        readonly dataSetPlaceholder: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataSetReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `DataSetReferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_DataSetReferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataSetArn', cdk.requiredValidator)(properties.dataSetArn));
    errors.collect(cdk.propertyValidator('dataSetArn', cdk.validateString)(properties.dataSetArn));
    errors.collect(cdk.propertyValidator('dataSetPlaceholder', cdk.requiredValidator)(properties.dataSetPlaceholder));
    errors.collect(cdk.propertyValidator('dataSetPlaceholder', cdk.validateString)(properties.dataSetPlaceholder));
    return errors.wrap('supplied properties not correct for "DataSetReferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DataSetReference` resource
 *
 * @param properties - the TypeScript properties of a `DataSetReferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DataSetReference` resource.
 */
// @ts-ignore TS6133
function cfnDashboardDataSetReferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_DataSetReferencePropertyValidator(properties).assertSuccess();
    return {
        DataSetArn: cdk.stringToCloudFormation(properties.dataSetArn),
        DataSetPlaceholder: cdk.stringToCloudFormation(properties.dataSetPlaceholder),
    };
}

// @ts-ignore TS6133
function CfnDashboardDataSetReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.DataSetReferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.DataSetReferenceProperty>();
    ret.addPropertyResult('dataSetArn', 'DataSetArn', cfn_parse.FromCloudFormation.getString(properties.DataSetArn));
    ret.addPropertyResult('dataSetPlaceholder', 'DataSetPlaceholder', cfn_parse.FromCloudFormation.getString(properties.DataSetPlaceholder));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * A date-time parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datetimeparameter.html
     */
    export interface DateTimeParameterProperty {
        /**
         * A display name for the date-time parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datetimeparameter.html#cfn-quicksight-dashboard-datetimeparameter-name
         */
        readonly name: string;
        /**
         * The values for the date-time parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datetimeparameter.html#cfn-quicksight-dashboard-datetimeparameter-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `DateTimeParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DateTimeParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_DateTimeParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "DateTimeParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DateTimeParameter` resource
 *
 * @param properties - the TypeScript properties of a `DateTimeParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DateTimeParameter` resource.
 */
// @ts-ignore TS6133
function cfnDashboardDateTimeParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_DateTimeParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnDashboardDateTimeParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.DateTimeParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.DateTimeParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * A decimal parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-decimalparameter.html
     */
    export interface DecimalParameterProperty {
        /**
         * A display name for the decimal parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-decimalparameter.html#cfn-quicksight-dashboard-decimalparameter-name
         */
        readonly name: string;
        /**
         * The values for the decimal parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-decimalparameter.html#cfn-quicksight-dashboard-decimalparameter-values
         */
        readonly values: number[] | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DecimalParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DecimalParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_DecimalParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateNumber))(properties.values));
    return errors.wrap('supplied properties not correct for "DecimalParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DecimalParameter` resource
 *
 * @param properties - the TypeScript properties of a `DecimalParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.DecimalParameter` resource.
 */
// @ts-ignore TS6133
function cfnDashboardDecimalParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_DecimalParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.numberToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnDashboardDecimalParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.DecimalParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.DecimalParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Export to .csv option.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-exporttocsvoption.html
     */
    export interface ExportToCSVOptionProperty {
        /**
         * Availability status.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-exporttocsvoption.html#cfn-quicksight-dashboard-exporttocsvoption-availabilitystatus
         */
        readonly availabilityStatus?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ExportToCSVOptionProperty`
 *
 * @param properties - the TypeScript properties of a `ExportToCSVOptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_ExportToCSVOptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityStatus', cdk.validateString)(properties.availabilityStatus));
    return errors.wrap('supplied properties not correct for "ExportToCSVOptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.ExportToCSVOption` resource
 *
 * @param properties - the TypeScript properties of a `ExportToCSVOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.ExportToCSVOption` resource.
 */
// @ts-ignore TS6133
function cfnDashboardExportToCSVOptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_ExportToCSVOptionPropertyValidator(properties).assertSuccess();
    return {
        AvailabilityStatus: cdk.stringToCloudFormation(properties.availabilityStatus),
    };
}

// @ts-ignore TS6133
function CfnDashboardExportToCSVOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.ExportToCSVOptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.ExportToCSVOptionProperty>();
    ret.addPropertyResult('availabilityStatus', 'AvailabilityStatus', properties.AvailabilityStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityStatus) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * An integer parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-integerparameter.html
     */
    export interface IntegerParameterProperty {
        /**
         * The name of the integer parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-integerparameter.html#cfn-quicksight-dashboard-integerparameter-name
         */
        readonly name: string;
        /**
         * The values for the integer parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-integerparameter.html#cfn-quicksight-dashboard-integerparameter-values
         */
        readonly values: number[] | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IntegerParameterProperty`
 *
 * @param properties - the TypeScript properties of a `IntegerParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_IntegerParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateNumber))(properties.values));
    return errors.wrap('supplied properties not correct for "IntegerParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.IntegerParameter` resource
 *
 * @param properties - the TypeScript properties of a `IntegerParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.IntegerParameter` resource.
 */
// @ts-ignore TS6133
function cfnDashboardIntegerParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_IntegerParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.numberToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnDashboardIntegerParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.IntegerParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.IntegerParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * A list of Amazon QuickSight parameters and the list's override values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html
     */
    export interface ParametersProperty {
        /**
         * The parameters that have a data type of date-time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html#cfn-quicksight-dashboard-parameters-datetimeparameters
         */
        readonly dateTimeParameters?: Array<CfnDashboard.DateTimeParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of decimal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html#cfn-quicksight-dashboard-parameters-decimalparameters
         */
        readonly decimalParameters?: Array<CfnDashboard.DecimalParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html#cfn-quicksight-dashboard-parameters-integerparameters
         */
        readonly integerParameters?: Array<CfnDashboard.IntegerParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html#cfn-quicksight-dashboard-parameters-stringparameters
         */
        readonly stringParameters?: Array<CfnDashboard.StringParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_ParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dateTimeParameters', cdk.listValidator(CfnDashboard_DateTimeParameterPropertyValidator))(properties.dateTimeParameters));
    errors.collect(cdk.propertyValidator('decimalParameters', cdk.listValidator(CfnDashboard_DecimalParameterPropertyValidator))(properties.decimalParameters));
    errors.collect(cdk.propertyValidator('integerParameters', cdk.listValidator(CfnDashboard_IntegerParameterPropertyValidator))(properties.integerParameters));
    errors.collect(cdk.propertyValidator('stringParameters', cdk.listValidator(CfnDashboard_StringParameterPropertyValidator))(properties.stringParameters));
    return errors.wrap('supplied properties not correct for "ParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.Parameters` resource
 *
 * @param properties - the TypeScript properties of a `ParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.Parameters` resource.
 */
// @ts-ignore TS6133
function cfnDashboardParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_ParametersPropertyValidator(properties).assertSuccess();
    return {
        DateTimeParameters: cdk.listMapper(cfnDashboardDateTimeParameterPropertyToCloudFormation)(properties.dateTimeParameters),
        DecimalParameters: cdk.listMapper(cfnDashboardDecimalParameterPropertyToCloudFormation)(properties.decimalParameters),
        IntegerParameters: cdk.listMapper(cfnDashboardIntegerParameterPropertyToCloudFormation)(properties.integerParameters),
        StringParameters: cdk.listMapper(cfnDashboardStringParameterPropertyToCloudFormation)(properties.stringParameters),
    };
}

// @ts-ignore TS6133
function CfnDashboardParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.ParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.ParametersProperty>();
    ret.addPropertyResult('dateTimeParameters', 'DateTimeParameters', properties.DateTimeParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDashboardDateTimeParameterPropertyFromCloudFormation)(properties.DateTimeParameters) : undefined);
    ret.addPropertyResult('decimalParameters', 'DecimalParameters', properties.DecimalParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDashboardDecimalParameterPropertyFromCloudFormation)(properties.DecimalParameters) : undefined);
    ret.addPropertyResult('integerParameters', 'IntegerParameters', properties.IntegerParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDashboardIntegerParameterPropertyFromCloudFormation)(properties.IntegerParameters) : undefined);
    ret.addPropertyResult('stringParameters', 'StringParameters', properties.StringParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDashboardStringParameterPropertyFromCloudFormation)(properties.StringParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-resourcepermission.html
     */
    export interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-resourcepermission.html#cfn-quicksight-dashboard-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-resourcepermission.html#cfn-quicksight-dashboard-resourcepermission-principal
         */
        readonly principal: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourcePermissionProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_ResourcePermissionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(cdk.validateString))(properties.actions));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    return errors.wrap('supplied properties not correct for "ResourcePermissionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.ResourcePermission` resource
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.ResourcePermission` resource.
 */
// @ts-ignore TS6133
function cfnDashboardResourcePermissionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_ResourcePermissionPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
        Principal: cdk.stringToCloudFormation(properties.principal),
    };
}

// @ts-ignore TS6133
function CfnDashboardResourcePermissionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.ResourcePermissionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.ResourcePermissionProperty>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getStringArray(properties.Actions));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * A *sheet* , which is an object that contains a set of visuals that are viewed together on one page in Amazon QuickSight. Every analysis and dashboard contains at least one sheet. Each sheet contains at least one visualization widget, for example a chart, pivot table, or narrative insight. Sheets can be associated with other components, such as controls, filters, and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheet.html
     */
    export interface SheetProperty {
        /**
         * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheet.html#cfn-quicksight-dashboard-sheet-name
         */
        readonly name?: string;
        /**
         * The unique identifier associated with a sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheet.html#cfn-quicksight-dashboard-sheet-sheetid
         */
        readonly sheetId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SheetProperty`
 *
 * @param properties - the TypeScript properties of a `SheetProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_SheetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sheetId', cdk.validateString)(properties.sheetId));
    return errors.wrap('supplied properties not correct for "SheetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.Sheet` resource
 *
 * @param properties - the TypeScript properties of a `SheetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.Sheet` resource.
 */
// @ts-ignore TS6133
function cfnDashboardSheetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_SheetPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SheetId: cdk.stringToCloudFormation(properties.sheetId),
    };
}

// @ts-ignore TS6133
function CfnDashboardSheetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.SheetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.SheetProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sheetId', 'SheetId', properties.SheetId != null ? cfn_parse.FromCloudFormation.getString(properties.SheetId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * Sheet controls option.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheetcontrolsoption.html
     */
    export interface SheetControlsOptionProperty {
        /**
         * Visibility state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheetcontrolsoption.html#cfn-quicksight-dashboard-sheetcontrolsoption-visibilitystate
         */
        readonly visibilityState?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SheetControlsOptionProperty`
 *
 * @param properties - the TypeScript properties of a `SheetControlsOptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_SheetControlsOptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('visibilityState', cdk.validateString)(properties.visibilityState));
    return errors.wrap('supplied properties not correct for "SheetControlsOptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.SheetControlsOption` resource
 *
 * @param properties - the TypeScript properties of a `SheetControlsOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.SheetControlsOption` resource.
 */
// @ts-ignore TS6133
function cfnDashboardSheetControlsOptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_SheetControlsOptionPropertyValidator(properties).assertSuccess();
    return {
        VisibilityState: cdk.stringToCloudFormation(properties.visibilityState),
    };
}

// @ts-ignore TS6133
function CfnDashboardSheetControlsOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.SheetControlsOptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.SheetControlsOptionProperty>();
    ret.addPropertyResult('visibilityState', 'VisibilityState', properties.VisibilityState != null ? cfn_parse.FromCloudFormation.getString(properties.VisibilityState) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDashboard {
    /**
     * A string parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-stringparameter.html
     */
    export interface StringParameterProperty {
        /**
         * A display name for a string parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-stringparameter.html#cfn-quicksight-dashboard-stringparameter-name
         */
        readonly name: string;
        /**
         * The values of a string parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-stringparameter.html#cfn-quicksight-dashboard-stringparameter-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `StringParameterProperty`
 *
 * @param properties - the TypeScript properties of a `StringParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnDashboard_StringParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "StringParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.StringParameter` resource
 *
 * @param properties - the TypeScript properties of a `StringParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Dashboard.StringParameter` resource.
 */
// @ts-ignore TS6133
function cfnDashboardStringParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboard_StringParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnDashboardStringParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboard.StringParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboard.StringParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDataSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html
 */
export interface CfnDataSetProps {

    /**
     * The AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-awsaccountid
     */
    readonly awsAccountId?: string;

    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-columngroups
     */
    readonly columnGroups?: Array<CfnDataSet.ColumnGroupProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A set of one or more definitions of a `ColumnLevelPermissionRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-columnlevelpermissionrules
     */
    readonly columnLevelPermissionRules?: Array<CfnDataSet.ColumnLevelPermissionRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An ID for the dataset that you want to create. This ID is unique per AWS Region for each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-datasetid
     */
    readonly dataSetId?: string;

    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-datasetusageconfiguration
     */
    readonly dataSetUsageConfiguration?: CfnDataSet.DataSetUsageConfigurationProperty | cdk.IResolvable;

    /**
     * The folder that contains fields and nested subfolders for your dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-fieldfolders
     */
    readonly fieldFolders?: { [key: string]: (CfnDataSet.FieldFolderProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * Indicates whether you want to import the data into SPICE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-importmode
     */
    readonly importMode?: string;

    /**
     * The wait policy to use when creating or updating a Dataset. The default is to wait for SPICE ingestion to finish with timeout of 36 hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-ingestionwaitpolicy
     */
    readonly ingestionWaitPolicy?: CfnDataSet.IngestionWaitPolicyProperty | cdk.IResolvable;

    /**
     * Configures the combination and transformation of the data from the physical tables.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-logicaltablemap
     */
    readonly logicalTableMap?: { [key: string]: (CfnDataSet.LogicalTableProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The display name for the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-name
     */
    readonly name?: string;

    /**
     * A list of resource permissions on the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-permissions
     */
    readonly permissions?: Array<CfnDataSet.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Declares the physical tables that are available in the underlying data sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-physicaltablemap
     */
    readonly physicalTableMap?: { [key: string]: (CfnDataSet.PhysicalTableProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The row-level security configuration for the data that you want to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset
     */
    readonly rowLevelPermissionDataSet?: CfnDataSet.RowLevelPermissionDataSetProperty | cdk.IResolvable;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDataSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataSetProps`
 *
 * @returns the result of the validation.
 */
function CfnDataSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.validateString)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('columnGroups', cdk.listValidator(CfnDataSet_ColumnGroupPropertyValidator))(properties.columnGroups));
    errors.collect(cdk.propertyValidator('columnLevelPermissionRules', cdk.listValidator(CfnDataSet_ColumnLevelPermissionRulePropertyValidator))(properties.columnLevelPermissionRules));
    errors.collect(cdk.propertyValidator('dataSetId', cdk.validateString)(properties.dataSetId));
    errors.collect(cdk.propertyValidator('dataSetUsageConfiguration', CfnDataSet_DataSetUsageConfigurationPropertyValidator)(properties.dataSetUsageConfiguration));
    errors.collect(cdk.propertyValidator('fieldFolders', cdk.hashValidator(CfnDataSet_FieldFolderPropertyValidator))(properties.fieldFolders));
    errors.collect(cdk.propertyValidator('importMode', cdk.validateString)(properties.importMode));
    errors.collect(cdk.propertyValidator('ingestionWaitPolicy', CfnDataSet_IngestionWaitPolicyPropertyValidator)(properties.ingestionWaitPolicy));
    errors.collect(cdk.propertyValidator('logicalTableMap', cdk.hashValidator(CfnDataSet_LogicalTablePropertyValidator))(properties.logicalTableMap));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('permissions', cdk.listValidator(CfnDataSet_ResourcePermissionPropertyValidator))(properties.permissions));
    errors.collect(cdk.propertyValidator('physicalTableMap', cdk.hashValidator(CfnDataSet_PhysicalTablePropertyValidator))(properties.physicalTableMap));
    errors.collect(cdk.propertyValidator('rowLevelPermissionDataSet', CfnDataSet_RowLevelPermissionDataSetPropertyValidator)(properties.rowLevelPermissionDataSet));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDataSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet` resource.
 */
// @ts-ignore TS6133
function cfnDataSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSetPropsValidator(properties).assertSuccess();
    return {
        AwsAccountId: cdk.stringToCloudFormation(properties.awsAccountId),
        ColumnGroups: cdk.listMapper(cfnDataSetColumnGroupPropertyToCloudFormation)(properties.columnGroups),
        ColumnLevelPermissionRules: cdk.listMapper(cfnDataSetColumnLevelPermissionRulePropertyToCloudFormation)(properties.columnLevelPermissionRules),
        DataSetId: cdk.stringToCloudFormation(properties.dataSetId),
        DataSetUsageConfiguration: cfnDataSetDataSetUsageConfigurationPropertyToCloudFormation(properties.dataSetUsageConfiguration),
        FieldFolders: cdk.hashMapper(cfnDataSetFieldFolderPropertyToCloudFormation)(properties.fieldFolders),
        ImportMode: cdk.stringToCloudFormation(properties.importMode),
        IngestionWaitPolicy: cfnDataSetIngestionWaitPolicyPropertyToCloudFormation(properties.ingestionWaitPolicy),
        LogicalTableMap: cdk.hashMapper(cfnDataSetLogicalTablePropertyToCloudFormation)(properties.logicalTableMap),
        Name: cdk.stringToCloudFormation(properties.name),
        Permissions: cdk.listMapper(cfnDataSetResourcePermissionPropertyToCloudFormation)(properties.permissions),
        PhysicalTableMap: cdk.hashMapper(cfnDataSetPhysicalTablePropertyToCloudFormation)(properties.physicalTableMap),
        RowLevelPermissionDataSet: cfnDataSetRowLevelPermissionDataSetPropertyToCloudFormation(properties.rowLevelPermissionDataSet),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDataSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSetProps>();
    ret.addPropertyResult('awsAccountId', 'AwsAccountId', properties.AwsAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AwsAccountId) : undefined);
    ret.addPropertyResult('columnGroups', 'ColumnGroups', properties.ColumnGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSetColumnGroupPropertyFromCloudFormation)(properties.ColumnGroups) : undefined);
    ret.addPropertyResult('columnLevelPermissionRules', 'ColumnLevelPermissionRules', properties.ColumnLevelPermissionRules != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSetColumnLevelPermissionRulePropertyFromCloudFormation)(properties.ColumnLevelPermissionRules) : undefined);
    ret.addPropertyResult('dataSetId', 'DataSetId', properties.DataSetId != null ? cfn_parse.FromCloudFormation.getString(properties.DataSetId) : undefined);
    ret.addPropertyResult('dataSetUsageConfiguration', 'DataSetUsageConfiguration', properties.DataSetUsageConfiguration != null ? CfnDataSetDataSetUsageConfigurationPropertyFromCloudFormation(properties.DataSetUsageConfiguration) : undefined);
    ret.addPropertyResult('fieldFolders', 'FieldFolders', properties.FieldFolders != null ? cfn_parse.FromCloudFormation.getMap(CfnDataSetFieldFolderPropertyFromCloudFormation)(properties.FieldFolders) : undefined);
    ret.addPropertyResult('importMode', 'ImportMode', properties.ImportMode != null ? cfn_parse.FromCloudFormation.getString(properties.ImportMode) : undefined);
    ret.addPropertyResult('ingestionWaitPolicy', 'IngestionWaitPolicy', properties.IngestionWaitPolicy != null ? CfnDataSetIngestionWaitPolicyPropertyFromCloudFormation(properties.IngestionWaitPolicy) : undefined);
    ret.addPropertyResult('logicalTableMap', 'LogicalTableMap', properties.LogicalTableMap != null ? cfn_parse.FromCloudFormation.getMap(CfnDataSetLogicalTablePropertyFromCloudFormation)(properties.LogicalTableMap) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('permissions', 'Permissions', properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSetResourcePermissionPropertyFromCloudFormation)(properties.Permissions) : undefined);
    ret.addPropertyResult('physicalTableMap', 'PhysicalTableMap', properties.PhysicalTableMap != null ? cfn_parse.FromCloudFormation.getMap(CfnDataSetPhysicalTablePropertyFromCloudFormation)(properties.PhysicalTableMap) : undefined);
    ret.addPropertyResult('rowLevelPermissionDataSet', 'RowLevelPermissionDataSet', properties.RowLevelPermissionDataSet != null ? CfnDataSetRowLevelPermissionDataSetPropertyFromCloudFormation(properties.RowLevelPermissionDataSet) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::QuickSight::DataSet`
 *
 * Creates a dataset. This operation doesn't support datasets that include uploaded files as a source.
 *
 * @cloudformationResource AWS::QuickSight::DataSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html
 */
export class CfnDataSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::DataSet";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataSet {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDataSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the dataset.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     *
     * @cloudformationAttribute ConsumedSpiceCapacityInBytes
     */
    public readonly attrConsumedSpiceCapacityInBytes: cdk.IResolvable;

    /**
     * The time this dataset version was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The time this dataset version was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     *
     * @cloudformationAttribute OutputColumns
     */
    public readonly attrOutputColumns: cdk.IResolvable;

    /**
     * The AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-awsaccountid
     */
    public awsAccountId: string | undefined;

    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-columngroups
     */
    public columnGroups: Array<CfnDataSet.ColumnGroupProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A set of one or more definitions of a `ColumnLevelPermissionRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-columnlevelpermissionrules
     */
    public columnLevelPermissionRules: Array<CfnDataSet.ColumnLevelPermissionRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * An ID for the dataset that you want to create. This ID is unique per AWS Region for each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-datasetid
     */
    public dataSetId: string | undefined;

    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-datasetusageconfiguration
     */
    public dataSetUsageConfiguration: CfnDataSet.DataSetUsageConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The folder that contains fields and nested subfolders for your dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-fieldfolders
     */
    public fieldFolders: { [key: string]: (CfnDataSet.FieldFolderProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * Indicates whether you want to import the data into SPICE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-importmode
     */
    public importMode: string | undefined;

    /**
     * The wait policy to use when creating or updating a Dataset. The default is to wait for SPICE ingestion to finish with timeout of 36 hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-ingestionwaitpolicy
     */
    public ingestionWaitPolicy: CfnDataSet.IngestionWaitPolicyProperty | cdk.IResolvable | undefined;

    /**
     * Configures the combination and transformation of the data from the physical tables.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-logicaltablemap
     */
    public logicalTableMap: { [key: string]: (CfnDataSet.LogicalTableProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * The display name for the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-name
     */
    public name: string | undefined;

    /**
     * A list of resource permissions on the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-permissions
     */
    public permissions: Array<CfnDataSet.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Declares the physical tables that are available in the underlying data sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-physicaltablemap
     */
    public physicalTableMap: { [key: string]: (CfnDataSet.PhysicalTableProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * The row-level security configuration for the data that you want to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset
     */
    public rowLevelPermissionDataSet: CfnDataSet.RowLevelPermissionDataSetProperty | cdk.IResolvable | undefined;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::QuickSight::DataSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataSetProps = {}) {
        super(scope, id, { type: CfnDataSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrConsumedSpiceCapacityInBytes = this.getAtt('ConsumedSpiceCapacityInBytes', cdk.ResolutionTypeHint.STRING);
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrOutputColumns = this.getAtt('OutputColumns', cdk.ResolutionTypeHint.STRING);

        this.awsAccountId = props.awsAccountId;
        this.columnGroups = props.columnGroups;
        this.columnLevelPermissionRules = props.columnLevelPermissionRules;
        this.dataSetId = props.dataSetId;
        this.dataSetUsageConfiguration = props.dataSetUsageConfiguration;
        this.fieldFolders = props.fieldFolders;
        this.importMode = props.importMode;
        this.ingestionWaitPolicy = props.ingestionWaitPolicy;
        this.logicalTableMap = props.logicalTableMap;
        this.name = props.name;
        this.permissions = props.permissions;
        this.physicalTableMap = props.physicalTableMap;
        this.rowLevelPermissionDataSet = props.rowLevelPermissionDataSet;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QuickSight::DataSet", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            awsAccountId: this.awsAccountId,
            columnGroups: this.columnGroups,
            columnLevelPermissionRules: this.columnLevelPermissionRules,
            dataSetId: this.dataSetId,
            dataSetUsageConfiguration: this.dataSetUsageConfiguration,
            fieldFolders: this.fieldFolders,
            importMode: this.importMode,
            ingestionWaitPolicy: this.ingestionWaitPolicy,
            logicalTableMap: this.logicalTableMap,
            name: this.name,
            permissions: this.permissions,
            physicalTableMap: this.physicalTableMap,
            rowLevelPermissionDataSet: this.rowLevelPermissionDataSet,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataSetPropsToCloudFormation(props);
    }
}

export namespace CfnDataSet {
    /**
     * A calculated column for a dataset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-calculatedcolumn.html
     */
    export interface CalculatedColumnProperty {
        /**
         * A unique ID to identify a calculated column. During a dataset update, if the column ID of a calculated column matches that of an existing calculated column, Amazon QuickSight preserves the existing calculated column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-calculatedcolumn.html#cfn-quicksight-dataset-calculatedcolumn-columnid
         */
        readonly columnId: string;
        /**
         * Column name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-calculatedcolumn.html#cfn-quicksight-dataset-calculatedcolumn-columnname
         */
        readonly columnName: string;
        /**
         * An expression that defines the calculated column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-calculatedcolumn.html#cfn-quicksight-dataset-calculatedcolumn-expression
         */
        readonly expression: string;
    }
}

/**
 * Determine whether the given properties match those of a `CalculatedColumnProperty`
 *
 * @param properties - the TypeScript properties of a `CalculatedColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_CalculatedColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnId', cdk.requiredValidator)(properties.columnId));
    errors.collect(cdk.propertyValidator('columnId', cdk.validateString)(properties.columnId));
    errors.collect(cdk.propertyValidator('columnName', cdk.requiredValidator)(properties.columnName));
    errors.collect(cdk.propertyValidator('columnName', cdk.validateString)(properties.columnName));
    errors.collect(cdk.propertyValidator('expression', cdk.requiredValidator)(properties.expression));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    return errors.wrap('supplied properties not correct for "CalculatedColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.CalculatedColumn` resource
 *
 * @param properties - the TypeScript properties of a `CalculatedColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.CalculatedColumn` resource.
 */
// @ts-ignore TS6133
function cfnDataSetCalculatedColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_CalculatedColumnPropertyValidator(properties).assertSuccess();
    return {
        ColumnId: cdk.stringToCloudFormation(properties.columnId),
        ColumnName: cdk.stringToCloudFormation(properties.columnName),
        Expression: cdk.stringToCloudFormation(properties.expression),
    };
}

// @ts-ignore TS6133
function CfnDataSetCalculatedColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.CalculatedColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.CalculatedColumnProperty>();
    ret.addPropertyResult('columnId', 'ColumnId', cfn_parse.FromCloudFormation.getString(properties.ColumnId));
    ret.addPropertyResult('columnName', 'ColumnName', cfn_parse.FromCloudFormation.getString(properties.ColumnName));
    ret.addPropertyResult('expression', 'Expression', cfn_parse.FromCloudFormation.getString(properties.Expression));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A transform operation that casts a column to a different type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-castcolumntypeoperation.html
     */
    export interface CastColumnTypeOperationProperty {
        /**
         * Column name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-castcolumntypeoperation.html#cfn-quicksight-dataset-castcolumntypeoperation-columnname
         */
        readonly columnName: string;
        /**
         * When casting a column from string to datetime type, you can supply a string in a format supported by Amazon QuickSight to denote the source data format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-castcolumntypeoperation.html#cfn-quicksight-dataset-castcolumntypeoperation-format
         */
        readonly format?: string;
        /**
         * New column data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-castcolumntypeoperation.html#cfn-quicksight-dataset-castcolumntypeoperation-newcolumntype
         */
        readonly newColumnType: string;
    }
}

/**
 * Determine whether the given properties match those of a `CastColumnTypeOperationProperty`
 *
 * @param properties - the TypeScript properties of a `CastColumnTypeOperationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_CastColumnTypeOperationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnName', cdk.requiredValidator)(properties.columnName));
    errors.collect(cdk.propertyValidator('columnName', cdk.validateString)(properties.columnName));
    errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
    errors.collect(cdk.propertyValidator('newColumnType', cdk.requiredValidator)(properties.newColumnType));
    errors.collect(cdk.propertyValidator('newColumnType', cdk.validateString)(properties.newColumnType));
    return errors.wrap('supplied properties not correct for "CastColumnTypeOperationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.CastColumnTypeOperation` resource
 *
 * @param properties - the TypeScript properties of a `CastColumnTypeOperationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.CastColumnTypeOperation` resource.
 */
// @ts-ignore TS6133
function cfnDataSetCastColumnTypeOperationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_CastColumnTypeOperationPropertyValidator(properties).assertSuccess();
    return {
        ColumnName: cdk.stringToCloudFormation(properties.columnName),
        Format: cdk.stringToCloudFormation(properties.format),
        NewColumnType: cdk.stringToCloudFormation(properties.newColumnType),
    };
}

// @ts-ignore TS6133
function CfnDataSetCastColumnTypeOperationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.CastColumnTypeOperationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.CastColumnTypeOperationProperty>();
    ret.addPropertyResult('columnName', 'ColumnName', cfn_parse.FromCloudFormation.getString(properties.ColumnName));
    ret.addPropertyResult('format', 'Format', properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined);
    ret.addPropertyResult('newColumnType', 'NewColumnType', cfn_parse.FromCloudFormation.getString(properties.NewColumnType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Metadata that contains a description for a column.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columndescription.html
     */
    export interface ColumnDescriptionProperty {
        /**
         * The text of a description for a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columndescription.html#cfn-quicksight-dataset-columndescription-text
         */
        readonly text?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ColumnDescriptionProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnDescriptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_ColumnDescriptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('text', cdk.validateString)(properties.text));
    return errors.wrap('supplied properties not correct for "ColumnDescriptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ColumnDescription` resource
 *
 * @param properties - the TypeScript properties of a `ColumnDescriptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ColumnDescription` resource.
 */
// @ts-ignore TS6133
function cfnDataSetColumnDescriptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_ColumnDescriptionPropertyValidator(properties).assertSuccess();
    return {
        Text: cdk.stringToCloudFormation(properties.text),
    };
}

// @ts-ignore TS6133
function CfnDataSetColumnDescriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.ColumnDescriptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.ColumnDescriptionProperty>();
    ret.addPropertyResult('text', 'Text', properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columngroup.html
     */
    export interface ColumnGroupProperty {
        /**
         * Geospatial column group that denotes a hierarchy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columngroup.html#cfn-quicksight-dataset-columngroup-geospatialcolumngroup
         */
        readonly geoSpatialColumnGroup?: CfnDataSet.GeoSpatialColumnGroupProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ColumnGroupProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_ColumnGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('geoSpatialColumnGroup', CfnDataSet_GeoSpatialColumnGroupPropertyValidator)(properties.geoSpatialColumnGroup));
    return errors.wrap('supplied properties not correct for "ColumnGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ColumnGroup` resource
 *
 * @param properties - the TypeScript properties of a `ColumnGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ColumnGroup` resource.
 */
// @ts-ignore TS6133
function cfnDataSetColumnGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_ColumnGroupPropertyValidator(properties).assertSuccess();
    return {
        GeoSpatialColumnGroup: cfnDataSetGeoSpatialColumnGroupPropertyToCloudFormation(properties.geoSpatialColumnGroup),
    };
}

// @ts-ignore TS6133
function CfnDataSetColumnGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.ColumnGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.ColumnGroupProperty>();
    ret.addPropertyResult('geoSpatialColumnGroup', 'GeoSpatialColumnGroup', properties.GeoSpatialColumnGroup != null ? CfnDataSetGeoSpatialColumnGroupPropertyFromCloudFormation(properties.GeoSpatialColumnGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A rule defined to grant access on one or more restricted columns. Each dataset can have multiple rules. To create a restricted column, you add it to one or more rules. Each rule must contain at least one column and at least one user or group. To be able to see a restricted column, a user or group needs to be added to a rule for that column.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columnlevelpermissionrule.html
     */
    export interface ColumnLevelPermissionRuleProperty {
        /**
         * An array of column names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columnlevelpermissionrule.html#cfn-quicksight-dataset-columnlevelpermissionrule-columnnames
         */
        readonly columnNames?: string[];
        /**
         * An array of Amazon Resource Names (ARNs) for Amazon QuickSight users or groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columnlevelpermissionrule.html#cfn-quicksight-dataset-columnlevelpermissionrule-principals
         */
        readonly principals?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ColumnLevelPermissionRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnLevelPermissionRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_ColumnLevelPermissionRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnNames', cdk.listValidator(cdk.validateString))(properties.columnNames));
    errors.collect(cdk.propertyValidator('principals', cdk.listValidator(cdk.validateString))(properties.principals));
    return errors.wrap('supplied properties not correct for "ColumnLevelPermissionRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ColumnLevelPermissionRule` resource
 *
 * @param properties - the TypeScript properties of a `ColumnLevelPermissionRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ColumnLevelPermissionRule` resource.
 */
// @ts-ignore TS6133
function cfnDataSetColumnLevelPermissionRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_ColumnLevelPermissionRulePropertyValidator(properties).assertSuccess();
    return {
        ColumnNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
        Principals: cdk.listMapper(cdk.stringToCloudFormation)(properties.principals),
    };
}

// @ts-ignore TS6133
function CfnDataSetColumnLevelPermissionRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.ColumnLevelPermissionRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.ColumnLevelPermissionRuleProperty>();
    ret.addPropertyResult('columnNames', 'ColumnNames', properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ColumnNames) : undefined);
    ret.addPropertyResult('principals', 'Principals', properties.Principals != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Principals) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A tag for a column in a `[TagColumnOperation](https://docs.aws.amazon.com/quicksight/latest/APIReference/API_TagColumnOperation.html)` structure. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columntag.html
     */
    export interface ColumnTagProperty {
        /**
         * A description for a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columntag.html#cfn-quicksight-dataset-columntag-columndescription
         */
        readonly columnDescription?: CfnDataSet.ColumnDescriptionProperty | cdk.IResolvable;
        /**
         * A geospatial role for a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columntag.html#cfn-quicksight-dataset-columntag-columngeographicrole
         */
        readonly columnGeographicRole?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ColumnTagProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_ColumnTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnDescription', CfnDataSet_ColumnDescriptionPropertyValidator)(properties.columnDescription));
    errors.collect(cdk.propertyValidator('columnGeographicRole', cdk.validateString)(properties.columnGeographicRole));
    return errors.wrap('supplied properties not correct for "ColumnTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ColumnTag` resource
 *
 * @param properties - the TypeScript properties of a `ColumnTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ColumnTag` resource.
 */
// @ts-ignore TS6133
function cfnDataSetColumnTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_ColumnTagPropertyValidator(properties).assertSuccess();
    return {
        ColumnDescription: cfnDataSetColumnDescriptionPropertyToCloudFormation(properties.columnDescription),
        ColumnGeographicRole: cdk.stringToCloudFormation(properties.columnGeographicRole),
    };
}

// @ts-ignore TS6133
function CfnDataSetColumnTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.ColumnTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.ColumnTagProperty>();
    ret.addPropertyResult('columnDescription', 'ColumnDescription', properties.ColumnDescription != null ? CfnDataSetColumnDescriptionPropertyFromCloudFormation(properties.ColumnDescription) : undefined);
    ret.addPropertyResult('columnGeographicRole', 'ColumnGeographicRole', properties.ColumnGeographicRole != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnGeographicRole) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A transform operation that creates calculated columns. Columns created in one such operation form a lexical closure.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-createcolumnsoperation.html
     */
    export interface CreateColumnsOperationProperty {
        /**
         * Calculated columns to create.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-createcolumnsoperation.html#cfn-quicksight-dataset-createcolumnsoperation-columns
         */
        readonly columns: Array<CfnDataSet.CalculatedColumnProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CreateColumnsOperationProperty`
 *
 * @param properties - the TypeScript properties of a `CreateColumnsOperationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_CreateColumnsOperationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columns', cdk.requiredValidator)(properties.columns));
    errors.collect(cdk.propertyValidator('columns', cdk.listValidator(CfnDataSet_CalculatedColumnPropertyValidator))(properties.columns));
    return errors.wrap('supplied properties not correct for "CreateColumnsOperationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.CreateColumnsOperation` resource
 *
 * @param properties - the TypeScript properties of a `CreateColumnsOperationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.CreateColumnsOperation` resource.
 */
// @ts-ignore TS6133
function cfnDataSetCreateColumnsOperationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_CreateColumnsOperationPropertyValidator(properties).assertSuccess();
    return {
        Columns: cdk.listMapper(cfnDataSetCalculatedColumnPropertyToCloudFormation)(properties.columns),
    };
}

// @ts-ignore TS6133
function CfnDataSetCreateColumnsOperationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.CreateColumnsOperationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.CreateColumnsOperationProperty>();
    ret.addPropertyResult('columns', 'Columns', cfn_parse.FromCloudFormation.getArray(CfnDataSetCalculatedColumnPropertyFromCloudFormation)(properties.Columns));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A physical table type built from the results of the custom SQL query.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html
     */
    export interface CustomSqlProperty {
        /**
         * The column schema from the SQL query result set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html#cfn-quicksight-dataset-customsql-columns
         */
        readonly columns: Array<CfnDataSet.InputColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html#cfn-quicksight-dataset-customsql-datasourcearn
         */
        readonly dataSourceArn: string;
        /**
         * A display name for the SQL query result.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html#cfn-quicksight-dataset-customsql-name
         */
        readonly name: string;
        /**
         * The SQL query.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html#cfn-quicksight-dataset-customsql-sqlquery
         */
        readonly sqlQuery: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomSqlProperty`
 *
 * @param properties - the TypeScript properties of a `CustomSqlProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_CustomSqlPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columns', cdk.requiredValidator)(properties.columns));
    errors.collect(cdk.propertyValidator('columns', cdk.listValidator(CfnDataSet_InputColumnPropertyValidator))(properties.columns));
    errors.collect(cdk.propertyValidator('dataSourceArn', cdk.requiredValidator)(properties.dataSourceArn));
    errors.collect(cdk.propertyValidator('dataSourceArn', cdk.validateString)(properties.dataSourceArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sqlQuery', cdk.requiredValidator)(properties.sqlQuery));
    errors.collect(cdk.propertyValidator('sqlQuery', cdk.validateString)(properties.sqlQuery));
    return errors.wrap('supplied properties not correct for "CustomSqlProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.CustomSql` resource
 *
 * @param properties - the TypeScript properties of a `CustomSqlProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.CustomSql` resource.
 */
// @ts-ignore TS6133
function cfnDataSetCustomSqlPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_CustomSqlPropertyValidator(properties).assertSuccess();
    return {
        Columns: cdk.listMapper(cfnDataSetInputColumnPropertyToCloudFormation)(properties.columns),
        DataSourceArn: cdk.stringToCloudFormation(properties.dataSourceArn),
        Name: cdk.stringToCloudFormation(properties.name),
        SqlQuery: cdk.stringToCloudFormation(properties.sqlQuery),
    };
}

// @ts-ignore TS6133
function CfnDataSetCustomSqlPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.CustomSqlProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.CustomSqlProperty>();
    ret.addPropertyResult('columns', 'Columns', cfn_parse.FromCloudFormation.getArray(CfnDataSetInputColumnPropertyFromCloudFormation)(properties.Columns));
    ret.addPropertyResult('dataSourceArn', 'DataSourceArn', cfn_parse.FromCloudFormation.getString(properties.DataSourceArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('sqlQuery', 'SqlQuery', cfn_parse.FromCloudFormation.getString(properties.SqlQuery));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-datasetusageconfiguration.html
     */
    export interface DataSetUsageConfigurationProperty {
        /**
         * An option that controls whether a child dataset of a direct query can use this dataset as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-datasetusageconfiguration.html#cfn-quicksight-dataset-datasetusageconfiguration-disableuseasdirectquerysource
         */
        readonly disableUseAsDirectQuerySource?: boolean | cdk.IResolvable;
        /**
         * An option that controls whether a child dataset that's stored in QuickSight can use this dataset as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-datasetusageconfiguration.html#cfn-quicksight-dataset-datasetusageconfiguration-disableuseasimportedsource
         */
        readonly disableUseAsImportedSource?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DataSetUsageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DataSetUsageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_DataSetUsageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('disableUseAsDirectQuerySource', cdk.validateBoolean)(properties.disableUseAsDirectQuerySource));
    errors.collect(cdk.propertyValidator('disableUseAsImportedSource', cdk.validateBoolean)(properties.disableUseAsImportedSource));
    return errors.wrap('supplied properties not correct for "DataSetUsageConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.DataSetUsageConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DataSetUsageConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.DataSetUsageConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDataSetDataSetUsageConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_DataSetUsageConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DisableUseAsDirectQuerySource: cdk.booleanToCloudFormation(properties.disableUseAsDirectQuerySource),
        DisableUseAsImportedSource: cdk.booleanToCloudFormation(properties.disableUseAsImportedSource),
    };
}

// @ts-ignore TS6133
function CfnDataSetDataSetUsageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.DataSetUsageConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.DataSetUsageConfigurationProperty>();
    ret.addPropertyResult('disableUseAsDirectQuerySource', 'DisableUseAsDirectQuerySource', properties.DisableUseAsDirectQuerySource != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableUseAsDirectQuerySource) : undefined);
    ret.addPropertyResult('disableUseAsImportedSource', 'DisableUseAsImportedSource', properties.DisableUseAsImportedSource != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableUseAsImportedSource) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A FieldFolder element is a folder that contains fields and nested subfolders.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-fieldfolder.html
     */
    export interface FieldFolderProperty {
        /**
         * A folder has a list of columns. A column can only be in one folder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-fieldfolder.html#cfn-quicksight-dataset-fieldfolder-columns
         */
        readonly columns?: string[];
        /**
         * The description for a field folder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-fieldfolder.html#cfn-quicksight-dataset-fieldfolder-description
         */
        readonly description?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldFolderProperty`
 *
 * @param properties - the TypeScript properties of a `FieldFolderProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_FieldFolderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columns', cdk.listValidator(cdk.validateString))(properties.columns));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    return errors.wrap('supplied properties not correct for "FieldFolderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.FieldFolder` resource
 *
 * @param properties - the TypeScript properties of a `FieldFolderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.FieldFolder` resource.
 */
// @ts-ignore TS6133
function cfnDataSetFieldFolderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_FieldFolderPropertyValidator(properties).assertSuccess();
    return {
        Columns: cdk.listMapper(cdk.stringToCloudFormation)(properties.columns),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnDataSetFieldFolderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.FieldFolderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.FieldFolderProperty>();
    ret.addPropertyResult('columns', 'Columns', properties.Columns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Columns) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A transform operation that filters rows based on a condition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-filteroperation.html
     */
    export interface FilterOperationProperty {
        /**
         * An expression that must evaluate to a Boolean value. Rows for which the expression evaluates to true are kept in the dataset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-filteroperation.html#cfn-quicksight-dataset-filteroperation-conditionexpression
         */
        readonly conditionExpression: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterOperationProperty`
 *
 * @param properties - the TypeScript properties of a `FilterOperationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_FilterOperationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conditionExpression', cdk.requiredValidator)(properties.conditionExpression));
    errors.collect(cdk.propertyValidator('conditionExpression', cdk.validateString)(properties.conditionExpression));
    return errors.wrap('supplied properties not correct for "FilterOperationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.FilterOperation` resource
 *
 * @param properties - the TypeScript properties of a `FilterOperationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.FilterOperation` resource.
 */
// @ts-ignore TS6133
function cfnDataSetFilterOperationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_FilterOperationPropertyValidator(properties).assertSuccess();
    return {
        ConditionExpression: cdk.stringToCloudFormation(properties.conditionExpression),
    };
}

// @ts-ignore TS6133
function CfnDataSetFilterOperationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.FilterOperationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.FilterOperationProperty>();
    ret.addPropertyResult('conditionExpression', 'ConditionExpression', cfn_parse.FromCloudFormation.getString(properties.ConditionExpression));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Geospatial column group that denotes a hierarchy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-geospatialcolumngroup.html
     */
    export interface GeoSpatialColumnGroupProperty {
        /**
         * Columns in this hierarchy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-geospatialcolumngroup.html#cfn-quicksight-dataset-geospatialcolumngroup-columns
         */
        readonly columns: string[];
        /**
         * Country code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-geospatialcolumngroup.html#cfn-quicksight-dataset-geospatialcolumngroup-countrycode
         */
        readonly countryCode?: string;
        /**
         * A display name for the hierarchy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-geospatialcolumngroup.html#cfn-quicksight-dataset-geospatialcolumngroup-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `GeoSpatialColumnGroupProperty`
 *
 * @param properties - the TypeScript properties of a `GeoSpatialColumnGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_GeoSpatialColumnGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columns', cdk.requiredValidator)(properties.columns));
    errors.collect(cdk.propertyValidator('columns', cdk.listValidator(cdk.validateString))(properties.columns));
    errors.collect(cdk.propertyValidator('countryCode', cdk.validateString)(properties.countryCode));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "GeoSpatialColumnGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.GeoSpatialColumnGroup` resource
 *
 * @param properties - the TypeScript properties of a `GeoSpatialColumnGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.GeoSpatialColumnGroup` resource.
 */
// @ts-ignore TS6133
function cfnDataSetGeoSpatialColumnGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_GeoSpatialColumnGroupPropertyValidator(properties).assertSuccess();
    return {
        Columns: cdk.listMapper(cdk.stringToCloudFormation)(properties.columns),
        CountryCode: cdk.stringToCloudFormation(properties.countryCode),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnDataSetGeoSpatialColumnGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.GeoSpatialColumnGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.GeoSpatialColumnGroupProperty>();
    ret.addPropertyResult('columns', 'Columns', cfn_parse.FromCloudFormation.getStringArray(properties.Columns));
    ret.addPropertyResult('countryCode', 'CountryCode', properties.CountryCode != null ? cfn_parse.FromCloudFormation.getString(properties.CountryCode) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * The wait policy to use when creating or updating a Dataset. The default is to wait for SPICE ingestion to finish with timeout of 36 hours.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-ingestionwaitpolicy.html
     */
    export interface IngestionWaitPolicyProperty {
        /**
         * The maximum time (in hours) to wait for Ingestion to complete. Default timeout is 36 hours. Applicable only when `DataSetImportMode` mode is set to SPICE and `WaitForSpiceIngestion` is set to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-ingestionwaitpolicy.html#cfn-quicksight-dataset-ingestionwaitpolicy-ingestionwaittimeinhours
         */
        readonly ingestionWaitTimeInHours?: number;
        /**
         * Wait for SPICE ingestion to finish to mark dataset creation or update as successful. Default (true). Applicable only when `DataSetImportMode` mode is set to SPICE.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-ingestionwaitpolicy.html#cfn-quicksight-dataset-ingestionwaitpolicy-waitforspiceingestion
         */
        readonly waitForSpiceIngestion?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IngestionWaitPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `IngestionWaitPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_IngestionWaitPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ingestionWaitTimeInHours', cdk.validateNumber)(properties.ingestionWaitTimeInHours));
    errors.collect(cdk.propertyValidator('waitForSpiceIngestion', cdk.validateBoolean)(properties.waitForSpiceIngestion));
    return errors.wrap('supplied properties not correct for "IngestionWaitPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.IngestionWaitPolicy` resource
 *
 * @param properties - the TypeScript properties of a `IngestionWaitPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.IngestionWaitPolicy` resource.
 */
// @ts-ignore TS6133
function cfnDataSetIngestionWaitPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_IngestionWaitPolicyPropertyValidator(properties).assertSuccess();
    return {
        IngestionWaitTimeInHours: cdk.numberToCloudFormation(properties.ingestionWaitTimeInHours),
        WaitForSpiceIngestion: cdk.booleanToCloudFormation(properties.waitForSpiceIngestion),
    };
}

// @ts-ignore TS6133
function CfnDataSetIngestionWaitPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.IngestionWaitPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.IngestionWaitPolicyProperty>();
    ret.addPropertyResult('ingestionWaitTimeInHours', 'IngestionWaitTimeInHours', properties.IngestionWaitTimeInHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.IngestionWaitTimeInHours) : undefined);
    ret.addPropertyResult('waitForSpiceIngestion', 'WaitForSpiceIngestion', properties.WaitForSpiceIngestion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WaitForSpiceIngestion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Metadata for a column that is used as the input of a transform operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-inputcolumn.html
     */
    export interface InputColumnProperty {
        /**
         * The name of this column in the underlying data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-inputcolumn.html#cfn-quicksight-dataset-inputcolumn-name
         */
        readonly name: string;
        /**
         * The data type of the column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-inputcolumn.html#cfn-quicksight-dataset-inputcolumn-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputColumnProperty`
 *
 * @param properties - the TypeScript properties of a `InputColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_InputColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "InputColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.InputColumn` resource
 *
 * @param properties - the TypeScript properties of a `InputColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.InputColumn` resource.
 */
// @ts-ignore TS6133
function cfnDataSetInputColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_InputColumnPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnDataSetInputColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.InputColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.InputColumnProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * The instructions associated with a join.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html
     */
    export interface JoinInstructionProperty {
        /**
         * Join key properties of the left operand.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-leftjoinkeyproperties
         */
        readonly leftJoinKeyProperties?: CfnDataSet.JoinKeyPropertiesProperty | cdk.IResolvable;
        /**
         * The operand on the left side of a join.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-leftoperand
         */
        readonly leftOperand: string;
        /**
         * The join instructions provided in the `ON` clause of a join.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-onclause
         */
        readonly onClause: string;
        /**
         * Join key properties of the right operand.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-rightjoinkeyproperties
         */
        readonly rightJoinKeyProperties?: CfnDataSet.JoinKeyPropertiesProperty | cdk.IResolvable;
        /**
         * The operand on the right side of a join.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-rightoperand
         */
        readonly rightOperand: string;
        /**
         * The type of join that it is.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `JoinInstructionProperty`
 *
 * @param properties - the TypeScript properties of a `JoinInstructionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_JoinInstructionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('leftJoinKeyProperties', CfnDataSet_JoinKeyPropertiesPropertyValidator)(properties.leftJoinKeyProperties));
    errors.collect(cdk.propertyValidator('leftOperand', cdk.requiredValidator)(properties.leftOperand));
    errors.collect(cdk.propertyValidator('leftOperand', cdk.validateString)(properties.leftOperand));
    errors.collect(cdk.propertyValidator('onClause', cdk.requiredValidator)(properties.onClause));
    errors.collect(cdk.propertyValidator('onClause', cdk.validateString)(properties.onClause));
    errors.collect(cdk.propertyValidator('rightJoinKeyProperties', CfnDataSet_JoinKeyPropertiesPropertyValidator)(properties.rightJoinKeyProperties));
    errors.collect(cdk.propertyValidator('rightOperand', cdk.requiredValidator)(properties.rightOperand));
    errors.collect(cdk.propertyValidator('rightOperand', cdk.validateString)(properties.rightOperand));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "JoinInstructionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.JoinInstruction` resource
 *
 * @param properties - the TypeScript properties of a `JoinInstructionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.JoinInstruction` resource.
 */
// @ts-ignore TS6133
function cfnDataSetJoinInstructionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_JoinInstructionPropertyValidator(properties).assertSuccess();
    return {
        LeftJoinKeyProperties: cfnDataSetJoinKeyPropertiesPropertyToCloudFormation(properties.leftJoinKeyProperties),
        LeftOperand: cdk.stringToCloudFormation(properties.leftOperand),
        OnClause: cdk.stringToCloudFormation(properties.onClause),
        RightJoinKeyProperties: cfnDataSetJoinKeyPropertiesPropertyToCloudFormation(properties.rightJoinKeyProperties),
        RightOperand: cdk.stringToCloudFormation(properties.rightOperand),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnDataSetJoinInstructionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.JoinInstructionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.JoinInstructionProperty>();
    ret.addPropertyResult('leftJoinKeyProperties', 'LeftJoinKeyProperties', properties.LeftJoinKeyProperties != null ? CfnDataSetJoinKeyPropertiesPropertyFromCloudFormation(properties.LeftJoinKeyProperties) : undefined);
    ret.addPropertyResult('leftOperand', 'LeftOperand', cfn_parse.FromCloudFormation.getString(properties.LeftOperand));
    ret.addPropertyResult('onClause', 'OnClause', cfn_parse.FromCloudFormation.getString(properties.OnClause));
    ret.addPropertyResult('rightJoinKeyProperties', 'RightJoinKeyProperties', properties.RightJoinKeyProperties != null ? CfnDataSetJoinKeyPropertiesPropertyFromCloudFormation(properties.RightJoinKeyProperties) : undefined);
    ret.addPropertyResult('rightOperand', 'RightOperand', cfn_parse.FromCloudFormation.getString(properties.RightOperand));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Properties associated with the columns participating in a join.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joinkeyproperties.html
     */
    export interface JoinKeyPropertiesProperty {
        /**
         * A value that indicates that a row in a table is uniquely identified by the columns in a join key. This is used by Amazon QuickSight to optimize query performance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joinkeyproperties.html#cfn-quicksight-dataset-joinkeyproperties-uniquekey
         */
        readonly uniqueKey?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `JoinKeyPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `JoinKeyPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_JoinKeyPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('uniqueKey', cdk.validateBoolean)(properties.uniqueKey));
    return errors.wrap('supplied properties not correct for "JoinKeyPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.JoinKeyProperties` resource
 *
 * @param properties - the TypeScript properties of a `JoinKeyPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.JoinKeyProperties` resource.
 */
// @ts-ignore TS6133
function cfnDataSetJoinKeyPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_JoinKeyPropertiesPropertyValidator(properties).assertSuccess();
    return {
        UniqueKey: cdk.booleanToCloudFormation(properties.uniqueKey),
    };
}

// @ts-ignore TS6133
function CfnDataSetJoinKeyPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.JoinKeyPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.JoinKeyPropertiesProperty>();
    ret.addPropertyResult('uniqueKey', 'UniqueKey', properties.UniqueKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UniqueKey) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A *logical table* is a unit that joins and that data transformations operate on. A logical table has a source, which can be either a physical table or result of a join. When a logical table points to a physical table, the logical table acts as a mutable copy of that physical table through transform operations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltable.html
     */
    export interface LogicalTableProperty {
        /**
         * A display name for the logical table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltable.html#cfn-quicksight-dataset-logicaltable-alias
         */
        readonly alias: string;
        /**
         * Transform operations that act on this logical table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltable.html#cfn-quicksight-dataset-logicaltable-datatransforms
         */
        readonly dataTransforms?: Array<CfnDataSet.TransformOperationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Source of this logical table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltable.html#cfn-quicksight-dataset-logicaltable-source
         */
        readonly source: CfnDataSet.LogicalTableSourceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LogicalTableProperty`
 *
 * @param properties - the TypeScript properties of a `LogicalTableProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_LogicalTablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alias', cdk.requiredValidator)(properties.alias));
    errors.collect(cdk.propertyValidator('alias', cdk.validateString)(properties.alias));
    errors.collect(cdk.propertyValidator('dataTransforms', cdk.listValidator(CfnDataSet_TransformOperationPropertyValidator))(properties.dataTransforms));
    errors.collect(cdk.propertyValidator('source', cdk.requiredValidator)(properties.source));
    errors.collect(cdk.propertyValidator('source', CfnDataSet_LogicalTableSourcePropertyValidator)(properties.source));
    return errors.wrap('supplied properties not correct for "LogicalTableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.LogicalTable` resource
 *
 * @param properties - the TypeScript properties of a `LogicalTableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.LogicalTable` resource.
 */
// @ts-ignore TS6133
function cfnDataSetLogicalTablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_LogicalTablePropertyValidator(properties).assertSuccess();
    return {
        Alias: cdk.stringToCloudFormation(properties.alias),
        DataTransforms: cdk.listMapper(cfnDataSetTransformOperationPropertyToCloudFormation)(properties.dataTransforms),
        Source: cfnDataSetLogicalTableSourcePropertyToCloudFormation(properties.source),
    };
}

// @ts-ignore TS6133
function CfnDataSetLogicalTablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.LogicalTableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.LogicalTableProperty>();
    ret.addPropertyResult('alias', 'Alias', cfn_parse.FromCloudFormation.getString(properties.Alias));
    ret.addPropertyResult('dataTransforms', 'DataTransforms', properties.DataTransforms != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSetTransformOperationPropertyFromCloudFormation)(properties.DataTransforms) : undefined);
    ret.addPropertyResult('source', 'Source', CfnDataSetLogicalTableSourcePropertyFromCloudFormation(properties.Source));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Information about the source of a logical table. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltablesource.html
     */
    export interface LogicalTableSourceProperty {
        /**
         * The Amazon Resource Number (ARN) of the parent dataset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltablesource.html#cfn-quicksight-dataset-logicaltablesource-datasetarn
         */
        readonly dataSetArn?: string;
        /**
         * Specifies the result of a join of two logical tables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltablesource.html#cfn-quicksight-dataset-logicaltablesource-joininstruction
         */
        readonly joinInstruction?: CfnDataSet.JoinInstructionProperty | cdk.IResolvable;
        /**
         * Physical table ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltablesource.html#cfn-quicksight-dataset-logicaltablesource-physicaltableid
         */
        readonly physicalTableId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogicalTableSourceProperty`
 *
 * @param properties - the TypeScript properties of a `LogicalTableSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_LogicalTableSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataSetArn', cdk.validateString)(properties.dataSetArn));
    errors.collect(cdk.propertyValidator('joinInstruction', CfnDataSet_JoinInstructionPropertyValidator)(properties.joinInstruction));
    errors.collect(cdk.propertyValidator('physicalTableId', cdk.validateString)(properties.physicalTableId));
    return errors.wrap('supplied properties not correct for "LogicalTableSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.LogicalTableSource` resource
 *
 * @param properties - the TypeScript properties of a `LogicalTableSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.LogicalTableSource` resource.
 */
// @ts-ignore TS6133
function cfnDataSetLogicalTableSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_LogicalTableSourcePropertyValidator(properties).assertSuccess();
    return {
        DataSetArn: cdk.stringToCloudFormation(properties.dataSetArn),
        JoinInstruction: cfnDataSetJoinInstructionPropertyToCloudFormation(properties.joinInstruction),
        PhysicalTableId: cdk.stringToCloudFormation(properties.physicalTableId),
    };
}

// @ts-ignore TS6133
function CfnDataSetLogicalTableSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.LogicalTableSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.LogicalTableSourceProperty>();
    ret.addPropertyResult('dataSetArn', 'DataSetArn', properties.DataSetArn != null ? cfn_parse.FromCloudFormation.getString(properties.DataSetArn) : undefined);
    ret.addPropertyResult('joinInstruction', 'JoinInstruction', properties.JoinInstruction != null ? CfnDataSetJoinInstructionPropertyFromCloudFormation(properties.JoinInstruction) : undefined);
    ret.addPropertyResult('physicalTableId', 'PhysicalTableId', properties.PhysicalTableId != null ? cfn_parse.FromCloudFormation.getString(properties.PhysicalTableId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Output column.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-outputcolumn.html
     */
    export interface OutputColumnProperty {
        /**
         * A description for a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-outputcolumn.html#cfn-quicksight-dataset-outputcolumn-description
         */
        readonly description?: string;
        /**
         * A display name for the dataset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-outputcolumn.html#cfn-quicksight-dataset-outputcolumn-name
         */
        readonly name?: string;
        /**
         * Type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-outputcolumn.html#cfn-quicksight-dataset-outputcolumn-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutputColumnProperty`
 *
 * @param properties - the TypeScript properties of a `OutputColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_OutputColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "OutputColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.OutputColumn` resource
 *
 * @param properties - the TypeScript properties of a `OutputColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.OutputColumn` resource.
 */
// @ts-ignore TS6133
function cfnDataSetOutputColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_OutputColumnPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnDataSetOutputColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.OutputColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.OutputColumnProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A view of a data source that contains information about the shape of the data in the underlying source. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-physicaltable.html
     */
    export interface PhysicalTableProperty {
        /**
         * A physical table type built from the results of the custom SQL query.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-physicaltable.html#cfn-quicksight-dataset-physicaltable-customsql
         */
        readonly customSql?: CfnDataSet.CustomSqlProperty | cdk.IResolvable;
        /**
         * A physical table type for relational data sources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-physicaltable.html#cfn-quicksight-dataset-physicaltable-relationaltable
         */
        readonly relationalTable?: CfnDataSet.RelationalTableProperty | cdk.IResolvable;
        /**
         * A physical table type for as S3 data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-physicaltable.html#cfn-quicksight-dataset-physicaltable-s3source
         */
        readonly s3Source?: CfnDataSet.S3SourceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PhysicalTableProperty`
 *
 * @param properties - the TypeScript properties of a `PhysicalTableProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_PhysicalTablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customSql', CfnDataSet_CustomSqlPropertyValidator)(properties.customSql));
    errors.collect(cdk.propertyValidator('relationalTable', CfnDataSet_RelationalTablePropertyValidator)(properties.relationalTable));
    errors.collect(cdk.propertyValidator('s3Source', CfnDataSet_S3SourcePropertyValidator)(properties.s3Source));
    return errors.wrap('supplied properties not correct for "PhysicalTableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.PhysicalTable` resource
 *
 * @param properties - the TypeScript properties of a `PhysicalTableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.PhysicalTable` resource.
 */
// @ts-ignore TS6133
function cfnDataSetPhysicalTablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_PhysicalTablePropertyValidator(properties).assertSuccess();
    return {
        CustomSql: cfnDataSetCustomSqlPropertyToCloudFormation(properties.customSql),
        RelationalTable: cfnDataSetRelationalTablePropertyToCloudFormation(properties.relationalTable),
        S3Source: cfnDataSetS3SourcePropertyToCloudFormation(properties.s3Source),
    };
}

// @ts-ignore TS6133
function CfnDataSetPhysicalTablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.PhysicalTableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.PhysicalTableProperty>();
    ret.addPropertyResult('customSql', 'CustomSql', properties.CustomSql != null ? CfnDataSetCustomSqlPropertyFromCloudFormation(properties.CustomSql) : undefined);
    ret.addPropertyResult('relationalTable', 'RelationalTable', properties.RelationalTable != null ? CfnDataSetRelationalTablePropertyFromCloudFormation(properties.RelationalTable) : undefined);
    ret.addPropertyResult('s3Source', 'S3Source', properties.S3Source != null ? CfnDataSetS3SourcePropertyFromCloudFormation(properties.S3Source) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A transform operation that projects columns. Operations that come after a projection can only refer to projected columns.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-projectoperation.html
     */
    export interface ProjectOperationProperty {
        /**
         * Projected columns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-projectoperation.html#cfn-quicksight-dataset-projectoperation-projectedcolumns
         */
        readonly projectedColumns: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ProjectOperationProperty`
 *
 * @param properties - the TypeScript properties of a `ProjectOperationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_ProjectOperationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('projectedColumns', cdk.requiredValidator)(properties.projectedColumns));
    errors.collect(cdk.propertyValidator('projectedColumns', cdk.listValidator(cdk.validateString))(properties.projectedColumns));
    return errors.wrap('supplied properties not correct for "ProjectOperationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ProjectOperation` resource
 *
 * @param properties - the TypeScript properties of a `ProjectOperationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ProjectOperation` resource.
 */
// @ts-ignore TS6133
function cfnDataSetProjectOperationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_ProjectOperationPropertyValidator(properties).assertSuccess();
    return {
        ProjectedColumns: cdk.listMapper(cdk.stringToCloudFormation)(properties.projectedColumns),
    };
}

// @ts-ignore TS6133
function CfnDataSetProjectOperationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.ProjectOperationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.ProjectOperationProperty>();
    ret.addPropertyResult('projectedColumns', 'ProjectedColumns', cfn_parse.FromCloudFormation.getStringArray(properties.ProjectedColumns));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A physical table type for relational data sources.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html
     */
    export interface RelationalTableProperty {
        /**
         * `CfnDataSet.RelationalTableProperty.Catalog`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-catalog
         */
        readonly catalog?: string;
        /**
         * The Amazon Resource Name (ARN) for the data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-datasourcearn
         */
        readonly dataSourceArn: string;
        /**
         * The column schema of the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-inputcolumns
         */
        readonly inputColumns: Array<CfnDataSet.InputColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the relational table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-name
         */
        readonly name: string;
        /**
         * The schema name. This name applies to certain relational database engines.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-schema
         */
        readonly schema?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RelationalTableProperty`
 *
 * @param properties - the TypeScript properties of a `RelationalTableProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_RelationalTablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalog', cdk.validateString)(properties.catalog));
    errors.collect(cdk.propertyValidator('dataSourceArn', cdk.requiredValidator)(properties.dataSourceArn));
    errors.collect(cdk.propertyValidator('dataSourceArn', cdk.validateString)(properties.dataSourceArn));
    errors.collect(cdk.propertyValidator('inputColumns', cdk.requiredValidator)(properties.inputColumns));
    errors.collect(cdk.propertyValidator('inputColumns', cdk.listValidator(CfnDataSet_InputColumnPropertyValidator))(properties.inputColumns));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('schema', cdk.validateString)(properties.schema));
    return errors.wrap('supplied properties not correct for "RelationalTableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.RelationalTable` resource
 *
 * @param properties - the TypeScript properties of a `RelationalTableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.RelationalTable` resource.
 */
// @ts-ignore TS6133
function cfnDataSetRelationalTablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_RelationalTablePropertyValidator(properties).assertSuccess();
    return {
        Catalog: cdk.stringToCloudFormation(properties.catalog),
        DataSourceArn: cdk.stringToCloudFormation(properties.dataSourceArn),
        InputColumns: cdk.listMapper(cfnDataSetInputColumnPropertyToCloudFormation)(properties.inputColumns),
        Name: cdk.stringToCloudFormation(properties.name),
        Schema: cdk.stringToCloudFormation(properties.schema),
    };
}

// @ts-ignore TS6133
function CfnDataSetRelationalTablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.RelationalTableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.RelationalTableProperty>();
    ret.addPropertyResult('catalog', 'Catalog', properties.Catalog != null ? cfn_parse.FromCloudFormation.getString(properties.Catalog) : undefined);
    ret.addPropertyResult('dataSourceArn', 'DataSourceArn', cfn_parse.FromCloudFormation.getString(properties.DataSourceArn));
    ret.addPropertyResult('inputColumns', 'InputColumns', cfn_parse.FromCloudFormation.getArray(CfnDataSetInputColumnPropertyFromCloudFormation)(properties.InputColumns));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('schema', 'Schema', properties.Schema != null ? cfn_parse.FromCloudFormation.getString(properties.Schema) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A transform operation that renames a column.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-renamecolumnoperation.html
     */
    export interface RenameColumnOperationProperty {
        /**
         * The name of the column to be renamed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-renamecolumnoperation.html#cfn-quicksight-dataset-renamecolumnoperation-columnname
         */
        readonly columnName: string;
        /**
         * The new name for the column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-renamecolumnoperation.html#cfn-quicksight-dataset-renamecolumnoperation-newcolumnname
         */
        readonly newColumnName: string;
    }
}

/**
 * Determine whether the given properties match those of a `RenameColumnOperationProperty`
 *
 * @param properties - the TypeScript properties of a `RenameColumnOperationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_RenameColumnOperationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnName', cdk.requiredValidator)(properties.columnName));
    errors.collect(cdk.propertyValidator('columnName', cdk.validateString)(properties.columnName));
    errors.collect(cdk.propertyValidator('newColumnName', cdk.requiredValidator)(properties.newColumnName));
    errors.collect(cdk.propertyValidator('newColumnName', cdk.validateString)(properties.newColumnName));
    return errors.wrap('supplied properties not correct for "RenameColumnOperationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.RenameColumnOperation` resource
 *
 * @param properties - the TypeScript properties of a `RenameColumnOperationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.RenameColumnOperation` resource.
 */
// @ts-ignore TS6133
function cfnDataSetRenameColumnOperationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_RenameColumnOperationPropertyValidator(properties).assertSuccess();
    return {
        ColumnName: cdk.stringToCloudFormation(properties.columnName),
        NewColumnName: cdk.stringToCloudFormation(properties.newColumnName),
    };
}

// @ts-ignore TS6133
function CfnDataSetRenameColumnOperationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.RenameColumnOperationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.RenameColumnOperationProperty>();
    ret.addPropertyResult('columnName', 'ColumnName', cfn_parse.FromCloudFormation.getString(properties.ColumnName));
    ret.addPropertyResult('newColumnName', 'NewColumnName', cfn_parse.FromCloudFormation.getString(properties.NewColumnName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-resourcepermission.html
     */
    export interface ResourcePermissionProperty {
        /**
         * The IAM action to grand or revoke permisions on
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-resourcepermission.html#cfn-quicksight-dataset-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-resourcepermission.html#cfn-quicksight-dataset-resourcepermission-principal
         */
        readonly principal: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourcePermissionProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_ResourcePermissionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(cdk.validateString))(properties.actions));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    return errors.wrap('supplied properties not correct for "ResourcePermissionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ResourcePermission` resource
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.ResourcePermission` resource.
 */
// @ts-ignore TS6133
function cfnDataSetResourcePermissionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_ResourcePermissionPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
        Principal: cdk.stringToCloudFormation(properties.principal),
    };
}

// @ts-ignore TS6133
function CfnDataSetResourcePermissionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.ResourcePermissionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.ResourcePermissionProperty>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getStringArray(properties.Actions));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Information about a dataset that contains permissions for row-level security (RLS). The permissions dataset maps fields to users or groups. For more information, see [Using Row-Level Security (RLS) to Restrict Access to a Dataset](https://docs.aws.amazon.com/quicksight/latest/user/restrict-access-to-a-data-set-using-row-level-security.html) in the *Amazon QuickSight User Guide* .
     *
     * The option to deny permissions by setting `PermissionPolicy` to `DENY_ACCESS` is not supported for new RLS datasets.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html
     */
    export interface RowLevelPermissionDataSetProperty {
        /**
         * The Amazon Resource Name (ARN) of the dataset that contains permissions for RLS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset-arn
         */
        readonly arn: string;
        /**
         * The user or group rules associated with the dataset that contains permissions for RLS.
         *
         * By default, `FormatVersion` is `VERSION_1` . When `FormatVersion` is `VERSION_1` , `UserName` and `GroupName` are required. When `FormatVersion` is `VERSION_2` , `UserARN` and `GroupARN` are required, and `Namespace` must not exist.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset-formatversion
         */
        readonly formatVersion?: string;
        /**
         * The namespace associated with the dataset that contains permissions for RLS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset-namespace
         */
        readonly namespace?: string;
        /**
         * The type of permissions to use when interpreting the permissions for RLS. `DENY_ACCESS` is included for backward compatibility only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset-permissionpolicy
         */
        readonly permissionPolicy: string;
    }
}

/**
 * Determine whether the given properties match those of a `RowLevelPermissionDataSetProperty`
 *
 * @param properties - the TypeScript properties of a `RowLevelPermissionDataSetProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_RowLevelPermissionDataSetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('formatVersion', cdk.validateString)(properties.formatVersion));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('permissionPolicy', cdk.requiredValidator)(properties.permissionPolicy));
    errors.collect(cdk.propertyValidator('permissionPolicy', cdk.validateString)(properties.permissionPolicy));
    return errors.wrap('supplied properties not correct for "RowLevelPermissionDataSetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.RowLevelPermissionDataSet` resource
 *
 * @param properties - the TypeScript properties of a `RowLevelPermissionDataSetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.RowLevelPermissionDataSet` resource.
 */
// @ts-ignore TS6133
function cfnDataSetRowLevelPermissionDataSetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_RowLevelPermissionDataSetPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        FormatVersion: cdk.stringToCloudFormation(properties.formatVersion),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        PermissionPolicy: cdk.stringToCloudFormation(properties.permissionPolicy),
    };
}

// @ts-ignore TS6133
function CfnDataSetRowLevelPermissionDataSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.RowLevelPermissionDataSetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.RowLevelPermissionDataSetProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('formatVersion', 'FormatVersion', properties.FormatVersion != null ? cfn_parse.FromCloudFormation.getString(properties.FormatVersion) : undefined);
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addPropertyResult('permissionPolicy', 'PermissionPolicy', cfn_parse.FromCloudFormation.getString(properties.PermissionPolicy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A physical table type for an S3 data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-s3source.html
     */
    export interface S3SourceProperty {
        /**
         * The Amazon Resource Name (ARN) for the data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-s3source.html#cfn-quicksight-dataset-s3source-datasourcearn
         */
        readonly dataSourceArn: string;
        /**
         * A physical table type for an S3 data source.
         *
         * > For files that aren't JSON, only `STRING` data types are supported in input columns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-s3source.html#cfn-quicksight-dataset-s3source-inputcolumns
         */
        readonly inputColumns: Array<CfnDataSet.InputColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the format for the S3 source file or files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-s3source.html#cfn-quicksight-dataset-s3source-uploadsettings
         */
        readonly uploadSettings?: CfnDataSet.UploadSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3SourceProperty`
 *
 * @param properties - the TypeScript properties of a `S3SourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_S3SourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataSourceArn', cdk.requiredValidator)(properties.dataSourceArn));
    errors.collect(cdk.propertyValidator('dataSourceArn', cdk.validateString)(properties.dataSourceArn));
    errors.collect(cdk.propertyValidator('inputColumns', cdk.requiredValidator)(properties.inputColumns));
    errors.collect(cdk.propertyValidator('inputColumns', cdk.listValidator(CfnDataSet_InputColumnPropertyValidator))(properties.inputColumns));
    errors.collect(cdk.propertyValidator('uploadSettings', CfnDataSet_UploadSettingsPropertyValidator)(properties.uploadSettings));
    return errors.wrap('supplied properties not correct for "S3SourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.S3Source` resource
 *
 * @param properties - the TypeScript properties of a `S3SourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.S3Source` resource.
 */
// @ts-ignore TS6133
function cfnDataSetS3SourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_S3SourcePropertyValidator(properties).assertSuccess();
    return {
        DataSourceArn: cdk.stringToCloudFormation(properties.dataSourceArn),
        InputColumns: cdk.listMapper(cfnDataSetInputColumnPropertyToCloudFormation)(properties.inputColumns),
        UploadSettings: cfnDataSetUploadSettingsPropertyToCloudFormation(properties.uploadSettings),
    };
}

// @ts-ignore TS6133
function CfnDataSetS3SourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.S3SourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.S3SourceProperty>();
    ret.addPropertyResult('dataSourceArn', 'DataSourceArn', cfn_parse.FromCloudFormation.getString(properties.DataSourceArn));
    ret.addPropertyResult('inputColumns', 'InputColumns', cfn_parse.FromCloudFormation.getArray(CfnDataSetInputColumnPropertyFromCloudFormation)(properties.InputColumns));
    ret.addPropertyResult('uploadSettings', 'UploadSettings', properties.UploadSettings != null ? CfnDataSetUploadSettingsPropertyFromCloudFormation(properties.UploadSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A transform operation that tags a column with additional information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-tagcolumnoperation.html
     */
    export interface TagColumnOperationProperty {
        /**
         * The column that this operation acts on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-tagcolumnoperation.html#cfn-quicksight-dataset-tagcolumnoperation-columnname
         */
        readonly columnName: string;
        /**
         * The dataset column tag, currently only used for geospatial type tagging.
         *
         * > This is not tags for the AWS tagging feature.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-tagcolumnoperation.html#cfn-quicksight-dataset-tagcolumnoperation-tags
         */
        readonly tags: CfnDataSet.ColumnTagProperty[];
    }
}

/**
 * Determine whether the given properties match those of a `TagColumnOperationProperty`
 *
 * @param properties - the TypeScript properties of a `TagColumnOperationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_TagColumnOperationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnName', cdk.requiredValidator)(properties.columnName));
    errors.collect(cdk.propertyValidator('columnName', cdk.validateString)(properties.columnName));
    errors.collect(cdk.propertyValidator('tags', cdk.requiredValidator)(properties.tags));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnDataSet_ColumnTagPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "TagColumnOperationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.TagColumnOperation` resource
 *
 * @param properties - the TypeScript properties of a `TagColumnOperationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.TagColumnOperation` resource.
 */
// @ts-ignore TS6133
function cfnDataSetTagColumnOperationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_TagColumnOperationPropertyValidator(properties).assertSuccess();
    return {
        ColumnName: cdk.stringToCloudFormation(properties.columnName),
        Tags: cdk.listMapper(cfnDataSetColumnTagPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDataSetTagColumnOperationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.TagColumnOperationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.TagColumnOperationProperty>();
    ret.addPropertyResult('columnName', 'ColumnName', cfn_parse.FromCloudFormation.getString(properties.ColumnName));
    ret.addPropertyResult('tags', 'Tags', cfn_parse.FromCloudFormation.getArray(CfnDataSetColumnTagPropertyFromCloudFormation)(properties.Tags) as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * A data transformation on a logical table. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html
     */
    export interface TransformOperationProperty {
        /**
         * A transform operation that casts a column to a different type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-castcolumntypeoperation
         */
        readonly castColumnTypeOperation?: CfnDataSet.CastColumnTypeOperationProperty | cdk.IResolvable;
        /**
         * An operation that creates calculated columns. Columns created in one such operation form a lexical closure.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-createcolumnsoperation
         */
        readonly createColumnsOperation?: CfnDataSet.CreateColumnsOperationProperty | cdk.IResolvable;
        /**
         * An operation that filters rows based on some condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-filteroperation
         */
        readonly filterOperation?: CfnDataSet.FilterOperationProperty | cdk.IResolvable;
        /**
         * An operation that projects columns. Operations that come after a projection can only refer to projected columns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-projectoperation
         */
        readonly projectOperation?: CfnDataSet.ProjectOperationProperty | cdk.IResolvable;
        /**
         * An operation that renames a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-renamecolumnoperation
         */
        readonly renameColumnOperation?: CfnDataSet.RenameColumnOperationProperty | cdk.IResolvable;
        /**
         * An operation that tags a column with additional information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-tagcolumnoperation
         */
        readonly tagColumnOperation?: CfnDataSet.TagColumnOperationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TransformOperationProperty`
 *
 * @param properties - the TypeScript properties of a `TransformOperationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_TransformOperationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('castColumnTypeOperation', CfnDataSet_CastColumnTypeOperationPropertyValidator)(properties.castColumnTypeOperation));
    errors.collect(cdk.propertyValidator('createColumnsOperation', CfnDataSet_CreateColumnsOperationPropertyValidator)(properties.createColumnsOperation));
    errors.collect(cdk.propertyValidator('filterOperation', CfnDataSet_FilterOperationPropertyValidator)(properties.filterOperation));
    errors.collect(cdk.propertyValidator('projectOperation', CfnDataSet_ProjectOperationPropertyValidator)(properties.projectOperation));
    errors.collect(cdk.propertyValidator('renameColumnOperation', CfnDataSet_RenameColumnOperationPropertyValidator)(properties.renameColumnOperation));
    errors.collect(cdk.propertyValidator('tagColumnOperation', CfnDataSet_TagColumnOperationPropertyValidator)(properties.tagColumnOperation));
    return errors.wrap('supplied properties not correct for "TransformOperationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.TransformOperation` resource
 *
 * @param properties - the TypeScript properties of a `TransformOperationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.TransformOperation` resource.
 */
// @ts-ignore TS6133
function cfnDataSetTransformOperationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_TransformOperationPropertyValidator(properties).assertSuccess();
    return {
        CastColumnTypeOperation: cfnDataSetCastColumnTypeOperationPropertyToCloudFormation(properties.castColumnTypeOperation),
        CreateColumnsOperation: cfnDataSetCreateColumnsOperationPropertyToCloudFormation(properties.createColumnsOperation),
        FilterOperation: cfnDataSetFilterOperationPropertyToCloudFormation(properties.filterOperation),
        ProjectOperation: cfnDataSetProjectOperationPropertyToCloudFormation(properties.projectOperation),
        RenameColumnOperation: cfnDataSetRenameColumnOperationPropertyToCloudFormation(properties.renameColumnOperation),
        TagColumnOperation: cfnDataSetTagColumnOperationPropertyToCloudFormation(properties.tagColumnOperation),
    };
}

// @ts-ignore TS6133
function CfnDataSetTransformOperationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.TransformOperationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.TransformOperationProperty>();
    ret.addPropertyResult('castColumnTypeOperation', 'CastColumnTypeOperation', properties.CastColumnTypeOperation != null ? CfnDataSetCastColumnTypeOperationPropertyFromCloudFormation(properties.CastColumnTypeOperation) : undefined);
    ret.addPropertyResult('createColumnsOperation', 'CreateColumnsOperation', properties.CreateColumnsOperation != null ? CfnDataSetCreateColumnsOperationPropertyFromCloudFormation(properties.CreateColumnsOperation) : undefined);
    ret.addPropertyResult('filterOperation', 'FilterOperation', properties.FilterOperation != null ? CfnDataSetFilterOperationPropertyFromCloudFormation(properties.FilterOperation) : undefined);
    ret.addPropertyResult('projectOperation', 'ProjectOperation', properties.ProjectOperation != null ? CfnDataSetProjectOperationPropertyFromCloudFormation(properties.ProjectOperation) : undefined);
    ret.addPropertyResult('renameColumnOperation', 'RenameColumnOperation', properties.RenameColumnOperation != null ? CfnDataSetRenameColumnOperationPropertyFromCloudFormation(properties.RenameColumnOperation) : undefined);
    ret.addPropertyResult('tagColumnOperation', 'TagColumnOperation', properties.TagColumnOperation != null ? CfnDataSetTagColumnOperationPropertyFromCloudFormation(properties.TagColumnOperation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSet {
    /**
     * Information about the format for a source file or files.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html
     */
    export interface UploadSettingsProperty {
        /**
         * Whether the file has a header row, or the files each have a header row.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-containsheader
         */
        readonly containsHeader?: boolean | cdk.IResolvable;
        /**
         * The delimiter between values in the file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-delimiter
         */
        readonly delimiter?: string;
        /**
         * File format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-format
         */
        readonly format?: string;
        /**
         * A row number to start reading data from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-startfromrow
         */
        readonly startFromRow?: number;
        /**
         * Text qualifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-textqualifier
         */
        readonly textQualifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UploadSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `UploadSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSet_UploadSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containsHeader', cdk.validateBoolean)(properties.containsHeader));
    errors.collect(cdk.propertyValidator('delimiter', cdk.validateString)(properties.delimiter));
    errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
    errors.collect(cdk.propertyValidator('startFromRow', cdk.validateNumber)(properties.startFromRow));
    errors.collect(cdk.propertyValidator('textQualifier', cdk.validateString)(properties.textQualifier));
    return errors.wrap('supplied properties not correct for "UploadSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.UploadSettings` resource
 *
 * @param properties - the TypeScript properties of a `UploadSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSet.UploadSettings` resource.
 */
// @ts-ignore TS6133
function cfnDataSetUploadSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSet_UploadSettingsPropertyValidator(properties).assertSuccess();
    return {
        ContainsHeader: cdk.booleanToCloudFormation(properties.containsHeader),
        Delimiter: cdk.stringToCloudFormation(properties.delimiter),
        Format: cdk.stringToCloudFormation(properties.format),
        StartFromRow: cdk.numberToCloudFormation(properties.startFromRow),
        TextQualifier: cdk.stringToCloudFormation(properties.textQualifier),
    };
}

// @ts-ignore TS6133
function CfnDataSetUploadSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSet.UploadSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSet.UploadSettingsProperty>();
    ret.addPropertyResult('containsHeader', 'ContainsHeader', properties.ContainsHeader != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContainsHeader) : undefined);
    ret.addPropertyResult('delimiter', 'Delimiter', properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined);
    ret.addPropertyResult('format', 'Format', properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined);
    ret.addPropertyResult('startFromRow', 'StartFromRow', properties.StartFromRow != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartFromRow) : undefined);
    ret.addPropertyResult('textQualifier', 'TextQualifier', properties.TextQualifier != null ? cfn_parse.FromCloudFormation.getString(properties.TextQualifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDataSource`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html
 */
export interface CfnDataSourceProps {

    /**
     * A set of alternate data source parameters that you want to share for the credentials stored with this data source. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the `DataSourceParameters` structure that's in the request with the structures in the `AlternateDataSourceParameters` allow list. If the structures are an exact match, the request is allowed to use the credentials from this existing data source. If the `AlternateDataSourceParameters` list is null, the `Credentials` originally used with this `DataSourceParameters` are automatically allowed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-alternatedatasourceparameters
     */
    readonly alternateDataSourceParameters?: Array<CfnDataSource.DataSourceParametersProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-awsaccountid
     */
    readonly awsAccountId?: string;

    /**
     * The credentials Amazon QuickSight that uses to connect to your underlying source. Currently, only credentials based on user name and password are supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-credentials
     */
    readonly credentials?: CfnDataSource.DataSourceCredentialsProperty | cdk.IResolvable;

    /**
     * An ID for the data source. This ID is unique per AWS Region for each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-datasourceid
     */
    readonly dataSourceId?: string;

    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-datasourceparameters
     */
    readonly dataSourceParameters?: CfnDataSource.DataSourceParametersProperty | cdk.IResolvable;

    /**
     * Error information from the last update or the creation of the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-errorinfo
     */
    readonly errorInfo?: CfnDataSource.DataSourceErrorInfoProperty | cdk.IResolvable;

    /**
     * A display name for the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-name
     */
    readonly name?: string;

    /**
     * A list of resource permissions on the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-permissions
     */
    readonly permissions?: Array<CfnDataSource.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-sslproperties
     */
    readonly sslProperties?: CfnDataSource.SslPropertiesProperty | cdk.IResolvable;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The type of the data source. To return a list of all data sources, use `ListDataSources` .
     *
     * Use `AMAZON_ELASTICSEARCH` for Amazon OpenSearch Service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-type
     */
    readonly type?: string;

    /**
     * Use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-vpcconnectionproperties
     */
    readonly vpcConnectionProperties?: CfnDataSource.VpcConnectionPropertiesProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnDataSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataSourceProps`
 *
 * @returns the result of the validation.
 */
function CfnDataSourcePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alternateDataSourceParameters', cdk.listValidator(CfnDataSource_DataSourceParametersPropertyValidator))(properties.alternateDataSourceParameters));
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.validateString)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('credentials', CfnDataSource_DataSourceCredentialsPropertyValidator)(properties.credentials));
    errors.collect(cdk.propertyValidator('dataSourceId', cdk.validateString)(properties.dataSourceId));
    errors.collect(cdk.propertyValidator('dataSourceParameters', CfnDataSource_DataSourceParametersPropertyValidator)(properties.dataSourceParameters));
    errors.collect(cdk.propertyValidator('errorInfo', CfnDataSource_DataSourceErrorInfoPropertyValidator)(properties.errorInfo));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('permissions', cdk.listValidator(CfnDataSource_ResourcePermissionPropertyValidator))(properties.permissions));
    errors.collect(cdk.propertyValidator('sslProperties', CfnDataSource_SslPropertiesPropertyValidator)(properties.sslProperties));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('vpcConnectionProperties', CfnDataSource_VpcConnectionPropertiesPropertyValidator)(properties.vpcConnectionProperties));
    return errors.wrap('supplied properties not correct for "CfnDataSourceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataSourceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource` resource.
 */
// @ts-ignore TS6133
function cfnDataSourcePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSourcePropsValidator(properties).assertSuccess();
    return {
        AlternateDataSourceParameters: cdk.listMapper(cfnDataSourceDataSourceParametersPropertyToCloudFormation)(properties.alternateDataSourceParameters),
        AwsAccountId: cdk.stringToCloudFormation(properties.awsAccountId),
        Credentials: cfnDataSourceDataSourceCredentialsPropertyToCloudFormation(properties.credentials),
        DataSourceId: cdk.stringToCloudFormation(properties.dataSourceId),
        DataSourceParameters: cfnDataSourceDataSourceParametersPropertyToCloudFormation(properties.dataSourceParameters),
        ErrorInfo: cfnDataSourceDataSourceErrorInfoPropertyToCloudFormation(properties.errorInfo),
        Name: cdk.stringToCloudFormation(properties.name),
        Permissions: cdk.listMapper(cfnDataSourceResourcePermissionPropertyToCloudFormation)(properties.permissions),
        SslProperties: cfnDataSourceSslPropertiesPropertyToCloudFormation(properties.sslProperties),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Type: cdk.stringToCloudFormation(properties.type),
        VpcConnectionProperties: cfnDataSourceVpcConnectionPropertiesPropertyToCloudFormation(properties.vpcConnectionProperties),
    };
}

// @ts-ignore TS6133
function CfnDataSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSourceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSourceProps>();
    ret.addPropertyResult('alternateDataSourceParameters', 'AlternateDataSourceParameters', properties.AlternateDataSourceParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceParametersPropertyFromCloudFormation)(properties.AlternateDataSourceParameters) : undefined);
    ret.addPropertyResult('awsAccountId', 'AwsAccountId', properties.AwsAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AwsAccountId) : undefined);
    ret.addPropertyResult('credentials', 'Credentials', properties.Credentials != null ? CfnDataSourceDataSourceCredentialsPropertyFromCloudFormation(properties.Credentials) : undefined);
    ret.addPropertyResult('dataSourceId', 'DataSourceId', properties.DataSourceId != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceId) : undefined);
    ret.addPropertyResult('dataSourceParameters', 'DataSourceParameters', properties.DataSourceParameters != null ? CfnDataSourceDataSourceParametersPropertyFromCloudFormation(properties.DataSourceParameters) : undefined);
    ret.addPropertyResult('errorInfo', 'ErrorInfo', properties.ErrorInfo != null ? CfnDataSourceDataSourceErrorInfoPropertyFromCloudFormation(properties.ErrorInfo) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('permissions', 'Permissions', properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceResourcePermissionPropertyFromCloudFormation)(properties.Permissions) : undefined);
    ret.addPropertyResult('sslProperties', 'SslProperties', properties.SslProperties != null ? CfnDataSourceSslPropertiesPropertyFromCloudFormation(properties.SslProperties) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('vpcConnectionProperties', 'VpcConnectionProperties', properties.VpcConnectionProperties != null ? CfnDataSourceVpcConnectionPropertiesPropertyFromCloudFormation(properties.VpcConnectionProperties) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::QuickSight::DataSource`
 *
 * Creates a data source.
 *
 * @cloudformationResource AWS::QuickSight::DataSource
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html
 */
export class CfnDataSource extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::DataSource";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataSource {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDataSourcePropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataSource(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the dataset.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The time that this data source was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The last time that this data source was updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     * The HTTP status of the request.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * A set of alternate data source parameters that you want to share for the credentials stored with this data source. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the `DataSourceParameters` structure that's in the request with the structures in the `AlternateDataSourceParameters` allow list. If the structures are an exact match, the request is allowed to use the credentials from this existing data source. If the `AlternateDataSourceParameters` list is null, the `Credentials` originally used with this `DataSourceParameters` are automatically allowed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-alternatedatasourceparameters
     */
    public alternateDataSourceParameters: Array<CfnDataSource.DataSourceParametersProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-awsaccountid
     */
    public awsAccountId: string | undefined;

    /**
     * The credentials Amazon QuickSight that uses to connect to your underlying source. Currently, only credentials based on user name and password are supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-credentials
     */
    public credentials: CfnDataSource.DataSourceCredentialsProperty | cdk.IResolvable | undefined;

    /**
     * An ID for the data source. This ID is unique per AWS Region for each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-datasourceid
     */
    public dataSourceId: string | undefined;

    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-datasourceparameters
     */
    public dataSourceParameters: CfnDataSource.DataSourceParametersProperty | cdk.IResolvable | undefined;

    /**
     * Error information from the last update or the creation of the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-errorinfo
     */
    public errorInfo: CfnDataSource.DataSourceErrorInfoProperty | cdk.IResolvable | undefined;

    /**
     * A display name for the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-name
     */
    public name: string | undefined;

    /**
     * A list of resource permissions on the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-permissions
     */
    public permissions: Array<CfnDataSource.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-sslproperties
     */
    public sslProperties: CfnDataSource.SslPropertiesProperty | cdk.IResolvable | undefined;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The type of the data source. To return a list of all data sources, use `ListDataSources` .
     *
     * Use `AMAZON_ELASTICSEARCH` for Amazon OpenSearch Service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-type
     */
    public type: string | undefined;

    /**
     * Use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-vpcconnectionproperties
     */
    public vpcConnectionProperties: CfnDataSource.VpcConnectionPropertiesProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::QuickSight::DataSource`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataSourceProps = {}) {
        super(scope, id, { type: CfnDataSource.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.alternateDataSourceParameters = props.alternateDataSourceParameters;
        this.awsAccountId = props.awsAccountId;
        this.credentials = props.credentials;
        this.dataSourceId = props.dataSourceId;
        this.dataSourceParameters = props.dataSourceParameters;
        this.errorInfo = props.errorInfo;
        this.name = props.name;
        this.permissions = props.permissions;
        this.sslProperties = props.sslProperties;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QuickSight::DataSource", props.tags, { tagPropertyName: 'tags' });
        this.type = props.type;
        this.vpcConnectionProperties = props.vpcConnectionProperties;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataSource.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            alternateDataSourceParameters: this.alternateDataSourceParameters,
            awsAccountId: this.awsAccountId,
            credentials: this.credentials,
            dataSourceId: this.dataSourceId,
            dataSourceParameters: this.dataSourceParameters,
            errorInfo: this.errorInfo,
            name: this.name,
            permissions: this.permissions,
            sslProperties: this.sslProperties,
            tags: this.tags.renderTags(),
            type: this.type,
            vpcConnectionProperties: this.vpcConnectionProperties,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataSourcePropsToCloudFormation(props);
    }
}

export namespace CfnDataSource {
    /**
     * The parameters for OpenSearch.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-amazonelasticsearchparameters.html
     */
    export interface AmazonElasticsearchParametersProperty {
        /**
         * The OpenSearch domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-amazonelasticsearchparameters.html#cfn-quicksight-datasource-amazonelasticsearchparameters-domain
         */
        readonly domain: string;
    }
}

/**
 * Determine whether the given properties match those of a `AmazonElasticsearchParametersProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonElasticsearchParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_AmazonElasticsearchParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domain', cdk.requiredValidator)(properties.domain));
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    return errors.wrap('supplied properties not correct for "AmazonElasticsearchParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AmazonElasticsearchParameters` resource
 *
 * @param properties - the TypeScript properties of a `AmazonElasticsearchParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AmazonElasticsearchParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceAmazonElasticsearchParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_AmazonElasticsearchParametersPropertyValidator(properties).assertSuccess();
    return {
        Domain: cdk.stringToCloudFormation(properties.domain),
    };
}

// @ts-ignore TS6133
function CfnDataSourceAmazonElasticsearchParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AmazonElasticsearchParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AmazonElasticsearchParametersProperty>();
    ret.addPropertyResult('domain', 'Domain', cfn_parse.FromCloudFormation.getString(properties.Domain));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for OpenSearch.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-amazonopensearchparameters.html
     */
    export interface AmazonOpenSearchParametersProperty {
        /**
         * The OpenSearch domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-amazonopensearchparameters.html#cfn-quicksight-datasource-amazonopensearchparameters-domain
         */
        readonly domain: string;
    }
}

/**
 * Determine whether the given properties match those of a `AmazonOpenSearchParametersProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonOpenSearchParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_AmazonOpenSearchParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domain', cdk.requiredValidator)(properties.domain));
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    return errors.wrap('supplied properties not correct for "AmazonOpenSearchParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AmazonOpenSearchParameters` resource
 *
 * @param properties - the TypeScript properties of a `AmazonOpenSearchParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AmazonOpenSearchParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceAmazonOpenSearchParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_AmazonOpenSearchParametersPropertyValidator(properties).assertSuccess();
    return {
        Domain: cdk.stringToCloudFormation(properties.domain),
    };
}

// @ts-ignore TS6133
function CfnDataSourceAmazonOpenSearchParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AmazonOpenSearchParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AmazonOpenSearchParametersProperty>();
    ret.addPropertyResult('domain', 'Domain', cfn_parse.FromCloudFormation.getString(properties.Domain));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Parameters for Amazon Athena.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-athenaparameters.html
     */
    export interface AthenaParametersProperty {
        /**
         * The workgroup that Amazon Athena uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-athenaparameters.html#cfn-quicksight-datasource-athenaparameters-workgroup
         */
        readonly workGroup?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AthenaParametersProperty`
 *
 * @param properties - the TypeScript properties of a `AthenaParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_AthenaParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('workGroup', cdk.validateString)(properties.workGroup));
    return errors.wrap('supplied properties not correct for "AthenaParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AthenaParameters` resource
 *
 * @param properties - the TypeScript properties of a `AthenaParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AthenaParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceAthenaParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_AthenaParametersPropertyValidator(properties).assertSuccess();
    return {
        WorkGroup: cdk.stringToCloudFormation(properties.workGroup),
    };
}

// @ts-ignore TS6133
function CfnDataSourceAthenaParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AthenaParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AthenaParametersProperty>();
    ret.addPropertyResult('workGroup', 'WorkGroup', properties.WorkGroup != null ? cfn_parse.FromCloudFormation.getString(properties.WorkGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Parameters for Amazon Aurora.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-auroraparameters.html
     */
    export interface AuroraParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-auroraparameters.html#cfn-quicksight-datasource-auroraparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-auroraparameters.html#cfn-quicksight-datasource-auroraparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-auroraparameters.html#cfn-quicksight-datasource-auroraparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `AuroraParametersProperty`
 *
 * @param properties - the TypeScript properties of a `AuroraParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_AuroraParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "AuroraParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AuroraParameters` resource
 *
 * @param properties - the TypeScript properties of a `AuroraParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AuroraParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceAuroraParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_AuroraParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceAuroraParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AuroraParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AuroraParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Parameters for Amazon Aurora PostgreSQL-Compatible Edition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-aurorapostgresqlparameters.html
     */
    export interface AuroraPostgreSqlParametersProperty {
        /**
         * The Amazon Aurora PostgreSQL database to connect to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-aurorapostgresqlparameters.html#cfn-quicksight-datasource-aurorapostgresqlparameters-database
         */
        readonly database: string;
        /**
         * The Amazon Aurora PostgreSQL-Compatible host to connect to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-aurorapostgresqlparameters.html#cfn-quicksight-datasource-aurorapostgresqlparameters-host
         */
        readonly host: string;
        /**
         * The port that Amazon Aurora PostgreSQL is listening on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-aurorapostgresqlparameters.html#cfn-quicksight-datasource-aurorapostgresqlparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `AuroraPostgreSqlParametersProperty`
 *
 * @param properties - the TypeScript properties of a `AuroraPostgreSqlParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_AuroraPostgreSqlParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "AuroraPostgreSqlParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AuroraPostgreSqlParameters` resource
 *
 * @param properties - the TypeScript properties of a `AuroraPostgreSqlParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.AuroraPostgreSqlParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceAuroraPostgreSqlParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_AuroraPostgreSqlParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceAuroraPostgreSqlParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AuroraPostgreSqlParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AuroraPostgreSqlParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The combination of user name and password that are used as credentials.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-credentialpair.html
     */
    export interface CredentialPairProperty {
        /**
         * A set of alternate data source parameters that you want to share for these credentials. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the `DataSourceParameters` structure that's in the request with the structures in the `AlternateDataSourceParameters` allow list. If the structures are an exact match, the request is allowed to use the new data source with the existing credentials. If the `AlternateDataSourceParameters` list is null, the `DataSourceParameters` originally used with these `Credentials` is automatically allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-credentialpair.html#cfn-quicksight-datasource-credentialpair-alternatedatasourceparameters
         */
        readonly alternateDataSourceParameters?: Array<CfnDataSource.DataSourceParametersProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Password.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-credentialpair.html#cfn-quicksight-datasource-credentialpair-password
         */
        readonly password: string;
        /**
         * User name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-credentialpair.html#cfn-quicksight-datasource-credentialpair-username
         */
        readonly username: string;
    }
}

/**
 * Determine whether the given properties match those of a `CredentialPairProperty`
 *
 * @param properties - the TypeScript properties of a `CredentialPairProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_CredentialPairPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alternateDataSourceParameters', cdk.listValidator(CfnDataSource_DataSourceParametersPropertyValidator))(properties.alternateDataSourceParameters));
    errors.collect(cdk.propertyValidator('password', cdk.requiredValidator)(properties.password));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('username', cdk.requiredValidator)(properties.username));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "CredentialPairProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.CredentialPair` resource
 *
 * @param properties - the TypeScript properties of a `CredentialPairProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.CredentialPair` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceCredentialPairPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_CredentialPairPropertyValidator(properties).assertSuccess();
    return {
        AlternateDataSourceParameters: cdk.listMapper(cfnDataSourceDataSourceParametersPropertyToCloudFormation)(properties.alternateDataSourceParameters),
        Password: cdk.stringToCloudFormation(properties.password),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnDataSourceCredentialPairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.CredentialPairProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.CredentialPairProperty>();
    ret.addPropertyResult('alternateDataSourceParameters', 'AlternateDataSourceParameters', properties.AlternateDataSourceParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceParametersPropertyFromCloudFormation)(properties.AlternateDataSourceParameters) : undefined);
    ret.addPropertyResult('password', 'Password', cfn_parse.FromCloudFormation.getString(properties.Password));
    ret.addPropertyResult('username', 'Username', cfn_parse.FromCloudFormation.getString(properties.Username));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Data source credentials. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourcecredentials.html
     */
    export interface DataSourceCredentialsProperty {
        /**
         * The Amazon Resource Name (ARN) of a data source that has the credential pair that you want to use. When `CopySourceArn` is not null, the credential pair from the data source in the ARN is used as the credentials for the `DataSourceCredentials` structure.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourcecredentials.html#cfn-quicksight-datasource-datasourcecredentials-copysourcearn
         */
        readonly copySourceArn?: string;
        /**
         * Credential pair. For more information, see `[CredentialPair](https://docs.aws.amazon.com/quicksight/latest/APIReference/API_CredentialPair.html)` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourcecredentials.html#cfn-quicksight-datasource-datasourcecredentials-credentialpair
         */
        readonly credentialPair?: CfnDataSource.CredentialPairProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the secret associated with the data source in Amazon Secrets Manager.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourcecredentials.html#cfn-quicksight-datasource-datasourcecredentials-secretarn
         */
        readonly secretArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataSourceCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceCredentialsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_DataSourceCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('copySourceArn', cdk.validateString)(properties.copySourceArn));
    errors.collect(cdk.propertyValidator('credentialPair', CfnDataSource_CredentialPairPropertyValidator)(properties.credentialPair));
    errors.collect(cdk.propertyValidator('secretArn', cdk.validateString)(properties.secretArn));
    return errors.wrap('supplied properties not correct for "DataSourceCredentialsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.DataSourceCredentials` resource
 *
 * @param properties - the TypeScript properties of a `DataSourceCredentialsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.DataSourceCredentials` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceDataSourceCredentialsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_DataSourceCredentialsPropertyValidator(properties).assertSuccess();
    return {
        CopySourceArn: cdk.stringToCloudFormation(properties.copySourceArn),
        CredentialPair: cfnDataSourceCredentialPairPropertyToCloudFormation(properties.credentialPair),
        SecretArn: cdk.stringToCloudFormation(properties.secretArn),
    };
}

// @ts-ignore TS6133
function CfnDataSourceDataSourceCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DataSourceCredentialsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DataSourceCredentialsProperty>();
    ret.addPropertyResult('copySourceArn', 'CopySourceArn', properties.CopySourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.CopySourceArn) : undefined);
    ret.addPropertyResult('credentialPair', 'CredentialPair', properties.CredentialPair != null ? CfnDataSourceCredentialPairPropertyFromCloudFormation(properties.CredentialPair) : undefined);
    ret.addPropertyResult('secretArn', 'SecretArn', properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Error information for the data source creation or update.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceerrorinfo.html
     */
    export interface DataSourceErrorInfoProperty {
        /**
         * Error message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceerrorinfo.html#cfn-quicksight-datasource-datasourceerrorinfo-message
         */
        readonly message?: string;
        /**
         * Error type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceerrorinfo.html#cfn-quicksight-datasource-datasourceerrorinfo-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataSourceErrorInfoProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceErrorInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_DataSourceErrorInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('message', cdk.validateString)(properties.message));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "DataSourceErrorInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.DataSourceErrorInfo` resource
 *
 * @param properties - the TypeScript properties of a `DataSourceErrorInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.DataSourceErrorInfo` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceDataSourceErrorInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_DataSourceErrorInfoPropertyValidator(properties).assertSuccess();
    return {
        Message: cdk.stringToCloudFormation(properties.message),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnDataSourceDataSourceErrorInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DataSourceErrorInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DataSourceErrorInfoProperty>();
    ret.addPropertyResult('message', 'Message', properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying data source. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html
     */
    export interface DataSourceParametersProperty {
        /**
         * The parameters for OpenSearch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-amazonelasticsearchparameters
         */
        readonly amazonElasticsearchParameters?: CfnDataSource.AmazonElasticsearchParametersProperty | cdk.IResolvable;
        /**
         * The parameters for OpenSearch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-amazonopensearchparameters
         */
        readonly amazonOpenSearchParameters?: CfnDataSource.AmazonOpenSearchParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon Athena.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-athenaparameters
         */
        readonly athenaParameters?: CfnDataSource.AthenaParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon Aurora MySQL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-auroraparameters
         */
        readonly auroraParameters?: CfnDataSource.AuroraParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon Aurora.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-aurorapostgresqlparameters
         */
        readonly auroraPostgreSqlParameters?: CfnDataSource.AuroraPostgreSqlParametersProperty | cdk.IResolvable;
        /**
         * The required parameters that are needed to connect to a Databricks data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-databricksparameters
         */
        readonly databricksParameters?: CfnDataSource.DatabricksParametersProperty | cdk.IResolvable;
        /**
         * The parameters for MariaDB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-mariadbparameters
         */
        readonly mariaDbParameters?: CfnDataSource.MariaDbParametersProperty | cdk.IResolvable;
        /**
         * The parameters for MySQL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-mysqlparameters
         */
        readonly mySqlParameters?: CfnDataSource.MySqlParametersProperty | cdk.IResolvable;
        /**
         * Oracle parameters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-oracleparameters
         */
        readonly oracleParameters?: CfnDataSource.OracleParametersProperty | cdk.IResolvable;
        /**
         * The parameters for PostgreSQL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-postgresqlparameters
         */
        readonly postgreSqlParameters?: CfnDataSource.PostgreSqlParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Presto.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-prestoparameters
         */
        readonly prestoParameters?: CfnDataSource.PrestoParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon RDS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-rdsparameters
         */
        readonly rdsParameters?: CfnDataSource.RdsParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon Redshift.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-redshiftparameters
         */
        readonly redshiftParameters?: CfnDataSource.RedshiftParametersProperty | cdk.IResolvable;
        /**
         * The parameters for S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-s3parameters
         */
        readonly s3Parameters?: CfnDataSource.S3ParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Snowflake.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-snowflakeparameters
         */
        readonly snowflakeParameters?: CfnDataSource.SnowflakeParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Spark.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-sparkparameters
         */
        readonly sparkParameters?: CfnDataSource.SparkParametersProperty | cdk.IResolvable;
        /**
         * The parameters for SQL Server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-sqlserverparameters
         */
        readonly sqlServerParameters?: CfnDataSource.SqlServerParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Teradata.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-teradataparameters
         */
        readonly teradataParameters?: CfnDataSource.TeradataParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DataSourceParametersProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_DataSourceParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('amazonElasticsearchParameters', CfnDataSource_AmazonElasticsearchParametersPropertyValidator)(properties.amazonElasticsearchParameters));
    errors.collect(cdk.propertyValidator('amazonOpenSearchParameters', CfnDataSource_AmazonOpenSearchParametersPropertyValidator)(properties.amazonOpenSearchParameters));
    errors.collect(cdk.propertyValidator('athenaParameters', CfnDataSource_AthenaParametersPropertyValidator)(properties.athenaParameters));
    errors.collect(cdk.propertyValidator('auroraParameters', CfnDataSource_AuroraParametersPropertyValidator)(properties.auroraParameters));
    errors.collect(cdk.propertyValidator('auroraPostgreSqlParameters', CfnDataSource_AuroraPostgreSqlParametersPropertyValidator)(properties.auroraPostgreSqlParameters));
    errors.collect(cdk.propertyValidator('databricksParameters', CfnDataSource_DatabricksParametersPropertyValidator)(properties.databricksParameters));
    errors.collect(cdk.propertyValidator('mariaDbParameters', CfnDataSource_MariaDbParametersPropertyValidator)(properties.mariaDbParameters));
    errors.collect(cdk.propertyValidator('mySqlParameters', CfnDataSource_MySqlParametersPropertyValidator)(properties.mySqlParameters));
    errors.collect(cdk.propertyValidator('oracleParameters', CfnDataSource_OracleParametersPropertyValidator)(properties.oracleParameters));
    errors.collect(cdk.propertyValidator('postgreSqlParameters', CfnDataSource_PostgreSqlParametersPropertyValidator)(properties.postgreSqlParameters));
    errors.collect(cdk.propertyValidator('prestoParameters', CfnDataSource_PrestoParametersPropertyValidator)(properties.prestoParameters));
    errors.collect(cdk.propertyValidator('rdsParameters', CfnDataSource_RdsParametersPropertyValidator)(properties.rdsParameters));
    errors.collect(cdk.propertyValidator('redshiftParameters', CfnDataSource_RedshiftParametersPropertyValidator)(properties.redshiftParameters));
    errors.collect(cdk.propertyValidator('s3Parameters', CfnDataSource_S3ParametersPropertyValidator)(properties.s3Parameters));
    errors.collect(cdk.propertyValidator('snowflakeParameters', CfnDataSource_SnowflakeParametersPropertyValidator)(properties.snowflakeParameters));
    errors.collect(cdk.propertyValidator('sparkParameters', CfnDataSource_SparkParametersPropertyValidator)(properties.sparkParameters));
    errors.collect(cdk.propertyValidator('sqlServerParameters', CfnDataSource_SqlServerParametersPropertyValidator)(properties.sqlServerParameters));
    errors.collect(cdk.propertyValidator('teradataParameters', CfnDataSource_TeradataParametersPropertyValidator)(properties.teradataParameters));
    return errors.wrap('supplied properties not correct for "DataSourceParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.DataSourceParameters` resource
 *
 * @param properties - the TypeScript properties of a `DataSourceParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.DataSourceParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceDataSourceParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_DataSourceParametersPropertyValidator(properties).assertSuccess();
    return {
        AmazonElasticsearchParameters: cfnDataSourceAmazonElasticsearchParametersPropertyToCloudFormation(properties.amazonElasticsearchParameters),
        AmazonOpenSearchParameters: cfnDataSourceAmazonOpenSearchParametersPropertyToCloudFormation(properties.amazonOpenSearchParameters),
        AthenaParameters: cfnDataSourceAthenaParametersPropertyToCloudFormation(properties.athenaParameters),
        AuroraParameters: cfnDataSourceAuroraParametersPropertyToCloudFormation(properties.auroraParameters),
        AuroraPostgreSqlParameters: cfnDataSourceAuroraPostgreSqlParametersPropertyToCloudFormation(properties.auroraPostgreSqlParameters),
        DatabricksParameters: cfnDataSourceDatabricksParametersPropertyToCloudFormation(properties.databricksParameters),
        MariaDbParameters: cfnDataSourceMariaDbParametersPropertyToCloudFormation(properties.mariaDbParameters),
        MySqlParameters: cfnDataSourceMySqlParametersPropertyToCloudFormation(properties.mySqlParameters),
        OracleParameters: cfnDataSourceOracleParametersPropertyToCloudFormation(properties.oracleParameters),
        PostgreSqlParameters: cfnDataSourcePostgreSqlParametersPropertyToCloudFormation(properties.postgreSqlParameters),
        PrestoParameters: cfnDataSourcePrestoParametersPropertyToCloudFormation(properties.prestoParameters),
        RdsParameters: cfnDataSourceRdsParametersPropertyToCloudFormation(properties.rdsParameters),
        RedshiftParameters: cfnDataSourceRedshiftParametersPropertyToCloudFormation(properties.redshiftParameters),
        S3Parameters: cfnDataSourceS3ParametersPropertyToCloudFormation(properties.s3Parameters),
        SnowflakeParameters: cfnDataSourceSnowflakeParametersPropertyToCloudFormation(properties.snowflakeParameters),
        SparkParameters: cfnDataSourceSparkParametersPropertyToCloudFormation(properties.sparkParameters),
        SqlServerParameters: cfnDataSourceSqlServerParametersPropertyToCloudFormation(properties.sqlServerParameters),
        TeradataParameters: cfnDataSourceTeradataParametersPropertyToCloudFormation(properties.teradataParameters),
    };
}

// @ts-ignore TS6133
function CfnDataSourceDataSourceParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DataSourceParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DataSourceParametersProperty>();
    ret.addPropertyResult('amazonElasticsearchParameters', 'AmazonElasticsearchParameters', properties.AmazonElasticsearchParameters != null ? CfnDataSourceAmazonElasticsearchParametersPropertyFromCloudFormation(properties.AmazonElasticsearchParameters) : undefined);
    ret.addPropertyResult('amazonOpenSearchParameters', 'AmazonOpenSearchParameters', properties.AmazonOpenSearchParameters != null ? CfnDataSourceAmazonOpenSearchParametersPropertyFromCloudFormation(properties.AmazonOpenSearchParameters) : undefined);
    ret.addPropertyResult('athenaParameters', 'AthenaParameters', properties.AthenaParameters != null ? CfnDataSourceAthenaParametersPropertyFromCloudFormation(properties.AthenaParameters) : undefined);
    ret.addPropertyResult('auroraParameters', 'AuroraParameters', properties.AuroraParameters != null ? CfnDataSourceAuroraParametersPropertyFromCloudFormation(properties.AuroraParameters) : undefined);
    ret.addPropertyResult('auroraPostgreSqlParameters', 'AuroraPostgreSqlParameters', properties.AuroraPostgreSqlParameters != null ? CfnDataSourceAuroraPostgreSqlParametersPropertyFromCloudFormation(properties.AuroraPostgreSqlParameters) : undefined);
    ret.addPropertyResult('databricksParameters', 'DatabricksParameters', properties.DatabricksParameters != null ? CfnDataSourceDatabricksParametersPropertyFromCloudFormation(properties.DatabricksParameters) : undefined);
    ret.addPropertyResult('mariaDbParameters', 'MariaDbParameters', properties.MariaDbParameters != null ? CfnDataSourceMariaDbParametersPropertyFromCloudFormation(properties.MariaDbParameters) : undefined);
    ret.addPropertyResult('mySqlParameters', 'MySqlParameters', properties.MySqlParameters != null ? CfnDataSourceMySqlParametersPropertyFromCloudFormation(properties.MySqlParameters) : undefined);
    ret.addPropertyResult('oracleParameters', 'OracleParameters', properties.OracleParameters != null ? CfnDataSourceOracleParametersPropertyFromCloudFormation(properties.OracleParameters) : undefined);
    ret.addPropertyResult('postgreSqlParameters', 'PostgreSqlParameters', properties.PostgreSqlParameters != null ? CfnDataSourcePostgreSqlParametersPropertyFromCloudFormation(properties.PostgreSqlParameters) : undefined);
    ret.addPropertyResult('prestoParameters', 'PrestoParameters', properties.PrestoParameters != null ? CfnDataSourcePrestoParametersPropertyFromCloudFormation(properties.PrestoParameters) : undefined);
    ret.addPropertyResult('rdsParameters', 'RdsParameters', properties.RdsParameters != null ? CfnDataSourceRdsParametersPropertyFromCloudFormation(properties.RdsParameters) : undefined);
    ret.addPropertyResult('redshiftParameters', 'RedshiftParameters', properties.RedshiftParameters != null ? CfnDataSourceRedshiftParametersPropertyFromCloudFormation(properties.RedshiftParameters) : undefined);
    ret.addPropertyResult('s3Parameters', 'S3Parameters', properties.S3Parameters != null ? CfnDataSourceS3ParametersPropertyFromCloudFormation(properties.S3Parameters) : undefined);
    ret.addPropertyResult('snowflakeParameters', 'SnowflakeParameters', properties.SnowflakeParameters != null ? CfnDataSourceSnowflakeParametersPropertyFromCloudFormation(properties.SnowflakeParameters) : undefined);
    ret.addPropertyResult('sparkParameters', 'SparkParameters', properties.SparkParameters != null ? CfnDataSourceSparkParametersPropertyFromCloudFormation(properties.SparkParameters) : undefined);
    ret.addPropertyResult('sqlServerParameters', 'SqlServerParameters', properties.SqlServerParameters != null ? CfnDataSourceSqlServerParametersPropertyFromCloudFormation(properties.SqlServerParameters) : undefined);
    ret.addPropertyResult('teradataParameters', 'TeradataParameters', properties.TeradataParameters != null ? CfnDataSourceTeradataParametersPropertyFromCloudFormation(properties.TeradataParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The required parameters that are needed to connect to a Databricks data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-databricksparameters.html
     */
    export interface DatabricksParametersProperty {
        /**
         * The host name of the Databricks data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-databricksparameters.html#cfn-quicksight-datasource-databricksparameters-host
         */
        readonly host: string;
        /**
         * The port for the Databricks data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-databricksparameters.html#cfn-quicksight-datasource-databricksparameters-port
         */
        readonly port: number;
        /**
         * The HTTP path of the Databricks data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-databricksparameters.html#cfn-quicksight-datasource-databricksparameters-sqlendpointpath
         */
        readonly sqlEndpointPath: string;
    }
}

/**
 * Determine whether the given properties match those of a `DatabricksParametersProperty`
 *
 * @param properties - the TypeScript properties of a `DatabricksParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_DatabricksParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('sqlEndpointPath', cdk.requiredValidator)(properties.sqlEndpointPath));
    errors.collect(cdk.propertyValidator('sqlEndpointPath', cdk.validateString)(properties.sqlEndpointPath));
    return errors.wrap('supplied properties not correct for "DatabricksParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.DatabricksParameters` resource
 *
 * @param properties - the TypeScript properties of a `DatabricksParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.DatabricksParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceDatabricksParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_DatabricksParametersPropertyValidator(properties).assertSuccess();
    return {
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
        SqlEndpointPath: cdk.stringToCloudFormation(properties.sqlEndpointPath),
    };
}

// @ts-ignore TS6133
function CfnDataSourceDatabricksParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DatabricksParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DatabricksParametersProperty>();
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addPropertyResult('sqlEndpointPath', 'SqlEndpointPath', cfn_parse.FromCloudFormation.getString(properties.SqlEndpointPath));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Amazon S3 manifest file location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-manifestfilelocation.html
     */
    export interface ManifestFileLocationProperty {
        /**
         * Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-manifestfilelocation.html#cfn-quicksight-datasource-manifestfilelocation-bucket
         */
        readonly bucket: string;
        /**
         * Amazon S3 key that identifies an object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-manifestfilelocation.html#cfn-quicksight-datasource-manifestfilelocation-key
         */
        readonly key: string;
    }
}

/**
 * Determine whether the given properties match those of a `ManifestFileLocationProperty`
 *
 * @param properties - the TypeScript properties of a `ManifestFileLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_ManifestFileLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    return errors.wrap('supplied properties not correct for "ManifestFileLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.ManifestFileLocation` resource
 *
 * @param properties - the TypeScript properties of a `ManifestFileLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.ManifestFileLocation` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceManifestFileLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_ManifestFileLocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
    };
}

// @ts-ignore TS6133
function CfnDataSourceManifestFileLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ManifestFileLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ManifestFileLocationProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for MariaDB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mariadbparameters.html
     */
    export interface MariaDbParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mariadbparameters.html#cfn-quicksight-datasource-mariadbparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mariadbparameters.html#cfn-quicksight-datasource-mariadbparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mariadbparameters.html#cfn-quicksight-datasource-mariadbparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `MariaDbParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MariaDbParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_MariaDbParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "MariaDbParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.MariaDbParameters` resource
 *
 * @param properties - the TypeScript properties of a `MariaDbParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.MariaDbParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceMariaDbParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_MariaDbParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceMariaDbParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.MariaDbParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.MariaDbParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for MySQL.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mysqlparameters.html
     */
    export interface MySqlParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mysqlparameters.html#cfn-quicksight-datasource-mysqlparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mysqlparameters.html#cfn-quicksight-datasource-mysqlparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mysqlparameters.html#cfn-quicksight-datasource-mysqlparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `MySqlParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MySqlParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_MySqlParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "MySqlParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.MySqlParameters` resource
 *
 * @param properties - the TypeScript properties of a `MySqlParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.MySqlParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceMySqlParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_MySqlParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceMySqlParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.MySqlParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.MySqlParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Oracle parameters.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-oracleparameters.html
     */
    export interface OracleParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-oracleparameters.html#cfn-quicksight-datasource-oracleparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-oracleparameters.html#cfn-quicksight-datasource-oracleparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-oracleparameters.html#cfn-quicksight-datasource-oracleparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `OracleParametersProperty`
 *
 * @param properties - the TypeScript properties of a `OracleParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_OracleParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "OracleParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.OracleParameters` resource
 *
 * @param properties - the TypeScript properties of a `OracleParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.OracleParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceOracleParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_OracleParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceOracleParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.OracleParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.OracleParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for PostgreSQL.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-postgresqlparameters.html
     */
    export interface PostgreSqlParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-postgresqlparameters.html#cfn-quicksight-datasource-postgresqlparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-postgresqlparameters.html#cfn-quicksight-datasource-postgresqlparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-postgresqlparameters.html#cfn-quicksight-datasource-postgresqlparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `PostgreSqlParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PostgreSqlParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_PostgreSqlParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "PostgreSqlParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.PostgreSqlParameters` resource
 *
 * @param properties - the TypeScript properties of a `PostgreSqlParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.PostgreSqlParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourcePostgreSqlParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_PostgreSqlParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourcePostgreSqlParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.PostgreSqlParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.PostgreSqlParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for Presto.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-prestoparameters.html
     */
    export interface PrestoParametersProperty {
        /**
         * Catalog.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-prestoparameters.html#cfn-quicksight-datasource-prestoparameters-catalog
         */
        readonly catalog: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-prestoparameters.html#cfn-quicksight-datasource-prestoparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-prestoparameters.html#cfn-quicksight-datasource-prestoparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `PrestoParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PrestoParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_PrestoParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalog', cdk.requiredValidator)(properties.catalog));
    errors.collect(cdk.propertyValidator('catalog', cdk.validateString)(properties.catalog));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "PrestoParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.PrestoParameters` resource
 *
 * @param properties - the TypeScript properties of a `PrestoParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.PrestoParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourcePrestoParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_PrestoParametersPropertyValidator(properties).assertSuccess();
    return {
        Catalog: cdk.stringToCloudFormation(properties.catalog),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourcePrestoParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.PrestoParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.PrestoParametersProperty>();
    ret.addPropertyResult('catalog', 'Catalog', cfn_parse.FromCloudFormation.getString(properties.Catalog));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for Amazon RDS.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-rdsparameters.html
     */
    export interface RdsParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-rdsparameters.html#cfn-quicksight-datasource-rdsparameters-database
         */
        readonly database: string;
        /**
         * Instance ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-rdsparameters.html#cfn-quicksight-datasource-rdsparameters-instanceid
         */
        readonly instanceId: string;
    }
}

/**
 * Determine whether the given properties match those of a `RdsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `RdsParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_RdsParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('instanceId', cdk.requiredValidator)(properties.instanceId));
    errors.collect(cdk.propertyValidator('instanceId', cdk.validateString)(properties.instanceId));
    return errors.wrap('supplied properties not correct for "RdsParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.RdsParameters` resource
 *
 * @param properties - the TypeScript properties of a `RdsParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.RdsParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceRdsParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_RdsParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        InstanceId: cdk.stringToCloudFormation(properties.instanceId),
    };
}

// @ts-ignore TS6133
function CfnDataSourceRdsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.RdsParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.RdsParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('instanceId', 'InstanceId', cfn_parse.FromCloudFormation.getString(properties.InstanceId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for Amazon Redshift. The `ClusterId` field can be blank if `Host` and `Port` are both set. The `Host` and `Port` fields can be blank if the `ClusterId` field is set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html
     */
    export interface RedshiftParametersProperty {
        /**
         * Cluster ID. This field can be blank if the `Host` and `Port` are provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html#cfn-quicksight-datasource-redshiftparameters-clusterid
         */
        readonly clusterId?: string;
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html#cfn-quicksight-datasource-redshiftparameters-database
         */
        readonly database: string;
        /**
         * Host. This field can be blank if `ClusterId` is provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html#cfn-quicksight-datasource-redshiftparameters-host
         */
        readonly host?: string;
        /**
         * Port. This field can be blank if the `ClusterId` is provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html#cfn-quicksight-datasource-redshiftparameters-port
         */
        readonly port?: number;
    }
}

/**
 * Determine whether the given properties match those of a `RedshiftParametersProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_RedshiftParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterId', cdk.validateString)(properties.clusterId));
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "RedshiftParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.RedshiftParameters` resource
 *
 * @param properties - the TypeScript properties of a `RedshiftParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.RedshiftParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceRedshiftParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_RedshiftParametersPropertyValidator(properties).assertSuccess();
    return {
        ClusterId: cdk.stringToCloudFormation(properties.clusterId),
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceRedshiftParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.RedshiftParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.RedshiftParametersProperty>();
    ret.addPropertyResult('clusterId', 'ClusterId', properties.ClusterId != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterId) : undefined);
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-resourcepermission.html
     */
    export interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-resourcepermission.html#cfn-quicksight-datasource-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-resourcepermission.html#cfn-quicksight-datasource-resourcepermission-principal
         */
        readonly principal: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourcePermissionProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_ResourcePermissionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(cdk.validateString))(properties.actions));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    return errors.wrap('supplied properties not correct for "ResourcePermissionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.ResourcePermission` resource
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.ResourcePermission` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceResourcePermissionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_ResourcePermissionPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
        Principal: cdk.stringToCloudFormation(properties.principal),
    };
}

// @ts-ignore TS6133
function CfnDataSourceResourcePermissionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ResourcePermissionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ResourcePermissionProperty>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getStringArray(properties.Actions));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for S3.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-s3parameters.html
     */
    export interface S3ParametersProperty {
        /**
         * Location of the Amazon S3 manifest file. This is NULL if the manifest file was uploaded into Amazon QuickSight.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-s3parameters.html#cfn-quicksight-datasource-s3parameters-manifestfilelocation
         */
        readonly manifestFileLocation: CfnDataSource.ManifestFileLocationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3ParametersProperty`
 *
 * @param properties - the TypeScript properties of a `S3ParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_S3ParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('manifestFileLocation', cdk.requiredValidator)(properties.manifestFileLocation));
    errors.collect(cdk.propertyValidator('manifestFileLocation', CfnDataSource_ManifestFileLocationPropertyValidator)(properties.manifestFileLocation));
    return errors.wrap('supplied properties not correct for "S3ParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.S3Parameters` resource
 *
 * @param properties - the TypeScript properties of a `S3ParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.S3Parameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceS3ParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_S3ParametersPropertyValidator(properties).assertSuccess();
    return {
        ManifestFileLocation: cfnDataSourceManifestFileLocationPropertyToCloudFormation(properties.manifestFileLocation),
    };
}

// @ts-ignore TS6133
function CfnDataSourceS3ParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.S3ParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.S3ParametersProperty>();
    ret.addPropertyResult('manifestFileLocation', 'ManifestFileLocation', CfnDataSourceManifestFileLocationPropertyFromCloudFormation(properties.ManifestFileLocation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for Snowflake.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-snowflakeparameters.html
     */
    export interface SnowflakeParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-snowflakeparameters.html#cfn-quicksight-datasource-snowflakeparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-snowflakeparameters.html#cfn-quicksight-datasource-snowflakeparameters-host
         */
        readonly host: string;
        /**
         * Warehouse.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-snowflakeparameters.html#cfn-quicksight-datasource-snowflakeparameters-warehouse
         */
        readonly warehouse: string;
    }
}

/**
 * Determine whether the given properties match those of a `SnowflakeParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SnowflakeParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_SnowflakeParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('warehouse', cdk.requiredValidator)(properties.warehouse));
    errors.collect(cdk.propertyValidator('warehouse', cdk.validateString)(properties.warehouse));
    return errors.wrap('supplied properties not correct for "SnowflakeParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.SnowflakeParameters` resource
 *
 * @param properties - the TypeScript properties of a `SnowflakeParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.SnowflakeParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceSnowflakeParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_SnowflakeParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Warehouse: cdk.stringToCloudFormation(properties.warehouse),
    };
}

// @ts-ignore TS6133
function CfnDataSourceSnowflakeParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.SnowflakeParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SnowflakeParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('warehouse', 'Warehouse', cfn_parse.FromCloudFormation.getString(properties.Warehouse));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for Spark.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sparkparameters.html
     */
    export interface SparkParametersProperty {
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sparkparameters.html#cfn-quicksight-datasource-sparkparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sparkparameters.html#cfn-quicksight-datasource-sparkparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `SparkParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SparkParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_SparkParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "SparkParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.SparkParameters` resource
 *
 * @param properties - the TypeScript properties of a `SparkParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.SparkParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceSparkParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_SparkParametersPropertyValidator(properties).assertSuccess();
    return {
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceSparkParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.SparkParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SparkParametersProperty>();
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for SQL Server.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sqlserverparameters.html
     */
    export interface SqlServerParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sqlserverparameters.html#cfn-quicksight-datasource-sqlserverparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sqlserverparameters.html#cfn-quicksight-datasource-sqlserverparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sqlserverparameters.html#cfn-quicksight-datasource-sqlserverparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `SqlServerParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SqlServerParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_SqlServerParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "SqlServerParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.SqlServerParameters` resource
 *
 * @param properties - the TypeScript properties of a `SqlServerParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.SqlServerParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceSqlServerParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_SqlServerParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceSqlServerParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.SqlServerParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SqlServerParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sslproperties.html
     */
    export interface SslPropertiesProperty {
        /**
         * A Boolean option to control whether SSL should be disabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sslproperties.html#cfn-quicksight-datasource-sslproperties-disablessl
         */
        readonly disableSsl?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SslPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SslPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_SslPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('disableSsl', cdk.validateBoolean)(properties.disableSsl));
    return errors.wrap('supplied properties not correct for "SslPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.SslProperties` resource
 *
 * @param properties - the TypeScript properties of a `SslPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.SslProperties` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceSslPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_SslPropertiesPropertyValidator(properties).assertSuccess();
    return {
        DisableSsl: cdk.booleanToCloudFormation(properties.disableSsl),
    };
}

// @ts-ignore TS6133
function CfnDataSourceSslPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.SslPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SslPropertiesProperty>();
    ret.addPropertyResult('disableSsl', 'DisableSsl', properties.DisableSsl != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableSsl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The parameters for Teradata.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-teradataparameters.html
     */
    export interface TeradataParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-teradataparameters.html#cfn-quicksight-datasource-teradataparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-teradataparameters.html#cfn-quicksight-datasource-teradataparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-teradataparameters.html#cfn-quicksight-datasource-teradataparameters-port
         */
        readonly port: number;
    }
}

/**
 * Determine whether the given properties match those of a `TeradataParametersProperty`
 *
 * @param properties - the TypeScript properties of a `TeradataParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_TeradataParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('host', cdk.requiredValidator)(properties.host));
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "TeradataParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.TeradataParameters` resource
 *
 * @param properties - the TypeScript properties of a `TeradataParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.TeradataParameters` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceTeradataParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_TeradataParametersPropertyValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        Host: cdk.stringToCloudFormation(properties.host),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataSourceTeradataParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.TeradataParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.TeradataParametersProperty>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('host', 'Host', cfn_parse.FromCloudFormation.getString(properties.Host));
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * VPC connection properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-vpcconnectionproperties.html
     */
    export interface VpcConnectionPropertiesProperty {
        /**
         * The Amazon Resource Name (ARN) for the VPC connection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-vpcconnectionproperties.html#cfn-quicksight-datasource-vpcconnectionproperties-vpcconnectionarn
         */
        readonly vpcConnectionArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `VpcConnectionPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConnectionPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_VpcConnectionPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('vpcConnectionArn', cdk.requiredValidator)(properties.vpcConnectionArn));
    errors.collect(cdk.propertyValidator('vpcConnectionArn', cdk.validateString)(properties.vpcConnectionArn));
    return errors.wrap('supplied properties not correct for "VpcConnectionPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.VpcConnectionProperties` resource
 *
 * @param properties - the TypeScript properties of a `VpcConnectionPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::DataSource.VpcConnectionProperties` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceVpcConnectionPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_VpcConnectionPropertiesPropertyValidator(properties).assertSuccess();
    return {
        VpcConnectionArn: cdk.stringToCloudFormation(properties.vpcConnectionArn),
    };
}

// @ts-ignore TS6133
function CfnDataSourceVpcConnectionPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.VpcConnectionPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.VpcConnectionPropertiesProperty>();
    ret.addPropertyResult('vpcConnectionArn', 'VpcConnectionArn', cfn_parse.FromCloudFormation.getString(properties.VpcConnectionArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html
 */
export interface CfnTemplateProps {

    /**
     * The ID for the AWS account that the group is in. You use the ID for the AWS account that contains your Amazon QuickSight account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-awsaccountid
     */
    readonly awsAccountId: string;

    /**
     * The entity that you are using as a source when you create the template. In `SourceEntity` , you specify the type of object you're using as source: `SourceTemplate` for a template or `SourceAnalysis` for an analysis. Both of these require an Amazon Resource Name (ARN). For `SourceTemplate` , specify the ARN of the source template. For `SourceAnalysis` , specify the ARN of the source analysis. The `SourceTemplate` ARN can contain any AWS account and any Amazon QuickSight-supported AWS Region .
     *
     * Use the `DataSetReferences` entity within `SourceTemplate` or `SourceAnalysis` to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-sourceentity
     */
    readonly sourceEntity: CfnTemplate.TemplateSourceEntityProperty | cdk.IResolvable;

    /**
     * An ID for the template that you want to create. This template is unique per AWS Region ; in each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-templateid
     */
    readonly templateId: string;

    /**
     * A display name for the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-name
     */
    readonly name?: string;

    /**
     * A list of resource permissions to be set on the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-permissions
     */
    readonly permissions?: Array<CfnTemplate.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * A description of the current template version being created. This API operation creates the first version of the template. Every time `UpdateTemplate` is called, a new version is created. Each version of the template maintains a description of the version in the `VersionDescription` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-versiondescription
     */
    readonly versionDescription?: string;
}

/**
 * Determine whether the given properties match those of a `CfnTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.requiredValidator)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.validateString)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('permissions', cdk.listValidator(CfnTemplate_ResourcePermissionPropertyValidator))(properties.permissions));
    errors.collect(cdk.propertyValidator('sourceEntity', cdk.requiredValidator)(properties.sourceEntity));
    errors.collect(cdk.propertyValidator('sourceEntity', CfnTemplate_TemplateSourceEntityPropertyValidator)(properties.sourceEntity));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('templateId', cdk.requiredValidator)(properties.templateId));
    errors.collect(cdk.propertyValidator('templateId', cdk.validateString)(properties.templateId));
    errors.collect(cdk.propertyValidator('versionDescription', cdk.validateString)(properties.versionDescription));
    return errors.wrap('supplied properties not correct for "CfnTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template` resource
 *
 * @param properties - the TypeScript properties of a `CfnTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template` resource.
 */
// @ts-ignore TS6133
function cfnTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplatePropsValidator(properties).assertSuccess();
    return {
        AwsAccountId: cdk.stringToCloudFormation(properties.awsAccountId),
        SourceEntity: cfnTemplateTemplateSourceEntityPropertyToCloudFormation(properties.sourceEntity),
        TemplateId: cdk.stringToCloudFormation(properties.templateId),
        Name: cdk.stringToCloudFormation(properties.name),
        Permissions: cdk.listMapper(cfnTemplateResourcePermissionPropertyToCloudFormation)(properties.permissions),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VersionDescription: cdk.stringToCloudFormation(properties.versionDescription),
    };
}

// @ts-ignore TS6133
function CfnTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplateProps>();
    ret.addPropertyResult('awsAccountId', 'AwsAccountId', cfn_parse.FromCloudFormation.getString(properties.AwsAccountId));
    ret.addPropertyResult('sourceEntity', 'SourceEntity', CfnTemplateTemplateSourceEntityPropertyFromCloudFormation(properties.SourceEntity));
    ret.addPropertyResult('templateId', 'TemplateId', cfn_parse.FromCloudFormation.getString(properties.TemplateId));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('permissions', 'Permissions', properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(CfnTemplateResourcePermissionPropertyFromCloudFormation)(properties.Permissions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('versionDescription', 'VersionDescription', properties.VersionDescription != null ? cfn_parse.FromCloudFormation.getString(properties.VersionDescription) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::QuickSight::Template`
 *
 * Creates a template from an existing Amazon QuickSight analysis or template. You can use the resulting template to create a dashboard.
 *
 * A *template* is an entity in Amazon QuickSight that encapsulates the metadata required to create an analysis and that you can use to create s dashboard. A template adds a layer of abstraction by using placeholders to replace the dataset associated with the analysis. You can use templates to create dashboards by replacing dataset placeholders with datasets that follow the same schema that was used to create the source analysis and template.
 *
 * @cloudformationResource AWS::QuickSight::Template
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html
 */
export class CfnTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::Template";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the template.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The time this template was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The time this template was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     *
     * @cloudformationAttribute Version.CreatedTime
     */
    public readonly attrVersionCreatedTime: string;

    /**
     *
     * @cloudformationAttribute Version.DataSetConfigurations
     */
    public readonly attrVersionDataSetConfigurations: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Version.Description
     */
    public readonly attrVersionDescription: string;

    /**
     *
     * @cloudformationAttribute Version.Errors
     */
    public readonly attrVersionErrors: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Version.Sheets
     */
    public readonly attrVersionSheets: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Version.SourceEntityArn
     */
    public readonly attrVersionSourceEntityArn: string;

    /**
     *
     * @cloudformationAttribute Version.Status
     */
    public readonly attrVersionStatus: string;

    /**
     *
     * @cloudformationAttribute Version.ThemeArn
     */
    public readonly attrVersionThemeArn: string;

    /**
     *
     * @cloudformationAttribute Version.VersionNumber
     */
    public readonly attrVersionVersionNumber: cdk.IResolvable;

    /**
     * The ID for the AWS account that the group is in. You use the ID for the AWS account that contains your Amazon QuickSight account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-awsaccountid
     */
    public awsAccountId: string;

    /**
     * The entity that you are using as a source when you create the template. In `SourceEntity` , you specify the type of object you're using as source: `SourceTemplate` for a template or `SourceAnalysis` for an analysis. Both of these require an Amazon Resource Name (ARN). For `SourceTemplate` , specify the ARN of the source template. For `SourceAnalysis` , specify the ARN of the source analysis. The `SourceTemplate` ARN can contain any AWS account and any Amazon QuickSight-supported AWS Region .
     *
     * Use the `DataSetReferences` entity within `SourceTemplate` or `SourceAnalysis` to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-sourceentity
     */
    public sourceEntity: CfnTemplate.TemplateSourceEntityProperty | cdk.IResolvable;

    /**
     * An ID for the template that you want to create. This template is unique per AWS Region ; in each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-templateid
     */
    public templateId: string;

    /**
     * A display name for the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-name
     */
    public name: string | undefined;

    /**
     * A list of resource permissions to be set on the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-permissions
     */
    public permissions: Array<CfnTemplate.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A description of the current template version being created. This API operation creates the first version of the template. Every time `UpdateTemplate` is called, a new version is created. Each version of the template maintains a description of the version in the `VersionDescription` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-versiondescription
     */
    public versionDescription: string | undefined;

    /**
     * Create a new `AWS::QuickSight::Template`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTemplateProps) {
        super(scope, id, { type: CfnTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'awsAccountId', this);
        cdk.requireProperty(props, 'sourceEntity', this);
        cdk.requireProperty(props, 'templateId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrVersionCreatedTime = cdk.Token.asString(this.getAtt('Version.CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrVersionDataSetConfigurations = this.getAtt('Version.DataSetConfigurations', cdk.ResolutionTypeHint.STRING);
        this.attrVersionDescription = cdk.Token.asString(this.getAtt('Version.Description', cdk.ResolutionTypeHint.STRING));
        this.attrVersionErrors = this.getAtt('Version.Errors', cdk.ResolutionTypeHint.STRING);
        this.attrVersionSheets = this.getAtt('Version.Sheets', cdk.ResolutionTypeHint.STRING);
        this.attrVersionSourceEntityArn = cdk.Token.asString(this.getAtt('Version.SourceEntityArn', cdk.ResolutionTypeHint.STRING));
        this.attrVersionStatus = cdk.Token.asString(this.getAtt('Version.Status', cdk.ResolutionTypeHint.STRING));
        this.attrVersionThemeArn = cdk.Token.asString(this.getAtt('Version.ThemeArn', cdk.ResolutionTypeHint.STRING));
        this.attrVersionVersionNumber = this.getAtt('Version.VersionNumber', cdk.ResolutionTypeHint.STRING);

        this.awsAccountId = props.awsAccountId;
        this.sourceEntity = props.sourceEntity;
        this.templateId = props.templateId;
        this.name = props.name;
        this.permissions = props.permissions;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QuickSight::Template", props.tags, { tagPropertyName: 'tags' });
        this.versionDescription = props.versionDescription;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            awsAccountId: this.awsAccountId,
            sourceEntity: this.sourceEntity,
            templateId: this.templateId,
            name: this.name,
            permissions: this.permissions,
            tags: this.tags.renderTags(),
            versionDescription: this.versionDescription,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTemplatePropsToCloudFormation(props);
    }
}

export namespace CfnTemplate {
    /**
     * A structure describing the name, data type, and geographic role of the columns.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupcolumnschema.html
     */
    export interface ColumnGroupColumnSchemaProperty {
        /**
         * The name of the column group's column schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupcolumnschema.html#cfn-quicksight-template-columngroupcolumnschema-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ColumnGroupColumnSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnGroupColumnSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_ColumnGroupColumnSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ColumnGroupColumnSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.ColumnGroupColumnSchema` resource
 *
 * @param properties - the TypeScript properties of a `ColumnGroupColumnSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.ColumnGroupColumnSchema` resource.
 */
// @ts-ignore TS6133
function cfnTemplateColumnGroupColumnSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_ColumnGroupColumnSchemaPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnTemplateColumnGroupColumnSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ColumnGroupColumnSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ColumnGroupColumnSchemaProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * The column group schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupschema.html
     */
    export interface ColumnGroupSchemaProperty {
        /**
         * A structure containing the list of schemas for column group columns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupschema.html#cfn-quicksight-template-columngroupschema-columngroupcolumnschemalist
         */
        readonly columnGroupColumnSchemaList?: Array<CfnTemplate.ColumnGroupColumnSchemaProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the column group schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupschema.html#cfn-quicksight-template-columngroupschema-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ColumnGroupSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnGroupSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_ColumnGroupSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnGroupColumnSchemaList', cdk.listValidator(CfnTemplate_ColumnGroupColumnSchemaPropertyValidator))(properties.columnGroupColumnSchemaList));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ColumnGroupSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.ColumnGroupSchema` resource
 *
 * @param properties - the TypeScript properties of a `ColumnGroupSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.ColumnGroupSchema` resource.
 */
// @ts-ignore TS6133
function cfnTemplateColumnGroupSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_ColumnGroupSchemaPropertyValidator(properties).assertSuccess();
    return {
        ColumnGroupColumnSchemaList: cdk.listMapper(cfnTemplateColumnGroupColumnSchemaPropertyToCloudFormation)(properties.columnGroupColumnSchemaList),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnTemplateColumnGroupSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ColumnGroupSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ColumnGroupSchemaProperty>();
    ret.addPropertyResult('columnGroupColumnSchemaList', 'ColumnGroupColumnSchemaList', properties.ColumnGroupColumnSchemaList != null ? cfn_parse.FromCloudFormation.getArray(CfnTemplateColumnGroupColumnSchemaPropertyFromCloudFormation)(properties.ColumnGroupColumnSchemaList) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * The column schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columnschema.html
     */
    export interface ColumnSchemaProperty {
        /**
         * The data type of the column schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columnschema.html#cfn-quicksight-template-columnschema-datatype
         */
        readonly dataType?: string;
        /**
         * The geographic role of the column schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columnschema.html#cfn-quicksight-template-columnschema-geographicrole
         */
        readonly geographicRole?: string;
        /**
         * The name of the column schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columnschema.html#cfn-quicksight-template-columnschema-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ColumnSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_ColumnSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('geographicRole', cdk.validateString)(properties.geographicRole));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ColumnSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.ColumnSchema` resource
 *
 * @param properties - the TypeScript properties of a `ColumnSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.ColumnSchema` resource.
 */
// @ts-ignore TS6133
function cfnTemplateColumnSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_ColumnSchemaPropertyValidator(properties).assertSuccess();
    return {
        DataType: cdk.stringToCloudFormation(properties.dataType),
        GeographicRole: cdk.stringToCloudFormation(properties.geographicRole),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnTemplateColumnSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ColumnSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ColumnSchemaProperty>();
    ret.addPropertyResult('dataType', 'DataType', properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined);
    ret.addPropertyResult('geographicRole', 'GeographicRole', properties.GeographicRole != null ? cfn_parse.FromCloudFormation.getString(properties.GeographicRole) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * Dataset configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetconfiguration.html
     */
    export interface DataSetConfigurationProperty {
        /**
         * A structure containing the list of column group schemas.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetconfiguration.html#cfn-quicksight-template-datasetconfiguration-columngroupschemalist
         */
        readonly columnGroupSchemaList?: Array<CfnTemplate.ColumnGroupSchemaProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Dataset schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetconfiguration.html#cfn-quicksight-template-datasetconfiguration-datasetschema
         */
        readonly dataSetSchema?: CfnTemplate.DataSetSchemaProperty | cdk.IResolvable;
        /**
         * Placeholder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetconfiguration.html#cfn-quicksight-template-datasetconfiguration-placeholder
         */
        readonly placeholder?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataSetConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DataSetConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_DataSetConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnGroupSchemaList', cdk.listValidator(CfnTemplate_ColumnGroupSchemaPropertyValidator))(properties.columnGroupSchemaList));
    errors.collect(cdk.propertyValidator('dataSetSchema', CfnTemplate_DataSetSchemaPropertyValidator)(properties.dataSetSchema));
    errors.collect(cdk.propertyValidator('placeholder', cdk.validateString)(properties.placeholder));
    return errors.wrap('supplied properties not correct for "DataSetConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.DataSetConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DataSetConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.DataSetConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnTemplateDataSetConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_DataSetConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ColumnGroupSchemaList: cdk.listMapper(cfnTemplateColumnGroupSchemaPropertyToCloudFormation)(properties.columnGroupSchemaList),
        DataSetSchema: cfnTemplateDataSetSchemaPropertyToCloudFormation(properties.dataSetSchema),
        Placeholder: cdk.stringToCloudFormation(properties.placeholder),
    };
}

// @ts-ignore TS6133
function CfnTemplateDataSetConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.DataSetConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.DataSetConfigurationProperty>();
    ret.addPropertyResult('columnGroupSchemaList', 'ColumnGroupSchemaList', properties.ColumnGroupSchemaList != null ? cfn_parse.FromCloudFormation.getArray(CfnTemplateColumnGroupSchemaPropertyFromCloudFormation)(properties.ColumnGroupSchemaList) : undefined);
    ret.addPropertyResult('dataSetSchema', 'DataSetSchema', properties.DataSetSchema != null ? CfnTemplateDataSetSchemaPropertyFromCloudFormation(properties.DataSetSchema) : undefined);
    ret.addPropertyResult('placeholder', 'Placeholder', properties.Placeholder != null ? cfn_parse.FromCloudFormation.getString(properties.Placeholder) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * Dataset reference.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetreference.html
     */
    export interface DataSetReferenceProperty {
        /**
         * Dataset Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetreference.html#cfn-quicksight-template-datasetreference-datasetarn
         */
        readonly dataSetArn: string;
        /**
         * Dataset placeholder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetreference.html#cfn-quicksight-template-datasetreference-datasetplaceholder
         */
        readonly dataSetPlaceholder: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataSetReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `DataSetReferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_DataSetReferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataSetArn', cdk.requiredValidator)(properties.dataSetArn));
    errors.collect(cdk.propertyValidator('dataSetArn', cdk.validateString)(properties.dataSetArn));
    errors.collect(cdk.propertyValidator('dataSetPlaceholder', cdk.requiredValidator)(properties.dataSetPlaceholder));
    errors.collect(cdk.propertyValidator('dataSetPlaceholder', cdk.validateString)(properties.dataSetPlaceholder));
    return errors.wrap('supplied properties not correct for "DataSetReferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.DataSetReference` resource
 *
 * @param properties - the TypeScript properties of a `DataSetReferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.DataSetReference` resource.
 */
// @ts-ignore TS6133
function cfnTemplateDataSetReferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_DataSetReferencePropertyValidator(properties).assertSuccess();
    return {
        DataSetArn: cdk.stringToCloudFormation(properties.dataSetArn),
        DataSetPlaceholder: cdk.stringToCloudFormation(properties.dataSetPlaceholder),
    };
}

// @ts-ignore TS6133
function CfnTemplateDataSetReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.DataSetReferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.DataSetReferenceProperty>();
    ret.addPropertyResult('dataSetArn', 'DataSetArn', cfn_parse.FromCloudFormation.getString(properties.DataSetArn));
    ret.addPropertyResult('dataSetPlaceholder', 'DataSetPlaceholder', cfn_parse.FromCloudFormation.getString(properties.DataSetPlaceholder));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * Dataset schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetschema.html
     */
    export interface DataSetSchemaProperty {
        /**
         * A structure containing the list of column schemas.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetschema.html#cfn-quicksight-template-datasetschema-columnschemalist
         */
        readonly columnSchemaList?: Array<CfnTemplate.ColumnSchemaProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DataSetSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `DataSetSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_DataSetSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnSchemaList', cdk.listValidator(CfnTemplate_ColumnSchemaPropertyValidator))(properties.columnSchemaList));
    return errors.wrap('supplied properties not correct for "DataSetSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.DataSetSchema` resource
 *
 * @param properties - the TypeScript properties of a `DataSetSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.DataSetSchema` resource.
 */
// @ts-ignore TS6133
function cfnTemplateDataSetSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_DataSetSchemaPropertyValidator(properties).assertSuccess();
    return {
        ColumnSchemaList: cdk.listMapper(cfnTemplateColumnSchemaPropertyToCloudFormation)(properties.columnSchemaList),
    };
}

// @ts-ignore TS6133
function CfnTemplateDataSetSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.DataSetSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.DataSetSchemaProperty>();
    ret.addPropertyResult('columnSchemaList', 'ColumnSchemaList', properties.ColumnSchemaList != null ? cfn_parse.FromCloudFormation.getArray(CfnTemplateColumnSchemaPropertyFromCloudFormation)(properties.ColumnSchemaList) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-resourcepermission.html
     */
    export interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-resourcepermission.html#cfn-quicksight-template-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-resourcepermission.html#cfn-quicksight-template-resourcepermission-principal
         */
        readonly principal: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourcePermissionProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_ResourcePermissionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(cdk.validateString))(properties.actions));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    return errors.wrap('supplied properties not correct for "ResourcePermissionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.ResourcePermission` resource
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.ResourcePermission` resource.
 */
// @ts-ignore TS6133
function cfnTemplateResourcePermissionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_ResourcePermissionPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
        Principal: cdk.stringToCloudFormation(properties.principal),
    };
}

// @ts-ignore TS6133
function CfnTemplateResourcePermissionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ResourcePermissionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ResourcePermissionProperty>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getStringArray(properties.Actions));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * A *sheet* , which is an object that contains a set of visuals that are viewed together on one page in Amazon QuickSight. Every analysis and dashboard contains at least one sheet. Each sheet contains at least one visualization widget, for example a chart, pivot table, or narrative insight. Sheets can be associated with other components, such as controls, filters, and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-sheet.html
     */
    export interface SheetProperty {
        /**
         * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-sheet.html#cfn-quicksight-template-sheet-name
         */
        readonly name?: string;
        /**
         * The unique identifier associated with a sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-sheet.html#cfn-quicksight-template-sheet-sheetid
         */
        readonly sheetId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SheetProperty`
 *
 * @param properties - the TypeScript properties of a `SheetProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_SheetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sheetId', cdk.validateString)(properties.sheetId));
    return errors.wrap('supplied properties not correct for "SheetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.Sheet` resource
 *
 * @param properties - the TypeScript properties of a `SheetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.Sheet` resource.
 */
// @ts-ignore TS6133
function cfnTemplateSheetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_SheetPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SheetId: cdk.stringToCloudFormation(properties.sheetId),
    };
}

// @ts-ignore TS6133
function CfnTemplateSheetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.SheetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.SheetProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sheetId', 'SheetId', properties.SheetId != null ? cfn_parse.FromCloudFormation.getString(properties.SheetId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * List of errors that occurred when the template version creation failed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateerror.html
     */
    export interface TemplateErrorProperty {
        /**
         * Description of the error type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateerror.html#cfn-quicksight-template-templateerror-message
         */
        readonly message?: string;
        /**
         * Type of error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateerror.html#cfn-quicksight-template-templateerror-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TemplateErrorProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateErrorProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_TemplateErrorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('message', cdk.validateString)(properties.message));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "TemplateErrorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateError` resource
 *
 * @param properties - the TypeScript properties of a `TemplateErrorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateError` resource.
 */
// @ts-ignore TS6133
function cfnTemplateTemplateErrorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_TemplateErrorPropertyValidator(properties).assertSuccess();
    return {
        Message: cdk.stringToCloudFormation(properties.message),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnTemplateTemplateErrorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.TemplateErrorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateErrorProperty>();
    ret.addPropertyResult('message', 'Message', properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * The source analysis of the template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceanalysis.html
     */
    export interface TemplateSourceAnalysisProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceanalysis.html#cfn-quicksight-template-templatesourceanalysis-arn
         */
        readonly arn: string;
        /**
         * A structure containing information about the dataset references used as placeholders in the template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceanalysis.html#cfn-quicksight-template-templatesourceanalysis-datasetreferences
         */
        readonly dataSetReferences: Array<CfnTemplate.DataSetReferenceProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TemplateSourceAnalysisProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateSourceAnalysisProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_TemplateSourceAnalysisPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('dataSetReferences', cdk.requiredValidator)(properties.dataSetReferences));
    errors.collect(cdk.propertyValidator('dataSetReferences', cdk.listValidator(CfnTemplate_DataSetReferencePropertyValidator))(properties.dataSetReferences));
    return errors.wrap('supplied properties not correct for "TemplateSourceAnalysisProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateSourceAnalysis` resource
 *
 * @param properties - the TypeScript properties of a `TemplateSourceAnalysisProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateSourceAnalysis` resource.
 */
// @ts-ignore TS6133
function cfnTemplateTemplateSourceAnalysisPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_TemplateSourceAnalysisPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        DataSetReferences: cdk.listMapper(cfnTemplateDataSetReferencePropertyToCloudFormation)(properties.dataSetReferences),
    };
}

// @ts-ignore TS6133
function CfnTemplateTemplateSourceAnalysisPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.TemplateSourceAnalysisProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateSourceAnalysisProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('dataSetReferences', 'DataSetReferences', cfn_parse.FromCloudFormation.getArray(CfnTemplateDataSetReferencePropertyFromCloudFormation)(properties.DataSetReferences));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * The source entity of the template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceentity.html
     */
    export interface TemplateSourceEntityProperty {
        /**
         * The source analysis, if it is based on an analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceentity.html#cfn-quicksight-template-templatesourceentity-sourceanalysis
         */
        readonly sourceAnalysis?: CfnTemplate.TemplateSourceAnalysisProperty | cdk.IResolvable;
        /**
         * The source template, if it is based on an template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceentity.html#cfn-quicksight-template-templatesourceentity-sourcetemplate
         */
        readonly sourceTemplate?: CfnTemplate.TemplateSourceTemplateProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TemplateSourceEntityProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateSourceEntityProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_TemplateSourceEntityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sourceAnalysis', CfnTemplate_TemplateSourceAnalysisPropertyValidator)(properties.sourceAnalysis));
    errors.collect(cdk.propertyValidator('sourceTemplate', CfnTemplate_TemplateSourceTemplatePropertyValidator)(properties.sourceTemplate));
    return errors.wrap('supplied properties not correct for "TemplateSourceEntityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateSourceEntity` resource
 *
 * @param properties - the TypeScript properties of a `TemplateSourceEntityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateSourceEntity` resource.
 */
// @ts-ignore TS6133
function cfnTemplateTemplateSourceEntityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_TemplateSourceEntityPropertyValidator(properties).assertSuccess();
    return {
        SourceAnalysis: cfnTemplateTemplateSourceAnalysisPropertyToCloudFormation(properties.sourceAnalysis),
        SourceTemplate: cfnTemplateTemplateSourceTemplatePropertyToCloudFormation(properties.sourceTemplate),
    };
}

// @ts-ignore TS6133
function CfnTemplateTemplateSourceEntityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.TemplateSourceEntityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateSourceEntityProperty>();
    ret.addPropertyResult('sourceAnalysis', 'SourceAnalysis', properties.SourceAnalysis != null ? CfnTemplateTemplateSourceAnalysisPropertyFromCloudFormation(properties.SourceAnalysis) : undefined);
    ret.addPropertyResult('sourceTemplate', 'SourceTemplate', properties.SourceTemplate != null ? CfnTemplateTemplateSourceTemplatePropertyFromCloudFormation(properties.SourceTemplate) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * The source template of the template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourcetemplate.html
     */
    export interface TemplateSourceTemplateProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourcetemplate.html#cfn-quicksight-template-templatesourcetemplate-arn
         */
        readonly arn: string;
    }
}

/**
 * Determine whether the given properties match those of a `TemplateSourceTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateSourceTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_TemplateSourceTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "TemplateSourceTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateSourceTemplate` resource
 *
 * @param properties - the TypeScript properties of a `TemplateSourceTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateSourceTemplate` resource.
 */
// @ts-ignore TS6133
function cfnTemplateTemplateSourceTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_TemplateSourceTemplatePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnTemplateTemplateSourceTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.TemplateSourceTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateSourceTemplateProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTemplate {
    /**
     * A version of a template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html
     */
    export interface TemplateVersionProperty {
        /**
         * The time that this template version was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-createdtime
         */
        readonly createdTime?: string;
        /**
         * Schema of the dataset identified by the placeholder. Any dashboard created from this template should be bound to new datasets matching the same schema described through this API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-datasetconfigurations
         */
        readonly dataSetConfigurations?: Array<CfnTemplate.DataSetConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The description of the template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-description
         */
        readonly description?: string;
        /**
         * Errors associated with this template version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-errors
         */
        readonly errors?: Array<CfnTemplate.TemplateErrorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of the associated sheets with the unique identifier and name of each sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-sheets
         */
        readonly sheets?: Array<CfnTemplate.SheetProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of an analysis or template that was used to create this template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-sourceentityarn
         */
        readonly sourceEntityArn?: string;
        /**
         * The HTTP status of the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-status
         */
        readonly status?: string;
        /**
         * The ARN of the theme associated with this version of the template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-themearn
         */
        readonly themeArn?: string;
        /**
         * The version number of the template version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-versionnumber
         */
        readonly versionNumber?: number;
    }
}

/**
 * Determine whether the given properties match those of a `TemplateVersionProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateVersionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTemplate_TemplateVersionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('dataSetConfigurations', cdk.listValidator(CfnTemplate_DataSetConfigurationPropertyValidator))(properties.dataSetConfigurations));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('errors', cdk.listValidator(CfnTemplate_TemplateErrorPropertyValidator))(properties.errors));
    errors.collect(cdk.propertyValidator('sheets', cdk.listValidator(CfnTemplate_SheetPropertyValidator))(properties.sheets));
    errors.collect(cdk.propertyValidator('sourceEntityArn', cdk.validateString)(properties.sourceEntityArn));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('themeArn', cdk.validateString)(properties.themeArn));
    errors.collect(cdk.propertyValidator('versionNumber', cdk.validateNumber)(properties.versionNumber));
    return errors.wrap('supplied properties not correct for "TemplateVersionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateVersion` resource
 *
 * @param properties - the TypeScript properties of a `TemplateVersionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Template.TemplateVersion` resource.
 */
// @ts-ignore TS6133
function cfnTemplateTemplateVersionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTemplate_TemplateVersionPropertyValidator(properties).assertSuccess();
    return {
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        DataSetConfigurations: cdk.listMapper(cfnTemplateDataSetConfigurationPropertyToCloudFormation)(properties.dataSetConfigurations),
        Description: cdk.stringToCloudFormation(properties.description),
        Errors: cdk.listMapper(cfnTemplateTemplateErrorPropertyToCloudFormation)(properties.errors),
        Sheets: cdk.listMapper(cfnTemplateSheetPropertyToCloudFormation)(properties.sheets),
        SourceEntityArn: cdk.stringToCloudFormation(properties.sourceEntityArn),
        Status: cdk.stringToCloudFormation(properties.status),
        ThemeArn: cdk.stringToCloudFormation(properties.themeArn),
        VersionNumber: cdk.numberToCloudFormation(properties.versionNumber),
    };
}

// @ts-ignore TS6133
function CfnTemplateTemplateVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.TemplateVersionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateVersionProperty>();
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('dataSetConfigurations', 'DataSetConfigurations', properties.DataSetConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnTemplateDataSetConfigurationPropertyFromCloudFormation)(properties.DataSetConfigurations) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('errors', 'Errors', properties.Errors != null ? cfn_parse.FromCloudFormation.getArray(CfnTemplateTemplateErrorPropertyFromCloudFormation)(properties.Errors) : undefined);
    ret.addPropertyResult('sheets', 'Sheets', properties.Sheets != null ? cfn_parse.FromCloudFormation.getArray(CfnTemplateSheetPropertyFromCloudFormation)(properties.Sheets) : undefined);
    ret.addPropertyResult('sourceEntityArn', 'SourceEntityArn', properties.SourceEntityArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceEntityArn) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('themeArn', 'ThemeArn', properties.ThemeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThemeArn) : undefined);
    ret.addPropertyResult('versionNumber', 'VersionNumber', properties.VersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.VersionNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTheme`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html
 */
export interface CfnThemeProps {

    /**
     * The ID of the AWS account where you want to store the new theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-awsaccountid
     */
    readonly awsAccountId: string;

    /**
     * An ID for the theme that you want to create. The theme ID is unique per AWS Region in each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-themeid
     */
    readonly themeId: string;

    /**
     * The ID of the theme that a custom theme will inherit from. All themes inherit from one of the starting themes defined by Amazon QuickSight. For a list of the starting themes, use `ListThemes` or choose *Themes* from within an analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-basethemeid
     */
    readonly baseThemeId?: string;

    /**
     * The theme configuration, which contains the theme display properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-configuration
     */
    readonly configuration?: CfnTheme.ThemeConfigurationProperty | cdk.IResolvable;

    /**
     * A display name for the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-name
     */
    readonly name?: string;

    /**
     * A valid grouping of resource permissions to apply to the new theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-permissions
     */
    readonly permissions?: Array<CfnTheme.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A map of the key-value pairs for the resource tag or tags that you want to add to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * A description of the first version of the theme that you're creating. Every time `UpdateTheme` is called, a new version is created. Each version of the theme has a description of the version in the `VersionDescription` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-versiondescription
     */
    readonly versionDescription?: string;
}

/**
 * Determine whether the given properties match those of a `CfnThemeProps`
 *
 * @param properties - the TypeScript properties of a `CfnThemeProps`
 *
 * @returns the result of the validation.
 */
function CfnThemePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.requiredValidator)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.validateString)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('baseThemeId', cdk.validateString)(properties.baseThemeId));
    errors.collect(cdk.propertyValidator('configuration', CfnTheme_ThemeConfigurationPropertyValidator)(properties.configuration));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('permissions', cdk.listValidator(CfnTheme_ResourcePermissionPropertyValidator))(properties.permissions));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('themeId', cdk.requiredValidator)(properties.themeId));
    errors.collect(cdk.propertyValidator('themeId', cdk.validateString)(properties.themeId));
    errors.collect(cdk.propertyValidator('versionDescription', cdk.validateString)(properties.versionDescription));
    return errors.wrap('supplied properties not correct for "CfnThemeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme` resource
 *
 * @param properties - the TypeScript properties of a `CfnThemeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme` resource.
 */
// @ts-ignore TS6133
function cfnThemePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnThemePropsValidator(properties).assertSuccess();
    return {
        AwsAccountId: cdk.stringToCloudFormation(properties.awsAccountId),
        ThemeId: cdk.stringToCloudFormation(properties.themeId),
        BaseThemeId: cdk.stringToCloudFormation(properties.baseThemeId),
        Configuration: cfnThemeThemeConfigurationPropertyToCloudFormation(properties.configuration),
        Name: cdk.stringToCloudFormation(properties.name),
        Permissions: cdk.listMapper(cfnThemeResourcePermissionPropertyToCloudFormation)(properties.permissions),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VersionDescription: cdk.stringToCloudFormation(properties.versionDescription),
    };
}

// @ts-ignore TS6133
function CfnThemePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThemeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThemeProps>();
    ret.addPropertyResult('awsAccountId', 'AwsAccountId', cfn_parse.FromCloudFormation.getString(properties.AwsAccountId));
    ret.addPropertyResult('themeId', 'ThemeId', cfn_parse.FromCloudFormation.getString(properties.ThemeId));
    ret.addPropertyResult('baseThemeId', 'BaseThemeId', properties.BaseThemeId != null ? cfn_parse.FromCloudFormation.getString(properties.BaseThemeId) : undefined);
    ret.addPropertyResult('configuration', 'Configuration', properties.Configuration != null ? CfnThemeThemeConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('permissions', 'Permissions', properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(CfnThemeResourcePermissionPropertyFromCloudFormation)(properties.Permissions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('versionDescription', 'VersionDescription', properties.VersionDescription != null ? cfn_parse.FromCloudFormation.getString(properties.VersionDescription) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::QuickSight::Theme`
 *
 * Creates a theme.
 *
 * A *theme* is set of configuration options for color and layout. Themes apply to analyses and dashboards. For more information, see [Using Themes in Amazon QuickSight](https://docs.aws.amazon.com/quicksight/latest/user/themes-in-quicksight.html) in the *Amazon QuickSight User Guide* .
 *
 * @cloudformationResource AWS::QuickSight::Theme
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html
 */
export class CfnTheme extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::Theme";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTheme {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnThemePropsFromCloudFormation(resourceProperties);
        const ret = new CfnTheme(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the theme.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The time the theme was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The time the theme was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     * Theme type.
     * @cloudformationAttribute Type
     */
    public readonly attrType: string;

    /**
     *
     * @cloudformationAttribute Version.Arn
     */
    public readonly attrVersionArn: string;

    /**
     *
     * @cloudformationAttribute Version.BaseThemeId
     */
    public readonly attrVersionBaseThemeId: string;

    /**
     *
     * @cloudformationAttribute Version.CreatedTime
     */
    public readonly attrVersionCreatedTime: string;

    /**
     *
     * @cloudformationAttribute Version.Description
     */
    public readonly attrVersionDescription: string;

    /**
     *
     * @cloudformationAttribute Version.Errors
     */
    public readonly attrVersionErrors: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Version.Status
     */
    public readonly attrVersionStatus: string;

    /**
     *
     * @cloudformationAttribute Version.VersionNumber
     */
    public readonly attrVersionVersionNumber: cdk.IResolvable;

    /**
     * The ID of the AWS account where you want to store the new theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-awsaccountid
     */
    public awsAccountId: string;

    /**
     * An ID for the theme that you want to create. The theme ID is unique per AWS Region in each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-themeid
     */
    public themeId: string;

    /**
     * The ID of the theme that a custom theme will inherit from. All themes inherit from one of the starting themes defined by Amazon QuickSight. For a list of the starting themes, use `ListThemes` or choose *Themes* from within an analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-basethemeid
     */
    public baseThemeId: string | undefined;

    /**
     * The theme configuration, which contains the theme display properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-configuration
     */
    public configuration: CfnTheme.ThemeConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A display name for the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-name
     */
    public name: string | undefined;

    /**
     * A valid grouping of resource permissions to apply to the new theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-permissions
     */
    public permissions: Array<CfnTheme.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A map of the key-value pairs for the resource tag or tags that you want to add to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A description of the first version of the theme that you're creating. Every time `UpdateTheme` is called, a new version is created. Each version of the theme has a description of the version in the `VersionDescription` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-versiondescription
     */
    public versionDescription: string | undefined;

    /**
     * Create a new `AWS::QuickSight::Theme`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnThemeProps) {
        super(scope, id, { type: CfnTheme.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'awsAccountId', this);
        cdk.requireProperty(props, 'themeId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrType = cdk.Token.asString(this.getAtt('Type', cdk.ResolutionTypeHint.STRING));
        this.attrVersionArn = cdk.Token.asString(this.getAtt('Version.Arn', cdk.ResolutionTypeHint.STRING));
        this.attrVersionBaseThemeId = cdk.Token.asString(this.getAtt('Version.BaseThemeId', cdk.ResolutionTypeHint.STRING));
        this.attrVersionCreatedTime = cdk.Token.asString(this.getAtt('Version.CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrVersionDescription = cdk.Token.asString(this.getAtt('Version.Description', cdk.ResolutionTypeHint.STRING));
        this.attrVersionErrors = this.getAtt('Version.Errors', cdk.ResolutionTypeHint.STRING);
        this.attrVersionStatus = cdk.Token.asString(this.getAtt('Version.Status', cdk.ResolutionTypeHint.STRING));
        this.attrVersionVersionNumber = this.getAtt('Version.VersionNumber', cdk.ResolutionTypeHint.STRING);

        this.awsAccountId = props.awsAccountId;
        this.themeId = props.themeId;
        this.baseThemeId = props.baseThemeId;
        this.configuration = props.configuration;
        this.name = props.name;
        this.permissions = props.permissions;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QuickSight::Theme", props.tags, { tagPropertyName: 'tags' });
        this.versionDescription = props.versionDescription;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTheme.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            awsAccountId: this.awsAccountId,
            themeId: this.themeId,
            baseThemeId: this.baseThemeId,
            configuration: this.configuration,
            name: this.name,
            permissions: this.permissions,
            tags: this.tags.renderTags(),
            versionDescription: this.versionDescription,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnThemePropsToCloudFormation(props);
    }
}

export namespace CfnTheme {
    /**
     * The display options for tile borders for visuals.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-borderstyle.html
     */
    export interface BorderStyleProperty {
        /**
         * The option to enable display of borders for visuals.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-borderstyle.html#cfn-quicksight-theme-borderstyle-show
         */
        readonly show?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BorderStyleProperty`
 *
 * @param properties - the TypeScript properties of a `BorderStyleProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_BorderStylePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('show', cdk.validateBoolean)(properties.show));
    return errors.wrap('supplied properties not correct for "BorderStyleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.BorderStyle` resource
 *
 * @param properties - the TypeScript properties of a `BorderStyleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.BorderStyle` resource.
 */
// @ts-ignore TS6133
function cfnThemeBorderStylePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_BorderStylePropertyValidator(properties).assertSuccess();
    return {
        Show: cdk.booleanToCloudFormation(properties.show),
    };
}

// @ts-ignore TS6133
function CfnThemeBorderStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.BorderStyleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.BorderStyleProperty>();
    ret.addPropertyResult('show', 'Show', properties.Show != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Show) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * The theme colors that are used for data colors in charts. The colors description is a hexadecimal color code that consists of six alphanumerical characters, prefixed with `#` , for example #37BFF5.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-datacolorpalette.html
     */
    export interface DataColorPaletteProperty {
        /**
         * The hexadecimal codes for the colors.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-datacolorpalette.html#cfn-quicksight-theme-datacolorpalette-colors
         */
        readonly colors?: string[];
        /**
         * The hexadecimal code of a color that applies to charts where a lack of data is highlighted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-datacolorpalette.html#cfn-quicksight-theme-datacolorpalette-emptyfillcolor
         */
        readonly emptyFillColor?: string;
        /**
         * The minimum and maximum hexadecimal codes that describe a color gradient.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-datacolorpalette.html#cfn-quicksight-theme-datacolorpalette-minmaxgradient
         */
        readonly minMaxGradient?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `DataColorPaletteProperty`
 *
 * @param properties - the TypeScript properties of a `DataColorPaletteProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_DataColorPalettePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('colors', cdk.listValidator(cdk.validateString))(properties.colors));
    errors.collect(cdk.propertyValidator('emptyFillColor', cdk.validateString)(properties.emptyFillColor));
    errors.collect(cdk.propertyValidator('minMaxGradient', cdk.listValidator(cdk.validateString))(properties.minMaxGradient));
    return errors.wrap('supplied properties not correct for "DataColorPaletteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.DataColorPalette` resource
 *
 * @param properties - the TypeScript properties of a `DataColorPaletteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.DataColorPalette` resource.
 */
// @ts-ignore TS6133
function cfnThemeDataColorPalettePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_DataColorPalettePropertyValidator(properties).assertSuccess();
    return {
        Colors: cdk.listMapper(cdk.stringToCloudFormation)(properties.colors),
        EmptyFillColor: cdk.stringToCloudFormation(properties.emptyFillColor),
        MinMaxGradient: cdk.listMapper(cdk.stringToCloudFormation)(properties.minMaxGradient),
    };
}

// @ts-ignore TS6133
function CfnThemeDataColorPalettePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.DataColorPaletteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.DataColorPaletteProperty>();
    ret.addPropertyResult('colors', 'Colors', properties.Colors != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Colors) : undefined);
    ret.addPropertyResult('emptyFillColor', 'EmptyFillColor', properties.EmptyFillColor != null ? cfn_parse.FromCloudFormation.getString(properties.EmptyFillColor) : undefined);
    ret.addPropertyResult('minMaxGradient', 'MinMaxGradient', properties.MinMaxGradient != null ? cfn_parse.FromCloudFormation.getStringArray(properties.MinMaxGradient) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-font.html
     */
    export interface FontProperty {
        /**
         * `CfnTheme.FontProperty.FontFamily`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-font.html#cfn-quicksight-theme-font-fontfamily
         */
        readonly fontFamily?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FontProperty`
 *
 * @param properties - the TypeScript properties of a `FontProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_FontPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fontFamily', cdk.validateString)(properties.fontFamily));
    return errors.wrap('supplied properties not correct for "FontProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.Font` resource
 *
 * @param properties - the TypeScript properties of a `FontProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.Font` resource.
 */
// @ts-ignore TS6133
function cfnThemeFontPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_FontPropertyValidator(properties).assertSuccess();
    return {
        FontFamily: cdk.stringToCloudFormation(properties.fontFamily),
    };
}

// @ts-ignore TS6133
function CfnThemeFontPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.FontProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.FontProperty>();
    ret.addPropertyResult('fontFamily', 'FontFamily', properties.FontFamily != null ? cfn_parse.FromCloudFormation.getString(properties.FontFamily) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * The display options for gutter spacing between tiles on a sheet.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-gutterstyle.html
     */
    export interface GutterStyleProperty {
        /**
         * This Boolean value controls whether to display a gutter space between sheet tiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-gutterstyle.html#cfn-quicksight-theme-gutterstyle-show
         */
        readonly show?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GutterStyleProperty`
 *
 * @param properties - the TypeScript properties of a `GutterStyleProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_GutterStylePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('show', cdk.validateBoolean)(properties.show));
    return errors.wrap('supplied properties not correct for "GutterStyleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.GutterStyle` resource
 *
 * @param properties - the TypeScript properties of a `GutterStyleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.GutterStyle` resource.
 */
// @ts-ignore TS6133
function cfnThemeGutterStylePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_GutterStylePropertyValidator(properties).assertSuccess();
    return {
        Show: cdk.booleanToCloudFormation(properties.show),
    };
}

// @ts-ignore TS6133
function CfnThemeGutterStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.GutterStyleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.GutterStyleProperty>();
    ret.addPropertyResult('show', 'Show', properties.Show != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Show) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * The display options for margins around the outside edge of sheets.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-marginstyle.html
     */
    export interface MarginStyleProperty {
        /**
         * This Boolean value controls whether to display sheet margins.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-marginstyle.html#cfn-quicksight-theme-marginstyle-show
         */
        readonly show?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MarginStyleProperty`
 *
 * @param properties - the TypeScript properties of a `MarginStyleProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_MarginStylePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('show', cdk.validateBoolean)(properties.show));
    return errors.wrap('supplied properties not correct for "MarginStyleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.MarginStyle` resource
 *
 * @param properties - the TypeScript properties of a `MarginStyleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.MarginStyle` resource.
 */
// @ts-ignore TS6133
function cfnThemeMarginStylePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_MarginStylePropertyValidator(properties).assertSuccess();
    return {
        Show: cdk.booleanToCloudFormation(properties.show),
    };
}

// @ts-ignore TS6133
function CfnThemeMarginStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.MarginStyleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.MarginStyleProperty>();
    ret.addPropertyResult('show', 'Show', properties.Show != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Show) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-resourcepermission.html
     */
    export interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-resourcepermission.html#cfn-quicksight-theme-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-resourcepermission.html#cfn-quicksight-theme-resourcepermission-principal
         */
        readonly principal: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourcePermissionProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_ResourcePermissionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(cdk.validateString))(properties.actions));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    return errors.wrap('supplied properties not correct for "ResourcePermissionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.ResourcePermission` resource
 *
 * @param properties - the TypeScript properties of a `ResourcePermissionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.ResourcePermission` resource.
 */
// @ts-ignore TS6133
function cfnThemeResourcePermissionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_ResourcePermissionPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
        Principal: cdk.stringToCloudFormation(properties.principal),
    };
}

// @ts-ignore TS6133
function CfnThemeResourcePermissionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.ResourcePermissionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.ResourcePermissionProperty>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getStringArray(properties.Actions));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * The theme display options for sheets.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-sheetstyle.html
     */
    export interface SheetStyleProperty {
        /**
         * The display options for tiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-sheetstyle.html#cfn-quicksight-theme-sheetstyle-tile
         */
        readonly tile?: CfnTheme.TileStyleProperty | cdk.IResolvable;
        /**
         * The layout options for tiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-sheetstyle.html#cfn-quicksight-theme-sheetstyle-tilelayout
         */
        readonly tileLayout?: CfnTheme.TileLayoutStyleProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SheetStyleProperty`
 *
 * @param properties - the TypeScript properties of a `SheetStyleProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_SheetStylePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tile', CfnTheme_TileStylePropertyValidator)(properties.tile));
    errors.collect(cdk.propertyValidator('tileLayout', CfnTheme_TileLayoutStylePropertyValidator)(properties.tileLayout));
    return errors.wrap('supplied properties not correct for "SheetStyleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.SheetStyle` resource
 *
 * @param properties - the TypeScript properties of a `SheetStyleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.SheetStyle` resource.
 */
// @ts-ignore TS6133
function cfnThemeSheetStylePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_SheetStylePropertyValidator(properties).assertSuccess();
    return {
        Tile: cfnThemeTileStylePropertyToCloudFormation(properties.tile),
        TileLayout: cfnThemeTileLayoutStylePropertyToCloudFormation(properties.tileLayout),
    };
}

// @ts-ignore TS6133
function CfnThemeSheetStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.SheetStyleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.SheetStyleProperty>();
    ret.addPropertyResult('tile', 'Tile', properties.Tile != null ? CfnThemeTileStylePropertyFromCloudFormation(properties.Tile) : undefined);
    ret.addPropertyResult('tileLayout', 'TileLayout', properties.TileLayout != null ? CfnThemeTileLayoutStylePropertyFromCloudFormation(properties.TileLayout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * The theme configuration. This configuration contains all of the display properties for a theme.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html
     */
    export interface ThemeConfigurationProperty {
        /**
         * Color properties that apply to chart data colors.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html#cfn-quicksight-theme-themeconfiguration-datacolorpalette
         */
        readonly dataColorPalette?: CfnTheme.DataColorPaletteProperty | cdk.IResolvable;
        /**
         * Display options related to sheets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html#cfn-quicksight-theme-themeconfiguration-sheet
         */
        readonly sheet?: CfnTheme.SheetStyleProperty | cdk.IResolvable;
        /**
         * `CfnTheme.ThemeConfigurationProperty.Typography`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html#cfn-quicksight-theme-themeconfiguration-typography
         */
        readonly typography?: CfnTheme.TypographyProperty | cdk.IResolvable;
        /**
         * Color properties that apply to the UI and to charts, excluding the colors that apply to data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html#cfn-quicksight-theme-themeconfiguration-uicolorpalette
         */
        readonly uiColorPalette?: CfnTheme.UIColorPaletteProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ThemeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ThemeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_ThemeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataColorPalette', CfnTheme_DataColorPalettePropertyValidator)(properties.dataColorPalette));
    errors.collect(cdk.propertyValidator('sheet', CfnTheme_SheetStylePropertyValidator)(properties.sheet));
    errors.collect(cdk.propertyValidator('typography', CfnTheme_TypographyPropertyValidator)(properties.typography));
    errors.collect(cdk.propertyValidator('uiColorPalette', CfnTheme_UIColorPalettePropertyValidator)(properties.uiColorPalette));
    return errors.wrap('supplied properties not correct for "ThemeConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.ThemeConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ThemeConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.ThemeConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnThemeThemeConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_ThemeConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DataColorPalette: cfnThemeDataColorPalettePropertyToCloudFormation(properties.dataColorPalette),
        Sheet: cfnThemeSheetStylePropertyToCloudFormation(properties.sheet),
        Typography: cfnThemeTypographyPropertyToCloudFormation(properties.typography),
        UIColorPalette: cfnThemeUIColorPalettePropertyToCloudFormation(properties.uiColorPalette),
    };
}

// @ts-ignore TS6133
function CfnThemeThemeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.ThemeConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.ThemeConfigurationProperty>();
    ret.addPropertyResult('dataColorPalette', 'DataColorPalette', properties.DataColorPalette != null ? CfnThemeDataColorPalettePropertyFromCloudFormation(properties.DataColorPalette) : undefined);
    ret.addPropertyResult('sheet', 'Sheet', properties.Sheet != null ? CfnThemeSheetStylePropertyFromCloudFormation(properties.Sheet) : undefined);
    ret.addPropertyResult('typography', 'Typography', properties.Typography != null ? CfnThemeTypographyPropertyFromCloudFormation(properties.Typography) : undefined);
    ret.addPropertyResult('uiColorPalette', 'UIColorPalette', properties.UIColorPalette != null ? CfnThemeUIColorPalettePropertyFromCloudFormation(properties.UIColorPalette) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * Theme error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeerror.html
     */
    export interface ThemeErrorProperty {
        /**
         * The error message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeerror.html#cfn-quicksight-theme-themeerror-message
         */
        readonly message?: string;
        /**
         * The type of error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeerror.html#cfn-quicksight-theme-themeerror-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ThemeErrorProperty`
 *
 * @param properties - the TypeScript properties of a `ThemeErrorProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_ThemeErrorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('message', cdk.validateString)(properties.message));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ThemeErrorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.ThemeError` resource
 *
 * @param properties - the TypeScript properties of a `ThemeErrorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.ThemeError` resource.
 */
// @ts-ignore TS6133
function cfnThemeThemeErrorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_ThemeErrorPropertyValidator(properties).assertSuccess();
    return {
        Message: cdk.stringToCloudFormation(properties.message),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnThemeThemeErrorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.ThemeErrorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.ThemeErrorProperty>();
    ret.addPropertyResult('message', 'Message', properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * A version of a theme.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html
     */
    export interface ThemeVersionProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-arn
         */
        readonly arn?: string;
        /**
         * The Amazon QuickSight-defined ID of the theme that a custom theme inherits from. All themes initially inherit from a default Amazon QuickSight theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-basethemeid
         */
        readonly baseThemeId?: string;
        /**
         * The theme configuration, which contains all the theme display properties.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-configuration
         */
        readonly configuration?: CfnTheme.ThemeConfigurationProperty | cdk.IResolvable;
        /**
         * The date and time that this theme version was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-createdtime
         */
        readonly createdTime?: string;
        /**
         * The description of the theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-description
         */
        readonly description?: string;
        /**
         * Errors associated with the theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-errors
         */
        readonly errors?: Array<CfnTheme.ThemeErrorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The status of the theme version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-status
         */
        readonly status?: string;
        /**
         * The version number of the theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-versionnumber
         */
        readonly versionNumber?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ThemeVersionProperty`
 *
 * @param properties - the TypeScript properties of a `ThemeVersionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_ThemeVersionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('baseThemeId', cdk.validateString)(properties.baseThemeId));
    errors.collect(cdk.propertyValidator('configuration', CfnTheme_ThemeConfigurationPropertyValidator)(properties.configuration));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('errors', cdk.listValidator(CfnTheme_ThemeErrorPropertyValidator))(properties.errors));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('versionNumber', cdk.validateNumber)(properties.versionNumber));
    return errors.wrap('supplied properties not correct for "ThemeVersionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.ThemeVersion` resource
 *
 * @param properties - the TypeScript properties of a `ThemeVersionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.ThemeVersion` resource.
 */
// @ts-ignore TS6133
function cfnThemeThemeVersionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_ThemeVersionPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        BaseThemeId: cdk.stringToCloudFormation(properties.baseThemeId),
        Configuration: cfnThemeThemeConfigurationPropertyToCloudFormation(properties.configuration),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        Description: cdk.stringToCloudFormation(properties.description),
        Errors: cdk.listMapper(cfnThemeThemeErrorPropertyToCloudFormation)(properties.errors),
        Status: cdk.stringToCloudFormation(properties.status),
        VersionNumber: cdk.numberToCloudFormation(properties.versionNumber),
    };
}

// @ts-ignore TS6133
function CfnThemeThemeVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.ThemeVersionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.ThemeVersionProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('baseThemeId', 'BaseThemeId', properties.BaseThemeId != null ? cfn_parse.FromCloudFormation.getString(properties.BaseThemeId) : undefined);
    ret.addPropertyResult('configuration', 'Configuration', properties.Configuration != null ? CfnThemeThemeConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('errors', 'Errors', properties.Errors != null ? cfn_parse.FromCloudFormation.getArray(CfnThemeThemeErrorPropertyFromCloudFormation)(properties.Errors) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('versionNumber', 'VersionNumber', properties.VersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.VersionNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * The display options for the layout of tiles on a sheet.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilelayoutstyle.html
     */
    export interface TileLayoutStyleProperty {
        /**
         * The gutter settings that apply between tiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilelayoutstyle.html#cfn-quicksight-theme-tilelayoutstyle-gutter
         */
        readonly gutter?: CfnTheme.GutterStyleProperty | cdk.IResolvable;
        /**
         * The margin settings that apply around the outside edge of sheets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilelayoutstyle.html#cfn-quicksight-theme-tilelayoutstyle-margin
         */
        readonly margin?: CfnTheme.MarginStyleProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TileLayoutStyleProperty`
 *
 * @param properties - the TypeScript properties of a `TileLayoutStyleProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_TileLayoutStylePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gutter', CfnTheme_GutterStylePropertyValidator)(properties.gutter));
    errors.collect(cdk.propertyValidator('margin', CfnTheme_MarginStylePropertyValidator)(properties.margin));
    return errors.wrap('supplied properties not correct for "TileLayoutStyleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.TileLayoutStyle` resource
 *
 * @param properties - the TypeScript properties of a `TileLayoutStyleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.TileLayoutStyle` resource.
 */
// @ts-ignore TS6133
function cfnThemeTileLayoutStylePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_TileLayoutStylePropertyValidator(properties).assertSuccess();
    return {
        Gutter: cfnThemeGutterStylePropertyToCloudFormation(properties.gutter),
        Margin: cfnThemeMarginStylePropertyToCloudFormation(properties.margin),
    };
}

// @ts-ignore TS6133
function CfnThemeTileLayoutStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.TileLayoutStyleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.TileLayoutStyleProperty>();
    ret.addPropertyResult('gutter', 'Gutter', properties.Gutter != null ? CfnThemeGutterStylePropertyFromCloudFormation(properties.Gutter) : undefined);
    ret.addPropertyResult('margin', 'Margin', properties.Margin != null ? CfnThemeMarginStylePropertyFromCloudFormation(properties.Margin) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * Display options related to tiles on a sheet.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilestyle.html
     */
    export interface TileStyleProperty {
        /**
         * The border around a tile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilestyle.html#cfn-quicksight-theme-tilestyle-border
         */
        readonly border?: CfnTheme.BorderStyleProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TileStyleProperty`
 *
 * @param properties - the TypeScript properties of a `TileStyleProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_TileStylePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('border', CfnTheme_BorderStylePropertyValidator)(properties.border));
    return errors.wrap('supplied properties not correct for "TileStyleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.TileStyle` resource
 *
 * @param properties - the TypeScript properties of a `TileStyleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.TileStyle` resource.
 */
// @ts-ignore TS6133
function cfnThemeTileStylePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_TileStylePropertyValidator(properties).assertSuccess();
    return {
        Border: cfnThemeBorderStylePropertyToCloudFormation(properties.border),
    };
}

// @ts-ignore TS6133
function CfnThemeTileStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.TileStyleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.TileStyleProperty>();
    ret.addPropertyResult('border', 'Border', properties.Border != null ? CfnThemeBorderStylePropertyFromCloudFormation(properties.Border) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-typography.html
     */
    export interface TypographyProperty {
        /**
         * `CfnTheme.TypographyProperty.FontFamilies`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-typography.html#cfn-quicksight-theme-typography-fontfamilies
         */
        readonly fontFamilies?: Array<CfnTheme.FontProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TypographyProperty`
 *
 * @param properties - the TypeScript properties of a `TypographyProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_TypographyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fontFamilies', cdk.listValidator(CfnTheme_FontPropertyValidator))(properties.fontFamilies));
    return errors.wrap('supplied properties not correct for "TypographyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.Typography` resource
 *
 * @param properties - the TypeScript properties of a `TypographyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.Typography` resource.
 */
// @ts-ignore TS6133
function cfnThemeTypographyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_TypographyPropertyValidator(properties).assertSuccess();
    return {
        FontFamilies: cdk.listMapper(cfnThemeFontPropertyToCloudFormation)(properties.fontFamilies),
    };
}

// @ts-ignore TS6133
function CfnThemeTypographyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.TypographyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.TypographyProperty>();
    ret.addPropertyResult('fontFamilies', 'FontFamilies', properties.FontFamilies != null ? cfn_parse.FromCloudFormation.getArray(CfnThemeFontPropertyFromCloudFormation)(properties.FontFamilies) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * The theme colors that apply to UI and to charts, excluding data colors. The colors description is a hexadecimal color code that consists of six alphanumerical characters, prefixed with `#` , for example #37BFF5. For more information, see [Using Themes in Amazon QuickSight](https://docs.aws.amazon.com/quicksight/latest/user/themes-in-quicksight.html) in the *Amazon QuickSight User Guide.*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html
     */
    export interface UIColorPaletteProperty {
        /**
         * This color is that applies to selected states and buttons.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-accent
         */
        readonly accent?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the accent color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-accentforeground
         */
        readonly accentForeground?: string;
        /**
         * The color that applies to error messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-danger
         */
        readonly danger?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the error color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-dangerforeground
         */
        readonly dangerForeground?: string;
        /**
         * The color that applies to the names of fields that are identified as dimensions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-dimension
         */
        readonly dimension?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the dimension color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-dimensionforeground
         */
        readonly dimensionForeground?: string;
        /**
         * The color that applies to the names of fields that are identified as measures.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-measure
         */
        readonly measure?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the measure color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-measureforeground
         */
        readonly measureForeground?: string;
        /**
         * The background color that applies to visuals and other high emphasis UI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-primarybackground
         */
        readonly primaryBackground?: string;
        /**
         * The color of text and other foreground elements that appear over the primary background regions, such as grid lines, borders, table banding, icons, and so on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-primaryforeground
         */
        readonly primaryForeground?: string;
        /**
         * The background color that applies to the sheet background and sheet controls.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-secondarybackground
         */
        readonly secondaryBackground?: string;
        /**
         * The foreground color that applies to any sheet title, sheet control text, or UI that appears over the secondary background.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-secondaryforeground
         */
        readonly secondaryForeground?: string;
        /**
         * The color that applies to success messages, for example the check mark for a successful download.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-success
         */
        readonly success?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the success color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-successforeground
         */
        readonly successForeground?: string;
        /**
         * This color that applies to warning and informational messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-warning
         */
        readonly warning?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the warning color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-warningforeground
         */
        readonly warningForeground?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UIColorPaletteProperty`
 *
 * @param properties - the TypeScript properties of a `UIColorPaletteProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_UIColorPalettePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accent', cdk.validateString)(properties.accent));
    errors.collect(cdk.propertyValidator('accentForeground', cdk.validateString)(properties.accentForeground));
    errors.collect(cdk.propertyValidator('danger', cdk.validateString)(properties.danger));
    errors.collect(cdk.propertyValidator('dangerForeground', cdk.validateString)(properties.dangerForeground));
    errors.collect(cdk.propertyValidator('dimension', cdk.validateString)(properties.dimension));
    errors.collect(cdk.propertyValidator('dimensionForeground', cdk.validateString)(properties.dimensionForeground));
    errors.collect(cdk.propertyValidator('measure', cdk.validateString)(properties.measure));
    errors.collect(cdk.propertyValidator('measureForeground', cdk.validateString)(properties.measureForeground));
    errors.collect(cdk.propertyValidator('primaryBackground', cdk.validateString)(properties.primaryBackground));
    errors.collect(cdk.propertyValidator('primaryForeground', cdk.validateString)(properties.primaryForeground));
    errors.collect(cdk.propertyValidator('secondaryBackground', cdk.validateString)(properties.secondaryBackground));
    errors.collect(cdk.propertyValidator('secondaryForeground', cdk.validateString)(properties.secondaryForeground));
    errors.collect(cdk.propertyValidator('success', cdk.validateString)(properties.success));
    errors.collect(cdk.propertyValidator('successForeground', cdk.validateString)(properties.successForeground));
    errors.collect(cdk.propertyValidator('warning', cdk.validateString)(properties.warning));
    errors.collect(cdk.propertyValidator('warningForeground', cdk.validateString)(properties.warningForeground));
    return errors.wrap('supplied properties not correct for "UIColorPaletteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::QuickSight::Theme.UIColorPalette` resource
 *
 * @param properties - the TypeScript properties of a `UIColorPaletteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::QuickSight::Theme.UIColorPalette` resource.
 */
// @ts-ignore TS6133
function cfnThemeUIColorPalettePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_UIColorPalettePropertyValidator(properties).assertSuccess();
    return {
        Accent: cdk.stringToCloudFormation(properties.accent),
        AccentForeground: cdk.stringToCloudFormation(properties.accentForeground),
        Danger: cdk.stringToCloudFormation(properties.danger),
        DangerForeground: cdk.stringToCloudFormation(properties.dangerForeground),
        Dimension: cdk.stringToCloudFormation(properties.dimension),
        DimensionForeground: cdk.stringToCloudFormation(properties.dimensionForeground),
        Measure: cdk.stringToCloudFormation(properties.measure),
        MeasureForeground: cdk.stringToCloudFormation(properties.measureForeground),
        PrimaryBackground: cdk.stringToCloudFormation(properties.primaryBackground),
        PrimaryForeground: cdk.stringToCloudFormation(properties.primaryForeground),
        SecondaryBackground: cdk.stringToCloudFormation(properties.secondaryBackground),
        SecondaryForeground: cdk.stringToCloudFormation(properties.secondaryForeground),
        Success: cdk.stringToCloudFormation(properties.success),
        SuccessForeground: cdk.stringToCloudFormation(properties.successForeground),
        Warning: cdk.stringToCloudFormation(properties.warning),
        WarningForeground: cdk.stringToCloudFormation(properties.warningForeground),
    };
}

// @ts-ignore TS6133
function CfnThemeUIColorPalettePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.UIColorPaletteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.UIColorPaletteProperty>();
    ret.addPropertyResult('accent', 'Accent', properties.Accent != null ? cfn_parse.FromCloudFormation.getString(properties.Accent) : undefined);
    ret.addPropertyResult('accentForeground', 'AccentForeground', properties.AccentForeground != null ? cfn_parse.FromCloudFormation.getString(properties.AccentForeground) : undefined);
    ret.addPropertyResult('danger', 'Danger', properties.Danger != null ? cfn_parse.FromCloudFormation.getString(properties.Danger) : undefined);
    ret.addPropertyResult('dangerForeground', 'DangerForeground', properties.DangerForeground != null ? cfn_parse.FromCloudFormation.getString(properties.DangerForeground) : undefined);
    ret.addPropertyResult('dimension', 'Dimension', properties.Dimension != null ? cfn_parse.FromCloudFormation.getString(properties.Dimension) : undefined);
    ret.addPropertyResult('dimensionForeground', 'DimensionForeground', properties.DimensionForeground != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionForeground) : undefined);
    ret.addPropertyResult('measure', 'Measure', properties.Measure != null ? cfn_parse.FromCloudFormation.getString(properties.Measure) : undefined);
    ret.addPropertyResult('measureForeground', 'MeasureForeground', properties.MeasureForeground != null ? cfn_parse.FromCloudFormation.getString(properties.MeasureForeground) : undefined);
    ret.addPropertyResult('primaryBackground', 'PrimaryBackground', properties.PrimaryBackground != null ? cfn_parse.FromCloudFormation.getString(properties.PrimaryBackground) : undefined);
    ret.addPropertyResult('primaryForeground', 'PrimaryForeground', properties.PrimaryForeground != null ? cfn_parse.FromCloudFormation.getString(properties.PrimaryForeground) : undefined);
    ret.addPropertyResult('secondaryBackground', 'SecondaryBackground', properties.SecondaryBackground != null ? cfn_parse.FromCloudFormation.getString(properties.SecondaryBackground) : undefined);
    ret.addPropertyResult('secondaryForeground', 'SecondaryForeground', properties.SecondaryForeground != null ? cfn_parse.FromCloudFormation.getString(properties.SecondaryForeground) : undefined);
    ret.addPropertyResult('success', 'Success', properties.Success != null ? cfn_parse.FromCloudFormation.getString(properties.Success) : undefined);
    ret.addPropertyResult('successForeground', 'SuccessForeground', properties.SuccessForeground != null ? cfn_parse.FromCloudFormation.getString(properties.SuccessForeground) : undefined);
    ret.addPropertyResult('warning', 'Warning', properties.Warning != null ? cfn_parse.FromCloudFormation.getString(properties.Warning) : undefined);
    ret.addPropertyResult('warningForeground', 'WarningForeground', properties.WarningForeground != null ? cfn_parse.FromCloudFormation.getString(properties.WarningForeground) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
