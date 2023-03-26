// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:17.654Z","fingerprint":"J2L4EmGI32sUD7gwfvfwi0ZcHNiYPX9iBqCuYE9K5aE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDetector`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html
 */
export interface CfnDetectorProps {

    /**
     * The name of the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-detectorid
     */
    readonly detectorId: string;

    /**
     * The event type associated with this detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-eventtype
     */
    readonly eventType: CfnDetector.EventTypeProperty | cdk.IResolvable;

    /**
     * The rules to include in the detector version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-rules
     */
    readonly rules: Array<CfnDetector.RuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The models to associate with this detector. You must provide the ARNs of all the models you want to associate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-associatedmodels
     */
    readonly associatedModels?: Array<CfnDetector.ModelProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The detector description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-description
     */
    readonly description?: string;

    /**
     * The status of the detector version. If a value is not provided for this property, AWS CloudFormation assumes `DRAFT` status.
     *
     * Valid values: `ACTIVE | DRAFT`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-detectorversionstatus
     */
    readonly detectorVersionStatus?: string;

    /**
     * The rule execution mode for the rules included in the detector version.
     *
     * Valid values: `FIRST_MATCHED | ALL_MATCHED` Default value: `FIRST_MATCHED`
     *
     * You can define and edit the rule mode at the detector version level, when it is in draft status.
     *
     * If you specify `FIRST_MATCHED` , Amazon Fraud Detector evaluates rules sequentially, first to last, stopping at the first matched rule. Amazon Fraud dectector then provides the outcomes for that single rule.
     *
     * If you specifiy `ALL_MATCHED` , Amazon Fraud Detector evaluates all rules and returns the outcomes for all matched rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-ruleexecutionmode
     */
    readonly ruleExecutionMode?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDetectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnDetectorProps`
 *
 * @returns the result of the validation.
 */
function CfnDetectorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('associatedModels', cdk.listValidator(CfnDetector_ModelPropertyValidator))(properties.associatedModels));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('detectorId', cdk.requiredValidator)(properties.detectorId));
    errors.collect(cdk.propertyValidator('detectorId', cdk.validateString)(properties.detectorId));
    errors.collect(cdk.propertyValidator('detectorVersionStatus', cdk.validateString)(properties.detectorVersionStatus));
    errors.collect(cdk.propertyValidator('eventType', cdk.requiredValidator)(properties.eventType));
    errors.collect(cdk.propertyValidator('eventType', CfnDetector_EventTypePropertyValidator)(properties.eventType));
    errors.collect(cdk.propertyValidator('ruleExecutionMode', cdk.validateString)(properties.ruleExecutionMode));
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnDetector_RulePropertyValidator))(properties.rules));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDetectorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Detector` resource
 *
 * @param properties - the TypeScript properties of a `CfnDetectorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Detector` resource.
 */
// @ts-ignore TS6133
function cfnDetectorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDetectorPropsValidator(properties).assertSuccess();
    return {
        DetectorId: cdk.stringToCloudFormation(properties.detectorId),
        EventType: cfnDetectorEventTypePropertyToCloudFormation(properties.eventType),
        Rules: cdk.listMapper(cfnDetectorRulePropertyToCloudFormation)(properties.rules),
        AssociatedModels: cdk.listMapper(cfnDetectorModelPropertyToCloudFormation)(properties.associatedModels),
        Description: cdk.stringToCloudFormation(properties.description),
        DetectorVersionStatus: cdk.stringToCloudFormation(properties.detectorVersionStatus),
        RuleExecutionMode: cdk.stringToCloudFormation(properties.ruleExecutionMode),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDetectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorProps>();
    ret.addPropertyResult('detectorId', 'DetectorId', cfn_parse.FromCloudFormation.getString(properties.DetectorId));
    ret.addPropertyResult('eventType', 'EventType', CfnDetectorEventTypePropertyFromCloudFormation(properties.EventType));
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnDetectorRulePropertyFromCloudFormation)(properties.Rules));
    ret.addPropertyResult('associatedModels', 'AssociatedModels', properties.AssociatedModels != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorModelPropertyFromCloudFormation)(properties.AssociatedModels) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('detectorVersionStatus', 'DetectorVersionStatus', properties.DetectorVersionStatus != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorVersionStatus) : undefined);
    ret.addPropertyResult('ruleExecutionMode', 'RuleExecutionMode', properties.RuleExecutionMode != null ? cfn_parse.FromCloudFormation.getString(properties.RuleExecutionMode) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FraudDetector::Detector`
 *
 * Manages a detector and associated detector versions.
 *
 * @cloudformationResource AWS::FraudDetector::Detector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html
 */
export class CfnDetector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FraudDetector::Detector";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDetector {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDetectorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDetector(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The detector ARN.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Timestamp of when detector was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The name of the detector.
     * @cloudformationAttribute DetectorVersionId
     */
    public readonly attrDetectorVersionId: string;

    /**
     *
     * @cloudformationAttribute EventType.Arn
     */
    public readonly attrEventTypeArn: string;

    /**
     *
     * @cloudformationAttribute EventType.CreatedTime
     */
    public readonly attrEventTypeCreatedTime: string;

    /**
     *
     * @cloudformationAttribute EventType.LastUpdatedTime
     */
    public readonly attrEventTypeLastUpdatedTime: string;

    /**
     * Timestamp of when detector was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     * The name of the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-detectorid
     */
    public detectorId: string;

    /**
     * The event type associated with this detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-eventtype
     */
    public eventType: CfnDetector.EventTypeProperty | cdk.IResolvable;

    /**
     * The rules to include in the detector version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-rules
     */
    public rules: Array<CfnDetector.RuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The models to associate with this detector. You must provide the ARNs of all the models you want to associate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-associatedmodels
     */
    public associatedModels: Array<CfnDetector.ModelProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The detector description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-description
     */
    public description: string | undefined;

    /**
     * The status of the detector version. If a value is not provided for this property, AWS CloudFormation assumes `DRAFT` status.
     *
     * Valid values: `ACTIVE | DRAFT`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-detectorversionstatus
     */
    public detectorVersionStatus: string | undefined;

    /**
     * The rule execution mode for the rules included in the detector version.
     *
     * Valid values: `FIRST_MATCHED | ALL_MATCHED` Default value: `FIRST_MATCHED`
     *
     * You can define and edit the rule mode at the detector version level, when it is in draft status.
     *
     * If you specify `FIRST_MATCHED` , Amazon Fraud Detector evaluates rules sequentially, first to last, stopping at the first matched rule. Amazon Fraud dectector then provides the outcomes for that single rule.
     *
     * If you specifiy `ALL_MATCHED` , Amazon Fraud Detector evaluates all rules and returns the outcomes for all matched rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-ruleexecutionmode
     */
    public ruleExecutionMode: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-detector.html#cfn-frauddetector-detector-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::FraudDetector::Detector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDetectorProps) {
        super(scope, id, { type: CfnDetector.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'detectorId', this);
        cdk.requireProperty(props, 'eventType', this);
        cdk.requireProperty(props, 'rules', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrDetectorVersionId = cdk.Token.asString(this.getAtt('DetectorVersionId', cdk.ResolutionTypeHint.STRING));
        this.attrEventTypeArn = cdk.Token.asString(this.getAtt('EventType.Arn', cdk.ResolutionTypeHint.STRING));
        this.attrEventTypeCreatedTime = cdk.Token.asString(this.getAtt('EventType.CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrEventTypeLastUpdatedTime = cdk.Token.asString(this.getAtt('EventType.LastUpdatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));

        this.detectorId = props.detectorId;
        this.eventType = props.eventType;
        this.rules = props.rules;
        this.associatedModels = props.associatedModels;
        this.description = props.description;
        this.detectorVersionStatus = props.detectorVersionStatus;
        this.ruleExecutionMode = props.ruleExecutionMode;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FraudDetector::Detector", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDetector.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            detectorId: this.detectorId,
            eventType: this.eventType,
            rules: this.rules,
            associatedModels: this.associatedModels,
            description: this.description,
            detectorVersionStatus: this.detectorVersionStatus,
            ruleExecutionMode: this.ruleExecutionMode,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDetectorPropsToCloudFormation(props);
    }
}

export namespace CfnDetector {
    /**
     * The entity type details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-entitytype.html
     */
    export interface EntityTypeProperty {
        /**
         * The entity type ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-entitytype.html#cfn-frauddetector-detector-entitytype-arn
         */
        readonly arn?: string;
        /**
         * Timestamp of when the entity type was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-entitytype.html#cfn-frauddetector-detector-entitytype-createdtime
         */
        readonly createdTime?: string;
        /**
         * The entity type description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-entitytype.html#cfn-frauddetector-detector-entitytype-description
         */
        readonly description?: string;
        /**
         * Indicates whether the resource is defined within this CloudFormation template and impacts the create, update, and delete behavior of the stack. If the value is `true` , CloudFormation will create/update/delete the resource when creating/updating/deleting the stack. If the value is `false` , CloudFormation will validate that the object exists and then use it within the resource without making changes to the object.
         *
         * For example, when creating `AWS::FraudDetector::Detector` you must define at least two variables. You can set `Inline=true` for these Variables and CloudFormation will create/update/delete the variables as part of stack operations. However, if you set `Inline=false` , CloudFormation will associate the variables to your detector but not execute any changes to the variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-entitytype.html#cfn-frauddetector-detector-entitytype-inline
         */
        readonly inline?: boolean | cdk.IResolvable;
        /**
         * Timestamp of when the entity type was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-entitytype.html#cfn-frauddetector-detector-entitytype-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The entity type name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-entitytype.html#cfn-frauddetector-detector-entitytype-name
         */
        readonly name?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-entitytype.html#cfn-frauddetector-detector-entitytype-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `EntityTypeProperty`
 *
 * @param properties - the TypeScript properties of a `EntityTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnDetector_EntityTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inline', cdk.validateBoolean)(properties.inline));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "EntityTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.EntityType` resource
 *
 * @param properties - the TypeScript properties of a `EntityTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.EntityType` resource.
 */
// @ts-ignore TS6133
function cfnDetectorEntityTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDetector_EntityTypePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        Description: cdk.stringToCloudFormation(properties.description),
        Inline: cdk.booleanToCloudFormation(properties.inline),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDetectorEntityTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.EntityTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.EntityTypeProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inline', 'Inline', properties.Inline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inline) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDetector {
    /**
     * The event type details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html
     */
    export interface EventTypeProperty {
        /**
         * The entity type ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-arn
         */
        readonly arn?: string;
        /**
         * Timestamp of when the event type was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-createdtime
         */
        readonly createdTime?: string;
        /**
         * The event type description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-description
         */
        readonly description?: string;
        /**
         * The event type entity types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-entitytypes
         */
        readonly entityTypes?: Array<CfnDetector.EntityTypeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The event type event variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-eventvariables
         */
        readonly eventVariables?: Array<CfnDetector.EventVariableProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Indicates whether the resource is defined within this CloudFormation template and impacts the create, update, and delete behavior of the stack. If the value is `true` , CloudFormation will create/update/delete the resource when creating/updating/deleting the stack. If the value is `false` , CloudFormation will validate that the object exists and then use it within the resource without making changes to the object.
         *
         * For example, when creating `AWS::FraudDetector::Detector` you must define at least two variables. You can set `Inline=true` for these variables and CloudFormation will create/update/delete the Variables as part of stack operations. However, if you set `Inline=false` , CloudFormation will associate the variables to your detector but not execute any changes to the variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-inline
         */
        readonly inline?: boolean | cdk.IResolvable;
        /**
         * The event type labels.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-labels
         */
        readonly labels?: Array<CfnDetector.LabelProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Timestamp of when the event type was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The event type name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-name
         */
        readonly name?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventtype.html#cfn-frauddetector-detector-eventtype-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `EventTypeProperty`
 *
 * @param properties - the TypeScript properties of a `EventTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnDetector_EventTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('entityTypes', cdk.listValidator(CfnDetector_EntityTypePropertyValidator))(properties.entityTypes));
    errors.collect(cdk.propertyValidator('eventVariables', cdk.listValidator(CfnDetector_EventVariablePropertyValidator))(properties.eventVariables));
    errors.collect(cdk.propertyValidator('inline', cdk.validateBoolean)(properties.inline));
    errors.collect(cdk.propertyValidator('labels', cdk.listValidator(CfnDetector_LabelPropertyValidator))(properties.labels));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "EventTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.EventType` resource
 *
 * @param properties - the TypeScript properties of a `EventTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.EventType` resource.
 */
// @ts-ignore TS6133
function cfnDetectorEventTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDetector_EventTypePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        Description: cdk.stringToCloudFormation(properties.description),
        EntityTypes: cdk.listMapper(cfnDetectorEntityTypePropertyToCloudFormation)(properties.entityTypes),
        EventVariables: cdk.listMapper(cfnDetectorEventVariablePropertyToCloudFormation)(properties.eventVariables),
        Inline: cdk.booleanToCloudFormation(properties.inline),
        Labels: cdk.listMapper(cfnDetectorLabelPropertyToCloudFormation)(properties.labels),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDetectorEventTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.EventTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.EventTypeProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('entityTypes', 'EntityTypes', properties.EntityTypes != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorEntityTypePropertyFromCloudFormation)(properties.EntityTypes) : undefined);
    ret.addPropertyResult('eventVariables', 'EventVariables', properties.EventVariables != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorEventVariablePropertyFromCloudFormation)(properties.EventVariables) : undefined);
    ret.addPropertyResult('inline', 'Inline', properties.Inline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inline) : undefined);
    ret.addPropertyResult('labels', 'Labels', properties.Labels != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorLabelPropertyFromCloudFormation)(properties.Labels) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDetector {
    /**
     * The event type variable for the detector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html
     */
    export interface EventVariableProperty {
        /**
         * The event variable ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-arn
         */
        readonly arn?: string;
        /**
         * Timestamp for when the event variable was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-createdtime
         */
        readonly createdTime?: string;
        /**
         * The data source of the event variable.
         *
         * Valid values: `EVENT | EXTERNAL_MODEL_SCORE`
         *
         * When defining a variable within a detector, you can only use the `EVENT` value for DataSource when the *Inline* property is set to true. If the *Inline* property is set false, you can use either `EVENT` or `MODEL_SCORE` for DataSource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-datasource
         */
        readonly dataSource?: string;
        /**
         * The data type of the event variable.
         *
         * Valid values: `STRING | INTEGER | BOOLEAN | FLOAT`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-datatype
         */
        readonly dataType?: string;
        /**
         * The default value of the event variable. This is required if you are providing the details of your variables instead of the ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-defaultvalue
         */
        readonly defaultValue?: string;
        /**
         * The description of the event variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-description
         */
        readonly description?: string;
        /**
         * Indicates whether the resource is defined within this CloudFormation template and impacts the create, update, and delete behavior of the stack. If the value is `true` , CloudFormation will create/update/delete the resource when creating/updating/deleting the stack. If the value is `false` , CloudFormation will validate that the object exists and then use it within the resource without making changes to the object.
         *
         * For example, when creating `AWS::FraudDetector::Detector` you must define at least two variables. You can set `Inline=true` for these variables and CloudFormation will create/update/delete the variables as part of stack operations. However, if you set `Inline=false` , CloudFormation will associate the variables to your detector but not execute any changes to the variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-inline
         */
        readonly inline?: boolean | cdk.IResolvable;
        /**
         * Timestamp for when the event variable was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The name of the event variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-name
         */
        readonly name?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-tags
         */
        readonly tags?: cdk.CfnTag[];
        /**
         * The type of event variable. For more information, see [Variable types](https://docs.aws.amazon.com/frauddetector/latest/ug/create-a-variable.html#variable-types) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-eventvariable.html#cfn-frauddetector-detector-eventvariable-variabletype
         */
        readonly variableType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EventVariableProperty`
 *
 * @returns the result of the validation.
 */
function CfnDetector_EventVariablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('dataSource', cdk.validateString)(properties.dataSource));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inline', cdk.validateBoolean)(properties.inline));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('variableType', cdk.validateString)(properties.variableType));
    return errors.wrap('supplied properties not correct for "EventVariableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.EventVariable` resource
 *
 * @param properties - the TypeScript properties of a `EventVariableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.EventVariable` resource.
 */
// @ts-ignore TS6133
function cfnDetectorEventVariablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDetector_EventVariablePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        DataSource: cdk.stringToCloudFormation(properties.dataSource),
        DataType: cdk.stringToCloudFormation(properties.dataType),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        Description: cdk.stringToCloudFormation(properties.description),
        Inline: cdk.booleanToCloudFormation(properties.inline),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VariableType: cdk.stringToCloudFormation(properties.variableType),
    };
}

// @ts-ignore TS6133
function CfnDetectorEventVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.EventVariableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.EventVariableProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('dataSource', 'DataSource', properties.DataSource != null ? cfn_parse.FromCloudFormation.getString(properties.DataSource) : undefined);
    ret.addPropertyResult('dataType', 'DataType', properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined);
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inline', 'Inline', properties.Inline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inline) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('variableType', 'VariableType', properties.VariableType != null ? cfn_parse.FromCloudFormation.getString(properties.VariableType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDetector {
    /**
     * The label details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-label.html
     */
    export interface LabelProperty {
        /**
         * The label ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-label.html#cfn-frauddetector-detector-label-arn
         */
        readonly arn?: string;
        /**
         * Timestamp of when the event type was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-label.html#cfn-frauddetector-detector-label-createdtime
         */
        readonly createdTime?: string;
        /**
         * The label description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-label.html#cfn-frauddetector-detector-label-description
         */
        readonly description?: string;
        /**
         * Indicates whether the resource is defined within this CloudFormation template and impacts the create, update, and delete behavior of the stack. If the value is `true` , CloudFormation will create/update/delete the resource when creating/updating/deleting the stack. If the value is `false` , CloudFormation will validate that the object exists and then use it within the resource without making changes to the object.
         *
         * For example, when creating `AWS::FraudDetector::Detector` you must define at least two variables. You can set `Inline=true` for these variables and CloudFormation will create/update/delete the variables as part of stack operations. However, if you set `Inline=false` , CloudFormation will associate the variables to your detector but not execute any changes to the variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-label.html#cfn-frauddetector-detector-label-inline
         */
        readonly inline?: boolean | cdk.IResolvable;
        /**
         * Timestamp of when the label was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-label.html#cfn-frauddetector-detector-label-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The label name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-label.html#cfn-frauddetector-detector-label-name
         */
        readonly name?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-label.html#cfn-frauddetector-detector-label-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `LabelProperty`
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the result of the validation.
 */
function CfnDetector_LabelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inline', cdk.validateBoolean)(properties.inline));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "LabelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.Label` resource
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.Label` resource.
 */
// @ts-ignore TS6133
function cfnDetectorLabelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDetector_LabelPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        Description: cdk.stringToCloudFormation(properties.description),
        Inline: cdk.booleanToCloudFormation(properties.inline),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDetectorLabelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.LabelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.LabelProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inline', 'Inline', properties.Inline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inline) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDetector {
    /**
     * The model.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-model.html
     */
    export interface ModelProperty {
        /**
         * The ARN of the model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-model.html#cfn-frauddetector-detector-model-arn
         */
        readonly arn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ModelProperty`
 *
 * @param properties - the TypeScript properties of a `ModelProperty`
 *
 * @returns the result of the validation.
 */
function CfnDetector_ModelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "ModelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.Model` resource
 *
 * @param properties - the TypeScript properties of a `ModelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.Model` resource.
 */
// @ts-ignore TS6133
function cfnDetectorModelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDetector_ModelPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnDetectorModelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.ModelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.ModelProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDetector {
    /**
     * The outcome.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-outcome.html
     */
    export interface OutcomeProperty {
        /**
         * The outcome ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-outcome.html#cfn-frauddetector-detector-outcome-arn
         */
        readonly arn?: string;
        /**
         * The timestamp when the outcome was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-outcome.html#cfn-frauddetector-detector-outcome-createdtime
         */
        readonly createdTime?: string;
        /**
         * The outcome description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-outcome.html#cfn-frauddetector-detector-outcome-description
         */
        readonly description?: string;
        /**
         * Indicates whether the resource is defined within this CloudFormation template and impacts the create, update, and delete behavior of the stack. If the value is `true` , CloudFormation will create/update/delete the resource when creating/updating/deleting the stack. If the value is `false` , CloudFormation will validate that the object exists and then use it within the resource without making changes to the object.
         *
         * For example, when creating `AWS::FraudDetector::Detector` you must define at least two variables. You can set `Inline=true` for these variables and CloudFormation will create/update/delete the variables as part of stack operations. However, if you set `Inline=false` , CloudFormation will associate the variables to your detector but not execute any changes to the variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-outcome.html#cfn-frauddetector-detector-outcome-inline
         */
        readonly inline?: boolean | cdk.IResolvable;
        /**
         * The timestamp when the outcome was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-outcome.html#cfn-frauddetector-detector-outcome-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The outcome name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-outcome.html#cfn-frauddetector-detector-outcome-name
         */
        readonly name?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-outcome.html#cfn-frauddetector-detector-outcome-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `OutcomeProperty`
 *
 * @param properties - the TypeScript properties of a `OutcomeProperty`
 *
 * @returns the result of the validation.
 */
function CfnDetector_OutcomePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inline', cdk.validateBoolean)(properties.inline));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "OutcomeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.Outcome` resource
 *
 * @param properties - the TypeScript properties of a `OutcomeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.Outcome` resource.
 */
// @ts-ignore TS6133
function cfnDetectorOutcomePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDetector_OutcomePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        Description: cdk.stringToCloudFormation(properties.description),
        Inline: cdk.booleanToCloudFormation(properties.inline),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDetectorOutcomePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.OutcomeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.OutcomeProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inline', 'Inline', properties.Inline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inline) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDetector {
    /**
     * A rule. Rule is a condition that tells Amazon Fraud Detector how to interpret variables values during a fraud prediction.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html
     */
    export interface RuleProperty {
        /**
         * The rule ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-arn
         */
        readonly arn?: string;
        /**
         * Timestamp for when the rule was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-createdtime
         */
        readonly createdTime?: string;
        /**
         * The rule description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-description
         */
        readonly description?: string;
        /**
         * The detector for which the rule is associated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-detectorid
         */
        readonly detectorId?: string;
        /**
         * The rule expression. A rule expression captures the business logic. For more information, see [Rule language reference](https://docs.aws.amazon.com/frauddetector/latest/ug/rule-language-reference.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-expression
         */
        readonly expression?: string;
        /**
         * The rule language.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-language
         */
        readonly language?: string;
        /**
         * Timestamp for when the rule was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The rule outcome.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-outcomes
         */
        readonly outcomes?: Array<CfnDetector.OutcomeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The rule ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-ruleid
         */
        readonly ruleId?: string;
        /**
         * The rule version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-ruleversion
         */
        readonly ruleVersion?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-detector-rule.html#cfn-frauddetector-detector-rule-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnDetector_RulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('detectorId', cdk.validateString)(properties.detectorId));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('language', cdk.validateString)(properties.language));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('outcomes', cdk.listValidator(CfnDetector_OutcomePropertyValidator))(properties.outcomes));
    errors.collect(cdk.propertyValidator('ruleId', cdk.validateString)(properties.ruleId));
    errors.collect(cdk.propertyValidator('ruleVersion', cdk.validateString)(properties.ruleVersion));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "RuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.Rule` resource
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Detector.Rule` resource.
 */
// @ts-ignore TS6133
function cfnDetectorRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDetector_RulePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        Description: cdk.stringToCloudFormation(properties.description),
        DetectorId: cdk.stringToCloudFormation(properties.detectorId),
        Expression: cdk.stringToCloudFormation(properties.expression),
        Language: cdk.stringToCloudFormation(properties.language),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Outcomes: cdk.listMapper(cfnDetectorOutcomePropertyToCloudFormation)(properties.outcomes),
        RuleId: cdk.stringToCloudFormation(properties.ruleId),
        RuleVersion: cdk.stringToCloudFormation(properties.ruleVersion),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDetectorRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.RuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.RuleProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('detectorId', 'DetectorId', properties.DetectorId != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorId) : undefined);
    ret.addPropertyResult('expression', 'Expression', properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined);
    ret.addPropertyResult('language', 'Language', properties.Language != null ? cfn_parse.FromCloudFormation.getString(properties.Language) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('outcomes', 'Outcomes', properties.Outcomes != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorOutcomePropertyFromCloudFormation)(properties.Outcomes) : undefined);
    ret.addPropertyResult('ruleId', 'RuleId', properties.RuleId != null ? cfn_parse.FromCloudFormation.getString(properties.RuleId) : undefined);
    ret.addPropertyResult('ruleVersion', 'RuleVersion', properties.RuleVersion != null ? cfn_parse.FromCloudFormation.getString(properties.RuleVersion) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEntityType`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-entitytype.html
 */
export interface CfnEntityTypeProps {

    /**
     * The entity type name.
     *
     * Pattern: `^[0-9a-z_-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-entitytype.html#cfn-frauddetector-entitytype-name
     */
    readonly name: string;

    /**
     * The entity type description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-entitytype.html#cfn-frauddetector-entitytype-description
     */
    readonly description?: string;

    /**
     * A key and value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-entitytype.html#cfn-frauddetector-entitytype-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnEntityTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnEntityTypeProps`
 *
 * @returns the result of the validation.
 */
function CfnEntityTypePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnEntityTypeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::EntityType` resource
 *
 * @param properties - the TypeScript properties of a `CfnEntityTypeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::EntityType` resource.
 */
// @ts-ignore TS6133
function cfnEntityTypePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEntityTypePropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEntityTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntityTypeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntityTypeProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FraudDetector::EntityType`
 *
 * Manages an entity type. An entity represents who is performing the event. As part of a fraud prediction, you pass the entity ID to indicate the specific entity who performed the event. An entity type classifies the entity. Example classifications include customer, merchant, or account.
 *
 * @cloudformationResource AWS::FraudDetector::EntityType
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-entitytype.html
 */
export class CfnEntityType extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FraudDetector::EntityType";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEntityType {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEntityTypePropsFromCloudFormation(resourceProperties);
        const ret = new CfnEntityType(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The entity type ARN.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Timestamp of when entity type was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * Timestamp of when entity type was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     * The entity type name.
     *
     * Pattern: `^[0-9a-z_-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-entitytype.html#cfn-frauddetector-entitytype-name
     */
    public name: string;

    /**
     * The entity type description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-entitytype.html#cfn-frauddetector-entitytype-description
     */
    public description: string | undefined;

    /**
     * A key and value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-entitytype.html#cfn-frauddetector-entitytype-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::FraudDetector::EntityType`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEntityTypeProps) {
        super(scope, id, { type: CfnEntityType.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FraudDetector::EntityType", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEntityType.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEntityTypePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnEventType`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html
 */
export interface CfnEventTypeProps {

    /**
     * The event type entity types.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-entitytypes
     */
    readonly entityTypes: Array<CfnEventType.EntityTypeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The event type event variables.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-eventvariables
     */
    readonly eventVariables: Array<CfnEventType.EventVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The event type labels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-labels
     */
    readonly labels: Array<CfnEventType.LabelProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The event type name.
     *
     * Pattern : `^[0-9a-z_-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-name
     */
    readonly name: string;

    /**
     * The event type description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnEventTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventTypeProps`
 *
 * @returns the result of the validation.
 */
function CfnEventTypePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('entityTypes', cdk.requiredValidator)(properties.entityTypes));
    errors.collect(cdk.propertyValidator('entityTypes', cdk.listValidator(CfnEventType_EntityTypePropertyValidator))(properties.entityTypes));
    errors.collect(cdk.propertyValidator('eventVariables', cdk.requiredValidator)(properties.eventVariables));
    errors.collect(cdk.propertyValidator('eventVariables', cdk.listValidator(CfnEventType_EventVariablePropertyValidator))(properties.eventVariables));
    errors.collect(cdk.propertyValidator('labels', cdk.requiredValidator)(properties.labels));
    errors.collect(cdk.propertyValidator('labels', cdk.listValidator(CfnEventType_LabelPropertyValidator))(properties.labels));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnEventTypeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::EventType` resource
 *
 * @param properties - the TypeScript properties of a `CfnEventTypeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::EventType` resource.
 */
// @ts-ignore TS6133
function cfnEventTypePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventTypePropsValidator(properties).assertSuccess();
    return {
        EntityTypes: cdk.listMapper(cfnEventTypeEntityTypePropertyToCloudFormation)(properties.entityTypes),
        EventVariables: cdk.listMapper(cfnEventTypeEventVariablePropertyToCloudFormation)(properties.eventVariables),
        Labels: cdk.listMapper(cfnEventTypeLabelPropertyToCloudFormation)(properties.labels),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEventTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventTypeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventTypeProps>();
    ret.addPropertyResult('entityTypes', 'EntityTypes', cfn_parse.FromCloudFormation.getArray(CfnEventTypeEntityTypePropertyFromCloudFormation)(properties.EntityTypes));
    ret.addPropertyResult('eventVariables', 'EventVariables', cfn_parse.FromCloudFormation.getArray(CfnEventTypeEventVariablePropertyFromCloudFormation)(properties.EventVariables));
    ret.addPropertyResult('labels', 'Labels', cfn_parse.FromCloudFormation.getArray(CfnEventTypeLabelPropertyFromCloudFormation)(properties.Labels));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FraudDetector::EventType`
 *
 * Manages an event type. An event is a business activity that is evaluated for fraud risk. With Amazon Fraud Detector, you generate fraud predictions for events. An event type defines the structure for an event sent to Amazon Fraud Detector. This includes the variables sent as part of the event, the entity performing the event (such as a customer), and the labels that classify the event. Example event types include online payment transactions, account registrations, and authentications.
 *
 * @cloudformationResource AWS::FraudDetector::EventType
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html
 */
export class CfnEventType extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FraudDetector::EventType";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventType {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEventTypePropsFromCloudFormation(resourceProperties);
        const ret = new CfnEventType(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The event type ARN.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Timestamp of when event type was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * Timestamp of when event type was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     * The event type entity types.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-entitytypes
     */
    public entityTypes: Array<CfnEventType.EntityTypeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The event type event variables.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-eventvariables
     */
    public eventVariables: Array<CfnEventType.EventVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The event type labels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-labels
     */
    public labels: Array<CfnEventType.LabelProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The event type name.
     *
     * Pattern : `^[0-9a-z_-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-name
     */
    public name: string;

    /**
     * The event type description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-eventtype.html#cfn-frauddetector-eventtype-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::FraudDetector::EventType`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEventTypeProps) {
        super(scope, id, { type: CfnEventType.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'entityTypes', this);
        cdk.requireProperty(props, 'eventVariables', this);
        cdk.requireProperty(props, 'labels', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));

        this.entityTypes = props.entityTypes;
        this.eventVariables = props.eventVariables;
        this.labels = props.labels;
        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FraudDetector::EventType", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventType.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            entityTypes: this.entityTypes,
            eventVariables: this.eventVariables,
            labels: this.labels,
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEventTypePropsToCloudFormation(props);
    }
}

export namespace CfnEventType {
    /**
     * The entity type details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-entitytype.html
     */
    export interface EntityTypeProperty {
        /**
         * The entity type ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-entitytype.html#cfn-frauddetector-eventtype-entitytype-arn
         */
        readonly arn?: string;
        /**
         * Timestamp of when the entity type was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-entitytype.html#cfn-frauddetector-eventtype-entitytype-createdtime
         */
        readonly createdTime?: string;
        /**
         * The entity type description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-entitytype.html#cfn-frauddetector-eventtype-entitytype-description
         */
        readonly description?: string;
        /**
         * Indicates whether the resource is defined within this CloudFormation template and impacts the create, update, and delete behavior of the stack. If the value is `true` , CloudFormation will create/update/delete the resource when creating/updating/deleting the stack. If the value is `false` , CloudFormation will validate that the object exists and then use it within the resource without making changes to the object.
         *
         * For example, when creating `AWS::FraudDetector::EventType` you must define at least two variables. You can set `Inline=true` for these variables and CloudFormation will create/update/delete the variables as part of stack operations. However, if you set `Inline=false` , CloudFormation will associate the variables to your event type but not execute any changes to the variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-entitytype.html#cfn-frauddetector-eventtype-entitytype-inline
         */
        readonly inline?: boolean | cdk.IResolvable;
        /**
         * Timestamp of when the entity type was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-entitytype.html#cfn-frauddetector-eventtype-entitytype-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The entity type name.
         *
         * `^[0-9a-z_-]+$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-entitytype.html#cfn-frauddetector-eventtype-entitytype-name
         */
        readonly name?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-entitytype.html#cfn-frauddetector-eventtype-entitytype-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `EntityTypeProperty`
 *
 * @param properties - the TypeScript properties of a `EntityTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventType_EntityTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inline', cdk.validateBoolean)(properties.inline));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "EntityTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::EventType.EntityType` resource
 *
 * @param properties - the TypeScript properties of a `EntityTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::EventType.EntityType` resource.
 */
// @ts-ignore TS6133
function cfnEventTypeEntityTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventType_EntityTypePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        Description: cdk.stringToCloudFormation(properties.description),
        Inline: cdk.booleanToCloudFormation(properties.inline),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEventTypeEntityTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventType.EntityTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventType.EntityTypeProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inline', 'Inline', properties.Inline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inline) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventType {
    /**
     * The variables associated with this event type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html
     */
    export interface EventVariableProperty {
        /**
         * The event variable ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-arn
         */
        readonly arn?: string;
        /**
         * Timestamp for when event variable was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-createdtime
         */
        readonly createdTime?: string;
        /**
         * The source of the event variable.
         *
         * Valid values: `EVENT | EXTERNAL_MODEL_SCORE`
         *
         * When defining a variable within a event type, you can only use the `EVENT` value for DataSource when the *Inline* property is set to true. If the *Inline* property is set false, you can use either `EVENT` or `MODEL_SCORE` for DataSource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-datasource
         */
        readonly dataSource?: string;
        /**
         * The data type of the event variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-datatype
         */
        readonly dataType?: string;
        /**
         * The default value of the event variable
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-defaultvalue
         */
        readonly defaultValue?: string;
        /**
         * The event variable description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-description
         */
        readonly description?: string;
        /**
         * Indicates whether the resource is defined within this CloudFormation template and impacts the create, update, and delete behavior of the stack. If the value is `true` , CloudFormation will create/update/delete the resource when creating/updating/deleting the stack. If the value is `false` , CloudFormation will validate that the object exists and then use it within the resource without making changes to the object.
         *
         * For example, when creating `AWS::FraudDetector::EventType` you must define at least two variables. You can set `Inline=true` for these variables and CloudFormation will create/update/delete the Variables as part of stack operations. However, if you set `Inline=false` , CloudFormation will associate the variables to your event type but not execute any changes to the variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-inline
         */
        readonly inline?: boolean | cdk.IResolvable;
        /**
         * Timestamp for when the event variable was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The name of the event variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-name
         */
        readonly name?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-tags
         */
        readonly tags?: cdk.CfnTag[];
        /**
         * The type of event variable. For more information, see [Variable types](https://docs.aws.amazon.com/frauddetector/latest/ug/create-a-variable.html#variable-types) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-eventvariable.html#cfn-frauddetector-eventtype-eventvariable-variabletype
         */
        readonly variableType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EventVariableProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventType_EventVariablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('dataSource', cdk.validateString)(properties.dataSource));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inline', cdk.validateBoolean)(properties.inline));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('variableType', cdk.validateString)(properties.variableType));
    return errors.wrap('supplied properties not correct for "EventVariableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::EventType.EventVariable` resource
 *
 * @param properties - the TypeScript properties of a `EventVariableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::EventType.EventVariable` resource.
 */
// @ts-ignore TS6133
function cfnEventTypeEventVariablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventType_EventVariablePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        DataSource: cdk.stringToCloudFormation(properties.dataSource),
        DataType: cdk.stringToCloudFormation(properties.dataType),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        Description: cdk.stringToCloudFormation(properties.description),
        Inline: cdk.booleanToCloudFormation(properties.inline),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VariableType: cdk.stringToCloudFormation(properties.variableType),
    };
}

// @ts-ignore TS6133
function CfnEventTypeEventVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventType.EventVariableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventType.EventVariableProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('dataSource', 'DataSource', properties.DataSource != null ? cfn_parse.FromCloudFormation.getString(properties.DataSource) : undefined);
    ret.addPropertyResult('dataType', 'DataType', properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined);
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inline', 'Inline', properties.Inline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inline) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('variableType', 'VariableType', properties.VariableType != null ? cfn_parse.FromCloudFormation.getString(properties.VariableType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventType {
    /**
     * The label associated with the event type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-label.html
     */
    export interface LabelProperty {
        /**
         * The label ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-label.html#cfn-frauddetector-eventtype-label-arn
         */
        readonly arn?: string;
        /**
         * Timestamp of when the event type was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-label.html#cfn-frauddetector-eventtype-label-createdtime
         */
        readonly createdTime?: string;
        /**
         * The label description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-label.html#cfn-frauddetector-eventtype-label-description
         */
        readonly description?: string;
        /**
         * Indicates whether the resource is defined within this CloudFormation template and impacts the create, update, and delete behavior of the stack. If the value is `true` , CloudFormation will create/update/delete the resource when creating/updating/deleting the stack. If the value is `false` , CloudFormation will validate that the object exists and then use it within the resource without making changes to the object.
         *
         * For example, when creating `AWS::FraudDetector::EventType` you must define at least two variables. You can set `Inline=true` for these variables and CloudFormation will create/update/delete the variables as part of stack operations. However, if you set `Inline=false` , CloudFormation will associate the variables to your EventType but not execute any changes to the variables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-label.html#cfn-frauddetector-eventtype-label-inline
         */
        readonly inline?: boolean | cdk.IResolvable;
        /**
         * Timestamp of when the label was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-label.html#cfn-frauddetector-eventtype-label-lastupdatedtime
         */
        readonly lastUpdatedTime?: string;
        /**
         * The label name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-label.html#cfn-frauddetector-eventtype-label-name
         */
        readonly name?: string;
        /**
         * An array of key-value pairs to apply to this resource.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-frauddetector-eventtype-label.html#cfn-frauddetector-eventtype-label-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `LabelProperty`
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventType_LabelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('createdTime', cdk.validateString)(properties.createdTime));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('inline', cdk.validateBoolean)(properties.inline));
    errors.collect(cdk.propertyValidator('lastUpdatedTime', cdk.validateString)(properties.lastUpdatedTime));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "LabelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::EventType.Label` resource
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::EventType.Label` resource.
 */
// @ts-ignore TS6133
function cfnEventTypeLabelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventType_LabelPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        CreatedTime: cdk.stringToCloudFormation(properties.createdTime),
        Description: cdk.stringToCloudFormation(properties.description),
        Inline: cdk.booleanToCloudFormation(properties.inline),
        LastUpdatedTime: cdk.stringToCloudFormation(properties.lastUpdatedTime),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEventTypeLabelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventType.LabelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventType.LabelProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('createdTime', 'CreatedTime', properties.CreatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedTime) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('inline', 'Inline', properties.Inline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Inline) : undefined);
    ret.addPropertyResult('lastUpdatedTime', 'LastUpdatedTime', properties.LastUpdatedTime != null ? cfn_parse.FromCloudFormation.getString(properties.LastUpdatedTime) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLabel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-label.html
 */
export interface CfnLabelProps {

    /**
     * The label name.
     *
     * Pattern: `^[0-9a-z_-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-label.html#cfn-frauddetector-label-name
     */
    readonly name: string;

    /**
     * The label description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-label.html#cfn-frauddetector-label-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-label.html#cfn-frauddetector-label-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLabelProps`
 *
 * @param properties - the TypeScript properties of a `CfnLabelProps`
 *
 * @returns the result of the validation.
 */
function CfnLabelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLabelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Label` resource
 *
 * @param properties - the TypeScript properties of a `CfnLabelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Label` resource.
 */
// @ts-ignore TS6133
function cfnLabelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLabelPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLabelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLabelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLabelProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FraudDetector::Label`
 *
 * Creates or updates label. A label classifies an event as fraudulent or legitimate. Labels are associated with event types and used to train supervised machine learning models in Amazon Fraud Detector.
 *
 * @cloudformationResource AWS::FraudDetector::Label
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-label.html
 */
export class CfnLabel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FraudDetector::Label";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLabel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLabelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLabel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the label.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Timestamp of when label was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * Timestamp of when label was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     * The label name.
     *
     * Pattern: `^[0-9a-z_-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-label.html#cfn-frauddetector-label-name
     */
    public name: string;

    /**
     * The label description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-label.html#cfn-frauddetector-label-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-label.html#cfn-frauddetector-label-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::FraudDetector::Label`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLabelProps) {
        super(scope, id, { type: CfnLabel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FraudDetector::Label", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLabel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLabelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnOutcome`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-outcome.html
 */
export interface CfnOutcomeProps {

    /**
     * The outcome name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-outcome.html#cfn-frauddetector-outcome-name
     */
    readonly name: string;

    /**
     * The outcome description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-outcome.html#cfn-frauddetector-outcome-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-outcome.html#cfn-frauddetector-outcome-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnOutcomeProps`
 *
 * @param properties - the TypeScript properties of a `CfnOutcomeProps`
 *
 * @returns the result of the validation.
 */
function CfnOutcomePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnOutcomeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Outcome` resource
 *
 * @param properties - the TypeScript properties of a `CfnOutcomeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Outcome` resource.
 */
// @ts-ignore TS6133
function cfnOutcomePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnOutcomePropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnOutcomePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOutcomeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOutcomeProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FraudDetector::Outcome`
 *
 * Creates or updates an outcome.
 *
 * @cloudformationResource AWS::FraudDetector::Outcome
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-outcome.html
 */
export class CfnOutcome extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FraudDetector::Outcome";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOutcome {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnOutcomePropsFromCloudFormation(resourceProperties);
        const ret = new CfnOutcome(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the outcome.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Timestamp of when outcome was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * Timestamp of when outcome was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     * The outcome name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-outcome.html#cfn-frauddetector-outcome-name
     */
    public name: string;

    /**
     * The outcome description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-outcome.html#cfn-frauddetector-outcome-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-outcome.html#cfn-frauddetector-outcome-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::FraudDetector::Outcome`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnOutcomeProps) {
        super(scope, id, { type: CfnOutcome.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FraudDetector::Outcome", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnOutcome.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnOutcomePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnVariable`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html
 */
export interface CfnVariableProps {

    /**
     * The data source of the variable.
     *
     * Valid values: `EVENT | EXTERNAL_MODEL_SCORE`
     *
     * When defining a variable within a detector, you can only use the `EVENT` value for DataSource when the *Inline* property is set to true. If the *Inline* property is set false, you can use either `EVENT` or `MODEL_SCORE` for DataSource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-datasource
     */
    readonly dataSource: string;

    /**
     * The data type of the variable.
     *
     * Valid data types: `STRING | INTEGER | BOOLEAN | FLOAT`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-datatype
     */
    readonly dataType: string;

    /**
     * The default value of the variable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-defaultvalue
     */
    readonly defaultValue: string;

    /**
     * The name of the variable.
     *
     * Pattern: `^[0-9a-z_-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-name
     */
    readonly name: string;

    /**
     * The description of the variable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The type of the variable. For more information see [Variable types](https://docs.aws.amazon.com/frauddetector/latest/ug/create-a-variable.html#variable-types) .
     *
     * Valid Values: `AUTH_CODE | AVS | BILLING_ADDRESS_L1 | BILLING_ADDRESS_L2 | BILLING_CITY | BILLING_COUNTRY | BILLING_NAME | BILLING_PHONE | BILLING_STATE | BILLING_ZIP | CARD_BIN | CATEGORICAL | CURRENCY_CODE | EMAIL_ADDRESS | FINGERPRINT | FRAUD_LABEL | FREE_FORM_TEXT | IP_ADDRESS | NUMERIC | ORDER_ID | PAYMENT_TYPE | PHONE_NUMBER | PRICE | PRODUCT_CATEGORY | SHIPPING_ADDRESS_L1 | SHIPPING_ADDRESS_L2 | SHIPPING_CITY | SHIPPING_COUNTRY | SHIPPING_NAME | SHIPPING_PHONE | SHIPPING_STATE | SHIPPING_ZIP | USERAGENT`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-variabletype
     */
    readonly variableType?: string;
}

/**
 * Determine whether the given properties match those of a `CfnVariableProps`
 *
 * @param properties - the TypeScript properties of a `CfnVariableProps`
 *
 * @returns the result of the validation.
 */
function CfnVariablePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataSource', cdk.requiredValidator)(properties.dataSource));
    errors.collect(cdk.propertyValidator('dataSource', cdk.validateString)(properties.dataSource));
    errors.collect(cdk.propertyValidator('dataType', cdk.requiredValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.requiredValidator)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('variableType', cdk.validateString)(properties.variableType));
    return errors.wrap('supplied properties not correct for "CfnVariableProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FraudDetector::Variable` resource
 *
 * @param properties - the TypeScript properties of a `CfnVariableProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FraudDetector::Variable` resource.
 */
// @ts-ignore TS6133
function cfnVariablePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVariablePropsValidator(properties).assertSuccess();
    return {
        DataSource: cdk.stringToCloudFormation(properties.dataSource),
        DataType: cdk.stringToCloudFormation(properties.dataType),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VariableType: cdk.stringToCloudFormation(properties.variableType),
    };
}

// @ts-ignore TS6133
function CfnVariablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVariableProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVariableProps>();
    ret.addPropertyResult('dataSource', 'DataSource', cfn_parse.FromCloudFormation.getString(properties.DataSource));
    ret.addPropertyResult('dataType', 'DataType', cfn_parse.FromCloudFormation.getString(properties.DataType));
    ret.addPropertyResult('defaultValue', 'DefaultValue', cfn_parse.FromCloudFormation.getString(properties.DefaultValue));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('variableType', 'VariableType', properties.VariableType != null ? cfn_parse.FromCloudFormation.getString(properties.VariableType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FraudDetector::Variable`
 *
 * Manages a variable.
 *
 * @cloudformationResource AWS::FraudDetector::Variable
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html
 */
export class CfnVariable extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FraudDetector::Variable";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVariable {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVariablePropsFromCloudFormation(resourceProperties);
        const ret = new CfnVariable(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the variable.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Timestamp of when variable was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * Timestamp of when variable was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    public readonly attrLastUpdatedTime: string;

    /**
     * The data source of the variable.
     *
     * Valid values: `EVENT | EXTERNAL_MODEL_SCORE`
     *
     * When defining a variable within a detector, you can only use the `EVENT` value for DataSource when the *Inline* property is set to true. If the *Inline* property is set false, you can use either `EVENT` or `MODEL_SCORE` for DataSource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-datasource
     */
    public dataSource: string;

    /**
     * The data type of the variable.
     *
     * Valid data types: `STRING | INTEGER | BOOLEAN | FLOAT`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-datatype
     */
    public dataType: string;

    /**
     * The default value of the variable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-defaultvalue
     */
    public defaultValue: string;

    /**
     * The name of the variable.
     *
     * Pattern: `^[0-9a-z_-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-name
     */
    public name: string;

    /**
     * The description of the variable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The type of the variable. For more information see [Variable types](https://docs.aws.amazon.com/frauddetector/latest/ug/create-a-variable.html#variable-types) .
     *
     * Valid Values: `AUTH_CODE | AVS | BILLING_ADDRESS_L1 | BILLING_ADDRESS_L2 | BILLING_CITY | BILLING_COUNTRY | BILLING_NAME | BILLING_PHONE | BILLING_STATE | BILLING_ZIP | CARD_BIN | CATEGORICAL | CURRENCY_CODE | EMAIL_ADDRESS | FINGERPRINT | FRAUD_LABEL | FREE_FORM_TEXT | IP_ADDRESS | NUMERIC | ORDER_ID | PAYMENT_TYPE | PHONE_NUMBER | PRICE | PRODUCT_CATEGORY | SHIPPING_ADDRESS_L1 | SHIPPING_ADDRESS_L2 | SHIPPING_CITY | SHIPPING_COUNTRY | SHIPPING_NAME | SHIPPING_PHONE | SHIPPING_STATE | SHIPPING_ZIP | USERAGENT`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-frauddetector-variable.html#cfn-frauddetector-variable-variabletype
     */
    public variableType: string | undefined;

    /**
     * Create a new `AWS::FraudDetector::Variable`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVariableProps) {
        super(scope, id, { type: CfnVariable.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dataSource', this);
        cdk.requireProperty(props, 'dataType', this);
        cdk.requireProperty(props, 'defaultValue', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedTime = cdk.Token.asString(this.getAtt('LastUpdatedTime', cdk.ResolutionTypeHint.STRING));

        this.dataSource = props.dataSource;
        this.dataType = props.dataType;
        this.defaultValue = props.defaultValue;
        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FraudDetector::Variable", props.tags, { tagPropertyName: 'tags' });
        this.variableType = props.variableType;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVariable.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dataSource: this.dataSource,
            dataType: this.dataType,
            defaultValue: this.defaultValue,
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
            variableType: this.variableType,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVariablePropsToCloudFormation(props);
    }
}
