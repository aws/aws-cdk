// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:10.819Z","fingerprint":"ZA6OhdLhL/jfi7f9rZDB1U4B8G010sDfANGQ6KQfB+U="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDataIntegration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html
 */
export interface CfnDataIntegrationProps {

    /**
     * The KMS key for the DataIntegration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-kmskey
     */
    readonly kmsKey: string;

    /**
     * The name of the DataIntegration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-name
     */
    readonly name: string;

    /**
     * The name of the data and how often it should be pulled from the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-scheduleconfig
     */
    readonly scheduleConfig: CfnDataIntegration.ScheduleConfigProperty | cdk.IResolvable;

    /**
     * The URI of the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-sourceuri
     */
    readonly sourceUri: string;

    /**
     * A description of the DataIntegration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDataIntegrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataIntegrationProps`
 *
 * @returns the result of the validation.
 */
function CfnDataIntegrationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('kmsKey', cdk.requiredValidator)(properties.kmsKey));
    errors.collect(cdk.propertyValidator('kmsKey', cdk.validateString)(properties.kmsKey));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('scheduleConfig', cdk.requiredValidator)(properties.scheduleConfig));
    errors.collect(cdk.propertyValidator('scheduleConfig', CfnDataIntegration_ScheduleConfigPropertyValidator)(properties.scheduleConfig));
    errors.collect(cdk.propertyValidator('sourceUri', cdk.requiredValidator)(properties.sourceUri));
    errors.collect(cdk.propertyValidator('sourceUri', cdk.validateString)(properties.sourceUri));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDataIntegrationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppIntegrations::DataIntegration` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataIntegrationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppIntegrations::DataIntegration` resource.
 */
// @ts-ignore TS6133
function cfnDataIntegrationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataIntegrationPropsValidator(properties).assertSuccess();
    return {
        KmsKey: cdk.stringToCloudFormation(properties.kmsKey),
        Name: cdk.stringToCloudFormation(properties.name),
        ScheduleConfig: cfnDataIntegrationScheduleConfigPropertyToCloudFormation(properties.scheduleConfig),
        SourceURI: cdk.stringToCloudFormation(properties.sourceUri),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDataIntegrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataIntegrationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataIntegrationProps>();
    ret.addPropertyResult('kmsKey', 'KmsKey', cfn_parse.FromCloudFormation.getString(properties.KmsKey));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('scheduleConfig', 'ScheduleConfig', CfnDataIntegrationScheduleConfigPropertyFromCloudFormation(properties.ScheduleConfig));
    ret.addPropertyResult('sourceUri', 'SourceURI', cfn_parse.FromCloudFormation.getString(properties.SourceURI));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppIntegrations::DataIntegration`
 *
 * Creates and persists a DataIntegration resource.
 *
 * @cloudformationResource AWS::AppIntegrations::DataIntegration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html
 */
export class CfnDataIntegration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppIntegrations::DataIntegration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataIntegration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDataIntegrationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataIntegration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) for the DataIntegration.
     * @cloudformationAttribute DataIntegrationArn
     */
    public readonly attrDataIntegrationArn: string;

    /**
     * A unique identifier.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The KMS key for the DataIntegration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-kmskey
     */
    public kmsKey: string;

    /**
     * The name of the DataIntegration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-name
     */
    public name: string;

    /**
     * The name of the data and how often it should be pulled from the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-scheduleconfig
     */
    public scheduleConfig: CfnDataIntegration.ScheduleConfigProperty | cdk.IResolvable;

    /**
     * The URI of the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-sourceuri
     */
    public sourceUri: string;

    /**
     * A description of the DataIntegration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AppIntegrations::DataIntegration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataIntegrationProps) {
        super(scope, id, { type: CfnDataIntegration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'kmsKey', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'scheduleConfig', this);
        cdk.requireProperty(props, 'sourceUri', this);
        this.attrDataIntegrationArn = cdk.Token.asString(this.getAtt('DataIntegrationArn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.kmsKey = props.kmsKey;
        this.name = props.name;
        this.scheduleConfig = props.scheduleConfig;
        this.sourceUri = props.sourceUri;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppIntegrations::DataIntegration", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataIntegration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            kmsKey: this.kmsKey,
            name: this.name,
            scheduleConfig: this.scheduleConfig,
            sourceUri: this.sourceUri,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataIntegrationPropsToCloudFormation(props);
    }
}

export namespace CfnDataIntegration {
    /**
     * The name of the data and how often it should be pulled from the source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-scheduleconfig.html
     */
    export interface ScheduleConfigProperty {
        /**
         * The start date for objects to import in the first flow run as an Unix/epoch timestamp in milliseconds or in ISO-8601 format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-scheduleconfig.html#cfn-appintegrations-dataintegration-scheduleconfig-firstexecutionfrom
         */
        readonly firstExecutionFrom: string;
        /**
         * The name of the object to pull from the data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-scheduleconfig.html#cfn-appintegrations-dataintegration-scheduleconfig-object
         */
        readonly object: string;
        /**
         * How often the data should be pulled from data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-scheduleconfig.html#cfn-appintegrations-dataintegration-scheduleconfig-scheduleexpression
         */
        readonly scheduleExpression: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataIntegration_ScheduleConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('firstExecutionFrom', cdk.requiredValidator)(properties.firstExecutionFrom));
    errors.collect(cdk.propertyValidator('firstExecutionFrom', cdk.validateString)(properties.firstExecutionFrom));
    errors.collect(cdk.propertyValidator('object', cdk.requiredValidator)(properties.object));
    errors.collect(cdk.propertyValidator('object', cdk.validateString)(properties.object));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.requiredValidator)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    return errors.wrap('supplied properties not correct for "ScheduleConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppIntegrations::DataIntegration.ScheduleConfig` resource
 *
 * @param properties - the TypeScript properties of a `ScheduleConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppIntegrations::DataIntegration.ScheduleConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataIntegrationScheduleConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataIntegration_ScheduleConfigPropertyValidator(properties).assertSuccess();
    return {
        FirstExecutionFrom: cdk.stringToCloudFormation(properties.firstExecutionFrom),
        Object: cdk.stringToCloudFormation(properties.object),
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
    };
}

// @ts-ignore TS6133
function CfnDataIntegrationScheduleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataIntegration.ScheduleConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataIntegration.ScheduleConfigProperty>();
    ret.addPropertyResult('firstExecutionFrom', 'FirstExecutionFrom', cfn_parse.FromCloudFormation.getString(properties.FirstExecutionFrom));
    ret.addPropertyResult('object', 'Object', cfn_parse.FromCloudFormation.getString(properties.Object));
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEventIntegration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html
 */
export interface CfnEventIntegrationProps {

    /**
     * The Amazon EventBridge bus for the event integration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-eventbridgebus
     */
    readonly eventBridgeBus: string;

    /**
     * The event integration filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-eventfilter
     */
    readonly eventFilter: CfnEventIntegration.EventFilterProperty | cdk.IResolvable;

    /**
     * The name of the event integration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-name
     */
    readonly name: string;

    /**
     * The event integration description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnEventIntegrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventIntegrationProps`
 *
 * @returns the result of the validation.
 */
function CfnEventIntegrationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('eventBridgeBus', cdk.requiredValidator)(properties.eventBridgeBus));
    errors.collect(cdk.propertyValidator('eventBridgeBus', cdk.validateString)(properties.eventBridgeBus));
    errors.collect(cdk.propertyValidator('eventFilter', cdk.requiredValidator)(properties.eventFilter));
    errors.collect(cdk.propertyValidator('eventFilter', CfnEventIntegration_EventFilterPropertyValidator)(properties.eventFilter));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnEventIntegrationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppIntegrations::EventIntegration` resource
 *
 * @param properties - the TypeScript properties of a `CfnEventIntegrationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppIntegrations::EventIntegration` resource.
 */
// @ts-ignore TS6133
function cfnEventIntegrationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventIntegrationPropsValidator(properties).assertSuccess();
    return {
        EventBridgeBus: cdk.stringToCloudFormation(properties.eventBridgeBus),
        EventFilter: cfnEventIntegrationEventFilterPropertyToCloudFormation(properties.eventFilter),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEventIntegrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventIntegrationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventIntegrationProps>();
    ret.addPropertyResult('eventBridgeBus', 'EventBridgeBus', cfn_parse.FromCloudFormation.getString(properties.EventBridgeBus));
    ret.addPropertyResult('eventFilter', 'EventFilter', CfnEventIntegrationEventFilterPropertyFromCloudFormation(properties.EventFilter));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppIntegrations::EventIntegration`
 *
 * Creates an event integration. You provide a name, description, and a reference to an Amazon EventBridge bus in your account and a partner event source that will push events to that bus. No objects are created in your account, only metadata that is persisted on the EventIntegration control plane.
 *
 * @cloudformationResource AWS::AppIntegrations::EventIntegration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html
 */
export class CfnEventIntegration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppIntegrations::EventIntegration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventIntegration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEventIntegrationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEventIntegration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The association status of the event integration, returned as an array of EventIntegrationAssociation objects.
     * @cloudformationAttribute Associations
     */
    public readonly attrAssociations: cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the event integration.
     * @cloudformationAttribute EventIntegrationArn
     */
    public readonly attrEventIntegrationArn: string;

    /**
     * The Amazon EventBridge bus for the event integration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-eventbridgebus
     */
    public eventBridgeBus: string;

    /**
     * The event integration filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-eventfilter
     */
    public eventFilter: CfnEventIntegration.EventFilterProperty | cdk.IResolvable;

    /**
     * The name of the event integration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-name
     */
    public name: string;

    /**
     * The event integration description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AppIntegrations::EventIntegration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEventIntegrationProps) {
        super(scope, id, { type: CfnEventIntegration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'eventBridgeBus', this);
        cdk.requireProperty(props, 'eventFilter', this);
        cdk.requireProperty(props, 'name', this);
        this.attrAssociations = this.getAtt('Associations', cdk.ResolutionTypeHint.STRING);
        this.attrEventIntegrationArn = cdk.Token.asString(this.getAtt('EventIntegrationArn', cdk.ResolutionTypeHint.STRING));

        this.eventBridgeBus = props.eventBridgeBus;
        this.eventFilter = props.eventFilter;
        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppIntegrations::EventIntegration", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventIntegration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            eventBridgeBus: this.eventBridgeBus,
            eventFilter: this.eventFilter,
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEventIntegrationPropsToCloudFormation(props);
    }
}

export namespace CfnEventIntegration {
    /**
     * The event integration filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventfilter.html
     */
    export interface EventFilterProperty {
        /**
         * The source of the events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventfilter.html#cfn-appintegrations-eventintegration-eventfilter-source
         */
        readonly source: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventFilterProperty`
 *
 * @param properties - the TypeScript properties of a `EventFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventIntegration_EventFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('source', cdk.requiredValidator)(properties.source));
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    return errors.wrap('supplied properties not correct for "EventFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppIntegrations::EventIntegration.EventFilter` resource
 *
 * @param properties - the TypeScript properties of a `EventFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppIntegrations::EventIntegration.EventFilter` resource.
 */
// @ts-ignore TS6133
function cfnEventIntegrationEventFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventIntegration_EventFilterPropertyValidator(properties).assertSuccess();
    return {
        Source: cdk.stringToCloudFormation(properties.source),
    };
}

// @ts-ignore TS6133
function CfnEventIntegrationEventFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventIntegration.EventFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventIntegration.EventFilterProperty>();
    ret.addPropertyResult('source', 'Source', cfn_parse.FromCloudFormation.getString(properties.Source));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventIntegration {
    /**
     * The event integration association.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventintegrationassociation.html
     */
    export interface EventIntegrationAssociationProperty {
        /**
         * The metadata associated with the client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventintegrationassociation.html#cfn-appintegrations-eventintegration-eventintegrationassociation-clientassociationmetadata
         */
        readonly clientAssociationMetadata?: Array<CfnEventIntegration.MetadataProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The identifier for the client that is associated with the event integration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventintegrationassociation.html#cfn-appintegrations-eventintegration-eventintegrationassociation-clientid
         */
        readonly clientId?: string;
        /**
         * The name of the EventBridge rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventintegrationassociation.html#cfn-appintegrations-eventintegration-eventintegrationassociation-eventbridgerulename
         */
        readonly eventBridgeRuleName?: string;
        /**
         * The Amazon Resource Name (ARN) for the event integration association.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventintegrationassociation.html#cfn-appintegrations-eventintegration-eventintegrationassociation-eventintegrationassociationarn
         */
        readonly eventIntegrationAssociationArn?: string;
        /**
         * The identifier for the event integration association.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventintegrationassociation.html#cfn-appintegrations-eventintegration-eventintegrationassociation-eventintegrationassociationid
         */
        readonly eventIntegrationAssociationId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventIntegrationAssociationProperty`
 *
 * @param properties - the TypeScript properties of a `EventIntegrationAssociationProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventIntegration_EventIntegrationAssociationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientAssociationMetadata', cdk.listValidator(CfnEventIntegration_MetadataPropertyValidator))(properties.clientAssociationMetadata));
    errors.collect(cdk.propertyValidator('clientId', cdk.validateString)(properties.clientId));
    errors.collect(cdk.propertyValidator('eventBridgeRuleName', cdk.validateString)(properties.eventBridgeRuleName));
    errors.collect(cdk.propertyValidator('eventIntegrationAssociationArn', cdk.validateString)(properties.eventIntegrationAssociationArn));
    errors.collect(cdk.propertyValidator('eventIntegrationAssociationId', cdk.validateString)(properties.eventIntegrationAssociationId));
    return errors.wrap('supplied properties not correct for "EventIntegrationAssociationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppIntegrations::EventIntegration.EventIntegrationAssociation` resource
 *
 * @param properties - the TypeScript properties of a `EventIntegrationAssociationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppIntegrations::EventIntegration.EventIntegrationAssociation` resource.
 */
// @ts-ignore TS6133
function cfnEventIntegrationEventIntegrationAssociationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventIntegration_EventIntegrationAssociationPropertyValidator(properties).assertSuccess();
    return {
        ClientAssociationMetadata: cdk.listMapper(cfnEventIntegrationMetadataPropertyToCloudFormation)(properties.clientAssociationMetadata),
        ClientId: cdk.stringToCloudFormation(properties.clientId),
        EventBridgeRuleName: cdk.stringToCloudFormation(properties.eventBridgeRuleName),
        EventIntegrationAssociationArn: cdk.stringToCloudFormation(properties.eventIntegrationAssociationArn),
        EventIntegrationAssociationId: cdk.stringToCloudFormation(properties.eventIntegrationAssociationId),
    };
}

// @ts-ignore TS6133
function CfnEventIntegrationEventIntegrationAssociationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventIntegration.EventIntegrationAssociationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventIntegration.EventIntegrationAssociationProperty>();
    ret.addPropertyResult('clientAssociationMetadata', 'ClientAssociationMetadata', properties.ClientAssociationMetadata != null ? cfn_parse.FromCloudFormation.getArray(CfnEventIntegrationMetadataPropertyFromCloudFormation)(properties.ClientAssociationMetadata) : undefined);
    ret.addPropertyResult('clientId', 'ClientId', properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined);
    ret.addPropertyResult('eventBridgeRuleName', 'EventBridgeRuleName', properties.EventBridgeRuleName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBridgeRuleName) : undefined);
    ret.addPropertyResult('eventIntegrationAssociationArn', 'EventIntegrationAssociationArn', properties.EventIntegrationAssociationArn != null ? cfn_parse.FromCloudFormation.getString(properties.EventIntegrationAssociationArn) : undefined);
    ret.addPropertyResult('eventIntegrationAssociationId', 'EventIntegrationAssociationId', properties.EventIntegrationAssociationId != null ? cfn_parse.FromCloudFormation.getString(properties.EventIntegrationAssociationId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventIntegration {
    /**
     * The metadata associated with the client.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-metadata.html
     */
    export interface MetadataProperty {
        /**
         * The key name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-metadata.html#cfn-appintegrations-eventintegration-metadata-key
         */
        readonly key: string;
        /**
         * The value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-metadata.html#cfn-appintegrations-eventintegration-metadata-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetadataProperty`
 *
 * @param properties - the TypeScript properties of a `MetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventIntegration_MetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "MetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppIntegrations::EventIntegration.Metadata` resource
 *
 * @param properties - the TypeScript properties of a `MetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppIntegrations::EventIntegration.Metadata` resource.
 */
// @ts-ignore TS6133
function cfnEventIntegrationMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventIntegration_MetadataPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnEventIntegrationMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventIntegration.MetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventIntegration.MetadataProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
