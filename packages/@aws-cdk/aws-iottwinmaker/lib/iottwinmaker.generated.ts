// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:42.381Z","fingerprint":"lhcX54acmc/Id5B8Aa2ka0utMkCp5u7IT6C19mvakSg="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnComponentType`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html
 */
export interface CfnComponentTypeProps {

    /**
     * The ID of the component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-componenttypeid
     */
    readonly componentTypeId: string;

    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-workspaceid
     */
    readonly workspaceId: string;

    /**
     * The description of the component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-description
     */
    readonly description?: string;

    /**
     * The name of the parent component type that this component type extends.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-extendsfrom
     */
    readonly extendsFrom?: string[];

    /**
     * An object that maps strings to the functions in the component type. Each string in the mapping must be unique to this object.
     *
     * For information on the FunctionResponse object see the [FunctionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_FunctionResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-functions
     */
    readonly functions?: { [key: string]: (CfnComponentType.FunctionProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * A boolean value that specifies whether an entity can have more than one component of this type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-issingleton
     */
    readonly isSingleton?: boolean | cdk.IResolvable;

    /**
     * An object that maps strings to the property definitions in the component type. Each string in the mapping must be unique to this object.
     *
     * For information about the PropertyDefinitionResponse object, see the [PropertyDefinitionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_PropertyDefinitionResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertydefinitions
     */
    readonly propertyDefinitions?: { [key: string]: (CfnComponentType.PropertyDefinitionProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * An object that maps strings to the property groups in the component type. Each string in the mapping must be unique to this object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertygroups
     */
    readonly propertyGroups?: { [key: string]: (CfnComponentType.PropertyGroupProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The ComponentType tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnComponentTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnComponentTypeProps`
 *
 * @returns the result of the validation.
 */
function CfnComponentTypePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentTypeId', cdk.requiredValidator)(properties.componentTypeId));
    errors.collect(cdk.propertyValidator('componentTypeId', cdk.validateString)(properties.componentTypeId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('extendsFrom', cdk.listValidator(cdk.validateString))(properties.extendsFrom));
    errors.collect(cdk.propertyValidator('functions', cdk.hashValidator(CfnComponentType_FunctionPropertyValidator))(properties.functions));
    errors.collect(cdk.propertyValidator('isSingleton', cdk.validateBoolean)(properties.isSingleton));
    errors.collect(cdk.propertyValidator('propertyDefinitions', cdk.hashValidator(CfnComponentType_PropertyDefinitionPropertyValidator))(properties.propertyDefinitions));
    errors.collect(cdk.propertyValidator('propertyGroups', cdk.hashValidator(CfnComponentType_PropertyGroupPropertyValidator))(properties.propertyGroups));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.requiredValidator)(properties.workspaceId));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.validateString)(properties.workspaceId));
    return errors.wrap('supplied properties not correct for "CfnComponentTypeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType` resource
 *
 * @param properties - the TypeScript properties of a `CfnComponentTypeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentTypePropsValidator(properties).assertSuccess();
    return {
        ComponentTypeId: cdk.stringToCloudFormation(properties.componentTypeId),
        WorkspaceId: cdk.stringToCloudFormation(properties.workspaceId),
        Description: cdk.stringToCloudFormation(properties.description),
        ExtendsFrom: cdk.listMapper(cdk.stringToCloudFormation)(properties.extendsFrom),
        Functions: cdk.hashMapper(cfnComponentTypeFunctionPropertyToCloudFormation)(properties.functions),
        IsSingleton: cdk.booleanToCloudFormation(properties.isSingleton),
        PropertyDefinitions: cdk.hashMapper(cfnComponentTypePropertyDefinitionPropertyToCloudFormation)(properties.propertyDefinitions),
        PropertyGroups: cdk.hashMapper(cfnComponentTypePropertyGroupPropertyToCloudFormation)(properties.propertyGroups),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnComponentTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentTypeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentTypeProps>();
    ret.addPropertyResult('componentTypeId', 'ComponentTypeId', cfn_parse.FromCloudFormation.getString(properties.ComponentTypeId));
    ret.addPropertyResult('workspaceId', 'WorkspaceId', cfn_parse.FromCloudFormation.getString(properties.WorkspaceId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('extendsFrom', 'ExtendsFrom', properties.ExtendsFrom != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExtendsFrom) : undefined);
    ret.addPropertyResult('functions', 'Functions', properties.Functions != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypeFunctionPropertyFromCloudFormation)(properties.Functions) : undefined);
    ret.addPropertyResult('isSingleton', 'IsSingleton', properties.IsSingleton != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsSingleton) : undefined);
    ret.addPropertyResult('propertyDefinitions', 'PropertyDefinitions', properties.PropertyDefinitions != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypePropertyDefinitionPropertyFromCloudFormation)(properties.PropertyDefinitions) : undefined);
    ret.addPropertyResult('propertyGroups', 'PropertyGroups', properties.PropertyGroups != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypePropertyGroupPropertyFromCloudFormation)(properties.PropertyGroups) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTTwinMaker::ComponentType`
 *
 * Use the `AWS::IoTTwinMaker::ComponentType` resource to declare a component type.
 *
 * @cloudformationResource AWS::IoTTwinMaker::ComponentType
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html
 */
export class CfnComponentType extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::ComponentType";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponentType {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnComponentTypePropsFromCloudFormation(resourceProperties);
        const ret = new CfnComponentType(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the component type.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The date and time when the component type was created.
     * @cloudformationAttribute CreationDateTime
     */
    public readonly attrCreationDateTime: string;

    /**
     * A boolean value that specifies whether the component type is abstract.
     * @cloudformationAttribute IsAbstract
     */
    public readonly attrIsAbstract: cdk.IResolvable;

    /**
     * A boolean value that specifies whether the component type has a schema initializer and that the schema initializer has run.
     * @cloudformationAttribute IsSchemaInitialized
     */
    public readonly attrIsSchemaInitialized: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Status.Error.Code
     */
    public readonly attrStatusErrorCode: string;

    /**
     *
     * @cloudformationAttribute Status.Error.Message
     */
    public readonly attrStatusErrorMessage: string;

    /**
     *
     * @cloudformationAttribute Status.State
     */
    public readonly attrStatusState: string;

    /**
     * The component type the update time.
     * @cloudformationAttribute UpdateDateTime
     */
    public readonly attrUpdateDateTime: string;

    /**
     * The ID of the component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-componenttypeid
     */
    public componentTypeId: string;

    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-workspaceid
     */
    public workspaceId: string;

    /**
     * The description of the component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-description
     */
    public description: string | undefined;

    /**
     * The name of the parent component type that this component type extends.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-extendsfrom
     */
    public extendsFrom: string[] | undefined;

    /**
     * An object that maps strings to the functions in the component type. Each string in the mapping must be unique to this object.
     *
     * For information on the FunctionResponse object see the [FunctionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_FunctionResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-functions
     */
    public functions: { [key: string]: (CfnComponentType.FunctionProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * A boolean value that specifies whether an entity can have more than one component of this type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-issingleton
     */
    public isSingleton: boolean | cdk.IResolvable | undefined;

    /**
     * An object that maps strings to the property definitions in the component type. Each string in the mapping must be unique to this object.
     *
     * For information about the PropertyDefinitionResponse object, see the [PropertyDefinitionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_PropertyDefinitionResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertydefinitions
     */
    public propertyDefinitions: { [key: string]: (CfnComponentType.PropertyDefinitionProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * An object that maps strings to the property groups in the component type. Each string in the mapping must be unique to this object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertygroups
     */
    public propertyGroups: { [key: string]: (CfnComponentType.PropertyGroupProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * The ComponentType tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTTwinMaker::ComponentType`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnComponentTypeProps) {
        super(scope, id, { type: CfnComponentType.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'componentTypeId', this);
        cdk.requireProperty(props, 'workspaceId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationDateTime = cdk.Token.asString(this.getAtt('CreationDateTime', cdk.ResolutionTypeHint.STRING));
        this.attrIsAbstract = this.getAtt('IsAbstract', cdk.ResolutionTypeHint.STRING);
        this.attrIsSchemaInitialized = this.getAtt('IsSchemaInitialized', cdk.ResolutionTypeHint.STRING);
        this.attrStatusErrorCode = cdk.Token.asString(this.getAtt('Status.Error.Code', cdk.ResolutionTypeHint.STRING));
        this.attrStatusErrorMessage = cdk.Token.asString(this.getAtt('Status.Error.Message', cdk.ResolutionTypeHint.STRING));
        this.attrStatusState = cdk.Token.asString(this.getAtt('Status.State', cdk.ResolutionTypeHint.STRING));
        this.attrUpdateDateTime = cdk.Token.asString(this.getAtt('UpdateDateTime', cdk.ResolutionTypeHint.STRING));

        this.componentTypeId = props.componentTypeId;
        this.workspaceId = props.workspaceId;
        this.description = props.description;
        this.extendsFrom = props.extendsFrom;
        this.functions = props.functions;
        this.isSingleton = props.isSingleton;
        this.propertyDefinitions = props.propertyDefinitions;
        this.propertyGroups = props.propertyGroups;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::ComponentType", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnComponentType.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            componentTypeId: this.componentTypeId,
            workspaceId: this.workspaceId,
            description: this.description,
            extendsFrom: this.extendsFrom,
            functions: this.functions,
            isSingleton: this.isSingleton,
            propertyDefinitions: this.propertyDefinitions,
            propertyGroups: this.propertyGroups,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnComponentTypePropsToCloudFormation(props);
    }
}

export namespace CfnComponentType {
    /**
     * The data connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html
     */
    export interface DataConnectorProperty {
        /**
         * A boolean value that specifies whether the data connector is native to IoT TwinMaker.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html#cfn-iottwinmaker-componenttype-dataconnector-isnative
         */
        readonly isNative?: boolean | cdk.IResolvable;
        /**
         * The Lambda function associated with the data connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html#cfn-iottwinmaker-componenttype-dataconnector-lambda
         */
        readonly lambda?: CfnComponentType.LambdaFunctionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DataConnectorProperty`
 *
 * @param properties - the TypeScript properties of a `DataConnectorProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_DataConnectorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isNative', cdk.validateBoolean)(properties.isNative));
    errors.collect(cdk.propertyValidator('lambda', CfnComponentType_LambdaFunctionPropertyValidator)(properties.lambda));
    return errors.wrap('supplied properties not correct for "DataConnectorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.DataConnector` resource
 *
 * @param properties - the TypeScript properties of a `DataConnectorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.DataConnector` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeDataConnectorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_DataConnectorPropertyValidator(properties).assertSuccess();
    return {
        IsNative: cdk.booleanToCloudFormation(properties.isNative),
        Lambda: cfnComponentTypeLambdaFunctionPropertyToCloudFormation(properties.lambda),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeDataConnectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.DataConnectorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.DataConnectorProperty>();
    ret.addPropertyResult('isNative', 'IsNative', properties.IsNative != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsNative) : undefined);
    ret.addPropertyResult('lambda', 'Lambda', properties.Lambda != null ? CfnComponentTypeLambdaFunctionPropertyFromCloudFormation(properties.Lambda) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     * An object that specifies the data type of a property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html
     */
    export interface DataTypeProperty {
        /**
         * The allowed values for this data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-allowedvalues
         */
        readonly allowedValues?: Array<CfnComponentType.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The nested type in the data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-nestedtype
         */
        readonly nestedType?: CfnComponentType.DataTypeProperty | cdk.IResolvable;
        /**
         * A relationship that associates a component with another component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-relationship
         */
        readonly relationship?: CfnComponentType.RelationshipProperty | cdk.IResolvable;
        /**
         * The underlying type of the data type.
         *
         * Valid Values: `RELATIONSHIP | STRING | LONG | BOOLEAN | INTEGER | DOUBLE | LIST | MAP`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-type
         */
        readonly type: string;
        /**
         * The unit of measure used in this data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-unitofmeasure
         */
        readonly unitOfMeasure?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataTypeProperty`
 *
 * @param properties - the TypeScript properties of a `DataTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_DataTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedValues', cdk.listValidator(CfnComponentType_DataValuePropertyValidator))(properties.allowedValues));
    errors.collect(cdk.propertyValidator('nestedType', CfnComponentType_DataTypePropertyValidator)(properties.nestedType));
    errors.collect(cdk.propertyValidator('relationship', CfnComponentType_RelationshipPropertyValidator)(properties.relationship));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('unitOfMeasure', cdk.validateString)(properties.unitOfMeasure));
    return errors.wrap('supplied properties not correct for "DataTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.DataType` resource
 *
 * @param properties - the TypeScript properties of a `DataTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.DataType` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeDataTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_DataTypePropertyValidator(properties).assertSuccess();
    return {
        AllowedValues: cdk.listMapper(cfnComponentTypeDataValuePropertyToCloudFormation)(properties.allowedValues),
        NestedType: cfnComponentTypeDataTypePropertyToCloudFormation(properties.nestedType),
        Relationship: cfnComponentTypeRelationshipPropertyToCloudFormation(properties.relationship),
        Type: cdk.stringToCloudFormation(properties.type),
        UnitOfMeasure: cdk.stringToCloudFormation(properties.unitOfMeasure),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeDataTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.DataTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.DataTypeProperty>();
    ret.addPropertyResult('allowedValues', 'AllowedValues', properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentTypeDataValuePropertyFromCloudFormation)(properties.AllowedValues) : undefined);
    ret.addPropertyResult('nestedType', 'NestedType', properties.NestedType != null ? CfnComponentTypeDataTypePropertyFromCloudFormation(properties.NestedType) : undefined);
    ret.addPropertyResult('relationship', 'Relationship', properties.Relationship != null ? CfnComponentTypeRelationshipPropertyFromCloudFormation(properties.Relationship) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('unitOfMeasure', 'UnitOfMeasure', properties.UnitOfMeasure != null ? cfn_parse.FromCloudFormation.getString(properties.UnitOfMeasure) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     * An object that specifies a value for a property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html
     */
    export interface DataValueProperty {
        /**
         * A boolean value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-booleanvalue
         */
        readonly booleanValue?: boolean | cdk.IResolvable;
        /**
         * A double value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-doublevalue
         */
        readonly doubleValue?: number;
        /**
         * An expression that produces the value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-expression
         */
        readonly expression?: string;
        /**
         * An integer value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-integervalue
         */
        readonly integerValue?: number;
        /**
         * A list of multiple values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-listvalue
         */
        readonly listValue?: Array<CfnComponentType.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A long value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-longvalue
         */
        readonly longValue?: number;
        /**
         * An object that maps strings to multiple `DataValue` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-mapvalue
         */
        readonly mapValue?: { [key: string]: (CfnComponentType.DataValueProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * A value that relates a component to another component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-relationshipvalue
         */
        readonly relationshipValue?: any | cdk.IResolvable;
        /**
         * A string value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-stringvalue
         */
        readonly stringValue?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataValueProperty`
 *
 * @param properties - the TypeScript properties of a `DataValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_DataValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('booleanValue', cdk.validateBoolean)(properties.booleanValue));
    errors.collect(cdk.propertyValidator('doubleValue', cdk.validateNumber)(properties.doubleValue));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('integerValue', cdk.validateNumber)(properties.integerValue));
    errors.collect(cdk.propertyValidator('listValue', cdk.listValidator(CfnComponentType_DataValuePropertyValidator))(properties.listValue));
    errors.collect(cdk.propertyValidator('longValue', cdk.validateNumber)(properties.longValue));
    errors.collect(cdk.propertyValidator('mapValue', cdk.hashValidator(CfnComponentType_DataValuePropertyValidator))(properties.mapValue));
    errors.collect(cdk.propertyValidator('relationshipValue', cdk.validateObject)(properties.relationshipValue));
    errors.collect(cdk.propertyValidator('stringValue', cdk.validateString)(properties.stringValue));
    return errors.wrap('supplied properties not correct for "DataValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.DataValue` resource
 *
 * @param properties - the TypeScript properties of a `DataValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.DataValue` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeDataValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_DataValuePropertyValidator(properties).assertSuccess();
    return {
        BooleanValue: cdk.booleanToCloudFormation(properties.booleanValue),
        DoubleValue: cdk.numberToCloudFormation(properties.doubleValue),
        Expression: cdk.stringToCloudFormation(properties.expression),
        IntegerValue: cdk.numberToCloudFormation(properties.integerValue),
        ListValue: cdk.listMapper(cfnComponentTypeDataValuePropertyToCloudFormation)(properties.listValue),
        LongValue: cdk.numberToCloudFormation(properties.longValue),
        MapValue: cdk.hashMapper(cfnComponentTypeDataValuePropertyToCloudFormation)(properties.mapValue),
        RelationshipValue: cdk.objectToCloudFormation(properties.relationshipValue),
        StringValue: cdk.stringToCloudFormation(properties.stringValue),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeDataValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.DataValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.DataValueProperty>();
    ret.addPropertyResult('booleanValue', 'BooleanValue', properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BooleanValue) : undefined);
    ret.addPropertyResult('doubleValue', 'DoubleValue', properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DoubleValue) : undefined);
    ret.addPropertyResult('expression', 'Expression', properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined);
    ret.addPropertyResult('integerValue', 'IntegerValue', properties.IntegerValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntegerValue) : undefined);
    ret.addPropertyResult('listValue', 'ListValue', properties.ListValue != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentTypeDataValuePropertyFromCloudFormation)(properties.ListValue) : undefined);
    ret.addPropertyResult('longValue', 'LongValue', properties.LongValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.LongValue) : undefined);
    ret.addPropertyResult('mapValue', 'MapValue', properties.MapValue != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypeDataValuePropertyFromCloudFormation)(properties.MapValue) : undefined);
    ret.addPropertyResult('relationshipValue', 'RelationshipValue', properties.RelationshipValue != null ? cfn_parse.FromCloudFormation.getAny(properties.RelationshipValue) : undefined);
    ret.addPropertyResult('stringValue', 'StringValue', properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html
     */
    export interface ErrorProperty {
        /**
         * `CfnComponentType.ErrorProperty.Code`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html#cfn-iottwinmaker-componenttype-error-code
         */
        readonly code?: string;
        /**
         * `CfnComponentType.ErrorProperty.Message`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html#cfn-iottwinmaker-componenttype-error-message
         */
        readonly message?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ErrorProperty`
 *
 * @param properties - the TypeScript properties of a `ErrorProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_ErrorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('code', cdk.validateString)(properties.code));
    errors.collect(cdk.propertyValidator('message', cdk.validateString)(properties.message));
    return errors.wrap('supplied properties not correct for "ErrorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.Error` resource
 *
 * @param properties - the TypeScript properties of a `ErrorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.Error` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeErrorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_ErrorPropertyValidator(properties).assertSuccess();
    return {
        Code: cdk.stringToCloudFormation(properties.code),
        Message: cdk.stringToCloudFormation(properties.message),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeErrorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.ErrorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.ErrorProperty>();
    ret.addPropertyResult('code', 'Code', properties.Code != null ? cfn_parse.FromCloudFormation.getString(properties.Code) : undefined);
    ret.addPropertyResult('message', 'Message', properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     * The function body.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html
     */
    export interface FunctionProperty {
        /**
         * The data connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-implementedby
         */
        readonly implementedBy?: CfnComponentType.DataConnectorProperty | cdk.IResolvable;
        /**
         * The required properties of the function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-requiredproperties
         */
        readonly requiredProperties?: string[];
        /**
         * The scope of the function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-scope
         */
        readonly scope?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FunctionProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_FunctionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('implementedBy', CfnComponentType_DataConnectorPropertyValidator)(properties.implementedBy));
    errors.collect(cdk.propertyValidator('requiredProperties', cdk.listValidator(cdk.validateString))(properties.requiredProperties));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    return errors.wrap('supplied properties not correct for "FunctionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.Function` resource
 *
 * @param properties - the TypeScript properties of a `FunctionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.Function` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeFunctionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_FunctionPropertyValidator(properties).assertSuccess();
    return {
        ImplementedBy: cfnComponentTypeDataConnectorPropertyToCloudFormation(properties.implementedBy),
        RequiredProperties: cdk.listMapper(cdk.stringToCloudFormation)(properties.requiredProperties),
        Scope: cdk.stringToCloudFormation(properties.scope),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeFunctionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.FunctionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.FunctionProperty>();
    ret.addPropertyResult('implementedBy', 'ImplementedBy', properties.ImplementedBy != null ? CfnComponentTypeDataConnectorPropertyFromCloudFormation(properties.ImplementedBy) : undefined);
    ret.addPropertyResult('requiredProperties', 'RequiredProperties', properties.RequiredProperties != null ? cfn_parse.FromCloudFormation.getStringArray(properties.RequiredProperties) : undefined);
    ret.addPropertyResult('scope', 'Scope', properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     * The Lambda function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-lambdafunction.html
     */
    export interface LambdaFunctionProperty {
        /**
         * The Lambda function ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-lambdafunction.html#cfn-iottwinmaker-componenttype-lambdafunction-arn
         */
        readonly arn: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaFunctionProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_LambdaFunctionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "LambdaFunctionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.LambdaFunction` resource
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.LambdaFunction` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeLambdaFunctionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_LambdaFunctionPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeLambdaFunctionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.LambdaFunctionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.LambdaFunctionProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     * PropertyDefinition is an object that maps strings to the property definitions in the component type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html
     */
    export interface PropertyDefinitionProperty {
        /**
         * A mapping that specifies configuration information about the property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-configurations
         */
        readonly configurations?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * `CfnComponentType.PropertyDefinitionProperty.DataType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-datatype
         */
        readonly dataType?: CfnComponentType.DataTypeProperty | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property ID comes from an external data store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-defaultvalue
         */
        readonly defaultValue?: CfnComponentType.DataValueProperty | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property ID comes from an external data store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isexternalid
         */
        readonly isExternalId?: boolean | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property is required in an entity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isrequiredinentity
         */
        readonly isRequiredInEntity?: boolean | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property is stored externally.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isstoredexternally
         */
        readonly isStoredExternally?: boolean | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property consists of time series data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-istimeseries
         */
        readonly isTimeSeries?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PropertyDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_PropertyDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configurations', cdk.hashValidator(cdk.validateString))(properties.configurations));
    errors.collect(cdk.propertyValidator('dataType', CfnComponentType_DataTypePropertyValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('defaultValue', CfnComponentType_DataValuePropertyValidator)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('isExternalId', cdk.validateBoolean)(properties.isExternalId));
    errors.collect(cdk.propertyValidator('isRequiredInEntity', cdk.validateBoolean)(properties.isRequiredInEntity));
    errors.collect(cdk.propertyValidator('isStoredExternally', cdk.validateBoolean)(properties.isStoredExternally));
    errors.collect(cdk.propertyValidator('isTimeSeries', cdk.validateBoolean)(properties.isTimeSeries));
    return errors.wrap('supplied properties not correct for "PropertyDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.PropertyDefinition` resource
 *
 * @param properties - the TypeScript properties of a `PropertyDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.PropertyDefinition` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypePropertyDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_PropertyDefinitionPropertyValidator(properties).assertSuccess();
    return {
        Configurations: cdk.hashMapper(cdk.stringToCloudFormation)(properties.configurations),
        DataType: cfnComponentTypeDataTypePropertyToCloudFormation(properties.dataType),
        DefaultValue: cfnComponentTypeDataValuePropertyToCloudFormation(properties.defaultValue),
        IsExternalId: cdk.booleanToCloudFormation(properties.isExternalId),
        IsRequiredInEntity: cdk.booleanToCloudFormation(properties.isRequiredInEntity),
        IsStoredExternally: cdk.booleanToCloudFormation(properties.isStoredExternally),
        IsTimeSeries: cdk.booleanToCloudFormation(properties.isTimeSeries),
    };
}

// @ts-ignore TS6133
function CfnComponentTypePropertyDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.PropertyDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.PropertyDefinitionProperty>();
    ret.addPropertyResult('configurations', 'Configurations', properties.Configurations != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Configurations) : undefined);
    ret.addPropertyResult('dataType', 'DataType', properties.DataType != null ? CfnComponentTypeDataTypePropertyFromCloudFormation(properties.DataType) : undefined);
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? CfnComponentTypeDataValuePropertyFromCloudFormation(properties.DefaultValue) : undefined);
    ret.addPropertyResult('isExternalId', 'IsExternalId', properties.IsExternalId != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsExternalId) : undefined);
    ret.addPropertyResult('isRequiredInEntity', 'IsRequiredInEntity', properties.IsRequiredInEntity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsRequiredInEntity) : undefined);
    ret.addPropertyResult('isStoredExternally', 'IsStoredExternally', properties.IsStoredExternally != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsStoredExternally) : undefined);
    ret.addPropertyResult('isTimeSeries', 'IsTimeSeries', properties.IsTimeSeries != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsTimeSeries) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     * The property group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html
     */
    export interface PropertyGroupProperty {
        /**
         * The group type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html#cfn-iottwinmaker-componenttype-propertygroup-grouptype
         */
        readonly groupType?: string;
        /**
         * The property names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html#cfn-iottwinmaker-componenttype-propertygroup-propertynames
         */
        readonly propertyNames?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `PropertyGroupProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_PropertyGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('groupType', cdk.validateString)(properties.groupType));
    errors.collect(cdk.propertyValidator('propertyNames', cdk.listValidator(cdk.validateString))(properties.propertyNames));
    return errors.wrap('supplied properties not correct for "PropertyGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.PropertyGroup` resource
 *
 * @param properties - the TypeScript properties of a `PropertyGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.PropertyGroup` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypePropertyGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_PropertyGroupPropertyValidator(properties).assertSuccess();
    return {
        GroupType: cdk.stringToCloudFormation(properties.groupType),
        PropertyNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.propertyNames),
    };
}

// @ts-ignore TS6133
function CfnComponentTypePropertyGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.PropertyGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.PropertyGroupProperty>();
    ret.addPropertyResult('groupType', 'GroupType', properties.GroupType != null ? cfn_parse.FromCloudFormation.getString(properties.GroupType) : undefined);
    ret.addPropertyResult('propertyNames', 'PropertyNames', properties.PropertyNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PropertyNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     * An object that specifies a relationship with another component type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html
     */
    export interface RelationshipProperty {
        /**
         * The type of the relationship.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html#cfn-iottwinmaker-componenttype-relationship-relationshiptype
         */
        readonly relationshipType?: string;
        /**
         * The ID of the target component type associated with this relationship.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html#cfn-iottwinmaker-componenttype-relationship-targetcomponenttypeid
         */
        readonly targetComponentTypeId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RelationshipProperty`
 *
 * @param properties - the TypeScript properties of a `RelationshipProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_RelationshipPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('relationshipType', cdk.validateString)(properties.relationshipType));
    errors.collect(cdk.propertyValidator('targetComponentTypeId', cdk.validateString)(properties.targetComponentTypeId));
    return errors.wrap('supplied properties not correct for "RelationshipProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.Relationship` resource
 *
 * @param properties - the TypeScript properties of a `RelationshipProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.Relationship` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeRelationshipPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_RelationshipPropertyValidator(properties).assertSuccess();
    return {
        RelationshipType: cdk.stringToCloudFormation(properties.relationshipType),
        TargetComponentTypeId: cdk.stringToCloudFormation(properties.targetComponentTypeId),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeRelationshipPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.RelationshipProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.RelationshipProperty>();
    ret.addPropertyResult('relationshipType', 'RelationshipType', properties.RelationshipType != null ? cfn_parse.FromCloudFormation.getString(properties.RelationshipType) : undefined);
    ret.addPropertyResult('targetComponentTypeId', 'TargetComponentTypeId', properties.TargetComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetComponentTypeId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html
     */
    export interface RelationshipValueProperty {
        /**
         * `CfnComponentType.RelationshipValueProperty.TargetComponentName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html#cfn-iottwinmaker-componenttype-relationshipvalue-targetcomponentname
         */
        readonly targetComponentName?: string;
        /**
         * `CfnComponentType.RelationshipValueProperty.TargetEntityId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html#cfn-iottwinmaker-componenttype-relationshipvalue-targetentityid
         */
        readonly targetEntityId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RelationshipValueProperty`
 *
 * @param properties - the TypeScript properties of a `RelationshipValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_RelationshipValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetComponentName', cdk.validateString)(properties.targetComponentName));
    errors.collect(cdk.propertyValidator('targetEntityId', cdk.validateString)(properties.targetEntityId));
    return errors.wrap('supplied properties not correct for "RelationshipValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.RelationshipValue` resource
 *
 * @param properties - the TypeScript properties of a `RelationshipValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.RelationshipValue` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeRelationshipValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_RelationshipValuePropertyValidator(properties).assertSuccess();
    return {
        TargetComponentName: cdk.stringToCloudFormation(properties.targetComponentName),
        TargetEntityId: cdk.stringToCloudFormation(properties.targetEntityId),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeRelationshipValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.RelationshipValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.RelationshipValueProperty>();
    ret.addPropertyResult('targetComponentName', 'TargetComponentName', properties.TargetComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetComponentName) : undefined);
    ret.addPropertyResult('targetEntityId', 'TargetEntityId', properties.TargetEntityId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetEntityId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentType {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html
     */
    export interface StatusProperty {
        /**
         * `CfnComponentType.StatusProperty.Error`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html#cfn-iottwinmaker-componenttype-status-error
         */
        readonly error?: CfnComponentType.ErrorProperty | cdk.IResolvable;
        /**
         * `CfnComponentType.StatusProperty.State`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html#cfn-iottwinmaker-componenttype-status-state
         */
        readonly state?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StatusProperty`
 *
 * @param properties - the TypeScript properties of a `StatusProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentType_StatusPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('error', CfnComponentType_ErrorPropertyValidator)(properties.error));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    return errors.wrap('supplied properties not correct for "StatusProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.Status` resource
 *
 * @param properties - the TypeScript properties of a `StatusProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::ComponentType.Status` resource.
 */
// @ts-ignore TS6133
function cfnComponentTypeStatusPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentType_StatusPropertyValidator(properties).assertSuccess();
    return {
        Error: cfnComponentTypeErrorPropertyToCloudFormation(properties.error),
        State: cdk.stringToCloudFormation(properties.state),
    };
}

// @ts-ignore TS6133
function CfnComponentTypeStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.StatusProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.StatusProperty>();
    ret.addPropertyResult('error', 'Error', properties.Error != null ? CfnComponentTypeErrorPropertyFromCloudFormation(properties.Error) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEntity`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html
 */
export interface CfnEntityProps {

    /**
     * The entity name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityname
     */
    readonly entityName: string;

    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-workspaceid
     */
    readonly workspaceId: string;

    /**
     * An object that maps strings to the components in the entity. Each string in the mapping must be unique to this object.
     *
     * For information on the component object see the [component](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_ComponentResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-components
     */
    readonly components?: { [key: string]: (CfnEntity.ComponentProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The description of the entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-description
     */
    readonly description?: string;

    /**
     * The entity ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityid
     */
    readonly entityId?: string;

    /**
     * The ID of the parent entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-parententityid
     */
    readonly parentEntityId?: string;

    /**
     * Metadata that you can use to manage the entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnEntityProps`
 *
 * @param properties - the TypeScript properties of a `CfnEntityProps`
 *
 * @returns the result of the validation.
 */
function CfnEntityPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('components', cdk.hashValidator(CfnEntity_ComponentPropertyValidator))(properties.components));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('entityId', cdk.validateString)(properties.entityId));
    errors.collect(cdk.propertyValidator('entityName', cdk.requiredValidator)(properties.entityName));
    errors.collect(cdk.propertyValidator('entityName', cdk.validateString)(properties.entityName));
    errors.collect(cdk.propertyValidator('parentEntityId', cdk.validateString)(properties.parentEntityId));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.requiredValidator)(properties.workspaceId));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.validateString)(properties.workspaceId));
    return errors.wrap('supplied properties not correct for "CfnEntityProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity` resource
 *
 * @param properties - the TypeScript properties of a `CfnEntityProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity` resource.
 */
// @ts-ignore TS6133
function cfnEntityPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntityPropsValidator(properties).assertSuccess();
    return {
        EntityName: cdk.stringToCloudFormation(properties.entityName),
        WorkspaceId: cdk.stringToCloudFormation(properties.workspaceId),
        Components: cdk.hashMapper(cfnEntityComponentPropertyToCloudFormation)(properties.components),
        Description: cdk.stringToCloudFormation(properties.description),
        EntityId: cdk.stringToCloudFormation(properties.entityId),
        ParentEntityId: cdk.stringToCloudFormation(properties.parentEntityId),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEntityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntityProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntityProps>();
    ret.addPropertyResult('entityName', 'EntityName', cfn_parse.FromCloudFormation.getString(properties.EntityName));
    ret.addPropertyResult('workspaceId', 'WorkspaceId', cfn_parse.FromCloudFormation.getString(properties.WorkspaceId));
    ret.addPropertyResult('components', 'Components', properties.Components != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityComponentPropertyFromCloudFormation)(properties.Components) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('entityId', 'EntityId', properties.EntityId != null ? cfn_parse.FromCloudFormation.getString(properties.EntityId) : undefined);
    ret.addPropertyResult('parentEntityId', 'ParentEntityId', properties.ParentEntityId != null ? cfn_parse.FromCloudFormation.getString(properties.ParentEntityId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTTwinMaker::Entity`
 *
 * Use the `AWS::IoTTwinMaker::Entity` resource to declare an entity.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Entity
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html
 */
export class CfnEntity extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::Entity";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEntity {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEntityPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEntity(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The entity ARN.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The date and time the entity was created.
     * @cloudformationAttribute CreationDateTime
     */
    public readonly attrCreationDateTime: string;

    /**
     * A boolean value that specifies whether the entity has child entities or not.
     * @cloudformationAttribute HasChildEntities
     */
    public readonly attrHasChildEntities: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Status.Error.Code
     */
    public readonly attrStatusErrorCode: string;

    /**
     *
     * @cloudformationAttribute Status.Error.Message
     */
    public readonly attrStatusErrorMessage: string;

    /**
     *
     * @cloudformationAttribute Status.State
     */
    public readonly attrStatusState: string;

    /**
     * The date and time when the component type was last updated.
     * @cloudformationAttribute UpdateDateTime
     */
    public readonly attrUpdateDateTime: string;

    /**
     * The entity name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityname
     */
    public entityName: string;

    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-workspaceid
     */
    public workspaceId: string;

    /**
     * An object that maps strings to the components in the entity. Each string in the mapping must be unique to this object.
     *
     * For information on the component object see the [component](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_ComponentResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-components
     */
    public components: { [key: string]: (CfnEntity.ComponentProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * The description of the entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-description
     */
    public description: string | undefined;

    /**
     * The entity ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityid
     */
    public entityId: string | undefined;

    /**
     * The ID of the parent entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-parententityid
     */
    public parentEntityId: string | undefined;

    /**
     * Metadata that you can use to manage the entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTTwinMaker::Entity`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEntityProps) {
        super(scope, id, { type: CfnEntity.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'entityName', this);
        cdk.requireProperty(props, 'workspaceId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationDateTime = cdk.Token.asString(this.getAtt('CreationDateTime', cdk.ResolutionTypeHint.STRING));
        this.attrHasChildEntities = this.getAtt('HasChildEntities', cdk.ResolutionTypeHint.STRING);
        this.attrStatusErrorCode = cdk.Token.asString(this.getAtt('Status.Error.Code', cdk.ResolutionTypeHint.STRING));
        this.attrStatusErrorMessage = cdk.Token.asString(this.getAtt('Status.Error.Message', cdk.ResolutionTypeHint.STRING));
        this.attrStatusState = cdk.Token.asString(this.getAtt('Status.State', cdk.ResolutionTypeHint.STRING));
        this.attrUpdateDateTime = cdk.Token.asString(this.getAtt('UpdateDateTime', cdk.ResolutionTypeHint.STRING));

        this.entityName = props.entityName;
        this.workspaceId = props.workspaceId;
        this.components = props.components;
        this.description = props.description;
        this.entityId = props.entityId;
        this.parentEntityId = props.parentEntityId;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::Entity", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEntity.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            entityName: this.entityName,
            workspaceId: this.workspaceId,
            components: this.components,
            description: this.description,
            entityId: this.entityId,
            parentEntityId: this.parentEntityId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEntityPropsToCloudFormation(props);
    }
}

export namespace CfnEntity {
    /**
     * The entity component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html
     */
    export interface ComponentProperty {
        /**
         * The name of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-componentname
         */
        readonly componentName?: string;
        /**
         * The ID of the ComponentType.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-componenttypeid
         */
        readonly componentTypeId?: string;
        /**
         * The name of the property definition set in the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-definedin
         */
        readonly definedIn?: string;
        /**
         * The description of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-description
         */
        readonly description?: string;
        /**
         * An object that maps strings to the properties to set in the component type. Each string in the mapping must be unique to this object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-properties
         */
        readonly properties?: { [key: string]: (CfnEntity.PropertyProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * An object that maps strings to the property groups in the component type. Each string in the mapping must be unique to this object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-propertygroups
         */
        readonly propertyGroups?: { [key: string]: (CfnEntity.PropertyGroupProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * The status of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-status
         */
        readonly status?: CfnEntity.StatusProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_ComponentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentName', cdk.validateString)(properties.componentName));
    errors.collect(cdk.propertyValidator('componentTypeId', cdk.validateString)(properties.componentTypeId));
    errors.collect(cdk.propertyValidator('definedIn', cdk.validateString)(properties.definedIn));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('properties', cdk.hashValidator(CfnEntity_PropertyPropertyValidator))(properties.properties));
    errors.collect(cdk.propertyValidator('propertyGroups', cdk.hashValidator(CfnEntity_PropertyGroupPropertyValidator))(properties.propertyGroups));
    errors.collect(cdk.propertyValidator('status', CfnEntity_StatusPropertyValidator)(properties.status));
    return errors.wrap('supplied properties not correct for "ComponentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Component` resource
 *
 * @param properties - the TypeScript properties of a `ComponentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Component` resource.
 */
// @ts-ignore TS6133
function cfnEntityComponentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_ComponentPropertyValidator(properties).assertSuccess();
    return {
        ComponentName: cdk.stringToCloudFormation(properties.componentName),
        ComponentTypeId: cdk.stringToCloudFormation(properties.componentTypeId),
        DefinedIn: cdk.stringToCloudFormation(properties.definedIn),
        Description: cdk.stringToCloudFormation(properties.description),
        Properties: cdk.hashMapper(cfnEntityPropertyPropertyToCloudFormation)(properties.properties),
        PropertyGroups: cdk.hashMapper(cfnEntityPropertyGroupPropertyToCloudFormation)(properties.propertyGroups),
        Status: cfnEntityStatusPropertyToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnEntityComponentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.ComponentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.ComponentProperty>();
    ret.addPropertyResult('componentName', 'ComponentName', properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined);
    ret.addPropertyResult('componentTypeId', 'ComponentTypeId', properties.ComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentTypeId) : undefined);
    ret.addPropertyResult('definedIn', 'DefinedIn', properties.DefinedIn != null ? cfn_parse.FromCloudFormation.getString(properties.DefinedIn) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('properties', 'Properties', properties.Properties != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityPropertyPropertyFromCloudFormation)(properties.Properties) : undefined);
    ret.addPropertyResult('propertyGroups', 'PropertyGroups', properties.PropertyGroups != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityPropertyGroupPropertyFromCloudFormation)(properties.PropertyGroups) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? CfnEntityStatusPropertyFromCloudFormation(properties.Status) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html
     */
    export interface DataTypeProperty {
        /**
         * `CfnEntity.DataTypeProperty.AllowedValues`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-allowedvalues
         */
        readonly allowedValues?: Array<CfnEntity.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnEntity.DataTypeProperty.NestedType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-nestedtype
         */
        readonly nestedType?: CfnEntity.DataTypeProperty | cdk.IResolvable;
        /**
         * `CfnEntity.DataTypeProperty.Relationship`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-relationship
         */
        readonly relationship?: CfnEntity.RelationshipProperty | cdk.IResolvable;
        /**
         * `CfnEntity.DataTypeProperty.Type`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-type
         */
        readonly type?: string;
        /**
         * `CfnEntity.DataTypeProperty.UnitOfMeasure`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-unitofmeasure
         */
        readonly unitOfMeasure?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataTypeProperty`
 *
 * @param properties - the TypeScript properties of a `DataTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_DataTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedValues', cdk.listValidator(CfnEntity_DataValuePropertyValidator))(properties.allowedValues));
    errors.collect(cdk.propertyValidator('nestedType', CfnEntity_DataTypePropertyValidator)(properties.nestedType));
    errors.collect(cdk.propertyValidator('relationship', CfnEntity_RelationshipPropertyValidator)(properties.relationship));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('unitOfMeasure', cdk.validateString)(properties.unitOfMeasure));
    return errors.wrap('supplied properties not correct for "DataTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.DataType` resource
 *
 * @param properties - the TypeScript properties of a `DataTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.DataType` resource.
 */
// @ts-ignore TS6133
function cfnEntityDataTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_DataTypePropertyValidator(properties).assertSuccess();
    return {
        AllowedValues: cdk.listMapper(cfnEntityDataValuePropertyToCloudFormation)(properties.allowedValues),
        NestedType: cfnEntityDataTypePropertyToCloudFormation(properties.nestedType),
        Relationship: cfnEntityRelationshipPropertyToCloudFormation(properties.relationship),
        Type: cdk.stringToCloudFormation(properties.type),
        UnitOfMeasure: cdk.stringToCloudFormation(properties.unitOfMeasure),
    };
}

// @ts-ignore TS6133
function CfnEntityDataTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.DataTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.DataTypeProperty>();
    ret.addPropertyResult('allowedValues', 'AllowedValues', properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getArray(CfnEntityDataValuePropertyFromCloudFormation)(properties.AllowedValues) : undefined);
    ret.addPropertyResult('nestedType', 'NestedType', properties.NestedType != null ? CfnEntityDataTypePropertyFromCloudFormation(properties.NestedType) : undefined);
    ret.addPropertyResult('relationship', 'Relationship', properties.Relationship != null ? CfnEntityRelationshipPropertyFromCloudFormation(properties.Relationship) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('unitOfMeasure', 'UnitOfMeasure', properties.UnitOfMeasure != null ? cfn_parse.FromCloudFormation.getString(properties.UnitOfMeasure) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     * An object that specifies a value for a property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html
     */
    export interface DataValueProperty {
        /**
         * A boolean value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-booleanvalue
         */
        readonly booleanValue?: boolean | cdk.IResolvable;
        /**
         * A double value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-doublevalue
         */
        readonly doubleValue?: number;
        /**
         * An expression that produces the value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-expression
         */
        readonly expression?: string;
        /**
         * An integer value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-integervalue
         */
        readonly integerValue?: number;
        /**
         * A list of multiple values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-listvalue
         */
        readonly listValue?: Array<CfnEntity.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A long value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-longvalue
         */
        readonly longValue?: number;
        /**
         * An object that maps strings to multiple DataValue objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-mapvalue
         */
        readonly mapValue?: { [key: string]: (CfnEntity.DataValueProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * A value that relates a component to another component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-relationshipvalue
         */
        readonly relationshipValue?: any | cdk.IResolvable;
        /**
         * A string value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-stringvalue
         */
        readonly stringValue?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataValueProperty`
 *
 * @param properties - the TypeScript properties of a `DataValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_DataValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('booleanValue', cdk.validateBoolean)(properties.booleanValue));
    errors.collect(cdk.propertyValidator('doubleValue', cdk.validateNumber)(properties.doubleValue));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('integerValue', cdk.validateNumber)(properties.integerValue));
    errors.collect(cdk.propertyValidator('listValue', cdk.listValidator(CfnEntity_DataValuePropertyValidator))(properties.listValue));
    errors.collect(cdk.propertyValidator('longValue', cdk.validateNumber)(properties.longValue));
    errors.collect(cdk.propertyValidator('mapValue', cdk.hashValidator(CfnEntity_DataValuePropertyValidator))(properties.mapValue));
    errors.collect(cdk.propertyValidator('relationshipValue', cdk.validateObject)(properties.relationshipValue));
    errors.collect(cdk.propertyValidator('stringValue', cdk.validateString)(properties.stringValue));
    return errors.wrap('supplied properties not correct for "DataValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.DataValue` resource
 *
 * @param properties - the TypeScript properties of a `DataValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.DataValue` resource.
 */
// @ts-ignore TS6133
function cfnEntityDataValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_DataValuePropertyValidator(properties).assertSuccess();
    return {
        BooleanValue: cdk.booleanToCloudFormation(properties.booleanValue),
        DoubleValue: cdk.numberToCloudFormation(properties.doubleValue),
        Expression: cdk.stringToCloudFormation(properties.expression),
        IntegerValue: cdk.numberToCloudFormation(properties.integerValue),
        ListValue: cdk.listMapper(cfnEntityDataValuePropertyToCloudFormation)(properties.listValue),
        LongValue: cdk.numberToCloudFormation(properties.longValue),
        MapValue: cdk.hashMapper(cfnEntityDataValuePropertyToCloudFormation)(properties.mapValue),
        RelationshipValue: cdk.objectToCloudFormation(properties.relationshipValue),
        StringValue: cdk.stringToCloudFormation(properties.stringValue),
    };
}

// @ts-ignore TS6133
function CfnEntityDataValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.DataValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.DataValueProperty>();
    ret.addPropertyResult('booleanValue', 'BooleanValue', properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BooleanValue) : undefined);
    ret.addPropertyResult('doubleValue', 'DoubleValue', properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DoubleValue) : undefined);
    ret.addPropertyResult('expression', 'Expression', properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined);
    ret.addPropertyResult('integerValue', 'IntegerValue', properties.IntegerValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntegerValue) : undefined);
    ret.addPropertyResult('listValue', 'ListValue', properties.ListValue != null ? cfn_parse.FromCloudFormation.getArray(CfnEntityDataValuePropertyFromCloudFormation)(properties.ListValue) : undefined);
    ret.addPropertyResult('longValue', 'LongValue', properties.LongValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.LongValue) : undefined);
    ret.addPropertyResult('mapValue', 'MapValue', properties.MapValue != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityDataValuePropertyFromCloudFormation)(properties.MapValue) : undefined);
    ret.addPropertyResult('relationshipValue', 'RelationshipValue', properties.RelationshipValue != null ? cfn_parse.FromCloudFormation.getAny(properties.RelationshipValue) : undefined);
    ret.addPropertyResult('stringValue', 'StringValue', properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html
     */
    export interface DefinitionProperty {
        /**
         * `CfnEntity.DefinitionProperty.Configuration`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-configuration
         */
        readonly configuration?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.DataType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-datatype
         */
        readonly dataType?: CfnEntity.DataTypeProperty | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.DefaultValue`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-defaultvalue
         */
        readonly defaultValue?: CfnEntity.DataValueProperty | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsExternalId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isexternalid
         */
        readonly isExternalId?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsFinal`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isfinal
         */
        readonly isFinal?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsImported`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isimported
         */
        readonly isImported?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsInherited`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isinherited
         */
        readonly isInherited?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsRequiredInEntity`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isrequiredinentity
         */
        readonly isRequiredInEntity?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsStoredExternally`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isstoredexternally
         */
        readonly isStoredExternally?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsTimeSeries`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-istimeseries
         */
        readonly isTimeSeries?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_DefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configuration', cdk.hashValidator(cdk.validateString))(properties.configuration));
    errors.collect(cdk.propertyValidator('dataType', CfnEntity_DataTypePropertyValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('defaultValue', CfnEntity_DataValuePropertyValidator)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('isExternalId', cdk.validateBoolean)(properties.isExternalId));
    errors.collect(cdk.propertyValidator('isFinal', cdk.validateBoolean)(properties.isFinal));
    errors.collect(cdk.propertyValidator('isImported', cdk.validateBoolean)(properties.isImported));
    errors.collect(cdk.propertyValidator('isInherited', cdk.validateBoolean)(properties.isInherited));
    errors.collect(cdk.propertyValidator('isRequiredInEntity', cdk.validateBoolean)(properties.isRequiredInEntity));
    errors.collect(cdk.propertyValidator('isStoredExternally', cdk.validateBoolean)(properties.isStoredExternally));
    errors.collect(cdk.propertyValidator('isTimeSeries', cdk.validateBoolean)(properties.isTimeSeries));
    return errors.wrap('supplied properties not correct for "DefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Definition` resource
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Definition` resource.
 */
// @ts-ignore TS6133
function cfnEntityDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_DefinitionPropertyValidator(properties).assertSuccess();
    return {
        Configuration: cdk.hashMapper(cdk.stringToCloudFormation)(properties.configuration),
        DataType: cfnEntityDataTypePropertyToCloudFormation(properties.dataType),
        DefaultValue: cfnEntityDataValuePropertyToCloudFormation(properties.defaultValue),
        IsExternalId: cdk.booleanToCloudFormation(properties.isExternalId),
        IsFinal: cdk.booleanToCloudFormation(properties.isFinal),
        IsImported: cdk.booleanToCloudFormation(properties.isImported),
        IsInherited: cdk.booleanToCloudFormation(properties.isInherited),
        IsRequiredInEntity: cdk.booleanToCloudFormation(properties.isRequiredInEntity),
        IsStoredExternally: cdk.booleanToCloudFormation(properties.isStoredExternally),
        IsTimeSeries: cdk.booleanToCloudFormation(properties.isTimeSeries),
    };
}

// @ts-ignore TS6133
function CfnEntityDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.DefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.DefinitionProperty>();
    ret.addPropertyResult('configuration', 'Configuration', properties.Configuration != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Configuration) : undefined);
    ret.addPropertyResult('dataType', 'DataType', properties.DataType != null ? CfnEntityDataTypePropertyFromCloudFormation(properties.DataType) : undefined);
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? CfnEntityDataValuePropertyFromCloudFormation(properties.DefaultValue) : undefined);
    ret.addPropertyResult('isExternalId', 'IsExternalId', properties.IsExternalId != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsExternalId) : undefined);
    ret.addPropertyResult('isFinal', 'IsFinal', properties.IsFinal != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsFinal) : undefined);
    ret.addPropertyResult('isImported', 'IsImported', properties.IsImported != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsImported) : undefined);
    ret.addPropertyResult('isInherited', 'IsInherited', properties.IsInherited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsInherited) : undefined);
    ret.addPropertyResult('isRequiredInEntity', 'IsRequiredInEntity', properties.IsRequiredInEntity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsRequiredInEntity) : undefined);
    ret.addPropertyResult('isStoredExternally', 'IsStoredExternally', properties.IsStoredExternally != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsStoredExternally) : undefined);
    ret.addPropertyResult('isTimeSeries', 'IsTimeSeries', properties.IsTimeSeries != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsTimeSeries) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html
     */
    export interface ErrorProperty {
        /**
         * `CfnEntity.ErrorProperty.Code`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html#cfn-iottwinmaker-entity-error-code
         */
        readonly code?: string;
        /**
         * `CfnEntity.ErrorProperty.Message`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html#cfn-iottwinmaker-entity-error-message
         */
        readonly message?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ErrorProperty`
 *
 * @param properties - the TypeScript properties of a `ErrorProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_ErrorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('code', cdk.validateString)(properties.code));
    errors.collect(cdk.propertyValidator('message', cdk.validateString)(properties.message));
    return errors.wrap('supplied properties not correct for "ErrorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Error` resource
 *
 * @param properties - the TypeScript properties of a `ErrorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Error` resource.
 */
// @ts-ignore TS6133
function cfnEntityErrorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_ErrorPropertyValidator(properties).assertSuccess();
    return {
        Code: cdk.stringToCloudFormation(properties.code),
        Message: cdk.stringToCloudFormation(properties.message),
    };
}

// @ts-ignore TS6133
function CfnEntityErrorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.ErrorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.ErrorProperty>();
    ret.addPropertyResult('code', 'Code', properties.Code != null ? cfn_parse.FromCloudFormation.getString(properties.Code) : undefined);
    ret.addPropertyResult('message', 'Message', properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     * An object that sets information about a property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html
     */
    export interface PropertyProperty {
        /**
         * An object that specifies information about a property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html#cfn-iottwinmaker-entity-property-definition
         */
        readonly definition?: any | cdk.IResolvable;
        /**
         * An object that contains information about a value for a time series property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html#cfn-iottwinmaker-entity-property-value
         */
        readonly value?: CfnEntity.DataValueProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PropertyProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_PropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('definition', cdk.validateObject)(properties.definition));
    errors.collect(cdk.propertyValidator('value', CfnEntity_DataValuePropertyValidator)(properties.value));
    return errors.wrap('supplied properties not correct for "PropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Property` resource
 *
 * @param properties - the TypeScript properties of a `PropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Property` resource.
 */
// @ts-ignore TS6133
function cfnEntityPropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_PropertyPropertyValidator(properties).assertSuccess();
    return {
        Definition: cdk.objectToCloudFormation(properties.definition),
        Value: cfnEntityDataValuePropertyToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnEntityPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.PropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.PropertyProperty>();
    ret.addPropertyResult('definition', 'Definition', properties.Definition != null ? cfn_parse.FromCloudFormation.getAny(properties.Definition) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? CfnEntityDataValuePropertyFromCloudFormation(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     * The property group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html
     */
    export interface PropertyGroupProperty {
        /**
         * The group type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html#cfn-iottwinmaker-entity-propertygroup-grouptype
         */
        readonly groupType?: string;
        /**
         * The property names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html#cfn-iottwinmaker-entity-propertygroup-propertynames
         */
        readonly propertyNames?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `PropertyGroupProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_PropertyGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('groupType', cdk.validateString)(properties.groupType));
    errors.collect(cdk.propertyValidator('propertyNames', cdk.listValidator(cdk.validateString))(properties.propertyNames));
    return errors.wrap('supplied properties not correct for "PropertyGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.PropertyGroup` resource
 *
 * @param properties - the TypeScript properties of a `PropertyGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.PropertyGroup` resource.
 */
// @ts-ignore TS6133
function cfnEntityPropertyGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_PropertyGroupPropertyValidator(properties).assertSuccess();
    return {
        GroupType: cdk.stringToCloudFormation(properties.groupType),
        PropertyNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.propertyNames),
    };
}

// @ts-ignore TS6133
function CfnEntityPropertyGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.PropertyGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.PropertyGroupProperty>();
    ret.addPropertyResult('groupType', 'GroupType', properties.GroupType != null ? cfn_parse.FromCloudFormation.getString(properties.GroupType) : undefined);
    ret.addPropertyResult('propertyNames', 'PropertyNames', properties.PropertyNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PropertyNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html
     */
    export interface RelationshipProperty {
        /**
         * `CfnEntity.RelationshipProperty.RelationshipType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html#cfn-iottwinmaker-entity-relationship-relationshiptype
         */
        readonly relationshipType?: string;
        /**
         * `CfnEntity.RelationshipProperty.TargetComponentTypeId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html#cfn-iottwinmaker-entity-relationship-targetcomponenttypeid
         */
        readonly targetComponentTypeId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RelationshipProperty`
 *
 * @param properties - the TypeScript properties of a `RelationshipProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_RelationshipPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('relationshipType', cdk.validateString)(properties.relationshipType));
    errors.collect(cdk.propertyValidator('targetComponentTypeId', cdk.validateString)(properties.targetComponentTypeId));
    return errors.wrap('supplied properties not correct for "RelationshipProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Relationship` resource
 *
 * @param properties - the TypeScript properties of a `RelationshipProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Relationship` resource.
 */
// @ts-ignore TS6133
function cfnEntityRelationshipPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_RelationshipPropertyValidator(properties).assertSuccess();
    return {
        RelationshipType: cdk.stringToCloudFormation(properties.relationshipType),
        TargetComponentTypeId: cdk.stringToCloudFormation(properties.targetComponentTypeId),
    };
}

// @ts-ignore TS6133
function CfnEntityRelationshipPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.RelationshipProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.RelationshipProperty>();
    ret.addPropertyResult('relationshipType', 'RelationshipType', properties.RelationshipType != null ? cfn_parse.FromCloudFormation.getString(properties.RelationshipType) : undefined);
    ret.addPropertyResult('targetComponentTypeId', 'TargetComponentTypeId', properties.TargetComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetComponentTypeId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html
     */
    export interface RelationshipValueProperty {
        /**
         * `CfnEntity.RelationshipValueProperty.TargetComponentName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html#cfn-iottwinmaker-entity-relationshipvalue-targetcomponentname
         */
        readonly targetComponentName?: string;
        /**
         * `CfnEntity.RelationshipValueProperty.TargetEntityId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html#cfn-iottwinmaker-entity-relationshipvalue-targetentityid
         */
        readonly targetEntityId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RelationshipValueProperty`
 *
 * @param properties - the TypeScript properties of a `RelationshipValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_RelationshipValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetComponentName', cdk.validateString)(properties.targetComponentName));
    errors.collect(cdk.propertyValidator('targetEntityId', cdk.validateString)(properties.targetEntityId));
    return errors.wrap('supplied properties not correct for "RelationshipValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.RelationshipValue` resource
 *
 * @param properties - the TypeScript properties of a `RelationshipValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.RelationshipValue` resource.
 */
// @ts-ignore TS6133
function cfnEntityRelationshipValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_RelationshipValuePropertyValidator(properties).assertSuccess();
    return {
        TargetComponentName: cdk.stringToCloudFormation(properties.targetComponentName),
        TargetEntityId: cdk.stringToCloudFormation(properties.targetEntityId),
    };
}

// @ts-ignore TS6133
function CfnEntityRelationshipValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.RelationshipValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.RelationshipValueProperty>();
    ret.addPropertyResult('targetComponentName', 'TargetComponentName', properties.TargetComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetComponentName) : undefined);
    ret.addPropertyResult('targetEntityId', 'TargetEntityId', properties.TargetEntityId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetEntityId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEntity {
    /**
     * The current status of the entity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html
     */
    export interface StatusProperty {
        /**
         * The error message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html#cfn-iottwinmaker-entity-status-error
         */
        readonly error?: any | cdk.IResolvable;
        /**
         * The current state of the entity, component, component type, or workspace.
         *
         * Valid Values: `CREATING | UPDATING | DELETING | ACTIVE | ERROR`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html#cfn-iottwinmaker-entity-status-state
         */
        readonly state?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StatusProperty`
 *
 * @param properties - the TypeScript properties of a `StatusProperty`
 *
 * @returns the result of the validation.
 */
function CfnEntity_StatusPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('error', cdk.validateObject)(properties.error));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    return errors.wrap('supplied properties not correct for "StatusProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Status` resource
 *
 * @param properties - the TypeScript properties of a `StatusProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Entity.Status` resource.
 */
// @ts-ignore TS6133
function cfnEntityStatusPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntity_StatusPropertyValidator(properties).assertSuccess();
    return {
        Error: cdk.objectToCloudFormation(properties.error),
        State: cdk.stringToCloudFormation(properties.state),
    };
}

// @ts-ignore TS6133
function CfnEntityStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.StatusProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.StatusProperty>();
    ret.addPropertyResult('error', 'Error', properties.Error != null ? cfn_parse.FromCloudFormation.getAny(properties.Error) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnScene`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html
 */
export interface CfnSceneProps {

    /**
     * The relative path that specifies the location of the content definition file.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-contentlocation
     */
    readonly contentLocation: string;

    /**
     * The scene ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-sceneid
     */
    readonly sceneId: string;

    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-workspaceid
     */
    readonly workspaceId: string;

    /**
     * A list of capabilities that the scene uses to render.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-capabilities
     */
    readonly capabilities?: string[];

    /**
     * The description of this scene.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-description
     */
    readonly description?: string;

    /**
     * The ComponentType tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnSceneProps`
 *
 * @param properties - the TypeScript properties of a `CfnSceneProps`
 *
 * @returns the result of the validation.
 */
function CfnScenePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('capabilities', cdk.listValidator(cdk.validateString))(properties.capabilities));
    errors.collect(cdk.propertyValidator('contentLocation', cdk.requiredValidator)(properties.contentLocation));
    errors.collect(cdk.propertyValidator('contentLocation', cdk.validateString)(properties.contentLocation));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('sceneId', cdk.requiredValidator)(properties.sceneId));
    errors.collect(cdk.propertyValidator('sceneId', cdk.validateString)(properties.sceneId));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.requiredValidator)(properties.workspaceId));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.validateString)(properties.workspaceId));
    return errors.wrap('supplied properties not correct for "CfnSceneProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Scene` resource
 *
 * @param properties - the TypeScript properties of a `CfnSceneProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Scene` resource.
 */
// @ts-ignore TS6133
function cfnScenePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScenePropsValidator(properties).assertSuccess();
    return {
        ContentLocation: cdk.stringToCloudFormation(properties.contentLocation),
        SceneId: cdk.stringToCloudFormation(properties.sceneId),
        WorkspaceId: cdk.stringToCloudFormation(properties.workspaceId),
        Capabilities: cdk.listMapper(cdk.stringToCloudFormation)(properties.capabilities),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnScenePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSceneProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSceneProps>();
    ret.addPropertyResult('contentLocation', 'ContentLocation', cfn_parse.FromCloudFormation.getString(properties.ContentLocation));
    ret.addPropertyResult('sceneId', 'SceneId', cfn_parse.FromCloudFormation.getString(properties.SceneId));
    ret.addPropertyResult('workspaceId', 'WorkspaceId', cfn_parse.FromCloudFormation.getString(properties.WorkspaceId));
    ret.addPropertyResult('capabilities', 'Capabilities', properties.Capabilities != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Capabilities) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTTwinMaker::Scene`
 *
 * Use the `AWS::IoTTwinMaker::Scene` resource to declare a scene.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Scene
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html
 */
export class CfnScene extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::Scene";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScene {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnScenePropsFromCloudFormation(resourceProperties);
        const ret = new CfnScene(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The scene ARN.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The date and time when the scene was created.
     * @cloudformationAttribute CreationDateTime
     */
    public readonly attrCreationDateTime: string;

    /**
     * The scene the update time.
     * @cloudformationAttribute UpdateDateTime
     */
    public readonly attrUpdateDateTime: string;

    /**
     * The relative path that specifies the location of the content definition file.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-contentlocation
     */
    public contentLocation: string;

    /**
     * The scene ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-sceneid
     */
    public sceneId: string;

    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-workspaceid
     */
    public workspaceId: string;

    /**
     * A list of capabilities that the scene uses to render.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-capabilities
     */
    public capabilities: string[] | undefined;

    /**
     * The description of this scene.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-description
     */
    public description: string | undefined;

    /**
     * The ComponentType tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTTwinMaker::Scene`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSceneProps) {
        super(scope, id, { type: CfnScene.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'contentLocation', this);
        cdk.requireProperty(props, 'sceneId', this);
        cdk.requireProperty(props, 'workspaceId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationDateTime = cdk.Token.asString(this.getAtt('CreationDateTime', cdk.ResolutionTypeHint.STRING));
        this.attrUpdateDateTime = cdk.Token.asString(this.getAtt('UpdateDateTime', cdk.ResolutionTypeHint.STRING));

        this.contentLocation = props.contentLocation;
        this.sceneId = props.sceneId;
        this.workspaceId = props.workspaceId;
        this.capabilities = props.capabilities;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::Scene", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnScene.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            contentLocation: this.contentLocation,
            sceneId: this.sceneId,
            workspaceId: this.workspaceId,
            capabilities: this.capabilities,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnScenePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSyncJob`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html
 */
export interface CfnSyncJobProps {

    /**
     * The SyncJob IAM role. This IAM role is used by the sync job to read from the syncSource, and create, update or delete the corresponding resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncrole
     */
    readonly syncRole: string;

    /**
     * The sync source.
     *
     * > Currently the only supported syncSoucre is `SITEWISE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncsource
     */
    readonly syncSource: string;

    /**
     * The ID of the workspace that contains the sync job.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-workspaceid
     */
    readonly workspaceId: string;

    /**
     * Metadata you can use to manage the SyncJob.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnSyncJobProps`
 *
 * @param properties - the TypeScript properties of a `CfnSyncJobProps`
 *
 * @returns the result of the validation.
 */
function CfnSyncJobPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('syncRole', cdk.requiredValidator)(properties.syncRole));
    errors.collect(cdk.propertyValidator('syncRole', cdk.validateString)(properties.syncRole));
    errors.collect(cdk.propertyValidator('syncSource', cdk.requiredValidator)(properties.syncSource));
    errors.collect(cdk.propertyValidator('syncSource', cdk.validateString)(properties.syncSource));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.requiredValidator)(properties.workspaceId));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.validateString)(properties.workspaceId));
    return errors.wrap('supplied properties not correct for "CfnSyncJobProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::SyncJob` resource
 *
 * @param properties - the TypeScript properties of a `CfnSyncJobProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::SyncJob` resource.
 */
// @ts-ignore TS6133
function cfnSyncJobPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSyncJobPropsValidator(properties).assertSuccess();
    return {
        SyncRole: cdk.stringToCloudFormation(properties.syncRole),
        SyncSource: cdk.stringToCloudFormation(properties.syncSource),
        WorkspaceId: cdk.stringToCloudFormation(properties.workspaceId),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSyncJobPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSyncJobProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSyncJobProps>();
    ret.addPropertyResult('syncRole', 'SyncRole', cfn_parse.FromCloudFormation.getString(properties.SyncRole));
    ret.addPropertyResult('syncSource', 'SyncSource', cfn_parse.FromCloudFormation.getString(properties.SyncSource));
    ret.addPropertyResult('workspaceId', 'WorkspaceId', cfn_parse.FromCloudFormation.getString(properties.WorkspaceId));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTTwinMaker::SyncJob`
 *
 * The SyncJob.
 *
 * @cloudformationResource AWS::IoTTwinMaker::SyncJob
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html
 */
export class CfnSyncJob extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::SyncJob";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSyncJob {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSyncJobPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSyncJob(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The SyncJob ARN.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The creation date and time of the SyncJob.
     * @cloudformationAttribute CreationDateTime
     */
    public readonly attrCreationDateTime: string;

    /**
     * The SyncJob's state.
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The update date and time.
     * @cloudformationAttribute UpdateDateTime
     */
    public readonly attrUpdateDateTime: string;

    /**
     * The SyncJob IAM role. This IAM role is used by the sync job to read from the syncSource, and create, update or delete the corresponding resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncrole
     */
    public syncRole: string;

    /**
     * The sync source.
     *
     * > Currently the only supported syncSoucre is `SITEWISE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncsource
     */
    public syncSource: string;

    /**
     * The ID of the workspace that contains the sync job.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-workspaceid
     */
    public workspaceId: string;

    /**
     * Metadata you can use to manage the SyncJob.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTTwinMaker::SyncJob`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSyncJobProps) {
        super(scope, id, { type: CfnSyncJob.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'syncRole', this);
        cdk.requireProperty(props, 'syncSource', this);
        cdk.requireProperty(props, 'workspaceId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationDateTime = cdk.Token.asString(this.getAtt('CreationDateTime', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));
        this.attrUpdateDateTime = cdk.Token.asString(this.getAtt('UpdateDateTime', cdk.ResolutionTypeHint.STRING));

        this.syncRole = props.syncRole;
        this.syncSource = props.syncSource;
        this.workspaceId = props.workspaceId;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::SyncJob", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSyncJob.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            syncRole: this.syncRole,
            syncSource: this.syncSource,
            workspaceId: this.workspaceId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSyncJobPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html
 */
export interface CfnWorkspaceProps {

    /**
     * The ARN of the execution role associated with the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-role
     */
    readonly role: string;

    /**
     * The ARN of the S3 bucket where resources associated with the workspace are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-s3location
     */
    readonly s3Location: string;

    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-workspaceid
     */
    readonly workspaceId: string;

    /**
     * The description of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-description
     */
    readonly description?: string;

    /**
     * Metadata that you can use to manage the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnWorkspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the result of the validation.
 */
function CfnWorkspacePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('role', cdk.requiredValidator)(properties.role));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    errors.collect(cdk.propertyValidator('s3Location', cdk.requiredValidator)(properties.s3Location));
    errors.collect(cdk.propertyValidator('s3Location', cdk.validateString)(properties.s3Location));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.requiredValidator)(properties.workspaceId));
    errors.collect(cdk.propertyValidator('workspaceId', cdk.validateString)(properties.workspaceId));
    return errors.wrap('supplied properties not correct for "CfnWorkspaceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Workspace` resource
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTTwinMaker::Workspace` resource.
 */
// @ts-ignore TS6133
function cfnWorkspacePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspacePropsValidator(properties).assertSuccess();
    return {
        Role: cdk.stringToCloudFormation(properties.role),
        S3Location: cdk.stringToCloudFormation(properties.s3Location),
        WorkspaceId: cdk.stringToCloudFormation(properties.workspaceId),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspaceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspaceProps>();
    ret.addPropertyResult('role', 'Role', cfn_parse.FromCloudFormation.getString(properties.Role));
    ret.addPropertyResult('s3Location', 'S3Location', cfn_parse.FromCloudFormation.getString(properties.S3Location));
    ret.addPropertyResult('workspaceId', 'WorkspaceId', cfn_parse.FromCloudFormation.getString(properties.WorkspaceId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTTwinMaker::Workspace`
 *
 * Use the `AWS::IoTTwinMaker::Workspace` resource to declare a workspace.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Workspace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html
 */
export class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::Workspace";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkspace {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWorkspacePropsFromCloudFormation(resourceProperties);
        const ret = new CfnWorkspace(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The workspace ARN.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The date and time the workspace was created.
     * @cloudformationAttribute CreationDateTime
     */
    public readonly attrCreationDateTime: string;

    /**
     * The date and time the workspace was updated.
     * @cloudformationAttribute UpdateDateTime
     */
    public readonly attrUpdateDateTime: string;

    /**
     * The ARN of the execution role associated with the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-role
     */
    public role: string;

    /**
     * The ARN of the S3 bucket where resources associated with the workspace are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-s3location
     */
    public s3Location: string;

    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-workspaceid
     */
    public workspaceId: string;

    /**
     * The description of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-description
     */
    public description: string | undefined;

    /**
     * Metadata that you can use to manage the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTTwinMaker::Workspace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps) {
        super(scope, id, { type: CfnWorkspace.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'role', this);
        cdk.requireProperty(props, 's3Location', this);
        cdk.requireProperty(props, 'workspaceId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationDateTime = cdk.Token.asString(this.getAtt('CreationDateTime', cdk.ResolutionTypeHint.STRING));
        this.attrUpdateDateTime = cdk.Token.asString(this.getAtt('UpdateDateTime', cdk.ResolutionTypeHint.STRING));

        this.role = props.role;
        this.s3Location = props.s3Location;
        this.workspaceId = props.workspaceId;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::Workspace", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkspace.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            role: this.role,
            s3Location: this.s3Location,
            workspaceId: this.workspaceId,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWorkspacePropsToCloudFormation(props);
    }
}
