// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:00.986Z","fingerprint":"40TmptXAbzdSSagkQ/uUhmzrh43TAmo7Od5n+0goZaE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAnalyzer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html
 */
export interface CfnAnalyzerProps {

    /**
     * The type represents the zone of trust for the analyzer.
     *
     * *Allowed Values* : ACCOUNT | ORGANIZATION
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-type
     */
    readonly type: string;

    /**
     * The name of the analyzer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-analyzername
     */
    readonly analyzerName?: string;

    /**
     * Specifies the archive rules to add for the analyzer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-archiverules
     */
    readonly archiveRules?: Array<CfnAnalyzer.ArchiveRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The tags to apply to the analyzer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAnalyzerProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnalyzerProps`
 *
 * @returns the result of the validation.
 */
function CfnAnalyzerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('analyzerName', cdk.validateString)(properties.analyzerName));
    errors.collect(cdk.propertyValidator('archiveRules', cdk.listValidator(CfnAnalyzer_ArchiveRulePropertyValidator))(properties.archiveRules));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnAnalyzerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AccessAnalyzer::Analyzer` resource
 *
 * @param properties - the TypeScript properties of a `CfnAnalyzerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AccessAnalyzer::Analyzer` resource.
 */
// @ts-ignore TS6133
function cfnAnalyzerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalyzerPropsValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        AnalyzerName: cdk.stringToCloudFormation(properties.analyzerName),
        ArchiveRules: cdk.listMapper(cfnAnalyzerArchiveRulePropertyToCloudFormation)(properties.archiveRules),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAnalyzerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalyzerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalyzerProps>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('analyzerName', 'AnalyzerName', properties.AnalyzerName != null ? cfn_parse.FromCloudFormation.getString(properties.AnalyzerName) : undefined);
    ret.addPropertyResult('archiveRules', 'ArchiveRules', properties.ArchiveRules != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalyzerArchiveRulePropertyFromCloudFormation)(properties.ArchiveRules) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AccessAnalyzer::Analyzer`
 *
 * The `AWS::AccessAnalyzer::Analyzer` resource specifies a new analyzer. The analyzer is an object that represents the IAM Access Analyzer feature. An analyzer is required for Access Analyzer to become operational.
 *
 * @cloudformationResource AWS::AccessAnalyzer::Analyzer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html
 */
export class CfnAnalyzer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AccessAnalyzer::Analyzer";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnalyzer {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAnalyzerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAnalyzer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The type represents the zone of trust for the analyzer.
     *
     * *Allowed Values* : ACCOUNT | ORGANIZATION
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-type
     */
    public type: string;

    /**
     * The name of the analyzer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-analyzername
     */
    public analyzerName: string | undefined;

    /**
     * Specifies the archive rules to add for the analyzer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-archiverules
     */
    public archiveRules: Array<CfnAnalyzer.ArchiveRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The tags to apply to the analyzer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AccessAnalyzer::Analyzer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnalyzerProps) {
        super(scope, id, { type: CfnAnalyzer.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'type', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.type = props.type;
        this.analyzerName = props.analyzerName;
        this.archiveRules = props.archiveRules;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AccessAnalyzer::Analyzer", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnalyzer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            type: this.type,
            analyzerName: this.analyzerName,
            archiveRules: this.archiveRules,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAnalyzerPropsToCloudFormation(props);
    }
}

export namespace CfnAnalyzer {
    /**
     * The criteria for an archive rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html
     */
    export interface ArchiveRuleProperty {
        /**
         * The criteria for the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html#cfn-accessanalyzer-analyzer-archiverule-filter
         */
        readonly filter: Array<CfnAnalyzer.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the archive rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html#cfn-accessanalyzer-analyzer-archiverule-rulename
         */
        readonly ruleName: string;
    }
}

/**
 * Determine whether the given properties match those of a `ArchiveRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalyzer_ArchiveRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filter', cdk.requiredValidator)(properties.filter));
    errors.collect(cdk.propertyValidator('filter', cdk.listValidator(CfnAnalyzer_FilterPropertyValidator))(properties.filter));
    errors.collect(cdk.propertyValidator('ruleName', cdk.requiredValidator)(properties.ruleName));
    errors.collect(cdk.propertyValidator('ruleName', cdk.validateString)(properties.ruleName));
    return errors.wrap('supplied properties not correct for "ArchiveRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AccessAnalyzer::Analyzer.ArchiveRule` resource
 *
 * @param properties - the TypeScript properties of a `ArchiveRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AccessAnalyzer::Analyzer.ArchiveRule` resource.
 */
// @ts-ignore TS6133
function cfnAnalyzerArchiveRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalyzer_ArchiveRulePropertyValidator(properties).assertSuccess();
    return {
        Filter: cdk.listMapper(cfnAnalyzerFilterPropertyToCloudFormation)(properties.filter),
        RuleName: cdk.stringToCloudFormation(properties.ruleName),
    };
}

// @ts-ignore TS6133
function CfnAnalyzerArchiveRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalyzer.ArchiveRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalyzer.ArchiveRuleProperty>();
    ret.addPropertyResult('filter', 'Filter', cfn_parse.FromCloudFormation.getArray(CfnAnalyzerFilterPropertyFromCloudFormation)(properties.Filter));
    ret.addPropertyResult('ruleName', 'RuleName', cfn_parse.FromCloudFormation.getString(properties.RuleName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnalyzer {
    /**
     * The criteria that defines the rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html
     */
    export interface FilterProperty {
        /**
         * A "contains" condition to match for the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-contains
         */
        readonly contains?: string[];
        /**
         * An "equals" condition to match for the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-eq
         */
        readonly eq?: string[];
        /**
         * An "exists" condition to match for the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-exists
         */
        readonly exists?: boolean | cdk.IResolvable;
        /**
         * A "not equal" condition to match for the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-neq
         */
        readonly neq?: string[];
        /**
         * The property used to define the criteria in the filter for the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-property
         */
        readonly property: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnalyzer_FilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contains', cdk.listValidator(cdk.validateString))(properties.contains));
    errors.collect(cdk.propertyValidator('eq', cdk.listValidator(cdk.validateString))(properties.eq));
    errors.collect(cdk.propertyValidator('exists', cdk.validateBoolean)(properties.exists));
    errors.collect(cdk.propertyValidator('neq', cdk.listValidator(cdk.validateString))(properties.neq));
    errors.collect(cdk.propertyValidator('property', cdk.requiredValidator)(properties.property));
    errors.collect(cdk.propertyValidator('property', cdk.validateString)(properties.property));
    return errors.wrap('supplied properties not correct for "FilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AccessAnalyzer::Analyzer.Filter` resource
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AccessAnalyzer::Analyzer.Filter` resource.
 */
// @ts-ignore TS6133
function cfnAnalyzerFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnalyzer_FilterPropertyValidator(properties).assertSuccess();
    return {
        Contains: cdk.listMapper(cdk.stringToCloudFormation)(properties.contains),
        Eq: cdk.listMapper(cdk.stringToCloudFormation)(properties.eq),
        Exists: cdk.booleanToCloudFormation(properties.exists),
        Neq: cdk.listMapper(cdk.stringToCloudFormation)(properties.neq),
        Property: cdk.stringToCloudFormation(properties.property),
    };
}

// @ts-ignore TS6133
function CfnAnalyzerFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalyzer.FilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalyzer.FilterProperty>();
    ret.addPropertyResult('contains', 'Contains', properties.Contains != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Contains) : undefined);
    ret.addPropertyResult('eq', 'Eq', properties.Eq != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Eq) : undefined);
    ret.addPropertyResult('exists', 'Exists', properties.Exists != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Exists) : undefined);
    ret.addPropertyResult('neq', 'Neq', properties.Neq != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Neq) : undefined);
    ret.addPropertyResult('property', 'Property', cfn_parse.FromCloudFormation.getString(properties.Property));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
