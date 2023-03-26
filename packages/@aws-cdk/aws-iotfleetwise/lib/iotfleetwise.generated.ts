// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:40.002Z","fingerprint":"0BCmtM9xgpg8N6dFgc4lDY+CC/kQ686uIxJNg+h/fro="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCampaign`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html
 */
export interface CfnCampaignProps {

    /**
     * `AWS::IoTFleetWise::Campaign.Action`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-action
     */
    readonly action: string;

    /**
     * `AWS::IoTFleetWise::Campaign.CollectionScheme`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-collectionscheme
     */
    readonly collectionScheme: CfnCampaign.CollectionSchemeProperty | cdk.IResolvable;

    /**
     * The name of a campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-name
     */
    readonly name: string;

    /**
     * The ARN of the signal catalog associated with the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalcatalogarn
     */
    readonly signalCatalogArn: string;

    /**
     * The ARN of a vehicle or fleet to which the campaign is deployed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-targetarn
     */
    readonly targetArn: string;

    /**
     * `AWS::IoTFleetWise::Campaign.Compression`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-compression
     */
    readonly compression?: string;

    /**
     * `AWS::IoTFleetWise::Campaign.DataExtraDimensions`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-dataextradimensions
     */
    readonly dataExtraDimensions?: string[];

    /**
     * The description of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-description
     */
    readonly description?: string;

    /**
     * `AWS::IoTFleetWise::Campaign.DiagnosticsMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-diagnosticsmode
     */
    readonly diagnosticsMode?: string;

    /**
     * `AWS::IoTFleetWise::Campaign.ExpiryTime`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-expirytime
     */
    readonly expiryTime?: string;

    /**
     * `AWS::IoTFleetWise::Campaign.PostTriggerCollectionDuration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-posttriggercollectionduration
     */
    readonly postTriggerCollectionDuration?: number;

    /**
     * `AWS::IoTFleetWise::Campaign.Priority`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-priority
     */
    readonly priority?: number;

    /**
     * `AWS::IoTFleetWise::Campaign.SignalsToCollect`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalstocollect
     */
    readonly signalsToCollect?: Array<CfnCampaign.SignalInformationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `AWS::IoTFleetWise::Campaign.SpoolingMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-spoolingmode
     */
    readonly spoolingMode?: string;

    /**
     * `AWS::IoTFleetWise::Campaign.StartTime`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-starttime
     */
    readonly startTime?: string;

    /**
     * `AWS::IoTFleetWise::Campaign.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnCampaignProps`
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the result of the validation.
 */
function CfnCampaignPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('collectionScheme', cdk.requiredValidator)(properties.collectionScheme));
    errors.collect(cdk.propertyValidator('collectionScheme', CfnCampaign_CollectionSchemePropertyValidator)(properties.collectionScheme));
    errors.collect(cdk.propertyValidator('compression', cdk.validateString)(properties.compression));
    errors.collect(cdk.propertyValidator('dataExtraDimensions', cdk.listValidator(cdk.validateString))(properties.dataExtraDimensions));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('diagnosticsMode', cdk.validateString)(properties.diagnosticsMode));
    errors.collect(cdk.propertyValidator('expiryTime', cdk.validateString)(properties.expiryTime));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('postTriggerCollectionDuration', cdk.validateNumber)(properties.postTriggerCollectionDuration));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('signalCatalogArn', cdk.requiredValidator)(properties.signalCatalogArn));
    errors.collect(cdk.propertyValidator('signalCatalogArn', cdk.validateString)(properties.signalCatalogArn));
    errors.collect(cdk.propertyValidator('signalsToCollect', cdk.listValidator(CfnCampaign_SignalInformationPropertyValidator))(properties.signalsToCollect));
    errors.collect(cdk.propertyValidator('spoolingMode', cdk.validateString)(properties.spoolingMode));
    errors.collect(cdk.propertyValidator('startTime', cdk.validateString)(properties.startTime));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('targetArn', cdk.requiredValidator)(properties.targetArn));
    errors.collect(cdk.propertyValidator('targetArn', cdk.validateString)(properties.targetArn));
    return errors.wrap('supplied properties not correct for "CfnCampaignProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign` resource
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign` resource.
 */
// @ts-ignore TS6133
function cfnCampaignPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaignPropsValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        CollectionScheme: cfnCampaignCollectionSchemePropertyToCloudFormation(properties.collectionScheme),
        Name: cdk.stringToCloudFormation(properties.name),
        SignalCatalogArn: cdk.stringToCloudFormation(properties.signalCatalogArn),
        TargetArn: cdk.stringToCloudFormation(properties.targetArn),
        Compression: cdk.stringToCloudFormation(properties.compression),
        DataExtraDimensions: cdk.listMapper(cdk.stringToCloudFormation)(properties.dataExtraDimensions),
        Description: cdk.stringToCloudFormation(properties.description),
        DiagnosticsMode: cdk.stringToCloudFormation(properties.diagnosticsMode),
        ExpiryTime: cdk.stringToCloudFormation(properties.expiryTime),
        PostTriggerCollectionDuration: cdk.numberToCloudFormation(properties.postTriggerCollectionDuration),
        Priority: cdk.numberToCloudFormation(properties.priority),
        SignalsToCollect: cdk.listMapper(cfnCampaignSignalInformationPropertyToCloudFormation)(properties.signalsToCollect),
        SpoolingMode: cdk.stringToCloudFormation(properties.spoolingMode),
        StartTime: cdk.stringToCloudFormation(properties.startTime),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCampaignPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaignProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaignProps>();
    ret.addPropertyResult('action', 'Action', cfn_parse.FromCloudFormation.getString(properties.Action));
    ret.addPropertyResult('collectionScheme', 'CollectionScheme', CfnCampaignCollectionSchemePropertyFromCloudFormation(properties.CollectionScheme));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('signalCatalogArn', 'SignalCatalogArn', cfn_parse.FromCloudFormation.getString(properties.SignalCatalogArn));
    ret.addPropertyResult('targetArn', 'TargetArn', cfn_parse.FromCloudFormation.getString(properties.TargetArn));
    ret.addPropertyResult('compression', 'Compression', properties.Compression != null ? cfn_parse.FromCloudFormation.getString(properties.Compression) : undefined);
    ret.addPropertyResult('dataExtraDimensions', 'DataExtraDimensions', properties.DataExtraDimensions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DataExtraDimensions) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('diagnosticsMode', 'DiagnosticsMode', properties.DiagnosticsMode != null ? cfn_parse.FromCloudFormation.getString(properties.DiagnosticsMode) : undefined);
    ret.addPropertyResult('expiryTime', 'ExpiryTime', properties.ExpiryTime != null ? cfn_parse.FromCloudFormation.getString(properties.ExpiryTime) : undefined);
    ret.addPropertyResult('postTriggerCollectionDuration', 'PostTriggerCollectionDuration', properties.PostTriggerCollectionDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.PostTriggerCollectionDuration) : undefined);
    ret.addPropertyResult('priority', 'Priority', properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined);
    ret.addPropertyResult('signalsToCollect', 'SignalsToCollect', properties.SignalsToCollect != null ? cfn_parse.FromCloudFormation.getArray(CfnCampaignSignalInformationPropertyFromCloudFormation)(properties.SignalsToCollect) : undefined);
    ret.addPropertyResult('spoolingMode', 'SpoolingMode', properties.SpoolingMode != null ? cfn_parse.FromCloudFormation.getString(properties.SpoolingMode) : undefined);
    ret.addPropertyResult('startTime', 'StartTime', properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTFleetWise::Campaign`
 *
 * Creates an orchestration of data collection rules. The AWS IoT FleetWise Edge Agent software running in vehicles uses campaigns to decide how to collect and transfer data to the cloud. You create campaigns in the cloud. After you or your team approve campaigns, AWS IoT FleetWise automatically deploys them to vehicles.
 *
 * For more information, see [Collect and transfer data with campaigns](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/campaigns.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Campaign
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html
 */
export class CfnCampaign extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::Campaign";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCampaign {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCampaignPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCampaign(scope, id, propsResult.value);
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
     *
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    public readonly attrLastModificationTime: string;

    /**
     *
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * `AWS::IoTFleetWise::Campaign.Action`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-action
     */
    public action: string;

    /**
     * `AWS::IoTFleetWise::Campaign.CollectionScheme`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-collectionscheme
     */
    public collectionScheme: CfnCampaign.CollectionSchemeProperty | cdk.IResolvable;

    /**
     * The name of a campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-name
     */
    public name: string;

    /**
     * The ARN of the signal catalog associated with the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalcatalogarn
     */
    public signalCatalogArn: string;

    /**
     * The ARN of a vehicle or fleet to which the campaign is deployed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-targetarn
     */
    public targetArn: string;

    /**
     * `AWS::IoTFleetWise::Campaign.Compression`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-compression
     */
    public compression: string | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.DataExtraDimensions`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-dataextradimensions
     */
    public dataExtraDimensions: string[] | undefined;

    /**
     * The description of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-description
     */
    public description: string | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.DiagnosticsMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-diagnosticsmode
     */
    public diagnosticsMode: string | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.ExpiryTime`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-expirytime
     */
    public expiryTime: string | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.PostTriggerCollectionDuration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-posttriggercollectionduration
     */
    public postTriggerCollectionDuration: number | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.Priority`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-priority
     */
    public priority: number | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.SignalsToCollect`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-signalstocollect
     */
    public signalsToCollect: Array<CfnCampaign.SignalInformationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.SpoolingMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-spoolingmode
     */
    public spoolingMode: string | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.StartTime`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-starttime
     */
    public startTime: string | undefined;

    /**
     * `AWS::IoTFleetWise::Campaign.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-campaign.html#cfn-iotfleetwise-campaign-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTFleetWise::Campaign`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCampaignProps) {
        super(scope, id, { type: CfnCampaign.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'action', this);
        cdk.requireProperty(props, 'collectionScheme', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'signalCatalogArn', this);
        cdk.requireProperty(props, 'targetArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastModificationTime = cdk.Token.asString(this.getAtt('LastModificationTime', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.action = props.action;
        this.collectionScheme = props.collectionScheme;
        this.name = props.name;
        this.signalCatalogArn = props.signalCatalogArn;
        this.targetArn = props.targetArn;
        this.compression = props.compression;
        this.dataExtraDimensions = props.dataExtraDimensions;
        this.description = props.description;
        this.diagnosticsMode = props.diagnosticsMode;
        this.expiryTime = props.expiryTime;
        this.postTriggerCollectionDuration = props.postTriggerCollectionDuration;
        this.priority = props.priority;
        this.signalsToCollect = props.signalsToCollect;
        this.spoolingMode = props.spoolingMode;
        this.startTime = props.startTime;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::Campaign", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCampaign.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            action: this.action,
            collectionScheme: this.collectionScheme,
            name: this.name,
            signalCatalogArn: this.signalCatalogArn,
            targetArn: this.targetArn,
            compression: this.compression,
            dataExtraDimensions: this.dataExtraDimensions,
            description: this.description,
            diagnosticsMode: this.diagnosticsMode,
            expiryTime: this.expiryTime,
            postTriggerCollectionDuration: this.postTriggerCollectionDuration,
            priority: this.priority,
            signalsToCollect: this.signalsToCollect,
            spoolingMode: this.spoolingMode,
            startTime: this.startTime,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCampaignPropsToCloudFormation(props);
    }
}

export namespace CfnCampaign {
    /**
     * Specifies what data to collect and how often or when to collect it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html
     */
    export interface CollectionSchemeProperty {
        /**
         * Information about a collection scheme that uses a simple logical expression to recognize what data to collect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html#cfn-iotfleetwise-campaign-collectionscheme-conditionbasedcollectionscheme
         */
        readonly conditionBasedCollectionScheme?: CfnCampaign.ConditionBasedCollectionSchemeProperty | cdk.IResolvable;
        /**
         * Information about a collection scheme that uses a time period to decide how often to collect data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-collectionscheme.html#cfn-iotfleetwise-campaign-collectionscheme-timebasedcollectionscheme
         */
        readonly timeBasedCollectionScheme?: CfnCampaign.TimeBasedCollectionSchemeProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CollectionSchemeProperty`
 *
 * @param properties - the TypeScript properties of a `CollectionSchemeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_CollectionSchemePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conditionBasedCollectionScheme', CfnCampaign_ConditionBasedCollectionSchemePropertyValidator)(properties.conditionBasedCollectionScheme));
    errors.collect(cdk.propertyValidator('timeBasedCollectionScheme', CfnCampaign_TimeBasedCollectionSchemePropertyValidator)(properties.timeBasedCollectionScheme));
    return errors.wrap('supplied properties not correct for "CollectionSchemeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign.CollectionScheme` resource
 *
 * @param properties - the TypeScript properties of a `CollectionSchemeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign.CollectionScheme` resource.
 */
// @ts-ignore TS6133
function cfnCampaignCollectionSchemePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_CollectionSchemePropertyValidator(properties).assertSuccess();
    return {
        ConditionBasedCollectionScheme: cfnCampaignConditionBasedCollectionSchemePropertyToCloudFormation(properties.conditionBasedCollectionScheme),
        TimeBasedCollectionScheme: cfnCampaignTimeBasedCollectionSchemePropertyToCloudFormation(properties.timeBasedCollectionScheme),
    };
}

// @ts-ignore TS6133
function CfnCampaignCollectionSchemePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CollectionSchemeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CollectionSchemeProperty>();
    ret.addPropertyResult('conditionBasedCollectionScheme', 'ConditionBasedCollectionScheme', properties.ConditionBasedCollectionScheme != null ? CfnCampaignConditionBasedCollectionSchemePropertyFromCloudFormation(properties.ConditionBasedCollectionScheme) : undefined);
    ret.addPropertyResult('timeBasedCollectionScheme', 'TimeBasedCollectionScheme', properties.TimeBasedCollectionScheme != null ? CfnCampaignTimeBasedCollectionSchemePropertyFromCloudFormation(properties.TimeBasedCollectionScheme) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Information about a collection scheme that uses a simple logical expression to recognize what data to collect.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html
     */
    export interface ConditionBasedCollectionSchemeProperty {
        /**
         * Specifies the version of the conditional expression language.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-conditionlanguageversion
         */
        readonly conditionLanguageVersion?: number;
        /**
         * The logical expression used to recognize what data to collect. For example, `$variable.Vehicle.OutsideAirTemperature >= 105.0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-expression
         */
        readonly expression: string;
        /**
         * The minimum duration of time between two triggering events to collect data, in milliseconds.
         *
         * > If a signal changes often, you might want to collect data at a slower rate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-minimumtriggerintervalms
         */
        readonly minimumTriggerIntervalMs?: number;
        /**
         * Whether to collect data for all triggering events ( `ALWAYS` ). Specify ( `RISING_EDGE` ), or specify only when the condition first evaluates to false. For example, triggering on "AirbagDeployed"; Users aren't interested on triggering when the airbag is already exploded; they only care about the change from not deployed => deployed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-conditionbasedcollectionscheme.html#cfn-iotfleetwise-campaign-conditionbasedcollectionscheme-triggermode
         */
        readonly triggerMode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConditionBasedCollectionSchemeProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionBasedCollectionSchemeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_ConditionBasedCollectionSchemePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conditionLanguageVersion', cdk.validateNumber)(properties.conditionLanguageVersion));
    errors.collect(cdk.propertyValidator('expression', cdk.requiredValidator)(properties.expression));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('minimumTriggerIntervalMs', cdk.validateNumber)(properties.minimumTriggerIntervalMs));
    errors.collect(cdk.propertyValidator('triggerMode', cdk.validateString)(properties.triggerMode));
    return errors.wrap('supplied properties not correct for "ConditionBasedCollectionSchemeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign.ConditionBasedCollectionScheme` resource
 *
 * @param properties - the TypeScript properties of a `ConditionBasedCollectionSchemeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign.ConditionBasedCollectionScheme` resource.
 */
// @ts-ignore TS6133
function cfnCampaignConditionBasedCollectionSchemePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_ConditionBasedCollectionSchemePropertyValidator(properties).assertSuccess();
    return {
        ConditionLanguageVersion: cdk.numberToCloudFormation(properties.conditionLanguageVersion),
        Expression: cdk.stringToCloudFormation(properties.expression),
        MinimumTriggerIntervalMs: cdk.numberToCloudFormation(properties.minimumTriggerIntervalMs),
        TriggerMode: cdk.stringToCloudFormation(properties.triggerMode),
    };
}

// @ts-ignore TS6133
function CfnCampaignConditionBasedCollectionSchemePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.ConditionBasedCollectionSchemeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.ConditionBasedCollectionSchemeProperty>();
    ret.addPropertyResult('conditionLanguageVersion', 'ConditionLanguageVersion', properties.ConditionLanguageVersion != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConditionLanguageVersion) : undefined);
    ret.addPropertyResult('expression', 'Expression', cfn_parse.FromCloudFormation.getString(properties.Expression));
    ret.addPropertyResult('minimumTriggerIntervalMs', 'MinimumTriggerIntervalMs', properties.MinimumTriggerIntervalMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumTriggerIntervalMs) : undefined);
    ret.addPropertyResult('triggerMode', 'TriggerMode', properties.TriggerMode != null ? cfn_parse.FromCloudFormation.getString(properties.TriggerMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Information about a signal.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html
     */
    export interface SignalInformationProperty {
        /**
         * The maximum number of samples to collect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-maxsamplecount
         */
        readonly maxSampleCount?: number;
        /**
         * The minimum duration of time (in milliseconds) between two triggering events to collect data.
         *
         * > If a signal changes often, you might want to collect data at a slower rate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-minimumsamplingintervalms
         */
        readonly minimumSamplingIntervalMs?: number;
        /**
         * The name of the signal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-signalinformation.html#cfn-iotfleetwise-campaign-signalinformation-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `SignalInformationProperty`
 *
 * @param properties - the TypeScript properties of a `SignalInformationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_SignalInformationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxSampleCount', cdk.validateNumber)(properties.maxSampleCount));
    errors.collect(cdk.propertyValidator('minimumSamplingIntervalMs', cdk.validateNumber)(properties.minimumSamplingIntervalMs));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "SignalInformationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign.SignalInformation` resource
 *
 * @param properties - the TypeScript properties of a `SignalInformationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign.SignalInformation` resource.
 */
// @ts-ignore TS6133
function cfnCampaignSignalInformationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_SignalInformationPropertyValidator(properties).assertSuccess();
    return {
        MaxSampleCount: cdk.numberToCloudFormation(properties.maxSampleCount),
        MinimumSamplingIntervalMs: cdk.numberToCloudFormation(properties.minimumSamplingIntervalMs),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnCampaignSignalInformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.SignalInformationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.SignalInformationProperty>();
    ret.addPropertyResult('maxSampleCount', 'MaxSampleCount', properties.MaxSampleCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSampleCount) : undefined);
    ret.addPropertyResult('minimumSamplingIntervalMs', 'MinimumSamplingIntervalMs', properties.MinimumSamplingIntervalMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumSamplingIntervalMs) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Information about a collection scheme that uses a time period to decide how often to collect data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timebasedcollectionscheme.html
     */
    export interface TimeBasedCollectionSchemeProperty {
        /**
         * The time period (in milliseconds) to decide how often to collect data. For example, if the time period is `60000` , the Edge Agent software collects data once every minute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-campaign-timebasedcollectionscheme.html#cfn-iotfleetwise-campaign-timebasedcollectionscheme-periodms
         */
        readonly periodMs: number;
    }
}

/**
 * Determine whether the given properties match those of a `TimeBasedCollectionSchemeProperty`
 *
 * @param properties - the TypeScript properties of a `TimeBasedCollectionSchemeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_TimeBasedCollectionSchemePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('periodMs', cdk.requiredValidator)(properties.periodMs));
    errors.collect(cdk.propertyValidator('periodMs', cdk.validateNumber)(properties.periodMs));
    return errors.wrap('supplied properties not correct for "TimeBasedCollectionSchemeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign.TimeBasedCollectionScheme` resource
 *
 * @param properties - the TypeScript properties of a `TimeBasedCollectionSchemeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::Campaign.TimeBasedCollectionScheme` resource.
 */
// @ts-ignore TS6133
function cfnCampaignTimeBasedCollectionSchemePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_TimeBasedCollectionSchemePropertyValidator(properties).assertSuccess();
    return {
        PeriodMs: cdk.numberToCloudFormation(properties.periodMs),
    };
}

// @ts-ignore TS6133
function CfnCampaignTimeBasedCollectionSchemePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.TimeBasedCollectionSchemeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.TimeBasedCollectionSchemeProperty>();
    ret.addPropertyResult('periodMs', 'PeriodMs', cfn_parse.FromCloudFormation.getNumber(properties.PeriodMs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDecoderManifest`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html
 */
export interface CfnDecoderManifestProps {

    /**
     * The ARN of a vehicle model (model manifest) associated with the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-modelmanifestarn
     */
    readonly modelManifestArn: string;

    /**
     * The name of the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-name
     */
    readonly name: string;

    /**
     * A brief description of the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-description
     */
    readonly description?: string;

    /**
     * `AWS::IoTFleetWise::DecoderManifest.NetworkInterfaces`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-networkinterfaces
     */
    readonly networkInterfaces?: Array<CfnDecoderManifest.NetworkInterfacesItemsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `AWS::IoTFleetWise::DecoderManifest.SignalDecoders`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-signaldecoders
     */
    readonly signalDecoders?: Array<CfnDecoderManifest.SignalDecodersItemsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The state of the decoder manifest. If the status is `ACTIVE` , the decoder manifest can't be edited. If the status is marked `DRAFT` , you can edit the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-status
     */
    readonly status?: string;

    /**
     * `AWS::IoTFleetWise::DecoderManifest.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDecoderManifestProps`
 *
 * @param properties - the TypeScript properties of a `CfnDecoderManifestProps`
 *
 * @returns the result of the validation.
 */
function CfnDecoderManifestPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('modelManifestArn', cdk.requiredValidator)(properties.modelManifestArn));
    errors.collect(cdk.propertyValidator('modelManifestArn', cdk.validateString)(properties.modelManifestArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('networkInterfaces', cdk.listValidator(CfnDecoderManifest_NetworkInterfacesItemsPropertyValidator))(properties.networkInterfaces));
    errors.collect(cdk.propertyValidator('signalDecoders', cdk.listValidator(CfnDecoderManifest_SignalDecodersItemsPropertyValidator))(properties.signalDecoders));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDecoderManifestProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest` resource
 *
 * @param properties - the TypeScript properties of a `CfnDecoderManifestProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest` resource.
 */
// @ts-ignore TS6133
function cfnDecoderManifestPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDecoderManifestPropsValidator(properties).assertSuccess();
    return {
        ModelManifestArn: cdk.stringToCloudFormation(properties.modelManifestArn),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        NetworkInterfaces: cdk.listMapper(cfnDecoderManifestNetworkInterfacesItemsPropertyToCloudFormation)(properties.networkInterfaces),
        SignalDecoders: cdk.listMapper(cfnDecoderManifestSignalDecodersItemsPropertyToCloudFormation)(properties.signalDecoders),
        Status: cdk.stringToCloudFormation(properties.status),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDecoderManifestPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifestProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifestProps>();
    ret.addPropertyResult('modelManifestArn', 'ModelManifestArn', cfn_parse.FromCloudFormation.getString(properties.ModelManifestArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('networkInterfaces', 'NetworkInterfaces', properties.NetworkInterfaces != null ? cfn_parse.FromCloudFormation.getArray(CfnDecoderManifestNetworkInterfacesItemsPropertyFromCloudFormation)(properties.NetworkInterfaces) : undefined);
    ret.addPropertyResult('signalDecoders', 'SignalDecoders', properties.SignalDecoders != null ? cfn_parse.FromCloudFormation.getArray(CfnDecoderManifestSignalDecodersItemsPropertyFromCloudFormation)(properties.SignalDecoders) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTFleetWise::DecoderManifest`
 *
 * Creates the decoder manifest associated with a model manifest. To create a decoder manifest, the following must be true:
 *
 * - Every signal decoder has a unique name.
 * - Each signal decoder is associated with a network interface.
 * - Each network interface has a unique ID.
 * - The signal decoders are specified in the model manifest.
 *
 * @cloudformationResource AWS::IoTFleetWise::DecoderManifest
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html
 */
export class CfnDecoderManifest extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::DecoderManifest";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDecoderManifest {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDecoderManifestPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDecoderManifest(scope, id, propsResult.value);
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
     *
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    public readonly attrLastModificationTime: string;

    /**
     * The ARN of a vehicle model (model manifest) associated with the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-modelmanifestarn
     */
    public modelManifestArn: string;

    /**
     * The name of the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-name
     */
    public name: string;

    /**
     * A brief description of the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-description
     */
    public description: string | undefined;

    /**
     * `AWS::IoTFleetWise::DecoderManifest.NetworkInterfaces`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-networkinterfaces
     */
    public networkInterfaces: Array<CfnDecoderManifest.NetworkInterfacesItemsProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * `AWS::IoTFleetWise::DecoderManifest.SignalDecoders`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-signaldecoders
     */
    public signalDecoders: Array<CfnDecoderManifest.SignalDecodersItemsProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The state of the decoder manifest. If the status is `ACTIVE` , the decoder manifest can't be edited. If the status is marked `DRAFT` , you can edit the decoder manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-status
     */
    public status: string | undefined;

    /**
     * `AWS::IoTFleetWise::DecoderManifest.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-decodermanifest.html#cfn-iotfleetwise-decodermanifest-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTFleetWise::DecoderManifest`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDecoderManifestProps) {
        super(scope, id, { type: CfnDecoderManifest.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'modelManifestArn', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastModificationTime = cdk.Token.asString(this.getAtt('LastModificationTime', cdk.ResolutionTypeHint.STRING));

        this.modelManifestArn = props.modelManifestArn;
        this.name = props.name;
        this.description = props.description;
        this.networkInterfaces = props.networkInterfaces;
        this.signalDecoders = props.signalDecoders;
        this.status = props.status;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::DecoderManifest", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDecoderManifest.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            modelManifestArn: this.modelManifestArn,
            name: this.name,
            description: this.description,
            networkInterfaces: this.networkInterfaces,
            signalDecoders: this.signalDecoders,
            status: this.status,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDecoderManifestPropsToCloudFormation(props);
    }
}

export namespace CfnDecoderManifest {
    /**
     * A single controller area network (CAN) device interface.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html
     */
    export interface CanInterfaceProperty {
        /**
         * The unique name of the interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-name
         */
        readonly name: string;
        /**
         * The name of the communication protocol for the interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-protocolname
         */
        readonly protocolName?: string;
        /**
         * The version of the communication protocol for the interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-caninterface.html#cfn-iotfleetwise-decodermanifest-caninterface-protocolversion
         */
        readonly protocolVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CanInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `CanInterfaceProperty`
 *
 * @returns the result of the validation.
 */
function CfnDecoderManifest_CanInterfacePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('protocolName', cdk.validateString)(properties.protocolName));
    errors.collect(cdk.propertyValidator('protocolVersion', cdk.validateString)(properties.protocolVersion));
    return errors.wrap('supplied properties not correct for "CanInterfaceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.CanInterface` resource
 *
 * @param properties - the TypeScript properties of a `CanInterfaceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.CanInterface` resource.
 */
// @ts-ignore TS6133
function cfnDecoderManifestCanInterfacePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDecoderManifest_CanInterfacePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ProtocolName: cdk.stringToCloudFormation(properties.protocolName),
        ProtocolVersion: cdk.stringToCloudFormation(properties.protocolVersion),
    };
}

// @ts-ignore TS6133
function CfnDecoderManifestCanInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.CanInterfaceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.CanInterfaceProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('protocolName', 'ProtocolName', properties.ProtocolName != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolName) : undefined);
    ret.addPropertyResult('protocolVersion', 'ProtocolVersion', properties.ProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDecoderManifest {
    /**
     * Information about a single controller area network (CAN) signal and the messages it receives and transmits.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html
     */
    export interface CanSignalProperty {
        /**
         * A multiplier used to decode the CAN message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-factor
         */
        readonly factor: string;
        /**
         * Whether the byte ordering of a CAN message is big-endian.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-isbigendian
         */
        readonly isBigEndian: string;
        /**
         * Whether the message data is specified as a signed value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-issigned
         */
        readonly isSigned: string;
        /**
         * How many bytes of data are in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-length
         */
        readonly length: string;
        /**
         * The ID of the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-messageid
         */
        readonly messageId: string;
        /**
         * The name of the signal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-name
         */
        readonly name?: string;
        /**
         * Indicates where data appears in the CAN message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-offset
         */
        readonly offset: string;
        /**
         * Indicates the beginning of the CAN message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-cansignal.html#cfn-iotfleetwise-decodermanifest-cansignal-startbit
         */
        readonly startBit: string;
    }
}

/**
 * Determine whether the given properties match those of a `CanSignalProperty`
 *
 * @param properties - the TypeScript properties of a `CanSignalProperty`
 *
 * @returns the result of the validation.
 */
function CfnDecoderManifest_CanSignalPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('factor', cdk.requiredValidator)(properties.factor));
    errors.collect(cdk.propertyValidator('factor', cdk.validateString)(properties.factor));
    errors.collect(cdk.propertyValidator('isBigEndian', cdk.requiredValidator)(properties.isBigEndian));
    errors.collect(cdk.propertyValidator('isBigEndian', cdk.validateString)(properties.isBigEndian));
    errors.collect(cdk.propertyValidator('isSigned', cdk.requiredValidator)(properties.isSigned));
    errors.collect(cdk.propertyValidator('isSigned', cdk.validateString)(properties.isSigned));
    errors.collect(cdk.propertyValidator('length', cdk.requiredValidator)(properties.length));
    errors.collect(cdk.propertyValidator('length', cdk.validateString)(properties.length));
    errors.collect(cdk.propertyValidator('messageId', cdk.requiredValidator)(properties.messageId));
    errors.collect(cdk.propertyValidator('messageId', cdk.validateString)(properties.messageId));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('offset', cdk.requiredValidator)(properties.offset));
    errors.collect(cdk.propertyValidator('offset', cdk.validateString)(properties.offset));
    errors.collect(cdk.propertyValidator('startBit', cdk.requiredValidator)(properties.startBit));
    errors.collect(cdk.propertyValidator('startBit', cdk.validateString)(properties.startBit));
    return errors.wrap('supplied properties not correct for "CanSignalProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.CanSignal` resource
 *
 * @param properties - the TypeScript properties of a `CanSignalProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.CanSignal` resource.
 */
// @ts-ignore TS6133
function cfnDecoderManifestCanSignalPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDecoderManifest_CanSignalPropertyValidator(properties).assertSuccess();
    return {
        Factor: cdk.stringToCloudFormation(properties.factor),
        IsBigEndian: cdk.stringToCloudFormation(properties.isBigEndian),
        IsSigned: cdk.stringToCloudFormation(properties.isSigned),
        Length: cdk.stringToCloudFormation(properties.length),
        MessageId: cdk.stringToCloudFormation(properties.messageId),
        Name: cdk.stringToCloudFormation(properties.name),
        Offset: cdk.stringToCloudFormation(properties.offset),
        StartBit: cdk.stringToCloudFormation(properties.startBit),
    };
}

// @ts-ignore TS6133
function CfnDecoderManifestCanSignalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.CanSignalProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.CanSignalProperty>();
    ret.addPropertyResult('factor', 'Factor', cfn_parse.FromCloudFormation.getString(properties.Factor));
    ret.addPropertyResult('isBigEndian', 'IsBigEndian', cfn_parse.FromCloudFormation.getString(properties.IsBigEndian));
    ret.addPropertyResult('isSigned', 'IsSigned', cfn_parse.FromCloudFormation.getString(properties.IsSigned));
    ret.addPropertyResult('length', 'Length', cfn_parse.FromCloudFormation.getString(properties.Length));
    ret.addPropertyResult('messageId', 'MessageId', cfn_parse.FromCloudFormation.getString(properties.MessageId));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('offset', 'Offset', cfn_parse.FromCloudFormation.getString(properties.Offset));
    ret.addPropertyResult('startBit', 'StartBit', cfn_parse.FromCloudFormation.getString(properties.StartBit));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDecoderManifest {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html
     */
    export interface NetworkInterfacesItemsProperty {
        /**
         * `CfnDecoderManifest.NetworkInterfacesItemsProperty.CanInterface`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-caninterface
         */
        readonly canInterface?: CfnDecoderManifest.CanInterfaceProperty | cdk.IResolvable;
        /**
         * `CfnDecoderManifest.NetworkInterfacesItemsProperty.InterfaceId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-interfaceid
         */
        readonly interfaceId: string;
        /**
         * `CfnDecoderManifest.NetworkInterfacesItemsProperty.ObdInterface`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-obdinterface
         */
        readonly obdInterface?: CfnDecoderManifest.ObdInterfaceProperty | cdk.IResolvable;
        /**
         * `CfnDecoderManifest.NetworkInterfacesItemsProperty.Type`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-networkinterfacesitems.html#cfn-iotfleetwise-decodermanifest-networkinterfacesitems-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkInterfacesItemsProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInterfacesItemsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDecoderManifest_NetworkInterfacesItemsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('canInterface', CfnDecoderManifest_CanInterfacePropertyValidator)(properties.canInterface));
    errors.collect(cdk.propertyValidator('interfaceId', cdk.requiredValidator)(properties.interfaceId));
    errors.collect(cdk.propertyValidator('interfaceId', cdk.validateString)(properties.interfaceId));
    errors.collect(cdk.propertyValidator('obdInterface', CfnDecoderManifest_ObdInterfacePropertyValidator)(properties.obdInterface));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "NetworkInterfacesItemsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.NetworkInterfacesItems` resource
 *
 * @param properties - the TypeScript properties of a `NetworkInterfacesItemsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.NetworkInterfacesItems` resource.
 */
// @ts-ignore TS6133
function cfnDecoderManifestNetworkInterfacesItemsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDecoderManifest_NetworkInterfacesItemsPropertyValidator(properties).assertSuccess();
    return {
        CanInterface: cfnDecoderManifestCanInterfacePropertyToCloudFormation(properties.canInterface),
        InterfaceId: cdk.stringToCloudFormation(properties.interfaceId),
        ObdInterface: cfnDecoderManifestObdInterfacePropertyToCloudFormation(properties.obdInterface),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnDecoderManifestNetworkInterfacesItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.NetworkInterfacesItemsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.NetworkInterfacesItemsProperty>();
    ret.addPropertyResult('canInterface', 'CanInterface', properties.CanInterface != null ? CfnDecoderManifestCanInterfacePropertyFromCloudFormation(properties.CanInterface) : undefined);
    ret.addPropertyResult('interfaceId', 'InterfaceId', cfn_parse.FromCloudFormation.getString(properties.InterfaceId));
    ret.addPropertyResult('obdInterface', 'ObdInterface', properties.ObdInterface != null ? CfnDecoderManifestObdInterfacePropertyFromCloudFormation(properties.ObdInterface) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDecoderManifest {
    /**
     * A network interface that specifies the On-board diagnostic (OBD) II network protocol.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html
     */
    export interface ObdInterfaceProperty {
        /**
         * The maximum number message requests per diagnostic trouble code per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-dtcrequestintervalseconds
         */
        readonly dtcRequestIntervalSeconds?: string;
        /**
         * Whether the vehicle has a transmission control module (TCM).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-hastransmissionecu
         */
        readonly hasTransmissionEcu?: string;
        /**
         * The name of the interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-name
         */
        readonly name: string;
        /**
         * The standard OBD II PID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-obdstandard
         */
        readonly obdStandard?: string;
        /**
         * The maximum number message requests per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-pidrequestintervalseconds
         */
        readonly pidRequestIntervalSeconds?: string;
        /**
         * The ID of the message requesting vehicle data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-requestmessageid
         */
        readonly requestMessageId: string;
        /**
         * Whether to use extended IDs in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdinterface.html#cfn-iotfleetwise-decodermanifest-obdinterface-useextendedids
         */
        readonly useExtendedIds?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ObdInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `ObdInterfaceProperty`
 *
 * @returns the result of the validation.
 */
function CfnDecoderManifest_ObdInterfacePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dtcRequestIntervalSeconds', cdk.validateString)(properties.dtcRequestIntervalSeconds));
    errors.collect(cdk.propertyValidator('hasTransmissionEcu', cdk.validateString)(properties.hasTransmissionEcu));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('obdStandard', cdk.validateString)(properties.obdStandard));
    errors.collect(cdk.propertyValidator('pidRequestIntervalSeconds', cdk.validateString)(properties.pidRequestIntervalSeconds));
    errors.collect(cdk.propertyValidator('requestMessageId', cdk.requiredValidator)(properties.requestMessageId));
    errors.collect(cdk.propertyValidator('requestMessageId', cdk.validateString)(properties.requestMessageId));
    errors.collect(cdk.propertyValidator('useExtendedIds', cdk.validateString)(properties.useExtendedIds));
    return errors.wrap('supplied properties not correct for "ObdInterfaceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.ObdInterface` resource
 *
 * @param properties - the TypeScript properties of a `ObdInterfaceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.ObdInterface` resource.
 */
// @ts-ignore TS6133
function cfnDecoderManifestObdInterfacePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDecoderManifest_ObdInterfacePropertyValidator(properties).assertSuccess();
    return {
        DtcRequestIntervalSeconds: cdk.stringToCloudFormation(properties.dtcRequestIntervalSeconds),
        HasTransmissionEcu: cdk.stringToCloudFormation(properties.hasTransmissionEcu),
        Name: cdk.stringToCloudFormation(properties.name),
        ObdStandard: cdk.stringToCloudFormation(properties.obdStandard),
        PidRequestIntervalSeconds: cdk.stringToCloudFormation(properties.pidRequestIntervalSeconds),
        RequestMessageId: cdk.stringToCloudFormation(properties.requestMessageId),
        UseExtendedIds: cdk.stringToCloudFormation(properties.useExtendedIds),
    };
}

// @ts-ignore TS6133
function CfnDecoderManifestObdInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.ObdInterfaceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.ObdInterfaceProperty>();
    ret.addPropertyResult('dtcRequestIntervalSeconds', 'DtcRequestIntervalSeconds', properties.DtcRequestIntervalSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.DtcRequestIntervalSeconds) : undefined);
    ret.addPropertyResult('hasTransmissionEcu', 'HasTransmissionEcu', properties.HasTransmissionEcu != null ? cfn_parse.FromCloudFormation.getString(properties.HasTransmissionEcu) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('obdStandard', 'ObdStandard', properties.ObdStandard != null ? cfn_parse.FromCloudFormation.getString(properties.ObdStandard) : undefined);
    ret.addPropertyResult('pidRequestIntervalSeconds', 'PidRequestIntervalSeconds', properties.PidRequestIntervalSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.PidRequestIntervalSeconds) : undefined);
    ret.addPropertyResult('requestMessageId', 'RequestMessageId', cfn_parse.FromCloudFormation.getString(properties.RequestMessageId));
    ret.addPropertyResult('useExtendedIds', 'UseExtendedIds', properties.UseExtendedIds != null ? cfn_parse.FromCloudFormation.getString(properties.UseExtendedIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDecoderManifest {
    /**
     * Information about signal messages using the on-board diagnostics (OBD) II protocol in a vehicle.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html
     */
    export interface ObdSignalProperty {
        /**
         * The number of bits to mask in a message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bitmasklength
         */
        readonly bitMaskLength?: string;
        /**
         * The number of positions to shift bits in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bitrightshift
         */
        readonly bitRightShift?: string;
        /**
         * The length of a message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-bytelength
         */
        readonly byteLength: string;
        /**
         * Indicates where data appears in the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-offset
         */
        readonly offset: string;
        /**
         * The diagnostic code used to request data from a vehicle for this signal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-pid
         */
        readonly pid: string;
        /**
         * The length of the requested data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-pidresponselength
         */
        readonly pidResponseLength: string;
        /**
         * A multiplier used to decode the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-scaling
         */
        readonly scaling: string;
        /**
         * The mode of operation (diagnostic service) in a message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-servicemode
         */
        readonly serviceMode: string;
        /**
         * Indicates the beginning of the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-obdsignal.html#cfn-iotfleetwise-decodermanifest-obdsignal-startbyte
         */
        readonly startByte: string;
    }
}

/**
 * Determine whether the given properties match those of a `ObdSignalProperty`
 *
 * @param properties - the TypeScript properties of a `ObdSignalProperty`
 *
 * @returns the result of the validation.
 */
function CfnDecoderManifest_ObdSignalPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bitMaskLength', cdk.validateString)(properties.bitMaskLength));
    errors.collect(cdk.propertyValidator('bitRightShift', cdk.validateString)(properties.bitRightShift));
    errors.collect(cdk.propertyValidator('byteLength', cdk.requiredValidator)(properties.byteLength));
    errors.collect(cdk.propertyValidator('byteLength', cdk.validateString)(properties.byteLength));
    errors.collect(cdk.propertyValidator('offset', cdk.requiredValidator)(properties.offset));
    errors.collect(cdk.propertyValidator('offset', cdk.validateString)(properties.offset));
    errors.collect(cdk.propertyValidator('pid', cdk.requiredValidator)(properties.pid));
    errors.collect(cdk.propertyValidator('pid', cdk.validateString)(properties.pid));
    errors.collect(cdk.propertyValidator('pidResponseLength', cdk.requiredValidator)(properties.pidResponseLength));
    errors.collect(cdk.propertyValidator('pidResponseLength', cdk.validateString)(properties.pidResponseLength));
    errors.collect(cdk.propertyValidator('scaling', cdk.requiredValidator)(properties.scaling));
    errors.collect(cdk.propertyValidator('scaling', cdk.validateString)(properties.scaling));
    errors.collect(cdk.propertyValidator('serviceMode', cdk.requiredValidator)(properties.serviceMode));
    errors.collect(cdk.propertyValidator('serviceMode', cdk.validateString)(properties.serviceMode));
    errors.collect(cdk.propertyValidator('startByte', cdk.requiredValidator)(properties.startByte));
    errors.collect(cdk.propertyValidator('startByte', cdk.validateString)(properties.startByte));
    return errors.wrap('supplied properties not correct for "ObdSignalProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.ObdSignal` resource
 *
 * @param properties - the TypeScript properties of a `ObdSignalProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.ObdSignal` resource.
 */
// @ts-ignore TS6133
function cfnDecoderManifestObdSignalPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDecoderManifest_ObdSignalPropertyValidator(properties).assertSuccess();
    return {
        BitMaskLength: cdk.stringToCloudFormation(properties.bitMaskLength),
        BitRightShift: cdk.stringToCloudFormation(properties.bitRightShift),
        ByteLength: cdk.stringToCloudFormation(properties.byteLength),
        Offset: cdk.stringToCloudFormation(properties.offset),
        Pid: cdk.stringToCloudFormation(properties.pid),
        PidResponseLength: cdk.stringToCloudFormation(properties.pidResponseLength),
        Scaling: cdk.stringToCloudFormation(properties.scaling),
        ServiceMode: cdk.stringToCloudFormation(properties.serviceMode),
        StartByte: cdk.stringToCloudFormation(properties.startByte),
    };
}

// @ts-ignore TS6133
function CfnDecoderManifestObdSignalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.ObdSignalProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.ObdSignalProperty>();
    ret.addPropertyResult('bitMaskLength', 'BitMaskLength', properties.BitMaskLength != null ? cfn_parse.FromCloudFormation.getString(properties.BitMaskLength) : undefined);
    ret.addPropertyResult('bitRightShift', 'BitRightShift', properties.BitRightShift != null ? cfn_parse.FromCloudFormation.getString(properties.BitRightShift) : undefined);
    ret.addPropertyResult('byteLength', 'ByteLength', cfn_parse.FromCloudFormation.getString(properties.ByteLength));
    ret.addPropertyResult('offset', 'Offset', cfn_parse.FromCloudFormation.getString(properties.Offset));
    ret.addPropertyResult('pid', 'Pid', cfn_parse.FromCloudFormation.getString(properties.Pid));
    ret.addPropertyResult('pidResponseLength', 'PidResponseLength', cfn_parse.FromCloudFormation.getString(properties.PidResponseLength));
    ret.addPropertyResult('scaling', 'Scaling', cfn_parse.FromCloudFormation.getString(properties.Scaling));
    ret.addPropertyResult('serviceMode', 'ServiceMode', cfn_parse.FromCloudFormation.getString(properties.ServiceMode));
    ret.addPropertyResult('startByte', 'StartByte', cfn_parse.FromCloudFormation.getString(properties.StartByte));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDecoderManifest {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html
     */
    export interface SignalDecodersItemsProperty {
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.CanSignal`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-cansignal
         */
        readonly canSignal?: CfnDecoderManifest.CanSignalProperty | cdk.IResolvable;
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.FullyQualifiedName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.InterfaceId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-interfaceid
         */
        readonly interfaceId: string;
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.ObdSignal`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-obdsignal
         */
        readonly obdSignal?: CfnDecoderManifest.ObdSignalProperty | cdk.IResolvable;
        /**
         * `CfnDecoderManifest.SignalDecodersItemsProperty.Type`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-decodermanifest-signaldecodersitems.html#cfn-iotfleetwise-decodermanifest-signaldecodersitems-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `SignalDecodersItemsProperty`
 *
 * @param properties - the TypeScript properties of a `SignalDecodersItemsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDecoderManifest_SignalDecodersItemsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('canSignal', CfnDecoderManifest_CanSignalPropertyValidator)(properties.canSignal));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.requiredValidator)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.validateString)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('interfaceId', cdk.requiredValidator)(properties.interfaceId));
    errors.collect(cdk.propertyValidator('interfaceId', cdk.validateString)(properties.interfaceId));
    errors.collect(cdk.propertyValidator('obdSignal', CfnDecoderManifest_ObdSignalPropertyValidator)(properties.obdSignal));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "SignalDecodersItemsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.SignalDecodersItems` resource
 *
 * @param properties - the TypeScript properties of a `SignalDecodersItemsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::DecoderManifest.SignalDecodersItems` resource.
 */
// @ts-ignore TS6133
function cfnDecoderManifestSignalDecodersItemsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDecoderManifest_SignalDecodersItemsPropertyValidator(properties).assertSuccess();
    return {
        CanSignal: cfnDecoderManifestCanSignalPropertyToCloudFormation(properties.canSignal),
        FullyQualifiedName: cdk.stringToCloudFormation(properties.fullyQualifiedName),
        InterfaceId: cdk.stringToCloudFormation(properties.interfaceId),
        ObdSignal: cfnDecoderManifestObdSignalPropertyToCloudFormation(properties.obdSignal),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnDecoderManifestSignalDecodersItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDecoderManifest.SignalDecodersItemsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDecoderManifest.SignalDecodersItemsProperty>();
    ret.addPropertyResult('canSignal', 'CanSignal', properties.CanSignal != null ? CfnDecoderManifestCanSignalPropertyFromCloudFormation(properties.CanSignal) : undefined);
    ret.addPropertyResult('fullyQualifiedName', 'FullyQualifiedName', cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName));
    ret.addPropertyResult('interfaceId', 'InterfaceId', cfn_parse.FromCloudFormation.getString(properties.InterfaceId));
    ret.addPropertyResult('obdSignal', 'ObdSignal', properties.ObdSignal != null ? CfnDecoderManifestObdSignalPropertyFromCloudFormation(properties.ObdSignal) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFleet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html
 */
export interface CfnFleetProps {

    /**
     * The unique ID of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-id
     */
    readonly id: string;

    /**
     * The ARN of the signal catalog associated with the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-signalcatalogarn
     */
    readonly signalCatalogArn: string;

    /**
     * A brief description of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-description
     */
    readonly description?: string;

    /**
     * `AWS::IoTFleetWise::Fleet.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnFleetProps`
 *
 * @param properties - the TypeScript properties of a `CfnFleetProps`
 *
 * @returns the result of the validation.
 */
function CfnFleetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('signalCatalogArn', cdk.requiredValidator)(properties.signalCatalogArn));
    errors.collect(cdk.propertyValidator('signalCatalogArn', cdk.validateString)(properties.signalCatalogArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnFleetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::Fleet` resource
 *
 * @param properties - the TypeScript properties of a `CfnFleetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::Fleet` resource.
 */
// @ts-ignore TS6133
function cfnFleetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFleetPropsValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        SignalCatalogArn: cdk.stringToCloudFormation(properties.signalCatalogArn),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFleetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleetProps>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('signalCatalogArn', 'SignalCatalogArn', cfn_parse.FromCloudFormation.getString(properties.SignalCatalogArn));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTFleetWise::Fleet`
 *
 * Creates a fleet that represents a group of vehicles.
 *
 * > You must create both a signal catalog and vehicles before you can create a fleet.
 *
 * For more information, see [Fleets](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/fleets.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Fleet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html
 */
export class CfnFleet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::Fleet";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleet {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFleetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFleet(scope, id, propsResult.value);
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
     *
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    public readonly attrLastModificationTime: string;

    /**
     * The unique ID of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-id
     */
    public id: string;

    /**
     * The ARN of the signal catalog associated with the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-signalcatalogarn
     */
    public signalCatalogArn: string;

    /**
     * A brief description of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-description
     */
    public description: string | undefined;

    /**
     * `AWS::IoTFleetWise::Fleet.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-fleet.html#cfn-iotfleetwise-fleet-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTFleetWise::Fleet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFleetProps) {
        super(scope, id, { type: CfnFleet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'id', this);
        cdk.requireProperty(props, 'signalCatalogArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastModificationTime = cdk.Token.asString(this.getAtt('LastModificationTime', cdk.ResolutionTypeHint.STRING));

        this.id = props.id;
        this.signalCatalogArn = props.signalCatalogArn;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::Fleet", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFleet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            id: this.id,
            signalCatalogArn: this.signalCatalogArn,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFleetPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnModelManifest`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html
 */
export interface CfnModelManifestProps {

    /**
     * The name of the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-name
     */
    readonly name: string;

    /**
     * The ARN of the signal catalog associated with the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-signalcatalogarn
     */
    readonly signalCatalogArn: string;

    /**
     * A brief description of the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-description
     */
    readonly description?: string;

    /**
     * `AWS::IoTFleetWise::ModelManifest.Nodes`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-nodes
     */
    readonly nodes?: string[];

    /**
     * The state of the vehicle model. If the status is `ACTIVE` , the vehicle model can't be edited. If the status is `DRAFT` , you can edit the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-status
     */
    readonly status?: string;

    /**
     * `AWS::IoTFleetWise::ModelManifest.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnModelManifestProps`
 *
 * @param properties - the TypeScript properties of a `CfnModelManifestProps`
 *
 * @returns the result of the validation.
 */
function CfnModelManifestPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('nodes', cdk.listValidator(cdk.validateString))(properties.nodes));
    errors.collect(cdk.propertyValidator('signalCatalogArn', cdk.requiredValidator)(properties.signalCatalogArn));
    errors.collect(cdk.propertyValidator('signalCatalogArn', cdk.validateString)(properties.signalCatalogArn));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnModelManifestProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::ModelManifest` resource
 *
 * @param properties - the TypeScript properties of a `CfnModelManifestProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::ModelManifest` resource.
 */
// @ts-ignore TS6133
function cfnModelManifestPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnModelManifestPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SignalCatalogArn: cdk.stringToCloudFormation(properties.signalCatalogArn),
        Description: cdk.stringToCloudFormation(properties.description),
        Nodes: cdk.listMapper(cdk.stringToCloudFormation)(properties.nodes),
        Status: cdk.stringToCloudFormation(properties.status),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnModelManifestPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnModelManifestProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnModelManifestProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('signalCatalogArn', 'SignalCatalogArn', cfn_parse.FromCloudFormation.getString(properties.SignalCatalogArn));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('nodes', 'Nodes', properties.Nodes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Nodes) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTFleetWise::ModelManifest`
 *
 * Creates a vehicle model (model manifest) that specifies signals (attributes, branches, sensors, and actuators).
 *
 * For more information, see [Vehicle models](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/vehicle-models.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::ModelManifest
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html
 */
export class CfnModelManifest extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::ModelManifest";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModelManifest {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnModelManifestPropsFromCloudFormation(resourceProperties);
        const ret = new CfnModelManifest(scope, id, propsResult.value);
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
     *
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    public readonly attrLastModificationTime: string;

    /**
     * The name of the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-name
     */
    public name: string;

    /**
     * The ARN of the signal catalog associated with the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-signalcatalogarn
     */
    public signalCatalogArn: string;

    /**
     * A brief description of the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-description
     */
    public description: string | undefined;

    /**
     * `AWS::IoTFleetWise::ModelManifest.Nodes`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-nodes
     */
    public nodes: string[] | undefined;

    /**
     * The state of the vehicle model. If the status is `ACTIVE` , the vehicle model can't be edited. If the status is `DRAFT` , you can edit the vehicle model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-status
     */
    public status: string | undefined;

    /**
     * `AWS::IoTFleetWise::ModelManifest.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-modelmanifest.html#cfn-iotfleetwise-modelmanifest-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTFleetWise::ModelManifest`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnModelManifestProps) {
        super(scope, id, { type: CfnModelManifest.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'signalCatalogArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastModificationTime = cdk.Token.asString(this.getAtt('LastModificationTime', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.signalCatalogArn = props.signalCatalogArn;
        this.description = props.description;
        this.nodes = props.nodes;
        this.status = props.status;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::ModelManifest", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnModelManifest.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            signalCatalogArn: this.signalCatalogArn,
            description: this.description,
            nodes: this.nodes,
            status: this.status,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnModelManifestPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSignalCatalog`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html
 */
export interface CfnSignalCatalogProps {

    /**
     * `AWS::IoTFleetWise::SignalCatalog.Description`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-description
     */
    readonly description?: string;

    /**
     * The name of the signal catalog.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-name
     */
    readonly name?: string;

    /**
     * `AWS::IoTFleetWise::SignalCatalog.NodeCounts`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodecounts
     */
    readonly nodeCounts?: CfnSignalCatalog.NodeCountsProperty | cdk.IResolvable;

    /**
     * `AWS::IoTFleetWise::SignalCatalog.Nodes`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodes
     */
    readonly nodes?: Array<CfnSignalCatalog.NodeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `AWS::IoTFleetWise::SignalCatalog.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnSignalCatalogProps`
 *
 * @param properties - the TypeScript properties of a `CfnSignalCatalogProps`
 *
 * @returns the result of the validation.
 */
function CfnSignalCatalogPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('nodeCounts', CfnSignalCatalog_NodeCountsPropertyValidator)(properties.nodeCounts));
    errors.collect(cdk.propertyValidator('nodes', cdk.listValidator(CfnSignalCatalog_NodePropertyValidator))(properties.nodes));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSignalCatalogProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog` resource
 *
 * @param properties - the TypeScript properties of a `CfnSignalCatalogProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog` resource.
 */
// @ts-ignore TS6133
function cfnSignalCatalogPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSignalCatalogPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        NodeCounts: cfnSignalCatalogNodeCountsPropertyToCloudFormation(properties.nodeCounts),
        Nodes: cdk.listMapper(cfnSignalCatalogNodePropertyToCloudFormation)(properties.nodes),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSignalCatalogPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalogProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalogProps>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('nodeCounts', 'NodeCounts', properties.NodeCounts != null ? CfnSignalCatalogNodeCountsPropertyFromCloudFormation(properties.NodeCounts) : undefined);
    ret.addPropertyResult('nodes', 'Nodes', properties.Nodes != null ? cfn_parse.FromCloudFormation.getArray(CfnSignalCatalogNodePropertyFromCloudFormation)(properties.Nodes) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTFleetWise::SignalCatalog`
 *
 * Creates a collection of standardized signals that can be reused to create vehicle models.
 *
 * @cloudformationResource AWS::IoTFleetWise::SignalCatalog
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html
 */
export class CfnSignalCatalog extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::SignalCatalog";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSignalCatalog {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSignalCatalogPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSignalCatalog(scope, id, propsResult.value);
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
     *
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    public readonly attrLastModificationTime: string;

    /**
     *
     * @cloudformationAttribute NodeCounts.TotalActuators
     */
    public readonly attrNodeCountsTotalActuators: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute NodeCounts.TotalAttributes
     */
    public readonly attrNodeCountsTotalAttributes: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute NodeCounts.TotalBranches
     */
    public readonly attrNodeCountsTotalBranches: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute NodeCounts.TotalNodes
     */
    public readonly attrNodeCountsTotalNodes: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute NodeCounts.TotalSensors
     */
    public readonly attrNodeCountsTotalSensors: cdk.IResolvable;

    /**
     * `AWS::IoTFleetWise::SignalCatalog.Description`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-description
     */
    public description: string | undefined;

    /**
     * The name of the signal catalog.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-name
     */
    public name: string | undefined;

    /**
     * `AWS::IoTFleetWise::SignalCatalog.NodeCounts`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodecounts
     */
    public nodeCounts: CfnSignalCatalog.NodeCountsProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::IoTFleetWise::SignalCatalog.Nodes`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-nodes
     */
    public nodes: Array<CfnSignalCatalog.NodeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * `AWS::IoTFleetWise::SignalCatalog.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-signalcatalog.html#cfn-iotfleetwise-signalcatalog-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTFleetWise::SignalCatalog`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSignalCatalogProps = {}) {
        super(scope, id, { type: CfnSignalCatalog.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastModificationTime = cdk.Token.asString(this.getAtt('LastModificationTime', cdk.ResolutionTypeHint.STRING));
        this.attrNodeCountsTotalActuators = this.getAtt('NodeCounts.TotalActuators', cdk.ResolutionTypeHint.STRING);
        this.attrNodeCountsTotalAttributes = this.getAtt('NodeCounts.TotalAttributes', cdk.ResolutionTypeHint.STRING);
        this.attrNodeCountsTotalBranches = this.getAtt('NodeCounts.TotalBranches', cdk.ResolutionTypeHint.STRING);
        this.attrNodeCountsTotalNodes = this.getAtt('NodeCounts.TotalNodes', cdk.ResolutionTypeHint.STRING);
        this.attrNodeCountsTotalSensors = this.getAtt('NodeCounts.TotalSensors', cdk.ResolutionTypeHint.STRING);

        this.description = props.description;
        this.name = props.name;
        this.nodeCounts = props.nodeCounts;
        this.nodes = props.nodes;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::SignalCatalog", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSignalCatalog.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            name: this.name,
            nodeCounts: this.nodeCounts,
            nodes: this.nodes,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSignalCatalogPropsToCloudFormation(props);
    }
}

export namespace CfnSignalCatalog {
    /**
     * A signal that represents a vehicle device such as the engine, heater, and door locks. Data from an actuator reports the state of a certain vehicle device.
     *
     * > Updating actuator data can change the state of a device. For example, you can turn on or off the heater by updating its actuator data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html
     */
    export interface ActuatorProperty {
        /**
         * A list of possible values an actuator can take.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-allowedvalues
         */
        readonly allowedValues?: string[];
        /**
         * A specified value for the actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-assignedvalue
         */
        readonly assignedValue?: string;
        /**
         * The specified data type of the actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-datatype
         */
        readonly dataType: string;
        /**
         * A brief description of the actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-description
         */
        readonly description?: string;
        /**
         * The fully qualified name of the actuator. For example, the fully qualified name of an actuator might be `Vehicle.Front.Left.Door.Lock` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
        /**
         * The specified possible maximum value of an actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-max
         */
        readonly max?: number;
        /**
         * The specified possible minimum value of an actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-min
         */
        readonly min?: number;
        /**
         * The scientific unit for the actuator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-actuator.html#cfn-iotfleetwise-signalcatalog-actuator-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ActuatorProperty`
 *
 * @param properties - the TypeScript properties of a `ActuatorProperty`
 *
 * @returns the result of the validation.
 */
function CfnSignalCatalog_ActuatorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedValues', cdk.listValidator(cdk.validateString))(properties.allowedValues));
    errors.collect(cdk.propertyValidator('assignedValue', cdk.validateString)(properties.assignedValue));
    errors.collect(cdk.propertyValidator('dataType', cdk.requiredValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.requiredValidator)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.validateString)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('max', cdk.validateNumber)(properties.max));
    errors.collect(cdk.propertyValidator('min', cdk.validateNumber)(properties.min));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "ActuatorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Actuator` resource
 *
 * @param properties - the TypeScript properties of a `ActuatorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Actuator` resource.
 */
// @ts-ignore TS6133
function cfnSignalCatalogActuatorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSignalCatalog_ActuatorPropertyValidator(properties).assertSuccess();
    return {
        AllowedValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedValues),
        AssignedValue: cdk.stringToCloudFormation(properties.assignedValue),
        DataType: cdk.stringToCloudFormation(properties.dataType),
        Description: cdk.stringToCloudFormation(properties.description),
        FullyQualifiedName: cdk.stringToCloudFormation(properties.fullyQualifiedName),
        Max: cdk.numberToCloudFormation(properties.max),
        Min: cdk.numberToCloudFormation(properties.min),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnSignalCatalogActuatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.ActuatorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.ActuatorProperty>();
    ret.addPropertyResult('allowedValues', 'AllowedValues', properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowedValues) : undefined);
    ret.addPropertyResult('assignedValue', 'AssignedValue', properties.AssignedValue != null ? cfn_parse.FromCloudFormation.getString(properties.AssignedValue) : undefined);
    ret.addPropertyResult('dataType', 'DataType', cfn_parse.FromCloudFormation.getString(properties.DataType));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('fullyQualifiedName', 'FullyQualifiedName', cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName));
    ret.addPropertyResult('max', 'Max', properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined);
    ret.addPropertyResult('min', 'Min', properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined);
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSignalCatalog {
    /**
     * A signal that represents static information about the vehicle, such as engine type or manufacturing date.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html
     */
    export interface AttributeProperty {
        /**
         * A list of possible values an attribute can be assigned.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-allowedvalues
         */
        readonly allowedValues?: string[];
        /**
         * A specified value for the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-assignedvalue
         */
        readonly assignedValue?: string;
        /**
         * The specified data type of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-datatype
         */
        readonly dataType: string;
        /**
         * The default value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-defaultvalue
         */
        readonly defaultValue?: string;
        /**
         * A brief description of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-description
         */
        readonly description?: string;
        /**
         * The fully qualified name of the attribute. For example, the fully qualified name of an attribute might be `Vehicle.Body.Engine.Type` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
        /**
         * The specified possible maximum value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-max
         */
        readonly max?: number;
        /**
         * The specified possible minimum value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-min
         */
        readonly min?: number;
        /**
         * The scientific unit for the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-attribute.html#cfn-iotfleetwise-signalcatalog-attribute-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AttributeProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnSignalCatalog_AttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedValues', cdk.listValidator(cdk.validateString))(properties.allowedValues));
    errors.collect(cdk.propertyValidator('assignedValue', cdk.validateString)(properties.assignedValue));
    errors.collect(cdk.propertyValidator('dataType', cdk.requiredValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.requiredValidator)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.validateString)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('max', cdk.validateNumber)(properties.max));
    errors.collect(cdk.propertyValidator('min', cdk.validateNumber)(properties.min));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "AttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Attribute` resource
 *
 * @param properties - the TypeScript properties of a `AttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Attribute` resource.
 */
// @ts-ignore TS6133
function cfnSignalCatalogAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSignalCatalog_AttributePropertyValidator(properties).assertSuccess();
    return {
        AllowedValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedValues),
        AssignedValue: cdk.stringToCloudFormation(properties.assignedValue),
        DataType: cdk.stringToCloudFormation(properties.dataType),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        Description: cdk.stringToCloudFormation(properties.description),
        FullyQualifiedName: cdk.stringToCloudFormation(properties.fullyQualifiedName),
        Max: cdk.numberToCloudFormation(properties.max),
        Min: cdk.numberToCloudFormation(properties.min),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnSignalCatalogAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.AttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.AttributeProperty>();
    ret.addPropertyResult('allowedValues', 'AllowedValues', properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowedValues) : undefined);
    ret.addPropertyResult('assignedValue', 'AssignedValue', properties.AssignedValue != null ? cfn_parse.FromCloudFormation.getString(properties.AssignedValue) : undefined);
    ret.addPropertyResult('dataType', 'DataType', cfn_parse.FromCloudFormation.getString(properties.DataType));
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('fullyQualifiedName', 'FullyQualifiedName', cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName));
    ret.addPropertyResult('max', 'Max', properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined);
    ret.addPropertyResult('min', 'Min', properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined);
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSignalCatalog {
    /**
     * A group of signals that are defined in a hierarchical structure.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html
     */
    export interface BranchProperty {
        /**
         * A brief description of the branch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html#cfn-iotfleetwise-signalcatalog-branch-description
         */
        readonly description?: string;
        /**
         * The fully qualified name of the branch. For example, the fully qualified name of a branch might be `Vehicle.Body.Engine` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-branch.html#cfn-iotfleetwise-signalcatalog-branch-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
    }
}

/**
 * Determine whether the given properties match those of a `BranchProperty`
 *
 * @param properties - the TypeScript properties of a `BranchProperty`
 *
 * @returns the result of the validation.
 */
function CfnSignalCatalog_BranchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.requiredValidator)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.validateString)(properties.fullyQualifiedName));
    return errors.wrap('supplied properties not correct for "BranchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Branch` resource
 *
 * @param properties - the TypeScript properties of a `BranchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Branch` resource.
 */
// @ts-ignore TS6133
function cfnSignalCatalogBranchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSignalCatalog_BranchPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        FullyQualifiedName: cdk.stringToCloudFormation(properties.fullyQualifiedName),
    };
}

// @ts-ignore TS6133
function CfnSignalCatalogBranchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.BranchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.BranchProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('fullyQualifiedName', 'FullyQualifiedName', cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSignalCatalog {
    /**
     * A general abstraction of a signal. A node can be specified as an actuator, attribute, branch, or sensor.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html
     */
    export interface NodeProperty {
        /**
         * Information about a node specified as an actuator.
         *
         * > An actuator is a digital representation of a vehicle device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-actuator
         */
        readonly actuator?: CfnSignalCatalog.ActuatorProperty | cdk.IResolvable;
        /**
         * Information about a node specified as an attribute.
         *
         * > An attribute represents static information about a vehicle.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-attribute
         */
        readonly attribute?: CfnSignalCatalog.AttributeProperty | cdk.IResolvable;
        /**
         * Information about a node specified as a branch.
         *
         * > A group of signals that are defined in a hierarchical structure.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-branch
         */
        readonly branch?: CfnSignalCatalog.BranchProperty | cdk.IResolvable;
        /**
         * `CfnSignalCatalog.NodeProperty.Sensor`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-node.html#cfn-iotfleetwise-signalcatalog-node-sensor
         */
        readonly sensor?: CfnSignalCatalog.SensorProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NodeProperty`
 *
 * @param properties - the TypeScript properties of a `NodeProperty`
 *
 * @returns the result of the validation.
 */
function CfnSignalCatalog_NodePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actuator', CfnSignalCatalog_ActuatorPropertyValidator)(properties.actuator));
    errors.collect(cdk.propertyValidator('attribute', CfnSignalCatalog_AttributePropertyValidator)(properties.attribute));
    errors.collect(cdk.propertyValidator('branch', CfnSignalCatalog_BranchPropertyValidator)(properties.branch));
    errors.collect(cdk.propertyValidator('sensor', CfnSignalCatalog_SensorPropertyValidator)(properties.sensor));
    return errors.wrap('supplied properties not correct for "NodeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Node` resource
 *
 * @param properties - the TypeScript properties of a `NodeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Node` resource.
 */
// @ts-ignore TS6133
function cfnSignalCatalogNodePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSignalCatalog_NodePropertyValidator(properties).assertSuccess();
    return {
        Actuator: cfnSignalCatalogActuatorPropertyToCloudFormation(properties.actuator),
        Attribute: cfnSignalCatalogAttributePropertyToCloudFormation(properties.attribute),
        Branch: cfnSignalCatalogBranchPropertyToCloudFormation(properties.branch),
        Sensor: cfnSignalCatalogSensorPropertyToCloudFormation(properties.sensor),
    };
}

// @ts-ignore TS6133
function CfnSignalCatalogNodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.NodeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.NodeProperty>();
    ret.addPropertyResult('actuator', 'Actuator', properties.Actuator != null ? CfnSignalCatalogActuatorPropertyFromCloudFormation(properties.Actuator) : undefined);
    ret.addPropertyResult('attribute', 'Attribute', properties.Attribute != null ? CfnSignalCatalogAttributePropertyFromCloudFormation(properties.Attribute) : undefined);
    ret.addPropertyResult('branch', 'Branch', properties.Branch != null ? CfnSignalCatalogBranchPropertyFromCloudFormation(properties.Branch) : undefined);
    ret.addPropertyResult('sensor', 'Sensor', properties.Sensor != null ? CfnSignalCatalogSensorPropertyFromCloudFormation(properties.Sensor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSignalCatalog {
    /**
     * Information about the number of nodes and node types in a vehicle network.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html
     */
    export interface NodeCountsProperty {
        /**
         * The total number of nodes in a vehicle network that represent actuators.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalactuators
         */
        readonly totalActuators?: number;
        /**
         * The total number of nodes in a vehicle network that represent attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalattributes
         */
        readonly totalAttributes?: number;
        /**
         * The total number of nodes in a vehicle network that represent branches.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalbranches
         */
        readonly totalBranches?: number;
        /**
         * The total number of nodes in a vehicle network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalnodes
         */
        readonly totalNodes?: number;
        /**
         * The total number of nodes in a vehicle network that represent sensors.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-nodecounts.html#cfn-iotfleetwise-signalcatalog-nodecounts-totalsensors
         */
        readonly totalSensors?: number;
    }
}

/**
 * Determine whether the given properties match those of a `NodeCountsProperty`
 *
 * @param properties - the TypeScript properties of a `NodeCountsProperty`
 *
 * @returns the result of the validation.
 */
function CfnSignalCatalog_NodeCountsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('totalActuators', cdk.validateNumber)(properties.totalActuators));
    errors.collect(cdk.propertyValidator('totalAttributes', cdk.validateNumber)(properties.totalAttributes));
    errors.collect(cdk.propertyValidator('totalBranches', cdk.validateNumber)(properties.totalBranches));
    errors.collect(cdk.propertyValidator('totalNodes', cdk.validateNumber)(properties.totalNodes));
    errors.collect(cdk.propertyValidator('totalSensors', cdk.validateNumber)(properties.totalSensors));
    return errors.wrap('supplied properties not correct for "NodeCountsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.NodeCounts` resource
 *
 * @param properties - the TypeScript properties of a `NodeCountsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.NodeCounts` resource.
 */
// @ts-ignore TS6133
function cfnSignalCatalogNodeCountsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSignalCatalog_NodeCountsPropertyValidator(properties).assertSuccess();
    return {
        TotalActuators: cdk.numberToCloudFormation(properties.totalActuators),
        TotalAttributes: cdk.numberToCloudFormation(properties.totalAttributes),
        TotalBranches: cdk.numberToCloudFormation(properties.totalBranches),
        TotalNodes: cdk.numberToCloudFormation(properties.totalNodes),
        TotalSensors: cdk.numberToCloudFormation(properties.totalSensors),
    };
}

// @ts-ignore TS6133
function CfnSignalCatalogNodeCountsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.NodeCountsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.NodeCountsProperty>();
    ret.addPropertyResult('totalActuators', 'TotalActuators', properties.TotalActuators != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalActuators) : undefined);
    ret.addPropertyResult('totalAttributes', 'TotalAttributes', properties.TotalAttributes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalAttributes) : undefined);
    ret.addPropertyResult('totalBranches', 'TotalBranches', properties.TotalBranches != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalBranches) : undefined);
    ret.addPropertyResult('totalNodes', 'TotalNodes', properties.TotalNodes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalNodes) : undefined);
    ret.addPropertyResult('totalSensors', 'TotalSensors', properties.TotalSensors != null ? cfn_parse.FromCloudFormation.getNumber(properties.TotalSensors) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSignalCatalog {
    /**
     * An input component that reports the environmental condition of a vehicle.
     *
     * > You can collect data about fluid levels, temperatures, vibrations, or battery voltage from sensors.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html
     */
    export interface SensorProperty {
        /**
         * A list of possible values a sensor can take.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-allowedvalues
         */
        readonly allowedValues?: string[];
        /**
         * The specified data type of the sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-datatype
         */
        readonly dataType: string;
        /**
         * A brief description of a sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-description
         */
        readonly description?: string;
        /**
         * The fully qualified name of the sensor. For example, the fully qualified name of a sensor might be `Vehicle.Body.Engine.Battery` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-fullyqualifiedname
         */
        readonly fullyQualifiedName: string;
        /**
         * The specified possible maximum value of the sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-max
         */
        readonly max?: number;
        /**
         * The specified possible minimum value of the sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-min
         */
        readonly min?: number;
        /**
         * The scientific unit of measurement for data collected by the sensor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotfleetwise-signalcatalog-sensor.html#cfn-iotfleetwise-signalcatalog-sensor-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SensorProperty`
 *
 * @param properties - the TypeScript properties of a `SensorProperty`
 *
 * @returns the result of the validation.
 */
function CfnSignalCatalog_SensorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedValues', cdk.listValidator(cdk.validateString))(properties.allowedValues));
    errors.collect(cdk.propertyValidator('dataType', cdk.requiredValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.requiredValidator)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('fullyQualifiedName', cdk.validateString)(properties.fullyQualifiedName));
    errors.collect(cdk.propertyValidator('max', cdk.validateNumber)(properties.max));
    errors.collect(cdk.propertyValidator('min', cdk.validateNumber)(properties.min));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "SensorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Sensor` resource
 *
 * @param properties - the TypeScript properties of a `SensorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::SignalCatalog.Sensor` resource.
 */
// @ts-ignore TS6133
function cfnSignalCatalogSensorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSignalCatalog_SensorPropertyValidator(properties).assertSuccess();
    return {
        AllowedValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedValues),
        DataType: cdk.stringToCloudFormation(properties.dataType),
        Description: cdk.stringToCloudFormation(properties.description),
        FullyQualifiedName: cdk.stringToCloudFormation(properties.fullyQualifiedName),
        Max: cdk.numberToCloudFormation(properties.max),
        Min: cdk.numberToCloudFormation(properties.min),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnSignalCatalogSensorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalCatalog.SensorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalCatalog.SensorProperty>();
    ret.addPropertyResult('allowedValues', 'AllowedValues', properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowedValues) : undefined);
    ret.addPropertyResult('dataType', 'DataType', cfn_parse.FromCloudFormation.getString(properties.DataType));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('fullyQualifiedName', 'FullyQualifiedName', cfn_parse.FromCloudFormation.getString(properties.FullyQualifiedName));
    ret.addPropertyResult('max', 'Max', properties.Max != null ? cfn_parse.FromCloudFormation.getNumber(properties.Max) : undefined);
    ret.addPropertyResult('min', 'Min', properties.Min != null ? cfn_parse.FromCloudFormation.getNumber(properties.Min) : undefined);
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnVehicle`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html
 */
export interface CfnVehicleProps {

    /**
     * The Amazon Resource Name (ARN) of a decoder manifest associated with the vehicle to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-decodermanifestarn
     */
    readonly decoderManifestArn: string;

    /**
     * The ARN of the vehicle model (model manifest) to create the vehicle from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-modelmanifestarn
     */
    readonly modelManifestArn: string;

    /**
     * `AWS::IoTFleetWise::Vehicle.Name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-name
     */
    readonly name: string;

    /**
     * An option to create a new AWS IoT thing when creating a vehicle, or to validate an existing thing as a vehicle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-associationbehavior
     */
    readonly associationBehavior?: string;

    /**
     * Static information about a vehicle in a key-value pair. For example: `"engine Type"` : `"v6"`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-attributes
     */
    readonly attributes?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * Metadata which can be used to manage the vehicle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnVehicleProps`
 *
 * @param properties - the TypeScript properties of a `CfnVehicleProps`
 *
 * @returns the result of the validation.
 */
function CfnVehiclePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('associationBehavior', cdk.validateString)(properties.associationBehavior));
    errors.collect(cdk.propertyValidator('attributes', cdk.hashValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('decoderManifestArn', cdk.requiredValidator)(properties.decoderManifestArn));
    errors.collect(cdk.propertyValidator('decoderManifestArn', cdk.validateString)(properties.decoderManifestArn));
    errors.collect(cdk.propertyValidator('modelManifestArn', cdk.requiredValidator)(properties.modelManifestArn));
    errors.collect(cdk.propertyValidator('modelManifestArn', cdk.validateString)(properties.modelManifestArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnVehicleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTFleetWise::Vehicle` resource
 *
 * @param properties - the TypeScript properties of a `CfnVehicleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTFleetWise::Vehicle` resource.
 */
// @ts-ignore TS6133
function cfnVehiclePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVehiclePropsValidator(properties).assertSuccess();
    return {
        DecoderManifestArn: cdk.stringToCloudFormation(properties.decoderManifestArn),
        ModelManifestArn: cdk.stringToCloudFormation(properties.modelManifestArn),
        Name: cdk.stringToCloudFormation(properties.name),
        AssociationBehavior: cdk.stringToCloudFormation(properties.associationBehavior),
        Attributes: cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnVehiclePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVehicleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVehicleProps>();
    ret.addPropertyResult('decoderManifestArn', 'DecoderManifestArn', cfn_parse.FromCloudFormation.getString(properties.DecoderManifestArn));
    ret.addPropertyResult('modelManifestArn', 'ModelManifestArn', cfn_parse.FromCloudFormation.getString(properties.ModelManifestArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('associationBehavior', 'AssociationBehavior', properties.AssociationBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.AssociationBehavior) : undefined);
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTFleetWise::Vehicle`
 *
 * Creates a vehicle, which is an instance of a vehicle model (model manifest). Vehicles created from the same vehicle model consist of the same signals inherited from the vehicle model.
 *
 * > If you have an existing AWS IoT Thing, you can use AWS IoT FleetWise to create a vehicle and collect data from your thing.
 *
 * For more information, see [Create a vehicle (CLI)](https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/create-vehicle-cli.html) in the *AWS IoT FleetWise Developer Guide* .
 *
 * @cloudformationResource AWS::IoTFleetWise::Vehicle
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html
 */
export class CfnVehicle extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetWise::Vehicle";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVehicle {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVehiclePropsFromCloudFormation(resourceProperties);
        const ret = new CfnVehicle(scope, id, propsResult.value);
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
     *
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     *
     * @cloudformationAttribute LastModificationTime
     */
    public readonly attrLastModificationTime: string;

    /**
     * The Amazon Resource Name (ARN) of a decoder manifest associated with the vehicle to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-decodermanifestarn
     */
    public decoderManifestArn: string;

    /**
     * The ARN of the vehicle model (model manifest) to create the vehicle from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-modelmanifestarn
     */
    public modelManifestArn: string;

    /**
     * `AWS::IoTFleetWise::Vehicle.Name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-name
     */
    public name: string;

    /**
     * An option to create a new AWS IoT thing when creating a vehicle, or to validate an existing thing as a vehicle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-associationbehavior
     */
    public associationBehavior: string | undefined;

    /**
     * Static information about a vehicle in a key-value pair. For example: `"engine Type"` : `"v6"`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-attributes
     */
    public attributes: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * Metadata which can be used to manage the vehicle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleetwise-vehicle.html#cfn-iotfleetwise-vehicle-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTFleetWise::Vehicle`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVehicleProps) {
        super(scope, id, { type: CfnVehicle.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'decoderManifestArn', this);
        cdk.requireProperty(props, 'modelManifestArn', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrLastModificationTime = cdk.Token.asString(this.getAtt('LastModificationTime', cdk.ResolutionTypeHint.STRING));

        this.decoderManifestArn = props.decoderManifestArn;
        this.modelManifestArn = props.modelManifestArn;
        this.name = props.name;
        this.associationBehavior = props.associationBehavior;
        this.attributes = props.attributes;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTFleetWise::Vehicle", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVehicle.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            decoderManifestArn: this.decoderManifestArn,
            modelManifestArn: this.modelManifestArn,
            name: this.name,
            associationBehavior: this.associationBehavior,
            attributes: this.attributes,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVehiclePropsToCloudFormation(props);
    }
}
