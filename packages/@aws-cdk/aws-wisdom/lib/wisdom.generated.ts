// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:35.070Z","fingerprint":"P8IlERyYxPOX19cWpnnwgu5vRyfmMxL7RLPjBAGJPAY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAssistant`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html
 */
export interface CfnAssistantProps {

    /**
     * The name of the assistant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-name
     */
    readonly name: string;

    /**
     * The type of assistant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-type
     */
    readonly type: string;

    /**
     * The description of the assistant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-description
     */
    readonly description?: string;

    /**
     * The KMS key used for encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-serversideencryptionconfiguration
     */
    readonly serverSideEncryptionConfiguration?: CfnAssistant.ServerSideEncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAssistantProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssistantProps`
 *
 * @returns the result of the validation.
 */
function CfnAssistantPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('serverSideEncryptionConfiguration', CfnAssistant_ServerSideEncryptionConfigurationPropertyValidator)(properties.serverSideEncryptionConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnAssistantProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::Assistant` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssistantProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::Assistant` resource.
 */
// @ts-ignore TS6133
function cfnAssistantPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssistantPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
        Description: cdk.stringToCloudFormation(properties.description),
        ServerSideEncryptionConfiguration: cfnAssistantServerSideEncryptionConfigurationPropertyToCloudFormation(properties.serverSideEncryptionConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAssistantPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssistantProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssistantProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('serverSideEncryptionConfiguration', 'ServerSideEncryptionConfiguration', properties.ServerSideEncryptionConfiguration != null ? CfnAssistantServerSideEncryptionConfigurationPropertyFromCloudFormation(properties.ServerSideEncryptionConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Wisdom::Assistant`
 *
 * Specifies an Amazon Connect Wisdom assistant.
 *
 * @cloudformationResource AWS::Wisdom::Assistant
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html
 */
export class CfnAssistant extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Wisdom::Assistant";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssistant {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAssistantPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAssistant(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the assistant.
     * @cloudformationAttribute AssistantArn
     */
    public readonly attrAssistantArn: string;

    /**
     * The ID of the Wisdom assistant.
     * @cloudformationAttribute AssistantId
     */
    public readonly attrAssistantId: string;

    /**
     * The name of the assistant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-name
     */
    public name: string;

    /**
     * The type of assistant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-type
     */
    public type: string;

    /**
     * The description of the assistant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-description
     */
    public description: string | undefined;

    /**
     * The KMS key used for encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-serversideencryptionconfiguration
     */
    public serverSideEncryptionConfiguration: CfnAssistant.ServerSideEncryptionConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistant.html#cfn-wisdom-assistant-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Wisdom::Assistant`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssistantProps) {
        super(scope, id, { type: CfnAssistant.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'type', this);
        this.attrAssistantArn = cdk.Token.asString(this.getAtt('AssistantArn', cdk.ResolutionTypeHint.STRING));
        this.attrAssistantId = cdk.Token.asString(this.getAtt('AssistantId', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.type = props.type;
        this.description = props.description;
        this.serverSideEncryptionConfiguration = props.serverSideEncryptionConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Wisdom::Assistant", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssistant.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            type: this.type,
            description: this.description,
            serverSideEncryptionConfiguration: this.serverSideEncryptionConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssistantPropsToCloudFormation(props);
    }
}

export namespace CfnAssistant {
    /**
     * The KMS key used for encryption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-assistant-serversideencryptionconfiguration.html
     */
    export interface ServerSideEncryptionConfigurationProperty {
        /**
         * The KMS key . For information about valid ID values, see [Key identifiers (KeyId)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-assistant-serversideencryptionconfiguration.html#cfn-wisdom-assistant-serversideencryptionconfiguration-kmskeyid
         */
        readonly kmsKeyId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssistant_ServerSideEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    return errors.wrap('supplied properties not correct for "ServerSideEncryptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::Assistant.ServerSideEncryptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::Assistant.ServerSideEncryptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAssistantServerSideEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssistant_ServerSideEncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
    };
}

// @ts-ignore TS6133
function CfnAssistantServerSideEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssistant.ServerSideEncryptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssistant.ServerSideEncryptionConfigurationProperty>();
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnAssistantAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html
 */
export interface CfnAssistantAssociationProps {

    /**
     * The identifier of the Wisdom assistant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-assistantid
     */
    readonly assistantId: string;

    /**
     * The identifier of the associated resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-association
     */
    readonly association: CfnAssistantAssociation.AssociationDataProperty | cdk.IResolvable;

    /**
     * The type of association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-associationtype
     */
    readonly associationType: string;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAssistantAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssistantAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnAssistantAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assistantId', cdk.requiredValidator)(properties.assistantId));
    errors.collect(cdk.propertyValidator('assistantId', cdk.validateString)(properties.assistantId));
    errors.collect(cdk.propertyValidator('association', cdk.requiredValidator)(properties.association));
    errors.collect(cdk.propertyValidator('association', CfnAssistantAssociation_AssociationDataPropertyValidator)(properties.association));
    errors.collect(cdk.propertyValidator('associationType', cdk.requiredValidator)(properties.associationType));
    errors.collect(cdk.propertyValidator('associationType', cdk.validateString)(properties.associationType));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAssistantAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::AssistantAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssistantAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::AssistantAssociation` resource.
 */
// @ts-ignore TS6133
function cfnAssistantAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssistantAssociationPropsValidator(properties).assertSuccess();
    return {
        AssistantId: cdk.stringToCloudFormation(properties.assistantId),
        Association: cfnAssistantAssociationAssociationDataPropertyToCloudFormation(properties.association),
        AssociationType: cdk.stringToCloudFormation(properties.associationType),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAssistantAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssistantAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssistantAssociationProps>();
    ret.addPropertyResult('assistantId', 'AssistantId', cfn_parse.FromCloudFormation.getString(properties.AssistantId));
    ret.addPropertyResult('association', 'Association', CfnAssistantAssociationAssociationDataPropertyFromCloudFormation(properties.Association));
    ret.addPropertyResult('associationType', 'AssociationType', cfn_parse.FromCloudFormation.getString(properties.AssociationType));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Wisdom::AssistantAssociation`
 *
 * Specifies an association between an Amazon Connect Wisdom assistant and another resource. Currently, the only supported association is with a knowledge base. An assistant can have only a single association.
 *
 * @cloudformationResource AWS::Wisdom::AssistantAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html
 */
export class CfnAssistantAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Wisdom::AssistantAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssistantAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAssistantAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAssistantAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the Wisdom assistant.
     * @cloudformationAttribute AssistantArn
     */
    public readonly attrAssistantArn: string;

    /**
     * The Amazon Resource Name (ARN) of the assistant association.
     * @cloudformationAttribute AssistantAssociationArn
     */
    public readonly attrAssistantAssociationArn: string;

    /**
     * The ID of the association.
     * @cloudformationAttribute AssistantAssociationId
     */
    public readonly attrAssistantAssociationId: string;

    /**
     * The identifier of the Wisdom assistant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-assistantid
     */
    public assistantId: string;

    /**
     * The identifier of the associated resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-association
     */
    public association: CfnAssistantAssociation.AssociationDataProperty | cdk.IResolvable;

    /**
     * The type of association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-associationtype
     */
    public associationType: string;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-assistantassociation.html#cfn-wisdom-assistantassociation-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Wisdom::AssistantAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssistantAssociationProps) {
        super(scope, id, { type: CfnAssistantAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'assistantId', this);
        cdk.requireProperty(props, 'association', this);
        cdk.requireProperty(props, 'associationType', this);
        this.attrAssistantArn = cdk.Token.asString(this.getAtt('AssistantArn', cdk.ResolutionTypeHint.STRING));
        this.attrAssistantAssociationArn = cdk.Token.asString(this.getAtt('AssistantAssociationArn', cdk.ResolutionTypeHint.STRING));
        this.attrAssistantAssociationId = cdk.Token.asString(this.getAtt('AssistantAssociationId', cdk.ResolutionTypeHint.STRING));

        this.assistantId = props.assistantId;
        this.association = props.association;
        this.associationType = props.associationType;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Wisdom::AssistantAssociation", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssistantAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            assistantId: this.assistantId,
            association: this.association,
            associationType: this.associationType,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssistantAssociationPropsToCloudFormation(props);
    }
}

export namespace CfnAssistantAssociation {
    /**
     * A union type that currently has a single argument, which is the knowledge base ID.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-assistantassociation-associationdata.html
     */
    export interface AssociationDataProperty {
        /**
         * The identifier of the knowledge base.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-assistantassociation-associationdata.html#cfn-wisdom-assistantassociation-associationdata-knowledgebaseid
         */
        readonly knowledgeBaseId: string;
    }
}

/**
 * Determine whether the given properties match those of a `AssociationDataProperty`
 *
 * @param properties - the TypeScript properties of a `AssociationDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssistantAssociation_AssociationDataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('knowledgeBaseId', cdk.requiredValidator)(properties.knowledgeBaseId));
    errors.collect(cdk.propertyValidator('knowledgeBaseId', cdk.validateString)(properties.knowledgeBaseId));
    return errors.wrap('supplied properties not correct for "AssociationDataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::AssistantAssociation.AssociationData` resource
 *
 * @param properties - the TypeScript properties of a `AssociationDataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::AssistantAssociation.AssociationData` resource.
 */
// @ts-ignore TS6133
function cfnAssistantAssociationAssociationDataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssistantAssociation_AssociationDataPropertyValidator(properties).assertSuccess();
    return {
        KnowledgeBaseId: cdk.stringToCloudFormation(properties.knowledgeBaseId),
    };
}

// @ts-ignore TS6133
function CfnAssistantAssociationAssociationDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssistantAssociation.AssociationDataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssistantAssociation.AssociationDataProperty>();
    ret.addPropertyResult('knowledgeBaseId', 'KnowledgeBaseId', cfn_parse.FromCloudFormation.getString(properties.KnowledgeBaseId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnKnowledgeBase`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html
 */
export interface CfnKnowledgeBaseProps {

    /**
     * The type of knowledge base. Only CUSTOM knowledge bases allow you to upload your own content. EXTERNAL knowledge bases support integrations with third-party systems whose content is synchronized automatically.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-knowledgebasetype
     */
    readonly knowledgeBaseType: string;

    /**
     * The name of the knowledge base.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-name
     */
    readonly name: string;

    /**
     * The description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-description
     */
    readonly description?: string;

    /**
     * Information about how to render the content.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-renderingconfiguration
     */
    readonly renderingConfiguration?: CfnKnowledgeBase.RenderingConfigurationProperty | cdk.IResolvable;

    /**
     * The KMS key used for encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-serversideencryptionconfiguration
     */
    readonly serverSideEncryptionConfiguration?: CfnKnowledgeBase.ServerSideEncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * The source of the knowledge base content. Only set this argument for EXTERNAL knowledge bases.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-sourceconfiguration
     */
    readonly sourceConfiguration?: CfnKnowledgeBase.SourceConfigurationProperty | cdk.IResolvable;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnKnowledgeBaseProps`
 *
 * @param properties - the TypeScript properties of a `CfnKnowledgeBaseProps`
 *
 * @returns the result of the validation.
 */
function CfnKnowledgeBasePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('knowledgeBaseType', cdk.requiredValidator)(properties.knowledgeBaseType));
    errors.collect(cdk.propertyValidator('knowledgeBaseType', cdk.validateString)(properties.knowledgeBaseType));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('renderingConfiguration', CfnKnowledgeBase_RenderingConfigurationPropertyValidator)(properties.renderingConfiguration));
    errors.collect(cdk.propertyValidator('serverSideEncryptionConfiguration', CfnKnowledgeBase_ServerSideEncryptionConfigurationPropertyValidator)(properties.serverSideEncryptionConfiguration));
    errors.collect(cdk.propertyValidator('sourceConfiguration', CfnKnowledgeBase_SourceConfigurationPropertyValidator)(properties.sourceConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnKnowledgeBaseProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase` resource
 *
 * @param properties - the TypeScript properties of a `CfnKnowledgeBaseProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase` resource.
 */
// @ts-ignore TS6133
function cfnKnowledgeBasePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnKnowledgeBasePropsValidator(properties).assertSuccess();
    return {
        KnowledgeBaseType: cdk.stringToCloudFormation(properties.knowledgeBaseType),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        RenderingConfiguration: cfnKnowledgeBaseRenderingConfigurationPropertyToCloudFormation(properties.renderingConfiguration),
        ServerSideEncryptionConfiguration: cfnKnowledgeBaseServerSideEncryptionConfigurationPropertyToCloudFormation(properties.serverSideEncryptionConfiguration),
        SourceConfiguration: cfnKnowledgeBaseSourceConfigurationPropertyToCloudFormation(properties.sourceConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnKnowledgeBasePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKnowledgeBaseProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBaseProps>();
    ret.addPropertyResult('knowledgeBaseType', 'KnowledgeBaseType', cfn_parse.FromCloudFormation.getString(properties.KnowledgeBaseType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('renderingConfiguration', 'RenderingConfiguration', properties.RenderingConfiguration != null ? CfnKnowledgeBaseRenderingConfigurationPropertyFromCloudFormation(properties.RenderingConfiguration) : undefined);
    ret.addPropertyResult('serverSideEncryptionConfiguration', 'ServerSideEncryptionConfiguration', properties.ServerSideEncryptionConfiguration != null ? CfnKnowledgeBaseServerSideEncryptionConfigurationPropertyFromCloudFormation(properties.ServerSideEncryptionConfiguration) : undefined);
    ret.addPropertyResult('sourceConfiguration', 'SourceConfiguration', properties.SourceConfiguration != null ? CfnKnowledgeBaseSourceConfigurationPropertyFromCloudFormation(properties.SourceConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Wisdom::KnowledgeBase`
 *
 * Specifies a knowledge base.
 *
 * @cloudformationResource AWS::Wisdom::KnowledgeBase
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html
 */
export class CfnKnowledgeBase extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Wisdom::KnowledgeBase";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnKnowledgeBase {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnKnowledgeBasePropsFromCloudFormation(resourceProperties);
        const ret = new CfnKnowledgeBase(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the knowledge base.
     * @cloudformationAttribute KnowledgeBaseArn
     */
    public readonly attrKnowledgeBaseArn: string;

    /**
     * The ID of the knowledge base.
     * @cloudformationAttribute KnowledgeBaseId
     */
    public readonly attrKnowledgeBaseId: string;

    /**
     * The type of knowledge base. Only CUSTOM knowledge bases allow you to upload your own content. EXTERNAL knowledge bases support integrations with third-party systems whose content is synchronized automatically.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-knowledgebasetype
     */
    public knowledgeBaseType: string;

    /**
     * The name of the knowledge base.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-name
     */
    public name: string;

    /**
     * The description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-description
     */
    public description: string | undefined;

    /**
     * Information about how to render the content.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-renderingconfiguration
     */
    public renderingConfiguration: CfnKnowledgeBase.RenderingConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The KMS key used for encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-serversideencryptionconfiguration
     */
    public serverSideEncryptionConfiguration: CfnKnowledgeBase.ServerSideEncryptionConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The source of the knowledge base content. Only set this argument for EXTERNAL knowledge bases.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-sourceconfiguration
     */
    public sourceConfiguration: CfnKnowledgeBase.SourceConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wisdom-knowledgebase.html#cfn-wisdom-knowledgebase-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Wisdom::KnowledgeBase`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnKnowledgeBaseProps) {
        super(scope, id, { type: CfnKnowledgeBase.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'knowledgeBaseType', this);
        cdk.requireProperty(props, 'name', this);
        this.attrKnowledgeBaseArn = cdk.Token.asString(this.getAtt('KnowledgeBaseArn', cdk.ResolutionTypeHint.STRING));
        this.attrKnowledgeBaseId = cdk.Token.asString(this.getAtt('KnowledgeBaseId', cdk.ResolutionTypeHint.STRING));

        this.knowledgeBaseType = props.knowledgeBaseType;
        this.name = props.name;
        this.description = props.description;
        this.renderingConfiguration = props.renderingConfiguration;
        this.serverSideEncryptionConfiguration = props.serverSideEncryptionConfiguration;
        this.sourceConfiguration = props.sourceConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Wisdom::KnowledgeBase", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnKnowledgeBase.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            knowledgeBaseType: this.knowledgeBaseType,
            name: this.name,
            description: this.description,
            renderingConfiguration: this.renderingConfiguration,
            serverSideEncryptionConfiguration: this.serverSideEncryptionConfiguration,
            sourceConfiguration: this.sourceConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnKnowledgeBasePropsToCloudFormation(props);
    }
}

export namespace CfnKnowledgeBase {
    /**
     * Configuration information for Amazon AppIntegrations to automatically ingest content.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-appintegrationsconfiguration.html
     */
    export interface AppIntegrationsConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the AppIntegrations DataIntegration to use for ingesting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-appintegrationsconfiguration.html#cfn-wisdom-knowledgebase-appintegrationsconfiguration-appintegrationarn
         */
        readonly appIntegrationArn: string;
        /**
         * The fields from the source that are made available to your agents in Wisdom.
         *
         * - For [Salesforce](https://docs.aws.amazon.com/https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/sforce_api_objects_knowledge__kav.htm) , you must include at least `Id` , `ArticleNumber` , `VersionNumber` , `Title` , `PublishStatus` , and `IsDeleted` .
         * - For [ServiceNow](https://docs.aws.amazon.com/https://developer.servicenow.com/dev.do#!/reference/api/rome/rest/knowledge-management-api) , you must include at least `number` , `short_description` , `sys_mod_count` , `workflow_state` , and `active` .
         *
         * Make sure to include additional fields. These fields are indexed and used to source recommendations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-appintegrationsconfiguration.html#cfn-wisdom-knowledgebase-appintegrationsconfiguration-objectfields
         */
        readonly objectFields: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AppIntegrationsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AppIntegrationsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnKnowledgeBase_AppIntegrationsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appIntegrationArn', cdk.requiredValidator)(properties.appIntegrationArn));
    errors.collect(cdk.propertyValidator('appIntegrationArn', cdk.validateString)(properties.appIntegrationArn));
    errors.collect(cdk.propertyValidator('objectFields', cdk.requiredValidator)(properties.objectFields));
    errors.collect(cdk.propertyValidator('objectFields', cdk.listValidator(cdk.validateString))(properties.objectFields));
    return errors.wrap('supplied properties not correct for "AppIntegrationsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase.AppIntegrationsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AppIntegrationsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase.AppIntegrationsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnKnowledgeBaseAppIntegrationsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnKnowledgeBase_AppIntegrationsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AppIntegrationArn: cdk.stringToCloudFormation(properties.appIntegrationArn),
        ObjectFields: cdk.listMapper(cdk.stringToCloudFormation)(properties.objectFields),
    };
}

// @ts-ignore TS6133
function CfnKnowledgeBaseAppIntegrationsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKnowledgeBase.AppIntegrationsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBase.AppIntegrationsConfigurationProperty>();
    ret.addPropertyResult('appIntegrationArn', 'AppIntegrationArn', cfn_parse.FromCloudFormation.getString(properties.AppIntegrationArn));
    ret.addPropertyResult('objectFields', 'ObjectFields', cfn_parse.FromCloudFormation.getStringArray(properties.ObjectFields));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnKnowledgeBase {
    /**
     * Information about how to render the content.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-renderingconfiguration.html
     */
    export interface RenderingConfigurationProperty {
        /**
         * A URI template containing exactly one variable in `${variableName}` format. This can only be set for `EXTERNAL` knowledge bases. For Salesforce and ServiceNow, the variable must be one of the following:
         *
         * - Salesforce: `Id` , `ArticleNumber` , `VersionNumber` , `Title` , `PublishStatus` , or `IsDeleted`
         * - ServiceNow: `number` , `short_description` , `sys_mod_count` , `workflow_state` , or `active`
         *
         * The variable is replaced with the actual value for a piece of content when calling [GetContent](https://docs.aws.amazon.com/wisdom/latest/APIReference/API_GetContent.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-renderingconfiguration.html#cfn-wisdom-knowledgebase-renderingconfiguration-templateuri
         */
        readonly templateUri?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RenderingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RenderingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnKnowledgeBase_RenderingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('templateUri', cdk.validateString)(properties.templateUri));
    return errors.wrap('supplied properties not correct for "RenderingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase.RenderingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `RenderingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase.RenderingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnKnowledgeBaseRenderingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnKnowledgeBase_RenderingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        TemplateUri: cdk.stringToCloudFormation(properties.templateUri),
    };
}

// @ts-ignore TS6133
function CfnKnowledgeBaseRenderingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKnowledgeBase.RenderingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBase.RenderingConfigurationProperty>();
    ret.addPropertyResult('templateUri', 'TemplateUri', properties.TemplateUri != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateUri) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnKnowledgeBase {
    /**
     * The KMS key used for encryption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-serversideencryptionconfiguration.html
     */
    export interface ServerSideEncryptionConfigurationProperty {
        /**
         * The KMS key . For information about valid ID values, see [Key identifiers (KeyId)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-serversideencryptionconfiguration.html#cfn-wisdom-knowledgebase-serversideencryptionconfiguration-kmskeyid
         */
        readonly kmsKeyId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnKnowledgeBase_ServerSideEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    return errors.wrap('supplied properties not correct for "ServerSideEncryptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase.ServerSideEncryptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase.ServerSideEncryptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnKnowledgeBaseServerSideEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnKnowledgeBase_ServerSideEncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
    };
}

// @ts-ignore TS6133
function CfnKnowledgeBaseServerSideEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKnowledgeBase.ServerSideEncryptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBase.ServerSideEncryptionConfigurationProperty>();
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnKnowledgeBase {
    /**
     * Configuration information about the external data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-sourceconfiguration.html
     */
    export interface SourceConfigurationProperty {
        /**
         * Configuration information for Amazon AppIntegrations to automatically ingest content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wisdom-knowledgebase-sourceconfiguration.html#cfn-wisdom-knowledgebase-sourceconfiguration-appintegrations
         */
        readonly appIntegrations: CfnKnowledgeBase.AppIntegrationsConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnKnowledgeBase_SourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appIntegrations', cdk.requiredValidator)(properties.appIntegrations));
    errors.collect(cdk.propertyValidator('appIntegrations', CfnKnowledgeBase_AppIntegrationsConfigurationPropertyValidator)(properties.appIntegrations));
    return errors.wrap('supplied properties not correct for "SourceConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase.SourceConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SourceConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Wisdom::KnowledgeBase.SourceConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnKnowledgeBaseSourceConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnKnowledgeBase_SourceConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AppIntegrations: cfnKnowledgeBaseAppIntegrationsConfigurationPropertyToCloudFormation(properties.appIntegrations),
    };
}

// @ts-ignore TS6133
function CfnKnowledgeBaseSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKnowledgeBase.SourceConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKnowledgeBase.SourceConfigurationProperty>();
    ret.addPropertyResult('appIntegrations', 'AppIntegrations', CfnKnowledgeBaseAppIntegrationsConfigurationPropertyFromCloudFormation(properties.AppIntegrations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
