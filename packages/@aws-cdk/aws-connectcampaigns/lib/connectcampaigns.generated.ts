// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:34.892Z","fingerprint":"i1ppW5tWQ+MS6ONJ0CW3ZCbezT0mhnpWxXXB1IsKvMU="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html
 */
export interface CfnCampaignProps {

    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-connectinstancearn
     */
    readonly connectInstanceArn: string;

    /**
     * Contains information about the dialer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-dialerconfig
     */
    readonly dialerConfig: CfnCampaign.DialerConfigProperty | cdk.IResolvable;

    /**
     * The name of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-name
     */
    readonly name: string;

    /**
     * Contains information about the outbound call configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-outboundcallconfig
     */
    readonly outboundCallConfig: CfnCampaign.OutboundCallConfigProperty | cdk.IResolvable;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-tags
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
    errors.collect(cdk.propertyValidator('connectInstanceArn', cdk.requiredValidator)(properties.connectInstanceArn));
    errors.collect(cdk.propertyValidator('connectInstanceArn', cdk.validateString)(properties.connectInstanceArn));
    errors.collect(cdk.propertyValidator('dialerConfig', cdk.requiredValidator)(properties.dialerConfig));
    errors.collect(cdk.propertyValidator('dialerConfig', CfnCampaign_DialerConfigPropertyValidator)(properties.dialerConfig));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('outboundCallConfig', cdk.requiredValidator)(properties.outboundCallConfig));
    errors.collect(cdk.propertyValidator('outboundCallConfig', CfnCampaign_OutboundCallConfigPropertyValidator)(properties.outboundCallConfig));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCampaignProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign` resource
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign` resource.
 */
// @ts-ignore TS6133
function cfnCampaignPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaignPropsValidator(properties).assertSuccess();
    return {
        ConnectInstanceArn: cdk.stringToCloudFormation(properties.connectInstanceArn),
        DialerConfig: cfnCampaignDialerConfigPropertyToCloudFormation(properties.dialerConfig),
        Name: cdk.stringToCloudFormation(properties.name),
        OutboundCallConfig: cfnCampaignOutboundCallConfigPropertyToCloudFormation(properties.outboundCallConfig),
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
    ret.addPropertyResult('connectInstanceArn', 'ConnectInstanceArn', cfn_parse.FromCloudFormation.getString(properties.ConnectInstanceArn));
    ret.addPropertyResult('dialerConfig', 'DialerConfig', CfnCampaignDialerConfigPropertyFromCloudFormation(properties.DialerConfig));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('outboundCallConfig', 'OutboundCallConfig', CfnCampaignOutboundCallConfigPropertyFromCloudFormation(properties.OutboundCallConfig));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ConnectCampaigns::Campaign`
 *
 * Contains information about an outbound campaign.
 *
 * @cloudformationResource AWS::ConnectCampaigns::Campaign
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html
 */
export class CfnCampaign extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ConnectCampaigns::Campaign";

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
     * The Amazon Resource Name (ARN) of the high-volume outbound campaign.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-connectinstancearn
     */
    public connectInstanceArn: string;

    /**
     * Contains information about the dialer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-dialerconfig
     */
    public dialerConfig: CfnCampaign.DialerConfigProperty | cdk.IResolvable;

    /**
     * The name of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-name
     */
    public name: string;

    /**
     * Contains information about the outbound call configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-outboundcallconfig
     */
    public outboundCallConfig: CfnCampaign.OutboundCallConfigProperty | cdk.IResolvable;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ConnectCampaigns::Campaign`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCampaignProps) {
        super(scope, id, { type: CfnCampaign.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'connectInstanceArn', this);
        cdk.requireProperty(props, 'dialerConfig', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'outboundCallConfig', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.connectInstanceArn = props.connectInstanceArn;
        this.dialerConfig = props.dialerConfig;
        this.name = props.name;
        this.outboundCallConfig = props.outboundCallConfig;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ConnectCampaigns::Campaign", props.tags, { tagPropertyName: 'tags' });
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
            connectInstanceArn: this.connectInstanceArn,
            dialerConfig: this.dialerConfig,
            name: this.name,
            outboundCallConfig: this.outboundCallConfig,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCampaignPropsToCloudFormation(props);
    }
}

export namespace CfnCampaign {
    /**
     * Contains dialer configuration for an outbound campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-dialerconfig.html
     */
    export interface DialerConfigProperty {
        /**
         * The configuration of the predictive dialer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-dialerconfig.html#cfn-connectcampaigns-campaign-dialerconfig-predictivedialerconfig
         */
        readonly predictiveDialerConfig?: CfnCampaign.PredictiveDialerConfigProperty | cdk.IResolvable;
        /**
         * The configuration of the progressive dialer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-dialerconfig.html#cfn-connectcampaigns-campaign-dialerconfig-progressivedialerconfig
         */
        readonly progressiveDialerConfig?: CfnCampaign.ProgressiveDialerConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DialerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_DialerConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('predictiveDialerConfig', CfnCampaign_PredictiveDialerConfigPropertyValidator)(properties.predictiveDialerConfig));
    errors.collect(cdk.propertyValidator('progressiveDialerConfig', CfnCampaign_ProgressiveDialerConfigPropertyValidator)(properties.progressiveDialerConfig));
    return errors.wrap('supplied properties not correct for "DialerConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.DialerConfig` resource
 *
 * @param properties - the TypeScript properties of a `DialerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.DialerConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignDialerConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_DialerConfigPropertyValidator(properties).assertSuccess();
    return {
        PredictiveDialerConfig: cfnCampaignPredictiveDialerConfigPropertyToCloudFormation(properties.predictiveDialerConfig),
        ProgressiveDialerConfig: cfnCampaignProgressiveDialerConfigPropertyToCloudFormation(properties.progressiveDialerConfig),
    };
}

// @ts-ignore TS6133
function CfnCampaignDialerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.DialerConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.DialerConfigProperty>();
    ret.addPropertyResult('predictiveDialerConfig', 'PredictiveDialerConfig', properties.PredictiveDialerConfig != null ? CfnCampaignPredictiveDialerConfigPropertyFromCloudFormation(properties.PredictiveDialerConfig) : undefined);
    ret.addPropertyResult('progressiveDialerConfig', 'ProgressiveDialerConfig', properties.ProgressiveDialerConfig != null ? CfnCampaignProgressiveDialerConfigPropertyFromCloudFormation(properties.ProgressiveDialerConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Contains outbound call configuration for an outbound campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html
     */
    export interface OutboundCallConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html#cfn-connectcampaigns-campaign-outboundcallconfig-connectcontactflowarn
         */
        readonly connectContactFlowArn: string;
        /**
         * The Amazon Resource Name (ARN) of the queue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html#cfn-connectcampaigns-campaign-outboundcallconfig-connectqueuearn
         */
        readonly connectQueueArn: string;
        /**
         * The phone number associated with the outbound call. This is the caller ID that is displayed to customers when an agent calls them.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html#cfn-connectcampaigns-campaign-outboundcallconfig-connectsourcephonenumber
         */
        readonly connectSourcePhoneNumber?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutboundCallConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OutboundCallConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_OutboundCallConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectContactFlowArn', cdk.requiredValidator)(properties.connectContactFlowArn));
    errors.collect(cdk.propertyValidator('connectContactFlowArn', cdk.validateString)(properties.connectContactFlowArn));
    errors.collect(cdk.propertyValidator('connectQueueArn', cdk.requiredValidator)(properties.connectQueueArn));
    errors.collect(cdk.propertyValidator('connectQueueArn', cdk.validateString)(properties.connectQueueArn));
    errors.collect(cdk.propertyValidator('connectSourcePhoneNumber', cdk.validateString)(properties.connectSourcePhoneNumber));
    return errors.wrap('supplied properties not correct for "OutboundCallConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.OutboundCallConfig` resource
 *
 * @param properties - the TypeScript properties of a `OutboundCallConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.OutboundCallConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignOutboundCallConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_OutboundCallConfigPropertyValidator(properties).assertSuccess();
    return {
        ConnectContactFlowArn: cdk.stringToCloudFormation(properties.connectContactFlowArn),
        ConnectQueueArn: cdk.stringToCloudFormation(properties.connectQueueArn),
        ConnectSourcePhoneNumber: cdk.stringToCloudFormation(properties.connectSourcePhoneNumber),
    };
}

// @ts-ignore TS6133
function CfnCampaignOutboundCallConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.OutboundCallConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.OutboundCallConfigProperty>();
    ret.addPropertyResult('connectContactFlowArn', 'ConnectContactFlowArn', cfn_parse.FromCloudFormation.getString(properties.ConnectContactFlowArn));
    ret.addPropertyResult('connectQueueArn', 'ConnectQueueArn', cfn_parse.FromCloudFormation.getString(properties.ConnectQueueArn));
    ret.addPropertyResult('connectSourcePhoneNumber', 'ConnectSourcePhoneNumber', properties.ConnectSourcePhoneNumber != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectSourcePhoneNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Contains predictive dialer configuration for an outbound campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-predictivedialerconfig.html
     */
    export interface PredictiveDialerConfigProperty {
        /**
         * Bandwidth allocation for the predictive dialer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-predictivedialerconfig.html#cfn-connectcampaigns-campaign-predictivedialerconfig-bandwidthallocation
         */
        readonly bandwidthAllocation: number;
    }
}

/**
 * Determine whether the given properties match those of a `PredictiveDialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveDialerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_PredictiveDialerConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bandwidthAllocation', cdk.requiredValidator)(properties.bandwidthAllocation));
    errors.collect(cdk.propertyValidator('bandwidthAllocation', cdk.validateNumber)(properties.bandwidthAllocation));
    return errors.wrap('supplied properties not correct for "PredictiveDialerConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.PredictiveDialerConfig` resource
 *
 * @param properties - the TypeScript properties of a `PredictiveDialerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.PredictiveDialerConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignPredictiveDialerConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_PredictiveDialerConfigPropertyValidator(properties).assertSuccess();
    return {
        BandwidthAllocation: cdk.numberToCloudFormation(properties.bandwidthAllocation),
    };
}

// @ts-ignore TS6133
function CfnCampaignPredictiveDialerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.PredictiveDialerConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.PredictiveDialerConfigProperty>();
    ret.addPropertyResult('bandwidthAllocation', 'BandwidthAllocation', cfn_parse.FromCloudFormation.getNumber(properties.BandwidthAllocation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Contains progressive dialer configuration for an outbound campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-progressivedialerconfig.html
     */
    export interface ProgressiveDialerConfigProperty {
        /**
         * Bandwidth allocation for the progressive dialer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-progressivedialerconfig.html#cfn-connectcampaigns-campaign-progressivedialerconfig-bandwidthallocation
         */
        readonly bandwidthAllocation: number;
    }
}

/**
 * Determine whether the given properties match those of a `ProgressiveDialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ProgressiveDialerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_ProgressiveDialerConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bandwidthAllocation', cdk.requiredValidator)(properties.bandwidthAllocation));
    errors.collect(cdk.propertyValidator('bandwidthAllocation', cdk.validateNumber)(properties.bandwidthAllocation));
    return errors.wrap('supplied properties not correct for "ProgressiveDialerConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.ProgressiveDialerConfig` resource
 *
 * @param properties - the TypeScript properties of a `ProgressiveDialerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.ProgressiveDialerConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignProgressiveDialerConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_ProgressiveDialerConfigPropertyValidator(properties).assertSuccess();
    return {
        BandwidthAllocation: cdk.numberToCloudFormation(properties.bandwidthAllocation),
    };
}

// @ts-ignore TS6133
function CfnCampaignProgressiveDialerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.ProgressiveDialerConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.ProgressiveDialerConfigProperty>();
    ret.addPropertyResult('bandwidthAllocation', 'BandwidthAllocation', cfn_parse.FromCloudFormation.getNumber(properties.BandwidthAllocation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
