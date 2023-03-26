// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:36.057Z","fingerprint":"W45lyQAfSLgpOFEabHc6EWPuW/CGSIUD/BBqXsME1p4="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnReportDefinition`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html
 */
export interface CfnReportDefinitionProps {

    /**
     * The compression format that Amazon Web Services uses for the report.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-compression
     */
    readonly compression: string;

    /**
     * The format that Amazon Web Services saves the report in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-format
     */
    readonly format: string;

    /**
     * Whether you want AWS to update your reports after they have been finalized if AWS detects charges related to previous months. These charges can include refunds, credits, or support fees.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-refreshclosedreports
     */
    readonly refreshClosedReports: boolean | cdk.IResolvable;

    /**
     * The name of the report that you want to create. The name must be unique, is case sensitive, and can't include spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-reportname
     */
    readonly reportName: string;

    /**
     * Whether you want AWS to overwrite the previous version of each report or to deliver the report in addition to the previous versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-reportversioning
     */
    readonly reportVersioning: string;

    /**
     * The S3 bucket where Amazon Web Services delivers the report.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The prefix that Amazon Web Services adds to the report name when Amazon Web Services delivers the report. Your prefix can't include spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3prefix
     */
    readonly s3Prefix: string;

    /**
     * The Region of the S3 bucket that Amazon Web Services delivers the report into.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3region
     */
    readonly s3Region: string;

    /**
     * The granularity of the line items in the report.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-timeunit
     */
    readonly timeUnit: string;

    /**
     * A list of manifests that you want AWS to create for this report.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-additionalartifacts
     */
    readonly additionalArtifacts?: string[];

    /**
     * A list of strings that indicate additional content that AWS includes in the report, such as individual resource IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-additionalschemaelements
     */
    readonly additionalSchemaElements?: string[];

    /**
     * The Amazon Resource Name (ARN) of the billing view. You can get this value by using the billing view service public APIs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-billingviewarn
     */
    readonly billingViewArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnReportDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnReportDefinitionProps`
 *
 * @returns the result of the validation.
 */
function CfnReportDefinitionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalArtifacts', cdk.listValidator(cdk.validateString))(properties.additionalArtifacts));
    errors.collect(cdk.propertyValidator('additionalSchemaElements', cdk.listValidator(cdk.validateString))(properties.additionalSchemaElements));
    errors.collect(cdk.propertyValidator('billingViewArn', cdk.validateString)(properties.billingViewArn));
    errors.collect(cdk.propertyValidator('compression', cdk.requiredValidator)(properties.compression));
    errors.collect(cdk.propertyValidator('compression', cdk.validateString)(properties.compression));
    errors.collect(cdk.propertyValidator('format', cdk.requiredValidator)(properties.format));
    errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
    errors.collect(cdk.propertyValidator('refreshClosedReports', cdk.requiredValidator)(properties.refreshClosedReports));
    errors.collect(cdk.propertyValidator('refreshClosedReports', cdk.validateBoolean)(properties.refreshClosedReports));
    errors.collect(cdk.propertyValidator('reportName', cdk.requiredValidator)(properties.reportName));
    errors.collect(cdk.propertyValidator('reportName', cdk.validateString)(properties.reportName));
    errors.collect(cdk.propertyValidator('reportVersioning', cdk.requiredValidator)(properties.reportVersioning));
    errors.collect(cdk.propertyValidator('reportVersioning', cdk.validateString)(properties.reportVersioning));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Prefix', cdk.requiredValidator)(properties.s3Prefix));
    errors.collect(cdk.propertyValidator('s3Prefix', cdk.validateString)(properties.s3Prefix));
    errors.collect(cdk.propertyValidator('s3Region', cdk.requiredValidator)(properties.s3Region));
    errors.collect(cdk.propertyValidator('s3Region', cdk.validateString)(properties.s3Region));
    errors.collect(cdk.propertyValidator('timeUnit', cdk.requiredValidator)(properties.timeUnit));
    errors.collect(cdk.propertyValidator('timeUnit', cdk.validateString)(properties.timeUnit));
    return errors.wrap('supplied properties not correct for "CfnReportDefinitionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CUR::ReportDefinition` resource
 *
 * @param properties - the TypeScript properties of a `CfnReportDefinitionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CUR::ReportDefinition` resource.
 */
// @ts-ignore TS6133
function cfnReportDefinitionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReportDefinitionPropsValidator(properties).assertSuccess();
    return {
        Compression: cdk.stringToCloudFormation(properties.compression),
        Format: cdk.stringToCloudFormation(properties.format),
        RefreshClosedReports: cdk.booleanToCloudFormation(properties.refreshClosedReports),
        ReportName: cdk.stringToCloudFormation(properties.reportName),
        ReportVersioning: cdk.stringToCloudFormation(properties.reportVersioning),
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3Prefix: cdk.stringToCloudFormation(properties.s3Prefix),
        S3Region: cdk.stringToCloudFormation(properties.s3Region),
        TimeUnit: cdk.stringToCloudFormation(properties.timeUnit),
        AdditionalArtifacts: cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalArtifacts),
        AdditionalSchemaElements: cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalSchemaElements),
        BillingViewArn: cdk.stringToCloudFormation(properties.billingViewArn),
    };
}

// @ts-ignore TS6133
function CfnReportDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReportDefinitionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReportDefinitionProps>();
    ret.addPropertyResult('compression', 'Compression', cfn_parse.FromCloudFormation.getString(properties.Compression));
    ret.addPropertyResult('format', 'Format', cfn_parse.FromCloudFormation.getString(properties.Format));
    ret.addPropertyResult('refreshClosedReports', 'RefreshClosedReports', cfn_parse.FromCloudFormation.getBoolean(properties.RefreshClosedReports));
    ret.addPropertyResult('reportName', 'ReportName', cfn_parse.FromCloudFormation.getString(properties.ReportName));
    ret.addPropertyResult('reportVersioning', 'ReportVersioning', cfn_parse.FromCloudFormation.getString(properties.ReportVersioning));
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3Prefix', 'S3Prefix', cfn_parse.FromCloudFormation.getString(properties.S3Prefix));
    ret.addPropertyResult('s3Region', 'S3Region', cfn_parse.FromCloudFormation.getString(properties.S3Region));
    ret.addPropertyResult('timeUnit', 'TimeUnit', cfn_parse.FromCloudFormation.getString(properties.TimeUnit));
    ret.addPropertyResult('additionalArtifacts', 'AdditionalArtifacts', properties.AdditionalArtifacts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdditionalArtifacts) : undefined);
    ret.addPropertyResult('additionalSchemaElements', 'AdditionalSchemaElements', properties.AdditionalSchemaElements != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdditionalSchemaElements) : undefined);
    ret.addPropertyResult('billingViewArn', 'BillingViewArn', properties.BillingViewArn != null ? cfn_parse.FromCloudFormation.getString(properties.BillingViewArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CUR::ReportDefinition`
 *
 * The definition of AWS Cost and Usage Report. You can specify the report name, time unit, report format, compression format, S3 bucket, additional artifacts, and schema elements in the definition.
 *
 * @cloudformationResource AWS::CUR::ReportDefinition
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html
 */
export class CfnReportDefinition extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CUR::ReportDefinition";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReportDefinition {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReportDefinitionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReportDefinition(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The compression format that Amazon Web Services uses for the report.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-compression
     */
    public compression: string;

    /**
     * The format that Amazon Web Services saves the report in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-format
     */
    public format: string;

    /**
     * Whether you want AWS to update your reports after they have been finalized if AWS detects charges related to previous months. These charges can include refunds, credits, or support fees.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-refreshclosedreports
     */
    public refreshClosedReports: boolean | cdk.IResolvable;

    /**
     * The name of the report that you want to create. The name must be unique, is case sensitive, and can't include spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-reportname
     */
    public reportName: string;

    /**
     * Whether you want AWS to overwrite the previous version of each report or to deliver the report in addition to the previous versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-reportversioning
     */
    public reportVersioning: string;

    /**
     * The S3 bucket where Amazon Web Services delivers the report.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3bucket
     */
    public s3Bucket: string;

    /**
     * The prefix that Amazon Web Services adds to the report name when Amazon Web Services delivers the report. Your prefix can't include spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3prefix
     */
    public s3Prefix: string;

    /**
     * The Region of the S3 bucket that Amazon Web Services delivers the report into.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3region
     */
    public s3Region: string;

    /**
     * The granularity of the line items in the report.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-timeunit
     */
    public timeUnit: string;

    /**
     * A list of manifests that you want AWS to create for this report.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-additionalartifacts
     */
    public additionalArtifacts: string[] | undefined;

    /**
     * A list of strings that indicate additional content that AWS includes in the report, such as individual resource IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-additionalschemaelements
     */
    public additionalSchemaElements: string[] | undefined;

    /**
     * The Amazon Resource Name (ARN) of the billing view. You can get this value by using the billing view service public APIs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-billingviewarn
     */
    public billingViewArn: string | undefined;

    /**
     * Create a new `AWS::CUR::ReportDefinition`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReportDefinitionProps) {
        super(scope, id, { type: CfnReportDefinition.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'compression', this);
        cdk.requireProperty(props, 'format', this);
        cdk.requireProperty(props, 'refreshClosedReports', this);
        cdk.requireProperty(props, 'reportName', this);
        cdk.requireProperty(props, 'reportVersioning', this);
        cdk.requireProperty(props, 's3Bucket', this);
        cdk.requireProperty(props, 's3Prefix', this);
        cdk.requireProperty(props, 's3Region', this);
        cdk.requireProperty(props, 'timeUnit', this);

        this.compression = props.compression;
        this.format = props.format;
        this.refreshClosedReports = props.refreshClosedReports;
        this.reportName = props.reportName;
        this.reportVersioning = props.reportVersioning;
        this.s3Bucket = props.s3Bucket;
        this.s3Prefix = props.s3Prefix;
        this.s3Region = props.s3Region;
        this.timeUnit = props.timeUnit;
        this.additionalArtifacts = props.additionalArtifacts;
        this.additionalSchemaElements = props.additionalSchemaElements;
        this.billingViewArn = props.billingViewArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReportDefinition.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            compression: this.compression,
            format: this.format,
            refreshClosedReports: this.refreshClosedReports,
            reportName: this.reportName,
            reportVersioning: this.reportVersioning,
            s3Bucket: this.s3Bucket,
            s3Prefix: this.s3Prefix,
            s3Region: this.s3Region,
            timeUnit: this.timeUnit,
            additionalArtifacts: this.additionalArtifacts,
            additionalSchemaElements: this.additionalSchemaElements,
            billingViewArn: this.billingViewArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReportDefinitionPropsToCloudFormation(props);
    }
}
