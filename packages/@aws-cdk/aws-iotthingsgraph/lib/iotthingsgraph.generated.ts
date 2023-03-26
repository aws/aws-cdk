// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:41.440Z","fingerprint":"wV3NW8qh1d7vhf/JKRXRRCWB+IuzdkUd/afbObObhUc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnFlowTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html
 */
export interface CfnFlowTemplateProps {

    /**
     * A workflow's definition document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html#cfn-iotthingsgraph-flowtemplate-definition
     */
    readonly definition: CfnFlowTemplate.DefinitionDocumentProperty | cdk.IResolvable;

    /**
     * The version of the user's namespace against which the workflow was validated. Use this value in your system instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html#cfn-iotthingsgraph-flowtemplate-compatiblenamespaceversion
     */
    readonly compatibleNamespaceVersion?: number;
}

/**
 * Determine whether the given properties match those of a `CfnFlowTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnFlowTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('compatibleNamespaceVersion', cdk.validateNumber)(properties.compatibleNamespaceVersion));
    errors.collect(cdk.propertyValidator('definition', cdk.requiredValidator)(properties.definition));
    errors.collect(cdk.propertyValidator('definition', CfnFlowTemplate_DefinitionDocumentPropertyValidator)(properties.definition));
    return errors.wrap('supplied properties not correct for "CfnFlowTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTThingsGraph::FlowTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnFlowTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTThingsGraph::FlowTemplate` resource.
 */
// @ts-ignore TS6133
function cfnFlowTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowTemplatePropsValidator(properties).assertSuccess();
    return {
        Definition: cfnFlowTemplateDefinitionDocumentPropertyToCloudFormation(properties.definition),
        CompatibleNamespaceVersion: cdk.numberToCloudFormation(properties.compatibleNamespaceVersion),
    };
}

// @ts-ignore TS6133
function CfnFlowTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowTemplateProps>();
    ret.addPropertyResult('definition', 'Definition', CfnFlowTemplateDefinitionDocumentPropertyFromCloudFormation(properties.Definition));
    ret.addPropertyResult('compatibleNamespaceVersion', 'CompatibleNamespaceVersion', properties.CompatibleNamespaceVersion != null ? cfn_parse.FromCloudFormation.getNumber(properties.CompatibleNamespaceVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTThingsGraph::FlowTemplate`
 *
 * Represents a workflow template. Workflows can be created only in the user's namespace. (The public namespace contains only entities.) The workflow can contain only entities in the specified namespace. The workflow is validated against the entities in the latest version of the user's namespace unless another namespace version is specified in the request.
 *
 * @cloudformationResource AWS::IoTThingsGraph::FlowTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html
 */
export class CfnFlowTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTThingsGraph::FlowTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlowTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFlowTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnFlowTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A workflow's definition document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html#cfn-iotthingsgraph-flowtemplate-definition
     */
    public definition: CfnFlowTemplate.DefinitionDocumentProperty | cdk.IResolvable;

    /**
     * The version of the user's namespace against which the workflow was validated. Use this value in your system instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotthingsgraph-flowtemplate.html#cfn-iotthingsgraph-flowtemplate-compatiblenamespaceversion
     */
    public compatibleNamespaceVersion: number | undefined;

    /**
     * Create a new `AWS::IoTThingsGraph::FlowTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFlowTemplateProps) {
        super(scope, id, { type: CfnFlowTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'definition', this);

        this.definition = props.definition;
        this.compatibleNamespaceVersion = props.compatibleNamespaceVersion;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlowTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            definition: this.definition,
            compatibleNamespaceVersion: this.compatibleNamespaceVersion,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFlowTemplatePropsToCloudFormation(props);
    }
}

export namespace CfnFlowTemplate {
    /**
     * A document that defines an entity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotthingsgraph-flowtemplate-definitiondocument.html
     */
    export interface DefinitionDocumentProperty {
        /**
         * The language used to define the entity. `GRAPHQL` is the only valid value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotthingsgraph-flowtemplate-definitiondocument.html#cfn-iotthingsgraph-flowtemplate-definitiondocument-language
         */
        readonly language: string;
        /**
         * The GraphQL text that defines the entity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotthingsgraph-flowtemplate-definitiondocument.html#cfn-iotthingsgraph-flowtemplate-definitiondocument-text
         */
        readonly text: string;
    }
}

/**
 * Determine whether the given properties match those of a `DefinitionDocumentProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionDocumentProperty`
 *
 * @returns the result of the validation.
 */
function CfnFlowTemplate_DefinitionDocumentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('language', cdk.requiredValidator)(properties.language));
    errors.collect(cdk.propertyValidator('language', cdk.validateString)(properties.language));
    errors.collect(cdk.propertyValidator('text', cdk.requiredValidator)(properties.text));
    errors.collect(cdk.propertyValidator('text', cdk.validateString)(properties.text));
    return errors.wrap('supplied properties not correct for "DefinitionDocumentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTThingsGraph::FlowTemplate.DefinitionDocument` resource
 *
 * @param properties - the TypeScript properties of a `DefinitionDocumentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTThingsGraph::FlowTemplate.DefinitionDocument` resource.
 */
// @ts-ignore TS6133
function cfnFlowTemplateDefinitionDocumentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFlowTemplate_DefinitionDocumentPropertyValidator(properties).assertSuccess();
    return {
        Language: cdk.stringToCloudFormation(properties.language),
        Text: cdk.stringToCloudFormation(properties.text),
    };
}

// @ts-ignore TS6133
function CfnFlowTemplateDefinitionDocumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowTemplate.DefinitionDocumentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowTemplate.DefinitionDocumentProperty>();
    ret.addPropertyResult('language', 'Language', cfn_parse.FromCloudFormation.getString(properties.Language));
    ret.addPropertyResult('text', 'Text', cfn_parse.FromCloudFormation.getString(properties.Text));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
