// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:37.434Z","fingerprint":"V10M+EQbEKEHE6rf7zHLUYzFzJDotFXIpF2M+GAUkmI="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnPipeline`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html
 */
export interface CfnPipelineProps {

    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-name
     */
    readonly name: string;

    /**
     * Indicates whether to validate and start the pipeline or stop an active pipeline. By default, the value is set to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-activate
     */
    readonly activate?: boolean | cdk.IResolvable;

    /**
     * A description of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-description
     */
    readonly description?: string;

    /**
     * The parameter objects used with the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-parameterobjects
     */
    readonly parameterObjects?: Array<CfnPipeline.ParameterObjectProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The parameter values used with the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-parametervalues
     */
    readonly parameterValues?: Array<CfnPipeline.ParameterValueProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The objects that define the pipeline. These objects overwrite the existing pipeline definition. Not all objects, fields, and values can be updated. For information about restrictions, see [Editing Your Pipeline](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-manage-pipeline-modify-console.html) in the *AWS Data Pipeline Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-pipelineobjects
     */
    readonly pipelineObjects?: Array<CfnPipeline.PipelineObjectProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of arbitrary tags (key-value pairs) to associate with the pipeline, which you can use to control permissions. For more information, see [Controlling Access to Pipelines and Resources](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-control-access.html) in the *AWS Data Pipeline Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-pipelinetags
     */
    readonly pipelineTags?: Array<CfnPipeline.PipelineTagProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnPipelineProps`
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the result of the validation.
 */
function CfnPipelinePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activate', cdk.validateBoolean)(properties.activate));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parameterObjects', cdk.listValidator(CfnPipeline_ParameterObjectPropertyValidator))(properties.parameterObjects));
    errors.collect(cdk.propertyValidator('parameterValues', cdk.listValidator(CfnPipeline_ParameterValuePropertyValidator))(properties.parameterValues));
    errors.collect(cdk.propertyValidator('pipelineObjects', cdk.listValidator(CfnPipeline_PipelineObjectPropertyValidator))(properties.pipelineObjects));
    errors.collect(cdk.propertyValidator('pipelineTags', cdk.listValidator(CfnPipeline_PipelineTagPropertyValidator))(properties.pipelineTags));
    return errors.wrap('supplied properties not correct for "CfnPipelineProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline` resource
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline` resource.
 */
// @ts-ignore TS6133
function cfnPipelinePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipelinePropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Activate: cdk.booleanToCloudFormation(properties.activate),
        Description: cdk.stringToCloudFormation(properties.description),
        ParameterObjects: cdk.listMapper(cfnPipelineParameterObjectPropertyToCloudFormation)(properties.parameterObjects),
        ParameterValues: cdk.listMapper(cfnPipelineParameterValuePropertyToCloudFormation)(properties.parameterValues),
        PipelineObjects: cdk.listMapper(cfnPipelinePipelineObjectPropertyToCloudFormation)(properties.pipelineObjects),
        PipelineTags: cdk.listMapper(cfnPipelinePipelineTagPropertyToCloudFormation)(properties.pipelineTags),
    };
}

// @ts-ignore TS6133
function CfnPipelinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipelineProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipelineProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('activate', 'Activate', properties.Activate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Activate) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('parameterObjects', 'ParameterObjects', properties.ParameterObjects != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineParameterObjectPropertyFromCloudFormation)(properties.ParameterObjects) : undefined);
    ret.addPropertyResult('parameterValues', 'ParameterValues', properties.ParameterValues != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineParameterValuePropertyFromCloudFormation)(properties.ParameterValues) : undefined);
    ret.addPropertyResult('pipelineObjects', 'PipelineObjects', properties.PipelineObjects != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelinePipelineObjectPropertyFromCloudFormation)(properties.PipelineObjects) : undefined);
    ret.addPropertyResult('pipelineTags', 'PipelineTags', properties.PipelineTags != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelinePipelineTagPropertyFromCloudFormation)(properties.PipelineTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DataPipeline::Pipeline`
 *
 * The AWS::DataPipeline::Pipeline resource specifies a data pipeline that you can use to automate the movement and transformation of data. In each pipeline, you define pipeline objects, such as activities, schedules, data nodes, and resources. For information about pipeline objects and components that you can use, see [Pipeline Object Reference](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-pipeline-objects.html) in the *AWS Data Pipeline Developer Guide* .
 *
 * The `AWS::DataPipeline::Pipeline` resource adds tasks, schedules, and preconditions to the specified pipeline. You can use `PutPipelineDefinition` to populate a new pipeline.
 *
 * `PutPipelineDefinition` also validates the configuration as it adds it to the pipeline. Changes to the pipeline are saved unless one of the following validation errors exist in the pipeline.
 *
 * - An object is missing a name or identifier field.
 * - A string or reference field is empty.
 * - The number of objects in the pipeline exceeds the allowed maximum number of objects.
 * - The pipeline is in a FINISHED state.
 *
 * Pipeline object definitions are passed to the [PutPipelineDefinition](https://docs.aws.amazon.com/datapipeline/latest/APIReference/API_PutPipelineDefinition.html) action and returned by the [GetPipelineDefinition](https://docs.aws.amazon.com/datapipeline/latest/APIReference/API_GetPipelineDefinition.html) action.
 *
 * @cloudformationResource AWS::DataPipeline::Pipeline
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html
 */
export class CfnPipeline extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DataPipeline::Pipeline";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipeline {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPipelinePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPipeline(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute PipelineId
     */
    public readonly attrPipelineId: string;

    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-name
     */
    public name: string;

    /**
     * Indicates whether to validate and start the pipeline or stop an active pipeline. By default, the value is set to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-activate
     */
    public activate: boolean | cdk.IResolvable | undefined;

    /**
     * A description of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-description
     */
    public description: string | undefined;

    /**
     * The parameter objects used with the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-parameterobjects
     */
    public parameterObjects: Array<CfnPipeline.ParameterObjectProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The parameter values used with the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-parametervalues
     */
    public parameterValues: Array<CfnPipeline.ParameterValueProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The objects that define the pipeline. These objects overwrite the existing pipeline definition. Not all objects, fields, and values can be updated. For information about restrictions, see [Editing Your Pipeline](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-manage-pipeline-modify-console.html) in the *AWS Data Pipeline Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-pipelineobjects
     */
    public pipelineObjects: Array<CfnPipeline.PipelineObjectProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A list of arbitrary tags (key-value pairs) to associate with the pipeline, which you can use to control permissions. For more information, see [Controlling Access to Pipelines and Resources](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-control-access.html) in the *AWS Data Pipeline Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-pipelinetags
     */
    public pipelineTags: Array<CfnPipeline.PipelineTagProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::DataPipeline::Pipeline`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPipelineProps) {
        super(scope, id, { type: CfnPipeline.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrPipelineId = cdk.Token.asString(this.getAtt('PipelineId', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.activate = props.activate;
        this.description = props.description;
        this.parameterObjects = props.parameterObjects;
        this.parameterValues = props.parameterValues;
        this.pipelineObjects = props.pipelineObjects;
        this.pipelineTags = props.pipelineTags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPipeline.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            activate: this.activate,
            description: this.description,
            parameterObjects: this.parameterObjects,
            parameterValues: this.parameterValues,
            pipelineObjects: this.pipelineObjects,
            pipelineTags: this.pipelineTags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPipelinePropsToCloudFormation(props);
    }
}

export namespace CfnPipeline {
    /**
     * A key-value pair that describes a property of a `PipelineObject` . The value is specified as either a string value ( `StringValue` ) or a reference to another object ( `RefValue` ) but not as both. To view fields for a data pipeline object, see [Pipeline Object Reference](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-pipeline-objects.html) in the *AWS Data Pipeline Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-field.html
     */
    export interface FieldProperty {
        /**
         * Specifies the name of a field for a particular object. To view valid values for a particular field, see [Pipeline Object Reference](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-pipeline-objects.html) in the *AWS Data Pipeline Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-field.html#cfn-datapipeline-pipeline-field-key
         */
        readonly key: string;
        /**
         * A field value that you specify as an identifier of another object in the same pipeline definition.
         *
         * > You can specify the field value as either a string value ( `StringValue` ) or a reference to another object ( `RefValue` ), but not both.
         *
         * Required if the key that you are using requires it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-field.html#cfn-datapipeline-pipeline-field-refvalue
         */
        readonly refValue?: string;
        /**
         * A field value that you specify as a string. To view valid values for a particular field, see [Pipeline Object Reference](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-pipeline-objects.html) in the *AWS Data Pipeline Developer Guide* .
         *
         * > You can specify the field value as either a string value ( `StringValue` ) or a reference to another object ( `RefValue` ), but not both.
         *
         * Required if the key that you are using requires it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-field.html#cfn-datapipeline-pipeline-field-stringvalue
         */
        readonly stringValue?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldProperty`
 *
 * @param properties - the TypeScript properties of a `FieldProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_FieldPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('refValue', cdk.validateString)(properties.refValue));
    errors.collect(cdk.propertyValidator('stringValue', cdk.validateString)(properties.stringValue));
    return errors.wrap('supplied properties not correct for "FieldProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.Field` resource
 *
 * @param properties - the TypeScript properties of a `FieldProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.Field` resource.
 */
// @ts-ignore TS6133
function cfnPipelineFieldPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_FieldPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        RefValue: cdk.stringToCloudFormation(properties.refValue),
        StringValue: cdk.stringToCloudFormation(properties.stringValue),
    };
}

// @ts-ignore TS6133
function CfnPipelineFieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.FieldProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.FieldProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('refValue', 'RefValue', properties.RefValue != null ? cfn_parse.FromCloudFormation.getString(properties.RefValue) : undefined);
    ret.addPropertyResult('stringValue', 'StringValue', properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * `Attribute` is a property of `ParameterObject` that defines the attributes of a parameter object as key-value pairs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterattribute.html
     */
    export interface ParameterAttributeProperty {
        /**
         * The field identifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterattribute.html#cfn-datapipeline-pipeline-parameterattribute-key
         */
        readonly key: string;
        /**
         * The field value, expressed as a String.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterattribute.html#cfn-datapipeline-pipeline-parameterattribute-stringvalue
         */
        readonly stringValue: string;
    }
}

/**
 * Determine whether the given properties match those of a `ParameterAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterAttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ParameterAttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('stringValue', cdk.requiredValidator)(properties.stringValue));
    errors.collect(cdk.propertyValidator('stringValue', cdk.validateString)(properties.stringValue));
    return errors.wrap('supplied properties not correct for "ParameterAttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.ParameterAttribute` resource
 *
 * @param properties - the TypeScript properties of a `ParameterAttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.ParameterAttribute` resource.
 */
// @ts-ignore TS6133
function cfnPipelineParameterAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ParameterAttributePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        StringValue: cdk.stringToCloudFormation(properties.stringValue),
    };
}

// @ts-ignore TS6133
function CfnPipelineParameterAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ParameterAttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ParameterAttributeProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('stringValue', 'StringValue', cfn_parse.FromCloudFormation.getString(properties.StringValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Contains information about a parameter object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobject.html
     */
    export interface ParameterObjectProperty {
        /**
         * The attributes of the parameter object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobject.html#cfn-datapipeline-pipeline-parameterobject-attributes
         */
        readonly attributes: Array<CfnPipeline.ParameterAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The ID of the parameter object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobject.html#cfn-datapipeline-pipeline-parameterobject-id
         */
        readonly id: string;
    }
}

/**
 * Determine whether the given properties match those of a `ParameterObjectProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterObjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ParameterObjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.requiredValidator)(properties.attributes));
    errors.collect(cdk.propertyValidator('attributes', cdk.listValidator(CfnPipeline_ParameterAttributePropertyValidator))(properties.attributes));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    return errors.wrap('supplied properties not correct for "ParameterObjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.ParameterObject` resource
 *
 * @param properties - the TypeScript properties of a `ParameterObjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.ParameterObject` resource.
 */
// @ts-ignore TS6133
function cfnPipelineParameterObjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ParameterObjectPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.listMapper(cfnPipelineParameterAttributePropertyToCloudFormation)(properties.attributes),
        Id: cdk.stringToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnPipelineParameterObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ParameterObjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ParameterObjectProperty>();
    ret.addPropertyResult('attributes', 'Attributes', cfn_parse.FromCloudFormation.getArray(CfnPipelineParameterAttributePropertyFromCloudFormation)(properties.Attributes));
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * A value or list of parameter values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parametervalue.html
     */
    export interface ParameterValueProperty {
        /**
         * The ID of the parameter value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parametervalue.html#cfn-datapipeline-pipeline-parametervalue-id
         */
        readonly id: string;
        /**
         * The field value, expressed as a String.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parametervalue.html#cfn-datapipeline-pipeline-parametervalue-stringvalue
         */
        readonly stringValue: string;
    }
}

/**
 * Determine whether the given properties match those of a `ParameterValueProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ParameterValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('stringValue', cdk.requiredValidator)(properties.stringValue));
    errors.collect(cdk.propertyValidator('stringValue', cdk.validateString)(properties.stringValue));
    return errors.wrap('supplied properties not correct for "ParameterValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.ParameterValue` resource
 *
 * @param properties - the TypeScript properties of a `ParameterValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.ParameterValue` resource.
 */
// @ts-ignore TS6133
function cfnPipelineParameterValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ParameterValuePropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        StringValue: cdk.stringToCloudFormation(properties.stringValue),
    };
}

// @ts-ignore TS6133
function CfnPipelineParameterValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ParameterValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ParameterValueProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('stringValue', 'StringValue', cfn_parse.FromCloudFormation.getString(properties.StringValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * PipelineObject is property of the AWS::DataPipeline::Pipeline resource that contains information about a pipeline object. This can be a logical, physical, or physical attempt pipeline object. The complete set of components of a pipeline defines the pipeline.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-pipelineobject.html
     */
    export interface PipelineObjectProperty {
        /**
         * Key-value pairs that define the properties of the object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-pipelineobject.html#cfn-datapipeline-pipeline-pipelineobject-fields
         */
        readonly fields: Array<CfnPipeline.FieldProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The ID of the object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-pipelineobject.html#cfn-datapipeline-pipeline-pipelineobject-id
         */
        readonly id: string;
        /**
         * The name of the object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-pipelineobject.html#cfn-datapipeline-pipeline-pipelineobject-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipelineObjectProperty`
 *
 * @param properties - the TypeScript properties of a `PipelineObjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_PipelineObjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fields', cdk.requiredValidator)(properties.fields));
    errors.collect(cdk.propertyValidator('fields', cdk.listValidator(CfnPipeline_FieldPropertyValidator))(properties.fields));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "PipelineObjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.PipelineObject` resource
 *
 * @param properties - the TypeScript properties of a `PipelineObjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.PipelineObject` resource.
 */
// @ts-ignore TS6133
function cfnPipelinePipelineObjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_PipelineObjectPropertyValidator(properties).assertSuccess();
    return {
        Fields: cdk.listMapper(cfnPipelineFieldPropertyToCloudFormation)(properties.fields),
        Id: cdk.stringToCloudFormation(properties.id),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPipelinePipelineObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.PipelineObjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.PipelineObjectProperty>();
    ret.addPropertyResult('fields', 'Fields', cfn_parse.FromCloudFormation.getArray(CfnPipelineFieldPropertyFromCloudFormation)(properties.Fields));
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * A list of arbitrary tags (key-value pairs) to associate with the pipeline, which you can use to control permissions. For more information, see [Controlling Access to Pipelines and Resources](https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/dp-control-access.html) in the *AWS Data Pipeline Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-pipelinetag.html
     */
    export interface PipelineTagProperty {
        /**
         * The key name of a tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-pipelinetag.html#cfn-datapipeline-pipeline-pipelinetag-key
         */
        readonly key: string;
        /**
         * The value to associate with the key name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-pipelinetag.html#cfn-datapipeline-pipeline-pipelinetag-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `PipelineTagProperty`
 *
 * @param properties - the TypeScript properties of a `PipelineTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_PipelineTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "PipelineTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.PipelineTag` resource
 *
 * @param properties - the TypeScript properties of a `PipelineTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DataPipeline::Pipeline.PipelineTag` resource.
 */
// @ts-ignore TS6133
function cfnPipelinePipelineTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_PipelineTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPipelinePipelineTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.PipelineTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.PipelineTagProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
